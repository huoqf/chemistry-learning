import { describe, it, expect } from 'vitest'
import { ION_DATA } from '@/features/inorganic-ion-matrix/constants'
import { MAIN_GROUP_CONFLICTS } from '@/features/inorganic-ion-matrix/data/conflicts/mainGroupConflicts'
import { TRANSITION_METAL_CONFLICTS } from '@/features/inorganic-ion-matrix/data/conflicts/transitionMetalConflicts'
import {
  FUNCTIONAL_GROUPS,
  PROTECTION_GROUPS,
} from '@/features/organic-functional-matrix/constants'
import { GAS_MATRIX_ITEMS } from '@/features/gas-chain/data/gasMatrixItems'
import { FLASH_CARDS } from '@/features/flash-cards/constants'
import { modelQuizMap } from '@/data/quiz'
import { collectEquations, scanEquations } from './helpers/equationBalance'
import { isBalanceWhitelisted } from './helpers/balanceWhitelist'

/**
 * 方程式原子/电荷守恒扫描（全数据源覆盖）。
 *
 * 审查项 G7：原 `equationsBalanceScan.test.ts` 只遍历 `VALENCE_MATRIX_DATA` 一个数据源，
 * 而下列位置的方程式完全未被守恒校验：
 *   - 离子共存矩阵的 `equation`（主族 / 过渡金属冲突表）
 *   - 官能团矩阵的 `testEquation` / 保护基的 `protectionEquation` / `deprotectionEquation`
 *   - 气体链的 `reactionFormula` / `secondaryFormula` / `tailGasReagent`
 *   - 易错辨析卡的 `chemicalEquations`
 *   - 18 个高考题库的 `formulaLatex`
 *
 * 本文件把共享扫描器接入上述全部数据源。豁免一律走
 * `helpers/balanceWhitelist.ts` 的显式名单（带 reason + targetDate）。
 */

/** 允许作为“候选方程式”的字段名（白名单式收集，避免误扫叙述字段） */
const EQUATION_FIELDS = new Set([
  'equation',
  'testEquation',
  'protectionEquation',
  'deprotectionEquation',
  'reactionFormula',
  'secondaryFormula',
  'tailGasReagent',
  'formulaLatex',
  'chemicalEquations',
])

const SOURCES: Array<[string, unknown]> = [
  ['ION_DATA', ION_DATA],
  ['MAIN_GROUP_CONFLICTS', MAIN_GROUP_CONFLICTS],
  ['TRANSITION_METAL_CONFLICTS', TRANSITION_METAL_CONFLICTS],
  ['FUNCTIONAL_GROUPS', FUNCTIONAL_GROUPS],
  ['PROTECTION_GROUPS', PROTECTION_GROUPS],
  ['GAS_MATRIX_ITEMS', GAS_MATRIX_ITEMS],
  ['FLASH_CARDS', FLASH_CARDS],
  ['modelQuizMap', modelQuizMap],
]

describe('方程式守恒扫描：全数据源覆盖', () => {
  for (const [name, data] of SOURCES) {
    it(`${name} 中的方程式必须满足原子与电荷守恒`, () => {
      const entries = collectEquations(data, name, EQUATION_FIELDS)
      const issues = scanEquations(entries, isBalanceWhitelisted)

      expect(
        issues.map(i => `${i.source}: "${i.equation}" -> ${i.detail}`),
        `${name} 存在不守恒或需核实配平的方程式`
      ).toEqual([])
    })
  }

  it('扫描器确实覆盖到了候选方程式（防止字段名改动导致“空扫描假绿”）', () => {
    // 若未来字段改名，collectEquations 会收集到 0 条而不报错——用下界断言兜住这种静默失效
    const total = SOURCES.reduce((sum, [, data]) => sum + collectEquations(data, '', EQUATION_FIELDS).length, 0)
    expect(total, '候选方程式总量过低，疑似字段白名单失效').toBeGreaterThan(200)
  })
})
