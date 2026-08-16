import React from 'react'
import {
  LeftPanel,
  LeftPanelSection,
  Slider,
  SegmentedControl,
  Button,
} from '@/components/UI'
import type { ChartTabMode, SystemReactionId, CatalystType, NexusParams } from '../types'

interface ReactionPrincipleLeftPanelProps {
  params: NexusParams
  onUpdateParams: (updated: Partial<NexusParams>) => void
  onReset: () => void
}

export const ReactionPrincipleLeftPanel: React.FC<ReactionPrincipleLeftPanelProps> = ({
  params,
  onUpdateParams,
  onReset,
}) => {
  return (
    <LeftPanel>
      {/* 视图图谱类型 */}
      <LeftPanelSection title="探究图谱选择">
        <SegmentedControl
          options={[
            { label: '活化能/历程', value: 'energy-profile' },
            { label: '勒夏特列/双图', value: 'le-chatelier' },
            { label: 'lnK - 1/T', value: 'lnk-invt' },
          ]}
          value={params.chartTab}
          onChange={(val) => onUpdateParams({ chartTab: val as ChartTabMode })}
        />
      </LeftPanelSection>

      {/* 反应体系选择 */}
      <LeftPanelSection title="反应体系选择">
        <SegmentedControl
          options={[
            { label: '2NO₂ ⇌ N₂O₄', value: 'no2-n2o4' },
            { label: '合成氨 N₂+3H₂', value: 'nh3-synthesis' },
            { label: '甲醇合成', value: 'methanol-synthesis' },
          ]}
          value={params.reactionId}
          onChange={(val) => onUpdateParams({ reactionId: val as SystemReactionId })}
        />
      </LeftPanelSection>

      {/* 催化剂选择 */}
      <LeftPanelSection title="催化剂路径选择">
        <SegmentedControl
          options={[
            { label: '无催化剂', value: 'none' },
            { label: '催化剂 A (单步)', value: 'catalyst-a' },
            { label: '催化剂 B (多步)', value: 'catalyst-b' },
          ]}
          value={params.catalyst}
          onChange={(val) => onUpdateParams({ catalyst: val as CatalystType })}
        />
      </LeftPanelSection>

      {/* 外界条件控制参数 */}
      <LeftPanelSection title="外界物理条件">
        <div className="flex flex-col gap-3">
          <Slider
            label="体系温度 T / K"
            value={params.temperature}
            min={250}
            max={600}
            step={5}
            unit="K"
            onChange={(val: number) => onUpdateParams({ temperature: val })}
          />

          <Slider
            label="体系压强 P / atm"
            value={params.pressure}
            min={0.5}
            max={5.0}
            step={0.1}
            unit="atm"
            onChange={(val: number) => onUpdateParams({ pressure: val })}
          />

          {params.chartTab === 'le-chatelier' && (
            <>
              <Slider
                label="突变增加反应物浓度"
                value={params.addedReactant}
                min={0}
                max={2.0}
                step={0.1}
                unit="mol/L"
                onChange={(val: number) => onUpdateParams({ addedReactant: val })}
              />

              <div className="mt-2">
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  充入惰性气体 (He)
                </label>
                <SegmentedControl
                  options={[
                    { label: '无', value: 'none' },
                    { label: '恒容(不移动)', value: 'constant-v' },
                    { label: '恒压(减压移动)', value: 'constant-p' },
                  ]}
                  value={params.inertGasMode}
                  onChange={(val) =>
                    onUpdateParams({
                      inertGasMode: val as 'none' | 'constant-v' | 'constant-p',
                    })
                  }
                />
              </div>
            </>
          )}
        </div>
      </LeftPanelSection>

      {/* 操作按钮 */}
      <LeftPanelSection title="操作与重置">
        <Button variant="secondary" className="w-full" onClick={onReset}>
          重置参数与时间轴
        </Button>
      </LeftPanelSection>
    </LeftPanel>
  )
}
