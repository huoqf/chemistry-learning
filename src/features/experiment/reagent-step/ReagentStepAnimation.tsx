import { ThreePanel } from '@/components/Layout'
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
    setIsAirIsolated,
    isReverseTitration,
    setIsReverseTitration,
    isWeakBase,
    setIsWeakBase,

    stepIndex,
    currentStep,
    interpolatedPptLevel,

    chartData,
    handleSceneChange,
    handleStepClick,
    handleSingleDrop,
    handleBulkAdd,
    handleReset,
  } = useReagentChemistry()

  return (
    <ThreePanel
      left={
        <ReagentStepLeftPanel
          sceneId={sceneId}
          currentScene={currentScene}
          progress={progress}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isAirIsolated={isAirIsolated}
          setIsAirIsolated={setIsAirIsolated}
          isReverseTitration={isReverseTitration}
          setIsReverseTitration={setIsReverseTitration}
          isWeakBase={isWeakBase}
          setIsWeakBase={setIsWeakBase}
          stepIndex={stepIndex}
          currentStep={currentStep}
          handleSceneChange={handleSceneChange}
          handleStepClick={handleStepClick}
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
        />
      }
    />
  )
}
