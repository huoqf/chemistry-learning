import { LeftPanel, LeftPanelSection, SegmentedControl } from '@/components/UI'
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import type {
  RetrosynthesisModelId,
  SynthesisMode,
  RetrosynthesisModelData,
} from '../types'

interface OrganicRetrosynthesisLeftPanelProps {
  modelId: RetrosynthesisModelId
  onSelectModel: (id: RetrosynthesisModelId) => void
  synthesisMode: SynthesisMode
  onSetSynthesisMode: (mode: SynthesisMode) => void
  currentModel: RetrosynthesisModelData
  currentStepIndex: number
  onStepChange: (stepIndex: number) => void
  showCrashContrast: boolean
  onToggleCrashContrast: () => void
}

export function OrganicRetrosynthesisLeftPanel({
  modelId,
  onSelectModel,
  synthesisMode,
  onSetSynthesisMode,
  currentModel,
  currentStepIndex,
  onStepChange,
  showCrashContrast,
  onToggleCrashContrast,
}: OrganicRetrosynthesisLeftPanelProps) {
  // 4 大高考核心母题模型列表
  const modelList: Array<{
    id: RetrosynthesisModelId
    name: string
    sub: string
    badge: string
  }> = [
    {
      id: 'aspirin-benorilate',
      name: '贝诺酯合成与酚-OH保护',
      sub: '酯键切断 · 酰化保护',
      badge: '双药合一',
    },
    {
      id: 'diels-alder-acetal',
      name: 'Diels-Alder 环加成与缩醛',
      sub: '[4+2]环化 · 耐强还原',
      badge: '六元碳环',
    },
    {
      id: 'double-bond-protection',
      name: '双键加溴保护与Zn脱溴',
      sub: '加溴消除 · 消去复原',
      badge: '抗氧化/碱',
    },
    {
      id: 'carbon-carbon-builder',
      name: 'C-C 键构建 (羟醛缩合)',
      sub: '双键切断 · 碳链增长',
      badge: 'Aldol 缩合',
    },
  ]

  const modeOptions = [
    { label: '✂ 逆合成', value: 'retrosynthetic' },
    { label: '➔ 正向', value: 'forward' },
    { label: '🛡 保护', value: 'protection-breakdown' },
  ]

  return (
    <LeftPanel className="p-3 gap-3 overflow-hidden w-full max-w-full">
      {/* 1. 探究模型选择 */}
      <LeftPanelSection title="高考探究模型" className="p-3 overflow-hidden max-w-full">
        <div className="flex flex-col gap-1.5 w-full">
          {modelList.map((item) => {
            const isSelected = item.id === modelId
            return (
              <button
                key={item.id}
                onClick={() => onSelectModel(item.id)}
                className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between gap-2 cursor-pointer active:scale-[0.99] overflow-hidden ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 shadow-2xs ring-1 ring-indigo-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className={`text-[12px] font-bold truncate leading-tight ${
                      isSelected ? 'text-indigo-950' : 'text-slate-800'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate mt-0.5">
                    {item.sub}
                  </span>
                </div>
                <span
                  className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono font-semibold shrink-0 ${
                    isSelected
                      ? 'bg-indigo-100/80 text-indigo-800 border border-indigo-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            )
          })}
        </div>
      </LeftPanelSection>

      {/* 2. 反应历程与策略演练 */}
      <LeftPanelSection title="反应历程与策略控制" className="p-3 overflow-hidden max-w-full">
        <div className="flex flex-col gap-3 w-full">
          {/* 策略模式分段器 */}
          <div>
            <div className="text-[11px] font-medium text-slate-500 mb-1.5">剖析策略视角</div>
            <SegmentedControl
              options={modeOptions}
              value={synthesisMode}
              onChange={(val) => onSetSynthesisMode(val as SynthesisMode)}
            />
          </div>

          {/* 步骤导航条 */}
          <div>
            <div className="text-[11px] font-medium text-slate-500 mb-1.5">历程分步演练</div>
            <div className="flex flex-col gap-1 w-full">
              {currentModel.steps.map((st, idx) => {
                const isActive = idx === currentStepIndex
                const isCompleted = idx < currentStepIndex
                return (
                  <button
                    key={idx}
                    onClick={() => onStepChange(idx)}
                    className={`w-full p-2.5 rounded-lg text-left border transition-all flex items-center justify-between gap-2 cursor-pointer active:scale-[0.99] overflow-hidden ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-700 text-white shadow-2xs font-bold'
                        : isCompleted
                        ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {isActive ? (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span className="text-[11.5px] truncate">
                        {st.fgiType.split('(')[0].trim()}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                        isActive
                          ? 'bg-indigo-700/90 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      Step {idx + 1}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 🚨 未保护副反应风险对比开关 */}
          <button
            onClick={onToggleCrashContrast}
            className={`w-full py-2 px-2.5 rounded-lg text-[11px] font-bold flex items-center justify-between border transition-all cursor-pointer ${
              showCrashContrast
                ? 'bg-red-600 text-white border-red-700 shadow-xs'
                : 'bg-red-50/80 text-red-700 hover:bg-red-100 border-red-200'
            }`}
          >
            <span className="flex items-center gap-1.5 truncate">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {showCrashContrast ? '已开启副反应风险对比' : '🚨 未保护副反应风险对比'}
            </span>
            <span className="text-[10px] underline shrink-0">
              {showCrashContrast ? '收起' : '展开'}
            </span>
          </button>
        </div>
      </LeftPanelSection>
    </LeftPanel>
  )
}
