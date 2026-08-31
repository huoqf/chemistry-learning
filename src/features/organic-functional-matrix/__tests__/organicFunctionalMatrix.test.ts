import { describe, it, expect } from 'vitest'
import { FUNCTIONAL_GROUPS, GAOKAO_CLUES } from '../constants'
import { useOrganicQuantitative } from '../hooks/useOrganicQuantitative'
import { renderHook } from '@testing-library/react'

describe('有机官能团定性特征与定量转化反应矩阵数据与计算审计', () => {
  it('应包含 12 大新高考高频官能团与核心题眼', () => {
    expect(FUNCTIONAL_GROUPS.length).toBe(12)
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

    expect(GAOKAO_CLUES.length).toBeGreaterThanOrEqual(8)
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

  it('苯酚特异性定量：消耗 3 mol 浓溴水、0.5 mol Na2CO3 且不出气', () => {
    const phenol = FUNCTIONAL_GROUPS.find((g) => g.id === 'phenol-oh')
    expect(phenol?.consumptions.Br2).toBe(3)
    expect(phenol?.consumptions.Na2CO3).toBe(0.5)
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

  it('定量计算边界审计：空对象、单基团与极限组合鲁棒性', () => {
    // 空对象
    const { result: emptyResult } = renderHook(() => useOrganicQuantitative({}))
    expect(emptyResult.current.NaOH).toBe(0)
    expect(emptyResult.current.Na).toBe(0)
    expect(emptyResult.current.Br2).toBe(0)
    expect(emptyResult.current.H2).toBe(0)
    expect(emptyResult.current.gasCO2).toBe(0)
    expect(emptyResult.current.gasH2).toBe(0)

    // 水杨酸甲酯：1 酚羟基 + 1 醇酯 = 2 NaOH (1 中和 + 1 水解), 1 Na (0.5 H2)
    const { result: msResult } = renderHook(() =>
      useOrganicQuantitative({
        'phenol-oh': 1,
        'ester-coor': 1,
      })
    )
    expect(msResult.current.NaOH).toBe(2)
    expect(msResult.current.Na).toBe(1)
    expect(msResult.current.gasH2).toBe(0.5)
    expect(msResult.current.NaHCO3).toBe(0) // 酚和醇酯均不与 NaHCO3 反应
  })
})

