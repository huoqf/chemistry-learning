/**
 * CsCl 晶胞数据构建
 */

import { ATOM_COLORS } from '@/theme'
import type { CrystalTypeData, AtomSpec, BondSpec } from '../types'
import { getCornerFracs } from '../helpers'

export function createCsClData(): CrystalTypeData {
  const atoms: AtomSpec[] = []

  // Cl⁻ 占 8 顶点 (8 x 1/8 = 1)
  getCornerFracs().forEach((pos, i) => {
    atoms.push({
      id: `cl-corner-${i}`,
      element: 'Cl⁻',
      fracPos: pos,
      radius: 0.24,
      color: ATOM_COLORS.Cl,
      label: '顶点 Cl⁻ (贡献 1/8)',
      sharingRatio: 0.125,
      locationType: 'corner',
    })
  })

  // Cs⁺ 占 1 体心 (1 x 1 = 1)，使用 ATOM_COLORS.K (钾/铯深紫系 Token)
  atoms.push({
    id: 'cs-body-0',
    element: 'Cs⁺',
    fracPos: [0.5, 0.5, 0.5] as const,
    radius: 0.26,
    color: ATOM_COLORS.K,
    label: '体心 Cs⁺ (贡献 1)',
    sharingRatio: 1,
    locationType: 'body',
  })

  // 配位连线 (体心 Cs⁺ 到 8 个顶点 Cl⁻)
  const bonds: BondSpec[] = []
  for (let i = 0; i < 8; i++) {
    bonds.push({ fromIndex: 8, toIndex: i })
  }

  return {
    id: 'cscl',
    name: 'CsCl (氯化铯晶体)',
    formula: 'CsCl',
    cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
    defaultA: 412,
    molarMass: 168.36,
    zValue: 1,
    coordNumber: 8,
    packingEfficiency: 68.0,
    atoms,
    bonds,
    description: '简单立方结构：Cl⁻ 占据 8 个顶点，Cs⁺ 占据体心，N(Cs⁺)=1, N(Cl⁻)=1',
  }
}
