export type ChartTabMode = 'energy-profile' | 'le-chatelier' | 'lnk-invt' | 'alpha-tp'

export type SystemReactionId = 'no2-n2o4' | 'nh3-synthesis' | 'methanol-synthesis'

export type CatalystType = 'none' | 'catalyst-a' | 'catalyst-b'

export interface ReactionSystemConfig {
  id: SystemReactionId
  name: string
  equation: string
  deltaH: number // kJ/mol (负为放热，正为吸热)
  baseEaForward: number // kJ/mol
  baseEaReverse: number // kJ/mol
  gasMolesDiff: number // 产物气体系数和 - 反应物气体系数和
  defaultTemp: number // K
  defaultPressure: number // atm
}

export interface NexusParams {
  chartTab: ChartTabMode
  reactionId: SystemReactionId
  catalyst: CatalystType
  temperature: number // K (250 ~ 600)
  pressure: number // atm (0.5 ~ 5.0)
  addedReactant: number // mol/L 或 突变加量
  inertGasMode: 'none' | 'constant-v' | 'constant-p'
}

export interface EnergyProfilePoint {
  x: number
  y: number
  label?: string
  isTS?: boolean
  stepIndex?: number
  stepEa?: number
  isRDS?: boolean // 是否为决速步 (Rate-Determining Step)
}

export interface StepBarrierInfo {
  stepIndex: number
  fromLabel: string
  toLabel: string
  fromY: number
  toY: number
  ea: number
  isRDS: boolean
}

export interface HistoryPoint {
  time: number
  vForward: number
  vReverse: number
  cReactant: number
  cProduct: number
}

export interface AlphaTpPoint {
  temperature: number
  alphaLowP: number // 较低压强下的平衡转化率 (%)
  alphaHighP: number // 较高压强下的平衡转化率 (%)
}

