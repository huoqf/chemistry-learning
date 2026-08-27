/**
 * 原电池纯化学计算与物理量导出单元测试
 *
 * 覆盖四大经典高考电池模型：
 *   1. 经典单槽电池 (Zn-Cu / H2SO4)
 *   2. 双槽盐桥电池 (Zn-Cu / ZnSO4-CuSO4)
 *   3. 氢氧燃料电池 (碱性 KOH / 酸性 H2SO4)
 *   4. 铅蓄电池放电 (Pb + PbO2 + 2H2SO4 = 2PbSO4 + 2H2O)
 */

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePrimaryCellChemistry } from '../usePrimaryCellChemistry'
import { buildPrimaryCellQuantities } from '@/data/quantities/reaction-principle/primaryCell'

describe('usePrimaryCellChemistry — 原电池化学计算测试', () => {
  // ──────────────────────────────────────────────
  // 1. 经典单槽 Zn-Cu 电池 (cellType = 0)
  // ──────────────────────────────────────────────
  describe('经典单槽 Zn-Cu 电池 (cellType = 0)', () => {
    it('负极 Zn 溶解减重，正极 Cu 析氢质量不变', () => {
      const { result } = renderHook(() =>
        usePrimaryCellChemistry({
          cellType: 0,
          electrolyteType: 0,
          current: 1.5,
          time: 5,
        })
      )

      // n(e⁻) > 0
      expect(result.current.ne).toBeGreaterThan(0)
      // 负极 Zn 溶解 (Zn - 2e⁻ = Zn²⁺), Δm(负) < 0
      expect(result.current.anodeDeltaM).toBeLessThan(0)
      // 正极析氢 (2H⁺ + 2e⁻ = H₂↑), Cu 电极不溶解不增重, Δm(正) = 0
      expect(result.current.cathodeDeltaM).toBe(0)
      // 电压 U ≈ 1.10 V
      expect(result.current.voltage).toBe(1.10)
      // H⁺ 反应消耗，浓度 cMain 下降 (< 1.0)
      expect(result.current.cMain).toBeLessThan(1.0)
    })
  })

  // ──────────────────────────────────────────────
  // 2. 双槽盐桥 Zn-Cu 电池 (cellType = 1)
  // ──────────────────────────────────────────────
  describe('双槽盐桥 Zn-Cu 电池 (cellType = 1)', () => {
    it('负极 Zn 溶解减重，正极 Cu 析出增重，符合摩尔质量比', () => {
      const { result } = renderHook(() =>
        usePrimaryCellChemistry({
          cellType: 1,
          electrolyteType: 0,
          current: 1.5,
          time: 6,
        })
      )

      // 负极 Zn 减重
      expect(result.current.anodeDeltaM).toBeLessThan(0)
      // 正极 Cu 增重
      expect(result.current.cathodeDeltaM).toBeGreaterThan(0)

      // 质量变化与摩尔质量匹配: |Δm_Zn| / 65.38 ≈ Δm_Cu / 63.55
      const znMoles = Math.abs(result.current.anodeDeltaM) / 65.38
      const cuMoles = result.current.cathodeDeltaM / 63.55
      expect(znMoles).toBeCloseTo(cuMoles, 2)
    })
  })

  // ──────────────────────────────────────────────
  // 3. 氢氧燃料电池 (cellType = 2)
  // ──────────────────────────────────────────────
  describe('氢氧燃料电池 (cellType = 2)', () => {
    it('多孔 Pt 电极质量均不改变，输出电压 U = 1.23 V', () => {
      const { result } = renderHook(() =>
        usePrimaryCellChemistry({
          cellType: 2,
          electrolyteType: 0, // 碱性
          current: 2.0,
          time: 8,
        })
      )

      expect(result.current.anodeDeltaM).toBe(0)
      expect(result.current.cathodeDeltaM).toBe(0)
      expect(result.current.voltage).toBe(1.23)
      // 碱性介质 OH⁻ 循环，cMain 保持稳定
      expect(result.current.cMain).toBe(1.0)
    })

    it('酸性介质生成水致电解质稀释，cMain 微弱下降', () => {
      const { result } = renderHook(() =>
        usePrimaryCellChemistry({
          cellType: 2,
          electrolyteType: 1, // 酸性
          current: 2.0,
          time: 8,
        })
      )

      expect(result.current.cMain).toBeLessThan(1.0)
    })
  })

  // ──────────────────────────────────────────────
  // 4. 铅蓄电池放电 (cellType = 3)
  // ──────────────────────────────────────────────
  describe('铅蓄电池放电模型 (cellType = 3)', () => {
    it('放电时两极均生成 PbSO₄ 沉淀致两极质量均增加，符合 96.1g 和 64.1g 比例', () => {
      const { result } = renderHook(() =>
        usePrimaryCellChemistry({
          cellType: 3,
          electrolyteType: 0,
          current: 1.5,
          time: 5,
        })
      )

      // 负极 Pb -> PbSO4: 增重 (+96.1 g/mol 每 2mol e⁻)
      expect(result.current.anodeDeltaM).toBeGreaterThan(0)
      // 正极 PbO2 -> PbSO4: 增重 (+64.1 g/mol 每 2mol e⁻)
      expect(result.current.cathodeDeltaM).toBeGreaterThan(0)
      // 增重比例: 96.1 / 64.1 ≈ 1.50
      expect(result.current.anodeDeltaM / result.current.cathodeDeltaM).toBeCloseTo(96.1 / 64.1, 1)
      // 输出电压 U ≈ 2.04 V
      expect(result.current.voltage).toBe(2.04)
    })
  })
})

describe('buildPrimaryCellQuantities — 右屏量化参数构建', () => {
  it('正确构建 5 项关键化学量', () => {
    const quantities = buildPrimaryCellQuantities({ cellType: 1, current: 1.5 }, 5)
    expect(quantities).toHaveLength(5)

    const ne = quantities.find((q) => q.key === 'ne')
    const voltage = quantities.find((q) => q.key === 'voltage')
    expect(ne).toBeDefined()
    expect(voltage?.value).toBe(1.10)
  })
})
