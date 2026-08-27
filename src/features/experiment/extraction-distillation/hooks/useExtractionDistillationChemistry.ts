import { useMemo } from 'react'
import { SCENE_COLORS, withAlpha } from '@/theme'

export interface UseExtractionDistillationChemistryParams {
  experimentMode: number // 0: 萃取分液, 1: 蒸馏分馏
  solvent?: number // 0: CCl4, 1: 苯, 2: 乙醇
  extractionMisoperation?: number // 0: 规范操作, 1: 未拔塞放液 (负压阻断)
  misoperation?: number // 0: 规范操作, 1: 温度计深入液面, 2: 冷凝水上进下出, 3: 未加沸石
  power?: number
  vSolvent?: number
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
  isInverted: boolean // 是否手持倒转 (160°)
  isGassing: boolean // 倒转斜朝上方旋塞放气
  hasStopper: boolean // 顶磨砂塞是否紧闭塞入
  isStopperLifted: boolean // 拔塞悬停连通大气
  isValveOpen: boolean // 下活塞开启
  isTilted: boolean // 是否倾斜向右移位上口倒出 (55°)
  isBlocked: boolean // 未拔塞导致的负压液体流不出
  isEthanolMiscible: boolean // 乙醇互溶不分层反例
  // 漏斗平滑空间位移与旋转插值
  funnelTransform: {
    x: number
    y: number
    rotate: number
  }
  waterLayerLabel: string
  orgLayerLabel: string
  progressText: string
}

export interface DistillationState {
  currentTemp: number
  targetBoilTemp: number
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
 * 萃取分液与蒸馏化学计算 Hook（严格遵循新高考实验规范与热力学物理规律）
 */
export function useExtractionDistillationChemistry({
  experimentMode = 0,
  solvent = 0,
  extractionMisoperation = 0,
  misoperation = 0,
  power = 500,
  vSolvent = 20,
  time,
}: UseExtractionDistillationChemistryParams): ExtractionDistillationChemistryResult {
  return useMemo(() => {
    // solvent: 0: CCl4, 1: 苯, 2: 乙醇
    const isCCl4 = solvent === 0
    const isBenzene = solvent === 1
    const isEthanol = solvent === 2

    // 基础试剂色彩
    const iodineWaterColor = '#D97706' // 黄褐色碘水
    const ccl4IodineColor = '#9333EA' // 深紫红色 CCl4 溶碘
    const benzeneIodineColor = '#E11D48' // 鲜艳橙红色 苯溶碘
    const ethanolMixedColor = '#B45309' // 乙醇与碘水互溶的均一棕黄色
    const fadedWaterColor = withAlpha(SCENE_COLORS.reagent.solution, 0.15) // 萃取后近无色透明水相
    const transparentOrganic = withAlpha(SCENE_COLORS.reagent.solution, 0.1) // 无色有机溶剂

    const orgColor = isCCl4 ? ccl4IodineColor : isBenzene ? benzeneIodineColor : ethanolMixedColor

    // ─── 1. 萃取分液精细时序推演 (t = 0 ~ 12s) ───
    // Phase 1 (0 ~ 2.0s): 静置装液。漏斗固定在铁圈上。
    // Phase 2 (2.0 ~ 5.2s): 双手取下倒转振荡，下口朝斜上方，3.4~4.6s 旋塞放气！
    // Phase 3 (5.2 ~ 7.8s): 放回铁圈，充分静置分层。
    // Phase 4 (7.8 ~ 10.0s): 拔塞连通大气，45°斜切尖嘴贴壁，下层液体从下口流出至烧杯 A。
    // Phase 5 (10.0 ~ 12.0s): 关活塞，漏斗移至烧杯 B 口上方，上口倾斜倒入烧杯 B。
    const isInverted = time >= 2.0 && time < 5.2
    const isShaking = time >= 2.2 && time < 4.8
    const isGassing = time >= 3.4 && time < 4.8
    const isStopperLifted = extractionMisoperation === 0 && time >= 7.8 && time < 10.0
    const hasStopper = !isStopperLifted && time < 10.0 // 拔塞或上倒时脱塞
    const isTilted = time >= 10.0 && !isEthanol

    // 未拔塞放液（负压阻断错操作）
    const isBlocked = extractionMisoperation === 1 && time >= 8.6

    let isValveOpen = false
    if (extractionMisoperation === 0) {
      isValveOpen = time >= 7.8 && time < 10.0 && !isEthanol
    } else {
      isValveOpen = time >= 7.8 && time < 8.6 && !isEthanol
    }

    // 空间位移与旋转变换插值
    let fx = 0
    let fy = 0
    let fRot = 0

    if (time >= 2.0 && time < 5.2) {
      // 双手倒持放气姿态：脱离铁圈向上平移 30px，旋转 160°
      const enterProg = Math.min(1, (time - 2.0) / 0.5)
      const exitProg = time > 4.7 ? (time - 4.7) / 0.5 : 0
      const currentProg = enterProg * (1 - exitProg)
      const shakeY = isShaking ? Math.sin(Date.now() * 0.03) * 3 : 0
      const shakeX = isShaking ? Math.cos(Date.now() * 0.03) * 2 : 0

      fx = shakeX + 25 * currentProg
      fy = -35 * currentProg + shakeY
      fRot = 160 * currentProg
    } else if (time >= 10.0 && !isEthanol) {
      // 移位至烧杯 B 上口倾斜倒出：向右平移 65px，下移 10px，旋转 55°
      const pourProg = Math.min(1, (time - 10.0) / 0.4)
      fx = 65 * pourProg
      fy = 10 * pourProg
      fRot = 55 * pourProg
    }

    const extractProgress = Math.min(1, Math.max(0, (time - 2.0) / 3.2))

    let bottomLevel = 0.35
    let topLevel = 0.35
    let bottomColor = transparentOrganic
    let topColor = iodineWaterColor
    let beakerAFillLevel = 0
    let beakerAFillColor = orgColor
    let beakerBFillLevel = 0
    let beakerBFillColor = orgColor
    let progressText = '1. 装入碘水与萃取剂'
    let waterLayerLabel = '水相'
    let orgLayerLabel = '有机相'

    if (isEthanol) {
      // 乙醇互溶反例：完全不分层，均一棕黄相，无法分液
      bottomLevel = 0.7
      topLevel = 0
      bottomColor = ethanolMixedColor
      topColor = transparentOrganic
      waterLayerLabel = '互溶体系'
      orgLayerLabel = '乙醇与水完全互溶 (❌ 无法萃取)'
      if (time < 2.0) {
        progressText = '1. 加入乙醇，乙醇与水无限互溶形成均一相'
      } else if (time < 5.2) {
        progressText = '2. 振荡后无分层界面，乙醇不能作为萃取剂（违背不互溶原则）'
      } else {
        progressText = '❌ 探究结论：乙醇与水互溶，静置不分层，无法用于萃取碘水！'
      }
    } else if (isCCl4) {
      // CCl4 密度 > 水: 下层 CCl4 相, 上层水相
      waterLayerLabel = '上层：水相 (近无色)'
      orgLayerLabel = '下层：CCl₄ 溶碘相 (紫红色)'
      if (time < 2.0) {
        bottomLevel = 0.35
        topLevel = 0.35
        bottomColor = transparentOrganic
        topColor = iodineWaterColor
        progressText = '1. 装入碘水与无色 CCl₄ (ρ(CCl₄) > ρ(水)，沉于下层)'
      } else if (time < 5.2) {
        bottomLevel = 0.35
        topLevel = 0.35
        bottomColor = extractProgress > 0.4 ? orgColor : withAlpha(orgColor, 0.5)
        topColor = extractProgress > 0.4 ? fadedWaterColor : iodineWaterColor
        progressText = isGassing
          ? '2b. 【高考规范】下口朝向斜上方，旋开活塞放气，平衡蒸气压！'
          : '2a. 【双手倒持】右手食指顶住塞子，左手握住活塞，双手握持倒转振摇！'
      } else if (time < 7.8) {
        bottomLevel = 0.35
        topLevel = 0.35
        bottomColor = orgColor
        topColor = fadedWaterColor
        progressText = '3. 放回铁圈静置分层 (下层紫红 CCl₄ 溶碘相，上层水相近无色)'
      } else if (time < 10.0) {
        if (extractionMisoperation === 1) {
          // 未拔塞错操作：放液 0.8s 后因负压停滞
          bottomLevel = 0.28
          topLevel = 0.35
          beakerAFillLevel = 0.1
          beakerAFillColor = orgColor
          bottomColor = orgColor
          topColor = fadedWaterColor
          progressText = '⚠️ 【未拔塞警告】未打开顶部玻璃塞连通大气，内部形成负压，液体停止流出！'
        } else {
          // 正常放液
          const flowProg = Math.min(1, (time - 7.8) / 2.2)
          bottomLevel = Math.max(0, 0.35 * (1 - flowProg))
          topLevel = 0.35
          beakerAFillLevel = 0.45 * flowProg
          beakerAFillColor = orgColor
          bottomColor = orgColor
          topColor = fadedWaterColor
          progressText = '4. 拔开玻璃塞连通大气，开活塞，45°斜切尖嘴贴烧杯内壁下放下层液'
        }
      } else {
        // 倒出上层水相至烧杯 B
        const pourProg = Math.min(1, (time - 10.0) / 2.0)
        bottomLevel = 0
        topLevel = Math.max(0, 0.35 * (1 - pourProg))
        beakerAFillLevel = 0.45
        beakerAFillColor = orgColor
        beakerBFillLevel = 0.4 * pourProg
        beakerBFillColor = fadedWaterColor
        bottomColor = orgColor
        topColor = fadedWaterColor
        progressText = '5. 【高考铁律】关活塞，上层水相由分液漏斗上口倒入烧杯 B (严禁混流)'
      }
    } else {
      // 苯 密度 < 水: 上层苯相, 下层水相
      waterLayerLabel = '下层：水相 (近无色)'
      orgLayerLabel = '上层：苯溶碘相 (橙红色)'
      if (time < 2.0) {
        bottomLevel = 0.35
        topLevel = 0.35
        bottomColor = iodineWaterColor
        topColor = transparentOrganic
        progressText = '1. 装入碘水与无色苯 (ρ(苯) < ρ(水)，浮于上层)'
      } else if (time < 5.2) {
        bottomLevel = 0.35
        topLevel = 0.35
        bottomColor = extractProgress > 0.4 ? fadedWaterColor : iodineWaterColor
        topColor = extractProgress > 0.4 ? orgColor : withAlpha(orgColor, 0.5)
        progressText = isGassing
          ? '2b. 【高考规范】下口朝向斜上方，旋开活塞放气，平衡蒸气压！'
          : '2a. 【双手倒持】右手食指顶住塞子，左手握住活塞，双手握持倒转振摇！'
      } else if (time < 7.8) {
        bottomLevel = 0.35
        topLevel = 0.35
        bottomColor = fadedWaterColor
        topColor = orgColor
        progressText = '3. 放回铁圈静置分层 (上层橙红苯溶碘相，下层水相近无色)'
      } else if (time < 10.0) {
        if (extractionMisoperation === 1) {
          bottomLevel = 0.28
          topLevel = 0.35
          beakerAFillLevel = 0.1
          beakerAFillColor = fadedWaterColor
          bottomColor = fadedWaterColor
          topColor = orgColor
          progressText = '⚠️ 【未拔塞警告】未打开顶部玻璃塞连通大气，内部形成负压，液体停止流出！'
        } else {
          // 下放下层无色水相至烧杯 A
          const flowProg = Math.min(1, (time - 7.8) / 2.2)
          bottomLevel = Math.max(0, 0.35 * (1 - flowProg))
          topLevel = 0.35
          beakerAFillLevel = 0.45 * flowProg
          beakerAFillColor = fadedWaterColor
          bottomColor = fadedWaterColor
          topColor = orgColor
          progressText = '4. 拔开玻璃塞连通大气，开活塞，45°斜切尖嘴贴烧杯内壁下放水相'
        }
      } else {
        // 倒出上层橙红苯相至烧杯 B
        const pourProg = Math.min(1, (time - 10.0) / 2.0)
        bottomLevel = 0
        topLevel = Math.max(0, 0.35 * (1 - pourProg))
        beakerAFillLevel = 0.45
        beakerAFillColor = fadedWaterColor
        beakerBFillLevel = 0.4 * pourProg
        beakerBFillColor = orgColor
        bottomColor = fadedWaterColor
        topColor = orgColor
        progressText = '5. 【高考铁律】关活塞，上层橙红苯相由分液漏斗上口倒入烧杯 B (严禁混流)'
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
      isGassing,
      hasStopper,
      isStopperLifted,
      isValveOpen,
      isTilted,
      isBlocked,
      isEthanolMiscible: isEthanol,
      funnelTransform: {
        x: fx,
        y: fy,
        rotate: fRot,
      },
      waterLayerLabel,
      orgLayerLabel,
      progressText,
    }

    // ─── 2. 蒸馏分馏精细状态推演 (t = 0 ~ 12s) ───
    const tBoil = 76.8 // CCl4 沸点
    const tEnv = 20.0
    // 错操作 1：温度计深入液面，温度测得液体过热沸腾温度 86.5°C 偏高
    const targetBoilTemp = misoperation === 1 ? 86.5 : tBoil
    const heatSpeed = (power / 500) * 14.0 // °C/s
    const currentTemp = Math.min(targetBoilTemp, tEnv + heatSpeed * time)

    const boilTime = Math.max(0, time - (targetBoilTemp - tEnv) / heatSpeed)
    const boilProgress = Math.min(1, boilTime * 0.4)
    const vaporDensity = boilTime > 0 ? Math.min(1, boilTime * 0.28) : 0

    // 错操作 2：冷凝水反向 (上进下出)，冷凝管无法充满水 (仅 35% 满)，冷凝效率大幅降低
    const flowMultiplier = misoperation === 2 ? 0.35 : 1.0
    const waterFillLevel = misoperation === 2 ? 0.35 : 1.0
    const distillateLevel = Math.min(0.6, boilTime * 0.09 * flowMultiplier)

    const thermometerOffsetY = misoperation === 1 ? 32 : 0 // 错操作 1：温度计深入液面
    const isWaterReversed = misoperation === 2 // 错操作 2：冷凝水上进下出
    const hasZeolite = misoperation !== 3 // 错操作 3：未加沸石
    const isBumpWarning = misoperation === 3 && currentTemp >= 68
    const bumpIntensity = isBumpWarning ? Math.min(1, (currentTemp - 65) / 20) : 0

    let distProgressText = '1. 陶土网垫底均匀加热升温 (水银球对准支管口，下进上出满水)'
    if (boilTime > 0) {
      distProgressText = `2. 达沸点平台 (${tBoil}°C)，蒸气经直形冷凝管逆流冷却，馏出液滴入锥形瓶`
    }
    if (isWaterReversed && boilTime > 0) {
      distProgressText = '⚠️ 【冷凝水反向警告】上进下出导致套管无法充满水(有空腔)，冷凝效率骤降！'
    }
    if (misoperation === 1) {
      distProgressText = '⚠️ 【温度计位置错误】水银球深入液面测得液体过热温度，非馏分沸点！'
    }
    if (isBumpWarning) {
      distProgressText = '⚠️ 【暴沸严重警告】未加碎瓷片产生剧烈暴沸！若加热后发现，必须停止加热、冷却后再补加！'
    }

    const distillation: DistillationState = {
      currentTemp,
      targetBoilTemp,
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

    // ─── 3. 预计算固定全量时序图 (Full History 定标) ───
    const maxChartTime = 12
    const chartHistory: Array<{ time: number; val1: number; val2: number }> = []

    for (let t = 0; t <= maxChartTime; t += 0.2) {
      if (experimentMode === 0) {
        // 萃取 c-t: val1: c_aq (水相浓度 mol/L), val2: c_org (有机相浓度 mol/L)
        if (isEthanol) {
          chartHistory.push({ time: t, val1: 0.1, val2: 0 })
        } else {
          const p = Math.min(1, Math.max(0, (t - 2.0) / 3.2))
          const cAq = Math.max(0.005, 0.10 - 0.092 * p * (vSolvent / 20))
          const cOrg = (0.10 - cAq) * (20 / vSolvent)
          chartHistory.push({
            time: t,
            val1: parseFloat(cAq.toFixed(4)),
            val2: parseFloat(cOrg.toFixed(4)),
          })
        }
      } else {
        // 蒸馏 T-t: val1: 温度计测得温度 (°C), val2: 累计馏出量 (mL)
        const temp = Math.min(targetBoilTemp, tEnv + heatSpeed * t)
        const dT = Math.max(0, t - (targetBoilTemp - tEnv) / heatSpeed)
        const vD = Math.min(40, dT * (power / 500) * 5.2 * flowMultiplier)
        chartHistory.push({
          time: t,
          val1: parseFloat(temp.toFixed(1)),
          val2: parseFloat(vD.toFixed(1)),
        })
      }
    }

    return {
      experimentMode,
      extraction,
      distillation,
      chartHistory,
    }
  }, [experimentMode, solvent, extractionMisoperation, misoperation, power, vSolvent, time])
}
