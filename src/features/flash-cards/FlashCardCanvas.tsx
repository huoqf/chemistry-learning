import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { ThreePanel } from '@/components/Layout'
import { useAnimationViewport } from '@/hooks/useAnimationViewport'
import { CANVAS_PRESETS } from '@/theme'
import { getGaokaoModel } from '@/data/gaokaoModels'
import { getModelQuizData } from '@/data/quiz'
import { useFlashCardChemistry } from './hooks/useFlashCardChemistry'
import { FlashCardLeftPanel } from './components/FlashCardLeftPanel'
import { FlashCardCenterView } from './components/FlashCardCenterView'
import { FlashCardRightPanel } from './components/FlashCardRightPanel'

export function FlashCardCanvas() {
  const navigate = useNavigate()
  const model = getGaokaoModel('model-flash-cards')
  const quizData = getModelQuizData('model-flash-cards')

  const {
    params,
    currentCard,
    totalCards,
    currentIndex,
    updateParam,
    changeCategory,
    nextCard,
    prevCard,
    randomCard,
    selectOption,
    toggleReveal,
    toggleHeating,
    toggleCompressing,
  } = useFlashCardChemistry()

  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,
  })

  const font = canvasSize?.font || ((n: number) => n)

  const leftContent = (
    <FlashCardLeftPanel
      viewMode={params.viewMode}
      category={params.category}
      currentIndex={currentIndex}
      totalCards={totalCards}
      isRevealed={params.isRevealed}
      isHeating={params.isHeating}
      isCompressing={params.isCompressing}
      sceneType={currentCard.sceneType}
      onUpdateParam={(k, v) => updateParam(k as any, v)}
      onChangeCategory={changeCategory}
      onNextCard={nextCard}
      onPrevCard={prevCard}
      onRandomCard={randomCard}
      onToggleReveal={toggleReveal}
      onToggleHeating={toggleHeating}
      onToggleCompressing={toggleCompressing}
    />
  )

  const centerContent = (
    <FlashCardCenterView
      containerRef={containerRef}
      vp={vp}
      card={currentCard}
      params={params}
      quizData={quizData}
      font={font}
      onSelectOption={selectOption}
      onToggleReveal={toggleReveal}
      onNextCard={nextCard}
    />
  )

  const rightContent = <FlashCardRightPanel card={currentCard} />

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
              <span className="font-bold text-sm text-white">{model?.title ?? '专题三：高考易错事实盲盒对比卡片'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${model?.badgeColor ?? 'bg-indigo-100 text-indigo-800'}`}>
                {model?.badgeText ?? '易错盲盒'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">{model?.subtitle ?? '漂白性/钝化/常识对比探究'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            高考提分专属交互工具 · 覆盖全高中化学
          </span>
        </div>
      </div>

      {/* ThreePanel 三栏主体 */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel left={leftContent} center={centerContent} right={rightContent} />
      </div>
    </div>
  )
}
