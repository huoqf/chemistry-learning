import { RefObject } from 'react'
import { AnimationSvgCanvas } from '@/components/Layout'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { FlashCardSvgScene } from './FlashCardSvgScene'
import type { FlashCard, FlashCardParams } from '../types'
import type { ModelQuizData } from '@/data/quiz'
import { Sparkles, HelpCircle, CheckCircle2, FileCheck } from 'lucide-react'

interface FlashCardCenterViewProps {
  containerRef: RefObject<HTMLDivElement | null>
  vp: any
  card: FlashCard
  params: FlashCardParams
  quizData?: ModelQuizData
  font?: (n: number) => number
  onSelectOption: (opt: 'A' | 'B') => void
  onToggleReveal: () => void
  onNextCard: () => void
}

export function FlashCardCenterView({
  containerRef,
  vp,
  card,
  params,
  quizData,
  font = (n: number) => n,
  onSelectOption,
  onToggleReveal,
  onNextCard,
}: FlashCardCenterViewProps) {
  return (
    <div ref={containerRef} className="w-full h-full flex flex-col p-4 overflow-y-auto">
      {/* 视角 0：盲盒问答与现象对比场景 */}
      {params.viewMode === 0 && (
        <div className="w-full flex-1 flex flex-col gap-4">
          {/* 盲盒问答卡片 */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {card.categoryLabel} · 高考事实盲盒对比卡
              </span>
              <button
                onClick={onToggleReveal}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline"
              >
                {params.isRevealed ? '折叠解析' : '揭晓盲盒真相'}
              </button>
            </div>

            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <h4 className="font-bold text-slate-800 text-sm leading-relaxed">{card.question}</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
              <button
                onClick={() => onSelectOption('A')}
                className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all ${
                  params.selectedOption === 'A'
                    ? card.correctOption === 'A'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                      : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="font-bold text-indigo-600 mr-1.5">选项 A:</span>
                {card.optionA}
              </button>
              <button
                onClick={() => onSelectOption('B')}
                className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all ${
                  params.selectedOption === 'B'
                    ? card.correctOption === 'B'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                      : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="font-bold text-indigo-600 mr-1.5">选项 B:</span>
                {card.optionB}
              </button>
            </div>

            {/* 揭晓卡片真相 */}
            {params.isRevealed && (
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-lg flex flex-col gap-2 mt-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    正确选项：【{card.correctOption}】 · 盲盒事实全面解析：
                  </span>
                  <button
                    onClick={onNextCard}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition-colors shadow-xs"
                  >
                    切换下一卡片 ➔
                  </button>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{card.explanation}</p>
              </div>
            )}
          </div>

          {/* 现象对比 SVG 场景画布 */}
          <div className="w-full flex-1 min-h-[320px] bg-slate-50 border border-slate-200 rounded-xl p-2 relative">
            <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
              <FlashCardSvgScene
                card={card}
                isHeating={params.isHeating}
                isCompressing={params.isCompressing}
                font={font}
              />
            </AnimationSvgCanvas>
          </div>
        </div>
      )}

      {/* 视角 1：规范踩分卡 */}
      {params.viewMode === 1 && quizData && (
        <div className="w-full flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              高考规范答题踩分点与盲盒高频事实大题手算
            </h3>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-medium border border-emerald-200">
              权威试题踩分规范
            </span>
          </div>
          <ScoringCardSection steps={quizData.scoringSteps} />
        </div>
      )}

      {/* 视角 2：高考真题变式 */}
      {params.viewMode === 2 && quizData && (
        <div className="w-full flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              高考真题变式选择题 & 详细解析 (近几年高考权威试题)
            </h3>
            <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md font-medium border border-amber-200">
              近几年高考易错真题复现
            </span>
          </div>
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        </div>
      )}
    </div>
  )
}
