import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCanvasSize } from '../useCanvasSize'

describe('useCanvasSize', () => {
  it('返回初始值作为回退', () => {
    const { result } = renderHook(() =>
      useCanvasSize({ width: 840, height: 650 })
    )
    const [, canvasSize] = result.current
    expect(canvasSize.width).toBe(840)
    expect(canvasSize.height).toBe(650)
  })

  it('px() 按初始 scale 缩放', () => {
    const { result } = renderHook(() =>
      useCanvasSize({ width: 840, height: 650 })
    )
    const [, canvasSize] = result.current
    // 初始 scale = min(840/840, 650/650) = 1
    expect(canvasSize.px(100)).toBe(100)
  })

  it('font() 带 7-16 clamp', () => {
    const { result } = renderHook(() =>
      useCanvasSize({ width: 840, height: 650 })
    )
    const [, canvasSize] = result.current
    expect(canvasSize.font(5)).toBe(7)   // clamp 下界
    expect(canvasSize.font(20)).toBe(16)  // clamp 上界
    expect(canvasSize.font(11)).toBe(11)  // 正常范围
  })

  it('presetCompensation 影响 scale', () => {
    const { result } = renderHook(() =>
      useCanvasSize({ width: 840, height: 650 }, { presetCompensation: 1.2 })
    )
    const [, canvasSize] = result.current
    expect(canvasSize.scale).toBeCloseTo(1.2, 5)
  })

  it('rawScale 不受 presetCompensation 影响', () => {
    const { result } = renderHook(() =>
      useCanvasSize({ width: 840, height: 650 }, { presetCompensation: 1.2 })
    )
    const [, canvasSize] = result.current
    expect(canvasSize.rawScale).toBe(1.0)
  })
})
