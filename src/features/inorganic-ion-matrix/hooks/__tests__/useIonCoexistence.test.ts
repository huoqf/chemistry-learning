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

  it('中性环境下 Fe2+ 与 NO3- 可大量共存；引入 H+ 酸化后立刻触发三元氧化还原冲突', () => {
    const { result: neutralRes } = renderHook(() => useIonCoexistence(['Fe2+', 'NO3-']))
    expect(neutralRes.current.canCoexist).toBe(true)
    expect(neutralRes.current.conflicts.length).toBe(0)

    const { result: acidRes } = renderHook(() => useIonCoexistence(['Fe2+', 'NO3-', 'H+']))
    expect(acidRes.current.canCoexist).toBe(false)
    expect(acidRes.current.conflicts.some((c) => c.type === 'redox')).toBe(true)
    expect(acidRes.current.conflicts.some((c) => c.equation.includes('3Fe^{2+} + NO_3^- + 4H^+'))).toBe(true)
  })

  it('should correctly allow Ba2+ and [Al(OH)4]- to coexist without false double-hydrolysis', () => {
    // Ba(OH)2 是强碱强电解质，Ba2+ 与 [Al(OH)4]- 可共存
    const { result } = renderHook(() => useIonCoexistence(['Ba2+', '[Al(OH)4]-']))
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

  it('Al3+ 与 F- 形成可溶性氟配离子、Ca2+ 与 [Al(OH)4]- 特例均不误判为硬互斥冲突', () => {
    // Al3+ + F- 属于络合共存，不沉淀互斥
    const { result: rAlF } = renderHook(() => useIonCoexistence(['Al3+', 'F-']))
    expect(rAlF.current.canCoexist).toBe(true)
    expect(rAlF.current.conflicts.length).toBe(0)

    // Ca2+ + [Al(OH)4]- 高考回避特例，不作为一票否决冲突
    const { result: rCaAlO2 } = renderHook(() => useIonCoexistence(['Ca2+', '[Al(OH)4]-']))
    expect(rCaAlO2.current.canCoexist).toBe(true)
    expect(rCaAlO2.current.conflicts.length).toBe(0)
  })

  it('强酸性介质 (含 H+) 下 MnO4- 与 S2-、ClO- 与 I- 的氧化还原方程式严禁生成 OH-', () => {
    const { result: rMno4S2 } = renderHook(() => useIonCoexistence(['H+', 'MnO4-', 'S2-']))
    expect(rMno4S2.current.canCoexist).toBe(false)
    const eq1 = rMno4S2.current.conflicts.find((c) => c.id === 'redox-MnO4--S2-')?.equation ?? ''
    expect(eq1).toContain('H^+')
    expect(eq1).not.toContain('OH^-')

    const { result: rCloI } = renderHook(() => useIonCoexistence(['H+', 'ClO-', 'I-']))
    expect(rCloI.current.canCoexist).toBe(false)
    const eq2 = rCloI.current.conflicts.find((c) => c.id === 'redox-ClO--I-')?.equation ?? ''
    expect(eq2).toContain('H^+')
    expect(eq2).not.toContain('OH^-')
  })

  it('碱性介质 (含 OH-) 下 ClO- 与 S2O32- 的氧化还原方程式需配平为消耗 OH- 且不产生 H+', () => {
    const { result } = renderHook(() => useIonCoexistence(['OH-', 'ClO-', 'S2O32-']))
    expect(result.current.canCoexist).toBe(false)
    const eq = result.current.conflicts.find((c) => c.id === 'redox-ClO--S2O32-')?.equation ?? ''
    expect(eq).toBe('4ClO^- + S_2O_3^{2-} + 2OH^- = 4Cl^- + 2SO_4^{2-} + H_2O')
    expect(eq).toContain('2OH^-')
    expect(eq).not.toContain('H^+')
  })
})
