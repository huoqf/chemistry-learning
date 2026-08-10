import React, { useState } from 'react'
import { Sparkles, Compass, CheckCircle, XCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import type { GaokaoVariantItem } from '@/data/gaokaoQuizData'
import { GaokaoDiagram } from '@/components/Chemistry'
import { KatexText } from './KatexText'

interface GaokaoVariantQuizProps {
  quizzes?: GaokaoVariantItem[]
}

/**
 * GaokaoVariantQuiz — 近 3 年高考真实情境变式盲盒组件
 *
 * 遵循项目统一 Light Theme 视觉规范。
 * 铁律：题目区纯净只包含真题原题与选项，绝对不泄漏解析与提示；
 * 只有在作答后或显式点击【查看解题解密与详细解析】时才展示解题解密区块。
 */
export const GaokaoVariantQuiz: React.FC<GaokaoVariantQuizProps> = ({ quizzes = [] }) => {
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>({})
  const [showAnalysis, setShowAnalysis] = useState<Record<string, boolean>>({})

  const safeQuizzes = (quizzes || []).filter(q => q && q.id)

  if (safeQuizzes.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200 my-2">
        暂无高考真题研析数据
      </div>
    )
  }

  const handleSelectOption = (quizId: string, label: string) => {
    if (selectedOption[quizId]) return
    setSelectedOption(prev => ({ ...prev, [quizId]: label }))
    setShowAnalysis(prev => ({ ...prev, [quizId]: true }))
  }

  const toggleAnalysis = (quizId: string) => {
    setShowAnalysis(prev => ({ ...prev, [quizId]: !prev[quizId] }))
  }

  return (
    <div className="bg-white text-slate-800 rounded-xl shadow-sm p-4 border border-slate-200 my-2">
      {/* 头部标题区 */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">近 3 年高考真实情境变式盲盒</h4>
            <p className="text-[11px] text-slate-500">母题模型迁移 · 新情境对齐与考场刷题探究</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full flex items-center gap-1">
          <Compass className="w-3 h-3 text-indigo-600" /> 真题对齐
        </span>
      </div>

      {/* 题目列表 */}
      <div className="space-y-4">
        {safeQuizzes.map(quiz => {
          const userChoice = selectedOption[quiz.id]
          const isAnalysisOpen = !!showAnalysis[quiz.id]
          const safeOptions = quiz.options || []
          const correctOpt = safeOptions.find(o => o.isCorrect)

          return (
            <div
              key={quiz.id}
              className="bg-slate-50/70 rounded-lg p-3.5 border border-slate-200/80 shadow-2xs"
            >
              {/* 年份标签与标题 */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0 mr-2">
                  {quiz.yearProvince || '高考真题'}
                </span>
                <span className="text-xs font-bold text-slate-800 flex-1 text-right leading-snug">
                  <KatexText text={quiz.title || ''} />
                </span>
              </div>

              {/* 试题背景与题目（纯净题干区） */}
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 mb-3 text-xs text-slate-700 leading-relaxed">
                {quiz.contextDescription && (
                  <p className="text-slate-600 mb-1.5 text-[11px] font-normal">
                    <KatexText text={quiz.contextDescription} />
                  </p>
                )}
                <p className="font-semibold text-slate-900 mb-2">
                  <KatexText text={quiz.questionText || ''} />
                </p>

                {/* 真题插图/矢量图表区域 (非价类推导矩阵图在题干展示) */}
                {quiz.diagramType && quiz.diagramType !== 'valence-matrix-chart' && (
                  <GaokaoDiagram
                    diagramType={quiz.diagramType}
                    config={quiz.diagramConfig}
                    isAnalysisMode={isAnalysisOpen}
                  />
                )}
              </div>

              {/* 选项按钮 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {safeOptions.map(opt => {
                  const isSelected = userChoice === opt.label
                  let optStyle =
                    'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50/60 hover:border-indigo-300'

                  if (userChoice) {
                    if (opt.isCorrect) {
                      optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold'
                    } else {
                      optStyle = 'bg-slate-100/50 border-slate-200 text-slate-400 opacity-70'
                    }
                  }

                  return (
                    <button
                      key={opt.label}
                      disabled={!!userChoice}
                      onClick={() => handleSelectOption(quiz.id, opt.label)}
                      className={`flex items-start gap-2 p-2 rounded-lg text-xs text-left border transition-all ${optStyle}`}
                    >
                      <span className="font-mono font-bold text-slate-800">{opt.label}.</span>
                      <span className="flex-1">
                        <KatexText text={opt.text || ''} />
                      </span>
                      {userChoice && opt.isCorrect && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {userChoice && isSelected && !opt.isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* 解题解密展开操作栏 */}
              <div className="mt-2 border-t border-slate-200 pt-2 text-xs">
                <button
                  onClick={() => toggleAnalysis(quiz.id)}
                  className="w-full flex items-center justify-between text-indigo-700 hover:text-indigo-900 text-[11px] font-bold py-1 px-2 bg-indigo-50/50 hover:bg-indigo-50 rounded border border-indigo-100 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    {isAnalysisOpen ? '收起解题解密与详细解析' : '查看解题解密与详细解析'}
                  </span>
                  {isAnalysisOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-indigo-600" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                </button>

                {/* 独立解题解密区（包含答案、母题拆解、二维价类解密图与详细解析） */}
                {isAnalysisOpen && (
                  <div className="mt-2 space-y-2">
                    {/* 正确答案提示 */}
                    {correctOpt && (
                      <div className="p-2 bg-emerald-50/90 border border-emerald-200 rounded-lg text-[11px] text-emerald-950 flex items-center justify-between font-bold">
                        <span>【正确答案】 {correctOpt.label}</span>
                        {userChoice && (
                          <span
                            className={
                              userChoice === correctOpt.label
                                ? 'text-emerald-700'
                                : 'text-rose-600 font-semibold'
                            }
                          >
                            您的选择: {userChoice} (
                            {userChoice === correctOpt.label ? '回答正确' : '回答错误'})
                          </span>
                        )}
                      </div>
                    )}

                    {/* 二维价类矩阵图等解题解密配图（仅在解析展开时呈现） */}
                    {quiz.diagramType === 'valence-matrix-chart' && (
                      <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                          <span>【解题解密矩阵图】元素价态-物质类别二维图像解密</span>
                        </div>
                        <GaokaoDiagram
                          diagramType={quiz.diagramType}
                          config={quiz.diagramConfig}
                          isAnalysisMode={true}
                        />
                      </div>
                    )}

                    {/* 母题模型剖析 */}
                    {quiz.modelAlignmentAnalysis && (
                      <div className="p-2.5 bg-amber-50/90 border border-amber-200 rounded-lg text-amber-950 text-[11px] leading-relaxed">
                        <span className="font-bold text-amber-900 block mb-0.5">
                          【母题模型对齐剖析】
                        </span>
                        <KatexText text={quiz.modelAlignmentAnalysis} />
                      </div>
                    )}

                    {/* 详细解析 */}
                    {quiz.detailedExplanation && (
                      <div className="p-2.5 bg-indigo-50/90 border border-indigo-200 rounded-lg text-[11px] text-indigo-950 leading-relaxed">
                        <span className="font-bold text-indigo-900 block mb-0.5">【详细解析】</span>
                        <KatexText text={quiz.detailedExplanation} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

