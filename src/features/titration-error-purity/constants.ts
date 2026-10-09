import type { TitrationErrorParams } from './types'

/**
 * 实验三「定量滴定误差与纯度产率」的出厂默认参数
 *
 * 【为什么集中定义在这里】
 * 原先同一份默认值在 `TitrationErrorPurityCanvas.tsx` 里被抄了两遍（useState 初值 + handleReset），
 * 两处一旦漂移就会出现"重置后与首次进入参数不一致"的隐性缺陷；同时默认值无法被测试直接引用。
 * 现集中为本常量，由画布与守门测试共同消费。
 *
 * 【参数取值依据（不得随手改）】
 * 返滴定需乘「定容总体积 / 移取体积」= 250/25 = 10 换算到全样品，因此酸的物质的量必须与
 * 移取份中的样品量同量级（25 mL 份中 ≈1.5 mmol CaCO₃，仅需 ≈3.0 mmol HCl），
 * 否则会算出 w% ≫ 100% 的不自洽结果：
 *   - c₁ = 0.20 mol/L、V₁ = 25.0 mL  -> n(HCl) = 5.00 mmol（返滴定酸标准液的真实量级）
 *   - c₂ = 0.10 mol/L、V₂ = 20.0 mL  -> n(NaOH) = 2.00 mmol（返滴消耗）
 *   - m(粗样品) = 2.5 g
 * 三种纯度方法在此默认值下的结果（已由 `__tests__/defaultParamsSanity.test.ts` 锁死）：
 *   直接滴定 42.40% | 氧化还原链 88.80% | 返滴定 60.05% —— 全部 ≤ 100%，无越界告警。
 *
 * 注意结构性约束：direct 与 multistep-redox 共用因子 0.5·c₂·(V₂/1000)·(V总/V移取)/m，
 * 故 multistep ≡ 2.094340 × direct（M = 222 : 106）。
 * 即"multistep ≤ 100%" 必然推出 "direct ≤ 47.75%"，二者不可能同时落在 50%~75%。
 *
 * 另：默认产率 99.70%（几乎定量），刻意贴近理论上限，用于讲解"实际产量不得超过理论产量"。
 */
export const DEFAULT_TITRATION_ERROR_PARAMS: TitrationErrorParams = {
  mode: 'error-analysis',
  titrationType: 'acid-base',
  errorOp: 'none',
  viewAngle: 0,
  cStandardTrue: 0.1,
  vSampleTrue: 20.0,
  cSampleTrue: 0.1,

  purityMethod: 'direct',
  sampleMass: 2.5,
  solutionTotalVol: 250,
  pipetteVol: 25,

  reagent1Conc: 0.2,
  reagent1Vol: 25.0,
  reagent2Conc: 0.1,
  reagent2Vol: 20.0,

  rawMaterialMass: 2.8,
  rawMaterialMolarMass: 55.85, // Fe 铁粉
  molarMassProduct: 392.14,
  actualProductMass: 19.6,
  rawToProductRatio: 1.0, // Fe → 摩尔盐为 1:1，计量系数比默认 1.0
}
