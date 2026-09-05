import { useMemo } from 'react'
import type {
  NexusParams,
  ReactionSystemConfig,
  EnergyProfilePoint,
  StepBarrierInfo,
  HistoryPoint,
  AlphaTpPoint,
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

  const { eaForward, eaReverse, isMultistep, tsPoints, stepBarriers, rdsIndex } = useMemo(() => {
    let forward = system.baseEaForward
    let reverse = system.baseEaReverse
    let multi = false

    if (params.catalyst === 'catalyst-a') {
      forward *= 0.65
      reverse = forward - system.deltaH
    } else if (params.catalyst === 'catalyst-b') {
      forward *= 0.5
      reverse = forward - system.deltaH
      multi = true
    }

    const points: EnergyProfilePoint[] = []
    const barriers: StepBarrierInfo[] = []
    let rds = 1

    if (!multi) {
      points.push(
        { x: 10, y: 100, label: '反应物' },
        { x: 50, y: 100 + forward, label: 'TS (过渡态)', isTS: true, stepEa: forward, isRDS: true },
        { x: 90, y: 100 + system.deltaH, label: '产物' }
      )
      barriers.push({
        stepIndex: 1,
        fromLabel: '反应物',
        toLabel: 'TS',
        fromY: 100,
        toY: 100 + forward,
        ea: Math.round(forward * 10) / 10,
        isRDS: true,
      })
    } else {
      // 催化剂 B: 两步反应
      // 步1: 反应物 -> TS1 -> 中间体
      // 步2: 中间体 -> TS2 -> 产物
      const step1Ea = Math.round(forward * 0.65 * 10) / 10
      const intermediateY = 100 + step1Ea - 28 // 中间体势能
      const step2Ea = Math.round(forward * 1.15 * 10) / 10 // 步2活化能更大，设为决速步
      const ts2Y = intermediateY + step2Ea
      rds = 2

      points.push(
        { x: 10, y: 100, label: '反应物' },
        { x: 32, y: 100 + step1Ea, label: 'TS1', isTS: true, stepIndex: 1, stepEa: step1Ea, isRDS: false },
        { x: 52, y: intermediateY, label: '中间体' },
        { x: 72, y: ts2Y, label: 'TS2 (决速步)', isTS: true, stepIndex: 2, stepEa: step2Ea, isRDS: true },
        { x: 90, y: 100 + system.deltaH, label: '产物' }
      )

      barriers.push(
        {
          stepIndex: 1,
          fromLabel: '反应物',
          toLabel: 'TS1',
          fromY: 100,
          toY: 100 + step1Ea,
          ea: step1Ea,
          isRDS: false,
        },
        {
          stepIndex: 2,
          fromLabel: '中间体',
          toLabel: 'TS2',
          fromY: intermediateY,
          toY: ts2Y,
          ea: step2Ea,
          isRDS: true,
        }
      )
    }

    return {
      eaForward: Math.round(forward * 10) / 10,
      eaReverse: Math.round(reverse * 10) / 10,
      isMultistep: multi,
      tsPoints: points,
      stepBarriers: barriers,
      rdsIndex: rds,
    }
  }, [system, params.catalyst])

  // 玻尔兹曼分布（当前态与基准态对照，能量尺度标定为 0 ~ 120 kJ/mol）
  const boltzmannData = useMemo(() => {
    const calcDistribution = (T: number, ea: number) => {
      const data: { energy: number; fraction: number; isActivated: boolean }[] = []
      // 麦克斯韦-玻尔兹曼能量分布函数: f(E) ~ (E / (k*T)^1.5) * exp(-E / (k*T))
      // 调节特征能量尺度 parameter kT 使其在 298K 时峰值位于约 25 kJ/mol
      const kT = 0.085 * T // 298K 时 kT ≈ 25.3 kJ/mol; 450K 时 kT ≈ 38.2 kJ/mol
      for (let e = 0; e <= 120; e += 1.5) {
        const x = e / kT
        const f = Math.sqrt(x) * Math.exp(-x) * 1.5
        data.push({
          energy: Math.round(e * 10) / 10,
          fraction: Math.max(0, f),
          isActivated: e >= ea,
        })
      }
      const activatedCount = data.filter((d) => d.isActivated).reduce((acc, d) => acc + d.fraction, 0)
      const totalCount = data.reduce((acc, d) => acc + d.fraction, 0)
      const activatedFraction = totalCount > 0 ? (activatedCount / totalCount) * 100 : 0
      return {
        distribution: data,
        activatedFraction: Math.round(activatedFraction * 10) / 10,
      }
    }

    const current = calcDistribution(params.temperature, eaForward)
    // 基准态：T=298K, 无催化剂下的 baseEaForward
    const baseline = calcDistribution(298, system.baseEaForward)

    return {
      ...current,
      baselineDistribution: baseline.distribution,
      baselineActivatedFraction: baseline.activatedFraction,
      baselineEa: system.baseEaForward,
    }
  }, [params.temperature, eaForward, system.baseEaForward])

  // 范特霍夫方程数据
  const vantHoffData = useMemo(() => {
    const R = 8.314
    const deltaH_J = system.deltaH * 1000
    const points: { invT: number; lnK: number; temp: number }[] = []

    for (let t = 273; t <= 600; t += 20) {
      const invT = 1 / t
      const lnK = -deltaH_J / (R * t) - 12.0
      points.push({
        invT: Math.round(invT * 10000) / 10000,
        lnK: Math.round(lnK * 100) / 100,
        temp: t,
      })
    }
    const currentLnK = -deltaH_J / (R * params.temperature) - 12.0
    const currentKc = Math.exp(currentLnK)

    return {
      points,
      currentLnK: Math.round(currentLnK * 100) / 100,
      currentKc: Math.round(currentKc * 1000) / 1000,
    }
  }, [system, params.temperature])

  // 平衡转化率 α - T - P 双因素图数据（定一议二探究）
  const alphaTpData = useMemo(() => {
    const points: AlphaTpPoint[] = []

    // 计算理论平衡转化率 α (随温度升高，放热反应 α 单调降低；加压向分子数减少移动，α 增大)
    // 经验热力学拟合模型: α(T, P) = 1 / [1 + exp((T - T_mid) / width) * (P_ref / P)^beta]
    const tMid = system.defaultTemp + 30
    const width = 60

    for (let t = 250; t <= 600; t += 15) {
      // 压强 P1 = 1.0 atm (低压), P2 = 3.5 atm (高压)
      // 正反应是气体减少反应 (gasMolesDiff < 0)，因此压强越高，转化率越大
      const termT = (t - tMid) / width
      const alphaLow = 100 / (1 + Math.exp(termT) * 1.5)
      const alphaHigh = 100 / (1 + Math.exp(termT) * 0.5)

      points.push({
        temperature: t,
        alphaLowP: Math.round(Math.min(98, Math.max(2, alphaLow)) * 10) / 10,
        alphaHighP: Math.round(Math.min(99, Math.max(5, alphaHigh)) * 10) / 10,
      })
    }

    // 当前参数下的理论转化率
    const termCurT = (params.temperature - tMid) / width
    const pRatio = 1.0 / Math.max(0.2, params.pressure)
    const curAlpha = 100 / (1 + Math.exp(termCurT) * Math.pow(pRatio, 0.7))

    return {
      points,
      currentAlpha: Math.round(Math.min(99, Math.max(2, curAlpha)) * 10) / 10,
      lowPressureLabel: 'P₁ = 1.0 atm (常压)',
      highPressureLabel: 'P₂ = 3.5 atm (加压)',
    }
  }, [system, params.temperature, params.pressure])

  // 勒夏特列移动与速率时间轴
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
        if (params.catalyst !== 'none') {
          // 加入催化剂：正逆反应速率瞬间同等倍数突增，vF = vR，平衡不移动！
          const catBoost = params.catalyst === 'catalyst-b' ? 2.5 : 1.8
          vF *= catBoost
          vR *= catBoost
        } else if (params.addedReactant > 0) {
          // 突加反应物：cReactant 瞬增，vF 瞬增，vR 瞬间不变！
          cReactant += params.addedReactant
          vF *= 1 + params.addedReactant * 0.8
        } else if (params.temperature !== system.defaultTemp) {
          // 升降温：吸放热差异响应
          const factor = (params.temperature - system.defaultTemp) / 100
          vF = Math.max(0.05, vF + 0.8 * factor)
          vR = Math.max(0.05, vR + 1.4 * factor)
        } else if (params.pressure !== system.defaultPressure) {
          // 增减压：气体减小反应正逆均突变
          const pFactor = params.pressure / system.defaultPressure
          vF *= pFactor * pFactor
          vR *= pFactor
        } else if (params.inertGasMode === 'constant-p') {
          // 恒温恒压充惰性气体：体积膨胀，各组分分压骤减
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
    stepBarriers,
    rdsIndex,
    boltzmannData,
    vantHoffData,
    alphaTpData,
    history,
  }
}

