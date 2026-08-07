import React from 'react'
import { AnimationSvgCanvas } from '@/components/Layout'
import {
  ScoringCardSection,
  GaokaoVariantQuiz,
} from '@/components/UI'
import {
  ErlenmeyerFlaskApparatus,
  KippApparatus,
  GasWashingBottleApparatus,
  DryingTubeApparatus,
  GasJarApparatus,
  AntiSiphonFunnelApparatus,
  SolidHeatingGeneratorApparatus,
  LiquidHeatingGeneratorApparatus,
  NoHeatGeneratorApparatus,
  BeakerApparatus,
  BubbleEmitter,
} from '@/components/Chemistry'
import { useAnimationViewport, useSceneScale } from '@/hooks'
import {
  CANVAS_PRESETS,
  SCENE_COLORS,
  CHEMISTRY_COLORS,
  colors,
  withAlpha,
  STROKE,
  FONT,
} from '@/theme'
import type { GasChainParams } from '../types'
import type { GasChainChemistryResult } from '../hooks/useGasChainChemistry'
import type { ModelQuizData } from '@/data/quiz/types'
import {
  solvePhysicalConstraints,
  solvePhysicalChainLayout,
} from '../physics'
import type { ApparatusLayout } from '../physics/types'

interface GasChainCenterViewProps {
  params: GasChainParams
  chemistry: GasChainChemistryResult
  quizData?: ModelQuizData
}

export const GasChainCenterView: React.FC<GasChainCenterViewProps> = ({
  params,
  chemistry,
  quizData,
}) => {
  const {
    viewMode,
    generator,
    washReagent,
    washReverse,
    dryer,
    collection,
    tailGas,
    heating,
    systemId,
    targetGas,
    flowRate,
  } = params
  const { hasDangerAlert, dangerType } = chemistry

  // 1. 视口与比例尺设置
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,
  })

  useSceneScale({
    vp,
    preset: CANVAS_PRESETS.full,
    anchor: 'center',
  })

  const baseY = 480
  const isEthylene = systemId === 'c2h4-prep' || targetGas === 'C₂H₄'

  // 2. 约束求解（仅用于倒置漏斗深度等细节参数）
  const constraints = solvePhysicalConstraints({
    targetGas,
    generator,
    washReagent,
    dryer,
    collection,
    tailGas,
    flowRate,
    hasDangerAlert,
    dangerType,
    baseY,
  })

  // 3. 布局引擎：单一事实来源
  const layout = solvePhysicalChainLayout({
    generator,
    washReagent,
    dryer,
    collection,
    tailGas,
    washReverse,
    baseY,
  })

  const { apparatusLayouts, routes, slotX } = layout

  // 辅助：按 id 查找器材布局
  const getLayout = (id: ApparatusLayout['id']) =>
    apparatusLayouts.find((a) => a.id === id) ?? null

  const genLayout = getLayout('generator')
  const washLayout = getLayout('wash')
  const dryerLayout = getLayout('dryer')
  const collLayout = getLayout('collection')
  const tailLayout = getLayout('tailgas')

  // 4. 视觉颜色计算
  let washSolutionColor = withAlpha(SCENE_COLORS.reagent.solution, 0.15)
  if (washReagent === 'fuchsin') {
    washSolutionColor =
      targetGas === 'SO₂' && flowRate > 0
        ? withAlpha(SCENE_COLORS.reactionAndGas.dryingTube, 0.2)
        : withAlpha(colors.danger[400], 0.6)
  } else if (washReagent === 'kmno4') {
    washSolutionColor =
      (targetGas === 'SO₂' || targetGas === 'C₂H₄') && flowRate > 0
        ? withAlpha(SCENE_COLORS.materials.glass, 0.2)
        : withAlpha(CHEMISTRY_COLORS.pH, 0.7)
  } else if (washReagent === 'sat-nacl') {
    washSolutionColor = withAlpha(SCENE_COLORS.materials.glass, 0.3)
  } else if (washReagent === 'naoh') {
    washSolutionColor = withAlpha(SCENE_COLORS.reagent.solution, 0.2)
  }

  let gasColor = withAlpha(SCENE_COLORS.reagent.solution, 0.1)
  if (targetGas === 'Cl₂') gasColor = withAlpha(CHEMISTRY_COLORS.concentration, 0.5)
  if (targetGas === 'NO₂') gasColor = withAlpha(colors.accent[600], 0.6)

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative">
      {/* 视角 0: 图谱探究 */}
      {viewMode === 0 && (
        <div className="w-full h-full relative overflow-hidden flex flex-col">
          <div className="w-full h-full flex-1 min-h-0">
            <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
              {/* 0. 实验桌台面线 */}
              <rect
                x={10}
                y={baseY}
                width={820}
                height={12}
                fill={SCENE_COLORS.heatingAndSupport.asbestosMesh}
                rx={2}
              />
              <line
                x1={20}
                y1={baseY + 12}
                x2={820}
                y2={baseY + 12}
                stroke={SCENE_COLORS.container.beakerBorder}
                strokeWidth={STROKE.objectLine}
              />

              {/* ─── Slot 0: 发生装置 ─── */}
              {genLayout && (
                <g id="slot-0-generator">
                  {generator === 'flask-heat' && (
                    <LiquidHeatingGeneratorApparatus
                      x={genLayout.x}
                      y={genLayout.y}
                      heating={heating}
                      isEthylene={isEthylene}
                      font={canvasSize.font}
                    />
                  )}
                  {generator === 'testtube-heat' && (
                    <SolidHeatingGeneratorApparatus
                      x={genLayout.x}
                      y={genLayout.y}
                      targetGas={targetGas}
                      lit={heating}
                      font={canvasSize.font}
                    />
                  )}
                  {generator === 'flask-noheat' && (
                    <NoHeatGeneratorApparatus
                      x={genLayout.x}
                      y={genLayout.y}
                      targetGas={targetGas}
                      font={canvasSize.font}
                    />
                  )}
                  {generator === 'kipp' && (
                    <KippApparatus
                      x={genLayout.x}
                      y={genLayout.y}
                      width={genLayout.width}
                      height={genLayout.height}
                      isOpen={flowRate > 0}
                      gasLabel={targetGas}
                    />
                  )}

                  {/* 倒吸炸裂警告 */}
                  {hasDangerAlert && dangerType === 'siphon' && (
                    <g
                      transform={`translate(${slotX[0]}, ${baseY - 130})`}
                      className="animate-pulse"
                    >
                      <circle
                        cx={0}
                        cy={0}
                        r={36}
                        fill={withAlpha(colors.danger[500], 0.15)}
                        stroke={colors.danger[500]}
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                      />
                      <circle
                        cx={0}
                        cy={0}
                        r={24}
                        fill={colors.danger[500]}
                        fillOpacity={0.9}
                        stroke={colors.danger[700]}
                        strokeWidth={2}
                      />
                      <text
                        x={0}
                        y={4}
                        textAnchor="middle"
                        fill={colors.neutral.white}
                        fontSize={canvasSize.font(FONT.annotation)}
                        fontWeight="extrabold"
                      >
                        💥 倒吸炸裂
                      </text>
                    </g>
                  )}

                  <g transform={`translate(${slotX[0]}, ${baseY + 28})`}>
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fill={SCENE_COLORS.labels.chemicalFormula}
                      fontSize={canvasSize.font(FONT.label)}
                      fontWeight="bold"
                    >
                      ① 发生装置
                    </text>
                    <text
                      x={0}
                      y={15}
                      textAnchor="middle"
                      fill={colors.neutral[500]}
                      fontSize={canvasSize.font(FONT.annotation)}
                    >
                      ({targetGas})
                    </text>
                  </g>
                </g>
              )}

              {/* ─── Slot 1: 净化洗气瓶 ─── */}
              {washLayout && (
                <g id="slot-1-wash">
                  <GasWashingBottleApparatus
                    x={washLayout.x}
                    y={washLayout.y}
                    width={washLayout.width}
                    height={washLayout.height}
                    reagentType={
                      washReagent === 'sat-nacl'
                        ? 'acid'
                        : washReagent === 'water'
                        ? 'water'
                        : 'base'
                    }
                    bubbling={flowRate > 0 && !washReverse}
                    reversed={washReverse}
                  />

                  {/* 洗液着色覆盖层 */}
                  <rect
                    x={washLayout.x + 10}
                    y={washLayout.y + 75}
                    width={washLayout.width - 20}
                    height={55}
                    fill={washSolutionColor}
                    rx={4}
                  />

                  {flowRate > 0 && !washReverse && (
                    <BubbleEmitter
                      x={washLayout.x + washLayout.width * 0.3}
                      y={washLayout.y + 110}
                      count={8}
                    />
                  )}

                  {washReverse && (
                    <g transform={`translate(${slotX[1]}, ${washLayout.y - 16})`}>
                      <rect
                        x={-55}
                        y={-14}
                        width={110}
                        height={22}
                        rx={4}
                        fill={withAlpha(colors.danger[500], 0.15)}
                        stroke={colors.danger[500]}
                        strokeWidth={1.5}
                      />
                      <text
                        x={0}
                        y={2}
                        textAnchor="middle"
                        fill={colors.danger[700]}
                        fontSize={canvasSize.font(FONT.annotation)}
                        fontWeight="bold"
                      >
                        ⚠️ 短进长出喷溅!
                      </text>
                    </g>
                  )}

                  <g transform={`translate(${slotX[1]}, ${baseY + 28})`}>
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fill={SCENE_COLORS.labels.chemicalFormula}
                      fontSize={canvasSize.font(FONT.label)}
                      fontWeight="bold"
                    >
                      ② 净化洗气瓶
                    </text>
                    <text
                      x={0}
                      y={15}
                      textAnchor="middle"
                      fill={colors.neutral[500]}
                      fontSize={canvasSize.font(FONT.annotation)}
                    >
                      ({washReagent})
                    </text>
                  </g>
                </g>
              )}

              {/* ─── Slot 2: 干燥装置 ─── */}
              {dryerLayout && (
                <g id="slot-2-dryer">
                  {dryer === 'conc-h2so4' ? (
                    <GasWashingBottleApparatus
                      x={dryerLayout.x}
                      y={dryerLayout.y}
                      width={dryerLayout.width}
                      height={dryerLayout.height}
                      reagentType="acid"
                      bubbling={flowRate > 0}
                    />
                  ) : (
                    <DryingTubeApparatus
                      x={dryerLayout.x}
                      y={dryerLayout.y}
                      width={dryerLayout.width}
                      height={dryerLayout.height}
                      variant={dryer === 'cacl2' ? 'U-shape' : 'spherical'}
                      desiccantName={dryer === 'soda-lime' ? '碱石灰' : '无水 CaCl₂'}
                      desiccantColor={
                        dryer === 'soda-lime'
                          ? SCENE_COLORS.reagent.precipitate
                          : '#F1F5F9'
                      }
                      font={canvasSize.font}
                    />
                  )}

                  {hasDangerAlert && dangerType === 'clogging' && (
                    <g transform={`translate(${slotX[2]}, ${dryerLayout.y + dryerLayout.height / 2})`}>
                      <circle
                        cx={0}
                        cy={0}
                        r={22}
                        fill={withAlpha(colors.warning[500], 0.2)}
                        stroke={colors.warning[500]}
                        strokeWidth={2}
                      />
                      <text
                        x={0}
                        y={4}
                        textAnchor="middle"
                        fill={colors.warning[700]}
                        fontSize={canvasSize.font(FONT.annotation)}
                        fontWeight="extrabold"
                      >
                        🚫 反应堵塞!
                      </text>
                    </g>
                  )}

                  <g transform={`translate(${slotX[2]}, ${baseY + 28})`}>
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fill={SCENE_COLORS.labels.chemicalFormula}
                      fontSize={canvasSize.font(FONT.label)}
                      fontWeight="bold"
                    >
                      ③ 干燥脱水
                    </text>
                    <text
                      x={0}
                      y={15}
                      textAnchor="middle"
                      fill={colors.neutral[500]}
                      fontSize={canvasSize.font(FONT.annotation)}
                    >
                      (
                      {dryer === 'conc-h2so4'
                        ? '浓H₂SO₄'
                        : dryer === 'soda-lime'
                        ? '碱石灰'
                        : 'CaCl₂'}
                      )
                    </text>
                  </g>
                </g>
              )}

              {/* ─── Slot 3: 收集装置 ─── */}
              {collLayout && (
                <g id="slot-3-collection">
                  {collection === 'water-displacement' ? (
                    <g transform={`translate(${collLayout.x}, ${collLayout.y})`}>
                      {/* 水槽 */}
                      <rect
                        x={0}
                        y={70}
                        width={150}
                        height={80}
                        rx={4}
                        fill={withAlpha(SCENE_COLORS.materials.glass, 0.3)}
                        stroke={SCENE_COLORS.container.beakerBorder}
                        strokeWidth={2}
                      />
                      <rect
                        x={4}
                        y={80}
                        width={142}
                        height={66}
                        fill={withAlpha(SCENE_COLORS.reagent.solution, 0.25)}
                      />
                      {/* 倒扣集气瓶 */}
                      <rect
                        x={45}
                        y={15}
                        width={60}
                        height={95}
                        rx={3}
                        fill={withAlpha(SCENE_COLORS.container.beaker, 0.4)}
                        stroke={SCENE_COLORS.container.beakerBorder}
                        strokeWidth={2}
                      />
                      {/* 瓶内气液界面 */}
                      <rect
                        x={47}
                        y={17}
                        width={56}
                        height={flowRate > 0 ? 55 : 10}
                        fill={gasColor}
                        rx={2}
                      />
                      <rect
                        x={47}
                        y={17 + (flowRate > 0 ? 55 : 10)}
                        width={56}
                        height={91 - (flowRate > 0 ? 55 : 10)}
                        fill={withAlpha(SCENE_COLORS.reagent.solution, 0.3)}
                      />
                      {/* 弯管 */}
                      <path
                        d="M 25,10 L 25,120 L 75,120 L 75,85"
                        fill="none"
                        stroke={SCENE_COLORS.container.beakerBorder}
                        strokeWidth={4}
                      />
                      {flowRate > 0 && <BubbleEmitter x={75} y={80} count={6} />}
                      <text
                        x={75}
                        y={0}
                        textAnchor="middle"
                        fill={SCENE_COLORS.labels.chemicalFormula}
                        fontSize={canvasSize.font(FONT.annotation)}
                        fontWeight="bold"
                      >
                        排水集气 (倒扣排水)
                      </text>
                    </g>
                  ) : (
                    <>
                      <GasJarApparatus
                        x={collLayout.x}
                        y={collLayout.y}
                        width={collLayout.width}
                        height={collLayout.height}
                        hasCover={false}
                        hasTubes={true}
                        tubeMode={
                          collection === 'downward-air'
                            ? 'short-in-long-out'
                            : 'long-in-short-out'
                        }
                        gasLabel={targetGas}
                      />
                      {/* 瓶内特征气体着色 */}
                      <rect
                        x={collLayout.x + 8}
                        y={collLayout.y + 20}
                        width={collLayout.width - 16}
                        height={collLayout.height - 35}
                        fill={gasColor}
                        rx={2}
                      />
                    </>
                  )}

                  <g transform={`translate(${slotX[3]}, ${baseY + 28})`}>
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fill={SCENE_COLORS.labels.chemicalFormula}
                      fontSize={canvasSize.font(FONT.label)}
                      fontWeight="bold"
                    >
                      ④ 规范收集
                    </text>
                    <text
                      x={0}
                      y={15}
                      textAnchor="middle"
                      fill={colors.neutral[500]}
                      fontSize={canvasSize.font(FONT.annotation)}
                    >
                      (
                      {collection === 'water-displacement'
                        ? '排水法'
                        : collection === 'downward-air'
                        ? '向下排空气'
                        : '向上排空气'}
                      )
                    </text>
                  </g>
                </g>
              )}

              {/* ─── Slot 4: 尾气处理 ─── */}
              {tailLayout && (
                <g id="slot-4-tailgas">
                  {tailGas === 'combustion' ? (
                    <g transform={`translate(${tailLayout.x}, ${tailLayout.y})`}>
                      <path
                        d="M 0,0 L 40,0 L 40,-40"
                        fill="none"
                        stroke={SCENE_COLORS.container.beakerBorder}
                        strokeWidth={4}
                      />
                      <path
                        d="M 40,-40 Q 30,-70 40,-85 Q 50,-70 40,-40"
                        fill={colors.warning[400]}
                        opacity={0.9}
                        className="animate-pulse"
                      />
                      <path
                        d="M 40,-42 Q 35,-60 40,-70 Q 45,-60 40,-42"
                        fill={CHEMISTRY_COLORS.concentration}
                      />
                    </g>
                  ) : tailGas === 'balloon' ? (
                    <g transform={`translate(${tailLayout.x}, ${tailLayout.y})`}>
                      <path
                        d="M 0,20 L 20,20 L 20,-10"
                        fill="none"
                        stroke={SCENE_COLORS.container.beakerBorder}
                        strokeWidth={4}
                      />
                      <ellipse
                        cx={20}
                        cy={-50}
                        rx={35}
                        ry={45}
                        fill={withAlpha(CHEMISTRY_COLORS.pH, 0.7)}
                        stroke={CHEMISTRY_COLORS.pH}
                        strokeWidth={2}
                      />
                    </g>
                  ) : tailGas === 'safety-bottle' ? (
                    <>
                      <ErlenmeyerFlaskApparatus
                        x={tailLayout.x}
                        y={tailLayout.y}
                        width={tailLayout.width}
                        height={tailLayout.height}
                        fillLevel={0}
                        hasStopper={true}
                      />
                      <BeakerApparatus
                        x={tailLayout.x + tailLayout.width + 10}
                        y={tailLayout.y + 15}
                        width={70}
                        height={100}
                        fillLevel={0.5}
                        fillColor={withAlpha(SCENE_COLORS.reagent.solution, 0.2)}
                      />
                    </>
                  ) : tailGas === 'inverted-funnel' ? (
                    <AntiSiphonFunnelApparatus
                      x={tailLayout.x}
                      y={tailLayout.y}
                      width={tailLayout.width}
                      height={tailLayout.height}
                      isAbsorbing={flowRate > 0}
                      liquidColor={withAlpha(SCENE_COLORS.reagent.solution, 0.25)}
                      touchDepth={constraints.funnelContactDepth}
                    />
                  ) : (
                    /* direct-pipe / NaOH 烧杯 */
                    <g>
                      <BeakerApparatus
                        x={tailLayout.x}
                        y={tailLayout.y}
                        width={tailLayout.width}
                        height={tailLayout.height}
                        fillLevel={0.6}
                        fillColor={withAlpha(SCENE_COLORS.reagent.solution, 0.25)}
                      />
                      {flowRate > 0 && (
                        <BubbleEmitter
                          x={slotX[4]}
                          y={tailLayout.y + 65}
                          count={5}
                        />
                      )}
                    </g>
                  )}

                  {/* 倒吸液体爬升警告 */}
                  {hasDangerAlert && dangerType === 'siphon' && tailLayout.inletPort && (
                    <g transform={`translate(${tailLayout.inletPort.x}, ${tailLayout.inletPort.y})`}>
                      <path
                        d="M 0,0 L 0,-80"
                        stroke={colors.danger[500]}
                        strokeWidth={5}
                        strokeDasharray="6 4"
                        className="animate-pulse"
                      />
                      <polygon
                        points="0,-90 -8,-75 8,-75"
                        fill={colors.danger[500]}
                      />
                    </g>
                  )}

                  <g transform={`translate(${slotX[4]}, ${baseY + 28})`}>
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fill={SCENE_COLORS.labels.chemicalFormula}
                      fontSize={canvasSize.font(FONT.label)}
                      fontWeight="bold"
                    >
                      ⑤ 尾气处理
                    </text>
                    <text
                      x={0}
                      y={15}
                      textAnchor="middle"
                      fill={colors.neutral[500]}
                      fontSize={canvasSize.font(FONT.annotation)}
                    >
                      (
                      {tailGas === 'inverted-funnel'
                        ? '倒置漏斗防倒吸'
                        : tailGas === 'safety-bottle'
                        ? '安全瓶防倒吸'
                        : tailGas === 'combustion'
                        ? '点燃/灼烧法'
                        : tailGas === 'balloon'
                        ? '收集气球'
                        : tailGas === 'direct-pipe'
                        ? '直导管吸收'
                        : 'NaOH 溶液吸收'}
                      )
                    </text>
                  </g>
                </g>
              )}

              {/* ─── 导管路由：纯绝对坐标 SVG path，无 translate 包裹 ─── */}
              {routes.map((rt) => (
                <g key={rt.id}>
                  {/* 外壁玻璃轮廓 */}
                  <path
                    d={rt.pathD}
                    fill="none"
                    stroke={SCENE_COLORS.materials.glassBorder}
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* 内部高光空腔 */}
                  <path
                    d={rt.pathD}
                    fill="none"
                    stroke={withAlpha(SCENE_COLORS.materials.glass, 0.85)}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              ))}
            </AnimationSvgCanvas>
          </div>
        </div>
      )}

      {/* 视角 1: 规范踩分 */}
      {viewMode === 1 && quizData && (
        <div className="w-full h-full py-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4">
            <ScoringCardSection steps={quizData.scoringSteps} />
          </div>
        </div>
      )}

      {/* 视角 2: 真题研析 */}
      {viewMode === 2 && quizData && (
        <div className="w-full h-full py-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4">
            <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
          </div>
        </div>
      )}
    </div>
  )
}
