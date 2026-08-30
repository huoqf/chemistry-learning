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
      const cornerY = Math.min(end.y, start.y + radius)
      return [
        `M ${start.x} ${start.y}`,
        `L ${end.x - radius} ${start.y}`,
        `Q ${end.x} ${start.y} ${end.x} ${cornerY}`,
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
  const { generator, washingSteps, collection, tailGas } = input
  const baseY = input.baseY ?? 480

  const hasCollection = collection !== 'none'
  const hasTailGas = tailGas !== 'none'
  const numWashSteps = washingSteps.length

  // ─── 1. 动态自适应 SlotX（基于活跃装置数均分）────────────────────────────
  // 结构：[发生装置(0)] + [洗气步骤 1..N] + [收集(N+1)] + [尾气(N+2)]
  const totalSlots = 1 + numWashSteps + (hasCollection ? 1 : 0) + (hasTailGas ? 1 : 0)
  const startX = 80
  const endX = 760
  const stepX = totalSlots > 1 ? (endX - startX) / (totalSlots - 1) : 0

  // 生成每个槽的中心 X 坐标
  const allSlotX: number[] = []
  for (let i = 0; i < totalSlots; i++) {
    allSlotX.push(startX + i * stepX)
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
      const renderX = centerX - DRYER_W / 2
      const renderY = variant === 'spherical' ? baseY - 190 : baseY - 195
      const holderHeight = variant === 'spherical' ? 136 : 85
      const ports = getDryingTubePorts(renderX, renderY, DRYER_W, DRYER_H, variant)
      const layout: ApparatusLayout = {
        id: `wash-${i}` as ApparatusLayout['id'],
        x: renderX,
        y: renderY,
        width: DRYER_W,
        height: DRYER_H,
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
    } else {
      // direct-pipe / NaOH 烧杯
      const renderX = centerX - 45
      const renderY = baseY - 100
      tailgasLayout = {
        id: 'tailgas',
        x: renderX,
        y: renderY,
        width: 90,
        height: 100,
        inletPort: { x: centerX, y: renderY + 65 },
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

  // 全链统一瓶口走线基线
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

