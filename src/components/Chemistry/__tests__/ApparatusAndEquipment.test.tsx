import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import {
  BeakerApparatus,
  ErlenmeyerFlaskApparatus,
  BuretteApparatus,
  VolumetricFlaskApparatus,
  TestTubeApparatus,
  GasJarApparatus,
  AlcoholLampApparatus,
  SeparatoryFunnelApparatus,
  CrusherEquipment,
  RoastingFurnaceEquipment,
  RotaryKilnEquipment,
  LeachingReactorEquipment,
  AbsorptionTowerEquipment,
} from '../index'

function renderWithSvg(ui: React.ReactElement) {
  return render(React.createElement('svg', null, ui))
}

describe('高中化学实验主要器材组件 (Apparatus)', () => {
  it('BeakerApparatus 正确渲染并响应 font 与 label', () => {
    const fontSpy = vi.fn((n: number) => n * 1.5)
    const { container } = renderWithSvg(
      <BeakerApparatus
        x={100}
        y={100}
        width={80}
        height={100}
        fillLevel={0.5}
        label="250mL"
        font={fontSpy}
      />
    )
    const g = container.querySelector('g')
    expect(g).toBeTruthy()

    const text = container.querySelector('text')
    expect(text).toBeTruthy()
    expect(text?.textContent).toBe('250mL')
    expect(fontSpy).toHaveBeenCalled()
  })

  it('BeakerApparatus 微缩模式 (width < 40) 时隐去 label 与刻度线', () => {
    const { container } = renderWithSvg(
      <BeakerApparatus x={100} y={100} width={30} height={40} label="250mL" />
    )
    const text = container.querySelector('text')
    expect(text).toBeNull()
  })

  it('ErlenmeyerFlaskApparatus 正常渲染橡皮塞与液体', () => {
    const { container } = renderWithSvg(
      <ErlenmeyerFlaskApparatus x={50} y={50} fillLevel={0.4} hasStopper={true} />
    )
    expect(container.querySelector('polygon')).toBeTruthy()
  })

  it('BuretteApparatus 支持酸式和碱式变体', () => {
    const { container: acidC } = renderWithSvg(<BuretteApparatus x={0} y={0} variant="acid" isOpen={true} />)
    expect(acidC.querySelector('g')).toBeTruthy()

    const { container: baseC } = renderWithSvg(<BuretteApparatus x={0} y={0} variant="base" />)
    expect(baseC.querySelector('circle')).toBeTruthy() // 碱式玻璃珠 circle
  })

  it('VolumetricFlaskApparatus 渲染容量瓶红色标线', () => {
    const { container } = renderWithSvg(<VolumetricFlaskApparatus x={0} y={0} fillLevel={1.0} />)
    const redLine = container.querySelector('line')
    expect(redLine).toBeTruthy()
  })

  it('TestTubeApparatus 支持倾斜角度渲染', () => {
    const { container } = renderWithSvg(<TestTubeApparatus x={0} y={0} tiltAngle={45} />)
    const rootG = container.querySelector('g')
    expect(rootG?.getAttribute('transform')).toContain('rotate(45')
  })

  it('GasJarApparatus 支持洗气瓶长短导管渲染', () => {
    const { container } = renderWithSvg(<GasJarApparatus x={0} y={0} hasTubes={true} />)
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)
  })

  it('AlcoholLampApparatus 包含外焰与内焰渲染', () => {
    const { container } = renderWithSvg(<AlcoholLampApparatus x={0} y={0} lit={true} />)
    const flamePaths = container.querySelectorAll('path')
    expect(flamePaths.length).toBeGreaterThan(0)
  })

  it('SeparatoryFunnelApparatus 正常渲染双层分液与活塞', () => {
    const { container } = renderWithSvg(
      <SeparatoryFunnelApparatus x={0} y={0} bottomFillLevel={0.3} topFillLevel={0.2} />
    )
    const clipPath = container.querySelector('clipPath')
    expect(clipPath).toBeTruthy()
  })
})

describe('高考化工流程核心设备组件 (Equipment)', () => {
  it('CrusherEquipment 粉碎机正确渲染', () => {
    const { container } = renderWithSvg(<CrusherEquipment x={0} y={0} status="running" title="球磨机" />)
    expect(container.querySelector('polygon')).toBeTruthy()
  })

  it('RoastingFurnaceEquipment 焙烧炉渲染加热状态', () => {
    const { container } = renderWithSvg(<RoastingFurnaceEquipment x={0} y={0} status="heating" />)
    expect(container.querySelector('rect')).toBeTruthy()
  })

  it('RotaryKilnEquipment 回转窑支持倾斜与支撑轮', () => {
    const { container } = renderWithSvg(<RotaryKilnEquipment x={0} y={0} status="running" />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBe(2) // 两个支撑滚轮
  })

  it('LeachingReactorEquipment 浸出槽正确渲染', () => {
    const { container } = renderWithSvg(<LeachingReactorEquipment x={0} y={0} fillLevel={0.5} />)
    expect(container.querySelector('line')).toBeTruthy()
  })

  it('AbsorptionTowerEquipment 吸收塔正确渲染', () => {
    const { container } = renderWithSvg(<AbsorptionTowerEquipment x={0} y={0} status="running" />)
    expect(container.querySelector('g')).toBeTruthy()
  })
})
