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
    const calcDistribution = (T: number, ea: number) => {
      const data: { energy: number; fraction: number; isActivated: boolean }[] = []
      // 麦克斯韦-玻尔兹曼能量分布函数: f(E) ~ √(E/(kT)) · exp(-E/(kT))
      // 注：为让曲线在 0~120 kJ/mol 的横轴上完整展开（真实 kT(298 K) ≈ 2.48 kJ/mol，
      // 曲线会全部挤在 5 kJ/mol 以内而无法读图），此处 kT 采用**教学标定尺度** 0.085·T，
      // 即 298 K → kT ≈ 25.3 kJ/mol。
      // 该分布的极大值点严格在 E = kT/2 处：298 K 时 ≈ 12.7 kJ/mol（不是 25.3）。
      const kT = 0.085 * T
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
        // 分布峰值能量 E_peak = kT/2（可由 d/dE [√x·e^{-x}] = 0 ⇒ x = 1/2 严格导出）
        peakEnergy: Math.round((kT / 2) * 10) / 10,
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

  // 范特霍夫方程数据（lnK = -ΔH/(RT) + ΔS/R）
  const vantHoffData = useMemo(() => {
    const R = 8.314
    const deltaH_J = system.deltaH * 1000
    // 截距 C = ΔS°/R：由 ΔG° = ΔH° - TΔS° 与 ΔG° = -RT·lnK 联立消去 ΔG° 得到，
    // 故 lnK = -ΔH°/(RT) + ΔS°/R。此前硬编码 -12 与三体系真实 ΔS° 均不符，使 Kc 量级失真。
    const intercept = system.deltaS / R
    const points: { invT: number; lnK: number; temp: number }[] = []

    for (let t = 273; t <= 600; t += 20) {
      const invT = 1 / t
      const lnK = -deltaH_J / (R * t) + intercept
      points.push({
        invT: Math.round(invT * 10000) / 10000,
        lnK: Math.round(lnK * 100) / 100,
        temp: t,
      })
    }
    const currentLnK = -deltaH_J / (R * params.temperature) + intercept
    const currentKc = Math.exp(currentLnK)

    return {
      points,
      currentLnK: Math.round(currentLnK * 100) / 100,
      currentKc: Math.round(currentKc * 1000) / 1000,
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

    for (let t = 250; t <= 600; t += 15) {
      // 正反应是气体减少反应 (gasMolesDiff < 0)，因此压强越高，转化率越大
      // 采用统一物理模型：α(T, P) = 100 / [1 + exp((T - T_mid) / width) · (P_ref / P)^β]，杜绝当前点悬空
      const termT = (t - tMid) / width
      const alphaLow = 100 / (1 + Math.exp(termT) * Math.pow(P_REF / P_LOW, beta))
      const alphaHigh = 100 / (1 + Math.exp(termT) * Math.pow(P_REF / P_HIGH, beta))

      // clamp 只用于把曲线限制在坐标轴可视区内，不参与物理计算；
      // 两条曲线的下限刻意不同（低压线可低至 2%，高压线最低 5%），以保留"同温下高压线更高"的可读区分度。
      points.push({
        temperature: t,
        alphaLowP: Math.round(Math.min(98, Math.max(2, alphaLow)) * 10) / 10,
        alphaHighP: Math.round(Math.min(99, Math.max(5, alphaHigh)) * 10) / 10,
      })
    }

    // 当前参数下的理论转化率（与上面两条曲线共用同一函数式，仅 P 取自滑块，故 P = P_LOW 时必与低压线重合）
    const termCurT = (params.temperature - tMid) / width
    const pRatio = P_REF / Math.max(0.2, params.pressure)
    const curAlpha = 100 / (1 + Math.exp(termCurT) * Math.pow(pRatio, beta))

    return {
      points,
      currentAlpha: Math.round(Math.min(99, Math.max(2, curAlpha)) * 10) / 10,
      lowPressureLabel: `P₁ = ${P_LOW.toFixed(1)} atm (常压)`,
      highPressureLabel: `P₂ = ${P_HIGH.toFixed(1)} atm (加压)`,
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
        // 浓度变化量之比 = 化学计量数之比：Δc(产物) = Δc(反应物) × ν(产物)/ν(反应物)
        const dC = 0.05 * (1 - decay)
        const stoichRatio = system.cProductPerCReactant
        if (vF > vR) {
          const gap = vF - vR
          vF -= gap * 0.2 * (1 - decay)
          vR += gap * 0.2 * (1 - decay)
          cReactant = Math.max(0, cReactant - dC)
          cProduct += dC * stoichRatio
        } else if (vR > vF) {
          const gap = vR - vF
          vF += gap * 0.2 * (1 - decay)
          vR -= gap * 0.2 * (1 - decay)
          cReactant += dC
          cProduct = Math.max(0, cProduct - dC * stoichRatio)
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

