/**
 * 萃取分配平衡单元测试（@/chemistry/extraction）
 *
 * 守门目标 —— P0-4 回归锁：
 *   1. 量面板与右屏图表必须共用同一平衡式（此前图表用经验拟合式，两处数值打架）
 *   2. 乙醇属于互溶体系，不存在两相分配，任何「分配系数 / 萃取率」都无定义
 *   3. 物料守恒与分配定律必须同时成立
 */

import { describe, it, expect } from 'vitest'
import {
  IODINE_PARTITION_BENZENE,
  IODINE_PARTITION_CCL4,
  IODINE_WATER_INITIAL_CONC,
  IODINE_WATER_VOLUME_ML,
  extractionEquilibrium,
  extractionMixProgress,
  miscibleUniformConcentration,
} from '../extraction'

const C0 = IODINE_WATER_INITIAL_CONC
const VAQ = IODINE_WATER_VOLUME_ML

describe('extractionEquilibrium — 单级萃取分配平衡', () => {
  it('物料守恒：c(aq)·V(aq) + c(org)·V(org) 恒等于溶质总量', () => {
    for (const k of [IODINE_PARTITION_CCL4, IODINE_PARTITION_BENZENE, 1, 0.5, 200]) {
      for (const vOrg of [10, 20, 35, 50]) {
        const eq = extractionEquilibrium(C0, VAQ, vOrg, k)
        expect(eq.aqueous * VAQ + eq.organic * vOrg).toBeCloseTo(C0 * VAQ, 10)
      }
    }
  })

  it('分配定律：c(org) / c(aq) 恒等于 K', () => {
    for (const k of [IODINE_PARTITION_CCL4, IODINE_PARTITION_BENZENE, 0.5, 3.0]) {
      const eq = extractionEquilibrium(C0, VAQ, 20, k)
      expect(eq.organic / eq.aqueous).toBeCloseTo(k, 10)
    }
  })

  it('萃取率 = (c₀ − c(aq))/c₀，等价于 K·V(org)/(V(aq)+K·V(org))', () => {
    const eq = extractionEquilibrium(C0, VAQ, 20, IODINE_PARTITION_CCL4)
    expect(eq.rate).toBeCloseTo((C0 - eq.aqueous) / C0, 10)
    expect(eq.rate).toBeCloseTo(
      (IODINE_PARTITION_CCL4 * 20) / (VAQ + IODINE_PARTITION_CCL4 * 20),
      10
    )
  })

  it('CCl₄ 单级萃取率高于苯（K 更大 → 萃取更完全），且均 > 90%', () => {
    const ccl4 = extractionEquilibrium(C0, VAQ, 20, IODINE_PARTITION_CCL4)
    const benzene = extractionEquilibrium(C0, VAQ, 20, IODINE_PARTITION_BENZENE)
    expect(ccl4.rate).toBeGreaterThan(benzene.rate)
    expect(benzene.rate).toBeGreaterThan(0.9)
    expect(ccl4.rate).toBeGreaterThan(0.95)
  })

  it('萃取剂用量增大时萃取率单调增大但始终 < 1', () => {
    let prev = 0
    for (const vOrg of [10, 20, 30, 50]) {
      const eq = extractionEquilibrium(C0, VAQ, vOrg, IODINE_PARTITION_CCL4)
      expect(eq.rate).toBeGreaterThan(prev)
      expect(eq.rate).toBeLessThan(1)
      prev = eq.rate
    }
  })

  it('c₀ = 0 时不产生 NaN', () => {
    const eq = extractionEquilibrium(0, VAQ, 20, IODINE_PARTITION_CCL4)
    expect(eq.aqueous).toBe(0)
    expect(eq.organic).toBe(0)
    expect(eq.rate).toBe(0)
  })
})

describe('extractionMixProgress — 与动画时序对齐', () => {
  it('2.0s 及之前为 0，5.2s 及以后为 1', () => {
    expect(extractionMixProgress(0)).toBe(0)
    expect(extractionMixProgress(1.9)).toBe(0)
    expect(extractionMixProgress(2.0)).toBe(0)
    expect(extractionMixProgress(5.2)).toBe(1)
    expect(extractionMixProgress(12)).toBe(1)
  })

  it('区间内单调不减', () => {
    let prev = -1
    for (let t = 0; t <= 6; t += 0.2) {
      const p = extractionMixProgress(t)
      expect(p).toBeGreaterThanOrEqual(prev)
      prev = p
    }
  })
})

describe('miscibleUniformConcentration — 互溶体系（乙醇反例）', () => {
  it('碘总量不变，浓度按总体积稀释', () => {
    const c = miscibleUniformConcentration(C0, VAQ, 20)
    expect(c).toBeCloseTo((C0 * VAQ) / (VAQ + 20), 12)
    expect(c * (VAQ + 20)).toBeCloseTo(C0 * VAQ, 12)
  })

  it('均一相浓度低于初始碘水浓度（只被稀释，不发生富集）', () => {
    expect(miscibleUniformConcentration(C0, VAQ, 20)).toBeLessThan(C0)
    expect(miscibleUniformConcentration(C0, VAQ, 20)).toBeGreaterThan(0)
  })
})
