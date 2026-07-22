import React, { useState } from 'react'
import { Award, HelpCircle, RefreshCw, PenTool } from 'lucide-react'
import { KatexFormula } from './KatexFormula'
import type { ScoringStep } from '@/data/gaokaoQuizData'

interface ScoringCardSectionProps {
  steps: ScoringStep[]
  modelTitle?: string
}

export const ScoringCardSection: React.FC<ScoringCardSectionProps> = ({
  steps,
  modelTitle = '踩分点手算与规范答题卡片',
}) => {
  const [userInputs, setUserInputs] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({})

  const handleInputChange = (id: string, value: string) => {
    setUserInputs(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (step: ScoringStep) => {
    setSubmitted(prev => ({ ...prev, [step.id]: true }))
  }

  const handleReset = (id: string) => {
    setUserInputs(prev => ({ ...prev, [id]: '' }))
    setSubmitted(prev => ({ ...prev, [id]: false }))
    setShowExplanation(prev => ({ ...prev, [id]: false }))
  }

  const checkIsCorrect = (step: ScoringStep) => {
    const input = (userInputs[step.id] || '').trim().toLowerCase()
    if (!input) return false

    if (Array.isArray(step.correctAnswer)) {
      return step.correctAnswer.some(ans => input.includes(ans.toLowerCase()))
    }
    return input === step.correctAnswer.toLowerCase()
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
        {steps.map(step => {
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
                <span className="text-xs font-bold text-slate-700">{step.title}</span>
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

              <p className="text-xs text-slate-600 mb-2 leading-relaxed">{step.questionText}</p>

              {step.formulaLatex && (
                <div className="my-2 p-2 bg-slate-100/80 rounded border border-slate-200/60 text-slate-800 flex justify-center">
                  <KatexFormula formula={step.formulaLatex} />
                </div>
              )}

              {/* 交互输入区 */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={userInputs[step.id] || ''}
                  onChange={e => handleInputChange(step.id, e.target.value)}
                  placeholder={step.placeholder || '请输入代入数值或规范关键词...'}
                  disabled={isDone}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white disabled:bg-slate-100 disabled:text-slate-500"
                />
                {!isDone ? (
                  <button
                    onClick={() => handleSubmit(step)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-md transition-colors shadow-sm"
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
                        setShowExplanation(prev => ({ ...prev, [step.id]: !prev[step.id] }))
                      }
                      className="text-[11px] text-indigo-600 hover:underline flex items-center gap-0.5"
                    >
                      <HelpCircle className="w-3 h-3" />
                      {showExp ? '收起踩分解析' : '查看踩分解析'}
                    </button>
                  </div>
                  {showExp && (
                    <div className="p-2 bg-indigo-50/70 text-indigo-900 rounded border border-indigo-100 text-[11px] leading-relaxed mt-1">
                      {step.explanation}
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
