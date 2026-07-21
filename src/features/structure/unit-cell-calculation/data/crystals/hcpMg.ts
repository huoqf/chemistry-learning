/**
 * Mg (六方最密堆积 HCP) 晶胞数据构建
 */

import { ATOM_COLORS } from '@/theme'
import type { CrystalTypeData, AtomSpec } from '../types'
import { getCornerFracs } from '../helpers'

export function createHcpMgData(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // Mg 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `mg-corner-${i}`,
      element: 'Mg',
      fracPos: pos,
      radius: 0.22,
      color: ATOM_COLORS.Mg,
      label: '顶点 Mg (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // Mg 占 1 内部 (1 x 1 = 1)
  atoms.push({
    id: 'mg-body-0',
    element: 'Mg',
    fracPos: [0.333, 0.667, 0.5] as const,
    radius: 0.22,
    color: ATOM_COLORS.Mg,
    label: '内部 Mg (贡献 1)',
    sharingRatio: 1,
    locationType: 'body',
  })

  // 内部 Mg [index 8] 到周边 6 个顶点的连线
  const bonds = [
    { fromIndex: 8, toIndex: 0 },
    { fromIndex: 8, toIndex: 1 },
    { fromIndex: 8, toIndex: 3 },
    { fromIndex: 8, toIndex: 4 },
    { fromIndex: 8, toIndex: 5 },
    { fromIndex: 8, toIndex: 7 },
  ]

  return {
    id: 'hcp-mg',
    name: 'Mg (六方最密堆积 HCP)',
    formula: 'Mg',
    cellParams: { a: 1, b: 1, c: 1.633, alpha: 90, beta: 90, gamma: 120 },
    defaultA: 321,
    molarMass: 24.31,
    zValue: 2,
    coordNumber: 12,
    packingEfficiency: 74.0,
    atoms,
    bonds,
    description: '六方最密堆积：平行六面体晶胞 8 顶点(1) + 1 内部(1)，均占原子数 N=2，配位数 12',
  }
}
