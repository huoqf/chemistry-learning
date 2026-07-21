import { useMemo } from 'react'

export interface UseElectrochemicalApplicationChemistryParams {
  /** 电路电流 I (A) */
  current: number
  /** 初始电解质浓度 (mol/L) */
  c0: number
  /** 模式: 0-盐桥原电池, 1-膜电解池, 2-串联池 */
  mode: number
  /** 交换膜类型: 0-阳离子膜, 1-阴离子膜, 2-质子交换膜 */
  membraneType: number
  /** 演化时间 t (s) */
  time: number
}

export interface ElectrochemicalApplicationChemistryResult {
  /** 转移电子物质的量 n(e⁻) (mol) */
  ne: number
  /** 阳(负)极质量变化 Δm (g) */
  anodeMassDelta: number
  /** 阴(正)极质量变化 Δm (g) */
  cathodeMassDelta: number
  /** 溶液 pH 值 */
  pH: number
  /** 电子在导线上的流动相位 0~1 */
  electronPhase: number
  /** 阴阳离子定向迁移相位 0~1 */
  ionPhase: number
  /** 阴极产生气体速率标识 (针对电解池模式) */
  cathodeGasBubbleRate: number
  /** 阳极产生气体速率标识 (针对电解池模式) */
  anodeGasBubbleRate: number
  /** 阳极产生气体名称 */
  anodeGasName: string
  /** 阴极产生气体名称 */
  cathodeGasName: string
  /** 穿膜/迁移离子符号 */
  membraneIonSymbol: string
}

/**
 * 计算电化学综合应用系统的物理化学状态
 *
 * @param current - 电路电流 (A)
 * @param c0 - 初始电解质浓度 (mol/L)
 * @param mode - 系统模式 (0: 盐桥原电池, 1: 膜电解池, 2: 串联池)
 * @param membraneType - 膜类型 (0: 阳离子膜, 1: 阴离子膜, 2: 质子膜)
 * @param time - 时间 (s)
 */
export function useElectrochemicalApplicationChemistry({
  current,
  c0,
  mode,
  membraneType,
  time,
}: UseElectrochemicalApplicationChemistryParams): ElectrochemicalApplicationChemistryResult {
  return useMemo(() => {
    const F = 96485 // 法拉第常数 C/mol
    // 映射动画时间 -> 真实物理时间系数
    const ne = (current * time * 50) / F

    let anodeMassDelta = 0
    let cathodeMassDelta = 0
    let pH = 7.0
    let cathodeGasBubbleRate = 0
    let anodeGasBubbleRate = 0
    let anodeGasName = ''
    let cathodeGasName = ''
    let membraneIonSymbol = 'K⁺ / NO₃⁻'

    if (mode === 0) {
      // 0: 双池盐桥原电池 (Zn - Cu)
      // 负极 Zn 溶解: Zn - 2e- = Zn2+, M(Zn) = 65.38
      anodeMassDelta = -(ne * 0.5 * 65.38)
      // 正极 Cu 析出: Cu2+ + 2e- = Cu, M(Cu) = 63.55
      cathodeMassDelta = ne * 0.5 * 63.55
      pH = 7.0
      membraneIonSymbol = 'K⁺ / NO₃⁻'
    } else if (mode === 1) {
      // 1: 离子交换膜电解池
      cathodeGasBubbleRate = current * 0.8
      anodeGasBubbleRate = current * 0.8
      cathodeGasName = 'H₂ 气体↑'

      if (membraneType === 0) {
        // 阳离子膜 (Na+/H+): 电解食盐水制烧碱
        // 阳极 2Cl- - 2e- = Cl2
        // 阴极 2H2O + 2e- = H2 + 2OH-
        anodeGasName = 'Cl₂ 气体↑'
        membraneIonSymbol = 'Na⁺'
        cathodeMassDelta = ne * 0.5 * 2.016
        const cOH = Math.min(14, 1.0e-7 + ne * 0.5 * c0)
        pH = 14 + Math.log10(Math.max(1e-7, cOH))
      } else if (membraneType === 1) {
        // 阴离子膜 (Cl- / SO42-): 阴离子穿膜至阳极区制酸
        // 阳极 2H2O - 4e- = O2 + 4H+
        // 阴极 2H2O + 2e- = H2 + 2OH-
        anodeGasName = 'O₂ 气体↑'
        membraneIonSymbol = 'Cl⁻'
        cathodeMassDelta = ne * 0.5 * 2.016
        const cH = Math.min(14, 1.0e-7 + ne * 1.0 * c0)
        pH = Math.max(1.0, 7.0 - Math.log10(1 + cH * 10))
      } else {
        // 质子交换膜 (H+): PEM 电解水制氢/高纯酸
        // 阳极 2H2O - 4e- = O2 + 4H+
        // 阴极 2H+ + 2e- = H2
        anodeGasName = 'O₂ 气体↑'
        membraneIonSymbol = 'H⁺'
        cathodeMassDelta = ne * 0.5 * 2.016
        pH = 7.0
      }
    } else {
      // 2: 串联电化学池 (池1 原电池 Zn-Cu 驱动 池2 电解池 镀铜)
      // 原电池负极 Zn 消耗
      anodeMassDelta = -(ne * 0.5 * 65.38)
      // 电解池阴极 Cu 析出
      cathodeMassDelta = ne * 0.5 * 63.55
      cathodeGasBubbleRate = 0
      anodeGasBubbleRate = current * 0.3
      anodeGasName = 'O₂ (微量)'
      cathodeGasName = ''
      membraneIonSymbol = 'e⁻ 导线传递'
    }

    // 导线电子相位 (随时间与电流推进)
    const electronPhase = (time * current * 1.5) % 1.0
    // 溶液与膜内离子迁移相位
    const ionPhase = (time * current * 0.8) % 1.0

    return {
      ne: parseFloat(ne.toFixed(4)),
      anodeMassDelta: parseFloat(anodeMassDelta.toFixed(3)),
      cathodeMassDelta: parseFloat(cathodeMassDelta.toFixed(3)),
      pH: parseFloat(Math.min(14, Math.max(0, pH)).toFixed(2)),
      electronPhase,
      ionPhase,
      cathodeGasBubbleRate,
      anodeGasBubbleRate,
      anodeGasName,
      cathodeGasName,
      membraneIonSymbol,
    }
  }, [current, c0, mode, membraneType, time])
}
