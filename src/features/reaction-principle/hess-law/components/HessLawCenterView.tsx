import React from 'react'
import { Eye, FileCheck, HelpCircle } from 'lucide-react'
import { AnimationSvgCanvas } from '@/components/Layout'
import { ScoringCardSection, GaokaoVariantQuiz } from '@/components/UI'
import { useAnimationViewport } from '@/hooks/useAnimationViewport'
import { CANVAS_PRESETS } from '@/theme'
import type { ModelQuizData } from '@/data/quiz/types'
import type { HessLawParams } from '../types'
import type { UseHessLawChemistryReturn } from '../hooks/useHessLawChemistry'

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

              {/* 原方程式 */}
              <text x={100} y={34} fontSize={font(14)} fontWeight="bold" fill="#334155">
                {step.equation.label}
              </text>
              <text x={100} y={58} fontSize={font(12)} fill="#475569" className="font-mono">
                原 ΔH = {step.equation.deltaH} kJ/mol
              </text>

              {/* 乘倍后结果 */}
              <g transform="translate(420, 15)">
                <rect x={0} y={0} width={265} height={70} rx={8} fill="#FFFFFF" stroke="#E2E8F0" />
                <text x={12} y={24} fontSize={font(11)} fontWeight="bold" fill="#64748B">
                  乘倍变换后 ΔH_{idx + 1}:
                </text>
                <text x={12} y={50} fontSize={font(16)} fontWeight="bold" fill={step.stepH < 0 ? '#22C55E' : '#EAB308'} className="font-mono">
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

          <text x={25} y={35} fontSize={font(15)} fontWeight="bold" fill={hessCalculated.isMatchTarget ? '#166534' : '#991B1B'}>
            ∑ (k_i × ΔH_i) 叠加推导结果:
          </text>

          <text x={25} y={75} fontSize={font(22)} fontWeight="extrabold" fill={hessCalculated.isMatchTarget ? '#15803D' : '#DC2626'} className="font-mono">
            ΔH_target = {hessCalculated.totalDeltaH > 0 ? `+${hessCalculated.totalDeltaH.toFixed(1)}` : hessCalculated.totalDeltaH.toFixed(1)} kJ/mol
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
              {hessCalculated.isMatchTarget ? '✅ 完美对齐目标反应' : '⚠️ 系数未配平至目标'}
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

    const barHeightReactant = (reactantEnergySum / maxVal) * 260
    const barHeightProduct = (productEnergySum / maxVal) * 260

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
          <text x={60} y={20} fontSize={font(13)} fontWeight="bold" fill="#DC2626" textAnchor="middle">
            断键吸收总能量 (Q_吸)
          </text>
          <rect x={20} y={260 - barHeightReactant + 30} width={80} height={barHeightReactant} rx={8} fill="#FCA5A5" stroke="#EF4444" strokeWidth={2} />
          <text x={60} y={260 - barHeightReactant + 20} fontSize={font(14)} fontWeight="bold" fill="#991B1B" textAnchor="middle" className="font-mono">
            +{reactantEnergySum} kJ
          </text>

          {/* 键列表明细 */}
          <g transform="translate(-10, 310)">
            <rect x={0} y={0} width={140} height={80} rx={8} fill="#FEF2F2" stroke="#FECACA" />
            {currentBondPreset.reactantBonds.map((b, i) => (
              <text key={i} x={10} y={22 + i * 22} fontSize={font(11)} fill="#7F1D1D">
                {b.name}: {b.count} × {b.bondEnergy}
              </text>
            ))}
          </g>
        </g>

        {/* 中央：符号与减号 */}
        <g transform="translate(300, 240)">
          <circle cx={40} cy={40} r={30} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={2} />
          <text x={40} y={48} fontSize={font(24)} fontWeight="bold" fill="#475569" textAnchor="middle">
            -
          </text>
        </g>

        {/* 右侧：成键放热能量柱 */}
        <g transform="translate(420, 110)">
          <text x={60} y={20} fontSize={font(13)} fontWeight="bold" fill="#166534" textAnchor="middle">
            成键释放总能量 (Q_放)
          </text>
          <rect x={20} y={260 - barHeightProduct + 30} width={80} height={barHeightProduct} rx={8} fill="#86EFAC" stroke="#22C55E" strokeWidth={2} />
          <text x={60} y={260 - barHeightProduct + 20} fontSize={font(14)} fontWeight="bold" fill="#14532D" textAnchor="middle" className="font-mono">
            -{productEnergySum} kJ
          </text>

          {/* 键列表明细 */}
          <g transform="translate(-10, 310)">
            <rect x={0} y={0} width={140} height={80} rx={8} fill="#F0FDF4" stroke="#BBF7D0" />
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
            ⚡ 避坑要点提示：
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
    const { reactantEnergy, productEnergy, uncatalyzedPeak, catalyzedPeak1, catalyzedPeak2, intermediateEnergy, deltaH, eaForwardUncat, eaReverseUncat, maxCatEa } =
      energyProfile

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

    return (
      <g transform="translate(40, 40)">
        <rect x={0} y={0} width={760} height={570} rx={16} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth={2} />

        <text x={30} y={40} fontSize={font(18)} fontWeight="bold" fill="#1E293B">
          反应历程与活化能高程图 (E-t 反应坐标)
        </text>
        <text x={30} y={65} fontSize={font(12)} fill="#64748B">
          无催化剂 vs 催化剂双峰路径对比 | 探究活化能 Ea 与 ΔH 的本质联系
        </text>

        {/* 坐标轴 */}
        <line x1={60} y1={480} x2={720} y2={480} stroke="#94A3B8" strokeWidth={2} />
        <line x1={60} y1={480} x2={60} y2={80} stroke="#94A3B8" strokeWidth={2} />
        <text x={720} y={500} fontSize={font(12)} fontWeight="bold" fill="#64748B" textAnchor="end">
          反应进程 (t)
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

        {/* 正反应活化能 Ea(正) 垂直线 */}
        <line x1={380} y1={yReactant} x2={380} y2={yUncatPeak} stroke="#EF4444" strokeWidth={2} />
        <text x={390} y={(yReactant + yUncatPeak) / 2} fontSize={font(12)} fontWeight="bold" fill="#DC2626">
          Ea(正) = {eaForwardUncat} kJ/mol
        </text>

        {/* 逆反应活化能 Ea(逆) 垂直线 */}
        <line x1={500} y1={yProduct} x2={500} y2={yUncatPeak} stroke="#8B5CF6" strokeWidth={2} />
        <text x={510} y={(yProduct + yUncatPeak) / 2} fontSize={font(12)} fontWeight="bold" fill="#7C3AED">
          Ea(逆) = {eaReverseUncat} kJ/mol
        </text>

        {/* ΔH 标识线 */}
        <line x1={640} y1={yReactant} x2={640} y2={yProduct} stroke="#10B981" strokeWidth={3} />
        <text x={650} y={(yReactant + yProduct) / 2} fontSize={font(13)} fontWeight="bold" fill="#047857" className="font-mono">
          ΔH = {deltaH} kJ/mol
        </text>

        {/* 底部考点总结框 */}
        <g transform="translate(70, 495)">
          <rect x={0} y={0} width={620} height={55} rx={8} fill="#F8FAFC" stroke="#E2E8F0" />
          <text x={15} y={22} fontSize={font(11)} fontWeight="bold" fill="#334155">
            核心公式: ΔH = Ea(正) - Ea(逆) = {eaForwardUncat} - {eaReverseUncat} = {deltaH} kJ/mol
          </text>
          <text x={15} y={42} fontSize={font(11)} fill={params.hasCatalyst === 1 ? '#D97706' : '#64748B'} className="font-medium">
            {params.hasCatalyst === 1
              ? `催化剂降低最大能垒能跃为 ${maxCatEa} kJ/mol (决速步)，但 ΔH 恒定仍为 ${deltaH} kJ/mol！`
              : '未加催化剂，克服最大能垒需 90 kJ/mol。'}
          </text>
        </g>
      </g>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col p-4 overflow-hidden">
      {viewMode === 0 && (
        <div key="view-scene" className="w-full flex-1 flex flex-col min-h-[520px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-600" />
              母题九矢量高程图与盖斯定律推导 (2D SVG)
            </span>
            <span className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md font-mono font-bold border border-indigo-100">
              {params.mode === 'hess-overlay'
                ? '盖斯定律方程式代数消去'
                : params.mode === 'bond-energy'
                ? '微观键能 Q_吸 - Q_放'
                : '反应坐标 E-t 活化能高程'}
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
      )}

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
              高考真题变式选择题 & 详细解析
            </h3>
            <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md font-medium border border-amber-200">
              收录近年高考权威真题
            </span>
          </div>
          <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
        </div>
      )}
    </div>
  )
}
