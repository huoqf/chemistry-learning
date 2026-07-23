import { describe, it, expect } from 'vitest'
import { VALENCE_MATRIX_DATA } from '../valenceMatrixData'

describe('Valence Matrix Data Integrity', () => {
  it('should contain all 11 inorganic elements (9 core + 2 industrial)', () => {
    const keys = Object.keys(VALENCE_MATRIX_DATA)
    expect(keys).toHaveLength(11)
    expect(keys).toContain('Fe')
    expect(keys).toContain('Cu')
    expect(keys).toContain('Al')
    expect(keys).toContain('Na')
    expect(keys).toContain('S')
    expect(keys).toContain('N')
    expect(keys).toContain('Cl')
    expect(keys).toContain('Si')
    expect(keys).toContain('C')
    expect(keys).toContain('Mn')
    expect(keys).toContain('Cr')
  })

  it('should separate core Gaokao elements and industrial process elements correctly', () => {
    const coreElements = Object.values(VALENCE_MATRIX_DATA).filter(e => e.isCoreGaokao)
    const extendedElements = Object.values(VALENCE_MATRIX_DATA).filter(e => !e.isCoreGaokao)

    expect(coreElements).toHaveLength(9)
    expect(extendedElements).toHaveLength(2)
    expect(extendedElements.map(e => e.symbol)).toEqual(['Mn', 'Cr'])
  })

  it('should ensure all transformation paths reference valid substances in the element node list', () => {
    Object.values(VALENCE_MATRIX_DATA).forEach(config => {
      const substanceNames = new Set(config.items.map(item => item.substance))

      config.transformations.forEach(trans => {
        // Validation: fromSubstance and toSubstance must match node substance name or contain matching substance
        const fromExists = Array.from(substanceNames).some(name => trans.fromSubstance.includes(name))
        const toExists = Array.from(substanceNames).some(name => trans.toSubstance.includes(name))

        expect(fromExists).toBe(true)
        expect(toExists).toBe(true)
        expect(trans.equation).toBeTruthy()
        expect(trans.electronTransfer).toBeTruthy()
      })
    })
  })

  it('should ensure each element has valid valences and categories', () => {
    Object.values(VALENCE_MATRIX_DATA).forEach(config => {
      expect(config.valences.length).toBeGreaterThan(0)
      expect(config.categories.length).toBeGreaterThan(0)
      expect(config.items.length).toBeGreaterThan(0)
      expect(config.examTips.length).toBeGreaterThan(0)
    })
  })
})
