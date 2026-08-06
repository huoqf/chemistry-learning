import { useMemo } from 'react'
import type { ElementPeriodicParams, OrbitalElectron } from '../types'
import { PERIODIC_ELEMENTS, ISO_ELECTRON_SERIES, GAOKAO_INFERENCE_CASES } from '../data/periodicData'

export function useElementPeriodicChemistry(params: ElementPeriodicParams) {
  const currentElement = useMemo(() => {
    return PERIODIC_ELEMENTS[params.selectedAtomicNumber] || PERIODIC_ELEMENTS[6]
  }, [params.selectedAtomicNumber])

  // 轨道方框图（Orbital Boxes）自旋电子分布计算
  const orbitalBoxes = useMemo((): OrbitalElectron[] => {
    const isExcited = params.stateType === 'excited'
    const z = currentElement.z

    // 默认轨道定义
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
    ]

    // 针对每个元素的真实电子填充 (构造原理 / Cr Cu 特例)
    let remaining = z

    // 特殊情况：Cr (24) -> 3d5 4s1; Cu (29) -> 3d10 4s1
    const isCr = z === 24
    const isCu = z === 29

    const res: OrbitalElectron[] = orbitals.map((orb) => {
      let count = 0
      if (isCr) {
        if (['1s', '2s', '2px', '2py', '2pz', '3s', '3px', '3py', '3pz'].includes(orb.label)) count = 2
        else if (orb.label === '4s') count = 1
        else if (orb.label.startsWith('3d')) count = 1
      } else if (isCu) {
        if (['1s', '2s', '2px', '2py', '2pz', '3s', '3px', '3py', '3pz'].includes(orb.label)) count = 2
        else if (orb.label === '4s') count = 1
        else if (orb.label.startsWith('3d')) count = 2
      } else {
        // 常规填充顺序: 1s -> 2s -> 2p (px,py,pz) -> 3s -> 3p -> 4s -> 3d
        if (orb.label === '1s') count = Math.min(2, remaining)
        else if (orb.label === '2s') count = Math.min(2, Math.max(0, remaining - 2))
        else if (['2px', '2py', '2pz'].includes(orb.label)) {
          const pTot = Math.min(6, Math.max(0, remaining - 4))
          // 洪特规则：先单分配
          const idx = ['2px', '2py', '2pz'].indexOf(orb.label)
          count = pTot > idx ? (pTot >= idx + 4 ? 2 : 1) : 0
        } else if (orb.label === '3s') count = Math.min(2, Math.max(0, remaining - 10))
        else if (['3px', '3py', '3pz'].includes(orb.label)) {
          const pTot = Math.min(6, Math.max(0, remaining - 12))
          const idx = ['3px', '3py', '3pz'].indexOf(orb.label)
          count = pTot > idx ? (pTot >= idx + 4 ? 2 : 1) : 0
        } else if (orb.label === '4s') count = Math.min(2, Math.max(0, remaining - 18))
        else if (orb.label.startsWith('3d')) {
          const dTot = Math.min(10, Math.max(0, remaining - 20))
          const idx = ['3d1', '3d2', '3d3', '3d4', '3d5'].indexOf(orb.label)
          count = dTot > idx ? (dTot >= idx + 6 ? 2 : 1) : 0
        }
      }

      // 如果选了激发态，将最高能级的一个电子跃迁至高轨道
      if (isExcited && count > 0 && orb.label === (currentElement.block === 'p' ? '2px' : '2s')) {
        count -= 1
      }

      const arrows: ('up' | 'down')[] = []
      if (count === 1) arrows.push('up')
      if (count === 2) arrows.push('up', 'down')

      return {
        n: orb.n,
        l: orb.l,
        label: orb.label,
        electrons: arrows,
        isFull: count === 2,
        isHalf: count === 1,
      }
    })

    // 如果激发态，在最外层更高轨道补上 1 个跃迁电子
    if (isExcited) {
      const emptyBox = res.find((b) => b.electrons.length === 0)
      if (emptyBox) emptyBox.electrons.push('up')
    }

    return res.filter((b) => b.n <= currentElement.period + 1 && (b.electrons.length > 0 || b.n <= currentElement.period))
  }, [currentElement, params.stateType])

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
        maxJumpIndex = i + 1 // I_1 -> I_2 就是 1 (说明有1个价电子)
      }
    }

    return {
      steps,
      ratios,
      valanceCountPredicted: maxJumpIndex,
      jumpDescription: `从 I${maxJumpIndex} (${steps[maxJumpIndex - 1]} kJ/mol) 到 I${
        maxJumpIndex + 1
      } (${steps[maxJumpIndex]} kJ/mol) 发生剧烈突跃 (倍率 ${maxJumpRatio.toFixed(
        1
      )} 倍)，表明跨越内层，该元素最外层价电子数为 ${maxJumpIndex}。`,
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
    periodIonizationData,
    stepIonizationAnalysis,
    isoParticles: ISO_ELECTRON_SERIES[params.isoGroupFilter],
    activeInferenceCase,
  }
}
