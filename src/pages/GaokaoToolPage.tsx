import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  BookOpen,
  FlaskConical,
} from 'lucide-react'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getKnowledgeNode } from '@/data/knowledgeTree'
import {
  ValenceMatrixCanvas,
  ContrastCanvas,
  ElectrochemCellApparatus,
} from '@/components/Chemistry'
import { ReagentStepCanvas } from '@/components/Chemistry/ReagentStepCanvas'
import { FlashCardCanvas } from '@/components/Chemistry/FlashCardCanvas'
import { getModelQuizData } from '@/data/gaokaoQuizData'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'

export default function GaokaoToolPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const model = id ? getGaokaoModel(id) : undefined
  const quizData = id ? getModelQuizData(id) : null

  if (!model) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">未找到该高考提分工具</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg"
        >
          返回高考母题索引
        </button>
      </div>
    )
  }

  // 1. 如果是“专题一：无机元素价类二维矩阵探究工具”，直接渲染标准全屏 ThreePanel 架构
  if (model.id === 'model-valence-matrix') {
    return (
      <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden">
        {/* 顶部 Navigation */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              返回高考母题索引
            </button>
            <div className="h-4 w-px bg-slate-700 mx-1" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{model.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${model.badgeColor}`}>
                  {model.badgeText}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">{model.subtitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              标准三屏架构 (ThreePanel) · 亮色规范
            </span>
          </div>
        </div>

        {/* 完整 ThreePanel 三栏区域 */}
        <div className="flex-1 overflow-hidden">
          <ValenceMatrixCanvas defaultElementSymbol="Fe" />
        </div>
      </div>
    )
  }

  // 通用备用工具渲染
  const renderToolComponent = () => {
    switch (model.id) {
      case 'model-reagent-step':
        return <ReagentStepCanvas />

      case 'model-flash-cards':
        return <FlashCardCanvas />

      case 'model-electrochemical-twin':
        return (
          <ContrastCanvas
            titleLeft="原电池 (化学能 → 电能)"
            titleRight="电解池 (电能 → 化学能)"
            subtitleLeft="自发反应 ΔG < 0"
            subtitleRight="受迫反应 (外接电源)"
            badgeLeft="正极 (还原) / 负极 (氧化)"
            badgeRight="阳极 (氧化) / 阴极 (还原)"
            childrenLeft={
              <div className="w-full h-full flex flex-col items-center justify-center p-2 relative">
                <ElectrochemCellApparatus
                  x={0}
                  y={0}
                  fillColor="rgba(59, 130, 246, 0.15)"
                  cellType="galvanic"
                  leftElectrode="Zn"
                  rightElectrode="Cu"
                />
                <div className="text-[11px] font-bold text-slate-700 mt-2 bg-slate-50 px-2 py-1 rounded border">
                  电子流向：负极 (Zn) ➔ 外电路 ➔ 正极 (Cu)
                </div>
              </div>
            }
            childrenRight={
              <div className="w-full h-full flex flex-col items-center justify-center p-2 relative">
                <ElectrochemCellApparatus
                  x={0}
                  y={0}
                  fillColor="rgba(168, 85, 247, 0.15)"
                  cellType="electrolytic"
                  leftElectrode="Pt"
                  rightElectrode="C"
                />
                <div className="text-[11px] font-bold text-slate-700 mt-2 bg-slate-50 px-2 py-1 rounded border">
                  电子流向：电源负极 ➔ 阴极；阳极 ➔ 电源正极
                </div>
              </div>
            }
          />
        )

      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-200 p-8 gap-4">
            <FlaskConical className="w-12 h-12 text-indigo-500 animate-pulse" />
            <h3 className="font-bold text-slate-800 text-lg">{model.title} — 高考专属交互解题工具</h3>
            <p className="text-xs text-slate-600 max-w-md text-center leading-relaxed">
              {model.description}
            </p>
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-700">
              高考专属联动组件加载完毕，包含 {model.examPointSummary.length} 个核心破解要点
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* 顶部极简 Navigation */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            返回高考母题索引
          </button>
          <div className="h-4 w-px bg-slate-700 mx-1" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{model.title}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${model.badgeColor}`}>
                {model.badgeText}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">{model.subtitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            高考提分专属交互工具
          </span>
        </div>
      </div>

      {/* 主体交互工具内容与右侧考点侧栏 */}
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-y-auto">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="w-full min-h-[550px]">{renderToolComponent()}</div>

          {quizData && quizData.scoringSteps.length > 0 && (
            <ScoringCardSection steps={quizData.scoringSteps} />
          )}

          {quizData && quizData.variantQuizzes.length > 0 && (
            <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between h-fit sticky top-4">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              高考必考要点提炼
            </h4>
            <div className="flex flex-col gap-2.5 mb-6">
              {model.examPointSummary.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>

            <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5 pt-4 border-t border-slate-100">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              关联教材知识节点 ({model.relatedKnowledgeIds.length})
            </h4>
            <div className="flex flex-col gap-1.5">
              {model.relatedKnowledgeIds.map(kid => {
                const knode = getKnowledgeNode(kid)
                return (
                  <div
                    key={kid}
                    className="p-2 rounded bg-indigo-50/50 border border-indigo-100 text-xs flex items-center justify-between text-indigo-900"
                  >
                    <span className="font-medium">{knode ? knode.title : kid}</span>
                    <span className="text-[10px] text-indigo-600 font-mono">
                      {knode ? knode.module : '教材考点'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            高考化学交互提分系统 · 高频解题母题工具
          </div>
        </div>
      </div>
    </div>
  )
}
