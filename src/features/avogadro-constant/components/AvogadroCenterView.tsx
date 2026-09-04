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
    { playing: true }
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
      maxX = 50
      maxY = chemistry.isStateGas ? 3 : 15

      for (let i = 0; i <= count; i++) {
        const x = (i / count) * maxX
        const yTrap = x / 22.4
        const yReal = chemistry.isStateGas
          ? x / (params.temperatureCondition === 'standard' ? 22.4 : 24.5)
          : (x * 1000) / 18 / 200
        fal.push({ x, y: yTrap })
        act.push({ x, y: yReal })
      }
    } else if (cat === 'structure-bonds') {
      xName = params.amountUnit === 'g' ? '质量 m (g)' : '摩尔数 n (mol)'
      yName = '化学键 / 粒子数 (NA)'
      maxX = 60
      maxY = 6

      for (let i = 0; i <= count; i++) {
        const x = (i / count) * maxX
        let yReal = 0
        let yTrap = 0

        if (params.structureItem === 'P4') {
          const moles = params.amountUnit === 'g' ? x / 124 : x
          yReal = moles * 6 // 真实 6 条棱键
          yTrap = moles * 4 // 错当 4 个顶点 4 条键
        } else if (params.structureItem === 'SiO2') {
          const moles = params.amountUnit === 'g' ? x / 60 : x
          yReal = moles * 4 // 真实 4 条 Si-O 键
          yTrap = moles * 2 // 错看分子式 2 个 O
        } else if (params.structureItem === 'graphite') {
          const moles = params.amountUnit === 'g' ? x / 12 : x
          yReal = moles * 1.5 // 均摊 1.5 键
          yTrap = moles * 3 // 未均摊 3 键
        } else if (params.structureItem === 'ice') {
          const moles = params.amountUnit === 'g' ? x / 18 : x
          yReal = moles * 2 // 均摊 2 mol 氢键
          yTrap = moles * 4 // 错当 4 mol
        } else if (params.structureItem === 'Na2O2') {
          const moles = params.amountUnit === 'g' ? x / 78 : x
          yReal = moles * 1 // 1 mol 阴离子
          yTrap = moles * 2 // 拆成 2 个 O-
        } else {
          yReal = x * 0.1
          yTrap = x * 0.2
        }

        act.push({ x, y: yReal })
        fal.push({ x, y: yTrap })
      }
    } else if (cat === 'electrolyte-hydrolysis') {
      xName = params.electrolyteItem === 'NaHSO4-molten' ? '用量 n (mol)' : '浓度 c (mol/L)'
      yName = '离子 / 微粒数 (NA)'
      maxX = params.electrolyteItem === 'NaHSO4-molten' ? 2 : 1
      maxY = 3

      for (let i = 0; i <= count; i++) {
        const x = (i / count) * maxX
        let yReal = 0
        let yTrap = 0

        if (params.electrolyteItem === 'NaHSO4-molten') {
          yReal = x * 2 // 熔融态 2 mol
          yTrap = x * 3 // 水溶液 3 mol
        } else if (params.electrolyteItem === 'CH3COOH') {
          yReal = x * params.solutionVolume * 0.013
          yTrap = x * params.solutionVolume * 1.0
        } else if (params.electrolyteItem === 'FeCl3') {
          yReal = x * params.solutionVolume * 0.001
          yTrap = x * params.solutionVolume * 1.0
        } else {
          yReal = x * params.solutionVolume * 1.1
          yTrap = x * params.solutionVolume * 1.0
        }

        act.push({ x, y: yReal })
        fal.push({ x, y: yTrap })
      }
    } else if (cat === 'redox-electron') {
      xName = '反应物投料 n (mol)'
      yName = '转移电子数 ne (NA)'
      maxX = 2
      maxY = 4

      for (let i = 0; i <= count; i++) {
        const x = (i / count) * maxX
        let yReal = 0
        let yTrap = 0

        if (params.redoxItem === 'Cl2-NaOH') {
          yReal = x * 1
          yTrap = x * 2
        } else if (params.redoxItem === 'Cu-S') {
          yReal = x * 1
          yTrap = x * 2
        } else if (params.redoxItem === 'NO2-N2O4-reversible') {
          yReal = x * 0.7
          yTrap = x * 1.0
        } else {
          yReal = x * 1
          yTrap = x * 2
        }

        act.push({ x, y: yReal })
        fal.push({ x, y: yTrap })
      }
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
  }, [params, chemistry.isStateGas])

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

  // 视角 2: 高考真题研析
  if (viewMode === 2) {
    return (
      <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
        {quizData?.variantQuizzes && quizData.variantQuizzes.length > 0 ? (
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        ) : (
          <div className="p-8 text-center text-slate-400">暂无真题研析</div>
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
                    ? actualPoints[Math.min(actualPoints.length - 1, Math.round((cursorX / maxRangeX) * (actualPoints.length - 1)))].y
                    : 1,
                  label: chemistry.particleStats[0]?.actualMoles >= 100
                    ? `实际: ${chemistry.particleStats[0].actualMoles.toFixed(0)}+ NA`
                    : `实际: ${(chemistry.particleStats[0]?.actualMoles || 1).toFixed(2)} NA`,
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
