import { describe, it, expect } from 'vitest'
import { FLASH_CARDS, FLASH_CARD_CATEGORIES } from '../constants'

describe('FlashCards 易错盲盒与新高考实验规范题库完整性审计', () => {
  it('应包含恰好 21 张精选易错卡片', () => {
    expect(FLASH_CARDS.length).toBe(21)
  })

  it('所有卡片必须包含完整的题目、选项、解析、避坑红线与高考考点', () => {
    FLASH_CARDS.forEach((card) => {
      expect(card.id).toBeTruthy()
      expect(card.title).toBeTruthy()
      expect(card.question).toBeTruthy()
      expect(card.optionA).toBeTruthy()
      expect(card.optionB).toBeTruthy()
      expect(['A', 'B']).toContain(card.correctOption)
      expect(card.explanation).toBeTruthy()
      expect(card.warningTip).toContain('高考避坑红线')
      expect(card.examPoint).toBeTruthy()
      expect(card.relatedKnowledgeIds.length).toBeGreaterThan(0)
    })
  })

  it('必须完整覆盖 6 大新高考必背实验规范答题模板', () => {
    const templateCards = FLASH_CARDS.filter((c) => c.category === 'experiment-templates')
    expect(templateCards.length).toBe(6)

    const titles = templateCards.map((c) => c.title)
    expect(titles.some((t) => t.includes('沉淀洗涤'))).toBe(true)
    expect(titles.some((t) => t.includes('沉淀是否洗净'))).toBe(true)
    expect(titles.some((t) => t.includes('滴定终点判定'))).toBe(true)
    expect(titles.some((t) => t.includes('气密性检验'))).toBe(true)
    expect(titles.some((t) => t.includes('恒压滴液漏斗'))).toBe(true)
    expect(titles.some((t) => t.includes('防倒吸原理'))).toBe(true)
  })

  it('分类列表必须与卡片定义完全匹配', () => {
    const definedCategoryValues = FLASH_CARD_CATEGORIES.map((c) => c.value)
    FLASH_CARDS.forEach((card) => {
      expect(definedCategoryValues).toContain(card.category)
    })
  })
})
