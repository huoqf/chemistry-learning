import type { ModelQuizData } from './types'

export const modelOrganicMatrix: ModelQuizData = {
  modelId: 'model-organic-matrix',
  scoringSteps: [
    {
      id: 'step-1',
      title: '第一步：有机官能团定性特异性推断',
      type: 'fill-in',
      questionText: '某有机物能与 NaHCO₃ 溶液反应剧烈产生大量无色气泡，该有机物分子中一定含有的官能团名称是？',
      correctAnswer: '羧基',
      explanation:
        '在高中化学常见含氧官能团中，酸性 R-COOH > H₂CO₃ > C₆H₅OH > HCO₃⁻，仅羧基 (-COOH) 能与 NaHCO₃ 反应放出 CO₂ 气体，酚羟基不能反应。',
    },
    {
      id: 'step-2',
      title: '第二步：酚酯基水解定量消耗比极值陷阱',
      type: 'calculation',
      questionText: '1 mol 乙酸苯酯 (CH₃COO-C₆H₅) 完全水解，最多消耗 NaOH 的物质的量为多少 mol？',
      correctAnswer: '2',
      explanation:
        '1 mol 酚酯水解生成 1 mol 乙酸和 1 mol 苯酚，乙酸与苯酚均具备酸性，各自消耗 1 mol NaOH，共计消耗 2 mol NaOH。',
    },
  ],
  variantQuizzes: [
    {
      id: 'quiz-1',
      yearProvince: '高考全国甲卷',
      modelId: 'model-organic-matrix',
      title: '真题精选：多官能团有机物结构推断与试剂消耗比',
      contextDescription: '某芳香族化合物 X 的分子式为 C₉H₈O₄。',
      questionText:
        '已知 1 mol X 分别发生如下反应：\n① 与足量 Na 反应生成 0.5 mol H₂；\n② 与足量 NaHCO₃ 溶液反应生成 1 mol CO₂；\n③ 与足量 NaOH 溶液反应消耗 3 mol NaOH。\n则化合物 X 分子中含有的官能团种类为？',
      options: [
        { label: 'A', text: '1 个羧基、1 个醇羟基', isCorrect: false },
        { label: 'B', text: '1 个羧基、1 个酚羟基、1 个普通酯基', isCorrect: false },
        { label: 'C', text: '1 个羧基、1 个酚酯基 (-COO-Ar)', isCorrect: true },
        { label: 'D', text: '2 个羧基、1 个酚羟基', isCorrect: false },
      ],
      modelAlignmentAnalysis: '阿司匹林经典母题模型：1 mol 酚酯 + 1 mol 羧基 ➔ 消耗 3 mol NaOH、1 mol NaHCO₃、1 mol Na。',
      detailedExplanation:
        '由②：消耗 1 mol NaHCO₃ 说明含 1 个 -COOH；由①：产生 0.5 mol H₂ 验证分子中仅有该 -COOH 上的活泼氢；由③：1 个 -COOH 消耗 1 mol NaOH，剩余 2 mol NaOH 必来自 1 个酚酯基水解。故 X 含 1 个羧基和 1 个酚酯基。',
    },
  ],
}
