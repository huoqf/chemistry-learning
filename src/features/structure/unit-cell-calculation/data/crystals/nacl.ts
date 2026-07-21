/**
 * NaCl 晶胞数据构建
 */

import { ATOM_COLORS } from '@/theme'
import type { CrystalTypeData, AtomSpec } from '../types'
import { getCornerFracs, getFaceFracs, getEdgeFracs } from '../helpers'

export function createNaClData(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // Cl⁻ 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `cl-corner-${i}`,
      element: 'Cl⁻',
      fracPos: pos,
      radius: 0.22,
      color: ATOM_COLORS.Cl,
      label: '顶点 Cl⁻ (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // Cl⁻ 占 6 面心 (6 x 1/2 = 3)
  getFaceFracs().forEach((pos, i) => {
    atoms.push({
      id: `cl-face-${i}`,
      element: 'Cl⁻',
      fracPos: pos,
      radius: 0.22,
      color: ATOM_COLORS.Cl,
      label: '面心 Cl⁻ (贡献 1/2)',
      sharingRatio: 0.5,
      locationType: 'face',
    })
  })

  // Na⁺ 占 1 体心 (1 x 1 = 1)
  atoms.push({
    id: 'na-body-0',
    element: 'Na⁺',
    fracPos: [0.5, 0.5, 0.5] as const,
    radius: 0.18,
    color: ATOM_COLORS.Na,
    label: '体心 Na⁺ (贡献 1)',
    sharingRatio: 1,
    locationType: 'body',
  })

  // Na⁺ 占 12 棱心 (12 x 1/4 = 3)
  getEdgeFracs().forEach((pos, i) => {
    atoms.push({
      id: `na-edge-${i}`,
      element: 'Na⁺',
      fracPos: pos,
      radius: 0.18,
      color: ATOM_COLORS.Na,
      label: '棱心 Na⁺ (贡献 1/4)',
      sharingRatio: 0.25,
      locationType: 'edge',
    })
  })

  // 近邻配位键 (体心 Na⁺ 到 6 个面心 Cl⁻)
  const bonds = [
    { fromIndex: 14, toIndex: 8 },
    { fromIndex: 14, toIndex: 9 },
    { fromIndex: 14, toIndex: 10 },
    { fromIndex: 14, toIndex: 11 },
    { fromIndex: 14, toIndex: 12 },
    { fromIndex: 14, toIndex: 13 },
  ]

  return {
    id: 'nacl',
    name: 'NaCl (氯化钠晶体)',
    formula: 'NaCl',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 564,
    molarMass: 58.44,
    zValue: 4,
    coordNumber: 6,
    packingEfficiency: 66.8,
    atoms,
    bonds,
    description: '面心立方结构：Cl⁻ 占据顶点与面心，Na⁺ 占据体心与棱心，N(Na⁺)=4, N(Cl⁻)=4',
  }
}
