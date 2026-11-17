// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { solvePhysicalChainLayout } from '../physics/layoutEngine'
import { GAS_PRESET_CONFIGS } from '../data/gasChainMatrixData'
import { GasWashingBottleApparatus } from '@/components/Chemistry/GasWashingBottleApparatus'
import { KippApparatus } from '@/components/Chemistry/KippApparatus'
import { LiquidHeatingGeneratorApparatus } from '@/components/Chemistry/LiquidHeatingGeneratorApparatus'
import { SolidHeatingGeneratorApparatus } from '@/components/Chemistry/SolidHeatingGeneratorApparatus'
import {
  getGasWashingBottlePorts,
  getKippApparatusPorts,
  getLiquidHeatingGeneratorPorts,
  getSolidHeatingGeneratorPorts,
} from '@/components/Chemistry/apparatusPorts'

describe('高中化学装置链几何与物理装配自动化守则 (GasChainGeometry)', () => {
  describe('铁律一：全链导管水平主梁唯一性与平直共线', () => {
    it('Cl2 强氧化体系：全链所有跨器皿水平导管标高严格相等且平直', () => {
      const preset = GAS_PRESET_CONFIGS['Cl₂']
      const result = solvePhysicalChainLayout({
        generator: preset.generator!,
        washingSteps: preset.washingSteps!,
        collection: preset.collection!,
        tailGas: preset.tailGas!,
        baseY: 480,
      })

      // 提取所有桥管的真正水平横梁标高 (两点间 Y 恒定的绝对水平段)
      const horizontalBeams: { id: string; beamY: number }[] = []

      result.routes.forEach((route) => {
        // SVG 路径形如: ... L x2 topY ...
        // 在 createAbsoluteSmoothTubingPath 中，水平横梁是 L (end.x - radius) topY
        // 匹配倒数第二个 L 命令的 Y 坐标
        const matches = [...route.pathD.matchAll(/L\s+([0-9.]+)\s+([0-9.]+)/g)]
        if (matches.length >= 2) {
          // 水平横梁是下插之前的那个 L 的 Y
          const beamY = parseFloat(matches[matches.length - 2][2])
          horizontalBeams.push({ id: route.id, beamY })
        }
      })

      expect(horizontalBeams.length).toBe(4) // 4 段跨器材横跨桥管

      const expectedMainY = horizontalBeams[0].beamY
      horizontalBeams.forEach((beam) => {
        // 断言：全链所有跨器皿水平主梁 Y 标高严格绝对相等 (误差 < 0.1px)
        expect(Math.abs(beam.beamY - expectedMainY)).toBeLessThan(0.1)
      })
    })
  })

  describe('铁律二：发生装置真实组件渲染与物理装配无穿模守则', () => {
    it('蒸馏烧瓶加热体系：铁架台立柱位于烧瓶左外侧，且支管口端口朝向右方供导管对接', () => {
      const { container } = render(
        React.createElement(
          'svg',
          null,
          React.createElement(LiquidHeatingGeneratorApparatus, { x: 125, y: 480 })
        )
      )
      const group = container.querySelector('#liquid-heating-generator-group')
      expect(group).toBeTruthy()
      const ports = getLiquidHeatingGeneratorPorts(125, 480)
      // 蒸馏烧瓶中心 x = 125，支管口向右伸出必大于烧瓶右外缘 (> 125 + 45)
      expect(ports.sideArmPort.x).toBeGreaterThan(165)
      expect(ports.topNeckPort.y).toBeLessThan(ports.sideArmPort.y)

      // 检查实际渲染出的铁架台底座左侧位于烧瓶中心左侧 75px，立柱 x 应落在烧瓶左侧外部
      const rects = Array.from(group!.querySelectorAll('rect'))
      const baseRect = rects[0]
      expect(Number(baseRect.getAttribute('x'))).toBe(50)
      // 存在竖直立柱 rect（高度 > 200 且宽度 <= 8）位于烧瓶左外侧 (< 125 - 38)
      const pole = rects.find(
        (r) => Number(r.getAttribute('height')) > 200 && Number(r.getAttribute('width')) <= 8
      )
      expect(pole).toBeDefined()
      expect(Number(pole!.getAttribute('x')) + Number(pole!.getAttribute('width'))).toBeLessThan(87)
    })

    it('固液加热与导管连线体系：支管口导出水平导管且高于基座', () => {
      const preset = GAS_PRESET_CONFIGS['Cl₂']
      const solved = solvePhysicalChainLayout({
        generator: preset.generator!,
        washingSteps: preset.washingSteps!,
        collection: preset.collection!,
        tailGas: preset.tailGas!,
        baseY: 480,
      })
      const genLayout = solved.apparatusLayouts.find((a) => a.id === 'generator')
      expect(genLayout).toBeDefined()
      expect(genLayout!.outletPort).toBeTruthy()
      expect(genLayout!.outletPort!.y).toBeLessThan(480)
      expect(solved.routes[0].pathD).toContain('M ')
    })
  })

  describe('铁律三：真实组件渲染下的气流方向与化学事实一致性断言', () => {
    it('洗气瓶实测 DOM 必须“长进短出”：进气长管显著深于出气短管，reversed 时自动对调', () => {
      const ports = getGasWashingBottlePorts(0, 0, 90, 140)
      expect(ports.inletPort.x).toBeLessThan(ports.outletPort.x)

      const { container: normalDom } = render(
        React.createElement(
          'svg',
          null,
          React.createElement(GasWashingBottleApparatus, { x: 0, y: 0, width: 90, height: 140 })
        )
      )
      const normalLines = Array.from(normalDom.querySelectorAll('#wash-tubes line'))
      // 长管底端 y2 应深入液面近瓶底 (> 120)，短管底端仅停在瓶肩上方 (< 65)
      const normalY2s = normalLines.map((l) => Number(l.getAttribute('y2')))
      expect(Math.max(...normalY2s)).toBeGreaterThan(120)
      expect(Math.min(...normalY2s)).toBeLessThan(65)

      const { container: revDom } = render(
        React.createElement(
          'svg',
          null,
          React.createElement(GasWashingBottleApparatus, {
            x: 0,
            y: 0,
            width: 90,
            height: 140,
            reversed: true,
          })
        )
      )
      const leftTubeY2Normal = Math.max(
        ...normalLines
          .filter((l) => Number(l.getAttribute('x1')) < 45)
          .map((l) => Number(l.getAttribute('y2')))
      )
      const leftTubeY2Rev = Math.max(
        ...Array.from(revDom.querySelectorAll('#wash-tubes line'))
          .filter((l) => Number(l.getAttribute('x1')) < 45)
          .map((l) => Number(l.getAttribute('y2')))
      )
      expect(leftTubeY2Normal).toBeGreaterThan(120)
      expect(leftTubeY2Rev).toBeLessThan(65)
    })

    it('极易溶气体体系（NH₃ / HCl）必须配置防倒吸装置', () => {
      const nh3Preset = GAS_PRESET_CONFIGS['NH₃']
      expect(['inverted-funnel', 'safety-bottle', 'water-displacement']).toContain(nh3Preset.tailGas)
      const hclPreset = GAS_PRESET_CONFIGS['HCl']
      expect(['inverted-funnel', 'safety-bottle']).toContain(hclPreset.tailGas)
    })

    it('密度比空气小的气体（NH₃ / H₂）必须使用向下排空气或排水法', () => {
      const nh3Preset = GAS_PRESET_CONFIGS['NH₃']
      expect(['downward-air', 'water-displacement']).toContain(nh3Preset.collection)

      const h2Preset = GAS_PRESET_CONFIGS['H₂']
      expect(['downward-air', 'water-displacement']).toContain(h2Preset.collection)
    })

    it('固体加热组件 (NH₃ / O₂)：真实渲染后出气管端口向右导出且与铁夹旋转锚点协同', () => {
      const ports = getSolidHeatingGeneratorPorts(50, 480)
      expect(ports.outletPort.x).toBeGreaterThan(ports.clampPort.x)
      expect(ports.outletPort.direction).toBe('right')

      const { container } = render(
        React.createElement(
          'svg',
          null,
          React.createElement(SolidHeatingGeneratorApparatus, { x: 50, y: 480, targetGas: 'NH₃' })
        )
      )
      expect(container.querySelector('#solid-heating-generator')).toBeTruthy()
    })

    it('启普发生器真实 DOM：长颈管深入下球底面以上方，开关切换时酸液层随之退回或漫过隔板', () => {
      const ports = getKippApparatusPorts(0, 0, 90)
      expect(ports.outletPort.direction).toBe('up')

      const { container: openDom } = render(
        React.createElement('svg', null, React.createElement(KippApparatus, { x: 0, y: 0, isOpen: true }))
      )
      const stem = openDom.querySelector('#internal-stem-tube rect')
      expect(stem).toBeTruthy()
      const stemBottom = Number(stem!.getAttribute('y')) + Number(stem!.getAttribute('height'))
      expect(stemBottom).toBeGreaterThan(200)
      expect(openDom.querySelector('#acid-liquid-open')).toBeTruthy()

      const { container: closedDom } = render(
        React.createElement('svg', null, React.createElement(KippApparatus, { x: 0, y: 0, isOpen: false }))
      )
      expect(closedDom.querySelector('#acid-liquid-closed')).toBeTruthy()
    })
  })

  describe('铁律四：全套高考经典气体预设布局合法性矩阵遍历', () => {
    const presetKeys = Object.keys(GAS_PRESET_CONFIGS)

    presetKeys.forEach((key) => {
      const preset = GAS_PRESET_CONFIGS[key as keyof typeof GAS_PRESET_CONFIGS]

      it(`气体 [${preset.targetGas}] (${key})：槽位分配单调递增，无器皿重叠踩踏`, () => {
        const result = solvePhysicalChainLayout({
          generator: preset.generator!,
          washingSteps: preset.washingSteps!,
          collection: preset.collection!,
          tailGas: preset.tailGas!,
          baseY: 480,
        })

        const layouts = result.apparatusLayouts
        expect(layouts.length).toBeGreaterThan(0)

        // 校验 1：所有器材的中心 X 必须严格从左到右单调递增
        for (let i = 0; i < layouts.length - 1; i++) {
          const current = layouts[i]
          const next = layouts[i + 1]
          expect(next.x).toBeGreaterThan(current.x + current.width * 0.3)
        }

        // 校验 2：所有连接导管起点终点必须有效
        result.routes.forEach((tube) => {
          expect(tube.pathD).toBeDefined()
          expect(tube.pathD.length).toBeGreaterThan(10)
          expect(tube.pathD.startsWith('M ')).toBe(true)
        })
      })
    })
  })
})
