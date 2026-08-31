import { describe, it, expect } from 'vitest'
import { FUNCTIONAL_GROUPS, GAOKAO_CLUES } from '../constants'
import { useOrganicQuantitative } from '../hooks/useOrganicQuantitative'
import { renderHook } from '@testing-library/react'

describe('有机官能团定性特征与定量转化反应矩阵数据与计算审计', () => {
  it('应包含 10 大新高考高频官能团与核心题眼', () => {
    expect(FUNCTIONAL_GROUPS.length).toBe(10)
    const ids = FUNCTIONAL_GROUPS.map((g) => g.id)
    expect(ids).toContain('alkene-c=c')
    expect(ids).toContain('alkyne-c#c')
    expect(ids).toContain('alcohol-oh')
    expect(ids).toContain('phenol-oh')
    expect(ids).toContain('aldehyde-cho')
    expect(ids).toContain('carboxyl-cooh')
    expect(ids).toContain('ester-coor')
    expect(ids).toContain('phenol-ester')
    expect(ids).toContain('halo-halogen')
    expect(ids).toContain('peptide-amide')

    expect(GAOKAO_CLUES.length).toBeGreaterThanOrEqual(6)
  })

  it('酚酯水解必须消耗 2 mol NaOH，普通酯水解消耗 1 mol NaOH', () => {
    const phenolEster = FUNCTIONAL_GROUPS.find((g) => g.id === 'phenol-ester')
    const normalEster = FUNCTIONAL_GROUPS.find((g) => g.id === 'ester-coor')

    expect(phenolEster?.consumptions.NaOH).toBe(2)
    expect(normalEster?.consumptions.NaOH).toBe(1)
  })

  it('醇羟基只与 Na 反应，不与 NaOH / NaHCO3 反应', () => {
    const alcoholOh = FUNCTIONAL_GROUPS.find((g) => g.id === 'alcohol-oh')
    expect(alcoholOh?.consumptions.Na).toBe(1)
    expect(alcoholOh?.consumptions.NaOH).toBe(0)
    expect(alcoholOh?.consumptions.NaHCO3).toBe(0)
  })

  it('复杂多官能团混合物 (2 酚酯 + 1 羧基 + 1 双键) 定量反应计算与明细拆解', () => {
    const { result } = renderHook(() =>
      useOrganicQuantitative({
        'phenol-ester': 2, // 消耗 4 NaOH
        'carboxyl-cooh': 1, // 消耗 1 NaOH, 1 NaHCO3, 1 Na
        'alkene-c=c': 1, // 消耗 1 Br2, 1 H2
      })
    )

    expect(result.current.NaOH).toBe(5)
    expect(result.current.NaHCO3).toBe(1)
    expect(result.current.Na).toBe(1)
    expect(result.current.Br2).toBe(1)
    expect(result.current.H2).toBe(1)
    expect(result.current.gasCO2).toBe(1)
    expect(result.current.gasH2).toBe(0.5)

    // 验证拆解数据
    expect(result.current.breakdowns.NaOH).toHaveLength(2)
    expect(result.current.breakdowns.NaOH[0].totalMol + result.current.breakdowns.NaOH[1].totalMol).toBe(5)
  })
})

