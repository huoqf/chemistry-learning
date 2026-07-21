/**
 * CO₂ (干冰分子晶体) 晶胞数据构建
 */

import { ATOM_COLORS } from '@/theme'
import type { CrystalTypeData, AtomSpec, BondSpec } from '../types'
import { getCornerFracs, getFaceFracs } from '../helpers'

export function createCO2Data(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // CO₂ 分子在 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `co2-corner-${i}`,
      element: 'CO₂',
      fracPos: pos,
      radius: 0.23,
      color: ATOM_COLORS.O,
      label: '顶点 CO₂ 分子 (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // CO₂ 分子在 6 面心 (6 x 1/2 = 3)
  getFaceFracs().forEach((pos, i) => {
    atoms.push({
      id: `co2-face-${i}`,
      element: 'CO₂',
      fracPos: pos,
      radius: 0.23,
      color: ATOM_COLORS.O,
      label: '面心 CO₂ 分子 (贡献 1/2)',
      sharingRatio: 0.5,
      locationType: 'face',
    })
  })

  // 面心到 4 个同面顶点的连线 (模拟分子间作用力网格)
  const bonds: BondSpec[] = []
  const faceCornerMap = [
    [8, 0, 1, 2, 3],
    [9, 4, 5, 6, 7],
    [10, 0, 1, 5, 4],
    [11, 3, 2, 6, 7],
    [12, 0, 3, 7, 4],
    [13, 1, 2, 6, 5],
  ]
  faceCornerMap.forEach(([face, c0, c1, c2, c3]) => {
    bonds.push({ fromIndex: face, toIndex: c0 })
    bonds.push({ fromIndex: face, toIndex: c1 })
    bonds.push({ fromIndex: face, toIndex: c2 })
    bonds.push({ fromIndex: face, toIndex: c3 })
  })

  return {
    id: 'co2',
    name: 'CO₂ (干冰分子晶体)',
    formula: 'CO₂',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 558,
    molarMass: 44.01,
    zValue: 4,
    coordNumber: 12,
    packingEfficiency: 65.5,
    atoms,
    bonds,
    description: '分子晶体面心立方：8顶点(1) + 6面心(3)，均占 CO₂ 分子数 N=4，配位数 12',
  }
}
