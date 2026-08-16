import React, { useMemo } from 'react'
import {
  LeftPanel,
  LeftPanelSection,
  SegmentedControl,
  OptionButton,
  Button,
  ParamControl,
} from '@/components/UI'
import type {
  ViewMode,
  TitrationErrorParams,
  TitrationMode,
  TitrationType,
  ErrorOperation,
  PurityCalcMethod,
} from '../types'

interface TitrationErrorLeftPanelProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  params: TitrationErrorParams
  onUpdateParams: (updated: Partial<TitrationErrorParams>) => void
  onReset: () => void
}

const ERROR_OPERATIONS: { id: ErrorOperation; label: string }[] = [
  { id: 'none', label: '标准规范操作' },
  { id: 'unrinsed-burette', label: '滴定管未用标准液润洗' },
  { id: 'unrinsed-flask', label: '锥形瓶用待测液润洗' },
  { id: 'wet-flask', label: '锥形瓶洗后未干燥' },
  { id: 'view-start-up-end-down', label: '始仰终俯读数' },
  { id: 'view-start-down-end-up', label: '始俯终仰读数' },
  { id: 'bubble-start', label: '滴定前尖嘴存气泡' },
  { id: 'bubble-end', label: '滴定后尖嘴存气泡' },
  { id: 'hanging-drop', label: '终点尖嘴悬滴' },
  { id: 'indicator-early', label: '指示剂变色过早' },
  { id: 'indicator-late', label: '指示剂变色过迟' },
  { id: 'volumetric-flask-down', label: '定容时俯视刻度' },
]

export const TitrationErrorLeftPanel: React.FC<TitrationErrorLeftPanelProps> = ({
  viewMode,
  onViewModeChange,
  params,
  onUpdateParams,
  onReset,
}) => {
  // ── 误差分析模式参数声明 (paramMeta) ──
  const errorAnalysisParams = useMemo(
    () => [
      {
        key: 'viewAngle',
        label: '视线偏角',
        value: params.viewAngle,
        min: -15,
        max: 15,
        step: 1,
        unit: '°',
        description: '0° 平视，正数仰视，负数俯视',
      },
      {
        key: 'cStandardTrue',
        label: 'c(标准)',
        value: params.cStandardTrue,
        min: 0.05,
        max: 0.5,
        step: 0.01,
        unit: 'mol/L',
      },
      {
        key: 'cSampleTrue',
        label: 'c(待测)',
        value: params.cSampleTrue,
        min: 0.05,
        max: 0.5,
        step: 0.01,
        unit: 'mol/L',
      },
    ],
    [params.viewAngle, params.cStandardTrue, params.cSampleTrue]
  )

  // ── 纯度计算通用参数 (样品与定容) ──
  const purityCommonParams = useMemo(
    () => [
      {
        key: 'sampleMass',
        label: 'm(粗样品)',
        value: params.sampleMass,
        min: 0.5,
        max: 5.0,
        step: 0.1,
        unit: 'g',
      },
      {
        key: 'solutionTotalVol',
        label: 'V(总体积)',
        value: params.solutionTotalVol,
        min: 50,
        max: 500,
        step: 50,
        unit: 'mL',
      },
      {
        key: 'pipetteVol',
        label: 'V(移取量)',
        value: params.pipetteVol,
        min: 10,
        max: 50,
        step: 5,
        unit: 'mL',
      },
    ],
    [params.sampleMass, params.solutionTotalVol, params.pipetteVol]
  )

  // ── 返滴定过量试剂 1 参数 ──
  const backTitrationReagent1Params = useMemo(
    () => [
      {
        key: 'reagent1Conc',
        label: 'c₁',
        value: params.reagent1Conc,
        min: 0.5,
        max: 2.0,
        step: 0.1,
        unit: 'mol/L',
      },
      {
        key: 'reagent1Vol',
        label: 'V₁',
        value: params.reagent1Vol,
        min: 20,
        max: 100,
        step: 5,
        unit: 'mL',
      },
    ],
    [params.reagent1Conc, params.reagent1Vol]
  )

  // ── 标准滴定液 2 参数 (返滴定/直接滴定共用) ──
  const standardReagent2Params = useMemo(
    () => [
      {
        key: 'reagent2Conc',
        label: 'c₂',
        value: params.reagent2Conc,
        min: 0.05,
        max: 1.0,
        step: 0.05,
        unit: 'mol/L',
      },
      {
        key: 'reagent2Vol',
        label: 'V₂',
        value: params.reagent2Vol,
        min: 5,
        max: 50,
        step: 1,
        unit: 'mL',
      },
    ],
    [params.reagent2Conc, params.reagent2Vol]
  )

  // ── 产率计算参数 ──
  const yieldCalcParams = useMemo(
    () => [
      {
        key: 'rawMaterialMass',
        label: 'm(原料)',
        value: params.rawMaterialMass,
        min: 1.0,
        max: 10.0,
        step: 0.2,
        unit: 'g',
      },
      {
        key: 'rawMaterialMolarMass',
        label: 'M(原料)',
        value: params.rawMaterialMolarMass,
        min: 10,
        max: 200,
        step: 0.5,
        unit: 'g/mol',
        description: 'Fe=55.85, Cu=63.5, Al=27, Zn=65.4',
      },
      {
        key: 'molarMassProduct',
        label: 'M(目标产物)',
        value: params.molarMassProduct,
        min: 100,
        max: 500,
        step: 10,
        unit: 'g/mol',
      },
      {
        key: 'actualProductMass',
        label: 'm(实际纯品)',
        value: params.actualProductMass,
        min: 1.0,
        max: 30.0,
        step: 0.5,
        unit: 'g',
      },
    ],
    [params.rawMaterialMass, params.rawMaterialMolarMass, params.molarMassProduct, params.actualProductMass]
  )

  const handleParamChange = (key: string, value: number) => {
    onUpdateParams({ [key]: value } as Partial<TitrationErrorParams>)
  }

  return (
    <LeftPanel>
      {/* 顶层视角 */}
      <LeftPanelSection title="解题视角">
        <SegmentedControl
          value={viewMode}
          onChange={(val) => onViewModeChange(val as ViewMode)}
          options={[
            { value: 'explore', label: '图谱探究' },
            { value: 'scoring', label: '规范踩分' },
            { value: 'quiz', label: '真题研析' },
          ]}
        />
      </LeftPanelSection>

      {/* 当处于 图谱探究 ('explore') 时 */}
      {viewMode === 'explore' && (
        <>
          <LeftPanelSection title="探究模式">
            <SegmentedControl
              value={params.mode}
              onChange={(val) => onUpdateParams({ mode: val as TitrationMode })}
              options={[
                { value: 'error-analysis', label: '误差分析' },
                { value: 'purity-calc', label: '纯度/返滴定' },
                { value: 'yield-calc', label: '产率推导' },
              ]}
            />
          </LeftPanelSection>

          {/* 1. 误差分析 */}
          {params.mode === 'error-analysis' && (
            <>
              <LeftPanelSection title="滴定体系">
                <SegmentedControl
                  value={params.titrationType}
                  onChange={(val) => onUpdateParams({ titrationType: val as TitrationType })}
                  options={[
                    { value: 'acid-base', label: '酸碱滴定' },
                    { value: 'redox', label: '氧化还原' },
                    { value: 'precipitation', label: '沉淀滴定' },
                  ]}
                />
              </LeftPanelSection>

              <LeftPanelSection title="典型误操作">
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {ERROR_OPERATIONS.map((op) => (
                    <OptionButton
                      key={op.id}
                      label={op.label}
                      variant="preset"
                      selected={params.errorOp === op.id}
                      onClick={() => onUpdateParams({ errorOp: op.id })}
                    />
                  ))}
                </div>
              </LeftPanelSection>

              <LeftPanelSection title="视线与浓度微调">
                <ParamControl
                  params={errorAnalysisParams}
                  onParamChange={handleParamChange}
                />
              </LeftPanelSection>
            </>
          )}

          {/* 2. 纯度/返滴定 */}
          {params.mode === 'purity-calc' && (
            <>
              <LeftPanelSection title="计算方法">
                <SegmentedControl
                  value={params.purityMethod}
                  onChange={(val) => onUpdateParams({ purityMethod: val as PurityCalcMethod })}
                  options={[
                    { value: 'direct', label: '直接滴定' },
                    { value: 'back-titration', label: '返滴定' },
                    { value: 'multistep-redox', label: '氧化还原链' },
                  ]}
                />
              </LeftPanelSection>

              <LeftPanelSection title="样品与定容">
                <ParamControl
                  params={purityCommonParams}
                  onParamChange={handleParamChange}
                />
              </LeftPanelSection>

              {params.purityMethod === 'back-titration' && (
                <LeftPanelSection title="过量试剂 1">
                  <ParamControl
                    params={backTitrationReagent1Params}
                    onParamChange={handleParamChange}
                  />
                </LeftPanelSection>
              )}

              <LeftPanelSection
                title={
                  params.purityMethod === 'back-titration'
                    ? '滴定液 2'
                    : '标准滴定液'
                }
              >
                <ParamControl
                  params={standardReagent2Params}
                  onParamChange={handleParamChange}
                />
              </LeftPanelSection>
            </>
          )}

          {/* 3. 产率推导 */}
          {params.mode === 'yield-calc' && (
            <LeftPanelSection title="投料与提纯">
              <ParamControl
                params={yieldCalcParams}
                onParamChange={handleParamChange}
              />
            </LeftPanelSection>
          )}

          {/* 重置 */}
          <div className="pt-2">
            <Button variant="secondary" onClick={onReset} className="w-full text-xs">
              重置参数
            </Button>
          </div>
        </>
      )}

      {/* 视角 'scoring' / 'quiz' 导引 */}
      {viewMode === 'scoring' && (
        <LeftPanelSection title="踩分卡说明">
          <p className="text-xs text-neutral-600 leading-relaxed">
            中屏已载入定量滴定与计算答题规范踩分卡，核对表达式与单位要求。
          </p>
        </LeftPanelSection>
      )}

      {viewMode === 'quiz' && (
        <LeftPanelSection title="真题说明">
          <p className="text-xs text-neutral-600 leading-relaxed">
            中屏已载入全国高考真题变式，分析滴定突跃曲线并查看模型对齐。
          </p>
        </LeftPanelSection>
      )}
    </LeftPanel>
  )
}
