/**
 * src/data/quiz/model-industrial-flow.ts
 * 母题七：无机工艺流程与沉淀调 pH 工具 - 踩分卡与真题题库数据
 */

import type { ModelQuizData } from './types'

export const modelIndustrialFlow: ModelQuizData = {
  modelId: 'model-industrial-flow',
  scoringSteps: [
    {
      id: 'step-1',
      title: '踩分点一：双氧水 (H₂O₂) 氧化剂的作用与离子方程式',
      type: 'fill-in',
      questionText: '在酸浸液中加入 H₂O₂ 溶液的目的是什么？请写出发生反应的离子方程式：',
      formulaLatex: '2Fe^{2+} + H_2O_2 + 2H^+ = 2Fe^{3+} + 2H_2O',
      correctAnswer: '将 Fe²⁺ 氧化为 Fe³⁺；2Fe²⁺ + H₂O₂ + 2H⁺ = 2Fe³⁺ + 2H₂O',
      explanation: 'Fe³⁺ 的 Ksp (4×10⁻³⁸) 远小于 Fe²⁺ (8×10⁻¹⁶)，转化为 Fe³⁺ 后可在较低 pH (约 3.2) 下完全沉淀，避免与 Mn²⁺ (pH 8.4 开始沉淀) 发生共沉淀。',
    },
    {
      id: 'step-2',
      title: '踩分点二：调节 pH 试剂的选择 (不增杂原则)',
      type: 'fill-in',
      questionText: '在软锰矿提纯 MnSO₄ 工艺中，调节溶液 pH 以沉淀 Fe³⁺ 和 Al³⁺ 时，可选用的试剂为 ____ (填化学式)。理由是：____。',
      correctAnswer: 'MnO (或 MnCO₃ / Mn(OH)₂)',
      explanation: '使用 MnO/MnCO₃ 既能消耗 H⁺ 提高溶液 pH 促进 Fe³⁺、Al³⁺ 水解完全沉淀，又不会引入其他难以除去的杂质阳离子（不增杂原则）。',
    },
    {
      id: 'step-3',
      title: '踩分点三：检验沉淀洗涤干净的标准表达',
      type: 'keywords',
      questionText: '如何检验滤渣 [Fe(OH)₃/Al(OH)₃] 已经洗涤干净？（答题模板）',
      correctAnswer: ['取最后一次洗涤滤液', '滴加 BaCl₂ 溶液', '无白色沉淀生成'],
      explanation: '答题三步法：取少许最后一次洗涤滤液于试管中 ➔ 滴加 BaCl₂ 溶液（或 HNO₃ 酸化的 AgNO₃ 溶液）➔ 若无白色沉淀生成，说明沉淀已洗涤干净。',
    },
    {
      id: 'step-4',
      title: '踩分点四：“趁热过滤”的目的',
      type: 'keywords',
      questionText: '在蒸发浓缩结晶后，采用“趁热过滤”操作的原因是：____。',
      correctAnswer: ['防止目标产物析出', '防止杂质结晶', '提高纯度与产率'],
      explanation: '趁热过滤能防止目标溶质随着温度降低而结晶析出造成损失；或防止某些溶解度随温度降低显著减小的杂质随之析出影响产物纯度。',
    },
  ],
  variantQuizzes: [
    {
      id: 'var-industrial-1',
      yearProvince: '2024 全国高考化学真题卷',
      modelId: 'model-industrial-flow',
      title: '软锰矿 (主要含 MnO₂，含 Fe₂O₃、Al₂O₃、SiO₂ 杂质) 提纯高纯 MnSO₄ 工艺',
      contextDescription:
        '常温下，25℃ 时各金属氢氧化物的溶导积与 lg c - pH 沉淀分布曲线如图所示。已知：当离子浓度 c ≤ 1.0×10⁻⁵ mol/L 时认为沉淀完全。',
      questionText:
        '若酸浸液中 c(Fe³⁺)=0.05 mol/L, c(Al³⁺)=0.04 mol/L, c(Mn²⁺)=0.10 mol/L。为了使 Fe³⁺ 和 Al³⁺ 完全沉淀，而 Mn²⁺ 不析出，溶液的 pH 控制区间应为：',
      diagramType: 'precipitation-curve',
      diagramConfig: {
        title: '25℃ 时金属离子 lg c - pH 沉淀分布曲线图',
      },
      options: [
        { label: 'A', text: 'pH < 3.2', isCorrect: false },
        { label: 'B', text: '3.2 ≤ pH < 4.7', isCorrect: false },
        { label: 'C', text: '4.7 ≤ pH < 8.4', isCorrect: true },
        { label: 'D', text: 'pH ≥ 8.4', isCorrect: false },
      ],
      modelAlignmentAnalysis:
        '【盲盒剖析：沉淀完全 pH 判定】\n1. 计算 Fe³⁺ 完全沉淀 pH: Ksp[Fe(OH)₃]=4.0×10⁻³⁸, c(OH⁻)=∛(Ksp/10⁻⁵)=1.59×10⁻¹¹, pOH=10.8 ⇒ pH=3.2。\n2. 计算 Al³⁺ 完全沉淀 pH: Ksp[Al(OH)₃]=1.0×10⁻³³, c(OH⁻)=∛(Ksp/10⁻⁵)=2.15×10⁻¹⁰, pOH=9.67 ⇒ pH=4.7。\n3. 计算 Mn²⁺ 开始沉淀 pH: Ksp[Mn(OH)₂]=1.9×10⁻¹³, c(OH⁻)=√(Ksp/0.10)=1.38×10⁻⁶, pOH=5.86 ⇒ pH=8.4。\n因此安全沉淀 pH 区间为 4.7 ≤ pH < 8.4。',
      detailedExplanation:
        '选 C。杂质 Al³⁺ 完全沉淀所需 pH 为 4.7（若 pH<4.7，Al³⁺ 未完全沉淀）；而 Mn²⁺ 开始沉淀的 pH 为 8.4（若 pH≥8.4，主产物 Mn²⁺ 将沉淀损失）。故溶液 pH 须控制在 4.7 至 8.4 之间。',
    },
  ],
}
