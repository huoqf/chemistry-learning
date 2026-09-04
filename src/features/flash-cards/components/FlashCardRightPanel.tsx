import type { FlashCard } from '../types'
import { FormulaSection, GaokaoSection, WarningSection } from '@/components/UI/ChemistryPanel'
import { BookOpen, ListChecks } from 'lucide-react'
import { getKnowledgeNode } from '@/data/knowledgeTree'
import { useNavigate } from 'react-router-dom'

interface FlashCardRightPanelProps {
  card: FlashCard
}

export function FlashCardRightPanel({ card }: FlashCardRightPanelProps) {
  const navigate = useNavigate()

  const warnings = [
    {
      text: card.warningTip,
      level: 'warning' as const,
    },
  ]

  const hasTemplateSteps = Boolean(card.templateSteps && card.templateSteps.length > 0)

  const formulas = (card.chemicalEquations || []).map((eq, idx) => {
    const match = eq.match(/^(.*?)(?:\s*\(([^)]+)\)\s*)?$/)
    const rawLatex = match ? match[1].trim() : eq
    const note = match && match[2] ? match[2].trim() : undefined
    return {
      name: `核心化学反应 ${idx + 1}`,
      latex: rawLatex,
      note,
      level: 'core' as const,
    }
  })

  const gaokaoPoints = [
    {
      text: card.examPoint,
      importance: 'gaokao' as const,
    },
  ]

  return (
    <div className="w-full max-w-full min-w-0 flex flex-col gap-3 p-4">
      {/* 避坑警告卡片 */}
      <div className="w-full min-w-0 max-w-full">
        <WarningSection warnings={warnings} />
      </div>

      {/* 高考实验规范答题流程模板 */}
      {hasTemplateSteps && (
        <div className="w-full min-w-0 max-w-full p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex flex-col gap-2.5 shadow-2xs">
          <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5 border-b border-amber-200/60 pb-1.5">
            <ListChecks className="w-4 h-4 text-amber-600 shrink-0" />
            <span>新高考规范答题标准流程 (踩分三步法)</span>
          </h4>
          <div className="flex flex-col gap-2 w-full min-w-0">
            {card.templateSteps!.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-2 p-2 rounded-lg bg-white/90 border border-amber-100 text-xs text-neutral-800 shadow-2xs"
              >
                <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px] mt-0.5">
                  {step.step}
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-bold text-amber-900 mb-0.5">{step.title}</span>
                  <span className="text-neutral-700 leading-relaxed text-[11px] break-words">{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 核心化学方程式卡片 */}
      {formulas.length > 0 && (
        <div className="w-full min-w-0 max-w-full">
          <FormulaSection formulas={formulas} />
        </div>
      )}

      {/* 高考考点提炼 */}
      <div className="w-full min-w-0 max-w-full">
        <GaokaoSection points={gaokaoPoints} />
      </div>

      {/* 关联教材知识点 */}
      <div className="w-full min-w-0 max-w-full p-3 bg-white rounded-xl border border-neutral-200 flex flex-col gap-2 shadow-2xs">
        <h4 className="font-bold text-neutral-800 text-xs flex items-center gap-1.5 border-b border-neutral-100 pb-1">
          <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>关联教材知识节点 ({card.relatedKnowledgeIds.length})</span>
        </h4>
        <div className="flex flex-col gap-1.5 w-full min-w-0">
          {card.relatedKnowledgeIds.map((kid) => {
            const knode = getKnowledgeNode(kid)
            const animId = knode?.animationIds?.[0]
            return (
              <button
                key={kid}
                onClick={() => {
                  if (animId) navigate(`/animation/${animId}`)
                  else navigate('/')
                }}
                className="w-full min-w-0 p-2.5 rounded-lg bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-100 text-xs flex items-center justify-between text-indigo-950 transition-colors text-left group"
              >
                <div className="flex flex-col min-w-0 flex-1 mr-2">
                  <span className="font-semibold group-hover:text-indigo-700 truncate">{knode ? knode.title : kid}</span>
                  <span className="text-[10px] text-indigo-500 font-mono truncate">
                    {knode ? `${knode.chapter} · ${knode.module}` : '教材考点'}
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-200/50 text-indigo-700 font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                  去学习
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
