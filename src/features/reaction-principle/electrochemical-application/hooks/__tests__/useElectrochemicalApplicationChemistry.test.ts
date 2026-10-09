/**
 * 电化学综合应用化学量单元测试
 *
 * 覆盖三大核心模式：
 *   mode=0  双池盐桥原电池 (Zn-Cu)
 *   mode=1  离子交换膜电解池（阳离子膜/阴离子膜/质子膜三分支）
 *   mode=2  串联电化学池
 *
 * 关键化学正确性验收：
 *   - 法拉第定律 n(e⁻) = I·t·k / F
 *   - 原电池：负极 Zn 溶解（Δm < 0），正极 Cu 析出（Δm > 0）
 *   - 阳离子膜：阳极 Cl₂↑，Na⁺ 穿膜，阴极侧 OH⁻ 积累 pH > 7
 *   - 阴离子膜：阳极 O₂↑（H₂O 氧化），Cl⁻ 穿膜至阳极区
 *   - 质子膜：阴极 H₂↑，阳极 O₂↑，pH 保持中性
 *   - § 5 pH 量纲回归：pH = 14 − pOH 且严格由 n(e⁻)/V 导出，只由转移电子量决定
 *   - § 6 量面板与 hook 同源
 */

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import {
  useElectrochemicalApplicationChemistry,
} from '../useElectrochemicalApplicationChemistry'
import { buildElectrochemicalApplicationQuantities } from '@/data/quantities/reaction-principle/electrochemicalApplication'

const F = 96485 // 法拉第常数

/** 辅助函数：通过 renderHook 计算电化学状态 */
function calc(params: {
  current: number
  mode: number
  membraneType: number
  time: number
}) {
  const { result } = renderHook(() =>
    useElectrochemicalApplicationChemistry(params)
  )
  return result.current
}

// ────────────────────────────────────────────────
// § 0  法拉第定律通用验证
// ────────────────────────────────────────────────
describe('法拉第定律 — n(e⁻) 计算', () => {
  it('n(e⁻) = I × t × 50 / F', () => {
    const I = 1.5, t = 4
    const expected = (I * t * 50) / F
    const res = calc({ current: I, mode: 0, membraneType: 0, time: t })
    expect(res.ne).toBeCloseTo(expected, 4)
  })

  it('n(e⁻) 随电流线性增大', () => {
    const base = calc({ current: 1.0, mode: 0, membraneType: 0, time: 5 })
    const double = calc({ current: 2.0, mode: 0, membraneType: 0, time: 5 })
    expect(double.ne).toBeCloseTo(base.ne * 2, 3)
  })

  it('n(e⁻) 随时间线性增大', () => {
    const t1 = calc({ current: 1.0, mode: 0, membraneType: 0, time: 3 })
    const t2 = calc({ current: 1.0, mode: 0, membraneType: 0, time: 6 })
    expect(t2.ne).toBeCloseTo(t1.ne * 2, 3)
  })
})

// ────────────────────────────────────────────────
// § 1  mode=0 双池盐桥原电池 (Zn-Cu)
// ────────────────────────────────────────────────
describe('mode=0 双池盐桥原电池 (Zn-Cu)', () => {
  it('负极 Zn 溶解 → anodeMassDelta < 0', () => {
    const res = calc({ current: 1.5, mode: 0, membraneType: 0, time: 5 })
    expect(res.anodeMassDelta).toBeLessThan(0)
  })

  it('正极 Cu 析出 → cathodeMassDelta > 0', () => {
    const res = calc({ current: 1.5, mode: 0, membraneType: 0, time: 5 })
    expect(res.cathodeMassDelta).toBeGreaterThan(0)
  })

  it('Zn(M=65.38) 每转移 2mol e⁻ 溶解 65.38g，Cu(M=63.55) 析出 63.55g — 比值验证', () => {
    // Zn-2e⁻ = Zn²⁺ → 每 2mol e⁻ 损失 65.38g Zn
    // Cu²⁺+2e⁻ = Cu → 每 2mol e⁻ 析出 63.55g Cu
    const res = calc({ current: 1.5, mode: 0, membraneType: 0, time: 5 })
    const expectedZnLoss = (res.ne * 0.5 * 65.38)
    const expectedCuGain = res.ne * 0.5 * 63.55
    expect(Math.abs(res.anodeMassDelta)).toBeCloseTo(expectedZnLoss, 2)
    expect(res.cathodeMassDelta).toBeCloseTo(expectedCuGain, 2)
  })

  it('盐桥原电池溶液 pH = 7.0（无酸碱变化）', () => {
    const res = calc({ current: 1.5, mode: 0, membraneType: 0, time: 5 })
    expect(res.pH).toBeCloseTo(7.0, 1)
  })

  it('盐桥膜迁移离子标识包含 K⁺/NO₃⁻', () => {
    const res = calc({ current: 1.5, mode: 0, membraneType: 0, time: 5 })
    expect(res.membraneIonSymbol).toContain('K⁺')
  })

  it('无气体产生（原电池不电解水）', () => {
    const res = calc({ current: 1.5, mode: 0, membraneType: 0, time: 5 })
    expect(res.anodeGasName).toBe('')
    expect(res.cathodeGasName).toBe('')
  })
})

// ────────────────────────────────────────────────
// § 2  mode=1 离子交换膜电解池
// ────────────────────────────────────────────────
describe('mode=1 阳离子膜 — 氯碱工业 (membraneType=0)', () => {
  const base = { current: 1.5, mode: 1, membraneType: 0, time: 5 }

  it('阳极产生 Cl₂↑（2Cl⁻ − 2e⁻ = Cl₂）', () => {
    const res = calc(base)
    expect(res.anodeGasName).toContain('Cl₂')
  })

  it('阴极产生 H₂↑（2H₂O + 2e⁻ = H₂ + 2OH⁻）', () => {
    const res = calc(base)
    expect(res.cathodeGasName).toContain('H₂')
  })

  it('穿膜离子为 Na⁺（阳离子交换膜只允许阳离子通过）', () => {
    const res = calc(base)
    expect(res.membraneIonSymbol).toContain('Na⁺')
    // 确保 Cl⁻ 不穿过阳离子膜
    expect(res.membraneIonSymbol).not.toContain('Cl⁻')
  })

  it('阴极侧 OH⁻ 积累 → pH > 7', () => {
    const res = calc({ ...base, time: 5 })
    expect(res.pH).toBeGreaterThan(7)
  })
})

describe('mode=1 阴离子膜 (membraneType=1)', () => {
  const base = { current: 1.5, mode: 1, membraneType: 1, time: 5 }

  it('阳极产生 O₂↑（2H₂O − 4e⁻ = O₂ + 4H⁺）', () => {
    const res = calc(base)
    expect(res.anodeGasName).toContain('O₂')
  })

  it('穿膜离子为 Cl⁻（阴离子交换膜只允许阴离子通过）', () => {
    const res = calc(base)
    expect(res.membraneIonSymbol).toContain('Cl⁻')
  })

  it('阴极产生 H₂↑', () => {
    const res = calc(base)
    expect(res.cathodeGasName).toContain('H₂')
  })
})

describe('mode=1 质子交换膜 (membraneType=2) — PEM 电解水', () => {
  const base = { current: 1.5, mode: 1, membraneType: 2, time: 5 }

  it('阳极产生 O₂↑（2H₂O − 4e⁻ = O₂ + 4H⁺）', () => {
    const res = calc(base)
    expect(res.anodeGasName).toContain('O₂')
  })

  it('穿膜离子为 H⁺（质子交换膜）', () => {
    const res = calc(base)
    expect(res.membraneIonSymbol).toContain('H⁺')
  })

  it('pH 保持在 7 附近（纯水电解，无酸碱积累）', () => {
    const res = calc(base)
    expect(res.pH).toBeCloseTo(7.0, 0)
  })
})

// ────────────────────────────────────────────────
// § 3  mode=2 串联电化学池
// ────────────────────────────────────────────────
describe('mode=2 串联电化学池（Zn-Cu 原电池 驱动 镀铜电解池）', () => {
  const base = { current: 1.5, mode: 2, membraneType: 0, time: 5 }

  it('原电池侧 Zn 溶解 → anodeMassDelta < 0', () => {
    const res = calc(base)
    expect(res.anodeMassDelta).toBeLessThan(0)
  })

  it('电解池阴极 Cu 析出 → cathodeMassDelta > 0', () => {
    const res = calc(base)
    expect(res.cathodeMassDelta).toBeGreaterThan(0)
  })

  it('串联池每池转移 n(e⁻) 相同（电荷守恒）— anodeDelta 与 cathodeDelta 比值符合摩尔质量比', () => {
    const res = calc(base)
    // |anodeDelta| / 65.38 = cathodeDelta / 63.55（均为 ne*0.5 mol）
    const znMoles = Math.abs(res.anodeMassDelta) / 65.38
    const cuMoles = res.cathodeMassDelta / 63.55
    expect(znMoles).toBeCloseTo(cuMoles, 3)
  })

  it('膜迁移标识为导线电子传递标识', () => {
    const res = calc(base)
    expect(res.membraneIonSymbol).toContain('e⁻')
  })
})

// ────────────────────────────────────────────────
// § 4  相位计算
// ────────────────────────────────────────────────
describe('electronPhase / ionPhase 动画相位', () => {
  it('electronPhase 在 [0, 1) 范围内', () => {
    const res = calc({ current: 1.5, mode: 0, membraneType: 0, time: 3 })
    expect(res.electronPhase).toBeGreaterThanOrEqual(0)
    expect(res.electronPhase).toBeLessThan(1)
  })

  it('ionPhase 在 [0, 1) 范围内', () => {
    const res = calc({ current: 1.5, mode: 0, membraneType: 0, time: 3 })
    expect(res.ionPhase).toBeGreaterThanOrEqual(0)
    expect(res.ionPhase).toBeLessThan(1)
  })
})

// ────────────────────────────────────────────────
// § 5  pH 量纲回归锁（P0-2）
//     原实现 pH = 14 + lg(1e-7 + ne × c0) —— ne(mol) × c0(mol/L) = mol²/L，
//     量纲非法；且 Math.min(14, cOH) 把 pH 的上限误用到浓度上。
//     修复后 pH 一律由 c = n / V 导出（恒流模型下与初始浓度无关，
//     该页 c0 参数已随之移除，避免留下不影响任何输出的假滑块）。
// ────────────────────────────────────────────────
describe('pH 量纲正确性（P0-2 回归锁）', () => {
  const V = 1.0 // 与 @/chemistry/electrochemical 的 ELECTROLYTE_VOLUME_L 一致
  const WATER = 1.0e-7 // 中性水本底 c(H⁺) = c(OH⁻)

  it('阳离子膜：pH 只由转移电子量 n(e⁻) 决定（同 I·t 必得同 pH）', () => {
    // I·t 相同 → n(e⁻) 相同 → pH 必须相同（原实现还额外乘了初始浓度 c0，已删）
    const a = calc({ current: 0.75, mode: 1, membraneType: 0, time: 16 })
    const b = calc({ current: 1.5, mode: 1, membraneType: 0, time: 8 })
    expect(a.pH).toBe(b.pH)
  })

  it('阴离子膜：pH 只由转移电子量 n(e⁻) 决定（同 I·t 必得同 pH）', () => {
    const a = calc({ current: 0.75, mode: 1, membraneType: 1, time: 16 })
    const b = calc({ current: 1.5, mode: 1, membraneType: 1, time: 8 })
    expect(a.pH).toBe(b.pH)
  })

  it('阳离子膜：pH 严格等于 14 + lg(n(e⁻)/V + 1e-7)', () => {
    const res = calc({ current: 1.5, mode: 1, membraneType: 0, time: 6 })
    expect(res.pH).toBeCloseTo(14 + Math.log10(res.ne / V + WATER), 2)
  })

  it('阴离子膜：pH 严格等于 −lg(n(e⁻)/V + 1e-7)，不再是「生成酸而 pH 几乎不动」', () => {
    const res = calc({ current: 1.5, mode: 1, membraneType: 1, time: 8 })
    expect(res.pH).toBeCloseTo(-Math.log10(res.ne / V + WATER), 2)
    // 修复前该工况 pH ≈ 6.93（肉眼不可见），修复后应显著低于 7
    expect(res.pH).toBeLessThan(6.5)
  })

  it('t = 0 时两膜均回中性 7.00', () => {
    for (const membraneType of [0, 1]) {
      const res = calc({ current: 1.5, mode: 1, membraneType, time: 0 })
      expect(res.pH).toBeCloseTo(7.0, 2)
    }
  })

  it('阳离子膜 pH 随时间单调不降，阴离子膜 pH 随时间单调不升', () => {
    const times = [0, 2, 4, 6, 8, 10]
    const baseSeries = times.map(
      (time) => calc({ current: 1.5, mode: 1, membraneType: 0, time }).pH
    )
    const acidSeries = times.map(
      (time) => calc({ current: 1.5, mode: 1, membraneType: 1, time }).pH
    )
    for (let i = 1; i < times.length; i++) {
      expect(baseSeries[i]).toBeGreaterThanOrEqual(baseSeries[i - 1])
      expect(acidSeries[i]).toBeLessThanOrEqual(acidSeries[i - 1])
    }
    expect(baseSeries[baseSeries.length - 1]).toBeGreaterThan(10)
    expect(acidSeries[acidSeries.length - 1]).toBeLessThan(3)
  })

  it('pH 不越界：阳膜 ≤ 14，阴膜 > 0，质子膜恒 7', () => {
    const limit = { current: 3.0, mode: 1, time: 10 }
    const base = calc({ ...limit, membraneType: 0 })
    const acid = calc({ ...limit, membraneType: 1 })
    const pem = calc({ ...limit, membraneType: 2 })
    expect(base.pH).toBeLessThanOrEqual(14)
    expect(acid.pH).toBeGreaterThan(0)
    expect(pem.pH).toBeCloseTo(7.0, 2)
  })
})

// ────────────────────────────────────────────────
// § 6  量面板 ↔ hook 严格同源（P0-2 根因锁）
//     同一份公式曾在 hook / 量面板 / 图表三处各写一份，三份同时错。
//     修复方式为抽出 @/chemistry/electrochemical 单一来源，此处锁死调用方一致。
// ────────────────────────────────────────────────
describe('量面板与 hook 同源（P0-2 根因锁）', () => {
  it('三种膜类型下量面板 pH 与 hook pH 完全一致', () => {
    for (const membraneType of [0, 1, 2]) {
      const params = { current: 1.5, mode: 1, membraneType }
      const res = calc({ ...params, time: 7 })
      const phQuantity = buildElectrochemicalApplicationQuantities(params, 7).find(
        (q) => q.key === 'pH'
      )
      expect(phQuantity).toBeDefined()
      expect(phQuantity?.value).toBeCloseTo(res.pH, 2)
    }
  })

  it('量面板与 hook 的 n(e⁻) 一致', () => {
    const params = { current: 1.5, mode: 0, membraneType: 0 }
    const res = calc({ ...params, time: 5 })
    const neQuantity = buildElectrochemicalApplicationQuantities(params, 5).find(
      (q) => q.key === 'ne'
    )
    expect(neQuantity?.value).toBeCloseTo(res.ne, 4)
  })
})
