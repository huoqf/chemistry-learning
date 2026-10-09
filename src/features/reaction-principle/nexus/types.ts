export type ChartTabMode = 'energy-profile' | 'le-chatelier' | 'lnk-invt' | 'alpha-tp'

export type SystemReactionId = 'no2-n2o4' | 'nh3-synthesis' | 'methanol-synthesis'

export type CatalystType = 'none' | 'catalyst-a' | 'catalyst-b'

export interface ReactionSystemConfig {
  id: SystemReactionId
  name: string
  equation: string
  deltaH: number // kJ/mol (负为放热，正为吸热)
  /**
   * 标准摩尔熵变 ΔS° (J·mol⁻¹·K⁻¹)，取 298 K 文献值。
   * 作用：范特霍夫方程 `ln K = -ΔH/(RT) + C` 的积分常数 `C = ΔS°/R`，
   * 由热力学恒等式 ΔG° = ΔH° - TΔS° 与 ΔG° = -RT ln K 直接导出。
   * 之前该截距被硬编码为 -12（三体系共用），使 Kc 量级严重失真（如 NO₂ 体系算出 Kc ≈ 6.5×10⁴）。
   */
  deltaS: number
  baseEaForward: number // kJ/mol
  baseEaReverse: number // kJ/mol
  gasMolesDiff: number // 产物气体系数和 - 反应物气体系数和
  cProductPerCReactant: number // 浓度变化比 Δc(产物)/Δc(反应物) = ν(产物)/ν(反应物)，用于 c-t 图守恒
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

