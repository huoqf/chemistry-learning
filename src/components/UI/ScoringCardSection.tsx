import React, { useState } from 'react'
import { Award, HelpCircle, RefreshCw, PenTool } from 'lucide-react'
import { KatexFormula } from './KatexFormula'
import { KatexText } from './KatexText'
import type { ScoringStep } from '@/data/gaokaoQuizData'

const SUB_SUP_CHAR_MAP: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': '+',
  '⁻': '-',
}

function normalizeAnswer(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[₀-₉⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/g, (ch) => SUB_SUP_CHAR_MAP[ch] ?? ch)
    .replace(/，/g, ',')
    .replace(/；/g, ';')
    .replace(/：/g, ':')
    .replace(/、/g, ',')
    .replace(/[\s()[\]{}^\\]/g, '')
}

interface ScoringCardSectionProps {
  steps?: ScoringStep[]
  modelTitle?: string
}

export const ScoringCardSection: React.FC<ScoringCardSectionProps> = ({
  steps = [],
  modelTitle = '踩分点手算与规范答题卡片',
}) => {
  const [userInputs, setUserInputs] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({})

  const safeSteps = (steps || []).filter((s) => s && s.id)

  if (safeSteps.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200 my-2">
        暂无规范踩分步骤数据
      </div>
    )
  }

  const handleInputChange = (id: string, value: string) => {
    setUserInputs((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (step: ScoringStep) => {
    if (!(userInputs[step.id] || '').trim()) return
    setSubmitted((prev) => ({ ...prev, [step.id]: true }))
  }

  const handleReset = (id: string) => {
    setUserInputs((prev) => ({ ...prev, [id]: '' }))
    setSubmitted((prev) => ({ ...prev, [id]: false }))
    setShowExplanation((prev) => ({ ...prev, [id]: false }))
  }

  const checkIsCorrect = (step: ScoringStep) => {
    if (!step || !step.correctAnswer) return false
    const rawInput = (userInputs[step.id] || '').trim()
    if (!rawInput) return false
    const normInput = normalizeAnswer(rawInput)
    if (!normInput) return false

    try {
      const matchGroup = (group: string[]): boolean => {
        const norms = group.map((ans) => normalizeAnswer(String(ans))).filter((n) => n.length > 0)
        return norms.some((kw) => normInput.includes(kw))
      }

      if (step.type === 'keywords') {
        if (step.alternativeKeywordGroups && step.alternativeKeywordGroups.length > 0) {
          return step.alternativeKeywordGroups.some(
            (scheme) => scheme.length > 0 && scheme.every(matchGroup),
          )
        }
        if (step.requiredKeywordGroups && step.requiredKeywordGroups.length > 0) {
          return step.requiredKeywordGroups.every(matchGroup)
        }
      }

      if (Array.isArray(step.correctAnswer)) {
        const candidates = step.correctAnswer
          .map((ans) => ({ raw: ans, norm: normalizeAnswer(String(ans)) }))
          .filter((item) => item.norm.length > 0)
        if (candidates.length === 0) return false

        if (step.type === 'keywords') {
          // 归一化去重
          const deduped: string[] = []
          for (const item of candidates) {
            if (!deduped.includes(item.norm)) deduped.push(item.norm)
          }
          // 排除任何已包含更短候选词的复合超集，避免相同概念被重复计分
          const nonRedundant = deduped.filter(
            (item) => !deduped.some((other) => other !== item && other.length < item.length && item.includes(other)),
          )
          const targetKeywords = nonRedundant.length > 0 ? nonRedundant : deduped
          if (targetKeywords.length === 1) {
            return normInput.includes(targetKeywords[0])
          }
          const hitCount = targetKeywords.filter((kw) => normInput.includes(kw)).length
          const requiredCount = Math.ceil(targetKeywords.length * 0.6)
          return hitCount >= requiredCount
        }

        return candidates.some((item) => normInput === item.norm)
      }

      const expectedRaw = String(step.correctAnswer)
      const normExpected = normalizeAnswer(expectedRaw)
      if (!normExpected) return false
      if (normInput === normExpected) return true

      if (step.type === 'keywords') {
        const parts = expectedRaw
          .split(/[；;、\n]+/)
          .map((p) => normalizeAnswer(p))
          .filter((p) => p.length > 0)
        if (parts.length >= 2) {
          const hitCount = parts.filter((kw) => normInput.includes(kw)).length
          return hitCount >= Math.ceil(parts.length * 0.6)
        }
        return normInput.includes(normExpected)
      }

      return false
    } catch {
      return false
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 my-4">
      {/* 头部标题 */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">{modelTitle}</h4>
            <p className="text-[11px] text-slate-500">高考提分手算演练 · 答题规范扣分避坑</p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center gap-1">
          <Award className="w-3 h-3" /> 高考踩分点
        </span>
      </div>

      {/* 步骤卡片列表 */}
      <div className="space-y-4">
        {safeSteps.map((step) => {
          const isDone = submitted[step.id]
          const isCorrect = isDone ? checkIsCorrect(step) : false
          const showExp = showExplanation[step.id]

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-lg border transition-all ${
                isDone
                  ? isCorrect
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-rose-50/50 border-rose-200'
                  : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700">
                  <KatexText text={step.title} />
                </span>
                {isDone && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {isCorrect ? '✓ 匹配踩分点' : '✕ 未达精准词'}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                <KatexText text={step.questionText} />
              </p>

              {step.formulaLatex && (
                <div className="my-2 p-2 bg-slate-100/80 rounded border border-slate-200/60 text-slate-800 flex justify-center overflow-x-auto">
                  <KatexFormula formula={step.formulaLatex} />
                </div>
              )}

              {/* 交互输入区 */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={userInputs[step.id] || ''}
                  onChange={(e) => handleInputChange(step.id, e.target.value)}
                  placeholder={step.placeholder || '请输入代入数值或规范关键词...'}
                  disabled={isDone}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white disabled:bg-slate-100 disabled:text-slate-500"
                />
                {!isDone ? (
                  <button
                    onClick={() => handleSubmit(step)}
                    disabled={!(userInputs[step.id] || '').trim()}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-md transition-colors shadow-sm"
                  >
                    提交验证
                  </button>
                ) : (
                  <button
                    onClick={() => handleReset(step.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
                    title="重新做题"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 解析说明 */}
              {isDone && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span>
                      参考标准答案：
                      <strong className="text-indigo-600 font-mono ml-1">
                        {Array.isArray(step.correctAnswer)
                          ? step.correctAnswer.join(' / ')
                          : step.correctAnswer}
                      </strong>
                    </span>
                    <button
                      onClick={() =>
                        setShowExplanation((prev) => ({ ...prev, [step.id]: !prev[step.id] }))
                      }
                      className="text-[11px] text-indigo-600 hover:underline flex items-center gap-0.5 font-semibold"
                    >
                      <HelpCircle className="w-3 h-3" />
                      {showExp ? '收起踩分解析' : '查看踩分解析'}
                    </button>
                  </div>

                  {/* 踩分关键词 / 等价参考答案标签 */}
                  {Array.isArray(step.correctAnswer) && step.correctAnswer.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 my-1.5">
                      <span className="text-[10px] text-slate-400 font-bold self-center">
                        {step.type === 'keywords' ? '得分关键词:' : '等价参考答案:'}
                      </span>
                      {step.correctAnswer.map((kw, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300 shadow-2xs"
                        >
                          [{kw}]
                        </span>
                      ))}
                    </div>
                  )}

                  {showExp && (
                    <div className="p-2 bg-indigo-50/70 text-indigo-900 rounded border border-indigo-100 text-[11px] leading-relaxed mt-1">
                      <KatexText text={step.explanation} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
