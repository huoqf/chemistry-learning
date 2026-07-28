import type { ModelQuizData } from './types'

export const modelCrystal3dSplit: ModelQuizData = {
  modelId: 'model-crystal-3d-split',
  scoringSteps: [
    {
      id: 'step-1',
      title: '步骤 1：面心立方晶胞密度公式字母代入求解',
      type: 'calculation',
      questionText: '面心立方 (Cu) 晶胞边长为 a pm，摩尔质量为 M g/mol，阿伏加德罗常数为 N_A，晶胞密度 ρ 的计算表达式中，晶胞体积转换为 cm³ 的换算系数是 10 的多少次方？',
      formulaLatex: '\\rho = \\frac{4M}{a^3 \\cdot 10^{-30} \\cdot N_A} \\text{ g/cm}^3',
      placeholder: '-30',
      correctAnswer: ['-30', '10^-30'],
      explanation: '1 pm = 10⁻¹⁰ cm，故 a pm = a × 10⁻¹⁰ cm，(a pm)³ = a³ × 10⁻³⁰ cm³。',
    },
    {
      id: 'step-2',
      title: '步骤 2：晶胞均摊数 N 规范计算',
      type: 'fill-in',
      questionText: '在 NaCl 晶胞中，Cl⁻ 位于顶点和面心，一个 NaCl 晶胞中含有 Cl⁻ 的净个数 N 为：',
      placeholder: '输入整数',
      correctAnswer: ['4'],
      explanation: '顶点：8 × 1/8 = 1；面心：6 × 1/2 = 3。共 1 + 3 = 4 个。',
    },
  ],
  variantQuizzes: [
    {
      id: 'var-3',
      yearProvince: '2024 浙江卷',
      modelId: 'model-crystal-3d-split',
      title: '钙钛矿型太阳能电池晶胞结构 (ABX₃) 密度推导',
      contextDescription: '立方钙钛矿晶胞中，Ca²⁺ 位于体心，Ti⁴⁺ 位于顶点，O²⁻ 位于棱心。',
      questionText: '关于该晶胞结构与化学式的推导，下列说法错误的是？',
      options: [
        { label: 'A', text: '晶胞中 O²⁻ 个数为 12 × 1/4 = 3', isCorrect: false },
        { label: 'B', text: '化学式为 CaTiO₃', isCorrect: false },
        { label: 'C', text: 'Ca²⁺ 的配位数为 6', isCorrect: true },
        { label: 'D', text: '晶胞密度与晶胞边长 a 的三次方成反比', isCorrect: false },
      ],
      modelAlignmentAnalysis: '【母题模型对齐】：考查 3D 晶胞均摊切割（顶点 1/8、棱心 1/4、体心 1）。配位数需通过三维几何判定。',
      detailedExplanation: 'Ca²⁺ 位于体心，周围有 12 个位于棱心的 O²⁻，故配位数为 12，C 选项描述错为 6。',
    },
  ],
}
