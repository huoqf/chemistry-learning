/**
 * src/features/electrochemical-twin/types.ts
 * 原电池 vs 电解池双对比解题工具 - 类型定义
 */

export type ElectrochemicalMode = 'classic-twin' | 'flow-battery' | 'membrane-electrolysis' | 'quantitative'
export type MembraneType = 'none' | 'cation' | 'anion' | 'bpm'
export type CellType = 'galvanic' | 'electrolytic'

export interface ElectrochemicalParams {
  /**
   * 0: 经典原电池 vs 电解池对比 (Cu-Zn电池 vs Cu-C电解池)
   * 1: 全钒液流电池 / 铅蓄电池充放电 (放电=原电池, 充电=电解池)
   * 2: 膜穿透与多室电解 (阳离子膜/阴离子膜/双极膜BPM)
   * 3: 法拉第电解定律与定量计算 (电子得失/质量/pH)
   */
  mode: number
  /**
   * 0: 放电模式 (原电池, 自发, 化学能->电能)
   * 1: 充电模式 (电解池, 强迫, 电能->化学能)
   */
  batteryState: number
  /**
   * 0: 多孔隔膜/盐桥
   * 1: 阳离子交换膜 (仅允许 H+, Na+, Li+, Zn2+ 通过)
   * 2: 阴离子交换膜 (仅允许 Cl-, SO4 2-, OH- 通过)
   * 3: 双极膜 BPM (催化 H2O 解离产生 H+ 和 OH-)
   */
  membraneType: number
  /** 电流强度 (A) */
  currentAmp: number
  /** 反应持续时间 (s) */
  timeSec: number
  /** 电解质初始浓度 (mol/L) */
  electrolyteConc: number
  /** 是否显示电子导线流动 */
  showElectrons: number
  /** 是否显示溶液离子定向漂移 */
  showIons: number
  /** 是否高亮显示膜穿透细节 */
  showMembraneFlow: number
}

export interface ElectrodeReaction {
  name: string // 如 "负极(氧化)" / "阳极(氧化)"
  poleType: 'anode' | 'cathode' | 'positive' | 'negative'
  reactionFormula: string // KaTeX 公式
  electronChange: string // 得失电子数
  phenomenon: string // 实验现象 (如 "锌片溶解", "阴极生成红亮铜", "阳极产生无色气体")
}

export interface CellDetails {
  title: string
  subtitle: string
  cellType: CellType
  leftElectrode: ElectrodeReaction
  rightElectrode: ElectrodeReaction
  overallReaction: string
  energyConversion: string
  electrolyteInfo: string
  membraneFunction: string
}

export interface QuantResult {
  molesElectron: number // 转移电子摩尔数 mol
  molesProductLeft: number // 左极产物摩尔数 mol
  molesProductRight: number // 右极产物摩尔数 mol
  massChangeLeft: number // 左极质量变化 g
  massChangeRight: number // 右极质量变化 g
  gasVolumeRight: number // 右极气体标准状况体积 L
  deltaPH: number // pH 变化推算
}
