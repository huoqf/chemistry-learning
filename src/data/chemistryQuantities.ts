/**
 * src/data/chemistryQuantities.ts
 * 化学量构建器注册表 — 每个 animationId 对应一组化学量
 *
 * 化学量类型（由右屏 ChemistryPanel 消费）：
 *   - 浓度 (mol/L)
 *   - 温度 (K / °C)
 *   - 压强 (atm / kPa)
 *   - 反应速率 (mol/(L·s))
 *   - pH / pOH
 *   - 平衡常数 K
 *   - 电极电势 (V)
 *   - 焓变 (kJ/mol)
 *   - 熵变 (J/(mol·K))
 *   - 吉布斯自由能 (kJ/mol)
 */

export interface ChemistryQuantity {
  key: string
  label: string
  value: number
  unit: string
  /** 引用 CHEMISTRY_COLORS token key */
  colorKey: string
  /** 数值格式化精度，默认 2 */
  precision?: number
}

export type QuantityBuilder = (params: Record<string, number>, time: number) => ChemistryQuantity[]

const quantityBuilders = new Map<string, QuantityBuilder>()

/** 注册化学量构建器 */
export function registerQuantityBuilder(animationId: string, builder: QuantityBuilder): void {
  quantityBuilders.set(animationId, builder)
}

import { buildLeChatelierQuantities } from './quantities/reaction-principle/leChatelier'
import { buildUnitCellQuantities } from './quantities/structure/unitCellCalculation'

registerQuantityBuilder('anim-le-chatelier', buildLeChatelierQuantities)
registerQuantityBuilder('anim-unit-cell-calculation', buildUnitCellQuantities)


/** 预加载（惰性注册入口） */
export function preloadQuantityBuilder(animationId: string): void {
  void animationId
}

/** 获取化学量列表（右屏 ChemistryPanel 消费） */
export function getChemistryQuantities(
  animationId: string,
  params: Record<string, number>,
  time: number,
): ChemistryQuantity[] {
  const builder = quantityBuilders.get(animationId)
  return builder ? builder(params, time) : []
}
