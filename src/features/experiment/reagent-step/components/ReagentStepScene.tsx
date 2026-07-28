import { useMemo } from 'react'
import { useAnimationViewport } from '@/hooks'
import { CANVAS_PRESETS, CHEMISTRY_COLORS, CHART_COLORS } from '@/theme'
import { AnimationSvgCanvas } from '@/components/Layout'
import { TestTubeApparatus } from '@/components/Chemistry/TestTubeApparatus'
import { BaseChart, ChartLine, ChartCursor } from '@/components/Chart'
import type { ReagentSceneConfig, ReagentStepPoint } from '../types'

export interface ReagentStepSceneProps {
  currentScene: ReagentSceneConfig
  progress: number
  currentStep: ReagentStepPoint
  interpolatedPptLevel: number
  isAirIsolated?: boolean
  isReverseTitration?: boolean
  isWeakBase?: boolean
  chartData: { x: number; y: number; label: string }[]
}

export function ReagentStepScene({
  currentScene,
  progress,
  currentStep,
  interpolatedPptLevel,
  isAirIsolated = false,
  isReverseTitration = false,
  isWeakBase = false,
  chartData,
}: ReagentStepSceneProps) {
  // 1. 视口绑定：采用标准的 CANVAS_PRESETS.splitHw (280px 装置区 + 560px 图表区)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitHw,
  })

  // 2. 试管在 280x650 视口坐标系中的定位参数 (design 坐标)
  const tubeWidth = 60
  const tubeHeight = 210
  const tubeX = 110
  const tubeY = 240

  // 滴管 (Pipette) 定位与下降特效
  const isDropperDeep = isAirIsolated && currentScene.id === 'fe-air-ox'
  const dropperY = isDropperDeep ? tubeY + 70 : tubeY - 90
  const liquidLevelRatio = Math.min(0.75, 0.25 + progress * 0.4)

  // 3. 整理定量图表数据点
  const currentVolume = progress * 10 // 0 ~ 10 mL
  const currentPptMass = Math.round(interpolatedPptLevel * 200) // mmol

  // 沉淀曲线 points
  const pptChartPoints = useMemo(() => {
    return chartData.map((d) => ({
      x: d.x,
      y: d.y,
    }))
  }, [chartData])

  // pH 曲线 points (基于估算 pH 插值)
  const phChartPoints = useMemo(() => {
    return chartData.map((d) => {
      const pRatio = d.x / 10
      let phVal = 7.0
      if (currentScene.id === 'fe-air-ox') {
        phVal = 6.0 + pRatio * 3.8
      } else if (currentScene.id === 'al-amphoteric') {
        phVal = isReverseTitration ? Math.max(7, 13 - pRatio * 5) : 4.5 + pRatio * 8.5
      } else if (currentScene.id === 'cu-ammonia') {
        phVal = 5.5 + pRatio * 5.7
      } else {
        phVal = 4.0 + pRatio * 4.5
      }
      return {
        x: d.x,
        y: parseFloat(phVal.toFixed(2)),
      }
    })
  }, [chartData, currentScene.id, isReverseTitration])

  return (
    <div className="w-full h-full flex flex-row overflow-hidden border border-slate-200/80 rounded-xl bg-white">
      {/* 左侧 280px 装置动画视口区 (CANVAS_PRESETS.splitHw) */}
      <div className="w-[280px] h-full shrink-0 border-r border-slate-200/80 relative">
        <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
          {/* 背景轻量微缩网格 */}
          <defs>
            <pattern id="reagent-grid-mini" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x="-140" y="0" width="280" height="650" fill="url(#reagent-grid-mini)" opacity={0.6} />

          {/* 1. 铁架台夹持装置 */}
          <rect x={tubeX - 22} y={tubeY + 30} width={10} height={180} fill="#475569" rx={2} />
          <rect x={tubeX - 22} y={tubeY + 50} width={34} height={10} fill="#64748B" rx={2} />

          {/* 2. 试管主体 (透传 canvasSize.font 缩放) */}
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

            {/* 隔绝空气植物油层 */}
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

          {/* 3. 滴管/滴定管 (Pipette Apparatus) */}
          <g transform={`translate(${tubeX + tubeWidth / 2 - 8}, ${dropperY})`}>
            <path d="M 2 0 Q 8 -12 14 0 Z" fill="#EF4444" />
            <rect x="5" y="0" width="6" height="70" fill="rgba(255,255,255,0.8)" stroke="#94A3B8" strokeWidth="1" />
            <line x1="5" y1="20" x2="9" y2="20" stroke="#475569" strokeWidth="0.8" />
            <line x1="5" y1="35" x2="9" y2="35" stroke="#475569" strokeWidth="0.8" />
            <line x1="5" y1="50" x2="9" y2="50" stroke="#475569" strokeWidth="0.8" />
            <polygon points="5,70 11,70 9,85 7,85" fill="rgba(255,255,255,0.9)" stroke="#94A3B8" strokeWidth="1" />
          </g>

          {/* 4. 动态液滴落入动画 */}
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

          {/* 5. 试管中沉淀标注 (遵守铁律 7：font(N) 包裹字号) */}
          <g transform={`translate(${tubeX + tubeWidth + 12}, ${tubeY + 110})`}>
            <rect x="0" y="-14" width="115" height="24" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="6" y="2" fill="#1E293B" fontSize={canvasSize.font(11)} fontWeight="bold">
              {currentStep.precipitateText}
            </text>
          </g>
        </AnimationSvgCanvas>

        {/* 顶部模式/试剂标注卡 */}
        <div className="absolute top-2 left-2 right-2 bg-white/90 border border-slate-200 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-mono backdrop-blur shadow-sm">
          <span className="font-bold text-slate-800">
            {currentScene.badgeText} {isWeakBase ? '(弱碱)' : ''}
          </span>
          <span className="text-amber-700 font-bold">V = {currentVolume.toFixed(1)} mL</span>
        </div>
      </div>

      {/* 右侧 560px 定量图表区 (使用标准 BaseChart 组件) */}
      <div className="flex-1 h-full min-w-0 flex flex-col bg-white">
        {/* 上半部分：沉淀质量 n(沉淀) - 滴加体积 V 图像 */}
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

        {/* 下半部分：溶液 pH - 滴加体积 V 图像 */}
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
              dataPoints={[{ y: currentStep.ph, label: `pH: ${currentStep.ph.toFixed(1)}` }]}
            />
          </BaseChart>
        </div>
      </div>
    </div>
  )
}
