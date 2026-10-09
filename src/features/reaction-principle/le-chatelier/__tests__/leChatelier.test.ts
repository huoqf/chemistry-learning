import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useLeChatelierChemistry } from '../hooks/useLeChatelierChemistry'
import { buildLeChatelierQuantities } from '../../../../data/quantities/reaction-principle/leChatelier'

describe('useLeChatelierChemistry', () => {
  it('应当在基准状态下正确计算平衡常数 K 与 NO2 浓度', () => {
    const { result } = renderHook(() =>
      useLeChatelierChemistry({
        temp: 298,
        pressure: 1.0,
        addedNO2: 0,
        time: 5.0,
      })
    )

    expect(result.current.K).toBe(2.0)
    expect(result.current.cNO2).toBeGreaterThan(0)
    expect(result.current.cN2O4).toBeGreaterThan(0)
    expect(result.current.history.length).toBeGreaterThan(0)
  })

  it('升温应当导致平衡常数 K 减小 (放热反应逆向移动)', () => {
    const { result: lowTemp } = renderHook(() =>
      useLeChatelierChemistry({ temp: 298, pressure: 1.0, addedNO2: 0, time: 5.0 })
    )
    const { result: highTemp } = renderHook(() =>
      useLeChatelierChemistry({ temp: 350, pressure: 1.0, addedNO2: 0, time: 5.0 })
    )

    expect(highTemp.current.K).toBeLessThan(lowTemp.current.K)
  })

  it('加压扰动 (pressure = 2.0): 气体分子数减小反应正向移动 (vForward > vReverse)', () => {
    const { result } = renderHook(() =>
      useLeChatelierChemistry({ temp: 298, pressure: 2.0, addedNO2: 0, time: 0.1 })
    )

    // 刚加压瞬间，体积缩小导致浓度升高，2NO2 -> N2O4 正反应速率增幅大于逆反应
    expect(result.current.vForward).toBeGreaterThan(result.current.vReverse)
    expect(result.current.shiftDirection).toBe('forward')
    expect(result.current.volumeRatio).toBeLessThan(1.0)
  })

  it('增加反应物 (addedNO2 = 1.0): 浓度增大推动正反应速率显著大于逆反应速率', () => {
    const { result } = renderHook(() =>
      useLeChatelierChemistry({ temp: 298, pressure: 1.0, addedNO2: 1.0, time: 0.1 })
    )

    expect(result.current.vForward).toBeGreaterThan(result.current.vReverse)
    expect(result.current.shiftDirection).toBe('forward')
  })

  it('P1-9 回归锁：升温时正、逆反应速率必须"都"增大（不得出现逆速率反降）', () => {
    const { result: low } = renderHook(() =>
      useLeChatelierChemistry({ temp: 298, pressure: 1.0, addedNO2: 0, time: 5.0 })
    )
    const { result: high } = renderHook(() =>
      useLeChatelierChemistry({ temp: 350, pressure: 1.0, addedNO2: 0, time: 5.0 })
    )

    expect(high.current.vForward).toBeGreaterThan(low.current.vForward)
    expect(high.current.vReverse).toBeGreaterThan(low.current.vReverse)
  })

  it('P1-9 回归锁：升温时逆反应速率增幅大于正反应速率（Ea₁ < Ea₂）', () => {
    const { result: low } = renderHook(() =>
      useLeChatelierChemistry({ temp: 298, pressure: 1.0, addedNO2: 0, time: 5.0 })
    )
    const { result: high } = renderHook(() =>
      useLeChatelierChemistry({ temp: 350, pressure: 1.0, addedNO2: 0, time: 5.0 })
    )

    expect(high.current.vReverse / low.current.vReverse).toBeGreaterThan(
      high.current.vForward / low.current.vForward
    )
  })
})

describe('buildLeChatelierQuantities', () => {
  it('应当生成涵盖高考要点的化学量数组', () => {
    const quantities = buildLeChatelierQuantities({ temp: 298, pressure: 1.0, addedNO2: 0 }, 5.0)
    expect(quantities.length).toBe(5)
    expect(quantities.some((q) => q.key === 'cNO2')).toBe(true)
    expect(quantities.some((q) => q.key === 'temp')).toBe(true)
    expect(quantities.some((q) => q.key === 'K')).toBe(true)
  })
})

describe('中屏 hook 与右屏量面板同源（结构锁）', () => {
  it('同一组参数下两处的 c(NO₂)、c(N₂O₄)、Qc、K 完全一致', () => {
    // 覆盖滑块全量程：temp 273~398 K、pressure 0.5~3.0、addedNO2 0~2.0
    const cases: Array<{ temp: number; pressure: number; addedNO2: number; time: number }> = [
      { temp: 273, pressure: 0.5, addedNO2: 0, time: 0 },
      { temp: 298, pressure: 1.0, addedNO2: 0, time: 5.0 },
      { temp: 398, pressure: 3.0, addedNO2: 2.0, time: 0.1 },
      { temp: 350, pressure: 0.7, addedNO2: 1.3, time: 7.5 },
    ]

    for (const c of cases) {
      const { result } = renderHook(() => useLeChatelierChemistry(c))
      const quantities = buildLeChatelierQuantities(c, c.time)
      const pick = (key: string) => quantities.find((q) => q.key === key)?.value

      expect(pick('cNO2')).toBe(result.current.cNO2)
      expect(pick('cN2O4')).toBe(result.current.cN2O4)
      expect(pick('Qc')).toBe(result.current.Qc)
      expect(pick('K')).toBe(result.current.K)
    }
  })
})
