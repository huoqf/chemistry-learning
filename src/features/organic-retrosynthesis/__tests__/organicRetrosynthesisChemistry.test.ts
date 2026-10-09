import { describe, it, expect } from 'vitest'
import {
  MODEL_ASPIRIN_BENORILATE,
  MODEL_DIELS_ALDER_ACETAL,
  MODEL_DOUBLE_BOND_PROTECTION,
} from '../data/protectionStrategyModels'
import { GAOKAO_PROTECTION_CHEAT_SHEET } from '../data/retrosynthesisCheatSheet'
import { PROTECTION_GROUPS } from '@/features/organic-functional-matrix/constants'
import { modelOrganicRetrosynthesis } from '@/data/quiz/model-organic-retrosynthesis'
import type { RetrosynthesisModelData } from '../types'

/**
 * 母题十：有机逆合成切断与官能团保护 —— 守门测试
 *
 * 覆盖要点（对应复审报告 P1-M7 / P1-M8 / P1-M10 / P1-N2）：
 *   1. 官能团保护矩阵每一项都必须带【层级】标注，且保护策略本身归【教材主线】、
 *      具体试剂条件归【信息题素材】（规范 §一.2）；
 *   2. 双键保护模型的三处口径必须一致：实操一律用无水 K₂CO₃ 弱碱，
 *      不得出现"加入强碱与 CH₃I"这类自相矛盾的实操描述；
 *   3. 缩硫醛信息题素材的层级标注回归守卫；
 *   4. 各逆合成模型的结构完整性（steps / infoReaction / 保护状态标记）。
 */

const MODELS: RetrosynthesisModelData[] = [
  MODEL_ASPIRIN_BENORILATE,
  MODEL_DIELS_ALDER_ACETAL,
  MODEL_DOUBLE_BOND_PROTECTION,
]

describe('母题十 有机逆合成与官能团保护 化学正确性守门', () => {
  it('1. 官能团保护矩阵每一项都带【层级】标注（防止再有条目漏标）', () => {
    expect(PROTECTION_GROUPS.length).toBeGreaterThanOrEqual(4)
    for (const group of PROTECTION_GROUPS) {
      expect(group.examSignificance, `${group.name} 缺少【层级】标注`).toContain('【层级】')
    }
  })

  it('2. 保护"策略"统一归【教材主线】；含教材未要求试剂的条目须另标【信息题素材】', () => {
    for (const group of PROTECTION_GROUPS) {
      expect(group.examSignificance, `${group.name} 未标明保护策略属教材主线`).toContain('【教材主线】')
    }
    // 涉及格氏/LiAlH₄/Pd-C 等教材未要求试剂的条目，必须同时把"试剂层"标为信息题素材
    const OUT_OF_TEXTBOOK = ['格氏', 'LiAlH₄', 'Pd']
    for (const group of PROTECTION_GROUPS) {
      const haystack = `${group.examSignificance} ${group.protectionReagent} ${group.deprotectionCondition}`
      if (OUT_OF_TEXTBOOK.some((k) => haystack.includes(k))) {
        expect(group.examSignificance, `${group.name} 含教材未要求的试剂但未标【信息题素材】`).toContain('【信息题素材】')
      }
    }
  })

  it('3. 双键保护模型：实操成醚必须用无水 K₂CO₃ 弱碱，不得写成"加入强碱与 CH₃I"', () => {
    const model = MODEL_DOUBLE_BOND_PROTECTION
    const step2 = model.steps.find((s) => s.title.includes('弱碱') || s.title.includes('甲基化'))
    expect(step2).toBeDefined()
    expect(step2!.description).toContain('K₂CO₃')
    expect(step2!.description).toContain('弱碱')

    // 全文不得出现"强碱与 CH₃I"式自相矛盾的实操描述
    const crash = model.unprotectedCrashDemo
    const allText = [
      model.description,
      model.coreStrategy,
      crash?.consequence ?? '',
      crash?.solution ?? '',
      ...model.steps.map((s) => s.description),
      ...model.steps.map((s) => s.protectionStatus?.reason ?? ''),
    ].join('\n')
    expect(allText).not.toMatch(/强碱[^。；]{0,12}CH₃I/)
    // 反向保护：必须明确说明"为何不用强碱"（避免邻二溴代烷消去）
    expect(allText).toContain('消去')
  })

  it('4. 缩硫醛（母题十 var-retro-4）层级标注回归守卫：保持【信息题素材】', () => {
    const allText = JSON.stringify(modelOrganicRetrosynthesis)
    expect(allText).toContain('【信息题素材】')
    // 不得退回历史写法（机器门禁 check-syllabus-tier.mjs 同口径）
    expect(allText).not.toContain('【信息题拓展】')
    expect(allText).not.toContain('【新高考信息给予拓展】')
    expect(allText).not.toContain('【信息题给予】')
  })

  it('5. 各逆合成模型结构完整（steps 非空、含保护状态标记与脱保护信息反应）', () => {
    for (const model of MODELS) {
      expect(model.steps.length, `${model.id} 无步骤`).toBeGreaterThan(0)
      expect(model.coreStrategy.length, `${model.id} 缺少核心策略`).toBeGreaterThan(10)
      expect(model.unprotectedCrashDemo?.consequence.length ?? 0).toBeGreaterThan(10)
      expect(model.infoReaction?.name.length ?? 0).toBeGreaterThan(0)
    }
  })

  it('6. 保护策略速查表：每项都给出结构化层级归属（syllabusTier）与耐受性描述', () => {
    expect(GAOKAO_PROTECTION_CHEAT_SHEET.length).toBeGreaterThan(0)
    const LEGAL_TIERS = new Set(['textbook', 'info-item', 'beyond'])
    for (const item of GAOKAO_PROTECTION_CHEAT_SHEET) {
      expect(item.tolerance.length, `${item.targetGroup} 缺少耐受性描述`).toBeGreaterThan(0)
      expect(LEGAL_TIERS.has(item.syllabusTier), `${item.targetGroup} 层级取值非法: ${item.syllabusTier}`).toBe(true)
    }
  })
})
