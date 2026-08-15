/**
 * src/data/quiz/model-industrial-flow.ts
 * 母题七：无机工艺流程与沉淀调 pH 工具 - 踩分卡与真题题库数据
 */

import type { ModelQuizData } from './types'

export const modelIndustrialFlow: ModelQuizData = {
  modelId: 'model-industrial-flow',
  scoringSteps: [
    {
      id: 'step-0',
      title: '踩分点一：软锰矿“还原酸浸”机理与离子方程式',
      type: 'fill-in',
      questionText: '工业上用软锰矿 (主要成分 MnO₂) 提纯 MnSO₄ 时，单纯加稀 H₂SO₄ 无法浸出 Mn²⁺，必须加入 FeSO₄ / 草酸 / H₂O₂。其作用是什么？请写出加入 FeSO₄ 时的离子方程式：',
      formulaLatex: 'MnO_2 + 2Fe^{2+} + 4H^+ = Mn^{2+} + 2Fe^{3+} + 2H_2O',
      correctAnswer: '作还原剂，将 +4 价不溶性 MnO₂ 还原为可溶性 Mn²⁺；MnO₂ + 2Fe²⁺ + 4H⁺ = Mn²⁺ + 2Fe³⁺ + 2H₂O',
      explanation: 'MnO₂ 具有强氧化性且不溶于稀硫酸，加入 Fe²⁺/草酸/H₂O₂ 将 Mn 还原为可溶的 Mn²⁺ 溶出；同时引入的 Fe²⁺/Fe³⁺ 杂质可在工序二中氧化并调 pH 沉淀除去。',
    },
    {
      id: 'step-1',
      title: '踩分点二：双氧水 (H₂O₂) 氧化剂的作用与离子方程式',
      type: 'fill-in',
      questionText: '在酸浸液中加入 H₂O₂ 溶液的目的是什么？请写出发生反应的离子方程式：',
      formulaLatex: '2Fe^{2+} + H_2O_2 + 2H^+ = 2Fe^{3+} + 2H_2O',
      correctAnswer: '将 Fe²⁺ 氧化为 Fe³⁺；2Fe²⁺ + H₂O₂ + 2H⁺ = 2Fe³⁺ + 2H₂O',
      explanation: 'Fe³⁺ 的 Ksp (4×10⁻³⁸) 远小于 Fe²⁺ (8×10⁻¹⁶)，转化为 Fe³⁺ 后可在较低 pH (约 3.2) 下完全沉淀，避免与 Mn²⁺ (pH 8.4 开始沉淀) 发生共沉淀。',
    },
    {
      id: 'step-2',
      title: '踩分点三：调节 pH 试剂的选择与理由 (不增杂原则)',
      type: 'fill-in',
      questionText: '在软锰矿提纯 MnSO₄ 工艺中，调节溶液 pH 以沉淀 Fe³⁺ 和 Al³⁺ 时，可选用的试剂为 ____ (填化学式)。理由是：____。',
      correctAnswer: 'MnO (或 MnCO₃ / Mn(OH)₂)；能消耗 H⁺ 提高溶液 pH，使 Fe³⁺ 和 Al³⁺ 完全沉淀，且不引入新杂质。',
      explanation: '标准答题规范（三要素）：1. 消耗 H⁺ 提高溶液 pH；2. 使 Fe³⁺、Al³⁺ 形成氢氧化物沉淀完全除去；3. 引入的阳离子恰好为 Mn²⁺，不引入新杂质。',
    },
    {
      id: 'step-3',
      title: '踩分点四：深度除杂 (加 NaF 沉淀 Ca²⁺/Mg²⁺ 或加 MnS 沉淀转化)',
      type: 'fill-in',
      questionText: '除去 Fe³⁺ 和 Al³⁺ 后的滤液中仍含有 Ca²⁺、Mg²⁺ 或 Cu²⁺ 杂质，加入 NaF 或 MnS 的目的及反应原理是：____。',
      formulaLatex: 'Cu^{2+} + MnS(s) = CuS(s) + Mn^{2+}',
      correctAnswer: '加入 NaF 形成 MgF₂/CaF₂ 沉淀；加入 MnS 发生沉淀转化将 Cu²⁺ 转化为 Ksp 更小的 CuS 沉淀',
      explanation: '调 pH 只能除去易水解的高价离子，Ca²⁺/Mg²⁺ 沉淀 pH 极高，须用 F⁻ 形成难溶氟化物；重金属 Cu²⁺/Zn²⁺ 须利用 Ksp(CuS) < Ksp(MnS) 进行沉淀转化。',
    },
    {
      id: 'step-4',
      title: '踩分点五：检验沉淀洗涤干净的高考标准四步法',
      type: 'keywords',
      questionText: '如何检验滤渣 [Fe(OH)₃/Al(OH)₃] 已经洗涤干净？（高考标准四步法答题模板）',
      correctAnswer: ['取少许最后一次洗涤滤液', '滴加 BaCl₂ 溶液', '若无白色沉淀生成', '说明沉淀已洗涤干净'],
      explanation: '高考标准四步法：1. 取样：取少许最后一次洗涤滤液于试管中；2. 试剂：滴加稀 HNO₃ 酸化的 BaCl₂ 溶液（或 AgNO₃ 溶液）；3. 现象：若无白色沉淀生成；4. 结论：则说明沉淀已洗涤干净。',
    },
    {
      id: 'step-5',
      title: '踩分点六：使用“无水乙醇”洗涤晶体的目的',
      type: 'keywords',
      questionText: '在结晶提纯 MnSO₄·H₂O 晶体时，采用“无水乙醇洗涤”晶体的目的是：____。',
      correctAnswer: ['减少晶体溶解损耗', '洗去晶体表面杂质', '无水乙醇易挥发快速干燥'],
      explanation: '标准答题语：1. 洗去晶体表面可溶性杂质；2. 降低晶体在洗涤剂中的溶解度，减少溶解损失；3. 无水乙醇易挥发，便于晶体快速干燥。',
    },
    {
      id: 'step-6',
      title: '踩分点七：“趁热过滤”的目的',
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
        '常温下，25℃ 时各金属氢氧化物的溶度积与 lg c - pH 沉淀分布曲线如图所示。已知：当离子浓度 c ≤ 1.0×10⁻⁵ mol/L 时认为沉淀完全。',
      questionText:
        '若还原酸浸液中 c(Fe³⁺)=0.05 mol/L, c(Al³⁺)=0.04 mol/L, c(Mn²⁺)=0.10 mol/L。为了使 Fe³⁺ 和 Al³⁺ 完全沉淀，而 Mn²⁺ 不析出，溶液的 pH 控制区间应为：',
      diagramType: 'precipitation-curve',
      diagramConfig: {
        title: '25℃ 时金属离子 lg c - pH 沉淀分布曲线图',
      },
      options: [
        { label: 'A', text: 'pH < 3.2', isCorrect: false },
        { label: 'B', text: '3.2 ≤ pH < 4.7', isCorrect: false },
        { label: 'C', text: '4.7 ≤ pH < 8.1', isCorrect: true },
        { label: 'D', text: 'pH ≥ 8.1', isCorrect: false },
      ],
      modelAlignmentAnalysis:
        '【盲盒剖析：沉淀完全 pH 判定】\n1. 计算 Fe³⁺ 完全沉淀 pH: Ksp[Fe(OH)₃]=4.0×10⁻³⁸, c(OH⁻)=∛(Ksp/10⁻⁵)=1.59×10⁻¹¹, pOH=10.8 ⇒ pH=3.2。\n2. 计算 Al³⁺ 完全沉淀 pH: Ksp[Al(OH)₃]=1.0×10⁻³³, c(OH⁻)=∛(Ksp/10⁻⁵)=2.15×10⁻¹⁰, pOH=9.67 ⇒ pH=4.7。\n3. 计算 Mn²⁺ 开始沉淀 pH: Ksp[Mn(OH)₂]=1.9×10⁻¹³, c(OH⁻)=√(Ksp/0.10)=1.38×10⁻⁶, pOH=5.86 ⇒ pH=8.14。\n因此安全沉淀 pH 区间为 4.7 ≤ pH < 8.1。',
      detailedExplanation:
        '选 C。杂质 Al³⁺ 完全沉淀所需 pH 为 4.7（若 pH<4.7，Al³⁺ 未完全沉淀）；而 Mn²⁺ 开始沉淀的 pH 为 8.1（若 pH≥8.1，主产物 Mn²⁺ 将沉淀损失）。故溶液 pH 须控制在 4.7 至 8.1 之间。',
    },
    {
      id: 'var-industrial-2',
      yearProvince: '2022 全国甲卷 / 2023 湖北高考真题变式',
      modelId: 'model-industrial-flow',
      title: '黄铜废渣 (主要含 ZnO、CuO，含 Fe₂O₃、Al₂O₃ 杂质) 制备高纯 ZnSO₄·7H₂O 工艺',
      contextDescription:
        '在硫酸酸浸液中加入 H₂O₂ 充分氧化后，加入 ZnO 调节溶液 pH，沉淀除去 Fe³⁺ 和 Al³⁺；随后滤液中加入锌粉除去 Cu²⁺ 杂质。已知 25℃ 时 lg c - pH 沉淀分布曲线如图所示。',
      questionText:
        '调节溶液 pH 沉淀除去 Fe³⁺ 和 Al³⁺ 时，最佳 pH 控制区间以及后续“置换除铜”步骤加入锌粉的化学反应方程式为：',
      diagramType: 'precipitation-curve',
      diagramConfig: {
        title: '25℃ 时 Fe³⁺、Al³⁺、Cu²⁺、Zn²⁺ 的 lg c - pH 沉淀分布曲线',
      },
      options: [
        { label: 'A', text: '3.2 ≤ pH < 4.7；Cu + Zn²⁺ = Zn + Cu²⁺', isCorrect: false },
        { label: 'B', text: '4.7 ≤ pH < 6.2；Zn + Cu²⁺ = Zn²⁺ + Cu↓', isCorrect: true },
        { label: 'C', text: '6.2 ≤ pH < 9.0；Zn + Cu²⁺ = Zn²⁺ + Cu↓', isCorrect: false },
        { label: 'D', text: 'pH ≥ 6.2；Zn + Fe³⁺ = Zn²⁺ + Fe', isCorrect: false },
      ],
      modelAlignmentAnalysis:
        '【盲盒剖析：沉淀 pH 区间与置换反应】\n1. 杂质 Al³⁺ 完全沉淀 pH 为 4.7；主离子 Zn²⁺ 开始沉淀 pH 为 6.2，因此调 pH 最佳区间为 4.7 ≤ pH < 6.2。\n2. 调 pH 无法除去同为二价的 Cu²⁺ 杂质，加入过量锌粉利用还原性强弱进行深度置换：Zn + Cu²⁺ = Zn²⁺ + Cu↓。',
      detailedExplanation:
        '选 B。Al³⁺ 完全沉淀需 pH ≥ 4.7，而 Zn²⁺ 在 pH=6.2 时开始沉淀损失，故调 pH 最佳区间为 [4.7, 6.2)。后续利用金属性 Zn > Cu，加入锌粉发生置换反应 Zn + Cu²⁺ = Zn²⁺ + Cu↓ 除去铜。',
    },
    {
      id: 'var-industrial-3',
      yearProvince: '2023 全国新课标卷 / 2024 浙江高考真题',
      modelId: 'model-industrial-flow',
      title: '钛铁矿 (主要成分 FeTiO₃，含 Fe₂O₃、Al₂O₃ 杂质) 制钛白粉 (TiO₂) 并副产绿矾工艺',
      contextDescription:
        '钛铁矿经浓硫酸酸解后生成 TiOSO₄ 和 FeSO₄。在浸出液中必须加入“铁屑”，将少量 Fe³⁺ 还原为 Fe²⁺，再经结晶分离绿矾，滤液加热水解制得 H₂TiO₃ 沉淀。',
      questionText:
        '工序中“加入铁屑将 Fe³⁺ 还原为 Fe²⁺”的根本目的是：____；加热水解生成钛酸沉淀的反应方程式为：____。',
      diagramType: 'precipitation-curve',
      diagramConfig: {
        title: 'TiO²⁺ 与 Fe³⁺/Fe²⁺ 水解沉淀 pH 分布对比图',
      },
      options: [
        {
          label: 'A',
          text: '防止 Fe³⁺ 水解混入 H₂TiO₃ 沉淀；TiOSO₄ + 2H₂O ≜ H₂TiO₃↓ + H₂SO₄',
          isCorrect: true,
        },
        {
          label: 'B',
          text: '促进 TiO²⁺ 水解；TiOSO₄ + H₂O = TiO₂↓ + H₂SO₄',
          isCorrect: false,
        },
        {
          label: 'C',
          text: '提高铁的浸出率；Fe + H₂SO₄ = FeSO₄ + H₂↑',
          isCorrect: false,
        },
        {
          label: 'D',
          text: '防止 Ti⁴⁺ 被氧化；Ti⁴⁺ + Fe = Ti³⁺ + Fe²⁺',
          isCorrect: false,
        },
      ],
      modelAlignmentAnalysis:
        '【盲盒剖析：逆向思维还原考点】\n1. Fe³⁺ 的 Ksp 极小 (4×10⁻³⁸)，在 pH<2 时即强烈水解生成 Fe(OH)₃，若不还原为 Fe²⁺，在加热水解制钛酸时 Fe(OH)₃ 会混入沉淀降低钛白粉纯度。\n2. Fe²⁺ 沉淀 pH 较高 (7.7)，在酸性条件下不水解，留在滤液中通过冷却结晶以 FeSO₄·7H₂O (绿矾) 析出。\n3. 加热水解方程式：TiOSO₄ + 2H₂O ≜ H₂TiO₃↓ + H₂SO₄。',
      detailedExplanation:
        '选 A。加入铁屑将 Fe³⁺ 还原为 Fe²⁺ 属于极具代表性的“逆向思维考点”，能防止 Fe³⁺ 水解产生的 Fe(OH)₃ 污染钛酸沉淀。TiOSO₄ 遇热强烈水解生成 H₂TiO₃ 沉淀。',
    },
    {
      id: 'var-industrial-4',
      yearProvince: '2024 湖北/山东/广东高考真题热点',
      modelId: 'model-industrial-flow',
      title: '废旧三元锂电池正极材料 (含 LiNiₓCoᵧMn₁₋ₓ₋ᵧO₂ 及 Al、Fe 杂质) 回收高纯钴/镍盐工艺',
      contextDescription:
        '废旧三元正极经稀 H₂SO₄ 和 H₂O₂ 还原酸浸后，加入 Na₂CO₃ 调 pH 至 5.0~5.2 沉淀除去 Fe³⁺ 和 Al³⁺；随后向滤液中加入 NaF 溶液除去 Ca²⁺ 和 Mg²⁺。',
      questionText:
        '关于该回收工艺，下列说法正确的是：',
      diagramType: 'precipitation-curve',
      diagramConfig: {
        title: '三元锂电池回收各离子沉淀 lg c - pH 分布曲线',
      },
      options: [
        { label: 'A', text: '酸浸时 H₂O₂ 作氧化剂，将 Co³⁺/Ni³⁺ 氧化为最高价态', isCorrect: false },
        { label: 'B', text: '加入 NaF 主要是利用 Ksp(MgF₂) 和 Ksp(CaF₂) 极小的性质深度除杂', isCorrect: true },
        { label: 'C', text: '调 pH 至 5.0~5.2 时，Co²⁺ 和 Ni²⁺ 将大量沉淀损失', isCorrect: false },
        { label: 'D', text: '可以改用过量 NaOH 代替 Na₂CO₃ 调 pH，效果完全一致', isCorrect: false },
      ],
      modelAlignmentAnalysis:
        '【盲盒剖析：还原酸浸与氟化物深度除杂】\n1. 三元正极中 Co/Ni 为高价态不溶物，H₂O₂ 在此作“还原剂”，将 Co³⁺/Ni³⁺ 还原为可溶的 Co²⁺/Ni²⁺。\n2. 调 pH 至 5.0~5.2 可使 Fe³⁺ (pH 3.2) 和 Al³⁺ (pH 4.7) 完全沉淀，而 Co²⁺/Ni²⁺ 开始沉淀 pH > 7.0，不会沉淀损失。\n3. Ca²⁺/Mg²⁺ 沉淀 pH 极高，调 pH 无法除去，加入 NaF 生成 MgF₂ (Ksp=6.5×10⁻⁹) 沉淀除去。',
      detailedExplanation:
        '选 B。H₂O₂ 作还原剂把高价 Co/Ni 还原为 +2 价；调 pH 至 5.0~5.2 仅沉淀铁铝；加入 NaF 利用难溶氟化物深度除去 Ca²⁺/Mg²⁺ 杂质。不能用过量 NaOH，否则 Al(OH)₃ 会溶解且 Co²⁺/Ni²⁺ 沉淀损失。',
    },
    {
      id: 'var-industrial-5',
      yearProvince: '2023 全国乙卷 / 浙江高考真题',
      modelId: 'model-industrial-flow',
      title: '盐湖卤水 (含 Mg²⁺、Ca²⁺、Fe³⁺、Al³⁺) 制备高纯氧化镁 (MgO) 工艺',
      contextDescription:
        '向盐湖卤水酸浸液中加入 MgO 调节 pH 至 5.0~8.5，完全除去 Fe³⁺ 和 Al³⁺；过滤后向滤液中加入 (NH₄)₂C₂O₄ (草酸铵) 溶液沉淀分离 Ca²⁺。',
      questionText:
        '下列关于盐湖卤水提纯高纯 MgO 的说法中，错误的是：',
      diagramType: 'precipitation-curve',
      diagramConfig: {
        title: '盐湖卤水 Mg²⁺、Ca²⁺、Fe³⁺、Al³⁺ lg c - pH 分布曲线',
      },
      options: [
        { label: 'A', text: '选用 MgO 调 pH 遵循“不引入新杂质”原则', isCorrect: false },
        { label: 'B', text: '调 pH 控制在 5.0~8.5 之间，Mg²⁺ 和 Ca²⁺ 均不沉淀', isCorrect: false },
        { label: 'C', text: '加入 (NH₄)₂C₂O₄ 主要是利用 Ksp(CaC₂O₄) 远小于草酸镁实现钙镁分离', isCorrect: false },
        { label: 'D', text: '调 pH 时也可以加入过量 NaOH 试剂，沉淀效果更好', isCorrect: true },
      ],
      modelAlignmentAnalysis:
        '【盲盒剖析：草酸盐分离与不增杂原则】\n1. MgO 消耗 H⁺ 提高 pH，引入 Mg²⁺ 恰好为主产物离子，不增杂质。\n2. Mg²⁺ 开始沉淀 pH 为 9.4，故 pH 5.0~8.5 下 Mg²⁺ 和 Ca²⁺ 完全保留在滤液中。\n3. CaC₂O₄ 沉淀溶解积极小 (Ksp=2.3×10⁻⁹)，可与 Mg²⁺ 彻底分离。\n4. 若加过量 NaOH，会导致 Mg²⁺ 在 pH>9.4 时提前大量沉淀损失，D 项说法错误。',
      detailedExplanation:
        '选 D。题目要求选错误的选项。加入过量 NaOH 会导致主目标离子 Mg²⁺ 生成 Mg(OH)₂ 沉淀析出造成严重损失，违反流程设计原则。故 D 选项说法错误，符合题意。',
    },
  ],
}
