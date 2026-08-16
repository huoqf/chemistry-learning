export type RetrosynthesisModelId =
  | 'aspirin-benorilate'
  | 'diels-alder-acetal'
  | 'double-bond-protection'
  | 'carbon-carbon-builder'

export type SynthesisMode = 'retrosynthetic' | 'forward' | 'protection-breakdown'

export interface FunctionalGroupBadge {
  name: string
  formula: string
  color: 'red' | 'blue' | 'emerald' | 'amber' | 'purple'
  isReacting?: boolean
  isProtected?: boolean
}

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
  synthonCharge?: 'δ+' | 'δ-' | '+ (亲电)' | '- (亲核)'
  functionalGroups?: FunctionalGroupBadge[]
}

export interface SvgConnection {
  from: string
  to: string
  label: string
  isDisconnection?: boolean // 是否为逆合成切断 (✂)
  isProtectionShield?: boolean // 是否为保护盾牌
  condition?: string
}

export interface SynthonPair {
  electrophilicSynthon: string // 亲电合成子 (如 [Ar-CO]+)
  nucleophilicSynthon: string  // 亲核合成子 (如 [Ar'-O]-)
  electrophilicReagent: string // 实际亲电等价物 (如 乙酰水杨酸酰氯/酸酐)
  nucleophilicReagent: string  // 实际亲核等价物 (如 对乙酰氨基酚)
}

export interface SideReactionContrast {
  riskTitle: string
  crashCondition: string
  byproductDesc: string
  explanation: string
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
  synthonPair?: SynthonPair
  sideReactionContrast?: SideReactionContrast
  atomEconomy: number // 原子利用率 %
  fgiType: string // 官能团转换类型 (FGI)
  nodes: SvgMoleculeNode[]
  connections: SvgConnection[]
}

export interface ProtectionCheatItem {
  targetGroup: string
  reagents: string
  protectedForm: string
  tolerance: string
  deprotection: string
  examTip: string
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
  unprotectedCrashDemo?: {
    warningTitle: string
    consequence: string
    solution: string
  }
  infoReaction?: {
    name: string
    equation: string
    mechanismDesc: string
  }
}
