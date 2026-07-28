/**
 * src/features/titration-balance/types.ts
 * 滴定突跃与离子浓度排序解题工具 - 类型定义
 */

export type TitrationSystemType = 'strongBaseWeakAcid' | 'strongAcidWeakBase' | 'strongBaseStrongAcid'

export type IndicatorType = 'none' | 'phenolphthalein' | 'methylOrange'

export interface TitrationParams {
  viewMode: number // 0: 动画&图表, 1: 规范踩分, 2: 真题变式
  systemType: TitrationSystemType // 滴定体系
  vRatio: number // 已滴加体积相对于计量点的比例 V_add / V_eq (0 ~ 2.0)
  pKa: number // 弱酸 pKa 或 弱碱 pKb (例 4.75)
  c0: number // 被滴定液初始浓度 (mol/L)
  indicator: IndicatorType // 指示剂
}

export interface IonConcentration {
  name: string
  labelLatex: string
  conc: number // mol/L
  formatted: string
  color: string
}

export interface ConservationEquation {
  title: string
  equationLatex: string
  explanation: string
}

export interface TitrationCurvePoint {
  vRatio: number // V_add / V_eq
  vAdd: number // mL
  pH: number
}

export interface TitrationChemistryResult {
  pH: number
  cTitrant: number // 滴定剂浓度
  vEq: number // 计量点体积 (mL)
  vAdd: number // 已滴加体积 (mL)
  
  // 各微粒浓度 (mol/L)
  ionConcs: IonConcentration[]
  
  // 离子浓度排序 (如 c(Na⁺) > c(A⁻) > c(OH⁻) > c(H⁺))
  concOrderingLatex: string
  orderingExplanation: string
  
  // 三大守恒
  chargeBalance: ConservationEquation
  massBalance: ConservationEquation
  protonBalance: ConservationEquation
  
  // 滴定突跃信息
  jumpStartPH: number
  jumpEndPH: number
  isInJumpZone: boolean
  
  // 指示剂状态
  indicatorColor: string
  indicatorName: string
  indicatorTip: string
  
  // 全量 pH 滴定曲线
  curvePoints: TitrationCurvePoint[]
}
