import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WebGLFallback } from '../index'

/** 收集容器内所有元素上的全部 class token */
function collectClassTokens(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('*')).flatMap((el) =>
    Array.from(el.classList),
  )
}

describe('WebGLFallback 共享降级组件守门测试', () => {
  it('默认渲染统一标题与可执行的排查指引', () => {
    const { container } = render(<WebGLFallback />)

    expect(container.querySelector('h2')?.textContent).toBe('WebGL 3D 环境不可用')
    expect(screen.getByText(/当前环境未启用 WebGL 硬件加速/)).toBeDefined()
    expect(screen.getByText(/换用现代 Chrome \/ Edge 浏览器/)).toBeDefined()
  })

  it('允许页面覆盖标题与描述（用于携带页面特有的降级说明）', () => {
    render(
      <WebGLFallback
        title="自定义标题"
        description="左侧 2D 碳骨架图仍可正常用于探究与学习。"
        size="sm"
      />,
    )

    expect(screen.getByText('自定义标题')).toBeDefined()
    expect(screen.getByText('左侧 2D 碳骨架图仍可正常用于探究与学习。')).toBeDefined()
    expect(screen.queryByText('WebGL 3D 环境不可用')).toBeNull()
  })

  it('支持透传自定义 className', () => {
    const { container } = render(<WebGLFallback className="custom-fallback-class" />)
    expect(container.firstElementChild?.classList.contains('custom-fallback-class')).toBe(true)
  })

  it('铁律 1：lg / sm 两档容器均不得出现任何手写背景类', () => {
    for (const size of ['lg', 'sm'] as const) {
      const { container, unmount } = render(<WebGLFallback size={size} />)
      expect(collectClassTokens(container).filter((c) => c.startsWith('bg-'))).toEqual([])
      unmount()
    }
  })
})

