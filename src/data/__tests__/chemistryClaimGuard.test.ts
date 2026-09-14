import { describe, it, expect } from 'vitest'
import { ION_DATA } from '@/features/inorganic-ion-matrix/constants'
import { MAIN_GROUP_CONFLICTS } from '@/features/inorganic-ion-matrix/data/conflicts/mainGroupConflicts'
import { TRANSITION_METAL_CONFLICTS } from '@/features/inorganic-ion-matrix/data/conflicts/transitionMetalConflicts'
import { FUNCTIONAL_GROUPS, PROTECTION_GROUPS } from '@/features/organic-functional-matrix/constants'
import { GAS_MATRIX_ITEMS } from '@/features/gas-chain/data/gasMatrixItems'
import { FLASH_CARDS } from '@/features/flash-cards/constants'
import { collectStrings, findClaimViolations } from './helpers/chemistryClaimGuard'

/**
 * 现象/术语“错误表述”守卫（审查项 G9）。
 *
 * `GAOKAO_CHEMISTRY_RULES.md` 第三条禁止失真/超纲现象表述，但原审计只覆盖 `ION_DATA`
 * 一张表（`inorganicChemistryTruthAuditor.test.ts:86-97`），
 * 共存矩阵的文字不在范围内——C2 的“亚硝酸根溶液呈淡蓝色”正是这样漏网的。
 *
 * 本文件把守卫扩展到全部内容数据源（离子共存矩阵、官能团矩阵、气体链、易错卡），
 * 判定逻辑与错误映射表集中在 `helpers/chemistryClaimGuard.ts`。
 */
const SOURCES: Array<[string, unknown]> = [
  ['ION_DATA', ION_DATA],
  ['MAIN_GROUP_CONFLICTS', MAIN_GROUP_CONFLICTS],
  ['TRANSITION_METAL_CONFLICTS', TRANSITION_METAL_CONFLICTS],
  ['FUNCTIONAL_GROUPS', FUNCTIONAL_GROUPS],
  ['PROTECTION_GROUPS', PROTECTION_GROUPS],
  ['GAS_MATRIX_ITEMS', GAS_MATRIX_ITEMS],
  ['FLASH_CARDS', FLASH_CARDS],
]

describe('现象/术语错误表述守卫（全数据源）', () => {
  for (const [name, data] of SOURCES) {
    it(`${name} 的文本不得出现已登记的错误表述`, () => {
      const strings = collectStrings(data, name)

      // 反向保护：确保确实扫到了内容，避免字段改名后“空扫描假绿”
      expect(strings.length, `${name} 未采集到任何字符串`).toBeGreaterThan(5)

      const violations: string[] = []
      for (const { source, text } of strings) {
        for (const entry of findClaimViolations(text)) {
          violations.push(`${source}: “${text}” → ${entry.reason}`)
        }
      }

      expect(violations).toEqual([])
    })
  }

  it('守卫必须真的能拦住目标错误表述（自检）', () => {
    // 自检 1：错误表述应被命中
    expect(findClaimViolations('向 NaNO₂ 溶液中滴加稀盐酸，溶液呈淡蓝色，管口产生红棕色气体。').length).toBeGreaterThan(0)
    expect(findClaimViolations('末端炔生成黄色炔银沉淀').length).toBeGreaterThan(0)
    expect(findClaimViolations('乙炔可采用向上排空气法收集').length).toBeGreaterThan(0)

    // 自检 2：正确表述（含否定/澄清）不应被误伤
    expect(findClaimViolations('亚硝酸盐溶液无色，酸化后逸出无色 NO，管口遇空气变红棕色 NO₂。').length).toBe(0)
    expect(findClaimViolations('过氧化物效应只适用于 HBr，HCl 无此效应，产物仍为 2-氯丙烷。').length).toBe(0)
    expect(findClaimViolations('乙炔不能用向上排空气法收集，应采用排水集气法。').length).toBe(0)
  })
})
