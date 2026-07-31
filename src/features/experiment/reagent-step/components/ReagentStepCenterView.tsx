import { useMemo } from 'react'
import { useAnimationViewport } from '@/hooks'
import { CANVAS_PRESETS, CHEMISTRY_COLORS, CHART_COLORS } from '@/theme'
import { AnimationSvgCanvas } from '@/components/Layout'
import { TestTubeApparatus } from '@/components/Chemistry/TestTubeApparatus'
import { BaseChart, ChartLine, ChartCursor } from '@/components/Chart'
import { TitrationControls, ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import type { ViewMode, ReagentSceneConfig, ReagentStepPoint } from '../types'
import { getModelQuizData } from '@/data/gaokaoQuizData'

export interface ReagentStepCenterViewProps {
  viewMode: ViewMode
  currentScene: ReagentSceneConfig
  progress: number
  setProgress: (p: number) => void
  isAutoPlaying: boolean
  setIsAutoPlaying: (a: boolean) => void
  handleSingleDrop: () => void
  handleBulkAdd: () => void
  handleReset: () => void
  currentStep: ReagentStepPoint
  interpolatedPptLevel: number
  isAirIsolated: boolean
  isReverseTitration?: boolean
  isWeakBase?: boolean
  currentPptMass?: number
  currentPh?: number
  chartData: { x: number; y: number; ph: number; label: string }[]
}

export function ReagentStepCenterView({
  viewMode,
  currentScene,
  progress,
  setProgress,
  isAutoPlaying,
  setIsAutoPlaying,
  handleSingleDrop,
  handleBulkAdd,
  handleReset,
  currentStep,
  interpolatedPptLevel,
  isAirIsolated,
  isReverseTitration,
  isWeakBase,
  currentPptMass: propCurrentPptMass,
  currentPh: propCurrentPh,
  chartData,
}: ReagentStepCenterViewProps) {
  // 1. Viewport 绑定：完全参照 PrimaryCellAnimation.tsx 选用 CANVAS_PRESETS.splitHw
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitHw,
  })

  const quizData = getModelQuizData('model-reagent-step')

  // 定量图像数据准备
  const currentVolume = progress * 10
  const currentPptMass = propCurrentPptMass ?? Math.round(interpolatedPptLevel * 200)
  const currentPh = propCurrentPh ?? currentStep.ph

  const pptChartPoints = useMemo(() => {
    // 随滴加进度 currentVolume 动态过滤，实现曲线随着滴加过程实时延伸绘制生成
    return chartData
      .filter((d) => d.x <= currentVolume + 0.05)
      .map((d) => ({
        x: d.x,
        y: d.y,
      }))
  }, [chartData, currentVolume])

  const phChartPoints = useMemo(() => {
    return chartData
      .filter((d) => d.x <= currentVolume + 0.05)
      .map((d) => ({
        x: d.x,
        y: d.ph,
      }))
  }, [chartData, currentVolume])

  // 试管尺寸与定位 (280x650 design)
  const tubeWidth = 60
  const tubeHeight = 210
  const tubeX = 110
  const tubeY = 240
  const isDropperDeep = isAirIsolated && currentScene.id === 'fe-air-ox'
  const dropperY = isDropperDeep ? tubeY + 70 : tubeY - 90
  const liquidLevelRatio = Math.min(0.75, 0.25 + progress * 0.4)

  // 快跳节点转换
  const stepsForControls = useMemo(() => {
    return currentScene.steps.map((st) => ({
      title: st.title,
      volume: st.progress * 10,
    }))
  }, [currentScene])

  if (viewMode === 'scoring' && quizData && quizData.scoringSteps.length > 0) {
    return (
      <div className="w-full h-full p-4 overflow-y-auto bg-slate-50/50">
        <ScoringCardSection steps={quizData.scoringSteps} />
      </div>
    )
  }

  if (viewMode === 'quiz' && quizData && quizData.variantQuizzes.length > 0) {
    return (
      <div className="w-full h-full p-4 overflow-y-auto bg-slate-50/50">
        <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      {/* 上半区：完全参照原电池 280px 装置 + 560px 图表自适应分屏 (零外层滚动) */}
      <div className="flex-1 min-h-0 w-full flex flex-row overflow-hidden border-b border-slate-200">
        {/* 左侧 280px 试管装置视口区 */}
        <div className="w-[280px] h-full shrink-0 border-r border-slate-200/80 relative">
          <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
            <defs>
              <pattern id="reagent-grid-mini" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x="-140" y="0" width="280" height="650" fill="url(#reagent-grid-mini)" opacity={0.6} />

            {/* 铁架台 */}
            <rect x={tubeX - 22} y={tubeY + 30} width={10} height={180} fill="#475569" rx={2} />
            <rect x={tubeX - 22} y={tubeY + 50} width={34} height={10} fill="#64748B" rx={2} />

            {/* 试管主体 */}
            <g>
              <TestTubeApparatus
                x={tubeX}
                y={tubeY}
                width={tubeWidth}
                height={tubeHeight}
                fillLevel={liquidLevelRatio}
                fillColor={currentStep.solutionColor}
                precipitateLevel={interpolatedPptLevel}
                precipitateColor={currentStep.precipitateColor}
                label={currentScene.badgeText}
                font={canvasSize.font}
              />

              {isAirIsolated && currentScene.id === 'fe-air-ox' && (
                <rect
                  x={tubeX + 3}
                  y={tubeY + tubeHeight * (1 - liquidLevelRatio) - 8}
                  width={tubeWidth - 6}
                  height={8}
                  fill="#FACC15"
                  opacity={0.7}
                  rx={1}
                />
              )}
            </g>

            {/* 滴管/滴定管 */}
            <g transform={`translate(${tubeX + tubeWidth / 2 - 8}, ${dropperY})`}>
              <path d="M 2 0 Q 8 -12 14 0 Z" fill="#EF4444" />
              <rect x="5" y="0" width="6" height="70" fill="rgba(255,255,255,0.8)" stroke="#94A3B8" strokeWidth="1" />
              <line x1="5" y1="20" x2="9" y2="20" stroke="#475569" strokeWidth="0.8" />
              <line x1="5" y1="35" x2="9" y2="35" stroke="#475569" strokeWidth="0.8" />
              <line x1="5" y1="50" x2="9" y2="50" stroke="#475569" strokeWidth="0.8" />
              <polygon points="5,70 11,70 9,85 7,85" fill="rgba(255,255,255,0.9)" stroke="#94A3B8" strokeWidth="1" />
            </g>

            {/* 动态液滴 */}
            {progress > 0 && progress < 1 && (
              <g>
                <circle
                  cx={tubeX + tubeWidth / 2}
                  cy={dropperY + 95 + ((progress * 100) % 35)}
                  r="3.5"
                  fill="#38BDF8"
                  opacity="0.85"
                />
                <circle
                  cx={tubeX + tubeWidth / 2}
                  cy={dropperY + 115 + ((progress * 100) % 35)}
                  r="2.5"
                  fill="#38BDF8"
                  opacity="0.6"
                />
              </g>
            )}

            {/* 沉淀标注 */}
            <g transform={`translate(${tubeX + tubeWidth + 12}, ${tubeY + 110})`}>
              <rect x="0" y="-14" width="115" height="24" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
              <text x="6" y="2" fill="#1E293B" fontSize={canvasSize.font(11)} fontWeight="bold">
                {currentStep.precipitateText}
              </text>
            </g>
          </AnimationSvgCanvas>

          {/* 试剂与体积标注卡 */}
          <div className="absolute top-2 left-2 right-2 bg-white/90 border border-slate-200 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-mono backdrop-blur shadow-xs">
            <span className="font-bold text-slate-800">
              {currentScene.badgeText} {isWeakBase ? '(弱碱)' : isReverseTitration ? '(反滴)' : ''}
            </span>
            <span className="text-amber-700 font-bold">V = {currentVolume.toFixed(1)} mL</span>
          </div>
        </div>

        {/* 右侧 560px 定量图表区（两图表弹性平分，禁止手写固定高度） */}
        <div className="flex-1 h-full min-w-0 flex flex-col bg-white">
          <div className="flex-1 min-h-0 w-full p-2 border-b border-slate-200/60">
            <BaseChart
              title="沉淀生成/溶解定量图像 n(沉淀) - V(滴加)"
              xDomain={[0, 10]}
              yDomain={[0, 120]}
              xLabel="滴加体积 V (mL)"
              yLabel="沉淀量 n (mmol)"
            >
              <ChartLine points={pptChartPoints} color={CHEMISTRY_COLORS.concentration} strokeWidth={2} />
              <ChartCursor
                x={currentVolume}
                dataPoints={[{ y: currentPptMass, label: `沉淀量: ${currentPptMass} mmol` }]}
              />
            </BaseChart>
          </div>

          <div className="flex-1 min-h-0 w-full p-2">
            <BaseChart
              title="溶液环境 pH 动态变化曲线 pH - V(滴加)"
              xDomain={[0, 10]}
              yDomain={[0, 14]}
              xLabel="滴加体积 V (mL)"
              yLabel="溶液 pH"
            >
              <ChartLine points={phChartPoints} color={CHART_COLORS.primary} strokeWidth={2} />
              <ChartCursor
                x={currentVolume}
                dataPoints={[{ y: currentPh, label: `pH: ${currentPh.toFixed(1)}` }]}
              />
            </BaseChart>
          </div>
        </div>
      </div>

      {/* 下半区：化学专属滴定演练控制组件 TitrationControls (挂载于底部，不滚动) */}
      <div className="shrink-0 p-2 bg-slate-50 border-t border-slate-200">
        <TitrationControls
          volume={currentVolume}
          maxVolume={10}
          reagentName={`${currentScene.badgeText} 滴加试剂`}
          isPlaying={isAutoPlaying}
          onPlayPause={() => setIsAutoPlaying(!isAutoPlaying)}
          onSingleDrop={handleSingleDrop}
          onBulkAdd={handleBulkAdd}
          onReset={handleReset}
          onVolumeChange={(vol) => {
            setIsAutoPlaying(false)
            setProgress(vol / 10)
          }}
          steps={stepsForControls}
          onJumpToStep={(vol) => {
            setIsAutoPlaying(false)
            setProgress(vol / 10)
          }}
        />
      </div>
    </div>
  )
}
