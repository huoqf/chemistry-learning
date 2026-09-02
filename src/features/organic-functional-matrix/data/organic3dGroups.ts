import { ATOM_COLORS } from '@/theme'
import {
  type Organic3DMolecule,
  createMultiBonds,
  createBenzeneRing,
  createMethylGroup,
  createMethyleneGroup,
} from './organic3dTypes'

export const FUNCTIONAL_GROUP_3D_MOLECULES: Record<string, Organic3DMolecule> = {
  // 1. 乙烯 (碳碳双键)
  'alkene-c=c': {
    id: 'alkene-c=c',
    name: '乙烯 (CH₂=CH₂)',
    formula: 'CH_2=CH_2',
    categoryName: '烯烃 / 碳碳双键基准',
    relatedGroupId: 'alkene-c=c',
    description: '碳碳双键由 1 个 σ 键与 1 个 π 键构成，π 键电子云暴露在外易断裂，专一性发生加成与加聚反应。',
    spatialContrastNote:
      '【空间立体易混辨析】：结构简式均为 CH₃-CH=CH-CH₃ 时，双键由于 π 键阻碍无法自由旋转，存在【顺式 (Cis，两甲基同侧，极性大)】与【反式 (Trans，两甲基异侧，中心对称)】两种完全不同的 3D 空间球棍构型！点击下方切换观察。',
    variants: [
      {
        id: 'alkene-c=c',
        label: '基准：乙烯',
        formula: 'CH₂=CH₂',
        differenceHint: '基准平面模型 (6原子共面)',
        targetMoleculeId: 'alkene-c=c',
      },
      {
        id: 'alkene-cis-2-butene',
        label: '顺-2-丁烯 (Cis)',
        formula: '顺-CH₃CH=CHCH₃',
        differenceHint: '两甲基处于同侧，分子具有偶极极性',
        targetMoleculeId: 'alkene-cis-2-butene',
      },
      {
        id: 'alkene-trans-2-butene',
        label: '反-2-丁烯 (Trans)',
        formula: '反-CH₃CH=CHCH₃',
        differenceHint: '两甲基处于异侧，中心对称非极性，熔点更高',
        targetMoleculeId: 'alkene-trans-2-butene',
      },
    ],
    geometryFeatures: {
      hybridization: 'C 原子均为 sp² 杂化',
      coplanarInfo: '全部 6 个原子严格共平面 (键角约 120°)',
      reactionSite: 'C=C 双键中的 π 键断裂加成 (1:1 消耗 Br₂ / H₂)',
    },
    keyPoints: [
      '6 个原子必定在同一平面上',
      '与溴水 1:1 加成生成 1,2-二溴乙烷褪色',
      '能被酸性 KMnO₄ 氧化断键生成 CO₂ 气体',
    ],
    relatedKnowledgeNode: {
      id: 'anim-hybrid-orbital',
      name: '杂化轨道理论与共面结构',
      routeHash: '/feature/anim-hybrid-orbital',
    },
    atoms: [
      { id: 'c1', symbol: 'C', elementName: '碳 (sp²)', position: [-0.67, 0, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp²', isFunctionalGroup: true },
      { id: 'c2', symbol: 'C', elementName: '碳 (sp²)', position: [0.67, 0, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp²', isFunctionalGroup: true },
      { id: 'h1', symbol: 'H', elementName: '氢', position: [-1.25, 0.95, 0], color: ATOM_COLORS.H, radius: 0.22 },
      { id: 'h2', symbol: 'H', elementName: '氢', position: [-1.25, -0.95, 0], color: ATOM_COLORS.H, radius: 0.22 },
      { id: 'h3', symbol: 'H', elementName: '氢', position: [1.25, 0.95, 0], color: ATOM_COLORS.H, radius: 0.22 },
      { id: 'h4', symbol: 'H', elementName: '氢', position: [1.25, -0.95, 0], color: ATOM_COLORS.H, radius: 0.22 },
    ],
    bonds: [
      ...createMultiBonds([-0.67, 0, 0], [0.67, 0, 0], 2, 'c=c'),
      { id: 'c1-h1', start: [-0.67, 0, 0], end: [-1.25, 0.95, 0], order: 1 },
      { id: 'c1-h2', start: [-0.67, 0, 0], end: [-1.25, -0.95, 0], order: 1 },
      { id: 'c2-h3', start: [0.67, 0, 0], end: [1.25, 0.95, 0], order: 1 },
      { id: 'c2-h4', start: [0.67, 0, 0], end: [1.25, -0.95, 0], order: 1 },
    ],
  },

  // 2. 乙炔 (碳碳三键)
  'alkyne-c#c': {
    id: 'alkyne-c#c',
    name: '乙炔 (CH≡CH)',
    formula: 'CH\\equiv CH',
    categoryName: '炔烃 / 直线型基准',
    relatedGroupId: 'alkyne-c#c',
    description: '碳碳三键由 1 个 σ 键和 2 个相互垂直的 π 键构成，具有直线型刚性分子构型。',
    geometryFeatures: {
      hybridization: 'C 原子均为 sp 杂化',
      coplanarInfo: '4 个原子共线且共平面 (直线型，键角 180°)',
      collinearInfo: '4 个原子全部在一条直线上 (共线)',
      reactionSite: 'C≡C 三键完全加成消耗 2 mol Br₂ 或 2 mol H₂',
    },
    keyPoints: [
      '所有 4 个原子共直线、共平面',
      '1 mol C≡C 与 2 mol Br₂ 发生分步加成',
      '末端炔活泼氢可与银氨溶液反应生成炔银沉淀',
    ],
    relatedKnowledgeNode: {
      id: 'anim-hybrid-orbital',
      name: 'sp 杂化轨道与直线型分子',
      routeHash: '/feature/anim-hybrid-orbital',
    },
    atoms: [
      { id: 'c1', symbol: 'C', elementName: '碳 (sp)', position: [-0.6, 0, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp', isFunctionalGroup: true },
      { id: 'c2', symbol: 'C', elementName: '碳 (sp)', position: [0.6, 0, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp', isFunctionalGroup: true },
      { id: 'h1', symbol: 'H', elementName: '氢', position: [-1.65, 0, 0], color: ATOM_COLORS.H, radius: 0.22 },
      { id: 'h2', symbol: 'H', elementName: '氢', position: [1.65, 0, 0], color: ATOM_COLORS.H, radius: 0.22 },
    ],
    bonds: [
      ...createMultiBonds([-0.6, 0, 0], [0.6, 0, 0], 3, 'c#c'),
      { id: 'c1-h1', start: [-0.6, 0, 0], end: [-1.65, 0, 0], order: 1 },
      { id: 'c2-h2', start: [0.6, 0, 0], end: [1.65, 0, 0], order: 1 },
    ],
  },

  // 3. 乙醇 (醇羟基)
  'alcohol-oh': {
    id: 'alcohol-oh',
    name: '乙醇 (CH₃CH₂OH)',
    formula: 'CH_3-CH_2-OH',
    categoryName: '醇类 / 脂肪醇',
    relatedGroupId: 'alcohol-oh',
    description: '氧原子为 sp³ 杂化（含 2 对孤对电子），C-O-H 呈现折线形。羟基连在 sp³ 饱和碳上，不具备弱酸性。',
    spatialContrastNote:
      '【醇 vs 酚立体差异】：乙醇与苯酚都含有 -OH。但乙醇的 -OH 连在 sp³ 四面体饱和碳上（呈现空间折线与自由旋转，呈中性）；苯酚的 -OH 必须直接连在 sp² 苯环平面碳上（与苯环大 π 键共轭，呈弱酸性）。',
    variants: [
      { id: 'alcohol-oh', label: '脂肪醇：乙醇', formula: 'CH₃CH₂OH', differenceHint: '-OH 连 sp³ 碳 (中性)', targetMoleculeId: 'alcohol-oh' },
      { id: 'phenol-oh', label: '酚类：苯酚', formula: 'C₆H₅OH', differenceHint: '-OH 直连苯环 sp² 碳 (弱酸性)', targetMoleculeId: 'phenol-oh' },
      { id: 'benzyl-alcohol', label: '芳香醇：苯甲醇', formula: 'C₆H₅-CH₂OH', differenceHint: '-OH 连侧链 sp³ 碳 (中性醇)', targetMoleculeId: 'benzyl-alcohol' },
    ],
    geometryFeatures: {
      hybridization: '碳为 sp³ 四面体杂化，氧为 sp³ 折线形',
      coplanarInfo: '最多 3~4 个原子共平面（单键可自由旋转）',
      reactionSite: 'O-H 键断裂（遇 Na 放 H₂）/ C-O 键断裂（消去/取代脱水）',
    },
    keyPoints: [
      '1 mol 醇羟基消耗 1 mol Na，放出 0.5 mol H₂',
      '绝对不与 NaOH / NaHCO₃ / Na₂CO₃ 反应',
      '铜催化氧化生成乙醛，浓硫酸 170℃ 消去生成乙烯',
    ],
    relatedKnowledgeNode: {
      id: 'anim-isomerism',
      name: '乙醇与二甲醚官能团异构',
      routeHash: '/feature/anim-isomerism',
    },
    atoms: [
      { id: 'c1', symbol: 'C', elementName: '甲基碳 (sp³)', position: [-1.2, -0.2, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp³' },
      { id: 'c2', symbol: 'C', elementName: '亚甲基碳 (sp³)', position: [0.1, 0.4, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp³' },
      { id: 'o', symbol: 'O', elementName: '羟基氧 (sp³)', position: [1.15, -0.45, 0], color: ATOM_COLORS.O, radius: 0.32, hybridization: 'sp³', isFunctionalGroup: true },
      { id: 'ho', symbol: 'H', elementName: '活泼羟基氢', position: [1.9, -0.05, 0], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
      ...createMethylGroup([-1.2, -0.2, 0], [-1.3, -0.6, 0], 'eth-me').atoms,
      ...createMethyleneGroup([0.1, 0.4, 0], [-1.2, -0.2, 0], [1.15, -0.45, 0], 'eth-ch2').atoms,
    ],
    bonds: [
      { id: 'c1-c2', start: [-1.2, -0.2, 0], end: [0.1, 0.4, 0], order: 1 },
      { id: 'c2-o', start: [0.1, 0.4, 0], end: [1.15, -0.45, 0], order: 1 },
      { id: 'o-ho', start: [1.15, -0.45, 0], end: [1.9, -0.05, 0], order: 1 },
      ...createMethylGroup([-1.2, -0.2, 0], [-1.3, -0.6, 0], 'eth-me').bonds,
      ...createMethyleneGroup([0.1, 0.4, 0], [-1.2, -0.2, 0], [1.15, -0.45, 0], 'eth-ch2').bonds,
    ],
  },

  // 4. 苯酚 (酚羟基)
  'phenol-oh': {
    id: 'phenol-oh',
    name: '苯酚 (C₆H₅OH)',
    formula: 'C_6H_5-OH',
    categoryName: '酚类 / 芳香羟基',
    relatedGroupId: 'phenol-oh',
    description: '羟基氧孤对电子与苯环大 π 键发生 p-π 共轭，使酚羟基 O-H 极性大大增强显弱酸性，同时苯环邻对位电子云密度升高极易发生取代。',
    spatialContrastNote:
      '【高考头号易混】：苯酚 (C₆H₅-OH) 的羟基直连苯环，处于苯环共轭平面内；而苯甲醇 (C₆H₅-CH₂-OH) 的羟基连在 -CH₂- 上，四面体碳使其脱离苯环平面，属于醇而不属于酚，绝不消耗 NaOH！',
    variants: [
      { id: 'phenol-oh', label: '真·酚类：苯酚', formula: 'C₆H₅-OH', differenceHint: '-OH 直连苯环，显弱酸性，耗 1 NaOH', targetMoleculeId: 'phenol-oh' },
      { id: 'benzyl-alcohol', label: '芳香醇：苯甲醇', formula: 'C₆H₅-CH₂OH', differenceHint: '-OH 连饱和碳，中性醇，不耗 NaOH', targetMoleculeId: 'benzyl-alcohol' },
    ],
    geometryFeatures: {
      hybridization: '苯环碳均为 sp² 杂化，羟基氧为 sp³',
      coplanarInfo: '苯环 12 个原子共面，O 原子与苯环严格共面',
      reactionSite: '酚 O-H 弱酸电离中和；苯环邻、对位 (3 处) 浓溴水三取代',
    },
    keyPoints: [
      '1 mol 酚-OH 消耗 1 mol NaOH (中和) 或 1 mol Na (放 0.5 H₂)',
      '与 Na₂CO₃ 反应生成 NaHCO₃ 不出气 (酸性介于 H₂CO₃ 与 HCO₃⁻ 之间)',
      '与浓溴水反应生成三溴苯酚白色沉淀 (耗 3 mol Br₂)',
      '遇 FeCl₃ 溶液显特异性紫色络合物',
    ],
    relatedKnowledgeNode: {
      id: 'anim-isomerism',
      name: '芳香同分异构体 3D 体系',
      routeHash: '/feature/anim-isomerism',
    },
    atoms: [
      ...createBenzeneRing([0, 0, 0], 1.35, 'phenol-ring', [0]).atoms,
      { id: 'oh-o', symbol: 'O', elementName: '酚羟基氧 (共面)', position: [2.5, 0.3, 0], color: ATOM_COLORS.O, radius: 0.32, isFunctionalGroup: true },
      { id: 'oh-h', symbol: 'H', elementName: '酚羟基活泼氢', position: [3.1, -0.3, 0], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
    ],
    bonds: [
      ...createBenzeneRing([0, 0, 0], 1.35, 'phenol-ring', [0]).bonds,
      { id: 'ring-o', start: [1.35, 0, 0], end: [2.5, 0.3, 0], order: 1 },
      { id: 'o-h', start: [2.5, 0.3, 0], end: [3.1, -0.3, 0], order: 1 },
    ],
  },

  // 4-B. 苯甲醇 (对比项：芳香醇)
  'benzyl-alcohol': {
    id: 'benzyl-alcohol',
    name: '苯甲醇 (C₆H₅-CH₂OH)',
    formula: 'C_6H_5-CH_2-OH',
    categoryName: '芳香醇 / 易混对比模型',
    relatedGroupId: 'alcohol-oh',
    description: '虽然分子中同时含有苯环与 -OH，但 -OH 并没有直接连在苯环上，而是连在侧链的 -CH₂- 饱和碳上。由于 sp³ 碳的四面体构型，-OH 翘出苯环平面，因此完全具备醇的性质，呈中性，绝不消耗 NaOH！',
    spatialContrastNote:
      '【空间实质】：-CH₂- 作为 sp³ 四面体支架将 -OH 顶出苯环平面，阻断了 p-π 共轭，导致它完全没有弱酸性！',
    variants: [
      { id: 'phenol-oh', label: '真·酚类：苯酚', formula: 'C₆H₅-OH', differenceHint: '-OH 直连苯环，显弱酸性，耗 1 NaOH', targetMoleculeId: 'phenol-oh' },
      { id: 'benzyl-alcohol', label: '芳香醇：苯甲醇', formula: 'C₆H₅-CH₂OH', differenceHint: '-OH 连饱和碳，中性醇，不耗 NaOH', targetMoleculeId: 'benzyl-alcohol' },
    ],
    geometryFeatures: {
      hybridization: '苯环碳为 sp²，侧链碳为 sp³ 四面体',
      coplanarInfo: '苯环共面，-OH 翘出平面',
      reactionSite: '仅与 Na 反应放 H₂；催化氧化生成苯甲醛',
    },
    keyPoints: [
      '芳香醇 ≠ 酚：不与 NaOH 反应，不与 FeCl₃ 显紫色',
      '催化氧化生成苯甲醛 (C₆H₅-CHO)',
    ],
    atoms: [
      ...createBenzeneRing([0, 0, 0], 1.35, 'ba-ring', [0]).atoms,
      { id: 'ch2-c', symbol: 'C', elementName: '侧链亚甲基碳 (sp³)', position: [2.3, 0.2, 0.4], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp³' },
      { id: 'oh-o', symbol: 'O', elementName: '醇羟基氧 (翘出平面)', position: [3.3, 0.7, -0.3], color: ATOM_COLORS.O, radius: 0.32, isFunctionalGroup: true },
      { id: 'oh-h', symbol: 'H', elementName: '醇羟基氢', position: [3.9, 0.1, -0.5], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
      ...createMethyleneGroup([2.3, 0.2, 0.4], [1.35, 0, 0], [3.3, 0.7, -0.3], 'ba-ch2').atoms,
    ],
    bonds: [
      ...createBenzeneRing([0, 0, 0], 1.35, 'ba-ring', [0]).bonds,
      { id: 'ring-ch2', start: [1.35, 0, 0], end: [2.3, 0.2, 0.4], order: 1 },
      { id: 'ch2-oh', start: [2.3, 0.2, 0.4], end: [3.3, 0.7, -0.3], order: 1 },
      { id: 'o-h', start: [3.3, 0.7, -0.3], end: [3.9, 0.1, -0.5], order: 1 },
      ...createMethyleneGroup([2.3, 0.2, 0.4], [1.35, 0, 0], [3.3, 0.7, -0.3], 'ba-ch2').bonds,
    ],
  },

  // 5. 乙醛 (醛基)
  'aldehyde-cho': {
    id: 'aldehyde-cho',
    name: '乙醛 (CH₃CHO)',
    formula: 'CH_3-CHO',
    categoryName: '醛类 / 羰基化合物',
    relatedGroupId: 'aldehyde-cho',
    description: '醛基碳为 sp² 杂化，具有强极性的 C=O 双键，羰基氢具强还原性，极易被弱氧化剂氧化。',
    spatialContrastNote:
      '【易混题眼】：甲酸酯类（如甲酸苯酯 HCOOCH₃）分子式虽是酯，但在 3D 球棍空间中，左端保留了完整的甲酰基醛基氢 (H-C=O)，因此同样具备醛基的所有定性特征（银镜反应出 2 Ag）！',
    variants: [
      { id: 'aldehyde-cho', label: '基准：乙醛', formula: 'CH₃CHO', differenceHint: '经典醛基 (出 2 Ag)', targetMoleculeId: 'aldehyde-cho' },
      { id: 'formic-phenyl-ester', label: '甲酸苯酯', formula: 'HCOO-C₆H₅', differenceHint: '甲酸酯基保留醛基氢 (出 2 Ag)', targetMoleculeId: 'formic-phenyl-ester' },
    ],
    geometryFeatures: {
      hybridization: '醛基碳为 sp² 平面三角形，甲基碳为 sp³ 四面体',
      coplanarInfo: '醛基 4 个原子 (C-C(=O)-H) 共平面',
      reactionSite: 'C-H 键易被氧化（银镜/斐林）；C=O 可加氢还原为乙醇',
    },
    keyPoints: [
      '1 mol -CHO 发生银镜反应析出 2 mol Ag',
      '1 mol -CHO 与新制 Cu(OH)₂ 反应生成 1 mol Cu₂O 砖红沉淀',
      '催化加氢消耗 1 mol H₂ 还原为乙醇',
    ],
    relatedKnowledgeNode: {
      id: 'anim-hybrid-orbital',
      name: '碳氧双键 sp² 杂化平面模型',
      routeHash: '/feature/anim-hybrid-orbital',
    },
    atoms: [
      { id: 'c1', symbol: 'C', elementName: '甲基碳 (sp³)', position: [-1.1, -0.3, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp³' },
      { id: 'c2', symbol: 'C', elementName: '醛基碳 (sp²)', position: [0.2, 0.35, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp²', isFunctionalGroup: true },
      { id: 'o', symbol: 'O', elementName: '羰基氧', position: [0.35, 1.55, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'h_cho', symbol: 'H', elementName: '醛基氢', position: [1.1, -0.35, 0], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
      ...createMethylGroup([-1.1, -0.3, 0], [-1.3, -0.65, 0], 'cho-me').atoms,
    ],
    bonds: [
      { id: 'c1-c2', start: [-1.1, -0.3, 0], end: [0.2, 0.35, 0], order: 1 },
      ...createMultiBonds([0.2, 0.35, 0], [0.35, 1.55, 0], 2, 'cho-c=o'),
      { id: 'c2-h_cho', start: [0.2, 0.35, 0], end: [1.1, -0.35, 0], order: 1 },
      ...createMethylGroup([-1.1, -0.3, 0], [-1.3, -0.65, 0], 'cho-me').bonds,
    ],
  },

  // 6. 丙酮 (酮羰基)
  'ketone-co': {
    id: 'ketone-co',
    name: '丙酮 (CH₃COCH₃)',
    formula: 'CH_3-CO-CH_3',
    categoryName: '酮类 / 羰基化合物',
    relatedGroupId: 'ketone-co',
    description: '酮羰基碳连接两个烃基，碳为 sp² 杂化平面三角形。无醛基氢，故不能发生银镜或斐林反应，但可与氢气加成还原为仲醇。',
    geometryFeatures: {
      hybridization: '羰基碳为 sp² 平面三角形',
      coplanarInfo: 'C-C(=O)-C 骨架 4 原子必定共平面',
      reactionSite: 'C=O 加氢还原（耗 1 mol H₂ 生成 2-丙醇）',
    },
    keyPoints: [
      '不发生银镜反应，不被溴水氧化',
      '加成 1 mol H₂ 还原为仲醇 (2-丙醇)',
      '常用于与醛基作定性区分鉴别',
    ],
    atoms: [
      { id: 'c2', symbol: 'C', elementName: '羰基碳 (sp²)', position: [0, 0.2, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp²', isFunctionalGroup: true },
      { id: 'o', symbol: 'O', elementName: '羰基氧', position: [0, 1.45, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'c1', symbol: 'C', elementName: '甲基碳', position: [-1.2, -0.55, 0], color: ATOM_COLORS.C, radius: 0.35 },
      { id: 'c3', symbol: 'C', elementName: '甲基碳', position: [1.2, -0.55, 0], color: ATOM_COLORS.C, radius: 0.35 },
      ...createMethylGroup([-1.2, -0.55, 0], [-1.2, -0.75, 0], 'acetone-me1').atoms,
      ...createMethylGroup([1.2, -0.55, 0], [1.2, -0.75, 0], 'acetone-me2').atoms,
    ],
    bonds: [
      ...createMultiBonds([0, 0.2, 0], [0, 1.45, 0], 2, 'acetone-c=o'),
      { id: 'c2-c1', start: [0, 0.2, 0], end: [-1.2, -0.55, 0], order: 1 },
      { id: 'c2-c3', start: [0, 0.2, 0], end: [1.2, -0.55, 0], order: 1 },
      ...createMethylGroup([-1.2, -0.55, 0], [-1.2, -0.75, 0], 'acetone-me1').bonds,
      ...createMethylGroup([1.2, -0.55, 0], [1.2, -0.75, 0], 'acetone-me2').bonds,
    ],
  },

  // 7. 乙酸 (羧基)
  'carboxyl-cooh': {
    id: 'carboxyl-cooh',
    name: '乙酸 (CH₃COOH)',
    formula: 'CH_3-COOH',
    categoryName: '羧酸 / 有机酸',
    relatedGroupId: 'carboxyl-cooh',
    description: '羧基中羰基与羟基形成共轭体系，使羟基 O-H 键极性大大增强，酸性明显强于碳酸 (H₂CO₃)，能与 NaHCO₃ 剧烈反应放出 CO₂ 气体。',
    geometryFeatures: {
      hybridization: '羧基碳为 sp² 平面，羟基氧为 sp³',
      coplanarInfo: '羧基平面 (C(=O)-OH) 4 个原子共平面',
      reactionSite: 'O-H 酸性中和；-OH 与醇脱水发生酯化反应',
    },
    keyPoints: [
      '唯一能与 NaHCO₃ 剧烈反应冒 CO₂ 气泡的常见含氧官能团',
      '1 mol -COOH 消耗 1 mol NaOH / 1 mol NaHCO₃ / 0.5 mol Na₂CO₃',
      '酯化反应规律：“酸脱羟基醇脱氢”',
    ],
    relatedKnowledgeNode: {
      id: 'anim-isomerism',
      name: '羧酸与酯的官能团异构',
      routeHash: '/feature/anim-isomerism',
    },
    atoms: [
      { id: 'c1', symbol: 'C', elementName: '甲基碳', position: [-1.2, -0.3, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp³' },
      { id: 'c2', symbol: 'C', elementName: '羧基碳 (sp²)', position: [0.1, 0.35, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp²', isFunctionalGroup: true },
      { id: 'o1', symbol: 'O', elementName: '羰基氧', position: [0.2, 1.55, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'o2', symbol: 'O', elementName: '羟基氧', position: [1.2, -0.4, 0], color: ATOM_COLORS.O, radius: 0.32, isFunctionalGroup: true },
      { id: 'h_acid', symbol: 'H', elementName: '羧酸活泼氢', position: [2.0, -0.05, 0], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
      ...createMethylGroup([-1.2, -0.3, 0], [-1.3, -0.65, 0], 'cooh-me').atoms,
    ],
    bonds: [
      { id: 'c1-c2', start: [-1.2, -0.3, 0], end: [0.1, 0.35, 0], order: 1 },
      ...createMultiBonds([0.1, 0.35, 0], [0.2, 1.55, 0], 2, 'cooh-c=o'),
      { id: 'c2-o2', start: [0.1, 0.35, 0], end: [1.2, -0.4, 0], order: 1 },
      { id: 'o2-h_acid', start: [1.2, -0.4, 0], end: [2.0, -0.05, 0], order: 1 },
      ...createMethylGroup([-1.2, -0.3, 0], [-1.3, -0.65, 0], 'cooh-me').bonds,
    ],
  },

  // 8. 乙酸乙酯 (普通醇酯)
  'ester-coor': {
    id: 'ester-coor',
    name: '乙酸乙酯 (CH₃COOCH₂CH₃)',
    formula: 'CH_3-COO-CH_2CH_3',
    categoryName: '酯类 / 普通醇酯',
    relatedGroupId: 'ester-coor',
    description: '普通醇酯水解生成 1 mol 羧酸和 1 mol 醇。醇呈中性不消耗碱，因此 1 mol 醇酯碱性水解仅消耗 1 mol NaOH。',
    spatialContrastNote:
      '【普通酯 vs 酚酯空间本质】：观察酯基氧 (-O-) 后面连的是什么！普通酯的氧后连 sp³ 四面体烷基碳（产物为醇，耗 1 碱）；酚酯的氧后直接连 sp² 苯环碳（产物为酚，双倍耗 2 碱）！',
    variants: [
      { id: 'ester-coor', label: '普通醇酯：乙酸乙酯', formula: 'CH₃COOCH₂CH₃', differenceHint: '氧连烷基，耗 1 NaOH', targetMoleculeId: 'ester-coor' },
      { id: 'phenol-ester', label: '酚酯：乙酸苯酯', formula: 'CH₃COO-C₆H₅', differenceHint: '氧连苯环，水解双倍耗 2 NaOH', targetMoleculeId: 'phenol-ester' },
    ],
    geometryFeatures: {
      hybridization: '酯羰基碳为 sp²，酯氧为 sp³',
      coplanarInfo: 'C-C(=O)-O 4 原子共平面',
      reactionSite: 'C-O 单键水解断裂生成酸和醇',
    },
    keyPoints: [
      '1 mol 普通醇酯水解消耗 1 mol NaOH',
      '水解产物乙醇不与 NaOH 反应',
      '在酸性或碱性条件下均可水解（碱性水解彻底不可逆）',
    ],
    atoms: [
      { id: 'c1', symbol: 'C', elementName: '乙酰甲基碳', position: [-1.9, -0.3, 0], color: ATOM_COLORS.C, radius: 0.35 },
      { id: 'c2', symbol: 'C', elementName: '酯羰基碳 (sp²)', position: [-0.6, 0.35, 0], color: ATOM_COLORS.C, radius: 0.35, isFunctionalGroup: true },
      { id: 'o1', symbol: 'O', elementName: '羰基氧', position: [-0.5, 1.55, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'o2', symbol: 'O', elementName: '酯基氧', position: [0.5, -0.35, 0], color: ATOM_COLORS.O, radius: 0.32, isFunctionalGroup: true },
      { id: 'c3', symbol: 'C', elementName: '乙基亚甲基碳', position: [1.7, 0.3, 0], color: ATOM_COLORS.C, radius: 0.35 },
      { id: 'c4', symbol: 'C', elementName: '乙基甲基碳', position: [2.9, -0.45, 0], color: ATOM_COLORS.C, radius: 0.35 },
      ...createMethylGroup([-1.9, -0.3, 0], [-1.3, -0.65, 0], 'ester-me1').atoms,
      ...createMethyleneGroup([1.7, 0.3, 0], [0.5, -0.35, 0], [2.9, -0.45, 0], 'ester-ch2').atoms,
      ...createMethylGroup([2.9, -0.45, 0], [1.2, -0.75, 0], 'ester-me2').atoms,
    ],
    bonds: [
      { id: 'c1-c2', start: [-1.9, -0.3, 0], end: [-0.6, 0.35, 0], order: 1 },
      ...createMultiBonds([-0.6, 0.35, 0], [-0.5, 1.55, 0], 2, 'ester-c=o'),
      { id: 'c2-o2', start: [-0.6, 0.35, 0], end: [0.5, -0.35, 0], order: 1 },
      { id: 'o2-c3', start: [0.5, -0.35, 0], end: [1.7, 0.3, 0], order: 1 },
      { id: 'c3-c4', start: [1.7, 0.3, 0], end: [2.9, -0.45, 0], order: 1 },
      ...createMethylGroup([-1.9, -0.3, 0], [-1.3, -0.65, 0], 'ester-me1').bonds,
      ...createMethyleneGroup([1.7, 0.3, 0], [0.5, -0.35, 0], [2.9, -0.45, 0], 'ester-ch2').bonds,
      ...createMethylGroup([2.9, -0.45, 0], [1.2, -0.75, 0], 'ester-me2').bonds,
    ],
  },

  // 9. 乙酸苯酯 (酚酯基)
  'phenol-ester': {
    id: 'phenol-ester',
    name: '乙酸苯酯 (CH₃COO-C₆H₅)',
    formula: 'CH_3-COO-C_6H_5',
    categoryName: '酚酯 / 高考特级考点',
    relatedGroupId: 'phenol-ester',
    description: '高考超级母题基团：酚酯水解生成 1 mol 羧酸和 1 mol 酚。生成的酚呈弱酸性，必须再消耗 1 mol NaOH 中和成酚钠，故 1 mol 酚酯水解共消耗 2 mol NaOH！',
    spatialContrastNote:
      '【氧原子连接定位】：观察酚酯氧 (-O-) 直接连在苯环顶点上，水解后断裂形成具有酸性的酚钠 (C₆H₅ONa)，因此消耗 2 mol 碱。',
    variants: [
      { id: 'phenol-ester', label: '酚酯：乙酸苯酯', formula: 'CH₃COO-C₆H₅', differenceHint: '氧连苯环，水解消耗 2 NaOH', targetMoleculeId: 'phenol-ester' },
      { id: 'ester-coor', label: '普通酯：乙酸乙酯', formula: 'CH₃COOCH₂CH₃', differenceHint: '氧连烷基，水解消耗 1 NaOH', targetMoleculeId: 'ester-coor' },
      { id: 'aspirin', label: '阿司匹林母题', formula: 'o-(CH₃COO)C₆H₄COOH', differenceHint: '1 酚酯 + 1 羧基，水解消耗 3 NaOH', targetMoleculeId: 'aspirin' },
    ],
    geometryFeatures: {
      hybridization: '苯环与羰基碳均为 sp²',
      coplanarInfo: '苯环共面，酯羰基可与苯环接近共面',
      reactionSite: 'C-O 酯键水解断裂（双倍消耗 NaOH）',
    },
    keyPoints: [
      '高考必考：1 mol 酚酯水解消耗 2 mol NaOH',
      '水解产物：乙酸钠 + 苯酚钠 + H₂O',
      '判别法则：“水解看屁股”——氧原子后连苯环即为酚酯',
    ],
    atoms: [
      ...createBenzeneRing([1.8, 0, 0], 1.35, 'ester-phenyl', [3]).atoms,
      { id: 'o_ester', symbol: 'O', elementName: '酚酯氧 (直连苯环)', position: [-0.7, 0, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'c_ester', symbol: 'C', elementName: '酯羰基碳 (sp²)', position: [-1.8, 0.6, 0], color: ATOM_COLORS.C, radius: 0.35, isFunctionalGroup: true },
      { id: 'o_carbonyl', symbol: 'O', elementName: '羰基氧', position: [-1.8, 1.85, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'c_me', symbol: 'C', elementName: '甲基碳', position: [-3.1, -0.1, 0], color: ATOM_COLORS.C, radius: 0.35 },
      ...createMethylGroup([-3.1, -0.1, 0], [-1.3, -0.7, 0], 'pe-me').atoms,
    ],
    bonds: [
      ...createBenzeneRing([1.8, 0, 0], 1.35, 'ester-phenyl', [3]).bonds,
      { id: 'ring-o_ester', start: [1.8 - 1.35, 0, 0], end: [-0.7, 0, 0], order: 1 },
      { id: 'o_ester-c_ester', start: [-0.7, 0, 0], end: [-1.8, 0.6, 0], order: 1 },
      ...createMultiBonds([-1.8, 0.6, 0], [-1.8, 1.85, 0], 2, 'phenylester-c=o'),
      { id: 'c_ester-c_me', start: [-1.8, 0.6, 0], end: [-3.1, -0.1, 0], order: 1 },
      ...createMethylGroup([-3.1, -0.1, 0], [-1.3, -0.7, 0], 'pe-me').bonds,
    ],
  },

  // 10. 溴乙烷 (卤代烃)
  'halo-alkane-x': {
    id: 'halo-alkane-x',
    name: '溴乙烷 (CH₃CH₂Br)',
    formula: 'CH_3-CH_2-Br',
    categoryName: '卤代烃 / 衍生物',
    relatedGroupId: 'halo-alkane-x',
    description: 'C-Br 键具有强极性易断裂。在 NaOH 水溶液加热下发生水解（取代），在 NaOH 醇溶液加热下发生消去反应生成乙烯。',
    geometryFeatures: {
      hybridization: '碳原子均为 sp³ 四面体',
      coplanarInfo: '最多 3 个原子共面',
      reactionSite: 'C-Br 键断裂水解（耗 1 NaOH）或消去（耗 1 NaOH）',
    },
    keyPoints: [
      '水解条件：NaOH 水溶液、加热 ➔ 生成醇',
      '消去条件：NaOH 醇溶液、加热 ➔ 生成烯烃',
      '检验卤素离子前必须先加稀硝酸酸化，再滴加 AgNO₃',
    ],
    atoms: [
      { id: 'c1', symbol: 'C', elementName: '甲基碳', position: [-1.1, -0.2, 0], color: ATOM_COLORS.C, radius: 0.35 },
      { id: 'c2', symbol: 'C', elementName: '亚甲基碳', position: [0.2, 0.4, 0], color: ATOM_COLORS.C, radius: 0.35 },
      { id: 'br', symbol: 'Br', elementName: '溴原子', position: [1.6, -0.5, 0], color: ATOM_COLORS.Br, radius: 0.45, isFunctionalGroup: true },
      ...createMethylGroup([-1.1, -0.2, 0], [-1.3, -0.6, 0], 'halo-me').atoms,
      ...createMethyleneGroup([0.2, 0.4, 0], [-1.1, -0.2, 0], [1.6, -0.5, 0], 'halo-ch2').atoms,
    ],
    bonds: [
      { id: 'c1-c2', start: [-1.1, -0.2, 0], end: [0.2, 0.4, 0], order: 1 },
      { id: 'c2-br', start: [0.2, 0.4, 0], end: [1.6, -0.5, 0], order: 1 },
      ...createMethylGroup([-1.1, -0.2, 0], [-1.3, -0.6, 0], 'halo-me').bonds,
      ...createMethyleneGroup([0.2, 0.4, 0], [-1.1, -0.2, 0], [1.6, -0.5, 0], 'halo-ch2').bonds,
    ],
  },

  // 11. 乙酰胺 (酰胺基/肽键)
  'amide-conh': {
    id: 'amide-conh',
    name: '乙酰胺 (CH₃CONH₂)',
    formula: 'CH_3-CONH_2',
    categoryName: '酰胺 / 蛋白质基元',
    relatedGroupId: 'amide-conh',
    description: '酰胺键中 N 原子的孤对电子与羰基形成 p-π 共轭，具有明显的刚性平面结构，水解消耗 1 mol NaOH 或 1 mol HCl。',
    geometryFeatures: {
      hybridization: '羰基碳与氮原子均呈近似 sp² 平面',
      coplanarInfo: 'C-C(=O)-N 刚性平面',
      reactionSite: 'C-N 肽键水解断裂',
    },
    keyPoints: [
      '碱性水解：消耗 1 mol NaOH 生成羧酸钠与氨气',
      '酸性水解：消耗 1 mol HCl 生成羧酸与铵盐',
      '蛋白质水解的实质即为肽键 (酰胺键) 的断裂',
    ],
    atoms: [
      { id: 'c1', symbol: 'C', elementName: '甲基碳', position: [-1.2, -0.3, 0], color: ATOM_COLORS.C, radius: 0.35 },
      { id: 'c2', symbol: 'C', elementName: '酰胺羰基碳 (sp²)', position: [0.1, 0.35, 0], color: ATOM_COLORS.C, radius: 0.35, isFunctionalGroup: true },
      { id: 'o', symbol: 'O', elementName: '羰基氧', position: [0.2, 1.55, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'n', symbol: 'N', elementName: '酰胺氮', position: [1.2, -0.4, 0], color: ATOM_COLORS.N, radius: 0.34, isFunctionalGroup: true },
      { id: 'h_n1', symbol: 'H', elementName: '氨基氢', position: [2.05, -0.05, 0], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
      { id: 'h_n2', symbol: 'H', elementName: '氨基氢', position: [1.15, -1.4, 0], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
      ...createMethylGroup([-1.2, -0.3, 0], [-1.3, -0.65, 0], 'amide-me').atoms,
    ],
    bonds: [
      { id: 'c1-c2', start: [-1.2, -0.3, 0], end: [0.1, 0.35, 0], order: 1 },
      ...createMultiBonds([0.1, 0.35, 0], [0.2, 1.55, 0], 2, 'amide-c=o'),
      { id: 'c2-n', start: [0.1, 0.35, 0], end: [1.2, -0.4, 0], order: 1 },
      { id: 'n-hn1', start: [1.2, -0.4, 0], end: [2.05, -0.05, 0], order: 1 },
      { id: 'n-hn2', start: [1.2, -0.4, 0], end: [1.15, -1.4, 0], order: 1 },
      ...createMethylGroup([-1.2, -0.3, 0], [-1.3, -0.65, 0], 'amide-me').bonds,
    ],
  },

  // 12. 乙胺 (氨基)
  'amino-nh2': {
    id: 'amino-nh2',
    name: '乙胺 (CH₃CH₂NH₂)',
    formula: 'CH_3-CH_2-NH_2',
    categoryName: '胺类 / 有机碱',
    relatedGroupId: 'amino-nh2',
    description: '氮原子为 sp³ 三角锥形，有一对孤对电子可结合质子 H⁺，显弱碱性，可与强酸 1:1 成盐。',
    geometryFeatures: {
      hybridization: '氮原子为 sp³ 三角锥形',
      coplanarInfo: '最多 3 个原子共平面',
      reactionSite: 'N 孤对电子结合 H⁺ 显碱性成盐；与羧基缩合生成肽键',
    },
    keyPoints: [
      '弱碱性：1 mol 氨基消耗 1 mol HCl 形成铵盐',
      '水溶液能使湿润红色石蕊试纸变蓝',
      '氨基酸分子内具有氨基与羧基，具两性性质',
    ],
    atoms: [
      { id: 'c1', symbol: 'C', elementName: '甲基碳', position: [-1.2, -0.2, 0], color: ATOM_COLORS.C, radius: 0.35 },
      { id: 'c2', symbol: 'C', elementName: '亚甲基碳', position: [0.1, 0.4, 0], color: ATOM_COLORS.C, radius: 0.35 },
      { id: 'n', symbol: 'N', elementName: '氨基氮', position: [1.2, -0.4, 0], color: ATOM_COLORS.N, radius: 0.34, isFunctionalGroup: true },
      { id: 'h_n1', symbol: 'H', elementName: '氢', position: [1.95, -0.05, 0.3], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
      { id: 'h_n2', symbol: 'H', elementName: '氢', position: [1.3, -1.35, -0.3], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
      ...createMethylGroup([-1.2, -0.2, 0], [-1.3, -0.6, 0], 'amino-me').atoms,
      ...createMethyleneGroup([0.1, 0.4, 0], [-1.2, -0.2, 0], [1.2, -0.4, 0], 'amino-ch2').atoms,
    ],
    bonds: [
      { id: 'c1-c2', start: [-1.2, -0.2, 0], end: [0.1, 0.4, 0], order: 1 },
      { id: 'c2-n', start: [0.1, 0.4, 0], end: [1.2, -0.4, 0], order: 1 },
      { id: 'n-hn1', start: [1.2, -0.4, 0], end: [1.95, -0.05, 0.3], order: 1 },
      { id: 'n-hn2', start: [1.2, -0.4, 0], end: [1.3, -1.35, -0.3], order: 1 },
      ...createMethylGroup([-1.2, -0.2, 0], [-1.3, -0.6, 0], 'amino-me').bonds,
      ...createMethyleneGroup([0.1, 0.4, 0], [-1.2, -0.2, 0], [1.2, -0.4, 0], 'amino-ch2').bonds,
    ],
  },

  // 13. 硝基苯 (硝基 -NO₂)
  'nitro-no2': {
    id: 'nitro-no2',
    name: '硝基苯 (C₆H₅-NO₂)',
    formula: 'C_6H_5-NO_2',
    categoryName: '含氮官能团 / 硝基',
    relatedGroupId: 'nitro-no2',
    description: '硝基中的 N 原子呈 sp² 杂化，与 2 个氧原子形成包含离域 π 键的平面结构，强吸电子使苯环间位定位钝化。',
    geometryFeatures: {
      hybridization: 'N 原子与苯环碳均为 sp² 杂化',
      coplanarInfo: '硝基平面与苯环平面几乎共面 (共轭稳定)',
      reactionSite: '硝基催化加氢还原 (消耗 3 mol H₂) 生成苯胺',
    },
    keyPoints: [
      '高考王牌前体：催化加氢或 Fe/HCl 还原消耗 3 mol H₂ 转化为苯胺',
      '强吸电子间位定位，难发生进一步亲电取代',
    ],
    atoms: [
      ...createBenzeneRing([0, 0, 0], 1.35, 'nitro-ring', [0]).atoms,
      { id: 'n_nitro', symbol: 'N', elementName: '硝基氮 (sp²)', position: [2.3, 0, 0], color: ATOM_COLORS.N, radius: 0.35, hybridization: 'sp²', isFunctionalGroup: true },
      { id: 'o_nitro1', symbol: 'O', elementName: '硝基氧', position: [3.1, 0.95, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'o_nitro2', symbol: 'O', elementName: '硝基氧', position: [3.1, -0.95, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
    ],
    bonds: [
      ...createBenzeneRing([0, 0, 0], 1.35, 'nitro-ring', [0]).bonds,
      { id: 'ring-n_nitro', start: [1.35, 0, 0], end: [2.3, 0, 0], order: 1 },
      ...createMultiBonds([2.3, 0, 0], [3.1, 0.95, 0], 2, 'nitro-n=o'),
      { id: 'n-o2', start: [2.3, 0, 0], end: [3.1, -0.95, 0], order: 1 },
    ],
  },

  // 16. 乙腈 (氰基 -C≡N)
  'cyano-cn': {
    id: 'cyano-cn',
    name: '乙腈 (CH₃-C≡N)',
    formula: 'CH_3-C\\equiv N',
    categoryName: '含氮官能团 / 氰基',
    relatedGroupId: 'cyano-cn',
    description: '碳氮三键 (-C≡N) 由 1 个 σ 键和 2 个 π 键构成，具有很强极性与线性构型，水解转化为羧酸，加氢还原为伯胺。',
    geometryFeatures: {
      hybridization: '氰基碳与氮均为 sp 杂化 (直线型 180°)',
      coplanarInfo: 'C-C≡N 3 个骨架原子严格处于同一直线上 (180°)',
      reactionSite: '加氢还原 (消耗 2 mol H₂)；酸/碱性水解生成羧酸与铵/氨',
    },
    keyPoints: [
      '高考增长碳链题眼：卤代烃与 NaCN 取代增长 1 个碳，水解得羧酸',
      'C-C≡N 具有严格直线型几何特征',
    ],
    atoms: [
      { id: 'c_me', symbol: 'C', elementName: '甲基碳 (sp³)', position: [-1.4, 0, 0], color: ATOM_COLORS.C, radius: 0.34, hybridization: 'sp³' },
      { id: 'c_cyano', symbol: 'C', elementName: '氰基碳 (sp)', position: [0.1, 0, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp', isFunctionalGroup: true },
      { id: 'n_cyano', symbol: 'N', elementName: '氰基氮 (sp)', position: [1.3, 0, 0], color: ATOM_COLORS.N, radius: 0.34, hybridization: 'sp', isFunctionalGroup: true },
      ...createMethylGroup([-1.4, 0, 0], [-1.0, 0, 0], 'cyano-me').atoms,
    ],
    bonds: [
      { id: 'c_me-c_cyano', start: [-1.4, 0, 0], end: [0.1, 0, 0], order: 1 },
      ...createMultiBonds([0.1, 0, 0], [1.3, 0, 0], 3, 'cyano-c#n'),
      ...createMethylGroup([-1.4, 0, 0], [-1.0, 0, 0], 'cyano-me').bonds,
    ],
  },
}


