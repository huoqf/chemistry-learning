import { describe, it, expect } from 'vitest'
import { ION_DATA, COEXISTENCE_CONFLICTS } from '../constants'

describe('无机离子特征检验与共存排斥矩阵数据审计', () => {
  it('应包含 32 种新高考核心阴阳离子全集 (14 阳离子 + 18 阴离子)', () => {
    expect(ION_DATA.length).toBe(32)

    const cations = ION_DATA.filter((i) => i.type === 'cation')
    const anions = ION_DATA.filter((i) => i.type === 'anion')

    expect(cations.length).toBe(14)
    expect(anions.length).toBe(18)

    const cationIds = cations.map((i) => i.id)
    expect(cationIds).toEqual(
      expect.arrayContaining([
        'Fe3+',
        'Fe2+',
        'Cu2+',
        'Al3+',
        'NH4+',
        'Ba2+',
        'Ag+',
        'Mg2+',
        'H+',
        'Na+',
        'K+',
        'Ca2+',
        'Zn2+',
        'Mn2+',
      ])
    )

    const anionIds = anions.map((i) => i.id)
    expect(anionIds).toEqual(
      expect.arrayContaining([
        'SO42-',
        'Cl-',
        'Br-',
        'I-',
        'CO32-',
        'SO32-',
        'S2-',
        'NO3-',
        'OH-',
        'HCO3-',
        'AlO2-',
        'ClO-',
        'MnO4-',
        'SiO32-',
        'S2O32-',
        'CH3COO-',
        'F-',
        'NO2-',
      ])
    )
  })

  it('每种离子的特效试剂、现象、方程式与高考标准答题句式必须完整且规范', () => {
    ION_DATA.forEach((ion) => {
      expect(ion.name).toBeTruthy()
      expect(ion.formula).toBeTruthy()
      expect(ion.colorInSolution).toBeTruthy()
      expect(ion.colorRgb).toBeTruthy()
      expect(ion.testReagent).toBeTruthy()
      expect(ion.testPhenomenon).toBeTruthy()
      expect(ion.testEquation).toBeTruthy()
      expect(ion.interference).toBeTruthy()
      expect(ion.standardProcedure.length).toBeGreaterThan(15) // 规范答题必须详尽
      expect(ion.reagentOptions).toBeDefined()
      expect(ion.reagentOptions.length).toBeGreaterThanOrEqual(3) // 至少包含 3 个选项用于试错探究
      expect(ion.reagentOptions.some((r) => r.isOptimal)).toBe(true) // 必须有最佳答案
    })
  })

  it('共存互斥规则库必须覆盖生成沉淀、氧化还原、剧烈双水解、气体等 5 大维度', () => {
    const types = COEXISTENCE_CONFLICTS.map((c) => c.type)
    expect(types).toContain('precipitate')
    expect(types).toContain('redox')
    expect(types).toContain('double-hydrolysis')
    expect(types).toContain('gas')

    // 经典互斥测试
    const alCo3 = COEXISTENCE_CONFLICTS.find(
      (c) =>
        (c.ionA === 'Al3+' && c.ionB === 'CO32-') || (c.ionA === 'CO32-' && c.ionB === 'Al3+')
    )
    expect(alCo3).toBeDefined()
    expect(alCo3?.type).toBe('double-hydrolysis')

    const fe3I = COEXISTENCE_CONFLICTS.find(
      (c) => (c.ionA === 'Fe3+' && c.ionB === 'I-') || (c.ionA === 'I-' && c.ionB === 'Fe3+')
    )
    expect(fe3I).toBeDefined()
    expect(fe3I?.type).toBe('redox')
  })

  it('分步连续滴加必须符合高中化学相变状态转移 (Al3+ / Mg2+ / Fe2+ / SO42- / MnO4- / S2O32-)', async () => {
    const { computeStepChemistry } = await import('../components/IonMatrixChemistry')

    // 1. Al3+ 两性氢氧化物：少量沉淀 -> 过量完全溶解
    const alStep0 = computeStepChemistry('Al3+', 'al3-naoh-drop', 0, 'rgba(226, 232, 240, 0.6)')
    expect(alStep0.hasPrecipitate).toBe(false)

    const alStep1 = computeStepChemistry('Al3+', 'al3-naoh-drop', 1, 'rgba(226, 232, 240, 0.6)')
    expect(alStep1.hasPrecipitate).toBe(true) // 少量析出白色胶状沉淀
    expect(alStep1.precipitateLevel).toBeGreaterThan(0)

    const alStep2 = computeStepChemistry('Al3+', 'al3-naoh-drop', 2, 'rgba(226, 232, 240, 0.6)')
    expect(alStep2.hasPrecipitate).toBe(false) // 过量完全溶解澄清
    expect(alStep2.precipitateLevel).toBe(0)

    // 2. Mg2+ 与 Al3+ 对比：过量强碱依然不溶
    const mgStep1 = computeStepChemistry('Mg2+', 'mg-naoh-excess', 1, 'rgba(248, 250, 252, 0.6)')
    expect(mgStep1.hasPrecipitate).toBe(true)

    const mgStep2 = computeStepChemistry('Mg2+', 'mg-naoh-excess', 2, 'rgba(248, 250, 252, 0.6)')
    expect(mgStep2.hasPrecipitate).toBe(true) // 沉淀依然存在且不溶

    // 3. Fe2+ 检验规范四部曲：先加 KSCN 不变红 -> 后加氯水显血红
    const fe2Step1 = computeStepChemistry('Fe2+', 'fe2-kscn-cl2', 1, 'rgba(16, 185, 129, 0.7)')
    expect(fe2Step1.fillColor).toContain('16, 185, 129') // 保持浅绿不变红

    const fe2Step2 = computeStepChemistry('Fe2+', 'fe2-kscn-cl2', 2, 'rgba(16, 185, 129, 0.7)')
    expect(fe2Step2.fillColor).toContain('185, 28, 28') // 氧化后瞬间血红

    // 4. SO42- 排除干扰：先加酸无沉淀 -> 后加钡盐白色沉淀
    const so4Step1 = computeStepChemistry('SO42-', 'so4-hcl-bacl2', 1, 'rgba(248, 250, 252, 0.6)')
    expect(so4Step1.hasPrecipitate).toBe(false) // 先酸化无沉淀

    const so4Step2 = computeStepChemistry('SO42-', 'so4-hcl-bacl2', 2, 'rgba(248, 250, 252, 0.6)')
    expect(so4Step2.hasPrecipitate).toBe(true) // 滴加 BaCl2 出现白色沉淀

    // 5. MnO4- 强氧化性紫红褪色
    const mno4Step2 = computeStepChemistry('MnO4-', 'mno4-feso4-acid', 2, 'rgba(168, 85, 247, 0.9)')
    expect(mno4Step2.fillColor).not.toContain('168, 85, 247') // 紫红褪去

    // 6. S2O32- 酸性自身歧化
    const s2o3Step2 = computeStepChemistry('S2O32-', 's2o3-h2so4', 2, 'rgba(248, 250, 252, 0.6)')
    expect(s2o3Step2.hasPrecipitate).toBe(true)
    expect(s2o3Step2.hasGas).toBe(true)
  })
})
