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
import { getGasWashingBottlePorts } from '@/components/Chemistry/apparatusPorts'
import { getDryingTubePorts } from '@/components/Chemistry/apparatusPorts'
import { getGasJarPorts } from '@/components/Chemistry/apparatusPorts'
import { getAntiSiphonFunnelPorts } from '@/components/Chemistry/apparatusPorts'
import { getSolidHeatingGeneratorPorts } from '@/components/Chemistry/apparatusPorts'
import { getLiquidHeatingGeneratorPorts } from '@/components/Chemistry/apparatusPorts'
import { getNoHeatGeneratorPorts } from '@/components/Chemistry/apparatusPorts'
import { getKippApparatusPorts } from '@/components/Chemistry/apparatusPorts'
import { getWaterDisplacementPorts } from '@/components/Chemistry/apparatusPorts'
import { getSafetyBottlePorts } from '@/components/Chemistry/apparatusPorts'

export interface LayoutEngineInput {
  generator: string
  /** 串联洗气/检验/干燥步骤列表（动态 N 个槽位） */
  washingSteps: Array<{
    id: string
    device: 'wash-bottle' | 'dry-tube' | 'acid-bottle'
    reagent: string
    role: 'purify' | 'detect' | 'dry'
    reversed?: boolean
  }>
  collection: string
  tailGas: string
  baseY?: number
}

/**
 * 生成符合高中化学教材规范的绝对坐标标准玻璃导管 SVG Path
 *
 * 高考教材标准规范：
 * 1. 消除任何斜线或波浪曲线：除 90° 弯头倒角处带小半径圆角（radius=5px）外，其余各段必须 100% 为水平直线或垂直直线！
 * 2. 全系统唯一的水平主走线高度 customTopY（默认为 MAIN_TUBE_Y = baseY - 175），所有跨器材横向导管平铺在同一高度！
 * 3. 终点精确停在器材暴露在外的端口上（y=end.y），绝不越俎代庖深入瓶内与瓶体自带导管打架重叠！
 */
function createAbsoluteSmoothTubingPath(
  start: { x: number; y: number; direction?: 'up' | 'down' | 'left' | 'right' },
  end: { x: number; y: number; direction?: 'up' | 'down' | 'left' | 'right' },
  _tubeType: 'bridge' | 'low-bridge' | 'horizontal-socket',
  _isSideArm = false,
  customTopY = 305
): string {
  const radius = 5
  const topY = customTopY

  // 1. 起点朝右 (如蒸馏烧瓶支管口、试管侧管、启普发生器出气管) -> 终点朝上 (进入后级洗气瓶/干燥管/集气瓶)
  if (start.direction === 'right') {
    if (end.direction === 'left') {
      // 侧出直接水平插入左侧平插口 (如水平球形干燥管)
      if (Math.abs(start.y - end.y) <= 4) {
        return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
      }
      const midX = Math.round((start.x + end.x) / 2)
      return [
        `M ${start.x} ${start.y}`,
        `L ${midX - radius} ${start.y}`,
        `Q ${midX} ${start.y} ${midX} ${start.y + (end.y > start.y ? radius : -radius)}`,
        `L ${midX} ${end.y + (end.y > start.y ? -radius : radius)}`,
        `Q ${midX} ${end.y} ${midX + radius} ${end.y}`,
        `L ${end.x} ${end.y}`,
      ].join(' ')
    }

    // 教材标准画法：支管口出来直接水平向右直行至 end.x 上方，然后 90° 微圆角垂直向下插入
    // 若支管口高度与水平主线有微小差距，直接沿支管口高度直线横行到洗气瓶上方垂直折下！
    const lineY = start.y
    return [
      `M ${start.x} ${start.y}`,
      `L ${end.x - radius} ${lineY}`,
      `Q ${end.x} ${lineY} ${end.x} ${lineY + radius}`,
      `L ${end.x} ${end.y}`,
    ].join(' ')
  }

  // 2. 终点朝向为 left (如球形干燥管左侧粗管平插口)
  if (end.direction === 'left') {
    return [
      `M ${start.x} ${start.y}`,
      `L ${start.x} ${topY + radius}`,
      `Q ${start.x} ${topY} ${start.x + radius} ${topY}`,
      `L ${end.x - 20 - radius} ${topY}`,
      `Q ${end.x - 20} ${topY} ${end.x - 20} ${topY + radius}`,
      `L ${end.x - 20} ${end.y - radius}`,
      `Q ${end.x - 20} ${end.y} ${end.x - 20 + radius} ${end.y}`,
      `L ${end.x} ${end.y}`,
    ].join(' ')
  }

  // 3. 标准教材形态：起点朝上 -> 终点朝上 (经典倒 U 形门字跨越桥管)
  // 两个端口垂直向上引出，在同一高度 topY 绝对水平相通
  return [
    `M ${start.x} ${start.y}`,
    `L ${start.x} ${topY + radius}`,
    `Q ${start.x} ${topY} ${start.x + radius} ${topY}`,
    `L ${end.x - radius} ${topY}`,
    `Q ${end.x} ${topY} ${end.x} ${topY + radius}`,
    `L ${end.x} ${end.y}`,
  ].join(' ')
}

export function solvePhysicalChainLayout(
  input: LayoutEngineInput
): PhysicalChainSolveResult {
  const { generator, washingSteps, collection, tailGas } = input
  const baseY = input.baseY ?? 480

  const hasCollection = collection !== 'none'
  const hasTailGas = tailGas !== 'none'
  const numWashSteps = washingSteps.length

  // ─── 1. 物理包围盒自适应槽位分布（彻底根除局部拆东墙补西墙）──────────────────
  // 发生装置为复合体（含左侧铁架台与右侧支管口），中心锁定于 125px：
  // 左侧铁架台边缘距画框 57px（呼吸感极佳，绝不顶框），右侧支管口延伸至 170px
  const totalSlots = 1 + numWashSteps + (hasCollection ? 1 : 0) + (hasTailGas ? 1 : 0)
  const allSlotX: number[] = []

  if (totalSlots === 1) {
    allSlotX.push(420)
  } else {
    // 发生装置中心
    allSlotX.push(125)

    // 后续器件均分右侧开阔空间 [270, 750]
    const restCount = totalSlots - 1
    const restStart = 270
    const restEnd = 750
    const restStep = restCount > 1 ? (restEnd - restStart) / (restCount - 1) : 0

    for (let i = 0; i < restCount; i++) {
      allSlotX.push(restStart + i * restStep)
    }
  }

  // 槽位索引分配
  const genSlotIdx = 0
  const washSlotStart = 1
  const collSlotIdx = hasCollection ? washSlotStart + numWashSteps : -1
  const tailSlotIdx = hasTailGas
    ? (hasCollection ? collSlotIdx + 1 : washSlotStart + numWashSteps)
    : -1

  // ─── 2. 计算各器材的精确渲染坐标与端口（单一事实来源）────────────────────
  const apparatusLayouts: ApparatusLayout[] = []

  // ── Slot 0: 发生装置 ────────────────────────────────────────────────────────
  const genX = allSlotX[genSlotIdx]
  let generatorLayout: ApparatusLayout
  if (generator === 'flask-heat') {
    const renderX = genX
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
    const renderX = genX - 60
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
    const renderX = genX
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
    // kipp
    const renderX = genX - 45
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

  // ── Slots 1..N: 动态串联洗气/检验/干燥步骤 ─────────────────────────────────
  const WASH_W = 90
  const WASH_H = 140
  const DRYER_W = 110
  const DRYER_H = 60

  const washLayouts: ApparatusLayout[] = []
  washingSteps.forEach((step, i) => {
    const slotIdx = washSlotStart + i
    const centerX = allSlotX[slotIdx]

    if (step.device === 'dry-tube') {
      const variant = step.reagent === 'cacl2' ? 'U-shape' : 'spherical'
      const curW = variant === 'U-shape' ? 90 : DRYER_W
      const curH = variant === 'U-shape' ? 140 : DRYER_H
      const renderX = centerX - curW / 2
      // U型管落地平坐于实验台 (baseY - 140)；球形干燥管居中悬挂 (baseY - 190)
      const renderY = variant === 'U-shape' ? baseY - curH : baseY - 190
      const holderHeight = variant === 'spherical' ? 136 : 85
      const ports = getDryingTubePorts(renderX, renderY, curW, curH, variant)
      const layout: ApparatusLayout = {
        id: `wash-${i}` as ApparatusLayout['id'],
        x: renderX,
        y: renderY,
        width: curW,
        height: curH,
        inletPort: ports.inletPort,
        outletPort: ports.outletPort,
        holderHeight,
      }
      washLayouts.push(layout)
      apparatusLayouts.push(layout)
    } else {
      // 洗气瓶（wash-bottle 或 acid-bottle）
      const renderX = centerX - WASH_W / 2
      const renderY = baseY - WASH_H
      const reversed = step.reversed ?? false
      const ports = getGasWashingBottlePorts(renderX, renderY, WASH_W, WASH_H, reversed)
      const layout: ApparatusLayout = {
        id: `wash-${i}` as ApparatusLayout['id'],
        x: renderX,
        y: renderY,
        width: WASH_W,
        height: WASH_H,
        inletPort: ports.inletPort,
        outletPort: ports.outletPort,
      }
      washLayouts.push(layout)
      apparatusLayouts.push(layout)
    }
  })

  // ── Slot 收集: 收集装置 ────────────────────────────────────────────────────
  const JAR_W = 70
  const JAR_H = 110
  let collectionLayout: ApparatusLayout | null = null
  if (hasCollection && collSlotIdx >= 0) {
    const centerX = allSlotX[collSlotIdx]
    if (collection === 'water-displacement') {
      const W_W = 150
      const W_H = 150
      const renderX = centerX - W_W / 2
      const renderY = baseY - W_H
      const ports = getWaterDisplacementPorts(renderX, renderY, W_W)
      collectionLayout = {
        id: 'collection',
        x: renderX,
        y: renderY,
        width: W_W,
        height: W_H,
        inletPort: ports.inletPort,
        outletPort: ports.outletPort,
      }
    } else {
      const renderX = centerX - JAR_W / 2
      const renderY = baseY - JAR_H
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

  // ── Slot 尾气: 尾气处理 ────────────────────────────────────────────────────
  let tailgasLayout: ApparatusLayout | undefined
  if (hasTailGas && tailSlotIdx >= 0) {
    const centerX = allSlotX[tailSlotIdx]
    if (tailGas === 'inverted-funnel') {
      const renderX = centerX - 40
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
      const SAF_W = 80
      const SAF_H = 120
      const renderX = centerX - SAF_W / 2
      const renderY = baseY - SAF_H
      const ports = getSafetyBottlePorts(renderX, renderY, SAF_W)
      tailgasLayout = {
        id: 'tailgas',
        x: renderX,
        y: renderY,
        width: SAF_W,
        height: SAF_H,
        inletPort: ports.inletPort,
        outletPort: ports.outletPort,
      }
    } else if (tailGas === 'combustion') {
      const renderX = centerX - 30
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
      const renderX = centerX - 20
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
    } else if (tailGas === 'naoh-absorber') {
      // naoh-absorber: 高考规范 NaOH 溶液洗气瓶吸收尾气 (高度 140 贴实验桌面)
      const WASH_W = 90
      const WASH_H = 140
      const renderX = centerX - WASH_W / 2
      const renderY = baseY - WASH_H
      // inletPort 精准对齐长进气管塞孔内部 (距中心左侧 7px，深入塞内 Y = renderY + 6，方向朝上)
      const inletX = centerX - 7
      const inletY = renderY + 6
      tailgasLayout = {
        id: 'tailgas',
        x: renderX,
        y: renderY,
        width: WASH_W,
        height: WASH_H,
        inletPort: { x: inletX, y: inletY, direction: 'up' },
        outletPort: null,
      }
    } else {
      // direct-pipe / 敞口烧杯直通吸收 (高度 100)
      const renderX = centerX - 45
      const renderY = baseY - 100
      tailgasLayout = {
        id: 'tailgas',
        x: renderX,
        y: renderY,
        width: 90,
        height: 100,
        inletPort: { x: centerX, y: renderY + 6, direction: 'up' },
        outletPort: null,
      }
    }
    apparatusLayouts.push(tailgasLayout)
  }

  // ─── 3. 求解贝塞尔拓扑导管路由（全绝对坐标）─────────────────────────────
  const routes: TubingRouteSegment[] = []

  type RouteNode = { slotIdx: number; layout: ApparatusLayout }
  const chain: RouteNode[] = []
  chain.push({ slotIdx: genSlotIdx, layout: generatorLayout })
  washLayouts.forEach((wl, i) => {
    chain.push({ slotIdx: washSlotStart + i, layout: wl })
  })
  if (collectionLayout) chain.push({ slotIdx: collSlotIdx, layout: collectionLayout })
  if (tailgasLayout) chain.push({ slotIdx: tailSlotIdx, layout: tailgasLayout })

  // 全套装置统一教材级工整水平主导管线标高：
  // 若发生装置为蒸馏烧瓶，全链统一对齐其支管口高度，实现从支管口到末端所有横梁绝对水平共线！
  const genOutletY = generatorLayout?.outletPort?.y
  const globalTopY = (generator === 'flask-heat' && genOutletY) ? genOutletY : (baseY - 152)

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
      washingSteps[to.slotIdx - washSlotStart]?.device === 'dry-tube' &&
      washingSteps[to.slotIdx - washSlotStart]?.reagent !== 'cacl2'
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
    slotX: allSlotX,
    apparatuses: [],
    apparatusLayouts,
    routes,
  }
}

