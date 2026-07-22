import React, { useState } from 'react'
import { Sparkles, Compass, CheckCircle, XCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import type { GaokaoVariantItem } from '@/data/gaokaoQuizData'

interface GaokaoVariantQuizProps {
  quizzes: GaokaoVariantItem[]
}

export const GaokaoVariantQuiz: React.FC<GaokaoVariantQuizProps> = ({ quizzes }) => {
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>({})
  const [showAnalysis, setShowAnalysis] = useState<Record<string, boolean>>({})
  const [showDetail, setShowDetail] = useState<Record<string, boolean>>({})

  const handleSelectOption = (quizId: string, label: string) => {
    if (selectedOption[quizId]) return // 已经选过
    setSelectedOption(prev => ({ ...prev, [quizId]: label }))
    setShowDetail(prev => ({ ...prev, [quizId]: true }))
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl shadow-md p-4 my-4 border border-indigo-800/40">
      {/* 头部标题区 */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-800/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">近 3 年高考真实情境变式盲盒</h4>
            <p className="text-[11px] text-slate-400">母题模型迁移 · 新情境对齐与考场刷题探究</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full flex items-center gap-1">
          <Compass className="w-3 h-3" /> 真题对齐
        </span>
      </div>

      {/* 题目列表 */}
      <div className="space-y-4">
        {quizzes.map(quiz => {
          const userChoice = selectedOption[quiz.id]
          const isAnalysisOpen = showAnalysis[quiz.id]
          const isDetailOpen = showDetail[quiz.id]

          return (
            <div
              key={quiz.id}
              className="bg-slate-800/80 rounded-lg p-3.5 border border-indigo-900/60 shadow-inner"
            >
              {/* 年份标签与标题 */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-900/80 text-indigo-300 border border-indigo-700/50">
                  {quiz.yearProvince}
                </span>
                <span className="text-xs font-medium text-slate-200">{quiz.title}</span>
              </div>

              {/* 试题背景与题目 */}
              <div className="p-2.5 bg-slate-900/60 rounded border border-slate-700/50 mb-3 text-xs text-slate-300 leading-relaxed">
                <p className="text-slate-400 mb-1">【新情境描述】{quiz.contextDescription}</p>
                <p className="font-semibold text-slate-100">{quiz.questionText}</p>
              </div>

              {/* 选项按钮 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {quiz.options.map(opt => {
                  const isSelected = userChoice === opt.label
                  let optStyle =
                    'bg-slate-900/70 border-slate-700/60 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500'

                  if (userChoice) {
                    if (opt.isCorrect) {
                      optStyle = 'bg-emerald-900/40 border-emerald-500/80 text-emerald-200 font-semibold'
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = 'bg-rose-900/40 border-rose-500/80 text-rose-200'
                    } else {
                      optStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60'
                    }
                  }

                  return (
                    <button
                      key={opt.label}
                      disabled={!!userChoice}
                      onClick={() => handleSelectOption(quiz.id, opt.label)}
                      className={`flex items-start gap-2 p-2 rounded text-xs text-left border transition-all ${optStyle}`}
                    >
                      <span className="font-mono font-bold">{opt.label}.</span>
                      <span className="flex-1">{opt.text}</span>
                      {userChoice && opt.isCorrect && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {userChoice && isSelected && !opt.isCorrect && (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* 母题模型对齐折叠卡 */}
              <div className="mt-2 border-t border-slate-700/60 pt-2 text-xs">
                <button
                  onClick={() =>
                    setShowAnalysis(prev => ({ ...prev, [quiz.id]: !prev[quiz.id] }))
                  }
                  className="w-full flex items-center justify-between text-amber-400 hover:text-amber-300 text-[11px] font-medium py-1"
                >
                  <span className="flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    {isAnalysisOpen ? '隐藏母题模型拆解' : '查看母题模型对齐剖析（盲盒解密）'}
                  </span>
                  {isAnalysisOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {isAnalysisOpen && (
                  <div className="p-2.5 mt-1 bg-amber-950/40 border border-amber-800/40 rounded text-amber-200/90 text-[11px] leading-relaxed">
                    {quiz.modelAlignmentAnalysis}
                  </div>
                )}
              </div>

              {/* 答案与详解 */}
              {userChoice && isDetailOpen && (
                <div className="mt-2 p-2.5 bg-indigo-950/60 border border-indigo-800/60 rounded text-[11px] text-slate-300 leading-relaxed">
                  <span className="font-bold text-indigo-300">【详解分析】</span>
                  {quiz.detailedExplanation}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
