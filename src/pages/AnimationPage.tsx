import { Suspense, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getChemistryQuantities } from '@/data/chemistryQuantities'
import { useAnimationStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { useAnimationLifecycle } from '@/hooks/useAnimationLifecycle'
import {
  AnimationControls,
  ParamControl,
  ErrorBoundary,
  LeftPanel,
  ControlPanel,
  ChemistryPanel,
} from '@/components/UI'
import { duration, easing } from '@/theme'
import { ThreePanel } from '@/components/Layout'
import { AnimationLayoutContext } from '@/context/AnimationLayoutContext'
import { isConditionVisible } from '@/utils/controlVisibility'

export default function AnimationPage() {
  const navigate = useNavigate()

  const {
    config,
    canvasDimmed,
    handleReset,
    effectiveControlsMode,
  } = useAnimationLifecycle()

  const AnimationComponent = config?.Component

  const { params, time, isPlaying, speed, equilibriumReached } = useAnimationStore(
    useShallow((s) => ({
      params: s.params,
      time: s.time,
      isPlaying: s.isPlaying,
      speed: s.speed,
      equilibriumReached: s.equilibriumReached,
    }))
  )
  const setIsPlaying = useAnimationStore((s) => s.setIsPlaying)
  const setTime = useAnimationStore((s) => s.setTime)
  const setSpeed = useAnimationStore((s) => s.setSpeed)
  const setParams = useAnimationStore((s) => s.setParams)
  const updateParam = useAnimationStore((s) => s.updateParam)
  const showVectors = useAnimationStore((s) => s.showVectors)
  const showTimeSlices = useAnimationStore((s) => s.showTimeSlices)
  const showDualObjects = useAnimationStore((s) => s.showDualObjects)
  const setDirection = useAnimationStore((s) => s.setDirection)
  const toggleVectors = useAnimationStore((s) => s.toggleVectors)
  const toggleTimeSlices = useAnimationStore((s) => s.toggleTimeSlices)
  const toggleDualObjects = useAnimationStore((s) => s.toggleDualObjects)

  const controlMeta = config?.controlMeta || []
  const paramMeta = useMemo(
    () => config?.buildParamMeta ? config.buildParamMeta(params) : (config?.paramMeta ?? []),
    [config, params]
  )

  const chemistryQuantities = useMemo(
    () => config ? getChemistryQuantities(config.id, params, time).map((q) => ({
      label: q.label,
      value: q.precision != null ? Number(q.value.toFixed(q.precision)) : q.value,
      unit: q.unit,
    })) : [],
    [config, params, time],
  )

  if (!config || !AnimationComponent) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-neutral-700 mb-4">动画未找到</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:scale-[0.97]"
        >
          返回知识树
        </button>
      </div>
    )
  }

  const maxTime = config.maxTime ?? 30

  const paramControlParams = paramMeta
    .filter((p) => isConditionVisible(p, params))
    .map((p) => ({
      ...p,
      value: params[p.key] ?? 0,
    }))

  const handleParamControlChange = (key: string, value: number) => {
    const shouldReset = paramControlParams.find((p) => p.key === key)?.resetOnChange === true
    const changed = params[key] !== value
    updateParam(key, value)
    if (shouldReset && changed) handleReset()
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-neutral-50">
      <div className="flex items-center gap-4 px-6 h-14 shrink-0 bg-white shadow-sm border-b border-neutral-200">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 active:scale-[0.97]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">返回</span>
        </button>
        <h1 className="text-xl font-bold text-neutral-800">{config.title}</h1>
        {config.tripleRepresentation && (
          <div className="flex items-center gap-1.5 ml-auto">
            {config.tripleRepresentation.micro && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border border-sky-200 bg-sky-50 text-sky-700">
                微观
              </span>
            )}
            {config.tripleRepresentation.macro && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border border-orange-200 bg-orange-50 text-orange-700">
                宏观
              </span>
            )}
            {config.tripleRepresentation.symbol && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border border-slate-200 bg-slate-50 text-slate-700">
                符号
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ThreePanel
          left={(paramControlParams.length > 0 || controlMeta.length > 0) ? (
            <LeftPanel>
              {paramControlParams.length > 0 && (
                <div className="shrink-0">
                  <ParamControl
                    params={paramControlParams}
                    onParamChange={handleParamControlChange}
                    onReset={() => {
                      if (config) setParams(config.defaultParams)
                      handleReset()
                    }}
                  />
                </div>
              )}
              {controlMeta.length > 0 && (
                <ControlPanel
                  controls={controlMeta}
                  params={params}
                  defaultParams={config.defaultParams}
                  updateParam={updateParam}
                  setParams={setParams}
                  resetAnimation={handleReset}
                  restartAnimation={() => {
                    setTime(0)
                    setIsPlaying(true)
                  }}
                  setDirection={(d) => setDirection(d)}
                  toggleVectors={() => toggleVectors()}
                  toggleTimeSlices={() => toggleTimeSlices()}
                  toggleDualObjects={() => toggleDualObjects()}
                  storeStates={{
                    showVectors,
                    showTimeSlices,
                    showDualObjects,
                  }}
                />
              )}
            </LeftPanel>
          ) : undefined}
          center={
            <div className="flex flex-col h-full p-1.5 gap-2">
              <div
                className="w-full flex-1 min-h-0 bg-white rounded-xl shadow-md overflow-hidden"
                style={{
                  transition: `opacity ${duration.normal}ms ${easing.standard}`,
                  opacity: canvasDimmed ? 0.95 : 1,
                }}
              >
                <ErrorBoundary resetKey={config.id}>
                  <Suspense
                    fallback={<div className="w-full h-full flex items-center justify-center text-neutral-400">加载中...</div>}
                  >
                    <AnimationLayoutContext.Provider value={config.sceneLayout}>
                      <AnimationComponent />
                    </AnimationLayoutContext.Provider>
                  </Suspense>
                </ErrorBoundary>
              </div>
              <div className="px-2 pb-2 pt-1 shrink-0">
                <AnimationControls
                  isPlaying={isPlaying}
                  speed={speed}
                  time={time}
                  maxTime={maxTime}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  onReset={handleReset}
                  onSpeedChange={setSpeed}
                  onTimeChange={setTime}
                  controlsMode={effectiveControlsMode}
                  equilibriumReached={equilibriumReached}
                />
              </div>
            </div>
          }
          right={
            <div className="p-2 h-full flex flex-col">
              <ChemistryPanel
                quantities={chemistryQuantities}
                formulas={typeof config?.formulas === 'function' ? config.formulas(params) : (config?.formulas ?? [])}
                gaokaoPoints={typeof config?.gaokaoPoints === 'function' ? config.gaokaoPoints(params) : (config?.gaokaoPoints ?? [])}
                warnings={config?.warnings ?? []}
              />
            </div>
          }
        />
      </div>
    </div>
  )
}
