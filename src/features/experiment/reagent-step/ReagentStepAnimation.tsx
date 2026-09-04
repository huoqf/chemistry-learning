import { ThreePanel } from '@/components/Layout'
import { GaokaoToolHeader } from '@/components/UI'
import { useReagentChemistry } from './hooks/useReagentChemistry'
import { ReagentStepLeftPanel } from './components/ReagentStepLeftPanel'
import { ReagentStepCenterView } from './components/ReagentStepCenterView'
import { ReagentStepRightPanel } from './components/ReagentStepRightPanel'

export function ReagentStepAnimation() {
  const {
    sceneId,
    currentScene,
    progress,
    setProgress,
    isAutoPlaying,
    setIsAutoPlaying,
    viewMode,
    setViewMode,

    isAirIsolated,
    isReverseTitration,
    isWeakBase,
    alMode,
    handleToggleAirIsolated,
    handleAlModeChange,

    stepIndex,
    currentStep,
    interpolatedPptLevel,

    currentPptMass,
    currentPh,

    chartData,
    handleSceneChange,
    handleSingleDrop,
    handleBulkAdd,
    handleReset,
  } = useReagentChemistry()

  return (
    <div className="w-full h-screen flex flex-col font-sans text-slate-900 bg-slate-100 overflow-hidden select-none">
      <GaokaoToolHeader
        modelId="model-reagent-step"
        viewMode={viewMode === 'animation' ? 0 : viewMode === 'scoring' ? 1 : 2}
        onViewModeChange={(m) => {
          setViewMode(m === 0 ? 'animation' : m === 1 ? 'scoring' : 'quiz')
        }}
      />
      <div className="flex-1 overflow-hidden">
        <ThreePanel
          left={
            <ReagentStepLeftPanel
              sceneId={sceneId}
              currentScene={currentScene}
              isAirIsolated={isAirIsolated}
              alMode={alMode}
              handleSceneChange={handleSceneChange}
              handleToggleAirIsolated={handleToggleAirIsolated}
              handleAlModeChange={handleAlModeChange}
            />
          }
          center={
            <ReagentStepCenterView
              viewMode={viewMode}
              currentScene={currentScene}
              progress={progress}
              setProgress={setProgress}
              isAutoPlaying={isAutoPlaying}
              setIsAutoPlaying={setIsAutoPlaying}
              handleSingleDrop={handleSingleDrop}
              handleBulkAdd={handleBulkAdd}
              handleReset={handleReset}
              currentStep={currentStep}
              interpolatedPptLevel={interpolatedPptLevel}
              isAirIsolated={isAirIsolated}
              isReverseTitration={isReverseTitration}
              isWeakBase={isWeakBase}
              currentPptMass={currentPptMass}
              currentPh={currentPh}
              chartData={chartData}
            />
          }
          right={
            <ReagentStepRightPanel
              currentScene={currentScene}
              stepIndex={stepIndex}
              currentStep={currentStep}
              progress={progress}
              interpolatedPptLevel={interpolatedPptLevel}
              isAirIsolated={isAirIsolated}
              isReverseTitration={isReverseTitration}
              isWeakBase={isWeakBase}
            />
          }
        />
      </div>
    </div>
  )
}
