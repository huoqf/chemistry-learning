import { render } from '@testing-library/react'
import { describe, it, expect, beforeAll } from 'vitest'
import RedoxElectronTransferAnimation from '../RedoxElectronTransferAnimation'

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver
})

describe('RedoxElectronTransferAnimation 渲染测试', () => {
  it('应当能正常渲染无需抛出异常', () => {
    const { container } = render(<RedoxElectronTransferAnimation />)
    expect(container).toBeDefined()
  })
})
