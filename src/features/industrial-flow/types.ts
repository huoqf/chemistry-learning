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
  pH: number // 目标调 pH 值 (0 ~ 14)
  leachTemp: number // 浸出温度 (20 ~ 90 ℃)
  crushSize: 'coarse' | 'medium' | 'fine' // 矿石粒度
  oxidantAmount: 'sufficient' | 'insufficient' // 氧化剂 H2O2 加入量
  reagent: 'MnO' | 'CuO' | 'ZnO' | 'MgO' | 'Na2CO3' | 'CaCO3' | 'NaOH' // 调 pH 试剂选择
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

export interface IndustrialFlowChemistry {
  systemName: string
  targetIon: string // 目标保留离子 'Mn2+'
  impurityIons: string[] // 杂质去除离子 ['Fe3+', 'Al3+']
  ions: IonConcentrationPoint[]
  safePhRange: [number, number] // [安全下限 pH, 安全上限 pH]
  isPhInSafeRange: boolean
  leachRate: number // 浸出率 (%)
  isOxidized: boolean // 是否已氧化 Fe2+ -> Fe3+
  precipitateSummary: string // 滤渣主要成分
  filtrateSummary: string // 滤液主要成分
  curveData: Array<{ pH: number; [key: string]: number }> // lg c - pH 拟合曲线数据
}
