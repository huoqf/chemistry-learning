/**
 * 碰撞理论化学量单元测试
 *
 * 覆盖三大纯函数：
 *   1. computeMaxwellBoltzmann  — 麦克斯韦-玻尔兹曼能量分布
 *   2. computeEnergyProfile     — 反应势能曲线
 *   3. initCollisionWorld       — 碰撞物理世界初始化
 */

import { describe, it, expect } from 'vitest'
import { computeMaxwellBoltzmann } from '../useMaxwellBoltzmann'
import { computeEnergyProfile } from '../useEnergyProfile'
import { initCollisionWorld } from '../useCollisionPhysics'

// ────────────────────────────────────────────────
// § 1  麦克斯韦-玻尔兹曼能量分布
// ────────────────────────────────────────────────
describe('computeMaxwellBoltzmann — 麦克斯韦-玻尔兹曼能量分布', () => {
  it('曲线数据点数量与 steps=100 一致（101 个点含端点）', () => {
    const result = computeMaxwellBoltzmann(298, 80, false)
    expect(result.curvePoints.length).toBe(101)
  })

  it('活化分子比例 activationFraction 在合法范围 [0.01, 0.99]', () => {
    const result = computeMaxwellBoltzmann(298, 80, false)
    expect(result.activationFraction).toBeGreaterThanOrEqual(0.01)
    expect(result.activationFraction).toBeLessThanOrEqual(0.99)
  })

  it('升高温度 → 活化分子比例增大（高温比低温的 f 更高）', () => {
    const lowT = computeMaxwellBoltzmann(298, 80, false)
    const highT = computeMaxwellBoltzmann(500, 80, false)
    expect(highT.activationFraction).toBeGreaterThan(lowT.activationFraction)
  })

  it('增大活化能 Ea → 活化分子比例降低（Ea 越高 f 越小）', () => {
    const lowEa = computeMaxwellBoltzmann(298, 40, false)
    const highEa = computeMaxwellBoltzmann(298, 100, false)
    expect(lowEa.activationFraction).toBeGreaterThan(highEa.activationFraction)
  })

  it('催化剂将有效 Ea 降低 → 活化分子比例提升', () => {
    const noCat = computeMaxwellBoltzmann(298, 80, false)
    const withCat = computeMaxwellBoltzmann(298, 80, true)
    // 催化剂降低 Ea 门槛，活化区面积增大
    expect(withCat.activationFraction).toBeGreaterThan(noCat.activationFraction)
  })

  it('峰值能量随温度线性增大（T=596K 时 peakEnergy ≈ T=298K 时的 2 倍）', () => {
    const lowT = computeMaxwellBoltzmann(298, 80, false)
    const doubleT = computeMaxwellBoltzmann(596, 80, false)
    expect(doubleT.peakEnergy).toBeCloseTo(lowT.peakEnergy * 2, 0)
  })

  it('活化点 isActivated 标记应与 effectiveEa 门槛一致（无催化剂 Ea=80）', () => {
    const result = computeMaxwellBoltzmann(298, 80, false)
    // 所有 activatedPoints 的 energy 必须 >= 80
    result.activatedPoints.forEach(pt => {
      expect(pt.energy).toBeGreaterThanOrEqual(80 - 0.01) // 允许浮点误差
      expect(pt.isActivated).toBe(true)
    })
  })
})

// ────────────────────────────────────────────────
// § 2  反应势能曲线（活化能与 ΔH）
// ────────────────────────────────────────────────
describe('computeEnergyProfile — 反应势能曲线', () => {
  it('放热反应 ΔH = −40 kJ/mol', () => {
    const result = computeEnergyProfile('exothermic', 80)
    expect(result.deltaH).toBe(-40)
    expect(result.productsEnergy).toBeLessThan(result.reactantsEnergy)
  })

  it('吸热反应 ΔH = +40 kJ/mol', () => {
    const result = computeEnergyProfile('endothermic', 80)
    expect(result.deltaH).toBe(40)
    expect(result.productsEnergy).toBeGreaterThan(result.reactantsEnergy)
  })

  it('正活化能 ea1Normal 等于传入的 activationEnergy', () => {
    const ea = 60
    const result = computeEnergyProfile('exothermic', ea)
    expect(result.ea1Normal).toBe(ea)
  })

  it('逆活化能 ea2Normal = ea1Normal − ΔH（放热反应）', () => {
    // 放热：ΔH=-40, ea1=80 → ea2 = 80 - (-40) = 120
    const result = computeEnergyProfile('exothermic', 80)
    expect(result.ea2Normal).toBeCloseTo(result.ea1Normal - result.deltaH, 5)
  })

  it('催化剂降低正活化能（ea1Catalyst < ea1Normal）', () => {
    const noCat = computeEnergyProfile('exothermic', 80, false)
    const withCat = computeEnergyProfile('exothermic', 80, true)
    expect(withCat.ea1Catalyst).toBeLessThan(noCat.ea1Normal)
  })

  it('催化剂不改变 ΔH（热力学函数）', () => {
    const noCat = computeEnergyProfile('exothermic', 80, false)
    const withCat = computeEnergyProfile('exothermic', 80, true)
    expect(withCat.deltaH).toBe(noCat.deltaH)
  })

  it('势能曲线点起点 x=0, 终点 x=1', () => {
    const result = computeEnergyProfile('exothermic', 80)
    expect(result.normalPath[0].x).toBeCloseTo(0, 5)
    expect(result.normalPath[result.normalPath.length - 1].x).toBeCloseTo(1, 5)
  })

  it('无催化剂曲线峰值能量 = reactantsEnergy + ea1Normal', () => {
    const result = computeEnergyProfile('exothermic', 80)
    expect(result.peakNormal.y).toBeCloseTo(result.reactantsEnergy + result.ea1Normal, 5)
  })
})

// ────────────────────────────────────────────────
// § 3  碰撞物理世界初始化
// ────────────────────────────────────────────────
describe('initCollisionWorld — 碰撞世界初始化', () => {
  const W = 400, H = 300

  it('粒子数量与浓度正比（concentration=1.0 → 约 14 个粒子）', () => {
    const world = initCollisionWorld(W, H, 298, 1.0, false)
    // baseCount=14, count = round(14*1.0) = 14
    expect(world.particles.length).toBe(14)
  })

  it('浓度增大 → 粒子数量增大', () => {
    const lowC = initCollisionWorld(W, H, 298, 0.5, false)
    const highC = initCollisionWorld(W, H, 298, 2.0, false)
    expect(highC.particles.length).toBeGreaterThan(lowC.particles.length)
  })

  it('粒子数量不低于 6 个（最小保证碰撞发生）', () => {
    const world = initCollisionWorld(W, H, 298, 0.1, false)
    expect(world.particles.length).toBeGreaterThanOrEqual(6)
  })

  it('所有粒子在画布范围内', () => {
    const world = initCollisionWorld(W, H, 298, 1.0, false)
    world.particles.forEach(p => {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(W)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(H)
    })
  })

  it('速率常数 rateConstant = 100 * f（f=活化分子比例）', () => {
    const world = initCollisionWorld(W, H, 298, 1.0, false)
    const { rateConstant, activationFraction } = world.stats
    expect(rateConstant).toBeCloseTo(100 * activationFraction, 5)
  })

  it('反应速率 reactionRate = rateConstant * concentration', () => {
    const c = 1.5
    const world = initCollisionWorld(W, H, 298, c, false)
    const { rateConstant, reactionRate } = world.stats
    expect(reactionRate).toBeCloseTo(rateConstant * c, 5)
  })

  it('催化剂降低 Ea → 活化分子比例升高 → 速率常数升高', () => {
    const noCat = initCollisionWorld(W, H, 298, 1.0, false, 80)
    const withCat = initCollisionWorld(W, H, 298, 1.0, true, 80)
    expect(withCat.stats.rateConstant).toBeGreaterThan(noCat.stats.rateConstant)
  })

  it('粒子类型 A2 与 B2 各占一半', () => {
    const world = initCollisionWorld(W, H, 298, 1.0, false)
    const a2Count = world.particles.filter(p => p.type === 'A2').length
    const b2Count = world.particles.filter(p => p.type === 'B2').length
    // 偶数粒子各半，奇数粒子相差 1
    expect(Math.abs(a2Count - b2Count)).toBeLessThanOrEqual(1)
  })
})
