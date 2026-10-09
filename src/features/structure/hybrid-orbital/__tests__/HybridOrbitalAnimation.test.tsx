import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HybridOrbitalAnimation from '../HybridOrbitalAnimation'
import * as chemistry3d from '@/components/Chemistry3D'

describe('HybridOrbitalAnimation 降级与渲染守门测试', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('当 WebGL 不可用时应降级渲染 WebGLFallback，且不挂载 3D 画布', () => {
    vi.spyOn(chemistry3d, 'isWebGLAvailable').mockReturnValue(false)
    const { container } = render(<HybridOrbitalAnimation />)

    // 文案来自共享组件 WebGLFallback 的默认值（全库唯一来源）
    expect(screen.getByText('WebGL 3D 环境不可用')).toBeDefined()
    expect(screen.getByText(/当前环境未启用 WebGL 硬件加速/)).toBeDefined()

    // 降级后不应再渲染 R3F 画布
    expect(container.querySelector('canvas')).toBeNull()

    // 铁律 1：fallback 容器禁止出现手写背景色类
    expect(container.querySelector('.bg-slate-50')).toBeNull()
    expect(container.querySelector('.bg-white')).toBeNull()
    expect(container.querySelector('.bg-transparent')).toBeNull()
  })
})
