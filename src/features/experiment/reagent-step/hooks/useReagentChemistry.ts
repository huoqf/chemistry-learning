import { useState, useMemo, useEffect, useCallback } from 'react'
import { REAGENT_SCENES } from '../data/reagentData'
import type { ReagentSceneId, ReagentStepPoint, ReagentSceneConfig, ViewMode } from '../types'

export interface UseReagentChemistryOptions {
  initialSceneId?: ReagentSceneId
}

export function computeReagentDataPoint(
  sceneId: ReagentSceneId,
  v: number, // 滴加体积 0 ~ 10 mL
  flags: { isReverseTitration?: boolean; isWeakBase?: boolean; isAirIsolated?: boolean } = {}
): { pptMass: number; ph: number } {
  const p = Math.max(0, Math.min(1, v / 10))
  let pptMass = 0
  let ph = 7.0

  if (sceneId === 'fe-air-ox') {
    // 0 ~ 4 mL 沉淀生成至 100 mmol，4 ~ 10 mL 沉淀总量饱和，主要发生空气氧化变色
    pptMass = p <= 0.4 ? (p / 0.4) * 100 : 100
    ph = 6.0 + Math.pow(p, 0.6) * 3.8
  } else if (sceneId === 'al-amphoteric') {
    if (flags.isWeakBase) {
      // 弱碱氨水：Al³⁺ + 3NH₃·H₂O = Al(OH)₃↓ + 3NH₄⁺
      // 0~5 mL 生成沉淀至 100 mmol，5~10 mL 氨水过量，沉淀绝不溶解 (维持 100 mmol)
      pptMass = p <= 0.5 ? (p / 0.5) * 100 : 100
      ph = 4.5 + Math.pow(p, 0.5) * 5.0
    } else if (flags.isReverseTitration) {
      // 反滴（向 NaOH 滴加 Al³⁺）：
      // 0~7.5 mL (3/4 阶段): Al³⁺ + 4OH⁻ = [Al(OH)₄]⁻，强碱过量，无沉淀 (0 mmol)
      // 7.5~10 mL (1/4 阶段): Al³⁺ + 3[Al(OH)₄]⁻ = 4Al(OH)₃↓，碱耗尽生成沉淀 (0 -> 100 mmol)
      pptMass = p < 0.75 ? 0 : ((p - 0.75) / 0.25) * 100
      if (p < 0.75) {
        ph = 13.0 - (p / 0.75) * 5.0
      } else {
        ph = 8.0 - ((p - 0.75) / 0.25) * 1.0
      }
    } else {
      // 正滴（向 Al³⁺ 滴加 NaOH）：
      // 消耗比严格符合高考标准 3 : 1！
      // 0~7.5 mL (3/4 阶段): Al³⁺ + 3OH⁻ = Al(OH)₃↓ (生成沉淀升至 100 mmol)
      // 7.5~10 mL (1/4 阶段): Al(OH)₃ + OH⁻ = [Al(OH)₄]⁻ (沉淀完全溶解至 0 mmol)
      pptMass = p <= 0.75 ? (p / 0.75) * 100 : Math.max(0, ((1 - p) / 0.25) * 100)
      if (p <= 0.75) {
        ph = 4.5 + Math.pow(p / 0.75, 2) * 3.0
      } else {
        ph = 7.5 + ((p - 0.75) / 0.25) * 5.5
      }
    }
  } else if (sceneId === 'cu-ammonia') {
    // 铜氨络合：
    // 0~3.33 mL (1/3 阶段): Cu²⁺ + 2NH₃·H₂O = Cu(OH)₂↓ + 2NH₄⁺ (浅蓝沉淀 0 -> 100 mmol)
    // 3.33~10.0 mL (2/3 阶段): Cu(OH)₂ + 4NH₃ = [Cu(NH₃)₄]²⁺ + 2OH⁻ (络合溶解 100 -> 0 mmol)
    pptMass = p <= 0.333 ? (p / 0.333) * 100 : Math.max(0, ((1 - p) / 0.667) * 100)
    if (p <= 0.333) {
      ph = 5.5 + (p / 0.333) * 2.5
    } else {
      ph = 8.0 + ((p - 0.333) / 0.667) * 3.2
    }
  } else if (sceneId === 'fe-test') {
    // 铁离子检验：
    // 0~5 mL: KSCN 显色络合 Fe³⁺ + 3SCN⁻ = Fe(SCN)₃ (血红溶液，无沉淀 0 mmol)
    // 5~10 mL: K₃[Fe(CN)₆] 检验 Fe²⁺ 生成普鲁士蓝沉淀 (0 -> 100 mmol)
    pptMass = p <= 0.5 ? 0 : ((p - 0.5) / 0.5) * 100
    ph = 3.0 + p * 1.0
  } else if (sceneId === 'ag-trans') {
    // 沉淀转化 AgCl -> AgI -> Ag₂S：
    // 0~3.3 mL: 滴加 NaCl 生成 AgCl (0 -> 100 mmol)
    // 3.3~6.6 mL: 滴加 NaI 转化为 AgI (沉淀总量维持 100 mmol)
    // 6.6~10.0 mL: 滴加 Na₂S 转化为 Ag₂S (沉淀总量维持 100 mmol)
    pptMass = p <= 0.33 ? (p / 0.33) * 100 : 100
    ph = 6.0 + p * 2.5
  }

  return {
    pptMass: parseFloat(pptMass.toFixed(1)),
    ph: parseFloat(ph.toFixed(2)),
  }
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

  // 当前滴加体积 (mL) 与实时化学计算
  const currentVolume = progress * 10
  const currentDataPoint = useMemo(() => {
    return computeReagentDataPoint(sceneId, currentVolume, {
      isReverseTitration,
      isWeakBase,
      isAirIsolated,
    })
  }, [sceneId, currentVolume, isReverseTitration, isWeakBase, isAirIsolated])

  // 试管内沉淀视觉填充比例 (0 ~ 0.55)
  const interpolatedPptLevel = (currentDataPoint.pptMass / 100) * 0.5

  // 计算当前处于哪个 step 现象说明
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
          ph: currentDataPoint.ph,
        },
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
            ph: currentDataPoint.ph,
          },
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
            ph: currentDataPoint.ph,
          },
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

    return {
      stepIndex: stepIdx,
      currentStep: {
        ...cur,
        ph: currentDataPoint.ph,
      },
    }
  }, [currentScene, progress, sceneId, isAirIsolated, isReverseTitration, isWeakBase, currentDataPoint.ph])

  // 高密度采样全量静态曲线数据 (50个采样点)
  const chartData = useMemo(() => {
    const pointsCount = 50
    const data: { x: number; y: number; ph: number; label: string }[] = []

    for (let i = 0; i <= pointsCount; i++) {
      const v = (i / pointsCount) * 10
      const pt = computeReagentDataPoint(sceneId, v, {
        isReverseTitration,
        isWeakBase,
        isAirIsolated,
      })

      data.push({
        x: parseFloat(v.toFixed(2)),
        y: pt.pptMass,
        ph: pt.ph,
        label: `${v.toFixed(1)} mL`,
      })
    }

    return data
  }, [sceneId, isWeakBase, isReverseTitration, isAirIsolated])

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
    interpolatedPptLevel,

    currentPptMass: currentDataPoint.pptMass,
    currentPh: currentDataPoint.ph,

    chartData,
    handleSceneChange,
    handleStepClick,
    handleSingleDrop,
    handleBulkAdd,
    handleReset,
  }
}
