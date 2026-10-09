import React, { useMemo } from 'react'
import { AnimationSvgCanvas } from '@/components/Layout'
import { ScoringCardSection, GaokaoVariantQuiz, TitrationControls } from '@/components/UI'
import { TitrationCurveChart } from '@/components/Chart'
import { BuretteApparatus, ErlenmeyerFlaskApparatus, IronSupportApparatus } from '@/components/Chemistry'
import { useAnimationViewport } from '@/hooks/useAnimationViewport'
import { CANVAS_PRESETS, SCENE_COLORS, CHART_COLORS, CANVAS_COLORS, withAlpha } from '@/theme'
import type { ModelQuizData } from '@/data/quiz/types'
import type { ViewMode, TitrationErrorParams, TitrationChemistryResult } from '../types'

interface TitrationErrorCenterViewProps {
  viewMode: ViewMode
  params: TitrationErrorParams
  chemistry: TitrationChemistryResult
  quizData: ModelQuizData | null
  currentVolume: number
  isAutoPlaying: boolean
  onPlayPause: () => void
  onSingleDrop: () => void
  onBulkAdd: () => void
  onReset: () => void
  onVolumeChange: (v: number) => void
  onUpdateParams: (updated: Partial<TitrationErrorParams>) => void
}

export const TitrationErrorCenterView: React.FC<TitrationErrorCenterViewProps> = ({
  viewMode,
  params,
  chemistry,
  quizData,
  currentVolume,
  isAutoPlaying,
  onPlayPause,
  onSingleDrop,
  onBulkAdd,
  onReset,
  onVolumeChange,
  onUpdateParams,
}) => {
  // 1. 严格遵照 AGENTS.md 与 Skill 规范，滴定与图表场景首选 CANVAS_PRESETS.splitHw (280px + 560px)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.splitHw,
  })

  const { errorResult, purityResult, yieldResult } = chemistry

  // 等当点体积严格跟随参数 (c标 / c待 / V待) 变化，不再写死 20.00 mL
  const vEq = errorResult.vTrue
  // 计量量程：至少覆盖 2 倍等当点（下限 40 mL），保证突跃段始终完整落在图内
  const vMax = useMemo(() => Math.max(40, Math.ceil((vEq * 2) / 5) * 5), [vEq])

  // 2. 真实酸碱滴定突跃曲线计算 (强酸-强碱体系：0.1000 mol/L NaOH 滴定 20.00 mL 0.1000 mol/L HCl)
  const titrationCurvePoints = useMemo(() => {
    const points: { x: number; y: number }[] = []
    const c0 = params.cStandardTrue || 0.1 // 标液浓度 0.1000 mol/L
    const kw = 1e-14

    // 采样体积序列：量程等分 80 段（vMax = 40 时即 0.5 mL 间隔），
    // 再在等当点前后插入密集特征点以精确刻画突跃（不再把 0~40 mL 写死）
    const vList: number[] = []
    const SEGMENTS = 80
    for (let i = 0; i <= SEGMENTS; i++) {
      vList.push(Number(((i * vMax) / SEGMENTS).toFixed(4)))
    }
    const fineOffsets = [-0.2, -0.1, -0.05, -0.02, 0, 0.02, 0.05, 0.1, 0.2]
    for (const offset of fineOffsets) {
      const vFine = Number((vEq + offset).toFixed(2))
      if (vFine >= 0 && vFine <= vMax && !vList.includes(vFine)) {
        vList.push(vFine)
      }
    }
    vList.sort((a, b) => a - b)

    for (const v of vList) {
      let ph = 7.0
      const totalV = vEq + v
      if (v < vEq) {
        // 酸过量：c_excess = (vEq - v) * c0 / totalV
        const cAcid = ((vEq - v) * c0) / totalV
        // 精确解一元二次方程 [H+]^2 - cAcid*[H+] - kw = 0
        const hConc = (cAcid + Math.sqrt(cAcid * cAcid + 4 * kw)) / 2
        ph = -Math.log10(hConc)
      } else if (v > vEq) {
        // 碱过量：c_excess = (v - vEq) * c0 / totalV
        const cBase = ((v - vEq) * c0) / totalV
        // 精确解一元二次方程 [OH-]^2 - cBase*[OH-] - kw = 0
        const ohConc = (cBase + Math.sqrt(cBase * cBase + 4 * kw)) / 2
        ph = 14.0 + Math.log10(ohConc)
      } else {
        ph = 7.0
      }
      points.push({ x: v, y: Number(ph.toFixed(2)) })
    }
    return points
  }, [vEq, vMax, params.cStandardTrue])

  // 动态视线偏角计算 (如始仰终俯 view-start-up-end-down 或始俯终仰 view-start-down-end-up 随滴定进度平滑过渡)
  const effectiveViewAngle = useMemo(() => {
    if (params.errorOp === 'view-start-up-end-down') {
      // 0mL 时仰视 +10°，40mL 时俯视 -10°
      const progress = Math.min(1, currentVolume / 40.0)
      return 10.0 - progress * 20.0
    }
    if (params.errorOp === 'view-start-down-end-up') {
      // 0mL 时俯视 -10°，40mL 时仰视 +10°
      const progress = Math.min(1, currentVolume / 40.0)
      return -10.0 + progress * 20.0
    }
    return params.viewAngle
  }, [params.errorOp, params.viewAngle, currentVolume])

  // 放大镜刻度与光学视线计算
  //
  // 凹液面最低点：meniscus 路径 `M 35 110 Q 52 120 67 110` 的最低点在 t=0.5 处，
  // 即 0.25×(35,110) + 0.5×(52,120) + 0.25×(67,110) = (51.5, 115)。
  // 刻度 20.0 / 21.0 / 22.0 分别对应 y = 75 / 115 / 155，即 1 mL = 40 px，真值凹液面恰在 21.00 mL。
  const MENISCUS_LOWEST_X = 51.5
  const MENISCUS_LOWEST_Y = 115
  // 读数基准线取刻度线靠眼一侧端点 x=60（刻度线 span x∈[30,60]），对应"近壁刻度"视差模型，
  // 这样"仰视读数偏大 / 俯视读数偏小"才与滴定管刻度自上而下增大的事实一致。
  const SCALE_READ_X = 60

  // 眼睛位置：仰视 (effectiveViewAngle > 0) 眼睛低于凹液面 (y 增大)，俯视则高于凹液面
  const eyeY = MENISCUS_LOWEST_Y + (effectiveViewAngle / 15.0) * 30.0
  // 视线由「眼睛 → 凹液面最低点」唯一确定，再延伸至刻度线。
  // 关键：sightLineEndY / readCrossY 都由同一斜率导出，保证视线严格穿过凹液面最低点；
  // 此前两处 y 用互不相干的公式各算一次，导致视线并不经过凹液面最低点（几何自相矛盾）。
  const sightSlope = (MENISCUS_LOWEST_Y - eyeY) / (MENISCUS_LOWEST_X - 115)
  const sightLineEndY = MENISCUS_LOWEST_Y + sightSlope * (30 - MENISCUS_LOWEST_X)
  const readCrossY = MENISCUS_LOWEST_Y + sightSlope * (SCALE_READ_X - MENISCUS_LOWEST_X)
  const displayReadValue = Number((21.0 + (readCrossY - MENISCUS_LOWEST_Y) / 40).toFixed(2))
  const readDirectionLabel =
    displayReadValue > 21.005 ? '偏大' : displayReadValue < 20.995 ? '偏小' : '平视'

  // 滴定控制条特征节点快跳（全部随等当点 vEq 联动，不再写死 10 / 20 / 25 mL）
  const titrationSteps = useMemo(() => {
    const half = Number((vEq / 2).toFixed(2))
    const excess = Number((vEq * 1.25).toFixed(2))
    return [
      { title: `起点 (0 mL)`, volume: 0 },
      { title: `半中和 (${half} mL)`, volume: half },
      { title: `等当点 (${vEq.toFixed(2)} mL)`, volume: vEq },
      { title: `过量 (${excess} mL)`, volume: excess },
    ]
  }, [vEq])

  // 如果处于 规范踩分 ('scoring') 视角，在 DOM 层条件渲染
  if (viewMode === 'scoring') {
    return (
      <div className="w-full h-full p-4 overflow-y-auto bg-slate-50 select-none">
        {quizData?.scoringSteps && quizData.scoringSteps.length > 0 ? (
          <ScoringCardSection steps={quizData.scoringSteps} />
        ) : (
          <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200 my-2">
            暂无规范踩分步骤
          </div>
        )}
      </div>
    )
  }

  // 如果处于 真题研析 ('quiz') 视角，在 DOM 层条件渲染
  if (viewMode === 'quiz') {
    return (
      <div className="w-full h-full p-4 overflow-y-auto bg-slate-50 select-none">
        <GaokaoVariantQuiz quizzes={quizData?.variantQuizzes || []} />
      </div>
    )
  }

  // viewMode === 'explore': 图谱探究 (SVG 装置 + 光学视角放大镜 + 矢量对比)
  const isEndpointReached = currentVolume >= vEq
  const flaskColor = isEndpointReached
    ? params.titrationType === 'redox'
      ? withAlpha('#C084FC', 0.75)
      : withAlpha('#F472B6', 0.75)
    : withAlpha(SCENE_COLORS.container.flask, 0.25)

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none">
      {/* 上半区：分屏模式 (左 280px 装置区 + 右 560px 滴定曲线与拆解区) */}
      <div className="flex-1 min-h-0 w-full flex flex-row overflow-hidden border-b border-slate-200/80">
        {/* ── 左侧 280px 纯 SVG 滴定装置与视角放大镜视口区 (CANVAS_PRESETS.splitHw 280x650) ── */}
        <div className="w-[280px] h-full shrink-0 border-r border-slate-200/80 relative">
          <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
            <defs>
              <pattern id="titration-error-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke={CANVAS_COLORS.grid} strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="280" height="650" fill="url(#titration-error-grid)" opacity="0.5" />

            {/* 1. 复用 IronSupportApparatus 铁架台组件 */}
            <IronSupportApparatus
              x={10}
              y={20}
              width={120}
              height={560}
              hasClamp={true}
              clampPos={0.35}
            />

            {/* 2. 复用 BuretteApparatus 滴定管组件 */}
            <BuretteApparatus
              x={70}
              y={30}
              width={30}
              height={300}
              variant={params.titrationType === 'acid-base' ? 'acid' : 'base'}
              fillLevel={Math.max(0, 1 - currentVolume / vMax)}
              fillColor={params.titrationType === 'redox' ? SCENE_COLORS.reagent.indicator : SCENE_COLORS.reagent.acid}
              isOpen={isAutoPlaying}
              showDrop={isAutoPlaying || currentVolume > 0}
              font={canvasSize.font}
            />

            {/* 误操作特殊提示图层 */}
            {params.errorOp === 'bubble-start' && (
              <circle cx="85" cy="316" r="3.5" fill={CHART_COLORS.primary} stroke={CANVAS_COLORS.white} strokeWidth="1" />
            )}
            {params.errorOp === 'hanging-drop' && (
              <path d="M 85 330 Q 82 337 85 341 Q 88 337 85 330 Z" fill={CHART_COLORS.primary} />
            )}

            {/* 3. 复用 ErlenmeyerFlaskApparatus 锥形瓶组件 */}
            <ErlenmeyerFlaskApparatus
              x={45}
              y={380}
              width={80}
              height={110}
              fillLevel={Math.min(0.65, 0.2 + (currentVolume / vMax) * 0.45)}
              fillColor={flaskColor}
              font={canvasSize.font}
              label={params.titrationType === 'redox' ? 'Fe²⁺' : 'HCl'}
            />

            {/* 4. 右侧 Viewfinder 凹液面光学视线放大镜 (x: 135~270, y: 40~300) */}
            <g transform="translate(135, 40)">
              <rect
                x="0"
                y="0"
                width="135"
                height="220"
                rx="8"
                fill={CANVAS_COLORS.white}
                stroke={CANVAS_COLORS.axis}
                strokeWidth="1.5"
              />
              <text x="10" y="22" fill={CANVAS_COLORS.labelText} fontSize={canvasSize.font(11)} fontWeight="bold">
                🔍 视线放大镜
              </text>

              <circle cx="67" cy="115" r="55" fill={CANVAS_COLORS.objectFillNeutral} stroke={SCENE_COLORS.industrialEquipment.absorptionTower} strokeWidth="2" />

              {/* 刻度线 */}
              <line x1="30" y1="75" x2="60" y2="75" stroke={SCENE_COLORS.materials.iron} strokeWidth="1.5" />
              <text x="25" y="78" fill={CANVAS_COLORS.labelTextLight} fontSize={canvasSize.font(9)} textAnchor="end">20.0</text>

              <line x1="30" y1="115" x2="60" y2="115" stroke={SCENE_COLORS.materials.iron} strokeWidth="1.5" />
              <text x="25" y="118" fill={CANVAS_COLORS.labelTextLight} fontSize={canvasSize.font(9)} textAnchor="end">21.0</text>

              <line x1="30" y1="155" x2="60" y2="155" stroke={SCENE_COLORS.materials.iron} strokeWidth="1.5" />
              <text x="25" y="158" fill={CANVAS_COLORS.labelTextLight} fontSize={canvasSize.font(9)} textAnchor="end">22.0</text>

              {/* 真实凹液面 (21.00 mL 对应 y=115) */}
              <path d="M 35 110 Q 52 120 67 110" fill="none" stroke={SCENE_COLORS.industrialEquipment.absorptionTower} strokeWidth="2.5" />
              <rect x="35" y="110" width="32" height="30" fill={withAlpha(SCENE_COLORS.industrialEquipment.absorptionTower, 0.2)} />

              {/* 眼睛 Icon */}
              <g transform={`translate(115, ${eyeY})`}>
                <ellipse cx="0" cy="0" rx="7" ry="4" fill="none" stroke={CHART_COLORS.highlight} strokeWidth="1.5" />
                <circle cx="0" cy="0" r="2" fill={CHART_COLORS.highlight} />
              </g>

              {/* 视线折射线：由「眼睛 → 凹液面最低点 (51.5, 115)」唯一确定，严格穿过凹液面最低点 */}
              <line
                x1="115"
                y1={eyeY}
                x2="30"
                y2={sightLineEndY}
                stroke={CHART_COLORS.highlight}
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
              {/* 视线与刻度基准线 (x=60) 的交点 = 实际读取位置 */}
              <circle cx={SCALE_READ_X} cy={readCrossY} r="2.5" fill={CHART_COLORS.highlight} />

              <text x="10" y="195" fill={CANVAS_COLORS.labelTextLight} fontSize={canvasSize.font(10)}>
                真值: <tspan fill={SCENE_COLORS.industrialEquipment.absorptionTower} fontWeight="bold">21.00 mL</tspan>
              </text>
              <text x="10" y="210" fill={CANVAS_COLORS.labelTextLight} fontSize={canvasSize.font(10)}>
                读数:{' '}
                <tspan fill={CHART_COLORS.highlight} fontWeight="bold">
                  {displayReadValue.toFixed(2)} mL ({readDirectionLabel})
                </tspan>
              </text>
            </g>
          </AnimationSvgCanvas>
        </div>

        {/* ── 右侧 560px 图表与定量拆解区 (复用 TitrationCurveChart 图表组件) ── */}
        <div className="flex-1 h-full relative p-4 flex flex-col gap-3 overflow-y-auto">
          {/* 1. 复用 TitrationCurveChart 规范图表组件 */}
          <div className="w-full h-[240px] rounded-xl p-2 border border-slate-200/80 shrink-0">
            <TitrationCurveChart
              points={titrationCurvePoints}
              equivalencePointV={errorResult.vTrue}
              currentV={currentVolume}
              title="滴定突跃曲线与极值误差偏移分析"
            />
          </div>

          {/* 2. 下方定量计算拆解卡片 */}
          <div className="flex-1 min-h-[140px] border border-slate-200/80 rounded-xl p-4 flex flex-col gap-3">
            {params.mode === 'error-analysis' && (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    📊 滴定测定结果极值评估
                  </h4>
                  {isEndpointReached && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse">
                      滴定终点已达 (指示剂变色)
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200">
                    <div className="text-[11px] text-slate-500">计算测得浓度 c(计算)</div>
                    <div className="text-sm font-bold text-amber-600 mt-1">{errorResult.cCalculated} mol/L</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200">
                    <div className="text-[11px] text-slate-500">相对误差 Error% (示意量级)</div>
                    <div className={`text-sm font-bold mt-1 ${errorResult.relativeErrorPct >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ≈ {errorResult.relativeErrorPct > 0 ? `+${errorResult.relativeErrorPct}` : errorResult.relativeErrorPct}%
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200">
                    <div className="text-[11px] text-slate-500">高考误差结论</div>
                    <div className={`text-sm font-bold mt-1 ${errorResult.effectDirection === 'high' ? 'text-rose-600' : errorResult.effectDirection === 'low' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {errorResult.effectDirection === 'high' ? '偏高 (偏大)' : errorResult.effectDirection === 'low' ? '偏低 (偏小)' : '无误差'}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                  <span className="font-bold text-slate-700">代数机理推导：</span>{errorResult.description}
                </p>
                {errorResult.isIndicative && (
                  <p className="text-xs text-amber-800 p-2.5 rounded-lg bg-amber-50 border border-amber-200 leading-relaxed">
                    <span className="font-bold">数值说明：</span>具体误操作造成的 V(标) 偏移幅度取决于残留水量、悬滴体积等无法由操作名唯一确定的因素，故 c(计算) 与 Error% 由简化模型给出，<span className="font-bold">仅示意量级</span>；高考只考查结果<span className="font-bold">偏高 / 偏低 / 无影响</span>的方向判定，不要求算出具体误差数值。
                  </p>
                )}
              </>
            )}

            {params.mode === 'purity-calc' && (
              <>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  🧪 样品纯度 w% 与返滴定物质的量拆解
                </h4>
                <div className="w-full bg-slate-200 h-6 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full flex items-center justify-center text-[10px] text-white font-bold transition-all duration-300 ${purityResult.overLimit ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, purityResult.purityPct)}%` }}
                  >
                    纯度 w% = {purityResult.purityPct}%
                  </div>
                </div>
                {purityResult.overLimit && (
                  <p className="text-xs text-rose-700 font-semibold p-2.5 rounded-lg bg-rose-50 border border-rose-200 leading-relaxed">
                    ⚠ 计算纯度 w% {`>`} 100%：粗样品中不可能含有超过 100% 的有效成分，说明当前「m(粗样品) / 定容总体积与移取量之比 / 滴定消耗体积」这组数据不自洽（例如返滴定中过量酸的物质的量远超样品所能消耗的量）。请调小 V₂、调小 V(总体积)/V(移取量) 比值，或调大 m(粗样品) 后重新计算——考场上算出 w% 超 100% 必须回头检查数据，而不能直接把结果当成 100%。
                  </p>
                )}
                <div className="p-3 rounded-lg border border-slate-200 space-y-1 text-xs text-slate-600">
                  <div><span className="font-semibold text-slate-700">计量比关系：</span>{purityResult.stoichiometryRatio}</div>
                  <div><span className="font-semibold text-slate-700">移取份量 n(aliquot)：</span>{purityResult.nAliquot} mol</div>
                  <div><span className="font-semibold text-slate-700">全样品总量 n(total)：</span>{purityResult.nTotalSample} mol</div>
                  <div><span className="font-semibold text-slate-700">纯成分质量 m(pure)：</span>{purityResult.mPureProduct} g / 粗重 {params.sampleMass} g</div>
                </div>
              </>
            )}

            {params.mode === 'yield-calc' && (
              <>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  ⚖️ 反应提纯产率 Yield% 计算
                </h4>
                <div className="w-full bg-slate-200 h-6 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full flex items-center justify-center text-[10px] text-white font-bold transition-all duration-300 ${yieldResult.overLimit ? 'bg-rose-500' : 'bg-purple-600'}`}
                    style={{ width: `${Math.min(100, yieldResult.yieldPct)}%` }}
                  >
                    产率 Yield% = {yieldResult.yieldPct}%
                  </div>
                </div>
                {yieldResult.overLimit && (
                  <p className="text-xs text-rose-700 font-semibold p-2.5 rounded-lg bg-rose-50 border border-rose-200 leading-relaxed">
                    ⚠ 计算产率 Yield% {`>`} 100%：产率不可能超过 100%，说明 m(实际纯品) 与投料量/理论最大产量不自洽（常见原因：计量系数比 rawToProductRatio 设错，或原料投料量偏小、实际产品质量偏大）。请核对化学方程式系数后重新计算。
                  </p>
                )}
                <div className="p-3 rounded-lg border border-slate-200 space-y-1 text-xs text-slate-600">
                  <div><span className="font-semibold text-slate-700">投料原料质量：</span>{params.rawMaterialMass} g</div>
                  <div><span className="font-semibold text-slate-700">理论最大产量：</span>{yieldResult.mTheoretical} g</div>
                  <div><span className="font-semibold text-slate-700">实际提纯质量：</span>{yieldResult.actualMass} g</div>
                </div>
              </>
            )}

            {/* 快速视角控制条 */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">快速视线微调：</span>
                <button
                  onClick={() => onUpdateParams({ errorOp: 'none', viewAngle: 0 })}
                  className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-xs font-semibold transition-colors"
                >
                  归位平视 (0°)
                </button>
                <button
                  onClick={() => onUpdateParams({ viewAngle: 10 })}
                  className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-xs font-semibold transition-colors"
                >
                  仰视 (+10°)
                </button>
                <button
                  onClick={() => onUpdateParams({ viewAngle: -10 })}
                  className="px-2 py-0.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded text-xs font-semibold transition-colors"
                >
                  俯视 (-10°)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 下半区：化学专属滴定演练控制组件 TitrationControls (挂载于底部，零外层滚动条) ── */}
      <div className="shrink-0 p-2 border-t border-slate-200">
        <TitrationControls
          volume={currentVolume}
          maxVolume={vMax}
          reagentName={params.titrationType === 'redox' ? '0.02 mol/L KMnO₄ 滴定试剂' : '0.1000 mol/L NaOH 滴加试剂'}
          isPlaying={isAutoPlaying}
          onPlayPause={onPlayPause}
          onSingleDrop={onSingleDrop}
          onBulkAdd={onBulkAdd}
          onReset={onReset}
          onVolumeChange={onVolumeChange}
          steps={titrationSteps}
          onJumpToStep={onVolumeChange}
        />
      </div>
    </div>
  )
}
