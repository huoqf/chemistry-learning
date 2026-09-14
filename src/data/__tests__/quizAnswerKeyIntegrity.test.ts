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
  it('每道变式题的答案键必须可判定：至少 1 项正确，且不允许“全部选项都正确”', () => {
    const problems: string[] = []

    gaokaoModels.forEach(model => {
      const quiz = getModelQuizData(model.id)
      if (!quiz) return

      quiz.variantQuizzes.forEach(variant => {
        const correctCount = variant.options.filter(o => o.isCorrect).length

        if (correctCount === 0) {
          problems.push(`[${model.id}] ${variant.id}(${variant.title}) 没有任何正确选项`)
        }
        if (correctCount === variant.options.length) {
          problems.push(
            `[${model.id}] ${variant.id}(${variant.title}) 全部 ${correctCount} 个选项都被标为正确——答案键失去区分度`
          )
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

      // ① 正确选项
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

  it('错误表述守卫表必须条目清晰且未过期', () => {
    for (const entry of CLAIM_GUARD_ENTRIES) {
      expect(entry.all.length, '守卫条目至少要有一个匹配条件').toBeGreaterThan(0)
      expect(entry.reason.length, `守卫条目 ${entry.all[0]} 缺少化学事实说明`).toBeGreaterThan(10)
      expect(entry.targetDate, `守卫条目 ${entry.all[0]} 缺少到期日`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(
        new Date(`${entry.targetDate}T00:00:00Z`).getTime(),
        `守卫条目 ${entry.all[0]} 已过复核期限，请重新确认`
      ).toBeGreaterThan(Date.now())
    }
  })
})
