import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { VSEPR_MOLECULE_LIST, VSEPR_MOLECULE_MAP } from '../data/vseprData'
import { useVseprChemistry } from '../hooks/useVseprChemistry'

describe('母题五 VSEPR 与杂化轨道化学正确性与新高考真题对齐测试', () => {
  it('应当包含完整 17 种高考必考分子与离子', () => {
    expect(VSEPR_MOLECULE_LIST.length).toBe(17)
    expect(VSEPR_MOLECULE_MAP.so3).toBeDefined()
    expect(VSEPR_MOLECULE_MAP.h3o_plus).toBeDefined()
    expect(VSEPR_MOLECULE_MAP.no3_minus).toBeDefined()
    expect(VSEPR_MOLECULE_MAP.so4_2minus).toBeDefined()
    expect(VSEPR_MOLECULE_MAP.so3_2minus).toBeDefined()
    expect(VSEPR_MOLECULE_MAP.xef2).toBeDefined()
    expect(VSEPR_MOLECULE_MAP.xef4).toBeDefined()
  })

  it('CO2 (直线形, sp) 键角为 180° 且计算步骤准确', () => {
    const co2 = VSEPR_MOLECULE_MAP.co2
    const { result } = renderHook(() => useVseprChemistry(co2))

    expect(result.current.vseprFormulaText).toContain('2 + \\frac{4 - 2 \\times 2}{2} = 2')
    expect(co2.vseprGeometryName).toBe('直线形')
    expect(co2.molecularGeometryName).toBe('直线形')
    expect(co2.actualAngle).toBe(180)
  })

  it('经典硫系微粒四剑客 (SO2 / SO3 / SO3²⁻ / SO4²⁻) 构型与杂化辨析准确', () => {
    const so2 = VSEPR_MOLECULE_MAP.so2
    const so3 = VSEPR_MOLECULE_MAP.so3
    const so3_2minus = VSEPR_MOLECULE_MAP.so3_2minus
    const so4_2minus = VSEPR_MOLECULE_MAP.so4_2minus

    // SO2: sp2, V形, 1对孤对
    expect(so2.hybridization).toBe('sp2')
    expect(so2.lonePairs).toBe(1)
    expect(so2.molecularGeometryName).toBe('V形 (折线形)')

    // SO3: sp2, 平面三角形, 0对孤对
    expect(so3.hybridization).toBe('sp2')
    expect(so3.lonePairs).toBe(0)
    expect(so3.molecularGeometryName).toBe('平面三角形')

    // SO3 2-: sp3, 三角锥形, 1对孤对
    expect(so3_2minus.hybridization).toBe('sp3')
    expect(so3_2minus.lonePairs).toBe(1)
    expect(so3_2minus.molecularGeometryName).toBe('三角锥形')

    // SO4 2-: sp3, 正四面体形, 0对孤对
    expect(so4_2minus.hybridization).toBe('sp3')
    expect(so4_2minus.lonePairs).toBe(0)
    expect(so4_2minus.molecularGeometryName).toBe('正四面体形')
  })

  it('真题变式 5 稀有气体化合物 (XeF2 / XeF4) 构型与孤对推导严谨', () => {
    const xef2 = VSEPR_MOLECULE_MAP.xef2
    const xef4 = VSEPR_MOLECULE_MAP.xef4

    const { result: rXef2 } = renderHook(() => useVseprChemistry(xef2))
    const { result: rXef4 } = renderHook(() => useVseprChemistry(xef4))

    // XeF2: 5对电子 (sp3d), 3对赤道孤对, 直线形 (180°)
    expect(xef2.vseprPairs).toBe(5)
    expect(xef2.lonePairs).toBe(3)
    expect(xef2.hybridization).toBe('sp3d')
    expect(xef2.molecularGeometryName).toBe('直线形')
    expect(xef2.actualAngle).toBe(180)
    expect(rXef2.current.vseprCalculationSteps).toContain('孤电子对数 n = (8 - 2×1) / 2 = 3')

    // XeF4: 6对电子 (sp3d2), 2对轴向孤对, 平面正方形 (90°)
    expect(xef4.vseprPairs).toBe(6)
    expect(xef4.lonePairs).toBe(2)
    expect(xef4.hybridization).toBe('sp3d2')
    expect(xef4.molecularGeometryName).toBe('平面正方形')
    expect(xef4.actualAngle).toBe(90)
    expect(rXef4.current.vseprCalculationSteps).toContain('孤电子对数 n = (8 - 4×1) / 2 = 2')
  })

  it('阴离子 CO3²⁻ 与 NO₃⁻ 等电子体推导与电荷修正正确', () => {
    const co3 = VSEPR_MOLECULE_MAP.co3_2minus
    const no3 = VSEPR_MOLECULE_MAP.no3_minus

    const { result: rCo3 } = renderHook(() => useVseprChemistry(co3))
    const { result: rNo3 } = renderHook(() => useVseprChemistry(no3))

    expect(co3.lonePairs).toBe(0)
    expect(co3.vseprPairs).toBe(3)
    expect(co3.hybridization).toBe('sp2')
    expect(rCo3.current.vseprCalculationSteps).toContain('(4 + 2 - 3×2) / 2 = 0')

    expect(no3.lonePairs).toBe(0)
    expect(no3.vseprPairs).toBe(3)
    expect(no3.hybridization).toBe('sp2')
    expect(rNo3.current.vseprCalculationSteps).toContain('(5 + 1 - 3×2) / 2 = 0')
  })

  it('阳离子 NH4+ 与 H3O+ 杂化相同 (sp3) 但空间构型不同', () => {
    const nh4 = VSEPR_MOLECULE_MAP.nh4_plus
    const h3o = VSEPR_MOLECULE_MAP.h3o_plus

    const { result: rNh4 } = renderHook(() => useVseprChemistry(nh4))
    const { result: rH3o } = renderHook(() => useVseprChemistry(h3o))

    expect(nh4.vseprPairs).toBe(4)
    expect(nh4.lonePairs).toBe(0)
    expect(nh4.molecularGeometryName).toBe('正四面体形')
    expect(rNh4.current.vseprCalculationSteps).toContain('(5 - 1 - 4×1) / 2 = 0')

    expect(h3o.vseprPairs).toBe(4)
    expect(h3o.lonePairs).toBe(1)
    expect(h3o.molecularGeometryName).toBe('三角锥形')
    expect(rH3o.current.vseprCalculationSteps).toContain('(6 - 1 - 3×1) / 2 = 1')
  })

  it('CH4(109.5°) > NH3(107.3°) > H2O(104.5°) 键角递减规律严谨', () => {
    const ch4 = VSEPR_MOLECULE_MAP.ch4
    const nh3 = VSEPR_MOLECULE_MAP.nh3
    const h2o = VSEPR_MOLECULE_MAP.h2o

    expect(ch4.actualAngle).toBe(109.5)
    expect(nh3.actualAngle).toBe(107.3)
    expect(h2o.actualAngle).toBe(104.5)
    expect(h2o.molecularGeometryName).toBe('V形 (折线形)')

    expect(ch4.actualAngle).toBeGreaterThan(nh3.actualAngle)
    expect(nh3.actualAngle).toBeGreaterThan(h2o.actualAngle)
  })

  // ──────────────────────────────────────────────
  // 新高考结构题核心考点：σ/π 键计数与分子极性判定
  // ──────────────────────────────────────────────
  describe('高考结构必考：σ/π 键精确计数与分子极性判定', () => {
    /**
     * 17 种分子/离子的 σ/π 计数全表（离域 π 键 Π³₄ / Π⁴₆ 整体计 1 个 π 键，与高考答案口径一致）
     * 逐条独立推导依据：
     *   CO₂       O=C=O              2 个定域双键            -> 2σ + 2π
     *   SO₂       O=S=O (含 Π³₄)     2σ + 1 个离域 π         -> 2σ + 1π
     *   SO₃       平面三角 (含 Π⁴₆)   3σ + 1 个离域 π         -> 3σ + 1π
     *   BF₃       3 个 B-F 单键                                -> 3σ + 0π
     *   CH₄       4 个 C-H 单键                                -> 4σ + 0π
     *   NH₃       3 个 N-H 单键                                -> 3σ + 0π
     *   H₂O       2 个 O-H 单键                                -> 2σ + 0π
     *   CO₃²⁻     3σ + 1 个 Π⁴₆                                -> 3σ + 1π
     *   NO₃⁻      3σ + 1 个 Π⁴₆                                -> 3σ + 1π
     *   NH₄⁺      4 个 N-H 单键                                -> 4σ + 0π
     *   H₃O⁺      3 个 O-H 单键                                -> 3σ + 0π
     *   SO₄²⁻     4 个 S-O 单键 (正四面体)                      -> 4σ + 0π
     *   SO₃²⁻     3 个 S-O 单键                                -> 3σ + 0π
     *   PCl₅      5 个 P-Cl 单键                                -> 5σ + 0π
     *   SF₆       6 个 S-F 单键                                -> 6σ + 0π
     *   XeF₂      2 个轴向 Xe-F 单键                            -> 2σ + 0π
     *   XeF₄      4 个赤道 Xe-F 单键                            -> 4σ + 0π
     */
    const SIGMA_PI_TABLE: Record<string, [number, number]> = {
      co2: [2, 2],
      so2: [2, 1],
      so3: [3, 1],
      bf3: [3, 0],
      ch4: [4, 0],
      nh3: [3, 0],
      h2o: [2, 0],
      co3_2minus: [3, 1],
      no3_minus: [3, 1],
      nh4_plus: [4, 0],
      h3o_plus: [3, 0],
      so4_2minus: [4, 0],
      so3_2minus: [3, 0],
      pcl5: [5, 0],
      sf6: [6, 0],
      xef2: [2, 0],
      xef4: [4, 0],
    }

    it('17/17 全表 σ/π 键计数精确（含最易错的离域 π 体系 CO₃²⁻ / NO₃⁻ / SO₃）', () => {
      // 全表覆盖，不得只抽查部分条目
      expect(Object.keys(SIGMA_PI_TABLE).sort()).toEqual(
        VSEPR_MOLECULE_LIST.map(m => m.id).sort()
      )

      for (const [id, [sigma, pi]] of Object.entries(SIGMA_PI_TABLE)) {
        const mol = VSEPR_MOLECULE_MAP[id]
        expect(mol, `缺失条目 ${id}`).toBeDefined()
        expect(mol.sigmaBonds, `${mol.formula} σ 键数`).toBe(sigma)
        expect(mol.piBonds, `${mol.formula} π 键数`).toBe(pi)
        // σ 键数与「成键电子对数 / σ 骨架边数」三口径必须完全一致
        expect(mol.bondPairs, `${mol.formula} bondPairs`).toBe(sigma)
        expect(mol.bonds.length, `${mol.formula} 成键边数`).toBe(sigma)
        // 价层电子对数 = σ 键数 + 孤电子对数
        expect(mol.sigmaBonds! + mol.lonePairs, `${mol.formula} 价层电子对数`).toBe(
          mol.vseprPairs
        )
      }
    })

    it('平均键级与 σ/π 计数自洽: Σ bondOrder = σ + π（离域 π 均摊，不得逐键写双键）', () => {
      for (const mol of VSEPR_MOLECULE_LIST) {
        const sumBondOrder = mol.bonds.reduce((acc, b) => acc + b.bondOrder, 0)
        expect(sumBondOrder, `${mol.formula} Σ bondOrder`).toBeCloseTo(
          mol.sigmaBonds! + mol.piBonds!,
          9
        )
      }

      // 离域 π 体系的平均键级为分数，明确锁定口径（防止再次被误改为整数双键）
      expect(VSEPR_MOLECULE_MAP.so2.bonds.every(b => b.bondOrder === 1.5)).toBe(true)
      expect(VSEPR_MOLECULE_MAP.so3.bonds.every(b => b.bondOrder === 4 / 3)).toBe(true)
      expect(VSEPR_MOLECULE_MAP.co3_2minus.bonds.every(b => b.bondOrder === 4 / 3)).toBe(true)
      expect(VSEPR_MOLECULE_MAP.no3_minus.bonds.every(b => b.bondOrder === 4 / 3)).toBe(true)
      // 定域双键体系为整数 2
      expect(VSEPR_MOLECULE_MAP.co2.bonds.every(b => b.bondOrder === 2)).toBe(true)
    })

    it('高考极性/非极性微粒判定基于空间对称性与偶极矩抵消', () => {
      // 极性微粒 (不对称，偶极矩不为 0)
      expect(VSEPR_MOLECULE_MAP.so2.polarity).toBe('polar')
      expect(VSEPR_MOLECULE_MAP.nh3.polarity).toBe('polar')
      expect(VSEPR_MOLECULE_MAP.h2o.polarity).toBe('polar')
      expect(VSEPR_MOLECULE_MAP.h3o_plus.polarity).toBe('polar')
      expect(VSEPR_MOLECULE_MAP.so3_2minus.polarity).toBe('polar')

      // 非极性微粒 (高度对称，键偶极完全抵消)
      expect(VSEPR_MOLECULE_MAP.bf3.polarity).toBe('nonpolar')
      expect(VSEPR_MOLECULE_MAP.co2.polarity).toBe('nonpolar')
      expect(VSEPR_MOLECULE_MAP.ch4.polarity).toBe('nonpolar')
      expect(VSEPR_MOLECULE_MAP.so3.polarity).toBe('nonpolar')
      expect(VSEPR_MOLECULE_MAP.pcl5.polarity).toBe('nonpolar')
      expect(VSEPR_MOLECULE_MAP.sf6.polarity).toBe('nonpolar')
      expect(VSEPR_MOLECULE_MAP.xef2.polarity).toBe('nonpolar')
      expect(VSEPR_MOLECULE_MAP.xef4.polarity).toBe('nonpolar')
      expect(VSEPR_MOLECULE_MAP.nh4_plus.polarity).toBe('nonpolar')
      expect(VSEPR_MOLECULE_MAP.so4_2minus.polarity).toBe('nonpolar')
      expect(VSEPR_MOLECULE_MAP.co3_2minus.polarity).toBe('nonpolar')
      expect(VSEPR_MOLECULE_MAP.no3_minus.polarity).toBe('nonpolar')
    })

    it('非等价杂化与多键角分子的键角文案展示完整', () => {
      expect(VSEPR_MOLECULE_MAP.pcl5.angleDisplay).toContain('90°')
      expect(VSEPR_MOLECULE_MAP.pcl5.angleDisplay).toContain('120°')

      expect(VSEPR_MOLECULE_MAP.sf6.angleDisplay).toContain('90°')
      expect(VSEPR_MOLECULE_MAP.sf6.angleDisplay).toContain('180°')

      expect(VSEPR_MOLECULE_MAP.xef4.angleDisplay).toContain('90°')
      expect(VSEPR_MOLECULE_MAP.xef4.angleDisplay).toContain('180°')
    })

    it('PCl₅ 三角双锥必须给出 90° 与 120° 两套键角，且排斥说明不得写成"完全对称排布"', () => {
      const pcl5 = VSEPR_MOLECULE_MAP.pcl5
      // 3D 标注必须同时挂两套实测键角，而不是只有 120°
      const degrees = pcl5.angles.map((a) => a.angleDegree).sort((a, b) => a - b)
      expect(degrees).toEqual([90, 120])

      const { result } = renderHook(() => useVseprChemistry(pcl5))
      expect(result.current.lonePairRepulsionDescription).toContain('90°')
      expect(result.current.lonePairRepulsionDescription).toContain('120°')
      // 非等键角构型不得声称"完全对称排布 / 键角等于理想夹角"
      expect(result.current.lonePairRepulsionDescription).not.toContain('完全对称')

      // 反向保护：等键角分子仍保持"无孤对 → 键角为理想夹角"的表述
      const ch4Result = renderHook(() => useVseprChemistry(VSEPR_MOLECULE_MAP.ch4))
      expect(ch4Result.result.current.lonePairRepulsionDescription).toContain('109.5')
    })
  })
})
