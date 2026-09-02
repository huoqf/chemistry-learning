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
  WashStepReagent,
  CollectionMethod,
  TailGasDevice,
} from '../types'
import type { GasCategory } from '../data/gasChainMatrixData'
import { GAS_MATRIX_ITEMS } from '../data/gasChainMatrixData'
import { Sparkles, Play } from 'lucide-react'

interface GasChainLeftPanelProps {
  params: GasChainParams
  updateParam: (key: keyof GasChainParams, value: any) => void
  onReset: () => void
  onSelectSystem: (sysId: GasChainSystemId) => void
  onSelectGas?: (targetGas: string) => void
  // 大表模式专属筛选受控 props
  categoryFilter?: GasCategory | 'all'
  onCategoryFilterChange?: (cat: GasCategory | 'all') => void
}

export const GasChainLeftPanel: React.FC<GasChainLeftPanelProps> = ({
  params,
  updateParam,
  onReset,
  onSelectSystem,
  onSelectGas,
  categoryFilter = 'all',
  onCategoryFilterChange,
}) => {
  const panelMode = params.panelMode ?? 'chain'

  return (
    <LeftPanel>
      {/* 0. 核心模式切换：装置链探究 vs 全景速查大表 */}
      <LeftPanelSection title="学习与探究模式">
        <SegmentedControl
          value={panelMode}
          onChange={(val) => updateParam('panelMode', val)}
          cols={2}
          options={[
            { label: '装置链探究', value: 'chain' },
            { label: '全景速查大表', value: 'matrix' },
          ]}
        />
      </LeftPanelSection>

      {/* 模式 A：装置链探究面板 */}
      {panelMode === 'chain' && (
        <>
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

            {/* NO/NO2 氮氧化物体系探究气体切换 */}
            {params.systemId === 'no-no2-chain' && (
              <div className="mt-3">
                <SegmentedControl
                  label="探究目标氮氧化物"
                  value={params.targetGas}
                  onChange={(val) => {
                    if (onSelectGas) {
                      onSelectGas(String(val))
                    } else {
                      updateParam('targetGas', val)
                      if (val === 'NO') {
                        updateParam('collection', 'water-displacement')
                      } else if (val === 'NO₂') {
                        updateParam('collection', 'upward-air')
                      }
                    }
                  }}
                  cols={2}
                  options={[
                    { label: 'NO₂ (红棕色/排空气)', value: 'NO₂' },
                    { label: 'NO (无色/排水法)', value: 'NO' },
                  ]}
                />
              </div>
            )}

            {/* 自定义探究模式目标气体选择 (全集 13 种核心气体) */}
            {params.systemId === 'custom' && (
              <div className="mt-3 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">自定义目标气体 (选择后自动加载推荐装置):</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {GAS_MATRIX_ITEMS.map((g) => (
                    <button
                      key={g.formula}
                      onClick={() => onSelectGas ? onSelectGas(g.formula) : updateParam('targetGas', g.formula)}
                      className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                        params.targetGas === g.formula
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {g.formula}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                    { label: '固液加热 (Cl₂/C₂H₄)', value: 'flask-heat' },
                    { label: '固固加热 (NH₃/O₂)', value: 'testtube-heat' },
                    { label: '固液常温 (SO₂/NO₂)', value: 'flask-noheat' },
                    { label: '启普发生器 (CO₂/H₂)', value: 'kipp' },
                  ]}
                />
              </div>

              {/* ② 净化试剂（第 1 步洗气瓶试剂） */}
              <div className="space-y-2">
                <SegmentedControl
                  label="② 净化洗气瓶试剂"
                  value={params.washingSteps[0]?.reagent ?? 'none'}
                  onChange={(val) => {
                    const steps = [...params.washingSteps]
                    if (val === 'none') {
                      // 无净化：移除第一步（若为 wash-bottle）
                      const filtered = steps.filter((s, i) => i !== 0 || s.device !== 'wash-bottle')
                      updateParam('washingSteps', filtered)
                    } else {
                      if (steps[0]?.device === 'wash-bottle' || steps[0]?.device === 'acid-bottle') {
                        steps[0] = { ...steps[0], reagent: val as WashStepReagent }
                      } else {
                        steps.unshift({ id: 'w0', device: 'wash-bottle', reagent: val as WashStepReagent, role: 'purify' })
                      }
                      updateParam('washingSteps', steps)
                    }
                  }}
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
                    checked={!(params.washingSteps[0]?.reversed)}
                    onChange={(checked) => {
                      const steps = [...params.washingSteps]
                      if (steps[0]) steps[0] = { ...steps[0], reversed: !checked }
                      updateParam('washingSteps', steps)
                    }}
                  />
                  {!(params.washingSteps[0]?.reversed) ? (
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

              {/* ③ 干燥试剂（最后一步 dry-tube/acid-bottle） */}
              <div>
                <SegmentedControl
                  label="③ 干燥装置与试剂"
                  value={
                    params.washingSteps.find(s => s.device === 'dry-tube')?.reagent
                    ?? (params.washingSteps.find(s => s.device === 'acid-bottle') ? 'conc-h2so4' : 'none')
                  }
                  onChange={(val) => {
                    const steps = params.washingSteps.filter(s => s.device !== 'dry-tube' && s.device !== 'acid-bottle')
                    if (val !== 'none') {
                      const device = val === 'conc-h2so4' ? 'acid-bottle' : 'dry-tube'
                      steps.push({ id: `d${Date.now()}`, device, reagent: val as WashStepReagent, role: 'dry' })
                    }
                    updateParam('washingSteps', steps)
                  }}
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

                {/* 向下排空气法长短管接法探究 */}
                {params.collection === 'downward-air' && (
                  <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <ToggleSwitch
                      label="向下排导管接法"
                      checked={params.collectTubeMode !== 'wrong-long-in'}
                      onChange={(checked) =>
                        updateParam('collectTubeMode', checked ? 'correct-short-in' : 'wrong-long-in')
                      }
                    />
                    <div className="mt-1 text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                      <span>正放集气瓶接法:</span>
                      {params.collectTubeMode !== 'wrong-long-in' ? (
                        <span className="text-emerald-700 font-bold">✓ 短进长出 (规范)</span>
                      ) : (
                        <span className="text-rose-700 font-bold">❌ 长进短出 (顶溢易错)</span>
                      )}
                    </div>
                  </div>
                )}
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

                {/* 倒置漏斗浸没深度调节 */}
                {params.tailGas === 'inverted-funnel' && (
                  <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <ToggleSwitch
                      label="倒置漏斗浸没深度"
                      checked={params.funnelDepth !== 'deep'}
                      onChange={(checked) =>
                        updateParam('funnelDepth', checked ? 'tangent' : 'deep')
                      }
                    />
                    <div className="mt-1 text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                      <span>浸没物理状态:</span>
                      {params.funnelDepth !== 'deep' ? (
                        <span className="text-emerald-700 font-bold">✓ 相切/微浸 (规范防倒吸)</span>
                      ) : (
                        <span className="text-rose-700 font-bold">❌ 深深深浸没 (探底失灵)</span>
                      )}
                    </div>
                  </div>
                )}
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
        </>
      )}

      {/* 模式 B：全景大表辅助导航面板 */}
      {panelMode === 'matrix' && (
        <>
          {/* 大表分类快速筛选 */}
          <LeftPanelSection title="气体类别快速筛选">
            <SegmentedControl
              value={categoryFilter}
              onChange={(val) => onCategoryFilterChange?.(val as GasCategory | 'all')}
              cols={1}
              options={[
                { label: '全部气体 (13 种新高考核心)', value: 'all' },
                { label: '强氧化/酸性气体 (Cl₂/SO₂/NO₂/HCl...)', value: 'acid-oxidant' },
                { label: '碱性/极易溶氢化物 (NH₃)', value: 'base-hydride' },
                { label: '中性/难溶气体 (NO/CO/O₂/H₂)', value: 'neutral-insoluble' },
                { label: '有机烃类气体 (C₂H₄/C₂H₂)', value: 'organic-hydrocarbon' },
              ]}
            />
          </LeftPanelSection>

          {/* 13 种核心气体一键直达模拟（与上方筛选联动） */}
          {(() => {
            const filteredMatrixItems =
              !categoryFilter || categoryFilter === 'all'
                ? GAS_MATRIX_ITEMS
                : GAS_MATRIX_ITEMS.filter((item) => item.category === categoryFilter)

            const catMap: Record<GasCategory, string> = {
              'acid-oxidant': '强氧化/酸性气体',
              'base-hydride': '碱性/极易溶气体',
              'neutral-insoluble': '中性/难溶气体',
              'organic-hydrocarbon': '有机烃类气体',
            }
            const sectionTitle =
              !categoryFilter || categoryFilter === 'all'
                ? '13 种核心气体模拟直达'
                : `${catMap[categoryFilter] || '筛选气体'}直达 (${filteredMatrixItems.length} 种)`

            return (
              <LeftPanelSection title={sectionTitle}>
                <div className="grid grid-cols-2 gap-1.5">
                  {filteredMatrixItems.map((item) => (
                    <button
                      key={item.formula}
                      onClick={() => {
                        if (onSelectGas) {
                          onSelectGas(item.formula)
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-xs font-semibold text-slate-800 hover:text-indigo-900 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-bold">{item.formula}</span>
                      <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-0.5">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        模拟
                      </span>
                    </button>
                  ))}
                </div>
              </LeftPanelSection>
            )
          })()}

          {/* 大表学习指引与答题口诀 */}
          <LeftPanelSection title="大表记忆与复习指引">
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs space-y-2 text-indigo-950">
              <div className="flex items-center gap-1 font-bold text-indigo-900">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>高考满分复习建议</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-700 leading-relaxed">
                <li>• <strong>横向对比</strong>：发生装置选择看“反应物状态与反应条件”；</li>
                <li>• <strong>纵向排查</strong>：干燥剂选择牢记“酸碱不反应、络合不氯化钙、氧化不浓酸”；</li>
                <li>• <strong>大题规范</strong>：气密性检验标准句式“操作 ➔ 现象 ➔ 结论”三步走。</li>
              </ul>
            </div>
          </LeftPanelSection>
        </>
      )}
    </LeftPanel>
  )
}
