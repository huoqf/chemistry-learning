/**
 * src/features/industrial-flow/components/IndustrialFlowCenterView.tsx
 * 实验二：无机工艺流程与沉淀调 pH 工具 - 中屏平行视图 UI (高考标准规范版)
 * 方向 B：工序联动下钻，宏观工艺流程 ➔ 槽体微观机理深度穿透
 */

import React from 'react'
import { BaseChart } from '@/components/Chart'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { Activity, ShieldCheck, AlertTriangle, Layers, Thermometer, Filter } from 'lucide-react'
import { AnimatedFlowchartCard } from './AnimatedFlowchartCard'
import {
  SvgCurveRenderer,
  LeachKineticRenderer,
  OxidationWindowRenderer,
  SolubilityCrystallizeRenderer,
} from './IndustrialFlowStepRenderers'
import type { IndustrialFlowParams, IndustrialFlowChemistry } from '../types'
import type { ModelQuizData } from '@/data/quiz'

interface IndustrialFlowCenterViewProps {
  params: IndustrialFlowParams
  chemistry: IndustrialFlowChemistry
  quizData?: ModelQuizData
  updateParam: (key: keyof IndustrialFlowParams, value: any) => void
}

export const IndustrialFlowCenterView: React.FC<IndustrialFlowCenterViewProps> = ({
  params,
  chemistry,
  quizData,
  updateParam,
}) => {
  const { viewMode, pH, systemId, leachTemp, crushSize, oxidantAmount } = params
  const {
    ions,
    safePhRange,
    isPhInSafeRange,
    hasSafeRange,
    curveData,
    leachCurveData,
    solubilityCurveData,
    leachRate,
    isOxidized,
    activeStepInfo,
  } = chemistry

  const activeStep = params.activeStep || 3
  // 1. 视角 1: 规范踩分卡
  if (viewMode === 1) {
    return (
      <div className="w-full h-full flex flex-col p-4 bg-slate-50 overflow-y-auto">
        <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-500" />
          无机工艺流程大题 · 规范踩分模板与标准表达
        </h3>
        {quizData?.scoringSteps && quizData.scoringSteps.length > 0 ? (
          <ScoringCardSection steps={quizData.scoringSteps} />
        ) : (
          <div className="p-4 bg-white rounded-lg border text-xs text-slate-500">
            暂无踩分卡数据
          </div>
        )}
      </div>
    )
  }

  // 2. 视角 2: 变式演练
  if (viewMode === 2) {
    return (
      <div className="w-full h-full flex flex-col p-4 bg-slate-50 overflow-y-auto">
        <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          无机工艺流程与沉淀调 pH · 考点变式拆解
        </h3>
        {quizData?.variantQuizzes && quizData.variantQuizzes.length > 0 ? (
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        ) : (
          <div className="p-4 bg-white rounded-lg border text-xs text-slate-500">
            暂无变式演练数据
          </div>
        )}
      </div>
    )
  }

  // 3. 视角 0: 宏观工艺流程全景 ➔ 槽体微观机理下钻
  return (
    <div className="w-full h-full flex flex-col bg-slate-50 p-2.5 gap-2.5 overflow-hidden select-none">
      {/* 上半部分：高考标准方框工艺流程图（独立子组件承载 60fps 流向动画，避免重绘下方图表） */}
      <AnimatedFlowchartCard
        active={viewMode === 0}
        systemId={systemId}
        activeStep={activeStep}
        focusTitle={activeStepInfo.title}
        onSelectStep={(step) => updateParam('activeStep', step)}
        chemistry={chemistry}
        pH={pH}
      />

      {/* 下半部分：当前选定反应槽的微观机理放大镜 */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-3 flex flex-col min-h-0 relative shadow-xs">
        {/* 微观下钻头部导航 */}
        <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200 flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-600" />
              槽体微观机理下钻
            </span>
            <h4 className="font-bold text-xs text-slate-800 truncate">
              {activeStepInfo.title}
            </h4>
          </div>

          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
            {activeStepInfo.focusSubject}
          </span>
        </div>

        {/* 核心微观可视化区域：根据 activeStep 动态呈现 */}
        <div className="flex-1 w-full min-h-0 relative">
          {activeStep === 3 ? (
            <BaseChart
              xDomain={[0, 14]}
              yDomain={[-12, 0]}
              xLabel="溶液 pH"
              yLabel=""
              showGrid={true}
            >
              <SvgCurveRenderer
                curveData={curveData}
                ions={ions}
                pH={pH}
                safePhRange={safePhRange}
              />
            </BaseChart>
          ) : activeStep === 1 ? (
            <BaseChart
              xDomain={[20, 90]}
              yDomain={[0, 100]}
              xLabel="浸出温度 (℃)"
              yLabel="浸出率 (%)"
              showGrid={true}
            >
              <LeachKineticRenderer
                leachCurveData={leachCurveData}
                currentTemp={leachTemp}
                currentLeachRate={leachRate}
                crushSize={crushSize}
              />
            </BaseChart>
          ) : activeStep === 2 ? (
            <OxidationWindowRenderer
              systemId={systemId}
              isOxidized={isOxidized}
              oxidantAmount={oxidantAmount}
              hasSafeRange={hasSafeRange}
              safeRangeWidth={Math.max(0, safePhRange[1] - safePhRange[0])}
              targetPrecipPh={ions.find((i) => chemistry.targetIon.includes(i.symbol))?.pHStart ?? safePhRange[1]}
            />
          ) : (
            <BaseChart
              xDomain={[0, 100]}
              yDomain={systemId === 'li-fe-p' ? [0, 50] : [0, 120]}
              xLabel="溶液温度 (℃)"
              yLabel="溶解度 (g / 100g 水)"
              showGrid={true}
            >
              <SolubilityCrystallizeRenderer
                solubilityCurveData={solubilityCurveData}
                systemId={systemId}
              />
            </BaseChart>
          )}
        </div>

        {/* 底部状态条与考点提示 */}
        <div className="mt-1 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">工序设问焦点:</span>
            <span className="text-slate-800 font-medium truncate max-w-[480px]">
              {activeStepInfo.coreQuestion}
            </span>
          </div>

          {activeStep === 3 && (
            <div
              className={`font-semibold flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                isPhInSafeRange
                  ? 'bg-emerald-100 text-emerald-800'
                  : !hasSafeRange
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isPhInSafeRange ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  最佳分离 pH [{safePhRange[0]} ~ {safePhRange[1]}]
                </>
              ) : !hasSafeRange ? (
                <>
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  无安全分离区间 (曲线重叠共沉淀)
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  偏离分离 pH [{safePhRange[0]} ~ {safePhRange[1]}]
                </>
              )}
            </div>
          )}

          {activeStep === 1 && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              <Thermometer className="w-3 h-3 text-indigo-600" />
              当前温度: {leachTemp}℃ · 浸出率: {leachRate.toFixed(1)}%
            </div>
          )}

          {activeStep === 4 && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
              <Filter className="w-3 h-3 text-amber-600" />
              {systemId === 'li-fe-p'
                ? '推荐操作：90℃ 高温沉淀 Li₂CO₃ ➔ 趁热过滤收集晶体并用热水洗涤'
                : systemId === 'fe-al-mn'
                ? '推荐操作：蒸发浓缩 (>80℃) 结晶 MnSO₄·H₂O ➔ 趁热过滤并用无水乙醇洗涤'
                : systemId === 'al-fe-si'
                ? '推荐操作：过滤洗涤 Al(OH)₃ ➔ 高温煅烧脱除结晶水制 Al₂O₃'
                : '推荐操作：趁热过滤除去高溶解度/不溶杂质 ➔ 冷却结晶析出主产品'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
