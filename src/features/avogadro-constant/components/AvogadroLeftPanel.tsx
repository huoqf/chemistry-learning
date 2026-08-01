import React, { useEffect } from 'react'
import {
  LeftPanel,
  LeftPanelSection,
  Slider,
  SegmentedControl,
  Button,
} from '@/components/UI'
import { RotateCcw } from 'lucide-react'
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
  viewMode,
  setViewMode,
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

  return (
    <LeftPanel>
      {/* 1. 主视角切换 */}
      <LeftPanelSection title="解题探究视角">
        <SegmentedControl
          value={viewMode}
          onChange={(val) => setViewMode(Number(val))}
          options={[
            { label: '图谱探究', value: 0 },
            { label: '规范踩分', value: 1 },
            { label: '真题研析', value: 2 },
          ]}
        />
      </LeftPanelSection>

      {/* 2. 考点陷阱分类 */}
      <LeftPanelSection title="考点陷阱维度">
        <SegmentedControl
          value={params.trapCategory}
          onChange={(val) => onUpdateParams({ trapCategory: val as TrapCategory })}
          options={[
            { label: '标况状态', value: 'state-volume' },
            { label: '结构化学', value: 'structure-bonds' },
            { label: '弱电水解', value: 'electrolyte-hydrolysis' },
            { label: '氧化还原', value: 'redox-electron' },
            { label: '五步秒杀', value: '5-step-matrix' },
          ]}
        />
      </LeftPanelSection>

      {/* 3. 具体物料 / 反应条件选择 */}
      {params.trapCategory === 'state-volume' && (
        <LeftPanelSection title="标况物料项选择">
          <SegmentedControl
            value={params.stateItem}
            onChange={(val) => onUpdateParams({ stateItem: val as any })}
            options={[
              { label: 'SO₃ (固)', value: 'SO3' },
              { label: 'HF (缔合液)', value: 'HF' },
              { label: 'CCl₄ (液)', value: 'CCl4' },
              { label: 'H₂O (液)', value: 'H2O' },
              { label: 'Cl₂ (气)', value: 'Cl2' },
            ]}
          />

          <div className="mt-3">
            <SegmentedControl
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
              label="给定条件数值"
              value={params.amountValue}
              onChange={(val: number) => onUpdateParams({ amountValue: val })}
              min={params.amountUnit === 'L' && isCurrentNonGas ? 0.1 : 1}
              max={params.amountUnit === 'L' && isCurrentNonGas ? 5 : 100}
              step={params.amountUnit === 'L' && isCurrentNonGas ? 0.1 : 1}
              unit={params.amountUnit}
            />
          </div>

          <div className="mt-2 w-full overflow-hidden">
            <SegmentedControl
              value={params.amountUnit}
              onChange={(val) => onUpdateParams({ amountUnit: val as any })}
              options={[
                { label: '克 (g)', value: 'g' },
                { label: '摩尔 (mol)', value: 'mol' },
                { label: '升 (L) [非气体陷阱]', value: 'L' },
              ]}
            />
          </div>
        </LeftPanelSection>
      )}

      {params.trapCategory === 'structure-bonds' && (
        <LeftPanelSection title="结构与化学键选择">
          <SegmentedControl
            value={params.structureItem}
            onChange={(val) => onUpdateParams({ structureItem: val as any })}
            options={[
              { label: 'P₄ 白磷 (6键)', value: 'P4' },
              { label: 'S₈ 硫 (8键)', value: 'S8' },
              { label: '冰 (2氢键)', value: 'ice' },
              { label: 'T₂O (12中子)', value: 'T2O' },
              { label: 'Na₂O₂ (1:2)', value: 'Na2O2' },
            ]}
          />

          <div className="mt-3 w-full overflow-hidden">
            <Slider
              label="固体/晶体给定用量"
              value={params.amountValue}
              onChange={(val: number) => onUpdateParams({ amountValue: val })}
              min={1}
              max={100}
              step={1}
              unit={params.amountUnit}
            />
          </div>

          {/* 结构化学固态晶体禁用 L 单位 */}
          <div className="mt-2 w-full overflow-hidden">
            <SegmentedControl
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
        <LeftPanelSection title="弱电解质与水解/熔融">
          <SegmentedControl
            value={params.electrolyteItem}
            onChange={(val) => onUpdateParams({ electrolyteItem: val as any })}
            options={[
              { label: 'CH₃COOH 电离', value: 'CH3COOH' },
              { label: 'NaHSO₄ 熔融', value: 'NaHSO4-molten' },
              { label: 'Na₂CO₃ 水解', value: 'Na2CO3' },
            ]}
          />

          {/* NaHSO4 熔融态为纯净物熔体，严禁显示“溶液”字样 */}
          {params.electrolyteItem === 'NaHSO4-molten' ? (
            <>
              <div className="mt-3 w-full overflow-hidden">
                <Slider
                  label="熔融 NaHSO₄ 给定用量"
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
                  label="水溶液体积 (L)"
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
                  label="水溶液浓度 (mol/L)"
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
        <LeftPanelSection title="氧化还原类型">
          <SegmentedControl
            value={params.redoxItem}
            onChange={(val) => onUpdateParams({ redoxItem: val as any })}
            options={[
              { label: 'Cl₂ + NaOH 歧化', value: 'Cl2-NaOH' },
              { label: 'Cu + S 变价', value: 'Cu-S' },
              { label: '2NO₂ ⇌ N₂O₄ 二聚', value: 'NO2-N2O4-reversible' },
            ]}
          />

          <div className="mt-3 w-full overflow-hidden">
            <Slider
              label={
                params.redoxItem === 'Cu-S'
                  ? 'Cu 投料用量 (与足量 S 反应)'
                  : params.redoxItem === 'Cl2-NaOH'
                  ? 'Cl₂ 气体投料用量'
                  : 'NO₂ 气体投料用量'
              }
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
              value={params.amountUnit}
              onChange={(val) => onUpdateParams({ amountUnit: val as any })}
              options={
                params.redoxItem === 'Cu-S'
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
            点击“分步排查”按“环境 ➔ 状态 ➔ 结构 ➔ 过程 ➔ 电子”顺序逐级排查考题陷阱。
          </div>
          <SegmentedControl
            value={params.matrixStepIndex}
            onChange={(val) => onUpdateParams({ matrixStepIndex: Number(val) })}
            options={[
              { label: '一审环境', value: 0 },
              { label: '二审状态', value: 1 },
              { label: '三审结构', value: 2 },
              { label: '四审过程', value: 3 },
              { label: '五审电子', value: 4 },
            ]}
          />
        </LeftPanelSection>
      )}

      {/* 4. 操作与重置 */}
      <LeftPanelSection title="操作">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={onReset}
            className="w-full flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重置控制台
          </Button>
        </div>
      </LeftPanelSection>
    </LeftPanel>
  )
}
