import { render } from '@testing-library/react'
import { describe, it, expect, beforeAll } from 'vitest'
import PrimaryCellAnimation from '../PrimaryCellAnimation'

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver
})

describe('PrimaryCellAnimation 渲染测试', () => {
  it('应当能正常渲染无需抛出异常', () => {
    const { container } = render(<PrimaryCellAnimation />)
    expect(container).toBeDefined()
  })
})
