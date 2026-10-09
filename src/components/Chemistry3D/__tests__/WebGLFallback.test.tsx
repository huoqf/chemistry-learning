import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WebGLFallback } from '../index'

/** 收集容器内所有元素上的全部 class token */
function collectClassTokens(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('*')).flatMap((el) =>
    Array.from(el.classList),
  )
}

/** 组件 props 中是否存在 className —— 按契约应恒为 false（边框规格不得外泄到调用点） */
type Props = Parameters<typeof WebGLFallback>[0]
type HasClassNameProp = 'className' extends keyof Props ? true : false

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

  it('framed 是边框的唯一入口：默认无边框，置 true 才带边框', () => {
    const plain = render(<WebGLFallback />)
    expect(plain.container.firstElementChild?.classList.contains('border')).toBe(false)
    expect(plain.container.firstElementChild?.classList.contains('rounded-xl')).toBe(false)
    plain.unmount()

    const framed = render(<WebGLFallback framed />)
    expect(framed.container.firstElementChild?.classList.contains('border')).toBe(true)
    expect(framed.container.firstElementChild?.classList.contains('rounded-xl')).toBe(true)
    framed.unmount()
  })

  it('组件不得重新开放 className 逃生口（否则边框规格会重新散落到调用点）', () => {
    // 这里的类型标注本身就是断言：一旦有人给 props 加回 className，
    // HasClassNameProp 会变成 true，下面这行 `false` 赋值将在 tsc 阶段直接编译失败。
    const hasClassNameProp: HasClassNameProp = false
    expect(hasClassNameProp).toBe(false)
  })

  it('铁律 1：lg / sm × framed 各档位容器均不得出现任何手写背景类', () => {
    for (const size of ['lg', 'sm'] as const) {
      for (const framed of [false, true]) {
        const { container, unmount } = render(<WebGLFallback size={size} framed={framed} />)
        expect(collectClassTokens(container).filter((c) => c.startsWith('bg-'))).toEqual([])
        unmount()
      }
    }
  })
})
