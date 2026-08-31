export type ValenceCategory =
  | '氢化物/酸'
  | '单质'
  | '氧化物'
  | '氢氧化物/含氧酸'
  | '盐'

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
