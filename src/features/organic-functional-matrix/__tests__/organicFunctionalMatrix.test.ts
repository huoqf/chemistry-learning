import { describe, it, expect } from 'vitest'
import {
  FUNCTIONAL_GROUPS,
  GAOKAO_CLUES,
  PROTECTION_GROUPS,
  POLYMERIZATION_MODELS,
  PRESET_MOLECULES,
} from '../constants'
import { ORGANIC_3D_MOLECULES } from '../data/organic3dData'
import { useOrganicQuantitative } from '../hooks/useOrganicQuantitative'
import { renderHook } from '@testing-library/react'

describe('有机官能团定性特征与定量转化反应矩阵数据与计算审计', () => {
  it('应包含 16 大新高考高频官能团与核心题眼', () => {
    expect(FUNCTIONAL_GROUPS.length).toBe(16)
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
    expect(ids).toContain('ether-bond')
    expect(ids).toContain('carbonate-ester')

    expect(GAOKAO_CLUES.length).toBe(14)
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
    const phenolEsterBreakdown = result.current.breakdowns.NaOH.find((b) => b.groupId === 'phenol-ester')
    const carboxylBreakdown = result.current.breakdowns.NaOH.find((b) => b.groupId === 'carboxyl-cooh')
    expect(phenolEsterBreakdown?.totalMol).toBe(4)
    expect(carboxylBreakdown?.totalMol).toBe(1)
  })

  it('Na2CO3 定量消耗与气体特征：1 酚羟基 + 1 羧基 体系消耗 1.5 mol Na2CO3，遇 NaHCO3 放 1.0 mol CO2', () => {
    const { result } = renderHook(() =>
      useOrganicQuantitative({
        'phenol-oh': 1, // 消耗 1 Na2CO3 (生成 1 NaHCO3 不出气)
        'carboxyl-cooh': 1, // 消耗 0.5 Na2CO3 (放 0.5 CO2)
      })
    )

    expect(result.current.Na2CO3).toBe(1.5)
    // 验证与 NaHCO3 专属定性放气特征 (1 mol 羧基 1:1 放 1 mol CO2)
    expect(result.current.gasCO2).toBe(1)
    expect(result.current.NaOH).toBe(2)
    expect(result.current.Na).toBe(2)
    expect(result.current.gasH2).toBe(1.0)
  })

  it('16 大官能团均应具备完整的定性检验试剂、现象与定性特征标注', () => {
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

  it('3D 空间球棍模型数据库应完整覆盖 16 大官能团与核心母题分子', async () => {
    const { ORGANIC_3D_MOLECULES, get3DModelForGroup } = await import('../data/organic3dData')
    
    // 验证所有 16 大官能团均能正确获取 3D 模型
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
    expect(cisButene.atoms.length).toBe(12) // 4 C + 8 H 全原子真实球棍
    expect(transButene.atoms.length).toBe(12) // 4 C + 8 H 全原子真实球棍
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
    const nitroH2 = result.current.breakdowns.H2.find((b) => b.groupId === 'nitro-no2')
    const cyanoH2 = result.current.breakdowns.H2.find((b) => b.groupId === 'cyano-cn')
    expect(nitroH2?.reason).toContain('硝基')
    expect(cyanoH2?.reason).toContain('氰基')
  })

  it('CI 守门机制：全量 16 大官能团电荷与活泼氢守恒自动化遍历断言', () => {
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

  it('CI 守门机制：极端全量混合物（包含全部 16 种官能团各 1 个）多维定量计算一致性', () => {
    const allCounts: Record<string, number> = {}
    FUNCTIONAL_GROUPS.forEach((g) => {
      allCounts[g.id] = 1
    })

    const { result } = renderHook(() => useOrganicQuantitative(allCounts))

    // 理论期望：
    // Na = 醇(1) + 酚(1) + 羧(1) = 3
    // NaOH = 酚(1) + 羧(1) + 醇酯(1) + 酚酯(2) + 卤代(1) + 酰胺(1) + 氰基(1) + 碳酸酯(2) = 10
    // NaHCO3 = 羧(1) = 1
    // Na2CO3 = 酚(1) + 羧(0.5) = 1.5
    // Br2 = 双键(1) + 三键(2) + 酚(3) + 醛(1) = 7
    // H2 = 双键(1) + 三键(2) + 醛(1) + 酮(1) + 硝基(3) + 氰基(2) = 10
    // gasH2 = 醇(0.5) + 酚(0.5) + 羧(0.5) = 1.5
    // gasCO2 = 羧(1) = 1.0
    // precipitateAg = 醛(2) = 2.0
    expect(result.current.Na).toBe(3)
    expect(result.current.NaOH).toBe(10)
    expect(result.current.NaHCO3).toBe(1)
    expect(result.current.Na2CO3).toBe(1.5)
    expect(result.current.Br2).toBe(7)
    expect(result.current.H2).toBe(10)
    expect(result.current.gasH2).toBe(1.5)
    expect(result.current.gasCO2).toBe(1.0)
    expect(result.current.precipitateAg).toBe(2.0)
  })

  it('3D 球棍模型全原子与化学键拓扑严格审计：无缺失氢原子、无孤立悬空原子', () => {
    // 理论各分子的 H 原子总数期望字典
    const EXPECTED_H_COUNTS: Record<string, number> = {
      'alkene-c=c': 4, // 乙烯 C2H4
      'alkyne-c#c': 2, // 乙炔 C2H2
      'alcohol-oh': 6, // 乙醇 C2H6O
      'phenol-oh': 6, // 苯酚 C6H6O
      'benzyl-alcohol': 8, // 苯甲醇 C7H8O
      'aldehyde-cho': 4, // 乙醛 C2H4O
      'ketone-co': 6, // 丙酮 C3H6O
      'carboxyl-cooh': 4, // 乙酸 C2H4O2
      'ester-coor': 8, // 乙酸乙酯 C4H8O2
      'phenol-ester': 8, // 乙酸苯酯 C8H8O2
      'halo-alkane-x': 5, // 溴乙烷 C2H5Br
      'halo-halogen': 5, // 别名
      'amide-conh': 5, // 乙酰胺 C2H5NO
      'peptide-amide': 5, // 别名
      'amino-nh2': 7, // 乙胺 C2H7N
      'nitro-no2': 5, // 硝基苯 C6H5NO2
      'cyano-cn': 3, // 乙腈 C2H3N
      'ether-bond': 6, // 二甲醚 C2H6O
      'carbonate-ester': 6, // 碳酸二甲酯 C3H6O3
      'alkene-cis-2-butene': 8, // 顺-2-丁烯 C4H8
      'alkene-trans-2-butene': 8, // 反-2-丁烯 C4H8
      'lactic-acid-chiral': 6, // L-乳酸 C3H6O3
      'd-lactic-acid-chiral': 6, // D-乳酸 C3H6O3
      '2-chlorobutane-chiral': 9, // 2-氯丁烷 C4H9Cl
      aspirin: 8, // 阿司匹林 C9H8O4
      'formic-phenyl-ester': 6, // 甲酸苯酯 C7H6O2
      'methyl-salicylate': 8, // 水杨酸甲酯 C8H8O3
      salicylaldehyde: 6, // 水杨醛 C7H6O2
    }

    for (const [id, mol] of Object.entries(ORGANIC_3D_MOLECULES)) {
      expect(mol.atoms.length).toBeGreaterThan(0)
      expect(mol.bonds.length).toBeGreaterThan(0)

      // 验证 H 原子总数
      const expectedH = EXPECTED_H_COUNTS[id]
      if (expectedH !== undefined) {
        const actualH = mol.atoms.filter((a) => a.symbol === 'H').length
        expect(actualH, `分子 [${id}] 的 H 原子数应为 ${expectedH}，但实际为 ${actualH}`).toBe(expectedH)
      }

      // 验证拓扑连通性：每个原子都必须有至少一条化学键连接
      for (const atom of mol.atoms) {
        const isConnected = mol.bonds.some((b) => {
          const dStart = Math.hypot(b.start[0] - atom.position[0], b.start[1] - atom.position[1], b.start[2] - atom.position[2])
          const dEnd = Math.hypot(b.end[0] - atom.position[0], b.end[1] - atom.position[1], b.end[2] - atom.position[2])
          return dStart < 0.25 || dEnd < 0.25
        })
        expect(isConnected, `分子 [${id}] 中的原子 [${atom.id}] (${atom.elementName}) 必须连入化学键网络`).toBe(true)
      }
    }
  })

  it('化学物理量与空间几何严格审计：键长合规、无原子重叠、价键饱和度', () => {
    for (const [id, mol] of Object.entries(ORGANIC_3D_MOLECULES)) {
      // 1. 检查键长是否在合理世界单位区间 [0.5, 2.2]
      for (const bond of mol.bonds) {
        const len = Math.hypot(
          bond.end[0] - bond.start[0],
          bond.end[1] - bond.start[1],
          bond.end[2] - bond.start[2]
        )
        expect(
          len,
          `分子 [${id}] 中的化学键 [${bond.id}] 长度 (${len.toFixed(2)}) 必须在 [0.5, 2.2] 合理区间`
        ).toBeGreaterThanOrEqual(0.5)
        expect(
          len,
          `分子 [${id}] 中的化学键 [${bond.id}] 长度 (${len.toFixed(2)}) 不能过长`
        ).toBeLessThanOrEqual(2.2)
      }

      // 2. 检查任意两原子之间不能发生非物理重叠 (距离 > 0.4)
      const n = mol.atoms.length
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const a1 = mol.atoms[i]
          const a2 = mol.atoms[j]
          const dist = Math.hypot(
            a1.position[0] - a2.position[0],
            a1.position[1] - a2.position[1],
            a1.position[2] - a2.position[2]
          )
          expect(
            dist,
            `分子 [${id}] 中的两原子 [${a1.id}] 与 [${a2.id}] 距离 (${dist.toFixed(2)}) 过近，发生非物理重叠`
          ).toBeGreaterThan(0.4)
        }
      }

      // 3. 检查每个原子的半径与颜色符合标准 Token
      for (const atom of mol.atoms) {
        expect(atom.radius).toBeGreaterThan(0.15)
        expect(atom.radius).toBeLessThanOrEqual(0.5)
        expect(atom.color).toBeDefined()
        expect(atom.symbol).toMatch(/^(C|H|O|N|Br|Cl)$/)
      }
    }
  })

  it('新教材扩展基团审计：醚键完全不反应(惰性)，碳酸酯基水解消耗 2 mol NaOH', () => {
    const { result: etherRes } = renderHook(() =>
      useOrganicQuantitative({
        'ether-bond': 1,
      })
    )
    expect(etherRes.current.Na).toBe(0)
    expect(etherRes.current.NaOH).toBe(0)
    expect(etherRes.current.NaHCO3).toBe(0)
    expect(etherRes.current.Br2).toBe(0)
    expect(etherRes.current.H2).toBe(0)

    const { result: carbRes } = renderHook(() =>
      useOrganicQuantitative({
        'carbonate-ester': 1,
      })
    )
    expect(carbRes.current.NaOH).toBe(2)
    expect(carbRes.current.breakdowns.NaOH[0].reason).toContain('碳酸酯基水解')
  })

  it('高考题眼线索 (GAOKAO_CLUES) 映射完备性：所有 matchedGroupId 必须合法存在于 FUNCTIONAL_GROUPS', () => {
    const validGroupIds = new Set(FUNCTIONAL_GROUPS.map((g) => g.id))
    for (const clue of GAOKAO_CLUES) {
      expect(
        validGroupIds.has(clue.matchedGroupId),
        `线索 [${clue.id}] 的 matchedGroupId [${clue.matchedGroupId}] 必须存在于 FUNCTIONAL_GROUPS 中`
      ).toBe(true)
      expect(clue.clueText.length).toBeGreaterThan(0)
      expect(clue.deductionTarget.length).toBeGreaterThan(0)
      expect(clue.principle.length).toBeGreaterThan(0)
    }
  })

  it('高考预设母题分子 (PRESET_MOLECULES) 全量数据自洽性审计：官能团存在且定量计算一致', () => {
    const validGroupIds = new Set(FUNCTIONAL_GROUPS.map((g) => g.id))
    expect(PRESET_MOLECULES.length).toBe(9)

    for (const preset of PRESET_MOLECULES) {
      expect(preset.chemicalName.length).toBeGreaterThan(0)
      expect(preset.keyEquations.length).toBeGreaterThan(0)
      expect(preset.examAnalysis.length).toBeGreaterThan(0)

      // 验证 counts 中的官能团 ID 合法性
      for (const [groupId, count] of Object.entries(preset.counts)) {
        expect(
          validGroupIds.has(groupId),
          `母题 [${preset.id}] 中的官能团 [${groupId}] 必须为合法的 FUNCTIONAL_GROUPS ID`
        ).toBe(true)
        expect(count).toBeGreaterThan(0)
      }

      // 验证调用定量计算 hook 不报错且产物有效
      const { result } = renderHook(() => useOrganicQuantitative(preset.counts))
      expect(result.current).toBeDefined()
      expect(typeof result.current.NaOH).toBe('number')
      expect(typeof result.current.Na).toBe('number')
      expect(typeof result.current.Br2).toBe('number')
      expect(typeof result.current.H2).toBe('number')
    }
  })

  it('高中化学立体构型铁律：手性碳 (*C) 必须严格为 sp³ 杂化四面体构型', () => {
    for (const [id, mol] of Object.entries(ORGANIC_3D_MOLECULES)) {
      for (const atom of mol.atoms) {
        if (atom.isChiral) {
          expect(
            atom.symbol,
            `分子 [${id}] 中标记为手性中心的原子 [${atom.id}] 元素符号必须为 C`
          ).toBe('C')
          expect(
            atom.hybridization,
            `分子 [${id}] 中的手性碳原子 [${atom.id}] 必须为 sp³ 杂化四面体，严禁为 sp² 或 sp`
          ).toBe('sp³')
        }
      }
    }
  })

  it('Hook 防御性边界审计：空对象、非正数计数及未知 ID 均能安全处理', () => {
    const { result: emptyRes } = renderHook(() => useOrganicQuantitative({}))
    expect(emptyRes.current.Na).toBe(0)
    expect(emptyRes.current.NaOH).toBe(0)
    expect(emptyRes.current.breakdowns.NaOH).toEqual([])

    const { result: zeroRes } = renderHook(() =>
      useOrganicQuantitative({
        'phenol-oh': 0,
        'carboxyl-cooh': -1,
        'unknown-group-id': 2,
      })
    )
    expect(zeroRes.current.Na).toBe(0)
    expect(zeroRes.current.NaOH).toBe(0)
    expect(zeroRes.current.breakdowns.Na).toEqual([])
  })

  it('3D 模型查找防御性审计：不存在的 ID 安全返回 undefined', async () => {
    const { get3DModelForGroup } = await import('../data/organic3dData')
    expect(get3DModelForGroup('non-existent-group')).toBeUndefined()
  })

  it('甲醛题眼特异性：明确标注 1 mol HCHO 等效含 2 醛基并生成 4 mol Ag', () => {
    const aldehyde = FUNCTIONAL_GROUPS.find((g) => g.id === 'aldehyde-cho')
    expect(aldehyde?.qualitativeFeatures?.silverOrFehling).toContain('甲醛 1 mol 产生 4 Ag')
    expect(aldehyde?.notes).toContain('1 mol HCHO 产生 4 mol Ag')
  })
})





