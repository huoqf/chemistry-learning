import React, { useState } from 'react'
import { Eye, FileCheck, HelpCircle } from 'lucide-react'
import { AnimationSvgCanvas } from '@/components/Layout'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { useAnimationViewport } from '@/hooks/useAnimationViewport'
import { useAnimationFrame } from '@/utils/animation'
import { CANVAS_PRESETS, CHEMISTRY_COLORS, CHART_COLORS, colors } from '@/theme'
import type { ModelQuizData } from '@/data/quiz/types'
import type { HessLawParams } from '../types'
import type { UseHessLawChemistryReturn } from '../hooks/useHessLawChemistry'

type CubicSeg = {
  p0: [number, number]
  p1: [number, number]
  p2: [number, number]
  p3: [number, number]
}

function evalCubicSeg(seg: CubicSeg, t: number): [number, number] {
  const u = 1 - t
  const u2 = u * u
  const t2 = t * t
  const x =
    u2 * u * seg.p0[0] +
    3 * u2 * t * seg.p1[0] +
    3 * u * t2 * seg.p2[0] +
    t2 * t * seg.p3[0]
  const y =
    u2 * u * seg.p0[1] +
    3 * u2 * t * seg.p1[1] +
    3 * u * t2 * seg.p2[1] +
    t2 * t * seg.p3[1]
  return [x, y]
}

function sampleSegs(segs: CubicSeg[], progress: number): [number, number] {
  const clamped = Math.max(0, Math.min(0.9999, progress))
  const scaled = clamped * segs.length
  const idx = Math.floor(scaled)
  const localT = scaled - idx
  return evalCubicSeg(segs[idx], localT)
}

interface HessLawCenterViewProps {
  params: HessLawParams
  chemistry: UseHessLawChemistryReturn
  quizData?: ModelQuizData
  viewMode: number
}

export const HessLawCenterView: React.FC<HessLawCenterViewProps> = ({
  params,
  chemistry,
  quizData,
  viewMode,
}) => {
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,
  })

  const font = canvasSize?.font || ((n: number) => n)
  const [animPhase, setAnimPhase] = useState(0)

  useAnimationFrame(
    (deltaTime) => {
      setAnimPhase((prev) => (prev + deltaTime / 6000) % 1)
    },
    { playing: viewMode === 0 },
  )

  const { currentHessGroup, hessCalculated, currentBondPreset, bondCalculated, energyProfile } =
    chemistry

  // 1. 渲染盖斯定律方程式叠加消去 SVG 图景
  const renderHessOverlaySvg = () => {
    return (
      <g transform="translate(40, 40)">
        {/* 背景卡片 */}
        <rect
          x={0}
          y={0}
          width={760}
          height={570}
          rx={16}
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth={2}
        />

        {/* 标题说明 */}
        <text x={30} y={40} fontSize={font(18)} fontWeight="bold" fill="#1E293B">
          盖斯定律代数叠加与中间微粒消去分析
        </text>
        <text x={30} y={65} fontSize={font(12)} fill="#64748B">
          目标反应: {currentHessGroup.targetFormula} | 理论 ΔH = {currentHessGroup.targetDeltaH} kJ/mol
        </text>

        {/* 分步方程式列表 */}
        {hessCalculated.stepsInfo.map((step, idx) => {
          const yOffset = 100 + idx * 130
          const kStr = step.k > 0 ? `+${step.k}` : `${step.k}`
          return (
            <g key={step.equation.id} transform={`translate(30, ${yOffset})`}>
              {/* 方程式底板 */}
              <rect
                x={0}
                y={0}
                width={700}
                height={100}
                rx={12}
                fill={step.k !== 0 ? '#F8FAFC' : '#F1F5F9'}
                stroke={step.k !== 0 ? '#CBD5E1' : '#E2E8F0'}
                strokeWidth={1.5}
              />

              {/* 系数 Badge */}
              <rect x={15} y={15} width={70} height={28} rx={6} fill={step.k > 0 ? '#6366F1' : step.k < 0 ? '#EF4444' : '#94A3B8'} />
              <text x={50} y={34} fontSize={font(13)} fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
                k = {kStr}
              </text>

              {/* 乘倍/反向后方程式 */}
              <text x={100} y={32} fontSize={font(13)} fontWeight="bold" fill="#334155">
                {step.equation.label} {step.k < 0 ? '（反向叠加）' : ''}
              </text>
              <text x={100} y={54} fontSize={font(12)} fill={step.k < 0 ? '#B91C1C' : '#0F172A'} fontWeight="bold" className="font-mono">
                变换式: {step.transformedText}
              </text>
              <text x={100} y={76} fontSize={font(11)} fill="#64748B" className="font-mono">
                原 ΔH = {step.equation.deltaH} kJ/mol
              </text>

              {/* 乘倍后结果 */}
              <g transform="translate(420, 15)">
                <rect x={0} y={0} width={265} height={70} rx={8} fill="#FFFFFF" stroke="#E2E8F0" />
                <text x={12} y={24} fontSize={font(11)} fontWeight="bold" fill="#64748B">
                  乘倍变换后 ΔH_{idx + 1}:
                </text>
                <text x={12} y={50} fontSize={font(16)} fontWeight="bold" fill={step.stepH < 0 ? '#22C55E' : step.stepH === 0 ? '#64748B' : '#EAB308'} className="font-mono">
                  {step.stepH > 0 ? `+${step.stepH.toFixed(1)}` : step.stepH.toFixed(1)} kJ/mol
                </text>
              </g>

              {/* 消除划线遮罩动画效果 */}
              {step.k === 0 && (
                <line x1={95} y1={30} x2={390} y2={30} stroke="#EF4444" strokeWidth={3} strokeDasharray="6,4" opacity={0.7} />
              )}
            </g>
          )
        })}

        {/* 最终代数求和结论卡片 */}
        <g transform="translate(30, 420)">
          {/* 分步叠加流向总方程脉冲点：限制在步骤卡片与总方程卡片之间的留白走廊内 [340, 408] */}
          {[0, 1].map((idx) => {
            const dotY = -80 + ((animPhase + idx * 0.5) % 1) * 68
            return (
              <circle
                key={idx}
                cx={210 + idx * 140}
                cy={dotY}
                r={3.5}
                fill={hessCalculated.isMatchTarget ? CHART_COLORS.primary : CHEMISTRY_COLORS.enthalpy}
                opacity={0.75}
              />
            )
          })}
          <rect
            x={0}
            y={0}
            width={700}
            height={110}
            rx={14}
            fill={hessCalculated.isMatchTarget ? '#F0FDF4' : '#FEF2F2'}
            stroke={hessCalculated.isMatchTarget ? '#86EFAC' : '#FCA5A5'}
            strokeWidth={2}
          />

          <text x={25} y={32} fontSize={font(14)} fontWeight="bold" fill={hessCalculated.isMatchTarget ? '#166534' : '#991B1B'}>
            ∑ (k_i × ΔH_i) 叠加推导结果:
          </text>

          <text x={25} y={68} fontSize={font(21)} fontWeight="extrabold" fill={hessCalculated.isMatchTarget ? '#15803D' : '#DC2626'} className="font-mono">
            ΔH_target = {hessCalculated.totalDeltaH > 0 ? `+${hessCalculated.totalDeltaH.toFixed(1)}` : hessCalculated.totalDeltaH.toFixed(1)} kJ/mol
          </text>

          <text x={25} y={94} fontSize={font(11)} fontWeight="medium" fill="#475569">
            {hessCalculated.eliminatedIntermediates.length > 0
              ? `已代数消去中间物种：${hessCalculated.eliminatedIntermediates.join('、')}`
              : '提示：调整系数 k₁、k₂ 使中间物种在叠加两侧完全消去'}
          </text>

          <g transform="translate(480, 25)">
            <rect
              x={0}
              y={0}
              width={200}
              height={60}
              rx={8}
              fill={hessCalculated.isMatchTarget ? '#DCFCE7' : '#FEE2E2'}
            />
            <text x={100} y={35} fontSize={font(13)} fontWeight="bold" fill={hessCalculated.isMatchTarget ? '#15803D' : '#B91C1C'} textAnchor="middle">
              {hessCalculated.isMatchTarget ? '已对齐目标反应' : '系数未配平至目标'}
            </text>
          </g>
        </g>
      </g>
    )
  }

  // 2. 渲染微观化学键能计算 SVG 图景
  const renderBondEnergySvg = () => {
    const { reactantEnergySum, productEnergySum } = bondCalculated
    const maxVal = Math.max(reactantEnergySum, productEnergySum, 1000)

    const barHeightReactant = (reactantEnergySum / maxVal) * 180
    const barHeightProduct = (productEnergySum / maxVal) * 180

    return (
      <g transform="translate(40, 40)">
        <rect x={0} y={0} width={760} height={570} rx={16} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth={2} />

        <text x={30} y={40} fontSize={font(18)} fontWeight="bold" fill="#1E293B">
          微观断键与成键能量高程图 — {currentBondPreset.name}
        </text>
        <text x={30} y={65} fontSize={font(13)} fill="#64748B" className="font-mono">
          方程式: {currentBondPreset.formula}
        </text>

        {/* 左侧：断键吸热能量柱 */}
        <g transform="translate(100, 110)">
          <text x={60} y={14} fontSize={font(13)} fontWeight="bold" fill="#DC2626" textAnchor="middle">
            断键吸收总能量 (Q_吸)
          </text>
          <rect x={20} y={240 - barHeightReactant} width={80} height={barHeightReactant} rx={8} fill="#FCA5A5" stroke="#EF4444" strokeWidth={2} />
          <text x={60} y={240 - barHeightReactant - 10} fontSize={font(14)} fontWeight="bold" fill="#991B1B" textAnchor="middle" className="font-mono">
            +{reactantEnergySum} kJ/mol
          </text>

          {/* 键列表明细 */}
          <g transform="translate(-35, 310)">
            <rect x={0} y={0} width={215} height={80} rx={8} fill="#FEF2F2" stroke="#FECACA" />
            {currentBondPreset.reactantBonds.map((b, i) => (
              <text key={i} x={10} y={22 + i * 22} fontSize={font(11)} fill="#7F1D1D">
                {b.name}: {b.count} × {b.bondEnergy}
              </text>
            ))}
          </g>
        </g>

        {/* 中央：断键→原子化→成键过程动态示意与减号 */}
        <g transform="translate(275, 195)">
          <rect x={0} y={0} width={130} height={150} rx={12} fill={colors.neutral[50]} stroke={colors.neutral[200]} />
          <text x={65} y={20} fontSize={font(10)} fontWeight="bold" fill={colors.neutral[600]} textAnchor="middle">
            {animPhase < 0.45 ? '吸热断键裂解' : animPhase < 0.6 ? '气态游离原子态' : '成键释放能量'}
          </text>
          {/* 原子对间距：先拉断增大，后重新成键 */}
          {(() => {
            const sep =
              animPhase < 0.45
                ? 10 + (animPhase / 0.45) * 24
                : animPhase < 0.6
                ? 34
                : 34 - ((animPhase - 0.6) / 0.4) * 22
            const stateColor =
              animPhase < 0.45
                ? CHEMISTRY_COLORS.enthalpy
                : animPhase < 0.6
                ? colors.warning[500]
                : CHART_COLORS.primary
            return (
              <g transform="translate(65, 62)">
                <line
                  x1={-sep}
                  y1={0}
                  x2={sep}
                  y2={0}
                  stroke={stateColor}
                  strokeWidth={animPhase >= 0.45 && animPhase < 0.6 ? 1.5 : 3}
                  strokeDasharray={animPhase >= 0.45 && animPhase < 0.6 ? '3 3' : undefined}
                />
                <circle cx={-sep} cy={0} r={9} fill={stateColor} stroke={colors.neutral.white} strokeWidth={1.5} />
                <circle cx={sep} cy={0} r={9} fill={stateColor} stroke={colors.neutral.white} strokeWidth={1.5} />
              </g>
            )
          })()}
          <circle cx={65} cy={112} r={20} fill={colors.neutral.white} stroke={colors.neutral[300]} strokeWidth={1.5} />
          <text x={65} y={118} fontSize={font(20)} fontWeight="bold" fill={colors.neutral[700]} textAnchor="middle">
            -
          </text>
        </g>

        {/* 右侧：成键放热能量柱 */}
        <g transform="translate(420, 110)">
          <text x={60} y={14} fontSize={font(13)} fontWeight="bold" fill="#166534" textAnchor="middle">
            成键释放总能量 (Q_放)
          </text>
          <rect x={20} y={240 - barHeightProduct} width={80} height={barHeightProduct} rx={8} fill="#86EFAC" stroke="#22C55E" strokeWidth={2} />
          <text x={60} y={240 - barHeightProduct - 10} fontSize={font(14)} fontWeight="bold" fill="#14532D" textAnchor="middle" className="font-mono">
            {productEnergySum} kJ/mol (放热)
          </text>

          {/* 键列表明细 */}
          <g transform="translate(-35, 310)">
            <rect x={0} y={0} width={215} height={80} rx={8} fill="#F0FDF4" stroke="#BBF7D0" />
            {currentBondPreset.productBonds.map((b, i) => (
              <text key={i} x={10} y={22 + i * 22} fontSize={font(11)} fill="#14532D">
                {b.name}: {b.count} × {b.bondEnergy}
              </text>
            ))}
          </g>
        </g>

        {/* 高考避坑警示卡 */}
        <g transform="translate(30, 480)">
          <rect x={0} y={0} width={700} height={65} rx={10} fill="#FFFBEB" stroke="#FDE68A" strokeWidth={1.5} />
          <text x={20} y={25} fontSize={font(12)} fontWeight="bold" fill="#92400E">
            避坑要点提示（ΔH = Q_吸 - Q_放 = {reactantEnergySum - productEnergySum > 0 ? `+${reactantEnergySum - productEnergySum}` : reactantEnergySum - productEnergySum} kJ/mol）：
          </text>

          <text x={20} y={48} fontSize={font(11)} fill="#B45309" className="font-medium">
            {currentBondPreset.trapWarning || '微观键能计算公式：ΔH = 反应物断键总键能 - 生成物成键总键能。'}
          </text>
        </g>
      </g>
    )
  }

  // 3. 渲染反应历程与活化能高程 SVG 图景
  const renderEnergyProfileSvg = () => {
    const {
      reactantEnergy,
      productEnergy,
      uncatalyzedPeak,
      catalyzedPeak1,
      catalyzedPeak2,
      intermediateEnergy,
      deltaH,
      eaForwardUncat,
      eaReverseUncat,
      eaForwardCatStep1,
      eaForwardCatStep2,
      apparentCatEa,
    } = energyProfile

    // 坐标系转换 (Y 轴倒置，能量越高 Y 越小)
    const mapY = (e: number) => 460 - (e / 300) * 340
    const yReactant = mapY(reactantEnergy)
    const yProduct = mapY(productEnergy)
    const yUncatPeak = mapY(uncatalyzedPeak)
    const yCatPeak1 = mapY(catalyzedPeak1)
    const yInter = mapY(intermediateEnergy)
    const yCatPeak2 = mapY(catalyzedPeak2)

    // 无催化剂贝塞尔曲线
    const uncatPath = `M 80,${yReactant} L 180,${yReactant} C 260,${yReactant} 300,${yUncatPeak} 380,${yUncatPeak} C 460,${yUncatPeak} 500,${yProduct} 580,${yProduct} L 680,${yProduct}`

    // 有催化剂双峰贝塞尔曲线
    const catPath = `M 80,${yReactant} L 180,${yReactant} C 230,${yReactant} 260,${yCatPeak1} 300,${yCatPeak1} C 340,${yCatPeak1} 360,${yInter} 400,${yInter} C 440,${yInter} 470,${yCatPeak2} 510,${yCatPeak2} C 550,${yCatPeak2} 580,${yProduct} 680,${yProduct}`

    const uncatSegs: CubicSeg[] = [
      { p0: [80, yReactant], p1: [113, yReactant], p2: [147, yReactant], p3: [180, yReactant] },
      { p0: [180, yReactant], p1: [260, yReactant], p2: [300, yUncatPeak], p3: [380, yUncatPeak] },
      { p0: [380, yUncatPeak], p1: [460, yUncatPeak], p2: [500, yProduct], p3: [580, yProduct] },
      { p0: [580, yProduct], p1: [613, yProduct], p2: [647, yProduct], p3: [680, yProduct] },
    ]
    const catSegs: CubicSeg[] = [
      { p0: [80, yReactant], p1: [113, yReactant], p2: [147, yReactant], p3: [180, yReactant] },
      { p0: [180, yReactant], p1: [230, yReactant], p2: [260, yCatPeak1], p3: [300, yCatPeak1] },
      { p0: [300, yCatPeak1], p1: [340, yCatPeak1], p2: [360, yInter], p3: [400, yInter] },
      { p0: [400, yInter], p1: [440, yInter], p2: [470, yCatPeak2], p3: [510, yCatPeak2] },
      { p0: [510, yCatPeak2], p1: [550, yCatPeak2], p2: [580, yProduct], p3: [680, yProduct] },
    ]
    // 催化剂显著降低活化能，同等条件下更快翻越能垒抵达生成物
    const uncatProgress = animPhase
    const catProgress = (animPhase * 2) % 1
    const [ux, uy] = sampleSegs(uncatSegs, uncatProgress)
    const [cx, cy] = sampleSegs(catSegs, catProgress)

    return (
      <g transform="translate(40, 40)">
        <rect x={0} y={0} width={760} height={570} rx={16} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth={2} />

        <text x={30} y={40} fontSize={font(18)} fontWeight="bold" fill="#1E293B">
          反应历程与活化能高程图 (能量-反应坐标)
        </text>
        <text x={30} y={65} fontSize={font(12)} fill="#64748B">
          无催化剂 vs 催化剂双峰路径对比 | 探究活化能 Ea 与 ΔH 的本质联系
        </text>

        {/* 坐标轴 */}
        <line x1={60} y1={480} x2={720} y2={480} stroke="#94A3B8" strokeWidth={2} />
        <line x1={60} y1={480} x2={60} y2={80} stroke="#94A3B8" strokeWidth={2} />
        <text x={720} y={500} fontSize={font(12)} fontWeight="bold" fill="#64748B" textAnchor="end">
          反应坐标
        </text>
        <text x={50} y={75} fontSize={font(12)} fontWeight="bold" fill="#64748B" textAnchor="end">
          能量 E (kJ/mol)
        </text>

        {/* 反应物 / 产物 能量虚线基准 */}
        <line x1={60} y1={yReactant} x2={680} y2={yReactant} stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="4,4" />
        <line x1={60} y1={yProduct} x2={680} y2={yProduct} stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="4,4" />

        <text x={70} y={yReactant - 8} fontSize={font(12)} fontWeight="bold" fill="#6366F1">
          反应物 (E_反应物 = {reactantEnergy} kJ/mol)
        </text>
        <text x={590} y={yProduct + 20} fontSize={font(12)} fontWeight="bold" fill="#10B981">
          生成物 (E_生成物 = {productEnergy} kJ/mol)
        </text>

        {/* 无催化剂路径 (蓝实线) */}
        <path d={uncatPath} fill="none" stroke="#3B82F6" strokeWidth={3} />

        {/* 催化剂路径 (橙虚线) */}
        {params.hasCatalyst === 1 && (
          <path d={catPath} fill="none" stroke="#F59E0B" strokeWidth={3} strokeDasharray="6,4" />
        )}

        {/* 动态反应微粒：对比无催化与催化越垒进度 */}
        <g>
          <circle cx={ux} cy={uy} r={7} fill={colors.primary[500]} stroke={colors.neutral.white} strokeWidth={2} />
          <text x={ux} y={uy - 12} fontSize={font(9.5)} fontWeight="bold" fill={colors.primary[700]} textAnchor="middle">
            无催化分子
          </text>
          {params.hasCatalyst === 1 && (
            <g>
              <circle cx={cx} cy={cy} r={7} fill={colors.warning[500]} stroke={colors.neutral.white} strokeWidth={2} />
              <text x={cx} y={cy - 12} fontSize={font(9.5)} fontWeight="bold" fill={colors.warning[700]} textAnchor="middle">
                催化路径分子
              </text>
            </g>
          )}
        </g>

        {/* 正反应活化能 Ea(正) 垂直线 */}
        <line x1={380} y1={yReactant} x2={380} y2={yUncatPeak} stroke="#EF4444" strokeWidth={2} />
        <text x={390} y={(yReactant + yUncatPeak) / 2} fontSize={font(12)} fontWeight="bold" fill="#DC2626">
          无催化 Ea(正) = {eaForwardUncat} kJ/mol
        </text>

        {/* 逆反应活化能 Ea(逆) 垂直线 */}
        <line x1={540} y1={yProduct} x2={540} y2={yUncatPeak} stroke="#8B5CF6" strokeWidth={2} />
        <text x={550} y={(yProduct + yUncatPeak) / 2} fontSize={font(12)} fontWeight="bold" fill="#7C3AED">
          Ea(逆) = {eaReverseUncat} kJ/mol
        </text>

        {/* 催化剂两步标注与决速步 */}
        {params.hasCatalyst === 1 && (
          <g>
            {/* TS1 过渡态 */}
            <circle cx={300} cy={yCatPeak1} r={4} fill="#F59E0B" />
            <text x={300} y={yCatPeak1 - 8} fontSize={font(10)} fontWeight="bold" fill="#B45309" textAnchor="middle">
              TS1 ({catalyzedPeak1})
            </text>
            <line x1={260} y1={yReactant} x2={260} y2={yCatPeak1} stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3,3" />
            <text x={255} y={(yReactant + yCatPeak1) / 2} fontSize={font(10)} fontWeight="bold" fill="#D97706" textAnchor="end">
              Ea1={eaForwardCatStep1}
            </text>

            {/* 中间体基准线与标注 */}
            <circle cx={400} cy={yInter} r={4} fill="#F59E0B" />
            <line x1={370} y1={yInter} x2={470} y2={yInter} stroke="#FDE68A" strokeWidth={1.5} strokeDasharray="3,2" />
            <text x={400} y={yInter + 16} fontSize={font(10)} fontWeight="bold" fill="#B45309" textAnchor="middle">
              中间体 ({intermediateEnergy})
            </text>

            {/* TS2 决速步过渡态 */}
            <circle cx={510} cy={yCatPeak2} r={4} fill="#EF4444" />
            <text x={510} y={yCatPeak2 - 8} fontSize={font(10)} fontWeight="bold" fill="#DC2626" textAnchor="middle">
              TS2 ({catalyzedPeak2} 决速)
            </text>
            <line x1={470} y1={yInter} x2={470} y2={yCatPeak2} stroke="#DC2626" strokeWidth={1.5} strokeDasharray="3,3" />
            <text x={475} y={(yInter + yCatPeak2) / 2} fontSize={font(10)} fontWeight="bold" fill="#DC2626" textAnchor="start">
              Ea2={eaForwardCatStep2} (决速步)
            </text>
          </g>
        )}

        {/* ΔH 标识线 */}
        <line x1={650} y1={yReactant} x2={650} y2={yProduct} stroke="#10B981" strokeWidth={3} />
        <text x={660} y={(yReactant + yProduct) / 2} fontSize={font(13)} fontWeight="bold" fill="#047857" className="font-mono">
          ΔH = {deltaH} kJ/mol
        </text>

        {/* 底部考点总结框 */}
        <g transform="translate(60, 495)">
          <rect x={0} y={0} width={640} height={55} rx={8} fill="#F8FAFC" stroke="#E2E8F0" />
          <text x={15} y={22} fontSize={font(11)} fontWeight="bold" fill="#334155">
            核心公式: ΔH = Ea(正) - Ea(逆) = {eaForwardUncat} - {eaReverseUncat} = {deltaH} kJ/mol (放热反应)
          </text>
          <text x={15} y={42} fontSize={font(11)} fill={params.hasCatalyst === 1 ? '#D97706' : '#64748B'} className="font-medium">
            {params.hasCatalyst === 1
              ? `催化剂降低能垒：步骤1 Ea1=${eaForwardCatStep1} kJ/mol，步骤2 Ea2=${eaForwardCatStep2} kJ/mol（能垒最高，为决速步）；表观活化能 Ea(表观)=${apparentCatEa} kJ/mol；ΔH 恒定仍为 ${deltaH} kJ/mol！`
              : `未加催化剂：克服单步高能垒 Ea(正)=${eaForwardUncat} kJ/mol，反应速率较慢。`}
          </text>
        </g>
      </g>
    )
  }

  return (
    <div className="w-full h-full flex flex-col p-4 overflow-hidden">
      <div key="view-scene" className={viewMode === 0 ? 'w-full flex-1 flex flex-col min-h-[520px]' : 'hidden'}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-600" />
              母题七矢量高程图与盖斯定律推导 (2D SVG)
            </span>
            <span className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md font-mono font-bold border border-indigo-100">
              {params.mode === 'hess-overlay'
                ? '盖斯定律方程式代数消去'
                : params.mode === 'bond-energy'
                ? '微观键能 Q_吸 - Q_放'
                : '反应坐标 活化能高程'}
            </span>
          </div>

          <div className="w-full flex-1 min-h-[440px]">
            <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
              {params.mode === 'hess-overlay' && renderHessOverlaySvg()}
              {params.mode === 'bond-energy' && renderBondEnergySvg()}
              {params.mode === 'energy-profile' && renderEnergyProfileSvg()}
            </AnimationSvgCanvas>
          </div>
        </div>

      {viewMode === 1 && quizData && (
        <div key="view-scoring" className="w-full h-full flex flex-col gap-3 overflow-y-auto">
          <div className="flex items-center justify-between border-b pb-2 shrink-0">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              高考规范答题踩分点与盖斯定律计算步骤
            </h3>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-medium border border-emerald-200">
              全套 4 大踩分步骤规范
            </span>
          </div>
          <ScoringCardSection steps={quizData.scoringSteps} />
        </div>
      )}

      {viewMode === 2 && quizData && (
        <div key="view-quiz" className="w-full h-full flex flex-col gap-3 overflow-y-auto">
          <div className="flex items-center justify-between border-b pb-2 shrink-0">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              考点变式选择题 & 详细解析
            </h3>
            <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md font-medium border border-amber-200">
              覆盖盖斯定律与键能高频变式
            </span>
          </div>
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        </div>
      )}
    </div>
  )
}
