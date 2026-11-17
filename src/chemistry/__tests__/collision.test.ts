/**
 * src/chemistry/__tests__/collision.test.ts
 * 碰撞理论纯计算模块单元测试
 */

import { describe, it, expect } from 'vitest'
import {
  computeEffectiveActivationEnergy,
  computeMaxwellBoltzmann,
  computeCollisionKinetics,
  CATALYST_EA_FACTOR,
} from '../collision'

describe('collision.ts — 碰撞理论核心物理化学计算', () => {
  describe('computeEffectiveActivationEnergy', () => {
    it('无催化剂时活化能保持原值', () => {
      expect(computeEffectiveActivationEnergy(80, false)).toBe(80)
      expect(computeEffectiveActivationEnergy(50, false)).toBe(50)
    })

    it('有催化剂时实效活化能按催化系数比例显著下降', () => {
      expect(computeEffectiveActivationEnergy(80, true)).toBeCloseTo(80 * CATALYST_EA_FACTOR, 5)
      expect(computeEffectiveActivationEnergy(100, true)).toBeLessThan(100)
    })
  })

  describe('computeMaxwellBoltzmann', () => {
    it('曲线包含 101 个采样点 (0~160 kJ/mol)', () => {
      const res = computeMaxwellBoltzmann(298, 80, false)
      expect(res.curvePoints.length).toBe(101)
      expect(res.curvePoints[0].energy).toBe(0)
      expect(res.curvePoints[100].energy).toBe(160)
    })

    it('升高温度使活化分子分数 f 显著增加，且峰值能量向右偏移', () => {
      const lowT = computeMaxwellBoltzmann(298, 80, false)
      const highT = computeMaxwellBoltzmann(500, 80, false)
      expect(highT.activationFraction).toBeGreaterThan(lowT.activationFraction)
      expect(highT.peakEnergy).toBeGreaterThan(lowT.peakEnergy)
    })

    it('增大活化能 Ea 使活化分子分数 f 单调降低', () => {
      const lowEa = computeMaxwellBoltzmann(298, 40, false)
      const highEa = computeMaxwellBoltzmann(298, 100, false)
      expect(lowEa.activationFraction).toBeGreaterThan(highEa.activationFraction)
    })

    it('加入催化剂使活化分子分数 f 显著提升', () => {
      const noCat = computeMaxwellBoltzmann(298, 80, false)
      const withCat = computeMaxwellBoltzmann(298, 80, true)
      expect(withCat.activationFraction).toBeGreaterThan(noCat.activationFraction)
    })

    it('所有 activatedPoints 的能量均大于等于实效活化能', () => {
      const res = computeMaxwellBoltzmann(298, 80, false)
      res.activatedPoints.forEach((pt) => {
        expect(pt.energy).toBeGreaterThanOrEqual(80 - 1e-4)
        expect(pt.isActivated).toBe(true)
      })
    })

    it('极低/极高 Ea 下活化分子占比被安全钳制在 [0.005, 0.99] 区间内', () => {
      const veryHighEa = computeMaxwellBoltzmann(250, 300, false)
      const veryLowEa = computeMaxwellBoltzmann(600, 0.1, true)
      expect(veryHighEa.activationFraction).toBeGreaterThanOrEqual(0.005)
      expect(veryLowEa.activationFraction).toBeLessThanOrEqual(0.99)
    })
  })

  describe('computeCollisionKinetics', () => {
    it('总碰撞频率 Z0 与浓度成正比', () => {
      const k1 = computeCollisionKinetics({
        temperature: 298,
        concentration: 1.0,
        activationEnergy: 80,
        hasCatalyst: false,
      })
      const k2 = computeCollisionKinetics({
        temperature: 298,
        concentration: 2.0,
        activationEnergy: 80,
        hasCatalyst: false,
      })
      expect(k2.totalCollisions).toBeCloseTo(k1.totalCollisions * 2, 4)
    })

    it('有效碰撞频率等于总碰撞频率乘以活化分子百分数', () => {
      const k = computeCollisionKinetics({
        temperature: 298,
        concentration: 1.0,
        activationEnergy: 80,
        hasCatalyst: false,
      })
      expect(k.effectiveCollisions).toBeCloseTo(k.totalCollisions * k.activationFraction, 5)
    })

    it('反应速率 v = k * c 恒成立，且变温下 v 与 Z_eff 保持恒定正比', () => {
      const lowT = computeCollisionKinetics({
        temperature: 298,
        concentration: 1.5,
        activationEnergy: 80,
        hasCatalyst: false,
      })
      const highT = computeCollisionKinetics({
        temperature: 500,
        concentration: 1.5,
        activationEnergy: 80,
        hasCatalyst: false,
      })
      expect(lowT.reactionRate).toBeCloseTo(lowT.rateConstant * 1.5, 5)
      expect(highT.reactionRate).toBeCloseTo(highT.rateConstant * 1.5, 5)
      expect(highT.reactionRate / highT.effectiveCollisions).toBeCloseTo(
        lowT.reactionRate / lowT.effectiveCollisions,
        8
      )
    })
  })
})
