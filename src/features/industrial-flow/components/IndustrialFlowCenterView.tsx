/**
 * src/features/industrial-flow/components/IndustrialFlowCenterView.tsx
 * 母题七：无机工艺流程与沉淀调 pH 工具 - 中屏平行视图 UI (高考标准规范版)
 */

import React from 'react'
import { BaseChart } from '@/components/Chart'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { CHART_COLORS, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import { Activity, ShieldCheck, AlertTriangle } from 'lucide-react'
import type { IndustrialFlowParams, IndustrialFlowChemistry } from '../types'
import type { ModelQuizData } from '@/data/quiz'

interface IndustrialFlowCenterViewProps {
  params: IndustrialFlowParams
  chemistry: IndustrialFlowChemistry
  quizData?: ModelQuizData
  updateParam: (key: keyof IndustrialFlowParams, value: any) => void
}

export const IndustrialFlowCenterView: React.FC<IndustrialFlowCenterViewProps> = ({
  params,
  chemistry,
  quizData,
}) => {
  const { viewMode, pH, systemId } = params
  const {
    systemName,
    ions,
    safePhRange,
    isPhInSafeRange,
    leachRate,
    isOxidized,
    precipitateSummary,
    filtrateSummary,
    curveData,
  } = chemistry

  const [activeNode, setActiveNode] = React.useState<number>(3) // 默认选点 3 (调 pH 沉淀)

  // 1. 视角 1: 规范踩分卡
  if (viewMode === 1) {
    return (
      <div className="w-full h-full flex flex-col p-4 bg-slate-50 overflow-y-auto">
        <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-500" />
          无机工艺流程大题 · 规范踩分模板与标准表达
        </h3>
        {quizData?.scoringSteps && quizData.scoringSteps.length > 0 ? (
          <ScoringCardSection steps={quizData.scoringSteps} />
        ) : (
          <div className="p-4 bg-white rounded-lg border text-xs text-slate-500">
            暂无踩分卡数据
          </div>
        )}
      </div>
    )
  }

  // 2. 视角 2: 高考真题变式
  if (viewMode === 2) {
    return (
      <div className="w-full h-full flex flex-col p-4 bg-slate-50 overflow-y-auto">
        <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          无机工艺流程与沉淀调 pH · 高考官方真题拆解
        </h3>
        {quizData?.variantQuizzes && quizData.variantQuizzes.length > 0 ? (
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        ) : (
          <div className="p-4 bg-white rounded-lg border text-xs text-slate-500">
            暂无真题数据
          </div>
        )}
      </div>
    )
  }

  // 3. 视角 0: 交互动画与 lg c - pH 沉淀分布曲线
  return (
    <div className="w-full h-full flex flex-col bg-slate-50 p-3 gap-3 overflow-hidden select-none">
      {/* 上半部分：工序流程节点全景 SVG */}
      <div className="w-full h-[225px] bg-white rounded-xl border border-slate-200 p-3 flex flex-col justify-between shrink-0 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-800">{systemName}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
              点击流程节点可联动反应式
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-600">
              浸出率: <strong className="text-indigo-600 font-mono">{leachRate}%</strong>
            </span>
            <span className="text-slate-600">
              当前 pH: <strong className="text-indigo-600 font-mono">{pH.toFixed(1)}</strong>
            </span>
          </div>
        </div>

        {/* 5 大工序节点图卡 */}
        <div className="grid grid-cols-4 gap-2 my-auto items-center relative z-10">
          {/* Node 1: 原料酸浸 / 还原酸浸 */}
          <button
            onClick={() => setActiveNode(1)}
            className={`flex flex-col items-center p-2 rounded-lg border text-center gap-1 transition-all cursor-pointer ${
              activeNode === 1
                ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-200'
                : 'bg-slate-50 border-slate-200 hover:bg-amber-50'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <span className="font-bold text-[11px] text-slate-800">
              {systemId === 'fe-al-mn' || systemId === 'ni-co-li' ? '还原酸浸' : '矿石酸浸'}
            </span>
            <span className="text-[9px] text-slate-500">浸出率 {leachRate}%</span>
          </button>

          {/* Node 2: 氧化剂 / 还原剂预处理 */}
          <button
            onClick={() => setActiveNode(2)}
            className={`flex flex-col items-center p-2 rounded-lg border text-center gap-1 transition-all cursor-pointer ${
              activeNode === 2
                ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-200'
                : 'bg-slate-50 border-slate-200 hover:bg-blue-50'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-900 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <span className="font-bold text-[11px] text-slate-800">
              {systemId === 'ti-fe' ? '加铁屑还原' : 'H₂O₂ 氧化/还原'}
            </span>
            <span
              className={`text-[9px] font-semibold px-1 rounded ${
                systemId === 'ti-fe'
                  ? 'bg-indigo-100 text-indigo-800'
                  : isOxidized
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {systemId === 'ti-fe' ? 'Fe³⁺➔Fe²⁺' : isOxidized ? 'Fe²⁺➔Fe³⁺' : '氧化不足'}
            </span>
          </button>

          {/* Node 3: 调 pH 沉淀槽 (高亮) */}
          <button
            onClick={() => setActiveNode(3)}
            className={`flex flex-col items-center p-2 rounded-lg border text-center gap-1 transition-all cursor-pointer ${
              activeNode === 3
                ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300'
                : isPhInSafeRange
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-amber-50 border-amber-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                isPhInSafeRange ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
              }`}
            >
              3
            </div>
            <span className="font-bold text-[11px] text-slate-800">调 pH 沉淀</span>
            <span className="text-[9px] font-mono font-bold text-slate-700">pH={pH.toFixed(1)}</span>
          </button>

          {/* Node 4: 趁热过滤/分离 */}
          <button
            onClick={() => setActiveNode(4)}
            className={`flex flex-col items-center p-2 rounded-lg border text-center gap-1 transition-all cursor-pointer ${
              activeNode === 4
                ? 'bg-purple-100 border-purple-400 ring-2 ring-purple-200'
                : 'bg-slate-50 border-slate-200 hover:bg-purple-50'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <span className="font-bold text-[11px] text-slate-800">趁热过滤</span>
            <span className="text-[9px] text-slate-500 truncate max-w-[70px]">
              渣: {precipitateSummary}
            </span>
          </button>
        </div>

        {/* 节点点击联动动态浮框与 pH 拖动三色指导卡 */}
        <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 text-[11px] flex flex-col gap-1">
          {activeNode === 1 && (
            <div className="text-amber-900 font-semibold flex items-center justify-between">
              <span>【节点 1 反应机理】：{systemId === 'fe-al-mn' ? 'MnO₂ + 2Fe²⁺ + 4H⁺ = Mn²⁺ + 2Fe³⁺ + 2H₂O (还原酸浸)' : '稀硫酸溶解氧化物浸出金属阳离子'}</span>
              <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">浸出率 {leachRate}%</span>
            </div>
          )}
          {activeNode === 2 && (
            <div className="text-blue-900 font-semibold flex items-center justify-between">
              <span>【节点 2 反应机理】：{systemId === 'ti-fe' ? '2Fe³⁺ + Fe = 3Fe²⁺ (加铁屑还原防水解)' : '2Fe²⁺ + H₂O₂ + 2H⁺ = 2Fe³⁺ + 2H₂O (氧化为低 pH 沉淀离子)'}</span>
              <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">{isOxidized ? '已充分反应' : '反应未充分'}</span>
            </div>
          )}
          {activeNode === 3 && (
            <div
              className={`p-1.5 rounded font-semibold text-[11px] flex items-center justify-between transition-colors ${
                isPhInSafeRange
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : pH < safePhRange[0]
                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              <span>
                {isPhInSafeRange
                  ? `✨ 完美分离！Fe³⁺, Al³⁺ 已 100% 沉淀，目标离子完全保留在滤液中。`
                  : pH < safePhRange[0]
                  ? `🚨 沉淀不完全！当前 pH=${pH.toFixed(1)} < ${safePhRange[0]}，Al³⁺/Fe³⁺ 残余浓度 > 10⁻⁵ mol/L。`
                  : `⚠️ 沉淀损失！当前 pH=${pH.toFixed(1)} > ${safePhRange[1]}，目标离子已开始沉淀析出。`}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/80">
                最佳区间 [{safePhRange[0]} ~ {safePhRange[1]}]
              </span>
            </div>
          )}
          {activeNode === 4 && (
            <div className="text-purple-900 font-semibold flex items-center justify-between">
              <span>【节点 4 趁热过滤】：防止目标产物随温度降低结晶析出损失；滤渣为 {precipitateSummary}，滤液为 {filtrateSummary}。</span>
              <span className="text-[10px] text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">四步法洗涤检验</span>
            </div>
          )}
        </div>
      </div>

      {/* 下半部分：lg c - pH 沉淀分布曲线图表 */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-3 flex flex-col min-h-0 relative shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            高考真题标准：lg c - pH 沉淀溶解平衡分布曲线
          </h4>

          {/* 右上角 HUD 实时交点数据卡 (避免图表内遮挡重叠) */}
          <div className="flex items-center gap-2 text-[10px] bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            {ions.map((ion) => (
              <span key={ion.symbol} className="flex items-center gap-1 font-mono font-semibold">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: ion.color }}
                />
                {ion.symbol}:{' '}
                <strong style={{ color: ion.color }}>
                  {ion.precipitateRatio > 99.9 ? '已完全沉淀' : `${ion.cCurrent.toFixed(3)} mol/L`}
                </strong>
              </span>
            ))}
          </div>
        </div>

        {/* 图表容器：yLabel 传空字符串，采用高考真题 Y 轴顶部直立横写标注 */}
        <div className="flex-1 w-full min-h-0 relative">
          <BaseChart
            xDomain={[0, 14]}
            yDomain={[-12, 0]}
            xLabel="溶液 pH"
            yLabel=""
            showGrid={true}
          >
            {/* SVG 曲线与高考规范渲染器 */}
            <SvgCurveRenderer
              curveData={curveData}
              ions={ions}
              pH={pH}
              safePhRange={safePhRange}
            />
          </BaseChart>
        </div>

        {/* 底部状态提示条 */}
        <div className="mt-1 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">高考沉淀完全标准:</span>
            <span className="font-mono text-slate-700 font-bold">c ≤ 10⁻⁵ mol/L (lg c ≤ -5)</span>
          </div>

          <div
            className={`font-semibold flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
              isPhInSafeRange
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isPhInSafeRange ? (
              <>
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                分离 pH 范围 [{safePhRange[0]} ~ {safePhRange[1]}]
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                偏离分离 pH 范围 [{safePhRange[0]} ~ {safePhRange[1]}]
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 高考规范防重叠 SVG 曲线与节点渲染器
 */
import { ChartContext } from '@/components/Chart'

function SvgCurveRenderer({
  curveData,
  ions,
  pH,
  safePhRange,
}: {
  curveData: Array<{ pH: number; [key: string]: number }>
  ions: IndustrialFlowChemistry['ions']
  pH: number
  safePhRange: [number, number]
}) {
  const ctx = React.useContext(ChartContext)
  if (!ctx) return null

  const { toSvgX, toSvgY, plotOrigin, plotSize } = ctx

  // 1. 沉淀完全基准线 (lg c = -5)
  const lineY5 = toSvgY(-5)

  // 2. 安全 pH 区间矩形阴影
  const safeX1 = toSvgX(safePhRange[0])
  const safeX2 = toSvgX(safePhRange[1])
  const safeWidth = Math.max(0, safeX2 - safeX1)

  // 3. 当前 pH 垂直线
  const curPhX = toSvgX(pH)

  return (
    <g>
      {/* 高考习惯：Y 轴顶端横向直立书写物理量与单位标注（零旋转、零重叠） */}
      <text
        x={plotOrigin.x - 12}
        y={plotOrigin.y - 10}
        fontSize={10}
        fill={CHART_COLORS.labelText}
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        lg[c / (mol·L⁻¹)]
      </text>

      {/* 最佳分离 pH 范围背景高亮 (贴近底部干净标注，绝不挤占 Y 轴) */}
      {safeWidth > 0 && (
        <g>
          <rect
            x={safeX1}
            y={plotOrigin.y}
            width={safeWidth}
            height={plotSize.height}
            fill={withAlpha(CHEMISTRY_COLORS.equilibrium, 0.12)}
            stroke={CHEMISTRY_COLORS.equilibrium}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text
            x={safeX1 + safeWidth / 2}
            y={plotOrigin.y + plotSize.height - 8}
            fontSize={9}
            fill={CHEMISTRY_COLORS.equilibrium}
            textAnchor="middle"
            fontWeight="bold"
          >
            最佳分离 pH 范围 [{safePhRange[0]}~{safePhRange[1]}]
          </text>
        </g>
      )}

      {/* 高考沉淀完全基准虚线 (lg c = -5) */}
      <line
        x1={plotOrigin.x}
        y1={lineY5}
        x2={plotOrigin.x + plotSize.width}
        y2={lineY5}
        stroke={CHART_COLORS.criticalPt}
        strokeWidth={1.5}
        strokeDasharray="4 4"
      />
      <text
        x={plotOrigin.x + plotSize.width - 5}
        y={lineY5 - 4}
        fontSize={9}
        fill={CHART_COLORS.criticalPt}
        textAnchor="end"
        fontWeight="bold"
      >
        沉淀完全线 (c = 10⁻⁵ mol/L)
      </text>

      {/* 各离子 lg c - pH 平滑拟合曲线 */}
      {ions.map((ion) => {
        let dStr = ''
        let hasStarted = false

        curveData.forEach((pt) => {
          const val = pt[ion.symbol]
          if (val !== undefined && !isNaN(val)) {
            const sx = toSvgX(pt.pH)
            const sy = toSvgY(val)
            if (!hasStarted) {
              dStr += `M ${sx} ${sy}`
              hasStarted = true
            } else {
              dStr += ` L ${sx} ${sy}`
            }
          }
        })

        return (
          <g key={ion.symbol}>
            <path
              d={dStr}
              fill="none"
              stroke={ion.color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )
      })}

      {/* 高考习惯：Al(OH)3 两性水解转化为 [Al(OH)4]- 的规范文字标注 */}
      {ions.some((i) => i.symbol === 'Al³⁺') && (
        <text
          x={toSvgX(12.3)}
          y={toSvgY(-2)}
          fontSize={9}
          fill={CHART_COLORS.compareB}
          fontWeight="bold"
          textAnchor="middle"
        >
          Al(OH)₃ 溶解为 [Al(OH)₄]⁻ ➔
        </text>
      )}

      {/* 当前 pH 垂直指示虚线 */}
      <line
        x1={curPhX}
        y1={plotOrigin.y}
        x2={curPhX}
        y2={plotOrigin.y + plotSize.height}
        stroke="#4f46e5"
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />

      {/* 指示线顶部指示 Tag（贴在 X 轴上边缘上空） */}
      <g transform={`translate(${curPhX}, ${plotOrigin.y - 4})`}>
        <rect
          x={-24}
          y={-14}
          width={48}
          height={14}
          rx={3}
          fill="#4f46e5"
        />
        <text
          x={0}
          y={-4}
          fontSize={9}
          fill="#ffffff"
          fontWeight="bold"
          textAnchor="middle"
        >
          pH {pH.toFixed(1)}
        </text>
      </g>

      {/* 各离子在当前 pH 处的无摩擦精细 Marker */}
      {ions.map((ion) => {
        const poh = 14 - pH
        const coh = Math.pow(10, -poh)
        let cSoluble = ion.c0
        if (coh > 0) {
          cSoluble = Math.min(ion.c0, ion.ksp / Math.pow(coh, ion.charge))
        }
        if (ion.symbol === 'Al³⁺' && pH > 10.5) {
          cSoluble = Math.min(ion.c0, cSoluble + 1e-5 * Math.pow(10, (pH - 10.5) * 1.5))
        }
        const lgC = Math.max(-12, Math.min(0, Math.log10(cSoluble)))
        const cx = toSvgX(pH)
        const cy = toSvgY(lgC)

        return (
          <g key={`marker-${ion.symbol}`}>
            <circle
              cx={cx}
              cy={cy}
              r={5}
              fill={ion.color}
              stroke="#ffffff"
              strokeWidth={2}
            />
            <circle
              cx={cx}
              cy={cy}
              r={2}
              fill="#ffffff"
            />
          </g>
        )
      })}
    </g>
  )
}
