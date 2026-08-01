export type TrapCategory =
  | 'state-volume'
  | 'structure-bonds'
  | 'electrolyte-hydrolysis'
  | 'redox-electron'
  | '5-step-matrix'

export interface AvogadroParams {
  trapCategory: TrapCategory
  // 标况状态下物料选择 (增加 HF 缔合)
  stateItem: 'SO3' | 'CCl4' | 'H2O' | 'CH3OH' | 'HF' | 'Cl2' | 'O2'
  // 结构化学物料选择 (增加 T2O, S8, 冰氢键, NH4Cl)
  structureItem: 'P4' | 'diamond' | 'graphite' | 'SiO2' | 'Na2O2' | 'D2O' | 'T2O' | 'S8' | 'ice' | 'NH4Cl'
  // 电解质/水解物料选择 (增加 NaHSO4 熔融)
  electrolyteItem: 'CH3COOH' | 'FeCl3' | 'Na2CO3' | 'NaHSO4-molten' | 'pureH2O'
  // 氧化还原反应选择 (增加 Cu-S, NO2-N2O4 二聚)
  redoxItem: 'Cl2-NaOH' | 'Na2O2-H2O' | 'NO2-H2O' | 'Cu-S' | 'SO2-O2-reversible' | 'NO2-N2O4-reversible' | 'Fe-HNO3'
  // 输入数值（摩尔数/体积/质量）
  amountValue: number
  amountUnit: 'mol' | 'L' | 'g'
  // 环境条件
  temperatureCondition: 'standard' | 'ambient' // standard: 0℃ 101kPa, ambient: 25℃ 101kPa
  // 溶液条件（如果适用）
  solutionVolume: number // L
  solutionConcentration: number // mol/L
  // 盲盒矩阵当前排查步骤
  matrixStepIndex: number
}

export interface ParticleStatItem {
  label: string
  theoreticalMoles: number
  actualMoles: number
  unit: string
  isTrap: boolean
  trapExplanation?: string
}

export interface AvogadroResult {
  title: string
  subtitle: string
  isStateGas: boolean
  physicalState: '固态' | '液态' | '气态' | '溶液' | '熔融态' | '固/液态'
  vmValue: number // L/mol
  particleStats: ParticleStatItem[]
  trapType: string
  trapBadge: string
  trapLevel: 'high' | 'medium' | 'low'
  keyPointAnalysis: string[]
  substanceWarnings?: { text: string; level: 'danger' | 'warning' | 'info' }[]
  formulaLatex: string
  correctAnswerSummary: string
  stepByStepMatrix: {
    stepName: string
    checkTarget: string
    pass: boolean
    finding: string
  }[]
}
