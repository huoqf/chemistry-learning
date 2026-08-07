/**
 * src/features/gas-chain/physics/layoutEngine.ts
 * 气体制备/净化/尾气处理装置链 — 装置链物理布局与贝塞尔导管路由 Engine
 *
 * 设计原则（单一事实来源）：
 * 1. 此引擎是所有器材坐标的唯一来源，输出 apparatusLayouts[]
 * 2. GasChainCenterView 直接用 apparatusLayouts 中的 {x,y,width,height} 渲染组件
 * 3. 所有 pathD 使用绝对坐标，无需任何 <g transform> 包裹偏移
 * 4. 端口坐标全部来自各组件的 getXxxPorts() 函数，坐标与渲染 100% 同步
 */

import type { PhysicalChainSolveResult, TubingRouteSegment, ApparatusLayout } from './types'
import { getGasWashingBottlePorts } from '@/components/Chemistry/GasWashingBottleApparatus'
import { getDryingTubePorts } from '@/components/Chemistry/DryingTubeApparatus'
import { getGasJarPorts } from '@/components/Chemistry/GasJarApparatus'
import { getAntiSiphonFunnelPorts } from '@/components/Chemistry/AntiSiphonFunnelApparatus'
import { getSolidHeatingGeneratorPorts } from '@/components/Chemistry/SolidHeatingGeneratorApparatus'
import { getLiquidHeatingGeneratorPorts } from '@/components/Chemistry/LiquidHeatingGeneratorApparatus'
import { getNoHeatGeneratorPorts } from '@/components/Chemistry/NoHeatGeneratorApparatus'
import { getKippApparatusPorts } from '@/components/Chemistry/KippApparatus'

export interface LayoutEngineInput {
  generator: string
  washReagent: string
  dryer: string
  collection: string
  tailGas: string
  washReverse: boolean
  baseY?: number
}

/**
 * 生成绝对坐标的平滑贝塞尔圆角 SVG Path
 * 注意：start/end 均为绝对坐标，返回的 pathD 也是绝对坐标
 * 无需任何 <g transform> 包裹
 */
function createAbsoluteSmoothTubingPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
  tubeType: 'bridge' | 'low-bridge' | 'horizontal-socket',
  isSideArm = false
): string {
  const dx = end.x - start.x
  const dy = end.y - start.y

  if (tubeType === 'bridge') {
    // 高位高架避障管：比两端口的最高者再上移 30px，动态避开各类发生装置
    const topY = Math.min(start.y, end.y) - 30
    const radius = 10
    const dir = dx > 0 ? 1 : -1

    if (isSideArm) {
      // 具支烧瓶侧管专用：起点 (start.y) 本身已高于洗气瓶进气口 (end.y)
      // 导管水平向右延伸至洗气瓶进气口上方，弧形转向 90 度直接向下直插接入
      const radius = 10
      if (start.y <= end.y) {
        return [
          `M ${start.x} ${start.y}`,
          `L ${end.x - radius} ${start.y}`,
          `Q ${end.x} ${start.y} ${end.x} ${start.y + radius}`,
          `L ${end.x} ${end.y}`,
        ].join(' ')
      }
    }

    return [
      `M ${start.x} ${start.y}`,
      `L ${start.x} ${topY + radius}`,
      `Q ${start.x} ${topY} ${start.x + dir * radius} ${topY}`,
      `L ${end.x - dir * radius} ${topY}`,
      `Q ${end.x} ${topY} ${end.x} ${topY + radius}`,
      `L ${end.x} ${end.y}`,
    ].join(' ')
  } else if (tubeType === 'low-bridge') {
    // 瓶间低空拱桥管（高出起点/终点中最高者 25px）
    const archY = Math.min(start.y, end.y) - 25
    const radius = 10
    const dir = dx > 0 ? 1 : -1
    return [
      `M ${start.x} ${start.y}`,
      `L ${start.x} ${archY + radius}`,
      `Q ${start.x} ${archY} ${start.x + dir * radius} ${archY}`,
      `L ${end.x - dir * radius} ${archY}`,
      `Q ${end.x} ${archY} ${end.x} ${archY + radius}`,
      `L ${end.x} ${end.y}`,
    ].join(' ')
  } else {
    // 横向水平插口管（水平后转垂直插入）
    const radius = 12
    const dir = dx > 0 ? 1 : -1
    return [
      `M ${start.x} ${start.y}`,
      `L ${start.x} ${end.y - radius * Math.sign(dy)}`,
      `Q ${start.x} ${end.y} ${start.x + dir * radius} ${end.y}`,
      `L ${end.x} ${end.y}`,
    ].join(' ')
  }
}

export function solvePhysicalChainLayout(
  input: LayoutEngineInput
): PhysicalChainSolveResult {
  const { generator, washReagent, dryer, collection, tailGas, washReverse } = input
  const baseY = input.baseY ?? 480

  const hasWash = washReagent !== 'none'
  const hasDryer = dryer !== 'none'
  const hasCollection = collection !== 'none'

  // ─── 1. 动态自适应 SlotX（基于活跃装置数均分） ───────────────────────────
  const activeSlots: number[] = [0]
  if (hasWash) activeSlots.push(1)
  if (hasDryer) activeSlots.push(2)
  if (hasCollection) activeSlots.push(3)
  activeSlots.push(4) // 尾气始终存在

  const numActive = activeSlots.length
  const startX = 100
  const endX = 740
  const stepX = numActive > 1 ? (endX - startX) / (numActive - 1) : 0

  const slotX = [100, 260, 420, 580, 740]
  activeSlots.forEach((nodeIdx, idx) => {
    slotX[nodeIdx] = startX + idx * stepX
  })

  // ─── 2. 计算各器材的精确渲染坐标（单一事实来源）────────────────────────────
  const apparatusLayouts: ApparatusLayout[] = []

  // ── Slot 0: 发生装置 ────────────────────────────────────────────────────────
  let generatorLayout: ApparatusLayout
  if (generator === 'flask-heat') {
    // LiquidHeatingGeneratorApparatus: x=slotX[0], y=baseY（基准底线，组件内部自算偏移）
    const renderX = slotX[0]
    const renderY = baseY
    const ports = getLiquidHeatingGeneratorPorts(renderX, renderY)
    generatorLayout = {
      id: 'generator',
      x: renderX,
      y: renderY,
      width: 120,
      height: 350,
      inletPort: null,
      outletPort: ports.sideArmPort,
    }
  } else if (generator === 'testtube-heat') {
    // SolidHeatingGeneratorApparatus: x=slotX[0]-60, y=baseY
    const renderX = slotX[0] - 60
    const renderY = baseY
    const ports = getSolidHeatingGeneratorPorts(renderX, renderY)
    generatorLayout = {
      id: 'generator',
      x: renderX,
      y: renderY,
      width: 180,
      height: 250,
      inletPort: null,
      outletPort: ports.outletPort,
    }
  } else if (generator === 'flask-noheat') {
    // NoHeatGeneratorApparatus: x=slotX[0], y=baseY
    const renderX = slotX[0]
    const renderY = baseY
    const ports = getNoHeatGeneratorPorts(renderX, renderY)
    generatorLayout = {
      id: 'generator',
      x: renderX,
      y: renderY,
      width: 90,
      height: 260,
      inletPort: null,
      outletPort: ports.outletPort,
    }
  } else {
    // KippApparatus: x=slotX[0]-45, y=baseY-220
    const renderX = slotX[0] - 45
    const renderY = baseY - 220
    const ports = getKippApparatusPorts(renderX, renderY, 90)
    generatorLayout = {
      id: 'generator',
      x: renderX,
      y: renderY,
      width: 90,
      height: 220,
      inletPort: null,
      outletPort: ports.outletPort,
    }
  }
  apparatusLayouts.push(generatorLayout)

  // ── Slot 1: 洗气瓶 ─────────────────────────────────────────────────────────
  const WASH_W = 90
  const WASH_H = 140
  // 洗气瓶渲染坐标：左上角
  const washX = slotX[1] - WASH_W / 2
  const washY = baseY - WASH_H
  let washLayout: ApparatusLayout | null = null
  if (hasWash) {
    const ports = getGasWashingBottlePorts(washX, washY, WASH_W, WASH_H, washReverse)
    washLayout = {
      id: 'wash',
      x: washX,
      y: washY,
      width: WASH_W,
      height: WASH_H,
      inletPort: ports.inletPort,
      outletPort: ports.outletPort,
    }
    apparatusLayouts.push(washLayout)
  }

  // ── Slot 2: 干燥装置 ───────────────────────────────────────────────────────
  const DRYER_W = 110
  const DRYER_H = 50
  // 浓硫酸洗气瓶形式
  const DRYER_BOTTLE_W = 90
  const DRYER_BOTTLE_H = 140
  let dryerLayout: ApparatusLayout | null = null
  if (hasDryer) {
    if (dryer === 'conc-h2so4') {
      const renderX = slotX[2] - DRYER_BOTTLE_W / 2
      const renderY = baseY - DRYER_BOTTLE_H
      const ports = getGasWashingBottlePorts(renderX, renderY, DRYER_BOTTLE_W, DRYER_BOTTLE_H)
      dryerLayout = {
        id: 'dryer',
        x: renderX,
        y: renderY,
        width: DRYER_BOTTLE_W,
        height: DRYER_BOTTLE_H,
        inletPort: ports.inletPort,
        outletPort: ports.outletPort,
      }
    } else {
      // cacl2 (U型管) 或 soda-lime (球形干燥管)
      const renderX = slotX[2] - DRYER_W / 2
      const renderY = baseY - 195
      const variant = dryer === 'cacl2' ? 'U-shape' : 'spherical'
      const ports = getDryingTubePorts(renderX, renderY, DRYER_W, DRYER_H, variant)
      dryerLayout = {
        id: 'dryer',
        x: renderX,
        y: renderY,
        width: DRYER_W,
        height: DRYER_H,
        inletPort: ports.inletPort,
        outletPort: ports.outletPort,
      }
    }
    apparatusLayouts.push(dryerLayout)
  }

  // ── Slot 3: 收集装置 ───────────────────────────────────────────────────────
  const JAR_W = 70
  const JAR_H = 110
  let collectionLayout: ApparatusLayout | null = null
  if (hasCollection) {
    if (collection === 'water-displacement') {
      // 排水集气：水槽 + 倒扣瓶，用固定坐标
      const renderX = slotX[3] - 75
      const renderY = baseY - 150
      // 排水集气进气口：水槽左上角弯管入口（与发生装置导管对接）
      // 出气口：倒扣瓶顶部（通大气，无需后级连接）
      collectionLayout = {
        id: 'collection',
        x: renderX,
        y: renderY,
        width: 150,
        height: 150,
        inletPort: { x: renderX + 25, y: renderY + 10 },
        outletPort: null,
      }
    } else {
      const renderX = slotX[3] - JAR_W / 2
      const renderY = baseY - JAR_H
      const ports = getGasJarPorts(renderX, renderY, JAR_W)
      // tubeMode: downward-air => 左短右长(short-in-long-out) => 气体从右下方进入
      // 其他(upward-air) => 左长右短(long-in-short-out) => 气体从左上方进入
      const inletPort = collection === 'downward-air'
        ? ports.topStopperLeft   // 向下排空气: 短管进(左)
        : ports.topStopperLeft   // 向上排空气/默认: 长管进(左)
      const outletPort = ports.topStopperRight
      collectionLayout = {
        id: 'collection',
        x: renderX,
        y: renderY,
        width: JAR_W,
        height: JAR_H,
        inletPort,
        outletPort,
      }
    }
    apparatusLayouts.push(collectionLayout)
  }

  // ── Slot 4: 尾气处理 ───────────────────────────────────────────────────────
  let tailgasLayout: ApparatusLayout
  if (tailGas === 'inverted-funnel') {
    const renderX = slotX[4] - 40
    const renderY = baseY - 98
    const ports = getAntiSiphonFunnelPorts(renderX, renderY, 80, 100)
    tailgasLayout = {
      id: 'tailgas',
      x: renderX,
      y: renderY,
      width: 80,
      height: 100,
      inletPort: ports.topConnectPort,
      outletPort: null,
    }
  } else if (tailGas === 'safety-bottle') {
    // 锥形瓶安全瓶：进气口在顶部左侧
    const renderX = slotX[4] - 65
    const renderY = baseY - 165
    tailgasLayout = {
      id: 'tailgas',
      x: renderX,
      y: renderY,
      width: 50,
      height: 75,
      inletPort: { x: renderX + 15, y: renderY },
      outletPort: null,
    }
  } else if (tailGas === 'combustion') {
    // 点燃法：导管口
    const renderX = slotX[4] - 30
    const renderY = baseY - 120
    tailgasLayout = {
      id: 'tailgas',
      x: renderX,
      y: renderY,
      width: 60,
      height: 120,
      inletPort: { x: renderX, y: renderY },
      outletPort: null,
    }
  } else if (tailGas === 'balloon') {
    // 收集气球：导管口
    const renderX = slotX[4] - 20
    const renderY = baseY - 140
    tailgasLayout = {
      id: 'tailgas',
      x: renderX,
      y: renderY,
      width: 70,
      height: 140,
      inletPort: { x: renderX, y: renderY + 20 },
      outletPort: null,
    }
  } else {
    // direct-pipe / NaOH 烧杯：直插进气（导管深入烧杯 NaOH 溶液液面下方 65px）
    const renderX = slotX[4] - 45
    const renderY = baseY - 100
    tailgasLayout = {
      id: 'tailgas',
      x: renderX,
      y: renderY,
      width: 90,
      height: 100,
      inletPort: { x: slotX[4], y: renderY + 65 },
      outletPort: null,
    }
  }
  apparatusLayouts.push(tailgasLayout)

  // ─── 3. 求解贝塞尔拓扑导管路由（绝对坐标）─────────────────────────────────
  const routes: TubingRouteSegment[] = []

  // 收集所有连接链：[上游 outletPort] -> [下游 inletPort]
  type RouteNode = { slotIdx: number; layout: ApparatusLayout }
  const chain: RouteNode[] = []
  chain.push({ slotIdx: 0, layout: generatorLayout })
  if (washLayout) chain.push({ slotIdx: 1, layout: washLayout })
  if (dryerLayout) chain.push({ slotIdx: 2, layout: dryerLayout })
  if (collectionLayout) chain.push({ slotIdx: 3, layout: collectionLayout })
  chain.push({ slotIdx: 4, layout: tailgasLayout })

  for (let i = 0; i < chain.length - 1; i++) {
    const from = chain[i]
    const to = chain[i + 1]
    const fromOutlet = from.layout.outletPort
    const toInlet = to.layout.inletPort

    // 排水集气无 outletPort，跳过尾气连线
    if (!fromOutlet || !toInlet) continue

    // 选择管路类型
    let tubeType: 'bridge' | 'low-bridge' | 'horizontal-socket'
    if (i === 0) {
      // 发生装置 -> 第一个后级：高架桥管（绕过铁架台/分液漏斗）
      tubeType = 'bridge'
    } else if (
      to.layout.id === 'dryer' &&
      (dryer === 'cacl2' || dryer === 'soda-lime')
    ) {
      // 干燥管水平插入
      tubeType = 'horizontal-socket'
    } else {
      tubeType = 'low-bridge'
    }

    const isSideArm = from.slotIdx === 0 && generator === 'flask-heat'
    const pathD = createAbsoluteSmoothTubingPath(fromOutlet, toInlet, tubeType, isSideArm)
    routes.push({
      id: `route-${from.slotIdx}-${to.slotIdx}`,
      fromSlot: from.slotIdx,
      toSlot: to.slotIdx,
      startPoint: fromOutlet,
      endPoint: toInlet,
      tubeType,
      pathD,
    })
  }

  return {
    baseY,
    slotX,
    apparatuses: [],
    apparatusLayouts,
    routes,
  }
}
