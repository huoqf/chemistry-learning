import { describe, it, expect } from 'vitest'
import { gaokaoModels } from '../gaokaoModels'
import { getModelQuizData } from '../quiz'
import { CLAIM_GUARD_ENTRIES, findClaimViolations } from './helpers/chemistryClaimGuard'

/**
 * 高考题库“答案键”合理性校验（审查项 G2）。
 *
 * 原 `gaokaoQuizDataCoverage.test.ts` 只断言 `options.some(o => o.isCorrect) === true`——
 * 即“只要有一项被标为正确”即通过，“标的是不是真的对”无人校验，
 * 18 个题库、80+ 道变式题全部处于此状态（C3 的答案键错误即由此躲过）。
 *
 * 本文件补两层：
 *   ① 结构层：答案键必须唯一可判定（≥1 正确、且不能“全选都正确”）；
 *   ② 事实层：被标为**正确**的选项与标答，不得出现 helper 中登记的错误表述，
 *      即把“结论性语句 → 化学事实”的可审计映射落成可执行断言。
 */
describe('高考题库答案键合理性校验', () => {
  it('每道变式题为唯一单选题：恰好 1 项正确且解析首句选定字母与答案键一致', () => {
    const problems: string[] = []

    gaokaoModels.forEach(model => {
      const quiz = getModelQuizData(model.id)
      if (!quiz) return

      quiz.variantQuizzes.forEach(variant => {
        const correctOptions = variant.options.filter(o => o.isCorrect)
        const correctCount = correctOptions.length

        if (correctCount !== 1) {
          problems.push(
            `[${model.id}] ${variant.id}(${variant.title}) 正确选项数为 ${correctCount}（应严格唯一单选）`
          )
        } else {
          const correctLabel = correctOptions[0].label
          const headMatch = variant.detailedExplanation.match(/^\s*(?:答案|选|正确(?:选项)?为)[：:\s]*([A-D])(?![A-Za-z])/)
          if (headMatch && headMatch[1] !== correctLabel) {
            problems.push(
              `[${model.id}] ${variant.id} 解析首句声明选 ${headMatch[1]}，但 options 标定为 ${correctLabel}`
            )
          }
        }
      })
    })

    expect(problems).toEqual([])
  })

  it('选项标签唯一且文本非空（防止复制粘贴造成重复选项）', () => {
    const problems: string[] = []

    gaokaoModels.forEach(model => {
      const quiz = getModelQuizData(model.id)
      if (!quiz) return

      quiz.variantQuizzes.forEach(variant => {
        const labels = variant.options.map(o => o.label)
        if (new Set(labels).size !== labels.length) {
          problems.push(`[${model.id}] ${variant.id} 选项标签重复: ${labels.join(',')}`)
        }
        variant.options.forEach(opt => {
          if (!opt.text.trim()) {
            problems.push(`[${model.id}] ${variant.id} 选项 ${opt.label} 文本为空`)
          }
        })
      })
    })

    expect(problems).toEqual([])
  })

  it('被标为正确的选项与标答不得包含已登记的错误表述', () => {
    const violations: string[] = []

    gaokaoModels.forEach(model => {
      const quiz = getModelQuizData(model.id)
      if (!quiz) return

      // ① 正确选项与解析陈述
      quiz.variantQuizzes.forEach(variant => {
        variant.options
          .filter(o => o.isCorrect)
          .forEach(opt => {
            findClaimViolations(opt.text).forEach(v => {
              violations.push(
                `[${model.id}] ${variant.id} 正确选项 ${opt.label}: “${opt.text}” → ${v.reason}`
              )
            })
          })

        for (const [field, text] of [
          ['detailedExplanation', variant.detailedExplanation],
          ['modelAlignmentAnalysis', variant.modelAlignmentAnalysis],
        ] as const) {
          if (!text) continue
          findClaimViolations(text).forEach(v => {
            violations.push(`[${model.id}] ${variant.id}.${field}: “${text}” → ${v.reason}`)
          })
        }
      })

      // ② 踩分步骤的标答与解析
      quiz.scoringSteps.forEach(step => {
        const texts = [
          typeof step.correctAnswer === 'string' ? step.correctAnswer : step.correctAnswer.join(' '),
          step.explanation,
        ]
        texts.forEach(text => {
          findClaimViolations(text).forEach(v => {
            violations.push(`[${model.id}] scoringStep ${step.id}: “${text}” → ${v.reason}`)
          })
        })
      })
    })

    expect(violations).toEqual([])
  })

  it('错误表述守卫表必须条目清晰且复核期限格式合法', () => {
    const todayIso = new Date().toISOString().slice(0, 10)
    for (const entry of CLAIM_GUARD_ENTRIES) {
      expect(entry.all.length, '守卫条目至少要有一个匹配条件').toBeGreaterThan(0)
      expect(entry.reason.length, `守卫条目 ${entry.all[0]} 缺少化学事实说明`).toBeGreaterThan(10)
      expect(entry.targetDate, `守卫条目 ${entry.all[0]} 缺少到期日`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      if (entry.targetDate < todayIso) {
        console.warn(`⚠️  CLAIM_GUARD_ENTRIES 条目 ${entry.all[0]} 已过复核期限 (${entry.targetDate})，请抽空复核`)
      }
    }
  })

  it('严禁编造伪真题：题库不得保留虚假年份省份卷名、模考名或“真题精选/实验原图”署名', () => {
    const yearOrRegionPattern =
      /(?:19|20)\d{2}|全国|山东|广东|湖南|湖北|浙江|江苏|河北|北京|辽宁|河南|四川|安徽|福建|重庆|天津|陕西|山西|江西|广西|云南|贵州|甘肃|吉林|黑龙江|上海|海南|内蒙古|新疆|宁夏|青海|西藏|新课标|甲卷|乙卷|高考真题|新高考真题|真题精选|实验原图|一模|二模|三模|联考/
    const stemSourcePattern =
      /(?:(?:19|20)\d{2}\s*(?:年)?\s*(?:全国|新课标|甲卷|乙卷|高考|山东|广东|湖南|湖北|浙江|江苏|河北|北京|辽宁|河南|四川|安徽|福建|重庆|天津|陕西|山西|江西|广西|云南|贵州|甘肃|吉林|黑龙江|上海|海南|联考|一模|二模|三模)|高考真题|新高考真题|真题精选|实验原图)/
    const hits: string[] = []

    gaokaoModels.forEach((model) => {
      const quiz = getModelQuizData(model.id)
      if (!quiz) return

      quiz.variantQuizzes.forEach((variant) => {
        if (yearOrRegionPattern.test(variant.yearProvince)) {
          hits.push(`[${model.id}] ${variant.id} yearProvince 包含疑似伪真题署名: ${variant.yearProvince}`)
        }
        if (stemSourcePattern.test(variant.title)) {
          hits.push(`[${model.id}] ${variant.id} title 包含疑似伪真题来源: ${variant.title}`)
        }
        if (stemSourcePattern.test(variant.contextDescription || '')) {
          hits.push(`[${model.id}] ${variant.id} contextDescription 包含疑似伪真题来源`)
        }
        if (stemSourcePattern.test(variant.questionText || '')) {
          hits.push(`[${model.id}] ${variant.id} questionText 包含疑似伪真题来源`)
        }
      })
    })

    expect(hits).toEqual([])
  })
})
