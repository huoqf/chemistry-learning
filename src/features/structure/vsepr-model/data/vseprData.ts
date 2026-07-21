/**
 * VSEPR 预设数据库与 3D 坐标几何分布算法
 * 
 * 遵守三屏与视觉规范：
 * - 纯数据与几何计算，不包含 DOM、React 或 Store 依赖
 * - 三维坐标采用以中心原子为原点 (0,0,0) 的 Cartesian 世界坐标系
 */

export interface VseprMolecule {
  id: string
  name: string
  formula: string
  centralElement: string
  ligandElement: string
  charge: number
  centralValence: number // a
  ligandCount: number    // m
  ligandValence: number  // y (H/卤素=1, O/S=2)
  lonePairCount: number  // n
  totalPairs: number     // m + n
  electronGeometry: string
  molecularGeometry: string
  hybridization: string
  bondAngleText: string
  description: string
  centralColor: string
  ligandColor: string
  /** 配体 3D 坐标 */
  ligands: Array<{ pos: [number, number, number]; label: string }>
  /** 孤电子对 3D 坐标方向 */
  lonePairs: Array<{ pos: [number, number, number]; label: string }>
  /** 理想多面体虚线框架边 */
  polyEdges: Array<[[number, number, number], [number, number, number]]>
  /** 键角弧标注 */
  bondAngles: Array<{
    p1: [number, number, number]
    p2: [number, number, number]
    angleText: string
  }>
}

const R_BOND = 1.6 // 键长 Scale

// 预设几何坐标生成辅助工具
function normalize(v: [number, number, number], scale = 1): [number, number, number] {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
  if (len === 0) return [0, 0, 0]
  return [(v[0] / len) * scale, (v[1] / len) * scale, (v[2] / len) * scale]
}

// 常见理想几何多面体顶点向量
const GEOMETRY_VERTICES = {
  // 直线形 (2对)
  linear: [
    [0, R_BOND, 0],
    [0, -R_BOND, 0],
  ] as [number, number, number][],

  // 平面三角形 (3对)
  trigonalPlanar: [
    [0, R_BOND, 0],
    [R_BOND * Math.cos(Math.PI / 6), -R_BOND * Math.sin(Math.PI / 6), 0],
    [-R_BOND * Math.cos(Math.PI / 6), -R_BOND * Math.sin(Math.PI / 6), 0],
  ] as [number, number, number][],

  // 正四面体 (4对)
  tetrahedral: [
    [0, R_BOND, 0],
    [R_BOND * (2 * Math.sqrt(2) / 3), -R_BOND / 3, 0],
    [-R_BOND * (Math.sqrt(2) / 3), -R_BOND / 3, R_BOND * (Math.sqrt(6) / 3)],
    [-R_BOND * (Math.sqrt(2) / 3), -R_BOND / 3, -R_BOND * (Math.sqrt(6) / 3)],
  ] as [number, number, number][],

  // 三角双锥 (5对): [轴向上, 轴向下, 赤道1, 赤道2, 赤道3]
  trigonalBipyramidal: [
    [0, R_BOND, 0],   // 轴向 1 (Top)
    [0, -R_BOND, 0],  // 轴向 2 (Bottom)
    [R_BOND, 0, 0],   // 赤道 1 (Eq1)
    [-R_BOND * 0.5, 0, R_BOND * Math.sin(Math.PI * 2 / 3)],  // 赤道 2 (Eq2)
    [-R_BOND * 0.5, 0, -R_BOND * Math.sin(Math.PI * 2 / 3)], // 赤道 3 (Eq3)
  ] as [number, number, number][],

  // 正八面体 (6对): [轴向上, 轴向下, X+, X-, Z+, Z-]
  octahedral: [
    [0, R_BOND, 0],   // 0: Y+ (Top)
    [0, -R_BOND, 0],  // 1: Y- (Bottom)
    [R_BOND, 0, 0],   // 2: X+
    [-R_BOND, 0, 0],  // 3: X-
    [0, 0, R_BOND],   // 4: Z+
    [0, 0, -R_BOND],  // 5: Z-
  ] as [number, number, number][],
}

/** 生成精准多面体虚线框架边（过滤穿透中心原子的对角线，呈现真实的几何外骨架） */
function generatePolyEdgesByIndices(
  vertices: [number, number, number][],
  indexPairs: Array<[number, number]>
): Array<[[number, number, number], [number, number, number]]> {
  return indexPairs.map(([i, j]) => [vertices[i], vertices[j]])
}

const POLY_EDGES = {
  linear: generatePolyEdgesByIndices(GEOMETRY_VERTICES.linear, [[0, 1]]),
  trigonalPlanar: generatePolyEdgesByIndices(GEOMETRY_VERTICES.trigonalPlanar, [[0, 1], [1, 2], [2, 0]]),
  tetrahedral: generatePolyEdgesByIndices(GEOMETRY_VERTICES.tetrahedral, [
    [0, 1], [0, 2], [0, 3],
    [1, 2], [2, 3], [3, 1],
  ]),
  // 9 条外骨架边（去除穿过中心的 0-1 轴向连线）
  trigonalBipyramidal: generatePolyEdgesByIndices(GEOMETRY_VERTICES.trigonalBipyramidal, [
    [0, 2], [0, 3], [0, 4], // 轴上到赤道
    [1, 2], [1, 3], [1, 4], // 轴下到赤道
    [2, 3], [3, 4], [4, 2], // 赤道三角形
  ]),
  // 12 条正八面体外骨架边（去除贯穿中心的 0-1 Y轴、2-3 X轴、4-5 Z轴 对角交叉线）
  octahedral: generatePolyEdgesByIndices(GEOMETRY_VERTICES.octahedral, [
    [0, 2], [0, 3], [0, 4], [0, 5], // 轴上顶点到赤道4顶点
    [1, 2], [1, 3], [1, 4], [1, 5], // 轴下顶点到赤道4顶点
    [2, 4], [4, 3], [3, 5], [5, 2], // 赤道正方形4条边
  ]),
}

export const VSEPR_PRESETS: Record<string, VseprMolecule> = {
  // ================= 1. 价电子对数 = 2 (sp杂化, 直线形) =================
  co2: {
    id: 'co2',
    name: '二氧化碳',
    formula: 'CO₂',
    centralElement: 'C',
    ligandElement: 'O',
    charge: 0,
    centralValence: 4,
    ligandCount: 2,
    ligandValence: 2,
    lonePairCount: 0,
    totalPairs: 2,
    electronGeometry: '直线形',
    molecularGeometry: '直线形',
    hybridization: 'sp',
    bondAngleText: '180°',
    description: 'CO₂ 中心 C 原子无孤电子对 (n=0)，2个σ键呈 180° 直线分布',
    centralColor: '#475569',
    ligandColor: '#ef4444',
    ligands: [
      { pos: GEOMETRY_VERTICES.linear[0], label: 'O' },
      { pos: GEOMETRY_VERTICES.linear[1], label: 'O' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.linear,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.linear[0], p2: GEOMETRY_VERTICES.linear[1], angleText: '180°' },
    ],
  },

  no2_plus: {
    id: 'no2_plus',
    name: '硝酰阳离子',
    formula: 'NO₂⁺',
    centralElement: 'N',
    ligandElement: 'O',
    charge: 1,
    centralValence: 5,
    ligandCount: 2,
    ligandValence: 2,
    lonePairCount: 0,
    totalPairs: 2,
    electronGeometry: '直线形',
    molecularGeometry: '直线形',
    hybridization: 'sp',
    bondAngleText: '180°',
    description: 'NO₂⁺ 阳离子带 +1 电荷，n=(5-1-2×2)/2=0，呈现对称直线形',
    centralColor: '#3b82f6',
    ligandColor: '#ef4444',
    ligands: [
      { pos: GEOMETRY_VERTICES.linear[0], label: 'O' },
      { pos: GEOMETRY_VERTICES.linear[1], label: 'O' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.linear,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.linear[0], p2: GEOMETRY_VERTICES.linear[1], angleText: '180°' },
    ],
  },

  // ================= 2. 价电子对数 = 3 (sp²杂化, 平面三角形) =================
  bf3: {
    id: 'bf3',
    name: '三氟化硼',
    formula: 'BF₃',
    centralElement: 'B',
    ligandElement: 'F',
    charge: 0,
    centralValence: 3,
    ligandCount: 3,
    ligandValence: 1,
    lonePairCount: 0,
    totalPairs: 3,
    electronGeometry: '平面三角形',
    molecularGeometry: '平面三角形',
    hybridization: 'sp²',
    bondAngleText: '120°',
    description: 'BF₃ 中心 B 原子价电子数 3，无孤电子对，3个 B-F 键平面 120° 平分',
    centralColor: '#10b981',
    ligandColor: '#06b6d4',
    ligands: [
      { pos: GEOMETRY_VERTICES.trigonalPlanar[0], label: 'F' },
      { pos: GEOMETRY_VERTICES.trigonalPlanar[1], label: 'F' },
      { pos: GEOMETRY_VERTICES.trigonalPlanar[2], label: 'F' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.trigonalPlanar,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.trigonalPlanar[0], p2: GEOMETRY_VERTICES.trigonalPlanar[1], angleText: '120°' },
      { p1: GEOMETRY_VERTICES.trigonalPlanar[1], p2: GEOMETRY_VERTICES.trigonalPlanar[2], angleText: '120°' },
    ],
  },

  so3: {
    id: 'so3',
    name: '三氧化硫',
    formula: 'SO₃',
    centralElement: 'S',
    ligandElement: 'O',
    charge: 0,
    centralValence: 6,
    ligandCount: 3,
    ligandValence: 2,
    lonePairCount: 0,
    totalPairs: 3,
    electronGeometry: '平面三角形',
    molecularGeometry: '平面三角形',
    hybridization: 'sp²',
    bondAngleText: '120°',
    description: 'SO₃ 中心 S 原子 n=(6-3×2)/2=0，3个 S-O 键呈对称平面三角形 (键角120°)，与 SO₂ (V形) 形成高考经典对比',
    centralColor: '#eab308',
    ligandColor: '#ef4444',
    ligands: [
      { pos: GEOMETRY_VERTICES.trigonalPlanar[0], label: 'O' },
      { pos: GEOMETRY_VERTICES.trigonalPlanar[1], label: 'O' },
      { pos: GEOMETRY_VERTICES.trigonalPlanar[2], label: 'O' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.trigonalPlanar,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.trigonalPlanar[0], p2: GEOMETRY_VERTICES.trigonalPlanar[1], angleText: '120°' },
      { p1: GEOMETRY_VERTICES.trigonalPlanar[1], p2: GEOMETRY_VERTICES.trigonalPlanar[2], angleText: '120°' },
    ],
  },

  co3_2minus: {
    id: 'co3_2minus',
    name: '碳酸根离子',
    formula: 'CO₃²⁻',
    centralElement: 'C',
    ligandElement: 'O',
    charge: -2,
    centralValence: 4,
    ligandCount: 3,
    ligandValence: 2,
    lonePairCount: 0,
    totalPairs: 3,
    electronGeometry: '平面三角形',
    molecularGeometry: '平面三角形',
    hybridization: 'sp²',
    bondAngleText: '120°',
    description: 'CO₃²⁻ 带 -2 电荷，n=(4-(-2)-3×2)/2=0，无孤电子对，呈平面三角形结构',
    centralColor: '#475569',
    ligandColor: '#ef4444',
    ligands: [
      { pos: GEOMETRY_VERTICES.trigonalPlanar[0], label: 'O' },
      { pos: GEOMETRY_VERTICES.trigonalPlanar[1], label: 'O' },
      { pos: GEOMETRY_VERTICES.trigonalPlanar[2], label: 'O' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.trigonalPlanar,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.trigonalPlanar[0], p2: GEOMETRY_VERTICES.trigonalPlanar[1], angleText: '120°' },
      { p1: GEOMETRY_VERTICES.trigonalPlanar[1], p2: GEOMETRY_VERTICES.trigonalPlanar[2], angleText: '120°' },
    ],
  },

  no3_minus: {
    id: 'no3_minus',
    name: '硝酸根离子',
    formula: 'NO₃⁻',
    centralElement: 'N',
    ligandElement: 'O',
    charge: -1,
    centralValence: 5,
    ligandCount: 3,
    ligandValence: 2,
    lonePairCount: 0,
    totalPairs: 3,
    electronGeometry: '平面三角形',
    molecularGeometry: '平面三角形',
    hybridization: 'sp²',
    bondAngleText: '120°',
    description: 'NO₃⁻ 阴离子带 -1 电荷，n=(5-(-1)-3×2)/2=0，无孤电子对，呈平面三角形结构',
    centralColor: '#3b82f6',
    ligandColor: '#ef4444',
    ligands: [
      { pos: GEOMETRY_VERTICES.trigonalPlanar[0], label: 'O' },
      { pos: GEOMETRY_VERTICES.trigonalPlanar[1], label: 'O' },
      { pos: GEOMETRY_VERTICES.trigonalPlanar[2], label: 'O' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.trigonalPlanar,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.trigonalPlanar[0], p2: GEOMETRY_VERTICES.trigonalPlanar[1], angleText: '120°' },
      { p1: GEOMETRY_VERTICES.trigonalPlanar[1], p2: GEOMETRY_VERTICES.trigonalPlanar[2], angleText: '120°' },
    ],
  },

  so2: {
    id: 'so2',
    name: '二氧化硫',
    formula: 'SO₂',
    centralElement: 'S',
    ligandElement: 'O',
    charge: 0,
    centralValence: 6,
    ligandCount: 2,
    ligandValence: 2,
    lonePairCount: 1,
    totalPairs: 3,
    electronGeometry: '平面三角形',
    molecularGeometry: 'V形 (折线形)',
    hybridization: 'sp²',
    bondAngleText: '119°',
    description: 'SO₂ 电子对为平面三角形，含 1 对孤电子对 (n=1)，孤对排斥使键角略小于 120°',
    centralColor: '#eab308',
    ligandColor: '#ef4444',
    ligands: [
      { pos: GEOMETRY_VERTICES.trigonalPlanar[1], label: 'O' },
      { pos: GEOMETRY_VERTICES.trigonalPlanar[2], label: 'O' },
    ],
    lonePairs: [
      { pos: normalize(GEOMETRY_VERTICES.trigonalPlanar[0], R_BOND * 0.9), label: 'Lone Pair' },
    ],
    polyEdges: POLY_EDGES.trigonalPlanar,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.trigonalPlanar[1], p2: GEOMETRY_VERTICES.trigonalPlanar[2], angleText: '119°' },
    ],
  },

  no2_minus: {
    id: 'no2_minus',
    name: '亚硝酸根离子',
    formula: 'NO₂⁻',
    centralElement: 'N',
    ligandElement: 'O',
    charge: -1,
    centralValence: 5,
    ligandCount: 2,
    ligandValence: 2,
    lonePairCount: 1,
    totalPairs: 3,
    electronGeometry: '平面三角形',
    molecularGeometry: 'V形 (折线形)',
    hybridization: 'sp²',
    bondAngleText: '115°',
    description: 'NO₂⁻ 阴离子带 -1 电荷，n=(5-(-1)-2×2)/2=1，含 1 对孤电子对，呈现 V形 构型',
    centralColor: '#3b82f6',
    ligandColor: '#ef4444',
    ligands: [
      { pos: GEOMETRY_VERTICES.trigonalPlanar[1], label: 'O' },
      { pos: GEOMETRY_VERTICES.trigonalPlanar[2], label: 'O' },
    ],
    lonePairs: [
      { pos: normalize(GEOMETRY_VERTICES.trigonalPlanar[0], R_BOND * 0.9), label: 'Lone Pair' },
    ],
    polyEdges: POLY_EDGES.trigonalPlanar,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.trigonalPlanar[1], p2: GEOMETRY_VERTICES.trigonalPlanar[2], angleText: '115°' },
    ],
  },

  // ================= 3. 价电子对数 = 4 (sp³杂化, 正四面体) =================
  ch4: {
    id: 'ch4',
    name: '甲烷',
    formula: 'CH₄',
    centralElement: 'C',
    ligandElement: 'H',
    charge: 0,
    centralValence: 4,
    ligandCount: 4,
    ligandValence: 1,
    lonePairCount: 0,
    totalPairs: 4,
    electronGeometry: '正四面体',
    molecularGeometry: '正四面体',
    hybridization: 'sp³',
    bondAngleText: '109.5°',
    description: 'CH₄ 4个 C-H 键对称指向正四面体顶点，无孤电子对 (n=0)，键角 109.5°',
    centralColor: '#475569',
    ligandColor: '#94a3b8',
    ligands: [
      { pos: GEOMETRY_VERTICES.tetrahedral[0], label: 'H' },
      { pos: GEOMETRY_VERTICES.tetrahedral[1], label: 'H' },
      { pos: GEOMETRY_VERTICES.tetrahedral[2], label: 'H' },
      { pos: GEOMETRY_VERTICES.tetrahedral[3], label: 'H' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.tetrahedral,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.tetrahedral[0], p2: GEOMETRY_VERTICES.tetrahedral[1], angleText: '109.5°' },
      { p1: GEOMETRY_VERTICES.tetrahedral[1], p2: GEOMETRY_VERTICES.tetrahedral[2], angleText: '109.5°' },
    ],
  },

  nh4_plus: {
    id: 'nh4_plus',
    name: '铵根离子',
    formula: 'NH₄⁺',
    centralElement: 'N',
    ligandElement: 'H',
    charge: 1,
    centralValence: 5,
    ligandCount: 4,
    ligandValence: 1,
    lonePairCount: 0,
    totalPairs: 4,
    electronGeometry: '正四面体',
    molecularGeometry: '正四面体',
    hybridization: 'sp³',
    bondAngleText: '109.5°',
    description: 'NH₄⁺ 阳离子带 +1 电荷，n=(5-1-4×1)/2=0，对称正四面体构型，键角 109.5°',
    centralColor: '#3b82f6',
    ligandColor: '#94a3b8',
    ligands: [
      { pos: GEOMETRY_VERTICES.tetrahedral[0], label: 'H' },
      { pos: GEOMETRY_VERTICES.tetrahedral[1], label: 'H' },
      { pos: GEOMETRY_VERTICES.tetrahedral[2], label: 'H' },
      { pos: GEOMETRY_VERTICES.tetrahedral[3], label: 'H' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.tetrahedral,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.tetrahedral[0], p2: GEOMETRY_VERTICES.tetrahedral[1], angleText: '109.5°' },
      { p1: GEOMETRY_VERTICES.tetrahedral[1], p2: GEOMETRY_VERTICES.tetrahedral[2], angleText: '109.5°' },
    ],
  },

  so4_2minus: {
    id: 'so4_2minus',
    name: '硫酸根离子',
    formula: 'SO₄²⁻',
    centralElement: 'S',
    ligandElement: 'O',
    charge: -2,
    centralValence: 6,
    ligandCount: 4,
    ligandValence: 2,
    lonePairCount: 0,
    totalPairs: 4,
    electronGeometry: '正四面体',
    molecularGeometry: '正四面体',
    hybridization: 'sp³',
    bondAngleText: '109.5°',
    description: 'SO₄²⁻ 阴离子带 -2 电荷，n=(6-(-2)-4×2)/2=0，对称正四面体，键角 109.5°',
    centralColor: '#eab308',
    ligandColor: '#ef4444',
    ligands: [
      { pos: GEOMETRY_VERTICES.tetrahedral[0], label: 'O' },
      { pos: GEOMETRY_VERTICES.tetrahedral[1], label: 'O' },
      { pos: GEOMETRY_VERTICES.tetrahedral[2], label: 'O' },
      { pos: GEOMETRY_VERTICES.tetrahedral[3], label: 'O' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.tetrahedral,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.tetrahedral[0], p2: GEOMETRY_VERTICES.tetrahedral[1], angleText: '109.5°' },
      { p1: GEOMETRY_VERTICES.tetrahedral[1], p2: GEOMETRY_VERTICES.tetrahedral[2], angleText: '109.5°' },
    ],
  },

  nh3: {
    id: 'nh3',
    name: '氨气分子',
    formula: 'NH₃',
    centralElement: 'N',
    ligandElement: 'H',
    charge: 0,
    centralValence: 5,
    ligandCount: 3,
    ligandValence: 1,
    lonePairCount: 1,
    totalPairs: 4,
    electronGeometry: '正四面体',
    molecularGeometry: '三角锥形',
    hybridization: 'sp³',
    bondAngleText: '107°',
    description: 'NH₃ 含 1 对孤电子对，孤对-成键电子对排斥大于成键-成键，键角被压缩至 107°',
    centralColor: '#3b82f6',
    ligandColor: '#94a3b8',
    ligands: [
      { pos: GEOMETRY_VERTICES.tetrahedral[1], label: 'H' },
      { pos: GEOMETRY_VERTICES.tetrahedral[2], label: 'H' },
      { pos: GEOMETRY_VERTICES.tetrahedral[3], label: 'H' },
    ],
    lonePairs: [
      { pos: normalize(GEOMETRY_VERTICES.tetrahedral[0], R_BOND * 0.9), label: 'Lone Pair' },
    ],
    polyEdges: POLY_EDGES.tetrahedral,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.tetrahedral[1], p2: GEOMETRY_VERTICES.tetrahedral[2], angleText: '107°' },
    ],
  },

  h3o_plus: {
    id: 'h3o_plus',
    name: '水合氢离子',
    formula: 'H₃O⁺',
    centralElement: 'O',
    ligandElement: 'H',
    charge: 1,
    centralValence: 6,
    ligandCount: 3,
    ligandValence: 1,
    lonePairCount: 1,
    totalPairs: 4,
    electronGeometry: '正四面体',
    molecularGeometry: '三角锥形',
    hybridization: 'sp³',
    bondAngleText: '107°',
    description: 'H₃O⁺ 阳离子带 +1 电荷，n=(6-1-3×1)/2=1，与 NH₃ 互为等电子体，呈三角锥形',
    centralColor: '#ef4444',
    ligandColor: '#94a3b8',
    ligands: [
      { pos: GEOMETRY_VERTICES.tetrahedral[1], label: 'H' },
      { pos: GEOMETRY_VERTICES.tetrahedral[2], label: 'H' },
      { pos: GEOMETRY_VERTICES.tetrahedral[3], label: 'H' },
    ],
    lonePairs: [
      { pos: normalize(GEOMETRY_VERTICES.tetrahedral[0], R_BOND * 0.9), label: 'Lone Pair' },
    ],
    polyEdges: POLY_EDGES.tetrahedral,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.tetrahedral[1], p2: GEOMETRY_VERTICES.tetrahedral[2], angleText: '107°' },
    ],
  },

  so3_2minus: {
    id: 'so3_2minus',
    name: '亚硫酸根离子',
    formula: 'SO₃²⁻',
    centralElement: 'S',
    ligandElement: 'O',
    charge: -2,
    centralValence: 6,
    ligandCount: 3,
    ligandValence: 2,
    lonePairCount: 1,
    totalPairs: 4,
    electronGeometry: '正四面体',
    molecularGeometry: '三角锥形',
    hybridization: 'sp³',
    bondAngleText: '106°',
    description: 'SO₃²⁻ 阴离子带 -2 电荷，n=(6-(-2)-3×2)/2=1，含 1 对孤电子对，呈现三角锥形',
    centralColor: '#eab308',
    ligandColor: '#ef4444',
    ligands: [
      { pos: GEOMETRY_VERTICES.tetrahedral[1], label: 'O' },
      { pos: GEOMETRY_VERTICES.tetrahedral[2], label: 'O' },
      { pos: GEOMETRY_VERTICES.tetrahedral[3], label: 'O' },
    ],
    lonePairs: [
      { pos: normalize(GEOMETRY_VERTICES.tetrahedral[0], R_BOND * 0.9), label: 'Lone Pair' },
    ],
    polyEdges: POLY_EDGES.tetrahedral,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.tetrahedral[1], p2: GEOMETRY_VERTICES.tetrahedral[2], angleText: '106°' },
    ],
  },

  h2o: {
    id: 'h2o',
    name: '水分子',
    formula: 'H₂O',
    centralElement: 'O',
    ligandElement: 'H',
    charge: 0,
    centralValence: 6,
    ligandCount: 2,
    ligandValence: 1,
    lonePairCount: 2,
    totalPairs: 4,
    electronGeometry: '正四面体',
    molecularGeometry: 'V形 (折线形)',
    hybridization: 'sp³',
    bondAngleText: '104.5°',
    description: 'H₂O 含 2 对孤电子对，强烈排斥作用使 H-O-H 键角进一步被压缩至 104.5°',
    centralColor: '#ef4444',
    ligandColor: '#94a3b8',
    ligands: [
      { pos: GEOMETRY_VERTICES.tetrahedral[2], label: 'H' },
      { pos: GEOMETRY_VERTICES.tetrahedral[3], label: 'H' },
    ],
    lonePairs: [
      { pos: normalize(GEOMETRY_VERTICES.tetrahedral[0], R_BOND * 0.9), label: 'Lone Pair 1' },
      { pos: normalize(GEOMETRY_VERTICES.tetrahedral[1], R_BOND * 0.9), label: 'Lone Pair 2' },
    ],
    polyEdges: POLY_EDGES.tetrahedral,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.tetrahedral[2], p2: GEOMETRY_VERTICES.tetrahedral[3], angleText: '104.5°' },
    ],
  },

  // ================= 4. 价电子对数 = 5 (sp³d杂化, 三角双锥) =================
  pcl5: {
    id: 'pcl5',
    name: '五氯化磷',
    formula: 'PCl₅',
    centralElement: 'P',
    ligandElement: 'Cl',
    charge: 0,
    centralValence: 5,
    ligandCount: 5,
    ligandValence: 1,
    lonePairCount: 0,
    totalPairs: 5,
    electronGeometry: '三角双锥',
    molecularGeometry: '三角双锥',
    hybridization: 'sp³d',
    bondAngleText: '90°, 120°',
    description: 'PCl₅ 5对电子呈三角双锥分布：2个轴向 Cl (90°)，3个赤道 Cl (120°)',
    centralColor: '#f97316',
    ligandColor: '#22c55e',
    ligands: [
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[0], label: 'Cl (轴)' },
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[1], label: 'Cl (轴)' },
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[2], label: 'Cl (赤)' },
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[3], label: 'Cl (赤)' },
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[4], label: 'Cl (赤)' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.trigonalBipyramidal,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.trigonalBipyramidal[0], p2: GEOMETRY_VERTICES.trigonalBipyramidal[2], angleText: '90°' },
      { p1: GEOMETRY_VERTICES.trigonalBipyramidal[2], p2: GEOMETRY_VERTICES.trigonalBipyramidal[3], angleText: '120°' },
    ],
  },

  sf4: {
    id: 'sf4',
    name: '四氟化硫',
    formula: 'SF₄',
    centralElement: 'S',
    ligandElement: 'F',
    charge: 0,
    centralValence: 6,
    ligandCount: 4,
    ligandValence: 1,
    lonePairCount: 1,
    totalPairs: 5,
    electronGeometry: '三角双锥',
    molecularGeometry: '跷跷板形',
    hybridization: 'sp³d',
    bondAngleText: '89°, 117°',
    description: 'SF₄ 孤电子对优先选择空间更广阔的赤道面，形成跷跷板形结构',
    centralColor: '#eab308',
    ligandColor: '#06b6d4',
    ligands: [
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[0], label: 'F (轴)' },
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[1], label: 'F (轴)' },
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[3], label: 'F (赤)' },
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[4], label: 'F (赤)' },
    ],
    lonePairs: [
      { pos: normalize(GEOMETRY_VERTICES.trigonalBipyramidal[2], R_BOND * 0.9), label: 'Lone Pair' },
    ],
    polyEdges: POLY_EDGES.trigonalBipyramidal,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.trigonalBipyramidal[0], p2: GEOMETRY_VERTICES.trigonalBipyramidal[3], angleText: '89°' },
      { p1: GEOMETRY_VERTICES.trigonalBipyramidal[3], p2: GEOMETRY_VERTICES.trigonalBipyramidal[4], angleText: '117°' },
    ],
  },

  clf3: {
    id: 'clf3',
    name: '三氟化氯',
    formula: 'ClF₃',
    centralElement: 'Cl',
    ligandElement: 'F',
    charge: 0,
    centralValence: 7,
    ligandCount: 3,
    ligandValence: 1,
    lonePairCount: 2,
    totalPairs: 5,
    electronGeometry: '三角双锥',
    molecularGeometry: 'T形',
    hybridization: 'sp³d',
    bondAngleText: '87.5°',
    description: 'ClF₃ 2对孤电子对均占据赤道面，余下3个F形成 T形 构型',
    centralColor: '#22c55e',
    ligandColor: '#06b6d4',
    ligands: [
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[0], label: 'F (轴)' },
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[1], label: 'F (轴)' },
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[2], label: 'F (赤)' },
    ],
    lonePairs: [
      { pos: normalize(GEOMETRY_VERTICES.trigonalBipyramidal[3], R_BOND * 0.9), label: 'Lone Pair 1' },
      { pos: normalize(GEOMETRY_VERTICES.trigonalBipyramidal[4], R_BOND * 0.9), label: 'Lone Pair 2' },
    ],
    polyEdges: POLY_EDGES.trigonalBipyramidal,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.trigonalBipyramidal[0], p2: GEOMETRY_VERTICES.trigonalBipyramidal[2], angleText: '87.5°' },
    ],
  },

  xef2: {
    id: 'xef2',
    name: '二氟化氙',
    formula: 'XeF₂',
    centralElement: 'Xe',
    ligandElement: 'F',
    charge: 0,
    centralValence: 8,
    ligandCount: 2,
    ligandValence: 1,
    lonePairCount: 3,
    totalPairs: 5,
    electronGeometry: '三角双锥',
    molecularGeometry: '直线形',
    hybridization: 'sp³d',
    bondAngleText: '180°',
    description: 'XeF₂ 3对孤电子对占满赤道面，2个 F 占据两端轴向，分子呈现 180° 直线形',
    centralColor: '#a855f7',
    ligandColor: '#06b6d4',
    ligands: [
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[0], label: 'F (轴)' },
      { pos: GEOMETRY_VERTICES.trigonalBipyramidal[1], label: 'F (轴)' },
    ],
    lonePairs: [
      { pos: normalize(GEOMETRY_VERTICES.trigonalBipyramidal[2], R_BOND * 0.9), label: 'Lone Pair 1' },
      { pos: normalize(GEOMETRY_VERTICES.trigonalBipyramidal[3], R_BOND * 0.9), label: 'Lone Pair 2' },
      { pos: normalize(GEOMETRY_VERTICES.trigonalBipyramidal[4], R_BOND * 0.9), label: 'Lone Pair 3' },
    ],
    polyEdges: POLY_EDGES.trigonalBipyramidal,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.trigonalBipyramidal[0], p2: GEOMETRY_VERTICES.trigonalBipyramidal[1], angleText: '180°' },
    ],
  },

  // ================= 5. 价电子对数 = 6 (sp³d²杂化, 正八面体) =================
  sf6: {
    id: 'sf6',
    name: '六氟化硫',
    formula: 'SF₆',
    centralElement: 'S',
    ligandElement: 'F',
    charge: 0,
    centralValence: 6,
    ligandCount: 6,
    ligandValence: 1,
    lonePairCount: 0,
    totalPairs: 6,
    electronGeometry: '正八面体',
    molecularGeometry: '正八面体',
    hybridization: 'sp³d²',
    bondAngleText: '90°',
    description: 'SF₆ 6个 S-F 键完美高度对称指向正八面体 6 个顶点，键角均为 90°',
    centralColor: '#eab308',
    ligandColor: '#06b6d4',
    ligands: [
      { pos: GEOMETRY_VERTICES.octahedral[0], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[1], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[2], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[3], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[4], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[5], label: 'F' },
    ],
    lonePairs: [],
    polyEdges: POLY_EDGES.octahedral,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.octahedral[0], p2: GEOMETRY_VERTICES.octahedral[2], angleText: '90°' },
      { p1: GEOMETRY_VERTICES.octahedral[2], p2: GEOMETRY_VERTICES.octahedral[4], angleText: '90°' },
    ],
  },

  xef4: {
    id: 'xef4',
    name: '四氟化氙',
    formula: 'XeF₄',
    centralElement: 'Xe',
    ligandElement: 'F',
    charge: 0,
    centralValence: 8,
    ligandCount: 4,
    ligandValence: 1,
    lonePairCount: 2,
    totalPairs: 6,
    electronGeometry: '正八面体',
    molecularGeometry: '平面正方形',
    hybridization: 'sp³d²',
    bondAngleText: '90°',
    description: 'XeF₄ 2对孤电子对相互排斥处于八面体对位(上下轴向)，4个F形成平面正方形',
    centralColor: '#a855f7',
    ligandColor: '#06b6d4',
    ligands: [
      { pos: GEOMETRY_VERTICES.octahedral[2], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[3], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[4], label: 'F' },
      { pos: GEOMETRY_VERTICES.octahedral[5], label: 'F' },
    ],
    lonePairs: [
      { pos: normalize(GEOMETRY_VERTICES.octahedral[0], R_BOND * 0.9), label: 'Lone Pair 1' },
      { pos: normalize(GEOMETRY_VERTICES.octahedral[1], R_BOND * 0.9), label: 'Lone Pair 2' },
    ],
    polyEdges: POLY_EDGES.octahedral,
    bondAngles: [
      { p1: GEOMETRY_VERTICES.octahedral[2], p2: GEOMETRY_VERTICES.octahedral[4], angleText: '90°' },
    ],
  },
}
