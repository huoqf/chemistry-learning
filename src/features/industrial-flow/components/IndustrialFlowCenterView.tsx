/**
 * src/features/industrial-flow/components/IndustrialFlowCenterView.tsx
 * 母题七：无机工艺流程与沉淀调 pH 工具 - 中屏平行视图 UI (高考标准规范版)
 * 方向 B：工序联动下钻，宏观工艺流程 ➔ 槽体微观机理深度穿透
 */

import React from 'react'
import { BaseChart, ChartContext } from '@/components/Chart'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { CHART_COLORS, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import { Activity, ShieldCheck, AlertTriangle, Layers, Thermometer, Filter } from 'lucide-react'
import { IndustrialFlowSvgFlowchart } from './IndustrialFlowSvgFlowchart'
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
  updateParam,
}) => {
  const { viewMode, pH, systemId, leachTemp, crushSize, oxidantAmount } = params
  const {
    ions,
    safePhRange,
    isPhInSafeRange,
    hasSafeRange,
    curveData,
    leachCurveData,
    solubilityCurveData,
    leachRate,
    isOxidized,
    activeStepInfo,
  } = chemistry

  const activeStep = params.activeStep || 3

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

  // 3. 视角 0: 宏观工艺流程全景 ➔ 槽体微观机理下钻
  return (
    <div className="w-full h-full flex flex-col bg-slate-50 p-2.5 gap-2.5 overflow-hidden select-none">
      {/* 上半部分：高考标准方框工艺流程图 (SVG 矢量流向图，可点击槽体下钻) */}
      <div className="w-full h-[225px] bg-white rounded-xl border border-slate-200 shrink-0 shadow-xs overflow-hidden flex flex-col">
        <div className="px-3 py-1 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span className="font-bold text-slate-700">
            工艺流程方框图（点击各工序槽体下钻微观机理）
          </span>
          <span className="text-[10px] text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100 font-medium">
            当前聚焦：{activeStepInfo.title}
          </span>
        </div>
        <div className="flex-1 w-full min-h-0">
          <IndustrialFlowSvgFlowchart
            systemId={systemId}
            activeStep={activeStep}
            onSelectStep={(step) => updateParam('activeStep', step)}
            chemistry={chemistry}
            pH={pH}
          />
        </div>
      </div>

      {/* 下半部分：当前选定反应槽的微观机理放大镜 */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-3 flex flex-col min-h-0 relative shadow-xs">
        {/* 微观下钻头部导航 */}
        <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200 flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-600" />
              槽体微观机理下钻
            </span>
            <h4 className="font-bold text-xs text-slate-800 truncate">
              {activeStepInfo.title}
            </h4>
          </div>

          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
            {activeStepInfo.focusSubject}
          </span>
        </div>

        {/* 核心微观可视化区域：根据 activeStep 动态呈现 */}
        <div className="flex-1 w-full min-h-0 relative">
          {activeStep === 3 ? (
            /* 工序三：沉淀溶解平衡 lg c - pH 分布曲线 */
            <BaseChart
              xDomain={[0, 14]}
              yDomain={[-12, 0]}
              xLabel="溶液 pH"
              yLabel=""
              showGrid={true}
            >
              <SvgCurveRenderer
                curveData={curveData}
                ions={ions}
                pH={pH}
                safePhRange={safePhRange}
              />
            </BaseChart>
          ) : activeStep === 1 ? (
            /* 工序一：酸浸动力学曲线 (浸出率随反应温度与矿石细度变化) */
            <BaseChart
              xDomain={[20, 90]}
              yDomain={[0, 100]}
              xLabel="浸出温度 (℃)"
              yLabel="浸出率 (%)"
              showGrid={true}
            >
              <LeachKineticRenderer
                leachCurveData={leachCurveData}
                currentTemp={leachTemp}
                currentLeachRate={leachRate}
                crushSize={crushSize}
              />
            </BaseChart>
          ) : activeStep === 2 ? (
            /* 工序二：氧化状态与分离窗口对比解析 */
            <OxidationWindowRenderer
              systemId={systemId}
              isOxidized={isOxidized}
              oxidantAmount={oxidantAmount}
              hasSafeRange={hasSafeRange}
            />
          ) : (
            /* 工序四：结晶溶解度-温度曲线 (冷却结晶 vs 趁热过滤) */
            <BaseChart
              xDomain={[0, 100]}
              yDomain={[0, 120]}
              xLabel="溶液温度 (℃)"
              yLabel="溶解度 (g / 100g 水)"
              showGrid={true}
            >
              <SolubilityCrystallizeRenderer
                solubilityCurveData={solubilityCurveData}
              />
            </BaseChart>
          )}
        </div>

        {/* 底部状态条与考点提示 */}
        <div className="mt-1 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">工序设问焦点:</span>
            <span className="text-slate-800 font-medium truncate max-w-[480px]">
              {activeStepInfo.coreQuestion}
            </span>
          </div>

          {activeStep === 3 && (
            <div
              className={`font-semibold flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                isPhInSafeRange
                  ? 'bg-emerald-100 text-emerald-800'
                  : !hasSafeRange
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isPhInSafeRange ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  最佳分离 pH [{safePhRange[0]} ~ {safePhRange[1]}]
                </>
              ) : !hasSafeRange ? (
                <>
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  无安全分离区间 (曲线重叠共沉淀)
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  偏离分离 pH [{safePhRange[0]} ~ {safePhRange[1]}]
                </>
              )}
            </div>
          )}

          {activeStep === 1 && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              <Thermometer className="w-3 h-3 text-indigo-600" />
              当前温度: {leachTemp}℃ · 浸出率: {leachRate.toFixed(1)}%
            </div>
          )}

          {activeStep === 4 && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
              <Filter className="w-3 h-3 text-amber-600" />
              推荐操作：趁热过滤除去不溶杂质 ➔ 冷却结晶析出主产品
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * 工序三渲染器：高考规范 lg c - pH 曲线与节点
 */
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

  const lineY5 = toSvgY(-5)
  const hasSafe = safePhRange[0] <= safePhRange[1]
  const safeX1 = toSvgX(safePhRange[0])
  const safeX2 = toSvgX(safePhRange[1])
  const safeWidth = hasSafe ? Math.max(0, safeX2 - safeX1) : 0
  const curPhX = toSvgX(pH)

  return (
    <g>
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

      {/* 最佳分离 pH 范围背景高亮 */}
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

      {/* 各离子曲线 */}
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

      {/* Al(OH)3 两性溶解文字标注 */}
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

      <g transform={`translate(${curPhX}, ${plotOrigin.y - 4})`}>
        <rect x={-24} y={-14} width={48} height={14} rx={3} fill="#4f46e5" />
        <text x={0} y={-4} fontSize={9} fill="#ffffff" fontWeight="bold" textAnchor="middle">
          pH {pH.toFixed(1)}
        </text>
      </g>

      {/* 实时 Marker */}
      {ions.map((ion) => {
        const lgC = Math.max(-12, Math.min(0, Math.log10(Math.max(1e-12, ion.cCurrent))))
        const cx = toSvgX(pH)
        const cy = toSvgY(lgC)

        return (
          <g key={`marker-${ion.symbol}`}>
            <circle cx={cx} cy={cy} r={5} fill={ion.color} stroke="#ffffff" strokeWidth={2} />
            <circle cx={cx} cy={cy} r={2} fill="#ffffff" />
          </g>
        )
      })}
    </g>
  )
}

/**
 * 工序一渲染器：酸浸动力学曲线 (浸出率随温度变化)
 */
function LeachKineticRenderer({
  leachCurveData,
  currentTemp,
  currentLeachRate,
  crushSize,
}: {
  leachCurveData: Array<{ temp: number; leachRate: number }>
  currentTemp: number
  currentLeachRate: number
  crushSize: string
}) {
  const ctx = React.useContext(ChartContext)
  if (!ctx) return null

  const { toSvgX, toSvgY, plotOrigin, plotSize } = ctx

  let dStr = ''
  leachCurveData.forEach((pt, idx) => {
    const sx = toSvgX(pt.temp)
    const sy = toSvgY(pt.leachRate)
    if (idx === 0) dStr += `M ${sx} ${sy}`
    else dStr += ` L ${sx} ${sy}`
  })

  const curX = toSvgX(currentTemp)
  const curY = toSvgY(currentLeachRate)

  return (
    <g>
      {/* 动力学主曲线 */}
      <path d={dStr} fill="none" stroke="#4f46e5" strokeWidth={3} strokeLinecap="round" />

      {/* 当前反应温度垂线 */}
      <line
        x1={curX}
        y1={plotOrigin.y}
        x2={curX}
        y2={plotOrigin.y + plotSize.height}
        stroke="#4f46e5"
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />

      {/* 当前交点圆标 */}
      <circle cx={curX} cy={curY} r={6} fill="#4f46e5" stroke="#ffffff" strokeWidth={2} />
      <circle cx={curX} cy={curY} r={2.5} fill="#ffffff" />

      {/* 当前点悬浮标签 */}
      <g transform={`translate(${curX}, ${curY - 14})`}>
        <rect x={-36} y={-14} width={72} height={15} rx={3} fill="#1e1b4b" />
        <text x={0} y={-3} fontSize={9} fill="#ffffff" fontWeight="bold" textAnchor="middle">
          {currentTemp}℃ · {currentLeachRate.toFixed(1)}%
        </text>
      </g>

      {/* 粒度影响说明文字 */}
      <text
        x={plotOrigin.x + 15}
        y={plotOrigin.y + 25}
        fontSize={10}
        fill="#4338ca"
        fontWeight="bold"
      >
        当前粉碎粒度: {crushSize === 'fine' ? '细粉 (+15% 接触比)' : crushSize === 'medium' ? '中等 (+8%)' : '粗粒'}
      </text>
      <text
        x={plotOrigin.x + 15}
        y={plotOrigin.y + 42}
        fontSize={9}
        fill="#64748b"
      >
        动力学规律：升温与细磨可显著降低扩散活化阻力，提高矿石反应浸出率
      </text>
    </g>
  )
}

/**
 * 工序二渲染器：氧化状态与共沉淀窗口对比微观图
 */
function OxidationWindowRenderer({
  systemId,
  isOxidized,
  oxidantAmount,
  hasSafeRange,
}: {
  systemId: string
  isOxidized: boolean
  oxidantAmount: string
  hasSafeRange: boolean
}) {
  const isTiFe = systemId === 'ti-fe'
  const isNiCoLi = systemId === 'ni-co-li'

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 bg-slate-50/70 rounded-lg">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <h5 className="font-bold text-xs text-slate-800 mb-3 flex items-center justify-between">
          <span>
            {isTiFe
              ? '工序二核心化学机理：为什么钛白粉工艺要加铁屑还原？'
              : isNiCoLi
              ? '工序二核心化学机理：为什么正极酸浸必须加入 H₂O₂ 还原剂？'
              : '工序二核心化学机理：为什么必须调控杂质离子价态？'}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              oxidantAmount === 'sufficient'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {isTiFe
              ? oxidantAmount === 'sufficient' ? '逆向还原完成 (防钛水解)' : 'Fe³⁺ 未还原 (产品发黄)'
              : oxidantAmount === 'sufficient' ? '价态调控完成' : '价态未调控 (共沉淀)'}
          </span>
        </h5>

        {/* 对比条：充分 vs 不足 */}
        <div className="flex flex-col gap-3 text-xs">
          {/* 未充分处理 */}
          <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 flex flex-col gap-1">
            <div className="flex items-center justify-between font-semibold text-rose-900">
              <span>{isTiFe ? '【铁屑投料不足】：残留 Fe³⁺ 杂质' : '【未充分氧化】：含 Fe²⁺ 杂质'}</span>
              <span className="font-mono">
                {isTiFe ? 'Fe³⁺ 极易水解混入钛白粉' : 'Fe²⁺ 完全沉淀 pH = 8.95'}
              </span>
            </div>
            <p className="text-[11px] text-rose-700 leading-tight">
              {isTiFe
                ? '隐患：Fe³⁺ 极易水解为 Fe(OH)₃ 沉淀混入 H₂TiO₃ 滤饼中，严重降低 TiO₂ 颜料白度！'
                : `矛盾：目标金属析出 pH 约为 8.14，此时 ${hasSafeRange ? '区间狭窄' : '无安全区间'}，直接调碱导致产品共沉淀！`}
            </p>
          </div>

          {/* 充分处理 */}
          <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 flex flex-col gap-1">
            <div className="flex items-center justify-between font-semibold text-emerald-900">
              <span>{isTiFe ? '【充分还原为 Fe²⁺】：加入过量铁屑' : '【充分氧化为 Fe³⁺】：加入 H₂O₂'}</span>
              <span className="font-mono">
                {isTiFe ? 'Fe²⁺ 水解度低，保留在母液' : 'Fe³⁺ 完全沉淀 pH = 3.20'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 leading-tight">
              {isTiFe
                ? '✅ 突破：Fe²⁺ 在酸性下极其稳定不水解，经后续冷冻结晶以 FeSO₄·7H₂O (绿矾) 纯净析出！'
                : `✅ 突破：Fe³⁺ 完全沉淀 pH 降至 3.20，${isOxidized ? '已拉开宽达近 5 个 pH 的纯净分离窗口！' : '为分离奠定基础。'}`}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            {isTiFe
              ? '高考离子方程式：2Fe³⁺ + Fe = 3Fe²⁺'
              : isNiCoLi
              ? '方程式：2LiCoO₂ + H₂O₂ + 3H₂SO₄ = 2CoSO₄ + Li₂SO₄ + O₂↑ + 4H₂O'
              : '高考离子方程式：2Fe²⁺ + H₂O₂ + 2H⁺ = 2Fe³⁺ + 2H₂O'}
          </span>
          <span className="font-bold text-indigo-600">点击工序三下钻查看沉淀曲线 ➔</span>
        </div>
      </div>
    </div>
  )
}

/**
 * 工序四渲染器：结晶溶解度分离曲线
 */
function SolubilityCrystallizeRenderer({
  solubilityCurveData,
}: {
  solubilityCurveData: Array<{ temp: number; main: number; impurity: number }>
}) {
  const ctx = React.useContext(ChartContext)
  if (!ctx) return null

  const { toSvgX, toSvgY, plotOrigin, plotSize } = ctx

  let dMain = ''
  let dImp = ''
  solubilityCurveData.forEach((pt, idx) => {
    const sx = toSvgX(pt.temp)
    const syMain = toSvgY(pt.main)
    const syImp = toSvgY(pt.impurity)
    if (idx === 0) {
      dMain += `M ${sx} ${syMain}`
      dImp += `M ${sx} ${syImp}`
    } else {
      dMain += ` L ${sx} ${syMain}`
      dImp += ` L ${sx} ${syImp}`
    }
  })

  return (
    <g>
      {/* 主产品溶解度曲线 (陡增型) */}
      <path d={dMain} fill="none" stroke="#059669" strokeWidth={3} strokeLinecap="round" />
      {/* 杂质溶解度曲线 (平缓型) */}
      <path d={dImp} fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" strokeLinecap="round" />

      {/* 趁热过滤高温区域标注 */}
      <rect
        x={toSvgX(80)}
        y={plotOrigin.y}
        width={toSvgX(100) - toSvgX(80)}
        height={plotSize.height}
        fill={withAlpha('#f59e0b', 0.12)}
        stroke="#f59e0b"
        strokeWidth={1}
        strokeDasharray="2 2"
      />
      <text
        x={toSvgX(90)}
        y={plotOrigin.y + 20}
        fontSize={9}
        fill="#b45309"
        fontWeight="bold"
        textAnchor="middle"
      >
        趁热过滤区 (80~100℃)
      </text>

      {/* 冷却结晶低温区域标注 */}
      <rect
        x={toSvgX(0)}
        y={plotOrigin.y}
        width={toSvgX(25) - toSvgX(0)}
        height={plotSize.height}
        fill={withAlpha('#0284c7', 0.12)}
        stroke="#0284c7"
        strokeWidth={1}
        strokeDasharray="2 2"
      />
      <text
        x={toSvgX(12.5)}
        y={plotOrigin.y + 20}
        fontSize={9}
        fill="#0369a1"
        fontWeight="bold"
        textAnchor="middle"
      >
        冷却结晶区 (0~25℃)
      </text>

      {/* 图例 */}
      <text x={plotOrigin.x + 30} y={plotOrigin.y + plotSize.height - 25} fontSize={9} fill="#059669" fontWeight="bold">
        ── 主产品溶解度 (随温陡增，降温大量析出)
      </text>
      <text x={plotOrigin.x + 30} y={plotOrigin.y + plotSize.height - 10} fontSize={9} fill="#64748b" fontWeight="bold">
        ┄┄ 残留杂质溶解度 (平缓，降温仍留在母液中)
      </text>
    </g>
  )
}
