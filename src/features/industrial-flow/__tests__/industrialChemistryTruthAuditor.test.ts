import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIndustrialFlowChemistry } from '../hooks/useIndustrialFlowChemistry'
import { getElementFates, getReagentEvaluations } from '../hooks/industrialFlowData'
import type { IndustrialFlowParams, IndustrialFlowSystemId } from '../types'

/**
 * industrialChemistryTruthAuditor.test.ts
 *
 * 母题七：无机工艺流程与沉淀调 pH 工具
 * 高中化学学科真理性与高考命题级合规性自动化守门测试套件
 *
 * 彻底杜绝：
 * 1. 化学反应方程式配平错误或电荷不守恒；
 * 2. Ksp 沉淀溶解平衡计算与高中化学教材数据偏差；
 * 3. 强酸强碱共存违背与产物物相失真；
 * 4. 溶解度特性与结晶分离手段错配；
 * 5. 高考标准答题模板采分点缺漏。
 */
describe('母题七：无机工艺流程与沉淀调 pH 高考化学学科真理守门审计', () => {
  const ALL_SYSTEM_IDS: IndustrialFlowSystemId[] = [
    'fe-al-mn',
    'fe-cu-zn',
    'ti-fe',
    'ni-co-li',
    'mg-ca',
    'al-fe-si',
    'li-fe-p',
    'cu-fe',
  ]

  describe('1. 化学反应方程式配平、电荷与物相守恒铁律守门', () => {
    it('磷酸铁锂 (LiFePO₄) 氧化酸浸方程式中硫酸化学计量数必须严格为 1，杜绝未配平', () => {
      const { result } = renderHook(() =>
        useIndustrialFlowChemistry({
          viewMode: 0,
          systemId: 'li-fe-p',
          activeStep: 1,
          pH: 2.2,
          leachTemp: 60,
          crushSize: 'fine',
          oxidantAmount: 'sufficient',
          reagent: 'Na2CO3',
          crystallizeMethod: 'heating',
          washSolvent: 'hot-water',
        })
      )

      const rxn = result.current.activeStepInfo.coreReaction
      expect(rxn, '磷酸铁锂氧化酸浸必须包含 FePO4 沉淀生成物').toContain('FePO₄')
      expect(rxn, '生成 FePO4 沉淀时硫酸消耗系数必须为 1，严禁误写为 3H2SO4').not.toContain('3H₂SO₄')
      expect(rxn).toMatch(/2LiFePO₄\s*\+\s*H₂O₂\s*\+\s*H₂SO₄/)
    })

    it('拜耳法碱浸溶液通入过量 CO₂ 酸化时，产物必须严格为 HCO₃⁻，严禁错写为 CO₃²⁻', () => {
      const { result } = renderHook(() =>
        useIndustrialFlowChemistry({
          viewMode: 0,
          systemId: 'al-fe-si',
          activeStep: 3,
          pH: 10.2,
          leachTemp: 60,
          crushSize: 'fine',
          oxidantAmount: 'sufficient',
          reagent: 'CO2',
          crystallizeMethod: 'cooling',
          washSolvent: 'water',
        })
      )

      const rxn = result.current.activeStepInfo.coreReaction
      expect(rxn, '必须采用新课标规范离子 [Al(OH)4]-').toContain('[Al(OH)₄]⁻')
      expect(rxn, '过量 CO2 酸化产物必须是碳酸氢根 HCO3-').toContain('HCO₃⁻')
      expect(rxn, '过量 CO2 严禁生成正盐碳酸根 CO32-').not.toContain('+ CO₃²⁻')
    })

    it('钛铁矿还原工序必须精准体现加铁屑将 Fe³⁺ 还原为 Fe²⁺ 防钛酸水解混杂', () => {
      const { result } = renderHook(() =>
        useIndustrialFlowChemistry({
          viewMode: 0,
          systemId: 'ti-fe',
          activeStep: 2,
          pH: 1.5,
          leachTemp: 60,
          crushSize: 'fine',
          oxidantAmount: 'sufficient',
          reagent: 'NaOH',
          crystallizeMethod: 'cooling',
          washSolvent: 'water',
        })
      )

      const rxn = result.current.activeStepInfo.coreReaction
      expect(rxn).toContain('2Fe³⁺ + Fe = 3Fe²⁺')
      expect(result.current.activeStepInfo.scoringAnswer).toContain('白度')
    })

    it('三元正极酸浸方程式必须体现 H₂O₂ 充当还原剂将 Co(III) 还原为 Co²⁺ 并释放 O₂', () => {
      const { result } = renderHook(() =>
        useIndustrialFlowChemistry({
          viewMode: 0,
          systemId: 'ni-co-li',
          activeStep: 1,
          pH: 4.8,
          leachTemp: 60,
          crushSize: 'fine',
          oxidantAmount: 'sufficient',
          reagent: 'NaOH',
          crystallizeMethod: 'cooling',
          washSolvent: 'water',
        })
      )

      const rxn = result.current.activeStepInfo.coreReaction
      expect(rxn).toContain('2LiCoO₂ + H₂O₂ + 3H₂SO₄ = 2CoSO₄ + Li₂SO₄ + O₂↑ + 4H₂O')
    })
  })

  describe('2. Ksp 沉淀溶解平衡、离子残余浓度与安全分离 pH 窗口计算守门', () => {
    it('完全沉淀国家标准：残余浓度 c ≤ 1.0e-5 mol/L', () => {
      const baseParams: IndustrialFlowParams = {
        viewMode: 0,
        systemId: 'fe-al-mn',
        activeStep: 3,
        pH: 5.2,
        leachTemp: 60,
        crushSize: 'fine',
        oxidantAmount: 'sufficient',
        reagent: 'MnO',
        crystallizeMethod: 'cooling',
        washSolvent: 'ethanol',
      }
      const { result } = renderHook(() => useIndustrialFlowChemistry(baseParams))

      // 验证 Fe(OH)3 完全沉淀点计算 (Ksp = 4.0e-38, c=1e-5)
      // c(OH-) = (4.0e-33)^(1/3) = 1.587e-11 => pOH = 10.80 => pH = 3.20
      const fe3 = result.current.ions.find((i) => i.symbol === 'Fe³⁺')
      expect(fe3).toBeDefined()
      expect(fe3?.pHEnd).toBeCloseTo(3.2, 1)

      // 验证 Al(OH)3 完全沉淀点 (Ksp = 1.0e-33, c=1e-5) => pH ≈ 4.7
      const al3 = result.current.ions.find((i) => i.symbol === 'Al³⁺')
      expect(al3).toBeDefined()
      expect(al3?.pHEnd).toBeCloseTo(4.7, 1)

      // 验证 Mn(OH)2 开始沉淀点 (Ksp = 1.9e-13, c0 ≈ 0.11) => pH ≈ 8.1
      const mn2 = result.current.ions.find((i) => i.symbol === 'Mn²⁺')
      expect(mn2).toBeDefined()
      expect(mn2?.pHStart).toBeGreaterThan(8.0)
      expect(mn2?.pHStart).toBeLessThan(8.3)
    })

    it('Fe²⁺ 未氧化时：沉淀完全需 pH ≥ 8.95，已高于目标析出点，必须判定为无安全窗口', () => {
      const { result } = renderHook(() =>
        useIndustrialFlowChemistry({
          viewMode: 0,
          systemId: 'fe-al-mn',
          activeStep: 3,
          pH: 5.2,
          leachTemp: 60,
          crushSize: 'fine',
          oxidantAmount: 'insufficient', // 未氧化
          reagent: 'MnO',
          crystallizeMethod: 'cooling',
          washSolvent: 'ethanol',
        })
      )

      expect(result.current.hasSafeRange).toBe(false)
      expect(result.current.safeRangeDescription).toContain('无安全分离区间')
    })

    it('氧化充分后：Fe³⁺沉淀点大幅提前至 3.2，必须拉开纯净安全分离窗口', () => {
      const { result } = renderHook(() =>
        useIndustrialFlowChemistry({
          viewMode: 0,
          systemId: 'fe-al-mn',
          activeStep: 3,
          pH: 5.2,
          leachTemp: 60,
          crushSize: 'fine',
          oxidantAmount: 'sufficient',
          reagent: 'MnO',
          crystallizeMethod: 'cooling',
          washSolvent: 'ethanol',
        })
      )

      expect(result.current.hasSafeRange).toBe(true)
      expect(result.current.safePhRange[0]).toBeLessThanOrEqual(5.0)
      expect(result.current.safePhRange[1]).toBeGreaterThanOrEqual(8.0)
      expect(result.current.isPhInSafeRange).toBe(true)
    })

    it('Al(OH)₃ 两性溶解铁律：pH > 10.5 强碱环境下铝必须重新溶出为四羟基合铝酸根', () => {
      const { result: rLow } = renderHook(() =>
        useIndustrialFlowChemistry({
          viewMode: 0,
          systemId: 'fe-al-mn',
          activeStep: 3,
          pH: 6.5,
          leachTemp: 60,
          crushSize: 'fine',
          oxidantAmount: 'sufficient',
          reagent: 'MnO',
          crystallizeMethod: 'cooling',
          washSolvent: 'ethanol',
        })
      )
      const { result: rHigh } = renderHook(() =>
        useIndustrialFlowChemistry({
          viewMode: 0,
          systemId: 'fe-al-mn',
          activeStep: 3,
          pH: 13.0,
          leachTemp: 60,
          crushSize: 'fine',
          oxidantAmount: 'sufficient',
          reagent: 'MnO',
          crystallizeMethod: 'cooling',
          washSolvent: 'ethanol',
        })
      )

      const alLow = rLow.current.ions.find((i) => i.symbol === 'Al³⁺')
      const alHigh = rHigh.current.ions.find((i) => i.symbol === 'Al³⁺')
      expect(alLow?.cCurrent).toBeLessThan(1e-4) // pH 6.5 完全沉淀
      expect(alHigh?.cCurrent).toBeGreaterThan(1e-3) // pH 13.0 两性反溶重新进入溶液
    })
  })

  describe('3. 溶解度特性与结晶分离手段逻辑守门', () => {
    it('磷酸铁锂回收体系：Li₂CO₃ 必须表现为反常负温度系数溶解度，且推荐趁热过滤与热水洗涤', () => {
      const { result } = renderHook(() =>
        useIndustrialFlowChemistry({
          viewMode: 0,
          systemId: 'li-fe-p',
          activeStep: 4,
          pH: 2.2,
          leachTemp: 60,
          crushSize: 'fine',
          oxidantAmount: 'sufficient',
          reagent: 'Na2CO3',
          crystallizeMethod: 'heating',
          washSolvent: 'hot-water',
        })
      )

      const curve = result.current.solubilityCurveData
      expect(curve.length).toBeGreaterThan(0)
      const lowTemp = curve.find((c) => c.temp === 0)?.main ?? 0
      const highTemp = curve.find((c) => c.temp === 100)?.main ?? 0

      // 高温溶解度必须小于低温溶解度！
      expect(highTemp, 'Li2CO3 必须具有随温度升高溶解度反常降低的特性').toBeLessThan(lowTemp)

      // 工序四设问与标答必须强调趁热过滤与热水洗涤
      const step4 = result.current.activeStepInfo
      expect(step4.scoringAnswer).toContain('趁热过滤')
      expect(step4.scoringAnswer).toContain('热水洗涤')
    })

    it('常规硫酸盐体系：主产物溶解度随温度上升陡增，结晶分离必须优选降温结晶', () => {
      const { result } = renderHook(() =>
        useIndustrialFlowChemistry({
          viewMode: 0,
          systemId: 'fe-al-mn',
          activeStep: 4,
          pH: 5.2,
          leachTemp: 60,
          crushSize: 'fine',
          oxidantAmount: 'sufficient',
          reagent: 'MnO',
          crystallizeMethod: 'cooling',
          washSolvent: 'ethanol',
        })
      )

      const curve = result.current.solubilityCurveData
      const lowTemp = curve.find((c) => c.temp === 0)?.main ?? 0
      const highTemp = curve.find((c) => c.temp === 100)?.main ?? 0
      expect(highTemp, '常规盐类高温溶解度大于低温溶解度').toBeGreaterThan(lowTemp)
    })
  })

  describe('4. 高考满分答题规范与采分关键词守门', () => {
    it('提高浸出率措施必须涵盖：粉碎矿石、提高温度、搅拌、增大浓度四大标准采分点', () => {
      const { result } = renderHook(() =>
        useIndustrialFlowChemistry({
          viewMode: 0,
          systemId: 'fe-al-mn',
          activeStep: 1,
          pH: 5.2,
          leachTemp: 60,
          crushSize: 'fine',
          oxidantAmount: 'sufficient',
          reagent: 'MnO',
          crystallizeMethod: 'cooling',
          washSolvent: 'ethanol',
        })
      )

      const ans = result.current.activeStepInfo.scoringAnswer
      expect(ans).toContain('粉碎')
      expect(ans).toContain('温度')
      expect(ans).toContain('搅拌')
      expect(ans).toContain('浓度')
    })

    it('调 pH 试剂必须严格遵循“不引入新杂质”原则：优先推荐含主金属的氧化物/难溶碳酸盐', () => {
      for (const sys of ALL_SYSTEM_IDS) {
        const evals = getReagentEvaluations(sys)
        const recommended = evals.filter((e) => e.isRecommended)
        expect(recommended.length, `体系 [${sys}] 必须有推荐的不增杂试剂`).toBeGreaterThan(0)

        // 强碱 NaOH 必须被标记为不推荐或警告其易导致两性反溶/沉淀损失
        const naoh = evals.find((e) => e.reagent === 'NaOH')
        if (naoh && sys !== 'ti-fe' && sys !== 'ni-co-li') {
          expect(naoh.isRecommended, `体系 [${sys}] 中强碱 NaOH 严禁作为首选不增杂试剂`).toBe(false)
        }
      }
    })

    it('所有 8 大体系的元素走向追踪矩阵中，主目标元素与杂质归宿必须完全闭环', () => {
      for (const sys of ALL_SYSTEM_IDS) {
        const fates = getElementFates(sys, true)
        expect(fates.length, `体系 [${sys}] 必须配置元素走向矩阵`).toBeGreaterThanOrEqual(3)

        const target = fates.find((f) => f.isTarget)
        expect(target, `体系 [${sys}] 必须明确标记主产物元素`).toBeDefined()
        expect(target?.finalState, `体系 [${sys}] 主产物必须有明确结晶或煅烧最终归宿`).toBeTruthy()
      }
    })
  })
})
