/**
 * src/data/quiz/model-electrochemical-twin.ts
 * 母题二：原电池 vs 电解池双对比 - 踩分卡与高考真题变式题库
 */

import type { ModelQuizData } from './types'

export const modelElectrochemicalTwin: ModelQuizData = {
  modelId: 'model-electrochemical-twin',
  scoringSteps: [
    {
      id: 'step-1',
      title: '第一步：辨自发/找电源，判定池型与工作状态',
      type: 'keywords',
      questionText: '无电源且能自发反应的为何种池？有外接直流电源的为何种池？',
      correctAnswer: '原电池；电解池',
      explanation:
        '无电源且自发反应为原电池（化学能转电能）；有外接电源为电解池（电能转化学能）；二次电池放电为原电池，充电为电解池。',
    },
    {
      id: 'step-2',
      title: '第二步：看电子/定电势，确定电极名称与反应类型',
      type: 'keywords',
      questionText: '原电池与电解池中发生氧化反应的电极分别称为什么？',
      correctAnswer: '负极；阳极',
      explanation:
        '牢记口诀：负失氧、正得还（原电池）；阳失氧、阴得还（电解池）。失电子（化合价升高）的电极必发生氧化反应。',
    },
    {
      id: 'step-3',
      title: '第三步：依据电解质介质，准确配平电极反应式',
      type: 'fill-in',
      questionText: '书写电极反应式时，除了电子得失守恒与原子守恒，还必须注意什么？',
      correctAnswer: '电荷守恒与介质守恒（酸性补 H⁺，碱性补 OH⁻）',
      explanation:
        '酸性介质补充 H⁺ 配平电荷，碱性介质补充 OH⁻ 配平电荷，水溶液中不能出现自由 O²⁻。',
    },
    {
      id: 'step-4',
      title: '第四步：阳往正阴、阴往负阳，确定膜透性与电子守恒计算',
      type: 'calculation',
      questionText: '利用法拉第电解定律计算，n(e⁻) 与电流 I 及时间 t 的关系式是什么？',
      formulaLatex: 'n(e^-) = \\frac{I \\cdot t}{F}',
      correctAnswer: 'n(e⁻) = (I · t) / F',
      explanation:
        '电子只在导线中传递。阳离子向正极/阴极移动，阴离子向负极/阳极移动；串联电路中转移电子物质的量 n(e⁻) 恒定相等。',
    },
  ],
  variantQuizzes: [
    {
      id: 'quiz-twin-1',
      yearProvince: '全国高考真题',
      modelId: 'model-electrochemical-twin',
      title: '全钒液流电池充放电原理与膜迁移分析',
      contextDescription:
        '全钒液流电池是一种新型蓄电池，其能量储存密度高。电池工作时的总反应为：V²⁺ + VO₂⁺ + 2H⁺ ⇌ V³⁺ + VO²⁺ + H₂O。电池中间由质子交换膜分隔开。',
      questionText: '下列关于该电池放电与充电过程的说法中，正确的是（ ）',
      options: [
        { label: 'A', text: '放电时，负极反应式为：VO²⁺ + H₂O - e⁻ = VO₂⁺ + 2H⁺', isCorrect: false },
        { label: 'B', text: '放电过程中，溶液中的 H⁺ 经质子交换膜由正极区向负极区迁移', isCorrect: false },
        { label: 'C', text: '充电时，每转移 1 mol e⁻，阴极区溶液的质量增加 1 mol', isCorrect: false },
        { label: 'D', text: '充电时，阳极接直流电源的正极，发生氧化反应：VO²⁺ + H₂O - e⁻ = VO₂⁺ + 2H⁺', isCorrect: true },
      ],
      modelAlignmentAnalysis: '本题考查二次电池放电（原电池）与充电（电解池）工作原理转换及质子交换膜透膜方向判定。',
      detailedExplanation:
        '【详细解析】\n' +
        '1. 放电时（原电池）：V²⁺ 化合价由 +2 升至 +3，失电子作负极，反应式为 V²⁺ - e⁻ = V³⁺，A 项错误。\n' +
        '2. 放电时，阳离子 H⁺ 向正极区迁移（“阳往正阴”），B 项错误。\n' +
        '3. 充电时，阳极与电源正极相连，发生氧化反应：VO²⁺ + H₂O - e⁻ = VO₂⁺ + 2H⁺，D 项完全正确。',
    },
    {
      id: 'quiz-twin-2',
      yearProvince: '高考新课标',
      modelId: 'model-electrochemical-twin',
      title: '双极膜 (BPM) 电解法制备高纯度烧碱与硫酸',
      contextDescription:
        '双极膜 (BPM) 是一种由阳膜和阴膜复合而成的特殊膜，在电场作用下，膜中间层的水迅速解离为 H⁺ 和 OH⁻ 并分别向两极迁移。利用三室双极膜电解池处理 Na₂SO₄ 废水可制备 H₂SO₄ 和 NaOH。',
      questionText: '关于该三室电解池，下列推断正确的是（ ）',
      options: [
        { label: 'A', text: '阳极反应为：2H₂O - 4e⁻ = O₂↑ + 4H⁺，生成的 H⁺ 穿过阳离子膜进入中间室', isCorrect: false },
        { label: 'B', text: '双极膜解离出的 OH⁻ 在电场驱动下移向阴极室', isCorrect: false },
        { label: 'C', text: '阴极室出口可获得高浓度的 NaOH 溶液', isCorrect: true },
        { label: 'D', text: '若电路中通过 2 mol 电子，则在阳极产生 22.4 L H₂ 气体（标准状况）', isCorrect: false },
      ],
      modelAlignmentAnalysis: '本题考查多室电解池与双极膜 BPM 催化水解离生成 H⁺ 和 OH⁻ 定向迁移制备强酸强碱应用。',
      detailedExplanation:
        '【详细解析】\n' +
        '1. 阴极区发生还原反应：2H₂O + 2e⁻ = H₂↑ + 2OH⁻，双极膜生成的 H⁺ 移向酸室，Na⁺ 从盐室穿过阳离子膜进入阴极室，与 OH⁻ 结合形成高浓度 NaOH，C 项正确。\n' +
        '2. 双极膜解离出的 OH⁻ 显负电性，移向阳极方向（“阴往阳”），B 项错误。',
    },
  ],
}
