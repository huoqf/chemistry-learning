import type { FlashCard } from '../types'
import { FormulaSection, GaokaoSection, WarningSection } from '@/components/UI/ChemistryPanel'
import { BookOpen } from 'lucide-react'
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

  const formulas = (card.chemicalEquations || []).map((eq, idx) => ({
    name: `核心反应 ${idx + 1}`,
    latex: eq,
    level: 'core' as const,
  }))

  const gaokaoPoints = [
    {
      text: card.examPoint,
      importance: 'gaokao' as const,
    },
  ]

  return (
    <div className="flex flex-col gap-3 p-4 min-h-full overflow-y-auto">
      {/* 避坑警告卡片 */}
      <WarningSection warnings={warnings} />

      {/* 核心化学方程式卡片 */}
      {formulas.length > 0 && <FormulaSection formulas={formulas} />}

      {/* 高考考点提炼 */}
      <GaokaoSection points={gaokaoPoints} />

      {/* 关联教材知识点 */}
      <div className="p-3 bg-white rounded-xl border border-neutral-200 flex flex-col gap-2 shadow-2xs">
        <h4 className="font-bold text-neutral-800 text-xs flex items-center gap-1.5 border-b border-neutral-100 pb-1">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          关联教材知识节点 ({card.relatedKnowledgeIds.length})
        </h4>
        <div className="flex flex-col gap-1.5">
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
                className="p-2.5 rounded-lg bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-100 text-xs flex items-center justify-between text-indigo-950 transition-colors text-left group"
              >
                <div className="flex flex-col">
                  <span className="font-semibold group-hover:text-indigo-700">{knode ? knode.title : kid}</span>
                  <span className="text-[10px] text-indigo-500 font-mono">
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
