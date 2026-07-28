import type { ModelQuizData } from './types'

export const modelTitrationErrorPurity: ModelQuizData = {
  modelId: 'model-titration-error-purity',
  scoringSteps: [
    {
      id: 'step-1',
      title: '步骤 1：滴定误差极值分析表达式手算',
      type: 'keywords',
      questionText: '酸式滴定管装液前未用待装标准液润洗，将导致测定溶液浓度偏大还是偏小？写出关键词。',
      correctAnswer: ['偏大'],
      explanation: '未润洗致使标准液被稀释，滴定时消耗标准液体积 V 偏大，计算浓度 c 偏大。',
    },
    {
      id: 'step-2',
      title: '步骤 2：样品纯度 w% 规范公式计算',
      type: 'calculation',
      questionText: '称取 m = 2.00 g 含有不溶性杂质的 Na₂CO₃ 样品，用 1.00 mol/L 盐酸滴定消耗 30.00 mL，样品中 Na₂CO₃ 的质量分数为多少 %？(M = 106 g/mol)',
      formulaLatex: 'w\\% = \\frac{0.5 \\times c \\times V \\times M}{m} \\times 100\\%',
      placeholder: '79.5',
      correctAnswer: ['79.5', '79.5%'],
      explanation: 'n(Na₂CO₃) = 0.5 × 1.00 × 0.0300 = 0.015 mol，m(纯) = 0.015 × 106 = 1.59 g，w% = 1.59/2.00 = 79.5%。',
    },
  ],
  variantQuizzes: [
    {
      id: 'var-err-1',
      yearProvince: '2024 河北卷',
      modelId: 'model-titration-error-purity',
      title: '氧化还原滴定法测定废水中 COD 纯度与误差评估',
      contextDescription: '利用重铬酸钾法测定废水中有机物还原性，结合草酸钠返滴定。',
      questionText: '下列操作会导致 COD 测定结果偏高的是？',
      options: [
        { label: 'A', text: '滴定终点读取滴定管刻度时仰视', isCorrect: true },
        { label: 'B', text: '锥形瓶洗净后瓶内留有蒸馏水', isCorrect: false },
        { label: 'C', text: '滴定管尖嘴在滴定前有气泡，滴定后气泡消失', isCorrect: true },
        { label: 'D', text: '指示剂变色后立即读数而未等待 30 秒', isCorrect: false },
      ],
      modelAlignmentAnalysis: '【母题模型对齐】：考查定量滴定误差判定与读数视角分析。仰视读数导致读取体积 V 偏大。',
      detailedExplanation: '仰视读数使刻度读取值偏大，计算消耗量偏大导致结果偏高；气泡消失也使消耗标准液偏大。',
    },
  ],
}
