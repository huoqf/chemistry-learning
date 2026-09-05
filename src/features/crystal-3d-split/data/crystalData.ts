import { ATOM_COLORS } from '@/theme'
import type { CrystalTypeData, CrystalTypeId } from '../types'

const CUBIC_CELL = { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 }
const HEX_CELL = { a: 1, b: 1, c: 1.633, alpha: 90, beta: 90, gamma: 120 }

/** 8 大高考典型晶胞预设数据库 (颜色全量统一继承自 Theme ATOM_COLORS) */
export const CRYSTAL_DATA_MAP: Record<CrystalTypeId, CrystalTypeData> = {
  nacl: {
    id: 'nacl',
    name: 'NaCl 氯化钠',
    chemicalFormula: 'NaCl',
    description: '面心立方点阵。Cl⁻ 位于顶点 (8×1/8) 与面心 (6×1/2)，共 4 个；Na⁺ 位于棱心 (12×1/4) 与体心 (1×1)，共 4 个。',
    cellParams: CUBIC_CELL,
    defaultEdgeLengthPm: 564,
    molarMass: 58.5,
    tangentFormulaLatex: '2(r(\\text{Na}^+) + r(\\text{Cl}^-)) = a',
    tangentDescription: 'Na⁺ 与 Cl⁻ 沿晶胞棱边相切，面对角线由 Cl⁻ 相切。',
    coordNumberDescription: 'Na⁺ 与 Cl⁻ 的配位数均为 6 (八面体空隙包围)。',
    tangentRadii: { 'Cl⁻': 0.31, 'Na⁺': 0.19 },
    tangentLines: [
      { startFrac: [0, 0, 0], endFrac: [1, 0, 0], label: '棱边接触 2(r₊+r₋)=a' },
      { startFrac: [0, 0, 0], endFrac: [0, 1, 0] },
      { startFrac: [0, 0, 0], endFrac: [1, 1, 0], label: '面对角线 Cl⁻-Cl⁻' },
    ],
    atoms: [
      // Cl⁻ 顶点 8个
      { id: 'cl-c0', element: 'Cl⁻', fracPos: [0, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22, label: 'Cl⁻ 顶点' },
      { id: 'cl-c1', element: 'Cl⁻', fracPos: [1, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-c2', element: 'Cl⁻', fracPos: [0, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-c3', element: 'Cl⁻', fracPos: [1, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-c4', element: 'Cl⁻', fracPos: [0, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-c5', element: 'Cl⁻', fracPos: [1, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-c6', element: 'Cl⁻', fracPos: [0, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-c7', element: 'Cl⁻', fracPos: [1, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      // Cl⁻ 面心 6个
      { id: 'cl-f0', element: 'Cl⁻', fracPos: [0.5, 0.5, 0], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Cl, radius: 0.22, label: 'Cl⁻ 面心' },
      { id: 'cl-f1', element: 'Cl⁻', fracPos: [0.5, 0.5, 1], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-f2', element: 'Cl⁻', fracPos: [0.5, 0, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-f3', element: 'Cl⁻', fracPos: [0.5, 1, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-f4', element: 'Cl⁻', fracPos: [0, 0.5, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-f5', element: 'Cl⁻', fracPos: [1, 0.5, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Cl, radius: 0.22 },
      // Na⁺ 棱心 12个
      { id: 'na-e0', element: 'Na⁺', fracPos: [0.5, 0, 0], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.Na, radius: 0.16, label: 'Na⁺ 棱心' },
      { id: 'na-e1', element: 'Na⁺', fracPos: [0.5, 1, 0], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.Na, radius: 0.16 },
      { id: 'na-e2', element: 'Na⁺', fracPos: [0.5, 0, 1], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.Na, radius: 0.16 },
      { id: 'na-e3', element: 'Na⁺', fracPos: [0.5, 1, 1], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.Na, radius: 0.16 },
      { id: 'na-e4', element: 'Na⁺', fracPos: [0, 0.5, 0], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.Na, radius: 0.16 },
      { id: 'na-e5', element: 'Na⁺', fracPos: [1, 0.5, 0], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.Na, radius: 0.16 },
      { id: 'na-e6', element: 'Na⁺', fracPos: [0, 0.5, 1], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.Na, radius: 0.16 },
      { id: 'na-e7', element: 'Na⁺', fracPos: [1, 0.5, 1], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.Na, radius: 0.16 },
      { id: 'na-e8', element: 'Na⁺', fracPos: [0, 0, 0.5], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.Na, radius: 0.16 },
      { id: 'na-e9', element: 'Na⁺', fracPos: [1, 0, 0.5], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.Na, radius: 0.16 },
      { id: 'na-e10', element: 'Na⁺', fracPos: [0, 1, 0.5], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.Na, radius: 0.16 },
      { id: 'na-e11', element: 'Na⁺', fracPos: [1, 1, 0.5], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.Na, radius: 0.16 },
      // Na⁺ 体心 1个
      { id: 'na-b0', element: 'Na⁺', fracPos: [0.5, 0.5, 0.5], locationType: 'body', sharingRatio: 1, sharingLabel: '体心 (1)', color: ATOM_COLORS.Na, radius: 0.16, label: 'Na⁺ 体心' },
    ],
    bonds: [
      { fromIndex: 24, toIndex: 8 }, { fromIndex: 24, toIndex: 9 },
      { fromIndex: 24, toIndex: 10 }, { fromIndex: 24, toIndex: 11 },
      { fromIndex: 24, toIndex: 12 }, { fromIndex: 24, toIndex: 13 },
    ],
  },
  cscl: {
    id: 'cscl',
    name: 'CsCl 氯化铯',
    chemicalFormula: 'CsCl',
    description: '简单立方点阵 (立方体心空隙填充)。Cl⁻ 位于 8 个顶点 (8×1/8 = 1)，Cs⁺ 位于立方体心 (1×1 = 1)，最简化学式为 CsCl。',
    cellParams: CUBIC_CELL,
    defaultEdgeLengthPm: 412,
    molarMass: 168.4,
    tangentFormulaLatex: 'r(\\text{Cs}^+) + r(\\text{Cl}^-) = \\frac{\\sqrt{3}}{2}a',
    tangentDescription: 'Cs⁺ 与 Cl⁻ 沿晶胞体对角线方向相切。',
    coordNumberDescription: 'Cs⁺ 与 Cl⁻ 的配位数均为 8 (立方体顶点与体心相互包围)。',
    tangentRadii: { 'Cs⁺': 0.46, 'Cl⁻': 0.406 },
    tangentLines: [
      { startFrac: [0, 0, 0], endFrac: [1, 1, 1], label: '体对角线相切 2(r₊+r₋)=√3 a' },
      { startFrac: [1, 0, 0], endFrac: [0, 1, 1] },
    ],
    atoms: [
      // Cl⁻ 顶点 8个
      { id: 'cl-c0', element: 'Cl⁻', fracPos: [0, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-c1', element: 'Cl⁻', fracPos: [1, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-c2', element: 'Cl⁻', fracPos: [0, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-c3', element: 'Cl⁻', fracPos: [1, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-c4', element: 'Cl⁻', fracPos: [0, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-c5', element: 'Cl⁻', fracPos: [1, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-c6', element: 'Cl⁻', fracPos: [0, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      { id: 'cl-c7', element: 'Cl⁻', fracPos: [1, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cl, radius: 0.22 },
      // Cs⁺ 体心 1个
      { id: 'cs-b0', element: 'Cs⁺', fracPos: [0.5, 0.5, 0.5], locationType: 'body', sharingRatio: 1, sharingLabel: '体心 (1)', color: ATOM_COLORS.Cs, radius: 0.25, label: 'Cs⁺ 体心' },
    ],
    bonds: [
      { fromIndex: 8, toIndex: 0 }, { fromIndex: 8, toIndex: 1 },
      { fromIndex: 8, toIndex: 2 }, { fromIndex: 8, toIndex: 3 },
      { fromIndex: 8, toIndex: 4 }, { fromIndex: 8, toIndex: 5 },
      { fromIndex: 8, toIndex: 6 }, { fromIndex: 8, toIndex: 7 },
    ],
  },
  'cu-fcc': {
    id: 'cu-fcc',
    name: 'Cu 面心立方 (A1)',
    chemicalFormula: 'Cu',
    description: '面心立方 (FCC)。Cu 原子位于 8 个顶点 (8×1/8 = 1) 与 6 个面心 (6×1/2 = 3)，单个晶胞净含 4 个 Cu 原子。',
    cellParams: CUBIC_CELL,
    defaultEdgeLengthPm: 361,
    molarMass: 64,
    tangentFormulaLatex: '4r = \\sqrt{2}a',
    tangentDescription: 'Cu 原子在晶胞面对角线上紧密相切，4r 等于面对角线长 √2 a。',
    coordNumberDescription: '配位数为 12 (同层 4 个，上下层各 4 个)。空间利用率为 74.05%。',
    tangentRadii: { 'Cu': 0.3535 },
    tangentLines: [
      { startFrac: [0, 0, 0], endFrac: [1, 1, 0], label: '面对角线相切 4r=√2 a' },
      { startFrac: [0, 0, 1], endFrac: [1, 1, 1] },
      { startFrac: [0, 0, 0], endFrac: [0, 1, 1] },
    ],
    atoms: [
      // Cu 顶点 8个
      { id: 'cu-c0', element: 'Cu', fracPos: [0, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cu, radius: 0.22 },
      { id: 'cu-c1', element: 'Cu', fracPos: [1, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cu, radius: 0.22 },
      { id: 'cu-c2', element: 'Cu', fracPos: [0, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cu, radius: 0.22 },
      { id: 'cu-c3', element: 'Cu', fracPos: [1, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cu, radius: 0.22 },
      { id: 'cu-c4', element: 'Cu', fracPos: [0, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cu, radius: 0.22 },
      { id: 'cu-c5', element: 'Cu', fracPos: [1, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cu, radius: 0.22 },
      { id: 'cu-c6', element: 'Cu', fracPos: [0, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cu, radius: 0.22 },
      { id: 'cu-c7', element: 'Cu', fracPos: [1, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Cu, radius: 0.22 },
      // Cu 面心 6个
      { id: 'cu-f0', element: 'Cu', fracPos: [0.5, 0.5, 0], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Cu, radius: 0.22 },
      { id: 'cu-f1', element: 'Cu', fracPos: [0.5, 0.5, 1], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Cu, radius: 0.22 },
      { id: 'cu-f2', element: 'Cu', fracPos: [0.5, 0, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Cu, radius: 0.22 },
      { id: 'cu-f3', element: 'Cu', fracPos: [0.5, 1, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Cu, radius: 0.22 },
      { id: 'cu-f4', element: 'Cu', fracPos: [0, 0.5, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Cu, radius: 0.22 },
      { id: 'cu-f5', element: 'Cu', fracPos: [1, 0.5, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Cu, radius: 0.22 },
    ],
    bonds: [
      // 0. 底面心 cu-f0 (index 8) 连底面 4 顶点 (0, 1, 2, 3)
      { fromIndex: 8, toIndex: 0 }, { fromIndex: 8, toIndex: 1 }, { fromIndex: 8, toIndex: 2 }, { fromIndex: 8, toIndex: 3 },
      // 1. 顶面心 cu-f1 (index 9) 连顶面 4 顶点 (4, 5, 6, 7)
      { fromIndex: 9, toIndex: 4 }, { fromIndex: 9, toIndex: 5 }, { fromIndex: 9, toIndex: 6 }, { fromIndex: 9, toIndex: 7 },
      // 2. 前面心 cu-f2 (index 10) 连前面 4 顶点 (0, 1, 4, 5)
      { fromIndex: 10, toIndex: 0 }, { fromIndex: 10, toIndex: 1 }, { fromIndex: 10, toIndex: 4 }, { fromIndex: 10, toIndex: 5 },
      // 3. 后面心 cu-f3 (index 11) 连后面 4 顶点 (2, 3, 6, 7)
      { fromIndex: 11, toIndex: 2 }, { fromIndex: 11, toIndex: 3 }, { fromIndex: 11, toIndex: 6 }, { fromIndex: 11, toIndex: 7 },
      // 4. 左面心 cu-f4 (index 12) 连左面 4 顶点 (0, 2, 4, 6)
      { fromIndex: 12, toIndex: 0 }, { fromIndex: 12, toIndex: 2 }, { fromIndex: 12, toIndex: 4 }, { fromIndex: 12, toIndex: 6 },
      // 5. 右面心 cu-f5 (index 13) 连右面 4 顶点 (1, 3, 5, 7)
      { fromIndex: 13, toIndex: 1 }, { fromIndex: 13, toIndex: 3 }, { fromIndex: 13, toIndex: 5 }, { fromIndex: 13, toIndex: 7 },
    ],
  },
  'fe-bcc': {
    id: 'fe-bcc',
    name: 'Fe 体心立方 (A2)',
    chemicalFormula: 'Fe',
    description: '体心立方 (BCC)。Fe 原子位于 8 个顶点 (8×1/8 = 1) 与 1 个体心 (1×1 = 1)，单个晶胞净含 2 个 Fe 原子。',
    cellParams: CUBIC_CELL,
    defaultEdgeLengthPm: 287,
    molarMass: 56,
    tangentFormulaLatex: '4r = \\sqrt{3}a',
    tangentDescription: 'Fe 原子在晶胞体对角线上相切，4r 等于体对角线长 √3 a。',
    coordNumberDescription: '配位数为 8 (体心与 8 个顶点原子配位)。空间利用率为 68.02%。',
    tangentRadii: { 'Fe': 0.433 },
    tangentLines: [
      { startFrac: [0, 0, 0], endFrac: [1, 1, 1], label: '体对角线相切 4r=√3 a' },
      { startFrac: [1, 0, 0], endFrac: [0, 1, 1] },
    ],
    atoms: [
      // Fe 顶点 8个
      { id: 'fe-c0', element: 'Fe', fracPos: [0, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Fe, radius: 0.22 },
      { id: 'fe-c1', element: 'Fe', fracPos: [1, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Fe, radius: 0.22 },
      { id: 'fe-c2', element: 'Fe', fracPos: [0, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Fe, radius: 0.22 },
      { id: 'fe-c3', element: 'Fe', fracPos: [1, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Fe, radius: 0.22 },
      { id: 'fe-c4', element: 'Fe', fracPos: [0, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Fe, radius: 0.22 },
      { id: 'fe-c5', element: 'Fe', fracPos: [1, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Fe, radius: 0.22 },
      { id: 'fe-c6', element: 'Fe', fracPos: [0, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Fe, radius: 0.22 },
      { id: 'fe-c7', element: 'Fe', fracPos: [1, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Fe, radius: 0.22 },
      // Fe 体心 1个
      { id: 'fe-b0', element: 'Fe', fracPos: [0.5, 0.5, 0.5], locationType: 'body', sharingRatio: 1, sharingLabel: '体心 (1)', color: ATOM_COLORS.Fe, radius: 0.22 },
    ],
    bonds: [
      { fromIndex: 8, toIndex: 0 }, { fromIndex: 8, toIndex: 1 },
      { fromIndex: 8, toIndex: 2 }, { fromIndex: 8, toIndex: 3 },
      { fromIndex: 8, toIndex: 4 }, { fromIndex: 8, toIndex: 5 },
      { fromIndex: 8, toIndex: 6 }, { fromIndex: 8, toIndex: 7 },
    ],
  },
  diamond: {
    id: 'diamond',
    name: '金刚石 (C)',
    chemicalFormula: 'C',
    description: '面心立方 + 4 个内部四面体空隙。C 原子位于顶点 (8×1/8)、面心 (6×1/2) 与内部 (4×1)，晶胞净含 8 个 C 原子。',
    cellParams: CUBIC_CELL,
    defaultEdgeLengthPm: 357,
    molarMass: 12,
    tangentFormulaLatex: '8r = \\sqrt{3}a \\quad (\\text{或 } 2r = \\frac{\\sqrt{3}}{4}a)',
    tangentDescription: 'C-C 共价键长等于体对角线长的 1/4 (√3/4 a)。',
    coordNumberDescription: '每个 C 原子与周围 4 个 C 原子成正四面体构型，配位数为 4。空间利用率为 34.01%。',
    tangentRadii: { 'C': 0.2165 },
    tangentLines: [
      { startFrac: [0, 0, 0], endFrac: [0.25, 0.25, 0.25], label: '四面体相切 2r=√3/4 a' },
      { startFrac: [1, 1, 0], endFrac: [0.75, 0.75, 0.25] },
      { startFrac: [1, 0, 1], endFrac: [0.75, 0.25, 0.75] },
      { startFrac: [0, 1, 1], endFrac: [0.25, 0.75, 0.75] },
    ],
    atoms: [
      // 顶点 8
      { id: 'd-c0', element: 'C', fracPos: [0, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-c1', element: 'C', fracPos: [1, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-c2', element: 'C', fracPos: [0, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-c3', element: 'C', fracPos: [1, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-c4', element: 'C', fracPos: [0, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-c5', element: 'C', fracPos: [1, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-c6', element: 'C', fracPos: [0, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-c7', element: 'C', fracPos: [1, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.C, radius: 0.18 },
      // 面心 6
      { id: 'd-f0', element: 'C', fracPos: [0.5, 0.5, 0], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-f1', element: 'C', fracPos: [0.5, 0.5, 1], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-f2', element: 'C', fracPos: [0.5, 0, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-f3', element: 'C', fracPos: [0.5, 1, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-f4', element: 'C', fracPos: [0, 0.5, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-f5', element: 'C', fracPos: [1, 0.5, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.C, radius: 0.18 },
      // 内部四面体空隙 4 个碳原子 (与顶点/面心碳原子属于同种元素 C)
      { id: 'd-in0', element: 'C', fracPos: [0.25, 0.25, 0.25], locationType: 'internal', sharingRatio: 1, sharingLabel: '内部四面体 (1)', color: ATOM_COLORS.C, radius: 0.18, label: 'C 内部' },
      { id: 'd-in1', element: 'C', fracPos: [0.75, 0.75, 0.25], locationType: 'internal', sharingRatio: 1, sharingLabel: '内部四面体 (1)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-in2', element: 'C', fracPos: [0.75, 0.25, 0.75], locationType: 'internal', sharingRatio: 1, sharingLabel: '内部四面体 (1)', color: ATOM_COLORS.C, radius: 0.18 },
      { id: 'd-in3', element: 'C', fracPos: [0.25, 0.75, 0.75], locationType: 'internal', sharingRatio: 1, sharingLabel: '内部四面体 (1)', color: ATOM_COLORS.C, radius: 0.18 },
    ],
    bonds: [
      // 内部 C0 (index 14) 连接的 4 条正四面体 C-C 键
      { fromIndex: 14, toIndex: 0 }, { fromIndex: 14, toIndex: 8 },
      { fromIndex: 14, toIndex: 10 }, { fromIndex: 14, toIndex: 12 },
      // 内部 C1 (index 15) 连接的 4 条正四面体 C-C 键
      { fromIndex: 15, toIndex: 3 }, { fromIndex: 15, toIndex: 8 },
      { fromIndex: 15, toIndex: 11 }, { fromIndex: 15, toIndex: 13 },
      // 内部 C2 (index 16) 连接的 4 条正四面体 C-C 键
      { fromIndex: 16, toIndex: 5 }, { fromIndex: 16, toIndex: 9 },
      { fromIndex: 16, toIndex: 10 }, { fromIndex: 16, toIndex: 13 },
      // 内部 C3 (index 17) 连接的 4 条正四面体 C-C 键
      { fromIndex: 17, toIndex: 6 }, { fromIndex: 17, toIndex: 9 },
      { fromIndex: 17, toIndex: 11 }, { fromIndex: 17, toIndex: 12 },
    ],
  },
  caf2: {
    id: 'caf2',
    name: 'CaF₂ 萤石',
    chemicalFormula: 'CaF₂',
    description: 'Ca²⁺ 呈面心立方堆积 (8×1/8 + 6×1/2 = 4)；F⁻ 占满 8 个小立方体体心 (8×1 = 8)，最简化学式为 CaF₂。',
    cellParams: CUBIC_CELL,
    defaultEdgeLengthPm: 546,
    molarMass: 78,
    tangentFormulaLatex: 'r(\\text{Ca}^{2+}) + r(\\text{F}^-) = \\frac{\\sqrt{3}}{4}a',
    tangentDescription: 'Ca²⁺ 与 F⁻ 沿着小立方体体对角线相切。',
    coordNumberDescription: 'Ca²⁺ 的配位数为 8，F⁻ 的配位数为 4。',
    tangentRadii: { 'Ca²⁺': 0.24, 'F⁻': 0.193 },
    tangentLines: [
      { startFrac: [0, 0, 0], endFrac: [0.25, 0.25, 0.25], label: '四面体相切 r₊+r₋=√3/4 a' },
      { startFrac: [1, 1, 0], endFrac: [0.75, 0.75, 0.25] },
    ],
    atoms: [
      // Ca²⁺ 顶点 8
      { id: 'ca-c0', element: 'Ca²⁺', fracPos: [0, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ca, radius: 0.22 },
      { id: 'ca-c1', element: 'Ca²⁺', fracPos: [1, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ca, radius: 0.22 },
      { id: 'ca-c2', element: 'Ca²⁺', fracPos: [0, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ca, radius: 0.22 },
      { id: 'ca-c3', element: 'Ca²⁺', fracPos: [1, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ca, radius: 0.22 },
      { id: 'ca-c4', element: 'Ca²⁺', fracPos: [0, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ca, radius: 0.22 },
      { id: 'ca-c5', element: 'Ca²⁺', fracPos: [1, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ca, radius: 0.22 },
      { id: 'ca-c6', element: 'Ca²⁺', fracPos: [0, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ca, radius: 0.22 },
      { id: 'ca-c7', element: 'Ca²⁺', fracPos: [1, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ca, radius: 0.22 },
      // Ca²⁺ 面心 6
      { id: 'ca-f0', element: 'Ca²⁺', fracPos: [0.5, 0.5, 0], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Ca, radius: 0.22 },
      { id: 'ca-f1', element: 'Ca²⁺', fracPos: [0.5, 0.5, 1], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Ca, radius: 0.22 },
      { id: 'ca-f2', element: 'Ca²⁺', fracPos: [0.5, 0, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Ca, radius: 0.22 },
      { id: 'ca-f3', element: 'Ca²⁺', fracPos: [0.5, 1, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Ca, radius: 0.22 },
      { id: 'ca-f4', element: 'Ca²⁺', fracPos: [0, 0.5, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Ca, radius: 0.22 },
      { id: 'ca-f5', element: 'Ca²⁺', fracPos: [1, 0.5, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.Ca, radius: 0.22 },
      // F⁻ 内部 8
      { id: 'f-in0', element: 'F⁻', fracPos: [0.25, 0.25, 0.25], locationType: 'internal', sharingRatio: 1, sharingLabel: '内部 (1)', color: ATOM_COLORS.F, radius: 0.15 },
      { id: 'f-in1', element: 'F⁻', fracPos: [0.75, 0.25, 0.25], locationType: 'internal', sharingRatio: 1, sharingLabel: '内部 (1)', color: ATOM_COLORS.F, radius: 0.15 },
      { id: 'f-in2', element: 'F⁻', fracPos: [0.25, 0.75, 0.25], locationType: 'internal', sharingRatio: 1, sharingLabel: '内部 (1)', color: ATOM_COLORS.F, radius: 0.15 },
      { id: 'f-in3', element: 'F⁻', fracPos: [0.75, 0.75, 0.25], locationType: 'internal', sharingRatio: 1, sharingLabel: '内部 (1)', color: ATOM_COLORS.F, radius: 0.15 },
      { id: 'f-in4', element: 'F⁻', fracPos: [0.25, 0.25, 0.75], locationType: 'internal', sharingRatio: 1, sharingLabel: '内部 (1)', color: ATOM_COLORS.F, radius: 0.15 },
      { id: 'f-in5', element: 'F⁻', fracPos: [0.75, 0.25, 0.75], locationType: 'internal', sharingRatio: 1, sharingLabel: '内部 (1)', color: ATOM_COLORS.F, radius: 0.15 },
      { id: 'f-in6', element: 'F⁻', fracPos: [0.25, 0.75, 0.75], locationType: 'internal', sharingRatio: 1, sharingLabel: '内部 (1)', color: ATOM_COLORS.F, radius: 0.15 },
      { id: 'f-in7', element: 'F⁻', fracPos: [0.75, 0.75, 0.75], locationType: 'internal', sharingRatio: 1, sharingLabel: '内部 (1)', color: ATOM_COLORS.F, radius: 0.15 },
    ],
    bonds: [
      // F0 (index 14)
      { fromIndex: 14, toIndex: 0 }, { fromIndex: 14, toIndex: 8 }, { fromIndex: 14, toIndex: 10 }, { fromIndex: 14, toIndex: 12 },
      // F1 (index 15)
      { fromIndex: 15, toIndex: 1 }, { fromIndex: 15, toIndex: 8 }, { fromIndex: 15, toIndex: 10 }, { fromIndex: 15, toIndex: 13 },
      // F2 (index 16)
      { fromIndex: 16, toIndex: 2 }, { fromIndex: 16, toIndex: 8 }, { fromIndex: 16, toIndex: 11 }, { fromIndex: 16, toIndex: 12 },
      // F3 (index 17)
      { fromIndex: 17, toIndex: 3 }, { fromIndex: 17, toIndex: 8 }, { fromIndex: 17, toIndex: 11 }, { fromIndex: 17, toIndex: 13 },
      // F4 (index 18)
      { fromIndex: 18, toIndex: 4 }, { fromIndex: 18, toIndex: 9 }, { fromIndex: 18, toIndex: 10 }, { fromIndex: 18, toIndex: 12 },
      // F5 (index 19)
      { fromIndex: 19, toIndex: 5 }, { fromIndex: 19, toIndex: 9 }, { fromIndex: 19, toIndex: 10 }, { fromIndex: 19, toIndex: 13 },
      // F6 (index 20)
      { fromIndex: 20, toIndex: 6 }, { fromIndex: 20, toIndex: 9 }, { fromIndex: 20, toIndex: 11 }, { fromIndex: 20, toIndex: 12 },
      // F7 (index 21)
      { fromIndex: 21, toIndex: 7 }, { fromIndex: 21, toIndex: 9 }, { fromIndex: 21, toIndex: 11 }, { fromIndex: 21, toIndex: 13 },
    ],
  },
  zns: {
    id: 'zns',
    name: 'ZnS 闪锌矿',
    chemicalFormula: 'ZnS',
    description: 'S²⁻ 呈面心立方堆积 (8×1/8 + 6×1/2 = 4)；Zn²⁺ 填入 4 个交替四面体空隙 (4×1 = 4，填充率 50%)，最简化学式为 ZnS。',
    cellParams: CUBIC_CELL,
    defaultEdgeLengthPm: 541,
    molarMass: 97.5,
    tangentFormulaLatex: 'r(\\text{Zn}^{2+}) + r(\\text{S}^{2-}) = \\frac{\\sqrt{3}}{4}a',
    tangentDescription: 'Zn²⁺ 与 S²⁻ 沿小立方体体对角线相切，四面体键长 d = √3/4 a。',
    coordNumberDescription: 'Zn²⁺ 与 S²⁻ 的配位数均为 4 (正四面体配位)。',
    tangentRadii: { 'S²⁻': 0.25, 'Zn²⁺': 0.183 },
    tangentLines: [
      { startFrac: [0, 0, 0], endFrac: [0.25, 0.25, 0.25], label: '四面体相切 r₊+r₋=√3/4 a' },
      { startFrac: [1, 1, 0], endFrac: [0.75, 0.75, 0.25] },
    ],
    atoms: [
      // S²⁻ 顶点 8
      { id: 's-c0', element: 'S²⁻', fracPos: [0, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.S, radius: 0.22, label: 'S²⁻ 顶点' },
      { id: 's-c1', element: 'S²⁻', fracPos: [1, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.S, radius: 0.22 },
      { id: 's-c2', element: 'S²⁻', fracPos: [0, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.S, radius: 0.22 },
      { id: 's-c3', element: 'S²⁻', fracPos: [1, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.S, radius: 0.22 },
      { id: 's-c4', element: 'S²⁻', fracPos: [0, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.S, radius: 0.22 },
      { id: 's-c5', element: 'S²⁻', fracPos: [1, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.S, radius: 0.22 },
      { id: 's-c6', element: 'S²⁻', fracPos: [0, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.S, radius: 0.22 },
      { id: 's-c7', element: 'S²⁻', fracPos: [1, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.S, radius: 0.22 },
      // S²⁻ 面心 6
      { id: 's-f0', element: 'S²⁻', fracPos: [0.5, 0.5, 0], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.S, radius: 0.22, label: 'S²⁻ 面心' },
      { id: 's-f1', element: 'S²⁻', fracPos: [0.5, 0.5, 1], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.S, radius: 0.22 },
      { id: 's-f2', element: 'S²⁻', fracPos: [0.5, 0, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.S, radius: 0.22 },
      { id: 's-f3', element: 'S²⁻', fracPos: [0.5, 1, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.S, radius: 0.22 },
      { id: 's-f4', element: 'S²⁻', fracPos: [0, 0.5, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.S, radius: 0.22 },
      { id: 's-f5', element: 'S²⁻', fracPos: [1, 0.5, 0.5], locationType: 'face', sharingRatio: 1 / 2, sharingLabel: '面心 (1/2)', color: ATOM_COLORS.S, radius: 0.22 },
      // Zn²⁺ 内部四面体空隙 4 (占 1/2 空隙)
      { id: 'zn-in0', element: 'Zn²⁺', fracPos: [0.25, 0.25, 0.25], locationType: 'internal', sharingRatio: 1, sharingLabel: '四面体空隙 (1)', color: ATOM_COLORS.Zn, radius: 0.18, label: 'Zn²⁺ 内部' },
      { id: 'zn-in1', element: 'Zn²⁺', fracPos: [0.75, 0.75, 0.25], locationType: 'internal', sharingRatio: 1, sharingLabel: '四面体空隙 (1)', color: ATOM_COLORS.Zn, radius: 0.18 },
      { id: 'zn-in2', element: 'Zn²⁺', fracPos: [0.75, 0.25, 0.75], locationType: 'internal', sharingRatio: 1, sharingLabel: '四面体空隙 (1)', color: ATOM_COLORS.Zn, radius: 0.18 },
      { id: 'zn-in3', element: 'Zn²⁺', fracPos: [0.25, 0.75, 0.75], locationType: 'internal', sharingRatio: 1, sharingLabel: '四面体空隙 (1)', color: ATOM_COLORS.Zn, radius: 0.18 },
    ],
    bonds: [
      // Zn0 (index 14) 连接 4 个四面体 S²⁻
      { fromIndex: 14, toIndex: 0 }, { fromIndex: 14, toIndex: 8 }, { fromIndex: 14, toIndex: 10 }, { fromIndex: 14, toIndex: 12 },
      // Zn1 (index 15)
      { fromIndex: 15, toIndex: 3 }, { fromIndex: 15, toIndex: 8 }, { fromIndex: 15, toIndex: 11 }, { fromIndex: 15, toIndex: 13 },
      // Zn2 (index 16)
      { fromIndex: 16, toIndex: 5 }, { fromIndex: 16, toIndex: 9 }, { fromIndex: 16, toIndex: 10 }, { fromIndex: 16, toIndex: 13 },
      // Zn3 (index 17)
      { fromIndex: 17, toIndex: 6 }, { fromIndex: 17, toIndex: 9 }, { fromIndex: 17, toIndex: 11 }, { fromIndex: 17, toIndex: 12 },
    ],
  },
  catio3: {
    id: 'catio3',
    name: 'CaTiO₃ 钙钛矿',
    chemicalFormula: 'CaTiO₃',
    description: '立方钙钛矿 (ABX₃)：Ca²⁺ 位于体心 (1×1 = 1)，Ti⁴⁺ 位于顶点 (8×1/8 = 1)，O²⁻ 位于 12 条棱心 (12×1/4 = 3)。',
    cellParams: CUBIC_CELL,
    defaultEdgeLengthPm: 384,
    molarMass: 136,
    tangentFormulaLatex: 'r(\\text{Ti}^{4+}) + r(\\text{O}^{2-}) = \\frac{a}{2}',
    tangentDescription: 'Ti⁴⁺ 与 O²⁻ 沿晶胞棱长二分之一处相切。',
    coordNumberDescription: 'Ca²⁺ 的配位数为 12，Ti⁴⁺ 的配位数为 6，O²⁻ 的配位数为 2。',
    tangentRadii: { 'Ca²⁺': 0.32, 'Ti⁴⁺': 0.2, 'O²⁻': 0.3 },
    tangentLines: [
      { startFrac: [0, 0, 0], endFrac: [0.5, 0, 0], label: '棱边相切 r(Ti)+r(O)=a/2' },
      { startFrac: [0, 0, 0], endFrac: [0, 0.5, 0] },
      { startFrac: [0.5, 0.5, 0.5], endFrac: [0.5, 0.5, 0], label: 'Ca-O 面对角接触' },
    ],
    atoms: [
      // Ca²⁺ 体心 1
      { id: 'perov-ca0', element: 'Ca²⁺', fracPos: [0.5, 0.5, 0.5], locationType: 'body', sharingRatio: 1, sharingLabel: '体心 (1)', color: ATOM_COLORS.Ca, radius: 0.24, label: 'Ca²⁺ 体心' },
      // Ti⁴⁺ 顶点 8
      { id: 'perov-ti0', element: 'Ti⁴⁺', fracPos: [0, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ti, radius: 0.16 },
      { id: 'perov-ti1', element: 'Ti⁴⁺', fracPos: [1, 0, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ti, radius: 0.16 },
      { id: 'perov-ti2', element: 'Ti⁴⁺', fracPos: [0, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ti, radius: 0.16 },
      { id: 'perov-ti3', element: 'Ti⁴⁺', fracPos: [1, 1, 0], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ti, radius: 0.16 },
      { id: 'perov-ti4', element: 'Ti⁴⁺', fracPos: [0, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ti, radius: 0.16 },
      { id: 'perov-ti5', element: 'Ti⁴⁺', fracPos: [1, 0, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ti, radius: 0.16 },
      { id: 'perov-ti6', element: 'Ti⁴⁺', fracPos: [0, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ti, radius: 0.16 },
      { id: 'perov-ti7', element: 'Ti⁴⁺', fracPos: [1, 1, 1], locationType: 'corner', sharingRatio: 1 / 8, sharingLabel: '顶点 (1/8)', color: ATOM_COLORS.Ti, radius: 0.16 },
      // O²⁻ 棱心 12
      { id: 'perov-o0', element: 'O²⁻', fracPos: [0.5, 0, 0], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.O, radius: 0.18, label: 'O²⁻ 棱心' },
      { id: 'perov-o1', element: 'O²⁻', fracPos: [0.5, 1, 0], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.O, radius: 0.18 },
      { id: 'perov-o2', element: 'O²⁻', fracPos: [0.5, 0, 1], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.O, radius: 0.18 },
      { id: 'perov-o3', element: 'O²⁻', fracPos: [0.5, 1, 1], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.O, radius: 0.18 },
      { id: 'perov-o4', element: 'O²⁻', fracPos: [0, 0.5, 0], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.O, radius: 0.18 },
      { id: 'perov-o5', element: 'O²⁻', fracPos: [1, 0.5, 0], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.O, radius: 0.18 },
      { id: 'perov-o6', element: 'O²⁻', fracPos: [0, 0.5, 1], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.O, radius: 0.18 },
      { id: 'perov-o7', element: 'O²⁻', fracPos: [1, 0.5, 1], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.O, radius: 0.18 },
      { id: 'perov-o8', element: 'O²⁻', fracPos: [0, 0, 0.5], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.O, radius: 0.18 },
      { id: 'perov-o9', element: 'O²⁻', fracPos: [1, 0, 0.5], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.O, radius: 0.18 },
      { id: 'perov-o10', element: 'O²⁻', fracPos: [0, 1, 0.5], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.O, radius: 0.18 },
      { id: 'perov-o11', element: 'O²⁻', fracPos: [1, 1, 0.5], locationType: 'edge', sharingRatio: 1 / 4, sharingLabel: '棱心 (1/4)', color: ATOM_COLORS.O, radius: 0.18 },
    ],
    bonds: [
      { fromIndex: 9, toIndex: 1 }, { fromIndex: 9, toIndex: 2 },
      { fromIndex: 10, toIndex: 3 }, { fromIndex: 10, toIndex: 4 },
      { fromIndex: 11, toIndex: 5 }, { fromIndex: 11, toIndex: 6 },
      { fromIndex: 12, toIndex: 7 }, { fromIndex: 12, toIndex: 8 },
      { fromIndex: 13, toIndex: 1 }, { fromIndex: 13, toIndex: 3 },
      { fromIndex: 14, toIndex: 2 }, { fromIndex: 14, toIndex: 4 },
      { fromIndex: 15, toIndex: 5 }, { fromIndex: 15, toIndex: 7 },
      { fromIndex: 16, toIndex: 6 }, { fromIndex: 16, toIndex: 8 },
      { fromIndex: 17, toIndex: 1 }, { fromIndex: 17, toIndex: 5 },
      { fromIndex: 18, toIndex: 2 }, { fromIndex: 18, toIndex: 6 },
      { fromIndex: 19, toIndex: 3 }, { fromIndex: 19, toIndex: 7 },
      { fromIndex: 20, toIndex: 4 }, { fromIndex: 20, toIndex: 8 },
    ],
  },
  'hcp-mg': {
    id: 'hcp-mg',
    name: 'Mg 六方最密 (A3)',
    chemicalFormula: 'Mg',
    description: '六方平行六面体晶胞。Mg 原子位于 8 个顶角 (4个60°顶角×1/12 + 4个120°顶角×1/6 = 1) 与 1 个内部 (1×1 = 1)，单个平行六面体晶胞净含 2 个 Mg 原子。',
    cellParams: HEX_CELL,
    defaultEdgeLengthPm: 321,
    defaultHeightPm: 521,
    molarMass: 24.3,
    tangentFormulaLatex: 'a = 2r, \\quad c = \\sqrt{\\frac{8}{3}} a \\approx 1.633a',
    tangentDescription: '底面边长 a = 2r，六方晶胞高 c 与底面边长 a 满足 c/a = √(8/3) ≈ 1.633，底面积 S = (√3/2)a²。',
    coordNumberDescription: '配位数为 12 (同层 6 个，上下层各 3 个)。空间利用率为 74.05%。',
    tangentRadii: { 'Mg': 0.5 },
    tangentLines: [
      { startFrac: [0, 0, 0], endFrac: [1, 0, 0], label: '底面边相切 2r=a' },
      { startFrac: [0, 0, 0], endFrac: [0, 1, 0] },
      { startFrac: [1 / 3, 2 / 3, 0.5], endFrac: [0, 1, 1], label: '层间相切球距 2r=a' },
    ],
    atoms: [
      // 顶点 8（4 个 60° 顶角各共用 12 个六面体晶胞，份额 1/12；4 个 120° 顶角各共用 6 个六面体晶胞，份额 1/6）
      { id: 'mg-c0', element: 'Mg', fracPos: [0, 0, 0], locationType: 'corner', sharingRatio: 1 / 6, sharingLabel: '120° 顶角 (1/6)', color: ATOM_COLORS.Mg, radius: 0.22 },
      { id: 'mg-c1', element: 'Mg', fracPos: [1, 0, 0], locationType: 'corner', sharingRatio: 1 / 12, sharingLabel: '60° 顶角 (1/12)', color: ATOM_COLORS.Mg, radius: 0.22 },
      { id: 'mg-c2', element: 'Mg', fracPos: [0, 1, 0], locationType: 'corner', sharingRatio: 1 / 12, sharingLabel: '60° 顶角 (1/12)', color: ATOM_COLORS.Mg, radius: 0.22 },
      { id: 'mg-c3', element: 'Mg', fracPos: [1, 1, 0], locationType: 'corner', sharingRatio: 1 / 6, sharingLabel: '120° 顶角 (1/6)', color: ATOM_COLORS.Mg, radius: 0.22 },
      { id: 'mg-c4', element: 'Mg', fracPos: [0, 0, 1], locationType: 'corner', sharingRatio: 1 / 6, sharingLabel: '120° 顶角 (1/6)', color: ATOM_COLORS.Mg, radius: 0.22 },
      { id: 'mg-c5', element: 'Mg', fracPos: [1, 0, 1], locationType: 'corner', sharingRatio: 1 / 12, sharingLabel: '60° 顶角 (1/12)', color: ATOM_COLORS.Mg, radius: 0.22 },
      { id: 'mg-c6', element: 'Mg', fracPos: [0, 1, 1], locationType: 'corner', sharingRatio: 1 / 12, sharingLabel: '60° 顶角 (1/12)', color: ATOM_COLORS.Mg, radius: 0.22 },
      { id: 'mg-c7', element: 'Mg', fracPos: [1, 1, 1], locationType: 'corner', sharingRatio: 1 / 6, sharingLabel: '120° 顶角 (1/6)', color: ATOM_COLORS.Mg, radius: 0.22 },
      // 内部 1
      { id: 'mg-in0', element: 'Mg', fracPos: [1 / 3, 2 / 3, 0.5], locationType: 'internal', sharingRatio: 1, sharingLabel: '内部 (1)', color: ATOM_COLORS.Mg, radius: 0.22, label: 'Mg 内部' },
    ],
    bonds: [
      // 内部 Mg (index 8) 连底面 3 个顶点 (0, 2, 3)
      { fromIndex: 8, toIndex: 0 }, { fromIndex: 8, toIndex: 2 }, { fromIndex: 8, toIndex: 3 },
      // 内部 Mg (index 8) 连顶面 3 个顶点 (4, 6, 7)
      { fromIndex: 8, toIndex: 4 }, { fromIndex: 8, toIndex: 6 }, { fromIndex: 8, toIndex: 7 },
    ],
  },
}
