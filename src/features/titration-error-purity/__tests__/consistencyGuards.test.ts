/**
 * 实验三「定量滴定误差与纯度产率」复审问题守门测试
 *
 * 覆盖本轮修复（修复报告 §5.2 P1-Q2~Q6、§5.4）：
 *   P1-Q2  误差「数值幅度」为简化系数，必须显式标注 isIndicative（高考只判方向）
 *   P1-Q3  视线方向文字：仰视=视线向上、俯视=视线向下（此前两者写反）
 *   P1-Q4  左屏「滴定体系」选择器必须在化学计算层真正生效（指示剂/终点判定指引）
 *   P1-Q5  产率的化学计量系数比必须可从左屏调节（此前 hook 有 ratio 但无 UI 入口）
 *   P1-Q6  等当点体积与计量量程必须跟随参数，不得把 20.00 mL / 40 mL 写死在视图里
 *   §5.4   「定容时俯视」必须界定为配制标准溶液时；题库"粗 CaCO₃"不得给出 100% 纯度
 */

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTitrationErrorChemistry } from '../hooks/useTitrationErrorChemistry'
import { DEFAULT_TITRATION_ERROR_PARAMS } from '../constants'
import { modelTitrationErrorPurity } from '../../../data/quiz/model-titration-error-purity'
import type { TitrationErrorParams, TitrationType } from '../types'

/* 用 Vite `?raw` 读取视图源码文本（不依赖 node 内建模块 / 无需 @types/node） */
const CENTER_SRC =
  Object.values(
    import.meta.glob<string>('../components/TitrationErrorCenterView.tsx', {
      query: '?raw',
      import: 'default',
      eager: true,
    })
  )[0] ?? ''

const LEFT_SRC =
  Object.values(
    import.meta.glob<string>('../components/TitrationErrorLeftPanel.tsx', {
      query: '?raw',
      import: 'default',
      eager: true,
    })
  )[0] ?? ''

const baseParams: TitrationErrorParams = {
  ...DEFAULT_TITRATION_ERROR_PARAMS,
  mode: 'error-analysis',
  errorOp: 'none',
  viewAngle: 0,
}

describe('实验三 复审问题守门（P1-Q2 ~ Q6 与 §5.4）', () => {
  it('源码可被读取（读取失败会让下面的源码断言变成恒真）', () => {
    expect(CENTER_SRC.length).toBeGreaterThan(500)
    expect(LEFT_SRC.length).toBeGreaterThan(500)
  })

  // ── P1-Q2 ──────────────────────────────────────────────
  describe('P1-Q2 误差数值幅度必须标注为「示意量级」', () => {
    it('errorResult.isIndicative 恒为 true（幅度由简化系数给出，只有方向是高考考点）', () => {
      const { result } = renderHook(() => useTitrationErrorChemistry(baseParams))
      expect(result.current.errorResult.isIndicative).toBe(true)
    })

    it('中屏与右屏都必须显式提示「仅示意量级 / 只判方向」', () => {
      expect(CENTER_SRC).toContain('示意量级')
      expect(CENTER_SRC).toContain('偏高 / 偏低 / 无影响')
      expect(CENTER_SRC).toContain('errorResult.isIndicative')
    })
  })

  // ── P1-Q3 ──────────────────────────────────────────────
  describe('P1-Q3 视线方向文字（仰视=视线向上、俯视=视线向下）', () => {
    it('仰视说明必须写「向上」且不得写「向下」', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, viewAngle: 10 })
      )
      const d = result.current.errorResult.description
      expect(d).toContain('仰视')
      expect(d).toContain('向上')
      expect(d).not.toContain('向下')
      expect(result.current.errorResult.effectDirection).toBe('high')
    })

    it('俯视说明必须写「向下」且不得写「向上」', () => {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, viewAngle: -10 })
      )
      const d = result.current.errorResult.description
      expect(d).toContain('俯视')
      expect(d).toContain('向下')
      expect(d).not.toContain('向上')
      expect(result.current.errorResult.effectDirection).toBe('low')
    })

    it('视线几何自洽：视线由「眼 → 凹液面最低点」唯一确定（不得用两组互不相干的公式各算一次 y）', () => {
      // sightSlope 必须同时驱动 sightLineEndY 与 readCrossY，二者共线才可能穿过凹液面最低点
      expect(CENTER_SRC).toContain('const sightSlope =')
      expect(CENTER_SRC).toContain('const readCrossY =')
      expect(CENTER_SRC).toContain('MENISCUS_LOWEST_X')
      expect(CENTER_SRC).toContain('MENISCUS_LOWEST_Y')
      // 旧写法两处独立公式：sightLineEndY 由 (viewAngle/15)*25 单独算出 → 已移除
      expect(CENTER_SRC).not.toContain('(effectiveViewAngle / 15.0) * 25.0')
    })
  })

  // ── P1-Q4 ──────────────────────────────────────────────
  describe('P1-Q4 滴定体系必须在化学计算层生效', () => {
    it('三种体系的指示剂 / 终点判定指引互不相同且非空', () => {
      const types: TitrationType[] = ['acid-base', 'redox', 'precipitation']
      const guides = types.map((t) => {
        const { result } = renderHook(() =>
          useTitrationErrorChemistry({ ...baseParams, titrationType: t })
        )
        return result.current.indicatorGuide
      })

      guides.forEach((g) => expect(g.length).toBeGreaterThan(20))
      expect(new Set(guides).size).toBe(3)

      expect(guides[0]).toContain('酚酞')
      expect(guides[1]).toContain('KMnO₄')
      expect(guides[2]).toContain('K₂CrO₄')
    })
  })

  // ── P1-Q5 ──────────────────────────────────────────────
  describe('P1-Q5 产率的化学计量系数比必须可调', () => {
    it('左屏必须暴露 rawToProductRatio 控件，且默认值 1.0 存在', () => {
      expect(LEFT_SRC).toContain("key: 'rawToProductRatio'")
      expect(DEFAULT_TITRATION_ERROR_PARAMS.rawToProductRatio).toBe(1.0)
    })

    it('端到端：ratio = 0.5 时理论产量恰为 ratio = 1.0 时的一半', () => {
      const { result: half } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, mode: 'yield-calc', rawToProductRatio: 0.5 })
      )
      const { result: full } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, mode: 'yield-calc', rawToProductRatio: 1.0 })
      )

      expect(half.current.yieldResult.nTheoretical).toBeGreaterThan(0)
      // 理论产量比必须为 0.5（绝对量受 toFixed(4) 舍入影响，故比较比值而非绝对差）
      expect(
        half.current.yieldResult.nTheoretical / full.current.yieldResult.nTheoretical
      ).toBeCloseTo(0.5, 2)
      expect(
        half.current.yieldResult.mTheoretical / full.current.yieldResult.mTheoretical
      ).toBeCloseTo(0.5, 2)
    })
  })

  // ── P1-Q6 ──────────────────────────────────────────────
  describe('P1-Q6 等当点体积与计量量程必须跟随参数', () => {
    it('等当点 vTrue 随 c(标)/c(待) 变化（不得恒定 20.00）', () => {
      const a = renderHook(() => useTitrationErrorChemistry(baseParams)).result.current.errorResult.vTrue
      const b = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, cStandardTrue: 0.2 })
      ).result.current.errorResult.vTrue

      expect(a).not.toBe(b)
      // vTrue = c(待)·V(待) / c(标)：0.1×20/0.1 = 20.00；0.1×20/0.2 = 10.00
      expect(a).toBeCloseTo(20, 4)
      expect(b).toBeCloseTo(10, 4)
    })

    it('视图不得把 20.00 mL 等当点 / 40 mL 量程写死', () => {
      expect(CENTER_SRC).not.toContain('maxVolume={40}')
      expect(CENTER_SRC).not.toContain('currentVolume >= 20.0')
      expect(CENTER_SRC).not.toContain('v <= 40')
      expect(CENTER_SRC).not.toContain("等当点 (20mL)")
      // 必须由 vEq / vMax 驱动
      expect(CENTER_SRC).toContain('const vEq = errorResult.vTrue')
      expect(CENTER_SRC).toContain('const vMax = useMemo(')
    })
  })

  // ── §5.4 文字一致性 ────────────────────────────────────
  describe('§5.4 文字 / 数值一致性', () => {
    it('「定容俯视」必须界定为配制标准溶液时', () => {
      expect(LEFT_SRC).toContain('配制标准液定容时俯视')
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({ ...baseParams, errorOp: 'volumetric-flask-down' })
      )
      expect(result.current.errorResult.description).toContain('标准溶液')
    })

    it('题库：仰视说明不得写成「视线向下」', () => {
      const step1 = modelTitrationErrorPurity.scoringSteps.find((s) => s.id === 'step-1')
      expect(step1).toBeDefined()
      const text = JSON.stringify(step1)
      expect(text).toContain('视线向上斜穿刻度线')
      expect(text).not.toContain('视线向下斜穿刻度线')
    })

    it('题库：粗 CaCO₃ 样品不得算出 100% 纯度', () => {
      const step3 = modelTitrationErrorPurity.scoringSteps.find((s) => s.id === 'step-3')
      expect(step3).toBeDefined()
      const text = JSON.stringify(step3)
      expect(text).toContain('2.00 g')
      expect(text).not.toContain('1.50 g 粗 CaCO₃')
      // 答案必须是 75%，不得是 100%（correctAnswer 为 string | string[]，统一转文本）
      const answer = Array.isArray(step3!.correctAnswer)
        ? step3!.correctAnswer.join(',')
        : step3!.correctAnswer
      expect(answer).toContain('75')
      expect(answer).not.toContain('100')
    })
  })
})
