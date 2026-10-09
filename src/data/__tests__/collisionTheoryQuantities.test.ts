import { describe, it, expect } from 'vitest'
import {
  buildCollisionTheoryQuantities,
  collisionTheoryFormulas,
  collisionTheoryExamPoints,
} from '../quantities/reaction-principle/collisionTheory'
import { computeMaxwellBoltzmann } from '@/chemistry/collision'

describe('collisionTheoryQuantities 碰撞理论动态化学量与考点', () => {
  it('右屏化学量与麦克斯韦-玻尔兹曼分布活化分子占比 100% 同源', () => {
    const params = {
      temperature: 298,
      concentration: 1.0,
      activationEnergy: 80,
      catalyst: 0,
    }
    const quantities = buildCollisionTheoryQuantities(params)
    const mb = computeMaxwellBoltzmann(298, 80, false)

    const fQ = quantities.find((q) => q.key === 'activationFraction')
    expect(fQ).toBeDefined()
    expect(fQ?.value).toBeCloseTo(mb.activationFraction * 100, 4)
  })

  it('催化剂降低活化能并显著提升活化分子百分数', () => {
    const noCat = buildCollisionTheoryQuantities({
      temperature: 298,
      concentration: 1.0,
      activationEnergy: 80,
      catalyst: 0,
    })
    const withCat = buildCollisionTheoryQuantities({
      temperature: 298,
      concentration: 1.0,
      activationEnergy: 80,
      catalyst: 1,
    })

    const eaNo = noCat.find((q) => q.key === 'activationEnergy')!.value
    const eaWith = withCat.find((q) => q.key === 'activationEnergy')!.value
    expect(eaWith).toBeCloseTo(eaNo * 0.55, 4)

    const fNo = noCat.find((q) => q.key === 'activationFraction')!.value
    const fWith = withCat.find((q) => q.key === 'activationFraction')!.value
    expect(fWith).toBeGreaterThan(fNo)
  })

  it('高考核心规律：改变反应物浓度增加碰撞频率和速率，但活化分子百分数严格不变', () => {
    const lowC = buildCollisionTheoryQuantities({
      temperature: 298,
      concentration: 1.0,
      activationEnergy: 80,
      catalyst: 0,
    })
    const highC = buildCollisionTheoryQuantities({
      temperature: 298,
      concentration: 2.5,
      activationEnergy: 80,
      catalyst: 0,
    })

    const fLow = lowC.find((q) => q.key === 'activationFraction')!.value
    const fHigh = highC.find((q) => q.key === 'activationFraction')!.value
    expect(fHigh).toBeCloseTo(fLow, 8)

    const zLow = lowC.find((q) => q.key === 'effectiveCollisions')!.value
    const zHigh = highC.find((q) => q.key === 'effectiveCollisions')!.value
    expect(zHigh).toBeCloseTo(zLow * 2.5, 4)

    const vLow = lowC.find((q) => q.key === 'reactionRate')!.value
    const vHigh = highC.find((q) => q.key === 'reactionRate')!.value
    expect(vHigh).toBeCloseTo(vLow * 2.5, 4)
  })

  it('公式与考点定义完备且覆盖高考要点', () => {
    expect(collisionTheoryFormulas.length).toBeGreaterThanOrEqual(4)
    expect(collisionTheoryExamPoints.length).toBeGreaterThanOrEqual(4)
    expect(collisionTheoryExamPoints.some((ep) => ep.text.includes('有效碰撞'))).toBe(true)
    expect(collisionTheoryExamPoints.some((ep) => ep.text.includes('催化剂'))).toBe(true)
  })
})
