import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useOrganicQuantitative } from '../useOrganicQuantitative'

describe('useOrganicQuantitative', () => {
  it('should correctly calculate consumption for aspirin-like molecule (1 phenol-ester + 1 carboxyl)', () => {
    // 阿司匹林结构类似物：1 个酚酯基 (-COO-Ar) + 1 个羧基 (-COOH)
    const { result } = renderHook(() =>
      useOrganicQuantitative({
        'phenol-ester': 1,
        'carboxyl-cooh': 1,
      })
    )
    // 酚酯消耗 2 NaOH, 羧基消耗 1 NaOH -> 总计 3 NaOH
    expect(result.current.NaOH).toBe(3)
    // 羧基消耗 1 NaHCO3 -> 总计 1 NaHCO3, 产生 1 mol CO2
    expect(result.current.NaHCO3).toBe(1)
    expect(result.current.gasCO2).toBe(1)
    // 羧基消耗 1 Na, 产生 0.5 mol H2
    expect(result.current.Na).toBe(1)
    expect(result.current.gasH2).toBe(0.5)
  })

  it('should correctly calculate consumption for 1 mol alkene + 1 mol aldehyde', () => {
    const { result } = renderHook(() =>
      useOrganicQuantitative({
        'alkene-c=c': 1,
        'aldehyde-cho': 1,
      })
    )
    // 碳碳双键加 1 Br2, 醛基氧化消耗 1 Br2 -> 总计 2 Br2
    expect(result.current.Br2).toBe(2)
    // 碳碳双键加 1 H2, 醛基加 1 H2 -> 总计 2 H2
    expect(result.current.H2).toBe(2)
  })
})
