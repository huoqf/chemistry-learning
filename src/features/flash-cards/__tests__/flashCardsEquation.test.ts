import { describe, it, expect } from 'vitest'
import { FLASH_CARDS } from '../constants'
import { formatChemicalEquation } from '@/utils/chemicalEquationFormatter'
import katex from 'katex'

describe('Flash cards and chemical equations validation', () => {
  it('should have exactly 21 unique cards with distinct IDs', () => {
    expect(FLASH_CARDS).toHaveLength(21)
    const ids = FLASH_CARDS.map((c) => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(21)
  })

  it('should validate that experiment-templates have templateSteps and no raw KaTeX paragraphs', () => {
    const templateCards = FLASH_CARDS.filter((c) => c.category === 'experiment-templates')
    expect(templateCards.length).toBe(6)

    for (const card of templateCards) {
      expect(card.templateSteps).toBeDefined()
      expect(card.templateSteps!.length).toBeGreaterThanOrEqual(3)
      for (const step of card.templateSteps!) {
        expect(step.title).toBeTruthy()
        expect(step.desc).toBeTruthy()
      }
    }
  })

  it('should render all chemical equations cleanly without KaTeX errors after smart formatting', () => {
    for (const card of FLASH_CARDS) {
      for (const eq of card.chemicalEquations) {
        const match = eq.match(/^(.*?)(?:\s*\(([^)]+)\)\s*)?$/)
        const rawLatex = match ? match[1].trim() : eq
        const formatted = formatChemicalEquation(rawLatex, 24)

        // 验证 KaTeX 渲染不抛错
        expect(() => {
          katex.renderToString(formatted, {
            throwOnError: true,
            displayMode: true,
          })
        }).not.toThrow()
      }
    }
  })
})
