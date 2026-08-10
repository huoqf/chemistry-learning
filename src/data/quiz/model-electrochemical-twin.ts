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
      yearProvince: '2024 全国高考新课标卷',
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
        '1. 放电时（原电池）：V²⁺ 化合价由 +2 升至 +3，失电子作负极，反应式为 V²⁺ - e⁻ = V³⁺；\n' +
        '2. 放电时，阳离子 H⁺ 向正极区迁移（“阳往正阴”）；\n' +
        '3. 充电时，阳极与电源正极相连，发生氧化反应：VO²⁺ + H₂O - e⁻ = VO₂⁺ + 2H⁺，D 项完全正确。',
      diagramType: 'titration-error-diagram',
      diagramConfig: {
        errorDiagramType: 'cod-back-titration',
        title: '全钒液流电池 (V²⁺/V³⁺ vs VO²⁺/VO₂⁺) 质子交换膜充放电装置示意图',
      },
    },
    {
      id: 'quiz-twin-2',
      yearProvince: '2023 湖南高考真题卷',
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
        '1. 阴极区发生还原反应：2H₂O + 2e⁻ = H₂↑ + 2OH⁻，双极膜生成的 H⁺ 移向酸室，Na⁺ 从盐室穿过阳离子膜进入阴极室，与 OH⁻ 结合形成高浓度 NaOH，C 项正确。\n' +
        '2. 双极膜解离出的 OH⁻ 显负电性，移向阳极方向（“阴往阳”），B 项错误。',
      diagramType: 'titration-error-diagram',
      diagramConfig: {
        errorDiagramType: 'permanganate-view-angle',
        title: '三室双极膜 (BPM) 废水电解回收强酸强碱原理图',
      },
    },
    {
      id: 'quiz-twin-3',
      yearProvince: '2024 浙江高考真题',
      modelId: 'model-electrochemical-twin',
      title: '锂离子电池 (LiCoO₂ / 石墨 C) 充放电嵌入与脱嵌',
      contextDescription: '锂离子电池工作原理为 Li⁺ 在正负极材料中的嵌入与脱嵌：LiCoO₂ + C₆ ⇌ Li₁₋ₓCoO₂ + LiₓC₆。',
      questionText: '下列关于该锂电池充放电过程的说法正确的是（ ）',
      options: [
        { label: 'A', text: '放电时，负极材料为 LiCoO₂，Li⁺ 从负极脱嵌', isCorrect: false },
        { label: 'B', text: '放电时，电池内部 Li⁺ 穿过有机电解质向正极 (LiCoO₂) 移动', isCorrect: true },
        { label: 'C', text: '充电时，LiCoO₂ 电极接电源负极发生还原反应', isCorrect: false },
        { label: 'D', text: '电解液可采用水溶液以提高导电率', isCorrect: false },
      ],
      modelAlignmentAnalysis: '考查锂电池二次充放电：放电负极为石墨 LiₓC₆ 脱嵌 Li⁺，正极 LiCoO₂ 嵌入 Li⁺。电池不可用水溶液（金属锂/负极会与水反应）。',
      detailedExplanation: '放电时负极为 LiₓC₆ 脱嵌 Li⁺ 失去电子，阳离子 Li⁺ 穿过非水电解质移向正极（“阳往正”），B 项正确。锂电池活性物质遇水会剧烈反应炸裂，严禁使用水溶液电解质。',
      diagramType: 'titration-error-diagram',
      diagramConfig: {
        errorDiagramType: 'iodometry-purity',
        title: '锂离子电池 (LiCoO₂ / 石墨 C₆) 离子嵌入脱嵌与正负极流向图',
      },
    },
    {
      id: 'quiz-twin-4',
      yearProvince: '2024 山东高考真题',
      modelId: 'model-electrochemical-twin',
      title: '海水电解协同制氢与阳极 Cl⁻ 优先放电',
      contextDescription: '利用太阳能电池电解海水制取 H₂，阳极产生 Cl₂ 气体，阴极产生 H₂ 气体。',
      questionText: '下列关于该海水中电解反应的说法正确的是（ ）',
      options: [
        { label: 'A', text: '阴极反应式为：2Cl⁻ - 2e⁻ = Cl₂↑', isCorrect: false },
        { label: 'B', text: '阳极附近溶液 pH 显强碱性', isCorrect: false },
        { label: 'C', text: '阴极发生还原反应，2H₂O + 2e⁻ = H₂↑ + 2OH⁻，阴极区 pH 增大', isCorrect: true },
        { label: 'D', text: '电解过程中阴阳极产生的气体体积比始终为 2:1', isCorrect: false },
      ],
      modelAlignmentAnalysis: '考查电解池阴阳极反应优先顺序：阴极 H⁺ (H₂O) 得电子还原生成 H₂ 和 OH⁻；阳极 Cl⁻ 优先失电子氧化生成 Cl₂。',
      detailedExplanation: '阴极水得电子还原生成 H₂ 气体和 OH⁻，使阴极区溶液碱性增强（pH 增大），C 项正确。阳极 Cl⁻ 失电子生成 Cl₂，气体体积比 1:1。',
      diagramType: 'titration-error-diagram',
      diagramConfig: {
        errorDiagramType: 'cod-back-titration',
        title: '海水电解 (阳极 Cl₂ / 阴极 H₂ 及 OH⁻ 积累) 装置原理图',
      },
    },
    {
      id: 'quiz-twin-5',
      yearProvince: '2023 全国乙卷',
      modelId: 'model-electrochemical-twin',
      title: '铜锌原电池 vs 粗铜电解精炼阴阳极极性对比',
      contextDescription: '同屏对比铜锌原电池 (Cu-Zn-H₂SO₄) 与粗铜电解精炼池 (粗铜-纯铜-CuSO₄)。',
      questionText: '下列关于两池中电极名称与发生反应的对比正确的是（ ）',
      options: [
        { label: 'A', text: '铜锌原电池中 Zn 为正极，电解精炼中纯铜为阳极', isCorrect: false },
        { label: 'B', text: '铜锌原电池负极与电解精炼阳极均发生氧化反应', isCorrect: true },
        { label: 'C', text: '两池中溶液中的 Cu²⁺ 均向负极/阳极方向移动', isCorrect: false },
        { label: 'D', text: '电解精炼过程中，溶液中 c(Cu²⁺) 始终保持绝对不变', isCorrect: false },
      ],
      modelAlignmentAnalysis: '考查双池对照：原电池负极 (Zn) 与电解池阳极 (粗铜) 均发生失电子氧化反应（“负失氧、阳失氧”）。粗铜中含 Zn、Fe 杂质会先溶解，导致 CuSO₄ 浓度微减。',
      detailedExplanation: '原电池负极（Zn ➔ Zn²⁺ + 2e⁻）与电解池阳极（Cu ➔ Cu²⁺ + 2e⁻）均为失电子氧化反应，B 项正确。阳离子 Cu²⁺ 均向正极/阴极移动。',
      diagramType: 'titration-error-diagram',
      diagramConfig: {
        errorDiagramType: 'permanganate-view-angle',
        title: '铜锌原电池 vs 粗铜电解精炼池 阴阳极/正负极双对比图',
      },
    },
  ],
}
