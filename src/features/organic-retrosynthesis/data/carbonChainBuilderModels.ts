import type { RetrosynthesisModelData } from '../types'

/**
 * 碳链骨架构建模型四：高考推断 C-C 键构建 (羟醛缩合与逆合成切断)
 */
export const MODEL_CARBON_CARBON_BUILDER: RetrosynthesisModelData = {
  id: 'carbon-carbon-builder',
  title: '模型四：高考推断 C-C 键构建 (羟醛缩合与逆合成切断)',
  subtitle: 'α,β-不饱和酮双键切断与碱催化 Aldol 碳链增长',
  targetMolecule: '1,3-二苯基-2-丙烯-1-酮',
  targetFormula: 'C₁₅H₁₂O',
  difficulty: '高考冲刺',
  description:
    '高考有机推断常考 C-C 键切断与增长。通过逆合成切断法定位双键两侧 C-C 键，推断前体为苯甲醛与苯乙酮，在碱催化下发生羟醛缩合 (Aldol Condensation)。',
  coreStrategy:
    '逆向切断 α,β-不饱和酮的 C=C 双键，得到两分子羰基化合物前体；正向合成利用 NaOH 碱催化羟醛缩合脱水生成目标产物。',
  protectionKeyPoints: [
    'α,β-不饱和羰基化合物切断点位于 C=C 双键处',
    '切断后产生 [Ph-CHO] 亲电碳与 [Ph-CO-CH₂]⁻ 亲核碳合成子碎片',
    '控制碱浓度与温度，防止苯乙酮自身缩合等多聚副反应发生',
  ],
  unprotectedCrashDemo: {
    warningTitle: '🚨 羟醛缩合副反应风险（自缩合与多聚）',
    consequence: '苯乙酮分子含有活泼 α-H，若碱浓度过高或苯甲醛不足，苯乙酮会发生自身缩合反应生成副产物 dypnone，降低目标查尔酮产率。',
    solution: '控制苯甲醛过量并滴加苯乙酮，低温弱碱环境下维持高选择性反应。',
  },
  infoReaction: {
    name: '羟醛缩合反应 (Aldol Condensation)',
    equation: 'Ph-CHO + CH₃-CO-Ph → Ph-CH=CH-CO-Ph + H₂O',
    mechanismDesc: 'α-氢在碱作用下形成烯醇负离子，亲核加成醛羰基，随后受热脱水共轭生成 α,β-不饱和酮。',
  },
  steps: [
    {
      stepIndex: 1,
      title: '第 1 步：目标分子 C=C 切断与合成子逆推',
      description: '在目标分子中定位 α,β-不饱和酮键，✂ 剪刀切断双键，推导两个羰基前体。',
      reactants: [{ name: '1,3-二苯基-2-丙烯-1-酮', formula: 'C₁₅H₁₂O' }],
      products: [
        { name: '苯甲醛 (前体 1)', formula: 'C₇H₆O' },
        { name: '苯乙酮 (前体 2)', formula: 'C₈H₈O' },
      ],
      reagents: '逆向切断 (✂ C=C Disconnection)',
      protectionStatus: { isProtected: false },
      cutBond: {
        bondType: 'C=C 碳碳双键切断',
        positionDesc: 'α,β-不饱和双键',
        retroSynthon: '[Ph-CH]⁺ (亲电) + [CH-CO-Ph]⁻ (亲核)',
      },
      synthonPair: {
        electrophilicSynthon: '[Ph-CH=O] (亲电羰基碳 δ+)',
        nucleophilicSynthon: '[Ph-CO-CH₂]⁻ (亲核烯醇碳 δ-)',
        electrophilicReagent: '苯甲醛 (无 α-H)',
        nucleophilicReagent: '苯乙酮 (含活泼 α-H)',
      },
      atomEconomy: 92.0,
      fgiType: 'C=C 双键逆向切断',
      nodes: [
        {
          id: 'tm',
          label: '1,3-二苯基-2-丙烯-1-酮',
          formula: 'C₁₅H₁₂O',
          x: 420,
          y: 110,
          role: 'TM',
          isTarget: true,
          functionalGroups: [
            { name: 'α,β-不饱和双键', formula: '-CH=CH-', color: 'red', isReacting: true },
            { name: '羰基', formula: '-CO-', color: 'blue' },
          ],
        },
        {
          id: 'b1',
          label: '苯甲醛 (前体 1)',
          formula: 'C₇H₆O',
          x: 230,
          y: 350,
          role: 'precursor',
          badge: '亲电 Synthons',
          synthonCharge: '+ (亲电)',
          functionalGroups: [{ name: '醛基', formula: '-CHO (δ+)', color: 'red' }],
        },
        {
          id: 'b2',
          label: '苯乙酮 (前体 2)',
          formula: 'C₈H₈O',
          x: 610,
          y: 350,
          role: 'precursor',
          badge: '亲核 Synthons',
          synthonCharge: '- (亲核)',
          functionalGroups: [
            { name: '酮羰基', formula: '-CO-', color: 'blue' },
            { name: '活泼 α-H', formula: '-CH₃ (δ-)', color: 'amber' },
          ],
        },
      ],
      connections: [
        { from: 'tm', to: 'b1', label: '✂ 切断 C=C 双键 [Ph-CH]⁺', isDisconnection: true },
        { from: 'tm', to: 'b2', label: '✂ 释放亲核 α-碳 [CH₂-CO-Ph]⁻', isDisconnection: true },
      ],
    },
    {
      stepIndex: 2,
      title: '第 2 步：碱催化羟醛缩合 C-C 键增长与脱水',
      description: '在 10% NaOH 稀溶液中，苯乙酮 α-H 脱质子亲核加成苯甲醛，脱去 H₂O 形成 C=C 双键。',
      reactants: [
        { name: '苯甲醛', formula: 'C₇H₆O' },
        { name: '苯乙酮', formula: 'C₈H₈O' },
      ],
      products: [
        { name: '目标产物 (查尔酮)', formula: 'C₁₅H₁₂O' },
        { name: '水', formula: 'H₂O' },
      ],
      reagents: '10% NaOH / EtOH / 室温搅拌',
      protectionStatus: { isProtected: false },
      cutBond: null,
      atomEconomy: 92.0,
      fgiType: '羟醛缩合 (Aldol Condensation)',
      nodes: [
        {
          id: 'b1',
          label: '苯甲醛 (亲电受体)',
          formula: 'C₇H₆O',
          x: 230,
          y: 110,
          role: 'precursor',
          functionalGroups: [{ name: '醛基', formula: '-CHO', color: 'red', isReacting: true }],
        },
        {
          id: 'b2',
          label: '苯乙酮 (亲核供体)',
          formula: 'C₈H₈O',
          x: 610,
          y: 110,
          role: 'precursor',
          functionalGroups: [{ name: 'α-碳供体', formula: '-CH₃', color: 'amber', isReacting: true }],
        },
        {
          id: 'tm',
          label: '1,3-二苯基-2-丙烯-1-酮',
          formula: 'C₁₅H₁₂O',
          x: 420,
          y: 320,
          role: 'TM',
          isTarget: true,
          badge: 'C-C 键成链',
          functionalGroups: [
            { name: '共轭不饱和烯酮', formula: '-CH=CH-CO-', color: 'purple' },
          ],
        },
        {
          id: 'h2o',
          label: '副产物 H₂O 脱去',
          formula: 'H₂O',
          x: 420,
          y: 490,
          role: 'intermediate',
          badge: '脱水驱动共轭',
        },
      ],
      connections: [
        { from: 'b1', to: 'tm', label: '羰基亲核受体' },
        { from: 'b2', to: 'tm', label: 'α-C 进攻脱水' },
        { from: 'tm', to: 'h2o', label: '消除 H₂O' },
      ],
    },
  ],
}
