import React from 'react'
import { ChartContext } from '@/components/Chart'
import { CHART_COLORS, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import type { IndustrialFlowChemistry } from '../types'

const svgFont = (size: number) => size

/**
 * 工序三渲染器：高考规范 lg c - pH 曲线与节点
 */
export function SvgCurveRenderer({
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
        fontSize={svgFont(10)}
        fill={CHART_COLORS.labelText}
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        lg[c / (mol·L⁻¹)]
      </text>

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
            fontSize={svgFont(9)}
            fill={CHEMISTRY_COLORS.equilibrium}
            textAnchor="middle"
            fontWeight="bold"
          >
            最佳分离 pH 范围 [{safePhRange[0]}~{safePhRange[1]}]
          </text>
        </g>
      )}

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
        fontSize={svgFont(9)}
        fill={CHART_COLORS.criticalPt}
        textAnchor="end"
        fontWeight="bold"
      >
        沉淀完全线 (c = 10⁻⁵ mol/L)
      </text>

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

        const labelPh = Math.max(0.5, Math.min(13.2, ion.pHStart + 0.3))
        const labelLgc = Math.max(-11, Math.min(-0.8, Math.log10(ion.c0) - 0.8))
        const labelX = toSvgX(labelPh)
        const labelY = toSvgY(labelLgc)

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
            <g transform={`translate(${labelX}, ${labelY})`}>
              <rect
                x={-2}
                y={-12}
                width={ion.precipitateFormula.length * 8 + 36}
                height={15}
                rx={3}
                fill="#ffffff"
                fillOpacity={0.88}
                stroke={ion.color}
                strokeWidth={0.8}
              />
              <text
                x={2}
                y={-1}
                fontSize={svgFont(9.5)}
                fill={ion.color}
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {ion.precipitateFormula} ({ion.symbol})
              </text>
            </g>
          </g>
        )
      })}

      {ions.map((ion) => {
        const isImpurity = ion.pHEnd < 7.5
        const endX = toSvgX(ion.pHEnd)
        const startX = toSvgX(ion.pHStart)
        const startY = toSvgY(Math.log10(ion.c0))

        return (
          <g key={`feat-${ion.symbol}`}>
            {isImpurity && (
              <g>
                <line
                  x1={endX}
                  y1={lineY5}
                  x2={endX}
                  y2={plotOrigin.y + plotSize.height}
                  stroke={ion.color}
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  strokeOpacity={0.8}
                />
                <circle cx={endX} cy={lineY5} r={3.5} fill={ion.color} stroke="#ffffff" strokeWidth={1.5} />
                <g transform={`translate(${endX}, ${lineY5 - 6})`}>
                  <rect x={-20} y={-11} width={40} height={12} rx={2} fill={ion.color} />
                  <text x={0} y={-2} fontSize={svgFont(8.5)} fill="#ffffff" fontWeight="bold" textAnchor="middle">
                    pH {ion.pHEnd.toFixed(1)}
                  </text>
                </g>
              </g>
            )}

            {!isImpurity && (
              <g>
                <line
                  x1={startX}
                  y1={startY}
                  x2={startX}
                  y2={plotOrigin.y + plotSize.height}
                  stroke={ion.color}
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  strokeOpacity={0.8}
                />
                <circle cx={startX} cy={startY} r={3.5} fill={ion.color} stroke="#ffffff" strokeWidth={1.5} />
                <g transform={`translate(${startX}, ${startY - 6})`}>
                  <rect x={-24} y={-11} width={48} height={12} rx={2} fill={ion.color} />
                  <text x={0} y={-2} fontSize={svgFont(8.5)} fill="#ffffff" fontWeight="bold" textAnchor="middle">
                    析出 pH {ion.pHStart.toFixed(1)}
                  </text>
                </g>
              </g>
            )}
          </g>
        )
      })}

      {ions.some((i) => i.symbol === 'Al³⁺') && (
        <text
          x={toSvgX(12.3)}
          y={toSvgY(-2)}
          fontSize={svgFont(9)}
          fill={CHART_COLORS.compareB}
          fontWeight="bold"
          textAnchor="middle"
        >
          Al(OH)₃ 溶解为 [Al(OH)₄]⁻ (示意) ➔
        </text>
      )}

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
        <text x={0} y={-4} fontSize={svgFont(9)} fill="#ffffff" fontWeight="bold" textAnchor="middle">
          pH {pH.toFixed(1)}
        </text>
      </g>

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
export function LeachKineticRenderer({
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
      <path d={dStr} fill="none" stroke="#4f46e5" strokeWidth={3} strokeLinecap="round" />
      <line
        x1={curX}
        y1={plotOrigin.y}
        x2={curX}
        y2={plotOrigin.y + plotSize.height}
        stroke="#4f46e5"
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />
      <circle cx={curX} cy={curY} r={6} fill="#4f46e5" stroke="#ffffff" strokeWidth={2} />
      <circle cx={curX} cy={curY} r={2.5} fill="#ffffff" />
      <g transform={`translate(${curX}, ${curY - 14})`}>
        <rect x={-36} y={-14} width={72} height={15} rx={3} fill="#1e1b4b" />
        <text x={0} y={-3} fontSize={svgFont(9)} fill="#ffffff" fontWeight="bold" textAnchor="middle">
          {currentTemp}℃ · {currentLeachRate.toFixed(1)}%
        </text>
      </g>
      <text x={plotOrigin.x + 15} y={plotOrigin.y + 25} fontSize={svgFont(10)} fill="#4338ca" fontWeight="bold">
        当前粉碎粒度: {crushSize === 'fine' ? '细粉 (+15% 接触比)' : crushSize === 'medium' ? '中等 (+8%)' : '粗粒'}
      </text>
      <text x={plotOrigin.x + 15} y={plotOrigin.y + 42} fontSize={svgFont(9)} fill="#64748b">
        动力学规律：升温与细磨可显著降低扩散活化阻力，提高矿石反应浸出率
      </text>
    </g>
  )
}

/**
 * 工序二渲染器：氧化状态与共沉淀窗口对比微观图
 */
export function OxidationWindowRenderer({
  systemId,
  isOxidized,
  oxidantAmount,
  hasSafeRange,
  safeRangeWidth,
  targetPrecipPh,
}: {
  systemId: string
  isOxidized: boolean
  oxidantAmount: string
  hasSafeRange: boolean
  safeRangeWidth: number
  targetPrecipPh?: number
}) {
  const isTiFe = systemId === 'ti-fe'
  const isNiCoLi = systemId === 'ni-co-li'
  const isAlFeSi = systemId === 'al-fe-si'
  const isLiFeP = systemId === 'li-fe-p'

  if (isAlFeSi || isLiFeP) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center p-4 bg-slate-50/70 rounded-lg">
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2.5 text-xs">
          <div className="font-bold text-slate-800 flex items-center justify-between">
            <span>
              {isAlFeSi
                ? '工序二核心机理：拜耳法赤泥分离与水合铝硅酸钠粗脱硅'
                : '工序二核心机理：pH 2.0~2.5 下磷酸铁 (FePO₄) 沉淀分离'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {isAlFeSi ? '硅渣协同去除' : '铁磷沉淀回收'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/60 text-slate-700 leading-relaxed">
            {isAlFeSi
              ? 'Na⁺ + [Al(OH)₄]⁻ + SiO₃²⁻ + H₂O = NaAlSiO₄·2H₂O↓ + 2OH⁻。溶出的硅酸根与部分偏铝酸钠反应生成难溶水合铝硅酸钠随赤泥过滤除去。'
              : 'Fe³⁺ + PO₄³⁻ = FePO₄↓。在 pH 2.0~2.5 的微酸性区间，Fe³⁺ 与 PO₄³⁻ 生成溶度积极小 (Ksp=1.3×10⁻²²) 的 FePO₄ 沉淀，实现铁磷与 Li⁺ 彻底分离。'}
          </div>
        </div>
      </div>
    )
  }

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
              : isNiCoLi
              ? oxidantAmount === 'sufficient' ? 'H₂O₂ 还原酸浸完成' : '高价钴溶解受阻'
              : oxidantAmount === 'sufficient' ? '价态调控完成' : '价态未调控 (共沉淀)'}
          </span>
        </h5>

        <div className="flex flex-col gap-3 text-xs">
          <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 flex flex-col gap-1">
            <div className="flex items-center justify-between font-semibold text-rose-900">
              <span>
                {isTiFe
                  ? '【铁屑投料不足】：残留 Fe³⁺ 杂质'
                  : isNiCoLi
                  ? '【H₂O₂ 投料不足】：高价 Co(III) 难溶残留'
                  : '【未充分氧化】：含 Fe²⁺ 杂质'}
              </span>
              <span className="font-mono">
                {isTiFe
                  ? 'Fe³⁺ 极易水解混入钛白粉'
                  : isNiCoLi
                  ? 'LiCoO₂ 难单纯靠稀酸完全浸出'
                  : 'Fe²⁺ 完全沉淀 pH = 8.95'}
              </span>
            </div>
            <p className="text-[11px] text-rose-700 leading-tight">
              {isTiFe
                ? '隐患：Fe³⁺ 极易水解为 Fe(OH)₃ 沉淀混入 H₂TiO₃ 滤饼中，严重降低 TiO₂ 颜料白度！'
                : isNiCoLi
                ? '矛盾：LiCoO₂ 中 Co 为 +3 价且结合紧密，不加还原剂时钴浸出率低且易引入高价氧化副反应！'
                : hasSafeRange
                ? `隐患：目标金属析出 pH 约为 ${(targetPrecipPh ?? 8.14).toFixed(2)}，杂质 Fe²⁺ 需 pH=8.95 才沉淀完全，导致除铁窗口收窄或共沉淀！`
                : `矛盾：目标金属析出 pH 约为 ${(targetPrecipPh ?? 8.14).toFixed(2)}，低于 Fe²⁺ 沉淀区间，无安全分离窗口，直接调碱必然共沉淀！`}
            </p>
          </div>

          <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 flex flex-col gap-1">
            <div className="flex items-center justify-between font-semibold text-emerald-900">
              <span>
                {isTiFe
                  ? '【充分还原为 Fe²⁺】：加入过量铁屑'
                  : isNiCoLi
                  ? '【充分还原为 Co²⁺】：加入 H₂O₂ 还原剂'
                  : '【充分氧化为 Fe³⁺】：加入 H₂O₂'}
              </span>
              <span className="font-mono">
                {isTiFe
                  ? 'Fe²⁺ 水解度低，保留在母液'
                  : isNiCoLi
                  ? '产物为无害 O₂ 与 H₂O，不增杂质'
                  : 'Fe³⁺ 完全沉淀 pH = 3.20'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 leading-tight">
              {isTiFe
                ? '突破：Fe²⁺ 在酸性下极其稳定不水解，经后续冷冻结晶以 FeSO₄·7H₂O (绿矾) 纯净析出！'
                : isNiCoLi
                ? '突破：H₂O₂ 将难溶 Co(III) 高效还原为可溶 Co²⁺ 进入浸出液，后续只需调 pH≈4.7 即可除尽 Fe/Al 杂质！'
                : `突破：Fe³⁺ 完全沉淀 pH 降至 3.20，${isOxidized ? `已拉开约 ${safeRangeWidth.toFixed(1)} 个 pH 的纯净分离窗口！` : '为分离奠定基础。'}`}
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
export function SolubilityCrystallizeRenderer({
  solubilityCurveData,
  systemId,
}: {
  solubilityCurveData: Array<{ temp: number; main: number; impurity: number }>
  systemId: string
}) {
  const ctx = React.useContext(ChartContext)
  if (!ctx) return null

  const { toSvgX, toSvgY, plotOrigin, plotSize } = ctx
  const isLiFeP = systemId === 'li-fe-p'
  const isFeAlMn = systemId === 'fe-al-mn'

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
      <path d={dMain} fill="none" stroke="#059669" strokeWidth={3} strokeLinecap="round" />
      <path d={dImp} fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" strokeLinecap="round" />

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
      <text x={toSvgX(90)} y={plotOrigin.y + 20} fontSize={svgFont(9)} fill="#b45309" fontWeight="bold" textAnchor="middle">
        {isLiFeP
          ? '高温沉锂·趁热过滤 (80~100℃)'
          : isFeAlMn
          ? '蒸发浓缩结晶·趁热过滤 (>80℃)'
          : '趁热过滤区 (80~100℃)'}
      </text>

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
      <text x={toSvgX(12.5)} y={plotOrigin.y + 20} fontSize={svgFont(9)} fill="#0369a1" fontWeight="bold" textAnchor="middle">
        {isLiFeP
          ? '低温易回溶区 (0~25℃)'
          : isFeAlMn
          ? '低温多水合物区 (0~25℃)'
          : '冷却结晶区 (0~25℃)'}
      </text>

      <text x={plotOrigin.x + 30} y={plotOrigin.y + plotSize.height - 25} fontSize={svgFont(9)} fill="#059669" fontWeight="bold">
        {isLiFeP
          ? '── Li₂CO₃ 主产物溶解度 (反常：随温升高降低，高温析出)'
          : isFeAlMn
          ? '── MnSO₄·H₂O 主产物溶解度 (>40℃ 随温下降，80℃+ 蒸发趁热过滤)'
          : '── 主产品溶解度 (随温陡增，降温大量析出)'}
      </text>
      <text x={plotOrigin.x + 30} y={plotOrigin.y + plotSize.height - 10} fontSize={svgFont(9)} fill="#64748b" fontWeight="bold">
        {isLiFeP
          ? '┄┄ Na₂SO₄ 杂质溶解度 (随温升高骤增，趁热过滤留母液)'
          : '┄┄ 残留杂质溶解度 (平缓，降温仍留在母液中)'}
      </text>
    </g>
  )
}
