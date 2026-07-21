import { describe, it, expect } from 'vitest'
import { buildHybridQuantities } from '@/data/quantities/structure/hybridization'
import { HYBRID_MODELS } from '../data/hybridData'

describe('useHybridChemistry & quantities', () => {
  it('should compute hybrid quantities for CH4 (sp3)', () => {
    // CH4 在 11 个预设中索引为 7
    const quantities = buildHybridQuantities({ presetIdx: 7 })
    const totalOrbitals = quantities.find(q => q.key === 'totalOrbitals')
    const sRatio = quantities.find(q => q.key === 'sRatio')
    const pRatio = quantities.find(q => q.key === 'pRatio')
    const bondAngle = quantities.find(q => q.key === 'bondAngle')

    expect(totalOrbitals?.value).toBe(4)
    expect(sRatio?.value).toBe(25)
    expect(pRatio?.value).toBe(75)
    expect(bondAngle?.value).toBe(109.5)
  })

  it('should compute hybrid quantities for BeCl2 (sp)', () => {
    const quantities = buildHybridQuantities({ presetIdx: 0 })
    const totalOrbitals = quantities.find(q => q.key === 'totalOrbitals')
    const sRatio = quantities.find(q => q.key === 'sRatio')
    const bondAngle = quantities.find(q => q.key === 'bondAngle')

    expect(totalOrbitals?.value).toBe(2)
    expect(sRatio?.value).toBe(50)
    expect(bondAngle?.value).toBe(180)
  })

  it('should load correct model geometry for CO2 (sp) and SO2 (sp2)', () => {
    const co2 = HYBRID_MODELS.co2
    expect(co2.hybridType).toBe('sp')
    expect(co2.piBonds?.length).toBe(2)

    const so2 = HYBRID_MODELS.so2
    expect(so2.hybridType).toBe('sp2')
    expect(so2.centers[0].hybridOrbitals.some(o => o.type === 'lonePair')).toBe(true)
  })
})
