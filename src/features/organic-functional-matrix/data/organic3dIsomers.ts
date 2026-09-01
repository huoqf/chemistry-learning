import { ATOM_COLORS } from '@/theme'
import {
  type Organic3DMolecule,
  createMultiBonds,
  createBenzeneRing,
} from './organic3dTypes'

export const ISOMER_3D_MOLECULES: Record<string, Organic3DMolecule> = {
  // 1-B. 顺-2-丁烯 (Cis-2-butene)
  'alkene-cis-2-butene': {
    id: 'alkene-cis-2-butene',
    name: '顺-2-丁烯 (Cis-2-butene)',
    formula: 'cis-CH_3CH=CHCH_3',
    categoryName: '顺反异构体 / 极性构型',
    relatedGroupId: 'alkene-c=c',
    description: '两个甲基 (-CH₃) 处于双键平面的同侧。由于空间位阻使分子产生偶极矩，沸点 (3.7℃) 高于反式 (0.9℃)。',
    spatialContrastNote:
      '【顺反构型关键】：两个甲基同在上方（同侧），使得电荷分布不对称，极性较大。',
    variants: [
      { id: 'alkene-c=c', label: '基准：乙烯', formula: 'CH₂=CH₂', differenceHint: '无取代基', targetMoleculeId: 'alkene-c=c' },
      { id: 'alkene-cis-2-butene', label: '顺-2-丁烯 (Cis)', formula: '顺-CH₃CH=CHCH₃', differenceHint: '甲基同侧 (极性分子)', targetMoleculeId: 'alkene-cis-2-butene' },
      { id: 'alkene-trans-2-butene', label: '反-2-丁烯 (Trans)', formula: '反-CH₃CH=CHCH₃', differenceHint: '甲基异侧 (对称非极性)', targetMoleculeId: 'alkene-trans-2-butene' },
    ],
    geometryFeatures: {
      hybridization: '双键碳为 sp² 平面，甲基碳为 sp³ 四面体',
      coplanarInfo: 'C-C=C-C 4 个碳原子与 2 个双键氢原子严格共平面 (6原子共面)',
      reactionSite: 'C=C 双键加成 (耗 1 Br₂ / 1 H₂)',
    },
    keyPoints: [
      '高考高频顺反异构：存在顺反异构的前提是双键两端每个碳连接两个不同的原子/基团',
      '顺式构型两甲基同侧，极性大，沸点高于反式',
    ],
    atoms: [
      { id: 'c2', symbol: 'C', elementName: '双键碳 (sp²)', position: [-0.67, 0, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp²', isFunctionalGroup: true },
      { id: 'c3', symbol: 'C', elementName: '双键碳 (sp²)', position: [0.67, 0, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp²', isFunctionalGroup: true },
      { id: 'c1', symbol: 'C', elementName: '顺式甲基碳 (sp³)', position: [-1.6, 1.1, 0], color: ATOM_COLORS.C, radius: 0.34, hybridization: 'sp³' },
      { id: 'c4', symbol: 'C', elementName: '顺式甲基碳 (sp³)', position: [1.6, 1.1, 0], color: ATOM_COLORS.C, radius: 0.34, hybridization: 'sp³' },
      { id: 'h2', symbol: 'H', elementName: '氢 (下侧)', position: [-0.9, -1.0, 0], color: ATOM_COLORS.H, radius: 0.22 },
      { id: 'h3', symbol: 'H', elementName: '氢 (下侧)', position: [0.9, -1.0, 0], color: ATOM_COLORS.H, radius: 0.22 },
    ],
    bonds: [
      ...createMultiBonds([-0.67, 0, 0], [0.67, 0, 0], 2, 'cis-c=c'),
      { id: 'c2-c1', start: [-0.67, 0, 0], end: [-1.6, 1.1, 0], order: 1 },
      { id: 'c3-c4', start: [0.67, 0, 0], end: [1.6, 1.1, 0], order: 1 },
      { id: 'c2-h2', start: [-0.67, 0, 0], end: [-0.9, -1.0, 0], order: 1 },
      { id: 'c3-h3', start: [0.67, 0, 0], end: [0.9, -1.0, 0], order: 1 },
    ],
  },

  // 1-C. 反-2-丁烯 (Trans-2-butene)
  'alkene-trans-2-butene': {
    id: 'alkene-trans-2-butene',
    name: '反-2-丁烯 (Trans-2-butene)',
    formula: 'trans-CH_3CH=CHCH_3',
    categoryName: '顺反异构体 / 对称构型',
    relatedGroupId: 'alkene-c=c',
    description: '两个甲基 (-CH₃) 处于双键平面的异侧。分子呈中心对称，偶极矩为 0，晶体堆积紧密，熔点 (-105.5℃) 高于顺式 (-138.9℃)。',
    spatialContrastNote:
      '【反式构型空间关键】：左上一个甲基，右下一个甲基（异侧对角），空间对称性极高，反式极性相互抵消。',
    variants: [
      { id: 'alkene-c=c', label: '基准：乙烯', formula: 'CH₂=CH₂', differenceHint: '无取代基', targetMoleculeId: 'alkene-c=c' },
      { id: 'alkene-cis-2-butene', label: '顺-2-丁烯 (Cis)', formula: '顺-CH₃CH=CHCH₃', differenceHint: '甲基同侧', targetMoleculeId: 'alkene-cis-2-butene' },
      { id: 'alkene-trans-2-butene', label: '反-2-丁烯 (Trans)', formula: '反-CH₃CH=CHCH₃', differenceHint: '甲基异侧 (对称非极性)', targetMoleculeId: 'alkene-trans-2-butene' },
    ],
    geometryFeatures: {
      hybridization: '双键碳为 sp² 平面，甲基碳为 sp³ 四面体',
      coplanarInfo: 'C-C=C-C 4 个碳原子与 2 个氢严格共面 (反式中心对称)',
      reactionSite: 'C=C 双键加成 (耗 1 Br₂ / 1 H₂)',
    },
    keyPoints: [
      '反式构型中心对称，极性为零，分子晶体堆积更紧密，熔点高于顺式',
      '与顺-2-丁烯互为顺反立体异构体',
    ],
    atoms: [
      { id: 'c2', symbol: 'C', elementName: '双键碳 (sp²)', position: [-0.67, 0, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp²', isFunctionalGroup: true },
      { id: 'c3', symbol: 'C', elementName: '双键碳 (sp²)', position: [0.67, 0, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp²', isFunctionalGroup: true },
      { id: 'c1', symbol: 'C', elementName: '反式甲基碳 (左上)', position: [-1.6, 1.1, 0], color: ATOM_COLORS.C, radius: 0.34, hybridization: 'sp³' },
      { id: 'c4', symbol: 'C', elementName: '反式甲基碳 (右下)', position: [1.6, -1.1, 0], color: ATOM_COLORS.C, radius: 0.34, hybridization: 'sp³' },
      { id: 'h2', symbol: 'H', elementName: '氢 (左下)', position: [-0.9, -1.0, 0], color: ATOM_COLORS.H, radius: 0.22 },
      { id: 'h3', symbol: 'H', elementName: '氢 (右上)', position: [0.9, 1.0, 0], color: ATOM_COLORS.H, radius: 0.22 },
    ],
    bonds: [
      ...createMultiBonds([-0.67, 0, 0], [0.67, 0, 0], 2, 'trans-c=c'),
      { id: 'c2-c1', start: [-0.67, 0, 0], end: [-1.6, 1.1, 0], order: 1 },
      { id: 'c3-c4', start: [0.67, 0, 0], end: [1.6, -1.1, 0], order: 1 },
      { id: 'c2-h2', start: [-0.67, 0, 0], end: [-0.9, -1.0, 0], order: 1 },
      { id: 'c3-h3', start: [0.67, 0, 0], end: [0.9, 1.0, 0], order: 1 },
    ],
  },

  // 4-B. 苯甲醇 (芳香醇 vs 酚羟基对比分子)
  'benzyl-alcohol': {
    id: 'benzyl-alcohol',
    name: '苯甲醇 (C₆H₅-CH₂OH)',
    formula: 'C_6H_5-CH_2OH',
    categoryName: '芳香醇 / 醇羟基辨析',
    relatedGroupId: 'alcohol-oh',
    description: '羟基连接在饱和 sp³ 杂化的苄位碳原子 (-CH₂-) 上，而非苯环 sp² 碳。中间隔着 -CH₂- 阻断了 p-π 共轭，因此表现为典型的醇类中性特征，绝不与 NaOH 反应！',
    spatialContrastNote:
      '【醇 vs 酚本质辨析】：注意观察 -OH 与苯环之间插入的 -CH₂- (sp³ 杂化四面体构型)，正是这个亚甲基阻断了 p-π 共轭，使其失去酚酸性！',
    variants: [
      { id: 'phenol-oh', label: '苯酚 (酚类基准)', formula: 'C₆H₅-OH', differenceHint: '-OH 直连苯环 (弱酸性)', targetMoleculeId: 'phenol-oh' },
      { id: 'benzyl-alcohol', label: '苯甲醇 (芳香醇)', formula: 'C₆H₅-CH₂OH', differenceHint: '-OH 连 sp³ 碳 (中性醇)', targetMoleculeId: 'benzyl-alcohol' },
    ],
    geometryFeatures: {
      hybridization: '苯环碳为 sp²，苄位碳为 sp³ 四面体，氧为 sp³',
      coplanarInfo: '苯环 6 碳共面，-CH₂OH 中的原子发生立体旋转偏离苯环平面',
      reactionSite: '苄位 -CH₂OH 可催化氧化为苯甲醛 (-CHO) / 苯甲酸 (-COOH)',
    },
    keyPoints: [
      '高考头号易混考点：苯甲醇是醇而非酚，遇 FeCl₃ 绝不显紫色，遇 NaOH 绝不反应！',
      '与金属 Na 反应放 H₂，与羧酸发生酯化反应',
    ],
    atoms: [
      ...createBenzeneRing([-0.6, 0, 0], 1.3, 'benzyl-ring').atoms,
      { id: 'c_benzyl', symbol: 'C', elementName: '苄位碳 (sp³)', position: [1.6, 0, 0], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp³', isFunctionalGroup: true },
      { id: 'o_benzyl', symbol: 'O', elementName: '醇羟基氧', position: [2.3, 1.1, 0.3], color: ATOM_COLORS.O, radius: 0.32, isFunctionalGroup: true },
      { id: 'h_benzyl_oh', symbol: 'H', elementName: '醇活泼氢', position: [3.1, 0.9, 0.1], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
      { id: 'h_benzyl_1', symbol: 'H', elementName: '苄位氢', position: [1.8, -0.6, 0.85], color: ATOM_COLORS.H, radius: 0.22 },
      { id: 'h_benzyl_2', symbol: 'H', elementName: '苄位氢', position: [1.8, -0.6, -0.85], color: ATOM_COLORS.H, radius: 0.22 },
    ],
    bonds: [
      ...createBenzeneRing([-0.6, 0, 0], 1.3, 'benzyl-ring').bonds,
      { id: 'ring-c_benzyl', start: [0.7, 0, 0], end: [1.6, 0, 0], order: 1 },
      { id: 'c_benzyl-o', start: [1.6, 0, 0], end: [2.3, 1.1, 0.3], order: 1 },
      { id: 'o-h', start: [2.3, 1.1, 0.3], end: [3.1, 0.9, 0.1], order: 1 },
      { id: 'c_benzyl-h1', start: [1.6, 0, 0], end: [1.8, -0.6, 0.85], order: 1 },
      { id: 'c_benzyl-h2', start: [1.6, 0, 0], end: [1.8, -0.6, -0.85], order: 1 },
    ],
  },

  // 13-B. D-乳酸 (手性对映异构体)
  'd-lactic-acid-chiral': {
    id: 'd-lactic-acid-chiral',
    name: 'D-乳酸 ((R)-2-羟基丙酸)',
    formula: 'D-CH_3-*CH(OH)-COOH',
    categoryName: '手性对映体 / 镜像立体异构',
    relatedGroupId: 'carboxyl-cooh',
    description: '与 L-乳酸互为实物与镜象不能重合的对映异构体。旋光方向相反，化学性质基本相同，但在生物酶催化手性环境中具有完全不同的专一活性。',
    spatialContrastNote:
      '【镜像对称观察】：与 L-乳酸相比，手性中心碳上的 -OH 与 -H 空间朝向发生镜像反转，无法通过空间平移或旋转重合！',
    variants: [
      { id: 'lactic-acid-chiral', label: 'L-乳酸 (S-型)', formula: 'L-乳酸', differenceHint: '左旋对映体 (人体代谢型)', targetMoleculeId: 'lactic-acid-chiral' },
      { id: 'd-lactic-acid-chiral', label: 'D-乳酸 (R-型)', formula: 'D-乳酸', differenceHint: '右旋对映体 (镜像构型)', targetMoleculeId: 'd-lactic-acid-chiral' },
    ],
    geometryFeatures: {
      hybridization: '手性碳与甲基碳为 sp³，羧基碳为 sp²',
      coplanarInfo: '手性中心不存在对称面与对称中心',
      reactionSite: '手性碳中心 (*C) 具有旋光性',
    },
    keyPoints: [
      '对映异构体熔点、沸点、密度等物理性质完全相同，仅旋光方向相反',
      '与 L-乳酸组成等量混合物时为外消旋体，无旋光性',
    ],
    atoms: [
      { id: 'c_chiral', symbol: 'C', elementName: '手性碳 (*C)', position: [0, 0, 0], color: ATOM_COLORS.C, radius: 0.38, hybridization: 'sp³', isChiral: true, isFunctionalGroup: true },
      { id: 'c_cooh', symbol: 'C', elementName: '羧基碳', position: [1.3, 0.4, 0], color: ATOM_COLORS.C, radius: 0.35, isFunctionalGroup: true },
      { id: 'o_cooh1', symbol: 'O', elementName: '羰基氧', position: [1.8, 1.5, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'o_cooh2', symbol: 'O', elementName: '羧羟基氧', position: [2.1, -0.65, 0], color: ATOM_COLORS.O, radius: 0.32, isFunctionalGroup: true },
      { id: 'h_cooh', symbol: 'H', elementName: '羧基活泼氢', position: [2.9, -0.4, 0], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
      { id: 'o_oh', symbol: 'O', elementName: '醇羟基氧', position: [-0.4, 1.25, -0.4], color: ATOM_COLORS.O, radius: 0.32, isFunctionalGroup: true },
      { id: 'h_oh', symbol: 'H', elementName: '醇羟基氢', position: [-0.1, 1.9, 0.1], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
      { id: 'c_me', symbol: 'C', elementName: '甲基碳', position: [-1.2, -0.8, 0.3], color: ATOM_COLORS.C, radius: 0.34, hybridization: 'sp³' },
      { id: 'h_chiral', symbol: 'H', elementName: '手性中心氢', position: [0.2, -0.5, -0.85], color: ATOM_COLORS.H, radius: 0.22 },
    ],
    bonds: [
      { id: 'c_chiral-c_cooh', start: [0, 0, 0], end: [1.3, 0.4, 0], order: 1 },
      ...createMultiBonds([1.3, 0.4, 0], [1.8, 1.5, 0], 2, 'd-lac-cooh-c=o'),
      { id: 'c_cooh-o_cooh', start: [1.3, 0.4, 0], end: [2.1, -0.65, 0], order: 1 },
      { id: 'o_cooh-h_cooh', start: [2.1, -0.65, 0], end: [2.9, -0.4, 0], order: 1 },
      { id: 'c_chiral-o_oh', start: [0, 0, 0], end: [-0.4, 1.25, -0.4], order: 1 },
      { id: 'o_oh-h_oh', start: [-0.4, 1.25, -0.4], end: [-0.1, 1.9, 0.1], order: 1 },
      { id: 'c_chiral-c_me', start: [0, 0, 0], end: [-1.2, -0.8, 0.3], order: 1 },
      { id: 'c_chiral-h_chiral', start: [0, 0, 0], end: [0.2, -0.5, -0.85], order: 1 },
    ],
  },

  // 14. 2-氯丁烷 (手性卤代烃)
  '2-chlorobutane-chiral': {
    id: '2-chlorobutane-chiral',
    name: '2-氯丁烷 (CH₃-*CH(Cl)-CH₂CH₃)',
    formula: 'CH_3-*CH(Cl)-CH_2CH_3',
    categoryName: '手性卤代烃 / 消去与水解',
    relatedGroupId: 'halo-alkane-x',
    description: '2 号碳连接 -H, -Cl, -CH₃, -CH₂CH₃ 4 个不同基团，具有手性。在 NaOH 醇溶液加热下消去主要生成 2-丁烯（顺/反异构体）。',
    geometryFeatures: {
      hybridization: '4 个碳原子均为 sp³ 杂化',
      coplanarInfo: '最多 3 个碳原子在同一平面上',
      reactionSite: '手性 C-Cl 键水解生成手性 2-丁醇；消去生成 2-丁烯 (失去手性)',
    },
    keyPoints: [
      '高考手性消失考点：2-氯丁烷发生消去反应生成 2-丁烯后，手性碳消失！',
      '水解生成 2-丁醇（保持手性碳）',
    ],
    atoms: [
      { id: 'c_chiral', symbol: 'C', elementName: '手性碳 (*C)', position: [0, 0, 0], color: ATOM_COLORS.C, radius: 0.38, hybridization: 'sp³', isChiral: true, isFunctionalGroup: true },
      { id: 'c1', symbol: 'C', elementName: '1号甲基碳', position: [-1.3, -0.5, 0], color: ATOM_COLORS.C, radius: 0.34, hybridization: 'sp³' },
      { id: 'cl', symbol: 'Cl', elementName: '氯原子', position: [0.2, 1.5, 0.2], color: ATOM_COLORS.Cl, radius: 0.42, isFunctionalGroup: true },
      { id: 'c3', symbol: 'C', elementName: '3号亚甲基碳', position: [1.1, -0.7, 0.4], color: ATOM_COLORS.C, radius: 0.35, hybridization: 'sp³' },
      { id: 'c4', symbol: 'C', elementName: '4号甲基碳', position: [2.3, 0.1, -0.1], color: ATOM_COLORS.C, radius: 0.34, hybridization: 'sp³' },
      { id: 'h_chiral', symbol: 'H', elementName: '手性氢', position: [-0.1, 0.2, -1.0], color: ATOM_COLORS.H, radius: 0.22 },
    ],
    bonds: [
      { id: 'c_chiral-c1', start: [0, 0, 0], end: [-1.3, -0.5, 0], order: 1 },
      { id: 'c_chiral-cl', start: [0, 0, 0], end: [0.2, 1.5, 0.2], order: 1 },
      { id: 'c_chiral-c3', start: [0, 0, 0], end: [1.1, -0.7, 0.4], order: 1 },
      { id: 'c3-c4', start: [1.1, -0.7, 0.4], end: [2.3, 0.1, -0.1], order: 1 },
      { id: 'c_chiral-h_chiral', start: [0, 0, 0], end: [-0.1, 0.2, -1.0], order: 1 },
    ],
  },
}
