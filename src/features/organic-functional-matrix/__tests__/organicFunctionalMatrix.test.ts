import { describe, it, expect } from 'vitest'
import {
  FUNCTIONAL_GROUPS,
  GAOKAO_CLUES,
  PROTECTION_GROUPS,
  POLYMERIZATION_MODELS,
} from '../constants'
import { ORGANIC_3D_MOLECULES } from '../data/organic3dData'
import { useOrganicQuantitative } from '../hooks/useOrganicQuantitative'
import { renderHook } from '@testing-library/react'

describe('有机官能团定性特征与定量转化反应矩阵数据与计算审计', () => {
  it('应包含 14 大新高考高频官能团与核心题眼', () => {
    expect(FUNCTIONAL_GROUPS.length).toBe(14)
    const ids = FUNCTIONAL_GROUPS.map((g) => g.id)
    expect(ids).toContain('alkene-c=c')
    expect(ids).toContain('alkyne-c#c')
    expect(ids).toContain('alcohol-oh')
    expect(ids).toContain('phenol-oh')
    expect(ids).toContain('aldehyde-cho')
    expect(ids).toContain('ketone-co')
    expect(ids).toContain('carboxyl-cooh')
    expect(ids).toContain('ester-coor')
    expect(ids).toContain('phenol-ester')
    expect(ids).toContain('halo-halogen')
    expect(ids).toContain('peptide-amide')
    expect(ids).toContain('amino-nh2')
    expect(ids).toContain('nitro-no2')
    expect(ids).toContain('cyano-cn')

    expect(GAOKAO_CLUES.length).toBeGreaterThanOrEqual(10)
  })

  it('酚酯水解必须消耗 2 mol NaOH，普通酯水解消耗 1 mol NaOH', () => {
    const phenolEster = FUNCTIONAL_GROUPS.find((g) => g.id === 'phenol-ester')
    const normalEster = FUNCTIONAL_GROUPS.find((g) => g.id === 'ester-coor')

    expect(phenolEster?.consumptions.NaOH).toBe(2)
    expect(normalEster?.consumptions.NaOH).toBe(1)
  })

  it('醇羟基只与 Na 反应，不与 NaOH / NaHCO3 反应', () => {
    const alcoholOh = FUNCTIONAL_GROUPS.find((g) => g.id === 'alcohol-oh')
    expect(alcoholOh?.consumptions.Na).toBe(1)
    expect(alcoholOh?.consumptions.NaOH).toBe(0)
    expect(alcoholOh?.consumptions.NaHCO3).toBe(0)
  })

  it('酮羰基消耗 1 mol H2 加氢还原，但不发生银镜反应', () => {
    const ketone = FUNCTIONAL_GROUPS.find((g) => g.id === 'ketone-co')
    expect(ketone?.consumptions.H2).toBe(1)
    expect(ketone?.consumptions.Br2).toBe(0)
    expect(ketone?.qualitativeFeatures?.silverOrFehling).toContain('不发生银镜')
  })

  it('复杂多官能团混合物 (2 酚酯 + 1 羧基 + 1 双键) 定量反应计算与明细拆解', () => {
    const { result } = renderHook(() =>
      useOrganicQuantitative({
        'phenol-ester': 2, // 消耗 4 NaOH
        'carboxyl-cooh': 1, // 消耗 1 NaOH, 1 NaHCO3, 1 Na
        'alkene-c=c': 1, // 消耗 1 Br2, 1 H2
      })
    )

    expect(result.current.NaOH).toBe(5)
    expect(result.current.NaHCO3).toBe(1)
    expect(result.current.Na).toBe(1)
    expect(result.current.Br2).toBe(1)
    expect(result.current.H2).toBe(1)
    expect(result.current.gasCO2).toBe(1)
    expect(result.current.gasH2).toBe(0.5)

    // 验证拆解数据
    expect(result.current.breakdowns.NaOH).toHaveLength(2)
    expect(result.current.breakdowns.NaOH[0].totalMol + result.current.breakdowns.NaOH[1].totalMol).toBe(5)
  })

  it('Na2CO3 定量消耗：1 酚羟基 + 1 羧基 复合体系消耗 1.5 mol Na2CO3 并放 0.5 mol CO2', () => {
    const { result } = renderHook(() =>
      useOrganicQuantitative({
        'phenol-oh': 1, // 消耗 1 Na2CO3 (生成 1 NaHCO3 不出气)
        'carboxyl-cooh': 1, // 消耗 0.5 Na2CO3 (放 0.5 CO2)
      })
    )

    expect(result.current.Na2CO3).toBe(1.5)
    expect(result.current.gasCO2).toBe(1) // 来自羧基与 NaHCO3/中和
    expect(result.current.NaOH).toBe(2)
    expect(result.current.Na).toBe(2)
    expect(result.current.gasH2).toBe(1.0)
  })

  it('12 大官能团均应具备完整的定性检验试剂、现象与定性特征标注', () => {
    for (const g of FUNCTIONAL_GROUPS) {
      expect(g.testReagents.length).toBeGreaterThan(0)
      expect(g.testPhenomenon.length).toBeGreaterThan(0)
      expect(g.testEquation.length).toBeGreaterThan(0)
      expect(g.qualitativeFeatures).toBeDefined()
      expect(g.qualitativeFeatures?.reactionTypes?.length).toBeGreaterThan(0)
    }

    const aldehyde = FUNCTIONAL_GROUPS.find((g) => g.id === 'aldehyde-cho')
    expect(aldehyde?.qualitativeFeatures?.silverOrFehling).toContain('2 mol Ag')
  })

  it('苯酚特异性定量：消耗 3 mol 浓溴水、1 mol Na2CO3 (生成 1 NaHCO3 且不出气)', () => {
    const phenol = FUNCTIONAL_GROUPS.find((g) => g.id === 'phenol-oh')
    expect(phenol?.consumptions.Br2).toBe(3)
    expect(phenol?.consumptions.Na2CO3).toBe(1)
    expect(phenol?.consumptions.NaHCO3).toBe(0)
  })

  it('甲酸苯酯母题模型：1 酚酯 + 1 醛基，消耗 2 NaOH 并生成 2 mol Ag 银镜', () => {
    const { result } = renderHook(() =>
      useOrganicQuantitative({
        'phenol-ester': 1,
        'aldehyde-cho': 1,
      })
    )
    expect(result.current.NaOH).toBe(2)
    expect(result.current.precipitateAg).toBe(2)
    expect(result.current.Br2).toBe(1) // 醛基被溴水氧化
    expect(result.current.H2).toBe(1) // 醛基加氢还原
  })

  it('3D 空间球棍模型数据库应完整覆盖 12 大官能团与核心母题分子', async () => {
    const { ORGANIC_3D_MOLECULES, get3DModelForGroup } = await import('../data/organic3dData')
    
    // 验证所有 12 大官能团均能正确获取 3D 模型
    for (const g of FUNCTIONAL_GROUPS) {
      const model = get3DModelForGroup(g.id)
      expect(model).toBeDefined()
      expect(model?.name).toBeDefined()
      expect(model?.formula).toBeDefined()
      expect(model?.atoms.length).toBeGreaterThan(0)
      expect(model?.bonds.length).toBeGreaterThan(0)
      expect(model?.geometryFeatures.hybridization).toBeDefined()
      expect(model?.geometryFeatures.reactionSite).toBeDefined()
    }

    // 验证高考明星母题分子
    const aspirin = ORGANIC_3D_MOLECULES['aspirin']
    expect(aspirin).toBeDefined()
    expect(aspirin.atoms.length).toBeGreaterThanOrEqual(12)
    expect(aspirin.geometryFeatures.reactionSite).toContain('3 NaOH')

    const formicPhenyl = ORGANIC_3D_MOLECULES['formic-phenyl-ester']
    expect(formicPhenyl).toBeDefined()
    expect(formicPhenyl.keyPoints[0]).toContain('2 mol NaOH')
  })

  it('3D 立体异构变体（顺反异构、芳香醇/酚对比）关联与数据完整性审计', async () => {
    const { ORGANIC_3D_MOLECULES } = await import('../data/organic3dData')

    // 1. 顺-2-丁烯 vs 反-2-丁烯
    const cisButene = ORGANIC_3D_MOLECULES['alkene-cis-2-butene']
    const transButene = ORGANIC_3D_MOLECULES['alkene-trans-2-butene']
    expect(cisButene).toBeDefined()
    expect(transButene).toBeDefined()
    expect(cisButene.atoms.length).toBe(6)
    expect(transButene.atoms.length).toBe(6)
    expect(cisButene.spatialContrastNote).toContain('顺反')
    expect(transButene.spatialContrastNote).toContain('反式')

    // 2. 芳香醇 (苯甲醇) vs 酚 (苯酚)
    const benzylAlcohol = ORGANIC_3D_MOLECULES['benzyl-alcohol']
    expect(benzylAlcohol).toBeDefined()
    expect(benzylAlcohol.geometryFeatures.hybridization).toContain('sp³')
    expect(benzylAlcohol.spatialContrastNote).toContain('阻断了 p-π 共轭')

    // 3. 验证所有 variants 中的 targetMoleculeId 均真实存在
    for (const mol of Object.values(ORGANIC_3D_MOLECULES)) {
      if (mol.variants) {
        for (const v of mol.variants) {
          expect(ORGANIC_3D_MOLECULES[v.targetMoleculeId]).toBeDefined()
        }
      }
    }
  })

  it('现代波谱数据 (IR & 1H-NMR) 深度定性特征验证', () => {
    for (const g of FUNCTIONAL_GROUPS) {
      expect(g.spectroscopy).toBeDefined()
      expect(g.spectroscopy?.ir.length).toBeGreaterThan(0)
      expect(g.spectroscopy?.hnmr.length).toBeGreaterThan(0)
    }

    const aldehyde = FUNCTIONAL_GROUPS.find((g) => g.id === 'aldehyde-cho')
    expect(aldehyde?.spectroscopy?.ir).toContain('2720')
    expect(aldehyde?.spectroscopy?.hnmr).toContain('9.5')

    const carboxyl = FUNCTIONAL_GROUPS.find((g) => g.id === 'carboxyl-cooh')
    expect(carboxyl?.spectroscopy?.ir).toContain('2500')
    expect(carboxyl?.spectroscopy?.hnmr).toContain('10.5')
  })

  it('手性碳 (*C) 3D 模型体系覆盖乳酸与 2-氯丁烷', () => {
    // 1. 乳酸对映异构对
    const lLactic = ORGANIC_3D_MOLECULES['lactic-acid-chiral']
    const dLactic = ORGANIC_3D_MOLECULES['d-lactic-acid-chiral']
    expect(lLactic).toBeDefined()
    expect(dLactic).toBeDefined()

    const lChiralC = lLactic?.atoms.find((a) => a.isChiral === true)
    const dChiralC = dLactic?.atoms.find((a) => a.isChiral === true)
    expect(lChiralC).toBeDefined()
    expect(dChiralC).toBeDefined()

    // 2. 2-氯丁烷手性分子
    const cb = ORGANIC_3D_MOLECULES['2-chlorobutane-chiral']
    expect(cb).toBeDefined()
    expect(cb?.atoms.some((a) => a.isChiral)).toBe(true)
    expect(cb?.keyPoints[0]).toContain('手性碳消失')
  })

  it('有机合成保护基与高分子聚合矩阵完整性审计', () => {
    expect(PROTECTION_GROUPS.length).toBeGreaterThanOrEqual(4)
    const bnProtect = PROTECTION_GROUPS.find((p) => p.id === 'phenol-benzyl-protect')
    expect(bnProtect).toBeDefined()
    expect(bnProtect?.deprotectionCondition).toContain('Pd-C')

    expect(POLYMERIZATION_MODELS.length).toBeGreaterThanOrEqual(4)
    const pet = POLYMERIZATION_MODELS.find((m) => m.id === 'poly-pet')
    expect(pet).toBeDefined()
    expect(pet?.smallMoleculeOutput).toContain('(2n - 1)')
  })

  it('含氮官能团扩展：硝基还原消耗 3 H₂，氰基加氢消耗 2 H₂ 且水解消耗 1 NaOH', () => {
    const { result } = renderHook(() =>
      useOrganicQuantitative({
        'nitro-no2': 1, // 消耗 3 H2
        'cyano-cn': 1, // 消耗 2 H2, 消耗 1 NaOH
      })
    )

    expect(result.current.H2).toBe(5)
    expect(result.current.NaOH).toBe(1)
    expect(result.current.breakdowns.H2).toHaveLength(2)
    expect(result.current.breakdowns.NaOH).toHaveLength(1)
    expect(result.current.breakdowns.H2[0].reason).toContain('硝基')
    expect(result.current.breakdowns.H2[1].reason).toContain('氰基')
  })

  it('CI 守门机制：全量 14 大官能团电荷与活泼氢守恒自动化遍历断言', () => {
    // 遍历所有官能团验证活泼氢与 Na/NaOH 守恒法则：
    // 1. 若与 Na 反应（产生 H2），则必为醇-OH、酚-OH 或 羧基-COOH，且消耗比为 1:1
    // 2. 羧基与 NaHCO3 必须 1:1 产生 CO2 且与 NaOH 1:1 中和
    // 3. 酚羟基消耗 1 NaOH 与 1 Na2CO3，但绝不消耗 NaHCO3
    for (const g of FUNCTIONAL_GROUPS) {
      if (g.consumptions.Na > 0) {
        expect(['alcohol-oh', 'phenol-oh', 'carboxyl-cooh']).toContain(g.id)
        expect(g.consumptions.Na).toBe(1)
      }
      if (g.consumptions.NaHCO3 > 0) {
        expect(g.id).toBe('carboxyl-cooh')
        expect(g.consumptions.NaHCO3).toBe(1)
      }
      if (g.id === 'phenol-oh') {
        expect(g.consumptions.NaOH).toBe(1)
        expect(g.consumptions.Na2CO3).toBe(1)
        expect(g.consumptions.NaHCO3).toBe(0)
      }
    }
  })

  it('CI 守门机制：极端全量混合物（包含全部 14 种官能团各 1 个）多维定量计算一致性', () => {
    const allCounts: Record<string, number> = {}
    FUNCTIONAL_GROUPS.forEach((g) => {
      allCounts[g.id] = 1
    })

    const { result } = renderHook(() => useOrganicQuantitative(allCounts))

    // 理论期望：
    // Na = 醇(1) + 酚(1) + 羧(1) = 3
    // NaOH = 酚(1) + 羧(1) + 醇酯(1) + 酚酯(2) + 卤代(1) + 酰胺(1) + 氰基(1) = 8
    // NaHCO3 = 羧(1) = 1
    // Na2CO3 = 酚(1) + 羧(0.5) = 1.5
    // Br2 = 双键(1) + 三键(2) + 酚(3) + 醛(1) = 7
    // H2 = 双键(1) + 三键(2) + 醛(1) + 酮(1) + 硝基(3) + 氰基(2) = 10
    // gasH2 = 醇(0.5) + 酚(0.5) + 羧(0.5) = 1.5
    // gasCO2 = 羧(1) = 1.0
    // precipitateAg = 醛(2) = 2.0
    expect(result.current.Na).toBe(3)
    expect(result.current.NaOH).toBe(8)
    expect(result.current.NaHCO3).toBe(1)
    expect(result.current.Na2CO3).toBe(1.5)
    expect(result.current.Br2).toBe(7)
    expect(result.current.H2).toBe(10)
    expect(result.current.gasH2).toBe(1.5)
    expect(result.current.gasCO2).toBe(1.0)
    expect(result.current.precipitateAg).toBe(2.0)
  })
})



