import React, { useMemo, useState } from 'react'
import { AnimationSvgCanvas } from '@/components/Layout'
import { useAnimationViewport } from '@/hooks/useAnimationViewport'
import { useSceneScale } from '@/hooks/useSceneScale'
import { CANVAS_PRESETS, CHART_COLORS } from '@/theme'
import { BaseChart } from '@/components/Chart/BaseChart'
import { ChartLine } from '@/components/Chart/ChartLine'
import { ChartCursor } from '@/components/Chart/ChartCursor'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { useAnimationFrame } from '@/utils/animation'
import { AvogadroScene } from './AvogadroScene'
import type { AvogadroParams, AvogadroResult } from '../types'
import type { ModelQuizData } from '@/data/quiz/types'

interface AvogadroCenterViewProps {
  params: AvogadroParams
  chemistry: AvogadroResult
  quizData?: ModelQuizData
  viewMode: number
}

export const AvogadroCenterView: React.FC<AvogadroCenterViewProps> = ({
  params,
  chemistry,
  quizData,
  viewMode,
}) => {
  // 1. Viewport 绑定：选择 CANVAS_PRESETS.splitH (420×650 左右等宽)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitH,
  })
  const sceneScale = useSceneScale({ vp, preset: CANVAS_PRESETS.splitH, anchor: 'center' })

  // 2. 统一动画时间驱动（遵循铁律 1，使用 useAnimationFrame）
  const [animTime, setAnimTime] = useState<number>(0)
  useAnimationFrame(
    (dt) => {
      setAnimTime((t) => t + dt * 0.001)
    },
    { playing: viewMode === 0 }
  )

  const primaryStat = useMemo(
    () => chemistry.particleStats.find((s) => s.isTrap) ?? chemistry.particleStats[0],
    [chemistry.particleStats]
  )

  // 3. 右侧图表科学对比曲线（全量预计算：真实微粒数 vs 错解陷阱误判数）
  const { actualPoints, fallacyPoints, xLabel, yLabel, maxRangeX, maxRangeY } = useMemo(() => {
    const act: { x: number; y: number }[] = []
    const fal: { x: number; y: number }[] = []
    const count = 40

    let maxX = 50
    let maxY = 100
    let xName = '物质用量'
    let yName = '粒子数 / 电子数 (NA)'

    const cat = params.trapCategory

    if (cat === 'state-volume') {
      xName = params.amountUnit === 'L' ? '体积 V (L)' : '物质用量'
      yName = '微粒数 (NA)'
      maxX = Math.max(50, Math.ceil(params.amountValue / 10) * 10)

      // 由计算层当前主对比结果严格反推同源斜率，确保曲线与右屏粒子数 100% 吻合
      const curStat = primaryStat
      const xCur = Math.max(0.01, params.amountValue)
      const actualSlope = curStat ? curStat.actualMoles / xCur : 1 / 22.4
      const trapSlope = curStat ? curStat.theoreticalMoles / xCur : 1 / 22.4

      maxY = Math.max(3, Math.ceil(Math.max(actualSlope, trapSlope) * maxX * 1.1))

      for (let i = 0; i <= count; i++) {
        const x = (i / count) * maxX
        fal.push({ x, y: x * trapSlope })
        act.push({ x, y: x * actualSlope })
      }
    } else if (cat === 'structure-bonds') {
      xName = params.amountUnit === 'g' ? '质量 m (g)' : '摩尔数 n (mol)'
      yName = '化学键 / 粒子数 (NA)'
      maxX = params.amountUnit === 'g' ? Math.max(60, Math.ceil(params.amountValue / 10) * 10) : Math.max(5, Math.ceil(params.amountValue))

      for (let i = 0; i <= count; i++) {
        const x = (i / count) * maxX
        let yReal = 0
        let yTrap = 0

        if (params.structureItem === 'P4') {
          const moles = params.amountUnit === 'g' ? x / 124 : x
          yReal = moles * 6 // 真实 6 条棱键
          yTrap = moles * 4 // 错当 4 个顶点 4 条键
        } else if (params.structureItem === 'S8') {
          const moles = params.amountUnit === 'g' ? x / 256 : x
          yReal = moles * 8 // 8 元环 8 条 S-S 键
          yTrap = moles * 2 // 错按 S₂ 计算
        } else if (params.structureItem === 'SiO2') {
          const moles = params.amountUnit === 'g' ? x / 60 : x
          yReal = moles * 4 // 真实 4 条 Si-O 键
          yTrap = moles * 2 // 错看分子式 2 个 O
        } else if (params.structureItem === 'diamond') {
          const moles = params.amountUnit === 'g' ? x / 12 : x
          yReal = moles * 2 // 金刚石均摊 2 键
          yTrap = moles * 4 // 未均摊 4 键
        } else if (params.structureItem === 'graphite') {
          const moles = params.amountUnit === 'g' ? x / 12 : x
          yReal = moles * 1.5 // 均摊 1.5 键
          yTrap = moles * 3 // 未均摊 3 键
        } else if (params.structureItem === 'ice') {
          const moles = params.amountUnit === 'g' ? x / 18 : x
          yReal = moles * 2 // 均摊 2 mol 氢键
          yTrap = moles * 4 // 错当 4 mol
        } else if (params.structureItem === 'D2O') {
          const moles = params.amountUnit === 'g' ? x / 20 : x
          yReal = moles * 10 // D2O 含 10 中子
          yTrap = (params.amountUnit === 'g' ? x / 18 : x) * 8 // 错按 H2O 18 g/mol 与 8 中子计算
        } else if (params.structureItem === 'T2O') {
          const moles = params.amountUnit === 'g' ? x / 22 : x
          yReal = moles * 12 // T2O 含 12 中子
          yTrap = (params.amountUnit === 'g' ? x / 18 : x) * 8
        } else if (params.structureItem === 'NH4Cl') {
          const moles = params.amountUnit === 'g' ? x / 53.5 : x
          yReal = moles * 4 // 4 条 N-H 共价键 (含 1 条配位键)
          yTrap = moles * 4
        } else if (params.structureItem === 'Na2O2') {
          const moles = params.amountUnit === 'g' ? x / 78 : x
          yReal = moles * 1 // 1 mol 阴离子
          yTrap = moles * 2 // 拆成 2 个 O-
        } else {
          const curStat = primaryStat
          const xCur = Math.max(0.01, params.amountValue)
          yReal = curStat ? (curStat.actualMoles / xCur) * x : x
          yTrap = curStat ? (curStat.theoreticalMoles / xCur) * x : x
        }

        act.push({ x, y: yReal })
        fal.push({ x, y: yTrap })
      }
      const peakY = Math.max(...act.map((p) => p.y), ...fal.map((p) => p.y), 6)
      maxY = Math.ceil(peakY * 1.1)
    } else if (cat === 'electrolyte-hydrolysis') {
      const isMolten = params.electrolyteItem === 'NaHSO4-molten'
      const isMoltenGrams = isMolten && params.amountUnit === 'g'
      xName = isMolten ? (isMoltenGrams ? '质量 m (g)' : '用量 n (mol)') : '浓度 c (mol/L)'
      yName = '离子 / 微粒数 (NA)'
      maxX = isMolten
        ? isMoltenGrams
          ? Math.max(120, Math.ceil(params.amountValue / 20) * 20)
          : Math.max(2, Math.ceil(params.amountValue))
        : 2
      maxY = 4

      for (let i = 0; i <= count; i++) {
        const x = (i / count) * maxX
        let yReal = 0
        let yTrap = 0

        if (isMolten) {
          const moltenMoles = isMoltenGrams ? x / 120 : x
          yReal = moltenMoles * 2 // 熔融态 2 mol
          yTrap = moltenMoles * 3 // 水溶液 3 mol
        } else if (params.electrolyteItem === 'CH3COOH') {
          const ka = 1.75e-5
          const alpha = x > 0 ? (-ka + Math.sqrt(ka * ka + 4 * ka * x)) / (2 * x) : 0
          yReal = x * params.solutionVolume * alpha
          yTrap = x * params.solutionVolume * 1.0
        } else if (params.electrolyteItem === 'FeCl3') {
          yReal = x * params.solutionVolume * 0.001
          yTrap = x * params.solutionVolume * 1.0
        } else if (params.electrolyteItem === 'pureH2O') {
          yReal = params.solutionVolume * 1e-7
          yTrap = params.solutionVolume * 1.0
        } else {
          // Na2CO3 阴离子部分水解（CO₃²⁻ 实际余量小于 cV，与 primaryStat 的 CO₃²⁻ 离子数同源）
          yReal = x * params.solutionVolume * 0.9
          yTrap = x * params.solutionVolume * 1.0
        }

        act.push({ x, y: yReal })
        fal.push({ x, y: yTrap })
      }
      const peakY = Math.max(...act.map((p) => p.y), ...fal.map((p) => p.y), 3)
      maxY = Math.ceil(peakY * 1.1)
    } else if (cat === 'redox-electron') {
      xName = params.amountUnit === 'g' ? '反应物质量 m (g)' : params.amountUnit === 'L' ? '气体体积 V (L)' : '反应物投料 n (mol)'
      yName = '转移电子 / 微粒数 (NA)'
      maxX = params.amountUnit === 'L' ? 44.8 : params.amountUnit === 'g' ? 100 : 2

      const curStat = primaryStat
      const xCur = Math.max(0.01, params.amountValue)
      const actualSlope = curStat ? curStat.actualMoles / xCur : 1
      const trapSlope = curStat ? curStat.theoreticalMoles / xCur : 2

      for (let i = 0; i <= count; i++) {
        const x = (i / count) * maxX
        act.push({ x, y: x * actualSlope })
        fal.push({ x, y: x * trapSlope })
      }
      const peakY = Math.max(...act.map((p) => p.y), ...fal.map((p) => p.y), 4)
      maxY = Math.ceil(peakY * 1.1)
    } else {
      // 5-step-matrix
      xName = '排查思维步骤'
      yName = '解题避坑置信度 (%)'
      maxX = 5
      maxY = 100

      for (let i = 0; i <= 5; i++) {
        act.push({ x: i, y: i * 20 })
      }
    }

    return {
      actualPoints: act,
      fallacyPoints: fal,
      xLabel: xName,
      yLabel: yName,
      maxRangeX: maxX,
      maxRangeY: maxY,
    }
  }, [params, primaryStat])

  // 当前游标横坐标
  const cursorX = useMemo(() => {
    if (params.trapCategory === '5-step-matrix') {
      return params.matrixStepIndex + 1
    }
    if (params.trapCategory === 'electrolyte-hydrolysis' && params.electrolyteItem !== 'NaHSO4-molten') {
      return Math.min(maxRangeX, params.solutionConcentration)
    }
    return Math.min(maxRangeX, params.amountValue)
  }, [params, maxRangeX])

  // 4. 气体分子运动坐标预设
  const gasMolecules = useMemo(() => [
    { base: [50, 70], seed: 1.1, rot0: 15 },
    { base: [145, 65], seed: 2.3, rot0: 45 },
    { base: [95, 105], seed: 3.7, rot0: -30 },
    { base: [165, 115], seed: 0.8, rot0: 75 },
    { base: [55, 145], seed: 4.2, rot0: -60 },
    { base: [130, 155], seed: 1.9, rot0: 10 },
    { base: [85, 185], seed: 5.1, rot0: 120 },
    { base: [160, 180], seed: 2.7, rot0: -85 },
  ], [])

  // 视角 1: 规范踩分卡
  if (viewMode === 1) {
    return (
      <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
        {quizData?.scoringSteps && quizData.scoringSteps.length > 0 ? (
          <ScoringCardSection steps={quizData.scoringSteps} />
        ) : (
          <div className="p-8 text-center text-slate-400">暂无踩分步骤</div>
        )}
      </div>
    )
  }

  // 视角 2: 变式演练
  if (viewMode === 2) {
    return (
      <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
        {quizData?.variantQuizzes && quizData.variantQuizzes.length > 0 ? (
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        ) : (
          <div className="p-8 text-center text-slate-400">暂无考点变式数据</div>
        )}
      </div>
    )
  }

  // 视角 0: 纯净 splitH 双视野 (左 50% SVG 微观/宏观动画场景 + 右 50% 科学对比图表与游标)
  return (
    <div className="w-full h-full flex flex-row overflow-hidden select-none">
      {/* ── 左侧：纯 SVG 化学装置与微观拓扑场景 (CANVAS_PRESETS.splitH 420×650) ── */}
      <div className="flex-1 h-full min-w-0 relative">
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          <AvogadroScene
            params={params}
            chemistry={chemistry}
            animTime={animTime}
            canvasSize={canvasSize}
            sceneScale={sceneScale}
            gasMolecules={gasMolecules}
          />
        </AnimationSvgCanvas>
      </div>

      {/* ── 右侧：真实值 vs 错解误判值科学对比图表与实时游标 ── */}
      <div className="flex-1 h-full min-w-0 flex flex-col overflow-hidden border-l border-slate-200/80 p-4">
        {/* 图表标题与图例说明 */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">微粒数量 / 电子数对比演变</span>
            <div className="flex items-center gap-2 text-[10px] ml-2">
              <span className="flex items-center gap-1 text-sky-600 font-bold">
                <span className="inline-block w-2.5 h-0.5 bg-sky-600 rounded-sm"></span> 真实值
              </span>
              {fallacyPoints.length > 0 && (
                <span className="flex items-center gap-1 text-rose-500 font-bold">
                  <span className="inline-block w-2.5 h-0.5 bg-rose-500 border-b border-dashed border-rose-500"></span> 错解陷阱
                </span>
              )}
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold">
            {params.temperatureCondition === 'standard' ? '标况 0℃' : '常温 25℃'}
          </span>
        </div>

        {/* BaseChart 核心图表 */}
        <div className="flex-1 min-h-0 relative">
          <BaseChart
            title=""
            xDomain={[0, maxRangeX * 1.05]}
            yDomain={[0, maxRangeY * 1.05]}
            xLabel={xLabel}
            yLabel={yLabel}
          >
            {/* 真实科学演变实线 */}
            <ChartLine
              points={actualPoints}
              color={CHART_COLORS.primary}
              strokeWidth={2.5}
            />

            {/* 错解误判虚线对比 */}
            {fallacyPoints.length > 0 && (
              <ChartLine
                points={fallacyPoints}
                color="#EF4444"
                strokeWidth={1.8}
                dash={[4, 3]}
              />
            )}

            {/* 游标联动线：精确吸附于实线并展示真实值 */}
            <ChartCursor
              x={cursorX}
              dataPoints={[
                {
                  y: actualPoints.length > 0
                    ? actualPoints[Math.min(actualPoints.length - 1, Math.max(0, Math.round((cursorX / Math.max(0.01, maxRangeX)) * (actualPoints.length - 1))))].y
                    : 1,
                  label: `${primaryStat?.isIndicative ? '示意' : '实际'}: ${
                    primaryStat?.actualMoles >= 100
                      ? `${primaryStat.actualMoles.toFixed(0)}+ NA`
                      : primaryStat?.actualMoles !== undefined && primaryStat.actualMoles < 0.001
                      ? `${primaryStat.actualMoles.toExponential(1)} NA`
                      : `${primaryStat?.isIndicative ? '≈' : ''}${(primaryStat?.actualMoles ?? 1).toFixed(2)} NA`
                  }`,
                  series: 'primary',
                },
              ]}
              font={canvasSize.font}
            />
          </BaseChart>
        </div>
      </div>
    </div>
  )
}
