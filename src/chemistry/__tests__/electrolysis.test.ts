/**
 * 电解池模型单元测试（@/chemistry/electrolysis）
 *
 * 守门目标 —— P1-8 回归锁：
 *   1. 粗铜精炼的阳极失重必须由「溶解铜质量 ÷ w(Cu)」导出，
 *      不得再出现无依据的裸系数 ×1.05；且必须满足教学结论
 *      「阳极减少质量 > 阴极增加质量」。
 *   2. 氯碱阴极区 pH、CuSO₄ 阳极区 pH 必须由 c = n / V 严格导出，
 *      不得再写成 `7.0 + ne × 3.0`（把摩尔量当 pH 增量，量纲非法）。
 */

import { describe, it, expect } from 'vitest'
import {
  ANODE_MATERIAL,
  BLISTER_COPPER_CU_FRACTION,
  CU2_PLUS_SOLUTION_PH,
  ELECTROLYSIS_CELL,
  MOLAR_GAS_VOLUME,
  electrolysisState,
} from '../electrolysis'
import { ELECTROLYTE_INITIAL_CONC } from '../electrochemical'

/** I = 1.5 A、t = 10 s 时的 n(e⁻)（教学缩放系数 50） */
const NE_MAX = 0.0077732

describe('cellType = 0 CuCl₂（惰性阳极）', () => {
  it('阳极放 Cl₂、阴极析 Cu，且每 2 mol e⁻ 各得 1 mol', () => {
    const state = electrolysisState(ELECTROLYSIS_CELL.copperChloride, 0, 2)
    expect(state.cathodeMassDelta).toBeCloseTo(63.55, 6)
    expect(state.anodeGasVolume).toBeCloseTo(MOLAR_GAS_VOLUME, 6)
    expect(state.anodeMassDelta).toBe(0)
    expect(state.cathodeGasVolume).toBe(0)
  })

  it('全程不涉及 H⁺/OH⁻，pH 保持 Cu²⁺ 水解形成的弱酸性', () => {
    for (const ne of [0, 0.001, NE_MAX]) {
      expect(electrolysisState(ELECTROLYSIS_CELL.copperChloride, 0, ne).pH).toBe(
        CU2_PLUS_SOLUTION_PH
      )
    }
  })
})

describe('cellType = 1 CuSO₄', () => {
  it('惰性阳极：每 4 mol e⁻ 放出 22.4 L O₂ 并生成 4 mol H⁺，pH 随 n(H⁺)/V 降低', () => {
    const state = electrolysisState(ELECTROLYSIS_CELL.copperSulfate, ANODE_MATERIAL.inert, 1)
    // n(H⁺) = ne = 1 mol，V = 1 L → c(H⁺) ≈ 1 mol/L
    expect(state.anodeGasVolume).toBeCloseTo(0.25 * MOLAR_GAS_VOLUME, 6)

    // 取小 n(e⁻) 验证 pH = −lg(ne/V + 1e-7)：ne = 0.001 → pH ≈ 3
    const dilute = electrolysisState(ELECTROLYSIS_CELL.copperSulfate, ANODE_MATERIAL.inert, 0.001)
    expect(dilute.pH).toBeCloseTo(-Math.log10(0.001 + 1e-7), 10)
    expect(dilute.pH).toBeCloseTo(3, 3)

    // H⁺ 越积越多 → pH 单调降低
    const later = electrolysisState(ELECTROLYSIS_CELL.copperSulfate, ANODE_MATERIAL.inert, 0.01)
    expect(later.pH).toBeLessThan(dilute.pH)
  })

  it('活性铜阳极：阳极溶解量等于阴极析出量，浓度与 pH 均不变', () => {
    const state = electrolysisState(ELECTROLYSIS_CELL.copperSulfate, ANODE_MATERIAL.activeCopper, NE_MAX)
    expect(state.cathodeMassDelta).toBeCloseTo(-state.anodeMassDelta, 10)
    expect(state.concentration).toBe(ELECTROLYTE_INITIAL_CONC)
    expect(state.pH).toBe(CU2_PLUS_SOLUTION_PH)
    expect(state.anodeGasVolume).toBe(0)
  })
})

describe('cellType = 2 氯碱工业', () => {
  it('阴极区 pH 由 c(OH⁻)=n(e⁻)/V 导出，而非「7 + ne×系数」', () => {
    const ne = 0.005
    const state = electrolysisState(ELECTROLYSIS_CELL.chlorAlkali, 0, ne)
    expect(state.pH).toBeCloseTo(14 + Math.log10(ne / 1.0 + 1e-7), 10)
    // 原写法 7 + ne×3.0 给出 ≈7.015，严重低估阴极区碱性
    expect(state.pH).toBeGreaterThan(10)
  })

  it('n(e⁻) = 0 时阴极区仍为中性 7.00', () => {
    const state = electrolysisState(ELECTROLYSIS_CELL.chlorAlkali, 0, 0)
    expect(state.pH).toBeCloseTo(7, 6)
  })

  it('每 1 mol e⁻ 消耗 1 mol NaCl、放出 0.5 mol H₂ 与 0.5 mol Cl₂', () => {
    // 取 0.2 mol e⁻ 以免触及 0.05 mol/L 的浓度下限
    const state = electrolysisState(ELECTROLYSIS_CELL.chlorAlkali, 0, 0.2)
    expect(state.concentration).toBeCloseTo(ELECTROLYTE_INITIAL_CONC - 0.2, 10)
    expect(state.anodeGasVolume).toBeCloseTo(0.1 * MOLAR_GAS_VOLUME, 10)
    expect(state.cathodeGasVolume).toBeCloseTo(0.1 * MOLAR_GAS_VOLUME, 10)
    expect(state.anodeMassDelta).toBe(0)
    expect(state.cathodeMassDelta).toBe(0)
  })

  it('n(e⁻) 很大时浓度被下限 0.05 mol/L 保护，不出现负值', () => {
    const state = electrolysisState(ELECTROLYSIS_CELL.chlorAlkali, 0, 1)
    expect(state.concentration).toBe(0.05)
  })

  it('n(e⁻) 增大时阴极区 pH 单调升高', () => {
    let prev = 0
    for (const ne of [0, 0.002, 0.005, NE_MAX]) {
      const ph = electrolysisState(ELECTROLYSIS_CELL.chlorAlkali, 0, ne).pH
      expect(ph).toBeGreaterThanOrEqual(prev)
      prev = ph
    }
  })
})

describe('cellType = 3 粗铜精炼（P1-8 核心）', () => {
  it('阳极失重 = 溶解铜质量 ÷ w(Cu)，比例恒为 1/0.95', () => {
    const state = electrolysisState(ELECTROLYSIS_CELL.copperRefining, 0, NE_MAX)
    expect(state.cathodeMassDelta).toBeGreaterThan(0)
    expect(state.anodeMassDelta).toBeLessThan(0)
    expect(Math.abs(state.anodeMassDelta) / state.cathodeMassDelta).toBeCloseTo(
      1 / BLISTER_COPPER_CU_FRACTION,
      10
    )
  })

  it('阳极减少质量严格大于阴极增加质量（阳极泥所致）', () => {
    for (const ne of [0.001, 0.005, NE_MAX]) {
      const state = electrolysisState(ELECTROLYSIS_CELL.copperRefining, 0, ne)
      expect(Math.abs(state.anodeMassDelta)).toBeGreaterThan(state.cathodeMassDelta)
    }
  })

  it('活泼金属杂质(Zn/Fe)优先失电子溶解 → 电解液 c(Cu²⁺) 逐渐下降（高考铁律）', () => {
    const s0 = electrolysisState(ELECTROLYSIS_CELL.copperRefining, 0, 0)
    const s1 = electrolysisState(ELECTROLYSIS_CELL.copperRefining, 0, NE_MAX)
    expect(s0.concentration).toBe(ELECTROLYTE_INITIAL_CONC)
    expect(s1.concentration).toBeLessThan(s0.concentration)
    expect(s1.concentration).toBeCloseTo(
      ELECTROLYTE_INITIAL_CONC - 0.5 * NE_MAX * 0.05,
      10
    )
  })

  it('n(e⁻) = 0 时两极质量变化均为 0', () => {
    const state = electrolysisState(ELECTROLYSIS_CELL.copperRefining, 0, 0)
    // 负零（-0）与 0 在 Object.is 下不相等，故用 toBeCloseTo
    expect(state.anodeMassDelta).toBeCloseTo(0, 10)
    expect(state.cathodeMassDelta).toBeCloseTo(0, 10)
  })
})

describe('cellType = 4 熔融 Al₂O₃ 电解炼铝', () => {
  it('每 3 mol e⁻ 析出 27 g Al；每 4 mol e⁻ 消耗 12 g C 并放出 22.4 L O₂', () => {
    const state = electrolysisState(ELECTROLYSIS_CELL.moltenAlumina, 0, 12)
    expect(state.cathodeMassDelta).toBeCloseTo(108, 6)
    expect(state.anodeMassDelta).toBeCloseTo(-36, 6)
    expect(state.anodeGasVolume).toBeCloseTo(3 * MOLAR_GAS_VOLUME, 6)
  })
})

describe('通用护栏', () => {
  it('所有模型在任何 n(e⁻) 下都不产生 NaN / Infinity', () => {
    for (const cellType of [0, 1, 2, 3, 4]) {
      for (const anodeMaterial of [0, 1]) {
        for (const ne of [0, 0.001, NE_MAX, 1e3]) {
          const state = electrolysisState(cellType, anodeMaterial, ne)
          expect(Number.isFinite(state.anodeMassDelta)).toBe(true)
          expect(Number.isFinite(state.cathodeMassDelta)).toBe(true)
          expect(Number.isFinite(state.anodeGasVolume)).toBe(true)
          expect(Number.isFinite(state.cathodeGasVolume)).toBe(true)
          expect(Number.isFinite(state.concentration)).toBe(true)
          expect(Number.isFinite(state.pH)).toBe(true)
        }
      }
    }
  })

  it('pH 始终落在 0~14 之内', () => {
    for (const cellType of [0, 1, 2, 3, 4]) {
      for (const ne of [0, 0.005, NE_MAX]) {
        const ph = electrolysisState(cellType, 0, ne).pH
        expect(ph).toBeGreaterThanOrEqual(0)
        expect(ph).toBeLessThanOrEqual(14)
      }
    }
  })
})
