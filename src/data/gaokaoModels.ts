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
 * 16 大高考专属交互动画工具元数据表
 */
export const gaokaoModels: GaokaoModelNode[] = [
  // ── A. 3 大记忆强化交互工具 ──
  {
    id: 'model-valence-matrix',
    category: 'memory-matrix',
    title: '专题一：无机元素价类二维矩阵探究工具',
    subtitle: '无机元素性质与显色反应记忆',
    description: '构建化合价 (-2 至 +7) 与物质类别 (单质/氧化物/酸碱/盐) 二维矩阵，支持多元素 (Fe/Cu/Al/Na/S/N/Cl/Si) 切换、试剂显色演示与方程式对比。',
    toolRoute: '/gaokao-tool/model-valence-matrix',
    iconName: 'Grid',
    badgeText: '记忆矩阵',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    relatedKnowledgeIds: ['node-iron', 'node-copper', 'node-sulfur'],
    examPointSummary: [
      '常见金属与非金属元素化合价与物质类别交叉记忆',
      '高频显色反应与离子检验 (如 Fe³⁺ + KSCN → 血红色)',
      '氧化还原反应中氧化剂与还原剂的价态选择逻辑',
    ],
  },
  {
    id: 'model-reagent-step',
    category: 'memory-matrix',
    title: '专题二：试剂滴加与沉淀变色演练工具',
    subtitle: '沉淀生成/溶解与颜色演变演练',
    description: '交互式演示滴加 NaOH 时 Fe(OH)₂ 白色沉淀在空气中迅速变为灰绿色、最终变为红褐色 Fe(OH)₃ 的过程，以及 Al(OH)₃ 两性溶解演练。',
    toolRoute: '/gaokao-tool/model-reagent-step',
    iconName: 'TestTube',
    badgeText: '试剂滴加',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    relatedKnowledgeIds: ['node-iron', 'node-aluminium'],
    examPointSummary: [
      'Fe(OH)₂ 被空气中氧气氧化为 Fe(OH)₃ 的现象与方程式',
      'Al³⁺ 滴加强碱先沉淀后溶解的定量关系与图像',
      '连续滴加试剂时分步反应的竞争顺序',
    ],
  },
  {
    id: 'model-flash-cards',
    category: 'memory-matrix',
    title: '专题三：高考易错事实盲盒对比卡片',
    subtitle: '漂白性/钝化/常识对比探究',
    description: '针对 SO₂ vs Cl₂ 漂白性差异 (加热是否恢复)、浓硝酸/浓硫酸对 Fe/Al 的钝化现象等易错点，提供对比验证与盲盒翻牌探究。',
    toolRoute: '/gaokao-tool/model-flash-cards',
    iconName: 'GitCompare',
    badgeText: '易错盲盒',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    relatedKnowledgeIds: ['node-sulfur', 'node-nitric-acid'],
    examPointSummary: [
      'SO₂ (化合结合)、Cl₂ (强氧化性)、活性炭 (物理吸附) 漂白机制对比',
      '常温下浓硫酸/浓硝酸对 Fe/Al 钝化的物理本质',
      '高考化学无机常识与实验易错选项拆解',
    ],
  },

  // ── B. 8 大高考解题母题交互工具 ──
  {
    id: 'model-titration-balance',
    category: 'master-model',
    title: '母题一：滴定突跃与离子浓度排序解题工具',
    subtitle: '选择题压轴突破',
    description: '强酸滴定弱酸/弱碱滴定过程中 pH 突跃点与电荷/物料/质子三大守恒实时比对及离子浓度大小排序推导。',
    toolRoute: '/gaokao-tool/model-titration-balance',
    iconName: 'Zap',
    badgeText: '选择压轴',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    relatedKnowledgeIds: ['node-ion-equilibrium', 'node-titration'],
    examPointSummary: [
      '滴定突跃点与指示剂变色范围 (酚酞/甲基橙) 的选择逻辑',
      '水溶液中电荷守恒、物料守恒与质子守恒推导',
      '混合溶液中离子浓度大小比较与水解/电离竞争',
    ],
  },
  {
    id: 'model-electrochemical-twin',
    category: 'master-model',
    title: '母题二：原电池 vs 电解池双对比解题工具',
    subtitle: '新型电池与膜穿透突破',
    description: '同屏左右对比自发原电池与外接电解池，演示阴阳极/正负极判定、电子流向及阳/阴离子选择性交换膜迁移。',
    toolRoute: '/gaokao-tool/model-electrochemical-twin',
    iconName: 'Split',
    badgeText: '解题母题',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    relatedKnowledgeIds: ['node-primary-cell', 'node-electrolytic-cell'],
    examPointSummary: [
      '正负极 / 阴阳极电极反应式书写与电子得失',
      '交换膜 (阳离子膜/阴离子膜) 下微粒定向迁移方向',
      '新型蓄电池 (全钒液流/锂离子电池) 充放电原理对比',
    ],
  },
  {
    id: 'model-crystal-3d-split',
    category: 'master-model',
    title: '母题三：3D晶胞切割均摊与密度导出工具',
    subtitle: '选必二大题满分推导',
    description: '基于 3D 晶胞模型进行顶点 (1/8)、棱 (1/4)、面心 (1/2) 立体切割演示，推导晶胞密度 ρ = NM/(V N_A) 表达式。',
    toolRoute: '/gaokao-tool/model-crystal-3d-split',
    iconName: 'Atom',
    badgeText: '3D 切割',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    relatedKnowledgeIds: ['node-unit-cell-calculation', 'node-crystal'],
    examPointSummary: [
      '均摊法计算单个晶胞内各类原子/离子净个数 N',
      '晶胞边长 a 与原子半径 r 的几何关系 (面心立方 / 体心立方)',
      '晶胞密度公式导出及 N_A 计算求解',
    ],
  },
  {
    id: 'model-reaction-principle-nexus',
    category: 'master-model',
    title: '母题四：勒夏特列移动与活化能图谱工具',
    subtitle: '反应原理大题图表分析',
    description: '集成催化剂降低活化能、玻尔兹曼分布以及压强/温度改变下 c-t 与 v-t 双图实时联动分析。',
    toolRoute: '/gaokao-tool/model-reaction-principle-nexus',
    iconName: 'FlaskConical',
    badgeText: '原理大题',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    relatedKnowledgeIds: ['node-le-chatelier', 'node-collision-theory'],
    examPointSummary: [
      '活化能 E_a 与催化剂对正逆反应速率的同等影响',
      '勒夏特列原理在 V/P/T 改变时的平衡移动方向判定',
      '平衡常数 K_p / K_c 随温度 T 的变化图像读图解题',
    ],
  },
  {
    id: 'model-vsepr-hybrid-3d',
    category: 'master-model',
    title: '母题五：VSEPR 与杂化轨道 3D 几何工具',
    subtitle: '分子立体构型直观透视',
    description: '3D 渲染 sp/sp²/sp³ 杂化轨道重叠过程与孤电子对对键角的排斥效应。',
    toolRoute: '/gaokao-tool/model-vsepr-hybrid-3d',
    iconName: 'Atom',
    badgeText: '3D 几何',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    relatedKnowledgeIds: ['node-vsepr', 'node-hybrid-orbital'],
    examPointSummary: [
      '价层电子对互斥模型 (VSEPR) 推导分子空间构型',
      '中心原子杂化类型 (sp, sp², sp³) 的快速计算判别',
      '孤电子对与键角大小变化规律 (如 CH₄ > NH₃ > H₂O)',
    ],
  },
  {
    id: 'model-gas-chain',
    category: 'experiment-chain',
    title: '母题六：气体制备/净化/尾气处理装置链工具',
    subtitle: '高考实验探究大题突破',
    description: '组合发生装置、洗气瓶、干燥管、收集集气瓶及尾气吸收装置，演示气体流动、杂质吸收与现象检验。',
    toolRoute: '/gaokao-tool/model-gas-chain',
    iconName: 'Layers',
    badgeText: '实验装置链',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    relatedKnowledgeIds: ['node-gas-preparation'],
    examPointSummary: [
      '气体制备顺序: 发生 → 净化除杂 → 干燥 → 收集 → 尾气处理',
      '洗气瓶长进短出与干燥管大进小出原则',
      '防倒吸装置 (倒置漏斗/安全瓶) 的物理原理',
    ],
  },
  {
    id: 'model-industrial-flow',
    category: 'experiment-chain',
    title: '母题七：无机工艺流程与沉淀调 pH 工具',
    subtitle: '工业流程大题核心破解',
    description: '交互式展示浸出、酸溶、氧化 (Fe²⁺ → Fe³⁺)、调 pH 沉淀杂质 (Fe³⁺/Al³⁺) 及结晶提纯工序链。',
    toolRoute: '/gaokao-tool/model-industrial-flow',
    iconName: 'Grid',
    badgeText: '工艺流程',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    relatedKnowledgeIds: ['node-iron', 'node-aluminium'],
    examPointSummary: [
      '调 pH 沉淀分离金属离子的 $K_{sp}$ 计算与控制范围',
      '浸出率影响因素 (温度/浓度/粉碎粒度)',
      '绿化环境与副产物循环利用的工序节点分析',
    ],
  },
  {
    id: 'model-organic-mechanism',
    category: 'master-model',
    title: '母题八：有机反应官能团断键机制工具',
    subtitle: '有机大题合成与断键解题',
    description: '3D/2D 演示酯化反应 (酸脱羟基醇脱氢)、加成反应、取代反应的旧键断裂与新键形成重组过程。',
    toolRoute: '/gaokao-tool/model-organic-mechanism',
    iconName: 'Dna',
    badgeText: '有机断键',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    relatedKnowledgeIds: ['node-esterification', 'node-addition-reaction', 'isomerism'],
    examPointSummary: [
      '酯化反应 18O 同位素标记法实验结论与断键位置',
      '烯烃/炔烃亲电加成反应马氏规则与断键',
      '同分异构体数目基团组合法快速计算',
    ],
  },
  {
    id: 'model-hess-law',
    category: 'master-model',
    title: '母题九：盖斯定律与热化学键能计算工具',
    subtitle: '反应热 ΔH 叠加与键能推导',
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
    title: '母题十：元素位-构-性与电子排布图谱工具',
    subtitle: '选必二结构推断压轴',
    description: '交互演示基态/激发态原子核外电子排布式、第一电离能反常 (IIA>IIIA, VA>VIA) 与微粒半径比较逻辑。',
    toolRoute: '/gaokao-tool/model-element-periodic-property',
    iconName: 'Atom',
    badgeText: '位构性推断',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-200',
    relatedKnowledgeIds: ['periodic-table', 'periodic-law', 'ionization-energy'],
    examPointSummary: [
      '基态原子电子排布式、价层电子排布与轨道表示式',
      '同周期第一电离能洪特规则半充满 (如 N > O) 反常辨析',
      '电子层结构相同的简单离子半径随核电荷数增大而减小',
    ],
  },
  {
    id: 'model-avogadro-constant',
    category: 'memory-matrix',
    title: '母题十一：阿伏加德罗常数 (N_A) 陷阱与粒子统计工具',
    subtitle: '选择题高频必考拆解',
    description: '梳理标况气体状态 (如 SO₃/CCl₄ 固体/液体)、弱电解质电离水解程度、氧化还原电子转移数等考点陷阱。',
    toolRoute: '/gaokao-tool/model-avogadro-constant',
    iconName: 'Grid',
    badgeText: 'N_A 陷阱',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    relatedKnowledgeIds: ['avogadro-constant', 'molar-volume', 'ion-equilibrium'],
    examPointSummary: [
      '标准状况 (0℃, 101 kPa) 下非气体物质陷阱',
      '弱酸弱碱电离与盐类水解微粒数守恒计算',
      '歧化反应/变价金属氧化还原反应中转移电子数',
    ],
  },
  {
    id: 'model-titration-error-purity',
    category: 'experiment-chain',
    title: '母题十二：定量滴定误差与纯度产率计算工具',
    subtitle: '高考定量实验大题突破',
    description: '演示滴定管读数视线偏差 (仰视/俯视)、未润洗、气泡未赶尽对测定浓度 c 产生的极值影响及纯度 w% 计算。',
    toolRoute: '/gaokao-tool/model-titration-error-purity',
    iconName: 'FlaskConical',
    badgeText: '定量误差',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    relatedKnowledgeIds: ['titration', 'neutralization-titration', 'error-analysis'],
    examPointSummary: [
      '滴定管装液前润洗与读数视角仰视俯视误差推导',
      '样品纯度 w% 与质量分数计算步骤模版',
      '返滴定法 (Back Titration) 的过量反应代数推导',
    ],
  },
  {
    id: 'model-organic-retrosynthesis',
    category: 'master-model',
    title: '母题十三：有机逆合成路线与官能团保护剖析工具',
    subtitle: '有机化学大题综合推断',
    description: '演示逆合成分析切断法、官能团保护 (如酚羟基/双键 protection) 及新情境信息反应推断迁移。',
    toolRoute: '/gaokao-tool/model-organic-retrosynthesis',
    iconName: 'Dna',
    badgeText: '有机逆合成',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    relatedKnowledgeIds: ['organic-synthesis', 'functional-group', 'retrosynthesis'],
    examPointSummary: [
      '目标分子的逆合成切断 (Bond Disconnection) 思路',
      '活泼官能团 (-OH, -NH₂, C=C) 的保护与脱保护反应',
      '高考新信息反应中反应物与产物的化学键对齐与迁移',
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
