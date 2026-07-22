/**
 * 金刚石 (Diamond) 晶胞数据构建
 */

import { ATOM_COLORS } from '@/theme'
import type { CrystalTypeData, AtomSpec, BondSpec } from '../types'
import { getCornerFracs, getFaceFracs } from '../helpers'

export function createDiamondData(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // C 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `c-corner-${i}`,
      element: 'C',
      fracPos: pos,
      radius: 0.17,
      color: ATOM_COLORS.C,
      label: '顶点 C (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // C 占 6 面心 (6 x 1/2 = 3)
  getFaceFracs().forEach((pos, i) => {
    atoms.push({
      id: `c-face-${i}`,
      element: 'C',
      fracPos: pos,
      radius: 0.17,
      color: ATOM_COLORS.C,
      label: '面心 C (贡献 1/2)',
      sharingRatio: 0.5,
      locationType: 'face',
    })
  })

  // C 占 4 内部四面体空隙 (4 x 1 = 4)
  const tetraFracs: [number, number, number][] = [
    [0.25, 0.25, 0.25],
    [0.75, 0.75, 0.25],
    [0.75, 0.25, 0.75],
    [0.25, 0.75, 0.75],
  ]
  tetraFracs.forEach((pos, i) => {
    atoms.push({
      id: `c-tetra-${i}`,
      element: 'C',
      fracPos: pos,
      radius: 0.17,
      color: ATOM_COLORS.C,
      label: '内部 C (贡献 1)',
      sharingRatio: 1,
      locationType: 'tetrahedral',
    })
  })

  // 4 个四面体 C 各连接 1 个顶点 + 3 个面心 (共 16 条共价键)
  // 顶点 indices 0-7, 面心 indices 8-13, 四面体 indices 14-17
  const bonds: BondSpec[] = [
    // C(0.25,0.25,0.25) [14] → 顶点(0,0,0)[0], 面心 z=0[8], y=0[10], x=0[12]
    { fromIndex: 14, toIndex: 0 },
    { fromIndex: 14, toIndex: 8 },
    { fromIndex: 14, toIndex: 10 },
    { fromIndex: 14, toIndex: 12 },
    // C(0.75,0.75,0.25) [15] → 顶点(1,1,0)[2], 面心 z=0[8], y=1[11], x=1[13]
    { fromIndex: 15, toIndex: 2 },
    { fromIndex: 15, toIndex: 8 },
    { fromIndex: 15, toIndex: 11 },
    { fromIndex: 15, toIndex: 13 },
    // C(0.75,0.25,0.75) [16] → 顶点(1,0,1)[5], 面心 y=0[10], z=1[9], x=1[13]
    { fromIndex: 16, toIndex: 5 },
    { fromIndex: 16, toIndex: 9 },
    { fromIndex: 16, toIndex: 10 },
    { fromIndex: 16, toIndex: 13 },
    // C(0.25,0.75,0.75) [17] → 顶点(0,1,1)[7], 面心 x=0[12], z=1[9], y=1[11]
    { fromIndex: 17, toIndex: 7 },
    { fromIndex: 17, toIndex: 9 },
    { fromIndex: 17, toIndex: 11 },
    { fromIndex: 17, toIndex: 12 },
  ]

  return {
    id: 'diamond',
    name: 'C (金刚石结构)',
    formula: 'C',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 356.7,
    molarMass: 12.01,
    zValue: 8,
    coordNumber: 4,
    packingEfficiency: 34.0,
    atoms,
    bonds,
    description: '金刚石结构：8顶点(占1/8) + 6面心(占1/2) + 4体内部(占1)，均占原子数 N=8，配位数 4',
  }
}
