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

  it('酚羟基 + 醛基 复合体系定量：基团独立累加消耗 4 mol Br2 (3 取代 + 1 氧化) 与析出 2 mol Ag', () => {
    const { result } = renderHook(() =>
      useOrganicQuantitative({
        'phenol-oh': 1,
        'aldehyde-cho': 1,
      })
    )
    // 通用官能团独立累加加和：标准酚羟基 3 Br2 (邻对位三取代) + 醛基氧化 1 Br2 = 总计 4 Br2
    expect(result.current.Br2).toBe(4)
    expect(result.current.precipitateAg).toBe(2)
    expect(result.current.precipitateCu2O).toBe(1)
    expect(result.current.NaOH).toBe(1) // 酚羟基消耗 1 NaOH
    expect(result.current.Na).toBe(1) // 酚羟基消耗 1 Na 放 0.5 H2
    expect(result.current.H2).toBe(1) // 醛基还原消耗 1 H2
  })

  it('水杨醛母题特异性：醛基占据邻位，苯环仅剩 2 处取代，真实总计消耗 3 mol Br2', () => {
    const { result } = renderHook(() =>
      useOrganicQuantitative(
        {
          'phenol-oh': 1,
          'aldehyde-cho': 1,
        },
        'salicylaldehyde'
      )
    )
    // 水杨醛母题校正：2 取代 + 1 氧化 = 3 mol Br2
    expect(result.current.Br2).toBe(3)
    expect(result.current.precipitateAg).toBe(2)
    expect(result.current.breakdowns.Br2[0].reason).toContain('水杨醛')
  })

  it('水杨酸甲酯母题 (1 酚-OH + 1 普通醇酯)：水解共消耗 2 mol NaOH，遇 Na 放 0.5 mol H2', () => {
    const { result } = renderHook(() =>
      useOrganicQuantitative({
        'phenol-oh': 1,
        'ester-coor': 1,
      })
    )
    // 酚羟基中和 1 NaOH + 醇酯水解 1 NaOH = 总计 2 NaOH
    expect(result.current.NaOH).toBe(2)
    expect(result.current.Na).toBe(1)
    expect(result.current.gasH2).toBe(0.5)
    expect(result.current.NaHCO3).toBe(0) // 均不与 NaHCO3 反应
  })

  it('醇 vs 醚 官能团异构体系：乙醇放气 vs 二甲醚化学惰性 0 消耗', () => {
    const { result: ethanolRes } = renderHook(() =>
      useOrganicQuantitative({
        'alcohol-oh': 1,
      })
    )
    expect(ethanolRes.current.Na).toBe(1)
    expect(ethanolRes.current.gasH2).toBe(0.5)

    const { result: etherRes } = renderHook(() =>
      useOrganicQuantitative({
        'ether-bond': 1,
      })
    )
    expect(etherRes.current.Na).toBe(0)
    expect(etherRes.current.NaOH).toBe(0)
    expect(etherRes.current.gasH2).toBe(0)
  })

  it('碳酸二甲酯水解：1 mol 碳酸酯基消耗 2 mol NaOH', () => {
    const { result } = renderHook(() =>
      useOrganicQuantitative({
        'carbonate-ester': 1,
      })
    )
    expect(result.current.NaOH).toBe(2)
    expect(result.current.breakdowns.NaOH).toHaveLength(1)
    expect(result.current.breakdowns.NaOH[0].reason).toContain('碳酸酯基水解')
  })
})
