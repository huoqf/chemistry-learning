/**
 * src/data/quiz/model-gas-chain.ts
 * 母题六：气体制备/净化/尾气处理装置链工具 - 高考规范踩分卡与真题研析题库
 */

import type { ModelQuizData } from './types'

export const modelGasChainQuiz: ModelQuizData = {
  modelId: 'model-gas-chain',

  // 1. 高考规范踩分卡 (规范表述与核心步骤)
  scoringSteps: [
    {
      id: 'step-airtightness',
      title: '踩分点一：全套气体制备装置气密性检验规范表述',
      type: 'fill-in',
      questionText: '试述图示固液加热/启普发生器气体制备装置装入药品前的气密性检查标准操作步骤及预期现象：',
      correctAnswer: [
        '微热法: 将导管末端浸入水中，用双手紧握试管/烧瓶外壁，若导管口有气泡冒出，松开手冷却后导管内形成一段稳定的水柱，证明气密性良好。',
        '液封法: 关闭止水夹，从长颈漏斗向烧瓶内加水至淹没漏斗下端，继续加水使漏斗内液面高于烧瓶内液面，静置一段时间液面差保持不变，证明气密性良好。',
      ],
      explanation: '高考得分关键：①明确密封措施 (关闭止水夹/双手紧握/加水淹没下端)；②描述操作 (微热/加水)；③双向现象描述 (冒气泡+水柱回升稳定 / 液面差不变)。',
    },
    {
      id: 'step-wash-order',
      title: '踩分点二：气流净化除杂与干燥脱水的先后顺序原则',
      type: 'keywords',
      questionText: '制取干燥纯净的 Cl₂ 时，装置链中饱和食盐水洗气瓶与浓硫酸洗气瓶的连接顺序能否颠倒？为什么？',
      correctAnswer: '不能颠倒。必须先通过饱和食盐水除去 HCl 杂质气体，再通过浓硫酸干燥脱水。如果颠倒，气体通过饱和食盐水时会重新带出水蒸气，导致制得的 Cl₂ 不干燥。',
      explanation: '高考通用铁律：除杂与干燥串联时，必须“先除杂后干燥”。因为水溶液洗气瓶洗涤杂质时必然会引入水蒸气，干燥必须放在收集前的最后一步。',
    },
    {
      id: 'step-anti-siphon',
      title: '踩分点三：极易溶气体尾气吸收防倒吸物理原理解析',
      type: 'keywords',
      questionText: '吸收 NH₃ 或 HCl 尾气时，为什么使用倒置漏斗或安全瓶可以有效防止倒吸？',
      correctAnswer: 'NH₃/HCl 极易溶于水，导管内气体迅速溶解导致压强骤降；倒置漏斗边缘刚好接触液面，当液体倒吸进入漏斗后，漏斗内液面上升使得漏斗边缘脱离水面，在大气压和重力作用下液体自动回落入烧杯，从而防止倒吸入发生装置。',
      explanation: '防倒吸三大物理结构：①倒置漏斗 (容积大+脱离液面)；②安全隔离瓶 (空瓶容纳倒吸液体)；③4-球干燥管/有机相衬底。',
    },
    {
      id: 'step-dryer-forbidden',
      title: '踩分点四：常见干燥剂选择的禁忌与化学相容性',
      type: 'fill-in',
      questionText: '请列举三项高考高频干燥剂选择失误的化学反应方程式或作用机制：',
      correctAnswer: [
        '① 碱性气体 NH₃ 不能用浓硫酸干燥: 2NH₃ + H₂SO₄ = (NH₄)₂SO₄',
        '② 碱性气体 NH₃ 不能用无水 CaCl₂ 干燥: CaCl₂ + 8NH₃ = CaCl₂·8NH₃ (形成配合物被吸收)',
        '③ 酸性气体 (Cl₂/SO₂/NO₂/CO₂) 不能用碱石灰干燥: 发生中和反应被全部吸收',
      ],
      explanation: '干燥剂选择三大原则：酸性干燥剂 (浓硫酸/P₂O₅) 干燥酸性及中性气体；碱性干燥剂 (碱石灰) 干燥碱性及中性气体；中性干燥剂 (无水CaCl₂) 干燥除 NH₃ 以外的大多数气体。',
    },
  ],

  // 2. 高考真题研析与变式题
  variantQuizzes: [
    {
      id: 'gas-quiz-1',
      yearProvince: '2025·全国高考新课标卷',
      modelId: 'model-gas-chain',
      title: '高考真题：强氧化性气体 Cl₂ 制备及提纯装置链辨析',
      contextDescription: '某化学兴趣小组利用 MnO₂ 和浓盐酸加热制备纯净、干燥的 Cl₂，并探究其与金属铜的反应。实验装置链依次为：发生装置(A) ➔ 洗气瓶(B) ➔ 洗气瓶(C) ➔ 集气瓶(D) ➔ 尾气处理(E)。',
      questionText: '下列关于该实验装置链配置与操作的说法中，正确的是：',
      options: [
        {
          label: 'A',
          text: '洗气瓶 B 中应装入浓硫酸除去水蒸气，洗气瓶 C 中装入饱和食盐水除去 HCl',
          isCorrect: false,
        },
        {
          label: 'B',
          text: '洗气瓶 B 和 C 均应遵循“长进短出”的导管进出原则',
          isCorrect: true,
        },
        {
          label: 'C',
          text: '集气瓶 D 收集 Cl₂ 时，导管应“短进长出”采用向下排空气法',
          isCorrect: false,
        },
        {
          label: 'D',
          text: '尾气处理 E 可以直接将导管通入澄清石灰水中完全吸收尾气',
          isCorrect: false,
        },
      ],
      modelAlignmentAnalysis: '本题考查气体制备链全流程规范：先除杂 (饱和NaCl) 后干燥 (浓H₂SO₄)；洗气长进短出；Cl₂ 密度比空气大用向上排空气法 (长进短出)；澄清石灰水中 Ca(OH)₂ 溶解度极小吸收不完全，必须用浓 NaOH 溶液吸收。',
      detailedExplanation: '【解析】\n• 选项 A 错误：必须先通过饱和食盐水除 HCl，再通过浓硫酸干燥，顺序不可颠倒；\n• 选项 B 正确：洗气瓶净化气体必须“长进短出”，使气体深入液面下充分洗涤；\n• 选项 C 错误：Cl₂ 相对分子质量为 71，密度大于空气 (29)，必须用向上排空气法 (长进短出)；\n• 选项 D 错误：Ca(OH)₂ 溶解度小，氢氧根浓度低，尾气吸收必须使用强碱浓 NaOH 溶液。',
    },
    {
      id: 'gas-quiz-2',
      yearProvince: '2024·高考浙江卷压轴',
      modelId: 'model-gas-chain',
      title: '高考真题：极易溶气体 NH₃ 制备干燥与防倒吸装置验证',
      contextDescription: '利用固体 NH₄Cl 和 Ca(OH)₂ 加热制取 NH₃，要求收集一瓶干燥的 NH₃ 并进行尾气吸收。',
      questionText: '下列装置链选择或操作最合理的是：',
      options: [
        {
          label: 'A',
          text: '发生装置试管口应微向上倾斜，防止固体粉末堵塞导管',
          isCorrect: false,
        },
        {
          label: 'B',
          text: '干燥装置可选用装有无水 CaCl₂ 的 U 形干燥管',
          isCorrect: false,
        },
        {
          label: 'C',
          text: '收集 NH₃ 时采用向下排空气法，瓶口塞一团浸有稀硫酸的棉花',
          isCorrect: false,
        },
        {
          label: 'D',
          text: '尾气吸收装置采用倒置漏斗，漏斗边缘刚好接触烧杯内的水面',
          isCorrect: true,
        },
      ],
      modelAlignmentAnalysis: '考查固体加热发生装置 (试管口微向下倾斜防冷凝水倒流)；NH₃ 干燥剂禁忌 (CaCl₂ 配合物)；向下排空气法瓶口棉花应浸水或湿润红色石蕊试纸；防倒吸倒置漏斗刚好下沿接触液面。',
      detailedExplanation: '【解析】\n• 选项 A 错误：固体加热反应有水生成，试管口必须微向下倾斜，防止冷凝水倒流炸裂试管；\n• 选项 B 错误：无水 CaCl₂ 会与 NH₃ 发生络合反应生成 CaCl₂·8NH₃，不能干燥 NH₃；\n• 选项 C 错误：棉花应用水或湿润石蕊试纸，稀硫酸会与 NH₃ 反应阻碍空气排出；\n• 选项 D 正确：倒置漏斗刚好下沿接触液面是标准的极易溶气体防倒吸结构。',
    },
  ],
}
