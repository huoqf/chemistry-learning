import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { ChemistryPanel } from '@/components/UI'
import type { ReagentSceneConfig, ReagentStepPoint } from '../types'
import type { ChemistryQuantity } from '@/data/chemistryQuantities'
import { getKnowledgeNode } from '@/data/knowledgeTree'
import { getGaokaoModel } from '@/data/gaokaoModels'

export interface ReagentStepRightPanelProps {
  currentScene: ReagentSceneConfig
  stepIndex: number
  currentStep: ReagentStepPoint
  progress: number
  interpolatedPptLevel: number
}

export function ReagentStepRightPanel({
  currentScene,
  stepIndex,
  currentStep,
  progress,
  interpolatedPptLevel,
}: ReagentStepRightPanelProps) {
  const navigate = useNavigate()
  const model = getGaokaoModel('model-reagent-step')

  // 1. 化学量定义 (ChemistryPanel 消费)
  const quantities: ChemistryQuantity[] = useMemo(() => {
    return [
      {
        key: 'step',
        label: '当前反应阶段',
        value: stepIndex + 1,
        unit: '阶段',
        colorKey: 'hydroxide',
      },
      {
        key: 'ph',
        label: '环境估算 pH',
        value: parseFloat(currentStep.ph.toFixed(1)),
        unit: 'pH',
        colorKey: 'hydroxide',
      },
      {
        key: 'progress',
        label: '滴加总体积',
        value: parseFloat((progress * 10).toFixed(1)),
        unit: 'mL',
        colorKey: 'hydroxide',
      },
      {
        key: 'pptVal',
        label: '沉淀估算量',
        value: Math.round(interpolatedPptLevel * 200),
        unit: 'mmol',
        colorKey: 'hydroxide',
      },
    ]
  }, [currentStep, progress, stepIndex, interpolatedPptLevel])

  // 2. 阶段反应方程式 (ChemistryPanel 公式区消费)
  const formulas = useMemo(() => {
    return [
      {
        name: `${currentStep.title} · 方程式`,
        latex: currentStep.equation,
        note: currentStep.description,
        level: 'core' as const,
      },
    ]
  }, [currentStep])

  // 3. 高考要点区 (ChemistryPanel 考点区消费)
  const gaokaoPoints = useMemo(() => {
    return currentScene.examPoints.map((pt) => ({
      text: pt,
      importance: 'gaokao' as const,
    }))
  }, [currentScene])

  // 4. 易错警示区 (ChemistryPanel 警示区消费)
  const warnings = useMemo(() => {
    return [
      {
        text: currentScene.keyWarning,
        level: 'danger' as const,
      },
    ]
  }, [currentScene])

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* 上半部分：标准 ChemistryPanel 展现区 (拆解、公式、要点、警示) */}
      <div className="flex-1 min-h-0 overflow-y-auto border-b border-slate-200">
        <ChemistryPanel
          title={`${currentScene.title} · 高考规范拆解`}
          quantities={quantities}
          formulas={formulas}
          gaokaoPoints={gaokaoPoints}
          warnings={warnings}
        />
      </div>

      {/* 下半部分：关联教材知识节点区 */}
      {model && model.relatedKnowledgeIds.length > 0 && (
        <div className="p-3 shrink-0 bg-slate-50/80 border-t border-slate-100">
          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            关联教材知识节点 ({model.relatedKnowledgeIds.length})
          </h4>
          <div className="flex flex-col gap-1.5">
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
                  className="p-2 rounded-md bg-white hover:bg-indigo-50/80 border border-slate-200 text-xs flex items-center justify-between text-slate-800 transition-colors text-left group"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 group-hover:text-indigo-700">
                      {knode ? knode.title : kid}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {knode ? `${knode.chapter} · ${knode.module}` : '教材考点'}
                    </span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                    {animId ? '去学习' : '考点'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
