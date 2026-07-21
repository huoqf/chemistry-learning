import { describe, it, expect } from 'vitest'
import { renderHook, render } from '@testing-library/react'
import { useElectrolyticCellChemistry } from '../hooks/useElectrolyticCellChemistry'
import { buildElectrolyticCellQuantities } from '@/data/quantities/reaction-principle/electrolyticCell'
import ElectrolyticCellAnimation from '../ElectrolyticCellAnimation'

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver

describe('ElectrolyticCell Chemistry & Quantities', () => {
  it('正确渲染 ElectrolyticCellAnimation 组件且不发生运行时崩溃', () => {
    const { container } = render(<ElectrolyticCellAnimation />)
    expect(container).toBeDefined()
  })

  it('正确计算 CuCl2 电解模式下的电子转移与生成物', () => {
    const { result } = renderHook(() =>
      useElectrolyticCellChemistry({
        cellType: 0,
        anodeMaterial: 0,
        current: 1.5,
        time: 5,
      })
    )

    expect(result.current.ne).toBeGreaterThan(0)
    expect(result.current.anodeProduct).toContain('Cl₂')
    expect(result.current.cathodeProduct).toContain('Cu')
    expect(result.current.cathodeDeltaM).toBeGreaterThan(0)
    expect(result.current.vAnodeGas).toBeGreaterThan(0)
  })

  it('正确计算 CuSO4 放氧生酸模式下溶液 pH 变化', () => {
    const { result } = renderHook(() =>
      useElectrolyticCellChemistry({
        cellType: 1,
        anodeMaterial: 0,
        current: 2.0,
        time: 8,
      })
    )

    expect(result.current.pH).toBeLessThan(7.0)
    expect(result.current.vAnodeGas).toBeGreaterThan(0)
  })

  it('正确构建电解池右屏面板化学量', () => {
    const quantities = buildElectrolyticCellQuantities(
      { cellType: 2, current: 1.5 },
      5
    )

    expect(quantities).toHaveLength(6)
    const pHItem = quantities.find((q) => q.key === 'cellpH')
    expect(pHItem).toBeDefined()
    expect(pHItem?.value).toBeGreaterThan(7.0)
  })
})
