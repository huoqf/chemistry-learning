import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AtomShellScene } from '../components/AtomShellScene'
import { PERIODIC_ELEMENTS } from '../data/periodicData'

describe('AtomShellScene 核外电子公转与激发态跃迁渲染测试', () => {
  it('在基态与激发态传入 orbitPhase 时能渲染完整壳层与跨层跃迁粒子且无 NaN 坐标', () => {
    const carbon = PERIODIC_ELEMENTS[6]
    const { container, rerender } = render(
      <svg>
        <AtomShellScene
          element={carbon}
          stateType="ground"
          shellLayers={[2, 4]}
          orbitPhase={0}
          font={(s) => s}
        />
      </svg>
    )

    expect(screen.getByText('C (碳)')).toBeDefined()

    rerender(
      <svg>
        <AtomShellScene
          element={carbon}
          stateType="excited"
          excitationShell={2}
          excitationTargetShell={3}
          excitationTransitionLabel="2p→3s"
          shellLayers={[2, 3, 1]}
          orbitPhase={1.25}
          font={(s) => s}
        />
      </svg>
    )

    expect(screen.getByText('受激价电子')).toBeDefined()
    expect(screen.getByText(/激发态（2p→3s）/)).toBeDefined()

    const circles = Array.from(container.querySelectorAll('circle'))
    expect(circles.length).toBeGreaterThan(6)
    circles.forEach((circle) => {
      const cx = circle.getAttribute('cx')
      const cy = circle.getAttribute('cy')
      if (cx !== null) expect(Number.isFinite(Number(cx))).toBe(true)
      if (cy !== null) expect(Number.isFinite(Number(cy))).toBe(true)
    })
  })
})
