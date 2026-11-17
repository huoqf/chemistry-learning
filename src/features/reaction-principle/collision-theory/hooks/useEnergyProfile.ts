/**
 * 反应历程与势能曲线计算 hook / 纯函数
 *
 * 计算反应物 -> 过渡态 (TS) -> 生成物 势能变化及催化剂影响
 *
 * ── 为什么重写成「锚点唯一来源」结构（P1-10）──
 * 原实现里，标注点与曲线各算一套：
 *   peakNormal = 反应物 + Ea1                        （声明峰值）
 *   normalPath(t) = 线性基线 + Ea1·sin(πt)^1.8        （实际曲线）
 * 放热反应时基线在 t=0.5 已从 50 掉到 30，于是曲线真正的峰顶只有
 * 反应物 + Ea1 − 20，标注却画在 反应物 + Ea1 上 —— 标注悬浮在曲线
 * 上方 20 kJ/mol。催化剂路径更严重（首峰偏 10、中间体偏 16、次峰偏 30）。
 *
 * 现统一为：先定义**锚点**（反应物 / 过渡态 / 中间体 / 生成物），再由锚点
 * 插值生成曲线，标注点直接取同一批锚点对象 —— 标注必然精确落在曲线上。
 * 采样步数取 4 的整数倍，保证催化剂锚点 x = 0.25 / 0.5 / 0.75 恰好被采到，
 * 离散折线的极值点与锚点严格重合。
 */

import { CATALYST_EA_FACTOR } from '@/chemistry/collision'

export interface EnergyPoint {
  x: number // 反应历程 (0 ~ 1)
  y: number // 相对能量 (kJ/mol)
}

export interface EnergyProfileResult {
  reactantsEnergy: number
  productsEnergy: number
  deltaH: number
  /** 无催化剂正活化能 (kJ/mol) */
  ea1Normal: number
  /** 无催化剂逆活化能 (kJ/mol) */
  ea2Normal: number
  /** 催化剂正活化能 (kJ/mol) */
  ea1Catalyst: number
  /** 无催化剂势能曲线点 (用于绘图) */
  normalPath: EnergyPoint[]
  /** 有催化剂势能曲线点 (用于绘图，双峰中间体模型) */
  catalystPath: EnergyPoint[]
  /** 过渡态/峰值位置 */
  peakNormal: EnergyPoint
  peakCatalyst1: EnergyPoint
  intermediate: EnergyPoint
  peakCatalyst2: EnergyPoint
}

/**
 * 曲线采样步数。必须是 4 的整数倍：催化剂锚点 x = 0.25 / 0.5 / 0.75
 * 分别落在第 12 / 24 / 36 个采样点上，保证折线极值与锚点严格重合。
 */
const STEPS = 48

/** 无催化剂单峰路径的过渡态横坐标 */
const X_TS = 0.5

/** 催化剂双峰路径：首峰 / 中间体 / 次峰的横坐标 */
const X_CAT_PEAK1 = 0.25
const X_CAT_INTERMEDIATE = 0.5
const X_CAT_PEAK2 = 0.75

/** 单调 smoothstep：s(0)=0、s(1)=1，两端导数为 0（衔接处无折角） */
function smoothstep(u: number): number {
  const x = Math.max(0, Math.min(1, u))
  return x * x * (3 - 2 * x)
}

/**
 * 在锚点序列（x 严格递增）上做分段 smoothstep 插值。
 * 曲线严格通过每一个锚点：t 落在锚点上时返回该锚点的 y。
 */
function interpolateAnchors(anchors: EnergyPoint[], t: number): number {
  const last = anchors[anchors.length - 1]
  if (t <= anchors[0].x) return anchors[0].y
  if (t >= last.x) return last.y

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i]
    const b = anchors[i + 1]
    if (t <= b.x) {
      return a.y + (b.y - a.y) * smoothstep((t - a.x) / (b.x - a.x))
    }
  }
  return last.y
}

/** 按固定步数均匀采样锚点曲线 */
function samplePath(anchors: EnergyPoint[]): EnergyPoint[] {
  const path: EnergyPoint[] = []
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS
    path.push({ x: t, y: interpolateAnchors(anchors, t) })
  }
  return path
}

/**
 * 计算反应历程势能数据
 * @param reactionType 反应类型 ('exothermic' 放热 | 'endothermic' 吸热)
 * @param activationEnergy 正反应活化能 Ea1 (kJ/mol, 范围 30~120)
 * @param hasCatalyst 是否加入催化剂（本函数恒计算催化路径，仅作调用方语义标记）
 */
export function computeEnergyProfile(
  reactionType: 'exothermic' | 'endothermic',
  activationEnergy: number,
  hasCatalyst: boolean = false
): EnergyProfileResult {
  const deltaH = reactionType === 'exothermic' ? -40 : 40
  const reactantsEnergy = 50 // 基准点 (kJ/mol)
  const productsEnergy = reactantsEnergy + deltaH

  const ea1Normal = activationEnergy
  const ea2Normal = ea1Normal - deltaH

  // 催化剂降低活化能：放热反应按 CATALYST_EA_FACTOR 降低正活化能；
  // 吸热反应 (ΔH > 0) 受热力学约束，正反应活化能必须大于 ΔH（否则逆活化能 Ea2 <= 0），
  // 故对吸热反应将超出 ΔH 的能垒部分按 CATALYST_EA_FACTOR 降低，确保 Ea1_cat > ΔH 且 < Ea1。
  const rawCatEa1 = ea1Normal * CATALYST_EA_FACTOR
  const ea1Catalyst =
    reactionType === 'endothermic'
      ? Math.max(rawCatEa1, deltaH + Math.max(0.5, (ea1Normal - deltaH) * CATALYST_EA_FACTOR))
      : rawCatEa1
  void hasCatalyst

  // ── 1. 锚点（唯一来源：曲线与标注都从这里取）──
  // 无催化剂：反应物 -> 过渡态(峰高严格 = 反应物 + Ea1) -> 生成物
  const normalAnchors: EnergyPoint[] = [
    { x: 0, y: reactantsEnergy },
    { x: X_TS, y: reactantsEnergy + ea1Normal },
    { x: 1, y: productsEnergy },
  ]

  // 有催化剂：反应物 -> 首峰 -> 中间体谷 -> 次峰 -> 生成物（双峰中间体模型）
  const catPeak1: EnergyPoint = { x: X_CAT_PEAK1, y: reactantsEnergy + ea1Catalyst }
  const catIntermediate: EnergyPoint = {
    x: X_CAT_INTERMEDIATE,
    y: reactantsEnergy + ea1Catalyst * 0.3,
  }
  const catPeak2Energy =
    reactionType === 'endothermic'
      ? Math.max(
          productsEnergy + (ea1Catalyst - deltaH) * 0.75,
          reactantsEnergy + ea1Catalyst * 0.95
        )
      : reactantsEnergy + ea1Catalyst * 0.95
  const catPeak2: EnergyPoint = {
    x: X_CAT_PEAK2,
    y: Math.min(reactantsEnergy + ea1Catalyst - 0.1, catPeak2Energy),
  }
  const catalystAnchors: EnergyPoint[] = [
    { x: 0, y: reactantsEnergy },
    catPeak1,
    catIntermediate,
    catPeak2,
    { x: 1, y: productsEnergy },
  ]

  // ── 2. 曲线由锚点插值得到，必然过每一个锚点 ──
  const normalPath = samplePath(normalAnchors)
  const catalystPath = samplePath(catalystAnchors)

  return {
    reactantsEnergy,
    productsEnergy,
    deltaH,
    ea1Normal,
    ea2Normal,
    ea1Catalyst,
    normalPath,
    catalystPath,
    // ── 3. 标注点直接复用锚点对象：与曲线严格同源，不可能错位 ──
    peakNormal: normalAnchors[1],
    peakCatalyst1: catPeak1,
    intermediate: catIntermediate,
    peakCatalyst2: catPeak2,
  }
}
