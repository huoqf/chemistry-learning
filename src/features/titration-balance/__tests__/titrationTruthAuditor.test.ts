import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTitrationChemistry } from '../hooks/useTitrationChemistry'
import type { TitrationParams } from '../types'

describe('titrationTruthAuditor — 滴定平衡化学真理与三大守恒审计', () => {
  const baseParams: TitrationParams = {
    viewMode: 0,
    systemType: 'strongBaseWeakAcid',
    vRatio: 1.0,
    pKa: 4.75,
    c0: 0.1,
    indicator: 'phenolphthalein',
  }

  it('NaOH 滴定 CH3COOH 化学计量点 (vRatio=1.0): 溶液显碱性，满足质子守恒与指示剂落入突跃区', () => {
    const { result } = renderHook(() => useTitrationChemistry(baseParams))
    const r = result.current

    expect(r.pH).toBeGreaterThan(7.5)
    expect(r.chargeBalance.equationLatex).toContain('c(\\text{Na}^+) + c(\\text{H}^+)')
    expect(r.protonBalance.equationLatex).toBe('c(\\text{OH}^-) = c(\\text{HA}) + c(\\text{H}^+)')
    expect(r.concOrderingLatex).toMatch(/c\(\\text\{Na\}\^?\+\) > c\(\\text\{A\}\^-\) > c\(\\text\{OH\}\^-\)/)
    expect(r.jumpEndPH).toBeGreaterThan(r.jumpStartPH)
    expect(r.indicatorTip).toContain('可选用')
  })

  it('NaOH 滴定 CH3COOH 半中和点 (vRatio=0.5): 缓冲液显弱酸性且满足半中和质子守恒式', () => {
    const { result } = renderHook(() =>
      useTitrationChemistry({ ...baseParams, vRatio: 0.5 })
    )
    const r = result.current

    expect(r.pH).toBeCloseTo(4.75, 1)
    expect(r.protonBalance.equationLatex).toBe(
      '2c(\\text{H}^+) + c(\\text{HA}) = c(\\text{A}^-) + 2c(\\text{OH}^-)'
    )
    expect(r.concOrderingLatex.startsWith('c(\\text{A}^-) > c(\\text{Na}^+)')).toBe(true)
  })

  it('HCl 滴定 NH3·H2O 化学计量点 (vRatio=1.0): BH+ 水解显酸性，选甲基橙优于酚酞', () => {
    const { result: methylResult } = renderHook(() =>
      useTitrationChemistry({
        ...baseParams,
        systemType: 'strongAcidWeakBase',
        vRatio: 1.0,
        indicator: 'methylOrange',
      })
    )
    const { result: phenolResult } = renderHook(() =>
      useTitrationChemistry({
        ...baseParams,
        systemType: 'strongAcidWeakBase',
        vRatio: 1.0,
        indicator: 'phenolphthalein',
      })
    )

    expect(methylResult.current.pH).toBeLessThan(6.5)
    expect(methylResult.current.protonBalance.equationLatex).toBe(
      'c(\\text{H}^+) = c(\\text{B}) + c(\\text{OH}^-)'
    )
    expect(methylResult.current.indicatorTip).toContain('可选用')
    expect(phenolResult.current.indicatorTip).toContain('更换指示剂')
  })

  it('NaOH 滴定 HCl 强强体系全过程任意点严格满足电荷守恒', () => {
    const ratios = [0, 0.5, 1.0, 1.5]
    ratios.forEach((vRatio) => {
      const { result } = renderHook(() =>
        useTitrationChemistry({
          ...baseParams,
          systemType: 'strongBaseStrongAcid',
          vRatio,
        })
      )
      const byName = new Map(result.current.ionConcs.map((i) => [i.name, i.conc]))
      const lhs = (byName.get('Na⁺') ?? 0) + (byName.get('H⁺') ?? 0)
      const rhs = (byName.get('Cl⁻') ?? 0) + (byName.get('OH⁻') ?? 0)
      // JS IEEE-754 在 d≈0 时 sqrt(d^2 + 4e-14) 存在 ~3e-8 级数值误差，相对 0.1 mol/L 主离子精度 < 1e-6
      expect(Math.abs(lhs - rhs)).toBeLessThan(1e-7)
    })
  })

  it('回归：NaOH 滴定 HCl 在 vRatio = 0.99 处仍属 HCl 过量区，不得误判为 NaOH 过量', () => {
    const { result } = renderHook(() =>
      useTitrationChemistry({
        ...baseParams,
        systemType: 'strongBaseStrongAcid',
        vRatio: 0.99,
      })
    )
    expect(result.current.pH).toBeLessThan(7)
    expect(result.current.protonBalance.title).toContain('HCl 过量')
    expect(result.current.orderingExplanation).toContain('HCl 过量')
    expect(result.current.concOrderingLatex).toContain('c(\\text{Cl}^-) > c(\\text{Na}^+)')
  })
})
