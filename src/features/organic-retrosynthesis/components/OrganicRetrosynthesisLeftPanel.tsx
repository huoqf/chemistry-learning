import { LeftPanel, LeftPanelSection, SegmentedControl } from '@/components/UI'
import {
  Sparkles,
  ShieldCheck,
  Zap,
  FlaskConical,
} from 'lucide-react'
import type { RetrosynthesisModelId, SynthesisMode, RetrosynthesisModelData, RetrosynthesisStep } from '../types'

interface OrganicRetrosynthesisLeftPanelProps {
  modelId: RetrosynthesisModelId
  onSelectModel: (id: RetrosynthesisModelId) => void
  synthesisMode: SynthesisMode
  onSetSynthesisMode: (mode: SynthesisMode) => void
  viewMode: number
  onSetViewMode: (viewMode: number) => void
  currentModel: RetrosynthesisModelData
  currentStep: RetrosynthesisStep
  currentStepIndex: number
  totalSteps: number
  onStepChange: (stepIndex: number) => void
}

export function OrganicRetrosynthesisLeftPanel({
  modelId,
  onSelectModel,
  synthesisMode,
  onSetSynthesisMode,
  viewMode,
  onSetViewMode,
  currentModel,
  currentStep,
  currentStepIndex,
  onStepChange,
}: OrganicRetrosynthesisLeftPanelProps) {
  const viewOptions = [
    { label: '动画场景', value: 0 },
    { label: '规范踩分', value: 1 },
    { label: '高考真题', value: 2 },
  ]

  const modelOptions = [
    { label: '贝诺酯(酚-OH protection)', value: 'aspirin-benorilate' },
    { label: 'Diels-Alder (缩醛)', value: 'diels-alder-acetal' },
    { label: '双键加溴 protection', value: 'double-bond-protection' },
    { label: 'C-C 键切断与构建', value: 'carbon-carbon-builder' },
  ]

  const modeOptions = [
    { label: '✂ 逆合成切断', value: 'retrosynthetic' },
    { label: '➔ 正向路线', value: 'forward' },
    { label: '🛡 官能团保护', value: 'protection-breakdown' },
  ]

  // 将抽象的 (1/3) 数字替换为具有具体化学语义的步骤导航
  const stepOptions = currentModel.steps.map((st, idx) => ({
    label: `${idx + 1}. ${st.fgiType.split('(')[0].trim()}`,
    value: idx,
  }))

  return (
    <LeftPanel>
      {/* 1. 【顶级】中屏视角模式切换 */}
      <LeftPanelSection title="中屏视角模式">
        <SegmentedControl
          options={viewOptions}
          value={viewMode}
          onChange={(val) => onSetViewMode(val as number)}
        />
      </LeftPanelSection>

      {/* 2. 高考探究模型选择 */}
      <LeftPanelSection title="高考探究模型选择">
        <SegmentedControl
          options={modelOptions}
          value={modelId}
          onChange={(val) => onSelectModel(val as RetrosynthesisModelId)}
        />
      </LeftPanelSection>

      {/* 3. 路线剖析模式与化学分段步骤导航 (仅在动画场景下显示) */}
      {viewMode === 0 && (
        <>
          <LeftPanelSection title="逆合成 / 保护策略模式">
            <SegmentedControl
              options={modeOptions}
              value={synthesisMode}
              onChange={(val) => onSetSynthesisMode(val as SynthesisMode)}
            />
          </LeftPanelSection>

          {/* 具名化学分段步骤选择，彻底替换抽象的 1/3 数字 */}
          <LeftPanelSection title="化学反应历程分步导航">
            <SegmentedControl
              options={stepOptions}
              value={currentStepIndex}
              onChange={(val) => onStepChange(val as number)}
            />
          </LeftPanelSection>

          {/* 当前步骤化学解析卡 */}
          <LeftPanelSection title="当前步化学解析">
            <div className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-slate-200 text-xs shadow-2xs">
              <div className="font-bold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="flex items-center gap-1 text-indigo-900">
                  <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
                  {currentStep.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] border border-emerald-100">
                  {currentStep.atomEconomy}% 利用率
                </span>
              </div>

              <div className="flex flex-col gap-1 text-[11px] text-slate-600">
                <div>
                  <span className="font-semibold text-slate-700">反应物 ➔ 生成物:</span>{' '}
                  <span className="font-mono text-indigo-700 font-medium">
                    {currentStep.reactants.map((r) => r.name).join(' + ')} ➔{' '}
                    {currentStep.products.map((p) => p.name).join(' + ')}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">试剂与条件:</span>{' '}
                  <span className="font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {currentStep.reagents}
                  </span>
                </div>

                {currentStep.protectionStatus.isProtected && (
                  <div className="flex items-center gap-1 text-emerald-700 mt-0.5 font-medium bg-emerald-50/70 p-1.5 rounded border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      {currentStep.protectionStatus.protectedGroup} 已用{' '}
                      {currentStep.protectionStatus.protectingAgent} 保护
                    </span>
                  </div>
                )}

                {currentStep.cutBond && (
                  <div className="flex items-center gap-1 text-red-700 mt-0.5 font-medium bg-red-50/70 p-1.5 rounded border border-red-100">
                    <Zap className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>
                      ✂ 切断: {currentStep.cutBond.bondType} ({currentStep.cutBond.positionDesc})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </LeftPanelSection>
        </>
      )}

      {/* 4. 高考解题口诀 */}
      <LeftPanelSection title="高考解题口诀">
        <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100/80 text-xs text-indigo-950 flex flex-col gap-1">
          <div className="font-bold flex items-center gap-1 text-indigo-900">
            <Sparkles className="w-4 h-4 text-amber-500" />
            解题技巧
          </div>
          <p className="text-[11px] text-indigo-800 leading-relaxed">
            「切断找双键或酯，保护瞄准活泼氢。加加成脱溴用锌粉，缩醛还原酸水解。」
          </p>
        </div>
      </LeftPanelSection>
    </LeftPanel>
  )
}
