import React from 'react'
import { LeftPanel, ControlPanel } from '@/components/UI'
import type { ControlMeta } from '@/data/types'
import type { HessLawParams, HessTabMode } from '../types'
import { HESS_PRESETS, BOND_PRESETS } from '../hooks/useHessLawChemistry'

interface HessLawLeftPanelProps {
  params: HessLawParams
  onUpdateParams: (updated: Partial<HessLawParams>) => void
  onReset: () => void
}

const MODE_MAP: HessTabMode[] = ['hess-overlay', 'bond-energy', 'energy-profile']

const COEFF_MARKS = [
  { value: -2, label: '-2' },
  { value: -1, label: '-1' },
  { value: -0.5, label: '-0.5' },
  { value: 0, label: '0' },
  { value: 0.5, label: '+0.5' },
  { value: 1, label: '+1' },
  { value: 2, label: '+2' },
]

export const HessLawLeftPanel: React.FC<HessLawLeftPanelProps> = ({
  params,
  onUpdateParams,
  onReset,
}) => {
  const modeIndex = MODE_MAP.indexOf(params.mode) >= 0 ? MODE_MAP.indexOf(params.mode) : 0

  const controlMetas: ControlMeta[] = [
    {
      type: 'segmented',
      key: 'modeVal',
      label: '母题九核心模块探究',
      group: '热化学三域',
      options: [
        { label: '盖斯定律叠加', value: 0 },
        { label: '微观键能计算', value: 1 },
        { label: '反应历程高程', value: 2 },
      ],
    },

    // ── 盖斯定律叠加模式控件 ──
    {
      type: 'modeGrid',
      key: 'hessGroupIndex',
      label: '选择已知热化学方程式组合 (案例卡片)',
      group: '盖斯定律考题案例',
      cols: 1,
      showIf: 'modeVal',
      showIfValue: 0,
      modes: HESS_PRESETS.map((group, idx) => ({
        value: idx,
        label: group.title,
        description: `目标: ${group.targetFormula} (ΔH = ${group.targetDeltaH} kJ/mol)`,
      })),
    },
    {
      type: 'number',
      key: 'k1',
      label: '方程式 ① 叠加系数 (k₁)',
      group: '叠加系数精细调控',
      showIf: 'modeVal',
      showIfValue: 0,
      min: -2,
      max: 2,
      step: 0.5,
      showInput: true,
      marks: COEFF_MARKS,
      description: '系数正数代表正向反应，负数代表颠倒反向反应',
    },
    {
      type: 'number',
      key: 'k2',
      label: '方程式 ② 叠加系数 (k₂)',
      group: '叠加系数精细调控',
      showIf: 'modeVal',
      showIfValue: 0,
      min: -2,
      max: 2,
      step: 0.5,
      showInput: true,
      marks: COEFF_MARKS,
      description: '可通过拖动滑块或增减数值直接观看消去实时动画',
    },

    // ── 微观键能模式控件 ──
    {
      type: 'modeGrid',
      key: 'bondMoleculeIndex',
      label: '典型反应与立体晶体结构',
      group: '微观键能分子选择',
      cols: 1,
      showIf: 'modeVal',
      showIfValue: 1,
      modes: BOND_PRESETS.map((preset, idx) => ({
        value: idx,
        label: preset.name,
        description: `${preset.formula} | ΔH = ${preset.calculatedDeltaH} kJ/mol`,
      })),
    },

    // ── 反应历程与活化能高程模式 ──
    {
      type: 'toggle',
      key: 'hasCatalyst',
      label: '加入催化剂 X (降低活化能/双峰历程)',
      group: '催化剂调控',
      trueValue: 1,
      falseValue: 0,
      showIf: 'modeVal',
      showIfValue: 2,
    },
    {
      type: 'tip',
      variant: 'warning',
      title: '💡 高考考点提醒',
      group: '催化剂调控',
      showIf: 'modeVal',
      showIfValue: 2,
      content: '催化剂同等降低正逆反应活化能 $E_a$，改变反应途径，但反应热 $\\Delta H$ 恒定不变！',
    },
  ]

  const controlParams: Record<string, number> = {
    modeVal: modeIndex,
    hessGroupIndex: params.hessGroupIndex,
    k1: params.k1,
    k2: params.k2,
    bondMoleculeIndex: params.bondMoleculeIndex,
    hasCatalyst: params.hasCatalyst,
  }

  const handleControlUpdate = (key: string, value: number) => {
    if (key === 'modeVal') {
      const modeStr = MODE_MAP[value] || 'hess-overlay'
      const currentGroup = HESS_PRESETS[params.hessGroupIndex] || HESS_PRESETS[0]
      onUpdateParams({
        mode: modeStr,
        k1: currentGroup.equations[0]?.defaultK ?? 1,
        k2: currentGroup.equations[1]?.defaultK ?? 1,
      })
    } else if (key === 'hessGroupIndex') {
      const group = HESS_PRESETS[value] || HESS_PRESETS[0]
      onUpdateParams({
        hessGroupIndex: value,
        k1: group.equations[0]?.defaultK ?? 1,
        k2: group.equations[1]?.defaultK ?? 1,
      })
    } else {
      onUpdateParams({ [key]: value })
    }
  }

  return (
    <LeftPanel>
      <ControlPanel
        controls={controlMetas}
        params={controlParams}
        updateParam={handleControlUpdate}
        setParams={() => {}}
        resetAnimation={onReset}
        restartAnimation={onReset}
      />
    </LeftPanel>
  )
}
