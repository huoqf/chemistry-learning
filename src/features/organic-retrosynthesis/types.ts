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

/**
 * 内容归属层级（三层判别，取代原先笼统的"超纲"标签）：
 * - `textbook`  教材主线：人教版选择性必修3 正文要求，必须掌握
 * - `info-item` 信息题素材：教材未作要求，但高考常以"给出信息"的方式考查
 * - `beyond`    超纲术语：大学有机合成学派表述，高考至多作背景名词，不作考点
 */
export type SyllabusTierLevel = 'textbook' | 'info-item' | 'beyond'

export interface SyllabusTier {
  level: SyllabusTierLevel
  /** 该层覆盖的技法要点，左屏按层分行展示 */
  techniques: string[]
  /** 归属依据：教材位置或命题依据 */
  basis: string
}

export interface ProtectionCheatItem {
  targetGroup: string
  reagents: string
  protectedForm: string
  tolerance: string
  deprotection: string
  examTip: string
  /** 本条保护基策略的教材层级归属 */
  syllabusTier: SyllabusTierLevel
}

export interface RetrosynthesisModelData {
  id: RetrosynthesisModelId
  title: string
  subtitle: string
  targetMolecule: string
  targetFormula: string
  /**
   * 整体难度档。注意：本模块的合成策略横跨三个层级（教材主线 / 信息题素材 / 超纲术语），
   * 该字段只反映整体难度感；"哪一条是必学、哪一条只需读懂信息"必须看 `syllabusTiers`。
   */
  difficulty: '基础' | '中等' | '信息题拓展'
  /**
   * 内容三层画像：哪些属人教版选择性必修3 教材主线、哪些只需作为信息题读懂、
   * 哪些是大学术语不作考点。顺序固定 textbook → info-item → beyond，左屏据此分层提示。
   */
  syllabusTiers: SyllabusTier[]
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
