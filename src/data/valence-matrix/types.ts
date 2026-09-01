export type ValenceCategory =
  | '氢化物/酸'
  | '单质'
  | '氧化物'
  | '氢氧化物/含氧酸'
  | '盐'

export type ExperimentSceneType =
  | 'solution-drop' // 溶液滴加显色 / 析出沉淀 / 沉淀溶解
  | 'gas-absorption' // 导气管通入吸收液检验
  | 'solid-dissolution' // 固体颗粒/粉末酸溶放气
  | 'precipitation-transformation' // 沉淀多阶段相变（如 Fe(OH)2 白->灰绿->红褐）
  | 'specimen-info' // 实物晶体标本与工业流程（非试管场景）

export interface SubstanceExperimentData {
  /** 实验场景分类 */
  sceneType: ExperimentSceneType
  /** 反应前起始底物状态 */
  initial: {
    name: string
    state: 'solid' | 'solution' | 'gas' | 'precipitate'
    color: string
    label: string
  }
  /** 加入的试剂/环境 */
  reagent: {
    name: string
    color: string
    method: 'drop' | 'bubble' | 'pour' | 'heat'
  }
  /** 反应后特征产物状态与现象 */
  result: {
    name: string
    state: 'solid' | 'solution' | 'gas' | 'precipitate'
    color: string
    precipitateType?: 'none' | 'white' | 'red-brown' | 'blue' | 'yellow' | 'black' | 'transient-feoh2' | 'al-dissolve'
    hasGasBubble?: boolean
    phenomenonText: string
  }
}

export interface ValenceSubstanceNode {
  substance: string
  valence: number
  category: ValenceCategory
  colorText: string
  colorStyle: string
  rgbColor: string
  testReaction?: string
  equation?: string
  roleDescription?: string
  isOxidant?: boolean
  isReductant?: boolean
  /** 结构化高保真实真实验数据 */
  experiment?: SubstanceExperimentData
  /** 兼容性字段 */
  startingMaterial?: string
  startingState?: string
  apparatusType?: string
  testReagent?: string
  reagentRgbColor?: string
  initialColor?: string
  resultColor?: string
  physicalState?: 'solid' | 'solution' | 'gas' | 'precipitate'
  experimentType?: 'dissolution' | 'drop-test' | 'gas-absorption' | 'combustion'
  hasGasBubble?: boolean
  precipitateType?: 'none' | 'white' | 'red-brown' | 'blue' | 'yellow' | 'black' | 'transient-feoh2' | 'al-dissolve'
}

export interface ValenceTransformation {
  id: string
  fromSubstance: string
  toSubstance: string
  reagent: string
  equation: string
  electronTransfer: string
  type: 'oxidation' | 'reduction' | 'disproportionation' | 'comproportionation' | 'other'
}

export type ElementGroupCategory = 'non-metal' | 'main-group-metal' | 'transition-metal'

export interface ElementValenceConfig {
  id: string
  name: string
  symbol: string
  isCoreGaokao: boolean
  elementCategory?: ElementGroupCategory
  badgeText: string
  atomColor: string
  valences: number[]
  categories: ValenceCategory[]
  items: ValenceSubstanceNode[]
  transformations: ValenceTransformation[]
  examTips: string[]
}
