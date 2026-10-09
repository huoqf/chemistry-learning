import { ATOM_COLORS } from '@/theme'

export interface HybridVector {
  dir: [number, number, number]
  type: 'hybrid' | 'unhybridizedP' | 'lonePair'
  label?: string
}

export interface LigandBond {
  pos: [number, number, number]
  element: string
  color: string
  bondType: 'sigma' | 'pi'
  /**
   * 该配体通过 σ 键连接的中心原子在 `centers` 中的下标（默认 0）。
   * 多中心分子（C₂H₄ / C₂H₂）必须显式给出：否则场景会把所有 σ 键都从
   * 第 1 个 C 起画，属于第 2 个 C 的 H 会连出一条穿过 C–C 键的长线。
   */
  connectedCenterIdx?: number
}

export interface CenterAtom {
  element: string
  color: string
  pos: [number, number, number]
  hybridOrbitals: HybridVector[]
}

export interface HybridModelData {
  id: string
  name: string
  formula: string
  hybridType: 'sp' | 'sp2' | 'sp3'
  bondAngle: number
  centers: CenterAtom[]
  ligands: LigandBond[]
  piBonds?: {
    startPos: [number, number, number]
    endPos: [number, number, number]
    dir: [number, number, number]
  }[]
  description: string
}

const SQ3_3 = 1 / Math.sqrt(3)

// ── 水分子 H₂O 的 sp³ 取向参数（P2-11 修复）──
// 原数据把 4 个 sp³ 方向都写在 z = 0 平面上，成了「平面四配位」：
// 孤对–孤对只有 79.6°、孤对–成键轨道甚至达到 166.2°（几乎反向共线），
// 与 sp³ 应有的一致夹角完全不符。
//
// 正确取向由水的 C2v 对称性决定：两对孤对必须位于与 H–O–H 平面
// **垂直**的平面内，并关于 +y 轴对称（C2 轴），因此孤对方向含 z 分量。
//
// 角度按 VSEPR 排斥次序取值（孤对–孤对 > 孤对–成键 > 成键–成键）：
//   H–O–H = 104.5°（页面声明值，配体与杂化轨道方向严格共线）
//   孤对–成键 = 109.47°（理想四面体角，cos = 1/3）→ 反解孤对倾角
//   孤对–孤对 = 2 × 56.98° ≈ 114.0°（最大，体现孤对排斥最强）
const H2O_HALF_BOND_ANGLE = ((104.5 / 2) * Math.PI) / 180
const H2O_ORBITAL_LEN = 1.2
const H2O_BOND_LEN = 1.79
/** 孤对方向相对 +y 轴的倾角：由 cos(倾角) = (1/3) / cos(半键角) 反解 */
const H2O_LONE_PAIR_TILT = Math.acos(1 / 3 / Math.cos(H2O_HALF_BOND_ANGLE))
const H2O_LONE_PAIR_SIN = Math.sin(H2O_LONE_PAIR_TILT)
const H2O_LONE_PAIR_COS = Math.cos(H2O_LONE_PAIR_TILT)
const H2O_BOND_SIN = Math.sin(H2O_HALF_BOND_ANGLE)
const H2O_BOND_COS = Math.cos(H2O_HALF_BOND_ANGLE)

// ── 向量工具（NH₃ / SO₂ 取向由角度反解，避免手写一长串不一致的坐标）──
const scaleDir = (
  d: readonly [number, number, number],
  k: number
): [number, number, number] => [d[0] * k, d[1] * k, d[2] * k]
const addVec = (
  a: readonly [number, number, number],
  b: readonly [number, number, number]
): [number, number, number] => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]

// ── 氨分子 NH₃ 的 sp³ 取向（C3v）──
// 原数据把 3 条 N–H 画成 125.57° / 101.49° / 101.49° 的严重畸变三角锥，
// 与声明的 107.3° 完全不符；3 条 N–H 键长也互不相等（1.929 / 1.929 / 1.879）。
//
// NH₃ 是严格 C3v 分子：3 个 N–H 关于 C3 轴对称，孤对落在 C3 轴上。设「键–轴夹角」
// 为 β（孤对在轴上，故 β 同时就是孤对–成键角），则
//     cos(H–N–H) = cos²β − ½ sin²β   ⟹   cos²β = (1 + 2·cos(H–N–H)) / 3
// 取 θ = 107.3° → β ≈ 111.56°。因为孤对排斥最强，β 必然 > θ，
// VSEPR 的「孤对–成键 > 成键–成键」次序自动成立。
const NH3_HNH_ANGLE = (107.3 * Math.PI) / 180
const NH3_AXIS_COS = -Math.sqrt((1 + 2 * Math.cos(NH3_HNH_ANGLE)) / 3)
const NH3_AXIS_SIN = Math.sqrt(1 - NH3_AXIS_COS * NH3_AXIS_COS)
const NH3_CENTER: [number, number, number] = [0, 0.15, 0]
const NH3_ORBITAL_LEN = 1.2
const NH3_BOND_LEN = 1.75
/** 3 条 N–H 的方位角（互差 120°；取 30/150/270 使 2 个 H 朝前、1 个朝后） */
const NH3_UNIT_DIRS: readonly [number, number, number][] = [30, 150, 270].map((deg) => {
  const phi = (deg * Math.PI) / 180
  return [
    NH3_AXIS_SIN * Math.cos(phi),
    NH3_AXIS_COS,
    NH3_AXIS_SIN * Math.sin(phi),
  ] as [number, number, number]
})

// ── 二氧化硫 SO₂ 的 sp² 取向 ──
// 原数据把孤对写在 +y、2 个成键轨道写在 ±(1.08, −0.6, 0)，结果
//   孤对–成键 = 119.05°  <  成键–成键 = 121.89°
// ——与「孤对排斥更强、把成键压得更紧」的 VSEPR 结论正好反了；
// 配体的 O–S–O 也只有 118.60°，且 σ 键偏离杂化轨道 1.645°。
//
// 正确取法：3 个 sp² 方向共面两两 120°，其中 1 个被孤对占据。孤对排斥更强，
// 于是 2 个成键被压到 θ = 119.5°，孤对–成键相应张到 180° − θ/2 = 120.25° > θ。
const SO2_OSO_ANGLE = (119.5 * Math.PI) / 180
const SO2_HALF_OSO = SO2_OSO_ANGLE / 2
const SO2_AXIS_SIN = Math.sin(SO2_HALF_OSO)
const SO2_AXIS_COS = Math.cos(SO2_HALF_OSO)
const SO2_CENTER: [number, number, number] = [0, 0.1, 0]
const SO2_ORBITAL_LEN = 1.2
const SO2_BOND_LEN = 1.85
/** 2 个 S–O σ 方向：关于 −y 轴对称（孤对沿 +y） */
const SO2_UNIT_DIRS: readonly [number, number, number][] = [
  [SO2_AXIS_SIN, -SO2_AXIS_COS, 0],
  [-SO2_AXIS_SIN, -SO2_AXIS_COS, 0],
]

export const HYBRID_MODELS: Record<string, HybridModelData> = {
  becl2: {
    id: 'becl2',
    name: '氯化铍 BeCl₂',
    formula: 'BeCl₂',
    hybridType: 'sp',
    bondAngle: 180,
    centers: [
      {
        element: 'Be',
        color: ATOM_COLORS.Be,
        pos: [0, 0, 0],
        hybridOrbitals: [
          { dir: [1.2, 0, 0], type: 'hybrid' },
          { dir: [-1.2, 0, 0], type: 'hybrid' },
          { dir: [0, 1.2, 0], type: 'unhybridizedP' },
          { dir: [0, 0, 1.2], type: 'unhybridizedP' },
        ],
      },
    ],
    ligands: [
      { pos: [1.8, 0, 0], element: 'Cl', color: ATOM_COLORS.Cl, bondType: 'sigma' },
      { pos: [-1.8, 0, 0], element: 'Cl', color: ATOM_COLORS.Cl, bondType: 'sigma' },
    ],
    description: 'Be 原子采取 sp 杂化，形成 2 个 180° 对角 sp 杂化轨道。',
  },

  co2: {
    id: 'co2',
    name: '二氧化碳 CO₂',
    formula: 'O=C=O',
    hybridType: 'sp',
    bondAngle: 180,
    centers: [
      {
        element: 'C',
        color: ATOM_COLORS.C,
        pos: [0, 0, 0],
        hybridOrbitals: [
          { dir: [1.2, 0, 0], type: 'hybrid' },
          { dir: [-1.2, 0, 0], type: 'hybrid' },
          { dir: [0, 1.2, 0], type: 'unhybridizedP' },
          { dir: [0, 0, 1.2], type: 'unhybridizedP' },
        ],
      },
    ],
    ligands: [
      { pos: [1.7, 0, 0], element: 'O', color: ATOM_COLORS.O, bondType: 'sigma' },
      { pos: [-1.7, 0, 0], element: 'O', color: ATOM_COLORS.O, bondType: 'sigma' },
    ],
    piBonds: [
      { startPos: [0, 0, 0], endPos: [1.7, 0, 0], dir: [0, 0.9, 0] },
      { startPos: [0, 0, 0], endPos: [-1.7, 0, 0], dir: [0, 0, 0.9] },
    ],
    description: 'C 原子采取 sp 杂化形成 2 个 σ 键；未杂化的 py, pz 轨道与两侧 O 原子的 p 轨道肩并肩重叠形成 2 个 π 键。',
  },

  c2h2: {
    id: 'c2h2',
    name: '乙炔 C₂H₂',
    formula: 'H-C≡C-H',
    hybridType: 'sp',
    bondAngle: 180,
    centers: [
      {
        element: 'C',
        color: ATOM_COLORS.C,
        pos: [-0.8, 0, 0],
        hybridOrbitals: [
          { dir: [1.1, 0, 0], type: 'hybrid' },
          { dir: [-1.1, 0, 0], type: 'hybrid' },
          { dir: [0, 1.1, 0], type: 'unhybridizedP' },
          { dir: [0, 0, 1.1], type: 'unhybridizedP' },
        ],
      },
      {
        element: 'C',
        color: ATOM_COLORS.C,
        pos: [0.8, 0, 0],
        hybridOrbitals: [
          { dir: [-1.1, 0, 0], type: 'hybrid' },
          { dir: [1.1, 0, 0], type: 'hybrid' },
          { dir: [0, 1.1, 0], type: 'unhybridizedP' },
          { dir: [0, 0, 1.1], type: 'unhybridizedP' },
        ],
      },
    ],
    ligands: [
      { pos: [-2.1, 0, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma', connectedCenterIdx: 0 },
      { pos: [2.1, 0, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma', connectedCenterIdx: 1 },
    ],
    piBonds: [
      { startPos: [-0.8, 0, 0], endPos: [0.8, 0, 0], dir: [0, 1.0, 0] },
      { startPos: [-0.8, 0, 0], endPos: [0.8, 0, 0], dir: [0, 0, 1.0] },
    ],
    description: 'C 原子 sp 杂化：两个 C 轨道“头碰头”形成 C-C σ 键，未杂化 py/pz 轨分别形成 2 个相互垂直的 π 键。',
  },

  bf3: {
    id: 'bf3',
    name: '三氟化硼 BF₃',
    formula: 'BF₃',
    hybridType: 'sp2',
    bondAngle: 120,
    centers: [
      {
        element: 'B',
        color: ATOM_COLORS.B,
        pos: [0, 0, 0],
        hybridOrbitals: [
          { dir: [0, 1.25, 0], type: 'hybrid' },
          { dir: [1.0825, -0.625, 0], type: 'hybrid' },
          { dir: [-1.0825, -0.625, 0], type: 'hybrid' },
          { dir: [0, 0, 1.25], type: 'unhybridizedP' },
        ],
      },
    ],
    ligands: [
      { pos: [0, 1.85, 0], element: 'F', color: ATOM_COLORS.F, bondType: 'sigma' },
      { pos: [1.602, -0.925, 0], element: 'F', color: ATOM_COLORS.F, bondType: 'sigma' },
      { pos: [-1.602, -0.925, 0], element: 'F', color: ATOM_COLORS.F, bondType: 'sigma' },
    ],
    description: 'B 原子采取 sp² 杂化，3 个 sp² 杂化轨道平面等角度 120° 分布。',
  },

  so2: {
    id: 'so2',
    name: '二氧化硫 SO₂',
    formula: 'SO₂',
    hybridType: 'sp2',
    bondAngle: 119.5,
    centers: [
      {
        element: 'S',
        color: ATOM_COLORS.S,
        pos: SO2_CENTER,
        hybridOrbitals: [
          // 孤对沿 +y，排斥最强 → 与成键轨道成 120.25°（> 成键–成键 119.5°）
          { dir: [0, SO2_ORBITAL_LEN, 0], type: 'lonePair' },
          { dir: scaleDir(SO2_UNIT_DIRS[0], SO2_ORBITAL_LEN), type: 'hybrid' },
          { dir: scaleDir(SO2_UNIT_DIRS[1], SO2_ORBITAL_LEN), type: 'hybrid' },
          // 未杂化 p 垂直于分子平面，用于与 O 形成 π 键
          { dir: [0, 0, SO2_ORBITAL_LEN], type: 'unhybridizedP' },
        ],
      },
    ],
    ligands: [
      {
        pos: addVec(SO2_CENTER, scaleDir(SO2_UNIT_DIRS[0], SO2_BOND_LEN)),
        element: 'O',
        color: ATOM_COLORS.O,
        bondType: 'sigma',
      },
      {
        pos: addVec(SO2_CENTER, scaleDir(SO2_UNIT_DIRS[1], SO2_BOND_LEN)),
        element: 'O',
        color: ATOM_COLORS.O,
        bondType: 'sigma',
      },
    ],
    piBonds: [
      // SO₂ 的两个 S=O 都是双键（O=S=O），故必须各画一条 π 键。
      // 两条 π 都来自 S 的同一个未杂化 p（垂直于分子平面），因此方向一致；
      // 原数据只写了 1 条，等价于把右侧画成 S=O、左侧画成 S–O。
      {
        startPos: SO2_CENTER,
        endPos: addVec(SO2_CENTER, scaleDir(SO2_UNIT_DIRS[0], SO2_BOND_LEN)),
        dir: [0, 0, 0.9],
      },
      {
        startPos: SO2_CENTER,
        endPos: addVec(SO2_CENTER, scaleDir(SO2_UNIT_DIRS[1], SO2_BOND_LEN)),
        dir: [0, 0, 0.9],
      },
    ],
    description: 'S 原子采取 sp² 杂化，1 对孤电子对占据 1 个 sp² 轨道，使分子呈现 V 形 (键角约 119.5°)。',
  },

  c2h4: {
    id: 'c2h4',
    name: '乙烯 C₂H₄',
    formula: 'CH₂=CH₂',
    hybridType: 'sp2',
    bondAngle: 120,
    centers: [
      {
        element: 'C',
        color: ATOM_COLORS.C,
        pos: [-0.8, 0, 0],
        hybridOrbitals: [
          { dir: [1.1, 0, 0], type: 'hybrid' },
          { dir: [-0.55, 0.9526, 0], type: 'hybrid' },
          { dir: [-0.55, -0.9526, 0], type: 'hybrid' },
          { dir: [0, 0, 1.1], type: 'unhybridizedP' },
        ],
      },
      {
        element: 'C',
        color: ATOM_COLORS.C,
        pos: [0.8, 0, 0],
        hybridOrbitals: [
          { dir: [-1.1, 0, 0], type: 'hybrid' },
          { dir: [0.55, 0.9526, 0], type: 'hybrid' },
          { dir: [0.55, -0.9526, 0], type: 'hybrid' },
          { dir: [0, 0, 1.1], type: 'unhybridizedP' },
        ],
      },
    ],
    ligands: [
      { pos: [-1.7, 1.55, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma', connectedCenterIdx: 0 },
      { pos: [-1.7, -1.55, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma', connectedCenterIdx: 0 },
      { pos: [1.7, 1.55, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma', connectedCenterIdx: 1 },
      { pos: [1.7, -1.55, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma', connectedCenterIdx: 1 },
    ],
    piBonds: [
      { startPos: [-0.8, 0, 0], endPos: [0.8, 0, 0], dir: [0, 0, 1.0] },
    ],
    description: 'C 原子 sp² 杂化：平面内形成 3 个 σ 键，垂直于分子的未杂化 pz 轨道平行重叠形成 1 个 π 键。',
  },

  co3: {
    id: 'co3',
    name: '碳酸根 CO₃²⁻',
    formula: 'CO₃²⁻',
    hybridType: 'sp2',
    bondAngle: 120,
    centers: [
      {
        element: 'C',
        color: ATOM_COLORS.C,
        pos: [0, 0, 0],
        hybridOrbitals: [
          { dir: [0, 1.25, 0], type: 'hybrid' },
          { dir: [1.0825, -0.625, 0], type: 'hybrid' },
          { dir: [-1.0825, -0.625, 0], type: 'hybrid' },
          { dir: [0, 0, 1.25], type: 'unhybridizedP' },
        ],
      },
    ],
    ligands: [
      { pos: [0, 1.8, 0], element: 'O', color: ATOM_COLORS.O, bondType: 'sigma' },
      { pos: [1.56, -0.9, 0], element: 'O', color: ATOM_COLORS.O, bondType: 'sigma' },
      { pos: [-1.56, -0.9, 0], element: 'O', color: ATOM_COLORS.O, bondType: 'sigma' },
    ],
    description: '中心 C 原子采取 sp² 杂化，形成 3 个 C-O σ 键，垂直于平面的 p 轨道与 3 个 O 原子形成大 π 键。',
  },

  ch4: {
    id: 'ch4',
    name: '甲烷 CH₄',
    formula: 'CH₄',
    hybridType: 'sp3',
    bondAngle: 109.5,
    centers: [
      {
        element: 'C',
        color: ATOM_COLORS.C,
        pos: [0, 0, 0],
        hybridOrbitals: [
          { dir: [1.2 * SQ3_3, 1.2 * SQ3_3, 1.2 * SQ3_3], type: 'hybrid' },
          { dir: [-1.2 * SQ3_3, -1.2 * SQ3_3, 1.2 * SQ3_3], type: 'hybrid' },
          { dir: [-1.2 * SQ3_3, 1.2 * SQ3_3, -1.2 * SQ3_3], type: 'hybrid' },
          { dir: [1.2 * SQ3_3, -1.2 * SQ3_3, -1.2 * SQ3_3], type: 'hybrid' },
        ],
      },
    ],
    ligands: [
      { pos: [1.75 * SQ3_3, 1.75 * SQ3_3, 1.75 * SQ3_3], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
      { pos: [-1.75 * SQ3_3, -1.75 * SQ3_3, 1.75 * SQ3_3], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
      { pos: [-1.75 * SQ3_3, 1.75 * SQ3_3, -1.75 * SQ3_3], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
      { pos: [1.75 * SQ3_3, -1.75 * SQ3_3, -1.75 * SQ3_3], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
    ],
    description: 'C 原子采取 sp³ 杂化，4 个全同的 sp³ 杂化轨道均匀对称地指向正四面体的 4 个顶点。',
  },

  nh3: {
    id: 'nh3',
    name: '氨气 NH₃',
    formula: 'NH₃',
    hybridType: 'sp3',
    bondAngle: 107.3,
    centers: [
      {
        element: 'N',
        color: ATOM_COLORS.N,
        pos: NH3_CENTER,
        hybridOrbitals: [
          // 孤对沿 C3 轴（+y），与成键轨道成 β ≈ 111.56°
          { dir: [0, NH3_ORBITAL_LEN, 0], type: 'lonePair' },
          { dir: scaleDir(NH3_UNIT_DIRS[0], NH3_ORBITAL_LEN), type: 'hybrid' },
          { dir: scaleDir(NH3_UNIT_DIRS[1], NH3_ORBITAL_LEN), type: 'hybrid' },
          { dir: scaleDir(NH3_UNIT_DIRS[2], NH3_ORBITAL_LEN), type: 'hybrid' },
        ],
      },
    ],
    ligands: [
      {
        pos: addVec(NH3_CENTER, scaleDir(NH3_UNIT_DIRS[0], NH3_BOND_LEN)),
        element: 'H',
        color: ATOM_COLORS.H,
        bondType: 'sigma',
      },
      {
        pos: addVec(NH3_CENTER, scaleDir(NH3_UNIT_DIRS[1], NH3_BOND_LEN)),
        element: 'H',
        color: ATOM_COLORS.H,
        bondType: 'sigma',
      },
      {
        pos: addVec(NH3_CENTER, scaleDir(NH3_UNIT_DIRS[2], NH3_BOND_LEN)),
        element: 'H',
        color: ATOM_COLORS.H,
        bondType: 'sigma',
      },
    ],
    description: 'N 原子采取 sp³ 杂化，顶部 1 个 sp³ 轨道被孤电子对占据，产生排斥效应使键角压缩为 107.3°。',
  },

  h2o: {
    id: 'h2o',
    name: '水 H₂O',
    formula: 'H₂O',
    hybridType: 'sp3',
    bondAngle: 104.5,
    centers: [
      {
        element: 'O',
        color: ATOM_COLORS.O,
        pos: [0, 0, 0],
        hybridOrbitals: [
          // 2 对孤对：位于垂直于分子平面的 yz 平面内，关于 y 轴对称（C2 轴）
          {
            dir: [0, H2O_ORBITAL_LEN * H2O_LONE_PAIR_COS, H2O_ORBITAL_LEN * H2O_LONE_PAIR_SIN],
            type: 'lonePair',
          },
          {
            dir: [0, H2O_ORBITAL_LEN * H2O_LONE_PAIR_COS, -H2O_ORBITAL_LEN * H2O_LONE_PAIR_SIN],
            type: 'lonePair',
          },
          // 2 个成键轨道：在 xy 平面内朝下张开 104.5°，与 H 位置严格共线
          {
            dir: [H2O_ORBITAL_LEN * H2O_BOND_SIN, -H2O_ORBITAL_LEN * H2O_BOND_COS, 0],
            type: 'hybrid',
          },
          {
            dir: [-H2O_ORBITAL_LEN * H2O_BOND_SIN, -H2O_ORBITAL_LEN * H2O_BOND_COS, 0],
            type: 'hybrid',
          },
        ],
      },
    ],
    ligands: [
      {
        pos: [H2O_BOND_LEN * H2O_BOND_SIN, -H2O_BOND_LEN * H2O_BOND_COS, 0],
        element: 'H',
        color: ATOM_COLORS.H,
        bondType: 'sigma',
      },
      {
        pos: [-H2O_BOND_LEN * H2O_BOND_SIN, -H2O_BOND_LEN * H2O_BOND_COS, 0],
        element: 'H',
        color: ATOM_COLORS.H,
        bondType: 'sigma',
      },
    ],
    description: 'O 原子采取 sp³ 杂化，2 对孤电子对占据 2 个 sp³ 杂化轨道，使键角进一步压缩为 104.5°。',
  },

  nh4: {
    id: 'nh4',
    name: '铵根离子 NH₄⁺',
    formula: 'NH₄⁺',
    hybridType: 'sp3',
    bondAngle: 109.5,
    centers: [
      {
        element: 'N',
        color: ATOM_COLORS.N,
        pos: [0, 0, 0],
        hybridOrbitals: [
          { dir: [1.2 * SQ3_3, 1.2 * SQ3_3, 1.2 * SQ3_3], type: 'hybrid' },
          { dir: [-1.2 * SQ3_3, -1.2 * SQ3_3, 1.2 * SQ3_3], type: 'hybrid' },
          { dir: [-1.2 * SQ3_3, 1.2 * SQ3_3, -1.2 * SQ3_3], type: 'hybrid' },
          { dir: [1.2 * SQ3_3, -1.2 * SQ3_3, -1.2 * SQ3_3], type: 'hybrid' },
        ],
      },
    ],
    ligands: [
      { pos: [1.75 * SQ3_3, 1.75 * SQ3_3, 1.75 * SQ3_3], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
      { pos: [-1.75 * SQ3_3, -1.75 * SQ3_3, 1.75 * SQ3_3], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
      { pos: [-1.75 * SQ3_3, 1.75 * SQ3_3, -1.75 * SQ3_3], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
      { pos: [1.75 * SQ3_3, -1.75 * SQ3_3, -1.75 * SQ3_3], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
    ],
    description: 'N 原子采取 sp³ 杂化，4 个 sp³ 轨道分别与 4 个 H 形成 σ 键 (其中 1 个为配位键)，呈现对称的正四面体。',
  },
}

export const PRESET_KEYS = [
  'becl2', 'co2', 'c2h2', 'bf3', 'so2', 'c2h4', 'co3', 'ch4', 'nh3', 'h2o', 'nh4',
]
