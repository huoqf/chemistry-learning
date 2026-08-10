import React from 'react'
import {
  LeftPanel,
  LeftPanelSection,
  OptionButton,
  SegmentedControl,
  ToggleSwitch,
} from '@/components/UI'
import type { DisplayMode } from '../types'
import { VSEPR_MOLECULE_LIST } from '../data/vseprData'

interface VseprLeftPanelProps {
  selectedMoleculeId: string
  onSelectMoleculeId: (id: string) => void
  displayMode: DisplayMode
  onChangeDisplayMode: (mode: DisplayMode) => void
  showAngleAnnotation: boolean
  onToggleAngleAnnotation: (show: boolean) => void
  showSpaceFilling: boolean
  onToggleSpaceFilling: (show: boolean) => void
}

/**
 * VSEPR 3D 几何工具左屏控制面板 (全量使用组件库，无下拉列表)
 */
export const VseprLeftPanel: React.FC<VseprLeftPanelProps> = ({
  selectedMoleculeId,
  onSelectMoleculeId,
  displayMode,
  onChangeDisplayMode,
  showAngleAnnotation,
  onToggleAngleAnnotation,
  showSpaceFilling,
  onToggleSpaceFilling,
}) => {
  // 分组定义高考必考微粒
  const abGroup = VSEPR_MOLECULE_LIST.filter(m => m.category === 'AB2' || m.category === 'AB3' || m.category === 'AB4')
  const ionGroup = VSEPR_MOLECULE_LIST.filter(m => m.category === 'Ion')
  const expandedGroup = VSEPR_MOLECULE_LIST.filter(m => m.category === 'Expanded')

  const displayModeOptions = [
    { label: '⚾ 分子实际构型', value: 'ball_stick' },
    { label: '☁️ VSEPR 模型', value: 'vsepr_cloud' },
    { label: '🔮 杂化 Lobes', value: 'hybrid_orbital' },
    { label: '⚡ 静电排斥', value: 'repulsion_demo' },
  ]

  return (
    <LeftPanel>
      {/* 1. 分类选择高考目标微粒 (OptionButton 网格平铺，完全取消下拉列表) */}
      <LeftPanelSection title="高考必考分子/离子选择">
        <div className="space-y-3">
          {/* A. 常见分子组 */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">常见分子 (AB₂ / AB₃ / AB₄)</span>
            <div className="grid grid-cols-3 gap-1.5">
              {abGroup.map(m => (
                <OptionButton
                  key={m.id}
                  label={`${m.formula}`}
                  description={m.name}
                  selected={selectedMoleculeId === m.id}
                  onClick={() => onSelectMoleculeId(m.id)}
                />
              ))}
            </div>
          </div>

          {/* B. 高频高考离子组 */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">高频高考离子</span>
            <div className="grid grid-cols-2 gap-1.5">
              {ionGroup.map(m => (
                <OptionButton
                  key={m.id}
                  label={`${m.formula}`}
                  description={m.name}
                  selected={selectedMoleculeId === m.id}
                  onClick={() => onSelectMoleculeId(m.id)}
                />
              ))}
            </div>
          </div>

          {/* C. 选考拓展超价分子 */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">拓展超价分子</span>
            <div className="grid grid-cols-2 gap-1.5">
              {expandedGroup.map(m => (
                <OptionButton
                  key={m.id}
                  label={`${m.formula}`}
                  description={m.name}
                  selected={selectedMoleculeId === m.id}
                  onClick={() => onSelectMoleculeId(m.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </LeftPanelSection>

      {/* 2. 3D 观察模式分段切片 (使用 SegmentedControl 组件) */}
      <LeftPanelSection title="3D 观察模式透视">
        <SegmentedControl
          options={displayModeOptions}
          value={displayMode}
          onChange={val => onChangeDisplayMode(val as DisplayMode)}
        />
      </LeftPanelSection>

      {/* 3. 视觉图示开关 (使用 ToggleSwitch 组件) */}
      <LeftPanelSection title="视觉辅助开关">
        <div className="space-y-3">
          <ToggleSwitch
            label="3D 键角弧线与测量标示"
            checked={showAngleAnnotation}
            onChange={onToggleAngleAnnotation}
          />
          <ToggleSwitch
            label="切换比例/空间填充模型"
            checked={showSpaceFilling}
            onChange={onToggleSpaceFilling}
          />
        </div>
      </LeftPanelSection>

      {/* 4. 键角递减快捷对比组 */}
      <LeftPanelSection title="键角压缩高频对比">
        <div className="text-[11px] text-slate-600 space-y-1.5">
          <p className="font-semibold text-slate-700">孤电子对增多导致键角压缩：</p>
          <div className="grid grid-cols-3 gap-1">
            <OptionButton
              label="CH₄"
              description="109.5°"
              selected={selectedMoleculeId === 'ch4'}
              onClick={() => onSelectMoleculeId('ch4')}
            />
            <OptionButton
              label="NH₃"
              description="107.3°"
              selected={selectedMoleculeId === 'nh3'}
              onClick={() => onSelectMoleculeId('nh3')}
            />
            <OptionButton
              label="H₂O"
              description="104.5°"
              selected={selectedMoleculeId === 'h2o'}
              onClick={() => onSelectMoleculeId('h2o')}
            />
          </div>
        </div>
      </LeftPanelSection>
    </LeftPanel>
  )
}
