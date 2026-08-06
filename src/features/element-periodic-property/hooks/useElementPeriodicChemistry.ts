import { useMemo } from 'react'
import type {
  ElementInfo,
  ElementPeriodicParams,
  OrbitalElectron,
  IsoElectronParticle,
  GaokaoInferenceCase,
} from '../types'

// 1~30 号元素高精度化学元数据字典
export const PERIODIC_ELEMENTS: Record<number, ElementInfo> = {
  1: {
    z: 1,
    symbol: 'H',
    name: '氢',
    period: 1,
    group: 'IA',
    block: 's',
    outerConfig: '1s¹',
    fullConfig: '1s¹',
    shortConfig: '1s¹',
    electronLayers: [1],
    unpairedElectrons: 1,
    maxOxidation: 1,
    minOxidation: -1,
    electronegativity: 2.1,
    firstIonization: 1312,
    stepIonization: [1312],
    atomicRadius: 37,
  },
  2: {
    z: 2,
    symbol: 'He',
    name: '氦',
    period: 1,
    group: '0',
    block: 's',
    outerConfig: '1s²',
    fullConfig: '1s²',
    shortConfig: '1s²',
    electronLayers: [2],
    unpairedElectrons: 0,
    maxOxidation: 0,
    electronegativity: 0,
    firstIonization: 2372,
    stepIonization: [2372, 5250],
    atomicRadius: 32,
  },
  3: {
    z: 3,
    symbol: 'Li',
    name: '锂',
    period: 2,
    group: 'IA',
    block: 's',
    outerConfig: '2s¹',
    fullConfig: '1s² 2s¹',
    shortConfig: '[He]2s¹',
    electronLayers: [2, 1],
    unpairedElectrons: 1,
    maxOxidation: 1,
    electronegativity: 1.0,
    firstIonization: 520,
    stepIonization: [520, 7298, 11815],
    atomicRadius: 152,
  },
  4: {
    z: 4,
    symbol: 'Be',
    name: '铍',
    period: 2,
    group: 'IIA',
    block: 's',
    outerConfig: '2s²',
    fullConfig: '1s² 2s²',
    shortConfig: '[He]2s²',
    electronLayers: [2, 2],
    unpairedElectrons: 0,
    maxOxidation: 2,
    electronegativity: 1.5,
    firstIonization: 899,
    stepIonization: [899, 1757, 14848, 21006],
    atomicRadius: 112,
    specialNote: '2s² 处于全充满稳定状态，I₁ 大于同周期 ₅B (801 kJ/mol)',
  },
  5: {
    z: 5,
    symbol: 'B',
    name: '硼',
    period: 2,
    group: 'IIIA',
    block: 'p',
    outerConfig: '2s² 2p¹',
    fullConfig: '1s² 2s² 2p¹',
    shortConfig: '[He]2s² 2p¹',
    electronLayers: [2, 3],
    unpairedElectrons: 1,
    maxOxidation: 3,
    electronegativity: 2.0,
    firstIonization: 801,
    stepIonization: [801, 2427, 3660, 25026, 32827],
    atomicRadius: 85,
  },
  6: {
    z: 6,
    symbol: 'C',
    name: '碳',
    period: 2,
    group: 'IVA',
    block: 'p',
    outerConfig: '2s² 2p²',
    fullConfig: '1s² 2s² 2p²',
    shortConfig: '[He]2s² 2p²',
    electronLayers: [2, 4],
    unpairedElectrons: 2,
    maxOxidation: 4,
    minOxidation: -4,
    electronegativity: 2.5,
    firstIonization: 1086,
    stepIonization: [1086, 2353, 4620, 6223],
    atomicRadius: 77,
  },
  7: {
    z: 7,
    symbol: 'N',
    name: '氮',
    period: 2,
    group: 'VA',
    block: 'p',
    outerConfig: '2s² 2p³',
    fullConfig: '1s² 2s² 2p³',
    shortConfig: '[He]2s² 2p³',
    electronLayers: [2, 5],
    unpairedElectrons: 3,
    maxOxidation: 5,
    minOxidation: -3,
    electronegativity: 3.0,
    firstIonization: 1402,
    stepIonization: [1402, 2856, 4578, 7475],
    atomicRadius: 75,
    specialNote: '2p³ 处于半充满稳定状态，I₁ 反常高于同周期 ₈O (1314 kJ/mol)',
  },
  8: {
    z: 8,
    symbol: 'O',
    name: '氧',
    period: 2,
    group: 'VIA',
    block: 'p',
    outerConfig: '2s² 2p⁴',
    fullConfig: '1s² 2s² 2p⁴',
    shortConfig: '[He]2s² 2p⁴',
    electronLayers: [2, 6],
    unpairedElectrons: 2,
    maxOxidation: 2,
    minOxidation: -2,
    electronegativity: 3.5,
    firstIonization: 1314,
    stepIonization: [1314, 3388, 5301, 7469],
    atomicRadius: 73,
  },
  9: {
    z: 9,
    symbol: 'F',
    name: '氟',
    period: 2,
    group: 'VIIA',
    block: 'p',
    outerConfig: '2s² 2p⁵',
    fullConfig: '1s² 2s² 2p⁵',
    shortConfig: '[He]2s² 2p⁵',
    electronLayers: [2, 7],
    unpairedElectrons: 1,
    maxOxidation: 0,
    minOxidation: -1,
    electronegativity: 4.0,
    firstIonization: 1681,
    stepIonization: [1681, 3374, 6050, 8408],
    atomicRadius: 71,
    specialNote: '全周期电负性最大元素 (4.0)，无正化合价',
  },
  10: {
    z: 10,
    symbol: 'Ne',
    name: '氖',
    period: 2,
    group: '0',
    block: 'p',
    outerConfig: '2s² 2p⁶',
    fullConfig: '1s² 2s² 2p⁶',
    shortConfig: '[He]2s² 2p⁶',
    electronLayers: [2, 8],
    unpairedElectrons: 0,
    maxOxidation: 0,
    electronegativity: 0,
    firstIonization: 2081,
    stepIonization: [2081, 3952, 6122, 9370],
    atomicRadius: 69,
  },
  11: {
    z: 11,
    symbol: 'Na',
    name: '钠',
    period: 3,
    group: 'IA',
    block: 's',
    outerConfig: '3s¹',
    fullConfig: '1s² 2s² 2p⁶ 3s¹',
    shortConfig: '[Ne]3s¹',
    electronLayers: [2, 8, 1],
    unpairedElectrons: 1,
    maxOxidation: 1,
    electronegativity: 0.9,
    firstIonization: 496,
    stepIonization: [496, 4562, 6910, 9543],
    atomicRadius: 186,
    specialNote: 'I₁ 远小于 I₂ (I₂/I₁ ≈ 9.2)，失1个电子后形成8电子稳定结构',
  },
  12: {
    z: 12,
    symbol: 'Mg',
    name: '镁',
    period: 3,
    group: 'IIA',
    block: 's',
    outerConfig: '3s²',
    fullConfig: '1s² 2s² 2p⁶ 3s²',
    shortConfig: '[Ne]3s²',
    electronLayers: [2, 8, 2],
    unpairedElectrons: 0,
    maxOxidation: 2,
    electronegativity: 1.2,
    firstIonization: 738,
    stepIonization: [738, 1451, 7733, 10542],
    atomicRadius: 160,
    specialNote: '3s² 处于全充满状态，I₁ 大于同周期 ₁₃Al (578 kJ/mol)',
  },
  13: {
    z: 13,
    symbol: 'Al',
    name: '铝',
    period: 3,
    group: 'IIIA',
    block: 'p',
    outerConfig: '3s² 3p¹',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p¹',
    shortConfig: '[Ne]3s² 3p¹',
    electronLayers: [2, 8, 3],
    unpairedElectrons: 1,
    maxOxidation: 3,
    electronegativity: 1.5,
    firstIonization: 578,
    stepIonization: [578, 1817, 2745, 11577],
    atomicRadius: 143,
  },
  14: {
    z: 14,
    symbol: 'Si',
    name: '硅',
    period: 3,
    group: 'IVA',
    block: 'p',
    outerConfig: '3s² 3p²',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p²',
    shortConfig: '[Ne]3s² 3p²',
    electronLayers: [2, 8, 4],
    unpairedElectrons: 2,
    maxOxidation: 4,
    minOxidation: -4,
    electronegativity: 1.8,
    firstIonization: 786,
    stepIonization: [786, 1577, 3232, 4355],
    atomicRadius: 117,
  },
  15: {
    z: 15,
    symbol: 'P',
    name: '磷',
    period: 3,
    group: 'VA',
    block: 'p',
    outerConfig: '3s² 3p³',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p³',
    shortConfig: '[Ne]3s² 3p³',
    electronLayers: [2, 8, 5],
    unpairedElectrons: 3,
    maxOxidation: 5,
    minOxidation: -3,
    electronegativity: 2.1,
    firstIonization: 1012,
    stepIonization: [1012, 1907, 2914, 4964],
    atomicRadius: 110,
    specialNote: '3p³ 处于半充满稳定状态，I₁ 反常高于同周期 ₁₆S (1000 kJ/mol)',
  },
  16: {
    z: 16,
    symbol: 'S',
    name: '硫',
    period: 3,
    group: 'VIA',
    block: 'p',
    outerConfig: '3s² 3p⁴',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁴',
    shortConfig: '[Ne]3s² 3p⁴',
    electronLayers: [2, 8, 6],
    unpairedElectrons: 2,
    maxOxidation: 6,
    minOxidation: -2,
    electronegativity: 2.5,
    firstIonization: 1000,
    stepIonization: [1000, 2252, 3357, 4556],
    atomicRadius: 102,
  },
  17: {
    z: 17,
    symbol: 'Cl',
    name: '氯',
    period: 3,
    group: 'VIIA',
    block: 'p',
    outerConfig: '3s² 3p⁵',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁵',
    shortConfig: '[Ne]3s² 3p⁵',
    electronLayers: [2, 8, 7],
    unpairedElectrons: 1,
    maxOxidation: 7,
    minOxidation: -1,
    electronegativity: 3.0,
    firstIonization: 1251,
    stepIonization: [1251, 2298, 3822, 5158],
    atomicRadius: 99,
  },
  18: {
    z: 18,
    symbol: 'Ar',
    name: '氩',
    period: 3,
    group: '0',
    block: 'p',
    outerConfig: '3s² 3p⁶',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁶',
    shortConfig: '[Ne]3s² 3p⁶',
    electronLayers: [2, 8, 8],
    unpairedElectrons: 0,
    maxOxidation: 0,
    electronegativity: 0,
    firstIonization: 1521,
    stepIonization: [1521, 2666, 3931, 5771],
    atomicRadius: 98,
  },
  19: {
    z: 19,
    symbol: 'K',
    name: '钾',
    period: 4,
    group: 'IA',
    block: 's',
    outerConfig: '4s¹',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹',
    shortConfig: '[Ar]4s¹',
    electronLayers: [2, 8, 8, 1],
    unpairedElectrons: 1,
    maxOxidation: 1,
    electronegativity: 0.8,
    firstIonization: 419,
    stepIonization: [419, 3052, 4420, 5877],
    atomicRadius: 227,
  },
  20: {
    z: 20,
    symbol: 'Ca',
    name: '钙',
    period: 4,
    group: 'IIA',
    block: 's',
    outerConfig: '4s²',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s²',
    shortConfig: '[Ar]4s²',
    electronLayers: [2, 8, 8, 2],
    unpairedElectrons: 0,
    maxOxidation: 2,
    electronegativity: 1.0,
    firstIonization: 590,
    stepIonization: [590, 1145, 4912, 6491],
    atomicRadius: 197,
  },
  21: {
    z: 21,
    symbol: 'Sc',
    name: '钪',
    period: 4,
    group: 'IIIB',
    block: 'd',
    outerConfig: '3d¹ 4s²',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹ 4s²',
    shortConfig: '[Ar]3d¹ 4s²',
    electronLayers: [2, 8, 9, 2],
    unpairedElectrons: 1,
    maxOxidation: 3,
    electronegativity: 1.3,
    firstIonization: 633,
    stepIonization: [633, 1235, 2389, 7090],
    atomicRadius: 162,
  },
  22: {
    z: 22,
    symbol: 'Ti',
    name: '钛',
    period: 4,
    group: 'IVB',
    block: 'd',
    outerConfig: '3d² 4s²',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d² 4s²',
    shortConfig: '[Ar]3d² 4s²',
    electronLayers: [2, 8, 10, 2],
    unpairedElectrons: 2,
    maxOxidation: 4,
    electronegativity: 1.5,
    firstIonization: 658,
    stepIonization: [658, 1310, 2652, 4175],
    atomicRadius: 147,
  },
  23: {
    z: 23,
    symbol: 'V',
    name: '钒',
    period: 4,
    group: 'VB',
    block: 'd',
    outerConfig: '3d³ 4s²',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d³ 4s²',
    shortConfig: '[Ar]3d³ 4s²',
    electronLayers: [2, 8, 11, 2],
    unpairedElectrons: 3,
    maxOxidation: 5,
    electronegativity: 1.6,
    firstIonization: 650,
    stepIonization: [650, 1414, 2830, 4507],
    atomicRadius: 134,
  },
  24: {
    z: 24,
    symbol: 'Cr',
    name: '铬',
    period: 4,
    group: 'VIB',
    block: 'd',
    outerConfig: '3d⁵ 4s¹',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹',
    shortConfig: '[Ar]3d⁵ 4s¹',
    electronLayers: [2, 8, 13, 1],
    unpairedElectrons: 6,
    maxOxidation: 6,
    electronegativity: 1.6,
    firstIonization: 653,
    stepIonization: [653, 1592, 2987, 4743],
    atomicRadius: 128,
    isHundSpecial: true,
    specialNote: '洪特规则特例：3d⁵ 4s¹ 达到双半充满极稳结构，未成对电子数高达 6 个！',
  },
  25: {
    z: 25,
    symbol: 'Mn',
    name: '锰',
    period: 4,
    group: 'VIIB',
    block: 'd',
    outerConfig: '3d⁵ 4s²',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s²',
    shortConfig: '[Ar]3d⁵ 4s²',
    electronLayers: [2, 8, 13, 2],
    unpairedElectrons: 5,
    maxOxidation: 7,
    electronegativity: 1.5,
    firstIonization: 717,
    stepIonization: [717, 1509, 3248, 4940],
    atomicRadius: 127,
  },
  26: {
    z: 26,
    symbol: 'Fe',
    name: '铁',
    period: 4,
    group: 'VIII',
    block: 'd',
    outerConfig: '3d⁶ 4s²',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²',
    shortConfig: '[Ar]3d⁶ 4s²',
    electronLayers: [2, 8, 14, 2],
    unpairedElectrons: 4,
    maxOxidation: 6,
    electronegativity: 1.8,
    firstIonization: 762,
    stepIonization: [762, 1561, 2957, 5290],
    atomicRadius: 126,
  },
  27: {
    z: 27,
    symbol: 'Co',
    name: '钴',
    period: 4,
    group: 'VIII',
    block: 'd',
    outerConfig: '3d⁷ 4s²',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁷ 4s²',
    shortConfig: '[Ar]3d⁷ 4s²',
    electronLayers: [2, 8, 15, 2],
    unpairedElectrons: 3,
    maxOxidation: 3,
    electronegativity: 1.88,
    firstIonization: 760,
    stepIonization: [760, 1648, 3232, 4950],
    atomicRadius: 125,
  },
  28: {
    z: 28,
    symbol: 'Ni',
    name: '镍',
    period: 4,
    group: 'VIII',
    block: 'd',
    outerConfig: '3d⁸ 4s²',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁸ 4s²',
    shortConfig: '[Ar]3d⁸ 4s²',
    electronLayers: [2, 8, 16, 2],
    unpairedElectrons: 2,
    maxOxidation: 3,
    electronegativity: 1.91,
    firstIonization: 737,
    stepIonization: [737, 1753, 3395, 5300],
    atomicRadius: 124,
  },
  29: {
    z: 29,
    symbol: 'Cu',
    name: '铜',
    period: 4,
    group: 'IB',
    block: 'ds',
    outerConfig: '3d¹⁰ 4s¹',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹',
    shortConfig: '[Ar]3d¹⁰ 4s¹',
    electronLayers: [2, 8, 18, 1],
    unpairedElectrons: 1,
    maxOxidation: 2,
    electronegativity: 1.9,
    firstIonization: 745,
    stepIonization: [745, 1958, 3555, 5540],
    atomicRadius: 128,
    isHundSpecial: true,
    specialNote: '洪特规则特例：3d¹⁰ 4s¹ 达到 3d 轨道全充满极大稳定结构！',
  },
  30: {
    z: 30,
    symbol: 'Zn',
    name: '锌',
    period: 4,
    group: 'IIB',
    block: 'ds',
    outerConfig: '3d¹⁰ 4s²',
    fullConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s²',
    shortConfig: '[Ar]3d¹⁰ 4s²',
    electronLayers: [2, 8, 18, 2],
    unpairedElectrons: 0,
    maxOxidation: 2,
    electronegativity: 1.6,
    firstIonization: 906,
    stepIonization: [906, 1733, 3833, 5731],
    atomicRadius: 133,
  },
}

// 等电子体微粒半径高保真数据
export const ISO_ELECTRON_SERIES: Record<'10e' | '18e', IsoElectronParticle[]> = {
  '10e': [
    { symbol: 'O²', name: '氧化物阴离子', charge: -2, z: 8, radius: 140, electronCount: 10, configStr: '1s²2s²2p⁶' },
    { symbol: 'F⁻', name: '氟离子', charge: -1, z: 9, radius: 133, electronCount: 10, configStr: '1s²2s²2p⁶' },
    { symbol: 'Na⁺', name: '钠离子', charge: 1, z: 11, radius: 102, electronCount: 10, configStr: '1s²2s²2p⁶' },
    { symbol: 'Mg²⁺', name: '镁离子', charge: 2, z: 12, radius: 72, electronCount: 10, configStr: '1s²2s²2p⁶' },
    { symbol: 'Al³⁺', name: '铝离子', charge: 3, z: 13, radius: 53.5, electronCount: 10, configStr: '1s²2s²2p⁶' },
  ],
  '18e': [
    { symbol: 'P³⁻', name: '磷化物阴离子', charge: -3, z: 15, radius: 212, electronCount: 18, configStr: '[Ne]3s²3p⁶' },
    { symbol: 'S²⁻', name: '硫化物阴离子', charge: -2, z: 16, radius: 184, electronCount: 18, configStr: '[Ne]3s²3p⁶' },
    { symbol: 'Cl⁻', name: '氯离子', charge: -1, z: 17, radius: 181, electronCount: 18, configStr: '[Ne]3s²3p⁶' },
    { symbol: 'K⁺', name: '钾离子', charge: 1, z: 19, radius: 138, electronCount: 18, configStr: '[Ne]3s²3p⁶' },
    { symbol: 'Ca²⁺', name: '钙离子', charge: 2, z: 20, radius: 100, electronCount: 18, configStr: '[Ne]3s²3p⁶' },
  ],
}

// 高考经典位-构-性压轴推断题案例库
export const GAOKAO_INFERENCE_CASES: GaokaoInferenceCase[] = [
  {
    id: 'case-2024-shandong',
    title: '2024 山东高考真题：短周期 X/Y/Z/W 结构推断',
    source: '2024 全国高考山东卷',
    coreQuestion: '推断短周期元素 X, Y, Z, W 身份，并比较简单离子半径与第一电离能大小。',
    analysis: 'X 的基态 p 轨道电子数等于 s 轨道电子数 ➔ X=O (1s²2s²2p⁴, s=4, p=4)；Y 的电负性在同周期中最强 ➔ Y=F；Z 的最外层 p 轨道 3p³ 半充满 ➔ Z=P；W 常见金属 ➔ Na。',
    elements: [
      {
        elementCode: 'X',
        realSymbol: 'O',
        clues: ['短周期元素', '基态原子 p 轨道电子总数等于 s 轨道电子总数 (4=4)'],
        derivation: '1s² 2s² 2p⁴ ➔ 电子数 8 ➔ 氧 (O)',
        keyPoint: '核外电子排布 p/s 电子数相等特征',
      },
      {
        elementCode: 'Y',
        realSymbol: 'F',
        clues: ['与 X 同周期', '同周期中电负性最强 (4.0)'],
        derivation: '第 2 周期第 VIIA 族 ➔ 氟 (F)',
        keyPoint: '同周期电负性最大非金属特征',
      },
      {
        elementCode: 'Z',
        realSymbol: 'P',
        clues: ['第 3 周期元素', '价层电子 3p³ 处于半充满稳定状态'],
        derivation: '1s² 2s² 2p⁶ 3s² 3p³ ➔ 磷 (P)',
        keyPoint: '第一电离能 P > S (半充满反常)',
      },
      {
        elementCode: 'W',
        realSymbol: 'Na',
        clues: ['第 3 周期主族金属', '单质与水剧烈反应生成碱性气体/溶液'],
        derivation: '[Ne]3s¹ ➔ 钠 (Na)',
        keyPoint: '10电子离子半径：O²⁻ > F⁻ > Na⁺',
      },
    ],
  },
  {
    id: 'case-2024-quanguo',
    title: '2024 全国甲卷：第四周期 d 区 Transition 元素推演',
    source: '2024 全国甲卷',
    coreQuestion: '探究 ₂₄Cr 与 ₂₉Cu 洪特规则特例价电子排布与电离能。',
    analysis: 'Cr (24号): 3d⁵ 4s¹ 半充满极稳；Cu (29号): 3d¹⁰ 4s¹ 全充满极稳。能量最低原理受洪特规则稳定位相修饰。',
    elements: [
      {
        elementCode: 'M',
        realSymbol: 'Cr',
        clues: ['第四周期 VIB 族', '基态未成对电子数最多 (6个)'],
        derivation: '[Ar]3d⁵ 4s¹ ➔ 铬 (Cr)',
        keyPoint: '3d⁵4s¹ 双半充满稳定排布',
      },
      {
        elementCode: 'N',
        realSymbol: 'Cu',
        clues: ['第四周期 IB 族', '3d 轨道呈全充满状态 (3d¹⁰)'],
        derivation: '[Ar]3d¹⁰ 4s¹ ➔ 铜 (Cu)',
        keyPoint: '3d¹⁰4s¹ 全充满稳定排布',
      },
    ],
  },
]

export function useElementPeriodicChemistry(params: ElementPeriodicParams) {
  const currentElement = useMemo(() => {
    return PERIODIC_ELEMENTS[params.selectedAtomicNumber] || PERIODIC_ELEMENTS[6]
  }, [params.selectedAtomicNumber])

  // 轨道方框图（Orbital Boxes）自旋电子分布计算
  const orbitalBoxes = useMemo((): OrbitalElectron[] => {
    const isExcited = params.stateType === 'excited'
    const z = currentElement.z

    // 默认轨道定义
    const orbitals: { n: number; l: 's' | 'p' | 'd'; label: string; maxCap: number }[] = [
      { n: 1, l: 's', label: '1s', maxCap: 2 },
      { n: 2, l: 's', label: '2s', maxCap: 2 },
      { n: 2, l: 'p', label: '2px', maxCap: 2 },
      { n: 2, l: 'p', label: '2py', maxCap: 2 },
      { n: 2, l: 'p', label: '2pz', maxCap: 2 },
      { n: 3, l: 's', label: '3s', maxCap: 2 },
      { n: 3, l: 'p', label: '3px', maxCap: 2 },
      { n: 3, l: 'p', label: '3py', maxCap: 2 },
      { n: 3, l: 'p', label: '3pz', maxCap: 2 },
      { n: 4, l: 's', label: '4s', maxCap: 2 },
      { n: 3, l: 'd', label: '3d1', maxCap: 2 },
      { n: 3, l: 'd', label: '3d2', maxCap: 2 },
      { n: 3, l: 'd', label: '3d3', maxCap: 2 },
      { n: 3, l: 'd', label: '3d4', maxCap: 2 },
      { n: 3, l: 'd', label: '3d5', maxCap: 2 },
    ]

    // 针对每个元素的真实电子填充 (构造原理 / Cr Cu 特例)
    let remaining = z

    // 特殊情况：Cr (24) -> 3d5 4s1; Cu (29) -> 3d10 4s1
    const isCr = z === 24
    const isCu = z === 29

    const res: OrbitalElectron[] = orbitals.map((orb) => {
      let count = 0
      if (isCr) {
        if (['1s', '2s', '2px', '2py', '2pz', '3s', '3px', '3py', '3pz'].includes(orb.label)) count = 2
        else if (orb.label === '4s') count = 1
        else if (orb.label.startsWith('3d')) count = 1
      } else if (isCu) {
        if (['1s', '2s', '2px', '2py', '2pz', '3s', '3px', '3py', '3pz'].includes(orb.label)) count = 2
        else if (orb.label === '4s') count = 1
        else if (orb.label.startsWith('3d')) count = 2
      } else {
        // 常规填充顺序: 1s -> 2s -> 2p (px,py,pz) -> 3s -> 3p -> 4s -> 3d
        if (orb.label === '1s') count = Math.min(2, remaining)
        else if (orb.label === '2s') count = Math.min(2, Math.max(0, remaining - 2))
        else if (['2px', '2py', '2pz'].includes(orb.label)) {
          const pTot = Math.min(6, Math.max(0, remaining - 4))
          // 洪特规则：先单分配
          const idx = ['2px', '2py', '2pz'].indexOf(orb.label)
          count = pTot > idx ? (pTot >= idx + 4 ? 2 : 1) : 0
        } else if (orb.label === '3s') count = Math.min(2, Math.max(0, remaining - 10))
        else if (['3px', '3py', '3pz'].includes(orb.label)) {
          const pTot = Math.min(6, Math.max(0, remaining - 12))
          const idx = ['3px', '3py', '3pz'].indexOf(orb.label)
          count = pTot > idx ? (pTot >= idx + 4 ? 2 : 1) : 0
        } else if (orb.label === '4s') count = Math.min(2, Math.max(0, remaining - 18))
        else if (orb.label.startsWith('3d')) {
          const dTot = Math.min(10, Math.max(0, remaining - 20))
          const idx = ['3d1', '3d2', '3d3', '3d4', '3d5'].indexOf(orb.label)
          count = dTot > idx ? (dTot >= idx + 6 ? 2 : 1) : 0
        }
      }

      // 如果选了激发态，将最高能级的一个电子跃迁至高轨道
      if (isExcited && count > 0 && orb.label === (currentElement.block === 'p' ? '2px' : '2s')) {
        count -= 1
      }

      const arrows: ('up' | 'down')[] = []
      if (count === 1) arrows.push('up')
      if (count === 2) arrows.push('up', 'down')

      return {
        n: orb.n,
        l: orb.l,
        label: orb.label,
        electrons: arrows,
        isFull: count === 2,
        isHalf: count === 1,
      }
    })

    // 如果激发态，在最外层更高轨道补上 1 个跃迁电子
    if (isExcited) {
      const emptyBox = res.find((b) => b.electrons.length === 0)
      if (emptyBox) emptyBox.electrons.push('up')
    }

    return res.filter((b) => b.n <= currentElement.period + 1 && (b.electrons.length > 0 || b.n <= currentElement.period))
  }, [currentElement, params.stateType])

  // 同周期第一电离能对比列表 (周期 2 或 3)
  const periodIonizationData = useMemo(() => {
    const period = params.periodFilter || 2
    return Object.values(PERIODIC_ELEMENTS)
      .filter((e) => e.period === period)
      .map((e) => ({
        symbol: e.symbol,
        name: e.name,
        z: e.z,
        group: e.group,
        value: e.firstIonization,
        isAnomaly:
          (e.group === 'IIA' && e.symbol === (period === 2 ? 'Be' : 'Mg')) ||
          (e.group === 'VA' && e.symbol === (period === 2 ? 'N' : 'P')),
        reason:
          e.group === 'IIA'
            ? `${e.outerConfig.split(' ')[0]} 轨全充满`
            : e.group === 'VA'
            ? `${e.outerConfig.split(' ')[1] || 'p³'} 轨半充满`
            : '',
      }))
  }, [params.periodFilter])

  // 当前元素的逐级电离能突跃分析
  const stepIonizationAnalysis = useMemo(() => {
    const steps = currentElement.stepIonization
    const ratios: number[] = []
    let maxJumpIndex = 0
    let maxJumpRatio = 0

    for (let i = 0; i < steps.length - 1; i++) {
      const ratio = steps[i + 1] / steps[i]
      ratios.push(Number(ratio.toFixed(1)))
      if (ratio > maxJumpRatio) {
        maxJumpRatio = ratio
        maxJumpIndex = i + 1 // I_1 -> I_2 就是 1 (说明有1个价电子)
      }
    }

    return {
      steps,
      ratios,
      valanceCountPredicted: maxJumpIndex,
      jumpDescription: `从 I${maxJumpIndex} (${steps[maxJumpIndex - 1]} kJ/mol) 到 I${
        maxJumpIndex + 1
      } (${steps[maxJumpIndex]} kJ/mol) 发生剧烈突跃 (倍率 ${maxJumpRatio.toFixed(
        1
      )} 倍)，表明跨越内层，该元素最外层价电子数为 ${maxJumpIndex}。`,
    }
  }, [currentElement])

  // 当前选中的高考推断案例
  const activeInferenceCase = useMemo(() => {
    return (
      GAOKAO_INFERENCE_CASES.find((c) => c.id === params.inferenceId) ||
      GAOKAO_INFERENCE_CASES[0]
    )
  }, [params.inferenceId])

  return {
    currentElement,
    orbitalBoxes,
    periodIonizationData,
    stepIonizationAnalysis,
    isoParticles: ISO_ELECTRON_SERIES[params.isoGroupFilter],
    activeInferenceCase,
  }
}
