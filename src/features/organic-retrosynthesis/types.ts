export type RetrosynthesisModelId =
  | 'aspirin-benorilate'
  | 'diels-alder-acetal'
  | 'double-bond-protection'
  | 'carbon-carbon-builder'

export type SynthesisMode = 'forward' | 'retrosynthetic' | 'protection-breakdown'

export interface SvgMoleculeNode {
  id: string
  label: string
  formula: string
  x: number
  y: number
  role: 'TM' | 'precursor' | 'reagent' | 'protected' | 'intermediate'
  badge?: string
  isTarget?: boolean
  isProtectedGroup?: boolean
}

export interface SvgConnection {
  from: string
  to: string
  label: string
  isDisconnection?: boolean // 是否为逆合成切断 (✂)
  isProtectionShield?: boolean // 是否为保护盾牌
  condition?: string
}

export interface RetrosynthesisStep {
  stepIndex: number
  title: string
  description: string
  reactants: Array<{ name: string; formula: string }>
  products: Array<{ name: string; formula: string }>
  reagents: string
  protectionStatus: {
    isProtected: boolean
    protectedGroup?: string
    protectingAgent?: string
    deprotectingAgent?: string
    reason?: string
  }
  cutBond: {
    bondType: string
    positionDesc: string
    retroSynthon: string
  } | null
  atomEconomy: number // 原子利用率 %
  fgiType: string // 官能团转换类型 (FGI)
  nodes: SvgMoleculeNode[]
  connections: SvgConnection[]
}

export interface RetrosynthesisModelData {
  id: RetrosynthesisModelId
  title: string
  subtitle: string
  targetMolecule: string
  targetFormula: string
  difficulty: '基础' | '中等' | '高考冲刺'
  description: string
  coreStrategy: string
  steps: RetrosynthesisStep[]
  protectionKeyPoints: string[]
  infoReaction?: {
    name: string
    equation: string
    mechanismDesc: string
  }
}
