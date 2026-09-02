import type { ModelQuizData } from './types'

export const modelIonMatrix: ModelQuizData = {
  modelId: 'model-ion-matrix',
  scoringSteps: [
    {
      id: 'step-1',
      title: '第一步：离子检验规范答题四部曲',
      type: 'keywords',
      questionText: '写出高考试卷中检验未知溶液中是否含有硫酸根离子 (SO₄²⁻) 的标准操作、现象与结论。',
      correctAnswer: ['取少量待测液于试管中', '加过量稀盐酸酸化', '滴加氯化钡溶液产生白色沉淀'],
      explanation:
        '标准四部曲：“取少量待测液于试管中” ➔ “加入过量稀盐酸排除干扰” ➔ “滴加 BaCl₂ 溶液” ➔ “产生白色沉淀，证明含 SO₄²⁻”。',
    },
    {
      id: 'step-2',
      title: '第二步：强酸性条件下离子共存互斥判断',
      type: 'fill-in',
      questionText: '在含有大量 H⁺ 和 NO₃⁻ 的强酸性溶液中，Fe²⁺、I⁻、SO₃²⁻ 无法大量共存的原因是发生了什么反应？',
      correctAnswer: '氧化还原反应',
      explanation:
        '硝酸根在酸性条件下具备强氧化性，会与 Fe²⁺、I⁻、SO₃²⁻ 发生剧烈氧化还原反应。',
    },
  ],
  variantQuizzes: [
    {
      id: 'quiz-1',
      yearProvince: '高考全国卷',
      modelId: 'model-ion-matrix',
      title: '真题精选：溶液中离子共存与限制条件突破',
      contextDescription: '25℃ 时，在指定微粒大量存在的特定水溶液体系中。',
      questionText: '下列各组离子在指定溶液中一定能够大量共存的是？',
      options: [
        { label: 'A', text: '在使甲基橙变红的溶液中：Fe²⁺、Na⁺、NO₃⁻、SO₄²⁻', isCorrect: false },
        { label: 'B', text: '在由水电离出的 c(OH⁻)=1×10⁻¹³ mol/L 的溶液中：Al³⁺、NH₄⁺、Cl⁻、SO₄²⁻', isCorrect: false },
        { label: 'C', text: '在澄清透明溶液中：Cu²⁺、Fe³⁺、Ba²⁺、NO₃⁻、Cl⁻', isCorrect: true },
        { label: 'D', text: '在含有大量 Fe³⁺ 的溶液中：K⁺、NH₄⁺、I⁻、SCN⁻', isCorrect: false },
      ],
      modelAlignmentAnalysis:
        '运用离子共存四大维度排查：颜色限制、酸碱介质限制、氧化还原互斥、剧烈双水解互斥。',
      detailedExplanation:
        'A 项：使甲基橙变红为酸性环境，H⁺ 与 NO₃⁻ 构成强氧化性体系，会氧化 Fe²⁺；B 项：由水电离出的 c(OH⁻)=1×10⁻¹³ mol/L 表明水的电离受抑制，溶液可能显强酸性(pH=1)或强碱性(pH=13)，若为强碱性则 Al³⁺ 与 NH₄⁺ 均不能大量共存；C 项：各离子间不反应，虽然 Cu²⁺、Fe³⁺ 有颜色但符合“澄清透明”要求，能大量共存；D 项：Fe³⁺ 能氧化 I⁻ 且与 SCN⁻ 络合变红。',
    },
  ],
}
