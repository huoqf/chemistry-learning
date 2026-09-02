import React, { useState } from 'react'
import { ChemistryPanel } from '@/components/UI'
import { Layers, CheckCircle, Award, HelpCircle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import type { IndustrialFlowChemistry, IndustrialFlowParams } from '../types'
import type { GaokaoModelNode } from '@/data/gaokaoModels'

interface IndustrialFlowRightPanelProps {
  chemistry: IndustrialFlowChemistry
  params: IndustrialFlowParams
  model?: GaokaoModelNode
}

export const IndustrialFlowRightPanel: React.FC<IndustrialFlowRightPanelProps> = ({
  chemistry,
  params,
}) => {
  const [showMatrix, setShowMatrix] = useState(false)
  const { pH, reagent } = params
  const {
    ions,
    safePhRange,
    isPhInSafeRange,
    isOxidized,
    elementFates,
    activeStepInfo,
  } = chemistry

  const currentStep = params.activeStep || 3

  // 1. 动态生成化学量列表 (随工序 activeStep 精准同步)
  const quantities = [
    ...(currentStep === 1
      ? [
          {
            label: '主金属酸浸出率',
            value: `${chemistry.leachRate.toFixed(1)}`,
            unit: '%',
            color: chemistry.leachRate > 80 ? 'emerald' : 'amber',
            description: `当前温度 ${params.leachTemp}℃，粒度：${
              params.crushSize === 'fine' ? '细粉' : params.crushSize === 'medium' ? '中等' : '粗粒'
            }`,
          },
          {
            label: '反应釜浸出温度',
            value: `${params.leachTemp}`,
            unit: '℃',
            color: 'blue',
            description: '浸出温度每升高 10℃，固液非均相反应速率显著加快',
          },
        ]
      : currentStep === 2
      ? [
          {
            label: '氧化剂 / 还原剂当量',
            value: params.oxidantAmount === 'sufficient' ? '100% 充分' : '不足 (约 40%)',
            unit: '',
            color: params.oxidantAmount === 'sufficient' ? 'emerald' : 'rose',
            description:
              params.oxidantAmount === 'sufficient'
                ? '杂质离子价态已完全调控，完全杜绝共沉淀隐患'
                : '反应物料不足，残留大量低价/高价杂质离子',
          },
          {
            label: '价态调控完成度',
            value: isOxidized ? '已完成转化' : '未充分转化',
            unit: '',
            color: isOxidized ? 'emerald' : 'amber',
            description: 'Fe²⁺ 氧化为 Fe³⁺，或 Fe³⁺ 还原为 Fe²⁺',
          },
        ]
      : currentStep === 3
      ? [
          {
            label: '沉淀槽当前 pH',
            value: `${pH.toFixed(1)}`,
            unit: '',
            color: isPhInSafeRange ? 'emerald' : 'amber',
            description: isPhInSafeRange
              ? `处于最佳分离区间 [${safePhRange[0]} ~ ${safePhRange[1]}]`
              : `理论安全区间为 [${safePhRange[0]} ~ ${safePhRange[1]}]`,
          },
          ...ions.map((ion) => ({
            label: `${ion.name} (${ion.symbol})`,
            value:
              ion.cCurrent < 1e-4 ? ion.cCurrent.toExponential(2) : `${ion.cCurrent.toFixed(3)}`,
            unit: 'mol/L',
            color: ion.precipitateRatio > 95 ? 'amber' : 'blue',
            description: `沉淀率: ${ion.precipitateRatio}% (完全沉淀 pH=${ion.pHEnd})`,
          })),
        ]
      : [
          {
            label: '目标金属全流程综合收率 η',
            value: `${chemistry.massBalance?.crystallizeYieldRatio ?? 82.5}%`,
            unit: '',
            color: 'emerald',
            description: `投入基准 100% ${
              chemistry.massBalance?.targetElement ?? '主金属'
            }，扣除酸浸渣、中和渣夹带与母液循环后的最终净回收率`,
          },
          {
            label: '结晶工艺路径',
            value: params.crystallizeMethod === 'cooling' ? '降温结晶' : '蒸发浓缩结晶',
            unit: '',
            color: 'blue',
            description: '依据主产品溶解度随温度陡增特性，优选降温结晶',
          },
          {
            label: '洗涤纯化介质',
            value: params.washSolvent === 'ethanol' ? '无水乙醇' : '冰水/冷水',
            unit: '',
            color: 'emerald',
            description:
              params.washSolvent === 'ethanol'
                ? '减少晶体在水中的溶解损耗，且易挥发速干'
                : '洗涤去除晶体表面附着的可溶性杂质离子',
          },
        ]),
  ]

  // 2. 动态生成 Katex 公式列表 (随工序 activeStep 精准同步聚焦)
  const formulas = [
    ...(currentStep === 1
      ? [
          params.systemId === 'fe-al-mn'
            ? {
                name: '软锰矿还原酸浸反应式 (Fe²⁺ 还原剂)',
                latex: 'MnO_2 + 2Fe^{2+} + 4H^+ = Mn^{2+} + 2Fe^{3+} + 2H_2O',
                note: 'MnO₂ 不溶于稀硫酸，必须加入 Fe²⁺/草酸/H₂O₂ 将 +4 价 Mn 还原为可溶的 Mn²⁺ 溶出。',
              }
            : params.systemId === 'ni-co-li'
            ? {
                name: '三元正极 H₂O₂ 还原酸浸反应式',
                latex: '2LiCoO_2 + H_2O_2 + 3H_2SO_4 = 2CoSO_4 + Li_2SO_4 + O_2\\uparrow + 4H_2O',
                note: '高价 Co(III) 强氧化性，H₂O₂ 在此反应中作还原剂，生成易溶的 Co²⁺ 离子。',
              }
            : {
                name: '矿石金属氧化物酸溶反应通式',
                latex: 'MO + 2H^+ = M^{2+} + H_2O',
                note: '利用稀硫酸与碱性氧化物反应，使金属元素进入溶液，难溶脉石留在滤渣中。',
              },
        ]
      : currentStep === 2
      ? [
          params.systemId === 'ti-fe'
            ? {
                name: '钛铁矿加铁屑还原反应式',
                latex: '2Fe^{3+} + Fe = 3Fe^{2+}',
                note: '逆向还原防止易水解的 Fe³⁺ 水解污染钛酸，Fe²⁺ 留在溶液中通过冷冻结晶析出绿矾。',
              }
            : {
                name: 'H₂O₂ 氧化 Fe²⁺ 离子方程式',
                latex: '2Fe^{2+} + H_2O_2 + 2H^+ = 2Fe^{3+} + 2H_2O',
                note: '将难沉淀的 Fe²⁺ 氧化为低 pH 即可沉淀完全的 Fe³⁺；还原产物为 H₂O，不增杂质。',
              },
        ]
      : currentStep === 3
      ? [
          {
            name: '沉淀完全 pH 理论推导公式',
            latex: 'pOH = -\\lg c(OH^-) = \\frac{\\lg K_{sp} - \\lg(10^{-5})}{n}',
            note: '高考规定离子残余浓度 c ≤ 10⁻⁵ mol/L 即认为沉淀完全，由 Ksp 算出所需最小 pH。',
          },
          {
            name: `调 pH 试剂反应 (${reagent} 消耗 H⁺ 不增杂)`,
            latex:
              reagent === 'MnO'
                ? 'MnO + 2H^+ = Mn^{2+} + H_2O'
                : reagent === 'ZnO'
                ? 'ZnO + 2H^+ = Zn^{2+} + H_2O'
                : reagent === 'MgO'
                ? 'MgO + 2H^+ = Mg^{2+} + H_2O'
                : `${reagent} + 2H^+ = 阳离子 + H_2O`,
            note: `选用含主产品的试剂消耗 H⁺ 促使水解沉淀，引入阳离子即为主产物阳离子，不增新杂质。`,
          },
        ]
      : [
          params.systemId === 'fe-cu-zn'
            ? {
                name: '过量锌粉置换深度除铜反应式',
                latex: 'Zn + Cu^{2+} = Zn^{2+} + Cu\\downarrow',
                note: '铜锌沉淀 pH 过于接近无法通过调 pH 分离，故利用金属活动性加入 Zn 置换除去 Cu。',
              }
            : params.systemId === 'ti-fe'
            ? {
                name: '加热稀释水解制备偏钛酸反应式',
                latex: 'TiOSO_4 + 2H_2O \\xlongequal{\\Delta} H_2TiO_3\\downarrow + H_2SO_4',
                note: '水解吸热，加热与稀释均促进水解平衡正向移动，生成偏钛酸沉淀经煅烧得钛白粉。',
              }
            : {
                name: '硫酸盐晶体结晶析出通式',
                latex: 'MSO_4 + nH_2O = MSO_4\\cdot nH_2O\\downarrow',
                note: '降温结晶或蒸发浓缩结晶，通过控制结晶温度防止发生水解或晶型转化。',
              },
        ]),
  ]

  // 3. 高考要点总结与标准答题模板 (随工序 activeStep 精准同步聚焦)
  const gaokaoPoints = [
    ...(currentStep === 1
      ? [
          {
            text: '【提高浸出率的四项高考满分措施】：① 矿石粉碎研磨（增大固液接触面积，加快反应速率）；② 适当提高酸浸温度；③ 充分搅拌反应液；④ 适当提高酸的浓度。',
            importance: 'gaokao' as const,
          },
          {
            text: '【浸出温度选择原则】：温度过低反应速率慢、浸出率低；温度过高会导致酸挥发损耗、能耗增大或特定试剂（如 H₂O₂）受热分解。',
            importance: 'basic' as const,
          },
        ]
      : currentStep === 2
      ? [
          {
            text: '【为什么除杂前必须氧化 Fe²⁺】：Fe²⁺ 完全沉淀需 pH≥8.95，已超过许多金属析出点，直接调碱会造成严重共沉淀；氧化成 Fe³⁺ 后在 pH 3.2 即可完全沉淀，拉开纯净分离窗口。',
            importance: 'gaokao' as const,
          },
          {
            text: '【绿色氧化剂 H₂O₂ 的高考满分评价】：氧化产物为 H₂O，绿色环保且不引入任何难除的新杂质离子。',
            importance: 'basic' as const,
          },
        ]
      : currentStep === 3
      ? [
          {
            text: '【调 pH 不增杂原则】：选用主产品金属的氧化物、氢氧化物或碳酸盐（如 MnO、ZnO、MgO），消耗 H⁺ 提高 pH，同时不引入难除的新杂质。',
            importance: 'gaokao' as const,
          },
          {
            text: '【安全 pH 区间确定原则】：下限保证杂质离子完全沉淀（残余 c ≤ 10⁻⁵ mol/L），上限防止主目标产物发生沉淀析出损失，或防止 Al(OH)₃ 发生两性反溶。',
            importance: 'gaokao' as const,
          },
        ]
      : [
          {
            text: '【蒸发浓缩与趁热过滤两大核心目的】：① 溶解度随温度升高显著增大的物质采用降温结晶；② 趁热过滤能防止目标产物随温度降低析出损失，或防止高温下未析出的杂质混入晶体。',
            importance: 'gaokao' as const,
          },
          {
            text: '【无水乙醇洗涤晶体的三大目的】：① 洗去晶体表面附着的可溶性杂质；② 减少晶体在洗涤剂中的溶解损耗（醇溶性低）；③ 无水乙醇易挥发，便于晶体快速干燥。',
            importance: 'hard' as const,
          },
          {
            text: '【检验沉淀洗涤干净的标准四步法】：① 取少许最后一次洗涤滤液于试管中；② 滴加指示剂试剂（如硝酸酸化的 BaCl₂ 或 AgNO₃）；③ 若无白色沉淀生成；④ 说明沉淀已洗涤干净。',
            importance: 'gaokao' as const,
          },
        ]),
  ]

  // 4. 易错警示 (全面联动试剂选择、氧化状态与 pH 偏离)
  const currentReagentEval = chemistry.reagentEvaluations.find((r) => r.reagent === reagent)

  const warnings = [
    ...(!isOxidized && params.systemId !== 'ti-fe'
      ? [
          {
            text: '【严重共沉淀隐患】：未加充分 H₂O₂，Fe²⁺ 沉淀完全需 pH≥8.95，已高于目标离子开始沉淀点，两者严重共沉淀！必须先氧化为 Fe³⁺。',
            level: 'danger' as const,
          },
        ]
      : []),
    ...(!chemistry.hasSafeRange
      ? [
          {
            text: '【无可行分离窗口】：杂质完全沉淀所需 pH 已高于目标离子耐受上限，直接调 pH 必导致产物损失！',
            level: 'danger' as const,
          },
        ]
      : !isPhInSafeRange
      ? [
          {
            text:
              pH < safePhRange[0]
                ? `【沉淀除杂不完全】：当前 pH=${pH.toFixed(1)} < ${safePhRange[0]}，杂质 Fe³⁺/Al³⁺ 余量浓度 > 10⁻⁵ mol/L！`
                : `【产物沉淀损失 / 两性反溶】：当前 pH=${pH.toFixed(1)} > ${safePhRange[1]}，主产物已发生沉淀析出，或 Al(OH)₃ 两性反溶！`,
            level: 'warning' as const,
          },
        ]
      : []),
    ...(currentReagentEval && !currentReagentEval.isRecommended && currentReagentEval.warning
      ? [
          {
            text:
              reagent === 'NaOH'
                ? `【高考评价失分】：NaOH 是强碱，缺乏难溶碱的“自限性”，易造成局部过碱引起 Al(OH)₃ 两性反溶与主产物沉淀损耗；且引入 Na⁺ 无法结晶分离，高考试卷判 0 分！`
                : `【试剂违背不增杂原则】：当前选用 ${reagent}，${currentReagentEval.warning}。`,
            level: 'danger' as const,
          },
        ]
      : []),
  ]

  return (
    <div className="w-full h-full p-3.5 overflow-y-auto bg-white border-l border-slate-200 flex flex-col gap-3">
      {/* 元素走向追踪矩阵 (高考工艺流程核心思维模型，恒定顶置锚点) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            全流程元素走向追踪矩阵 (高考解题主干)
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">抓主线 · 盯杂质</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-medium">
                <th className="py-1 pl-1 font-normal">元素角色</th>
                <th className="py-1 font-normal">初始物相</th>
                <th className="py-1 font-normal">酸浸形态</th>
                <th className="py-1 font-normal">分离工序</th>
                <th className="py-1 pr-1 font-normal">最终去向</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {elementFates.map((item) => (
                <tr
                  key={item.element}
                  className={`hover:bg-slate-100/60 transition-colors ${
                    item.isTarget ? 'bg-emerald-50/70 font-semibold text-emerald-900' : 'text-slate-700'
                  }`}
                >
                  <td className="py-1.5 pl-1 flex items-center gap-1">
                    {item.isTarget && <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />}
                    <span>{item.element}</span>
                  </td>
                  <td className="py-1.5 font-mono text-[10px]">{item.rawState}</td>
                  <td className="py-1.5 font-mono text-[10px] text-slate-600">{item.leachState}</td>
                  <td className="py-1.5 text-[10.5px]">{item.separationStep}</td>
                  <td className="py-1.5 pr-1 font-mono text-[10px] text-slate-600">{item.finalState}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 当前工序专属答题采分卡 (与左中屏 activeStep 强联动) */}
      <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-3 shadow-xs flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            当前工序必考设问
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">
            满分答题规范
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-800 leading-snug">
          {activeStepInfo.coreQuestion}
        </p>

        <div className="p-2 rounded-lg bg-white border border-indigo-100 text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-indigo-900 font-bold block mb-0.5">采分点标答：</strong>
            <span>{activeStepInfo.scoringAnswer}</span>
          </div>
        </div>
      </div>

      {/* 高考解题全景决策与四维自查矩阵 (点击展开/折叠，赋能系统理解记忆与提分) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-all">
        <button
          type="button"
          onClick={() => setShowMatrix((prev) => !prev)}
          className="w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-100/70 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">
              高考工艺流程四维解题与自查矩阵 (点击背诵)
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>{showMatrix ? '收起矩阵' : '展开矩阵'}</span>
            {showMatrix ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
        </button>

        {showMatrix && (
          <div className="p-3 pt-1 border-t border-slate-200 flex flex-col gap-2.5 text-xs">
            <div className="p-2 rounded bg-indigo-50/60 border border-indigo-100 text-indigo-900 leading-snug">
              <strong className="font-semibold block mb-0.5">矩阵记忆导读：</strong>
              高中化学工艺流程题（14~15分）核心由这 4 个维度的正交组合构成。先看原料特征与杂质价态，再定分离 pH 窗口与纯化提取方式。
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-2 rounded bg-white border border-slate-200">
                <div className="font-bold text-slate-800 mb-0.5 text-[11.5px] text-indigo-700">
                  维度一 · 原料破矿与浸出动力学
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>可选项：</strong> 粗块/细粉 · 常温/60~80℃ · 稀硫酸/盐酸/碱浸 · 是否加还原剂。<br />
                  <strong>提分标答：</strong> 矿石粉碎增大固液接触面积加快浸出；升高温度加快反应速率，但过高会导致酸挥发或氧化剂分解。
                </div>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200">
                <div className="font-bold text-slate-800 mb-0.5 text-[11.5px] text-indigo-700">
                  维度二 · 氧化还原与价态调控 (打开分离窗口)
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>可选项：</strong> H₂O₂ 绿色氧化 / 铁屑还原 / 还原剂当量 (100%充分 vs 不足)。<br />
                  <strong>提分标答：</strong> 将难沉淀的 Fe²⁺ 氧化为 Fe³⁺，使沉淀完全 pH 由 8.95 降至 3.20，拉开与主金属分离的安全 pH 窗口；H₂O₂ 产物为水，不增新杂质。
                </div>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200">
                <div className="font-bold text-slate-800 mb-0.5 text-[11.5px] text-indigo-700">
                  维度三 · Ksp 沉淀溶解平衡与调 pH 不增杂
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>可选项：</strong> 主产物氧化物/碳酸盐 · 强碱 NaOH · 目标安全 pH 区间。<br />
                  <strong>提分标答：</strong> 消耗 H⁺ 促进杂质水解沉淀，引入阳离子为主产物离子（不引杂）；下限保证杂质 c≤10⁻⁵ mol/L，上限防止目标离子析出损失。
                </div>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200">
                <div className="font-bold text-slate-800 mb-0.5 text-[11.5px] text-indigo-700">
                  维度四 · 结晶分离、洗涤检验与质量闭环
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>可选项：</strong> 蒸发浓缩冷却结晶 / 趁热过滤 · 冷水洗 / 无水乙醇洗。<br />
                  <strong>提分标答：</strong> 乙醇洗涤洗去杂质、降低晶体在水中的溶解损耗且易挥发速干；取最后一次洗涤液滴加试剂无沉淀证明洗净。
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 统一 ChemistryPanel 展示定量量、公式、高考答题模板与警示 (scrollable={false} 杜绝双层嵌套滚动条) */}
      <ChemistryPanel
        scrollable={false}
        quantities={quantities}
        formulas={formulas}
        gaokaoPoints={gaokaoPoints}
        warnings={warnings}
      />
    </div>
  )
}
