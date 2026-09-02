/**
 * src/features/industrial-flow/components/IndustrialFlowSvgFlowchart.tsx
 * 母题七：无机工艺流程与沉淀调 pH 工具 - 高考标准方框工艺流程图 (SVG 矢量流向图)
 */

import React from 'react'
import { withAlpha } from '@/theme'
import type { IndustrialFlowSystemId, IndustrialFlowChemistry } from '../types'

interface IndustrialFlowSvgFlowchartProps {
  systemId: IndustrialFlowSystemId
  activeStep: number // 1: 浸出, 2: 氧化/预处理, 3: 调pH除杂, 4: 固液分离/结晶
  onSelectStep: (step: number) => void
  chemistry: IndustrialFlowChemistry
  pH: number
}

interface StepNodeConfig {
  step: number
  title: string
  subTitle: string
  reagentIn?: string
  wasteOut?: string
  filtrateOut?: string
  statusTag?: string
  statusColor?: string
}

export const IndustrialFlowSvgFlowchart: React.FC<IndustrialFlowSvgFlowchartProps> = ({
  systemId,
  activeStep,
  onSelectStep,
  chemistry,
  pH,
}) => {
  const { isPhInSafeRange, isOxidized, leachRate } = chemistry

  // 根据 5 大系统定义节点流向元数据
  const getNodeConfigs = (): StepNodeConfig[] => {
    if (systemId === 'fe-al-mn') {
      return [
        {
          step: 1,
          title: '还原酸浸槽',
          subTitle: '破矿浸出',
          reagentIn: '稀H₂SO₄ + FeSO₄',
          wasteOut: '滤渣I: SiO₂等',
          filtrateOut: '含 Mn²⁺,Fe²⁺,Al³⁺',
          statusTag: `浸出率 ${leachRate}%`,
          statusColor: '#d97706',
        },
        {
          step: 2,
          title: '氧化反应槽',
          subTitle: 'Fe²⁺➔Fe³⁺',
          reagentIn: 'H₂O₂ 溶液',
          filtrateOut: '含 Mn²⁺,Fe³⁺,Al³⁺',
          statusTag: isOxidized ? '已氧化 Fe³⁺' : '未氧化 (含Fe²⁺)',
          statusColor: isOxidized ? '#059669' : '#e11d48',
        },
        {
          step: 3,
          title: '调 pH 沉淀槽',
          subTitle: '除 Fe³⁺ / Al³⁺',
          reagentIn: 'MnO / MnCO₃',
          wasteOut: '滤渣II: Fe(OH)₃, Al(OH)₃',
          filtrateOut: '高纯 MnSO₄ 滤液',
          statusTag: isPhInSafeRange ? `pH=${pH.toFixed(1)} 最佳` : `pH=${pH.toFixed(1)} 偏离`,
          statusColor: isPhInSafeRange ? '#059669' : '#d97706',
        },
        {
          step: 4,
          title: '蒸发浓缩结晶',
          subTitle: '产物提取',
          reagentIn: '无水乙醇洗涤',
          wasteOut: '母液循环',
          filtrateOut: 'MnSO₄·H₂O 晶体',
          statusTag: '趁热过滤防析出',
          statusColor: '#7c3aed',
        },
      ]
    } else if (systemId === 'fe-cu-zn') {
      return [
        {
          step: 1,
          title: '矿渣酸浸槽',
          subTitle: '酸溶固液接触',
          reagentIn: '稀 H₂SO₄',
          wasteOut: '浸出渣 (不溶脉石)',
          filtrateOut: '含 Zn²⁺,Cu²⁺,Fe²⁺',
          statusTag: `浸出率 ${leachRate}%`,
          statusColor: '#d97706',
        },
        {
          step: 2,
          title: '氧化反应池',
          subTitle: 'Fe²⁺➔Fe³⁺',
          reagentIn: 'H₂O₂',
          filtrateOut: '含 Zn²⁺,Cu²⁺,Fe³⁺',
          statusTag: isOxidized ? 'Fe³⁺ 充分氧化' : '氧化不足 (含Fe²⁺)',
          statusColor: isOxidized ? '#059669' : '#e11d48',
        },
        {
          step: 3,
          title: '中和除铁铝',
          subTitle: '调 pH 沉淀',
          reagentIn: 'ZnO 矿粉',
          wasteOut: '中和渣: Fe(OH)₃,Al(OH)₃',
          filtrateOut: '含 Zn²⁺,Cu²⁺ 滤液',
          statusTag: isPhInSafeRange ? `pH=${pH.toFixed(1)} 安全` : `pH=${pH.toFixed(1)} 需调控`,
          statusColor: isPhInSafeRange ? '#059669' : '#d97706',
        },
        {
          step: 4,
          title: '锌粉置换除铜',
          subTitle: '深度除杂与结晶',
          reagentIn: '过量 Zn 粉',
          wasteOut: '铜置换渣 (Cu)',
          filtrateOut: 'ZnSO₄·7H₂O 晶体',
          statusTag: '置换深度除重金属',
          statusColor: '#7c3aed',
        },
      ]
    } else if (systemId === 'ti-fe') {
      return [
        {
          step: 1,
          title: '钛铁矿酸浸',
          subTitle: '浓 H₂SO₄ 浸取',
          reagentIn: '浓硫酸 + 破矿',
          wasteOut: '滤渣: 不溶脉石',
          filtrateOut: '含 TiOSO₄,Fe²⁺,Fe³⁺',
          statusTag: `浸出率 ${leachRate}%`,
          statusColor: '#d97706',
        },
        {
          step: 2,
          title: '加铁屑还原',
          subTitle: 'Fe³⁺➔Fe²⁺防水解',
          reagentIn: '铁屑 (Fe)',
          filtrateOut: '全 Fe²⁺ 钛液',
          statusTag: '逆向思维：防止Fe³⁺混杂',
          statusColor: '#2563eb',
        },
        {
          step: 3,
          title: '冷冻结晶副产',
          subTitle: '分离铁副产物',
          reagentIn: '冷却降温',
          wasteOut: '绿矾: FeSO₄·7H₂O 晶体',
          filtrateOut: '净化富钛液',
          statusTag: '结晶析出绿矾',
          statusColor: '#059669',
        },
        {
          step: 4,
          title: '加热水解煅烧',
          subTitle: '制钛酸与白粉',
          reagentIn: '加热稀释水解',
          wasteOut: '稀硫酸回收',
          filtrateOut: '煅烧得高纯 TiO₂',
          statusTag: '水解产 H₂TiO₃',
          statusColor: '#7c3aed',
        },
      ]
    } else if (systemId === 'ni-co-li') {
      return [
        {
          step: 1,
          title: '正极还原酸浸',
          subTitle: '酸浸与高价还原',
          reagentIn: 'H₂SO₄ + H₂O₂ (还原剂)',
          wasteOut: '炭黑/PVDF 滤渣',
          filtrateOut: '含 Co²⁺,Ni²⁺,Li⁺,Fe³⁺,Al³⁺',
          statusTag: 'H₂O₂ 作还原剂',
          statusColor: '#d97706',
        },
        {
          step: 2,
          title: '调 pH 沉淀除杂',
          subTitle: '水解脱铁铝',
          reagentIn: 'Li₂CO₃ / 氨水',
          wasteOut: '滤渣: Fe(OH)₃,Al(OH)₃',
          filtrateOut: '含 Co²⁺,Ni²⁺,Li⁺,Ca²⁺,Mg²⁺',
          statusTag: isPhInSafeRange ? 'Fe/Al 水解彻底' : '注意 pH 控制',
          statusColor: isPhInSafeRange ? '#059669' : '#d97706',
        },
        {
          step: 3,
          title: '加入 NaF 除钙镁',
          subTitle: '深度沉淀转化',
          reagentIn: 'NaF 溶液',
          wasteOut: '氟化物渣: CaF₂,MgF₂',
          filtrateOut: '除杂后锂电池主液',
          statusTag: 'Ksp极小沉淀除杂',
          statusColor: '#059669',
        },
        {
          step: 4,
          title: '萃取分离结晶',
          subTitle: '高纯盐提取',
          reagentIn: 'P507 / 碳酸钠',
          wasteOut: '萃取有机相循环',
          filtrateOut: 'CoSO₄ / Li₂CO₃ 晶体',
          statusTag: '分步回收主价值金属',
          statusColor: '#7c3aed',
        },
      ]
    } else {
      // mg-ca
      return [
        {
          step: 1,
          title: '白云石酸溶',
          subTitle: '矿粉浸出',
          reagentIn: '稀盐酸 / 硫酸',
          wasteOut: '滤渣: SiO₂ 泥沙',
          filtrateOut: '含 Mg²⁺,Ca²⁺,Fe³⁺,Al³⁺',
          statusTag: `浸出率 ${leachRate}%`,
          statusColor: '#d97706',
        },
        {
          step: 2,
          title: '调 pH 沉淀铁铝',
          subTitle: '中和水解',
          reagentIn: 'MgO 浆料',
          wasteOut: '滤渣: Fe(OH)₃,Al(OH)₃',
          filtrateOut: '含 Mg²⁺,Ca²⁺ 溶液',
          statusTag: 'MgO 不增杂中和',
          statusColor: '#059669',
        },
        {
          step: 3,
          title: '沉淀分离 Ca²⁺',
          subTitle: '草酸盐沉淀',
          reagentIn: '(NH₄)₂C₂O₄ 溶液',
          wasteOut: 'CaC₂O₄ 沉淀分离',
          filtrateOut: '纯净 Mg²⁺ 滤液',
          statusTag: 'Ksp 差异选择沉淀',
          statusColor: '#059669',
        },
        {
          step: 4,
          title: '加碱沉镁煅烧',
          subTitle: '制高纯氧化镁',
          reagentIn: 'NaOH 沉淀 + 煅烧',
          wasteOut: '母液中和外排',
          filtrateOut: '高纯 MgO 产物',
          statusTag: 'Mg(OH)₂ 煅烧得 MgO',
          statusColor: '#7c3aed',
        },
      ]
    }
  }

  const nodes = getNodeConfigs()
  const { massBalance } = chemistry
  const {
    targetElement,
    leachLossRatio,
    leachSolutionRatio,
    precipitateLossRatio,
    purifiedSolutionRatio,
    crystallizeYieldRatio,
    motherLiquorRatio,
  } = massBalance || {
    targetElement: 'Mn',
    leachLossRatio: 8.8,
    leachSolutionRatio: 91.2,
    precipitateLossRatio: 1.8,
    purifiedSolutionRatio: 89.4,
    crystallizeYieldRatio: 82.5,
    motherLiquorRatio: 6.9,
  }

  // SVG 布局拓扑常数 (全新 780 x 185 网格，彻底释放各元素呼吸空间)
  const nodeWidth = 138
  const nodeHeight = 84
  const startX = 44
  const gapX = 42
  const nodeY = 46

  return (
    <div className="w-full h-full flex flex-col select-none relative">
      {/* 顶部标题栏与当前状态 HUD */}
      <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-slate-100 bg-slate-50/70 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block animate-pulse" />
            高考工艺流程图与元素质量守恒流 (基准 100% {targetElement})
          </span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            原料 ➔ 反应槽 ➔ 固液分离 (滤渣/滤液) ➔ 产物
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">当前聚焦:</span>
          <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px]">
            工序 {activeStep}：{nodes[activeStep - 1]?.title}
          </span>
          <span className="font-mono text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
            综合收率: {crystallizeYieldRatio}%
          </span>
        </div>
      </div>

      {/* SVG 画布主体 (保持与外层 225px 容器完美吻合) */}
      <div className="flex-1 w-full relative overflow-hidden flex items-center justify-center px-2 py-1">
        <svg
          viewBox="0 0 780 185"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* 选中高亮呼吸阴影 Filter */}
            <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#4f46e5" floodOpacity="0.28" />
            </filter>
          </defs>

          {/* 1. 原料进料箭头 */}
          <line
            x1="2"
            y1={nodeY + nodeHeight / 2}
            x2={startX - 6}
            y2={nodeY + nodeHeight / 2}
            stroke="#64748b"
            strokeWidth="2.2"
          />
          <polygon
            points={`${startX - 8},${nodeY + nodeHeight / 2 - 4} ${startX - 1},${nodeY + nodeHeight / 2} ${startX - 8},${nodeY + nodeHeight / 2 + 4}`}
            fill="#64748b"
          />
          <text
            x={20}
            y={nodeY + nodeHeight / 2 - 13}
            fontSize="10"
            fill="#334155"
            fontWeight="bold"
            textAnchor="middle"
          >
            原料矿粉
          </text>
          <text
            x={20}
            y={nodeY + nodeHeight / 2 - 3}
            fontSize="8.5"
            fill="#4f46e5"
            fontWeight="bold"
            textAnchor="middle"
          >
            100% {targetElement}
          </text>

          {/* 2. 循环各反应槽节点 */}
          {nodes.map((node, idx) => {
            const x = startX + idx * (nodeWidth + gapX)
            const isActive = activeStep === node.step

            return (
              <g
                key={node.step}
                className="cursor-pointer transition-all"
                onClick={() => onSelectStep(node.step)}
              >
                {/* 进药/投料上方支路箭头 */}
                {node.reagentIn && (
                  <g>
                    <rect
                      x={x + nodeWidth / 2 - 50}
                      y={nodeY - 34}
                      width="100"
                      height="18"
                      rx="4"
                      fill="#f0f9ff"
                      stroke="#7dd3fc"
                      strokeWidth="1.2"
                    />
                    <text
                      x={x + nodeWidth / 2}
                      y={nodeY - 22}
                      fontSize="10"
                      fill="#0369a1"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {node.reagentIn}
                    </text>
                    <line
                      x1={x + nodeWidth / 2}
                      y1={nodeY - 16}
                      x2={x + nodeWidth / 2}
                      y2={nodeY - 4}
                      stroke="#0284c7"
                      strokeWidth="2"
                    />
                    <polygon
                      points={`${x + nodeWidth / 2 - 3.5},${nodeY - 5} ${x + nodeWidth / 2 + 3.5},${nodeY - 5} ${x + nodeWidth / 2},${nodeY - 1}`}
                      fill="#0284c7"
                    />
                  </g>
                )}

                {/* 反应槽矩形方框 */}
                <rect
                  x={x}
                  y={nodeY}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="8"
                  fill={isActive ? '#ffffff' : '#f8fafc'}
                  stroke={isActive ? '#4f46e5' : '#cbd5e1'}
                  strokeWidth={isActive ? '2.5' : '1.2'}
                  filter={isActive ? 'url(#node-glow)' : undefined}
                />

                {/* 槽体序号圆标 */}
                <circle
                  cx={x + 18}
                  cy={nodeY + 18}
                  r="9"
                  fill={isActive ? '#4f46e5' : '#e2e8f0'}
                />
                <text
                  x={x + 18}
                  y={nodeY + 21.5}
                  fontSize="10.5"
                  fill={isActive ? '#ffffff' : '#475569'}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {node.step}
                </text>

                {/* 槽体核心大标题 (清晰醒目) */}
                <text
                  x={x + 33}
                  y={nodeY + 22}
                  fontSize="12.5"
                  fill={isActive ? '#1e1b4b' : '#0f172a'}
                  fontWeight="bold"
                >
                  {node.title}
                </text>

                {/* 槽体副标题 (任务定位) */}
                <text
                  x={x + 12}
                  y={nodeY + 41}
                  fontSize="10.5"
                  fill="#64748b"
                >
                  {node.subTitle}
                </text>

                {/* 状态徽标 Pill (舒展大气) */}
                {node.statusTag && (
                  <g>
                    <rect
                      x={x + 10}
                      y={nodeY + 52}
                      width={nodeWidth - 20}
                      height="21"
                      rx="4"
                      fill={withAlpha(node.statusColor || '#4f46e5', 0.12)}
                      stroke={withAlpha(node.statusColor || '#4f46e5', 0.35)}
                      strokeWidth="1"
                    />
                    <text
                      x={x + nodeWidth / 2}
                      y={nodeY + 66.5}
                      fontSize="10.5"
                      fill={node.statusColor || '#4f46e5'}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {node.statusTag}
                    </text>
                  </g>
                )}

                {/* 滤渣/固相下方分离支路箭头与质量损失百分比 */}
                {node.wasteOut && (
                  <g>
                    <line
                      x1={x + nodeWidth / 2}
                      y1={nodeY + nodeHeight}
                      x2={x + nodeWidth / 2}
                      y2={nodeY + nodeHeight + 14}
                      stroke="#d97706"
                      strokeWidth="2"
                    />
                    <polygon
                      points={`${x + nodeWidth / 2 - 3.5},${nodeY + nodeHeight + 13} ${x + nodeWidth / 2 + 3.5},${nodeY + nodeHeight + 13} ${x + nodeWidth / 2},${nodeY + nodeHeight + 17}`}
                      fill="#d97706"
                    />
                    <rect
                      x={x + nodeWidth / 2 - 58}
                      y={nodeY + nodeHeight + 18}
                      width="116"
                      height="20"
                      rx="4"
                      fill="#fef3c7"
                      stroke="#fcd34d"
                      strokeWidth="1.2"
                    />
                    <text
                      x={x + nodeWidth / 2}
                      y={nodeY + nodeHeight + 32}
                      fontSize="9.5"
                      fill="#92400e"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {node.wasteOut}
                      {node.step === 1
                        ? ` (${leachLossRatio}%)`
                        : node.step === 3
                        ? ` (${precipitateLossRatio}%)`
                        : node.step === 4
                        ? ` (${motherLiquorRatio}%)`
                        : ''}
                    </text>
                  </g>
                )}

                {/* 连接下一个槽体的水平流向箭头与滤液质量守恒百分比 */}
                {idx < nodes.length - 1 && (
                  <g>
                    <line
                      x1={x + nodeWidth + 3}
                      y1={nodeY + nodeHeight / 2}
                      x2={x + nodeWidth + gapX - 6}
                      y2={nodeY + nodeHeight / 2}
                      stroke="#64748b"
                      strokeWidth="2.2"
                    />
                    <polygon
                      points={`${x + nodeWidth + gapX - 8},${nodeY + nodeHeight / 2 - 4} ${x + nodeWidth + gapX - 1},${nodeY + nodeHeight / 2} ${x + nodeWidth + gapX - 8},${nodeY + nodeHeight / 2 + 4}`}
                      fill="#64748b"
                    />
                    {/* 流向中间文本标注 (滤液流与元素保留百分比) */}
                    <text
                      x={x + nodeWidth + gapX / 2}
                      y={nodeY + nodeHeight / 2 - 13}
                      fontSize="9.5"
                      fill="#475569"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {idx === 0 ? '滤液流' : idx === 1 ? '氧化液' : '净化液'}
                    </text>
                    <text
                      x={x + nodeWidth + gapX / 2}
                      y={nodeY + nodeHeight / 2 - 3}
                      fontSize="8.5"
                      fill="#0284c7"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {idx === 0
                        ? `${leachSolutionRatio}%`
                        : idx === 1
                        ? `${leachSolutionRatio}%`
                        : `${purifiedSolutionRatio}%`}
                    </text>
                  </g>
                )}

                {/* 最终产物引出箭头与综合收率 */}
                {idx === nodes.length - 1 && (
                  <g>
                    <line
                      x1={x + nodeWidth + 3}
                      y1={nodeY + nodeHeight / 2}
                      x2={x + nodeWidth + 20}
                      y2={nodeY + nodeHeight / 2}
                      stroke="#4f46e5"
                      strokeWidth="2.4"
                    />
                    <polygon
                      points={`${x + nodeWidth + 19},${nodeY + nodeHeight / 2 - 4} ${x + nodeWidth + 25},${nodeY + nodeHeight / 2} ${x + nodeWidth + 19},${nodeY + nodeHeight / 2 + 4}`}
                      fill="#4f46e5"
                    />
                    <rect
                      x={x + nodeWidth + 26}
                      y={nodeY + nodeHeight / 2 - 16}
                      width="72"
                      height="32"
                      rx="6"
                      fill="#eef2ff"
                      stroke="#6366f1"
                      strokeWidth="1.5"
                    />
                    <text
                      x={x + nodeWidth + 62}
                      y={nodeY + nodeHeight / 2 - 1}
                      fontSize="10.5"
                      fill="#3730a3"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      高纯产物
                    </text>
                    <text
                      x={x + nodeWidth + 62}
                      y={nodeY + nodeHeight / 2 + 11}
                      fontSize="9"
                      fill="#059669"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      收率 {crystallizeYieldRatio}%
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
