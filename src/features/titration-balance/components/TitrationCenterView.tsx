/**
 * src/features/titration-balance/components/TitrationCenterView.tsx
 * 滴定突跃与离子浓度排序解题工具 - 中屏 splitHw 左右分屏 UI Component
 */

import { useMemo } from 'react'
import { useAnimationViewport } from '@/hooks/useAnimationViewport'
import { CANVAS_PRESETS, SCENE_COLORS, FONT, CHART_COLORS, withAlpha } from '@/theme'
import { AnimationSvgCanvas } from '@/components/Layout'
import { BuretteApparatus, PhMeterApparatus } from '@/components/Chemistry'
import { TitrationCurveChart } from '@/components/Chart/TitrationCurveChart'
import { BaseChart } from '@/components/Chart/BaseChart'
import { ChartLine } from '@/components/Chart/ChartLine'
import { ChartCursor } from '@/components/Chart/ChartCursor'
import { TitrationControls, ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import type { TitrationParams, TitrationChemistryResult } from '../types'
import type { ModelQuizData } from '@/data/quiz/types'
import { Eye, FileCheck, HelpCircle, Activity } from 'lucide-react'

export interface TitrationCenterViewProps {
  params: TitrationParams
  chemistry: TitrationChemistryResult
  quizData: ModelQuizData | undefined
  updateParam: (key: keyof TitrationParams, value: any) => void
  isAutoPlaying: boolean
  setIsAutoPlaying: (playing: boolean) => void
  onSingleDrop: () => void
  onBulkAdd: () => void
  onReset: () => void
}

export function TitrationCenterView({
  params,
  chemistry,
  quizData,
  updateParam,
  isAutoPlaying,
  setIsAutoPlaying,
  onSingleDrop,
  onBulkAdd,
  onReset,
}: TitrationCenterViewProps) {
  const { viewMode } = params

  // 1. Viewport 绑定：遵照 AGENTS.md 铁律，化学滴定与图像场景首选 CANVAS_PRESETS.splitHw (280px + 560px)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitHw,
  })

  const isAcidTitrant = params.systemType === 'strongAcidWeakBase'

  // 滴定突跃曲线点集
  const chartPoints = useMemo(() => {
    return chemistry.curvePoints.map((pt) => ({
      x: pt.vAdd,
      y: pt.pH,
    }))
  }, [chemistry.curvePoints])

  // 微粒浓度演变图点集 (主要阳/阴离子与弱电解质)
  const ionDistributionPoints = useMemo(() => {
    return chemistry.curvePoints.map((pt) => {
      const r = pt.vRatio
      let cMain = 0.05
      if (params.systemType === 'strongBaseWeakAcid') {
        cMain = r <= 1.0 ? 0.1 * (1 - r) : 0.001 // HA 衰减
      } else if (params.systemType === 'strongAcidWeakBase') {
        cMain = r <= 1.0 ? 0.1 * (1 - r) : 0.001 // B 衰减
      } else {
        cMain = Math.abs(1 - r) * 0.05
      }
      return {
        x: pt.vAdd,
        y: Math.max(0.0001, cMain),
      }
    })
  }, [chemistry.curvePoints, params.systemType])

  // 滴定控制条的快跳特征节点 (0Veq, 0.5Veq, 1.0Veq, 1.5Veq)
  const stepsForControls = useMemo(() => {
    return [
      { title: '起点 (V=0)', volume: 0 },
      { title: '半中和 (0.5Veq)', volume: chemistry.vEq * 0.5 },
      { title: '突跃/计量 (1.0Veq)', volume: chemistry.vEq },
      { title: '过量 (1.5Veq)', volume: chemistry.vEq * 1.5 },
    ]
  }, [chemistry.vEq])

  if (viewMode === 1 && quizData && quizData.scoringSteps.length > 0) {
    return (
      <div className="w-full h-full p-4 overflow-y-auto bg-slate-50">
        <div className="flex items-center justify-between border-b pb-2 mb-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            高考规范答题踩分点与三大守恒推导
          </h3>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-medium border border-emerald-200">
            高考选择题与大题踩分规范
          </span>
        </div>
        <ScoringCardSection steps={quizData.scoringSteps} />
      </div>
    )
  }

  if (viewMode === 2 && quizData && quizData.variantQuizzes.length > 0) {
    return (
      <div className="w-full h-full p-4 overflow-y-auto bg-slate-50">
        <div className="flex items-center justify-between border-b pb-2 mb-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            高考真题变式选择题 & 详细解析
          </h3>
          <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md font-medium border border-amber-200">
            包含近年滴定突跃与粒子排序真题
          </span>
        </div>
        <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      {/* 上半区：分屏模式 (左 280px 装置区 + 右 560px 滴定曲线与图表区，零外层滚动条) */}
      <div className="flex-1 min-h-0 w-full flex flex-row overflow-hidden border-b border-slate-200">
        {/* 左侧 280px 滴定装置与测定视口区 */}
        <div className="w-[280px] h-full shrink-0 border-r border-slate-200/80 relative bg-slate-50/30">
          {/* SVG 滴定装置场景 */}
          <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
            <defs>
              <pattern id="titration-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x="-140" y="0" width="280" height="650" fill="url(#titration-grid)" opacity={0.5} />

            {/* 铁架台与固定连杆 */}
            <rect x={110} y={430} width={120} height={10} fill="#64748B" rx={2} />
            <rect x={165} y={215} width={10} height={220} fill="#94A3B8" rx={1} />
            <rect x={165} y={250} width={45} height={6} fill="#475569" rx={1} />
            <rect x={165} y={320} width={45} height={6} fill="#475569" rx={1} />

            {/* 滴定管 (酸式 / 碱式) */}
            <BuretteApparatus
              x={190}
              y={210}
              width={30}
              height={150}
              variant={isAcidTitrant ? 'acid' : 'base'}
              fillLevel={Math.max(0.1, 1 - params.vRatio * 0.45)}
              fillColor={isAcidTitrant ? SCENE_COLORS.reagent.acid : SCENE_COLORS.reagent.base}
              isOpen={isAutoPlaying || (params.vRatio > 0 && params.vRatio < 2.0)}
              showDrop={params.vRatio > 0}
              font={canvasSize.font}
            />

            {/* 锥形瓶与实时 indicator 变色溶液 */}
            <g transform="translate(175, 355)">
              <polygon
                points="20,0 40,0 52,65 8,65"
                fill={withAlpha(SCENE_COLORS.materials.glass, 0.4)}
                stroke={SCENE_COLORS.materials.glassBorder}
                strokeWidth={1.5}
              />
              <polygon points="12,58 48,58 51,64 9,64" fill={chemistry.indicatorColor} />
              <ellipse cx={30} cy={58} rx={18} ry={3} fill={chemistry.indicatorColor} opacity={0.9} />
            </g>

            {/* pH 计探头 */}
            <PhMeterApparatus
              x={230}
              y={240}
              phValue={chemistry.pH}
              font={canvasSize.font}
            />

            {/* 标注提示 */}
            <text x={20} y={245} fontSize={canvasSize.font(FONT.annotation)} fill="#475569" fontWeight="bold">
              {isAcidTitrant ? '滴定管 (HCl)' : '滴定管 (NaOH)'}
            </text>
            <text x={20} y={385} fontSize={canvasSize.font(FONT.annotation)} fill="#475569" fontWeight="bold">
              {chemistry.indicatorName}
            </text>
          </AnimationSvgCanvas>

          {/* 浮动试剂与实时数值标注卡 */}
          <div className="absolute top-2 left-2 right-2 bg-white/90 border border-slate-200 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-mono backdrop-blur shadow-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              {isAcidTitrant ? 'HCl 滴定 NH₃·H₂O' : 'NaOH 滴定 CH₃COOH'}
            </span>
            <span className="text-indigo-700 font-bold">
              pH {chemistry.pH.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 右侧 560px 宽图表区 (上下弹性平分或大图表展示) */}
        <div className="flex-1 h-full min-w-0 flex flex-col bg-white">
          {/* 上层：主 pH 滴定突跃曲线 */}
          <div className="flex-1 min-h-0 w-full p-2 border-b border-slate-200/60 relative flex flex-col">
            <div className="flex items-center justify-between mb-1 px-1 shrink-0">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                pH 滴定突跃曲线 (pH - V)
              </span>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                  突跃带: pH {chemistry.jumpStartPH} ~ {chemistry.jumpEndPH}
                </span>
                {chemistry.isInJumpZone && (
                  <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-bold animate-pulse">
                    突跃中！
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 min-h-0 relative">
              <TitrationCurveChart
                points={chartPoints}
                currentV={chemistry.vAdd}
                equivalencePointV={chemistry.vEq}
                halfEquivalenceV={chemistry.vEq * 0.5}
                indicator={params.indicator}
              />
            </div>
          </div>

          {/* 下层：分子/离子电离平衡演变图 (BaseChart) */}
          <div className="flex-1 min-h-0 w-full p-2 relative flex flex-col">
            <div className="flex items-center justify-between mb-1 px-1 shrink-0">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-600" />
                弱电解质分子/离子浓度演变曲线 c - V(滴加)
              </span>
              <span className="text-[11px] text-slate-500">
                半中和点: c(HA) ≈ c(A⁻)
              </span>
            </div>

            <div className="flex-1 min-h-0 relative">
              <BaseChart
                title=""
                xDomain={[0, 40]}
                yDomain={[0, 0.1]}
                xLabel="V(滴加试剂) / mL"
                yLabel="微粒浓度 c / (mol/L)"
              >
                <ChartLine points={ionDistributionPoints} color={CHART_COLORS.primary} strokeWidth={2} />
                <ChartCursor
                  x={chemistry.vAdd}
                  dataPoints={[
                    { y: chemistry.ionConcs[2]?.conc || 0.01, label: `${chemistry.ionConcs[2]?.name || 'HA'}: ${(chemistry.ionConcs[2]?.conc || 0).toFixed(3)} M` },
                  ]}
                />
              </BaseChart>
            </div>
          </div>
        </div>
      </div>

      {/* 下半区：化学专属滴定演练控制组件 TitrationControls (挂载于底部，零外层滚动条) */}
      <div className="shrink-0 p-2 bg-slate-50 border-t border-slate-200">
        <TitrationControls
          volume={chemistry.vAdd}
          maxVolume={chemistry.vEq * 2.0}
          reagentName={isAcidTitrant ? '0.1 mol/L HCl 滴加试剂' : '0.1 mol/L NaOH 滴加试剂'}
          isPlaying={isAutoPlaying}
          onPlayPause={() => setIsAutoPlaying(!isAutoPlaying)}
          onSingleDrop={onSingleDrop}
          onBulkAdd={onBulkAdd}
          onReset={onReset}
          onVolumeChange={(vol) => {
            setIsAutoPlaying(false)
            updateParam('vRatio', vol / chemistry.vEq)
          }}
          steps={stepsForControls}
          onJumpToStep={(vol) => {
            setIsAutoPlaying(false)
            updateParam('vRatio', vol / chemistry.vEq)
          }}
        />
      </div>
    </div>
  )
}
