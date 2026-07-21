import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { VectorArrow } from '../VectorArrow'
import { ChemistryVectorArrow } from '../ChemistryVectorArrow'
import type { SceneScale } from '../../../scene/SceneScale'

function renderWithSvg(ui: React.ReactElement) {
  return render(React.createElement('svg', null, ui))
}

const sceneScale: SceneScale = {
  originX: 100,
  originY: 200,
  scaleX: 10,
  scaleY: 20,
  scale: 10,
  maxVectorLength: 60,
  refMagnitudes: { reactionRate: 2 },
  intentionalNonUniformScale: true,
}

describe('VectorArrow', () => {
  it('仅接受 originDesign，直接使用设计坐标', () => {
    const { container } = renderWithSvg(
      <VectorArrow
        originDesign={{ x: 120, y: -140 }}
        vector={{ x: 1, y: 0 }}
        type="reactionRate"
        sceneScale={sceneScale}
      />
    )

    const line = container.querySelector('line')
    expect(line).toBeTruthy()

    expect(line?.getAttribute('x1')).toBe('120')
    expect(line?.getAttribute('y1')).toBe('-140')
  })
})

describe('ChemistryVectorArrow', () => {
  it('origin 物理坐标通过 sceneScale 自动转换为设计坐标', () => {
    const { container } = renderWithSvg(
      <ChemistryVectorArrow
        origin={{ x: 2, y: 3 }}
        vector={{ x: 1, y: 0 }}
        type="reactionRate"
        sceneScale={sceneScale}
      />
    )

    const line = container.querySelector('line')
    expect(line).toBeTruthy()

    // x1 = originX + origin.x * scaleX = 100 + 2 * 10 = 120
    // y1 = originY - origin.y * scaleY = 200 - 3 * 20 = 140
    expect(line?.getAttribute('x1')).toBe('120')
    expect(line?.getAttribute('y1')).toBe('140')
  })
})
