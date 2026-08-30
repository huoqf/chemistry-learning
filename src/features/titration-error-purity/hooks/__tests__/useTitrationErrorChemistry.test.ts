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
 *   3. 样品纯度 w% 与反应产率计算
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
    it('直接滴定法正确计算纯度百分比与物质的量', () => {
      const { result } = renderHook(() => useTitrationErrorChemistry(baseParams))
      const { purityResult } = result.current

      expect(purityResult.purityPct).toBeGreaterThan(0)
      expect(purityResult.purityPct).toBeLessThanOrEqual(100)
    })

    it('返滴定法正确计算过量酸被中和后的样品纯度', () => {
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

      expect(purityResult.purityPct).toBeGreaterThan(0)
      expect(purityResult.calcStepsLatex).toBeDefined()
      expect(purityResult.stoichiometryRatio).toContain('n(HCl总) - n(NaOH反滴)')
    })

    it('氧化还原滴定法正确根据得失电子比例计算纯度', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({
          ...baseParams,
          purityMethod: 'multistep-redox',
          reagent1Conc: 0.05,
          reagent1Vol: 20.0,
          sampleMass: 1.0,
        })
      )
      const { purityResult } = result.current

      expect(purityResult.purityPct).toBeGreaterThan(0)
      expect(purityResult.purityPct).toBeLessThanOrEqual(100)
    })

    it('产率计算结果在合理范围内 [0, 100%]', () => {
      const { result } = renderHook(() => useTitrationErrorChemistry(baseParams))
      const { yieldResult } = result.current

      expect(yieldResult.yieldPct).toBeGreaterThan(0)
      expect(yieldResult.yieldPct).toBeLessThanOrEqual(100)
    })
  })
})
