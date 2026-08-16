import React, { useEffect } from 'react'
import {
  LeftPanel,
  LeftPanelSection,
  Slider,
  SegmentedControl,
  Button,
} from '@/components/UI'
import { RotateCcw, Sparkles, BookOpen } from 'lucide-react'
import type { AvogadroParams, TrapCategory } from '../types'

interface AvogadroLeftPanelProps {
  params: AvogadroParams
  viewMode: number
  setViewMode: (mode: number) => void
  onUpdateParams: (updated: Partial<AvogadroParams>) => void
  onReset: () => void
}

export const AvogadroLeftPanel: React.FC<AvogadroLeftPanelProps> = ({
  params,
  onUpdateParams,
  onReset,
}) => {
  // 判断当前物料是否为非气体
  const isCurrentNonGas = React.useMemo(() => {
    if (params.trapCategory === 'state-volume') {
      return ['SO3', 'HF', 'CCl4', 'H2O', 'CH3OH'].includes(params.stateItem)
    }
    if (params.trapCategory === 'structure-bonds') {
      return true // 结构化学均为固/液晶体
    }
    if (params.trapCategory === 'redox-electron' && params.redoxItem === 'Cu-S') {
      return true // Cu 与 S 均为固体反应
    }
    return false
  }, [params.trapCategory, params.stateItem, params.redoxItem])

  // 当切换到结构化学或 Cu-S 等 100% 固态物料时，自动将 L 单位强修正为 g
  useEffect(() => {
    if (isCurrentNonGas && params.amountUnit === 'L' && params.trapCategory !== 'state-volume') {
      onUpdateParams({ amountUnit: 'g' })
    }
  }, [isCurrentNonGas, params.trapCategory, params.amountUnit, onUpdateParams])

  // 高考典型真题一键预设
  const handleLoadPreset = (presetKey: string) => {
    switch (presetKey) {
      case '2024-p4':
        onUpdateParams({
          trapCategory: 'structure-bonds',
          structureItem: 'P4',
          amountValue: 31,
          amountUnit: 'g',
        })
        break
      case '2024-sio2':
        onUpdateParams({
          trapCategory: 'structure-bonds',
          structureItem: 'SiO2',
          amountValue: 60,
          amountUnit: 'g',
        })
        break
      case '2024-fecl3':
        onUpdateParams({
          trapCategory: 'electrolyte-hydrolysis',
          electrolyteItem: 'FeCl3',
          solutionVolume: 1.0,
          solutionConcentration: 0.1,
        })
        break
      case '2024-na2o2':
        onUpdateParams({
          trapCategory: 'redox-electron',
          redoxItem: 'Na2O2-H2O',
          amountValue: 78,
          amountUnit: 'g',
        })
        break
      case '2024-so3':
        onUpdateParams({
          trapCategory: 'state-volume',
          stateItem: 'SO3',
          amountValue: 22.4,
          amountUnit: 'L',
          temperatureCondition: 'standard',
        })
        break
    }
  }

  return (
    <LeftPanel>
      {/* 1. 高考陷阱维度选择 */}
      <LeftPanelSection title="高考陷阱维度">
        <SegmentedControl
          cols={2}
          value={params.trapCategory}
          onChange={(val) => onUpdateParams({ trapCategory: val as TrapCategory })}
          options={[
            { label: '标况状态', value: 'state-volume' },
            { label: '结构键数', value: 'structure-bonds' },
            { label: '弱电水解', value: 'electrolyte-hydrolysis' },
            { label: '氧化还原', value: 'redox-electron' },
            { label: '✨ 五步秒杀', value: '5-step-matrix' },
          ]}
        />
      </LeftPanelSection>

      {/* 2. 题设典型物料与环境 */}
      {params.trapCategory === 'state-volume' && (
        <LeftPanelSection title="标况物料与温度环境">
          <div className="text-[11px] text-slate-500 mb-1.5 font-medium">典型易错物料：</div>
          <SegmentedControl
            cols={2}
            value={params.stateItem}
            onChange={(val) => onUpdateParams({ stateItem: val as any })}
            options={[
              { label: 'SO₃ (固态晶体)', value: 'SO3' },
              { label: 'HF (缔合液体)', value: 'HF' },
              { label: 'CCl₄ (液态)', value: 'CCl4' },
              { label: 'H₂O (冰/水)', value: 'H2O' },
              { label: 'Cl₂ (标况气体)', value: 'Cl2' },
            ]}
          />

          <div className="mt-3">
            <div className="text-[11px] text-slate-500 mb-1.5 font-medium">温度与压强环境：</div>
            <SegmentedControl
              cols={2}
              value={params.temperatureCondition}
              onChange={(val) => onUpdateParams({ temperatureCondition: val as any })}
              options={[
                { label: '标况 (0℃ 101kPa)', value: 'standard' },
                { label: '常温 (25℃ 101kPa)', value: 'ambient' },
              ]}
            />
          </div>

          <div className="mt-3 w-full overflow-hidden">
            <Slider
              label="题设用量数值"
              value={params.amountValue}
              onChange={(val: number) => onUpdateParams({ amountValue: val })}
              min={params.amountUnit === 'L' && isCurrentNonGas ? 0.1 : 1}
              max={params.amountUnit === 'L' && isCurrentNonGas ? 50 : 100}
              step={params.amountUnit === 'L' && isCurrentNonGas ? 0.1 : 1}
              unit={params.amountUnit}
            />
          </div>

          <div className="mt-2 w-full overflow-hidden">
            <div className="text-[11px] text-slate-500 mb-1.5 font-medium">
              题给物理量单位 {isCurrentNonGas && <span className="text-rose-500 font-bold">[非气禁用L]</span>}：
            </div>
            <SegmentedControl
              cols={3}
              value={params.amountUnit}
              onChange={(val) => onUpdateParams({ amountUnit: val as any })}
              options={[
                { label: '升 (L)', value: 'L' },
                { label: '克 (g)', value: 'g' },
                { label: '摩尔 (mol)', value: 'mol' },
              ]}
            />
          </div>
        </LeftPanelSection>
      )}

      {params.trapCategory === 'structure-bonds' && (
        <LeftPanelSection title="微观结构与化学键">
          <div className="text-[11px] text-slate-500 mb-1.5 font-medium">结构化学典型物料：</div>
          <SegmentedControl
            cols={2}
            value={params.structureItem}
            onChange={(val) => onUpdateParams({ structureItem: val as any })}
            options={[
              { label: 'SiO₂ (4键/Si)', value: 'SiO2' },
              { label: '石墨 (1.5键/C)', value: 'graphite' },
              { label: 'P₄ 白磷 (6键)', value: 'P4' },
              { label: 'S₈ 硫 (8键)', value: 'S8' },
              { label: '冰 (2氢键/水)', value: 'ice' },
              { label: 'T₂O (12中子)', value: 'T2O' },
              { label: 'Na₂O₂ (1:2)', value: 'Na2O2' },
            ]}
          />

          <div className="mt-3 w-full overflow-hidden">
            <Slider
              label="晶体/分子题设用量"
              value={params.amountValue}
              onChange={(val: number) => onUpdateParams({ amountValue: val })}
              min={1}
              max={100}
              step={1}
              unit={params.amountUnit}
            />
          </div>

          <div className="mt-2 w-full overflow-hidden">
            <div className="text-[11px] text-slate-500 mb-1.5 font-medium">题给物理量单位 (固态)：</div>
            <SegmentedControl
              cols={2}
              value={params.amountUnit === 'L' ? 'g' : params.amountUnit}
              onChange={(val) => onUpdateParams({ amountUnit: val as any })}
              options={[
                { label: '克 (g)', value: 'g' },
                { label: '摩尔 (mol)', value: 'mol' },
              ]}
            />
          </div>
        </LeftPanelSection>
      )}

      {params.trapCategory === 'electrolyte-hydrolysis' && (
        <LeftPanelSection title="弱电解质、胶体与熔融态">
          <div className="text-[11px] text-slate-500 mb-1.5 font-medium">分散系与离解情境：</div>
          <SegmentedControl
            cols={2}
            value={params.electrolyteItem}
            onChange={(val) => onUpdateParams({ electrolyteItem: val as any })}
            options={[
              { label: 'CH₃COOH 电离', value: 'CH3COOH' },
              { label: 'FeCl₃ 胶体聚集', value: 'FeCl3' },
              { label: 'NaHSO₄ 熔融离解', value: 'NaHSO4-molten' },
              { label: 'Na₂CO₃ 水解', value: 'Na2CO3' },
            ]}
          />

          {params.electrolyteItem === 'NaHSO4-molten' ? (
            <>
              <div className="mt-3 w-full overflow-hidden">
                <Slider
                  label="熔融 NaHSO₄ 用量"
                  value={params.amountValue}
                  onChange={(val: number) => onUpdateParams({ amountValue: val })}
                  min={1}
                  max={50}
                  step={1}
                  unit={params.amountUnit === 'L' ? 'mol' : params.amountUnit}
                />
              </div>
              <div className="mt-2 w-full overflow-hidden">
                <SegmentedControl
                  cols={2}
                  value={params.amountUnit === 'L' ? 'mol' : params.amountUnit}
                  onChange={(val) => onUpdateParams({ amountUnit: val as any })}
                  options={[
                    { label: '摩尔 (mol)', value: 'mol' },
                    { label: '克 (g)', value: 'g' },
                  ]}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mt-3 w-full overflow-hidden">
                <Slider
                  label="水溶液体积 V (L)"
                  value={params.solutionVolume}
                  onChange={(val: number) => onUpdateParams({ solutionVolume: val })}
                  min={0.1}
                  max={5}
                  step={0.1}
                  unit="L"
                />
              </div>

              <div className="mt-2 w-full overflow-hidden">
                <Slider
                  label="水溶液浓度 c (mol/L)"
                  value={params.solutionConcentration}
                  onChange={(val: number) => onUpdateParams({ solutionConcentration: val })}
                  min={0.01}
                  max={2}
                  step={0.01}
                  unit="mol/L"
                />
              </div>
            </>
          )}
        </LeftPanelSection>
      )}

      {params.trapCategory === 'redox-electron' && (
        <LeftPanelSection title="氧化还原与可逆反应">
          <div className="text-[11px] text-slate-500 mb-1.5 font-medium">典型反应类型：</div>
          <SegmentedControl
            cols={2}
            value={params.redoxItem}
            onChange={(val) => onUpdateParams({ redoxItem: val as any })}
            options={[
              { label: 'Cl₂ 歧化反应', value: 'Cl2-NaOH' },
              { label: 'Na₂O₂ 歧化 (1e⁻)', value: 'Na2O2-H2O' },
              { label: 'Cu+S 变价 (1e⁻)', value: 'Cu-S' },
              { label: '2NO₂ 二聚平衡', value: 'NO2-N2O4-reversible' },
            ]}
          />

          <div className="mt-3 w-full overflow-hidden">
            <Slider
              label="题设投料量"
              value={params.amountValue}
              onChange={(val: number) => onUpdateParams({ amountValue: val })}
              min={1}
              max={50}
              step={1}
              unit={params.amountUnit}
            />
          </div>
          <div className="mt-2 w-full overflow-hidden">
            <SegmentedControl
              cols={params.redoxItem === 'Cu-S' || params.redoxItem === 'Na2O2-H2O' ? 2 : 3}
              value={params.amountUnit}
              onChange={(val) => onUpdateParams({ amountUnit: val as any })}
              options={
                params.redoxItem === 'Cu-S' || params.redoxItem === 'Na2O2-H2O'
                  ? [
                      { label: '克 (g)', value: 'g' },
                      { label: '摩尔 (mol)', value: 'mol' },
                    ]
                  : [
                      { label: '升 (L)', value: 'L' },
                      { label: '摩尔 (mol)', value: 'mol' },
                      { label: '克 (g)', value: 'g' },
                    ]
              }
            />
          </div>
        </LeftPanelSection>
      )}

      {params.trapCategory === '5-step-matrix' && (
        <LeftPanelSection title="五步解题秒杀矩阵排查">
          <div className="text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
            按照「①环境 ➔ ②状态 ➔ ③结构 ➔ ④过程 ➔ ⑤电子」思维链逐级排查考题陷阱。
          </div>
          <SegmentedControl
            cols={2}
            value={params.matrixStepIndex}
            onChange={(val) => onUpdateParams({ matrixStepIndex: Number(val) })}
            options={[
              { label: '① 审环境 (T,P,V)', value: 0 },
              { label: '② 审状态 (非气)', value: 1 },
              { label: '③ 审结构 (均摊)', value: 2 },
              { label: '④ 审过程 (限度)', value: 3 },
              { label: '⑤ 审电子 (变价)', value: 4 },
            ]}
          />
        </LeftPanelSection>
      )}

      {/* 3. 高考真题一键预设直达 */}
      <LeftPanelSection title="高考真题一键直达">
        <div className="grid grid-cols-2 gap-1.5">
          <Button
            variant="ghost"
            onClick={() => handleLoadPreset('2024-sio2')}
            className="text-xs justify-start px-2 py-1.5 h-auto text-slate-700 hover:bg-slate-100 border border-slate-200"
          >
            <BookOpen className="w-3 h-3 text-sky-600 mr-1 shrink-0" />
            2024 SiO₂ (4键)
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleLoadPreset('2024-p4')}
            className="text-xs justify-start px-2 py-1.5 h-auto text-slate-700 hover:bg-slate-100 border border-slate-200"
          >
            <Sparkles className="w-3 h-3 text-purple-600 mr-1 shrink-0" />
            2024 P₄ (6键)
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleLoadPreset('2024-fecl3')}
            className="text-xs justify-start px-2 py-1.5 h-auto text-slate-700 hover:bg-slate-100 border border-slate-200"
          >
            <BookOpen className="w-3 h-3 text-emerald-600 mr-1 shrink-0" />
            2024 Fe(OH)₃胶体
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleLoadPreset('2024-na2o2')}
            className="text-xs justify-start px-2 py-1.5 h-auto text-slate-700 hover:bg-slate-100 border border-slate-200"
          >
            <Sparkles className="w-3 h-3 text-amber-600 mr-1 shrink-0" />
            2024 Na₂O₂ (1e⁻)
          </Button>
        </div>
      </LeftPanelSection>

      {/* 4. 操作与重置 */}
      <LeftPanelSection title="操作">
        <Button
          variant="secondary"
          onClick={onReset}
          className="w-full flex items-center justify-center gap-1.5 text-xs py-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重置控制台
        </Button>
      </LeftPanelSection>
    </LeftPanel>
  )
}
