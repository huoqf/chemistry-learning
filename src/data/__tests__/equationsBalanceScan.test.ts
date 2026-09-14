import { describe, it, expect } from 'vitest'
import { VALENCE_MATRIX_DATA } from '../valence-matrix'
import { scanEquations, type EquationEntry } from './helpers/equationBalance'
import { BALANCE_WHITELIST, expiredWhitelistEntries, isBalanceWhitelisted } from './helpers/balanceWhitelist'

/**
 * 价类二维图（40 个元素）的方程式原子/电荷守恒扫描。
 *
 * 说明（审查项 G7）：原实现把“化学式解析器”内联在本文件里，导致新数据源
 * 无法复用。现已抽取为 `./helpers/equationBalance.ts`，本文件改为调用共享扫描器；
 * 原实现内置的 `if (eq.includes('品红') || ...)` 静默跳过清单，
 * 已迁移为 `./helpers/balanceWhitelist.ts` 中带 reason / targetDate 的显式豁免。
 */
describe('方程式配平与化学守恒扫描', () => {
  it('扫描所有 40 个元素的全部方程式并验证原子与电荷守恒', () => {
    const entries: EquationEntry[] = []

    Object.values(VALENCE_MATRIX_DATA).forEach(elem => {
      elem.items.forEach(item => {
        if (item.equation) {
          entries.push({ source: `[${elem.symbol}] item: ${item.substance}`, equation: item.equation })
        }
      })
      elem.transformations.forEach(trans => {
        if (trans.equation) {
          entries.push({
            source: `[${elem.symbol}] trans: ${trans.id} (${trans.fromSubstance}->${trans.toSubstance})`,
            equation: trans.equation,
          })
        }
      })
    })

    const issues = scanEquations(entries, isBalanceWhitelisted)

    if (issues.length > 0) {
      console.error(`发现 ${issues.length} 条待核实配平/解析项:`)
      issues.forEach(iss => console.error(`  ⚠️ ${iss.source}: "${iss.equation}" -> ${iss.detail}`))
    }

    // 真正断言守恒
    expect(issues.map(i => `${i.source}: "${i.equation}" -> ${i.detail}`)).toEqual([])
  })

  it('守恒扫描的豁免名单必须显式且未过期', () => {
    // 反向保护：豁免名单一旦出现“已过复核期”的条目，说明需要重新确认而非继续静默放行
    const expired = expiredWhitelistEntries()
    expect(
      expired.map(e => e.pattern.source),
      '存在已过复核期限的豁免条目，请重新确认或移除'
    ).toEqual([])

    // 每条豁免都必须写清理由与到期日
    for (const entry of BALANCE_WHITELIST) {
      expect(entry.reason.length, `豁免 ${entry.pattern} 缺少理由`).toBeGreaterThan(8)
      expect(entry.targetDate, `豁免 ${entry.pattern} 缺少到期日`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})
