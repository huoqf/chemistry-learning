import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  FlaskConical,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader, LeftPanel, LeftPanelSection, ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getKnowledgeNode } from '@/data/knowledgeTree'
import { getModelQuizData } from '@/data/quiz'

export interface GaokaoToolPlaceholderCanvasProps {
  modelId: string
}

export const GaokaoToolPlaceholderCanvas: React.FC<GaokaoToolPlaceholderCanvasProps> = ({
  modelId,
}) => {
  const navigate = useNavigate()
  const model = getGaokaoModel(modelId)
  const quizData = getModelQuizData(modelId)

  // 0: 图谱探究 | 1: 规范踩分 | 2: 真题研析
  const [viewMode, setViewMode] = useState<number>(0)

  if (!model) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">未找到该高考提分工具</h2>
        <button
          onClick={() => navigate('/?view=gaokao')}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg"
        >
          返回高考母题索引
        </button>
      </div>
    )
  }

  // 左屏：考点与解题导读
  const leftContent = (
    <LeftPanel>
      <LeftPanelSection title="解题核心目标">
        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-relaxed font-sans">
          {model.description}
        </div>
      </LeftPanelSection>

      <LeftPanelSection title="母题考点纲要">
        <div className="flex flex-col gap-2">
          {model.examPointSummary.map((pt, idx) => (
            <div
              key={idx}
              className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start gap-2 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>{pt}</span>
            </div>
          ))}
        </div>
      </LeftPanelSection>
    </LeftPanel>
  )

  // 中屏视图切换
  const centerContent = (
    <div className="w-full h-full flex flex-col p-4 overflow-y-auto bg-slate-50 select-none">
      {viewMode === 0 && (
        <div className="w-full h-full min-h-[480px] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center relative overflow-hidden">
          {/* 背景装饰线 */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-transparent to-purple-50/30 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-lg">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-5 shadow-inner">
              <FlaskConical className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full mb-3 ${model.badgeColor}`}>
              {model.badgeText} · 高频母题
            </span>

            <h3 className="text-xl font-bold text-slate-800 mb-3">{model.title}</h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              {model.description}
            </p>

            <div className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-left flex flex-col gap-2">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                高级 3D / 交互动画解题引擎升级中
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                你可以通过顶栏导航切换至「规范踩分」与「真题研析」查看该母题的高考标准答题模板与压轴真题演练。
              </p>
            </div>
          </div>
        </div>
      )}

      {viewMode === 1 && (
        <div className="w-full max-w-4xl mx-auto py-2">
          {quizData && quizData.scoringSteps && quizData.scoringSteps.length > 0 ? (
            <ScoringCardSection steps={quizData.scoringSteps} />
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              暂无规范踩分数据
            </div>
          )}
        </div>
      )}

      {viewMode === 2 && (
        <div className="w-full max-w-4xl mx-auto py-2">
          {quizData && quizData.variantQuizzes && quizData.variantQuizzes.length > 0 ? (
            <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              暂无真题研析试题
            </div>
          )}
        </div>
      )}
    </div>
  )

  // 右屏：必考点与关联教材节点
  const rightContent = (
    <div className="w-full h-full p-4 bg-white overflow-y-auto flex flex-col justify-between font-sans">
      <div>
        <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          高考必考要点提炼
        </h4>

        <div className="flex flex-col gap-2 mb-6">
          {model.examPointSummary.map((pt, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{pt}</span>
            </div>
          ))}
        </div>

        <h4 className="font-bold text-slate-800 text-xs mb-2.5 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          关联教材知识节点 ({model.relatedKnowledgeIds.length})
        </h4>

        <div className="flex flex-col gap-2">
          {model.relatedKnowledgeIds.map((kid) => {
            const knode = getKnowledgeNode(kid)
            const animId = knode?.animationIds?.[0]
            return (
              <button
                key={kid}
                onClick={() => {
                  if (animId) {
                    navigate(`/animation/${animId}`)
                  } else {
                    navigate('/')
                  }
                }}
                className="p-2.5 rounded-lg bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-100 text-xs flex items-center justify-between text-indigo-950 transition-colors text-left group"
              >
                <div className="flex flex-col">
                  <span className="font-semibold group-hover:text-indigo-700">
                    {knode ? knode.title : kid}
                  </span>
                  <span className="text-[10px] text-indigo-500 font-mono">
                    {knode ? `${knode.chapter} · ${knode.module}` : '教材考点'}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
        高考化学交互提分系统 · 高频解题母题工具
      </div>
    </div>
  )

  return (
    <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      {/* 统一 Header */}
      <GaokaoToolHeader
        model={model}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 主体 ThreePanel 三栏区域 */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel left={leftContent} center={centerContent} right={rightContent} />
      </div>
    </div>
  )
}
