export type GaokaoModelCategory = 'master-model' | 'memory-matrix' | 'experiment-chain'

export interface GaokaoModelNode {
  id: string
  category: GaokaoModelCategory
  title: string
  subtitle: string
  description: string
  toolRoute: string // 高考专属工具页面路由 '/gaokao-tool/xxx'
  iconName: 'Zap' | 'FlaskConical' | 'Atom' | 'TestTube' | 'Dna' | 'Grid' | 'Split' | 'Layers' | 'GitCompare' | 'Layers3'
  badgeText: string
  badgeColor: string
  relatedKnowledgeIds: string[]
  examPointSummary: string[]
}

/**
 * 18 大高考专属交互动画工具元数据表
 */
export const gaokaoModels: GaokaoModelNode[] = [
  // ── A. 5 大记忆强化交互工具 (memory-matrix) ──
  {
    id: 'model-valence-matrix',
    category: 'memory-matrix',
    title: '专题一：无机元素价类二维图与转化网',
    subtitle: '元素化合物·价态与物质转化全景',
    description: '构建化合价 (-4 至 +7) 与物质类别二维矩阵，全周期覆盖新高考 40 大无机元素 (主族非金属 14 种、主族金属 14 种、过渡与工业金属 12 种)，支持同格多物质探究、试剂显色演练与氧化还原路径网。',
    toolRoute: '/gaokao-tool/model-valence-matrix',
    iconName: 'Grid',
    badgeText: '记忆矩阵',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    relatedKnowledgeIds: ['iron', 'copper', 'sulfur', 'nitrogen', 'chlorine', 'aluminum', 'sodium'],
    examPointSummary: [
      '元素周期表前四周期全主族+重金属工业流程元素 (40 种) 价类网格全覆盖',
      '主族非金属 (H/B/C/Si/N/P/As/O/S/Se/F/Cl/Br/I) 与金属 (Li~Bi, Ti~W) 转化',
      '特征显色反应与离子检验、歧化与归中反应方程式规范书写',
    ],
  },
  {
    id: 'model-ion-matrix',
    category: 'memory-matrix',
    title: '专题二：离子特征检验与共存互斥矩阵',
    subtitle: '无机定性分析·特征鉴别与隐蔽条件',
    description: '收录高考 16 大核心阴阳离子特征检验特效试剂、现象与干扰排除，支持多离子共存智能冲突检测引擎。',
    toolRoute: '/gaokao-tool/model-ion-matrix',
    iconName: 'FlaskConical',
    badgeText: '离子检验',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    relatedKnowledgeIds: ['iron', 'aluminum', 'copper', 'sulfur'],
    examPointSummary: [
      'Fe³⁺/Fe²⁺/Al³⁺/Cu²⁺/NH₄⁺/SO₄²⁻/Cl⁻/I⁻ 特征检验与标准答题句式',
      '沉淀、气体、弱电解质、氧化还原、剧烈双水解共存互斥规则排查',
      '溶液颜色限制与介质酸碱性隐含条件快速甄别',
    ],
  },
  {
    id: 'model-organic-matrix',
    category: 'memory-matrix',
    title: '专题三：官能团定性鉴别与反应计量矩阵',
    subtitle: '有机推断基础·特征反应与摩尔比例',
    description: '结构化展示 16 大高考核心官能团特异性鉴别试剂与波谱特征，提供与 Na、NaOH、NaHCO₃、Br₂、H₂ 反应消耗摩尔比即时计算器与全原子 3D 球棍模型。',
    toolRoute: '/gaokao-tool/model-organic-matrix',
    iconName: 'Dna',
    badgeText: '官能团定量',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    relatedKnowledgeIds: ['carboxylic-acid-ester', 'ethylene', 'organic-synthesis'],
    examPointSummary: [
      '酚羟基 vs 羧基与 Na/NaOH/NaHCO₃ 反应的定性与定量差异 (阿司匹林母题)',
      '1 mol 酚酯水解消耗 2 mol NaOH 极值陷阱',
      '碳碳双键/三键/醛基加成与氧化消耗 Br₂/H₂ 的摩尔比推断',
      '醇与醚的官能团异构 (C₂H₆O) 及醚键化学惰性特征',
      '碳酸酯基水解耗 2 碱及酸化释放 CO₂ 的高分子缩聚应用',
    ],
  },
  {
    id: 'model-reagent-step',
    category: 'memory-matrix',
    title: '专题四：试剂滴加先后竞争与沉淀转化',
    subtitle: '实验现象探究·两性溶解与分步反应',
    description: '交互式演示滴加 NaOH 时 Fe(OH)₂ 白色沉淀在空气中迅速变为灰绿色、最终变为红褐色 Fe(OH)₃ 的过程，以及 Al(OH)₃ 两性溶解演练。',
    toolRoute: '/gaokao-tool/model-reagent-step',
    iconName: 'TestTube',
    badgeText: '试剂滴加',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    relatedKnowledgeIds: ['iron', 'aluminum', 'copper', 'precipitation-equilibrium'],
    examPointSummary: [
      'Fe(OH)₂ 被空气中氧气氧化为 Fe(OH)₃ 的现象演变与防氧化三要素',
      'Al³⁺ 滴加强碱先沉淀后溶解的 3:1 定量关系与强弱碱图像比对',
      '多元阳离子分步滴加竞争顺序 (中和强酸 → 难溶沉淀 → 结合弱碱根 → 两性沉淀溶解)',
      'AgCl → AgI → Ag₂S 沉淀转化规律及“沉淀剂需足量/无游离银离子”高考实验评价陷阱',
    ],
  },
  {
    id: 'model-flash-cards',
    category: 'memory-matrix',
    title: '专题五：高考高频易错辨析与实验规范答题',
    subtitle: '高频陷阱排查·规范答题满分模板',
    description: '针对 SO₂ vs Cl₂ 漂白性差异、钝化本质、沉淀洗涤与洗净检验、滴定终点判定等 21 大高频易错盲点提供对比探究与标准规范答题记忆。',
    toolRoute: '/gaokao-tool/model-flash-cards',
    iconName: 'GitCompare',
    badgeText: '易错辨析',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    relatedKnowledgeIds: ['sulfur', 'nitrogen', 'separation-purification', 'titration'],
    examPointSummary: [
      '沉淀洗涤、洗净检验、气密性检验、滴定终点判定 6 大标准答题规范',
      'SO₂ (化合结合)、Cl₂ (强氧化性)、活性炭 (物理吸附) 漂白机制对比',
      '常温下浓硫酸/浓硝酸对 Fe/Al 钝化的物理化学本质',
    ],
  },

  // ── B. 10 大高考解题母题交互工具 (master-model) ──
  {
    id: 'model-titration-balance',
    category: 'master-model',
    title: '母题一：滴定曲线突跃与离子浓度排序',
    subtitle: '水溶液平衡压轴·三大守恒与粒子排序',
    description: '强酸滴定弱酸/弱碱滴定过程中 pH 突跃点与电荷/物料/质子三大守恒实时比对及离子浓度大小排序推导。',
    toolRoute: '/gaokao-tool/model-titration-balance',
    iconName: 'Zap',
    badgeText: '水溶液平衡',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    relatedKnowledgeIds: ['titration', 'chemical-conservation', 'ph-calculation'],
    examPointSummary: [
      '滴定突跃点与指示剂变色范围 (酚酞/甲基橙) 的选择逻辑',
      '水溶液中电荷守恒、物料守恒与质子守恒推导',
      '混合溶液中离子浓度大小比较与水解/电离竞争',
    ],
  },
  {
    id: 'model-electrochemical-twin',
    category: 'master-model',
    title: '母题二：原电池与电解池双池对比模型',
    subtitle: '电化学核心考点·极性判据与离子膜迁移',
    description: '同屏左右对比自发原电池与外接电解池，演示阴阳极/正负极判定、电子流向及阳/阴离子选择性交换膜迁移。',
    toolRoute: '/gaokao-tool/model-electrochemical-twin',
    iconName: 'Split',
    badgeText: '双池对比',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    relatedKnowledgeIds: ['primary-cell', 'electrolysis'],
    examPointSummary: [
      '正负极 / 阴阳极电极反应式书写与电子得失',
      '交换膜 (阳离子膜/阴离子膜) 下微粒定向迁移方向',
      '新型蓄电池 (全钒液流/锂离子电池) 充放电原理对比',
    ],
  },
  {
    id: 'model-crystal-3d-split',
    category: 'master-model',
    title: '母题三：3D 晶胞均摊切割与密度计算',
    subtitle: '物质结构大题·均摊定式与空间几何',
    description: '基于 3D 晶胞模型进行顶点 (1/8)、棱 (1/4)、面心 (1/2) 立体切割演示，推导晶胞密度计算表达式。',
    toolRoute: '/gaokao-tool/model-crystal-3d-split',
    iconName: 'Atom',
    badgeText: '晶胞均摊',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    relatedKnowledgeIds: ['unit-cell-calculation', 'crystal-structure'],
    examPointSummary: [
      '均摊法计算单个晶胞内各类原子/离子净个数 N',
      '晶胞边长 a 与原子半径 r 的几何关系 (面心立方 / 体心立方)',
      '晶胞密度公式导出及 N_A 关联计算求解',
    ],
  },
  {
    id: 'model-reaction-principle-nexus',
    category: 'master-model',
    title: '母题四：反应机理能量图与勒夏特列平衡',
    subtitle: '反应原理综合·活化能与多平衡移动',
    description: '集成催化剂降低活化能、玻尔兹曼分布以及压强/温度改变下 c-t 与 v-t 双图实时联动分析。',
    toolRoute: '/gaokao-tool/model-reaction-principle-nexus',
    iconName: 'FlaskConical',
    badgeText: '反应机理',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    relatedKnowledgeIds: ['le-chatelier', 'rate-theory'],
    examPointSummary: [
      '活化能 E_a 与催化剂对正逆反应速率的同等影响',
      '勒夏特列原理在 V/P/T 改变时的平衡移动方向判定',
      '平衡常数 K_p / K_c 随温度 T 的变化图像读图解题',
    ],
  },
  {
    id: 'model-vsepr-hybrid-3d',
    category: 'master-model',
    title: '母题五：VSEPR 理论与杂化轨道空间构型',
    subtitle: '微观构型预测·价层互斥与键角畸变',
    description: '3D 渲染 sp/sp²/sp³ 杂化轨道重叠过程与孤电子对对键角的排斥效应。',
    toolRoute: '/gaokao-tool/model-vsepr-hybrid-3d',
    iconName: 'Atom',
    badgeText: '立体构型',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    relatedKnowledgeIds: ['vsepr', 'hybridization'],
    examPointSummary: [
      '价层电子对互斥模型 (VSEPR) 推导分子空间构型',
      '中心原子杂化类型 (sp, sp², sp³) 的快速计算判别',
      '孤电子对与键角大小变化规律 (如 CH₄ > NH₃ > H₂O)',
    ],
  },
  {
    id: 'model-organic-mechanism',
    category: 'master-model',
    title: '母题六：有机反应机理与键位断裂重组',
    subtitle: '有机推断大题·同位素示踪与断键成键',
    description: '3D/2D 演示酯化反应 (酸脱羟基醇脱氢)、加成反应、取代反应的旧键断裂与新键形成重组过程。',
    toolRoute: '/gaokao-tool/model-organic-mechanism',
    iconName: 'Dna',
    badgeText: '断键重组',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    relatedKnowledgeIds: ['carboxylic-acid-ester', 'ethylene', 'isomerism'],
    examPointSummary: [
      '酯化反应 18O 同位素标记法实验结论与断键位置',
      '烯烃/炔烃亲电加成反应马氏规则与断键',
      '同分异构体数目基团组合法快速计算',
    ],
  },
  {
    id: 'model-hess-law',
    category: 'master-model',
    title: '母题七：盖斯定律与微观反应热叠加',
    subtitle: '化学反应能量·方程式运算法与键能推导',
    description: '演示已知热化学方程式线性叠加推导目标反应 ΔH，结合微观键能 (断键吸热 - 成键放热) 算术推导。',
    toolRoute: '/gaokao-tool/model-hess-law',
    iconName: 'Zap',
    badgeText: '盖斯定律',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    relatedKnowledgeIds: ['hess-law', 'enthalpy', 'thermochemical-equation'],
    examPointSummary: [
      '盖斯定律方程式乘倍、反向变号与代数相加',
      '微观键能 ΔH = 反应物键能和 - 生成物键能和',
      '催化剂与活化能对 ΔH 影响的易错辨析',
    ],
  },
  {
    id: 'model-element-periodic-property',
    category: 'master-model',
    title: '母题八：元素位-构-性推断与电子排布',
    subtitle: '结构推断压轴·洪特规则反常与周期律',
    description: '交互演示基态/激发态原子核外电子排布式、第一电离能反常 (IIA>IIIA, VA>VIA) 与微粒半径比较逻辑。',
    toolRoute: '/gaokao-tool/model-element-periodic-property',
    iconName: 'Atom',
    badgeText: '位构性推断',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-200',
    relatedKnowledgeIds: ['electron-configuration', 'periodic-law', 'periodic-table'],
    examPointSummary: [
      '基态原子电子排布式、价层电子排布与轨道表示式',
      '同周期第一电离能洪特规则半充满 (如 N > O) 反常辨析',
      '电子层结构相同的简单离子半径随核电荷数增大而减小',
    ],
  },
  {
    id: 'model-avogadro-constant',
    category: 'master-model',
    title: '母题九：阿伏加德罗常数 (N_A) 陷阱破译',
    subtitle: '客观题必得分·状态/微粒/转移电子辨析',
    description: '系统梳理标况气体状态 (如 SO₃/CCl₄ 固体/液体)、弱电解质电离水解程度、氧化还原电子转移数等常考陷阱。',
    toolRoute: '/gaokao-tool/model-avogadro-constant',
    iconName: 'Grid',
    badgeText: 'N_A 陷阱',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    relatedKnowledgeIds: ['avogadro-constant', 'gas-molar-volume', 'ionization-equilibrium'],
    examPointSummary: [
      '标准状况 (0℃, 101 kPa) 下非气体物质聚集状态陷阱',
      '弱酸弱碱电离与盐类水解微粒数守恒计算',
      '歧化反应/变价金属氧化还原反应中转移电子数定量辨析',
    ],
  },
  {
    id: 'model-organic-retrosynthesis',
    category: 'master-model',
    title: '母题十：有机逆合成切断与官能团保护',
    subtitle: '选必三压轴大题·逆向思维与信息反应迁移',
    description: '演示逆合成分析切断法、官能团保护 (如酚羟基/双键 protection) 及新情境信息反应推断迁移。',
    toolRoute: '/gaokao-tool/model-organic-retrosynthesis',
    iconName: 'Dna',
    badgeText: '逆合成推断',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    relatedKnowledgeIds: ['organic-synthesis', 'carboxylic-acid-ester', 'halogenated-hydrocarbon'],
    examPointSummary: [
      '目标分子的逆合成切断 (Bond Disconnection) 策略',
      '活泼官能团 (-OH, -NH₂, C=C) 的保护与脱保护反应',
      '高考新信息反应中反应物与产物的化学键对齐与迁移',
    ],
  },

  // ── C. 3 大实验综合流程链交互工具 (experiment-chain) ──
  {
    id: 'model-gas-chain',
    category: 'experiment-chain',
    title: '实验一：气体制备/除杂/收集装置全流程链',
    subtitle: '无机实验大题·气路连接与防倒吸原理',
    description: '组合发生装置、洗气瓶、干燥管、收集集气瓶及尾气吸收装置，演示气体流动、杂质吸收与现象检验。',
    toolRoute: '/gaokao-tool/model-gas-chain',
    iconName: 'Layers',
    badgeText: '气路全流程',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    relatedKnowledgeIds: ['gas-preparation', 'separation-purification'],
    examPointSummary: [
      '气体制备完整顺序: 发生 → 净化除杂 → 干燥 → 收集 → 尾气处理',
      '洗气瓶长进短出与干燥管大进小出操作原则',
      '防倒吸装置 (倒置漏斗/安全瓶) 的物理学压强平衡原理',
    ],
  },
  {
    id: 'model-industrial-flow',
    category: 'experiment-chain',
    title: '实验二：无机化工工艺流程与沉淀分离',
    subtitle: '化工流程大题·溶浸氧化与 Ksp 调 pH 沉淀',
    description: '交互式展示浸出、酸溶、氧化 (Fe²⁺ → Fe³⁺)、调 pH 沉淀杂质 (Fe³⁺/Al³⁺) 及结晶提纯工序链。',
    toolRoute: '/gaokao-tool/model-industrial-flow',
    iconName: 'Grid',
    badgeText: '工艺流程',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    relatedKnowledgeIds: ['iron', 'aluminum', 'precipitation-equilibrium'],
    examPointSummary: [
      '调 pH 沉淀分离金属离子的 Ksp 计算与沉淀控制范围',
      '浸出率影响因素 (温度/浓度/粉碎粒度/搅拌)',
      '绿色化学与副产物循环利用的工序节点分析',
    ],
  },
  {
    id: 'model-titration-error-purity',
    category: 'experiment-chain',
    title: '实验三：定量滴定误差分析与产率纯度计算',
    subtitle: '定量实验分析·视线误差与返滴定计算',
    description: '演示滴定管读数视线偏差 (仰视/俯视)、未润洗、气泡未赶尽对测定浓度 c 产生的极值影响及纯度 w% 计算。',
    toolRoute: '/gaokao-tool/model-titration-error-purity',
    iconName: 'FlaskConical',
    badgeText: '滴定误差',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    relatedKnowledgeIds: ['titration', 'quantitative-analysis', 'solution-preparation'],
    examPointSummary: [
      '滴定管装液前润洗与读数视角仰视俯视误差几何推导',
      '样品纯度 w% 与质量分数规范计算步骤模版',
      '返滴定法 (Back Titration) 的过量反应代数推导',
    ],
  },
]

export const gaokaoModelIndex: Record<string, GaokaoModelNode> = {}
gaokaoModels.forEach(m => {
  gaokaoModelIndex[m.id] = m
})

export function getGaokaoModel(id: string): GaokaoModelNode | undefined {
  return gaokaoModelIndex[id]
}
