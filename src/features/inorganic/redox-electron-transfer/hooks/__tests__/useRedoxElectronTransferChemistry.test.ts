import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useRedoxElectronTransferChemistry } from '../useRedoxElectronTransferChemistry'

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
