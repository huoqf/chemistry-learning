/**
 * src/features/electrochemical-twin/components/ElectrochemicalTwinLeftPanel.tsx
 * 左屏控制台：模型探究模式选择、充放电切换、交换膜类型、电流与反应时间控制
 */

import React from 'react'
import { LeftPanel, LeftPanelSection, ParamControl } from '@/components/UI'
import type { ElectrochemicalParams } from '../types'

interface Props {
  params: ElectrochemicalParams
  onChange: <K extends keyof ElectrochemicalParams>(key: K, value: ElectrochemicalParams[K]) => void
}

export const ElectrochemicalTwinLeftPanel: React.FC<Props> = ({ params, onChange }) => {
  const paramConfigs = [
    {
      key: 'currentAmp',
      label: '电流强度 I',
      min: 0.1,
      max: 5.0,
      step: 0.1,
      unit: 'A',
      value: params.currentAmp,
    },
    {
      key: 'timeSec',
      label: '反应时间 t',
      min: 5,
      max: 120,
      step: 5,
      unit: 's',
      value: params.timeSec,
    },
    {
      key: 'electrolyteConc',
      label: '电解质初始浓度 c₀',
      min: 0.1,
      max: 2.0,
      step: 0.1,
      unit: 'mol/L',
      value: params.electrolyteConc,
    },
  ]

  const handleParamChange = (key: string, val: number) => {
    onChange(key as keyof ElectrochemicalParams, val)
  }

  return (
    <LeftPanel>
      {/* 1. 模型选择区 */}
      <LeftPanelSection title="解题模型探究">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-600">选择母题模型</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: '① 经典双池', value: 0 },
              { label: '② 蓄电池充放', value: 1 },
              { label: '③ 膜法电解', value: 2 },
              { label: '④ 定量计算', value: 3 },
            ].map(item => (
              <button
                key={item.value}
                onClick={() => onChange('mode', item.value)}
                className={`py-1.5 px-2 text-xs rounded border transition-colors text-left ${
                  params.mode === item.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </LeftPanelSection>

      {/* 2. 蓄电池充放电切换 (仅在 mode === 1 时显示) */}
      {params.mode === 1 && (
        <LeftPanelSection title="充放电工作状态">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChange('batteryState', 0)}
              className={`py-2 px-3 text-xs rounded-md border flex flex-col items-center gap-1 transition-all ${
                params.batteryState === 0
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>⚡ 放电模式</span>
              <span className="text-[10px] text-emerald-600 font-normal">原电池 (化学能→电能)</span>
            </button>

            <button
              onClick={() => onChange('batteryState', 1)}
              className={`py-2 px-3 text-xs rounded-md border flex flex-col items-center gap-1 transition-all ${
                params.batteryState === 1
                  ? 'bg-amber-50 border-amber-500 text-amber-700 font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>🔌 充电模式</span>
              <span className="text-[10px] text-amber-600 font-normal">电解池 (电能→化学能)</span>
            </button>
          </div>
        </LeftPanelSection>
      )}

      {/* 3. 交换膜类型选择 (仅在 mode === 2 时高亮) */}
      {params.mode === 2 && (
        <LeftPanelSection title="离子交换膜类型">
          <div className="flex flex-col gap-1.5">
            {[
              { label: '多孔隔膜 / 盐桥', sub: '无选择性透膜', val: 0 },
              { label: '阳离子交换膜', sub: '只透 Na⁺ / H⁺ / Zn²⁺', val: 1 },
              { label: '阴离子交换膜', sub: '只透 Cl⁻ / SO₄²⁻', val: 2 },
              { label: '双极膜 (BPM)', sub: '催化 H₂O 产生 H⁺ + OH⁻', val: 3 },
            ].map(m => (
              <button
                key={m.val}
                onClick={() => onChange('membraneType', m.val)}
                className={`py-1.5 px-2.5 text-xs rounded border text-left flex justify-between items-center transition-colors ${
                  params.membraneType === m.val
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{m.label}</span>
                <span className="text-[10px] text-slate-400">{m.sub}</span>
              </button>
            ))}
          </div>
        </LeftPanelSection>
      )}

      {/* 4. 数值调控参数 (使用标准 ParamControl) */}
      <LeftPanelSection title="实验参数控制">
        <ParamControl params={paramConfigs} onParamChange={handleParamChange} />
      </LeftPanelSection>

      {/* 5. 辅助视图开关 */}
      <LeftPanelSection title="辅助图例与微粒导向">
        <div className="flex flex-col gap-2">
          <label className="flex items-center justify-between text-xs text-slate-600 cursor-pointer">
            <span>电子流向 (外电路 e⁻)</span>
            <input
              type="checkbox"
              checked={params.showElectrons === 1}
              onChange={e => onChange('showElectrons', e.target.checked ? 1 : 0)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between text-xs text-slate-600 cursor-pointer">
            <span>溶液离子迁移 (阴/阳离子)</span>
            <input
              type="checkbox"
              checked={params.showIons === 1}
              onChange={e => onChange('showIons', e.target.checked ? 1 : 0)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between text-xs text-slate-600 cursor-pointer">
            <span>膜穿透细节高亮</span>
            <input
              type="checkbox"
              checked={params.showMembraneFlow === 1}
              onChange={e => onChange('showMembraneFlow', e.target.checked ? 1 : 0)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
          </label>
        </div>
      </LeftPanelSection>
    </LeftPanel>
  )
}
