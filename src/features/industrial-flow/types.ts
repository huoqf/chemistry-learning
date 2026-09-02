/**
 * src/features/industrial-flow/types.ts
 * 母题七：无机工艺流程与沉淀调 pH 工具 - 类型定义
 */

export type IndustrialFlowSystemId =
  | 'fe-al-mn'
  | 'fe-cu-zn'
  | 'ti-fe'
  | 'ni-co-li'
  | 'mg-ca'

export interface IndustrialFlowParams {
  viewMode: 0 | 1 | 2 // 0: 动画流程与沉淀曲线, 1: 规范踩分, 2: 高考真题
  systemId: IndustrialFlowSystemId
  activeStep: number // 1: 浸出槽, 2: 氧化/还原槽, 3: 沉淀槽, 4: 分离结晶/置换槽
  pH: number // 目标调 pH 值 (0 ~ 14)
  leachTemp: number // 浸出温度 (20 ~ 90 ℃)
  crushSize: 'coarse' | 'medium' | 'fine' // 矿石粒度
  oxidantAmount: 'sufficient' | 'insufficient' // 氧化剂/还原剂加入量
  reagent:
    | 'MnO'
    | 'MnCO3'
    | 'CuO'
    | 'ZnO'
    | 'ZnCO3'
    | 'MgO'
    | 'MgCO3'
    | 'Na2CO3'
    | 'CaCO3'
    | 'NaOH' // 调 pH 试剂选择 (涵盖氧化物、碳酸盐、强碱)
  crystallizeMethod: 'cooling' | 'evaporation' // 结晶方式 (降温结晶 vs 蒸发浓缩)
  washSolvent: 'water' | 'ethanol' // 沉淀/晶体洗涤试剂 (水洗 vs 无水乙醇洗)
}

export interface IonConcentrationPoint {
  symbol: string // 如 'Fe3+', 'Al3+', 'Mn2+'
  name: string // 中文名 '铁离子'
  charge: number // 3 或 2
  ksp: number // Ksp 沉淀溶解积
  c0: number // 初始浓度 mol/L
  cCurrent: number // 当前 pH 下余量浓度 mol/L
  pHStart: number // 开始沉淀 pH (c = c0)
  pHEnd: number // 沉淀完全 pH (c = 1e-5 mol/L)
  precipitateRatio: number // 沉淀百分比 (0 ~ 100%)
  color: string // 对应的图表/溶液颜色
  precipitateFormula: string // 沉淀物化学式，如 'Fe(OH)3'
}

export interface ElementFate {
  element: string // 元素名称及角色，如 'Mn (主产物)', 'Fe (主要杂质)'
  rawState: string // 原料中的初始物相，如 'MnO₂'
  leachState: string // 浸出后溶液中的状态，如 'Mn²⁺'
  separationStep: string // 去除或分离手段，如 '保留在滤液' / '调 pH=4.7 完全沉淀'
  finalState: string // 最终归宿，如 'MnSO₄·H₂O 晶体' / 'Fe(OH)₃ 滤渣 II'
  isTarget: boolean // 是否为主目标元素
  isMainProduct?: boolean // 是否为主产物 (高亮标记)
}

export interface ReagentRecommendation {
  reagent: string
  isRecommended: boolean
  label: string
  tag: string
  category: 'target-compound' | 'external' // 试剂分类：主产物难溶物 (氧化物/碳酸盐) vs 外来中和试剂
  reaction?: string // 消耗 H+ 反应机理方程式
  warning?: string
}

export interface MassBalanceFlow {
  targetElement: string // 如 'Mn' / 'Zn' / 'Ti' / 'Co' / 'Mg'
  feedInRatio: number // 100.0% (基准投入)
  leachLossRatio: number // 浸出渣损失率 (%)
  leachSolutionRatio: number // 浸出滤液保留率 (%)
  precipitateLossRatio: number // 沉淀除杂夹带损失率 (%)
  purifiedSolutionRatio: number // 净化液保留率 (%)
  crystallizeYieldRatio: number // 最终高纯产品综合收率 (%)
  motherLiquorRatio: number // 结晶母液循环率 (%)
}

export interface IndustrialFlowChemistry {
  systemName: string
  targetIon: string // 目标保留离子 'Mn2+'
  impurityIons: string[] // 杂质去除离子 ['Fe3+', 'Al3+']
  ions: IonConcentrationPoint[]
  safePhRange: [number, number] // [安全下限 pH, 安全上限 pH]
  hasSafeRange: boolean // 是否存在理论有效分离窗口 (minSafePh <= maxSafePh)
  isPhInSafeRange: boolean
  safeRangeDescription?: string // 针对无安全窗口或最佳窗口的化学说明
  leachRate: number // 浸出率 (%)
  isOxidized: boolean // 是否已氧化 Fe2+ -> Fe3+
  precipitateSummary: string // 滤渣主要成分
  filtrateSummary: string // 滤液主要成分
  curveData: Array<{ pH: number; [key: string]: number }> // lg c - pH 拟合曲线数据
  elementFates: ElementFate[] // 元素走向追踪矩阵数据
  reagentEvaluations: ReagentRecommendation[] // 调 pH 试剂不增杂评估
  leachCurveData: Array<{ temp: number; leachRate: number }> // 浸出动力学数据
  solubilityCurveData: Array<{ temp: number; main: number; impurity: number }> // 溶解度-结晶分离数据
  massBalance: MassBalanceFlow // 全流程元素质量守恒流数据
  activeStepInfo: {
    title: string
    focusSubject: string
    coreReaction: string
    coreQuestion: string
    scoringAnswer: string
  }
}
