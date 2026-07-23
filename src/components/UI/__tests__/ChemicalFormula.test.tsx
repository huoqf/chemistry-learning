import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChemicalFormula } from '../ChemicalFormula'

describe('ChemicalFormula', () => {
  it('渲染纯文本（无下标/上标）', () => {
    render(<ChemicalFormula formula="NaCl" />)
    expect(screen.getByText('NaCl')).toBeTruthy()
  })

  it('渲染单个下标', () => {
    const { container } = render(<ChemicalFormula formula="H₂O" />)
    expect(container.textContent).toBe('H2O')
    const sub = container.querySelector('sub')
    expect(sub).toBeTruthy()
    expect(sub!.textContent).toBe('2')
  })

  it('渲染多个独立下标', () => {
    const { container } = render(<ChemicalFormula formula="Fe₂O₃" />)
    expect(container.textContent).toBe('Fe2O3')
    const subs = container.querySelectorAll('sub')
    expect(subs.length).toBe(2)
    expect(subs[0].textContent).toBe('2')
    expect(subs[1].textContent).toBe('3')
  })

  it('渲染上标（离子电荷）', () => {
    const { container } = render(<ChemicalFormula formula="Cu²⁺" />)
    expect(container.textContent).toBe('Cu2+')
    const sup = container.querySelector('sup')
    expect(sup).toBeTruthy()
    expect(sup!.textContent).toBe('2+')
  })

  it('渲染下标+上标组合 — Cr₂O₇²⁻', () => {
    const { container } = render(<ChemicalFormula formula="Cr₂O₇²⁻" />)
    expect(container.textContent).toBe('Cr2O72-')
    const subs = container.querySelectorAll('sub')
    const sups = container.querySelectorAll('sup')
    expect(subs.length).toBe(2)
    expect(subs[0].textContent).toBe('2')
    expect(subs[1].textContent).toBe('7')
    expect(sups.length).toBe(1)
    expect(sups[0].textContent).toBe('2-')
  })

  it('渲染复合括号式子 — Na[Al(OH)₄]', () => {
    const { container } = render(<ChemicalFormula formula="Na[Al(OH)₄]" />)
    expect(container.textContent).toBe('Na[Al(OH)4]')
    const sub = container.querySelector('sub')
    expect(sub).toBeTruthy()
    expect(sub!.textContent).toBe('4')
  })

  it('渲染多下标+复合括号 — K₂Cr₂O₇', () => {
    const { container } = render(<ChemicalFormula formula="K₂Cr₂O₇" />)
    expect(container.textContent).toBe('K2Cr2O7')
    const subs = container.querySelectorAll('sub')
    expect(subs.length).toBe(3)
    expect(subs[0].textContent).toBe('2')
    expect(subs[1].textContent).toBe('2')
    expect(subs[2].textContent).toBe('7')
  })

  it('渲染带条件文本的方程式 — Cu + 2H₂SO₄(浓)', () => {
    const { container } = render(<ChemicalFormula formula="Cu + 2H₂SO₄(浓)" />)
    expect(container.textContent).toBe('Cu + 2H2SO4(浓)')
    const sub = container.querySelector('sub')
    expect(sub!.textContent).toBe('2')
  })

  it('空字符串返回 null', () => {
    const { container } = render(<ChemicalFormula formula="" />)
    expect(container.innerHTML).toBe('')
  })

  it('应用 className', () => {
    const { container } = render(<ChemicalFormula formula="Fe" className="text-sm font-bold" />)
    const span = container.querySelector('span')
    expect(span!.className).toContain('text-sm')
    expect(span!.className).toContain('font-bold')
  })

  it('渲染可逆符号 ⇌', () => {
    const { container } = render(<ChemicalFormula formula="2SO₂ + O₂ ⇌ 2SO₃" />)
    expect(container.textContent).toBe('2SO2 + O2 ⇌ 2SO3')
  })

  it('渲染气体↑和沉淀↓符号', () => {
    const { container } = render(<ChemicalFormula formula="H₂S + Cu²⁺ = CuS↓ + 2H⁺" />)
    expect(container.textContent).toBe('H2S + Cu2+ = CuS↓ + 2H+')
  })
})
