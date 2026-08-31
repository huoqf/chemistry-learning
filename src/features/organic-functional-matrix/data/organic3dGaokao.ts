import { ATOM_COLORS } from '@/theme'
import {
  type Organic3DMolecule,
  createMultiBonds,
  createBenzeneRing,
} from './organic3dTypes'

export const GAOKAO_3D_MOLECULES: Record<string, Organic3DMolecule> = {
  // 13. 高考明星母题：阿司匹林 (乙酰水杨酸)
  aspirin: {
    id: 'aspirin',
    name: '阿司匹林 (乙酰水杨酸)',
    formula: 'o-(CH_3COO)-C_6H_4-COOH',
    categoryName: '高考头号母题 / 多官能团',
    description: '分子内含 1 个酚酯基与 1 个羧基。水解生成的邻羟基苯甲酸（水杨酸）含 1 个羧基和 1 个酚羟基，故 1 mol 阿司匹林完全水解共消耗 3 mol NaOH！',
    spatialContrastNote:
      '【空间构型与水解考点】：邻位的 -COOH 与 -OCOCH₃ 在苯环平面两侧存在立体扭转，酚酯键水解断裂生成的酚羟基与羧基共同中和 3 mol NaOH。',
    geometryFeatures: {
      hybridization: '苯环与 2 个羰基均为 sp²',
      coplanarInfo: '苯环 6 碳共面，邻位两基团存在空间位阻扭转',
      reactionSite: '酚酯水解 (耗 2 NaOH) + 羧基中和 (耗 1 NaOH) ➔ 总消耗 3 NaOH',
    },
    keyPoints: [
      '水解前加 FeCl₃ 不显紫色；碱性水解酸化后加 FeCl₃ 显特异紫色',
      '与 NaHCO₃ 反应仅羧基放 1 mol CO₂ 气体',
      '水解共消耗 3 mol NaOH，消耗 1 mol NaHCO₃，消耗 1 mol Na',
    ],
    relatedKnowledgeNode: {
      id: 'anim-isomerism',
      name: '酚羟基与酯化反应机理',
      routeHash: '/feature/anim-isomerism',
    },
    atoms: [
      ...createBenzeneRing([0, 0, 0], 1.3, 'asp-ring').atoms,
      { id: 'c_cooh', symbol: 'C', elementName: '羧基碳', position: [2.3, 0.3, 0], color: ATOM_COLORS.C, radius: 0.35, isFunctionalGroup: true },
      { id: 'o_cooh1', symbol: 'O', elementName: '羰基氧', position: [2.6, 1.4, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'o_cooh2', symbol: 'O', elementName: '羧羟基氧', position: [3.1, -0.6, 0], color: ATOM_COLORS.O, radius: 0.32, isFunctionalGroup: true },
      { id: 'h_cooh', symbol: 'H', elementName: '羧基活泼氢', position: [3.9, -0.3, 0], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
      { id: 'o_phenol_ester', symbol: 'O', elementName: '酚酯氧', position: [1.2, 1.8, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'c_acetyl', symbol: 'C', elementName: '乙酰羰基碳', position: [0.6, 2.8, 0], color: ATOM_COLORS.C, radius: 0.35, isFunctionalGroup: true },
      { id: 'o_acetyl', symbol: 'O', elementName: '乙酰羰基氧', position: [-0.6, 2.9, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'c_me', symbol: 'C', elementName: '乙酰甲基碳', position: [1.5, 3.9, 0], color: ATOM_COLORS.C, radius: 0.35 },
    ],
    bonds: [
      ...createBenzeneRing([0, 0, 0], 1.3, 'asp-ring').bonds,
      { id: 'ring-c_cooh', start: [1.3, 0, 0], end: [2.3, 0.3, 0], order: 1 },
      ...createMultiBonds([2.3, 0.3, 0], [2.6, 1.4, 0], 2, 'cooh-c=o'),
      { id: 'c_cooh-o2', start: [2.3, 0.3, 0], end: [3.1, -0.6, 0], order: 1 },
      { id: 'o2-h', start: [3.1, -0.6, 0], end: [3.9, -0.3, 0], order: 1 },
      { id: 'ring-o_pe', start: [1.3 * Math.cos(Math.PI / 3), 1.3 * Math.sin(Math.PI / 3), 0], end: [1.2, 1.8, 0], order: 1 },
      { id: 'o_pe-c_ac', start: [1.2, 1.8, 0], end: [0.6, 2.8, 0], order: 1 },
      ...createMultiBonds([0.6, 2.8, 0], [-0.6, 2.9, 0], 2, 'acetyl-c=o'),
      { id: 'c_ac-c_me', start: [0.6, 2.8, 0], end: [1.5, 3.9, 0], order: 1 },
    ],
  },

  // 14. 甲酸苯酯 (甲酸酯 + 酚酯双重特征)
  'formic-phenyl-ester': {
    id: 'formic-phenyl-ester',
    name: '甲酸苯酯 (HCOO-C₆H₅)',
    formula: 'HCOO-C_6H_5',
    categoryName: '高考超高频母题 / 醛酯双性',
    description: '含有甲酸酯基（发生银镜反应出 2 Ag），且属于酚酯（水解消耗 2 mol NaOH 生成甲酸钠 + 苯酚钠）。水解后的甲酸钠依然能发生银镜反应！',
    geometryFeatures: {
      hybridization: '苯环碳与酯羰基碳均为 sp²',
      coplanarInfo: '甲酸酯基与苯环共平面或小角度扭转',
      reactionSite: '甲酸醛基氢发生银镜反应；酚酯键双倍消耗 NaOH 水解',
    },
    keyPoints: [
      '高考金牌推断题眼：“1 mol 酯水解消耗 2 mol NaOH 且产物均能发生银镜反应”',
      '水解前与银氨溶液反应出 2 mol Ag',
      '水解产物甲酸钠酸化后仍能发生银镜反应',
    ],
    atoms: [
      ...createBenzeneRing([1.5, 0, 0], 1.3, 'fpe-ring').atoms,
      { id: 'o_pe', symbol: 'O', elementName: '酚酯氧', position: [0.0, 0, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'c_formyl', symbol: 'C', elementName: '甲酰基碳 (sp²)', position: [-1.1, 0.5, 0], color: ATOM_COLORS.C, radius: 0.35, isFunctionalGroup: true },
      { id: 'o_formyl', symbol: 'O', elementName: '羰基氧', position: [-1.1, 1.7, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'h_formyl', symbol: 'H', elementName: '甲酸醛基氢 (还原性)', position: [-2.0, -0.1, 0], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
    ],
    bonds: [
      ...createBenzeneRing([1.5, 0, 0], 1.3, 'fpe-ring').bonds,
      { id: 'ring-o_pe', start: [1.5 - 1.3, 0, 0], end: [0.0, 0, 0], order: 1 },
      { id: 'o_pe-c_formyl', start: [0.0, 0, 0], end: [-1.1, 0.5, 0], order: 1 },
      ...createMultiBonds([-1.1, 0.5, 0], [-1.1, 1.7, 0], 2, 'formyl-c=o'),
      { id: 'c_formyl-h', start: [-1.1, 0.5, 0], end: [-2.0, -0.1, 0], order: 1 },
    ],
  },

  // 15. 水杨酸甲酯 (邻羟基苯甲酸甲酯)
  'methyl-salicylate': {
    id: 'methyl-salicylate',
    name: '水杨酸甲酯 (冬青油)',
    formula: 'o-(OH)-C_6H_4-COOCH_3',
    categoryName: '高考对比母题 / 酚-OH + 醇酯',
    description: '分子内含 1 个游离酚羟基与 1 个普通甲酯。与阿司匹林不同，其游离酚羟基未被酯化，故直接滴加 FeCl₃ 即可显特异紫色。水解消耗 2 mol NaOH（酚中和 1 + 酯水解 1）。',
    geometryFeatures: {
      hybridization: '苯环与酯羰基为 sp²',
      coplanarInfo: '酚羟基与羧甲酯基邻位共存，形成分子内氢键',
      reactionSite: '游离酚羟基直接显紫色；甲酯水解耗 1 NaOH + 酚中和耗 1 NaOH',
    },
    keyPoints: [
      '无需水解即可直接与 FeCl₃ 显紫色（含游离酚-OH）',
      '水解消耗 2 mol NaOH，生成邻羟基苯甲酸钠 + 甲醇',
      '与浓溴水在酚羟基邻对位发生溴代反应',
    ],
    atoms: [
      ...createBenzeneRing([0, 0, 0], 1.3, 'ms-ring').atoms,
      { id: 'c_ester', symbol: 'C', elementName: '酯羰基碳', position: [2.3, 0.3, 0], color: ATOM_COLORS.C, radius: 0.35, isFunctionalGroup: true },
      { id: 'o_c=o', symbol: 'O', elementName: '羰基氧', position: [2.6, 1.4, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'o_me', symbol: 'O', elementName: '甲酯氧', position: [3.1, -0.6, 0], color: ATOM_COLORS.O, radius: 0.32, isFunctionalGroup: true },
      { id: 'c_me', symbol: 'C', elementName: '甲基碳', position: [4.3, -0.3, 0], color: ATOM_COLORS.C, radius: 0.35 },
      { id: 'o_phenol', symbol: 'O', elementName: '游离酚羟基氧', position: [1.2, 1.8, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'h_phenol', symbol: 'H', elementName: '酚羟基氢', position: [1.9, 2.3, 0], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
    ],
    bonds: [
      ...createBenzeneRing([0, 0, 0], 1.3, 'ms-ring').bonds,
      { id: 'ring-c_ester', start: [1.3, 0, 0], end: [2.3, 0.3, 0], order: 1 },
      ...createMultiBonds([2.3, 0.3, 0], [2.6, 1.4, 0], 2, 'ms-c=o'),
      { id: 'c_ester-o_me', start: [2.3, 0.3, 0], end: [3.1, -0.6, 0], order: 1 },
      { id: 'o_me-c_me', start: [3.1, -0.6, 0], end: [4.3, -0.3, 0], order: 1 },
      { id: 'ring-o_phenol', start: [1.3 * Math.cos(Math.PI / 3), 1.3 * Math.sin(Math.PI / 3), 0], end: [1.2, 1.8, 0], order: 1 },
      { id: 'o_phenol-h', start: [1.2, 1.8, 0], end: [1.9, 2.3, 0], order: 1 },
    ],
  },

  // 16. 水杨醛 (邻羟基苯甲醛)
  salicylaldehyde: {
    id: 'salicylaldehyde',
    name: '水杨醛 (邻羟基苯甲醛)',
    formula: 'o-(OH)-C_6H_4-CHO',
    categoryName: '高考明星母题 / 酚-OH + 醛基',
    description: '分子内含 1 个游离酚羟基与 1 个醛基。既能发生银镜反应出 2 Ag，又能与 FeCl₃ 显紫色；与浓溴水反应时，苯环邻对位发生 2 处取代，醛基被溴水氧化消耗 1 mol Br₂，总计消耗 3 mol Br₂。',
    geometryFeatures: {
      hybridization: '苯环与醛基碳均为 sp²',
      coplanarInfo: '全分子几乎严格共平面',
      reactionSite: '醛基还原性 (银镜出 2 Ag) + 酚羟基显色与溴代 (耗 3 Br₂)',
    },
    keyPoints: [
      '发生银镜反应析出 2 mol Ag',
      '与浓溴水反应共消耗 3 mol Br₂（2 溴代 + 1 醛基氧化）',
      '直接遇 FeCl₃ 溶液显特异紫色',
    ],
    atoms: [
      ...createBenzeneRing([0, 0, 0], 1.3, 'sa-ring').atoms,
      { id: 'c_cho', symbol: 'C', elementName: '醛基碳', position: [2.3, 0.3, 0], color: ATOM_COLORS.C, radius: 0.35, isFunctionalGroup: true },
      { id: 'o_cho', symbol: 'O', elementName: '醛羰基氧', position: [2.6, 1.4, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'h_cho', symbol: 'H', elementName: '醛基氢', position: [3.1, -0.4, 0], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
      { id: 'o_oh', symbol: 'O', elementName: '酚羟基氧', position: [1.2, 1.8, 0], color: ATOM_COLORS.O, radius: 0.33, isFunctionalGroup: true },
      { id: 'h_oh', symbol: 'H', elementName: '酚羟基氢', position: [1.9, 2.3, 0], color: ATOM_COLORS.H, radius: 0.22, isFunctionalGroup: true },
    ],
    bonds: [
      ...createBenzeneRing([0, 0, 0], 1.3, 'sa-ring').bonds,
      { id: 'ring-c_cho', start: [1.3, 0, 0], end: [2.3, 0.3, 0], order: 1 },
      ...createMultiBonds([2.3, 0.3, 0], [2.6, 1.4, 0], 2, 'sa-cho-c=o'),
      { id: 'c_cho-h', start: [2.3, 0.3, 0], end: [3.1, -0.4, 0], order: 1 },
      { id: 'ring-o_oh', start: [1.3 * Math.cos(Math.PI / 3), 1.3 * Math.sin(Math.PI / 3), 0], end: [1.2, 1.8, 0], order: 1 },
      { id: 'o_oh-h', start: [1.2, 1.8, 0], end: [1.9, 2.3, 0], order: 1 },
    ],
  },
}
