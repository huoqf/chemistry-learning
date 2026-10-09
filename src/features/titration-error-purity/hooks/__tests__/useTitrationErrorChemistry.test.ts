/**
 * 滴定误差分析与样品纯度产率计算单元测试
 *
 * 覆盖：
 *   1. 常见操作失误对待测液浓度 c(待) 的极值影响方向：
 *      - 滴定管未用标准液润洗 (unrinsed-burette) → V(标) 偏大 → c(待) 偏高
 *      - 锥形瓶用待测液润洗 (unrinsed-flask) → n(待) 增多 → c(待) 偏高
 *      - 锥形瓶内残留蒸馏水 (wet-flask) → n(待) 不变 → 无影响
 *      - 滴定管尖嘴气泡未赶尽 (bubble-start) → V(标) 偏大 → c(待) 偏高
 *      - 滴定终点尖嘴产生气泡 (bubble-end) → V(标) 偏小 → c(待) 偏低
 *      - 终点悬滴未下落 (hanging-drop) → V(标) 偏大 → c(待) 偏高
 *   2. 读数视线偏差 (viewAngle: 正值仰视读数偏大，负值俯视读数偏小):
 *      - 仰视 (viewAngle = 10): 终点读数偏大，测得 V(标) 偏大，结果偏高
 *      - 俯视 (viewAngle = -10): 终点读数偏小，测得 V(标) 偏小，结果偏低
 *   3. 样品纯度 w% 与反应产率计算（精确数值断言，并校验代数式所需换算因子不缺失）
 *   4. 越界保护：w% / Yield% > 100% 时不得静默截断为 100，须置 overLimit 标记
 */

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTitrationErrorChemistry } from '../useTitrationErrorChemistry'
import type { TitrationErrorParams } from '../../types'

describe('useTitrationErrorChemistry — 滴定误差与纯度产率测试', () => {
  const baseParams: TitrationErrorParams = {
    mode: 'error-analysis',
    titrationType: 'acid-base',
    errorOp: 'none',
    viewAngle: 0,
    cStandardTrue: 0.1,
    vSampleTrue: 25.0,
    cSampleTrue: 0.1,
    purityMethod: 'direct',
    sampleMass: 1.0,
    solutionTotalVol: 250,
    pipetteVol: 25,
    reagent1Conc: 0.1,
    reagent1Vol: 20.0,
    reagent2Conc: 0.1,
    reagent2Vol: 10.0,
    rawMaterialMass: 10.0,
    rawMaterialMolarMass: 100.0,
    molarMassProduct: 150.0,
    actualProductMass: 12.0,
  }

  // ──────────────────────────────────────────────
  // 1. 操作失误的误差方向核查
  // ──────────────────────────────────────────────
  describe('滴定操作误差方向推导', () => {
    it('滴定管未用标准液润洗: 导致标准液稀释，消耗体积增大，测定结果偏高', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, errorOp: 'unrinsed-burette' })
      )

      expect(result.current.errorResult.effectDirection).toBe('high')
      expect(result.current.errorResult.cCalculated).toBeGreaterThan(baseParams.cSampleTrue)
    })

    it('锥形瓶用待测液润洗: 待测溶质增多，消耗体积增大，测定结果偏高', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, errorOp: 'unrinsed-flask' })
      )

      expect(result.current.errorResult.effectDirection).toBe('high')
      expect(result.current.errorResult.cCalculated).toBeGreaterThan(baseParams.cSampleTrue)
    })

    it('锥形瓶内有蒸馏水残留 (wet-flask): 待测物质的量不变，测定结果无影响', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, errorOp: 'wet-flask' })
      )

      expect(result.current.errorResult.effectDirection).toBe('none')
      expect(result.current.errorResult.cCalculated).toBeCloseTo(baseParams.cSampleTrue, 4)
    })

    it('滴定管气泡未赶尽 (滴定前有气泡，滴定后气泡消失): 假性消耗体积，测定结果偏高', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, errorOp: 'bubble-start' })
      )

      expect(result.current.errorResult.effectDirection).toBe('high')
      expect(result.current.errorResult.cCalculated).toBeGreaterThan(baseParams.cSampleTrue)
    })

    it('滴定前无气泡，滴定后尖嘴产生气泡: 终点读数偏小，测定结果偏低', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, errorOp: 'bubble-end' })
      )

      expect(result.current.errorResult.effectDirection).toBe('low')
      expect(result.current.errorResult.cCalculated).toBeLessThan(baseParams.cSampleTrue)
    })

    it('滴定终点尖嘴悬滴未落: 计入消耗但未参与反应，测定结果偏高', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, errorOp: 'hanging-drop' })
      )

      expect(result.current.errorResult.effectDirection).toBe('high')
      expect(result.current.errorResult.cCalculated).toBeGreaterThan(baseParams.cSampleTrue)
    })

    it('始仰终俯 (view-start-up-end-down): 测得体积 ΔV 偏小，测定结果偏低', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, errorOp: 'view-start-up-end-down' })
      )

      expect(result.current.errorResult.effectDirection).toBe('low')
      expect(result.current.errorResult.cCalculated).toBeLessThan(baseParams.cSampleTrue)
    })

    it('始俯终仰 (view-start-down-end-up): 测得体积 ΔV 偏大，测定结果偏高', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, errorOp: 'view-start-down-end-up' })
      )

      expect(result.current.errorResult.effectDirection).toBe('high')
      expect(result.current.errorResult.cCalculated).toBeGreaterThan(baseParams.cSampleTrue)
    })

    it('容量瓶定容俯视 (volumetric-flask-down): 标准液浓度偏高，消耗体积偏小，测定结果偏低', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, errorOp: 'volumetric-flask-down' })
      )

      expect(result.current.errorResult.effectDirection).toBe('low')
      expect(result.current.errorResult.cCalculated).toBeLessThan(baseParams.cSampleTrue)
    })

    it('指示剂变色过早 (indicator-early): 终点提前，测定结果偏低', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, errorOp: 'indicator-early' })
      )

      expect(result.current.errorResult.effectDirection).toBe('low')
      expect(result.current.errorResult.cCalculated).toBeLessThan(baseParams.cSampleTrue)
    })

    it('指示剂变色过迟 (indicator-late): 终点滞后滴入过量，测定结果偏高', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, errorOp: 'indicator-late' })
      )

      expect(result.current.errorResult.effectDirection).toBe('high')
      expect(result.current.errorResult.cCalculated).toBeGreaterThan(baseParams.cSampleTrue)
    })
  })

  // ──────────────────────────────────────────────
  // 2. 读数视线偏差核查 (仰俯视)
  // ──────────────────────────────────────────────
  describe('滴定管读数视线偏差推导', () => {
    it('仰视 (viewAngle > 0): 终点读数偏大，测得 V(标) 偏大，结果偏高', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, viewAngle: 10 })
      )

      expect(result.current.errorResult.effectDirection).toBe('high')
      expect(result.current.errorResult.cCalculated).toBeGreaterThan(baseParams.cSampleTrue)
    })

    it('俯视 (viewAngle < 0): 终点读数偏小，测得 V(标) 偏小，结果偏低', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, viewAngle: -10 })
      )

      expect(result.current.errorResult.effectDirection).toBe('low')
      expect(result.current.errorResult.cCalculated).toBeLessThan(baseParams.cSampleTrue)
    })
  })

  // ──────────────────────────────────────────────
  // 3. 样品纯度与反应产率计算
  // ──────────────────────────────────────────────
  describe('样品纯度与产率计算', () => {
    it('直接滴定法: 精确校验 n(移取)/n(全样)/m(纯品)/w%，且严格自洽', () => {
      const { result } = renderHook(() => useTitrationErrorChemistry(baseParams))
      const { purityResult } = result.current

      // baseParams: c(HCl)=0.1 mol/L, V=10.0 mL -> vStdL=0.0100 L
      //   n(aliquot) = 0.5 × 0.1 × 0.0100 = 0.00050 mol
      //   定容/移取 = 250/25 = 10 -> n(total) = 0.00500 mol
      //   M(Na2CO3) = 106 -> m(纯品) = 0.005 × 106 = 0.530 g
      //   w% = 0.530 / 1.0 × 100% = 53.00%
      expect(purityResult.nAliquot).toBe(0.0005)
      expect(purityResult.nTotalSample).toBe(0.005)
      expect(purityResult.mPureProduct).toBe(0.53)
      expect(purityResult.purityPct).toBe(53.0)
      expect(purityResult.overLimit).toBe(false)
      // 代数式必须与数值口径一致：分子含 定容/移取 换算因子，否则学生按式子算不出显示值
      expect(purityResult.calcStepsLatex).toContain('\\frac{250}{25}')
      expect(purityResult.calcStepsLatex).toContain('= 53.00\\%')
    })

    it('返滴定法: 精确校验数值，且代数式含「定容/移取」换算因子（回归：曾漏乘该因子）', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({
          ...baseParams,
          purityMethod: 'back-titration',
          reagent1Conc: 0.5,
          reagent1Vol: 20.0,
          reagent2Conc: 0.32,
          reagent2Vol: 20.0,
          sampleMass: 2.0,
        })
      )
      const { purityResult } = result.current

      // n(HCl总) = 0.5 × 0.020 = 0.0100 mol;  n(NaOH反滴) = 0.32 × 0.020 = 0.0064 mol
      //   n(HCl反应) = 0.0036 mol -> n(aliquot) = 0.5 × 0.0036 = 0.00180 mol
      //   定容/移取 = 10 -> n(total) = 0.0180 mol
      //   M(CaCO3) = 100.09 -> m(纯品) = 0.0180 × 100.09 = 1.8016 g
      //   w% = 1.8016 / 2.0 × 100% = 90.08%
      expect(purityResult.nAliquot).toBe(0.0018)
      expect(purityResult.nTotalSample).toBe(0.018)
      expect(purityResult.mPureProduct).toBe(1.802)
      expect(purityResult.purityPct).toBe(90.08)
      expect(purityResult.overLimit).toBe(false)
      expect(purityResult.stoichiometryRatio).toContain('n(HCl总) - n(NaOH反滴)')
      expect(purityResult.calcStepsLatex).toContain('\\frac{250}{25}')
      expect(purityResult.calcStepsLatex).toContain('= 90.08\\%')
    })

    it('返滴定法: 过量酸远超样品可消耗量时，w% 不被静默压成 100，而是标记 overLimit', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({
          ...baseParams,
          purityMethod: 'back-titration',
          reagent1Conc: 0.2,
          reagent1Vol: 30.0,
          reagent2Conc: 0.1,
          reagent2Vol: 20.0,
          sampleMass: 1.0,
        })
      )
      const { purityResult } = result.current

      // n(HCl反应) = 0.2×0.030 - 0.1×0.020 = 0.0040 mol -> n(total) = 0.0200 mol
      //   m(纯品) = 0.0200 × 100.09 = 2.0018 g ; w% = 2.0018 / 1.0 × 100% = 200.18%
      expect(purityResult.purityPct).toBe(200.18)
      expect(purityResult.purityPct).toBeGreaterThan(100)
      expect(purityResult.overLimit).toBe(true)
    })

    it('氧化还原滴定法: 精确校验按得失电子比例换算的样品纯度', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({
          ...baseParams,
          purityMethod: 'multistep-redox',
          reagent1Conc: 0.05,
          reagent1Vol: 20.0,
          reagent2Conc: 0.1,
          reagent2Vol: 10.0,
          sampleMass: 2.0,
        })
      )
      const { purityResult } = result.current

      // n(S2O3²⁻) = 0.1 × 0.0100 = 0.00100 mol -> n(aliquot) = 0.00100 mol
      //   定容/移取 = 10 -> n(total) = 0.0100 mol
      //   M(碱式碳酸铜) = 222，1 mol 样品 ~ 2 mol Cu²⁺ ~ 2 mol S2O3²⁻
      //   m(纯品) = (0.0100/2) × 222 = 1.110 g ; w% = 1.110 / 2.0 × 100% = 55.50%
      expect(purityResult.nAliquot).toBe(0.001)
      expect(purityResult.nTotalSample).toBe(0.01)
      expect(purityResult.mPureProduct).toBe(1.11)
      expect(purityResult.purityPct).toBe(55.5)
      expect(purityResult.overLimit).toBe(false)
    })

    it('产率计算结果在合理范围内 [0, 100%]，且理论质量计算严格自洽', () => {
      const { result } = renderHook(() => useTitrationErrorChemistry(baseParams))
      const { yieldResult } = result.current

      // baseParams: rawMaterialMass=10.0, rawMaterialMolarMass=100.0 (0.1 mol)
      // molarMassProduct=150.0 -> mTheoretical = 0.1 * 150 = 15.0 g
      // actualProductMass=12.0 -> yieldPct = (12.0 / 15.0) * 100 = 80.0%
      expect(yieldResult.nTheoretical).toBe(0.1)
      expect(yieldResult.mTheoretical).toBe(15.0)
      expect(yieldResult.actualMass).toBe(12.0)
      expect(yieldResult.yieldPct).toBe(80.0)
      expect(yieldResult.overLimit).toBe(false)
      expect(yieldResult.calcFormulaLatex).toContain('Yield')
    })

    it('产率超过 100% 时不被静默截断，而是标记 overLimit 并保留真实数值', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, actualProductMass: 30.0 })
      )
      const { yieldResult } = result.current

      // mTheoretical = 15.0 g，实际 30.0 g -> Yield% = 200.00%（物理不可能，须告警）
      expect(yieldResult.mTheoretical).toBe(15.0)
      expect(yieldResult.yieldPct).toBe(200.0)
      expect(yieldResult.overLimit).toBe(true)
      expect(yieldResult.calcFormulaLatex).toContain('= 200.00\\%')
    })

    it('支持非 1:1 化学计量比 (rawToProductRatio = 0.5, 如 2A -> B)', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({
          ...baseParams,
          rawMaterialMass: 10.0,
          rawMaterialMolarMass: 100.0, // 0.1 mol 原料
          rawToProductRatio: 0.5, // 2 mol 原料生成 1 mol 产物 -> 0.05 mol
          molarMassProduct: 150.0, // 理论最大质量 0.05 * 150 = 7.5 g
          actualProductMass: 6.0, // 产率 6.0 / 7.5 = 80.0%
        })
      )
      const { yieldResult } = result.current

      expect(yieldResult.nTheoretical).toBe(0.05)
      expect(yieldResult.mTheoretical).toBe(7.5)
      expect(yieldResult.yieldPct).toBe(80.0)
      expect(yieldResult.overLimit).toBe(false)
      expect(yieldResult.calcFormulaLatex).toContain('\\times 0.5')
    })
  })
})
