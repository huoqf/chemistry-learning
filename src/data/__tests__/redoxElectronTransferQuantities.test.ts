import { describe, it, expect } from 'vitest'
import { buildRedoxElectronTransferQuantities } from '../quantities/inorganic/redoxElectronTransfer'
import { REACTION_MODELS } from '@/features/inorganic/redox-electron-transfer/hooks/useRedoxElectronTransferChemistry'

describe('buildRedoxElectronTransferQuantities', () => {
  it('量面板标签与左屏注册表一致，使用「反应进程倍率 n (倍)」', () => {
    const q = buildRedoxElectronTransferQuantities({ moleAmount: 2.0, reaction: 0 })
    const multiplierQ = q.find((item) => item.key === 'moleAmount')
    expect(multiplierQ).toBeDefined()
    expect(multiplierQ?.label).toBe('反应进程倍率 n')
    expect(multiplierQ?.unit).toBe('倍')
    expect(multiplierQ?.value).toBe(2.0)
  })

  it('各反应模型下输出准确的转移电子数与氧化剂/还原剂消耗量', () => {
    REACTION_MODELS.forEach((model, idx) => {
      const n = 1.5
      const q = buildRedoxElectronTransferQuantities({ moleAmount: n, reaction: idx })

      const neQ = q.find((item) => item.key === 'transferredElectrons')
      const oxQ = q.find((item) => item.key === 'oxidantMoles')
      const redQ = q.find((item) => item.key === 'reductantMoles')

      expect(neQ?.value).toBeCloseTo(model.transferredElectrons * n, 5)
      expect(oxQ?.value).toBeCloseTo(model.stoichiometry.oxidant * n, 5)
      expect(redQ?.value).toBeCloseTo(model.stoichiometry.reductant * n, 5)
      expect(oxQ?.label).toContain(model.oxidant)
      expect(redQ?.label).toContain(model.reductant)
    })
  })

  it('2Na + Cl₂ 反应中还原剂消耗量为氧化剂的 2 倍', () => {
    const q = buildRedoxElectronTransferQuantities({ moleAmount: 1.0, reaction: 0 })
    const oxQ = q.find((item) => item.key === 'oxidantMoles')
    const redQ = q.find((item) => item.key === 'reductantMoles')
    expect(redQ?.value).toBe(2.0)
    expect(oxQ?.value).toBe(1.0)
  })
})
