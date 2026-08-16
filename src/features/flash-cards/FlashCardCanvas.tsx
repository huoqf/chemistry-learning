import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader } from '@/components/UI'
import { useAnimationViewport } from '@/hooks/useAnimationViewport'
import { CANVAS_PRESETS } from '@/theme'
import { getModelQuizData } from '@/data/quiz'
import { useFlashCardChemistry } from './hooks/useFlashCardChemistry'
import { FlashCardLeftPanel } from './components/FlashCardLeftPanel'
import { FlashCardCenterView } from './components/FlashCardCenterView'
import { FlashCardRightPanel } from './components/FlashCardRightPanel'

export function FlashCardCanvas() {
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
      category={params.category}
      currentIndex={currentIndex}
      totalCards={totalCards}
      isRevealed={params.isRevealed}
      isHeating={params.isHeating}
      isCompressing={params.isCompressing}
      sceneType={currentCard.sceneType}
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
      {/* 统一 Header */}
      <GaokaoToolHeader
        modelId="model-flash-cards"
        viewMode={params.viewMode}
        onViewModeChange={(m) => updateParam('viewMode', m)}
      />

      {/* ThreePanel 三栏主体 */}
      <div className="flex-1 overflow-hidden">
        <ThreePanel left={leftContent} center={centerContent} right={rightContent} />
      </div>
    </div>
  )
}
