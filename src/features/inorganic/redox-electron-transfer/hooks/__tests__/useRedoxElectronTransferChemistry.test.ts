import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  REACTION_MODELS,
  useRedoxElectronTransferChemistry,
} from '../useRedoxElectronTransferChemistry'

describe('useRedoxElectronTransferChemistry — 氧化还原四大反应模型测试', () => {
  it('应当正确计算 Na + Cl2 反应模型的电子转移数与进度', () => {
    const { result } = renderHook(() =>
      useRedoxElectronTransferChemistry({ reactionIndex: 0, moleAmount: 2.0, time: 1.5 })
    )

    expect(result.current.model.id).toBe(0)
    expect(result.current.actualTransferredElectrons).toBe(4.0) // 2 * 2.0 = 4.0 mol
    expect(result.current.progress).toBe(0.5) // 1.5 / 3.0 = 0.5
  })

  it('应当正确计算 Zn + CuSO4 置换反应模型 (Zn 失 2e-, Cu2+ 得 2e-)', () => {
    const { result } = renderHook(() =>
      useRedoxElectronTransferChemistry({ reactionIndex: 1, moleAmount: 1.5, time: 3.0 })
    )

    expect(result.current.model.id).toBe(1)
    expect(result.current.actualTransferredElectrons).toBe(3.0) // 2 * 1.5 = 3.0 mol
    expect(result.current.model.oxidant).toContain('CuSO₄')
    expect(result.current.model.reductant).toBe('Zn')
  })

  it('应当正确计算 MnO2 + 4HCl(浓) 部分氧化还原模型 (4mol HCl 中仅 2mol 被氧化转移 2mol e-)', () => {
    const { result } = renderHook(() =>
      useRedoxElectronTransferChemistry({ reactionIndex: 2, moleAmount: 1.0, time: 3.0 })
    )

    expect(result.current.model.id).toBe(2)
    expect(result.current.actualTransferredElectrons).toBe(2.0)
    expect(result.current.model.oxProduct).toBe('Cl₂')
    expect(result.current.model.elements.spectator?.role).toContain('显酸性')
    expect(result.current.model.examTips).toContain('高考陷阱')
  })

  it('应当正确计算 KMnO4 + H2O2 复杂守恒氧化还原模型', () => {
    const { result } = renderHook(() =>
      useRedoxElectronTransferChemistry({ reactionIndex: 3, moleAmount: 1.0, time: 3.0 })
    )

    expect(result.current.model.id).toBe(3)
    expect(result.current.actualTransferredElectrons).toBe(10.0) // 10 * 1.0 = 10.0 mol
    expect(result.current.progress).toBe(1.0)
  })
})

// ────────────────────────────────────────────────
// § 计量关系与守恒回归锁（P0-3）
//     旧实现把消耗/生成的物质的量写成 factor*1.0 与 factor*(count/2)，
//     使 2Na+Cl₂ 少算一半、Zn+CuSO₄ 的氧化产物只有 0.5 mol，
//     且「还原剂」与「氧化剂」两柱恒等（图表里还误用同一字段）。
// ────────────────────────────────────────────────
describe('氧化还原计量关系与守恒（P0-3 回归锁）', () => {
  /** 各模型 n = 1 时的期望计量数：(氧化剂, 还原剂, 氧化产物, 还原产物) */
  const EXPECTED_STOICH = [
    [1, 2, 2, 2], // 2Na + Cl₂ = 2NaCl
    [1, 1, 1, 1], // Zn + CuSO₄ = ZnSO₄ + Cu
    [1, 4, 1, 1], // MnO₂ + 4HCl(浓) = MnCl₂ + Cl₂↑ + 2H₂O
    [2, 5, 5, 2], // 2KMnO₄ + 5H₂O₂ + 3H₂SO₄ = 2MnSO₄ + 5O₂↑ + K₂SO₄ + 8H₂O
  ]

  it('四个模型的基准转移电子数均满足电子守恒', () => {
    for (const model of REACTION_MODELS) {
      const lost = model.elements.oxidized.count * model.elements.oxidized.delta
      const gained = Math.abs(model.elements.reduced.count * model.elements.reduced.delta)
      expect(lost).toBe(model.transferredElectrons)
      expect(gained).toBe(model.transferredElectrons)
    }
  })

  it('化学计量数与方程式最小整数配平比一致', () => {
    REACTION_MODELS.forEach((model, i) => {
      const [oxidant, reductant, oxProduct, redProduct] = EXPECTED_STOICH[i]
      expect(model.stoichiometry).toEqual({ oxidant, reductant, oxProduct, redProduct })
    })
  })

  it('elements.count 必须是对应产物计量数的整数倍（每个产物分子含整数个变价原子）', () => {
    for (const model of REACTION_MODELS) {
      expect(model.elements.oxidized.count % model.stoichiometry.oxProduct).toBe(0)
      expect(model.elements.reduced.count % model.stoichiometry.redProduct).toBe(0)
    }
  })

  it('n = 1 时 hook 返回的各物质的量等于方程式计量数', () => {
    REACTION_MODELS.forEach((_, reactionIndex) => {
      const { result } = renderHook(() =>
        useRedoxElectronTransferChemistry({ reactionIndex, moleAmount: 1.0, time: 3.0 })
      )
      const [oxidant, reductant, oxProduct, redProduct] = EXPECTED_STOICH[reactionIndex]
      expect(result.current.actualOxidantMoles).toBeCloseTo(oxidant, 10)
      expect(result.current.actualReductantMoles).toBeCloseTo(reductant, 10)
      expect(result.current.actualOxProductMoles).toBeCloseTo(oxProduct, 10)
      expect(result.current.actualRedProductMoles).toBeCloseTo(redProduct, 10)
    })
  })

  it('2Na + Cl₂：氧化剂与还原剂不得相等，且氧化产物不再少算一半', () => {
    const { result } = renderHook(() =>
      useRedoxElectronTransferChemistry({ reactionIndex: 0, moleAmount: 2.0, time: 3.0 })
    )
    expect(result.current.actualOxidantMoles).toBe(2.0) // Cl₂ 1 × 2
    expect(result.current.actualReductantMoles).toBe(4.0) // Na 2 × 2
    expect(result.current.actualReductantMoles).not.toBe(result.current.actualOxidantMoles)
    expect(result.current.actualOxProductMoles).toBe(4.0) // 旧实现给 2.0（count/2）
  })

  it('还原产物满足「计量数 × |降价| = 转移电子数」', () => {
    for (const model of REACTION_MODELS) {
      expect(model.stoichiometry.redProduct * Math.abs(model.elements.reduced.delta)).toBe(
        model.transferredElectrons
      )
    }
  })

  it('MnO₂ + 4HCl：还原剂按投入量计为 4n，其中仅 2n 被氧化（高考陷阱）', () => {
    const { result } = renderHook(() =>
      useRedoxElectronTransferChemistry({ reactionIndex: 2, moleAmount: 1.0, time: 3.0 })
    )
    expect(result.current.actualReductantMoles).toBe(4.0)
    expect(result.current.actualTransferredElectrons).toBe(2.0)
    expect(result.current.model.elements.oxidized.count).toBe(2)
    expect(result.current.model.elements.spectator?.count).toBe(2)
  })
})
