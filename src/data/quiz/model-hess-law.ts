import type { ModelQuizData } from './types'

export const modelHessLaw: ModelQuizData = {
  modelId: 'model-hess-law',
  scoringSteps: [
    {
      id: 'step-1',
      title: '步骤 1：盖斯定律热化学方程式叠加代数计算',
      type: 'calculation',
      questionText: '已知：① C(s) + O₂(g) = CO₂(g) ΔH₁ = -393.5 kJ/mol；② 2CO(g) + O₂(g) = 2CO₂(g) ΔH₂ = -566.0 kJ/mol。目标反应 C(s) + 1/2O₂(g) = CO(g) 的 ΔH₃ 为多少 kJ/mol？',
      formulaLatex: '\\Delta H_3 = \\Delta H_1 - \\frac{1}{2}\\Delta H_2',
      placeholder: '-110.5',
      correctAnswer: ['-110.5'],
      explanation: 'ΔH₃ = ΔH₁ - 1/2 ΔH₂ = -393.5 - (-283.0) = -110.5 kJ/mol。',
    },
    {
      id: 'step-2',
      title: '步骤 2：微观键能与 ΔH 计算表达式规范',
      type: 'fill-in',
      questionText: '已知 H-H 键能为 E1，Cl-Cl 键能为 E2，H-Cl 键能为 E3。反应 H₂(g) + Cl₂(g) = 2HCl(g) 的 ΔH 计算公式为：',
      placeholder: 'E1+E2-2E3',
      correctAnswer: ['E1+E2-2E3', 'E1 + E2 - 2E3'],
      explanation: 'ΔH = 反应物断键吸收的总能量 - 生成物成键释放的总能量 = E1 + E2 - 2E3。',
    },
  ],
  variantQuizzes: [
    {
      id: 'var-hess-1',
      yearProvince: '2024 全国甲卷',
      modelId: 'model-hess-law',
      title: '新情境：CO₂ 资源化利用与多步协同盖斯定律',
      contextDescription: '利用 CO₂ 与 CH₄ 重整制备合成气 (CO + H₂)，涉及催化积碳与消碳循环。',
      questionText: '已知各分步反应活化能与焓变，消碳反应 C(s) + CO₂(g) ⇌ 2CO(g) 的 ΔH 为？',
      options: [
        { label: 'A', text: 'ΔH > 0，升高温度平衡正向移动', isCorrect: true },
        { label: 'B', text: 'ΔH < 0，使用催化剂可改变 ΔH', isCorrect: false },
        { label: 'C', text: 'ΔH 等于各分步正反应活化能之和', isCorrect: false },
        { label: 'D', text: '压强对该反应的 ΔH 无影响但改变平衡常数 K', isCorrect: false },
      ],
      modelAlignmentAnalysis: '【母题模型对齐】：考查盖斯定律与热化学基本原理。催化剂不改变 ΔH；K 仅与温度有关。',
      detailedExplanation: '消碳反应吸热 (ΔH > 0)，升温平衡正方向移动；催化剂改变途径与活化能但不改变 ΔH。',
    },
  ],
}
