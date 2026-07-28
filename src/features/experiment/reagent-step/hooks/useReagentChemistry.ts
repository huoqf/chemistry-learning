import { useState, useMemo, useEffect, useCallback } from 'react'
import { REAGENT_SCENES } from '../data/reagentData'
import type { ReagentSceneId, ReagentStepPoint, ReagentSceneConfig, ViewMode } from '../types'

export interface UseReagentChemistryOptions {
  initialSceneId?: ReagentSceneId
}

export function useReagentChemistry(options?: UseReagentChemistryOptions) {
  const [sceneId, setSceneId] = useState<ReagentSceneId>(options?.initialSceneId ?? 'fe-air-ox')
  const [progress, setProgress] = useState<number>(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(1)
  const [viewMode, setViewMode] = useState<ViewMode>('animation')

  // 实验对比条件标志
  const [isAirIsolated, setIsAirIsolated] = useState<boolean>(false)
  const [isReverseTitration, setIsReverseTitration] = useState<boolean>(false)
  const [isWeakBase, setIsWeakBase] = useState<boolean>(false)

  const currentScene: ReagentSceneConfig = useMemo(() => {
    return REAGENT_SCENES[sceneId] ?? REAGENT_SCENES['fe-air-ox']
  }, [sceneId])

  // 切换场景时自动重置
  const handleSceneChange = useCallback((newId: ReagentSceneId) => {
    setSceneId(newId)
    setProgress(0)
    setIsAutoPlaying(false)
    setIsAirIsolated(false)
    setIsReverseTitration(false)
    setIsWeakBase(false)
  }, [])

  // 自动滴加定时逻辑
  useEffect(() => {
    if (!isAutoPlaying) return

    const intervalMs = Math.max(20, 100 / speed)
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          setIsAutoPlaying(false)
          return 1
        }
        return Math.min(1, prev + 0.02)
      })
    }, intervalMs)

    return () => clearInterval(timer)
  }, [isAutoPlaying, speed])

  // 单滴微量 (+0.05 mL / +0.005 progress)
  const handleSingleDrop = useCallback(() => {
    setIsAutoPlaying(false)
    setProgress((prev) => Math.min(1, parseFloat((prev + 0.005).toFixed(4))))
  }, [])

  // 连续定量滴加 (+1.0 mL / +0.1 progress)
  const handleBulkAdd = useCallback(() => {
    setIsAutoPlaying(false)
    setProgress((prev) => Math.min(1, parseFloat((prev + 0.1).toFixed(4))))
  }, [])

  // 计算当前处于哪个 step
  const activeStepState = useMemo(() => {
    const steps = currentScene.steps
    if (steps.length === 0) {
      return {
        stepIndex: 0,
        currentStep: {
          progress: 0,
          title: '',
          description: '',
          solutionColor: 'transparent',
          solutionOpacity: 0,
          precipitateText: '无沉淀',
          precipitateColor: 'transparent',
          precipitateLevel: 0,
          equation: '',
          ph: 7.0,
        } as ReagentStepPoint,
        interpolatedPptLevel: 0,
      }
    }

    if (sceneId === 'fe-air-ox' && isAirIsolated && progress > 0.3) {
      const baseStep = steps[1] || steps[0]
      return {
        stepIndex: 1,
        currentStep: {
          ...baseStep,
          title: '隔绝空气实验：保持白色 Fe(OH)₂ 沉淀',
          description: '隔绝空气（长滴管伸入液面下/煮沸去氧/加植物油），Fe(OH)₂ 不被 O₂ 氧化，长久保持白色！',
          precipitateText: '白色沉淀 Fe(OH)₂ (抗氧化)',
          precipitateColor: '#F8FAFC',
          precipitateLevel: Math.min(0.5, 0.2 + progress * 0.3),
          equation: 'Fe^{2+} + 2OH^- = Fe(OH)_2\\downarrow \\text{ (隔绝空气仍为白色)}',
        },
        interpolatedPptLevel: Math.min(0.5, 0.2 + progress * 0.3),
      }
    }

    if (sceneId === 'al-amphoteric') {
      if (isWeakBase) {
        const pptLvl = Math.min(0.6, progress * 1.2)
        const isMax = progress >= 0.5
        return {
          stepIndex: isMax ? 1 : 0,
          currentStep: {
            progress,
            title: isMax ? '滴加过量氨水：Al(OH)₃ 沉淀不溶解' : '滴加氨水：生成白色 Al(OH)₃ 沉淀',
            description: isMax
              ? '弱碱 NH₃·H₂O 电离出的 OH⁻ 浓度不足，无法使 Al(OH)₃ 酸式电离溶解，沉淀保持最大！'
              : 'Al³⁺ 与 NH₃·H₂O 反应生成 Al(OH)₃ 白色胶状沉淀。',
            solutionColor: 'rgba(248, 250, 252, 0.1)',
            solutionOpacity: 0.15,
            precipitateText: '白色沉淀 Al(OH)₃',
            precipitateColor: '#F8FAFC',
            precipitateLevel: pptLvl,
            equation: 'Al^{3+} + 3NH_3\\cdot H_2O = Al(OH)_3\\downarrow + 3NH_4^+',
            ph: 9.5,
          },
          interpolatedPptLevel: pptLvl,
        }
      }

      if (isReverseTitration) {
        const isBeforeEnd = progress < 0.75
        const pptLvl = isBeforeEnd ? 0 : (progress - 0.75) * 2.2
        return {
          stepIndex: isBeforeEnd ? 0 : 1,
          currentStep: {
            progress,
            title: isBeforeEnd ? '反滴初始：过量强碱无沉淀' : '反滴后期：碱消耗完产生沉淀',
            description: isBeforeEnd
              ? '向强碱 NaOH 滴加 AlCl₃ 时，开始时 OH⁻ 极大过量，直接生成可溶的 [Al(OH)₄]⁻ 无沉淀！'
              : '过量的 NaOH 被消耗完毕，继续滴加 Al³⁺ 与 [Al(OH)₄]⁻ 结合生成 Al(OH)₃ 沉淀。',
            solutionColor: 'rgba(255, 255, 255, 0.05)',
            solutionOpacity: 0.05,
            precipitateText: isBeforeEnd ? '无沉淀 ([Al(OH)₄]⁻)' : '白色沉淀 Al(OH)₃',
            precipitateColor: isBeforeEnd ? 'transparent' : '#F8FAFC',
            precipitateLevel: Math.min(0.55, pptLvl),
            equation: isBeforeEnd
              ? 'Al^{3+} + 4OH^- = [Al(OH)_4]^- \\text{ (强碱过量无沉淀)}'
              : 'Al^{3+} + 3[Al(OH)_4]^- = 4Al(OH)_3\\downarrow',
            ph: isBeforeEnd ? 13.0 : 8.0,
          },
          interpolatedPptLevel: Math.min(0.55, pptLvl),
        }
      }
    }

    let stepIdx = steps.length - 1
    for (let i = 0; i < steps.length; i++) {
      if (progress <= steps[i].progress) {
        stepIdx = i
        break
      }
    }

    const cur = steps[stepIdx]
    const prev = steps[Math.max(0, stepIdx - 1)]

    const range = Math.max(0.01, cur.progress - prev.progress)
    const factor = Math.min(1, Math.max(0, (progress - prev.progress) / range))
    const interpolatedPptLevel = prev.precipitateLevel + (cur.precipitateLevel - prev.precipitateLevel) * factor

    return {
      stepIndex: stepIdx,
      currentStep: cur,
      interpolatedPptLevel,
    }
  }, [currentScene, progress, sceneId, isAirIsolated, isReverseTitration, isWeakBase])

  const chartData = useMemo(() => {
    const pointsCount = 20
    const data: { x: number; y: number; label: string }[] = []

    for (let i = 0; i <= pointsCount; i++) {
      const p = i / pointsCount
      let yVal = 0

      if (sceneId === 'al-amphoteric') {
        if (isWeakBase) {
          yVal = Math.min(100, p * 200)
        } else if (isReverseTitration) {
          yVal = p < 0.75 ? 0 : (p - 0.75) * 400
        } else {
          yVal = p <= 0.75 ? (p / 0.75) * 100 : Math.max(0, ((1 - p) / 0.25) * 100)
        }
      } else if (sceneId === 'cu-ammonia') {
        yVal = p <= 0.4 ? (p / 0.4) * 100 : Math.max(0, ((1 - p) / 0.6) * 100)
      } else {
        yVal = Math.min(100, p * 120)
      }

      data.push({
        x: p * 10,
        y: Math.round(yVal),
        label: `${(p * 10).toFixed(1)} mL`,
      })
    }

    return data
  }, [sceneId, isWeakBase, isReverseTitration])

  const handleStepClick = useCallback(
    (index: number) => {
      const steps = currentScene.steps
      if (steps[index]) {
        setProgress(steps[index].progress)
        setIsAutoPlaying(false)
      }
    },
    [currentScene]
  )

  const handleReset = useCallback(() => {
    setProgress(0)
    setIsAutoPlaying(false)
  }, [])

  return {
    sceneId,
    currentScene,
    progress,
    setProgress,
    isAutoPlaying,
    setIsAutoPlaying,
    speed,
    setSpeed,
    viewMode,
    setViewMode,

    isAirIsolated,
    setIsAirIsolated,
    isReverseTitration,
    setIsReverseTitration,
    isWeakBase,
    setIsWeakBase,

    stepIndex: activeStepState.stepIndex,
    currentStep: activeStepState.currentStep,
    interpolatedPptLevel: activeStepState.interpolatedPptLevel,

    chartData,
    handleSceneChange,
    handleStepClick,
    handleSingleDrop,
    handleBulkAdd,
    handleReset,
  }
}
