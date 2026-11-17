import { describe, it, expect } from 'vitest'
import { getChemistryQuantities } from '../chemistryQuantities'
import { reactionPrincipleAnimations } from '../registries/reaction-principle'
import { structureAnimations } from '../registries/structure'
import { inorganicAnimations } from '../registries/inorganic'
import { experimentAnimations } from '../registries/experiment'

const ALL_REGISTRATIONS = {
  ...reactionPrincipleAnimations,
  ...structureAnimations,
  ...inorganicAnimations,
  ...experimentAnimations,
}

describe('chemistryQuantities — 全量 12 动画化学量注册覆盖守门', () => {
  it('未注册的 animationId 返回空数组', () => {
    expect(getChemistryQuantities('nonexistent', {}, 0)).toEqual([])
  })

  it('全库全部注册动画均绑定了化学量构建器且在默认参数下无 NaN / Infinity', () => {
    const entries = Object.entries(ALL_REGISTRATIONS)
    expect(entries.length).toBeGreaterThanOrEqual(12)

    for (const [animId, config] of entries) {
      const defaults = (config.defaultParams || {}) as Record<string, number>
      for (const t of [0, 2.5]) {
        const list = getChemistryQuantities(animId, defaults, t)
        expect(list.length, `${animId} 在 t=${t} 返回了空化学量列表`).toBeGreaterThan(0)
        for (const item of list) {
          expect(item.key, `${animId} 存在空 key`).toBeTruthy()
          expect(item.label, `${animId}.${item.key} 存在空 label`).toBeTruthy()
          expect(
            typeof item.value === 'number' && Number.isFinite(item.value),
            `${animId}.${item.key} 值非有限数字: ${String(item.value)}`
          ).toBe(true)
        }
      }
    }
  })

  it('化学量输出随核心输入参数变化', () => {
    const qLow = getChemistryQuantities('anim-collision-theory', { temperature: 298, concentration: 1.0, activationEnergy: 80, catalyst: 0 }, 0)
    const qHigh = getChemistryQuantities('anim-collision-theory', { temperature: 450, concentration: 1.0, activationEnergy: 80, catalyst: 0 }, 0)
    expect(qLow).not.toEqual(qHigh)
  })
})
