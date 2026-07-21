import { describe, it, expect } from 'vitest'
import { registerQuantityBuilder, getChemistryQuantities } from '../chemistryQuantities'

describe('chemistryQuantities', () => {
  it('未注册的 animationId 返回空数组', () => {
    expect(getChemistryQuantities('nonexistent', {}, 0)).toEqual([])
  })

  it('注册后可获取化学量列表', () => {
    registerQuantityBuilder('equilibrium-test', (_params, time) => [
      { key: 'concA', label: 'A 浓度', value: 1.0 - time * 0.1, unit: 'mol/L', colorKey: 'concentration' },
      { key: 'concB', label: 'B 浓度', value: time * 0.1, unit: 'mol/L', colorKey: 'concentration' },
    ])

    const quantities = getChemistryQuantities('equilibrium-test', {}, 5)
    expect(quantities).toHaveLength(2)
    expect(quantities[0].value).toBeCloseTo(0.5)
    expect(quantities[1].value).toBeCloseTo(0.5)
  })

  it('化学量列表随 params 变化', () => {
    registerQuantityBuilder('rate-test', (params) => [
      { key: 'rate', label: '反应速率', value: params.k as number * 0.5, unit: 'mol/(L·s)', colorKey: 'reactionRate' },
    ])

    const q1 = getChemistryQuantities('rate-test', { k: 2 }, 0)
    expect(q1[0].value).toBe(1.0)

    const q2 = getChemistryQuantities('rate-test', { k: 4 }, 0)
    expect(q2[0].value).toBe(2.0)
  })
})
