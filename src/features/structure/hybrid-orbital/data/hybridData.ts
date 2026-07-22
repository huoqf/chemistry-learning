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
      { pos: [-2.1, 0, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
      { pos: [2.1, 0, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
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
    bondAngle: 119,
    centers: [
      {
        element: 'S',
        color: ATOM_COLORS.S,
        pos: [0, 0.1, 0],
        hybridOrbitals: [
          { dir: [0, 1.2, 0], type: 'lonePair' },
          { dir: [1.08, -0.6, 0], type: 'hybrid' },
          { dir: [-1.08, -0.6, 0], type: 'hybrid' },
          { dir: [0, 0, 1.2], type: 'unhybridizedP' },
        ],
      },
    ],
    ligands: [
      { pos: [1.6, -0.85, 0], element: 'O', color: ATOM_COLORS.O, bondType: 'sigma' },
      { pos: [-1.6, -0.85, 0], element: 'O', color: ATOM_COLORS.O, bondType: 'sigma' },
    ],
    piBonds: [
      { startPos: [0, 0.1, 0], endPos: [1.6, -0.85, 0], dir: [0, 0, 0.9] },
    ],
    description: 'S 原子采取 sp² 杂化，1 对孤电子对占据 1 个 sp² 轨道，使分子呈现 V 形 (键角约 119°)。',
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
      { pos: [-1.7, 1.55, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
      { pos: [-1.7, -1.55, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
      { pos: [1.7, 1.55, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
      { pos: [1.7, -1.55, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
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
    bondAngle: 107,
    centers: [
      {
        element: 'N',
        color: ATOM_COLORS.N,
        pos: [0, 0.15, 0],
        hybridOrbitals: [
          { dir: [0, 1.2, 0], type: 'lonePair' },
          { dir: [1.1, -0.4, 0.4], type: 'hybrid' },
          { dir: [-1.1, -0.4, 0.4], type: 'hybrid' },
          { dir: [0, -0.4, -1.15], type: 'hybrid' },
        ],
      },
    ],
    ligands: [
      { pos: [1.65, -0.65, 0.6], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
      { pos: [-1.65, -0.65, 0.6], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
      { pos: [0, -0.65, -1.7], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
    ],
    description: 'N 原子采取 sp³ 杂化，顶部 1 个 sp³ 轨道被孤电子对占据，产生排斥效应使键角压缩为 107°。',
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
          { dir: [0.75, 0.9, 0], type: 'lonePair' },
          { dir: [-0.75, 0.9, 0], type: 'lonePair' },
          { dir: [0.95, -0.7, 0], type: 'hybrid' },
          { dir: [-0.95, -0.7, 0], type: 'hybrid' },
        ],
      },
    ],
    ligands: [
      { pos: [1.45, -1.05, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
      { pos: [-1.45, -1.05, 0], element: 'H', color: ATOM_COLORS.H, bondType: 'sigma' },
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
