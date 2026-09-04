import { useMemo } from 'react'
import { useAnimationViewport } from '@/hooks'
import { CANVAS_PRESETS, CHEMISTRY_COLORS, CHART_COLORS } from '@/theme'
import { AnimationSvgCanvas } from '@/components/Layout'
import { TestTubeApparatus, DropperApparatus } from '@/components/Chemistry'
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
  const liquidLevelRatio = Math.min(0.75, 0.25 + progress * 0.4)
  const liquidSurfaceY = tubeY + tubeHeight * (1 - liquidLevelRatio)
  const dropperTipY = isDropperDeep ? liquidSurfaceY + 30 : tubeY - 35

  // 快跳节点转换 (完全与左屏实验对比模式及高中化学特征体积动态同步)
  const stepsForControls = useMemo(() => {
    if (currentScene.id === 'al-amphoteric') {
      if (isReverseTitration) {
        return [
          { title: '滴加前：澄清强碱 NaOH 溶液', volume: 0 },
          { title: '强碱耗尽点：开始析出 Al(OH)₃ 沉淀', volume: 7.5 },
          { title: '反滴终点：生成最大量 Al(OH)₃ 沉淀', volume: 10.0 },
        ]
      }
      if (isWeakBase) {
        return [
          { title: '滴加前：澄清无色 AlCl₃ 溶液', volume: 0 },
          { title: '沉淀最大值：生成 Al(OH)₃ 白色胶状沉淀', volume: 5.0 },
          { title: '弱碱过量：NH₃·H₂O 无法溶解沉淀', volume: 10.0 },
        ]
      }
    }

    if (currentScene.id === 'fe-air-ox' && isAirIsolated) {
      return [
        { title: '滴加前：浅绿色 Fe²⁺ 溶液 (已煮沸去氧)', volume: 0 },
        { title: '滴入碱液：长滴管在油层下生成白色 Fe(OH)₂', volume: 4.0 },
        { title: '抗氧化终态：隔绝空气长久保持白色', volume: 10.0 },
      ]
    }

    return currentScene.steps.map((st) => ({
      title: st.title,
      volume: st.progress * 10,
    }))
  }, [currentScene, isReverseTitration, isWeakBase, isAirIsolated])

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

            {/* 标准胶头滴管组件 (支持伸入液面下防氧化模式与规范垂直悬空滴加) */}
            <DropperApparatus
              x={tubeX + tubeWidth / 2}
              y={dropperTipY}
              bodyHeight={isDropperDeep ? 115 : 75}
              bodyWidth={10}
              liquidLevel={Math.max(0.15, 1 - progress * 0.7)}
              liquidColor="rgba(56, 189, 248, 0.45)"
              isSqueezed={isAutoPlaying || (progress > 0 && progress < 1)}
              dropProgress={progress > 0 && progress < 1 ? progress : 0}
              dropColor="#38BDF8"
              isDeep={isDropperDeep}
            />

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
