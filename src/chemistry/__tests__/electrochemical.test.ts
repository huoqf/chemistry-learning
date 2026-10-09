/**
 * 电化学基础量单元测试（@/chemistry/electrochemical）
 *
 * 守门目标 —— P0-2 量纲事故的回归锁：
 *   原实现把「生成 OH⁻/H⁺ 的物质的量 ne (mol)」与「初始电解质浓度 c0 (mol/L)」相乘，
 *   得到 mol²/L，既不是浓度也不是任何有意义的量；且 pH 上限 14 被误用于浓度。
 *   修复后一律走 c = n / V：
 *     n(OH⁻) = n(e⁻)   → pH = 14 + lg(n/V + 1e-7)   （碱性室）
 *     n(H⁺)  = n(e⁻)   → pH = −lg(n/V + 1e-7)       （酸性室）
 *   学生可见结论：同样电量下 pH 只由 n(e⁻) 与溶液体积决定，与 c0 无关。
 */

import { describe, it, expect } from 'vitest'
import {
  ELECTROLYTE_VOLUME_L,
  ELECTROLYSIS_TIME_SCALE,
  FARADAY_CONSTANT,
  pHFromHydrogenMoles,
  pHFromHydroxideMoles,
  transferredElectronMoles,
} from '../electrochemical'

const WATER_BASELINE = 1.0e-7

describe('transferredElectronMoles — 法拉第电解定律', () => {
  it('n(e⁻) = I × t × k / F', () => {
    const I = 1.5
    const t = 4
    expect(transferredElectronMoles(I, t)).toBeCloseTo(
      (I * t * ELECTROLYSIS_TIME_SCALE) / FARADAY_CONSTANT,
      12
    )
  })

  it('t = 0 时不转移电子', () => {
    expect(transferredElectronMoles(3.0, 0)).toBe(0)
  })

  it('对电流、时间均线性', () => {
    const base = transferredElectronMoles(1.0, 5)
    expect(transferredElectronMoles(2.0, 5)).toBeCloseTo(base * 2, 12)
    expect(transferredElectronMoles(1.0, 10)).toBeCloseTo(base * 2, 12)
  })
})

describe('pHFromHydroxideMoles — 碱性室（阳离子膜阴极室）', () => {
  it('无产物时回中性 7.00（叠加水的本底电离）', () => {
    expect(pHFromHydroxideMoles(0)).toBeCloseTo(7, 6)
  })

  it('严格等于 14 + lg(n(OH⁻)/V + 1e-7)', () => {
    const nOH = 0.007773
    const expected = 14 + Math.log10(nOH / ELECTROLYTE_VOLUME_L + WATER_BASELINE)
    expect(pHFromHydroxideMoles(nOH)).toBeCloseTo(expected, 10)
  })

  it('OH⁻ 越多 pH 越大（单调递增）', () => {
    const a = pHFromHydroxideMoles(0.002)
    const b = pHFromHydroxideMoles(0.004)
    const c = pHFromHydroxideMoles(0.008)
    expect(a).toBeLessThan(b)
    expect(b).toBeLessThan(c)
    expect(a).toBeGreaterThan(7)
  })

  it('滑块上限工况（I = 3.0 A, t = 10 s）仍满足 pH ≤ 14', () => {
    const maxNe = transferredElectronMoles(3.0, 10)
    expect(pHFromHydroxideMoles(maxNe)).toBeLessThan(14)
    expect(pHFromHydroxideMoles(maxNe)).toBeGreaterThan(10)
  })
})

describe('pHFromHydrogenMoles — 酸性室（阴离子膜阳极室）', () => {
  it('无产物时回中性 7.00', () => {
    expect(pHFromHydrogenMoles(0)).toBeCloseTo(7, 6)
  })

  it('严格等于 −lg(n(H⁺)/V + 1e-7)', () => {
    const nH = 0.007773
    const expected = -Math.log10(nH / ELECTROLYTE_VOLUME_L + WATER_BASELINE)
    expect(pHFromHydrogenMoles(nH)).toBeCloseTo(expected, 10)
  })

  it('H⁺ 越多 pH 越小（单调递减）且不低于 0', () => {
    const a = pHFromHydrogenMoles(0.002)
    const b = pHFromHydrogenMoles(0.004)
    const c = pHFromHydrogenMoles(0.008)
    expect(a).toBeGreaterThan(b)
    expect(b).toBeGreaterThan(c)
    expect(c).toBeLessThan(7)
    expect(pHFromHydrogenMoles(transferredElectronMoles(3.0, 10))).toBeGreaterThan(0)
  })

  it('等物质的量的酸室与碱室 pH 关于 7 对称（同一 n(e⁻) 的共轭关系）', () => {
    for (const n of [0.001, 0.005, 0.015]) {
      const acid = pHFromHydrogenMoles(n)
      const base = pHFromHydroxideMoles(n)
      expect(acid - 7).toBeCloseTo(7 - base, 10)
    }
  })
})

describe('常量契约', () => {
  it('法拉第常数与时间放大系数为约定值', () => {
    expect(FARADAY_CONSTANT).toBe(96485)
    expect(ELECTROLYSIS_TIME_SCALE).toBe(50)
  })

  it('溶液体积为正值（防止将来被误改为 0 导致除零）', () => {
    expect(ELECTROLYTE_VOLUME_L).toBeGreaterThan(0)
  })

  it('c = n/V 的量纲链：n = 1 mol 时 c(OH⁻) 应为 1/V mol/L', () => {
    expect(pHFromHydroxideMoles(1)).toBeCloseTo(
      14 + Math.log10(1 / ELECTROLYTE_VOLUME_L + WATER_BASELINE),
      10
    )
  })
})
