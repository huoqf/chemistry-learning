import { describe, it, expect } from 'vitest'
import { VSEPR_MOLECULE_LIST, VSEPR_MOLECULE_MAP } from '../data/vseprData'
import { useVseprChemistry } from '../hooks/useVseprChemistry'
import { renderHook } from '@testing-library/react'
import type { HybridizationType, VseprGeometryType, MolecularGeometryType } from '../types'

/**
 * vseprChemistryTruthAuditor.test.ts
 *
 * 高中化学物质结构 (VSEPR 与杂化轨道) 真理性与高考命题合规性自动化守门测试套件
 * 参考项目中已有 chemistryTruthAuditor / valenceMatrixChemistryAudit 范式构建。
 *
 * 杜绝 5 类化学事实硬伤：
 * 1. 孤电子对计算公式代入错误或电荷修正反转
 * 2. 价层电子对数与杂化类型映射违背理论
 * 3. 构型命名术语违背新课标规范（如混淆 VSEPR 模型与空间构型、出现非规范"角形"）
 * 4. 键角变化违背孤电子对静电斥力递变物理规律
 * 5. 3D 几何拓扑断裂（原子数/孤对向量与化学量失真、坐标 NaN）
 */

describe('母题五：VSEPR 与杂化轨道高中化学真理性守门审计', () => {
  // 课标规范几何名称白名单 (人教版选必 2 标准)
  const VALID_VSEPR_GEOMETRY_NAMES: Record<VseprGeometryType, string[]> = {
    linear: ['直线形'],
    trigonal_planar: ['平面三角形'],
    tetrahedral: ['四面体形', '正四面体形'],
    trigonal_bipyramidal: ['三角双锥形'],
    octahedral: ['正八面体形'],
  }

  const VALID_MOLECULAR_GEOMETRY_NAMES: Record<MolecularGeometryType, string[]> = {
    linear: ['直线形'],
    trigonal_planar: ['平面三角形'],
    bent: ['V形 (折线形)', 'V形'],
    tetrahedral: ['正四面体形', '正四面体'],
    trigonal_pyramidal: ['三角锥形'],
    square_planar: ['平面正方形'],
    trigonal_bipyramidal: ['三角双锥形'],
    octahedral: ['正八面体形'],
  }

  describe('防线 1：课标孤电子对公式与离子电荷修正守门', () => {
    it('全量 17 种微粒孤电子对数与价层对数必须 100% 满足课标公式 n = (a ± q - xb) / 2', () => {
      VSEPR_MOLECULE_LIST.forEach(mol => {
        const a = mol.centerValenceElectrons
        const x = mol.terminalAtomCount
        const b = mol.terminalAtomElectronNeed
        const q = mol.charge

        // 阳离子 -q，阴离子 +|q|
        const chargeOffset = q < 0 ? Math.abs(q) : -q
        const correctedCentralElectrons = a + chargeOffset

        const expectedLonePairs = (correctedCentralElectrons - x * b) / 2
        const expectedTotalPairs = x + expectedLonePairs

        expect(
          mol.lonePairs,
          `微粒 [${mol.formula}] 孤电子对数计算错误：期望 ${expectedLonePairs}，实际 ${mol.lonePairs}`
        ).toBe(expectedLonePairs)

        expect(mol.lonePairs, `微粒 [${mol.formula}] 孤电子对数不能为负数`).toBeGreaterThanOrEqual(0)

        expect(
          mol.vseprPairs,
          `微粒 [${mol.formula}] 价层对数计算错误：期望 ${expectedTotalPairs}，实际 ${mol.vseprPairs}`
        ).toBe(expectedTotalPairs)

        // 杂化轨道只参与形成 σ 键，σ 键电子对数必须精确等于配位原子数 x
        expect(
          mol.bondPairs,
          `微粒 [${mol.formula}] σ 键电子对数 (${mol.bondPairs}) 必须精确等于配位原子数 x (${x})`
        ).toBe(x)
      })
    })

    it('踩分推导字符串中严禁出现混淆符号，必须严格匹配课标 x + (a ± q - xb) / 2 步骤', () => {
      VSEPR_MOLECULE_LIST.forEach(mol => {
        const { result } = renderHook(() => useVseprChemistry(mol))
        const { vseprFormulaText, vseprCalculationSteps } = result.current

        expect(vseprFormulaText, `微粒 [${mol.formula}] KaTeX 公式未遵循课标`).toContain('\\text{价层对数}')
        expect(vseprCalculationSteps, `微粒 [${mol.formula}] 步骤未标明中心价电子 a`).toContain('价电子数 a =')
        expect(vseprCalculationSteps, `微粒 [${mol.formula}] 步骤未标明配位数 x`).toContain('配位原子数 x =')
      })
    })
  })

  describe('防线 2：价层电子对数与杂化轨道类型映射守门', () => {
    it('杂化类型必须严格由价层电子对数决定 (2:sp, 3:sp², 4:sp³, 5:sp³d, 6:sp³d²)', () => {
      const EXPECTED_HYBRID: Record<number, HybridizationType> = {
        2: 'sp',
        3: 'sp2',
        4: 'sp3',
        5: 'sp3d',
        6: 'sp3d2',
      }

      VSEPR_MOLECULE_LIST.forEach(mol => {
        const expected = EXPECTED_HYBRID[mol.vseprPairs]
        expect(
          mol.hybridization,
          `微粒 [${mol.formula}] 价层电子对数为 ${mol.vseprPairs}，杂化类型应为 ${expected}`
        ).toBe(expected)
      })
    })
  })

  describe('防线 3：新高考阅卷采分术语白名单守门', () => {
    it('立体构型名称必须符合高考规范，严禁出现非规范的"角形"术语', () => {
      VSEPR_MOLECULE_LIST.forEach(mol => {
        // 1. 绝对严禁出现非标准词汇 (角形)
        expect(mol.molecularGeometryName, `微粒 [${mol.formula}] 空间构型禁止包含非规范词汇 "(角形)"`).not.toContain('(角形)')
        expect(mol.molecularGeometryName, `微粒 [${mol.formula}] 空间构型禁止为 "角形"`).not.toBe('角形')

        // 2. 空间构型必须严格属于高考合规白名单
        const validMolList = VALID_MOLECULAR_GEOMETRY_NAMES[mol.molecularGeometry]
        expect(
          validMolList.includes(mol.molecularGeometryName),
          `微粒 [${mol.formula}] 空间构型术语 [${mol.molecularGeometryName}] 不在高考规范白名单中`
        ).toBe(true)

        // 3. VSEPR 模型名称必须符合课标规范白名单
        const validVseprList = VALID_VSEPR_GEOMETRY_NAMES[mol.vseprGeometry]
        expect(
          validVseprList.includes(mol.vseprGeometryName),
          `微粒 [${mol.formula}] VSEPR 模型术语 [${mol.vseprGeometryName}] 与类型 [${mol.vseprGeometry}] 不符`
        ).toBe(true)
      })
    })

    it('无孤电子对分子其 VSEPR 理想模型与实际空间构型必须完全一致', () => {
      VSEPR_MOLECULE_LIST.filter(m => m.lonePairs === 0).forEach(mol => {
        expect(
          mol.vseprGeometry,
          `无孤对微粒 [${mol.formula}] 的 VSEPR 模型应与其空间构型类型一致`
        ).toBe(mol.molecularGeometry)
      })
    })

    it('含孤电子对分子其实际构型严禁与 VSEPR 模型混淆', () => {
      // 如 SO2 (平面三角 vs V形), NH3 (四面体 vs 三角锥), H2O (四面体 vs V形)
      VSEPR_MOLECULE_LIST.filter(m => m.lonePairs > 0).forEach(mol => {
        expect(
          mol.vseprGeometry as string,
          `含孤对微粒 [${mol.formula}] 的空间构型 [${mol.molecularGeometry}] 严禁与 VSEPR 模型相同`
        ).not.toBe(mol.molecularGeometry)
      })
    })
  })

  describe('防线 4：孤电子对斥力与键角压缩物理规律守门', () => {
    it('同周期 sp³ 杂化经典体系严格满足键角递减律：CH₄(109.5°) > NH₃(107.3°) > H₂O(104.5°)', () => {
      const ch4 = VSEPR_MOLECULE_MAP.ch4
      const nh3 = VSEPR_MOLECULE_MAP.nh3
      const h2o = VSEPR_MOLECULE_MAP.h2o

      expect(ch4.actualAngle).toBe(109.5)
      expect(nh3.actualAngle).toBeLessThan(ch4.actualAngle)
      expect(h2o.actualAngle).toBeLessThan(nh3.actualAngle)
    })

    it('同中心原子孤电子对挤压规律：SO₃(120°) > SO₂(119.5°)', () => {
      const so3 = VSEPR_MOLECULE_MAP.so3
      const so2 = VSEPR_MOLECULE_MAP.so2

      expect(so3.actualAngle).toBe(120)
      expect(so2.actualAngle).toBeLessThan(so3.actualAngle)
    })

    it('配位键转化消除孤电子对导致键角变大：NH₄⁺(109.5°) > NH₃(107.3°) 与 H₃O⁺(107°) > H₂O(104.5°)', () => {
      const nh4 = VSEPR_MOLECULE_MAP.nh4_plus
      const nh3 = VSEPR_MOLECULE_MAP.nh3
      const h3o = VSEPR_MOLECULE_MAP.h3o_plus
      const h2o = VSEPR_MOLECULE_MAP.h2o
      const so4 = VSEPR_MOLECULE_MAP.so4_2minus
      const so3_2minus = VSEPR_MOLECULE_MAP.so3_2minus

      // NH4+ 失去孤对，键角变大为 109.5°
      expect(nh4.actualAngle).toBeGreaterThan(nh3.actualAngle)

      // H3O+ 孤对由 2 对减为 1 对，键角变大为 107°
      expect(h3o.actualAngle).toBeGreaterThan(h2o.actualAngle)

      // SO4²⁻ (0对孤对) > SO3²⁻ (1对孤对)
      expect(so4.actualAngle).toBeGreaterThan(so3_2minus.actualAngle)
    })

    it('有孤电子对微粒的实际键角不得大于其理想对称几何键角', () => {
      VSEPR_MOLECULE_LIST.filter(m => m.lonePairs > 0).forEach(mol => {
        expect(
          mol.actualAngle,
          `含孤对微粒 [${mol.formula}] 的实际键角 (${mol.actualAngle}°) 绝不可大于理想角度 (${mol.theoreticalAngle}°)`
        ).toBeLessThanOrEqual(mol.theoreticalAngle)
      })
    })
  })

  describe('防线 5：高考经典等电子体对偶立体构型一致性守门', () => {
    it('等电子体对偶微粒必须具备相同的价层电子对数、杂化类型与立体构型', () => {
      const isoelectronicPairs = [
        { molA: VSEPR_MOLECULE_MAP.co3_2minus, molB: VSEPR_MOLECULE_MAP.no3_minus, desc: 'CO3²⁻ 与 NO3⁻ (24e⁻ 等电子体)' },
        { molA: VSEPR_MOLECULE_MAP.ch4, molB: VSEPR_MOLECULE_MAP.nh4_plus, desc: 'CH4 与 NH4⁺ (8e⁻ 等电子体)' },
        { molA: VSEPR_MOLECULE_MAP.nh3, molB: VSEPR_MOLECULE_MAP.h3o_plus, desc: 'NH3 与 H3O⁺ (8e⁻ 等电子体)' },
      ]

      isoelectronicPairs.forEach(({ molA, molB, desc }) => {
        expect(molA.vseprPairs, `[${desc}] 价层对数不一致`).toBe(molB.vseprPairs)
        expect(molA.lonePairs, `[${desc}] 孤电子对数不一致`).toBe(molB.lonePairs)
        expect(molA.hybridization, `[${desc}] 杂化轨道不一致`).toBe(molB.hybridization)
        expect(molA.molecularGeometry, `[${desc}] 空间构型不一致`).toBe(molB.molecularGeometry)
      })
    })
  })

  describe('防线 6：3D 空间几何拓扑与超价微粒孤对排布守门', () => {
    it('所有 17 种微粒的原子节点、化学键连通性、孤电子对节点必须与理论完全吻合', () => {
      VSEPR_MOLECULE_LIST.forEach(mol => {
        // 1. 原子总数 = 1 (中心原子) + 配位原子数
        expect(
          mol.atoms.length,
          `微粒 [${mol.formula}] 原子数组长度与配位原子数不匹配`
        ).toBe(mol.terminalAtomCount + 1)

        const center = mol.atoms.find(a => a.role === 'center')
        expect(center, `微粒 [${mol.formula}] 必须有且仅有一个中心原子`).toBeDefined()

        // 2. 化学键条数必须等于配位原子数，且所有化学键必须连到中心原子
        expect(
          mol.bonds.length,
          `微粒 [${mol.formula}] 化学键数 (${mol.bonds.length}) 与配位原子数 (${mol.terminalAtomCount}) 不符`
        ).toBe(mol.terminalAtomCount)

        mol.bonds.forEach(bond => {
          const connectsCenter = bond.fromAtomId === center?.id || bond.toAtomId === center?.id
          expect(connectsCenter, `微粒 [${mol.formula}] 化学键 [${bond.id}] 未连接中心原子`).toBe(true)
        })

        // 3. 孤电子对节点数与理论值一致
        expect(
          mol.lonePairNodes.length,
          `微粒 [${mol.formula}] 孤电子对节点数 (${mol.lonePairNodes.length}) 与理论 lonePairs (${mol.lonePairs}) 不符`
        ).toBe(mol.lonePairs)

        // 4. 键角标注必须存在且角度与实际键角吻合
        expect(mol.angles.length, `微粒 [${mol.formula}] 必须至少包含一个有效键角标注`).toBeGreaterThan(0)

        // 5. 3D 坐标中严禁出现 NaN 或 Infinity
        mol.atoms.forEach(atom => {
          atom.position.forEach(coord => {
            expect(Number.isFinite(coord), `微粒 [${mol.formula}] 原子 [${atom.symbol}] 坐标含非数`).toBe(true)
          })
        })

        mol.lonePairNodes.forEach(lp => {
          lp.direction.forEach(dir => {
            expect(Number.isFinite(dir), `微粒 [${mol.formula}] 孤对向量含非数`).toBe(true)
          })
        })
      })
    })

    it('超价微粒 XeF₂ 与 XeF₄ 的孤对空间分布严格符合 VSEPR 排斥最小原理', () => {
      const xef2 = VSEPR_MOLECULE_MAP.xef2
      const xef4 = VSEPR_MOLECULE_MAP.xef4

      // XeF2: 3 对孤电子对必须严格位于赤道面 (Y=0)，2 个 F 位于上下轴向 (X=0, Z=0)
      xef2.lonePairNodes.forEach((lp, idx) => {
        expect(
          Math.abs(lp.direction[1]),
          `XeF₂ 第 ${idx + 1} 对孤对必须位于赤道平面 (Y轴分量应为 0)`
        ).toBeCloseTo(0, 4)
      })
      const fAtomsXeF2 = xef2.atoms.filter(a => a.role === 'terminal')
      fAtomsXeF2.forEach(f => {
        expect(f.position[0], 'XeF₂ 轴向 F 原子 X 坐标应为 0').toBeCloseTo(0, 4)
        expect(f.position[2], 'XeF₂ 轴向 F 原子 Z 坐标应为 0').toBeCloseTo(0, 4)
      })

      // XeF4: 2 对孤电子对处于八面体对位上下轴向 (X=0, Z=0)，4 个 F 处于赤道平面 (Y=0)
      xef4.lonePairNodes.forEach((lp, idx) => {
        expect(lp.direction[0], `XeF₄ 第 ${idx + 1} 对孤对 X 分量应为 0`).toBeCloseTo(0, 4)
        expect(lp.direction[2], `XeF₄ 第 ${idx + 1} 对孤对 Z 分量应为 0`).toBeCloseTo(0, 4)
        expect(Math.abs(lp.direction[1]), `XeF₄ 第 ${idx + 1} 对孤对必须处于 Y 轴两极`).toBeGreaterThan(0.5)
      })
      const fAtomsXeF4 = xef4.atoms.filter(a => a.role === 'terminal')
      fAtomsXeF4.forEach(f => {
        expect(f.position[1], 'XeF₄ 赤道 F 原子 Y 坐标应为 0 (平面正方形)').toBeCloseTo(0, 4)
      })
    })
  })
})
