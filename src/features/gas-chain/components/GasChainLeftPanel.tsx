/**
 * src/features/gas-chain/components/GasChainLeftPanel.tsx
 * 气体制备/净化/尾气处理装置链工具 - 左屏控制台 (遵从 UI 组件库规范)
 */

import React from 'react'
import {
  LeftPanel,
  LeftPanelSection,
  ParamControl,
  SegmentedControl,
  ToggleSwitch,
  Button,
} from '@/components/UI'
import type {
  GasChainParams,
  GasChainSystemId,
  GeneratorType,
  WashReagentType,
  DryerType,
  CollectionMethod,
  TailGasDevice,
} from '../types'

interface GasChainLeftPanelProps {
  params: GasChainParams
  updateParam: (key: keyof GasChainParams, value: any) => void
  onReset: () => void
  onSelectSystem: (sysId: GasChainSystemId) => void
}

export const GasChainLeftPanel: React.FC<GasChainLeftPanelProps> = ({
  params,
  updateParam,
  onReset,
  onSelectSystem,
}) => {
  return (
    <LeftPanel>
      {/* 1. 高考经典气体制备体系预设 */}
      <LeftPanelSection title="高考经典实验体系预设">
        <SegmentedControl
          value={params.systemId}
          onChange={(val) => onSelectSystem(val as GasChainSystemId)}
          cols={2}
          options={[
            { label: 'Cl₂ 强氧化', value: 'cl2-prep' },
            { label: 'NH₃ 碱性防倒吸', value: 'nh3-prep' },
            { label: 'SO₂ 还原检验', value: 'so2-chain' },
            { label: 'NO₂/NO 收集', value: 'no-no2-chain' },
            { label: 'C₂H₄ 有机除杂', value: 'c2h4-prep' },
            { label: '自定义探究', value: 'custom' },
          ]}
        />
      </LeftPanelSection>

      {/* 2. 5 大节点装置及试剂自由调控 */}
      <LeftPanelSection title="装置链节点配置">
        <div className="space-y-4">
          {/* ① 发生装置 */}
          <div>
            <SegmentedControl
              label="① 发生装置类型"
              value={params.generator}
              onChange={(val) => updateParam('generator', val as GeneratorType)}
              cols={2}
              options={[
                { label: '固液加热 (Cl₂)', value: 'flask-heat' },
                { label: '固固加热 (NH₃)', value: 'testtube-heat' },
                { label: '固液常温 (SO₂)', value: 'flask-noheat' },
                { label: '启普发生器', value: 'kipp' },
              ]}
            />
          </div>

          {/* ② 净化试剂 */}
          <div className="space-y-2">
            <SegmentedControl
              label="② 净化洗气瓶试剂"
              value={params.washReagent}
              onChange={(val) => updateParam('washReagent', val as WashReagentType)}
              cols={2}
              options={[
                { label: '饱和食盐水', value: 'sat-nacl' },
                { label: 'NaOH 溶液', value: 'naoh' },
                { label: '品红溶液', value: 'fuchsin' },
                { label: '酸性 KMnO₄', value: 'kmno4' },
                { label: '蒸馏水', value: 'water' },
                { label: '无净化', value: 'none' },
              ]}
            />

            {/* 洗气瓶接法开关 */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-200">
              <ToggleSwitch
                label="管路接法"
                checked={!params.washReverse}
                onChange={(checked) => updateParam('washReverse', !checked)}
              />
              {!params.washReverse ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                  ✓ 长进短出
                </span>
              ) : (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                  ❌ 短进长出 (误)
                </span>
              )}
            </div>
          </div>

          {/* ③ 干燥试剂 */}
          <div>
            <SegmentedControl
              label="③ 干燥装置与试剂"
              value={params.dryer}
              onChange={(val) => updateParam('dryer', val as DryerType)}
              cols={2}
              options={[
                { label: '浓硫酸洗气瓶', value: 'conc-h2so4' },
                { label: '碱石灰干燥管', value: 'soda-lime' },
                { label: '无水 CaCl₂', value: 'cacl2' },
                { label: '不干燥', value: 'none' },
              ]}
            />
          </div>

          {/* ④ 收集方式 */}
          <div>
            <SegmentedControl
              label="④ 气体收集方式"
              value={params.collection}
              onChange={(val) => updateParam('collection', val as CollectionMethod)}
              cols={2}
              options={[
                { label: '向上排空气法', value: 'upward-air' },
                { label: '向下排空气法', value: 'downward-air' },
                { label: '排水集气法', value: 'water-displacement' },
                { label: '不收集', value: 'none' },
              ]}
            />
          </div>

          {/* ⑤ 尾气处理/防倒吸 */}
          <div>
            <SegmentedControl
              label="⑤ 尾气处理与防倒吸"
              value={params.tailGas}
              onChange={(val) => updateParam('tailGas', val as TailGasDevice)}
              cols={2}
              options={[
                { label: '倒置漏斗防倒吸', value: 'inverted-funnel' },
                { label: '安全瓶防倒吸', value: 'safety-bottle' },
                { label: 'NaOH 溶液吸收', value: 'naoh-absorber' },
                { label: '点燃/灼烧处理', value: 'combustion' },
                { label: '气球收集', value: 'balloon' },
                { label: '直导管(高危倒吸)', value: 'direct-pipe' },
              ]}
            />
          </div>
        </div>
      </LeftPanelSection>

      {/* 3. 反应参数调控 */}
      <LeftPanelSection title="反应条件调控">
        <div className="space-y-3">
          <ParamControl
            params={[
              {
                key: 'flowRate',
                label: '气体生成流速',
                min: 0,
                max: 100,
                step: 5,
                unit: 'mL/min',
                value: params.flowRate,
              },
              {
                key: 'temp',
                label: '发生反应温度',
                min: 20,
                max: 200,
                step: 5,
                unit: '°C',
                value: params.temp,
              },
            ]}
            onParamChange={(key, val) => updateParam(key as keyof GasChainParams, val)}
          />

          <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-200">
            <ToggleSwitch
              label="酒精灯加热"
              checked={params.heating}
              onChange={(checked) => updateParam('heating', checked)}
            />
            <span className={`text-[11px] font-semibold ${params.heating ? 'text-amber-600' : 'text-neutral-500'}`}>
              {params.heating ? '🔥 加热中' : '❄️ 常温'}
            </span>
          </div>

          <Button variant="secondary" className="w-full" onClick={onReset}>
            重置实验参数
          </Button>
        </div>
      </LeftPanelSection>
    </LeftPanel>
  )
}

