export type ViewMode = 'explore' | 'scoring' | 'quiz'

export type TitrationMode = 'error-analysis' | 'purity-calc' | 'yield-calc'

export type TitrationType = 'acid-base' | 'redox' | 'precipitation'

export type ErrorOperation =
  | 'none'
  | 'unrinsed-burette'
  | 'unrinsed-flask'
  | 'wet-flask'
  | 'view-start-up-end-down'
  | 'view-start-down-end-up'
  | 'bubble-start'
  | 'bubble-end'
  | 'hanging-drop'
  | 'indicator-early'
  | 'indicator-late'
  | 'volumetric-flask-down'

export type PurityCalcMethod = 'direct' | 'back-titration' | 'multistep-redox'

export interface TitrationErrorParams {
  mode: TitrationMode
  titrationType: TitrationType
  
  // 误差分析模式参数
  errorOp: ErrorOperation
  viewAngle: number // -15° 到 +15° (0为平视, >0为仰视, <0为俯视)
  cStandardTrue: number // mol/L 真实浓度
  vSampleTrue: number // mL 待测液理论体积
  cSampleTrue: number // mol/L 待测液真实浓度
  
  // 纯度与返滴定计算参数
  purityMethod: PurityCalcMethod
  sampleMass: number // g 粗样品质量
  solutionTotalVol: number // mL 样品配制总体积
  pipetteVol: number // mL 移取用于滴定的体积
  
  // 返滴定已知过量试剂 1
  reagent1Conc: number // mol/L
  reagent1Vol: number // mL
  
  // 标准滴定液 2
  reagent2Conc: number // mol/L
  reagent2Vol: number // mL 滴定消耗体积
  
  // 产率计算参数
  rawMaterialMass: number // g 原料质量
  molarMassProduct: number // g/mol 目标产物摩尔质量
  actualProductMass: number // g 实际提纯获得质量
}

export interface ErrorEffectResult {
  vRead: number // mL 读取的标准液体积
  vTrue: number // mL 实际参与化学反应的标准液体积
  cCalculated: number // mol/L 计算出的待测液浓度
  cTrue: number // mol/L 真实待测液浓度
  relativeErrorPct: number // % 相对误差
  effectDirection: 'high' | 'low' | 'none' // 偏高 / 偏低 / 无影响
  description: string // 误差机理简述
  equationExplanation: string // 代数式分析
}

export interface PurityResult {
  nAliquot: number // mol 移取样品中所含有效成分摩尔数
  nTotalSample: number // mol 全样品中所含有效成分摩尔数
  mPureProduct: number // g 纯物质质量
  purityPct: number // % 纯度质量分数
  stoichiometryRatio: string // 反应计量比关系
  calcStepsLatex: string // 计算步骤 LaTeX
}

export interface YieldResult {
  nTheoretical: number // mol 理论最大生成量
  mTheoretical: number // g 理论最大质量
  actualMass: number // g 实际产物质量
  yieldPct: number // % 产率
  calcFormulaLatex: string // 计算 LaTeX
}

export interface TitrationChemistryResult {
  errorResult: ErrorEffectResult
  purityResult: PurityResult
  yieldResult: YieldResult
}
