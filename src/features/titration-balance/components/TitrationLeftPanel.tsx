/**
 * src/features/titration-balance/components/TitrationLeftPanel.tsx
 * 滴定突跃与离子浓度排序解题工具 - 左屏控制台 UI Component
 */

import { useMemo } from 'react'
import { LeftPanel, LeftPanelSection, SegmentedControl, ParamControl, Button } from '@/components/UI'
import type { TitrationParams, TitrationSystemType, IndicatorType } from '../types'
import { Zap, RotateCcw } from 'lucide-react'

export interface TitrationLeftPanelProps {
  params: TitrationParams
  updateParam: (key: keyof TitrationParams, value: any) => void
  onReset: () => void
}

export function TitrationLeftPanel({
  params,
  updateParam,
  onReset,
}: TitrationLeftPanelProps) {
  const systemOptions = useMemo(
    () => [
      { label: 'NaOH 滴定 CH₃COOH (弱酸)', value: 'strongBaseWeakAcid' },
      { label: 'HCl 滴定 NH₃·H₂O (弱碱)', value: 'strongAcidWeakBase' },
      { label: 'NaOH 滴定 HCl (强强)', value: 'strongBaseStrongAcid' },
    ],
    []
  )

  const indicatorOptions = useMemo(
    () => [
      { label: '无指示剂', value: 'none' },
      { label: '酚酞 (8.2-10.0)', value: 'phenolphthalein' },
      { label: '甲基橙 (3.1-4.4)', value: 'methylOrange' },
    ],
    []
  )

  const paramConfigs = useMemo(() => {
    const list = [
      {
        key: 'vRatio',
        label: '滴定比例 (V / Veq)',
        value: params.vRatio,
        min: 0,
        max: 2.0,
        step: 0.01,
        unit: 'Veq',
      },
    ]

    if (params.systemType !== 'strongBaseStrongAcid') {
      list.push({
        key: 'pKa',
        label: '解离常数 (pKa / pKb)',
        value: params.pKa,
        min: 3.5,
        max: 5.5,
        step: 0.1,
        unit: '',
      })
    }

    return list
  }, [params.vRatio, params.pKa, params.systemType])

  return (
    <LeftPanel>
      <LeftPanelSection title="滴定体系选择">
        <div className="flex flex-col gap-1.5">
          {systemOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam('systemType', opt.value as TitrationSystemType)}
              className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all flex items-center justify-between ${
                params.systemType === opt.value
                  ? 'bg-amber-500/10 border-amber-500 text-amber-900 font-bold shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{opt.label}</span>
              {params.systemType === opt.value && <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
            </button>
          ))}
        </div>
      </LeftPanelSection>

      <LeftPanelSection title="高考选择题关键解题节点">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={params.vRatio === 0 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => updateParam('vRatio', 0)}
          >
            起点 (V=0)
          </Button>
          <Button
            variant={Math.abs(params.vRatio - 0.5) < 0.05 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => updateParam('vRatio', 0.5)}
          >
            半中和点 (0.5Veq)
          </Button>
          <Button
            variant={Math.abs(params.vRatio - 1.0) < 0.05 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => updateParam('vRatio', 1.0)}
          >
            计量点 (1.0Veq)
          </Button>
          <Button
            variant={Math.abs(params.vRatio - 1.5) < 0.05 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => updateParam('vRatio', 1.5)}
          >
            碱过量点 (1.5Veq)
          </Button>
        </div>
      </LeftPanelSection>

      <LeftPanelSection title="滴定进度与常数调节">
        <ParamControl
          params={paramConfigs}
          onParamChange={(key, val) => updateParam(key as keyof TitrationParams, val)}
        />
      </LeftPanelSection>

      <LeftPanelSection title="滴定指示剂">
        <div className="flex flex-col gap-2">
          <SegmentedControl
            options={indicatorOptions}
            value={params.indicator}
            onChange={(v) => updateParam('indicator', v as IndicatorType)}
          />
        </div>
      </LeftPanelSection>

      <LeftPanelSection title="重置演练">
        <Button variant="secondary" onClick={onReset} className="w-full">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          重置参数
        </Button>
      </LeftPanelSection>
    </LeftPanel>
  )
}
