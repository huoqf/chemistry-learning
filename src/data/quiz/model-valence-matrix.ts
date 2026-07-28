import type { ModelQuizData } from './types'

export const modelValenceMatrix: ModelQuizData = {
  modelId: 'model-valence-matrix',
  scoringSteps: [
    {
      id: 'step-1',
      title: '步骤 1：显色检验沉淀方程式手算',
      type: 'fill-in',
      questionText: '写出 Fe²⁺ 被 H₂O₂ 在酸性条件下氧化为 Fe³⁺ 的离子方程式中转移电子数',
      formulaLatex: '2Fe^{2+} + H_2O_2 + 2H^+ = 2Fe^{3+} + 2H_2O',
      placeholder: '输入每摩尔 H2O2 反应转移电子的摩尔数',
      correctAnswer: ['2', '2mol'],
      explanation: '1 mol H₂O₂ 含有 2 个 -1 价 O，还原为 -2 价 O，共转移 2 mol 电子。',
    },
    {
      id: 'step-2',
      title: '步骤 2：规范答题踩分点演练',
      type: 'keywords',
      questionText: '如何用 KSCN 溶液和新制氯水检验溶液中是否含有 Fe²⁺？写出规范答题要点。',
      correctAnswer: ['无明显现象', '血红'],
      explanation: '踩分点：先取少量待测液滴加 KSCN 溶液"无明显现象/无变化"，再滴加新制氯水"溶液变为血红色"。顺序颠倒不得分！',
    },
    {
      id: 'step-3',
      title: '步骤 3：硫/锰变价归中与滴定手算',
      type: 'fill-in',
      questionText: '写出 5 mol Fe²⁺ 完全被 1 mol 酸性 KMnO₄ 氧化时，转移电子的总摩尔数：',
      formulaLatex: '5Fe^{2+} + MnO_4^- + 8H^+ = 5Fe^{3+} + Mn^{2+} + 4H_2O',
      placeholder: '输入转移电子摩尔数',
      correctAnswer: ['5', '5mol'],
      explanation: 'Mn 从 +7 价降低到 +2 价，1 mol MnO₄⁻ 接收 5 mol 电子；5 mol Fe²⁺ 失 5 mol 电子。',
    },
  ],
  variantQuizzes: [
    {
      id: 'var-1',
      yearProvince: '2024 全国新课标卷',
      modelId: 'model-valence-matrix',
      title: '新情境：锰/铬价类二维图在废渣浸出中的迁移',
      contextDescription: '某工业含铬废渣中含有 Cr(III) 与 Fe(II)，利用价态转化为 Cr(VI) 溶于水分离。',
      questionText: '下列关于 Cr 元素的价态转化说法正确的是？',
      options: [
        { label: 'A', text: '在碱性条件下，可加入 H₂O₂ 将 Cr³⁺ 氧化为 CrO₄²⁻', isCorrect: true },
        { label: 'B', text: 'Cr₂O₇²⁻ 中 Cr 元素为 +3 价', isCorrect: false },
        { label: 'C', text: '酸性条件下 CrO₄²⁻ 比 Cr₂O₇²⁻ 更稳定', isCorrect: false },
        { label: 'D', text: 'Cr 化合物变色与 Fe 化合物显色机制完全一致', isCorrect: false },
      ],
      modelAlignmentAnalysis: '【母题模型对齐】：本题考查无机价类二维图"价态与酸碱性对离子的稳定影响"。与 Fe²⁺/Fe³⁺ 氧化还原显色模型完全对应。',
      detailedExplanation: '碱性条件下 Cr(OH)₃ 沉淀可被 H₂O₂ 氧化为可溶的 CrO₄²⁻ (+6 价，黄色)，此为工业提铬关键步骤。',
      diagramType: 'valence-matrix-chart',
      diagramConfig: {
        title: '铬/铁元素价类二维坐标映射矩阵图',
      },
    },
    {
      id: 'var-2',
      yearProvince: '2025 广东高考模考',
      modelId: 'model-valence-matrix',
      title: '硫价类二维图与 SO₂ / H₂S 归中反应分析',
      contextDescription: '将 H₂S 气体与 SO₂ 气体按 2:1 混合后通入水中，观察到产生淡黄色沉淀。',
      questionText: '关于该转化反应的说法正确的是？',
      options: [
        { label: 'A', text: 'H₂S 作氧化剂，SO₂ 作还原剂', isCorrect: false },
        { label: 'B', text: '反应中 S 元素发生归中反应生成 0 价 S 单质', isCorrect: true },
        { label: 'C', text: '产物淡黄色沉淀为 SO₃ 晶体', isCorrect: false },
        { label: 'D', text: '每反应 1 mol SO₂ 转移 2 mol 电子', isCorrect: false },
      ],
      modelAlignmentAnalysis: '【母题模型对齐】：考查 -2 价与 +4 价硫元素的归中反应（2H₂S + SO₂ = 3S↓ + 2H₂O）。1 mol SO₂ (+4价) 变为 0 价 S 得 4 mol 电子。',
      detailedExplanation: 'H₂S 中 S 为 -2 价作还原剂，SO₂ 中 S 为 +4 价作氧化剂，归中生成 0 价淡黄色 S 沉淀。',
      diagramType: 'valence-matrix-chart',
      diagramConfig: {
        title: '硫元素 (-2 ~ +6) 价类二维归中转化图',
      },
    },
  ],
}
