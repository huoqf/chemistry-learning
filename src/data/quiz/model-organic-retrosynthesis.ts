import type { ModelQuizData } from './types'

export const modelOrganicRetrosynthesis: ModelQuizData = {
  modelId: 'model-organic-retrosynthesis',
  scoringSteps: [
    {
      id: 'step-1',
      title: '步骤 1：有机切断法与逆合成分析手算',
      type: 'keywords',
      questionText: '在合成阿司匹林 (乙酰水杨酸) 的逆合成分析中，水杨酸 (邻羟基苯甲酸) 应与什么试剂反应？写出试剂名称。',
      correctAnswer: ['乙酸酐', '乙酰氯', '醋酸酐'],
      explanation: '水杨酸酚羟基与乙酸酐 (或乙酰氯) 发生酰化/酯化反应生成乙酰水杨酸。',
    },
    {
      id: 'step-2',
      title: '步骤 2：官能团保护规范答题表达',
      type: 'keywords',
      questionText: '在含有碳碳双键和醇羟基的化合物中氧化醇羟基为醛基，为何需先对双键进行保护？写出规范考点。',
      correctAnswer: ['强氧化剂', '双键被氧化', '选择性'],
      explanation: '踩分点：强氧化剂 (如 KMnO₄/酸性) 会同时氧化 C=C 双键，保护双键可实现官能团的"选择性"氧化。',
    },
  ],
  variantQuizzes: [
    {
      id: 'var-retro-1',
      yearProvince: '2024 广东卷',
      modelId: 'model-organic-retrosynthesis',
      title: '新情境：抗癌药物中间体的逆合成路线推断',
      contextDescription: '已知新反应信息：R-CHO + R\'-NH₂ → R-CH=N-R\' + H₂O (格氏试剂与亚胺加成)。',
      questionText: '关于该合成路线的逆推与结构判定，正确的是？',
      options: [
        { label: 'A', text: '反应步骤中引入 -OH 后再保护可防止被后续强碱破坏', isCorrect: true },
        { label: 'B', text: '第一步反应类型为消去反应', isCorrect: false },
        { label: 'C', text: '目标分子中所有碳原子共平面', isCorrect: false },
        { label: 'D', text: '合成路线中未涉及碳链增长反应', isCorrect: false },
      ],
      modelAlignmentAnalysis: '【母题模型对齐】：考查高考有机大题"官能团保护"与"新结构信息迁移"。',
      detailedExplanation: '保护羟基与氨基是有机合成高频考点，防止强碱或氧化剂破坏活泼氢。',
    },
  ],
}
