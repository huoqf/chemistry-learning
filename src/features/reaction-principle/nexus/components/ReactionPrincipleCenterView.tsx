import React, { useState } from 'react'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { EquilibriumChart } from '@/components/Chart'
import { EnergyProfileChart } from './EnergyProfileChart'
import { BoltzmannDistributionChart } from './BoltzmannDistributionChart'
import { LnkInvTChart } from './LnkInvTChart'
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
  const [subTab, setSubTab] = useState<'chart1' | 'chart2'>('chart1')

  // 1. 视角 1：规范踩分
  if (viewMode === 1) {
    return (
      <div className="w-full h-full flex flex-col p-4 bg-white overflow-y-auto">
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
      <div className="w-full h-full flex flex-col p-4 bg-white overflow-y-auto">
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

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-slate-50 border border-slate-200/80 rounded-lg p-3">
      {/* 顶部探究图谱卡片 Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">
            {params.chartTab === 'energy-profile'
              ? '活化能与催化历程势能山峰'
              : params.chartTab === 'le-chatelier'
              ? '勒夏特列移动 v-t & c-t 速率与浓度双图联动'
              : '范特霍夫 lnK - 1/T 热力学关系图谱'}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
            {chemistry.system.name}
          </span>
        </div>

        {params.chartTab === 'le-chatelier' && (
          <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded text-[11px] font-semibold">
            <button
              onClick={() => setSubTab('chart1')}
              className={`px-2.5 py-1 rounded transition-colors ${
                subTab === 'chart1' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              v - t 反应速率图
            </button>
            <button
              onClick={() => setSubTab('chart2')}
              className={`px-2.5 py-1 rounded transition-colors ${
                subTab === 'chart2' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              c - t 浓度变化图
            </button>
          </div>
        )}
      </div>

      {/* 主视图 Canvas/Chart 区域 */}
      <div className="flex-1 w-full min-h-0 relative bg-white rounded border border-slate-200 p-2 overflow-hidden flex items-center justify-center">
        {params.chartTab === 'energy-profile' && (
          <div className="w-full h-full flex flex-col md:flex-row gap-2">
            <div className="flex-1 h-full min-w-0">
              <EnergyProfileChart
                tsPoints={chemistry.tsPoints}
                eaForward={chemistry.eaForward}
                eaReverse={chemistry.eaReverse}
                deltaH={chemistry.system.deltaH}
                catalyst={params.catalyst}
              />
            </div>
            <div className="w-full md:w-[280px] h-full shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pl-2">
              <BoltzmannDistributionChart
                boltzmannData={chemistry.boltzmannData}
                eaForward={chemistry.eaForward}
                temperature={params.temperature}
              />
            </div>
          </div>
        )}

        {params.chartTab === 'le-chatelier' && (
          <div className="w-full h-full">
            {subTab === 'chart1' ? (
              <EquilibriumChart
                forwardPoints={forwardPoints}
                reversePoints={reversePoints}
                xDomain={[0, 10]}
                currentTime={10}
                title={`${chemistry.system.name} 反应速率 - 时间 (v - t) 突变图谱`}
                xLabel="时间 t / s"
                yLabel="反应速率 v / (mol·L⁻¹·s⁻¹)"
              />
            ) : (
              <EquilibriumChart
                forwardPoints={reactantConcPoints}
                reversePoints={productConcPoints}
                xDomain={[0, 10]}
                currentTime={10}
                title={`${chemistry.system.name} 物质浓度 - 时间 (c - t) 演化图谱`}
                xLabel="时间 t / s"
                yLabel="物质浓度 c / (mol·L⁻¹)"
              />
            )}
          </div>
        )}

        {params.chartTab === 'lnk-invt' && (
          <div className="w-full h-full">
            <LnkInvTChart
              vantHoffData={chemistry.vantHoffData}
              temperature={params.temperature}
              deltaH={chemistry.system.deltaH}
            />
          </div>
        )}
      </div>
    </div>
  )
}
