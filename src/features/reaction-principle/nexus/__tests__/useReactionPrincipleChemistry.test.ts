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

  it('6. 多步反应能垒与决速步判定: 步骤2能垒大于步骤1能垒 (ΔEa2 > ΔEa1) 且为视觉最高峰', () => {
    const { result } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, catalyst: 'catalyst-b' })
    )
    expect(result.current.isMultistep).toBe(true)
    expect(result.current.stepBarriers.length).toBe(2)
    const step1 = result.current.stepBarriers[0]
    const step2 = result.current.stepBarriers[1]
    expect(step2.ea).toBeGreaterThan(step1.ea)
    expect(step2.isRDS).toBe(true)
    expect(result.current.rdsIndex).toBe(2)

    // TS2 势能 (121) 必须高于 TS1 (113)，决速步与最高峰视觉自洽
    expect(step2.toY).toBeGreaterThan(step1.toY)
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

  it('8. alpha-tp 平衡转化率: 放热反应升温 α 下降，气体分子数减小反应加压 α 上升，且 P=1.0 时点线精确重合', () => {
    const { result } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, chartTab: 'alpha-tp', pressure: 1.0, temperature: 280 })
    )
    const { points, currentAlpha } = result.current.alphaTpData
    expect(points.length).toBeGreaterThan(5)

    // 升温转化率单调递减
    const firstPoint = points[0]
    const lastPoint = points[points.length - 1]
    expect(firstPoint.alphaLowP).toBeGreaterThan(lastPoint.alphaLowP)

    // 同温下高压转化率高于低压 (P2 > P1)
    expect(firstPoint.alphaHighP).toBeGreaterThan(firstPoint.alphaLowP)

    // 关键一致性：在 P = 1.0 atm 时，滑块当前点 alpha 必须与当前温度下的 alphaLowP 理论线精确吻合
    const matchingPoint = points.find((p) => p.temperature === 280)
    expect(matchingPoint).toBeDefined()
    if (matchingPoint) {
      expect(currentAlpha).toBeCloseTo(matchingPoint.alphaLowP, 1)
    }
  })

  it('9. 范特霍夫截距由 ΔS° 严格决定 (C = ΔS°/R)，Kc 落在真实量级', () => {
    const { result } = renderHook(() => useReactionPrincipleChemistry(defaultParams))
    const { vantHoffData, system } = result.current

    // 截距等于 ΔS°/R，不再是三体系共用的硬编码 -12
    expect(vantHoffData.intercept).toBeCloseTo(system.deltaS / 8.314, 1)

    // currentLnK 必须与解析式逐项吻合
    const expectedLnK = (-system.deltaH * 1000) / (8.314 * 298) + system.deltaS / 8.314
    expect(vantHoffData.currentLnK).toBeCloseTo(expectedLnK, 1)

    // 298 K 下 2NO₂ ⇌ N₂O₄ 的 Kc 应为个位数~十位数量级；
    // 若截距被硬编码为 -12，则得 Kc ≈ 6.5×10⁴（量级严重失真）
    expect(vantHoffData.currentKc).toBeGreaterThan(0.5)
    expect(vantHoffData.currentKc).toBeLessThan(100)

    // 三点共线：斜率必须等于 -ΔH/R（栅格取整带来 ~1% 误差，阈值放宽至 5%）
    const pts = vantHoffData.points
    const a = pts[0]
    const b = pts[pts.length - 1]
    const slope = (b.lnK - a.lnK) / (b.invT - a.invT)
    const expectedSlope = (-system.deltaH * 1000) / 8.314
    expect(Math.abs(slope - expectedSlope) / expectedSlope).toBeLessThan(0.05)
  })

  it('10. 玻尔兹曼分布峰值严格位于 E = kT/2（298 K → 12.7 kJ/mol），升温峰位右移', () => {
    const { result } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, temperature: 298 })
    )
    const { boltzmannData } = result.current
    expect(boltzmannData.peakEnergy).toBeCloseTo(12.7, 1)

    // 分布数组的实际极大值栅格点必须贴近 kT/2（采样步长 1.5，允许 ±1.5）
    const peak = boltzmannData.distribution.reduce((m, d) => (d.fraction > m.fraction ? d : m))
    expect(Math.abs(peak.energy - boltzmannData.peakEnergy)).toBeLessThanOrEqual(1.5)

    const { result: hot } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, temperature: 450 })
    )
    expect(hot.current.boltzmannData.peakEnergy).toBeGreaterThan(boltzmannData.peakEnergy)
    expect(hot.current.boltzmannData.peakEnergy).toBeCloseTo(19.1, 1)
  })

  it('11. 多步催化路径图与右屏四个数完全自洽（表观 Ea 由最高峰唯一决定）', () => {
    const { result } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, catalyst: 'catalyst-b' })
    )
    const { tsPoints, stepBarriers, eaForward, eaReverse, system } = result.current

    const reactantY = tsPoints[0].y
    const productY = tsPoints[tsPoints.length - 1].y
    const ts2 = tsPoints.find((p) => p.label?.includes('TS2'))
    expect(ts2).toBeDefined()

    // 表观正活化能 = 最高峰 − 反应物；表观逆活化能 = 最高峰 − 产物
    expect(eaForward).toBeCloseTo(ts2!.y - reactantY, 1)
    expect(eaReverse).toBeCloseTo(ts2!.y - productY, 1)
    expect(eaForward - eaReverse).toBeCloseTo(system.deltaH, 1)

    // 图中标注的分步能垒必须与折线取点一致
    expect(stepBarriers[0].toY).toBeCloseTo(tsPoints[1].y, 5)
    expect(stepBarriers[1].toY).toBeCloseTo(ts2!.y, 5)
    // 决速步（第 2 步）在视觉上必须是最高峰
    expect(stepBarriers[1].toY).toBeGreaterThan(stepBarriers[0].toY)
  })

  it('12. α-T-P 曲线标签与所用压强常量一一对应（防"标签与公式脱钩"）', () => {
    const { result } = renderHook(() =>
      useReactionPrincipleChemistry({ ...defaultParams, chartTab: 'alpha-tp' })
    )
    const d = result.current.alphaTpData
    expect(d.lowPressureLabel).toContain('1.0')
    expect(d.highPressureLabel).toContain('3.5')
  })
})
