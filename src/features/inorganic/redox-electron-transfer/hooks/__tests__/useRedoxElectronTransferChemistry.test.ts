import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useRedoxElectronTransferChemistry } from '../useRedoxElectronTransferChemistry'

describe('useRedoxElectronTransferChemistry', () => {
  it('should calculate electron transfer for Na + Cl2 model', () => {
    const { result } = renderHook(() =>
      useRedoxElectronTransferChemistry({ reactionIndex: 0, moleAmount: 2.0, time: 1.5 })
    )

    expect(result.current.model.id).toBe(0)
    expect(result.current.actualTransferredElectrons).toBe(4.0) // 2 * 2.0 = 4.0 mol
    expect(result.current.progress).toBe(0.5) // 1.5 / 3.0 = 0.5
  })

  it('should calculate electron transfer for KMnO4 + H2O2 model', () => {
    const { result } = renderHook(() =>
      useRedoxElectronTransferChemistry({ reactionIndex: 3, moleAmount: 1.0, time: 3.0 })
    )

    expect(result.current.model.id).toBe(3)
    expect(result.current.actualTransferredElectrons).toBe(10.0) // 10 * 1.0 = 10.0 mol
    expect(result.current.progress).toBe(1.0)
  })
})
