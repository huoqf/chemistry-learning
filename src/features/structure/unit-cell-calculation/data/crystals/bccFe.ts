/**
 * Fe (BCC) 晶胞数据构建
 */

import { ATOM_COLORS } from '@/theme'
import type { CrystalTypeData, AtomSpec, BondSpec } from '../types'
import { getCornerFracs } from '../helpers'

export function createFeData(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // Fe 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `fe-corner-${i}`,
      element: 'Fe',
      fracPos: pos,
      radius: 0.22,
      color: ATOM_COLORS.Fe,
      label: '顶点 Fe (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // Fe 占 1 体心 (1 x 1 = 1)
  atoms.push({
    id: 'fe-body-0',
    element: 'Fe',
    fracPos: [0.5, 0.5, 0.5] as const,
    radius: 0.22,
    color: ATOM_COLORS.Fe,
    label: '体心 Fe (贡献 1)',
    sharingRatio: 1,
    locationType: 'body',
  })

  // 体心到 8 顶点的连线
  const bonds: BondSpec[] = []
  for (let i = 0; i < 8; i++) {
    bonds.push({ fromIndex: 8, toIndex: i })
  }

  return {
    id: 'bcc-fe',
    name: 'α-Fe (体心立方堆积 BCC)',
    formula: 'Fe',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 286.6,
    molarMass: 55.85,
    zValue: 2,
    coordNumber: 8,
    packingEfficiency: 68.0,
    atoms,
    bonds,
    description: '体心立方堆积：8顶点(1/8) + 1体心(1)，均占原子数 N=2，配位数 8',
  }
}
