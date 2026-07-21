import { useMemo } from 'react'

export interface LeChatelierParams {
  temp: number       // 温度 K (如 298 ~ 398 K)
  pressure: number   // 压强相对倍率 (如 0.5 ~ 3.0)
  addedNO2: number   // 外加 NO2 浓度 (mol/L)
  time: number       // 动画演化时间 s
}

export interface ChartPoint {
  time: number
  cNO2: number
  cN2O4: number
  vForward: number
  vReverse: number
}

export interface LeChatelierChemistryResult {
  /** NO2 当前浓度 (mol/L) */
  cNO2: number
  /** N2O4 当前浓度 (mol/L) */
  cN2O4: number
  /** 当前温度下平衡常数 K */
  K: number
  /** 当前浓度商 Qc */
  Qc: number
  /** 正反应速率 v_正 */
  vForward: number
  /** 逆反应速率 v_逆 */
  vReverse: number
  /** 体系红棕色深浅强度 (0.1 ~ 1.0) */
  colorIntensity: number
  /** 活塞体积比例 (0.33 ~ 2.0) */
  volumeRatio: number
  /** 平衡移动方向: 'forward' | 'reverse' | 'balanced' */
  shiftDirection: 'forward' | 'reverse' | 'balanced'
  /** 历史/实时序列（供图表渲染） */
  history: ChartPoint[]
}

/**
 * 勒夏特列原理化学计算 Hook
 * 体系：2NO2 (g, 红棕色) <==> N2O4 (g, 无色) ΔH < 0
 */
export function useLeChatelierChemistry({
  temp,
  pressure,
  addedNO2,
  time,
}: LeChatelierParams): LeChatelierChemistryResult {
  return useMemo(() => {
    // 1. 基准参数 (298 K, 1 atm)
    const T0 = 298
    const K0 = 2.0 // 298 K 下的基准 K
    const deltaH_over_R = 2000 // ΔH/R 对应放热反应

    // 2. 根据温度计算当前平衡常数 K(T) —— 放热反应 ΔH < 0，升温 K 减小
    const K = parseFloat((K0 * Math.exp(deltaH_over_R * (1 / temp - 1 / T0))).toFixed(3))

    // 3. 压强作用：压强倍率增大 -> 体积缩小为 1/pressure
    const volumeRatio = Math.max(0.35, Math.min(2.0, 1 / pressure))

    // 4. 计算最终到达新平衡时的平衡目标浓度 c_eq
    // 平衡条件：N2O4 / (NO2)^2 = K
    // 设总 N 原子当量基数：
    const totalEquiv = (1.5 + addedNO2) * pressure
    // K * cNO2^2 + cNO2 - totalEquiv = 0
    // 一元二次方程解 cNO2
    const a = K
    const b = 1
    const c = -totalEquiv
    const eqNO2 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a)
    const eqN2O4 = K * eqNO2 * eqNO2

    // 5. 干扰初态浓度
    const initNO2 = (1.0 + addedNO2) * pressure
    const initN2O4 = 0.5 * pressure

    // 6. 随时间推进弛豫演化 (指数趋近平衡)
    const kRelax = 0.6 // 弛豫速率常数
    const alpha = Math.exp(-kRelax * time)

    const cNO2 = Math.max(0.01, eqNO2 + (initNO2 - eqNO2) * alpha)
    const cN2O4 = Math.max(0.01, eqN2O4 + (initN2O4 - eqN2O4) * alpha)

    // 7. 计算浓度商 Qc 与正逆反应速率
    const Qc = cN2O4 / (cNO2 * cNO2)
    const kf = 0.8
    const kr = kf / K
    const vForward = kf * cNO2 * cNO2
    const vReverse = kr * cN2O4

    // 8. 判定平衡移动方向
    let shiftDirection: 'forward' | 'reverse' | 'balanced' = 'balanced'
    if (Math.abs(vForward - vReverse) > 0.02) {
      shiftDirection = vForward > vReverse ? 'forward' : 'reverse'
    }

    // 9. 颜色强度（基于 NO2 浓度，NO2 越高颜色越深）
    const colorIntensity = Math.max(0.15, Math.min(1.0, cNO2 / 2.5))

    // 10. 生成固定物理时间轴 (0 到 10.0s) 的恒定演化轨迹
    const history: ChartPoint[] = []
    const totalDuration = 10.0
    const steps = 50
    const tStep = totalDuration / steps
    for (let i = 0; i <= steps; i++) {
      const t = i * tStep
      const a_t = Math.exp(-kRelax * t)
      const cNO2_t = Math.max(0.01, eqNO2 + (initNO2 - eqNO2) * a_t)
      const cN2O4_t = Math.max(0.01, eqN2O4 + (initN2O4 - eqN2O4) * a_t)
      const vF_t = kf * cNO2_t * cNO2_t
      const vR_t = kr * cN2O4_t
      history.push({
        time: parseFloat(t.toFixed(2)),
        cNO2: parseFloat(cNO2_t.toFixed(3)),
        cN2O4: parseFloat(cN2O4_t.toFixed(3)),
        vForward: parseFloat(vF_t.toFixed(3)),
        vReverse: parseFloat(vR_t.toFixed(3)),
      })
    }

    return {
      cNO2: parseFloat(cNO2.toFixed(3)),
      cN2O4: parseFloat(cN2O4.toFixed(3)),
      K,
      Qc: parseFloat(Qc.toFixed(3)),
      vForward: parseFloat(vForward.toFixed(3)),
      vReverse: parseFloat(vReverse.toFixed(3)),
      colorIntensity,
      volumeRatio,
      shiftDirection,
      history,
    }
  }, [temp, pressure, addedNO2, time])
}
