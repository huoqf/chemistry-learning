import { useMemo } from 'react'
import type {
  NexusParams,
  ReactionSystemConfig,
  EnergyProfilePoint,
  HistoryPoint,
} from '../types'

export const REACTION_SYSTEMS: Record<string, ReactionSystemConfig> = {
  'no2-n2o4': {
    id: 'no2-n2o4',
    name: '2NO₂(g) ⇌ N₂O₄(g)',
    equation: '2NO_2(g) \\rightleftharpoons N_2O_4(g)',
    deltaH: -57.2,
    baseEaForward: 40.0,
    baseEaReverse: 97.2,
    gasMolesDiff: -1,
    defaultTemp: 298,
    defaultPressure: 1.0,
  },
  'nh3-synthesis': {
    id: 'nh3-synthesis',
    name: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)',
    equation: 'N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g)',
    deltaH: -92.4,
    baseEaForward: 176.0,
    baseEaReverse: 268.4,
    gasMolesDiff: -2,
    defaultTemp: 400,
    defaultPressure: 2.0,
  },
  'methanol-synthesis': {
    id: 'methanol-synthesis',
    name: 'CO(g) + 2H₂(g) ⇌ CH₃OH(g)',
    equation: 'CO(g) + 2H_2(g) \\rightleftharpoons CH_3OH(g)',
    deltaH: -90.5,
    baseEaForward: 110.0,
    baseEaReverse: 200.5,
    gasMolesDiff: -2,
    defaultTemp: 350,
    defaultPressure: 1.5,
  },
}

export function useReactionPrincipleChemistry(params: NexusParams) {
  const system = REACTION_SYSTEMS[params.reactionId] || REACTION_SYSTEMS['no2-n2o4']

  const { eaForward, eaReverse, isMultistep, tsPoints } = useMemo(() => {
    let forward = system.baseEaForward
    let reverse = system.baseEaReverse
    let multi = false

    if (params.catalyst === 'catalyst-a') {
      forward *= 0.65
      // 催化剂同等降低正逆反应活化能，不改变反应热: Ea(逆) = Ea(正) - ΔH (ΔH < 0 时为 + |ΔH|)
      reverse = forward - system.deltaH
    } else if (params.catalyst === 'catalyst-b') {
      forward *= 0.5
      reverse = forward - system.deltaH
      multi = true
    }

    const points: EnergyProfilePoint[] = []
    if (!multi) {
      points.push(
        { x: 10, y: 100, label: '反应物' },
        { x: 50, y: 100 + forward, label: 'TS (过渡态)', isTS: true },
        { x: 90, y: 100 + system.deltaH, label: '产物' }
      )
    } else {
      const step1Ea = forward * 0.7
      const step2Ea = forward * 1.1
      points.push(
        { x: 10, y: 100, label: '反应物' },
        { x: 35, y: 100 + step1Ea, label: 'TS1', isTS: true },
        { x: 50, y: 100 + step1Ea - 20, label: '中间体' },
        { x: 70, y: 100 + step1Ea - 20 + step2Ea, label: 'TS2 (决速步)', isTS: true },
        { x: 90, y: 100 + system.deltaH, label: '产物' }
      )
    }

    return {
      eaForward: Math.round(forward * 10) / 10,
      eaReverse: Math.round(reverse * 10) / 10,
      isMultistep: multi,
      tsPoints: points,
    }
  }, [system, params.catalyst])

  const boltzmannData = useMemo(() => {
    const data: { energy: number; fraction: number; isActivated: boolean }[] = []
    const T = params.temperature
    const thresholdEa = eaForward

    for (let e = 0; e <= 180; e += 2) {
      const f = (e / (0.015 * T)) * Math.exp(-e / (0.012 * T))
      data.push({
        energy: e,
        fraction: Math.max(0, f),
        isActivated: e >= thresholdEa,
      })
    }
    const activatedCount = data.filter((d) => d.isActivated).reduce((acc, d) => acc + d.fraction, 0)
    const totalCount = data.reduce((acc, d) => acc + d.fraction, 0)
    const activatedFraction = totalCount > 0 ? (activatedCount / totalCount) * 100 : 0

    return {
      distribution: data,
      activatedFraction: Math.round(activatedFraction * 10) / 10,
    }
  }, [params.temperature, eaForward])

  const vantHoffData = useMemo(() => {
    const R = 8.314
    const deltaH_J = system.deltaH * 1000
    const points: { invT: number; lnK: number; temp: number }[] = []

    // 范特霍夫方程: ln K = -ΔH/(R*T) + C，其中常数 C = ΔS/R
    for (let t = 273; t <= 600; t += 20) {
      const invT = 1 / t
      const lnK = (-deltaH_J / (R * t)) - 12.0
      points.push({
        invT: Math.round(invT * 10000) / 10000,
        lnK: Math.round(lnK * 100) / 100,
        temp: t,
      })
    }
    const currentLnK = (-deltaH_J / (R * params.temperature)) - 12.0
    const currentKc = Math.exp(currentLnK)

    return {
      points,
      currentLnK: Math.round(currentLnK * 100) / 100,
      currentKc: Math.round(currentKc * 1000) / 1000,
    }
  }, [system, params.temperature])

  const history = useMemo(() => {
    const points: HistoryPoint[] = []
    const MAX_TIME = 10
    const dt = 0.2

    let cReactant = 2.0
    let cProduct = 1.0
    let vF = 1.0
    let vR = 1.0

    const perturbTime = 4.0

    for (let t = 0; t <= MAX_TIME; t += dt) {
      const timeRound = Math.round(t * 10) / 10

      if (timeRound < perturbTime) {
        vF = 1.0
        vR = 1.0
      } else if (timeRound === perturbTime) {
        if (params.addedReactant > 0) {
          cReactant += params.addedReactant
          vF *= 1 + params.addedReactant * 0.8
        } else if (params.temperature !== system.defaultTemp) {
          // 放热反应 (ΔH < 0):
          // 升温 (factor > 0): vF 与 vR 均增大，但吸热方向(逆反应)增大幅度更大 (1.4 > 0.8) => vR > vF，平衡逆移
          // 降温 (factor < 0): vF 与 vR 均减小，但吸热方向(逆反应)减小幅度更大 => vF > vR，平衡正移
          const factor = (params.temperature - system.defaultTemp) / 100
          vF = Math.max(0.05, vF + 0.8 * factor)
          vR = Math.max(0.05, vR + 1.4 * factor)
        } else if (params.pressure !== system.defaultPressure) {
          // 体系反应均为气体分子数减小反应 (gasMolesDiff < 0):
          // 增压 (pFactor > 1): 正反应(更高分子数)速率增长比率高于逆反应 (pFactor^2 > pFactor) => vF > vR，平衡正移
          // 减压 (pFactor < 1): 正反应速率下降更快 => vF < vR，平衡逆移
          const pFactor = params.pressure / system.defaultPressure
          vF *= pFactor * pFactor
          vR *= pFactor
        } else if (params.inertGasMode === 'constant-p') {
          // 恒温恒压充入惰性气体: 容器体积膨胀，各组分分压等效减压，平衡向气体分子数增大的逆方向移动 => vF < vR
          vF *= 0.5
          vR *= 0.7
        }
      } else {
        const decay = Math.exp(-(timeRound - perturbTime) * 0.8)
        if (vF > vR) {
          const gap = vF - vR
          vF -= gap * 0.2 * (1 - decay)
          vR += gap * 0.2 * (1 - decay)
          cReactant -= 0.05 * (1 - decay)
          cProduct += 0.05 * (1 - decay)
        } else if (vR > vF) {
          const gap = vR - vF
          vF += gap * 0.2 * (1 - decay)
          vR -= gap * 0.2 * (1 - decay)
          cReactant += 0.05 * (1 - decay)
          cProduct -= 0.05 * (1 - decay)
        }
      }

      points.push({
        time: timeRound,
        vForward: Math.round(vF * 100) / 100,
        vReverse: Math.round(vR * 100) / 100,
        cReactant: Math.round(cReactant * 100) / 100,
        cProduct: Math.round(cProduct * 100) / 100,
      })
    }

    return points
  }, [params, system])

  return {
    system,
    eaForward,
    eaReverse,
    isMultistep,
    tsPoints,
    boltzmannData,
    vantHoffData,
    history,
  }
}
