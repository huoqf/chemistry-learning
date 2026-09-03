import { describe, it, expect } from 'vitest'
import {
  FUNCTIONAL_GROUPS,
  GAOKAO_CLUES,
  PROTECTION_GROUPS,
  POLYMERIZATION_MODELS,
  PRESET_MOLECULES,
} from '../constants'
import { useOrganicQuantitative } from '../hooks/useOrganicQuantitative'
import { renderHook } from '@testing-library/react'

/**
 * chemistryTruthAuditor.test.ts
 *
 * 高中化学真理性与高考命题级合规性自动化守门测试套件
 * 彻底杜绝“代码不报错但化学事实错误”、“必要条件当充分条件”、“酸碱共存违背”、“空间位阻失真”等问题。
 */
describe('高中化学真理性与高考命题合规性自动化守门审计', () => {
  describe('1. 溶液介质与酸碱共存铁律守门', () => {
    it('碱性反应条件方程式中绝对严禁出现游离强酸 (HCl / HBr / HI) 生成物', () => {
      // 遍历所有官能团典型方程式与保护基反应式
      for (const p of PROTECTION_GROUPS) {
        if (p.protectionReagent.includes('碱') || p.protectionReagent.includes('K₂CO₃')) {
          expect(
            p.protectionEquation,
            `保护基 [${p.id}] 在碱性体系下生成物严禁包含游离强酸 HBr/HCl/HI`
          ).not.toMatch(/\+\s*HBr|\+\s*HCl|\+\s*HI/)
        }
      }
    })

    it('醇羟基严禁与任何强碱 (NaOH) 或弱碱盐 (NaHCO₃/Na₂CO₃) 发生反应', () => {
      const alcohol = FUNCTIONAL_GROUPS.find((g) => g.id === 'alcohol-oh')
      expect(alcohol).toBeDefined()
      expect(alcohol?.consumptions.NaOH, '醇羟基消耗 NaOH 必须为 0').toBe(0)
      expect(alcohol?.consumptions.NaHCO3, '醇羟基消耗 NaHCO3 必须为 0').toBe(0)
      expect(alcohol?.consumptions.Na2CO3, '醇羟基消耗 Na2CO3 必须为 0').toBe(0)
    })

    it('酚羟基酸性弱于碳酸，与 Na₂CO₃ 反应生成 NaHCO₃ 且绝对不产生 CO₂ 气体', () => {
      const phenol = FUNCTIONAL_GROUPS.find((g) => g.id === 'phenol-oh')
      expect(phenol).toBeDefined()
      expect(phenol?.consumptions.Na2CO3, '1 mol 酚羟基消耗 1 mol Na2CO3 生成 NaHCO3').toBe(1)
      expect(phenol?.consumptions.NaHCO3, '酚羟基酸性弱于碳酸，不与 NaHCO3 反应').toBe(0)
      expect(phenol?.qualitativeFeatures?.gasOutput).toContain('不出气')
    })
  })

  describe('2. 高考定性实验排他性与充要性逻辑守门', () => {
    it('双缩脲反应必须显式声明需 ≥2 个肽键 (蛋白质/多肽)，明确排除简单二肽与单酰胺', () => {
      const peptide = FUNCTIONAL_GROUPS.find((g) => g.id === 'peptide-amide')
      expect(peptide).toBeDefined()
      expect(peptide?.testPhenomenon, '检验现象必须指明蛋白质/多肽或三肽以上').toMatch(
        /蛋白质|多肽|≥三肽/
      )
      expect(peptide?.notes, '注意事项必须明确提醒二肽或单酰胺不反应').toMatch(
        /二肽.*不反应|两.*肽键/
      )
      expect(peptide?.qualitativeFeatures?.silverOrFehling).toContain('≥2 个肽键')
    })

    it('推断不饱和键 (C=C / C≡C) 必须限定加成反应或 CCl₄ 体系，杜绝被醛氧化/酚取代混淆', () => {
      const alkeneClue = GAOKAO_CLUES.find((c) => c.matchedGroupId === 'alkene-c=c')
      expect(alkeneClue).toBeDefined()
      expect(
        alkeneClue?.clueText,
        '题眼必须限定加成反应、CCl4 溶液或无气体沉淀'
      ).toMatch(/加成|CCl₄|不产生沉淀/)
      expect(alkeneClue?.principle, '原理解析中必须阐明醛氧化与酚取代的干扰排他逻辑').toMatch(
        /醛基|酚/
      )
    })

    it('检验气泡题眼与 NaHCO₃ 必须严格唯一锁定羧基 (-COOH)', () => {
      const co2Clue = GAOKAO_CLUES.find((c) => c.id === 'clue-co2')
      expect(co2Clue).toBeDefined()
      expect(co2Clue?.matchedGroupId).toBe('carboxyl-cooh')
      expect(co2Clue?.deductionTarget).toContain('羧基')
      expect(co2Clue?.principle).toContain('强于 H₂CO₃')
    })

    it('氨基检验现象必须体现碱性强弱分化 (低级脂肪胺弱碱性 vs 芳香胺极弱碱性) 及成盐特性', () => {
      const amino = FUNCTIONAL_GROUPS.find((g) => g.id === 'amino-nh2')
      expect(amino).toBeDefined()
      expect(amino?.testPhenomenon).not.toContain('水溶液使湿润红色石蕊试纸变蓝')
      expect(amino?.testPhenomenon).toContain('成盐')
      expect(amino?.notes).toContain('苯胺')
    })

    it('硝基还原考点必须涵盖高中高频的 Fe/稀盐酸还原途径', () => {
      const nitro = FUNCTIONAL_GROUPS.find((g) => g.id === 'nitro-no2')
      expect(nitro).toBeDefined()
      expect(nitro?.notes).toMatch(/Fe|铁粉/)
    })
  })

  describe('3. 真实母题分子空间位阻与计算自洽守门', () => {
    it('水杨醛母题 Br₂ 消耗：预设模式下精准体现位阻校正为 3 mol，文字与数值 100% 自洽', () => {
      const salicyl = PRESET_MOLECULES.find((m) => m.id === 'salicylaldehyde')
      expect(salicyl).toBeDefined()
      expect(salicyl?.subtitle).toContain('耗 3 浓溴水')
      expect(salicyl?.breakdownSummary).toContain('消耗 3 mol 浓溴水')
      expect(salicyl?.examTraps).toContain('位阻')

      // 在预设模式下调用 hook
      const { result } = renderHook(() =>
        useOrganicQuantitative(salicyl!.counts, 'salicylaldehyde')
      )
      expect(result.current.Br2, '水杨醛真实 Br2 消耗应为 3 mol').toBe(3)
      expect(result.current.breakdowns.Br2.some((b) => b.reason.includes('水杨醛'))).toBe(true)
    })

    it('甲酸苯酯母题规范：官能团标准答案为酯基，兼具醛基还原性，水解耗 2 NaOH', () => {
      const formicPhenyl = PRESET_MOLECULES.find((m) => m.id === 'formic-phenyl-ester')
      expect(formicPhenyl).toBeDefined()
      expect(formicPhenyl?.examAnalysis).toContain('【酯基】')
      expect(formicPhenyl?.examTraps).toContain('酯基')

      const { result } = renderHook(() => useOrganicQuantitative(formicPhenyl!.counts))
      expect(result.current.NaOH).toBe(2)
      expect(result.current.precipitateAg).toBe(2)
    })

    it('阿司匹林母题表述科学性：绝无“水解消耗 Na”等语病', () => {
      const aspirin = PRESET_MOLECULES.find((m) => m.id === 'aspirin')
      expect(aspirin).toBeDefined()
      // 单个分句内绝不能同时出现“水解”与“消耗 Na”
      expect(aspirin?.breakdownSummary).not.toMatch(/水解[^；;。]*消耗[^；;。]*Na\b/)
      expect(aspirin?.breakdownSummary).toContain('水解消耗 3 mol NaOH')
      expect(aspirin?.breakdownSummary).toContain('未水解')

      const { result } = renderHook(() => useOrganicQuantitative(aspirin!.counts))
      expect(result.current.NaOH).toBe(3)
      expect(result.current.Na).toBe(1)
      expect(result.current.NaHCO3).toBe(1)
    })
  })

  describe('4. 高分子聚合反应脱水与端基守恒守门', () => {
    it('二元酸与二元醇 (PET) / 二元酸与二元胺 (尼龙66) 缩聚脱水量必须严格为 (2n - 1)', () => {
      const pet = POLYMERIZATION_MODELS.find((m) => m.id === 'poly-pet')
      const nylon = POLYMERIZATION_MODELS.find((m) => m.id === 'poly-nylon-66')
      expect(pet?.smallMoleculeOutput).toContain('(2n - 1)')
      expect(pet?.reactionEquation).toContain('(2n-1) H_2O')
      expect(nylon?.smallMoleculeOutput).toContain('(2n - 1)')
      expect(nylon?.reactionEquation).toContain('(2n-1) H_2O')
    })

    it('单一羟基酸自缩聚 (PLA) 脱水摩尔数必须严格为 (n - 1)', () => {
      const pla = POLYMERIZATION_MODELS.find((m) => m.id === 'poly-pla')
      expect(pla?.smallMoleculeOutput).toContain('(n - 1)')
      expect(pla?.reactionEquation).toContain('(n-1) H_2O')
    })
  })
})
