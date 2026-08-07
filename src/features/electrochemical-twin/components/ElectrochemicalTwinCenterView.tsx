/**
 * src/features/electrochemical-twin/components/ElectrochemicalTwinCenterView.tsx
 * 中屏探究视图：基于 CANVAS_PRESETS.full (840x650) 标准设计分辨率
 * - 引入 useSimulationFrame 实现 60 FPS 电子、离子与气泡平滑动画
 * - 移除中屏底部违规总结文本，精细优化 Y 轴垂直居中与整体视觉呼吸感
 */

import React, { useState } from 'react'
import { AnimationSvgCanvas } from '@/components/Layout'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { VectorArrow } from '@/components/Chemistry'
import { useAnimationViewport, useSceneScale } from '@/hooks'
import { CANVAS_PRESETS, CHEMISTRY_COLORS, SCENE_COLORS, withAlpha } from '@/theme'
import { useSimulationFrame } from '@/utils/animation'
import type { CellDetails, QuantResult, ElectrochemicalParams } from '../types'
import type { ModelQuizData } from '@/data/quiz'

interface Props {
  viewMode: number
  params: ElectrochemicalParams
  cellDetails: CellDetails
  quantResult: QuantResult
  quizData?: ModelQuizData
}

export const ElectrochemicalTwinCenterView: React.FC<Props> = ({
  viewMode,
  params,
  cellDetails,
  quantResult,
  quizData,
}) => {
  // 正确 Preset 选择：全屏 840x650 标准设计分辨率
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,
  })

  const sceneScale = useSceneScale({
    vp,
    preset: CANVAS_PRESETS.full,
    anchor: 'center',
  })

  // 60 FPS 动画帧数与相位控制
  const [animProgress, setAnimProgress] = useState(0)

  useSimulationFrame(() => {
    setAnimProgress(prev => (prev + 0.012) % 1)
  })

  const tick = animProgress

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-slate-50 relative">
      {viewMode === 0 && (
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          {/* ========================================================= */}
          {/* 左池：原电池 / 放电室 (居中在 x = 210, 占据 x 60 ~ 360, y 160 ~ 490) */}
          {/* ========================================================= */}
          <g transform="translate(60, 160)">
            {/* 烧杯外框 */}
            <rect
              x="0"
              y="0"
              width="300"
              height="330"
              rx="12"
              fill={withAlpha(SCENE_COLORS.container.beaker, 0.15)}
              stroke={SCENE_COLORS.container.beakerBorder}
              strokeWidth="3"
            />
            {/* 溶液液体 */}
            <rect
              x="4"
              y="65"
              width="292"
              height="261"
              rx="8"
              fill={params.mode === 1 ? withAlpha('#10B981', 0.25) : withAlpha('#3B82F6', 0.2)}
            />
            <text
              x="150"
              y="298"
              textAnchor="middle"
              fill="#475569"
              fontSize={canvasSize.font(13)}
              fontWeight="bold"
            >
              {params.mode === 1 ? 'V²⁺/V³⁺ 负极电解液' : 'ZnSO₄ 负极溶液'}
            </text>

            {/* 左电极 (Zn / 负极) */}
            <rect x="45" y="-55" width="30" height="250" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <text x="60" y="-68" textAnchor="middle" fill="#1E293B" fontSize={canvasSize.font(13)} fontWeight="bold">
              {cellDetails.leftElectrode.poleType === 'negative' ? '负极 (Zn)' : '阴极 (C)'}
            </text>

            {/* 右电极 (Cu / 正极) */}
            <rect x="225" y="-55" width="30" height="250" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <text x="240" y="-68" textAnchor="middle" fill="#1E293B" fontSize={canvasSize.font(13)} fontWeight="bold">
              {cellDetails.rightElectrode.poleType === 'positive' ? '正极 (Cu)' : '阳极 (Pt)'}
            </text>

            {/* 隔膜 / 盐桥 (中央 x = 150) */}
            <rect
              x="142"
              y="25"
              width="16"
              height="290"
              rx="2"
              fill={params.membraneType === 3 ? '#A855F7' : '#F59E0B'}
              stroke="#D97706"
              strokeDasharray={params.membraneType > 0 ? '4 2' : 'none'}
              strokeWidth="2"
            />
            <text x="150" y="15" textAnchor="middle" fill="#B45309" fontSize={canvasSize.font(11)} fontWeight="bold">
              {params.membraneType === 0
                ? '盐桥/隔膜'
                : params.membraneType === 1
                ? '阳离子膜'
                : params.membraneType === 2
                ? '阴离子膜'
                : '双极膜(BPM)'}
            </text>

            {/* 导线与电流计 */}
            <path d="M 60 -55 L 60 -105 L 240 -105 L 240 -55" fill="none" stroke="#334155" strokeWidth="3" />
            <circle cx="150" cy="-105" r="18" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
            <text x="150" y="-100" textAnchor="middle" fill="#0F172A" fontSize={canvasSize.font(12)} fontWeight="bold">
              {params.batteryState === 0 ? 'A' : 'DC'}
            </text>
            <text x="150" y="-132" textAnchor="middle" fill="#2563EB" fontSize={canvasSize.font(12)} fontWeight="bold">
              {params.batteryState === 0 ? '⚡ 自发原电池 (输出电能)' : '🔌 外接电源 (充电中)'}
            </text>

            {/* 60 FPS 动态电子流向 (e-) */}
            {params.showElectrons === 1 && (
              <g transform="translate(0, -105)">
                <VectorArrow
                  originDesign={{ x: 60, y: 0 }}
                  vector={{ x: 50, y: 0 }}
                  type="electron"
                  sceneScale={sceneScale}
                  label="e⁻"
                  color={CHEMISTRY_COLORS.electron}
                />
                <circle cx={60 + tick * 60} cy={0} r="4.5" fill="#EF4444" />
                <circle cx={150 + tick * 60} cy={0} r="4.5" fill="#EF4444" />
              </g>
            )}

            {/* 60 FPS 溶液离子流动 */}
            {params.showIons === 1 && (
              <g>
                <path d="M 80 180 Q 150 150 220 180" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx={80 + tick * 120} cy={165 + Math.sin(tick * Math.PI) * -15} r="6.5" fill="#3B82F6" />
                <text
                  x={80 + tick * 120}
                  y={169}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={canvasSize.font(9)}
                  fontWeight="bold"
                >
                  +
                </text>

                <path d="M 220 220 Q 150 250 80 220" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx={220 - tick * 120} cy={235 - Math.sin(tick * Math.PI) * -15} r="6.5" fill="#EF4444" />
                <text
                  x={220 - tick * 120}
                  y={239}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={canvasSize.font(9)}
                  fontWeight="bold"
                >
                  -
                </text>
              </g>
            )}
          </g>

          {/* ========================================================= */}
          {/* 右池：电解池 / 强迫反应室 (居中在 x = 630, 占据 x 480 ~ 780, y 160 ~ 490) */}
          {/* ========================================================= */}
          <g transform="translate(480, 160)">
            <rect
              x="0"
              y="0"
              width="300"
              height="330"
              rx="12"
              fill={withAlpha('#8B5CF6', 0.1)}
              stroke={SCENE_COLORS.container.beakerBorder}
              strokeWidth="3"
            />
            <rect x="4" y="65" width="292" height="261" rx="8" fill={withAlpha('#8B5CF6', 0.15)} />
            <text
              x="150"
              y="298"
              textAnchor="middle"
              fill="#475569"
              fontSize={canvasSize.font(13)}
              fontWeight="bold"
            >
              CuSO₄ / NaCl 外接电解池溶液
            </text>

            {/* 阳极 (C) */}
            <rect x="45" y="-55" width="30" height="250" rx="4" fill="#334155" stroke="#0F172A" strokeWidth="2" />
            <text x="60" y="-68" textAnchor="middle" fill="#1E293B" fontSize={canvasSize.font(13)} fontWeight="bold">
              阳极 (失氧化)
            </text>

            {/* 阴极 (Cu) */}
            <rect x="225" y="-55" width="30" height="250" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <text x="240" y="-68" textAnchor="middle" fill="#1E293B" fontSize={canvasSize.font(13)} fontWeight="bold">
              阴极 (得还原)
            </text>

            {/* 外接 DC 电源导线 */}
            <path d="M 60 -55 L 60 -105 L 240 -105 L 240 -55" fill="none" stroke="#DC2626" strokeWidth="3" />
            <rect x="125" y="-120" width="50" height="30" rx="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <text x="150" y="-100" textAnchor="middle" fill="#FFFFFF" fontSize={canvasSize.font(11)} fontWeight="bold">
              + DC -
            </text>
            <text x="150" y="-132" textAnchor="middle" fill="#7C3AED" fontSize={canvasSize.font(12)} fontWeight="bold">
              ⚙️ 电解池 (强迫电能转化学能)
            </text>

            {/* 60 FPS 阳极气泡升腾动画 */}
            <g transform="translate(60, 140)">
              <circle cx="-6" cy={-((tick * 60) % 60)} r="3.5" fill="#34D399" opacity={0.8} />
              <circle cx="6" cy={-(((tick + 0.5) * 60) % 60)} r="4.5" fill="#34D399" opacity={0.9} />
              <text x="-25" y="-45" fill="#059669" fontSize={canvasSize.font(11)} fontWeight="bold">
                Cl₂ / O₂ 气体
              </text>
            </g>

            {/* 阴极金属沉积 */}
            <rect x="220" y="80" width="10" height="140" fill="#D97706" opacity={0.85} />
            <text x="240" y="240" fill="#B45309" fontSize={canvasSize.font(11)} fontWeight="bold">
              Cu 沉积 (+{quantResult.massChangeRight}g)
            </text>
          </g>
        </AnimationSvgCanvas>
      )}

      {/* 规范踩分 ViewMode 1 */}
      {viewMode === 1 && quizData && (
        <div className="w-full max-w-4xl mx-auto py-6 px-4 overflow-y-auto">
          <ScoringCardSection steps={quizData.scoringSteps} />
        </div>
      )}

      {/* 真题研析 ViewMode 2 */}
      {viewMode === 2 && quizData && (
        <div className="w-full max-w-4xl mx-auto py-6 px-4 overflow-y-auto">
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        </div>
      )}
    </div>
  )
}
