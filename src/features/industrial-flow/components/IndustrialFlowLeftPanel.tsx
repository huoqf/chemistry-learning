/**
 * src/features/industrial-flow/components/IndustrialFlowLeftPanel.tsx
 * 母题七：无机工艺流程与沉淀调 pH 工具 - 左屏声明式控制面板
 * 遵循《AGENTS.md》铁律 3 (声明式体系)、铁律 3C (标题纯粹、无装饰 emoji)
 */

import React from 'react'
import {
  LeftPanel,
  LeftPanelSection,
  ParamControl,
  SegmentedControl,
} from '@/components/UI'
import {
  IndustrialFlowChemistry,
  IndustrialFlowParams,
  IndustrialFlowSystemId,
} from '../types'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface IndustrialFlowLeftPanelProps {
  params: IndustrialFlowParams
  chemistry: IndustrialFlowChemistry
  updateParam: (key: keyof IndustrialFlowParams, value: any) => void
  onReset?: () => void
}

export const IndustrialFlowLeftPanel: React.FC<IndustrialFlowLeftPanelProps> = ({
  params,
  chemistry,
  updateParam,
}) => {
  const {
    isPhInSafeRange,
    safePhRange,
    hasSafeRange,
    safeRangeDescription,
    reagentEvaluations,
    leachRate,
    activeStepInfo,
  } = chemistry

  // 1. 体系选项
  const systemOptions: { label: string; value: IndustrialFlowSystemId }[] = [
    { label: 'Fe-Al-Mn 软锰矿', value: 'fe-al-mn' },
    { label: 'Fe-Cu-Zn 铜锌渣', value: 'fe-cu-zn' },
    { label: 'Ti-Fe 钛白粉', value: 'ti-fe' },
    { label: 'Ni-Co-Li 锂电池', value: 'ni-co-li' },
    { label: 'Mg-Ca 盐湖卤水', value: 'mg-ca' },
  ]

  // 2. 工序槽体选项 (与中屏方框图槽体 100% 对应联动)
  const stepOptions = [
    {
      label: params.systemId === 'fe-al-mn' ? '1. 还原酸浸槽' : '1. 矿石酸浸槽',
      value: 1,
    },
    {
      label: params.systemId === 'ti-fe' ? '2. 铁屑还原槽' : '2. 氧化反应槽',
      value: 2,
    },
    {
      label: '3. 调pH沉淀槽',
      value: 3,
    },
    {
      label:
        params.systemId === 'fe-cu-zn'
          ? '4. 锌粉置换槽'
          : params.systemId === 'ti-fe'
          ? '4. 水解制钛酸'
          : '4. 结晶提纯槽',
      value: 4,
    },
  ]

  // 3. 粒度选项
  const crushOptions = [
    { label: '粗粒', value: 'coarse' },
    { label: '中等', value: 'medium' },
    { label: '细粉', value: 'fine' },
  ]

  // 4. 试剂选项 (使用标准 SegmentedControl 规范呈现)
  const reagentOptions = reagentEvaluations.map((r) => ({
    label: r.isRecommended ? `${r.reagent} (推荐)` : r.reagent,
    value: r.reagent,
  }))

  const currentStep = params.activeStep || 3
  const currentEvaluation = reagentEvaluations.find((r) => r.reagent === params.reagent)

  return (
    <LeftPanel className="p-4 flex flex-col gap-3.5 overflow-y-auto">
      {/* 1. 考题体系 */}
      <LeftPanelSection title="工业流程考题体系">
        <SegmentedControl
          options={systemOptions}
          value={params.systemId}
          onChange={(val) => {
            updateParam('systemId', val)
            if (val === 'fe-al-mn') {
              updateParam('reagent', 'MnO')
              updateParam('pH', 5.2)
              updateParam('oxidantAmount', 'sufficient')
            } else if (val === 'fe-cu-zn') {
              updateParam('reagent', 'ZnO')
              updateParam('pH', 5.2)
              updateParam('oxidantAmount', 'sufficient')
            } else if (val === 'ti-fe') {
              updateParam('reagent', 'NaOH')
              updateParam('pH', 1.5)
              updateParam('oxidantAmount', 'sufficient')
            } else if (val === 'ni-co-li') {
              updateParam('reagent', 'NaOH')
              updateParam('pH', 4.8)
              updateParam('oxidantAmount', 'sufficient')
            } else if (val === 'mg-ca') {
              updateParam('reagent', 'MgO')
              updateParam('pH', 5.0)
              updateParam('oxidantAmount', 'sufficient')
            }
          }}
          cols={2}
        />
      </LeftPanelSection>

      {/* 2. 工序槽体下钻 (直达槽体) */}
      <LeftPanelSection title="工序槽体导航">
        <SegmentedControl
          options={stepOptions}
          value={currentStep}
          onChange={(val) => updateParam('activeStep', val)}
          cols={2}
        />
      </LeftPanelSection>

      {/* 3. 工序专属调控台 (按工序精准解耦) */}
      {currentStep === 1 && (
        <LeftPanelSection title="工序一：酸浸动力学参数">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">
                矿石粉碎粒度
              </label>
              <SegmentedControl
                options={crushOptions}
                value={params.crushSize}
                onChange={(val) => updateParam('crushSize', val)}
              />
            </div>

            <ParamControl
              params={[
                {
                  key: 'leachTemp',
                  label: '反应釜温度',
                  value: params.leachTemp,
                  min: 20,
                  max: 90,
                  step: 1,
                  unit: '℃',
                },
              ]}
              onParamChange={(key, val) => updateParam(key as keyof IndustrialFlowParams, val)}
            />

            <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-900">酸浸出率测定值</span>
              <span className="font-mono text-sm font-bold text-indigo-600">
                {leachRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </LeftPanelSection>
      )}

      {currentStep === 2 && (
        <LeftPanelSection title="工序二：价态调控参数">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">
                {params.systemId === 'ti-fe'
                  ? '铁屑投料量'
                  : params.systemId === 'ni-co-li'
                  ? 'H₂O₂ 还原剂投料量'
                  : 'H₂O₂ 氧化剂投料量'}
              </label>
              <SegmentedControl
                options={[
                  { label: '投料充分', value: 'sufficient' },
                  { label: '投料不足', value: 'insufficient' },
                ]}
                value={params.oxidantAmount}
                onChange={(val) => updateParam('oxidantAmount', val)}
              />
            </div>

            <div
              className={`p-2 rounded-lg border text-xs leading-tight flex items-start gap-1.5 ${
                params.oxidantAmount === 'sufficient'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {params.oxidantAmount === 'sufficient' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <span>
                {params.oxidantAmount === 'sufficient'
                  ? '反应物料充分：杂质价态已调控完毕，为后续分步沉淀分离提供纯净窗口。'
                  : '反应物料不足：残留低价/高价杂质将在沉淀阶段造成严重共沉淀！'}
              </span>
            </div>
          </div>
        </LeftPanelSection>
      )}

      {currentStep === 3 && (
        <LeftPanelSection title="工序三：沉淀除杂参数">
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-600">
                  调 pH 试剂选择 (不增杂决策)
                </label>
                <span className="text-[10px] text-indigo-600 font-mono">
                  {currentEvaluation?.category === 'target-compound' ? '主产物难溶物' : '外来试剂'}
                </span>
              </div>
              <SegmentedControl
                options={reagentOptions}
                value={params.reagent}
                onChange={(val) => updateParam('reagent', val)}
                cols={2}
              />

              {currentEvaluation && (
                <div
                  className={`mt-2 p-2 rounded text-[11px] flex flex-col gap-1 border leading-tight ${
                    currentEvaluation.isRecommended
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    {currentEvaluation.isRecommended ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <span className="font-semibold">
                      {currentEvaluation.isRecommended
                        ? '符合不增杂原则：消耗 H⁺ 提高 pH，引入阳离子即为主产物阳离子。'
                        : currentEvaluation.warning}
                    </span>
                  </div>

                  {currentEvaluation.reaction && (
                    <div className="mt-0.5 pt-1 border-t border-black/5 font-mono text-[10px] text-slate-700">
                      机理方程式: {currentEvaluation.reaction}
                    </div>
                  )}
                </div>
              )}
            </div>

            <ParamControl
              params={[
                {
                  key: 'pH',
                  label: '沉淀槽 pH',
                  value: params.pH,
                  min: 0,
                  max: 14,
                  step: 0.1,
                  unit: '',
                },
              ]}
              onParamChange={(key, val) => updateParam(key as keyof IndustrialFlowParams, val)}
            />

            <div
              className={`p-2.5 rounded-lg border text-xs flex flex-col gap-1 transition-all ${
                isPhInSafeRange
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : !hasSafeRange
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>理论安全分离区间</span>
                <span className="font-mono bg-white/70 px-1.5 py-0.5 rounded border border-black/5">
                  {hasSafeRange ? `[${safePhRange[0]} ~ ${safePhRange[1]}]` : '无可行区间'}
                </span>
              </div>
              <p className="text-[11px] opacity-90 leading-tight">{safeRangeDescription}</p>
            </div>
          </div>
        </LeftPanelSection>
      )}

      {currentStep === 4 && (
        <LeftPanelSection title="工序四：结晶与洗涤参数">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">
                结晶方式
              </label>
              <SegmentedControl
                options={[
                  { label: '降温结晶', value: 'cooling' },
                  { label: '蒸发浓缩', value: 'evaporation' },
                ]}
                value={params.crystallizeMethod}
                onChange={(val) => updateParam('crystallizeMethod', val)}
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">
                洗涤试剂
              </label>
              <SegmentedControl
                options={[
                  { label: '无水乙醇', value: 'ethanol' },
                  { label: '冷水洗涤', value: 'water' },
                ]}
                value={params.washSolvent}
                onChange={(val) => updateParam('washSolvent', val)}
              />
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-tight">
              {params.washSolvent === 'ethanol'
                ? '无水乙醇洗涤：洗去表面杂质；降低晶体溶解损耗；易挥发便于快速干燥。'
                : '冷水洗涤：洗去表面残留可溶性杂质离子，降低晶体常温溶解损耗。'}
            </div>
          </div>
        </LeftPanelSection>
      )}

      {/* 4. 教学提示与启发 (严格遵循《AGENTS.md》铁律 3C 规范) */}
      <LeftPanelSection title="教学提示与探究指引">
        <div className="flex flex-col gap-2 text-xs leading-relaxed text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200">
          <div>
            <span className="font-bold text-slate-800">实验条件：</span>
            <span>
              {currentStep === 1
                ? '强酸性介质 (稀 H₂SO₄/HCl)，加热恒温搅拌，非均相固液反应。'
                : currentStep === 2
                ? '常温弱酸性溶液，精准控制氧化还原当量，避免过度氧化。'
                : currentStep === 3
                ? '微酸至中性环境，选用主金属难溶碱/氧化物，分步水解沉淀。'
                : '常温/冰水/醇相洗涤，降温结晶或蒸发浓缩固液相分离。'}
            </span>
          </div>
          <div>
            <span className="font-bold text-slate-800">核心设问：</span>
            <span className="text-indigo-950 font-medium">{activeStepInfo.coreQuestion}</span>
          </div>
          <div>
            <span className="font-bold text-slate-800">观察指引：</span>
            <span>
              {currentStep === 1
                ? '调节温度滑块与矿石粒度，观察中屏动力学曲线斜率与平台拐点。'
                : currentStep === 2
                ? '对比投料充分与不足，观察中屏微观共沉淀柱状图与安全窗口的开启。'
                : currentStep === 3
                ? '拖动沉淀 pH 滑块，观察中屏 lg c-pH 曲线交点与沉淀完全线 (-5) 的关系。'
                : '观察中屏主产品与杂质两条溶解度曲线随温度下降的析出差异。'}
            </span>
          </div>
        </div>
      </LeftPanelSection>
    </LeftPanel>
  )
}
