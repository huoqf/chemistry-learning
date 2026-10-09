import { describe, it, expect } from 'vitest'
import {
  BASE_EQ_NO2,
  BASE_EQ_N2O4,
  CONCENTRATION_FLOOR,
  EQUILIBRIUM_K0,
  EQUILIBRIUM_T0,
  EA1_OVER_R,
  NEG_DELTA_H_OVER_R,
  equilibriumConstant,
  forwardRateConstant,
  no2N2o4State,
  reverseRateConstant,
} from '../equilibrium'

const NEAR_T0 = 298
const HIGH_T = 350

describe('equilibriumConstant', () => {
  it('基准温度 T₀ 下 K = K₀', () => {
    expect(equilibriumConstant(EQUILIBRIUM_T0)).toBe(EQUILIBRIUM_K0)
  })

  it('放热反应：升温 K 减小', () => {
    expect(equilibriumConstant(HIGH_T)).toBeLessThan(equilibriumConstant(NEAR_T0))
  })

  it('van\'t Hoff 形式自洽：K(T₂)/K(T₁) = exp((−ΔH/R)(1/T₂ − 1/T₁))', () => {
    const ratio = equilibriumConstant(HIGH_T) / equilibriumConstant(NEAR_T0)
    const expected = Math.exp(NEG_DELTA_H_OVER_R * (1 / HIGH_T - 1 / NEAR_T0))
    expect(ratio).toBeCloseTo(expected, 10)
  })
})

describe('速率常数的温度依赖（P1-9 回归锁）', () => {
  it('基准温度下 k(正) 与 k(逆) 的比值恰好等于 1/K₀', () => {
    expect(reverseRateConstant(EQUILIBRIUM_T0) / forwardRateConstant(EQUILIBRIUM_T0)).toBeCloseTo(
      1 / EQUILIBRIUM_K0,
      10
    )
  })

  it('升温时 k(正) 必须增大（原实现把它写成与温度无关的常数）', () => {
    expect(forwardRateConstant(HIGH_T)).toBeGreaterThan(forwardRateConstant(NEAR_T0))
  })

  it('升温时 k(逆) 必须增大（原实现因 kr = kf/K 而随 K 减小而下降）', () => {
    expect(reverseRateConstant(HIGH_T)).toBeGreaterThan(reverseRateConstant(NEAR_T0))
  })

  it('放热反应 Ea₁ < Ea₂：升温时 k(逆) 的相对增幅大于 k(正)', () => {
    const kfRatio = forwardRateConstant(HIGH_T) / forwardRateConstant(NEAR_T0)
    const krRatio = reverseRateConstant(HIGH_T) / reverseRateConstant(NEAR_T0)
    expect(krRatio).toBeGreaterThan(kfRatio)
  })

  it('k(逆)/k(正) 恒等于 1/K(T)，速率与平衡常数自洽', () => {
    for (const T of [280, 298, 320, 350, 398]) {
      expect(reverseRateConstant(T) / forwardRateConstant(T)).toBeCloseTo(
        1 / equilibriumConstant(T),
        12
      )
    }
  })

  it('k(逆) 的 Arrhenius 斜率 = Ea₁/R + (−ΔH/R) = 5000 K', () => {
    const impliedEa2OverR =
      Math.log(reverseRateConstant(HIGH_T) / reverseRateConstant(NEAR_T0)) /
      (1 / NEAR_T0 - 1 / HIGH_T)
    expect(impliedEa2OverR).toBeCloseTo(EA1_OVER_R + NEG_DELTA_H_OVER_R, 6)
  })
})

describe('no2N2o4State', () => {
  const BASE = { temp: 298, pressure: 1.0, addedNO2: 0 }

  it('基准无扰动初态严格处于化学平衡：Qc = K₀，且 c(NO₂) + 2c(N₂O₄) = 2.0', () => {
    const s = no2N2o4State(BASE.temp, BASE.pressure, BASE.addedNO2, 0)
    expect(s.cNO2).toBeCloseTo(BASE_EQ_NO2, 10)
    expect(s.cN2O4).toBeCloseTo(BASE_EQ_N2O4, 10)
    expect(s.Qc).toBeCloseTo(EQUILIBRIUM_K0, 10)
    expect(s.vForward).toBeCloseTo(s.vReverse, 10)
    expect(s.cNO2 + 2 * s.cN2O4).toBeCloseTo(2.0, 10)
  })

  it('充分弛豫后 Qc 收敛到 K（真正到达平衡）', () => {
    const s = no2N2o4State(BASE.temp, BASE.pressure, BASE.addedNO2, 200)
    expect(s.K).toBe(EQUILIBRIUM_K0)
    expect(s.Qc).toBeCloseTo(s.K, 6)
  })

  it('平衡态下 v(正) = v(逆)', () => {
    const s = no2N2o4State(BASE.temp, BASE.pressure, BASE.addedNO2, 200)
    expect(s.vForward).toBeCloseTo(s.vReverse, 6)
  })

  it('物料守恒：c(NO₂) + 2c(N₂O₄) = (2 + 外加NO₂)·pressure 始终成立', () => {
    for (const pressure of [0.5, 1.0, 2.0, 3.0]) {
      for (const addedNO2 of [0, 0.5, 1.0]) {
        const s = no2N2o4State(298, pressure, addedNO2, 7.3)
        expect(s.cNO2 + 2 * s.cN2O4).toBeCloseTo((2.0 + addedNO2) * pressure, 6)
      }
    }
  })

  it('加压扰动瞬间 Qc < K，故 v(正) > v(逆)（向气体分子数减小方向移动）', () => {
    const s = no2N2o4State(298, 2.0, 0, 0.1)
    expect(s.Qc).toBeLessThan(s.K)
    expect(s.vForward).toBeGreaterThan(s.vReverse)
  })

  it('外加 NO₂ 扰动瞬间 v(正) > v(逆)', () => {
    const s = no2N2o4State(298, 1.0, 1.0, 0.1)
    expect(s.vForward).toBeGreaterThan(s.vReverse)
  })

  it('升到高温且长时间弛豫后，NO₂ 占比高于低温（放热反应逆向移动）', () => {
    const low = no2N2o4State(298, 1.0, 0, 200)
    const high = no2N2o4State(398, 1.0, 0, 200)
    expect(high.cNO2).toBeGreaterThan(low.cNO2)
    expect(high.cN2O4).toBeLessThan(low.cN2O4)
  })

  it('极端参数下浓度永不跌破钳制下限（不会出现 0 或负值导致 Qc 发散）', () => {
    for (const pressure of [0.05, 1.0, 3.0]) {
      for (const addedNO2 of [0, 5.0]) {
        for (const time of [0, 10]) {
          const s = no2N2o4State(398, pressure, addedNO2, time)
          expect(s.cNO2).toBeGreaterThanOrEqual(CONCENTRATION_FLOOR)
          expect(s.cN2O4).toBeGreaterThanOrEqual(CONCENTRATION_FLOOR)
          expect(Number.isFinite(s.Qc)).toBe(true)
        }
      }
    }
  })
})
