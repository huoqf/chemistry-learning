import type { ModelQuizData } from './types'

export const modelOrganicRetrosynthesis: ModelQuizData = {
  modelId: 'model-organic-retrosynthesis',
  scoringSteps: [
    {
      id: 'step-1',
      title: '步骤 1：目标分子的逆合成切断法 (Disconnection)',
      type: 'keywords',
      questionText:
        '在解热镇痛药贝诺酯 (Benorilate) 的逆合成分析中，首选切断的键是哪种化学键？写出切断点两侧生成的官能团前体名称。',
      correctAnswer: ['酯键', '碳氧酯键', '酚羟基', '羧基'],
      explanation:
        '【踩分点】：切断点为碳-氧酯键 (C-O 键)。逆推前体为水杨酸 (含酚羟基与羧基) 和对乙酰氨基酚 (含酚羟基与酰胺基)。',
    },
    {
      id: 'step-2',
      title: '步骤 2：多官能团分子的官能团保护 (Protection) 规范表达',
      type: 'keywords',
      questionText:
        '在含有碳碳双键和醇羟基的化合物中，若需用酸性 KMnO₄ 溶液将醇羟基氧化为羧基，为何必须先对双键进行 Protection？写出高频考点。',
      correctAnswer: ['双键被氧化', '强氧化剂', '选择性', '加成保护'],
      explanation:
        '【踩分点】：酸性 KMnO₄ 等强氧化剂会无选择性地同时氧化 C=C 双键与醇羟基。先将双键加加成 Br₂ (保护)，可实现醇羟基的选择性氧化。',
    },
    {
      id: 'step-3',
      title: '步骤 3：脱保护 (Deprotection) 步骤与反应条件规范',
      type: 'keywords',
      questionText:
        '利用乙二醇将醛基转化为环状缩醛保护后，在完成强还原剂 LiAlH₄ 反应后，应用什么试剂与条件脱去缩醛复原醛基？',
      correctAnswer: ['稀盐酸', '稀硫酸', 'H3O+', '加热', '水解'],
      explanation:
        '【踩分点】：环状缩醛在强碱与还原剂中稳定，但在稀酸 (H₃O⁺) 加热条件下发生逆反应水解，复原醛基并释放乙二醇。',
    },
  ],
  variantQuizzes: [
    {
      id: 'var-retro-1',
      yearProvince: '2024 全国高考真题卷',
      modelId: 'model-organic-retrosynthesis',
      title: '抗炎药物中间体的逆合成路线与官能团 Protection 剖析',
      contextDescription:
        '已知化合物 G (抗炎药中间体) 的合成路线中包含如下步骤：以 4-烯丙基酚为原料，经加成 Protection 转化为化合物 A，再与 CH₃I 反应生成 B，最后在 Zn 粉作用下得到产物 C。',
      questionText: '关于该合成路线中「加成 Br₂ Protection 与 Zn 粉脱溴」的作用，下列说法正确的是？',
      options: [
        {
          label: 'A',
          text: '第一步加成 Br₂ 是为了保护酚羟基不被氧化',
          isCorrect: false,
        },
        {
          label: 'B',
          text: '加成 Br₂ 可消除 C=C 双键不饱和性，防止后续碱性成醚反应中双键发生副反应',
          isCorrect: true,
        },
        {
          label: 'C',
          text: 'Zn 粉在乙醇中加热的作用是脱去酚羟基上的甲基',
          isCorrect: false,
        },
        {
          label: 'D',
          text: '该全合成路线的原子利用率为 100%',
          isCorrect: false,
        },
      ],
      modelAlignmentAnalysis:
        '【母题模型对齐】：考查高考有机大题高频考点「碳碳双键加溴 Protection 与 Zn 粉还原脱溴 Deprotection 策略」。',
      detailedExplanation:
        '4-烯丙基酚中 C=C 双键极为活泼，加 Br₂ 转化为饱和邻二溴化物 (Protection) 后，能在强碱下安全地将酚 -OH 甲基化成醚。随后用 Zn 粉发生 β-消去脱溴 (Deprotection) 重新建立 C=C 双键。',
      diagramType: 'organic-mechanism-diagram',
      diagramConfig: {
        mechanismType: 'haloalkane-elimination',
        title: '4-烯丙基酚双键加溴 Protection ➔ 碱性甲基化 ➔ Zn粉脱溴 Deprotection 逆合成图',
      },
    },
    {
      id: 'var-retro-2',
      yearProvince: '2023 山东高考真题卷',
      modelId: 'model-organic-retrosynthesis',
      title: 'Diels-Alder 环加成与乙二醇缩醛保护机理推断',
      contextDescription:
        '在复杂萜类化合物全合成中，利用 1,3-丁二烯与丙烯醛发生 [4+2] 环加成构建六元环，随后加入乙二醇和对甲苯磺酸 (p-TsOH) 进行加热回流。',
      questionText: '关于乙二醇在该反应中的 Protection 作用，下列推断错误的是？',
      options: [
        {
          label: 'A',
          text: '乙二醇与醛基生成环状缩醛，可防止下一步使用 LiAlH₄ 时醛基被还原',
          isCorrect: false,
        },
        {
          label: 'B',
          text: '生成的五元环状缩醛具有高度的耐碱性与耐亲核还原性',
          isCorrect: false,
        },
        {
          label: 'C',
          text: '脱去乙二醇 Protection 基团时，需加入 NaOH 浓溶液加热水解',
          isCorrect: true,
        },
        {
          label: 'D',
          text: '对甲苯磺酸在 Protection 步骤中充当酸催化剂',
          isCorrect: false,
        },
      ],
      modelAlignmentAnalysis:
        '【母题模型对齐】：考查高考有机大题「羰基/醛基的缩醛 protection 与酸水解 deprotection 条件」。',
      detailedExplanation:
        '缩醛基团在碱性条件下极其稳定，绝对不能用 NaOH 脱保护！脱去缩醛保护基复原醛基必须使用稀酸 (H₃O⁺) 加水解。故 C 选项错误。',
      diagramType: 'organic-mechanism-diagram',
      diagramConfig: {
        mechanismType: 'ester-cleavage',
        title: '醛基 + 乙二醇生成五元环状缩醛 Protection 与酸解 Deprotection 机理图',
      },
    },
    {
      id: 'var-retro-3',
      yearProvince: '2024 浙江高考真题',
      modelId: 'model-organic-retrosynthesis',
      title: '酚羟基苄基 (PhCH₂-) 保护与 H₂/Pd-C 氢解脱保护逆合成',
      contextDescription: '在多酚类天然产物全合成中，常选用苄氯 (PhCH₂Cl) 在 K₂CO₃ 存在下将酚 -OH 转化为苄醚进行保护。',
      questionText: '下列关于苄基保护与氢解脱保护的说法正确的是：',
      options: [
        { label: 'A', text: '苄醚在强碱性条件下极易水解开环', isCorrect: false },
        { label: 'B', text: '脱去苄基保护基时，可在常温常压下使用 H₂ 和 Pd/C 催化氢解', isCorrect: true },
        { label: 'C', text: '苄基保护的主要目的是提高酚羟基的酸性', isCorrect: false },
        { label: 'D', text: '苄氯与酚羟基的反应属于加成反应', isCorrect: false },
      ],
      modelAlignmentAnalysis: '【母题模型对齐】：苄基 (PhCH₂-) 为经典的酸碱双稳定保护基，脱除条件为极温和的 H₂/Pd-C 催化氢解生成甲苯 (PhCH₃) 和复原酚 -OH。',
      detailedExplanation: '苄醚结构耐强酸、耐强碱、耐氧化剂，能够保护酚 -OH 不受后续反应干扰。脱保护仅需使用 H₂/Pd-C 条件选择性切断 C-O 键生成甲苯。故 B 项正确。',
      diagramType: 'organic-mechanism-diagram',
      diagramConfig: {
        mechanismType: 'addition-markov',
        title: '酚羟基 + 苄氯生成苄醚 Protection 与 H₂/Pd-C 氢解 Deprotection 路线图',
      },
    },
    {
      id: 'var-retro-4',
      yearProvince: '2024 湖北高考真题',
      modelId: 'model-organic-retrosynthesis',
      title: '羰基与丙二硫醇生成缩硫醛保护及 Hg²⁺ 解保护',
      contextDescription: '已知在复杂酮类化合物合成中，常用 1,3-丙二硫醇和 BF₃·Et₂O 催化将羰基转化为五元/六元环状缩硫醛。',
      questionText: '下列关于缩硫醛 Protection 及其逆合成脱保护的说法正确的是：',
      options: [
        { label: 'A', text: '缩硫醛在强酸水溶液中可轻易水解还原为羰基', isCorrect: false },
        { label: 'B', text: '缩硫醛对强酸极度稳定，脱去保护基通常使用 HgCl₂ 或 I₂ 氧化水解', isCorrect: true },
        { label: 'C', text: '丙二硫醇与羰基的反应属于消去反应', isCorrect: false },
        { label: 'D', text: '缩硫醛中的碳原子为 sp 杂化', isCorrect: false },
      ],
      modelAlignmentAnalysis: '【母题模型对齐】：普通缩醛耐碱不耐酸，而缩硫醛既耐碱又耐酸，脱除必须依赖 Hg²⁺ 或 I₂ 与硫原子配位氧化脱保护。',
      detailedExplanation: '缩硫醛对强酸和强碱均具有极高稳定性，常用于强酸环境下的羰基保护。脱除时需加入 HgCl₂/CaCO₃ 或 I₂/H₂O 水解还原生成原羰基。B 项正确。',
      diagramType: 'organic-mechanism-diagram',
      diagramConfig: {
        mechanismType: 'alcohol-oxidation',
        title: '羰基 + 1,3-丙二硫醇生成缩硫醛 Protection 与 Hg²⁺ 氧化解保护图',
      },
    },
    {
      id: 'var-retro-5',
      yearProvince: '2023 全国甲卷',
      modelId: 'model-organic-retrosynthesis',
      title: '目标分子 (Target Molecule) 逆合成切断法 (Disconnection) 与合成树',
      contextDescription: '利用逆合成分析法 (Retrosynthetic Analysis) 拆解药物分子 M，从目标分子反向切断碳碳单键。',
      questionText: '关于逆合成分析法与合成路线设计的说法正确的是：',
      options: [
        { label: 'A', text: '逆合成切断符号为双箭号 ➔➔', isCorrect: false },
        { label: 'B', text: '切断键时应优先切断碳骨架连接处的 C-C 单键或 C-N、C-O 杂原子键', isCorrect: true },
        { label: 'C', text: '逆合成分析不需要考虑起始原料的买得性与成本', isCorrect: false },
        { label: 'D', text: '合成路线步数越多，总产率越高', isCorrect: false },
      ],
      modelAlignmentAnalysis: '【母题模型对齐】：考查逆合成切断策略：寻找策略键 (Strategic Bonds) 切断，优先切断杂原子键 (C-N, C-O) 和碳骨架交叉连接键，逆推至廉价易得的基础原料。',
      detailedExplanation: '逆合成分析法在目标分子切断时优先寻找容易构建的杂原子键 (如酯键、酰胺键) 或通过格氏反应、Aldol 缩合切断 C-C 键。B 项正确。',
      diagramType: 'organic-mechanism-diagram',
      diagramConfig: {
        mechanismType: 'peptide-hydrolysis',
        title: '药物分子 M 逆合成切断法 (Disconnection) 关键策略键切断示意图',
      },
    },
  ],
}
