/**
 * 实验三「定量滴定误差与纯度产率」出厂默认值守门测试
 *
 * 背景（本轮修复的缺陷）：
 *   原默认 r₁ = 1.00 mol/L、V₁ = 50.0 mL ⇒ n(HCl) = 50.0 mmol，
 *   而 25 mL 移取份中的样品只含 ≈1.5 mmol CaCO₃、仅需 ≈3.0 mmol 酸（过量 ≈16.7 倍），
 *   经「×V(总)/V(移取) = ×10」换算到全样品后直接给出 w% = 1201.08%；
 *   且 c₂/V₂/m 的组合使 multistep-redox = 111.00% 亦越界。
 *   两者原本都被计算层的 Math.min(100, …) 静默压成 100%，因此长期不可见。
 *
 * 本文件把"出厂默认值必须给出化学上自洽的结果"固化为可执行规则，防止再犯：
 *   1. 三种纯度方法在出厂默认值下均不得越界（overLimit === false），且数值精确锁定；
 *   2. 默认产率同样不得越界；
 *   3. 【结构性约束】direct 与 multistep-redox 共用因子，比值恒为 222/106；
 *   4. 【默认值可达性】默认值必须落在左屏滑块窗口内、且落在 step 网格上
 *      —— 直接解析左屏源码取得窗口，避免"镜像表"随源码漂移而失效。
 */

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTitrationErrorChemistry } from '../hooks/useTitrationErrorChemistry'
import { DEFAULT_TITRATION_ERROR_PARAMS } from '../constants'
import type { PurityCalcMethod } from '../types'

/* ────────────────────────────────────────────────
 * 从左屏源码解析滑块窗口（min / max / step），避免镜像表漂移
 * 用 Vite 的 `?raw` 导入源码文本（不依赖 node 内建模块，无需 @types/node）
 * ──────────────────────────────────────────────── */
const LEFT_PANEL_RAW = import.meta.glob<string>('../components/TitrationErrorLeftPanel.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const LEFT_PANEL_SRC = Object.values(LEFT_PANEL_RAW)[0] ?? ''

interface SliderWindow {
  min: number
  max: number
  step: number
}

function parseSliderWindows(src: string): Record<string, SliderWindow> {
  const windows: Record<string, SliderWindow> = {}
  // 负向先行断言 `(?!key: ')` 保证不会跨到下一个控件项
  const re =
    /key: '([A-Za-z0-9_]+)',((?:(?!key: ')[\s\S])*?)min: (-?[\d.]+),\s*max: (-?[\d.]+),\s*step: ([\d.]+),/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    windows[m[1]] = { min: Number(m[3]), max: Number(m[4]), step: Number(m[5]) }
  }
  return windows
}

const SLIDER_WINDOWS = parseSliderWindows(LEFT_PANEL_SRC)

describe('实验三 出厂默认值自洽性守门', () => {
  it('左屏滑块窗口可被解析（解析失败会让下面的可达性断言变成恒真）', () => {
    // 至少应解析出本模块暴露的全部数值控件
    expect(Object.keys(SLIDER_WINDOWS).length).toBeGreaterThanOrEqual(10)
    expect(SLIDER_WINDOWS.reagent1Conc).toBeDefined()
    expect(SLIDER_WINDOWS.reagent1Vol).toBeDefined()
    expect(SLIDER_WINDOWS.reagent2Conc).toBeDefined()
    expect(SLIDER_WINDOWS.reagent2Vol).toBeDefined()
    expect(SLIDER_WINDOWS.sampleMass).toBeDefined()
  })

  it('默认值必须落在左屏滑块区间内，且落在 step 网格上（否则一拖动就跳变）', () => {
    const defaults = DEFAULT_TITRATION_ERROR_PARAMS as unknown as Record<string, unknown>
    const checked: string[] = []

    for (const [key, win] of Object.entries(SLIDER_WINDOWS)) {
      const value = defaults[key]
      if (typeof value !== 'number') continue
      checked.push(key)

      expect(value, `${key} 默认值 ${value} 低于滑块下限 ${win.min}`).toBeGreaterThanOrEqual(win.min)
      expect(value, `${key} 默认值 ${value} 高于滑块上限 ${win.max}`).toBeLessThanOrEqual(win.max)

      const k = (value - win.min) / win.step
      expect(
        Math.abs(k - Math.round(k)),
        `${key} 默认值 ${value} 不在 step=${win.step} 的网格上（min=${win.min}）`
      ).toBeLessThan(1e-9)
    }

    // 防止"窗口解析到了、但一项默认值都没对上"的假通过
    expect(checked.length).toBeGreaterThanOrEqual(8)
  })

  it('三种纯度方法在出厂默认值下均不越界，且数值精确可复现', () => {
    // 出厂默认：c₁=0.20 / V₁=25.0、c₂=0.10 / V₂=20.0、m(粗样品)=2.5 g、定容 250 / 移取 25
    const expected: Record<PurityCalcMethod, number> = {
      // direct: n(移取)=0.5×0.10×0.0200=0.0010 mol -> n(全样)=0.0100 mol -> m=0.0100×106=1.060 g
      //         w% = 1.060 / 2.5 × 100% = 42.40%
      direct: 42.4,
      // multistep-redox: n(移取)=0.10×0.0200=0.0020 mol -> n(全样)=0.0200 mol
      //         m = (0.0200/2)×222 = 2.220 g -> w% = 2.220 / 2.5 × 100% = 88.80%
      'multistep-redox': 88.8,
      // back-titration: n(HCl总)=0.20×0.0250=5.00 mmol, n(NaOH)=2.00 mmol -> 耗酸 3.00 mmol
      //         n(移取)=0.5×3.00=1.50 mmol -> n(全样)=0.0150 mol -> m=0.0150×100.09=1.5014 g
      //         w% = 1.5014 / 2.5 × 100% = 60.05%
      'back-titration': 60.05,
    }

    for (const method of Object.keys(expected) as PurityCalcMethod[]) {
      const { result } = renderHook(() =>
        useTitrationErrorChemistry({
          ...DEFAULT_TITRATION_ERROR_PARAMS,
          mode: 'purity-calc',
          purityMethod: method,
        })
      )
      const { purityResult } = result.current

      expect(purityResult.overLimit, `${method} 出厂默认值不应越界`).toBe(false)
      expect(purityResult.purityPct, `${method} 出厂默认值`).toBe(expected[method])
      expect(purityResult.mPureProduct, `${method} 纯品质量不得超过粗样品质量`).toBeLessThanOrEqual(
        DEFAULT_TITRATION_ERROR_PARAMS.sampleMass
      )
    }
  })

  it('结构性约束：multistep-redox ≡ 2.094340 × direct（M 222 / 106，二者不可同时落在 50%~75%）', () => {
    const at = (method: PurityCalcMethod) =>
      renderHook(() =>
        useTitrationErrorChemistry({
          ...DEFAULT_TITRATION_ERROR_PARAMS,
          mode: 'purity-calc',
          purityMethod: method,
        })
      ).result.current.purityResult.purityPct

    const direct = at('direct')
    const multi = at('multistep-redox')

    expect(multi / direct).toBeCloseTo(222 / 106, 4)
    // 推论：multistep ≤ 100% 时 direct 必然 ≤ 47.75%
    expect((100 * 106) / 222).toBeCloseTo(47.7477, 3)
    expect(direct).toBeLessThanOrEqual((100 * 106) / 222)
  })

  it('默认产率不越界（默认场景刻意贴近理论上限，用于讲解"实际产量不得超过理论产量"）', () => {
    const { result } = renderHook(() =>
      useTitrationErrorChemistry({ ...DEFAULT_TITRATION_ERROR_PARAMS, mode: 'yield-calc' })
    )
    const { yieldResult } = result.current

    // n(理论) = 2.8 / 55.85 = 0.050134 mol；m(理论) = 0.050134 × 392.14 = 19.66 g
    // Yield% = 19.6 / 19.66 × 100% = 99.70%
    expect(yieldResult.nTheoretical).toBe(0.0501)
    expect(yieldResult.mTheoretical).toBe(19.66)
    expect(yieldResult.yieldPct).toBe(99.7)
    expect(yieldResult.overLimit).toBe(false)
  })
})
