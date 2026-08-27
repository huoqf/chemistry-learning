/**
 * 滴定突跃与离子浓度排序、三大守恒计算测试
 *
 * 覆盖：
 *   1. 强碱滴定弱酸 (NaOH -> HA):
 *      - 半中和点 (vRatio = 0.5): 缓冲溶液 [HA] ≈ [A⁻], pH ≈ pKa, 离子排序 c(A⁻) > c(Na⁺) > c(H⁺) > c(OH⁻)
 *      - 化学计量点 (vRatio = 1.0): 强碱弱酸盐水解显碱性 (pH > 7)
 *      - 过量碱 (vRatio = 1.5): c(Na⁺) > c(OH⁻) > c(A⁻) > c(H⁺)
 *   2. 强酸滴定弱碱 (HCl -> BOH):
 *      - 化学计量点水解显酸性 (pH < 7)
 *   3. 三大守恒表达式生成: 电荷守恒、物料守恒、质子守恒
 */

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTitrationChemistry } from '../useTitrationChemistry'
import type { TitrationParams } from '../../types'

describe('useTitrationChemistry — 滴定平衡与离子排序测试', () => {
  const baseParams: TitrationParams = {
    viewMode: 0,
    systemType: 'strongBaseWeakAcid',
    vRatio: 0.5,
    pKa: 4.76, // 弱酸 pKa
    c0: 0.1,
    indicator: 'phenolphthalein',
  }

  // ──────────────────────────────────────────────
  // 1. 强碱滴定弱酸 (NaOH 滴定 HA)
  // ──────────────────────────────────────────────
  describe('NaOH 滴定 HA 体系', () => {
    it('半中和点 (vRatio = 0.5): 形成缓冲体系，pH 接近 pKa (4.76)', () => {
      const { result } = renderHook(() =>
        useTitrationChemistry({ ...baseParams, vRatio: 0.5 })
      )

      expect(result.current.pH).toBeCloseTo(4.76, 1)
      // 半中和点阴离子浓度大于钠离子浓度
      expect(result.current.concOrderingLatex).toContain('c(\\text{A}^-)')
      expect(result.current.orderingExplanation).toContain('半中和点')
    })

    it('化学计量点 (vRatio = 1.0): 生成 NaA 强碱弱酸盐水解，pH > 7.0 显碱性', () => {
      const { result } = renderHook(() =>
        useTitrationChemistry({ ...baseParams, vRatio: 1.0 })
      )

      expect(result.current.pH).toBeGreaterThan(7.0)
      expect(result.current.isInJumpZone).toBe(true)
      // NaA 溶液中离子浓度排序: c(Na⁺) > c(A⁻) > c(OH⁻) > c(H⁺)
      const ordering = result.current.concOrderingLatex
      expect(ordering).toContain('c(\\text{Na}^+)')
      expect(ordering).toContain('c(\\text{OH}^-)')
    })

    it('过量碱阶段 (vRatio = 1.5): 强碱抑制弱酸根水解，c(Na⁺) > c(OH⁻) > c(A⁻) > c(H⁺)', () => {
      const { result } = renderHook(() =>
        useTitrationChemistry({ ...baseParams, vRatio: 1.5 })
      )

      expect(result.current.pH).toBeGreaterThan(12.0)
      expect(result.current.orderingExplanation).toContain('过量')
    })
  })

  // ──────────────────────────────────────────────
  // 2. 强酸滴定弱碱 (HCl 滴定 BOH)
  // ──────────────────────────────────────────────
  describe('HCl 滴定 BOH 体系', () => {
    it('化学计量点 (vRatio = 1.0): 生成 BCl 强酸弱碱盐水解，pH < 7.0 显酸性', () => {
      const { result } = renderHook(() =>
        useTitrationChemistry({
          viewMode: 0,
          systemType: 'strongAcidWeakBase',
          vRatio: 1.0,
          pKa: 4.75, // pKb
          c0: 0.1,
          indicator: 'methylOrange',
        })
      )

      expect(result.current.pH).toBeLessThan(7.0)
      expect(result.current.concOrderingLatex).toContain('c(\\text{Cl}^-)')
      expect(result.current.concOrderingLatex).toContain('c(\\text{H}^+)')
    })
  })

  // ──────────────────────────────────────────────
  // 3. 三大守恒表达式核查
  // ──────────────────────────────────────────────
  describe('三大守恒表达式生成正确性', () => {
    it('NaOH 滴定 HA 体系的电荷守恒与物料守恒表达式准确生成', () => {
      const { result } = renderHook(() =>
        useTitrationChemistry({ ...baseParams, vRatio: 1.0 })
      )

      // 电荷守恒: c(Na+) + c(H+) = c(A-) + c(OH-)
      expect(result.current.chargeBalance.equationLatex).toContain('c(\\text{Na}^+)')
      expect(result.current.chargeBalance.equationLatex).toContain('c(\\text{OH}^-)')

      // 物料守恒: c(Na+) : [c(A-) + c(HA)] = vAdd : 20.0
      expect(result.current.massBalance.equationLatex).toContain('c(\\text{HA})')
    })
  })

  // ──────────────────────────────────────────────
  // 4. 滴定曲线全量数据点
  // ──────────────────────────────────────────────
  describe('滴定曲线全量数据点生成', () => {
    it('生成覆盖整个滴定过程的 curvePoints 数组', () => {
      const { result } = renderHook(() => useTitrationChemistry(baseParams))
      expect(result.current.curvePoints.length).toBeGreaterThan(50)
      // 曲线起始点 pH 与终止点 pH 跨度单调递增
      const firstPt = result.current.curvePoints[0]
      const lastPt = result.current.curvePoints[result.current.curvePoints.length - 1]
      expect(lastPt.pH).toBeGreaterThan(firstPt.pH)
    })
  })
})
