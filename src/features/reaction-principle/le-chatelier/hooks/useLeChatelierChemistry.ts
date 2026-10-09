import { useMemo } from 'react'
import { no2N2o4State } from '@/chemistry'

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

/** 图表预计算的固定物理时间轴：0 → 10.0 s，50 步 */
const CHART_TOTAL_DURATION = 10.0
const CHART_STEPS = 50

/**
 * 勒夏特列原理化学计算 Hook
 * 体系：2NO2 (g, 红棕色) <==> N2O4 (g, 无色) ΔH < 0
 *
 * ── 唯一来源 ──
 * K(T)、物料守恒二次方程、弛豫演化、Qc 与正逆速率的温度依赖全部收敛在
 * `@/chemistry/equilibrium`，本 hook 只负责「屏幕相关的派生量」：
 * 活塞体积比、颜色强度、移动方向判定与图表时间轴。
 * 量面板（data/quantities/reaction-principle/leChatelier.ts）调用同一函数，
 * 保证同一组参数下两处数值完全一致。
 */
export function useLeChatelierChemistry({
  temp,
  pressure,
  addedNO2,
  time,
}: LeChatelierParams): LeChatelierChemistryResult {
  return useMemo(() => {
    // 1. 压强作用：压强倍率增大 -> 体积缩小为 1/pressure（仅用于中屏活塞几何）
    const volumeRatio = Math.max(0.35, Math.min(2.0, 1 / pressure))

    // 2. 当前状态（含 K、浓度、Qc、正逆速率）—— 唯一来源
    const { K, cNO2, cN2O4, Qc, vForward, vReverse } = no2N2o4State(
      temp,
      pressure,
      addedNO2,
      time
    )

    // 3. 判定平衡移动方向
    let shiftDirection: 'forward' | 'reverse' | 'balanced' = 'balanced'
    if (Math.abs(vForward - vReverse) > 0.02) {
      shiftDirection = vForward > vReverse ? 'forward' : 'reverse'
    }

    // 4. 颜色强度（基于 NO2 浓度，NO2 越高颜色越深）
    const colorIntensity = Math.max(0.15, Math.min(1.0, cNO2 / 2.5))

    // 5. 生成固定物理时间轴 (0 到 10.0s) 的恒定演化轨迹
    //    每个采样点走同一条唯一来源，杜绝「图表用一份拟合式、面板用另一份」的老问题
    const history: ChartPoint[] = []
    const tStep = CHART_TOTAL_DURATION / CHART_STEPS
    for (let i = 0; i <= CHART_STEPS; i++) {
      const t = i * tStep
      const s = no2N2o4State(temp, pressure, addedNO2, t)
      history.push({
        time: parseFloat(t.toFixed(2)),
        cNO2: parseFloat(s.cNO2.toFixed(3)),
        cN2O4: parseFloat(s.cN2O4.toFixed(3)),
        vForward: parseFloat(s.vForward.toFixed(3)),
        vReverse: parseFloat(s.vReverse.toFixed(3)),
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
