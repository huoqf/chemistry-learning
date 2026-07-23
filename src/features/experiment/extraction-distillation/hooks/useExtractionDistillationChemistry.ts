import { useMemo } from 'react'
import { SCENE_COLORS, withAlpha } from '@/theme'

export interface UseExtractionDistillationChemistryParams {
  experimentMode: number // 0: 萃取分液, 1: 蒸馏分馏
  solvent: number // 0: CCl4, 1: 苯
  misoperation: number // 0: 规范, 1: 温度计深入液面, 2: 冷凝水上进下出, 3: 未加沸石
  power: number
  vSolvent: number
  time: number
}

export interface ExtractionState {
  bottomLevel: number // 0~1 漏斗内下层液位
  topLevel: number // 0~1 漏斗内上层液位
  bottomColor: string
  topColor: string
  beakerAFillLevel: number // 烧杯 A (接下层液) 液位 0~1
  beakerAFillColor: string // 烧杯 A 内液体颜色
  beakerBFillLevel: number // 烧杯 B (接上层液) 液位 0~1
  beakerBFillColor: string // 烧杯 B 内液体颜色
  isShaking: boolean
  isInverted: boolean // 是否手持倒转放气 (180°)
  isTilted: boolean // 是否倾斜上口倒出 (60°)
  isValveOpen: boolean // 下活塞开启
  hasStopper: boolean // 顶磨砂塞是否紧闭
  isGassing: boolean // 倒转旋塞放气
  waterLayerLabel: string
  orgLayerLabel: string
  progressText: string
}

export interface DistillationState {
  currentTemp: number
  boilProgress: number // 0~1
  vaporDensity: number // 0~1
  distillateLevel: number // 0~1 (锥形瓶液位)
  thermometerOffsetY: number // 温度计偏移（0 正确置于支管口；32 深入液面）
  isWaterReversed: boolean // 冷凝水是否反向 (上进下出)
  waterFillLevel: number // 冷凝管满水度 (1.0 满水 vs 0.35 未满空腔)
  hasZeolite: boolean // 是否加沸石
  isBumpWarning: boolean // 是否暴沸
  bumpIntensity: number // 暴沸剧烈冲击振幅 0~1
  progressText: string
}

export interface ExtractionDistillationChemistryResult {
  experimentMode: number
  extraction: ExtractionState
  distillation: DistillationState
  chartHistory: Array<{ time: number; val1: number; val2: number }>
}

/**
 * 萃取分液与蒸馏化学计算 Hook（严格遵循化学原理与动态同步）
 */
export function useExtractionDistillationChemistry({
  experimentMode,
  solvent,
  misoperation,
  power,
  vSolvent,
  time,
}: UseExtractionDistillationChemistryParams): ExtractionDistillationChemistryResult {
  return useMemo(() => {
    // 0: CCl4 (下层紫红，上层水相); 1: 苯 (上层橙红，下层水相)
    const isCCl4 = solvent === 0

    // 基础试剂色彩
    const iodineWaterColor = withAlpha(SCENE_COLORS.reagent.acid, 0.75) // 深黄褐色碘水
    const ccl4IodineColor = '#9333EA' // 深紫红色 CCl4 溶碘
    const benzeneIodineColor = '#E11D48' // 鲜艳橙红色 苯溶碘
    const fadedWaterColor = withAlpha(SCENE_COLORS.reagent.solution, 0.12) // 萃取后无色透明水
    const transparentOrganic = withAlpha(SCENE_COLORS.reagent.solution, 0.08) // 无色萃取剂

    const orgColor = isCCl4 ? ccl4IodineColor : benzeneIodineColor

    // ─── 1. 萃取分液精细时序推演 (t = 0 ~ 12s) ───
    // Phase 1 (0 ~ 2s): 混合静置
    // Phase 2 (2 ~ 4.8s): 手持倒转振荡，旋塞放气！
    // Phase 3 (4.8 ~ 8s): 正立静置充分分层
    // Phase 4 (8 ~ 10.2s): 拔塞开小孔，下层液体由下口下放至烧杯 A
    // Phase 5 (10.2 ~ 12s): 关活塞，倾斜漏斗，上层液体由上口倒入烧杯 B！
    const isInverted = time >= 2 && time < 4.8
    const isShaking = time >= 2.2 && time < 4.5
    const isGassing = time >= 3.0 && time < 4.6
    const hasStopper = time < 8.0 // 8s 时拔塞/对齐凹槽小孔连通大气
    const isValveOpen = time >= 8.0 && time < 10.2 // 下活塞开启下放下层液
    const isTilted = time >= 10.2 // 10.2s 后倒出上层液

    const extractProgress = Math.min(1, Math.max(0, (time - 2) / 3))

    let bottomLevel = 0.35
    let topLevel = 0.35
    let bottomColor = iodineWaterColor
    let topColor = transparentOrganic
    let beakerAFillLevel = 0
    let beakerAFillColor = orgColor
    let beakerBFillLevel = 0
    let beakerBFillColor = orgColor
    let progressText = '1. 装入原始混合液与萃取剂'

    if (isCCl4) {
      // CCl4 密度 > 水: 下层 CCl4 相, 上层水相
      if (time < 2) {
        bottomLevel = 0.35
        topLevel = 0.35
        bottomColor = transparentOrganic
        topColor = iodineWaterColor
        progressText = '1. 装入碘水与无色 CCl₄ (CCl₄ 沉于下层)'
      } else if (time < 4.8) {
        bottomLevel = 0.35
        topLevel = 0.35
        bottomColor = extractProgress > 0.5 ? orgColor : withAlpha(orgColor, 0.5)
        topColor = extractProgress > 0.5 ? fadedWaterColor : iodineWaterColor
        progressText = '2. 倒转分液漏斗，充分振荡并旋塞放气 (下口朝斜上方)'
      } else if (time < 8.0) {
        bottomLevel = 0.35
        topLevel = 0.35
        bottomColor = orgColor
        topColor = fadedWaterColor
        progressText = '3. 静置分层 (下层紫红 CCl₄ 溶碘相，上层水相褪色)'
      } else if (time < 10.2) {
        // 下放下层 CCl4 紫红液体至烧杯 A
        const flowProg = Math.min(1, (time - 8.0) / 2.2)
        bottomLevel = Math.max(0, 0.35 * (1 - flowProg))
        topLevel = 0.35
        beakerAFillLevel = 0.45 * flowProg
        beakerAFillColor = orgColor
        bottomColor = orgColor
        topColor = fadedWaterColor
        progressText = '4. 拔塞连通大气，打开活塞 (下层 CCl₄ 从下口放出)'
      } else {
        // 倒出上层水相至烧杯 B
        const pourProg = Math.min(1, (time - 10.2) / 1.8)
        bottomLevel = 0
        topLevel = Math.max(0, 0.35 * (1 - pourProg))
        beakerAFillLevel = 0.45
        beakerAFillColor = orgColor
        beakerBFillLevel = 0.4 * pourProg
        beakerBFillColor = fadedWaterColor
        bottomColor = orgColor
        topColor = fadedWaterColor
        progressText = '5. 高考铁律：关活塞，上层水相从漏斗上口倒入烧杯 B'
      }
    } else {
      // 苯 密度 < 水: 上层苯相, 下层水相
      if (time < 2) {
        bottomLevel = 0.35
        topLevel = 0.35
        bottomColor = iodineWaterColor
        topColor = transparentOrganic
        progressText = '1. 装入碘水与无色苯 (苯浮于上层)'
      } else if (time < 4.8) {
        bottomLevel = 0.35
        topLevel = 0.35
        bottomColor = extractProgress > 0.5 ? fadedWaterColor : iodineWaterColor
        topColor = extractProgress > 0.5 ? orgColor : withAlpha(orgColor, 0.5)
        progressText = '2. 倒转分液漏斗，充分振荡并旋塞放气 (下口朝斜上方)'
      } else if (time < 8.0) {
        bottomLevel = 0.35
        topLevel = 0.35
        bottomColor = fadedWaterColor
        topColor = orgColor
        progressText = '3. 静置分层 (上层橙红苯溶碘相，下层水相褪色)'
      } else if (time < 10.2) {
        // 下放下层无色水相至烧杯 A
        const flowProg = Math.min(1, (time - 8.0) / 2.2)
        bottomLevel = Math.max(0, 0.35 * (1 - flowProg))
        topLevel = 0.35
        beakerAFillLevel = 0.45 * flowProg
        beakerAFillColor = fadedWaterColor
        bottomColor = fadedWaterColor
        topColor = orgColor
        progressText = '4. 拔塞连通大气，打开活塞 (下层无色水相从下口放出)'
      } else {
        // 倒出上层橙红苯相至烧杯 B
        const pourProg = Math.min(1, (time - 10.2) / 1.8)
        bottomLevel = 0
        topLevel = Math.max(0, 0.35 * (1 - pourProg))
        beakerAFillLevel = 0.45
        beakerAFillColor = fadedWaterColor
        beakerBFillLevel = 0.4 * pourProg
        beakerBFillColor = orgColor
        bottomColor = fadedWaterColor
        topColor = orgColor
        progressText = '5. 高考铁律：关活塞，上层橙红苯相从漏斗上口倒入烧杯 B'
      }
    }

    const extraction: ExtractionState = {
      bottomLevel,
      topLevel,
      bottomColor,
      topColor,
      beakerAFillLevel,
      beakerAFillColor,
      beakerBFillLevel,
      beakerBFillColor,
      isShaking,
      isInverted,
      isTilted,
      isValveOpen,
      hasStopper,
      isGassing,
      waterLayerLabel: isCCl4 ? '水相(上层-无色)' : '水相(下层-无色)',
      orgLayerLabel: isCCl4 ? 'CCl₄相(下层-紫红)' : '苯相(上层-橙红)',
      progressText,
    }

    // ─── 2. 蒸馏分馏精细状态推演 (t = 0 ~ 12s) ───
    const tBoil = 76.8 // CCl4 沸点
    const tEnv = 20.0
    // 错操作 1：温度计深入液面，温度测得 86.5 C 偏高
    const targetBoilTemp = misoperation === 1 ? 86.5 : tBoil
    const heatSpeed = (power / 500) * 14.0 // C/s
    const currentTemp = Math.min(targetBoilTemp, tEnv + heatSpeed * time)

    const boilTime = Math.max(0, time - (targetBoilTemp - tEnv) / heatSpeed)
    const boilProgress = Math.min(1, boilTime * 0.4)
    const vaporDensity = boilTime > 0 ? Math.min(1, boilTime * 0.25) : 0

    // 错操作 2：冷凝水反向 (上进下出)，冷凝管无法充满水 (仅 35% 满)，馏出速率打 4 折
    const flowMultiplier = misoperation === 2 ? 0.4 : 1.0
    const waterFillLevel = misoperation === 2 ? 0.35 : 1.0
    const distillateLevel = Math.min(0.55, boilTime * 0.08 * flowMultiplier)

    const thermometerOffsetY = misoperation === 1 ? 32 : 0 // 错操作：温度计深入液面
    const isWaterReversed = misoperation === 2 // 错操作：冷凝水上进下出
    const hasZeolite = misoperation !== 3 // 错操作 3：未加沸石
    const isBumpWarning = misoperation === 3 && currentTemp >= 65
    const bumpIntensity = isBumpWarning ? Math.min(1, (currentTemp - 60) / 25) : 0

    let distProgressText = '1. 加热升温阶段 (温度计水银球对准支管口)'
    if (boilTime > 0) {
      distProgressText = `2. 达沸点平台 (${tBoil}°C)，蒸气冷凝馏出中...`
    }
    if (isBumpWarning) {
      distProgressText = '⚠️ 警示：未加碎瓷片产生暴沸！若加热后发现，须先冷却再补加！'
    }

    const distillation: DistillationState = {
      currentTemp,
      boilProgress,
      vaporDensity,
      distillateLevel,
      thermometerOffsetY,
      isWaterReversed,
      waterFillLevel,
      hasZeolite,
      isBumpWarning,
      bumpIntensity,
      progressText: distProgressText,
    }

    // ─── 3. 预计算全量时序图 (Full History，保证图表与动画 100% 同步) ───
    const maxChartTime = 12
    const chartHistory: Array<{ time: number; val1: number; val2: number }> = []

    for (let t = 0; t <= maxChartTime; t += 0.2) {
      if (experimentMode === 0) {
        // 萃取 c-t: val1: c_aq (水相浓度), val2: c_org (有机相浓度)
        const p = Math.min(1, Math.max(0, (t - 2) / 3))
        const cAq = 0.10 - 0.088 * p
        const cOrg = 0.22 * p
        chartHistory.push({ time: t, val1: parseFloat(cAq.toFixed(4)), val2: parseFloat(cOrg.toFixed(4)) })
      } else {
        // 蒸馏 T-t: val1: 蒸气温度 (°C), val2: 累计馏出量 (mL)
        const temp = Math.min(targetBoilTemp, tEnv + heatSpeed * t)
        const dT = Math.max(0, t - (targetBoilTemp - tEnv) / heatSpeed)
        const vD = Math.min(40, dT * (power / 500) * 5.0 * flowMultiplier)
        chartHistory.push({ time: t, val1: parseFloat(temp.toFixed(1)), val2: parseFloat(vD.toFixed(1)) })
      }
    }

    return {
      experimentMode,
      extraction,
      distillation,
      chartHistory,
    }
  }, [experimentMode, solvent, misoperation, power, vSolvent, time])
}
