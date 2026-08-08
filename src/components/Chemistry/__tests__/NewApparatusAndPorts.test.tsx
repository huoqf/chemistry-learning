import { describe, it, expect } from 'vitest'
import {
  getGasWashingBottlePorts,
  getAntiSiphonFunnelPorts,
  getCruciblePorts,
  getGasBurettePorts,
  getRefluxCondenserPorts,
  getDistillationFlaskPorts,
  getIronSupportPorts,
} from '../index'

describe('化学器材锚点 (Anchor Ports System) 测试', () => {
  it('getGasWashingBottlePorts 能够计算出洗气瓶进出气口锚点', () => {
    const ports = getGasWashingBottlePorts(100, 200, 90, 140)
    expect(ports.inletPort.x).toBe(127)
    expect(ports.outletPort.x).toBe(163)
    expect(ports.bottomPort.y).toBe(340)
  })

  it('getAntiSiphonFunnelPorts 能够计算防倒吸漏斗顶部连接点', () => {
    const ports = getAntiSiphonFunnelPorts(100, 100, 80, 100)
    expect(ports.topConnectPort).toEqual({ x: 140, y: 100, direction: 'up' })
    expect(ports.bottomPort).toEqual({ x: 140, y: 200, direction: 'down' })
  })

  it('getCruciblePorts 能够计算瓷坩埚开口与底部中心', () => {
    const ports = getCruciblePorts(50, 50, 60, 50)
    expect(ports.topPort).toEqual({ x: 80, y: 50 })
    expect(ports.bottomPort).toEqual({ x: 80, y: 100 })
  })

  it('getGasBurettePorts 能够计算量气管与水准瓶入口', () => {
    const ports = getGasBurettePorts(0, 0, 110, 220)
    expect(ports.gasInletPort).toEqual({ x: 20, y: -10 })
    expect(ports.levelBottleTopPort).toEqual({ x: 90, y: 20 })
  })

  it('getRefluxCondenserPorts 能够计算球形回流冷凝管连接点', () => {
    const ports = getRefluxCondenserPorts(100, 100, 50, 180)
    expect(ports.bottomNeckPort).toEqual({ x: 125, y: 280 })
    expect(ports.waterInletPort).toEqual({ x: 150, y: 250 })
  })

  it('getDistillationFlaskPorts 能够精准计算具支蒸馏烧瓶支管口', () => {
    const ports = getDistillationFlaskPorts(100, 100, 90, 140)
    expect(ports.sideArmPort.x).toBeGreaterThan(100)
    expect(ports.sideArmPort.y).toBeGreaterThan(100)
  })

  it('getIronSupportPorts 能够实时计算铁架台铁夹爪尖端坐标', () => {
    const ports = getIronSupportPorts(50, 50, 100, 240, 0.4)
    expect(ports.clampTipPos.y).toBeGreaterThan(50)
  })
})
