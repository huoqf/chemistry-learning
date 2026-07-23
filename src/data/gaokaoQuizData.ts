export interface ScoringStep {
  id: string
  title: string
  type: 'fill-in' | 'keywords' | 'calculation'
  questionText: string
  formulaLatex?: string
  placeholder?: string
  correctAnswer: string | string[]
  explanation: string
}

export interface GaokaoVariantItem {
  id: string
  yearProvince: string
  modelId: string
  title: string
  contextDescription: string
  questionText: string
  options: {
    label: string
    text: string
    isCorrect: boolean
  }[]
  modelAlignmentAnalysis: string
  detailedExplanation: string
}

export interface ModelQuizData {
  modelId: string
  scoringSteps: ScoringStep[]
  variantQuizzes: GaokaoVariantItem[]
}

export const modelQuizMap: Record<string, ModelQuizData> = {
  'model-valence-matrix': {
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
        explanation: '踩分点：先取少量待测液滴加 KSCN 溶液“无明显现象/无变化”，再滴加新制氯水“溶液变为血红色”。顺序颠倒不得分！',
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
        modelAlignmentAnalysis: '【母题模型对齐】：本题考查无机价类二维图“价态与酸碱性对离子的稳定影响”。与 Fe²⁺/Fe³⁺ 氧化还原显色模型完全对应。',
        detailedExplanation: '碱性条件下 Cr(OH)₃ 沉淀可被 H₂O₂ 氧化为可溶的 CrO₄²⁻ (+6 价，黄色)，此为工业提铬关键步骤。',
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
      },
    ],
  },

  'model-titration-balance': {
    modelId: 'model-titration-balance',
    scoringSteps: [
      {
        id: 'step-1',
        title: '步骤 1：三大守恒式字母手算代入',
        type: 'fill-in',
        questionText: '在 c(HA) + c(NaA) 的等浓度混合溶液中，写出物料守恒表达式中 c(Na⁺) 与 A 元素总浓度关系：',
        formulaLatex: '2c(Na^+) = c(HA) + c(A^-)',
        placeholder: '输入系数，如 2',
        correctAnswer: ['2'],
        explanation: 'Na 与 A 元素物质的量之比为 1:2，故 2c(Na⁺) = c(HA) + c(A⁻)。',
      },
      {
        id: 'step-2',
        title: '步骤 2：pH 突跃点指示剂选择规范表达',
        type: 'keywords',
        questionText: '用 0.1000 mol/L NaOH 溶液滴定 0.1000 mol/L 醋酸，应选择什么指示剂？终点现象是什么？',
        correctAnswer: ['酚酞', '浅红', '30秒'],
        explanation: '踩分点：选择“酚酞”指示剂；终点现象为“滴入最后半滴溶液，溶液由无色变为浅红色，且 30 秒内不褪色”。',
      },
    ],
    variantQuizzes: [
      {
        id: 'var-2',
        yearProvince: '2025 高考模拟新情境',
        modelId: 'model-titration-balance',
        title: '二元弱酸 H₂A 滴定分布分数与 lg(c) 图像',
        contextDescription: '室温下向 0.1 mol/L H₂A 溶液中滴加 NaOH，微粒分布分数 δ 随 pH 的变化。',
        questionText: '当 pH = pKa2 时，溶液中主要微粒浓度大小关系为？',
        options: [
          { label: 'A', text: 'c(HA⁻) = c(A²⁻)', isCorrect: true },
          { label: 'B', text: 'c(H₂A) = c(A²⁻)', isCorrect: false },
          { label: 'C', text: 'c(Na⁺) = c(HA⁻) + 2c(A²⁻)', isCorrect: false },
          { label: 'D', text: '溶液呈强酸性', isCorrect: false },
        ],
        modelAlignmentAnalysis: '【母题模型对齐】：考查水溶液电离平衡突跃与微粒守恒。突破点在于识别交叉点 pH = pKa。',
        detailedExplanation: '根据 Ka2 = c(H⁺)c(A²⁻)/c(HA⁻)，当 c(H⁺) = Ka2 即 pH = pKa2 时，c(HA⁻) = c(A²⁻)。',
      },
    ],
  },

  'model-crystal-3d-split': {
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
  },

  'model-hess-law': {
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
  },

  'model-element-periodic-property': {
    modelId: 'model-element-periodic-property',
    scoringSteps: [
      {
        id: 'step-1',
        title: '步骤 1：基态原子核外电子排布式手算',
        type: 'fill-in',
        questionText: '24号元素 Cr 的基态原子价层电子排布式为：',
        placeholder: '3d5 4s1',
        correctAnswer: ['3d5 4s1', '3d⁵4s¹', '3d54s1'],
        explanation: 'Cr 遵循半充满稳定规则，价层电子排布式为 3d⁵4s¹，而非 3d⁴4s²。',
      },
      {
        id: 'step-2',
        title: '步骤 2：第一电离能与电负性反常踩分点',
        type: 'keywords',
        questionText: '比较同周期 N 与 O 的第一电离能大小，并简述规范理由。',
        correctAnswer: ['N>O', '半充满'],
        explanation: '踩分点：第一电离能 N > O；理由是基态 N 原子的 2p 轨道为 2p³ 半充满稳定状态。',
      },
    ],
    variantQuizzes: [
      {
        id: 'var-elem-1',
        yearProvince: '2024 山东卷',
        modelId: 'model-element-periodic-property',
        title: '短周期元素 X、Y、Z、W 的“位-构-性”逻辑推断',
        contextDescription: 'X 的基态原子 p 轨道电子数等于 s 轨道电子数，Y 的电负性在同周期中最强。',
        questionText: '下列关于这些元素及其化合物的说法正确的是？',
        options: [
          { label: 'A', text: '简单离子半径：W > Z > Y', isCorrect: false },
          { label: 'B', text: '第一电离能：Y > X > Z', isCorrect: true },
          { label: 'C', text: '最高价氧化物对应水化物的酸性：X > Y', isCorrect: false },
          { label: 'D', text: '基态 Z 原子的未成对电子数为 0', isCorrect: false },
        ],
        modelAlignmentAnalysis: '【母题模型对齐】：考查电子排布、第一电离能反常规律与微粒半径比较。',
        detailedExplanation: '根据排布推断 X=O, Y=F, Z=N, W=Na，第一电离能 F > N > O。',
      },
    ],
  },

  'model-avogadro-constant': {
    modelId: 'model-avogadro-constant',
    scoringSteps: [
      {
        id: 'step-1',
        title: '步骤 1：弱电解质水解/电离粒子数手算陷阱',
        type: 'calculation',
        questionText: '1 L 0.1 mol/L CH₃COOH 溶液中，CH₃COOH 分子与 CH₃COO⁻ 离子数之和是否为 0.1 N_A？输入 Yes 或 No：',
        placeholder: 'Yes',
        correctAnswer: ['Yes', 'yes'],
        explanation: '根据物料守恒，n(CH₃COOH) + n(CH₃COO⁻) = 0.1 mol，粒子数之和为 0.1 N_A。',
      },
      {
        id: 'step-2',
        title: '步骤 2：氧化还原反应电子转移 N_A 计算规范',
        type: 'fill-in',
        questionText: '标准状况下 2.24 L Cl₂ 通入足量冷 NaOH 溶液中，转移电子数为：',
        placeholder: '0.1 NA',
        correctAnswer: ['0.1 NA', '0.1Na', '0.1NA', '0.1'],
        explanation: 'Cl₂ + 2NaOH = NaCl + NaClO + H₂O，1 mol Cl₂ 歧化反应转移 1 mol 电子。2.24 L Cl₂ 即 0.1 mol，转移 0.1 N_A 电子。',
      },
    ],
    variantQuizzes: [
      {
        id: 'var-na-1',
        yearProvince: '2024 湖南卷',
        modelId: 'model-avogadro-constant',
        title: '设 N_A 为阿伏加德罗常数的值，下列说法正确的是？',
        contextDescription: '考查标况状态、D₂O/H₂O 分子结构、氧化还原与电离陷阱。',
        questionText: '下列说法正确的是？',
        options: [
          { label: 'A', text: '18 g D₂O 中含有的质子数为 10 N_A', isCorrect: false },
          { label: 'B', text: '1 mol Na₂O₂ 晶体中含有的阴离子数为 1 N_A', isCorrect: true },
          { label: 'C', text: '标准状况下 22.4 L SO₃ 中含有的分子数为 N_A', isCorrect: false },
          { label: 'D', text: 'pH = 1 的 H₂SO₄ 溶液中含有的 H⁺ 数为 0.1 N_A', isCorrect: false },
        ],
        modelAlignmentAnalysis: '【母题模型对齐】：高考必考选择题 $N_A$ 陷阱拆解。标况下 SO₃ 为固体；D₂O 摩尔质量为 20 g/mol；pH 溶液未说明体积。',
        detailedExplanation: 'Na₂O₂ 由 Na⁺ 与 O₂²⁻ 构成，1 mol 晶体中阴离子 O₂²⁻ 为 1 mol (N_A)。',
      },
    ],
  },

  'model-titration-error-purity': {
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
  },

  'model-organic-mechanism': {
    modelId: 'model-organic-mechanism',
    scoringSteps: [
      {
        id: 'step-1',
        title: '机制 1 踩分：同位素 18O 示踪法断键位置手算',
        type: 'fill-in',
        questionText: '用 CH₃COOH 与 CH₃CH₂¹⁸OH 在浓硫酸加热下发生酯化反应，水分子中是否含有 ¹⁸O 原子？',
        formulaLatex: 'CH_3COOH + CH_3CH_2^{18}OH \\xrightarrow{\\text{浓}H_2SO_4, \\Delta} CH_3CO^{18}OCH_2CH_3 + H_2O',
        placeholder: '输入“有”或“没有”',
        correctAnswer: ['没有', '不含', '否'],
        explanation: '踩分点：酸脱羟基 (-OH) 醇脱氢 (-H)，乙酸提供 -OH 形成水，醇提供 -¹⁸OH 结合生成乙酸乙酯，因此水分子中不含 ¹⁸O。水解时断裂酯基中的 C-O 单键。',
      },
      {
        id: 'step-2',
        title: '机制 2 踩分：马氏规则与不对称烯烃加成手算',
        type: 'fill-in',
        questionText: '丙烯 (CH₃-CH=CH₂) 与 HCl 发生加成反应，主产物的结构简式规范命名为？',
        formulaLatex: 'CH_3-CH=CH_2 + HCl \\to CH_3-CHCl-CH_3 \\quad (\\text{主产物})',
        placeholder: '输入主产物命名，如 2-氯丙烷',
        correctAnswer: ['2-氯丙烷', '2-氯丙烷(主产物)'],
        explanation: '踩分点：根据马氏规则，亲电加成时 H 优先加到含 H 较多的 1 号碳上 (-CH₂)，Cl 加到 2 号碳上，断裂碳碳双键中的 π 键，主产物为 2-氯丙烷。',
      },
      {
        id: 'step-3',
        title: '机制 3 踩分：醇催化氧化 α-H 条件规范答题',
        type: 'keywords',
        questionText: '2-甲基-2-丙醇 (叔丁醇) 在 Cu 催化并加热条件下能否被空气中的氧气催化氧化？说明高考规范原因。',
        correctAnswer: ['不能', '无α-氢', '没有α-氢', '没有α氢', '无α-H'],
        explanation: '踩分点：与 -OH 相连的碳原子 (α-C) 上“没有氢原子” (无 α-H)，无法发生脱氢氧化反应。伯醇氧化为醛，仲醇氧化为酮。',
      },
      {
        id: 'step-4',
        title: '机制 4 踩分：消去反应扎伊采夫规则与断键',
        type: 'keywords',
        questionText: '2-溴丁烷与 NaOH 醇溶液共热主要发生消去反应，生成的烯烃主产物名称及遵循的规则是什么？',
        correctAnswer: ['2-丁烯', '扎伊采夫规则', '扎伊采夫'],
        explanation: '踩分点：消去 C-Br 键与 β-C 上的 C-H 键，遵循“扎伊采夫规则”，氢优先从含氢较少的 β-碳上脱去，主产物为 2-丁烯。',
      },
      {
        id: 'step-5',
        title: '机制 5 踩分：肽键 (-CO-NH-) 生成与水解切断',
        type: 'fill-in',
        questionText: '甘氨酸与丙氨酸脱水缩合生成二肽，在稀硫酸加热水解时切断的化学键类型是？',
        placeholder: '输入切断化学键，如 C-N单键 / 肽键',
        correctAnswer: ['C-N单键', 'C-N键', '肽键', 'C-N', 'C-N 单键'],
        explanation: '踩分点：氨基酸脱水缩合形成 -CO-NH- (肽键)；水解时在 -CO-NH- 中的 C-N 单键处切断，加水恢复为羧基和氨基。',
      },
      {
        id: 'step-6',
        title: '机制 6 踩分：酚羟基活化与邻对位取代缩聚',
        type: 'keywords',
        questionText: '苯酚与浓溴水反应生成白色沉淀，酚羟基活化了苯环上哪些位置的 C-H 键？',
        correctAnswer: ['邻位和对位', '邻对位', '邻、对位'],
        explanation: '踩分点：酚羟基 (-OH) 具有强推电子效应，极化并活化苯环的“邻位和对位” C-H 键，易被 Br 元素取代生成 2,4,6-三溴苯酚白色沉淀。',
      },
    ],
    variantQuizzes: [
      {
        id: 'var-org-1',
        yearProvince: '2024 全国新课标卷',
        modelId: 'model-organic-mechanism',
        title: '同位素 18O 标记下有机酯化与水解断键机制',
        contextDescription: '某有机合成实验室利用同位素示踪法研究乙酸乙酯在 H₂¹⁸O 中的酸性水解历程。',
        questionText: '下列关于水解产物中 ¹⁸O 分布的说法正确的是？',
        options: [
          { label: 'A', text: '生成的乙酸和乙醇中均含有 ¹⁸O 原子', isCorrect: false },
          { label: 'B', text: '水解断裂酯基中 C-O 单键，生成的乙酸分子中含有 ¹⁸O', isCorrect: true },
          { label: 'C', text: '水解断裂 C=O 双键，生成的乙醇中含有 ¹⁸O', isCorrect: false },
          { label: 'D', text: '反应前后 ¹⁸O 的化学性质发生改变', isCorrect: false },
        ],
        modelAlignmentAnalysis: '【母题模型对齐】：考查酯水解断键位置。水解时 C-O 单键断裂，水中的 H-¹⁸OH 中 -¹⁸OH 加在酰基碳上形成 CH₃CO¹⁸OH。',
        detailedExplanation: '酯的水解是酯化反应的逆过程。水解断裂 C-O 单键，H₂¹⁸O 中的 -¹⁸OH 结合生成乙酸 (CH₃CO¹⁸OH)，-H 结合生成乙醇 (CH₃CH₂OH)。',
      },
      {
        id: 'var-org-2',
        yearProvince: '2024 全国甲卷',
        modelId: 'model-organic-mechanism',
        title: '不对称烯烃亲电加成马氏规则与断键取向',
        contextDescription: '丙烯 (CH₃-CH=CH₂) 与 HBr 在常温无过氧化物存在下发生亲电加成反应。',
        questionText: '下列关于该反应断键与加成产物的说法正确的是？',
        options: [
          { label: 'A', text: '断裂 C=C 中的 σ 键，主产物为 1-溴丙烷', isCorrect: false },
          { label: 'B', text: '断裂 C=C 中的 π 键，主产物为 2-溴丙烷', isCorrect: true },
          { label: 'C', text: 'H⁺ 优先加在 2 号碳上生成仲碳正离子', isCorrect: false },
          { label: 'D', text: '1-溴丙烷与 2-溴丙烷互为同分异构体，产物比例为 1:1', isCorrect: false },
        ],
        modelAlignmentAnalysis: '【母题模型对齐】：考查不对称烯烃加成马氏规则。π 键断裂后，中间体仲碳正离子 (CH₃-CH⁺-CH₃) 比伯碳正离子更稳定，故 H 加在 1 号碳上，Br 加在 2 号碳上。',
        detailedExplanation: '亲电加成时断裂较弱的 π 键。H⁺ 加在 1 号碳 (-CH₂) 上生成更稳定的仲碳正离子，随后 Br⁻ 攻击生成主产物 2-溴丙烷。',
      },
      {
        id: 'var-org-3',
        yearProvince: '2024 山东卷',
        modelId: 'model-organic-mechanism',
        title: '同分异构醇催化氧化断键特征与 α-H 条件',
        contextDescription: '分子式为 C₄H₁₀O 的四种同分异构醇分别在 Cu 催化加热下与 O₂ 反应。',
        questionText: '下列关于这四种醇催化氧化产物的说法正确的是？',
        options: [
          { label: 'A', text: '4 种醇均能被催化氧化生成醛或酮', isCorrect: false },
          { label: 'B', text: '能被催化氧化生成醛的醇有 2 种 (1-丁醇、2-甲基-1-丙醇)', isCorrect: true },
          { label: 'C', text: '2-丁醇 (仲醇) 被氧化生成丁酸', isCorrect: false },
          { label: 'D', text: '2-甲基-2-丙醇 (叔醇) 断裂 C-C 键生成丙酮', isCorrect: false },
        ],
        modelAlignmentAnalysis: '【母题模型对齐】：考查醇催化氧化 α-H 条件。伯醇 (-CH₂OH) 被氧化为醛；仲醇 (-CHOH-) 被氧化为酮；叔醇 (-COH) 无 α-H 不能被催化氧化。',
        detailedExplanation: 'C₄H₁₀O 的 4 种醇中：1-丁醇与 2-甲基-1-丙醇为伯醇，氧化为醛 (2种)；2-丁醇为仲醇，氧化为丁酮；2-甲基-2-丙醇为叔醇，无 α-H 不被催化氧化。',
      },
      {
        id: 'var-org-4',
        yearProvince: '2025 湖南高考模考',
        modelId: 'model-organic-mechanism',
        title: '卤代烃消去与取代条件判定及扎伊采夫规则',
        contextDescription: '将 2-溴丁烷分别与 NaOH 水溶液加热 (反应 I) 和 NaOH 乙醇溶液加热 (反应 II) 处理。',
        questionText: '下列关于反应 I 和反应 II 断键与产物的说法正确的是？',
        options: [
          { label: 'A', text: '反应 I 为消去反应，断裂 C-Br 键与 C-H 键', isCorrect: false },
          { label: 'B', text: '反应 II 主要消去产物为 2-丁烯 (满足扎伊采夫规则)', isCorrect: true },
          { label: 'C', text: '反应 I 与反应 II 均需使用 AgNO₃ 溶液检验 Br⁻', isCorrect: false },
          { label: 'D', text: '反应 II 产物能使溴水褪色，但不能使酸性 KMnO₄ 褪色', isCorrect: false },
        ],
        modelAlignmentAnalysis: '【母题模型对齐】：考查卤代烃在不同溶剂下的取代 vs 消去断键竞争。NaOH/醇溶液消去遵循扎伊采夫规则生成较多取代的烯烃 (2-丁烯)。',
        detailedExplanation: 'NaOH 醇溶液下发生消去反应，脱去 HBr 生成 2-丁烯 (主产物，扎伊采夫规则)；NaOH 水溶液下发生取代反应生成 2-丁醇。',
      },
      {
        id: 'var-org-5',
        yearProvince: '2024 广东卷',
        modelId: 'model-organic-mechanism',
        title: '多肽分子酰胺键/肽键水解切断与产物结构分析',
        contextDescription: '某三肽分子由甘氨酸 (Gly)、丙氨酸 (Ala) 和苯丙氨酸 (Phe) 缩合而成，在足量 1 mol/L 稀盐酸中加热完全水解。',
        questionText: '下列关于该水解过程及产物的说法正确的是？',
        options: [
          { label: 'A', text: '水解过程中消耗 3 mol H₂O', isCorrect: false },
          { label: 'B', text: '切断三肽分子中的 2 个 -CO-NH- (肽键) C-N 单键', isCorrect: true },
          { label: 'C', text: '水解产物在盐酸中以阴离子形式 (-COO⁻) 存在', isCorrect: false },
          { label: 'D', text: '水解后生成的氨基酸可通过显色反应直接鉴别', isCorrect: false },
        ],
        modelAlignmentAnalysis: '【母题模型对齐】：考查肽键水解断键位置。三肽含有 2 个肽键，水解切断 2 个 C-N 单键，消耗 2 mol H₂O。酸性条件下氨基结合 H⁺ 形成阳离子 (-NH₃⁺)。',
        detailedExplanation: '三肽由 3 个氨基酸脱去 2 分子水生成，含 2 个肽键 -CO-NH-。完全水解时切断 2 个 C-N 单键，在稀盐酸中，生成的氨基酸转化为盐酸盐阳离子 (如 H₃N⁺-CH₂-COOH)。',
      },
      {
        id: 'var-org-6',
        yearProvince: '2025 江苏高考模考',
        modelId: 'model-organic-mechanism',
        title: '苯酚与甲醛缩聚机制与酚羟基邻对位 C-H 活化',
        contextDescription: '苯酚与甲醛在酸性催化剂 (如盐酸) 作用下，按苯酚过量条件加热反应生成酚醛树脂。',
        questionText: '下列关于该反应机理与产物结构的说法正确的是？',
        options: [
          { label: 'A', text: '酸催化下，苯酚与甲醛按 1:1 摩尔比反应主要生成网状体型酚醛树脂', isCorrect: false },
          { label: 'B', text: '酚羟基使苯环邻、对位 C-H 键活化，与 HCHO 加成生成邻/对羟甲基苯酚', isCorrect: true },
          { label: 'C', text: '缩聚过程断裂酚羟基中的 O-H 键', isCorrect: false },
          { label: 'D', text: '碱催化、甲醛过量条件下生成线型酚醛树脂', isCorrect: false },
        ],
        modelAlignmentAnalysis: '【母题模型对齐】：考查酚醛缩聚断键机制。酚羟基活化邻对位 C-H 键，先与 HCHO 加成形成羟甲基 (-CH₂OH)，再脱水缩合形成 -CH₂- 羟甲基桥。酸催化苯酚过量得线型树脂；碱催化甲醛过量得体型树脂。',
        detailedExplanation: '苯酚酚羟基对苯环有推电子活化作用，使邻、对位 C-H 键易与甲醛的 C=O 发生加成反应生成邻羟甲基苯酚或对羟甲基苯酚，再脱水缩合生成酚醛树脂。',
      },
    ],
  },
  'model-organic-retrosynthesis': {
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
        explanation: '踩分点：强氧化剂 (如 KMnO₄/酸性) 会同时氧化 C=C 双键，保护双键可实现官能团的“选择性”氧化。',
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
        modelAlignmentAnalysis: '【母题模型对齐】：考查高考有机大题“官能团保护”与“新结构信息迁移”。',
        detailedExplanation: '保护羟基与氨基是有机合成高频考点，防止强碱或氧化剂破坏活泼氢。',
      },
    ],
  },
}

export function getModelQuizData(modelId: string): ModelQuizData | undefined {
  return modelQuizMap[modelId]
}
