import { describe, it, expect } from 'vitest'
import {
  CHEMISTRY_COLORS,
  CANVAS_COLORS,
  ATOM_COLORS,
  PHENOMENON_COLORS,
  INDICATOR_COLORS,
  withAlpha,
} from '../chemistry/colors'

describe('CHEMISTRY_COLORS', () => {
  it('包含基本化学量颜色', () => {
    expect(CHEMISTRY_COLORS.concentration).toBeDefined()
    expect(CHEMISTRY_COLORS.temperature).toBeDefined()
    expect(CHEMISTRY_COLORS.pressure).toBeDefined()
    expect(CHEMISTRY_COLORS.volume).toBeDefined()
    expect(CHEMISTRY_COLORS.mass).toBeDefined()
    expect(CHEMISTRY_COLORS.amount).toBeDefined()
  })

  it('包含反应动力学颜色', () => {
    expect(CHEMISTRY_COLORS.reactionRate).toBeDefined()
    expect(CHEMISTRY_COLORS.rateForward).toBeDefined()
    expect(CHEMISTRY_COLORS.rateReverse).toBeDefined()
    expect(CHEMISTRY_COLORS.equilibrium).toBeDefined()
  })

  it('包含电化学颜色', () => {
    expect(CHEMISTRY_COLORS.electrode).toBeDefined()
    expect(CHEMISTRY_COLORS.anode).toBeDefined()
    expect(CHEMISTRY_COLORS.cathode).toBeDefined()
    expect(CHEMISTRY_COLORS.positivePole).toBeDefined()
    expect(CHEMISTRY_COLORS.negativePole).toBeDefined()
    expect(CHEMISTRY_COLORS.saltBridge).toBeDefined()
    expect(CHEMISTRY_COLORS.electron).toBeDefined()
  })

  it('所有颜色值是合法 hex', () => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/
    Object.entries(CHEMISTRY_COLORS).forEach(([key, value]) => {
      expect(hexPattern.test(value as string)).toBe(true)
      // void key 避免 unused warning
      void key
    })
  })
})

describe('ATOM_COLORS & PHENOMENON_COLORS & INDICATOR_COLORS', () => {
  it('包含常用 CPK 原子颜色', () => {
    expect(ATOM_COLORS.H).toBe('#FFFFFF')
    expect(ATOM_COLORS.C).toBe('#374151')
    expect(ATOM_COLORS.Fe).toBe('#B45309')
  })

  it('包含特征化学显色与沉淀色', () => {
    expect(PHENOMENON_COLORS.fe3Plus).toBeDefined()
    expect(PHENOMENON_COLORS.feOh3Precipitate).toBeDefined()
    expect(PHENOMENON_COLORS.no2Gas).toBeDefined()
  })

  it('包含滴定指示剂变色阶', () => {
    expect(INDICATOR_COLORS.phenolphthalein.palePink).toBe('#F472B6')
    expect(INDICATOR_COLORS.methylOrange.acidic).toBe('#EF4444')
  })
})

describe('CANVAS_COLORS', () => {
  it('包含基础设施颜色', () => {
    expect(CANVAS_COLORS.axis).toBeDefined()
    expect(CANVAS_COLORS.grid).toBeDefined()
    expect(CANVAS_COLORS.labelText).toBeDefined()
  })
})

describe('withAlpha', () => {
  it('6位 hex + alpha → rgba', () => {
    expect(withAlpha('#3B82F6', 0.5)).toBe('rgba(59, 130, 246, 0.5)')
  })

  it('3位 hex + alpha → rgba', () => {
    expect(withAlpha('#F00', 0.3)).toBe('rgba(255, 0, 0, 0.3)')
  })

  it('无效长度返回原值', () => {
    expect(withAlpha('#12', 0.5)).toBe('#12')
  })
})
