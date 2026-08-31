import { describe, it, expect } from 'vitest'
import { FUNCTIONAL_GROUPS, GAOKAO_CLUES } from '../constants'
import { useOrganicQuantitative } from '../hooks/useOrganicQuantitative'
import { renderHook } from '@testing-library/react'

describe('有机官能团定性特征与定量转化反应矩阵数据与计算审计', () => {
  it('应包含 12 大新高考高频官能团与核心题眼', () => {
    expect(FUNCTIONAL_GROUPS.length).toBe(12)
    const ids = FUNCTIONAL_GROUPS.map((g) => g.id)
    expect(ids).toContain('alkene-c=c')
    expect(ids).toContain('alkyne-c#c')
    expect(ids).toContain('alcohol-oh')
    expect(ids).toContain('phenol-oh')
    expect(ids).toContain('aldehyde-cho')
    expect(ids).toContain('ketone-co')
    expect(ids).toContain('carboxyl-cooh')
    expect(ids).toContain('ester-coor')
    expect(ids).toContain('phenol-ester')
    expect(ids).toContain('halo-halogen')
    expect(ids).toContain('peptide-amide')
    expect(ids).toContain('amino-nh2')

    expect(GAOKAO_CLUES.length).toBeGreaterThanOrEqual(8)
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

  it('酮羰基消耗 1 mol H2 加氢还原，但不发生银镜反应', () => {
    const ketone = FUNCTIONAL_GROUPS.find((g) => g.id === 'ketone-co')
    expect(ketone?.consumptions.H2).toBe(1)
    expect(ketone?.consumptions.Br2).toBe(0)
    expect(ketone?.qualitativeFeatures?.silverOrFehling).toContain('不发生银镜')
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

  it('12 大官能团均应具备完整的定性检验试剂、现象与定性特征标注', () => {
    for (const g of FUNCTIONAL_GROUPS) {
      expect(g.testReagents.length).toBeGreaterThan(0)
      expect(g.testPhenomenon.length).toBeGreaterThan(0)
      expect(g.testEquation.length).toBeGreaterThan(0)
      expect(g.qualitativeFeatures).toBeDefined()
      expect(g.qualitativeFeatures?.reactionTypes?.length).toBeGreaterThan(0)
    }

    const aldehyde = FUNCTIONAL_GROUPS.find((g) => g.id === 'aldehyde-cho')
    expect(aldehyde?.qualitativeFeatures?.silverOrFehling).toContain('2 mol Ag')
  })

  it('苯酚特异性定量：消耗 3 mol 浓溴水、0.5 mol Na2CO3 且不出气', () => {
    const phenol = FUNCTIONAL_GROUPS.find((g) => g.id === 'phenol-oh')
    expect(phenol?.consumptions.Br2).toBe(3)
    expect(phenol?.consumptions.Na2CO3).toBe(0.5)
    expect(phenol?.consumptions.NaHCO3).toBe(0)
  })

  it('甲酸苯酯母题模型：1 酚酯 + 1 醛基，消耗 2 NaOH 并生成 2 mol Ag 银镜', () => {
    const { result } = renderHook(() =>
      useOrganicQuantitative({
        'phenol-ester': 1,
        'aldehyde-cho': 1,
      })
    )
    expect(result.current.NaOH).toBe(2)
    expect(result.current.precipitateAg).toBe(2)
    expect(result.current.Br2).toBe(1) // 醛基被溴水氧化
    expect(result.current.H2).toBe(1) // 醛基加氢还原
  })
})

