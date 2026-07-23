import type { ChemistryQuantity } from '../../chemistryQuantities'

/**
 * 萃取分液与蒸馏实验的化学量构建器
 * 动态根据 params 和 time 返回中右屏联动数值
 */
export function buildExtractionDistillationQuantities(
  params: Record<string, number>,
  time: number
): ChemistryQuantity[] {
  const mode = params.experimentMode ?? 0 // 0: 萃取分液, 1: 蒸馏分馏
  const misoperation = params.misoperation ?? 0 // 0: 规范, 1: 温度计错, 2: 冷凝水错, 3: 无沸石

  if (mode === 0) {
    // ─── 萃取分液模式 ───
    const solvent = params.solvent ?? 0 // 0: CCl4, 1: 苯
    const vSolvent = params.vSolvent ?? 20 // mL
    const vWater = 50 // mL 初始水相
    const kPartition = solvent === 0 ? 85.0 : 65.0 // 分配系数 K (CCl4 vs 苯)

    // 震荡进度 0 ~ 1
    const progress = Math.min(1, time / 8)
    const c0 = 0.1 // mol/L 初始水相 I2 浓度
    // 达平衡时水相浓度: c_aq = c0 * V_aq / (V_aq + K * V_org)
    const cAqEquil = (c0 * vWater) / (vWater + kPartition * vSolvent)

    const cAq = c0 - (c0 - cAqEquil) * progress
    const cOrg = ((c0 - cAq) * vWater) / vSolvent
    const extractionRate = ((c0 - cAq) / c0) * 100

    return [
      { key: 'K', label: '分配系数 K', value: kPartition, unit: '', colorKey: 'concentration' },
      { key: 'cAq', label: '水相 I₂ 浓度', value: parseFloat(cAq.toFixed(4)), unit: 'mol/L', colorKey: 'concentration' },
      { key: 'cOrg', label: '有机相 I₂ 浓度', value: parseFloat(cOrg.toFixed(4)), unit: 'mol/L', colorKey: 'concentration' },
      { key: 'E', label: '单级萃取率', value: parseFloat(extractionRate.toFixed(1)), unit: '%', colorKey: 'reactionRate' },
      { key: 'vOrg', label: '萃取剂体积', value: vSolvent, unit: 'mL', colorKey: 'molarMass' },
    ]
  } else {
    // ─── 蒸馏分馏模式 ───
    const power = params.power ?? 500 // W 加热功率
    const tBoil = 76.8 // °C (CCl4 沸点)
    const tEnv = 20.0 // °C 初始室温

    // 加热温度上升曲线 (升温至沸点并在沸点保持平台)
    const heatingRate = (power / 500) * 8.0 // 升温速率 °C/s
    const rawTemp = tEnv + heatingRate * time
    const currentTemp = Math.min(tBoil, rawTemp)

    // 达到沸点后的馏出量 (mL)
    const distTime = Math.max(0, time - (tBoil - tEnv) / heatingRate)
    const distRate = (power / 500) * 0.8 // mL/s
    const vDist = Math.min(40.0, distTime * distRate)
    const vVapor = distTime > 0 ? parseFloat((distRate * 22.4 * 0.1).toFixed(2)) : 0.0

    // 错操作危害指数
    const eHarm = misoperation === 3 ? 95 : misoperation === 1 ? 45 : misoperation === 2 ? 60 : 0

    return [
      { key: 'T', label: '烧瓶/蒸气温度', value: parseFloat(currentTemp.toFixed(1)), unit: '°C', colorKey: 'temperature' },
      { key: 'Tb', label: '馏出物沸点', value: tBoil, unit: '°C', colorKey: 'temperature' },
      { key: 'VDist', label: '累计馏出体积', value: parseFloat(vDist.toFixed(1)), unit: 'mL', colorKey: 'molarMass' },
      { key: 'vVapor', label: '蒸气凝结速率', value: vVapor, unit: 'mL/s', colorKey: 'reactionRate' },
      { key: 'eHarm', label: '暴沸/偏误风险', value: eHarm, unit: '%', colorKey: 'energy' },
    ]
  }
}
