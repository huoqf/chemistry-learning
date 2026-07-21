import { describe, it, expect } from 'vitest'
import {
  worldToDesign,
  createSceneScaleFromDesignCenter,
  IDENTITY_SCENE_SCALE,
  createSceneScale,
} from '../SceneScale'
import {
  physicsToDesign,
  designToContainer,
  containerToDesign,
  physicsVectorToDesignVector,
  designVectorToPhysicsVector,
  asPhysicsCoord,
  asDesignCoord,
  asPhysicsVector,
} from '../coordinates'
import type { SceneScale } from '../SceneScale'

// ═══════════════════════════════════════════════════════════════════════════
// 1. Y 轴翻转一致性测试
// ═══════════════════════════════════════════════════════════════════════════

describe('Y轴翻转一致性', () => {
  const sceneScale: SceneScale = {
    originX: 400,
    originY: 600,
    scaleX: 40,
    scaleY: 40,
    scale: 40,
    maxVectorLength: 120,
  }

  it('worldToDesign 和 physicsToDesign 对同一输入输出一致', () => {
    const wx = 3, wy = 5
    const fromWTD = worldToDesign(wx, wy, sceneScale)
    const fromPTD = physicsToDesign(asPhysicsCoord({ x: wx, y: wy }), sceneScale)
    expect(fromWTD.px).toBeCloseTo(fromPTD.x)
    expect(fromWTD.py).toBeCloseTo(fromPTD.y)
  })

  it('Y轴正确翻转：物理 y=5 在设计空间位于原点上方', () => {
    const { py } = worldToDesign(0, 5, sceneScale)
    // py = originY - 5 * scaleY = 600 - 200 = 400
    expect(py).toBe(400)
    expect(py).toBeLessThan(sceneScale.originY)
  })

  it('Y=0 在原点位置', () => {
    const { py } = worldToDesign(0, 0, sceneScale)
    expect(py).toBe(sceneScale.originY)
  })

  it('负Y值在设计空间位于原点下方', () => {
    const { py } = worldToDesign(0, -3, sceneScale)
    // py = 600 - (-3) * 40 = 600 + 120 = 720
    expect(py).toBe(720)
    expect(py).toBeGreaterThan(sceneScale.originY)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// 2. 坐标系往返一致性
// ═══════════════════════════════════════════════════════════════════════════

describe('坐标系往返转换', () => {
  const sceneScale: SceneScale = {
    originX: 420,
    originY: 325,
    scaleX: 50,
    scaleY: 50,
    scale: 50,
    maxVectorLength: 195,
  }

  const vp = { tx: 10, ty: 20, scale: 0.8 }

  it('physicsToDesign → designToContainer → containerToDesign 往返一致', () => {
    const physics = asPhysicsCoord({ x: 2, y: 3 })
    const design = physicsToDesign(physics, sceneScale)
    const container = designToContainer(design, vp)
    const backDesign = containerToDesign(container, vp)

    expect(backDesign.x).toBeCloseTo(design.x, 10)
    expect(backDesign.y).toBeCloseTo(design.y, 10)
  })

  it('矢量 physicsVectorToDesignVector → designVectorToPhysicsVector 往返一致', () => {
    const pv = asPhysicsVector({ x: 3, y: 4 })
    const dv = physicsVectorToDesignVector(pv, sceneScale)
    const backPv = designVectorToPhysicsVector(dv, sceneScale)

    expect(backPv.x).toBeCloseTo(pv.x, 10)
    expect(backPv.y).toBeCloseTo(pv.y, 10)
  })

  it('矢量 Y 分量符号翻转：物理 y=4 → 设计 y=-200', () => {
    const pv = asPhysicsVector({ x: 0, y: 4 })
    const dv = physicsVectorToDesignVector(pv, sceneScale)
    expect(dv.y).toBe(-4 * sceneScale.scaleY)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// 3. CANVAS_PRESETS 跨分辨率测试
// ═══════════════════════════════════════════════════════════════════════════

describe('CANVAS_PRESETS 跨分辨率', () => {
  const presets = [
    { name: 'full', width: 840, height: 650 },
    { name: 'splitV', width: 840, height: 325 },
    { name: 'splitH', width: 420, height: 650 },
    { name: 'splitHw', width: 280, height: 650 },
    { name: 'square', width: 650, height: 650 },
  ]

  presets.forEach(({ name, width, height }) => {
    describe(`preset: ${name} (${width}x${height})`, () => {
      it('原点映射在预设范围内', () => {
        const sceneScale = createSceneScale({
          vectorBounds: { x: 0, y: 0, width, height },
          originX: width / 2,
          originY: height,
          worldWidth: 20,
          worldHeight: 15,
        })

        // 原点 (0,0) 映射到设计坐标
        const origin = worldToDesign(0, 0, sceneScale)
        expect(origin.px).toBe(width / 2)
        expect(origin.py).toBe(height)

        // 右上角 (10, 15) 映射（originX=width/2，X方向覆盖 ±10）
        const corner = worldToDesign(10, 15, sceneScale)
        expect(corner.px).toBeGreaterThanOrEqual(0)
        expect(corner.px).toBeLessThanOrEqual(width)
        expect(corner.py).toBeGreaterThanOrEqual(0)
        expect(corner.py).toBeLessThanOrEqual(height)
      })

      it('maxVectorLength 不超过预设最短边的 30%', () => {
        const sceneScale = createSceneScale({
          vectorBounds: { x: 0, y: 0, width, height },
          originX: width / 2,
          originY: height,
          worldWidth: 20,
          worldHeight: 15,
        })
        expect(sceneScale.maxVectorLength).toBeLessThanOrEqual(Math.min(width, height) * 0.3 + 1)
      })

      it('scale > 0 且一致', () => {
        const sceneScale = createSceneScale({
          vectorBounds: { x: 0, y: 0, width, height },
          originX: width / 2,
          originY: height,
          worldWidth: 20,
          worldHeight: 15,
        })
        expect(sceneScale.scale).toBeGreaterThan(0)
        expect(sceneScale.scale).toBe(Math.min(sceneScale.scaleX, sceneScale.scaleY))
      })
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// 4. createSceneScaleFromDesignCenter 测试
// ═══════════════════════════════════════════════════════════════════════════

describe('createSceneScaleFromDesignCenter', () => {
  it('中心点坐标与预设一致', () => {
    const ss = createSceneScaleFromDesignCenter({
      designWidth: 840,
      designHeight: 650,
      centerX: 420,
      centerY: 325,
      scale: 50,
    })
    expect(ss.originX).toBe(420)
    expect(ss.originY).toBe(325)
    expect(ss.scaleX).toBe(50)
    expect(ss.scaleY).toBe(50)
  })

  it('化学坐标系 (0,0) 映射到中心', () => {
    const ss = createSceneScaleFromDesignCenter({
      designWidth: 840,
      designHeight: 650,
      centerX: 420,
      centerY: 325,
      scale: 50,
    })
    const { px, py } = worldToDesign(0, 0, ss)
    expect(px).toBe(420)
    expect(py).toBe(325)
  })

  it('化学坐标 (5, 3) 正确映射', () => {
    const ss = createSceneScaleFromDesignCenter({
      designWidth: 840,
      designHeight: 650,
      centerX: 420,
      centerY: 325,
      scale: 50,
    })
    const { px, py } = worldToDesign(5, 3, ss)
    // px = 420 + 5 * 50 = 670
    // py = 325 - 3 * 50 = 175
    expect(px).toBe(670)
    expect(py).toBe(175)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// 5. IDENTITY_SCENE_SCALE 测试
// ═══════════════════════════════════════════════════════════════════════════

describe('IDENTITY_SCENE_SCALE', () => {
  it('不缩放坐标（仅Y翻转）', () => {
    const { px, py } = worldToDesign(5, 3, IDENTITY_SCENE_SCALE)
    expect(px).toBe(5)
    expect(py).toBe(-3) // Y 翻转：0 - 3 * 1 = -3
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// 6. Viewport Transform 与 SceneScale 配合测试
// ═══════════════════════════════════════════════════════════════════════════

describe('Viewport + SceneScale 配合', () => {
  it('设计坐标经过 viewport transform 后映射到容器像素', () => {
    // 模拟 vp 的行为
    const vp = { tx: 50, ty: 30, scale: 0.6 }
    const designPt = asDesignCoord({ x: 100, y: 200 })

    const containerPt = designToContainer(designPt, vp)
    // containerX = 100 * 0.6 + 50 = 110
    // containerY = 200 * 0.6 + 30 = 150
    expect(containerPt.x).toBe(110)
    expect(containerPt.y).toBe(150)
  })

  it('不同缩放比下坐标往返一致', () => {
    const scales = [0.3, 0.5, 0.8, 1.0, 1.5, 2.0]
    const designPt = asDesignCoord({ x: 420, y: 325 })

    scales.forEach(scale => {
      const vp = { tx: 10, ty: 20, scale }
      const containerPt = designToContainer(designPt, vp)
      const backDesign = containerToDesign(containerPt, vp)
      expect(backDesign.x).toBeCloseTo(420, 10)
      expect(backDesign.y).toBeCloseTo(325, 10)
    })
  })
})
