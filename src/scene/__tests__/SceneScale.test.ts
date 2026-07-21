import { describe, it, expect } from 'vitest'
import { createSceneScale, worldToDesign, IDENTITY_SCENE_SCALE, createSceneScaleFromDesignCenter } from '../SceneScale'

describe('createSceneScale', () => {
  it('等比缩放：worldWidth=10, worldHeight=10, bounds=100x100 → scale=10', () => {
    const ss = createSceneScale({
      vectorBounds: { x: 0, y: 0, width: 100, height: 100 },
      originX: 0, originY: 0,
      worldWidth: 10, worldHeight: 10,
    })
    expect(ss.scaleX).toBe(10)
    expect(ss.scaleY).toBe(10)
    expect(ss.scale).toBe(10)
  })

  it('非等比缩放取 min', () => {
    const ss = createSceneScale({
      vectorBounds: { x: 0, y: 0, width: 200, height: 100 },
      originX: 0, originY: 0,
      worldWidth: 10, worldHeight: 10,
    })
    expect(ss.scaleX).toBe(20)
    expect(ss.scaleY).toBe(10)
    expect(ss.scale).toBe(10)
  })

  it('无 worldWidth/worldHeight 返回 scale=1', () => {
    const ss = createSceneScale({
      vectorBounds: { x: 0, y: 0, width: 100, height: 100 },
      originX: 50, originY: 50,
    })
    expect(ss.scale).toBe(1)
    expect(ss.originX).toBe(50)
  })
})

describe('worldToDesign', () => {
  it('原点映射到 originX, originY', () => {
    const ss = createSceneScale({
      vectorBounds: { x: 0, y: 0, width: 100, height: 100 },
      originX: 50, originY: 80,
      worldWidth: 10, worldHeight: 10,
    })
    const { px, py } = worldToDesign(0, 0, ss)
    expect(px).toBe(50)
    expect(py).toBe(80)
  })

  it('y 轴反转：world y=5 映射到 design y=80-5*10=30', () => {
    const ss = createSceneScale({
      vectorBounds: { x: 0, y: 0, width: 100, height: 100 },
      originX: 50, originY: 80,
      worldWidth: 10, worldHeight: 10,
    })
    const { py } = worldToDesign(0, 5, ss)
    expect(py).toBe(30)
  })

  it('IDENTITY_SCENE_SCALE 不做变换', () => {
    const { px, py } = worldToDesign(3, 4, IDENTITY_SCENE_SCALE)
    expect(px).toBe(3)
    expect(py).toBe(-4) // y 反转
  })
})

describe('createSceneScaleFromDesignCenter', () => {
  it('以设计中心为原点', () => {
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
    expect(ss.maxVectorLength).toBeCloseTo(195) // min(840,650)*0.3
  })
})
