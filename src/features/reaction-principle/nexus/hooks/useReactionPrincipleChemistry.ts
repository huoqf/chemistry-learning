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
    deltaS: -175.8, // 298 K 文献值：304.4 - 2×240.1
    baseEaForward: 40.0,
    baseEaReverse: 97.2,
    gasMolesDiff: -1,
    cProductPerCReactant: 0.5, // 2NO₂ → N₂O₄：反应物减 2 份，产物只增 1 份
    defaultTemp: 298,
    defaultPressure: 1.0,
  },
  'nh3-synthesis': {
    id: 'nh3-synthesis',
    name: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)',
    equation: 'N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g)',
    deltaH: -92.4,
    deltaS: -198.1, // 298 K 文献值：2×192.8 - (191.6 + 3×130.7)
    baseEaForward: 176.0,
    baseEaReverse: 268.4,
    gasMolesDiff: -2,
    cProductPerCReactant: 2, // N₂ → 2NH₃：反应物(N₂)减 1 份，产物(NH₃)增 2 份
    defaultTemp: 400,
    defaultPressure: 2.0,
  },
  'methanol-synthesis': {
    id: 'methanol-synthesis',
    name: 'CO(g) + 2H₂(g) ⇌ CH₃OH(g)',
    equation: 'CO(g) + 2H_2(g) \\rightleftharpoons CH_3OH(g)',
    deltaH: -90.5,
    deltaS: -219.3, // 298 K 文献值：239.8 - (197.7 + 2×130.7)
    baseEaForward: 110.0,
    baseEaReverse: 200.5,
    gasMolesDiff: -2,
    cProductPerCReactant: 1, // CO → CH₃OH：反应物与产物按 1:1 变化
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
      // 步1: 反应物(100) -> TS1(113) -> 中间体(98)
      // 步2: 中间体(98) -> TS2(121, 决速步最高峰) -> 产物
      const step1Ea = Math.round(forward * 0.32 * 10) / 10 // 步1活化能较小 (约 13 kJ/mol)
      const intermediateY = 98 // 活性中间体势能
      const step2Ea = Math.round(forward * 0.58 * 10) / 10 // 步2活化能最大 (约 23 kJ/mol，决速步)
      const ts2Y = intermediateY + step2Ea
      forward = ts2Y - 100 // 表观活化能精确等于最高峰与反应物能量差
      reverse = forward - system.deltaH
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

  // 玻尔兹曼分布（当前态与基准态对照）
  const boltzmannData = useMemo(() => {
    const maxEnergy = Math.max(
      120,
      Math.ceil((Math.max(eaForward, system.baseEaForward) + 40) / 20) * 20
    )
    const calcDistribution = (T: number, ea: number) => {
      const data: { energy: number; fraction: number; isActivated: boolean }[] = []
      // 麦克斯韦-玻尔兹曼能量分布函数: f(E) ~ √(E/(kT)) · exp(-E/(kT))
      // 注：为让曲线在可视横轴上完整展开（真实 kT(298 K) ≈ 2.48 kJ/mol，
      // 曲线会全部挤在 5 kJ/mol 以内而无法读图），此处 kT 采用**教学标定尺度** 0.085·T，
      // 即 298 K → kT ≈ 25.3 kJ/mol（高温高活化能反应如合成氨自动按 Ea 扩展横轴）。
      // 该分布的极大值点严格在 E = kT/2 处：298 K 时 ≈ 12.7 kJ/mol。
      const kT = 0.085 * T
      for (let e = 0; e <= maxEnergy; e += 1.5) {
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
        // 分布峰值能量 E_peak = kT/2（可由 d/dE [√x·e^{-x}] = 0 ⇒ x = 1/2 严格导出）
        peakEnergy: Math.round((kT / 2) * 10) / 10,
      }
    }

    const current = calcDistribution(params.temperature, eaForward)
    // 基准态：取各体系自身默认温度下、无催化剂时的 baseEaForward
    const baseline = calcDistribution(system.defaultTemp, system.baseEaForward)

    return {
      ...current,
      baselineDistribution: baseline.distribution,
      baselineActivatedFraction: baseline.activatedFraction,
      baselineEa: system.baseEaForward,
    }
  }, [params.temperature, eaForward, system.baseEaForward, system.defaultTemp])

  // 范特霍夫方程数据（lnK = -ΔH/(RT) + ΔS/R）
  const vantHoffData = useMemo(() => {
    const R = 8.314
    const deltaH_J = system.deltaH * 1000
    // 截距 C = ΔS°/R：由 ΔG° = ΔH° - TΔS° 与 ΔG° = -RT·lnK 联立消去 ΔG° 得到，
    // 故 lnK = -ΔH°/(RT) + ΔS°/R。
    const intercept = system.deltaS / R
    const points: { invT: number; lnK: number; temp: number }[] = []

    for (let t = 250; t <= 600; t += 10) {
      const invT = 1 / t
      const lnK = -deltaH_J / (R * t) + intercept
      points.push({
        invT: Math.round(invT * 10000) / 10000,
        lnK: Math.round(lnK * 100) / 100,
        temp: t,
      })
    }
    const currentLnK = -deltaH_J / (R * params.temperature) + intercept
    const currentK = Math.exp(currentLnK)
    const currentKNum = Number.isFinite(currentK) ? Number(currentK.toPrecision(4)) : currentK
    const currentKDisplay =
      !Number.isFinite(currentK)
        ? '∞'
        : currentK >= 1e4 || (currentK > 0 && currentK < 1e-3)
        ? currentK.toExponential(2)
        : currentK >= 100
        ? currentK.toFixed(1)
        : currentK.toPrecision(3)

    return {
      points,
      currentLnK: Math.round(currentLnK * 100) / 100,
      currentK: currentKNum,
      currentKDisplay,
      intercept: Math.round(intercept * 100) / 100,
    }
  }, [system, params.temperature])

  // 平衡转化率 α - T - P 双因素图数据（定一议二探究）
  const alphaTpData = useMemo(() => {
    const points: AlphaTpPoint[] = []

    // 计算理论平衡转化率 α (随温度升高，放热反应 α 单调降低；加压向分子数减少移动，α 增大)
    // 经验热力学拟合模型: α(T, P) = 100 / [1 + exp((T - T_mid) / width) · (P_ref / P)^β]
    const tMid = system.defaultTemp + 30
    const width = 60
    const beta = 0.7
    const P_REF = 1.0
    // 两条对照曲线的压强：必须与 lowPressureLabel / highPressureLabel 一字对应（同一常量驱动，杜绝"标签与公式脱钩"）
    const P_LOW = 1.0
    const P_HIGH = 3.5

    const calcClamped = (t: number, p: number, minFloor: number, maxCeil: number) => {
      const termT = (t - tMid) / width
      const raw = 100 / (1 + Math.exp(termT) * Math.pow(P_REF / Math.max(0.2, p), beta))
      return Math.round(Math.min(maxCeil, Math.max(minFloor, raw)) * 10) / 10
    }

    for (let t = 250; t <= 600; t += 15) {
      points.push({
        temperature: t,
        alphaLowP: calcClamped(t, P_LOW, 2, 98),
        alphaHighP: calcClamped(t, P_HIGH, 5, 99),
      })
    }

    return {
      points,
      currentAlpha: calcClamped(params.temperature, params.pressure, 2, 99),
      currentAlphaLowP: calcClamped(params.temperature, P_LOW, 2, 98),
      currentAlphaHighP: calcClamped(params.temperature, P_HIGH, 5, 99),
      lowPressureLabel: `P₁ = ${P_LOW.toFixed(1)} atm (常压)`,
      highPressureLabel: `P₂ = ${P_HIGH.toFixed(1)} atm (加压)`,
    }
  }, [system, params.temperature, params.pressure])

  // 勒夏特列移动与速率时间轴（支持多扰动并发叠加，且按反应计量差 δng 与 ΔH 自适应计算）
  const history = useMemo(() => {
    const points: HistoryPoint[] = []
    const MAX_TIME = 10
    const dt = 0.2

    const c0Reactant = 2.0
    let cReactant = c0Reactant
    let cProduct = 1.0
    let vF = 1.0
    let vR = 1.0
    let minReactantAfterPerturb = 0

    const perturbTime = 4.0

    for (let t = 0; t <= MAX_TIME; t += dt) {
      const timeRound = Math.round(t * 10) / 10

      if (timeRound < perturbTime) {
        vF = 1.0
        vR = 1.0
      } else if (timeRound === perturbTime) {
        // 1. 催化剂（同等倍数提升正逆速率，不改变平衡）
        if (params.catalyst !== 'none') {
          const catBoost = params.catalyst === 'catalyst-b' ? 2.5 : 1.8
          vF *= catBoost
          vR *= catBoost
        }
        // 2. 突加反应物（cReactant 瞬增、vF 瞬增，vR 瞬间不变）
        if (params.addedReactant > 0) {
          cReactant += params.addedReactant
          minReactantAfterPerturb = Math.max(
            minReactantAfterPerturb,
            c0Reactant + params.addedReactant * 0.25
          )
          vF *= 1 + params.addedReactant * 0.8
        }
        // 3. 升降温（放热反应升温逆速率增长更大；吸热则正速率增长更大）
        if (params.temperature !== system.defaultTemp) {
          const factor = (params.temperature - system.defaultTemp) / 100
          const isEndothermic = system.deltaH > 0
          vF *= Math.exp((isEndothermic ? 1.2 : 0.6) * factor)
          vR *= Math.exp((isEndothermic ? 0.6 : 1.2) * factor)
        }
        // 4. 增减压（依据 Δng 确定正逆反应气态分子数敏感度）
        if (params.pressure !== system.defaultPressure) {
          const pFactor = params.pressure / system.defaultPressure
          cReactant *= pFactor
          cProduct *= pFactor
          if (pFactor > 1 && system.gasMolesDiff < 0) {
            minReactantAfterPerturb = Math.max(
              minReactantAfterPerturb,
              c0Reactant + (cReactant - c0Reactant) * 0.4
            )
          }
          const forwardOrder = system.gasMolesDiff < 0 ? 1 - system.gasMolesDiff : 1
          const reverseOrder = system.gasMolesDiff > 0 ? 1 + system.gasMolesDiff : 1
          vF *= Math.pow(pFactor, Math.min(2.4, forwardOrder))
          vR *= Math.pow(pFactor, Math.min(2.4, reverseOrder))
        }
        // 5. 恒温恒压充惰性气体（等效体系体积加倍、各气态组分分压降为 0.5 倍）
        if (params.inertGasMode === 'constant-p') {
          cReactant *= 0.5
          cProduct *= 0.5
          const dilute = 0.5
          const forwardOrder = system.gasMolesDiff < 0 ? 1 - system.gasMolesDiff : 1
          const reverseOrder = system.gasMolesDiff > 0 ? 1 + system.gasMolesDiff : 1
          vF *= Math.pow(dilute, Math.min(2.4, forwardOrder) * 0.5)
          vR *= Math.pow(dilute, Math.min(2.4, reverseOrder) * 0.5)
        }
      } else {
        // 趋向新平衡的弛豫阶段：正逆速率差指数衰减直至 v'正 = v'逆
        const gap = Math.abs(vF - vR)
        const stoichRatio = system.cProductPerCReactant
        const stepFactor = 0.3
        const dC = Math.min(0.06, (gap / Math.max(vF, vR, 1)) * 0.12)
        if (vF > vR + 1e-4) {
          const dv = (vF - vR) * stepFactor
          vF -= dv * 0.55
          vR += dv * 0.45
          const nextReactant = Math.max(minReactantAfterPerturb, cReactant - dC)
          const actualDelta = cReactant - nextReactant
          cReactant = nextReactant
          cProduct += actualDelta * stoichRatio
        } else if (vR > vF + 1e-4) {
          const dv = (vR - vF) * stepFactor
          vF += dv * 0.45
          vR -= dv * 0.55
          const nextProduct = Math.max(0.05, cProduct - dC * stoichRatio)
          const actualDeltaProd = cProduct - nextProduct
          cProduct = nextProduct
          cReactant += actualDeltaProd / stoichRatio
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
