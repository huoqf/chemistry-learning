import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useIndustrialFlowChemistry } from '../useIndustrialFlowChemistry'
import type { IndustrialFlowParams } from '../../types'

describe('useIndustrialFlowChemistry 工艺流程与沉淀调 pH 计算 Hook 测试', () => {
  const defaultParams: IndustrialFlowParams = {
    viewMode: 0,
    systemId: 'fe-al-mn',
    activeStep: 3,
    pH: 5.2,
    leachTemp: 60,
    crushSize: 'fine',
    oxidantAmount: 'sufficient',
    reagent: 'MnO',
    crystallizeMethod: 'cooling',
    washSolvent: 'ethanol',
  }

  it('浸出率应当随温度与破碎细度正向提升', () => {
    const { result: r1 } = renderHook(() =>
      useIndustrialFlowChemistry({
        ...defaultParams,
        leachTemp: 20,
        crushSize: 'coarse',
      })
    )
    const { result: r2 } = renderHook(() =>
      useIndustrialFlowChemistry({
        ...defaultParams,
        leachTemp: 80,
        crushSize: 'fine',
      })
    )

    expect(r2.current.leachRate).toBeGreaterThan(r1.current.leachRate)
    expect(r2.current.leachRate).toBeLessThanOrEqual(98.5)
  })

  it('Fe-Al-Mn 系统充分氧化时应正确计算 Fe³⁺、Al³⁺ 和 Mn²⁺ 的沉淀特性及安全 pH 区间', () => {
    const { result } = renderHook(() =>
      useIndustrialFlowChemistry({
        ...defaultParams,
        systemId: 'fe-al-mn',
        oxidantAmount: 'sufficient',
        pH: 5.2,
      })
    )

    expect(result.current.systemName).toContain('MnSO₄')
    expect(result.current.targetIon).toBe('Mn²⁺')
    expect(result.current.impurityIons).toEqual(['Fe³⁺', 'Al³⁺'])

    const fe3 = result.current.ions.find((i) => i.symbol === 'Fe³⁺')
    const al3 = result.current.ions.find((i) => i.symbol === 'Al³⁺')
    const mn2 = result.current.ions.find((i) => i.symbol === 'Mn²⁺')

    expect(fe3).toBeDefined()
    expect(al3).toBeDefined()
    expect(mn2).toBeDefined()

    // 验证沉淀完全 pH: Fe³⁺ ≈ 3.2, Al³⁺ ≈ 4.7
    expect(fe3?.pHEnd).toBeCloseTo(3.2, 1)
    expect(al3?.pHEnd).toBeCloseTo(4.7, 1)
    // 验证 Mn²⁺ 开始沉淀 pH ≈ 8.1
    expect(mn2?.pHStart).toBeCloseTo(8.1, 1)

    // 在 pH=5.2 下，Fe³⁺ 和 Al³⁺ 完全沉淀 (沉淀率接近 100%)，Mn²⁺ 不沉淀
    expect(fe3?.precipitateRatio).toBe(100)
    expect(al3?.precipitateRatio).toBe(100)
    expect(mn2?.precipitateRatio).toBe(0)
    expect(result.current.isPhInSafeRange).toBe(true)
  })

  it('未加氧化剂时 Fe²⁺ 开始沉淀 pH 较高，导致安全区间无法完全除铁', () => {
    const { result } = renderHook(() =>
      useIndustrialFlowChemistry({
        ...defaultParams,
        systemId: 'fe-al-mn',
        oxidantAmount: 'insufficient',
        pH: 5.2,
      })
    )

    const fe2 = result.current.ions.find((i) => i.symbol === 'Fe²⁺')
    expect(fe2).toBeDefined()
    // Fe²⁺ 在 pH=5.2 下未沉淀
    expect(fe2?.precipitateRatio).toBe(0)
  })

  it('Al(OH)₃ 在强碱条件 (pH > 10.5) 下应当发生两性溶解使铝浓度恢复', () => {
    const { result: neutralRes } = renderHook(() =>
      useIndustrialFlowChemistry({
        ...defaultParams,
        pH: 7.0,
      })
    )
    const { result: basicRes } = renderHook(() =>
      useIndustrialFlowChemistry({
        ...defaultParams,
        pH: 12.0,
      })
    )

    const alNeutral = neutralRes.current.ions.find((i) => i.symbol === 'Al³⁺')
    const alBasic = basicRes.current.ions.find((i) => i.symbol === 'Al³⁺')

    expect(alNeutral?.precipitateRatio).toBe(100)
    expect(alBasic?.cCurrent).toBeGreaterThan(alNeutral!.cCurrent)
  })

  it('生成完整的 lg c - pH 沉淀分布拟合曲线数据', () => {
    const { result } = renderHook(() => useIndustrialFlowChemistry(defaultParams))
    expect(result.current.curveData.length).toBeGreaterThan(50)
    expect(result.current.curveData[0].pH).toBe(0)
    expect(result.current.curveData[result.current.curveData.length - 1].pH).toBe(14)
  })

  it('应当为体系生成准确的元素走向追踪矩阵与不增杂试剂智能评估', () => {
    const { result: mnRes } = renderHook(() =>
      useIndustrialFlowChemistry({ ...defaultParams, systemId: 'fe-al-mn' })
    )
    expect(mnRes.current.elementFates.length).toBeGreaterThanOrEqual(4)
    const mnTarget = mnRes.current.elementFates.find((f) => f.isTarget)
    expect(mnTarget?.element).toContain('Mn')
    expect(mnTarget?.finalState).toContain('MnSO₄')

    // 软锰矿体系应首选推荐 MnO
    const mnoEval = mnRes.current.reagentEvaluations.find((r) => r.reagent === 'MnO')
    expect(mnoEval?.isRecommended).toBe(true)
    const naohEval = mnRes.current.reagentEvaluations.find((r) => r.reagent === 'NaOH')
    expect(naohEval?.isRecommended).toBe(false)

    // 铜锌废渣体系应首选推荐 ZnO
    const { result: znRes } = renderHook(() =>
      useIndustrialFlowChemistry({ ...defaultParams, systemId: 'fe-cu-zn' })
    )
    const znoEval = znRes.current.reagentEvaluations.find((r) => r.reagent === 'ZnO')
    expect(znoEval?.isRecommended).toBe(true)
  })

  it('应当随 activeStep 切换提供工序专属考点与动力学/溶解度微观数据', () => {
    // 聚焦工序 1 (酸浸)
    const { result: step1Res } = renderHook(() =>
      useIndustrialFlowChemistry({ ...defaultParams, activeStep: 1 })
    )
    expect(step1Res.current.activeStepInfo.title).toContain('工序一')
    expect(step1Res.current.activeStepInfo.coreQuestion).toContain('提高矿石中金属的浸出率')
    expect(step1Res.current.leachCurveData.length).toBeGreaterThan(5)

    // 聚焦工序 3 (沉淀)
    const { result: step3Res } = renderHook(() =>
      useIndustrialFlowChemistry({ ...defaultParams, activeStep: 3 })
    )
    expect(step3Res.current.activeStepInfo.title).toContain('工序三')
    expect(step3Res.current.activeStepInfo.focusSubject).toContain('Ksp')

    // 聚焦工序 4 (结晶)
    const { result: step4Res } = renderHook(() =>
      useIndustrialFlowChemistry({ ...defaultParams, activeStep: 4 })
    )
    expect(step4Res.current.activeStepInfo.title).toContain('工序四')
    expect(step4Res.current.activeStepInfo.coreQuestion).toContain('趁热过滤')
    expect(step4Res.current.solubilityCurveData.length).toBeGreaterThan(5)
  })

  it('应当正确计算全流程元素质量守恒流并保持 100% 绝对闭环', () => {
    const { result } = renderHook(() =>
      useIndustrialFlowChemistry({ ...defaultParams, pH: 5.2 })
    )
    const mb = result.current.massBalance
    expect(mb).toBeDefined()
    expect(mb.targetElement).toBe('Mn')
    expect(mb.feedInRatio).toBe(100.0)

    // 验证全流程四路质量百分比绝对闭环守恒为 100.0%
    const total =
      mb.leachLossRatio +
      mb.precipitateLossRatio +
      mb.motherLiquorRatio +
      mb.crystallizeYieldRatio
    expect(Math.abs(total - 100.0)).toBeLessThan(0.01)
    expect(mb.crystallizeYieldRatio).toBeGreaterThan(70)
  })
})

