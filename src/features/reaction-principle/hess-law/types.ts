export type HessTabMode = 'hess-overlay' | 'bond-energy' | 'energy-profile'

export interface ThermochemicalEquation {
  id: string
  label: string
  reactantsText: string
  productsText: string
  deltaH: number // kJ/mol
  defaultK: number // 叠加默认系数 (1, -1, 0.5, -0.5 等)
}

export interface HessGroupPreset {
  id: string
  title: string
  targetFormula: string
  targetDeltaH: number
  equations: ThermochemicalEquation[]
  explanation: string
}

export interface BondItem {
  name: string
  bondEnergy: number // kJ/mol
  count: number
}

export interface MoleculeBondPreset {
  id: string
  name: string
  formula: string
  reactantBonds: BondItem[]
  productBonds: BondItem[]
  calculatedDeltaH: number
  trapWarning?: string
}

export interface EnergyProfileState {
  reactantEnergy: number // kJ/mol
  productEnergy: number // kJ/mol
  uncatalyzedEa: number // kJ/mol
  catalyzedEaStep1: number // kJ/mol
  catalyzedEaStep2: number // kJ/mol
  intermediateEnergy: number // kJ/mol
}

export interface HessLawParams {
  mode: HessTabMode
  // 盖斯定律叠加模式
  hessGroupIndex: number
  k1: number
  k2: number
  // 键能计算模式
  bondMoleculeIndex: number
  // 反应高程模式
  hasCatalyst: number // 1: 有催化剂, 0: 无
  temperature: number // K
}
