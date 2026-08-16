import { LeftPanel, LeftPanelSection, OptionButton } from '@/components/UI'
import { ShieldAlert, ArrowLeftRight, FlaskConical } from 'lucide-react'

import { REAGENT_SCENES } from '../data/reagentData'
import type { ReagentSceneId, ReagentSceneConfig, ReagentStepPoint } from '../types'

export interface ReagentStepLeftPanelProps {
  sceneId: ReagentSceneId
  currentScene: ReagentSceneConfig
  progress: number

  isAirIsolated: boolean
  setIsAirIsolated: (v: boolean) => void
  isReverseTitration: boolean
  setIsReverseTitration: (v: boolean) => void
  isWeakBase: boolean
  setIsWeakBase: (v: boolean) => void

  stepIndex: number
  currentStep: ReagentStepPoint
  handleSceneChange: (id: ReagentSceneId) => void
  handleStepClick: (index: number) => void
}

export function ReagentStepLeftPanel({
  sceneId,
  currentScene,

  isAirIsolated,
  setIsAirIsolated,
  isReverseTitration,
  setIsReverseTitration,
  isWeakBase,
  setIsWeakBase,

  stepIndex,
  handleSceneChange,
  handleStepClick,
}: ReagentStepLeftPanelProps) {
  return (
    <LeftPanel>
      {/* 1. 高考核心母题场景选择 */}
      <LeftPanelSection title="高考核心母题场景" subtitle="点击切换 5 大高频滴加演练专题">
        <div className="flex flex-col gap-2">
          {Object.values(REAGENT_SCENES).map((s) => (
            <OptionButton
              key={s.id}
              selected={sceneId === s.id}
              onClick={() => handleSceneChange(s.id as ReagentSceneId)}
              label={s.title}
              description={s.subtitle}
              variant="preset"
            />
          ))}
        </div>
      </LeftPanelSection>

      {/* 3. 反应关键节点快跳 */}
      <LeftPanelSection title="反应历程节点快跳" subtitle="点击快速定位至反应特征节点">
        <div className="grid grid-cols-2 gap-1.5">
          {currentScene.steps.map((st, idx) => (
            <button
              key={idx}
              onClick={() => handleStepClick(idx)}
              className={`px-2 py-1.5 rounded text-[11px] text-left truncate transition-colors border ${
                stepIndex === idx
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {idx + 1}. {st.title.split('：')[0]}
            </button>
          ))}
        </div>
      </LeftPanelSection>

      {/* 4. 特殊高考实验条件对比开关 */}
      {(currentScene.supportsAirIsolation ||
        currentScene.supportsReverseTitration ||
        currentScene.supportsWeakBase) && (
        <LeftPanelSection title="实验条件对比探究" subtitle="高考延伸考点对比探究开关">
          <div className="flex flex-col gap-2">
            {currentScene.supportsAirIsolation && (
              <button
                onClick={() => setIsAirIsolated(!isAirIsolated)}
                className={`p-2.5 rounded-lg border text-xs text-left flex items-center justify-between transition-colors ${
                  isAirIsolated
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  <span>隔绝空气操作 (长滴管/植物油层)</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  {isAirIsolated ? '已开启' : '关闭'}
                </span>
              </button>
            )}

            {currentScene.supportsReverseTitration && (
              <button
                onClick={() => {
                  setIsWeakBase(false)
                  setIsReverseTitration(!isReverseTitration)
                }}
                className={`p-2.5 rounded-lg border text-xs text-left flex items-center justify-between transition-colors ${
                  isReverseTitration
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
                  <span>反向滴加 (Al³⁺ 滴入 NaOH)</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold">
                  {isReverseTitration ? '反滴模式' : '正滴模式'}
                </span>
              </button>
            )}

            {currentScene.supportsWeakBase && (
              <button
                onClick={() => {
                  setIsReverseTitration(false)
                  setIsWeakBase(!isWeakBase)
                }}
                className={`p-2.5 rounded-lg border text-xs text-left flex items-center justify-between transition-colors ${
                  isWeakBase
                    ? 'bg-sky-50 border-sky-300 text-sky-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-sky-600" />
                  <span>换用弱碱 (一水合氨 NH₃·H₂O)</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold">
                  {isWeakBase ? '弱碱模式' : '强碱模式'}
                </span>
              </button>
            )}
          </div>
        </LeftPanelSection>
      )}
    </LeftPanel>
  )
}
