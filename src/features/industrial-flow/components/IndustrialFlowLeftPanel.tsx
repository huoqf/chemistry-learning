/**
 * src/features/industrial-flow/components/IndustrialFlowLeftPanel.tsx
 * 母题七：无机工艺流程与沉淀调 pH 工具 - 左屏控制台 UI
 */

import React from 'react'
import {
  LeftPanel,
  LeftPanelSection,
  ParamControl,
  SegmentedControl,
} from '@/components/UI'
import { RotateCcw, Sparkles, AlertCircle } from 'lucide-react'
import type { IndustrialFlowParams, IndustrialFlowSystemId } from '../types'

interface IndustrialFlowLeftPanelProps {
  params: IndustrialFlowParams
  updateParam: (key: keyof IndustrialFlowParams, value: any) => void
  onReset: () => void
  isPhInSafeRange: boolean
  safePhRange: [number, number]
}

export const IndustrialFlowLeftPanel: React.FC<IndustrialFlowLeftPanelProps> = ({
  params,
  updateParam,
  onReset,
  isPhInSafeRange,
  safePhRange,
}) => {
  const viewOptions = [
    { label: '流程与曲线', value: 0 },
    { label: '规范踩分', value: 1 },
    { label: '高考真题', value: 2 },
  ]

  const systemOptions: { label: string; value: IndustrialFlowSystemId }[] = [
    { label: 'Fe-Al-Mn 锰废渣', value: 'fe-al-mn' },
    { label: 'Fe-Cu-Zn 铜锌渣', value: 'fe-cu-zn' },
    { label: 'Ti-Fe 钛白粉', value: 'ti-fe' },
  ]

  const crushOptions = [
    { label: '粗粒', value: 'coarse' },
    { label: '中等', value: 'medium' },
    { label: '细粉', value: 'fine' },
  ]

  const oxidantOptions = [
    { label: '充分 (Fe³⁺)', value: 'sufficient' },
    { label: '不足 (含Fe²⁺)', value: 'insufficient' },
  ]

  const reagentOptions = [
    { label: 'MnO/MnCO₃', value: 'MnO' },
    { label: 'CuO/Cu(OH)₂', value: 'CuO' },
    { label: 'CaCO₃', value: 'CaCO3' },
    { label: 'NaOH', value: 'NaOH' },
  ]

  return (
    <LeftPanel className="p-4 flex flex-col gap-4 overflow-y-auto">
      {/* 1. 视图模式切换 */}
      <LeftPanelSection title="平行解题视角切换">
        <SegmentedControl
          options={viewOptions}
          value={params.viewMode}
          onChange={(val) => updateParam('viewMode', val)}
        />
      </LeftPanelSection>

      {/* 2. 工艺系统模板 */}
      <LeftPanelSection title="工业流程考题系统">
        <SegmentedControl
          options={systemOptions}
          value={params.systemId}
          onChange={(val) => updateParam('systemId', val)}
        />
      </LeftPanelSection>

      {/* 3. 原料预处理与浸出工序 */}
      <LeftPanelSection title="工序一：酸浸与氧化调控">
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">
              矿石粉碎粒度 (影响接触面积)
            </label>
            <SegmentedControl
              options={crushOptions}
              value={params.crushSize}
              onChange={(val) => updateParam('crushSize', val)}
            />
          </div>

          <ParamControl
            params={[
              {
                key: 'leachTemp',
                label: '酸浸温度',
                value: params.leachTemp,
                min: 20,
                max: 90,
                step: 1,
                unit: '℃',
              },
            ]}
            onParamChange={(key, val) => updateParam(key as keyof IndustrialFlowParams, val)}
          />

          {params.systemId !== 'ti-fe' && (
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">
                H₂O₂ 氧化剂加入量 (Fe²⁺ ➔ Fe³⁺)
              </label>
              <SegmentedControl
                options={oxidantOptions}
                value={params.oxidantAmount}
                onChange={(val) => updateParam('oxidantAmount', val)}
              />
            </div>
          )}
        </div>
      </LeftPanelSection>

      {/* 4. 调 pH 分步沉淀工序 */}
      <LeftPanelSection title="工序二：调 pH 沉淀除杂 (核心考点)">
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">
              调 pH 试剂选择 (遵循“不增杂”原则)
            </label>
            <SegmentedControl
              options={reagentOptions}
              value={params.reagent}
              onChange={(val) => updateParam('reagent', val)}
              cols={2}
            />
          </div>

          <ParamControl
            params={[
              {
                key: 'pH',
                label: '目标调节 pH',
                value: params.pH,
                min: 0,
                max: 14,
                step: 0.1,
                unit: '',
              },
            ]}
            onParamChange={(key, val) => updateParam(key as keyof IndustrialFlowParams, val)}
          />

          {/* pH 安全范围提示卡片 */}
          <div
            className={`p-3 rounded-lg border text-xs flex flex-col gap-1 transition-all ${
              isPhInSafeRange
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1">
                {isPhInSafeRange ? (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                )}
                最佳调 pH 安全区间
              </span>
              <span className="font-mono">
                [{safePhRange[0]} ~ {safePhRange[1]}]
              </span>
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              {isPhInSafeRange
                ? '杂质已完全沉淀，主目标离子尚未沉淀损失！'
                : params.pH < safePhRange[0]
                ? 'pH 偏低：杂质 Fe³⁺/Al³⁺ 尚未完全沉淀！'
                : 'pH 偏高：主离子已开始沉淀损失，或 Al(OH)₃ 两性溶解！'}
            </p>
          </div>
        </div>
      </LeftPanelSection>

      {/* 5. 重置按键 */}
      <button
        onClick={onReset}
        className="w-full py-2.5 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 mt-auto"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        重置参数
      </button>
    </LeftPanel>
  )
}
