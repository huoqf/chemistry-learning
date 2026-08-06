import React from 'react'
import { LeftPanel, LeftPanelSection, ParamControl, SegmentedControl, Button } from '@/components/UI'
import type { ElementPeriodicParams, PeriodicExploreMode, StateType } from '../types'
import { PERIODIC_ELEMENTS } from '../hooks/useElementPeriodicChemistry'

interface ElementPeriodicLeftPanelProps {
  params: ElementPeriodicParams
  onUpdateParams: (updated: Partial<ElementPeriodicParams>) => void
  onReset: () => void
}

export const ElementPeriodicLeftPanel: React.FC<ElementPeriodicLeftPanelProps> = ({
  params,
  onUpdateParams,
  onReset,
}) => {
  const currentElement = PERIODIC_ELEMENTS[params.selectedAtomicNumber] || PERIODIC_ELEMENTS[6]

  const exploreModeOptions = [
    { label: '电子排布与轨道', value: 'orbital-config' },
    { label: '第一电离能反常', value: 'ion-energy' },
    { label: '逐级电离能突跃', value: 'step-ion-energy' },
    { label: '等电子体微粒半径', value: 'radius-matrix' },
    { label: '高考位构性推断', value: 'inference-nexus' },
  ]

  const stateTypeOptions = [
    { label: '基态 Ground State', value: 'ground' },
    { label: '激发态 Excited State', value: 'excited' },
  ]

  const periodOptions = [
    { label: '第 2 周期 (Li~Ne)', value: 2 },
    { label: '第 3 周期 (Na~Ar)', value: 3 },
  ]

  const isoOptions = [
    { label: '10 电子体 (O²⁻~Al³⁺)', value: '10e' },
    { label: '18 电子体 (P³⁻~Ca²⁺)', value: '18e' },
  ]

  const inferenceOptions = [
    { label: '2024 山东短周期推算', value: 'case-2024-shandong' },
    { label: '2024 全国甲卷过渡元素', value: 'case-2024-quanguo' },
  ]

  // 快捷常用元素按钮
  const quickElements = [
    { symbol: 'H', z: 1 },
    { symbol: 'C', z: 6 },
    { symbol: 'N', z: 7 },
    { symbol: 'O', z: 8 },
    { symbol: 'F', z: 9 },
    { symbol: 'Na', z: 11 },
    { symbol: 'Mg', z: 12 },
    { symbol: 'Al', z: 13 },
    { symbol: 'P', z: 15 },
    { symbol: 'S', z: 16 },
    { symbol: 'Cl', z: 17 },
    { symbol: 'Cr', z: 24, special: true },
    { symbol: 'Fe', z: 26 },
    { symbol: 'Cu', z: 29, special: true },
  ]

  return (
    <LeftPanel>
      {/* 标题 */}
      <div className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 px-1">
        位-构-性交互控制台
      </div>

      {/* 探究维度模式切换 */}
      <LeftPanelSection title="1. 探究维度模式">
        <SegmentedControl
          options={exploreModeOptions}
          value={params.exploreMode}
          onChange={(val) => onUpdateParams({ exploreMode: val as PeriodicExploreMode })}
        />
      </LeftPanelSection>

      {/* 元素选择与参数调节 */}
      <LeftPanelSection title="2. 元素与核外电子设定">
        <ParamControl
          params={[
            {
              key: 'selectedAtomicNumber',
              label: '原子序数 Z (1~30号)',
              value: params.selectedAtomicNumber,
              min: 1,
              max: 30,
              step: 1,
              unit: ` ${currentElement.symbol} (${currentElement.name})`,
            },
          ]}
          onParamChange={(_key: string, val: number) => onUpdateParams({ selectedAtomicNumber: Number(val) })}
        />

        <div className="flex flex-wrap gap-1 mt-2">
          {quickElements.map((item) => (
            <button
              key={item.z}
              onClick={() => onUpdateParams({ selectedAtomicNumber: item.z })}
              className={`px-2 py-1 text-xs font-bold rounded transition-all border ${
                params.selectedAtomicNumber === item.z
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                  : item.special
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.symbol} ({item.z})
            </button>
          ))}
        </div>

        {params.exploreMode === 'orbital-config' && (
          <div className="mt-3">
            <span className="text-xs font-semibold text-slate-700 mb-1.5 block">
              电子能级状态 (跃迁探究)
            </span>
            <SegmentedControl
              options={stateTypeOptions}
              value={params.stateType}
              onChange={(val) => onUpdateParams({ stateType: val as StateType })}
            />
          </div>
        )}
      </LeftPanelSection>

      {/* 针对特有维度的条件过滤 */}
      {params.exploreMode === 'ion-energy' && (
        <LeftPanelSection title="3. 同周期电离能对比">
          <SegmentedControl
            options={periodOptions}
            value={params.periodFilter}
            onChange={(val) => onUpdateParams({ periodFilter: Number(val) })}
          />
        </LeftPanelSection>
      )}

      {params.exploreMode === 'radius-matrix' && (
        <LeftPanelSection title="3. 等电子体微粒组">
          <SegmentedControl
            options={isoOptions}
            value={params.isoGroupFilter}
            onChange={(val) => onUpdateParams({ isoGroupFilter: val as '10e' | '18e' })}
          />
        </LeftPanelSection>
      )}

      {params.exploreMode === 'inference-nexus' && (
        <LeftPanelSection title="3. 高考真题推断案例">
          <SegmentedControl
            options={inferenceOptions}
            value={params.inferenceId}
            onChange={(val) => onUpdateParams({ inferenceId: val as string })}
          />
        </LeftPanelSection>
      )}

      {/* 重置按钮 */}
      <LeftPanelSection title="4. 快捷重置">
        <Button variant="secondary" size="sm" className="w-full" onClick={onReset}>
          恢复默认设定 (6 号碳基态)
        </Button>
      </LeftPanelSection>
    </LeftPanel>
  )
}
