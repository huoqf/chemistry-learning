import { describe, it, expect, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import {

  TitrationCurveChart,
  EnergyProfileChart,
  EquilibriumChart,
  PrecipitationEquilibriumChart,
} from '../index'

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any
})

describe('高考化学高阶图表组件单元测试 (ChemistryCharts)', () => {
  it('TitrationCurveChart 顺利渲染滴定曲线与终点', () => {
    const pts = [
      { x: 0, y: 1 },
      { x: 10, y: 2.5 },
      { x: 20, y: 7 },
      { x: 30, y: 12 },
    ]
    const { container } = render(
      <TitrationCurveChart
        points={pts}
        equivalencePointV={20}
        indicator="phenolphthalein"
      />
    )
    expect(container.querySelector('div')).toBeTruthy()
  })

  it('EnergyProfileChart 顺利渲染活化能与△H', () => {
    const { container } = render(
      <EnergyProfileChart
        reactantEnergy={100}
        productEnergy={40}
        activationEnergy={180}
        catalyzedEnergy={130}
      />
    )
    expect(container.querySelector('div')).toBeTruthy()
    expect(container.textContent).toContain('Ea')
    expect(container.textContent).toContain('ΔH')
  })

  it('EquilibriumChart 顺利渲染正逆速率曲线', () => {
    const fPts = [{ x: 0, y: 10 }, { x: 5, y: 4 }, { x: 10, y: 2 }]
    const rPts = [{ x: 0, y: 0 }, { x: 5, y: 1 }, { x: 10, y: 2 }]
    const { container } = render(
      <EquilibriumChart
        forwardPoints={fPts}
        reversePoints={rPts}
        equilibriumTime={10}
      />
    )
    expect(container.querySelector('div')).toBeTruthy()
    expect(container.textContent).toContain('v(正)')
    expect(container.textContent).toContain('v(逆)')
  })

  it('PrecipitationEquilibriumChart 顺利渲染 Ksp 平衡曲线', () => {
    const { container } = render(
      <PrecipitationEquilibriumChart
        ksp={1e-4}
        testPoints={[{ x: 0.01, y: 0.01, label: '饱和点A' }]}
      />
    )
    expect(container.querySelector('div')).toBeTruthy()
  })
})
