import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ChemicalEquationView } from '../ChemicalEquationView'

describe('ChemicalEquationView', () => {
  it('应当正确渲染简单离子反应方程式并保留运算符分块', () => {
    const { container } = render(
      <ChemicalEquationView equation="2Fe²⁺ + Cl₂ = 2Fe³⁺ + 2Cl⁻" />
    )
    expect(container.textContent).toContain('2Fe')
    expect(container.innerHTML).toContain('<sup>2+</sup>')
    expect(container.innerHTML).toContain('<sub>2</sub>')
    expect(container.textContent).toContain('+')
    expect(container.textContent).toContain('=')
  })

  it('微粒项应使用 whitespace-nowrap 保持不可切断', () => {
    const { container } = render(
      <ChemicalEquationView equation="Fe + 2Fe³⁺ = 3Fe²⁺" />
    )
    const nowrapSpans = container.querySelectorAll('.whitespace-nowrap')
    expect(nowrapSpans.length).toBeGreaterThanOrEqual(3)
  })

  it('空字符串时不产生崩溃并安全返回空', () => {
    const { container } = render(<ChemicalEquationView equation="" />)
    expect(container.firstChild).toBeNull()
  })
})
