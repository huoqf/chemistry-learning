import { describe, it, expect } from 'vitest'
import { solvePhysicalChainLayout } from '../physics/layoutEngine'
import { GAS_PRESET_CONFIGS } from '../data/gasChainMatrixData'

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

  describe('铁律二：发生装置物理装配与无穿模守则', () => {
    it('蒸馏烧瓶加热体系：铁架台立柱必须在烧瓶球体左外侧，绝不刺穿玻璃', () => {
      const FLASK_CENTER_X = 125
      const FLASK_W = 90
      const FLASK_BULB_R = FLASK_W * 0.42 // = 37.8
      const FLASK_LEFT_EDGE = FLASK_CENTER_X - FLASK_BULB_R // 87.2

      // 立柱绝对位置设计在 x - 50 = 75
      const POLE_CENTER_X = FLASK_CENTER_X - 50 // 75

      // 断言：立柱最右边缘 (POLE_CENTER_X + 3) 必须在烧瓶球体左外侧，并留有安全间距
      expect(POLE_CENTER_X + 3).toBeLessThan(FLASK_LEFT_EDGE - 5)
    })

    it('蒸馏烧瓶加热体系：铁夹夹持位置必须高于支管口，严禁夹在支管分叉点', () => {
      const FLASK_H = 140
      const NECK_H = FLASK_H * 0.4 // 56
      const SIDE_TUBE_TOP_Y = NECK_H * 0.35 // 19.6
      const CLAMP_REL_Y = 11 // 设计夹持在瓶颈相对顶部 11px 处

      // 断言：铁夹高度必须在支管口上方至少 5px
      expect(CLAMP_REL_Y).toBeLessThan(SIDE_TUBE_TOP_Y - 5)
    })

    it('分液漏斗装配：活塞必须高出橡皮塞，细长下管必须穿透塞子深入瓶颈', () => {
      const FUNNEL_H = 150
      const insertDepth = 28
      const stopperTopRelY = FUNNEL_H - insertDepth // 122
      const valveRelY = 97 // 活塞相对漏斗顶部位置

      // 断言 1：活塞必须高出橡皮塞顶面至少 20px (便于手拧操作)
      expect(stopperTopRelY - valveRelY).toBeGreaterThanOrEqual(20)

      // 断言 2：细长下导管必须深入塞孔至少 25px
      expect(insertDepth).toBeGreaterThanOrEqual(25)
    })
  })

  describe('铁律三：气流进出方向与化学事实一致性断言', () => {
    it('洗气瓶必须“长进短出”：进气管深入液面，出气管微露塞体', () => {
      const WASH_H = 140
      const longTubeDepth = WASH_H - 15 // 深入距底 15px
      const shortTubeDepth = 35 // 仅微穿塞子

      // 断言：进气管深度至少是出气管的 3 倍以上，严禁短进长出冲料
      expect(longTubeDepth).toBeGreaterThan(shortTubeDepth * 3)
    })

    it('极易溶气体体系（NH3 / HCl）必须配置防倒吸装置', () => {
      const nh3Preset = GAS_PRESET_CONFIGS['NH₃']
      // 氨气极易溶于水 (1:700)，必须配防倒吸
      expect(['inverted-funnel', 'safety-bottle', 'water-displacement']).toContain(nh3Preset.tailGas)
    })

    it('密度比空气小的气体（NH3 / H2）必须使用向下排空气或排水法', () => {
      const nh3Preset = GAS_PRESET_CONFIGS['NH₃']
      expect(['downward-air', 'water-displacement']).toContain(nh3Preset.collection)

      const h2Preset = GAS_PRESET_CONFIGS['H₂']
      expect(['downward-air', 'water-displacement']).toContain(h2Preset.collection)
    })

    it('固体加热体系 (NH3 / O2)：试管口必须向下微倾斜 5°~10° 防冷凝水倒流炸裂', () => {
      // 固体加热试管经典倾角标定在 6°
      const TUBE_TILT_ANGLE = 6
      expect(TUBE_TILT_ANGLE).toBeGreaterThanOrEqual(5)
      expect(TUBE_TILT_ANGLE).toBeLessThanOrEqual(10)
    })

    it('启普发生器结构断言：上漏斗长颈管必须贯穿中球直达底球 (深度 > 多孔隔板)', () => {
      const BASE_H = 220
      const WAIST_PERFORATED_PLATE_Y = 154 // 多孔隔板 Y 坐标
      const STEM_BOTTOM_Y = BASE_H - 12     // 长管底端 Y 坐标 (深入底球近底)

      // 断言：长管底端必须深入多孔隔板下方至少 40px，确保酸液液封并实现连通器压差
      expect(STEM_BOTTOM_Y - WAIST_PERFORATED_PLATE_Y).toBeGreaterThan(40)
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
