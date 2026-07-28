import type { ModelQuizData } from './types'

export const modelAvogadroConstant: ModelQuizData = {
  modelId: 'model-avogadro-constant',
  scoringSteps: [
    {
      id: 'step-1',
      title: '步骤 1：弱电解质水解/电离粒子数手算陷阱',
      type: 'calculation',
      questionText: '1 L 0.1 mol/L CH₃COOH 溶液中，CH₃COOH 分子与 CH₃COO⁻ 离子数之和是否为 0.1 N_A？输入 Yes 或 No：',
      placeholder: 'Yes',
      correctAnswer: ['Yes', 'yes'],
      explanation: '根据物料守恒，n(CH₃COOH) + n(CH₃COO⁻) = 0.1 mol，粒子数之和为 0.1 N_A。',
    },
    {
      id: 'step-2',
      title: '步骤 2：氧化还原反应电子转移 N_A 计算规范',
      type: 'fill-in',
      questionText: '标准状况下 2.24 L Cl₂ 通入足量冷 NaOH 溶液中，转移电子数为：',
      placeholder: '0.1 NA',
      correctAnswer: ['0.1 NA', '0.1Na', '0.1NA', '0.1'],
      explanation: 'Cl₂ + 2NaOH = NaCl + NaClO + H₂O，1 mol Cl₂ 歧化反应转移 1 mol 电子。2.24 L Cl₂ 即 0.1 mol，转移 0.1 N_A 电子。',
    },
  ],
  variantQuizzes: [
    {
      id: 'var-na-1',
      yearProvince: '2024 湖南卷',
      modelId: 'model-avogadro-constant',
      title: '设 N_A 为阿伏加德罗常数的值，下列说法正确的是？',
      contextDescription: '考查标况状态、D₂O/H₂O 分子结构、氧化还原与电离陷阱。',
      questionText: '下列说法正确的是？',
      options: [
        { label: 'A', text: '18 g D₂O 中含有的质子数为 10 N_A', isCorrect: false },
        { label: 'B', text: '1 mol Na₂O₂ 晶体中含有的阴离子数为 1 N_A', isCorrect: true },
        { label: 'C', text: '标准状况下 22.4 L SO₃ 中含有的分子数为 N_A', isCorrect: false },
        { label: 'D', text: 'pH = 1 的 H₂SO₄ 溶液中含有的 H⁺ 数为 0.1 N_A', isCorrect: false },
      ],
      modelAlignmentAnalysis: '【母题模型对齐】：高考必考选择题 $N_A$ 陷阱拆解。标况下 SO₃ 为固体；D₂O 摩尔质量为 20 g/mol；pH 溶液未说明体积。',
      detailedExplanation: 'Na₂O₂ 由 Na⁺ 与 O₂²⁻ 构成，1 mol 晶体中阴离子 O₂²⁻ 为 1 mol (N_A)。',
    },
  ],
}
