import type { ReactionMechanismType } from './types'

export const ATOM_COLORS = {
  carbon: '#334155',
  hydrogen: '#E2E8F0',
  oxygen: '#EF4444',
  nitrogen: '#3B82F6',
  chlorine: '#10B981',
}

export const BOND_COLORS = {
  single: '#94A3B8',
  double: '#64748B',
  cleaved: '#EF4444',
  formed: '#10B981',
}

export const REACTION_COLORS = {
  cleavage: '#EF4444',
  formation: '#10B981',
}

export const MECHANISM_DETAILS: Record<
  number,
  {
    id: ReactionMechanismType
    name: string
    subtitle: string
    cleavageFormula: string
    ruleTip: string
    is18OSSupported?: boolean
    hasSubstrateVariant?: boolean
  }
> = {
  0: {
    id: 'esterification',
    name: '1. 酯化与酯的水解机制',
    subtitle: '酸脱羟基 (-OH) 醇脱氢 (-H)',
    cleavageFormula: 'CH₃COOH + CH₃CH₂¹⁸OH ⇌ CH₃CO¹⁸OCH₂CH₃ + H₂O',
    ruleTip: '【18O 示踪法则】：乙酸提供 -OH，乙醇提供 -¹⁸OH；水中的 O 来自羧酸，酯中的 ¹⁸O 来自醇。水解时 C-O 单键断裂。',
    is18OSSupported: true,
  },
  1: {
    id: 'addition',
    name: '2. 烯烃加成与马氏规则',
    subtitle: 'π 键断裂与马氏规则',
    cleavageFormula: 'CH₃-CH=CH₂ + HCl → CH₃-CHCl-CH₃ (主产物)',
    ruleTip: '【马氏规则】：不对称烯烃亲电加成时，氢原子优先加到含氢较多的双键碳 (1号碳 =CH₂)，氯原子加到含氢较少的双键碳 (2号碳 =CH-)，主要生成 2-氯丙烷。',
    hasSubstrateVariant: true,
  },
  2: {
    id: 'oxidation',
    name: '3. 醇的催化氧化机制',
    subtitle: 'α-H 条件与脱氢氧化',
    cleavageFormula: '2CH₃CH₂OH + O₂ → 2CH₃CHO + 2H₂O (Cu, Δ)',
    ruleTip: '【α-H 必需条件】：断裂 O-H 键与 α-C 上的 C-H 键。伯醇氧化为醛，仲醇氧化为酮，叔醇无 α-H 无法被催化氧化！',
    hasSubstrateVariant: true,
  },
  3: {
    id: 'elimination',
    name: '4. 卤代烃/醇的消去机制',
    subtitle: 'C-X/C-OH 键与 β-H 断裂',
    cleavageFormula: 'CH₃CH₂CHBrCH₃ + NaOH → CH₃CH=CHCH₃ + NaBr + H₂O (醇溶液, Δ)',
    ruleTip: '【扎伊采夫规则】：消去反应断裂 C-Br 键及 β-C 上的 C-H 键；氢优先从含氢较少的 β-C (3号碳) 上脱去，主产物为 2-丁烯。',
  },
  4: {
    id: 'peptide',
    name: '5. 肽键生成与水解机制',
    subtitle: 'C-N 键形成与切断水解',
    cleavageFormula: 'H₂N-CH₂-COOH + H₂N-CH(CH₃)-COOH ⇌ 二肽 + H₂O',
    ruleTip: '【肽键断裂】：羧基与氨基脱水生成 -CO-NH- (肽键)；水解时在 -CO-NH- 中的 C-N 单键处切断。',
  },
  5: {
    id: 'phenol',
    name: '6. 酚羟基邻对位活化机制',
    subtitle: '酚羟基邻对位活化断 C-H (取代与缩聚)',
    cleavageFormula: 'C₆H₅OH + 3Br₂ → 2,4,6-三溴苯酚↓ + 3HBr',
    ruleTip: '【酚羟基活化】：-OH 的推电子共轭效应活化苯环邻、对位 (2,4,6位) C-H 键，极易与浓溴水发生三取代生成白色沉淀，或与 HCHO 在酸/碱催化下发生加成缩聚。',
  },
}
