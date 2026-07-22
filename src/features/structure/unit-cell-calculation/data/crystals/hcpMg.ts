/**
 * Mg (六方最密堆积 HCP) 晶胞数据构建
 * 标准平行六面体六方晶胞：4 个 120° 顶角(4×1/6) + 4 个 60° 顶角(4×1/12) + 1 体内原子(独占 1)，Z = 2
 */

import { ATOM_COLORS } from '@/theme'
import type { CrystalTypeData, AtomSpec, BondSpec } from '../types'

export function createHcpMgData(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // ===== 平行六面体晶胞表示 HCP =====
  // 4 个 120° 顶角原子 (4 × 1/6 = 2/3)
  // 4 个 60° 顶角原子 (4 × 1/12 = 1/3)
  // 1 个体内原子 (1 × 1 = 1)
  // 合计顶点贡献 = 2/3 + 1/3 = 1，晶胞均占分子数 Z = 2

  // 120° 顶角坐标：(0,0,0), (1,1,0), (0,0,1), (1,1,1)
  const deg120Coords: Array<[number, number, number]> = [
    [0, 0, 0],
    [1, 1, 0],
    [0, 0, 1],
    [1, 1, 1],
  ]

  // 60° 顶角坐标：(1,0,0), (0,1,0), (1,0,1), (0,1,1)
  const deg60Coords: Array<[number, number, number]> = [
    [1, 0, 0],
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 1],
  ]

  deg120Coords.forEach((fracPos, idx) => {
    atoms.push({
      id: `mg-corner-120-${idx}`,
      element: 'Mg',
      fracPos,
      radius: 0.22,
      color: ATOM_COLORS.Mg,
      label: `120° 顶角 Mg (6 晶胞共享，贡献 1/6)`,
      sharingRatio: 1 / 6,
      locationType: 'corner',
    })
  })

  deg60Coords.forEach((fracPos, idx) => {
    atoms.push({
      id: `mg-corner-60-${idx}`,
      element: 'Mg',
      fracPos,
      radius: 0.22,
      color: ATOM_COLORS.Mg,
      label: `60° 顶角 Mg (12 晶胞共享，贡献 1/12)`,
      sharingRatio: 1 / 12,
      locationType: 'corner',
    })
  })

  // 体内 Mg 原子 (独占 1)
  atoms.push({
    id: 'mg-body-0',
    element: 'Mg',
    fracPos: [2 / 3, 1 / 3, 0.5] as const,
    radius: 0.22,
    color: ATOM_COLORS.Mg,
    label: '体内 Mg (内部独占 1)',
    sharingRatio: 1,
    locationType: 'body',
  })

  // 键与边框连接
  // 原子索引顺序：
  // 0: [0,0,0](120°), 1: [1,1,0](120°), 2: [0,0,1](120°), 3: [1,1,1](120°)
  // 4: [1,0,0](60°), 5: [0,1,0](60°), 6: [1,0,1](60°), 7: [0,1,1](60°)
  // 8: [2/3, 1/3, 0.5](体内)
  const bonds: BondSpec[] = [
    // 底面菱形框: (0,0,0)-(1,0,0)-(1,1,0)-(0,1,0)-(0,0,0)
    { fromIndex: 0, toIndex: 4 }, // (0,0,0) - (1,0,0)
    { fromIndex: 4, toIndex: 1 }, // (1,0,0) - (1,1,0)
    { fromIndex: 1, toIndex: 5 }, // (1,1,0) - (0,1,0)
    { fromIndex: 5, toIndex: 0 }, // (0,1,0) - (0,0,0)
    // 顶面菱形框: (0,0,1)-(1,0,1)-(1,1,1)-(0,1,1)-(0,0,1)
    { fromIndex: 2, toIndex: 6 }, // (0,0,1) - (1,0,1)
    { fromIndex: 6, toIndex: 3 }, // (1,0,1) - (1,1,1)
    { fromIndex: 3, toIndex: 7 }, // (1,1,1) - (0,1,1)
    { fromIndex: 7, toIndex: 2 }, // (0,1,1) - (0,0,1)
    // 4 条竖直边
    { fromIndex: 0, toIndex: 2 }, // (0,0,0) - (0,0,1)
    { fromIndex: 4, toIndex: 6 }, // (1,0,0) - (1,0,1)
    { fromIndex: 1, toIndex: 3 }, // (1,1,0) - (1,1,1)
    { fromIndex: 5, toIndex: 7 }, // (0,1,0) - (0,1,1)
    // 体内原子至顶角配位连线
    { fromIndex: 8, toIndex: 0 },
    { fromIndex: 8, toIndex: 4 },
    { fromIndex: 8, toIndex: 1 },
    { fromIndex: 8, toIndex: 2 },
    { fromIndex: 8, toIndex: 6 },
    { fromIndex: 8, toIndex: 3 },
  ]

  return {
    id: 'hcp-mg',
    name: 'Mg (六方最密堆积 HCP)',
    formula: 'Mg',
    // 六方晶胞参数 (a=b, gamma=120°, c/a ≈ 1.633)
    cellParams: { a: 1, b: 1, c: 1.633, alpha: 90, beta: 90, gamma: 120 },
    defaultA: 321,
    molarMass: 24.31,
    zValue: 2,
    coordNumber: 12,
    packingEfficiency: 74.0,
    atoms,
    bonds,
    description: '六方最密堆积平行六面体晶胞：4 个 120° 顶角 (4×1/6) + 4 个 60° 顶角 (4×1/12) + 1 体内 Mg (独占 1)，Z=2，配位数 12，空间利用率 74%',
  }
}

