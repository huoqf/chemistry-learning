import type { ModelQuizData } from './types'

export const modelElementPeriodicProperty: ModelQuizData = {
  modelId: 'model-element-periodic-property',
  scoringSteps: [
    {
      id: 'step-1',
      title: '步骤 1：基态原子核外电子排布式手算',
      type: 'fill-in',
      questionText: '24号元素 Cr 的基态原子价层电子排布式为：',
      placeholder: '3d5 4s1',
      correctAnswer: ['3d5 4s1', '3d⁵4s¹', '3d54s1'],
      explanation: 'Cr 遵循半充满稳定规则，价层电子排布式为 3d⁵4s¹，而非 3d⁴4s²。',
    },
    {
      id: 'step-2',
      title: '步骤 2：第一电离能与电负性反常踩分点',
      type: 'keywords',
      questionText: '比较同周期 N 与 O 的第一电离能大小，并简述规范理由。',
      correctAnswer: ['N>O', '半充满'],
      explanation: '踩分点：第一电离能 N > O；理由是基态 N 原子的 2p 轨道为 2p³ 半充满稳定状态。',
    },
  ],
  variantQuizzes: [
    {
      id: 'var-elem-1',
      yearProvince: '2024 山东卷',
      modelId: 'model-element-periodic-property',
      title: '短周期元素 X、Y、Z、W 的"位-构-性"逻辑推断',
      contextDescription: 'X 的基态原子 p 轨道电子数等于 s 轨道电子数，Y 的电负性在同周期中最强。',
      questionText: '下列关于这些元素及其化合物的说法正确的是？',
      options: [
        { label: 'A', text: '简单离子半径：W > Z > Y', isCorrect: false },
        { label: 'B', text: '第一电离能：Y > X > Z', isCorrect: true },
        { label: 'C', text: '最高价氧化物对应水化物的酸性：X > Y', isCorrect: false },
        { label: 'D', text: '基态 Z 原子的未成对电子数为 0', isCorrect: false },
      ],
      modelAlignmentAnalysis: '【母题模型对齐】：考查电子排布、第一电离能反常规律与微粒半径比较。',
      detailedExplanation: '根据排布推断 X=O, Y=F, Z=N, W=Na，第一电离能 F > N > O。',
    },
  ],
}
