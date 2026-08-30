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
})
