/**
 * src/features/gas-chain/physics/types.ts
 * 气体制备/净化/尾气处理装置链 — 装置链物理模型与端口契约定义
 */

export type PortDirection = 'up' | 'down' | 'left' | 'right'
export type JointType = 'nipple' | 'socket' | 'flange'

export interface ConnectionPort {
  id: string
  /** 相对于器材 local (0,0) 的 X 偏移 */
  localX: number
  /** 相对于器材 local (0,0) 的 Y 偏移 */
  localY: number
  /** 端口朝向 */
  direction: PortDirection
  /** 接头物理类型 */
  jointType: JointType
}

export interface BoundingBox {
  width: number
  height: number
  /** 锚点相对于 BoundingBox 顶部的 Y 偏置 (如桌面 baseline 偏置) */
  anchorY: number
}

export interface ApparatusMeta {
  type: string
  boundingBox: BoundingBox
  ports: Record<string, ConnectionPort>
}

export interface ResolvedApparatusPosition {
  type: string
  x: number
  y: number
  width: number
  height: number
  ports: Record<string, { x: number; y: number; direction: PortDirection; jointType: JointType }>
}

/**
 * 单一事实来源：每个器材的渲染坐标 + 端口坐标，由 layoutEngine 统一计算
 * GasChainCenterView 直接用此数据渲染，无需再次偏移计算
 */
export interface ApparatusLayout {
  /** 器材标识（wash-N 动态洗气步骤支持 N ∈ [0,9]） */
  id: 'generator' | 'wash' | 'wash-0' | 'wash-1' | 'wash-2' | 'wash-3' | 'dryer' | 'collection' | 'tailgas'
  /** 器材左上角 x（绝对坐标，传给组件的 x prop）*/
  x: number
  /** 器材左上角 y（绝对坐标，传给组件的 y prop）*/
  y: number
  /** 器材宽度 */
  width: number
  /** 器材高度 */
  height: number
  /** 进气端口绝对坐标（导管终点） */
  inletPort: { x: number; y: number; direction?: PortDirection } | null
  /** 出气端口绝对坐标（导管起点） */
  outletPort: { x: number; y: number; direction?: PortDirection } | null
  /** 干燥管支撑柱高度（仅 dryer 使用，由布局引擎计算以确保落地） */
  holderHeight?: number
}

export interface TubingRouteSegment {
  id: string
  fromSlot: number
  toSlot: number
  startPoint: { x: number; y: number }
  endPoint: { x: number; y: number }
  tubeType: 'bridge' | 'low-bridge' | 'horizontal-socket'
  /** 纯绝对坐标 SVG path（不需要任何 translate 包裹）*/
  pathD: string
}

export interface PhysicalChainSolveResult {
  baseY: number
  slotX: number[]
  apparatuses: ResolvedApparatusPosition[]
  /** 单一事实来源：各器材渲染坐标与端口，供 View 直接使用 */
  apparatusLayouts: ApparatusLayout[]
  routes: TubingRouteSegment[]
}
