import { useMemo } from 'react'
import type { ElementPeriodicParams, OrbitalElectron } from '../types'
import { PERIODIC_ELEMENTS, ISO_ELECTRON_SERIES, GAOKAO_INFERENCE_CASES } from '../data/periodicData'

export function useElementPeriodicChemistry(params: ElementPeriodicParams) {
  const currentElement = useMemo(() => {
    return PERIODIC_ELEMENTS[params.selectedAtomicNumber] || PERIODIC_ELEMENTS[6]
  }, [params.selectedAtomicNumber])

  // 轨道方框图（Orbital Boxes）自旋电子分布计算
  const orbitalData = useMemo(() => {
    const isExcited = params.stateType === 'excited'
    const z = currentElement.z

    // 轨道定义（按构造原理填充顺序：1s 2s 2p 3s 3p 4s 3d 4p）
    const orbitals: { n: number; l: 's' | 'p' | 'd'; label: string; maxCap: number }[] = [
      { n: 1, l: 's', label: '1s', maxCap: 2 },
      { n: 2, l: 's', label: '2s', maxCap: 2 },
      { n: 2, l: 'p', label: '2px', maxCap: 2 },
      { n: 2, l: 'p', label: '2py', maxCap: 2 },
      { n: 2, l: 'p', label: '2pz', maxCap: 2 },
      { n: 3, l: 's', label: '3s', maxCap: 2 },
      { n: 3, l: 'p', label: '3px', maxCap: 2 },
      { n: 3, l: 'p', label: '3py', maxCap: 2 },
      { n: 3, l: 'p', label: '3pz', maxCap: 2 },
      { n: 4, l: 's', label: '4s', maxCap: 2 },
      { n: 3, l: 'd', label: '3d1', maxCap: 2 },
      { n: 3, l: 'd', label: '3d2', maxCap: 2 },
      { n: 3, l: 'd', label: '3d3', maxCap: 2 },
      { n: 3, l: 'd', label: '3d4', maxCap: 2 },
      { n: 3, l: 'd', label: '3d5', maxCap: 2 },
      // 4p 轨道：1~30 号元素基态均不填充，仅在激发态作为跃迁目标出现
      { n: 4, l: 'p', label: '4px', maxCap: 2 },
      { n: 4, l: 'p', label: '4py', maxCap: 2 },
      { n: 4, l: 'p', label: '4pz', maxCap: 2 },
    ]

    const counts: number[] = orbitals.map(() => 0)
    const idxOf = (label: string) => orbitals.findIndex((o) => o.label === label)

    // 特殊情况：Cr (24) -> 3d5 4s1; Cu (29) -> 3d10 4s1
    const isCr = z === 24
    const isCu = z === 29

    // 基态填充（构造原理 + 洪特规则 + Cr/Cu 特例）
    const fillGround = () => {
      counts.fill(0)
      if (isCr || isCu) {
        ;['1s', '2s', '2px', '2py', '2pz', '3s', '3px', '3py', '3pz'].forEach((l) => (counts[idxOf(l)] = 2))
        counts[idxOf('4s')] = 1
        ;['3d1', '3d2', '3d3', '3d4', '3d5'].forEach((l) => (counts[idxOf(l)] = isCu ? 2 : 1))
      } else {
        counts[idxOf('1s')] = Math.min(2, z)
        counts[idxOf('2s')] = Math.min(2, Math.max(0, z - 2))
        const p2 = Math.min(6, Math.max(0, z - 4))
        ;['2px', '2py', '2pz'].forEach((l, i) => (counts[idxOf(l)] = p2 > i ? (p2 >= i + 4 ? 2 : 1) : 0))
        counts[idxOf('3s')] = Math.min(2, Math.max(0, z - 10))
        const p3 = Math.min(6, Math.max(0, z - 12))
        ;['3px', '3py', '3pz'].forEach((l, i) => (counts[idxOf(l)] = p3 > i ? (p3 >= i + 4 ? 2 : 1) : 0))
        counts[idxOf('4s')] = Math.min(2, Math.max(0, z - 18))
        const d3 = Math.min(10, Math.max(0, z - 20))
        ;['3d1', '3d2', '3d3', '3d4', '3d5'].forEach(
          (l, i) => (counts[idxOf(l)] = d3 > i ? (d3 >= i + 6 ? 2 : 1) : 0)
        )
      }
    }

    fillGround()

    // 激发态：最外层 ns 上的 1 个电子跃迁到能量更高的空轨道
    // excitationShell：本次跃迁电子所在的电子层主量子数 n（null 表示未发生跃迁）。
    // 该值同时驱动壳层图（AtomShellScene）高亮对应电子层，确保中屏两图共用同一跃迁定义，
    // 不会再出现"壳层图高亮一层、方框图从另一层移除"的模型打架。
    let excitationShell: number | null = null
    if (isExcited) {
      // ① 激发源 = n 最大的已占据 s 轨道（即最外层 ns），确保是"最外层价电子跃迁"
      let src = -1
      let bestN = -1
      orbitals.forEach((o, i) => {
        if (o.l === 's' && counts[i] > 0 && o.n > bestN) {
          bestN = o.n
          src = i
        }
      })
      // ② 目标轨道 = 同层 np 中电子数最少者（保持洪特规则排布）；同层 np 已充满或不存在时取 (n+1)s
      let tgt = -1
      if (src >= 0) {
        const openSameShellP = orbitals
          .map((o, i) => ({ o, i }))
          .filter(({ o, i }) => o.n === bestN && o.l === 'p' && counts[i] < o.maxCap)
        if (openSameShellP.length > 0) {
          tgt = openSameShellP.reduce((best, cur) => (counts[cur.i] < counts[best.i] ? cur : best)).i
        } else {
          tgt = orbitals.findIndex((o) => o.l === 's' && o.n === bestN + 1)
        }
      }
      if (src >= 0 && tgt >= 0 && src !== tgt) {
        counts[src] -= 1
        counts[tgt] += 1
        excitationShell = bestN
      }
    }

    // ③ 电子总数守恒护栏：激发态只发生跃迁，Σ电子数必须恒等于 Z，否则回退为基态
    const total = counts.reduce((a, b) => a + b, 0)
    if (total !== z) {
      console.warn(
        `[orbital-boxes] 电子总数不守恒：Σ=${total} ≠ Z=${z}（${currentElement.symbol}），已回退为基态`
      )
      fillGround()
    }

    // ④ 仅展示到最后一个已占据轨道所在子层为止（补齐该子层，如 2p 的 px/py/pz），避免大量空白轨道框
    let endIdx = -1
    counts.forEach((c, i) => {
      if (c > 0) endIdx = i
    })
    if (endIdx >= 0) {
      const ref = orbitals[endIdx]
      orbitals.forEach((o, i) => {
        if (i > endIdx && o.n === ref.n && o.l === ref.l) endIdx = i
      })
    }

    const boxes = orbitals
      .map((o, i): OrbitalElectron => {
        const c = counts[i]
        const arrows: ('up' | 'down')[] = []
        if (c >= 1) arrows.push('up')
        if (c >= 2) arrows.push('down')
        return { n: o.n, l: o.l, label: o.label, electrons: arrows, isFull: c >= 2, isHalf: c === 1 }
      })
      .slice(0, endIdx + 1)

    return { boxes, excitationShell }
  }, [currentElement, params.stateType])

  const orbitalBoxes = orbitalData.boxes
  // 激发态跃迁电子所在电子层主量子数 n（null = 基态或未发生跃迁）；
  // 由中屏壳层图与轨道方框图共用，保证两图"同一跃迁、同一层"。
  const excitationShell = orbitalData.excitationShell

  // 同周期第一电离能对比列表 (周期 2 或 3)
  const periodIonizationData = useMemo(() => {
    const period = params.periodFilter || 2
    return Object.values(PERIODIC_ELEMENTS)
      .filter((e) => e.period === period)
      .map((e) => ({
        symbol: e.symbol,
        name: e.name,
        z: e.z,
        group: e.group,
        value: e.firstIonization,
        isAnomaly:
          (e.group === 'IIA' && e.symbol === (period === 2 ? 'Be' : 'Mg')) ||
          (e.group === 'VA' && e.symbol === (period === 2 ? 'N' : 'P')),
        reason:
          e.group === 'IIA'
            ? `${e.outerConfig.split(' ')[0]} 轨全充满`
            : e.group === 'VA'
            ? `${e.outerConfig.split(' ')[1] || 'p³'} 轨半充满`
            : '',
      }))
  }, [params.periodFilter])

  // 当前元素的逐级电离能突跃分析
  const stepIonizationAnalysis = useMemo(() => {
    const steps = currentElement.stepIonization
    const ratios: number[] = []
    let maxJumpIndex = 0
    let maxJumpRatio = 0

    for (let i = 0; i < steps.length - 1; i++) {
      const ratio = steps[i + 1] / steps[i]
      ratios.push(Number(ratio.toFixed(1)))
      if (ratio > maxJumpRatio) {
        maxJumpRatio = ratio
        maxJumpIndex = i + 1 // 峰值出现在 I₁→I₂ 时说明只有 1 个价电子
      }
    }

    // 判据：只有倍率 ≥ 4 才算"跨层剧烈突跃"（与右屏自定标准 ">4~5 倍" 对齐）
    const JUMP_THRESHOLD = 4
    const isTransition = currentElement.block === 'd' || currentElement.block === 'ds'
    const isNobleGas = currentElement.group === '0'
    const hasCredibleJump = !isTransition && maxJumpRatio >= JUMP_THRESHOLD

    let valanceCountPredicted = 0
    let jumpDescription: string

    if (isTransition) {
      jumpDescription = `${currentElement.symbol} 属于 ${currentElement.block.toUpperCase()} 区过渡元素，价电子涉及 (n−1)d 与 ns 两个能级，逐级电离能的简单"突跃"规律不适用，不能据此直接判定最外层价电子数。`
    } else if (hasCredibleJump) {
      valanceCountPredicted = maxJumpIndex
      jumpDescription = `从 I${maxJumpIndex} (${steps[maxJumpIndex - 1]} kJ/mol) 到 I${
        maxJumpIndex + 1
      } (${steps[maxJumpIndex]} kJ/mol) 出现剧烈突跃 (倍率 ${maxJumpRatio.toFixed(
        1
      )} 倍，≥ ${JUMP_THRESHOLD} 倍)，表明电离已跨越内层，该元素最外层价电子数为 ${maxJumpIndex}。`
    } else if (steps.length < 2) {
      jumpDescription = `${currentElement.symbol} 仅给出 I₁ = ${steps[0]} kJ/mol，缺少 I₂ 及更高级电离能数据，无法通过突跃倍率判定价电子数。`
    } else if (isNobleGas) {
      jumpDescription = `${currentElement.symbol} 为稀有气体，最外层已达全充满稳定结构，逐级电离能不呈现简单的跨层突跃规律，不能依据本图判定价电子数。`
    } else {
      jumpDescription = `在 I₁~I₄ 数据窗口内相邻最大倍率仅 ${maxJumpRatio.toFixed(
        1
      )} 倍（均 < ${JUMP_THRESHOLD} 倍），未见跨层突跃：${currentElement.symbol} 的最外层价电子数多于 4，真正的突跃出现在 I₄→I₅ 及以后，超出本题给定数据窗口，故不能仅凭本图判定价电子数。`
    }

    return {
      steps,
      ratios,
      maxJumpIndex,
      maxJumpRatio,
      valanceCountPredicted,
      hasCredibleJump,
      isTransition,
      jumpDescription,
    }
  }, [currentElement])

  // 当前选中的高考推断案例
  const activeInferenceCase = useMemo(() => {
    return (
      GAOKAO_INFERENCE_CASES.find((c) => c.id === params.inferenceId) ||
      GAOKAO_INFERENCE_CASES[0]
    )
  }, [params.inferenceId])

  return {
    currentElement,
    orbitalBoxes,
    excitationShell,
    periodIonizationData,
    stepIonizationAnalysis,
    isoParticles: ISO_ELECTRON_SERIES[params.isoGroupFilter],
    activeInferenceCase,
  }
}
