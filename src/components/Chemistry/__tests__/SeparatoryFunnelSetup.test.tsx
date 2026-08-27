import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SeparatoryFunnelSetup } from '../SeparatoryFunnelSetup'

describe('SeparatoryFunnelSetup 预制萃取分液装配体组件测试', () => {
  const mockState = {
    bottomLevel: 0.4,
    topLevel: 0.3,
    bottomColor: '#9333ea',
    topColor: '#ffffff',
    beakerAFillLevel: 0.2,
    beakerAFillColor: '#9333ea',
    beakerBFillLevel: 0,
    beakerBFillColor: '#ffffff',
    isShaking: false,
    isInverted: false,
    isTilted: false,
    isValveOpen: false,
    hasStopper: true,
    isStopperLifted: false,
    isBlocked: false,
    isEthanolMiscible: false,
    funnelTransform: { x: 0, y: 0, rotate: 0 },
    isGassing: false,
    waterLayerLabel: '水相(无色)',
    orgLayerLabel: 'CCl₄相(紫红)',
    progressText: '1. 装入碘水与无色 CCl₄',
  }

  it('成功渲染装配体及其内部铁架台、分液漏斗、双烧杯与操作提示', () => {
    const { container } = render(
      <svg>
        <SeparatoryFunnelSetup extraction={mockState} />
      </svg>
    )

    // 检查文本说明
    expect(container.textContent).toContain('烧杯A (接下层液·45°尖嘴贴壁)')
    expect(container.textContent).toContain('烧杯B (接上层液·上口倒入)')
    expect(container.textContent).toContain('1. 装入碘水与无色 CCl₄')

    // 检查整体 SVG 路径与渲染节点
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)
  })

  it('在放液状态下正确渲染靠壁下流细流', () => {
    const drainingState = { ...mockState, isValveOpen: true }
    const { container } = render(
      <svg>
        <SeparatoryFunnelSetup extraction={drainingState} />
      </svg>
    )

    // 搜索带有虚线 (strokeDasharray) 的液体下流 Line/Path
    const dashedPaths = Array.from(container.querySelectorAll('path')).filter(
      (p) => p.getAttribute('stroke-dasharray') === '4 2'
    )
    expect(dashedPaths.length).toBeGreaterThan(0)
  })
})
