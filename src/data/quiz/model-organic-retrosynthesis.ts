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
      title: '真题一：抗炎药物中间体的逆合成路线与官能团 Protection 剖析',
      contextDescription:
        '已知化合物 G (抗炎药中间体) 的合成路线中包含如下步骤：以 4-烯丙基酚为原料，经加成 Protection 转化为化合物 A，再与 CH₃I 反应生成 B，最后在 Zn 粉作用下得到产物 C。',
      questionText: '关于该合成路线中「加加成 Br₂ Protection 与 Zn 粉脱溴」的作用，下列说法正确的是？',
      options: [
        {
          label: 'A',
          text: '第一步加加成 Br₂ 是为了保护酚羟基不被氧化',
          isCorrect: false,
        },
        {
          label: 'B',
          text: '加加成 Br₂ 可消除 C=C 双键不饱和性，防止后续碱性成醚反应中双键发生副反应',
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
    },
    {
      id: 'var-retro-2',
      yearProvince: '2023 山东高考真题卷',
      modelId: 'model-organic-retrosynthesis',
      title: '真题二：Diels-Alder 环加成与乙二醇缩醛保护机理推断',
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
    },
  ],
}
