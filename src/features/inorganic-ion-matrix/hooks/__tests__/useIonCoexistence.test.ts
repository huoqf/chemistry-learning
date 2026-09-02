import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIonCoexistence } from '../useIonCoexistence'

describe('useIonCoexistence', () => {
  it('should detect Ba2+ and SO42- precipitate conflict', () => {
    const { result } = renderHook(() => useIonCoexistence(['Ba2+', 'SO42-']))
    expect(result.current.canCoexist).toBe(false)
    expect(result.current.conflicts.length).toBe(1)
    expect(result.current.conflicts[0].type).toBe('precipitate')
  })

  it('should detect Fe3+ and I- redox conflict', () => {
    const { result } = renderHook(() => useIonCoexistence(['Fe3+', 'I-']))
    expect(result.current.canCoexist).toBe(false)
    expect(result.current.conflicts[0].type).toBe('redox')
  })

  it('should detect Al3+ and CO32- double hydrolysis conflict', () => {
    const { result } = renderHook(() => useIonCoexistence(['Al3+', 'CO32-']))
    expect(result.current.canCoexist).toBe(false)
    expect(result.current.conflicts[0].type).toBe('double-hydrolysis')
  })

  it('should allow benign ions to coexist', () => {
    const { result } = renderHook(() => useIonCoexistence(['Fe2+', 'Cl-']))
    expect(result.current.canCoexist).toBe(true)
    expect(result.current.conflicts.length).toBe(0)
  })

  it('should detect multiple compound conflicts in complex multi-ion mixtures', () => {
    // 混合 Fe3+, I-, Ba2+, SO42- 体系：同时发生 Fe3+/I- 氧化还原 与 Ba2+/SO42- 沉淀
    const { result } = renderHook(() =>
      useIonCoexistence(['Fe3+', 'I-', 'Ba2+', 'SO42-'])
    )
    expect(result.current.canCoexist).toBe(false)
    expect(result.current.conflicts.length).toBe(2)
    const types = result.current.conflicts.map((c) => c.type)
    expect(types).toContain('redox')
    expect(types).toContain('precipitate')
  })

  it('should allow multi-ion benign mixtures to coexist stably', () => {
    // 经典可大量共存体系：Mg2+, Na+/NH4+, Cl-, SO42- (无 Ba2+/Ag+ 沉淀，无氧化还原互斥)
    const { result } = renderHook(() =>
      useIonCoexistence(['Mg2+', 'NH4+', 'Cl-', 'Br-'])
    )
    expect(result.current.canCoexist).toBe(true)
    expect(result.current.conflicts.length).toBe(0)
    expect(result.current.selectedIonObjects.length).toBe(4)
  })

  it('should correctly allow Ba2+ and AlO2- to coexist without false double-hydrolysis', () => {
    // Ba(OH)2 是强碱可溶强电解质，Ba2+ 与 AlO2- 完全能大量共存
    const { result } = renderHook(() => useIonCoexistence(['Ba2+', 'AlO2-']))
    expect(result.current.canCoexist).toBe(true)
    expect(result.current.conflicts.length).toBe(0)
  })

  it('should detect strong oxidant anions (MnO4-, ClO-) and reducing anions (SO32-, I-) redox conflict', () => {
    // MnO4- 与 SO32- 自发氧化还原
    const { result: r1 } = renderHook(() => useIonCoexistence(['MnO4-', 'SO32-']))
    expect(r1.current.canCoexist).toBe(false)
    expect(r1.current.conflicts.some((c) => c.type === 'redox')).toBe(true)

    // ClO- 与 I- 自发氧化还原
    const { result: r2 } = renderHook(() => useIonCoexistence(['ClO-', 'I-']))
    expect(r2.current.canCoexist).toBe(false)
    expect(r2.current.conflicts.some((c) => c.type === 'redox')).toBe(true)
  })
})
