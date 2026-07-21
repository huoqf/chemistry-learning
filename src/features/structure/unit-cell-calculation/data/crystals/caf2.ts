/**
 * CaF₂ (萤石结构) 晶胞数据构建
 */

import { ATOM_COLORS } from '@/theme'
import type { CrystalTypeData, AtomSpec, BondSpec } from '../types'
import { getCornerFracs, getFaceFracs } from '../helpers'

export function createCaF2Data(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // Ca²⁺ 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `ca-corner-${i}`,
      element: 'Ca²⁺',
      fracPos: pos,
      radius: 0.23,
      color: ATOM_COLORS.Ca,
      label: '顶点 Ca²⁺ (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // Ca²⁺ 占 6 面心 (6 x 1/2 = 3)
  getFaceFracs().forEach((pos, i) => {
    atoms.push({
      id: `ca-face-${i}`,
      element: 'Ca²⁺',
      fracPos: pos,
      radius: 0.23,
      color: ATOM_COLORS.Ca,
      label: '面心 Ca²⁺ (贡献 1/2)',
      sharingRatio: 0.5,
      locationType: 'face',
    })
  })

  // F⁻ 占 8 个内部四面体空隙 (8 x 1 = 8)
  const fFracs: [number, number, number][] = [
    [0.25, 0.25, 0.25], [0.75, 0.25, 0.25],
    [0.25, 0.75, 0.25], [0.75, 0.75, 0.25],
    [0.25, 0.25, 0.75], [0.75, 0.25, 0.75],
    [0.25, 0.75, 0.75], [0.75, 0.75, 0.75],
  ]
  fFracs.forEach((pos, i) => {
    atoms.push({
      id: `f-tetra-${i}`,
      element: 'F⁻',
      fracPos: pos,
      radius: 0.16,
      color: ATOM_COLORS.F,
      label: '内部 F⁻ (贡献 1)',
      sharingRatio: 1,
      locationType: 'tetrahedral',
    })
  })

  // 8 个 F⁻ 各自连接周围 4 个 Ca²⁺
  const bonds: BondSpec[] = [
    { fromIndex: 14, toIndex: 0 }, { fromIndex: 14, toIndex: 8 }, { fromIndex: 14, toIndex: 10 }, { fromIndex: 14, toIndex: 12 },
    { fromIndex: 15, toIndex: 1 }, { fromIndex: 15, toIndex: 8 }, { fromIndex: 15, toIndex: 10 }, { fromIndex: 15, toIndex: 13 },
    { fromIndex: 16, toIndex: 3 }, { fromIndex: 16, toIndex: 8 }, { fromIndex: 16, toIndex: 11 }, { fromIndex: 16, toIndex: 12 },
    { fromIndex: 17, toIndex: 2 }, { fromIndex: 17, toIndex: 8 }, { fromIndex: 17, toIndex: 11 }, { fromIndex: 17, toIndex: 13 },
    { fromIndex: 18, toIndex: 4 }, { fromIndex: 18, toIndex: 9 }, { fromIndex: 18, toIndex: 10 }, { fromIndex: 18, toIndex: 12 },
    { fromIndex: 19, toIndex: 5 }, { fromIndex: 19, toIndex: 9 }, { fromIndex: 19, toIndex: 10 }, { fromIndex: 19, toIndex: 13 },
    { fromIndex: 20, toIndex: 7 }, { fromIndex: 20, toIndex: 9 }, { fromIndex: 20, toIndex: 11 }, { fromIndex: 20, toIndex: 12 },
    { fromIndex: 21, toIndex: 6 }, { fromIndex: 21, toIndex: 9 }, { fromIndex: 21, toIndex: 11 }, { fromIndex: 21, toIndex: 13 },
  ]

  return {
    id: 'caf2',
    name: 'CaF₂ (萤石结构)',
    formula: 'CaF₂',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 546,
    molarMass: 78.08,
    zValue: 4,
    coordNumber: 8,
    packingEfficiency: 65.0,
    atoms,
    bonds,
    description: '萤石结构：Ca²⁺ 占顶点与面心(N=4)，F⁻ 占8个内部小立方体/四面体空隙(N=8)，配位数 8:4',
  }
}
