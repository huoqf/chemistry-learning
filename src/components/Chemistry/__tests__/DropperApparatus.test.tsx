import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { DropperApparatus } from '../DropperApparatus'

function renderWithSvg(ui: React.ReactElement) {
  return render(React.createElement('svg', null, ui))
}

describe('DropperApparatus 胶头滴管组件', () => {
  it('正确渲染胶头滴管结构', () => {
    const { container } = renderWithSvg(
      <DropperApparatus
        x={100}
        y={150}
        bodyHeight={80}
        liquidLevel={0.5}
        dropProgress={0.4}
      />
    )
    const dropperGroup = container.querySelector('.chem-dropper-apparatus')
    expect(dropperGroup).toBeTruthy()

    // 包含 path（胶头乳头、高光、玻璃管身、液滴）
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBeGreaterThanOrEqual(3)
  })

  it('支持挤压状态与伸入液面下的长滴管模式', () => {
    const { container } = renderWithSvg(
      <DropperApparatus
        x={100}
        y={200}
        isSqueezed={true}
        isDeep={true}
        liquidLevel={0.8}
      />
    )
    const dropperGroup = container.querySelector('.chem-dropper-apparatus')
    expect(dropperGroup).toBeTruthy()
  })
})
