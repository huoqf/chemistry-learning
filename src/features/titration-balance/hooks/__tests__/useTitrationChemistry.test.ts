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

  // ──────────────────────────────────────────────
  // 5. 真理守卫：排序文案必须与同屏数值一致 / 电荷守恒 / 突跃随常数联动
  //    （对应复审报告 P0-1/P0-2/P0-3、P1-T1/P1-T2/P1-T3/P1-T4）
  // ──────────────────────────────────────────────
  describe('真理守卫：排序-数值自洽与守恒', () => {
    /** 去掉排序运算符，只保留微粒出现顺序 */
    const sequenceOf = (ordering: string) => ordering.split(/\s*[>=]\s*/)

    const systems: Array<{ type: TitrationParams['systemType']; pKa: number }> = [
      { type: 'strongBaseWeakAcid', pKa: 4.76 },
      { type: 'strongAcidWeakBase', pKa: 4.75 },
      { type: 'strongBaseStrongAcid', pKa: 4.76 },
    ]

    it('任一滴定进度下，离子浓度排序文案的微粒顺序必须与微粒数值降序完全一致', () => {
      for (const { type, pKa } of systems) {
        for (const vRatio of [0.1, 0.3, 0.5, 0.7, 0.9, 1.0, 1.1, 1.5, 1.9]) {
          const { result } = renderHook(() =>
            useTitrationChemistry({ ...baseParams, systemType: type, pKa, vRatio })
          )
          const { ionConcs, concOrderingLatex } = result.current
          const expected = [...ionConcs].sort((a, b) => b.conc - a.conc).map((i) => i.labelLatex)
          expect(
            sequenceOf(concOrderingLatex),
            `${type} @ vRatio=${vRatio} 排序文案与数值不一致`
          ).toEqual(expected)
        }
      }
    })

    it('任一进度下 c(H⁺) 与 c(OH⁻) 的大小关系必须由实际数值给出（禁止写反）', () => {
      for (const { type, pKa } of systems) {
        for (const vRatio of [0.1, 0.5, 0.9, 1.0, 1.5]) {
          const { result } = renderHook(() =>
            useTitrationChemistry({ ...baseParams, systemType: type, pKa, vRatio })
          )
          const { cH, cOH } = result.current
          const ordering = result.current.concOrderingLatex
          const idxH = ordering.indexOf('c(\\text{H}^+)')
          const idxOH = ordering.indexOf('c(\\text{OH}^-)')
          if (cH > cOH * 1.001) expect(idxH, `${type}@${vRatio} 应 c(H⁺)>c(OH⁻)`).toBeLessThan(idxOH)
          if (cOH > cH * 1.001)
            expect(idxOH, `${type}@${vRatio} 应 c(OH⁻)>c(H⁺)`).toBeLessThan(idxH)
        }
      }
    })

    it('NaOH 滴定 HA：半中和点与过量碱区的结论性排序必须正确', () => {
      // 半中和点：pH ≈ pKa（酸性），由电荷守恒必有 c(A⁻) > c(Na⁺)
      const half = renderHook(() =>
        useTitrationChemistry({ ...baseParams, vRatio: 0.5, pKa: 4.76 })
      ).result.current
      expect(half.pH).toBeCloseTo(4.76, 1)
      expect(half.concOrderingLatex).toBe(
        'c(\\text{A}^-) > c(\\text{Na}^+) > c(\\text{HA}) > c(\\text{H}^+) > c(\\text{OH}^-)'
      )

      // 过量碱：A⁻ 仍为主导阴离子，且 c(OH⁻) > c(HA)
      const over = renderHook(() =>
        useTitrationChemistry({ ...baseParams, vRatio: 1.5, pKa: 4.76 })
      ).result.current
      expect(over.pH).toBeGreaterThan(12)
      expect(over.concOrderingLatex).toBe(
        'c(\\text{Na}^+) > c(\\text{A}^-) > c(\\text{OH}^-) > c(\\text{HA}) > c(\\text{H}^+)'
      )
    })

    it('HCl 滴定弱碱：弱碱过量区必须显碱性 (c(OH⁻) > c(H⁺))', () => {
      const base = renderHook(() =>
        useTitrationChemistry({ ...baseParams, systemType: 'strongAcidWeakBase', vRatio: 0.2 })
      ).result.current
      expect(base.pH).toBeGreaterThan(7)
      expect(base.concOrderingLatex.indexOf('c(\\text{OH}^-)')).toBeLessThan(
        base.concOrderingLatex.indexOf('c(\\text{H}^+)')
      )
    })

    it('三大守恒卡片：质子守恒槽位不得塞入物料守恒/近似式', () => {
      const { result } = renderHook(() => useTitrationChemistry({ ...baseParams, vRatio: 0.7 }))
      expect(result.current.protonBalance.title).toContain('质子守恒')
      // 半中和点必须给出标志性守恒式
      const { result: half } = renderHook(() =>
        useTitrationChemistry({ ...baseParams, vRatio: 0.5 })
      )
      expect(half.current.protonBalance.title).toContain('质子守恒')
      expect(half.current.protonBalance.equationLatex).toBe(
        '2c(\\text{H}^+) + c(\\text{HA}) = c(\\text{A}^-) + 2c(\\text{OH}^-)'
      )
    })

    it('滴定突跃范围必须随 pKa 联动，且不再是写死常量', () => {
      const weak = renderHook(() =>
        useTitrationChemistry({ ...baseParams, pKa: 3.5, vRatio: 0.5 })
      ).result.current
      const weaker = renderHook(() =>
        useTitrationChemistry({ ...baseParams, pKa: 5.5, vRatio: 0.5 })
      ).result.current
      expect(weak.jumpStartPH).toBeCloseTo(6.5, 1) // pKa + 3
      expect(weaker.jumpStartPH).toBeCloseTo(8.5, 1)
      expect(weaker.jumpStartPH).toBeGreaterThan(weak.jumpStartPH)
    })

    it('c-V 微粒演变曲线必须与右屏微粒浓度同源（防拼凑曲线回归）', () => {
      const { result } = renderHook(() => useTitrationChemistry({ ...baseParams, vRatio: 1.0 }))
      const { speciesCurves, ionConcs, vEq } = result.current
      expect(speciesCurves.length).toBeGreaterThan(0)
      for (const curve of speciesCurves) {
        const ion = ionConcs.find((i) => i.name === curve.name)
        if (!ion) continue
        // vAdd = vEq 处的曲线值必须等于当前点（vRatio=1.0）的微粒浓度
        const atEquiv = curve.points.find((p) => Math.abs(p.x - vEq) < 1e-6)
        expect(atEquiv, `${curve.name} 曲线缺少计量点采样`).toBeDefined()
        expect(atEquiv!.y).toBeCloseTo(ion.conc, 6)
      }
    })
  })
})
