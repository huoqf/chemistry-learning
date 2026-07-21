import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import {
  IronSupportApparatus,
  TripodMeshApparatus,
  ClayTriangleApparatus,
  WaterBathApparatus,
  GlassTubingConnectionApparatus,
  KippApparatus,
  EvaporatingDishApparatus,
  DryingTubeApparatus,
  CondenserApparatus,
  BuchnerFunnelApparatus,
  ElectrochemCellApparatus,
  SaltBridgeApparatus,
  IonMembraneApparatus,
  PhMeterApparatus,
  ThermometerApparatus,
  BalanceApparatus,
  FlowMeterApparatus,
  IndustrialElectrolyzerEquipment,
  CrystallizerEquipment,
  IonExchangeColumnEquipment,
  BubbleEmitter,
  IonMigration,
} from '../index'

function renderWithSvg(ui: React.ReactElement) {
  return render(React.createElement('svg', null, ui))
}

describe('全量高中化学通用组件单元测试 (ExtendedComponents)', () => {
  it('批次 1 组件顺利渲染', () => {
    const { container: c1 } = renderWithSvg(<IronSupportApparatus x={0} y={0} hasClamp={true} hasRing={true} />)
    expect(c1.querySelector('g')).toBeTruthy()

    const { container: c2 } = renderWithSvg(<TripodMeshApparatus x={0} y={0} hasMesh={true} />)
    expect(c2.querySelector('rect')).toBeTruthy()

    const { container: c3 } = renderWithSvg(<ClayTriangleApparatus x={0} y={0} />)
    expect(c3.querySelectorAll('line').length).toBeGreaterThan(0)

    const { container: c4 } = renderWithSvg(<WaterBathApparatus x={0} y={0} tempLabel="60℃" />)
    expect(c4.querySelector('text')?.textContent).toBe('60℃')

    const { container: c5 } = renderWithSvg(<GlassTubingConnectionApparatus x={0} y={0} tubeType="L-shape" label="SO₂" />)
    expect(c5.querySelector('path')).toBeTruthy()

    const { container: c6 } = renderWithSvg(<KippApparatus x={0} y={0} isOpen={true} gasLabel="H₂" />)
    expect(c6.querySelectorAll('circle').length).toBeGreaterThan(0)

    const { container: c7 } = renderWithSvg(<EvaporatingDishApparatus x={0} y={0} hasCrystals={true} />)
    expect(c7.querySelector('path')).toBeTruthy()
  })

  it('批次 2 组件顺利渲染', () => {
    const { container: c8 } = renderWithSvg(<DryingTubeApparatus x={0} y={0} variant="spherical" desiccantName="碱石灰" />)
    expect(c8.querySelector('text')?.textContent).toBe('碱石灰')

    const { container: c9 } = renderWithSvg(<CondenserApparatus x={0} y={0} condenserType="straight" hasWater={true} />)
    expect(c9.querySelector('rect')).toBeTruthy()

    const { container: c10 } = renderWithSvg(<BuchnerFunnelApparatus x={0} y={0} fillLevel={0.4} hasFilterCake={true} />)
    expect(c10.querySelector('polygon')).toBeTruthy()
  })

  it('批次 3 组件顺利渲染', () => {
    const { container: c11 } = renderWithSvg(<ElectrochemCellApparatus x={0} y={0} cellType="galvanic" leftElectrode="Zn" rightElectrode="Cu" />)
    expect(c11.querySelector('circle')).toBeTruthy()

    const { container: c12 } = renderWithSvg(<SaltBridgeApparatus x={0} y={0} label="KCl 盐桥" />)
    expect(c12.querySelector('path')).toBeTruthy()

    const { container: c13 } = renderWithSvg(<IonMembraneApparatus x={0} y={0} membraneType="cation" ionLabel="Na⁺" />)
    expect(c13.querySelector('line')).toBeTruthy()

    const { container: c14 } = renderWithSvg(<PhMeterApparatus x={0} y={0} variant="meter" phValue={7.4} />)
    expect(c14.querySelector('text')?.textContent).toContain('7.40')

    const { container: c15 } = renderWithSvg(<ThermometerApparatus x={0} y={0} tempValue={60} />)
    expect(c15.querySelector('circle')).toBeTruthy()

    const { container: c16 } = renderWithSvg(<BalanceApparatus x={0} y={0} variant="digital" weight={5.85} />)
    expect(c16.querySelector('text')?.textContent).toBe('5.85 g')

    const { container: c17 } = renderWithSvg(<FlowMeterApparatus x={0} y={0} meterType="pressure" value={20} unit="MPa" />)
    expect(c17.querySelector('circle')).toBeTruthy()
  })

  it('批次 4 组件顺利渲染', () => {
    const { container: c18 } = renderWithSvg(<IndustrialElectrolyzerEquipment x={0} y={0} status="running" />)
    expect(c18.querySelector('line')).toBeTruthy()

    const { container: c19 } = renderWithSvg(<CrystallizerEquipment x={0} y={0} title="结晶釜" />)
    expect(c19.querySelector('text')?.textContent).toBe('结晶釜')

    const { container: c20 } = renderWithSvg(<IonExchangeColumnEquipment x={0} y={0} title="离子交换柱" />)
    expect(c20.querySelector('rect')).toBeTruthy()

    const { container: c21 } = renderWithSvg(<BubbleEmitter x={0} y={0} count={6} />)
    expect(c21.querySelectorAll('circle').length).toBe(6)

    const { container: c22 } = renderWithSvg(<IonMigration x={0} y={0} ionSymbol="Na⁺" ionType="cation" />)
    expect(c22.querySelector('circle')).toBeTruthy()
  })
})
