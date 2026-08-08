/**
 * src/features/gas-chain/physics/layoutEngine.ts
 * 气体制备/净化/尾气处理装置链 — 装置链物理布局与贝塞尔导管路由 Engine
 *
 * 设计原则（单一事实来源 SSOT）：
 * 1. 此引擎是所有器材坐标与导管端口的唯一真相来源，输出 apparatusLayouts[] 与 routes[]
 * 2. GasChainCenterView 直接使用 apparatusLayouts 中的 {x,y,width,height} 渲染组件
 * 3. 所有 pathD 使用绝对 Design Space 坐标，视图侧无需任何 <g transform> 包裹偏移
 * 4. 端口坐标全部由各组件 getXxxPorts() 生成，渲染与连线 100% 同步
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
 * 智能识别 start/end 端口朝向 (direction: 'right' | 'up' | 'down' | 'left')
 * 彻底消除无脑向上冲高造成的额外拐弯与重叠错位
 */
function createAbsoluteSmoothTubingPath(
  start: { x: number; y: number; direction?: 'up' | 'down' | 'left' | 'right' },
  end: { x: number; y: number; direction?: 'up' | 'down' | 'left' | 'right' },
  tubeType: 'bridge' | 'low-bridge' | 'horizontal-socket',
  isSideArm = false,
  customTopY?: number
): string {
  const dx = end.x - start.x
  const dy = end.y - start.y
  // 高保真硬质玻璃弯头：90° 标准折角，小圆角半径 5px
  const radius = 5

  // 1. 起点朝向为 right (如倾斜试管 L 导出管或具支烧瓶侧管)
  if (start.direction === 'right' || isSideArm) {
    if (end.direction === 'left' || tubeType === 'horizontal-socket') {
      // 导管直插入左侧插口 (如干燥管)
      const targetY = end.y
      if (Math.abs(start.y - targetY) < 8) {
        return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
      }
      if (Math.abs(start.y - targetY) < 20) {
        const midX = (start.x + end.x) / 2
        return [
          `M ${start.x} ${start.y}`,
          `C ${midX} ${start.y} ${midX} ${end.y} ${end.x} ${end.y}`,
        ].join(' ')
      }
      return [
        `M ${start.x} ${start.y}`,
        `L ${start.x + (dx - radius * 2)} ${start.y}`,
        `Q ${start.x + dx - radius} ${start.y} ${start.x + dx - radius} ${start.y + (dy > 0 ? radius : -radius)}`,
        `L ${start.x + dx - radius} ${end.y - (dy > 0 ? radius : -radius)}`,
        `Q ${start.x + dx - radius} ${end.y} ${end.x} ${end.y}`,
      ].join(' ')
    }

    // 出口朝右 -> 入口朝上 (进入洗气瓶/干燥瓶/集气瓶/尾气)
    if (start.y <= end.y + 10) {
      return [
        `M ${start.x} ${start.y}`,
        `L ${end.x - radius} ${start.y}`,
        `Q ${end.x} ${start.y} ${end.x} ${start.y + radius}`,
        `L ${end.x} ${end.y}`,
      ].join(' ')
    } else {
      const topY = customTopY ?? (Math.min(start.y, end.y) - 20)
      return [
        `M ${start.x} ${start.y}`,
        `L ${start.x + 20} ${start.y}`,
        `Q ${start.x + 35} ${start.y} ${start.x + 35} ${start.y - radius}`,
        `L ${start.x + 35} ${topY + radius}`,
        `Q ${start.x + 35} ${topY} ${start.x + 35 + radius} ${topY}`,
        `L ${end.x - radius} ${topY}`,
        `Q ${end.x} ${topY} ${end.x} ${topY + radius}`,
        `L ${end.x} ${end.y}`,
      ].join(' ')
    }
  }

  // 2. 终点朝向为 left (如球形干燥管左侧平插口)
  if (end.direction === 'left' || tubeType === 'horizontal-socket') {
    const targetY = end.y
    return [
      `M ${start.x} ${start.y}`,
      `L ${start.x} ${targetY + (start.y < targetY ? -radius : radius)}`,
      `Q ${start.x} ${targetY} ${start.x + radius} ${targetY}`,
      `L ${end.x} ${end.y}`,
    ].join(' ')
  }

  // 3. 默认: 起点朝上 -> 终点朝上 (经典瓶间跨越桥管)
  // 统一顶线高度为 customTopY (全链齐平水平线)，确保所有跨越导管顶部横向导管平铺在同一高度
  const topY = customTopY ?? (Math.min(start.y, end.y) - 25)
  const dir = dx > 0 ? 1 : -1

  return [
    `M ${start.x} ${start.y}`,
    `L ${start.x} ${topY + radius}`,
    `Q ${start.x} ${topY} ${start.x + dir * radius} ${topY}`,
    `L ${end.x - dir * radius} ${topY}`,
    `Q ${end.x} ${topY} ${end.x} ${topY + radius}`,
    `L ${end.x} ${end.y}`,
  ].join(' ')
}

export function solvePhysicalChainLayout(
  input: LayoutEngineInput
): PhysicalChainSolveResult {
  const { generator, washReagent, dryer, collection, tailGas, washReverse } = input
  const baseY = input.baseY ?? 480

  const hasWash = washReagent !== 'none'
  const hasDryer = dryer !== 'none'
  const hasCollection = collection !== 'none'
  const hasTailGas = tailGas !== 'none'

  // ─── 1. 动态自适应 SlotX（基于活跃装置数均分） ───────────────────────────
  const activeSlots: number[] = [0]
  if (hasWash) activeSlots.push(1)
  if (hasDryer) activeSlots.push(2)
  if (hasCollection) activeSlots.push(3)
  if (hasTailGas) activeSlots.push(4)

  const numActive = activeSlots.length
  const startX = 100
  const endX = 740
  const stepX = numActive > 1 ? (endX - startX) / (numActive - 1) : 0

  const slotX = [100, 260, 420, 580, 740]
  activeSlots.forEach((nodeIdx, idx) => {
    slotX[nodeIdx] = startX + idx * stepX
  })

  // ─── 2. 计算各器材的精确渲染坐标与端口（单一事实来源）────────────────────
  const apparatusLayouts: ApparatusLayout[] = []

  // ── Slot 0: 发生装置 ────────────────────────────────────────────────────────
  let generatorLayout: ApparatusLayout
  if (generator === 'flask-heat') {
    // LiquidHeatingGeneratorApparatus: x=slotX[0], y=baseY
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
  const DRYER_H = 60
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
      const variant = dryer === 'cacl2' ? 'U-shape' : 'spherical'
      // 球形干燥管：中心线与试管水平出气口精确对齐（出口 y = baseY - 107.6，经 applyRotate 计算）
      // 中心 y = renderY + DRYER_H * 0.5 = baseY - 107.6 → renderY = baseY - 137.6
      // U型管：保持原位（竖置，端口在顶部）
      const renderY = variant === 'spherical' ? baseY - 137.6 : baseY - 195
      // 支架竖杆高度 = 从干燥管中心下底 (baseY - 83.6) 到桌面的距离
      const holderHeight = variant === 'spherical' ? 89 : 85
      const ports = getDryingTubePorts(renderX, renderY, DRYER_W, DRYER_H, variant)
      dryerLayout = {
        id: 'dryer',
        x: renderX,
        y: renderY,
        width: DRYER_W,
        height: DRYER_H,
        inletPort: ports.inletPort,
        outletPort: ports.outletPort,
        holderHeight,
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
      // 排水集气：水槽 + 倒扣集气瓶
      const renderX = slotX[3] - 75
      const renderY = baseY - 150
      collectionLayout = {
        id: 'collection',
        x: renderX,
        y: renderY,
        width: 150,
        height: 150,
        inletPort: { x: renderX + 25, y: renderY + 10 },
        // 倒扣集气瓶右侧短出气管导出端口，平平直连接到右侧尾气处理点燃嘴
        outletPort: hasTailGas
          ? { x: renderX + 115, y: renderY + 25, direction: 'right' }
          : null,
      }
    } else {
      const renderX = slotX[3] - JAR_W / 2
      const renderY = baseY - JAR_H
      // 集气瓶端口：使用与组件一致的导管口坐标 y = renderY - 15
      // inletPort (左侧短/长管口)，outletPort (右侧长/短管口)
      const ports = getGasJarPorts(renderX, renderY, JAR_W)
      collectionLayout = {
        id: 'collection',
        x: renderX,
        y: renderY,
        width: JAR_W,
        height: JAR_H,
        inletPort: { ...ports.topStopperLeft, direction: 'up' },
        outletPort: { ...ports.topStopperRight, direction: 'up' },
      }
    }
    apparatusLayouts.push(collectionLayout)
  }

  // ── Slot 4: 尾气处理 ───────────────────────────────────────────────────────
  let tailgasLayout: ApparatusLayout
  if (tailGas === 'inverted-funnel') {
    const renderX = slotX[4] - 40
    // 修复：烧杯底部贴合桌面
    // AntiSiphonFunnelApparatus 内部：beakerTopY = h - 25 = 75, beakerH = 65
    // 烧杯底部绝对 y = renderY + 75 + 65 = renderY + 140 = baseY
    // → renderY = baseY - 140
    const renderY = baseY - 140
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
    const renderX = slotX[4] - 30
    const renderY = baseY - 125
    tailgasLayout = {
      id: 'tailgas',
      x: renderX,
      y: renderY,
      width: 60,
      height: 125,
      inletPort: { x: renderX, y: renderY, direction: 'left' },
      outletPort: null,
    }
  } else if (tailGas === 'balloon') {
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
    // direct-pipe / NaOH 烧杯：直插进气
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
  if (hasTailGas && tailgasLayout) {
    apparatusLayouts.push(tailgasLayout)
  }

  // ─── 3. 求解贝塞尔拓扑导管路由（全绝对坐标）─────────────────────────────
  const routes: TubingRouteSegment[] = []

  type RouteNode = { slotIdx: number; layout: ApparatusLayout }
  const chain: RouteNode[] = []
  chain.push({ slotIdx: 0, layout: generatorLayout })
  if (washLayout) chain.push({ slotIdx: 1, layout: washLayout })
  if (dryerLayout) chain.push({ slotIdx: 2, layout: dryerLayout })
  if (collectionLayout) chain.push({ slotIdx: 3, layout: collectionLayout })
  if (hasTailGas && tailgasLayout) chain.push({ slotIdx: 4, layout: tailgasLayout })

  // 全链统一瓶口走线基线：以瓶口/塞顶平齐高度为基准 (Y ≈ 325)，消除高空耸立与冲高下砸
  let minPortY = 999
  chain.forEach((node) => {
    if (node.layout.outletPort && node.layout.outletPort.direction !== 'right') {
      minPortY = Math.min(minPortY, node.layout.outletPort.y)
    }
    if (node.layout.inletPort && node.layout.inletPort.direction !== 'left') {
      minPortY = Math.min(minPortY, node.layout.inletPort.y)
    }
  })
  // 统一水平主主线位于橡皮塞上方 18px 处，所有跨越管在瓶口高度平直顺接，消除拱门折弯
  const globalTopY = Math.max(minPortY - 18, 320)

  for (let i = 0; i < chain.length - 1; i++) {
    const from = chain[i]
    const to = chain[i + 1]
    const fromOutlet = from.layout.outletPort
    const toInlet = to.layout.inletPort

    // 若前级无 outlet (如排水集气)，跳过连线
    if (!fromOutlet || !toInlet) continue

    // 选择管路类型
    let tubeType: 'bridge' | 'low-bridge' | 'horizontal-socket'
    if (i === 0) {
      // 发生装置 -> 第一后级：高架桥管
      tubeType = 'bridge'
    } else if (
      to.layout.id === 'dryer' &&
      dryer === 'soda-lime'
    ) {
      // 球形干燥管水平插口
      tubeType = 'horizontal-socket'
    } else {
      tubeType = 'low-bridge'
    }

    const isSideArm = from.slotIdx === 0 && generator === 'flask-heat'
    const pathD = createAbsoluteSmoothTubingPath(
      fromOutlet,
      toInlet,
      tubeType,
      isSideArm,
      globalTopY
    )
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

