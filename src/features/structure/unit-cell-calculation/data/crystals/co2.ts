/**
 * CO₂ (干冰分子晶体) 晶胞数据构建
 * 分子晶体：CO₂ 分子占据 FCC 位置
 */

import { ATOM_COLORS } from '@/theme'
import type { CrystalTypeData, AtomSpec, BondSpec } from '../types'
import { getCornerFracs, getFaceFracs } from '../helpers'

export function createCO2Data(): CrystalTypeData {
  const atoms: AtomSpec[] = []
  const bonds: BondSpec[] = []

  // CO₂ 分子在 8 顶点 (8 x 1/8 = 1 个 CO₂ 分子)
  // Pa-3 空间群：顶点分子沿 [1, 1, 1] 体对角线取向
  const cornerFracs = getCornerFracs()
  cornerFracs.forEach((pos, i) => {
    const cIndex = atoms.length
    atoms.push({
      id: `co2-c-corner-${i}`,
      element: 'C',
      fracPos: pos,
      radius: 0.14,
      color: ATOM_COLORS.C,
      label: '顶点 CO₂ 分子 (C 原子，贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })

    const d = 0.08
    const o1Index = atoms.length
    atoms.push({
      id: `co2-o1-corner-${i}`,
      element: 'O',
      fracPos: [pos[0] + d, pos[1] + d, pos[2] + d],
      radius: 0.12,
      color: ATOM_COLORS.O,
      label: '顶点 CO₂ 分子 (O 原子，随 CO₂ 均摊 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })

    const o2Index = atoms.length
    atoms.push({
      id: `co2-o2-corner-${i}`,
      element: 'O',
      fracPos: [pos[0] - d, pos[1] - d, pos[2] - d],
      radius: 0.12,
      color: ATOM_COLORS.O,
      label: '顶点 CO₂ 分子 (O 原子，随 CO₂ 均摊 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })

    // 分子内 C=O 共价键
    bonds.push({ fromIndex: cIndex, toIndex: o1Index, color: ATOM_COLORS.C })
    bonds.push({ fromIndex: cIndex, toIndex: o2Index, color: ATOM_COLORS.C })
  })

  // CO₂ 分子在 6 面心 (6 x 1/2 = 3 个 CO₂ 分子)
  // 3 套面心分别沿 3 条交叉体对角线取向
  const faceFracs = getFaceFracs()
  const faceDirections: [number, number, number][] = [
    [0.08, -0.08, -0.08], // z=0 底面 (face 0)
    [0.08, -0.08, -0.08], // z=1 顶面 (face 1)
    [-0.08, 0.08, -0.08], // y=0 前面 (face 2)
    [-0.08, 0.08, -0.08], // y=1 后面 (face 3)
    [-0.08, -0.08, 0.08], // x=0 左面 (face 4)
    [-0.08, -0.08, 0.08], // x=1 右面 (face 5)
  ]

  faceFracs.forEach((pos, i) => {
    const cIndex = atoms.length
    atoms.push({
      id: `co2-c-face-${i}`,
      element: 'C',
      fracPos: pos,
      radius: 0.14,
      color: ATOM_COLORS.C,
      label: '面心 CO₂ 分子 (C 原子，贡献 1/2)',
      sharingRatio: 0.5,
      locationType: 'face',
    })

    const [dx, dy, dz] = faceDirections[i] || [0.08, -0.08, -0.08]
    const o1Index = atoms.length
    atoms.push({
      id: `co2-o1-face-${i}`,
      element: 'O',
      fracPos: [pos[0] + dx, pos[1] + dy, pos[2] + dz],
      radius: 0.12,
      color: ATOM_COLORS.O,
      label: '面心 CO₂ 分子 (O 原子，随 CO₂ 均摊 1/2)',
      sharingRatio: 0.5,
      locationType: 'face',
    })

    const o2Index = atoms.length
    atoms.push({
      id: `co2-o2-face-${i}`,
      element: 'O',
      fracPos: [pos[0] - dx, pos[1] - dy, pos[2] - dz],
      radius: 0.12,
      color: ATOM_COLORS.O,
      label: '面心 CO₂ 分子 (O 原子，随 CO₂ 均摊 1/2)',
      sharingRatio: 0.5,
      locationType: 'face',
    })

    // 分子内 C=O 共价键（分子与分子之间不连接化学键杆）
    bonds.push({ fromIndex: cIndex, toIndex: o1Index, color: ATOM_COLORS.C })
    bonds.push({ fromIndex: cIndex, toIndex: o2Index, color: ATOM_COLORS.C })
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
    description:
      '分子晶体面心立方：8顶点(1) + 6面心(3)，均占 CO₂ 分子数 N=4，配位数 12。65.50% 利用率系按 CO₂ 有效范德华半径 r_vdW = 189 pm (分子体积/晶胞体积) 算得，区别于单原子 FCC 最密堆积理论极限 74%。',
  }
}
