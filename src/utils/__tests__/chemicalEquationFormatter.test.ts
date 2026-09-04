import { describe, it, expect } from 'vitest'
import { formatChemicalEquation, splitTopLevelPlus } from '../chemicalEquationFormatter'

describe('chemicalEquationFormatter', () => {
  it('should not split ionic signs in splitTopLevelPlus', () => {
    const expr = '5SO_4^{2-} + 2Mn^{2+} + 4H^+'
    const parts = splitTopLevelPlus(expr)
    expect(parts).toEqual(['5SO_4^{2-}', '2Mn^{2+}', '4H^+'])
  })

  it('should preserve short chemical equations in single line', () => {
    const eq = 'Cl_2 + H_2O = HCl + HClO'
    const result = formatChemicalEquation(eq, 26)
    expect(result).toBe(eq)
  })

  it('should wrap long chemical equation at connector and plus signs according to textbook rules', () => {
    const eq = '2Fe + 6H_2SO_4(\\text{浓}) \\xrightarrow{\\Delta} Fe_2(SO_4)_3 + 3SO_2\\uparrow + 6H_2O'
    const result = formatChemicalEquation(eq, 22)
    expect(result).toContain('\\begin{aligned}')
    expect(result).toContain('2Fe + 6H_2SO_4(\\text{浓})')
    expect(result).toContain('\\xrightarrow{\\Delta}')
    expect(result).toContain('Fe_2(SO_4)_3')
    expect(result).toContain('3SO_2\\uparrow')
    expect(result).toContain('6H_2O')
  })

  it('should wrap organic equations cleanly without breaking groups', () => {
    const eq = 'CH_3CH_2CH_2CH_2Br + NaOH \\xrightarrow{H_2O, \\Delta} CH_3CH_2CH_2CH_2OH + NaBr'
    const result = formatChemicalEquation(eq, 22)
    expect(result).toContain('\\begin{aligned}')
    expect(result).toContain('CH_3CH_2CH_2CH_2Br + NaOH')
    expect(result).toContain('CH_3CH_2CH_2CH_2OH')
    expect(result).toContain('+ NaBr')
  })
})
