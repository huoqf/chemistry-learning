/**
 * 电化学综合应用化学量单元测试
 *
 * 覆盖三大核心模式：
 *   mode=0  双池盐桥原电池 (Zn-Cu)
 *   mode=1  离子交换膜电解池（阳离子膜/阴离子膜/质子膜三分支）
 *   mode=2  串联电化学池
 *
 * 关键化学正确性验收：
 *   - 法拉第定律 n(e⁻) = I·t / F
 *   - 原电池：负极 Zn 溶解（Δm < 0），正极 Cu 析出（Δm > 0）
 *   - 阳离子膜：阳极 Cl₂↑，Na⁺ 穿膜，阴极侧 OH⁻ 积累 pH > 7
 *   - 阴离子膜：阳极 O₂↑（H₂O 氧化），Cl⁻ 穿膜至阳极区
 *   - 质子膜：阴极 H₂↑，阳极 O₂↑，pH 保持中性
 */

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import {
  useElectrochemicalApplicationChemistry,
} from '../useElectrochemicalApplicationChemistry'

const F = 96485 // 法拉第常数

/** 辅助函数：通过 renderHook 计算电化学状态 */
function calc(params: {
  current: number
  c0: number
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
    const I = 1.5, t = 4, c0 = 1.0
    const expected = (I * t * 50) / F
    const res = calc({ current: I, c0, mode: 0, membraneType: 0, time: t })
    expect(res.ne).toBeCloseTo(expected, 4)
  })

  it('n(e⁻) 随电流线性增大', () => {
    const base = calc({ current: 1.0, c0: 1.0, mode: 0, membraneType: 0, time: 5 })
    const double = calc({ current: 2.0, c0: 1.0, mode: 0, membraneType: 0, time: 5 })
    expect(double.ne).toBeCloseTo(base.ne * 2, 3)
  })

  it('n(e⁻) 随时间线性增大', () => {
    const t1 = calc({ current: 1.0, c0: 1.0, mode: 0, membraneType: 0, time: 3 })
    const t2 = calc({ current: 1.0, c0: 1.0, mode: 0, membraneType: 0, time: 6 })
    expect(t2.ne).toBeCloseTo(t1.ne * 2, 3)
  })
})

// ────────────────────────────────────────────────
// § 1  mode=0 双池盐桥原电池 (Zn-Cu)
// ────────────────────────────────────────────────
describe('mode=0 双池盐桥原电池 (Zn-Cu)', () => {
  it('负极 Zn 溶解 → anodeMassDelta < 0', () => {
    const res = calc({ current: 1.5, c0: 1.0, mode: 0, membraneType: 0, time: 5 })
    expect(res.anodeMassDelta).toBeLessThan(0)
  })

  it('正极 Cu 析出 → cathodeMassDelta > 0', () => {
    const res = calc({ current: 1.5, c0: 1.0, mode: 0, membraneType: 0, time: 5 })
    expect(res.cathodeMassDelta).toBeGreaterThan(0)
  })

  it('Zn(M=65.38) 每转移 2mol e⁻ 溶解 65.38g，Cu(M=63.55) 析出 63.55g — 比值验证', () => {
    // Zn-2e⁻ = Zn²⁺ → 每 2mol e⁻ 损失 65.38g Zn
    // Cu²⁺+2e⁻ = Cu → 每 2mol e⁻ 析出 63.55g Cu
    const res = calc({ current: 1.5, c0: 1.0, mode: 0, membraneType: 0, time: 5 })
    const expectedZnLoss = (res.ne * 0.5 * 65.38)
    const expectedCuGain = res.ne * 0.5 * 63.55
    expect(Math.abs(res.anodeMassDelta)).toBeCloseTo(expectedZnLoss, 2)
    expect(res.cathodeMassDelta).toBeCloseTo(expectedCuGain, 2)
  })

  it('盐桥原电池溶液 pH = 7.0（无酸碱变化）', () => {
    const res = calc({ current: 1.5, c0: 1.0, mode: 0, membraneType: 0, time: 5 })
    expect(res.pH).toBeCloseTo(7.0, 1)
  })

  it('盐桥膜迁移离子标识包含 K⁺/NO₃⁻', () => {
    const res = calc({ current: 1.5, c0: 1.0, mode: 0, membraneType: 0, time: 5 })
    expect(res.membraneIonSymbol).toContain('K⁺')
  })

  it('无气体产生（原电池不电解水）', () => {
    const res = calc({ current: 1.5, c0: 1.0, mode: 0, membraneType: 0, time: 5 })
    expect(res.anodeGasName).toBe('')
    expect(res.cathodeGasName).toBe('')
  })
})

// ────────────────────────────────────────────────
// § 2  mode=1 离子交换膜电解池
// ────────────────────────────────────────────────
describe('mode=1 阳离子膜 — 氯碱工业 (membraneType=0)', () => {
  const base = { current: 1.5, c0: 1.0, mode: 1, membraneType: 0, time: 5 }

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
  const base = { current: 1.5, c0: 1.0, mode: 1, membraneType: 1, time: 5 }

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
  const base = { current: 1.5, c0: 1.0, mode: 1, membraneType: 2, time: 5 }

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
  const base = { current: 1.5, c0: 1.0, mode: 2, membraneType: 0, time: 5 }

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
    const res = calc({ current: 1.5, c0: 1.0, mode: 0, membraneType: 0, time: 3 })
    expect(res.electronPhase).toBeGreaterThanOrEqual(0)
    expect(res.electronPhase).toBeLessThan(1)
  })

  it('ionPhase 在 [0, 1) 范围内', () => {
    const res = calc({ current: 1.5, c0: 1.0, mode: 0, membraneType: 0, time: 3 })
    expect(res.ionPhase).toBeGreaterThanOrEqual(0)
    expect(res.ionPhase).toBeLessThan(1)
  })
})
