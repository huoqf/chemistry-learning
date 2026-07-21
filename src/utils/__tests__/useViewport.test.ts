import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useViewport } from '../useViewport'
import type { CanvasSize } from '../useCanvasSize'

function makeCanvasSize(overrides?: Partial<CanvasSize>): CanvasSize {
  return {
    width: 840,
    height: 650,
    scale: 1,
    rawScale: 1,
    px: (v: number) => v,
    font: (v: number) => v,
    ...overrides,
  }
}

describe('useViewport', () => {
  it('无 overlay 时可视区域 = 容器区域', () => {
    const canvas = makeCanvasSize({ width: 800, height: 600 })
    const { result } = renderHook(() =>
      useViewport(canvas, { designWidth: 840, designHeight: 650 })
    )
    const vp = result.current
    expect(vp.visibleX).toBe(0)
    expect(vp.visibleY).toBe(0)
    expect(vp.visibleW).toBe(800)
    expect(vp.visibleH).toBe(600)
  })

  it('contain 缩放：宽容器 letterbox', () => {
    // 容器 900x600, 设计 840x650 → scale = min(900/840, 600/650) ≈ 0.923
    const canvas = makeCanvasSize({ width: 900, height: 600, scale: 0.923, rawScale: 0.923 })
    const { result } = renderHook(() =>
      useViewport(canvas, { designWidth: 840, designHeight: 650 })
    )
    const vp = result.current
    expect(vp.scale).toBeCloseTo(0.923, 2)
    // tx > 0 因为 letterbox
    expect(vp.tx).toBeGreaterThan(0)
  })

  it('contain 缩放：高容器 pillarbox', () => {
    // 容器 800x700, 设计 840x650 → scale = min(800/840, 700/650) ≈ 0.952
    const canvas = makeCanvasSize({ width: 800, height: 700, scale: 0.952, rawScale: 0.952 })
    const { result } = renderHook(() =>
      useViewport(canvas, { designWidth: 840, designHeight: 650 })
    )
    const vp = result.current
    expect(vp.scale).toBeCloseTo(0.952, 2)
    // ty > 0 因为 pillarbox
    expect(vp.ty).toBeGreaterThan(0)
  })

  it('overlay 扣除后可视区域缩小', () => {
    const canvas = makeCanvasSize({ width: 1000, height: 650 })
    const { result } = renderHook(() =>
      useViewport(canvas, {
        designWidth: 840,
        designHeight: 650,
        overlayRight: 200,
      })
    )
    const vp = result.current
    expect(vp.visibleW).toBe(800) // 1000 - 200
    expect(vp.visibleH).toBe(650)
  })

  it('designVisibleW/H = visibleW/H / scale', () => {
    const canvas = makeCanvasSize({ width: 800, height: 600, scale: 0.923, rawScale: 0.923 })
    const { result } = renderHook(() =>
      useViewport(canvas, { designWidth: 840, designHeight: 650 })
    )
    const vp = result.current
    expect(vp.designVisibleW).toBeCloseTo(vp.visibleW / vp.scale, 5)
    expect(vp.designVisibleH).toBeCloseTo(vp.visibleH / vp.scale, 5)
  })

  it('transform 字符串格式正确', () => {
    const canvas = makeCanvasSize({ width: 840, height: 650 })
    const { result } = renderHook(() =>
      useViewport(canvas, { designWidth: 840, designHeight: 650 })
    )
    const vp = result.current
    expect(vp.transform).toMatch(/^translate\([\d.]+ [\d.]+\) scale\([\d.]+\)$/)
  })

  it('presetCompensation 影响 scale 和 transform', () => {
    const canvas = makeCanvasSize({ width: 840, height: 650, scale: 1.2, rawScale: 1.0 })
    const { result } = renderHook(() =>
      useViewport(canvas, {
        designWidth: 840,
        designHeight: 650,
        presetCompensation: 1.2,
      })
    )
    const vp = result.current
    expect(vp.scale).toBeCloseTo(1.2, 5)
  })
})
