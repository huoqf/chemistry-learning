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

  it('当 pH 超过安全上限时，沉淀夹带损失应当显著激增但质量守恒依然绝对闭环', () => {
    // 正常安全 pH 下
    const { result: safeRes } = renderHook(() =>
      useIndustrialFlowChemistry({ ...defaultParams, pH: 5.2 })
    )
    // 超过安全上限 (例如 pH=9.5，Mn2+ 发生严重沉淀损失)
    const { result: highRes } = renderHook(() =>
      useIndustrialFlowChemistry({ ...defaultParams, pH: 9.5 })
    )

    const mbSafe = safeRes.current.massBalance
    const mbHigh = highRes.current.massBalance

    expect(mbHigh.precipitateLossRatio).toBeGreaterThan(mbSafe.precipitateLossRatio)
    expect(mbHigh.crystallizeYieldRatio).toBeLessThan(mbSafe.crystallizeYieldRatio)

    const totalHigh =
      mbHigh.leachLossRatio +
      mbHigh.precipitateLossRatio +
      mbHigh.motherLiquorRatio +
      mbHigh.crystallizeYieldRatio
    expect(Math.abs(totalHigh - 100.0)).toBeLessThan(0.01)
  })

  it('Ti-Fe 钛白粉体系应正确反映水解分离酸度区间与铁屑还原逆向考点', () => {
    const { result } = renderHook(() =>
      useIndustrialFlowChemistry({
        ...defaultParams,
        systemId: 'ti-fe',
        pH: 1.5,
        activeStep: 2,
      })
    )

    expect(result.current.systemName).toContain('钛铁矿')
    expect(result.current.targetIon).toBe('TiO²⁺')
    expect(result.current.hasSafeRange).toBe(true)
    expect(result.current.safePhRange).toEqual([1.0, 2.5])
    expect(result.current.isPhInSafeRange).toBe(true)
    expect(result.current.safeRangeDescription).toContain('钛酰离子稀释水解最佳酸度区间')

    // 检查工序二专属考点
    expect(result.current.activeStepInfo.coreReaction).toContain('2Fe³⁺ + Fe = 3Fe²⁺')
    expect(result.current.activeStepInfo.scoringAnswer).toContain('Fe³⁺ 极易水解')

    // 检查试剂评估：硫酸介质严禁使用 CaCO3 (生成微溶硫酸钙)
    const caco3Eval = result.current.reagentEvaluations.find((r) => r.reagent === 'CaCO3')
    expect(caco3Eval?.isRecommended).toBe(false)
    expect(caco3Eval?.warning).toContain('CaSO₄')
  })

  it('Ni-Co-Li 锂电池回收体系应具备清晰的铁铝去除区间及 H₂O₂ 还原考点', () => {
    const { result } = renderHook(() =>
      useIndustrialFlowChemistry({
        ...defaultParams,
        systemId: 'ni-co-li',
        pH: 5.0,
        activeStep: 2,
      })
    )

    expect(result.current.systemName).toContain('锂电池')
    expect(result.current.hasSafeRange).toBe(true)
    // 铁铝完全沉淀 (pH 4.7) 到 Co/Ni 开始析出 (约 7.1)
    expect(result.current.safePhRange[0]).toBeCloseTo(4.7, 1)
    expect(result.current.safePhRange[1]).toBeGreaterThanOrEqual(7.0)
    expect(result.current.isPhInSafeRange).toBe(true)

    // 工序二应考查 H₂O₂ 还原高价钴
    expect(result.current.activeStepInfo.scoringAnswer).toContain('还原剂')
  })

  it('Mg-Ca 卤水白云石体系应准确推荐 MgO 并不增杂去除铁铝', () => {
    const { result } = renderHook(() =>
      useIndustrialFlowChemistry({
        ...defaultParams,
        systemId: 'mg-ca',
        pH: 5.0,
      })
    )

    expect(result.current.targetIon).toBe('Mg²⁺')
    expect(result.current.hasSafeRange).toBe(true)
    expect(result.current.isPhInSafeRange).toBe(true)

    const mgoEval = result.current.reagentEvaluations.find((r) => r.reagent === 'MgO')
    expect(mgoEval?.isRecommended).toBe(true)
    expect(mgoEval?.reaction).toContain('MgO + 2H⁺ = Mg²⁺ + H₂O')

    const naohEval = result.current.reagentEvaluations.find((r) => r.reagent === 'NaOH')
    expect(naohEval?.isRecommended).toBe(false)
  })

  it('pH 偏低与偏高时应准确给出化学指导说明', () => {
    // 偏低：杂质未完全沉淀
    const { result: lowRes } = renderHook(() =>
      useIndustrialFlowChemistry({ ...defaultParams, pH: 2.0 })
    )
    expect(lowRes.current.isPhInSafeRange).toBe(false)
    expect(lowRes.current.safeRangeDescription).toContain('偏低')

    // 偏高：超过目标离子析出阈值造成沉淀损失
    const { result: highRes } = renderHook(() =>
      useIndustrialFlowChemistry({ ...defaultParams, pH: 10.0 })
    )
    expect(highRes.current.isPhInSafeRange).toBe(false)
    expect(highRes.current.safeRangeDescription).toContain('偏高')
  })
})

