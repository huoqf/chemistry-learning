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
    isGassing: false,
    waterLayerLabel: '水相(无色)',
    orgLayerLabel: 'CCl₄相(紫红)',
    progressText: '1. 装入碘水与无色 CCl₄',
  }

  it('成功渲染装配体及其内部铁架台、分液漏斗、双烧杯与铁律提示', () => {
    const { container } = render(
      <svg>
        <SeparatoryFunnelSetup extraction={mockState} />
      </svg>
    )

    // 检查铁律文本说明
    expect(container.textContent).toContain('烧杯A (接下层液·45°斜切尖嘴紧贴内壁)')
    expect(container.textContent).toContain('烧杯B (接上层液·上口倒出)')
    expect(container.textContent).toContain('高考铁律：下层液体由下口靠壁流出 (45°斜切尖嘴紧贴烧杯 A 内壁)')

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
