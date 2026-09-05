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
    id: 'addition',
    name: '烯烃加成与马氏规则',
    subtitle: 'π 键断裂与马氏规则',
    cleavageFormula: 'CH₃-CH=CH₂ + HCl → CH₃-CHCl-CH₃ (主产物)',
    ruleTip: '【马氏规则】：不对称烯烃亲电加成时，氢原子优先加到含氢较多的双键碳 (1号碳 =CH₂)，氯原子加到含氢较少的双键碳 (2号碳 =CH-)，主要生成 2-氯丙烷。',
    hasSubstrateVariant: true,
  },
  1: {
    id: 'elimination',
    name: '卤代烃消去与水解取代',
    subtitle: 'C-X/C-OH 键与 β-H 断裂',
    cleavageFormula: 'CH₃CH₂CHBrCH₃ + NaOH → CH₃CH=CHCH₃ + NaBr + H₂O (醇溶液, Δ)',
    ruleTip: '【扎伊采夫规则】：消去反应断裂 C-Br 键及 β-C 上的 C-H 键；氢优先从含氢较少的 β-C (3号碳) 上脱去，主产物为 2-丁烯。水溶液中则发生取代水解生成 2-丁醇。',
  },
  2: {
    id: 'oxidation',
    name: '醇的催化氧化机制',
    subtitle: 'α-H 条件与脱氢氧化',
    cleavageFormula: '2CH₃CH₂OH + O₂ → 2CH₃CHO + 2H₂O (Cu, Δ)',
    ruleTip: '【α-H 必需条件】：断裂 O-H 键与 α-C 上的 C-H 键。伯醇氧化为醛，仲醇氧化为酮，叔醇无 α-H 无法被催化氧化！',
    hasSubstrateVariant: true,
  },
  3: {
    id: 'esterification',
    name: '酯化与酯的水解机制',
    subtitle: '酸脱羟基 (-OH) 醇脱氢 (-H)',
    cleavageFormula: 'CH₃COOH + CH₃CH₂¹⁸OH ⇌ CH₃CO¹⁸OCH₂CH₃ + H₂O',
    ruleTip: '【18O 示踪法则】：乙酸脱去羟基 (-OH)，乙醇脱去氢原子 (-H)；水中的 O 全部来自羧酸，乙酸乙酯中的 ¹⁸O 全部来自乙醇。水解时断裂 C-O 单键。',
    is18OSSupported: true,
  },
  4: {
    id: 'phenol',
    name: '酚羟基邻对位活化机制',
    subtitle: '酚羟基邻对位活化断 C-H (取代与缩聚)',
    cleavageFormula: 'C₆H₅OH + 3Br₂ → 2,4,6-三溴苯酚↓ + 3HBr',
    ruleTip: '【酚羟基活化】：-OH 的推电子共轭效应活化苯环邻、对位 (2,4,6位) C-H 键，极易与浓溴水发生三取代生成白色沉淀，或与 HCHO 在酸/碱催化下发生加成缩聚。',
  },
  5: {
    id: 'peptide',
    name: '肽键生成与水解机制',
    subtitle: 'C-N 键形成与切断水解',
    cleavageFormula: 'H₂N-CH₂-COOH + H₂N-CH(CH₃)-COOH ⇌ 二肽 + H₂O',
    ruleTip: '【肽键断裂】：羧基与氨基脱水生成 -CO-NH- (肽键)；水解时在 -CO-NH- 中的 C-N 单键处切断。',
  },
}

export const CONTRAST_MATRICES = [
  {
    title: '溶剂竞争：消去反应 vs 水解取代',
    reactionA: '消去：2-溴丁烷 + NaOH 醇溶液加热 → 2-丁烯 (主产物) + NaBr + H₂O',
    reactionB: '取代：2-溴丁烷 + NaOH 水溶液加热 → 2-丁醇 + NaBr',
    memoryTip: '口诀：“醇出双键水出醇”。醇溶液强碱促消去，扎伊采夫少氢脱氢。',
  },
  {
    title: '断键位点：酯化脱水 vs 酯基水解',
    reactionA: '酯化：酸脱羟基 (-OH) 醇脱氢 (-H)，切断羧基 C-O 键生成酯与水',
    reactionB: '水解：酸性或碱性切断酯基 C-O 单键 (非 C=O)，加水还原为酸与醇',
    memoryTip: '口诀：“酸脱羟基醇脱氢，水断单键定去向”。¹⁸O 示踪进入酯基醚氧位。',
  },
  {
    title: '氧化前提：伯醇/仲醇 vs 叔醇',
    reactionA: '能氧化：伯醇 (-CH₂OH) 氧化为醛；仲醇 (-CH(OH)-) 氧化为酮',
    reactionB: '不氧化：叔醇 (—C(OH)R₂ / 连羟基碳上无 H)，催化加热不被氧化',
    memoryTip: '口诀：“相连碳上找氢原子，双氢成醛单氢酮，无氢不反应”。',
  },
  {
    title: '新高考拓展：马氏加成 vs 反马氏信息题',
    reactionA: '经典亲电加成：H 加在含 H 多的双键碳上 (仲碳正离子中间体稳定)',
    reactionB: '过氧化物存在：自由基机理，Br 加在含 H 多的双键碳上 (反马氏)',
    memoryTip: '口诀：“无氧马氏 H 多多，有氧反马 Br 换位”。高考高频信息转化题。',
  },
]

export const GAOKAO_ADVANCED_TIPS = [
  {
    title: '新高考过渡金属催化循环破译 3 原则',
    points: [
      '① 判角色：循环全程存在且质量不变为催化剂；进环为反应物，出环为生成物；中途产生又耗尽为中间体。',
      '② 判价态：氧化加成使金属中心价态升高 (+2)，还原消除使价态降低 (-2)，配体交换价态不变。',
      '③ 判决速步：全历程中势能过渡态最高、活化能 Ea 最大的基元步骤为决速步 (RDS)。',
    ],
  },
  {
    title: '陌生信息反应“标号-断键-拼合”通法',
    points: [
      '① 标骨架号：将信息反应物与生成物各碳原子标注 1,2,3... 编号，找出不变的母体碳链。',
      '② 定断键点：比对前后结构，用虚线标出反应中断裂的旧键与新生成的共价键。',
      '③ 极性对接：寻找部分正电中心 (如羰基碳 δ+) 与部分负电进攻基团 (如 α-C⁻ / NH₂)，精准对接拼装成环。',
    ],
  },
]

export const MECHANISM_TEACHING_GUIDES: Record<
  number,
  {
    condition: string
    coreQuestion: string
    observationGuide: string
  }
> = {
  0: {
    condition: '室温或催化加压，非极性溶剂，无过氧化物环境',
    coreQuestion: 'HCl 中的 H⁺ 优先加在 1号碳 (=CH₂) 还是 2号碳 (=CH-)？为什么？',
    observationGuide: '点击【断键过渡】观察 π 键打开，H⁺ 加在含氢较多的 1号碳上，形成能量更低、更稳定的仲碳正离子中间体。',
  },
  1: {
    condition: '强碱性环境 (NaOH)，加热共热。注意区分【醇溶液】与【水溶液】！',
    coreQuestion: '2-溴丁烷主要脱去 1号碳还是 3号碳上的氢原子？切换为水溶液会发生什么？',
    observationGuide: '观察 NaOH 醇溶液优先脱去含氢较少的 3号 β-C 上的氢生成 2-丁烯；切换【水溶液/取代】观察 -OH 直接取代 Br 成醇。',
  },
  2: {
    condition: 'Cu 或 Ag 催化剂，加热 (200~300℃)，空气或氧气',
    coreQuestion: '醇催化氧化的微观本质是什么？为什么叔丁醇无法被催化氧化？',
    observationGuide: '观察断键必须同时断裂 O-H 键和 α-C 上的 C-H 键；切换至【叔丁醇反例】可观察到 α-C 无氢脱出导致反应终止。',
  },
  3: {
    condition: '浓硫酸催化、加热沸水浴 (回流防挥发，饱和碳酸钠洗涤除酸除醇降溶度)',
    coreQuestion: '水分子中的氧原子到底来自乙酸还是来自乙醇？',
    observationGuide: '点击【断键过渡】观察乙酸羧基脱去 -OH、乙醇脱去 -H，粉色 ¹⁸O 氧原子完整保留进入乙酸乙酯。',
  },
  4: {
    condition: '室温浓溴水 (无需催化剂)；酸或碱催化与甲醛缩聚',
    coreQuestion: '为什么苯酚比苯更容易发生三取代？酚羟基对苯环起了什么作用？',
    observationGuide: '观察酚羟基孤对电子与苯环形成 p-π 共轭，显著活化邻位 (2,6位) 和对位 (4位) 的 C-H 键。',
  },
  5: {
    condition: '缩合需脱水剂/催化剂；水解需稀酸或稀碱催化加热',
    coreQuestion: '多肽或蛋白质完全水解时，切断的化学键位点在哪里？',
    observationGuide: '观察氨基酸羧基与氨基脱水拼合形成酰胺键 (-CO-NH-)，水解时水分子直接切断 C-N 单键。',
  },
}

export function getMechanismQuantities(
  mechanism: number,
  stage: number,
  show18O: number,
  useTertiary: number,
  solventMode: number = 0
) {
  const stageLabels = [
    '基态反应物 (分子完整)',
    '断键过渡态 ✂ (吸热达能垒最高点)',
    '产物已生成 ✓ (成键放热达稳定态)',
  ]
  const stageNames = ['旧化学键完整', '旧键断裂/新键形成中', '稳态终产物生成']

  switch (mechanism) {
    case 0: // addition
      return [
        { label: '反应历程阶段', value: stageLabels[stage], unit: stageNames[stage] },
        { label: '马氏规则加成', value: 'H 加在 1号碳 (H多)', unit: '仲碳正离子更稳定' },
        { label: '断键类型', value: '断裂 π 键', unit: '保持 σ 键骨架' },
        { label: '主产物选择性', value: '2-氯丙烷 (>90%)', unit: '1-氯丙烷为次产物' },
      ]
    case 1: // elimination
      return [
        { label: '反应历程阶段', value: stageLabels[stage], unit: stageNames[stage] },
        { label: '反应溶剂条件', value: solventMode === 1 ? 'NaOH 水溶液 (取代)' : 'NaOH 醇溶液 (消去)', unit: solventMode === 1 ? '水解生成 2-丁醇' : '消去生成 2-丁烯' },
        { label: '扎伊采夫选择性', value: solventMode === 1 ? '羟基亲核取代' : '脱 3号碳 (H较少)', unit: solventMode === 1 ? '无消去产物' : '2-丁烯占比 80%' },
        { label: '切断化学键', value: solventMode === 1 ? '切断 C-Br 单键' : '切断 C-Br 与 β-C-H', unit: '醇出双键水出醇' },
      ]
    case 2: // oxidation
      return [
        { label: '反应历程阶段', value: stageLabels[stage], unit: stageNames[stage] },
        { label: '底物类型', value: useTertiary === 1 ? '叔丁醇 (叔醇)' : '乙醇 (伯醇)', unit: useTertiary === 1 ? '无 α-H' : '含 2个 α-H' },
        { label: '断键要求', value: 'O-H 键 + α-C-H 键', unit: '共失 2H 氧化为 C=O' },
        { label: '反应活性', value: useTertiary === 1 ? '❌ 无法催化氧化' : '✓ 氧化为乙醛', unit: 'Cu/Δ 催化脱氢' },
      ]
    case 3: // esterification
      return [
        { label: '反应历程阶段', value: stageLabels[stage], unit: stageNames[stage] },
        { label: '断键成键特征', value: '酸脱羟基 醇脱氢', unit: 'C-O 单键切断' },
        { label: '¹⁸O 示踪状态', value: show18O === 1 ? '示踪高亮开启' : '常规模式', unit: '进入酯分子' },
        { label: '可逆平衡转化率', value: '约 67%', unit: '需浓硫酸吸水催化' },
      ]
    case 4: // phenol
      return [
        { label: '反应历程阶段', value: stageLabels[stage], unit: stageNames[stage] },
        { label: '基团活化效应', value: '酚羟基推电子共轭', unit: '活化邻对位 (2,4,6位)' },
        { label: '断键位置', value: '邻、对位 C-H 键', unit: '亲电取代/缩聚' },
        { label: '特征沉淀', value: '2,4,6-三溴苯酚↓', unit: '白色不溶沉淀' },
      ]
    case 5: // peptide
      return [
        { label: '反应历程阶段', value: stageLabels[stage], unit: stageNames[stage] },
        { label: '核心官能团', value: '肽键 / 酰胺键', unit: '-CO-NH-' },
        { label: '水解切断键', value: 'C-N 单键切断', unit: '消耗 1 mol H₂O' },
        { label: '两性电离状态', value: '酸性成盐 / 碱性成盐', unit: '随介质 pH 变化' },
      ]
    default:
      return []
  }
}

export function getMechanismFormulas(
  mechanism: number,
  stage: number,
  _show18O: number,
  useTertiary: number,
  solventMode: number = 0
) {
  switch (mechanism) {
    case 0: // addition
      if (stage === 0) {
        return [
          {
            name: '反应物：不对称烯烃与卤化氢',
            latex: '\\mathrm{CH_3{-}CH{=}CH_2 + HCl}',
            condition: '常温, 无过氧化物',
            note: '丙烯 1号碳含 2个 H，2号碳仅含 1个 H，存在不对称电荷极性。',
          },
        ]
      } else if (stage === 1) {
        return [
          {
            name: '亲电加成过渡态与仲碳正离子',
            latex: '\\begin{aligned} &\\mathrm{CH_3{-}CH{=}CH_2 + H^+} \\longrightarrow \\mathrm{CH_3{-}\\overset{+}{C}H{-}CH_3} \\\\[2pt] &\\quad (\\text{中间体：更稳定的仲碳正离子}) \\end{aligned}',
            condition: '马氏定向：H 加在 H 多的碳上',
            note: '断裂 C=C 中的 π 键，仲碳正离子受两个烷基供电子诱导效应稳定。',
          },
        ]
      } else {
        return [
          {
            name: '亲电加成总反应方程式',
            latex: '\\begin{aligned} &\\mathrm{CH_3{-}CH{=}CH_2 + HCl} \\longrightarrow \\\\[2pt] &\\quad \\mathrm{CH_3{-}CHCl{-}CH_3 \\quad (\\text{主产物 2-氯丙烷})} \\end{aligned}',
            condition: '主产物选择性 > 90%',
            note: '遵循马氏规则，若在过氧化物催化下则发生反马氏加成生成 1-氯丙烷。',
          },
        ]
      }

    case 1: // elimination
      if (solventMode === 1) {
        return [
          {
            name: '卤代烃水解反应 (取代反应)',
            latex: '\\begin{aligned} &\\mathrm{CH_3CH_2CHBrCH_3 + NaOH} \\xrightarrow{H_2O, \\Delta} \\\\[2pt] &\\quad \\mathrm{CH_3CH_2CH(OH)CH_3 + NaBr} \\end{aligned}',
            condition: 'NaOH 水溶液加热',
            note: '水溶液中 -OH 亲核取代 Br，断裂 C-Br 单键生成 2-丁醇 (水出醇)。',
          },
        ]
      }
      if (stage === 0) {
        return [
          {
            name: '反应物：2-溴丁烷',
            latex: '\\mathrm{CH_3CH_2CHBrCH_3 + NaOH}',
            condition: 'NaOH 醇溶液, Δ',
            note: '2号为 α-C，1号与 3号碳为 β-C (1号有 3H，3号仅 2H)。',
          },
        ]
      } else if (stage === 1) {
        return [
          {
            name: '扎伊采夫消去过渡态',
            latex: '\\begin{aligned} &\\mathrm{CH_3CH_2CHBrCH_3} \\xrightarrow[\\Delta]{\\text{NaOH/醇}} \\mathrm{CH_3CH{=}CHCH_3} \\\\[2pt] &\\quad (\\text{断裂 C-Br 键与 3号碳上的 } \\beta\\text{-C-H 键}) \\end{aligned}',
            condition: '断裂 C-Br 键与 3号碳上的 β-C-H 键',
            note: '氢优先从含氢较少的 3号 β-C 上脱去，形成双键更稳定的多取代烯烃。',
          },
        ]
      } else {
        return [
          {
            name: '消去反应总方程式与产物分布',
            latex: '\\begin{aligned} &\\mathrm{CH_3CH_2CHBrCH_3 + NaOH} \\xrightarrow{\\text{醇}, \\Delta} \\\\[2pt] &\\quad \\mathrm{CH_3CH{=}CHCH_3 + NaBr + H_2O} \\end{aligned}',
            condition: '主产物 2-丁烯 (80%), 次产物 1-丁烯 (20%)',
            note: '醇出双键 (消去)，水出醇 (取代)。扎伊采夫规则决定双键主产物。',
          },
        ]
      }

    case 2: // oxidation
      if (useTertiary === 1) {
        return [
          {
            name: '反例分子：2-甲基-2-丙醇 (叔丁醇)',
            latex: '\\begin{aligned} &\\mathrm{(CH_3)_3C{-}OH + O_2} \\xrightarrow{Cu, \\Delta} \\text{不反应} \\\\[2pt] &\\quad (\\alpha\\text{-C 无氢原子，无法发生脱氢氧化}) \\end{aligned}',
            condition: '无 α-H 条件限制',
            note: '与 -OH 相连的 α-C 上连有三个 -CH₃，无任何 C-H 键，无法发生脱氢氧化！',
          },
        ]
      }
      if (stage === 0) {
        return [
          {
            name: '反应物：乙醇 (伯醇)',
            latex: '\\mathrm{2CH_3CH_2OH + O_2}',
            condition: 'Cu 或 Ag 催化',
            note: 'α-C 上连有 2 个活性氢原子，满足催化氧化前提。',
          },
        ]
      } else if (stage === 1) {
        return [
          {
            name: '催化脱氢过渡态',
            latex: '\\begin{aligned} &\\mathrm{CH_3CH_2OH} \\xrightarrow[\\Delta]{-2[H]} \\mathrm{CH_3CHO} \\\\[2pt] &\\quad (\\text{同时切断 O-H 键与 } \\alpha\\text{-C-H 键}) \\end{aligned}',
            condition: '同时切断 O-H 键与 α-C-H 键',
            note: '脱去的 2 个氢与催化剂生成的 CuO 作用还原出 Cu 并生成 H₂O。',
          },
        ]
      } else {
        return [
          {
            name: '醇催化氧化总反应方程式',
            latex: '\\begin{aligned} &\\mathrm{2CH_3CH_2OH + O_2} \\xrightarrow{Cu, \\Delta} \\\\[2pt] &\\quad \\mathrm{2CH_3CHO + 2H_2O} \\end{aligned}',
            condition: 'Cu/Δ 加热回流',
            note: '伯醇氧化为醛 (继续氧化可得酸)，仲醇氧化为酮，叔醇无法氧化。',
          },
        ]
      }

    case 3: // esterification
      if (stage === 0) {
        return [
          {
            name: '反应物分子结构与示踪物',
            latex: '\\mathrm{CH_3COOH + CH_3CH_2^{18}OH}',
            condition: '浓 H₂SO₄, Δ',
            note: '羧基提供亲电羰基碳，醇羟基含 18O 同位素标记。',
          },
        ]
      } else if (stage === 1) {
        return [
          {
            name: '断键过渡态机理 (酸脱羟基、醇脱氢)',
            latex: '\\begin{aligned} &\\mathrm{CH_3CO{-}OH + H{-}^{18}OCH_2CH_3} \\\\[2pt] &\\quad \\xrightarrow{\\text{酸脱羟基 醇脱氢}} \\mathrm{CH_3CO^{18}OCH_2CH_3 + H_2O} \\end{aligned}',
            condition: '酸脱羟基 (-OH) 醇脱氢 (-H)',
            note: '切断羧基中的 C-O 单键与醇中的 O-H 键，形成水分子前体。',
          },
        ]
      } else {
        return [
          {
            name: '酯化平衡总反应方程式',
            latex: '\\begin{aligned} &\\mathrm{CH_3COOH + CH_3CH_2^{18}OH} \\\\[2pt] &\\quad \\xrightleftharpoons[\\Delta]{\\text{浓}H_2SO_4} \\mathrm{CH_3CO^{18}OCH_2CH_3 + H_2O} \\end{aligned}',
            condition: '浓 H₂SO₄ 吸水并催化, 沸水浴加热',
            note: '18O 全部进入乙酸乙酯，生成的水分子完全不含 18O。水解时断裂 C-O 键恢复。',
          },
        ]
      }

    case 4: // phenol (三阶段动态同步)
      if (stage === 0) {
        return [
          {
            name: '反应物：苯酚与浓溴水',
            latex: '\\mathrm{C_6H_5OH + 3Br_2}',
            condition: '常温, 过量浓溴水',
            note: '酚羟基孤对电子与苯环大 π 键形成 p-π 共轭，邻对位电子云密度极高。',
          },
        ]
      } else if (stage === 1) {
        return [
          {
            name: '邻对位活化与断键过渡态',
            latex: '\\begin{aligned} &\\mathrm{C_6H_5OH + 3Br_2} \\xrightarrow{\\text{活化邻对位}} \\\\[2pt] &\\quad [\\text{断裂 2,4,6-C-H 键与 Br-Br 键}] \\end{aligned}',
            condition: '断裂 3 个 C-H 键与 3 个 Br-Br 键',
            note: '无需催化剂即可在 2,4,6 位发生多重亲电取代。',
          },
        ]
      } else {
        return [
          {
            name: '三取代总反应方程式 (白色沉淀)',
            latex: '\\begin{aligned} &\\mathrm{C_6H_5OH + 3Br_2} \\longrightarrow \\\\[2pt] &\\quad \\mathrm{C_6H_2Br_3OH\\downarrow + 3HBr} \\quad [\\text{白色沉淀}] \\end{aligned}',
            condition: '生成 2,4,6-三溴苯酚白色沉淀',
            note: '酚羟基强活化效应的标志性反应，反应极其灵敏，用于苯酚定性检验。',
          },
        ]
      }

    case 5: // peptide (三阶段动态同步)
      if (stage === 0) {
        return [
          {
            name: '反应物：氨基酸分子 (甘氨酸与丙氨酸)',
            latex: '\\mathrm{H_2N{-}CH_2{-}COOH + H_2N{-}CH(CH_3){-}COOH}',
            condition: '两性分子前体',
            note: '分子中同时含有碱性氨基 (-NH₂) 与酸性羧基 (-COOH)。',
          },
        ]
      } else if (stage === 1) {
        return [
          {
            name: '脱水缩合与断键过渡态',
            latex: '\\begin{aligned} &\\mathrm{Gly{-}CO{-}OH + H{-}NH{-}Ala} \\xrightarrow{\\text{脱水缩合}} \\\\[2pt] &\\quad [\\text{切断羧基 C-O 键与氨基 N-H 键}] \\end{aligned}',
            condition: '羧基脱 -OH 与氨基脱 -H',
            note: '脱去一分子水形成连接两个氨基酸残基的 -CO-NH- 肽键。',
          },
        ]
      } else {
        return [
          {
            name: '肽键生成与水解切断总反应',
            latex: '\\begin{aligned} &\\mathrm{H_2N{-}CH_2{-}COOH + H_2N{-}CH(CH_3){-}COOH} \\\\[2pt] &\\quad \\xrightleftharpoons[\\text{稀酸水解}]{\\text{脱水缩合}} \\mathrm{H_2N{-}CH_2{-}CONH{-}CH(CH_3){-}COOH + H_2O} \\end{aligned}',
            condition: '酸性水解切断 C-N 单键',
            note: '水解时在 -CO-NH- 处的 C-N 单键切断，加水复原为氨基酸。',
          },
        ]
      }

    default:
      return []
  }
}

export function getMechanismWarnings(
  mechanism: number,
  _stage: number,
  show18O: number,
  useTertiary: number,
  solventMode: number = 0
) {
  const warnings: { text: string; level: 'danger' | 'warning' | 'info' }[] = []

  if (mechanism === 0) {
    warnings.push({
      text: '【马氏规则高考易错】：氢原子优先加到含氢较多的不饱和双键碳上；但在“过氧化物存在”的信息题中，会发生反马氏加成！',
      level: 'warning',
    })
  } else if (mechanism === 1) {
    if (solventMode === 1) {
      warnings.push({
        text: '【水溶液取代机理】：NaOH 水溶液加热发生取代生成醇；检验卤素离子前必须先加足量稀硝酸酸化！',
        level: 'warning',
      })
    } else {
      warnings.push({
        text: '【醇溶液消去机理】：NaOH 醇溶液加热发生消去脱 HX 生成烯烃；遵循扎伊采夫规则生成更稳定的多取代双键。',
        level: 'info',
      })
      warnings.push({
        text: '【消去反应结构前提】：只有相邻碳原子 (β-C) 上含有氢原子的卤代烃才能发生消去反应！(如 CH₃Br、(CH₃)₃CCH₂Br 无法消去)',
        level: 'danger',
      })
    }
  } else if (mechanism === 2) {
    if (useTertiary === 1) {
      warnings.push({
        text: '【高考致命失分陷阱】：2-甲基-2-丙醇 (叔丁醇) 与 -OH 相连的碳原子上无氢原子 (无 α-H)，绝不能被催化氧化！',
        level: 'danger',
      })
    } else {
      warnings.push({
        text: '【α-H 数量与产物级别】：伯醇 (-CH₂OH) 氧化为醛；仲醇 (-CHOH-) 氧化为酮；无 α-H 的醇无法氧化。',
        level: 'info',
      })
    }
  } else if (mechanism === 3) {
    if (show18O === 1) {
      warnings.push({
        text: '【高考示踪必考结论】：水中的 O 来自羧酸，乙酸乙酯中的 ¹⁸O 来自乙醇！水中绝不含 ¹⁸O。',
        level: 'info',
      })
    }
    warnings.push({
      text: '【反应可逆性与试剂】：浓硫酸作催化剂和吸水剂；冷凝管垂直回流；饱和 Na₂CO₃ 吸收挥发的酸与醇，降低酯溶解度。',
      level: 'warning',
    })
  } else if (mechanism === 4) {
    warnings.push({
      text: '【邻对位选择性】：酚羟基与苯环共轭使邻对位电子云密度大增；与浓溴水反应必须过量才能生成白色沉淀，苯酚溶液呈弱酸性。',
      level: 'info',
    })
  } else if (mechanism === 5) {
    warnings.push({
      text: '【水解断键位点】：水解切断肽键中的 C-N 单键；n 个氨基酸形成链状肽需切断 (n-1) 个肽键，消耗 (n-1) 分子水。',
      level: 'info',
    })
  }

  return warnings
}

export function getMechanismGaokaoPoints(mechanism: number) {
  switch (mechanism) {
    case 0:
      return [
        { text: '马氏规则：不对称烯烃亲电加成，H⁺ 加在含 H 多的双键碳上，X 加在含 H 少的双键碳上。', importance: 'core' as const },
        { text: '微观动因：反应经过更稳定的仲碳正离子中间体 (超共轭与诱导效应稳定)。', importance: 'hard' as const },
        { text: '信息反应警惕：过氧化物存在下发生自由基反马氏加成。', importance: 'gaokao' as const },
      ]
    case 1:
      return [
        { text: '溶剂区分口诀：“醇出双键 (消去)，水出醇 (取代)”。', importance: 'core' as const },
        { text: '扎伊采夫规则：氢优先从含氢较少的 β-C 上脱去，生成热力学更稳定的共轭或多取代烯。', importance: 'hard' as const },
        { text: '卤素检验步骤：取水解后的水层清液少许 → 加足量稀 HNO₃ 酸化至酸性 → 滴加 AgNO₃ 溶液。', importance: 'gaokao' as const },
      ]
    case 2:
      return [
        { text: '醇催化氧化判定口诀：连羟基的碳上有两个氢得醛，有一个氢得酮，无氢不反应。', importance: 'core' as const },
        { text: '催化剂角色：Cu 先被 O₂ 氧化成黑色的 CuO，再被醇还原为红色的 Cu，质量与性质不变。', importance: 'gaokao' as const },
      ]
    case 3:
      return [
        { text: '酯化反应历程：羧酸提供羟基 (-OH)，醇提供氢 (-H)，生成水和酯。', importance: 'core' as const },
        { text: '饱和 Na₂CO₃ 溶液三作用：中和挥发乙酸、溶解挥发乙醇、降低乙酸乙酯溶解度促分层。', importance: 'gaokao' as const },
        { text: '防倒吸导管口位于液面之上，切不可伸入液面以下。', importance: 'basic' as const },
      ]
    case 4:
      return [
        { text: '苯酚与浓溴水反应生成 2,4,6-三溴苯酚白色沉淀，极灵敏，常用于酚的定性检验。', importance: 'gaokao' as const },
        { text: '酚醛树脂合成：酸催化苯酚过量得线型；碱催化甲醛过量得体型网状。', importance: 'hard' as const },
      ]
    case 5:
      return [
        { text: '肽键的结构简式为 -CO-NH-，两端分别为氨基端与羧基端。', importance: 'basic' as const },
        { text: '蛋白质水解断裂 C-N 单键，加水生成氨基酸；酸性介质中氨基成盐，碱性介质中羧基成盐。', importance: 'core' as const },
      ]
    default:
      return []
  }
}

export function getMechanismMnemonic(mechanism: number) {
  switch (mechanism) {
    case 0:
      return '双键不对称加成，氢向含氢多处生。仲碳正离子更稳，信息过氧反马成。'
    case 1:
      return '醇出双键水出醇，消去必须有贝氢。采夫规则择少脱，酸化方可验银银。'
    case 2:
      return '找准阿尔法碳上氢，双氢成醛单氢酮。若是叔醇无氢在，铜热氧气亦无功。'
    case 3:
      return '酸脱羟基醇脱氢，十八标记入酯精。碳酸钠液三功效，液面之上防倒吸。'
    case 4:
      return '酚羟活化邻对位，常温溴水三取代。白色沉淀显灵敏，缩聚甲醛树脂成。'
    case 5:
      return '羧基氨基脱水联，酰胺肽键链相连。水解切断碳氮键，水分子配恢复原。'
    default:
      return '有机反应重断键，电荷极性看分明。'
  }
}
