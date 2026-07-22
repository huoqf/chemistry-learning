/**
 * chiralData.ts — 手性分子与立体异构预设数据
 *
 * 包含高考高频手性分子（乳酸、2-氯丁烷、丙氨酸、甘油醛）、非手性对比分子（2-丙醇）
 * 以及顺反异构分子（顺/反-2-丁烯、顺/反-1,2-二氯乙烯）的 3D 坐标与化学元数据。
 */

import { ATOM_COLORS } from '@/theme'

export interface Atom3D {
  id: string
  element: string
  pos: [number, number, number]
  groupLabel?: string
  isChiralCenter?: boolean
  color?: string
  radius?: number
}

export interface Bond3D {
  start: [number, number, number]
  end: [number, number, number]
  type?: 'single' | 'double'
}

export interface SubstituentGroup {
  label: string
  color: string
  atomIndices: number[]
}

export interface ChiralMolecule {
  id: string
  name: string
  chemicalFormula: string
  structuralFormula: string
  type: 'chiral' | 'achiral' | 'cis-trans'
  description: string
  chiralCount: number
  stereoisomerCount: number
  isChiral: boolean
  chiralCenterIndex?: number
  substituents?: SubstituentGroup[]
  atoms: Atom3D[]
  bonds: Bond3D[]
  /** 顺反异构的配对分子 */
  cisTransPair?: {
    isCis: boolean
    pairName: string
    pairStructuralFormula: string
    pairAtoms: Atom3D[]
    pairBonds: Bond3D[]
  }
}

// 帮助创建四面体顶点坐标 (正四面体相对原点)
// 四面体 4 个顶点的规范向量 (scale 为 1.25)
const s = 1.25
const tet: [number, number, number][] = [
  [0, s, 0],
  [(2 * Math.sqrt(2) / 3) * s, -s / 3, 0],
  [(-Math.sqrt(2) / 3) * s, -s / 3, (Math.sqrt(6) / 3) * s],
  [(-Math.sqrt(2) / 3) * s, -s / 3, (-Math.sqrt(6) / 3) * s],
]

export const CHIRAL_PRESETS: ChiralMolecule[] = [
  {
    id: 'lactic-acid',
    name: '乳酸 (2-羟基丙酸)',
    chemicalFormula: 'C₃H₆O₃',
    structuralFormula: 'CH₃-CH(OH)-COOH',
    type: 'chiral',
    description: '经典手性分子。C2 为手性碳原子(*C)，连接 -H、-OH、-CH₃、-COOH 四个互不相同的基团，实物与镜像无法完全重合。',
    chiralCount: 1,
    stereoisomerCount: 2,
    isChiral: true,
    chiralCenterIndex: 0, // 0 号原子为中心手性碳
    substituents: [
      { label: '-H', color: ATOM_COLORS.H, atomIndices: [1] },
      { label: '-OH', color: '#EF4444', atomIndices: [2, 3] },
      { label: '-CH₃', color: '#10B981', atomIndices: [4, 5, 6, 7] },
      { label: '-COOH', color: '#3B82F6', atomIndices: [8, 9, 10, 11] },
    ],
    atoms: [
      { id: 'C2', element: 'C', pos: [0, 0, 0], isChiralCenter: true, groupLabel: '*C' },
      { id: 'H-C2', element: 'H', pos: tet[0], groupLabel: '-H' },
      { id: 'O-OH', element: 'O', pos: tet[1], groupLabel: '-OH' },
      { id: 'H-OH', element: 'H', pos: [tet[1][0] + 0.5, tet[1][1] - 0.4, tet[1][2] + 0.3] },
      
      // -CH3 基团
      { id: 'C1', element: 'C', pos: tet[2], groupLabel: '-CH₃' },
      { id: 'H-C1a', element: 'H', pos: [tet[2][0] - 0.5, tet[2][1] - 0.4, tet[2][2] + 0.5] },
      { id: 'H-C1b', element: 'H', pos: [tet[2][0] - 0.4, tet[2][1] + 0.4, tet[2][2] + 0.5] },
      { id: 'H-C1c', element: 'H', pos: [tet[2][0] + 0.2, tet[2][1] - 0.5, tet[2][2] + 0.6] },

      // -COOH 基团
      { id: 'C3', element: 'C', pos: tet[3], groupLabel: '-COOH' },
      { id: 'O-dbl', element: 'O', pos: [tet[3][0] - 0.4, tet[3][1] - 0.6, tet[3][2] - 0.5] },
      { id: 'O-sg', element: 'O', pos: [tet[3][0] + 0.6, tet[3][1] - 0.3, tet[3][2] - 0.6] },
      { id: 'H-acid', element: 'H', pos: [tet[3][0] + 0.9, tet[3][1] - 0.7, tet[3][2] - 0.6] },
    ],
    bonds: [
      { start: [0, 0, 0], end: tet[0] },
      { start: [0, 0, 0], end: tet[1] },
      { start: tet[1], end: [tet[1][0] + 0.5, tet[1][1] - 0.4, tet[1][2] + 0.3] },
      
      { start: [0, 0, 0], end: tet[2] },
      { start: tet[2], end: [tet[2][0] - 0.5, tet[2][1] - 0.4, tet[2][2] + 0.5] },
      { start: tet[2], end: [tet[2][0] - 0.4, tet[2][1] + 0.4, tet[2][2] + 0.5] },
      { start: tet[2], end: [tet[2][0] + 0.2, tet[2][1] - 0.5, tet[2][2] + 0.6] },

      { start: [0, 0, 0], end: tet[3] },
      { start: tet[3], end: [tet[3][0] - 0.4, tet[3][1] - 0.6, tet[3][2] - 0.5], type: 'double' },
      { start: tet[3], end: [tet[3][0] + 0.6, tet[3][1] - 0.3, tet[3][2] - 0.6] },
      { start: [tet[3][0] + 0.6, tet[3][1] - 0.3, tet[3][2] - 0.6], end: [tet[3][0] + 0.9, tet[3][1] - 0.7, tet[3][2] - 0.6] },
    ],
  },

  {
    id: '2-chlorobutane',
    name: '2-氯丁烷',
    chemicalFormula: 'C₄H₉Cl',
    structuralFormula: 'CH₃-CH(Cl)-CH₂CH₃',
    type: 'chiral',
    description: '高考常考手性烷烃卤代物。C2 手性碳连接 -H、-Cl、-CH₃、-CH₂CH₃，4 个基团互不相同，具有一对实物/镜像对称的对映异构体。',
    chiralCount: 1,
    stereoisomerCount: 2,
    isChiral: true,
    chiralCenterIndex: 0,
    substituents: [
      { label: '-H', color: ATOM_COLORS.H, atomIndices: [1] },
      { label: '-Cl', color: '#22C55E', atomIndices: [2] },
      { label: '-CH₃', color: '#F59E0B', atomIndices: [3, 4, 5, 6] },
      { label: '-CH₂CH₃', color: '#8B5CF6', atomIndices: [7, 8, 9, 10, 11, 12, 13] },
    ],
    atoms: [
      { id: 'C2', element: 'C', pos: [0, 0, 0], isChiralCenter: true, groupLabel: '*C' },
      { id: 'H-C2', element: 'H', pos: tet[0], groupLabel: '-H' },
      { id: 'Cl', element: 'Cl', pos: tet[1], groupLabel: '-Cl' },
      
      // -CH3 (C1)
      { id: 'C1', element: 'C', pos: tet[2], groupLabel: '-CH₃' },
      { id: 'H1a', element: 'H', pos: [tet[2][0] - 0.5, tet[2][1] - 0.4, tet[2][2] + 0.4] },
      { id: 'H1b', element: 'H', pos: [tet[2][0] - 0.3, tet[2][1] + 0.5, tet[2][2] + 0.4] },
      { id: 'H1c', element: 'H', pos: [tet[2][0] + 0.3, tet[2][1] - 0.4, tet[2][2] + 0.5] },

      // -CH2CH3 (C3-C4)
      { id: 'C3', element: 'C', pos: tet[3], groupLabel: '-CH₂CH₃' },
      { id: 'H3a', element: 'H', pos: [tet[3][0] - 0.4, tet[3][1] + 0.4, tet[3][2] - 0.4] },
      { id: 'H3b', element: 'H', pos: [tet[3][0] + 0.4, tet[3][1] + 0.4, tet[3][2] - 0.4] },
      { id: 'C4', element: 'C', pos: [tet[3][0], tet[3][1] - 1.1, tet[3][2] - 0.6] },
      { id: 'H4a', element: 'H', pos: [tet[3][0] - 0.5, tet[3][1] - 1.5, tet[3][2] - 0.3] },
      { id: 'H4b', element: 'H', pos: [tet[3][0] + 0.5, tet[3][1] - 1.5, tet[3][2] - 0.3] },
      { id: 'H4c', element: 'H', pos: [tet[3][0], tet[3][1] - 1.5, tet[3][2] - 1.1] },
    ],
    bonds: [
      { start: [0, 0, 0], end: tet[0] },
      { start: [0, 0, 0], end: tet[1] },
      { start: [0, 0, 0], end: tet[2] },
      { start: tet[2], end: [tet[2][0] - 0.5, tet[2][1] - 0.4, tet[2][2] + 0.4] },
      { start: tet[2], end: [tet[2][0] - 0.3, tet[2][1] + 0.5, tet[2][2] + 0.4] },
      { start: tet[2], end: [tet[2][0] + 0.3, tet[2][1] - 0.4, tet[2][2] + 0.5] },

      { start: [0, 0, 0], end: tet[3] },
      { start: tet[3], end: [tet[3][0] - 0.4, tet[3][1] + 0.4, tet[3][2] - 0.4] },
      { start: tet[3], end: [tet[3][0] + 0.4, tet[3][1] + 0.4, tet[3][2] - 0.4] },
      { start: tet[3], end: [tet[3][0], tet[3][1] - 1.1, tet[3][2] - 0.6] },
      { start: [tet[3][0], tet[3][1] - 1.1, tet[3][2] - 0.6], end: [tet[3][0] - 0.5, tet[3][1] - 1.5, tet[3][2] - 0.3] },
      { start: [tet[3][0], tet[3][1] - 1.1, tet[3][2] - 0.6], end: [tet[3][0] + 0.5, tet[3][1] - 1.5, tet[3][2] - 0.3] },
      { start: [tet[3][0], tet[3][1] - 1.1, tet[3][2] - 0.6], end: [tet[3][0], tet[3][1] - 1.5, tet[3][2] - 1.1] },
    ],
  },

  {
    id: 'alanine',
    name: '丙氨酸 (2-氨基丙酸)',
    chemicalFormula: 'C₃H₇NO₂',
    structuralFormula: 'CH₃-CH(NH₂)-COOH',
    type: 'chiral',
    description: '构成蛋白质的基本氨基酸（除甘氨酸外均具有手性）。α-碳原子连有 -H、-NH₂、-CH₃、-COOH 四个不同基团。',
    chiralCount: 1,
    stereoisomerCount: 2,
    isChiral: true,
    chiralCenterIndex: 0,
    substituents: [
      { label: '-H', color: ATOM_COLORS.H, atomIndices: [1] },
      { label: '-NH₂', color: '#3B82F6', atomIndices: [2, 3, 4] },
      { label: '-CH₃', color: '#10B981', atomIndices: [5, 6, 7, 8] },
      { label: '-COOH', color: '#EC4899', atomIndices: [9, 10, 11, 12] },
    ],
    atoms: [
      { id: 'C-alpha', element: 'C', pos: [0, 0, 0], isChiralCenter: true, groupLabel: '*C' },
      { id: 'H-ca', element: 'H', pos: tet[0], groupLabel: '-H' },
      { id: 'N-nh2', element: 'N', pos: tet[1], groupLabel: '-NH₂' },
      { id: 'H-n1', element: 'H', pos: [tet[1][0] + 0.4, tet[1][1] - 0.4, tet[1][2] + 0.3] },
      { id: 'H-n2', element: 'H', pos: [tet[1][0] - 0.4, tet[1][1] - 0.4, tet[1][2] + 0.3] },

      { id: 'C-ch3', element: 'C', pos: tet[2], groupLabel: '-CH₃' },
      { id: 'H-c1', element: 'H', pos: [tet[2][0] - 0.5, tet[2][1] - 0.4, tet[2][2] + 0.4] },
      { id: 'H-c2', element: 'H', pos: [tet[2][0] - 0.3, tet[2][1] + 0.5, tet[2][2] + 0.4] },
      { id: 'H-c3', element: 'H', pos: [tet[2][0] + 0.3, tet[2][1] - 0.4, tet[2][2] + 0.5] },

      { id: 'C-cooh', element: 'C', pos: tet[3], groupLabel: '-COOH' },
      { id: 'O-d', element: 'O', pos: [tet[3][0] - 0.4, tet[3][1] - 0.6, tet[3][2] - 0.5] },
      { id: 'O-s', element: 'O', pos: [tet[3][0] + 0.6, tet[3][1] - 0.3, tet[3][2] - 0.6] },
      { id: 'H-o', element: 'H', pos: [tet[3][0] + 0.9, tet[3][1] - 0.7, tet[3][2] - 0.6] },
    ],
    bonds: [
      { start: [0, 0, 0], end: tet[0] },
      { start: [0, 0, 0], end: tet[1] },
      { start: tet[1], end: [tet[1][0] + 0.4, tet[1][1] - 0.4, tet[1][2] + 0.3] },
      { start: tet[1], end: [tet[1][0] - 0.4, tet[1][1] - 0.4, tet[1][2] + 0.3] },

      { start: [0, 0, 0], end: tet[2] },
      { start: tet[2], end: [tet[2][0] - 0.5, tet[2][1] - 0.4, tet[2][2] + 0.4] },
      { start: tet[2], end: [tet[2][0] - 0.3, tet[2][1] + 0.5, tet[2][2] + 0.4] },
      { start: tet[2], end: [tet[2][0] + 0.3, tet[2][1] - 0.4, tet[2][2] + 0.5] },

      { start: [0, 0, 0], end: tet[3] },
      { start: tet[3], end: [tet[3][0] - 0.4, tet[3][1] - 0.6, tet[3][2] - 0.5], type: 'double' },
      { start: tet[3], end: [tet[3][0] + 0.6, tet[3][1] - 0.3, tet[3][2] - 0.6] },
      { start: [tet[3][0] + 0.6, tet[3][1] - 0.3, tet[3][2] - 0.6], end: [tet[3][0] + 0.9, tet[3][1] - 0.7, tet[3][2] - 0.6] },
    ],
  },

  {
    id: 'glyceraldehyde',
    name: '甘油醛 (2,3-二羟基丙醛)',
    chemicalFormula: 'C₃H₆O₃',
    structuralFormula: 'OCH-CH(OH)-CH₂OH',
    type: 'chiral',
    description: '单糖结构基准分子。C2 碳原子为手性碳，连接 -H、-OH、-CHO、-CH₂OH 四个不同基团，常用于糖类 D/L 构型基准。',
    chiralCount: 1,
    stereoisomerCount: 2,
    isChiral: true,
    chiralCenterIndex: 0,
    substituents: [
      { label: '-H', color: ATOM_COLORS.H, atomIndices: [1] },
      { label: '-OH', color: '#EF4444', atomIndices: [2, 3] },
      { label: '-CHO', color: '#F59E0B', atomIndices: [4, 5, 6] },
      { label: '-CH₂OH', color: '#10B981', atomIndices: [7, 8, 9, 10, 11] },
    ],
    atoms: [
      { id: 'C2', element: 'C', pos: [0, 0, 0], isChiralCenter: true, groupLabel: '*C' },
      { id: 'H-c2', element: 'H', pos: tet[0], groupLabel: '-H' },
      { id: 'O-oh', element: 'O', pos: tet[1], groupLabel: '-OH' },
      { id: 'H-oh', element: 'H', pos: [tet[1][0] + 0.4, tet[1][1] - 0.4, tet[1][2] + 0.3] },

      { id: 'C1-cho', element: 'C', pos: tet[2], groupLabel: '-CHO' },
      { id: 'O-cho', element: 'O', pos: [tet[2][0] - 0.5, tet[2][1] - 0.5, tet[2][2] + 0.4] },
      { id: 'H-cho', element: 'H', pos: [tet[2][0] - 0.2, tet[2][1] + 0.5, tet[2][2] + 0.4] },

      { id: 'C3-ch2oh', element: 'C', pos: tet[3], groupLabel: '-CH₂OH' },
      { id: 'H3a', element: 'H', pos: [tet[3][0] - 0.4, tet[3][1] + 0.4, tet[3][2] - 0.4] },
      { id: 'H3b', element: 'H', pos: [tet[3][0] + 0.4, tet[3][1] + 0.4, tet[3][2] - 0.4] },
      { id: 'O3', element: 'O', pos: [tet[3][0], tet[3][1] - 0.9, tet[3][2] - 0.5] },
      { id: 'H-o3', element: 'H', pos: [tet[3][0] + 0.4, tet[3][1] - 1.2, tet[3][2] - 0.5] },
    ],
    bonds: [
      { start: [0, 0, 0], end: tet[0] },
      { start: [0, 0, 0], end: tet[1] },
      { start: tet[1], end: [tet[1][0] + 0.4, tet[1][1] - 0.4, tet[1][2] + 0.3] },

      { start: [0, 0, 0], end: tet[2] },
      { start: tet[2], end: [tet[2][0] - 0.5, tet[2][1] - 0.5, tet[2][2] + 0.4], type: 'double' },
      { start: tet[2], end: [tet[2][0] - 0.2, tet[2][1] + 0.5, tet[2][2] + 0.4] },

      { start: [0, 0, 0], end: tet[3] },
      { start: tet[3], end: [tet[3][0] - 0.4, tet[3][1] + 0.4, tet[3][2] - 0.4] },
      { start: tet[3], end: [tet[3][0] + 0.4, tet[3][1] + 0.4, tet[3][2] - 0.4] },
      { start: tet[3], end: [tet[3][0], tet[3][1] - 0.9, tet[3][2] - 0.5] },
      { start: [tet[3][0], tet[3][1] - 0.9, tet[3][2] - 0.5], end: [tet[3][0] + 0.4, tet[3][1] - 1.2, tet[3][2] - 0.5] },
    ],
  },

  {
    id: 'propan-2-ol',
    name: '2-丙醇 (异丙醇)',
    chemicalFormula: 'C₃H₈O',
    structuralFormula: 'CH₃-CH(OH)-CH₃',
    type: 'achiral',
    description: '非手性对比分子。C2 碳连有 2 个相同的 -CH₃ 基团（仅 3 种不同基团），存在对称面。镜像旋转后可与原分子完全重合，无旋光性。',
    chiralCount: 0,
    stereoisomerCount: 1,
    isChiral: false,
    atoms: [
      { id: 'C2', element: 'C', pos: [0, 0, 0], groupLabel: 'C2(非手性)' },
      { id: 'H-c2', element: 'H', pos: tet[0], groupLabel: '-H' },
      { id: 'O-oh', element: 'O', pos: tet[1], groupLabel: '-OH' },
      { id: 'H-oh', element: 'H', pos: [tet[1][0] + 0.4, tet[1][1] - 0.4, tet[1][2] + 0.3] },

      // 基团1: -CH3
      { id: 'C1', element: 'C', pos: tet[2], groupLabel: '-CH₃(A)' },
      { id: 'H1a', element: 'H', pos: [tet[2][0] - 0.5, tet[2][1] - 0.4, tet[2][2] + 0.4] },
      { id: 'H1b', element: 'H', pos: [tet[2][0] - 0.3, tet[2][1] + 0.5, tet[2][2] + 0.4] },
      { id: 'H1c', element: 'H', pos: [tet[2][0] + 0.3, tet[2][1] - 0.4, tet[2][2] + 0.5] },

      // 基团2: 相同 -CH3
      { id: 'C3', element: 'C', pos: tet[3], groupLabel: '-CH₃(B)' },
      { id: 'H3a', element: 'H', pos: [tet[3][0] - 0.4, tet[3][1] + 0.4, tet[3][2] - 0.4] },
      { id: 'H3b', element: 'H', pos: [tet[3][0] + 0.4, tet[3][1] + 0.4, tet[3][2] - 0.4] },
      { id: 'H3c', element: 'H', pos: [tet[3][0], tet[3][1] - 0.5, tet[3][2] - 0.5] },
    ],
    bonds: [
      { start: [0, 0, 0], end: tet[0] },
      { start: [0, 0, 0], end: tet[1] },
      { start: tet[1], end: [tet[1][0] + 0.4, tet[1][1] - 0.4, tet[1][2] + 0.3] },

      { start: [0, 0, 0], end: tet[2] },
      { start: tet[2], end: [tet[2][0] - 0.5, tet[2][1] - 0.4, tet[2][2] + 0.4] },
      { start: tet[2], end: [tet[2][0] - 0.3, tet[2][1] + 0.5, tet[2][2] + 0.4] },
      { start: tet[2], end: [tet[2][0] + 0.3, tet[2][1] - 0.4, tet[2][2] + 0.5] },

      { start: [0, 0, 0], end: tet[3] },
      { start: tet[3], end: [tet[3][0] - 0.4, tet[3][1] + 0.4, tet[3][2] - 0.4] },
      { start: tet[3], end: [tet[3][0] + 0.4, tet[3][1] + 0.4, tet[3][2] - 0.4] },
      { start: tet[3], end: [tet[3][0], tet[3][1] - 0.5, tet[3][2] - 0.5] },
    ],
  },

  {
    id: '2-butene',
    name: '2-丁烯 (顺反立体异构)',
    chemicalFormula: 'C₄H₈',
    structuralFormula: 'CH₃-CH=CH-CH₃',
    type: 'cis-trans',
    description: '顺反异构（几何异构）。C=C 双键不可自由旋转，当两个碳原子各自连有 2 个不同基团时产生顺反异构。顺式基团在同侧，反式在异侧。',
    chiralCount: 0,
    stereoisomerCount: 2,
    isChiral: false,
    atoms: [
      { id: 'C2', element: 'C', pos: [-0.67, 0, 0], groupLabel: 'C2' },
      { id: 'C3', element: 'C', pos: [0.67, 0, 0], groupLabel: 'C3' },
      { id: 'H2', element: 'H', pos: [-1.2, -0.9, 0], groupLabel: '-H(顺)' },
      { id: 'H3', element: 'H', pos: [1.2, -0.9, 0], groupLabel: '-H(顺)' },
      
      { id: 'C1', element: 'C', pos: [-1.35, 1.15, 0], groupLabel: '-CH₃(顺)' },
      { id: 'H1a', element: 'H', pos: [-2.1, 0.9, 0.5] },
      { id: 'H1b', element: 'H', pos: [-2.1, 0.9, -0.5] },
      { id: 'H1c', element: 'H', pos: [-0.8, 1.9, 0] },

      { id: 'C4', element: 'C', pos: [1.35, 1.15, 0], groupLabel: '-CH₃(顺)' },
      { id: 'H4a', element: 'H', pos: [2.1, 0.9, 0.5] },
      { id: 'H4b', element: 'H', pos: [2.1, 0.9, -0.5] },
      { id: 'H4c', element: 'H', pos: [0.8, 1.9, 0] },
    ],
    bonds: [
      { start: [-0.67, 0, 0], end: [0.67, 0, 0], type: 'double' },
      { start: [-0.67, 0, 0], end: [-1.2, -0.9, 0] },
      { start: [0.67, 0, 0], end: [1.2, -0.9, 0] },
      
      { start: [-0.67, 0, 0], end: [-1.35, 1.15, 0] },
      { start: [-1.35, 1.15, 0], end: [-2.1, 0.9, 0.5] },
      { start: [-1.35, 1.15, 0], end: [-2.1, 0.9, -0.5] },
      { start: [-1.35, 1.15, 0], end: [-0.8, 1.9, 0] },

      { start: [0.67, 0, 0], end: [1.35, 1.15, 0] },
      { start: [1.35, 1.15, 0], end: [2.1, 0.9, 0.5] },
      { start: [1.35, 1.15, 0], end: [2.1, 0.9, -0.5] },
      { start: [1.35, 1.15, 0], end: [0.8, 1.9, 0] },
    ],
    cisTransPair: {
      isCis: true,
      pairName: '反-2-丁烯 (Trans-2-butene)',
      pairStructuralFormula: 'CH₃-CH=CH-CH₃ (Trans)',
      pairAtoms: [
        { id: 'C2', element: 'C', pos: [-0.67, 0, 0], groupLabel: 'C2' },
        { id: 'C3', element: 'C', pos: [0.67, 0, 0], groupLabel: 'C3' },
        { id: 'H2', element: 'H', pos: [-1.2, -0.9, 0], groupLabel: '-H(左下)' },
        { id: 'H3', element: 'H', pos: [1.2, 0.9, 0], groupLabel: '-H(右上)' },
        
        { id: 'C1', element: 'C', pos: [-1.35, 1.15, 0], groupLabel: '-CH₃(左上)' },
        { id: 'H1a', element: 'H', pos: [-2.1, 0.9, 0.5] },
        { id: 'H1b', element: 'H', pos: [-2.1, 0.9, -0.5] },
        { id: 'H1c', element: 'H', pos: [-0.8, 1.9, 0] },

        { id: 'C4', element: 'C', pos: [1.35, -1.15, 0], groupLabel: '-CH₃(右下)' },
        { id: 'H4a', element: 'H', pos: [2.1, -0.9, 0.5] },
        { id: 'H4b', element: 'H', pos: [2.1, -0.9, -0.5] },
        { id: 'H4c', element: 'H', pos: [0.8, -1.9, 0] },
      ],
      pairBonds: [
        { start: [-0.67, 0, 0], end: [0.67, 0, 0], type: 'double' },
        { start: [-0.67, 0, 0], end: [-1.2, -0.9, 0] },
        { start: [0.67, 0, 0], end: [1.2, 0.9, 0] },

        { start: [-0.67, 0, 0], end: [-1.35, 1.15, 0] },
        { start: [-1.35, 1.15, 0], end: [-2.1, 0.9, 0.5] },
        { start: [-1.35, 1.15, 0], end: [-2.1, 0.9, -0.5] },
        { start: [-1.35, 1.15, 0], end: [-0.8, 1.9, 0] },

        { start: [0.67, 0, 0], end: [1.35, -1.15, 0] },
        { start: [1.35, -1.15, 0], end: [2.1, -0.9, 0.5] },
        { start: [1.35, -1.15, 0], end: [2.1, -0.9, -0.5] },
        { start: [1.35, -1.15, 0], end: [0.8, -1.9, 0] },
      ],
    },
  },

  {
    id: '1,2-dichloroethene',
    name: '1,2-二氯乙烯',
    chemicalFormula: 'C₂H₂Cl₂',
    structuralFormula: 'CHCl=CHCl',
    type: 'cis-trans',
    description: '高考经典顺反异构例题。顺式 1,2-二氯乙烯的极性极强，反式分子对称极性相互抵消，熔沸点与偶极矩差异显著。',
    chiralCount: 0,
    stereoisomerCount: 2,
    isChiral: false,
    atoms: [
      { id: 'C1', element: 'C', pos: [-0.67, 0, 0], groupLabel: 'C1' },
      { id: 'C2', element: 'C', pos: [0.67, 0, 0], groupLabel: 'C2' },
      { id: 'H1', element: 'H', pos: [-1.2, -0.9, 0], groupLabel: '-H(顺)' },
      { id: 'H2', element: 'H', pos: [1.2, -0.9, 0], groupLabel: '-H(顺)' },
      { id: 'Cl1', element: 'Cl', pos: [-1.4, 1.1, 0], groupLabel: '-Cl(顺)' },
      { id: 'Cl2', element: 'Cl', pos: [1.4, 1.1, 0], groupLabel: '-Cl(顺)' },
    ],
    bonds: [
      { start: [-0.67, 0, 0], end: [0.67, 0, 0], type: 'double' },
      { start: [-0.67, 0, 0], end: [-1.2, -0.9, 0] },
      { start: [0.67, 0, 0], end: [1.2, -0.9, 0] },
      { start: [-0.67, 0, 0], end: [-1.4, 1.1, 0] },
      { start: [0.67, 0, 0], end: [1.4, 1.1, 0] },
    ],
    cisTransPair: {
      isCis: true,
      pairName: '反-1,2-二氯乙烯 (Trans-1,2-Dichloroethene)',
      pairStructuralFormula: 'CHCl=CHCl (Trans)',
      pairAtoms: [
        { id: 'C1', element: 'C', pos: [-0.67, 0, 0], groupLabel: 'C1' },
        { id: 'C2', element: 'C', pos: [0.67, 0, 0], groupLabel: 'C2' },
        { id: 'H1', element: 'H', pos: [-1.2, -0.9, 0], groupLabel: '-H(左下)' },
        { id: 'H2', element: 'H', pos: [1.2, 0.9, 0], groupLabel: '-H(右上)' },
        { id: 'Cl1', element: 'Cl', pos: [-1.4, 1.1, 0], groupLabel: '-Cl(左上)' },
        { id: 'Cl2', element: 'Cl', pos: [1.4, -1.1, 0], groupLabel: '-Cl(右下)' },
      ],
      pairBonds: [
        { start: [-0.67, 0, 0], end: [0.67, 0, 0], type: 'double' },
        { start: [-0.67, 0, 0], end: [-1.2, -0.9, 0] },
        { start: [0.67, 0, 0], end: [1.2, 0.9, 0] },
        { start: [-0.67, 0, 0], end: [-1.4, 1.1, 0] },
        { start: [0.67, 0, 0], end: [1.4, -1.1, 0] },
      ],
    },
  },
]
