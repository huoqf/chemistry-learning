/**
 * Cu (FCC) 晶胞数据构建
 */

import { ATOM_COLORS } from '@/theme'
import type { CrystalTypeData, AtomSpec, BondSpec } from '../types'
import { getCornerFracs, getFaceFracs } from '../helpers'

export function createCuData(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // Cu 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `cu-corner-${i}`,
      element: 'Cu',
      fracPos: pos,
      radius: 0.21,
      color: ATOM_COLORS.Cu,
      label: '顶点 Cu (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // Cu 占 6 面心 (6 x 1/2 = 3)
  getFaceFracs().forEach((pos, i) => {
    atoms.push({
      id: `cu-face-${i}`,
      element: 'Cu',
      fracPos: pos,
      radius: 0.21,
      color: ATOM_COLORS.Cu,
      label: '面心 Cu (贡献 1/2)',
      sharingRatio: 0.5,
      locationType: 'face',
    })
  })

  // 面心到相邻顶点的配位连线 (每个面心连接 4 个同面顶点，共 6×4=24)
  // 顶点 indices 0-7, 面心 indices 8-13
  const bonds: BondSpec[] = []
  const faceCornerMap = [
    [8, 0, 1, 2, 3],   // 底面 z=0
    [9, 4, 5, 6, 7],   // 顶面 z=1
    [10, 0, 1, 5, 4],  // 前面 y=0
    [11, 3, 2, 6, 7],  // 后面 y=1
    [12, 0, 3, 7, 4],  // 左面 x=0
    [13, 1, 2, 6, 5],  // 右面 x=1
  ]
  faceCornerMap.forEach(([face, c0, c1, c2, c3]) => {
    bonds.push({ fromIndex: face, toIndex: c0 })
    bonds.push({ fromIndex: face, toIndex: c1 })
    bonds.push({ fromIndex: face, toIndex: c2 })
    bonds.push({ fromIndex: face, toIndex: c3 })
  })

  return {
    id: 'fcc-cu',
    name: 'Cu (面心立方最密堆积 FCC)',
    formula: 'Cu',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 361,
    molarMass: 63.55,
    zValue: 4,
    coordNumber: 12,
    packingEfficiency: 74.0,
    atoms,
    bonds,
    description: '面心立方最密堆积：8顶点(1/8) + 6面心(1/2)，均占原子数 N=4，配位数 12',
  }
}
