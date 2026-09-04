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

export type InquiryMode =
  | 'single-test'
  | 'coexistence-check'
  | 'mechanism-grid'
  | 'coexistence-matrix'

export type MechanismDimensionId =
  | 'double-hydrolysis'
  | 'redox-hidden'
  | 'precipitate-trap'
  | 'gas-weak-acid'

export interface MechanismMasterItem {
  id: string
  dimensionId: MechanismDimensionId
  cationId: string
  anionId: string
  title: string
  productSummary: string
  phenomenon: string
  equation: string
  mechanismReason: string
  examTrap: string
  tag: '必考' | '高频' | '易错' | '压轴'
}

export interface MechanismDimensionGroup {
  id: MechanismDimensionId
  title: string
  subtitle: string
  themeColor: string
  badgeBg: string
  badgeText: string
  borderColor: string
  examFocus: string
  items: MechanismMasterItem[]
}

export type MatrixConflictCategory =
  | 'none' // 稳定共存
  | 'precipitate' // 生成难溶沉淀
  | 'redox' // 氧化还原互斥
  | 'double-hydrolysis' // 彻底双水解
  | 'gas-weak-acid' // 生成气体或弱酸/弱碱
  | 'acid-medium-trap' // 酸性介质诱发互斥陷阱

export interface IonPairCell {
  cationId: string
  anionId: string
  status: 'coexist' | 'conflict'
  category: MatrixConflictCategory
  badgeLabel: string // 简短徽章标签，如 "沉淀"、"双水解"、"氧化"、"气+沉"、"共存"
  productSummary?: string // 产物简写，如 "BaSO₄↓"、"Al(OH)₃↓+CO₂↑"、"I₂"
  equation?: string // 离子方程式
  phenomenon: string // 反应宏观特征现象
  reason: string // 反应机理与原因
  examTrap?: string // 高考命题陷阱或设问切入点
}

export interface IonMatrixState {
  viewMode: number // 0: 矩阵/探究, 1: 规范踩分, 2: 真题研析
  inquiryMode: InquiryMode
  selectedIonId: string // 单离子检验选中的离子
  coexistenceSelectedIons: string[] // 共存探究选中的离子列表
  isReactionActive: boolean // 是否触发反应动画
}

