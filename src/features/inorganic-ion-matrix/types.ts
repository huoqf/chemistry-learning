export type IonType = 'cation' | 'anion'

export interface ReagentOption {
  id: string
  name: string
  isOptimal: boolean
  tag: 'optimal' | 'trap' | 'ineffective' // 最佳特效 | 高考陷阱 | 无效干扰
  feedback: string // 为什么选对/为什么是陷阱
  phenomenon: string
  equation?: string
  resultColor?: string
  precipitate?: boolean
  precipitateColor?: string
  hasGas?: boolean
  litmusChange?: boolean
}

export interface IonItem {
  id: string
  name: string
  formula: string
  charge: number
  type: IonType
  colorInSolution: string // 溶液中外观颜色描述
  colorRgb: string // 溶液色值
  testReagent: string // 特效检验试剂
  testPhenomenon: string // 特征现象
  testEquation: string // 检验方程式
  interference: string // 干扰离子及排除方法
  standardProcedure: string // 高考标准检验答题句式
  examImportance: 'high' | 'ultra'
  reagentOptions: ReagentOption[]
}

export type ConflictType = 'precipitate' | 'gas' | 'weak-electrolyte' | 'redox' | 'double-hydrolysis'

export interface CoexistenceConflict {
  id: string
  ionA: string
  ionB: string
  type: ConflictType
  typeLabel: string
  reason: string
  equation: string
}

export interface IonMatrixState {
  viewMode: number // 0: 矩阵/探究, 1: 规范踩分, 2: 真题研析
  inquiryMode: 'single-test' | 'coexistence-check'
  selectedIonId: string // 单离子检验选中的离子
  coexistenceSelectedIons: string[] // 共存探究选中的离子列表
  isReactionActive: boolean // 是否触发反应动画
}
