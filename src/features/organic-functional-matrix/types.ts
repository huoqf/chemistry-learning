export interface ReagentConsumption {
  reagentName: string
  reagentFormula: string
  ratio: number // 1 mol 该官能团消耗试剂的 mol 数
  condition: string // 反应条件
  reactionType: string // 取代 / 加成 / 中和 / 氧化 / 还原 / 水解
  phenomenon: string // 实验现象
}

export interface FunctionalGroupItem {
  id: string
  name: string
  formula: string
  structureSvg: string // 结构示意
  category: 'hydrocarbon-derivative' | 'oxygen-containing' | 'nitrogen-containing'
  testReagents: string[] // 特征鉴别试剂
  testPhenomenon: string // 特征检验现象
  testEquation: string // 典型代表反应方程式
  consumptions: {
    Na: number // 1 mol 消耗 Na 的 mol 数
    NaOH: number // 1 mol 消耗 NaOH 的 mol 数
    NaHCO3: number // 1 mol 消耗 NaHCO3 的 mol 数
    Na2CO3: number // 1 mol 消耗 Na2CO3 的 mol 数 (反应产生 CO2 或转化为 HCO3-)
    Br2: number // 1 mol 消耗 Br2 的 mol 数 (加成或取代)
    H2: number // 1 mol 消耗 H2 的 mol 数 (加氢还原)
  }
  notes: string // 高考易错注意事项
}

export interface MoleculeBuilderState {
  groups: Record<string, number> // 官能团 ID -> 数量
}

export interface TotalConsumptionResult {
  Na: number
  NaOH: number
  NaHCO3: number
  Na2CO3: number
  Br2: number
  H2: number
  gasH2: number // 产生的 H2 摩尔数
  gasCO2: number // 产生的 CO2 摩尔数
}
