import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EnergyProfileChart } from '../components/EnergyProfileChart'
import type { EnergyProfilePoint, StepBarrierInfo } from '../types'

describe('EnergyProfileChart 反应势能面与微粒越垒动画测试', () => {
  const multiStepPoints: EnergyProfilePoint[] = [
    { x: 10, y: 100, label: '反应物' },
    { x: 30, y: 135, label: 'TS1', isTS: true, stepIndex: 1, stepEa: 35 },
    { x: 48, y: 112, label: '中间体' },
    { x: 68, y: 168, label: 'TS2', isTS: true, stepIndex: 2, stepEa: 56, isRDS: true },
    { x: 90, y: 60, label: '生成物' },
  ]

  const stepBarriers: StepBarrierInfo[] = [
    { stepIndex: 1, fromLabel: '反应物', toLabel: 'TS1', fromY: 100, toY: 135, ea: 35, isRDS: false },
    { stepIndex: 2, fromLabel: '中间体', toLabel: 'TS2', fromY: 112, toY: 168, ea: 56, isRDS: true },
  ]

  it('在催化剂多步模式传入 animPhase 时正常渲染双微粒越垒节点且坐标均有效', () => {
    const { container } = render(
      <EnergyProfileChart
        tsPoints={multiStepPoints}
        eaForward={68}
        eaReverse={108}
        deltaH={-40}
        catalyst="catalyst-b"
        stepBarriers={stepBarriers}
        rdsIndex={2}
        animPhase={0.65}
      />
    )

    expect(screen.getByText(/决速步为第 2 步/)).toBeDefined()
    const circles = Array.from(container.querySelectorAll('circle'))
    expect(circles.length).toBeGreaterThanOrEqual(7)
    circles.forEach((circle) => {
      const cx = Number(circle.getAttribute('cx'))
      const cy = Number(circle.getAttribute('cy'))
      expect(Number.isFinite(cx)).toBe(true)
      expect(Number.isFinite(cy)).toBe(true)
    })
  })
})
