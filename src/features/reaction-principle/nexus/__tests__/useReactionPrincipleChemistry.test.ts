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

  it('6. 多步反应能垒与决速步判定: 步骤2能垒大于步骤1能垒 (ΔEa2 > ΔEa1)', () => {
    const { result } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, catalyst: 'catalyst-b' })
    )
    expect(result.current.isMultistep).toBe(true)
    expect(result.current.stepBarriers.length).toBe(2)
    expect(result.current.stepBarriers[1].ea).toBeGreaterThan(result.current.stepBarriers[0].ea)
    expect(result.current.stepBarriers[1].isRDS).toBe(true)
    expect(result.current.rdsIndex).toBe(2)
  })

  it('7. 玻尔兹曼基准态对照: 升高温度活化分子占比增大，活化能 Ea 恒定不变', () => {
    const { result: lowT } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, temperature: 298 })
    )
    const { result: highT } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, temperature: 450 })
    )

    expect(highT.current.eaForward).toBe(lowT.current.eaForward)
    expect(highT.current.boltzmannData.activatedFraction).toBeGreaterThan(
      lowT.current.boltzmannData.activatedFraction
    )
    expect(highT.current.boltzmannData.baselineDistribution).toBeDefined()
  })

  it('8. alpha-tp 平衡转化率: 放热反应升温 α 下降，气体分子数减小反应加压 α 上升', () => {
    const { result } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, chartTab: 'alpha-tp' })
    )
    const points = result.current.alphaTpData.points
    expect(points.length).toBeGreaterThan(5)

    // 升温转化率单调递减
    const firstPoint = points[0]
    const lastPoint = points[points.length - 1]
    expect(firstPoint.alphaLowP).toBeGreaterThan(lastPoint.alphaLowP)

    // 同温下高压转化率高于低压 (P2 > P1)
    expect(firstPoint.alphaHighP).toBeGreaterThan(firstPoint.alphaLowP)
  })
})

