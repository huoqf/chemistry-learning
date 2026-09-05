import React from 'react'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { EquilibriumChart, RelationChart } from '@/components/Chart'
import { EnergyProfileChart } from './EnergyProfileChart'
import { BoltzmannDistributionChart } from './BoltzmannDistributionChart'
import { LnkInvTChart } from './LnkInvTChart'
import { AlphaTpChart } from './AlphaTpChart'
import { CHART_COLORS } from '@/theme'
import type { ModelQuizData } from '@/data/quiz/types'
import type { NexusParams } from '../types'

interface ReactionPrincipleCenterViewProps {
  viewMode: number
  params: NexusParams
  chemistry: any
  quizData?: ModelQuizData
}

export const ReactionPrincipleCenterView: React.FC<ReactionPrincipleCenterViewProps> = ({
  viewMode,
  params,
  chemistry,
  quizData,
}) => {
  // 1. 视角 1：规范踩分
  if (viewMode === 1) {
    return (
      <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
        <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          反应原理大题核心规范踩分卡 (评分标准对齐)
        </h2>
        {quizData?.scoringSteps ? (
          <ScoringCardSection steps={quizData.scoringSteps} />
        ) : (
          <p className="text-xs text-slate-500">题库踩分卡加载中...</p>
        )}
      </div>
    )
  }

  // 2. 视角 2：真题研析
  if (viewMode === 2) {
    return (
      <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
        <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          高考反应原理大题高保真真题研析
        </h2>
        {quizData?.variantQuizzes ? (
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        ) : (
          <p className="text-xs text-slate-500">真题题库加载中...</p>
        )}
      </div>
    )
  }

  // 3. 视角 0：动态图谱探究
  const history = chemistry.history
  const forwardPoints = history.map((p: any) => ({ x: p.time, y: p.vForward }))
  const reversePoints = history.map((p: any) => ({ x: p.time, y: p.vReverse }))

  const reactantConcPoints = history.map((p: any) => ({ x: p.time, y: p.cReactant }))
  const productConcPoints = history.map((p: any) => ({ x: p.time, y: p.cProduct }))

  const maxV = Math.max(
    2.4,
    ...forwardPoints.map((p: any) => p.y),
    ...reversePoints.map((p: any) => p.y)
  )
  const maxC = Math.max(
    2.8,
    ...reactantConcPoints.map((p: any) => p.y),
    ...productConcPoints.map((p: any) => p.y)
  )

  const perturbMarker = [
    {
      x: 4.0,
      axis: 'vertical' as const,
      label: 't₁ 改变条件',
      color: '#f59e0b',
    },
  ]

  const chartTitle =
    params.chartTab === 'energy-profile'
      ? '【法宝一：大能垒决速步】势能山峰 & 玻尔兹曼分布双图分屏'
      : params.chartTab === 'le-chatelier'
      ? '【法宝二：减弱但不抵消】勒夏特列移动 v-t 速率 & c-t 浓度双图联动'
      : params.chartTab === 'lnk-invt'
      ? '【法宝三：斜率定吸放热】范特霍夫 lnK - 1/T 热力学关系图谱'
      : '【法宝四：定一议二判压强】平衡转化率 α - T - P 双因素图谱'

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-3">
      {/* 顶部探究图谱 Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">{chartTitle}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
            {chemistry.system.name}
          </span>
        </div>
      </div>

      {/* 主视图分屏 Chart 区域 */}
      <div className="flex-1 w-full min-h-0 relative overflow-hidden flex items-center justify-center">
        {params.chartTab === 'energy-profile' && (
          <div className="w-full h-full flex flex-col md:flex-row gap-3 min-h-0 overflow-hidden">
            {/* 左屏 50%：活化能与催化历程势能曲线图 */}
            <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
              <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                反应势能山峰与过渡态 (分步能垒标注)
              </div>
              <div className="flex-1 min-h-0 w-full relative">
                <EnergyProfileChart
                  tsPoints={chemistry.tsPoints}
                  eaForward={chemistry.eaForward}
                  eaReverse={chemistry.eaReverse}
                  deltaH={chemistry.system.deltaH}
                  catalyst={params.catalyst}
                  stepBarriers={chemistry.stepBarriers}
                  rdsIndex={chemistry.rdsIndex}
                />
              </div>
            </div>

            {/* 中间分割线 */}
            <div className="hidden md:block w-px h-full bg-slate-200 shrink-0" />

            {/* 右屏 50%：麦克斯韦-玻尔兹曼能量分布图 */}
            <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
              <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                玻尔兹曼分布与活化分子比例 (基准态双线对照)
              </div>
              <div className="flex-1 min-h-0 w-full relative">
                <BoltzmannDistributionChart
                  boltzmannData={chemistry.boltzmannData}
                  eaForward={chemistry.eaForward}
                  temperature={params.temperature}
                />
              </div>
            </div>
          </div>
        )}

        {params.chartTab === 'le-chatelier' && (
          <div className="w-full h-full flex flex-col md:flex-row gap-3 min-h-0 overflow-hidden">
            {/* 左屏 50%：v - t 反应速率突变图谱 */}
            <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
              <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                反应速率 - 时间 (v - t) 突变图谱
              </div>
              <div className="flex-1 min-h-0 w-full relative">
                <EquilibriumChart
                  forwardPoints={forwardPoints}
                  reversePoints={reversePoints}
                  xDomain={[0, 10]}
                  yDomain={[0, Math.ceil(maxV * 10) / 10]}
                  currentTime={10}
                  markers={perturbMarker}
                  title={`${chemistry.system.name} v - t 突变图`}
                  xLabel="时间 t / s"
                  yLabel="反应速率 v / (mol·L⁻¹·s⁻¹)"
                />
              </div>
            </div>

            {/* 中间分割线 */}
            <div className="hidden md:block w-px h-full bg-slate-200 shrink-0" />

            {/* 右屏 50%：c - t 物质浓度演化图谱 */}
            <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
              <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                物质浓度 - 时间 (c - t) 演化图谱
              </div>
              <div className="flex-1 min-h-0 w-full relative">
                <RelationChart
                  points={reactantConcPoints}
                  additionalSeries={[
                    {
                      points: productConcPoints,
                      label: 'c(产物)',
                      color: CHART_COLORS.compareA,
                      strokeWidth: 2,
                    },
                  ]}
                  xDomain={[0, 10]}
                  yDomain={[0, Math.ceil(maxC * 10) / 10]}
                  cursorX={10}
                  markers={perturbMarker}
                  mainLabel="c(反应物)"
                  color={CHART_COLORS.primary}
                  title={`${chemistry.system.name} c - t 演化图`}
                  xLabel="时间 t / s"
                  yLabel="物质浓度 c / (mol·L⁻¹)"
                />
              </div>
            </div>
          </div>
        )}

        {params.chartTab === 'lnk-invt' && (
          <div className="w-full h-full max-w-4xl mx-auto min-h-0 relative flex items-center justify-center p-2">
            <LnkInvTChart
              vantHoffData={chemistry.vantHoffData}
              temperature={params.temperature}
              deltaH={chemistry.system.deltaH}
            />
          </div>
        )}

        {params.chartTab === 'alpha-tp' && (
          <div className="w-full h-full max-w-4xl mx-auto min-h-0 relative flex items-center justify-center p-2">
            <AlphaTpChart
              alphaTpData={chemistry.alphaTpData}
              temperature={params.temperature}
              pressure={params.pressure}
              deltaH={chemistry.system.deltaH}
              gasMolesDiff={chemistry.system.gasMolesDiff}
            />
          </div>
        )}
      </div>
    </div>
  )
}



