import { describe, it, expect } from 'vitest'
import { magnitude, normalize, direction, scale, add, subtract, dot, lengthSq, fromPolar } from '../Vector2'

describe('Vector2', () => {
  describe('magnitude', () => {
    it('计算零向量大小为 0', () => {
      expect(magnitude({ x: 0, y: 0 })).toBe(0)
    })
    it('计算单位向量大小为 1', () => {
      expect(magnitude({ x: 1, y: 0 })).toBe(1)
      expect(magnitude({ x: 0, y: 1 })).toBe(1)
    })
    it('计算 (3, 4) 大小为 5', () => {
      expect(magnitude({ x: 3, y: 4 })).toBe(5)
    })
    it('处理 Infinity 返回 0', () => {
      expect(magnitude({ x: Infinity, y: 0 })).toBe(0)
    })
  })

  describe('normalize', () => {
    it('零向量返回零向量', () => {
      const n = normalize({ x: 0, y: 0 })
      expect(n.x).toBe(0)
      expect(n.y).toBe(0)
    })
    it('归一化 (3, 4) 为 (0.6, 0.8)', () => {
      const n = normalize({ x: 3, y: 4 })
      expect(n.x).toBeCloseTo(0.6)
      expect(n.y).toBeCloseTo(0.8)
    })
  })

  describe('direction', () => {
    it('x 正方向角度为 0', () => {
      expect(direction({ x: 1, y: 0 })).toBeCloseTo(0)
    })
    it('y 正方向角度为 π/2', () => {
      expect(direction({ x: 0, y: 1 })).toBeCloseTo(Math.PI / 2)
    })
  })

  describe('scale', () => {
    it('缩放 (2, 3) × 2 = (4, 6)', () => {
      const s = scale({ x: 2, y: 3 }, 2)
      expect(s.x).toBe(4)
      expect(s.y).toBe(6)
    })
  })

  describe('add / subtract', () => {
    it('加法 (1, 2) + (3, 4) = (4, 6)', () => {
      const r = add({ x: 1, y: 2 }, { x: 3, y: 4 })
      expect(r.x).toBe(4)
      expect(r.y).toBe(6)
    })
    it('减法 (5, 7) - (2, 3) = (3, 4)', () => {
      const r = subtract({ x: 5, y: 7 }, { x: 2, y: 3 })
      expect(r.x).toBe(3)
      expect(r.y).toBe(4)
    })
  })

  describe('dot', () => {
    it('正交向量点积为 0', () => {
      expect(dot({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(0)
    })
    it('同方向向量点积 = 模的乘积', () => {
      expect(dot({ x: 3, y: 0 }, { x: 4, y: 0 })).toBe(12)
    })
  })

  describe('lengthSq', () => {
    it('(3, 4) 长度平方为 25', () => {
      expect(lengthSq({ x: 3, y: 4 })).toBe(25)
    })
  })

  describe('fromPolar', () => {
    it('极坐标 (5, 0) = (5, 0)', () => {
      const v = fromPolar(5, 0)
      expect(v.x).toBeCloseTo(5)
      expect(v.y).toBeCloseTo(0)
    })
    it('极坐标 (1, π/2) ≈ (0, 1)', () => {
      const v = fromPolar(1, Math.PI / 2)
      expect(v.x).toBeCloseTo(0)
      expect(v.y).toBeCloseTo(1)
    })
  })
})
