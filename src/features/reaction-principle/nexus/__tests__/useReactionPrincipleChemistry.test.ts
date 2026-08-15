import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useReactionPrincipleChemistry } from '../hooks/useReactionPrincipleChemistry'
import type { NexusParams } from '../types'

describe('useReactionPrincipleChemistry 化学逻辑核查与测试', () => {
  const defaultParams: NexusParams = {
    chartTab: 'le-chatelier',
    reactionId: 'no2-n2o4',
    catalyst: 'none',
    temperature: 298,
    pressure: 1.0,
    addedReactant: 0,
    inertGasMode: 'none',
  }

  it('1. 活化能与反应热关系: Ea(逆) - Ea(正) = |ΔH|', () => {
    const { result } = renderHook(() => useReactionPrincipleChemistry(defaultParams))
    const { eaForward, eaReverse, system } = result.current

    expect(system.deltaH).toBe(-57.2)
    expect(eaReverse - eaForward).toBeCloseTo(-system.deltaH, 1)
  })

  it('2. 催化剂同等降低正逆活化能且不改变 ΔH', () => {
    const { result: withoutCat } = renderHook(() => useReactionPrincipleChemistry(defaultParams))
    const { result: withCatA } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, catalyst: 'catalyst-a' })
    )

    expect(withCatA.current.eaForward).toBeLessThan(withoutCat.current.eaForward)
    expect(withCatA.current.eaReverse).toBeLessThan(withoutCat.current.eaReverse)
    expect(withCatA.current.eaReverse - withCatA.current.eaForward).toBeCloseTo(-withCatA.current.system.deltaH, 1)
  })

  it('3. 增压扰动: 对于气体分子数减小的体系 (2NO2 ⇌ N2O4)，增压时 vF 增长幅度大于 vR，平衡正向移动', () => {
    const { result } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, pressure: 2.0 })
    )
    const perturbPoint = result.current.history.find((p) => p.time === 4.0)
    expect(perturbPoint).toBeDefined()
    if (perturbPoint) {
      expect(perturbPoint.vForward).toBeGreaterThan(perturbPoint.vReverse)
    }
  })

  it('4. 升温扰动: 放热反应升温时 vR 增大幅度大于 vF，平衡逆向移动', () => {
    const { result } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, temperature: 398 })
    )
    const perturbPoint = result.current.history.find((p) => p.time === 4.0)
    expect(perturbPoint).toBeDefined()
    if (perturbPoint) {
      expect(perturbPoint.vReverse).toBeGreaterThan(perturbPoint.vForward)
    }
  })

  it('5. 恒温恒压充入惰性气体 (等效减压): 气体分子数减小反应平衡逆移，vF < vR', () => {
    const { result } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, inertGasMode: 'constant-p' })
    )
    const perturbPoint = result.current.history.find((p) => p.time === 4.0)
    expect(perturbPoint).toBeDefined()
    if (perturbPoint) {
      expect(perturbPoint.vReverse).toBeGreaterThan(perturbPoint.vForward)
    }
  })
})
