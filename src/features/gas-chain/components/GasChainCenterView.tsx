import React from 'react'
import { AnimationSvgCanvas } from '@/components/Layout'
import {
  ScoringCardSection,
  GaokaoVariantQuiz,
} from '@/components/UI'
import {
  KippApparatus,
  GasWashingBottleApparatus,
  DryingTubeApparatus,
  GasJarApparatus,
  AntiSiphonFunnelApparatus,
  SolidHeatingGeneratorApparatus,
  LiquidHeatingGeneratorApparatus,
  NoHeatGeneratorApparatus,
  SafetyBottleApparatus,
  WaterDisplacementCollectionApparatus,
} from '@/components/Chemistry'
import { useAnimationViewport, useSceneScale } from '@/hooks'
import {
  CANVAS_PRESETS,
  SCENE_COLORS,
  CHEMISTRY_COLORS,
  PHENOMENON_COLORS,
  CANVAS_COLORS,
  withAlpha,
  STROKE,
  FONT,
} from '@/theme'
import type { GasChainParams } from '../types'
import type { GasChainChemistryResult } from '../hooks/useGasChainChemistry'
import type { ModelQuizData } from '@/data/quiz/types'
import {
  solvePhysicalChainLayout,
} from '../physics'
import type { ApparatusLayout } from '../physics/types'
import { GasFullMatrixView } from './GasFullMatrixView'
import type { GasCategory } from '../data/gasChainMatrixData'

interface GasChainCenterViewProps {
  params: GasChainParams
  chemistry: GasChainChemistryResult
  quizData?: ModelQuizData
  onApplySystemPreset?: (targetGas: string) => void
  categoryFilter?: GasCategory | 'all'
  onCategoryFilterChange?: (cat: GasCategory | 'all') => void
}

export const GasChainCenterView: React.FC<GasChainCenterViewProps> = ({
  params,
  chemistry,
  quizData,
  onApplySystemPreset,
  categoryFilter,
  onCategoryFilterChange,
}) => {
  const {
    viewMode,
    panelMode = 'chain',
    generator,
    washingSteps,
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


  // 3. 布局引擎：单一事实来源 (SSOT)
  const layout = solvePhysicalChainLayout({
    generator,
    washingSteps,
    collection,
    tailGas,
    baseY,
  })

  const { apparatusLayouts, routes, slotX } = layout

  // 辅助：按 id 查找器材布局
  const getLayout = (id: ApparatusLayout['id']) =>
    apparatusLayouts.find((a) => a.id === id) ?? null

  const genLayout = getLayout('generator')
  const collLayout = getLayout('collection')
  const tailLayout = getLayout('tailgas')

  let gasColor = withAlpha(SCENE_COLORS.reagent.solution, 0.1)
  if (targetGas === 'Cl₂') gasColor = withAlpha(PHENOMENON_COLORS.cl2Gas, 0.6)
  if (targetGas === 'NO₂') gasColor = withAlpha(PHENOMENON_COLORS.no2Gas, 0.7)
  if (targetGas === 'NO') {
    if (collection !== 'water-displacement') {
      // 误选排空气法收集 NO：接触空气中的 O₂ 立即氧化生成红棕色 NO₂
      gasColor = withAlpha(PHENOMENON_COLORS.no2Gas, 0.65)
    } else {
      // 排水集气法收集 NO：无色气体
      gasColor = withAlpha(SCENE_COLORS.materials.glass, 0.15)
    }
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative">
      {/* 视角 0: 图谱探究 / 全景大表 */}
      {viewMode === 0 && (
        panelMode === 'matrix' ? (
          <GasFullMatrixView
            onApplySystemPreset={onApplySystemPreset}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={onCategoryFilterChange}
          />
        ) : (
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
                      targetGas={targetGas}
                      font={canvasSize.font}
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
                        fill={withAlpha(CANVAS_COLORS.alertRed, 0.15)}
                        stroke={CANVAS_COLORS.alertRed}
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                      />
                      <circle
                        cx={0}
                        cy={0}
                        r={24}
                        fill={CANVAS_COLORS.alertRed}
                        fillOpacity={0.9}
                        stroke={CANVAS_COLORS.dangerDark}
                        strokeWidth={2}
                      />
                      <text
                        x={0}
                        y={4}
                        textAnchor="middle"
                        fill={CANVAS_COLORS.white}
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
                      fill={CANVAS_COLORS.labelTextLight}
                      fontSize={canvasSize.font(FONT.annotation)}
                    >
                      ({targetGas})
                    </text>
                  </g>
                </g>
              )}

              {/* ─── Slots 1..N: 动态串联洗气/检验/干燥步骤 ─── */}
              {washingSteps.map((step, i) => {
                const stepId = `wash-${i}` as ApparatusLayout['id']
                const stepLayout = apparatusLayouts.find(a => a.id === stepId) ?? null
                if (!stepLayout) return null

                const centerX = stepLayout.x + stepLayout.width / 2
                const roleLabel = step.role === 'purify' ? '净化除杂'
                  : step.role === 'detect' ? '检验性质'
                    : '干燥脱水'
                const stepNum = i + 2  // 步骤编号：①发生, ②..., 最后收集/尾气

                const reagentLabel = step.reagent === 'sat-nacl' ? '饱和食盐水'
                  : step.reagent === 'nahco3' ? '饱和NaHCO₃溶液'
                    : step.reagent === 'nahso3' ? '饱和NaHSO₃溶液'
                      : step.reagent === 'cuso4' ? '饱和CuSO₄溶液'
                        : step.reagent === 'naoh' ? 'NaOH 溶液'
                          : step.reagent === 'fuchsin' ? '品红溶液'
                            : step.reagent === 'kmno4' ? '酸性KMnO₄'
                              : step.reagent === 'conc-h2so4' ? '浓H₂SO₄'
                                : step.reagent === 'soda-lime' ? '碱石灰'
                                  : step.reagent === 'cacl2' ? 'CaCl₂'
                                    : step.reagent === 'p2o5' ? 'P₂O₅'
                                      : step.reagent

                return (
                  <g key={step.id} id={`slot-${i + 1}-wash`}>
                    {step.device === 'dry-tube' ? (
                      // 干燥管（固相干燥剂：碱石灰/CaCl2/P2O5）
                      <DryingTubeApparatus
                        x={stepLayout.x}
                        y={stepLayout.y}
                        width={stepLayout.width}
                        height={stepLayout.height}
                        variant={step.reagent === 'cacl2' ? 'U-shape' : 'spherical'}
                        desiccantName={step.reagent === 'soda-lime' ? '碱石灰' : 'CaCl₂'}
                        desiccantColor={
                          step.reagent === 'soda-lime'
                            ? SCENE_COLORS.reagent.precipitate
                            : withAlpha(SCENE_COLORS.materials.glass, 0.4)
                        }
                        holderHeight={stepLayout.holderHeight}
                        font={canvasSize.font}
                      />
                    ) : step.device === 'acid-bottle' ? (
                      // 浓硫酸洗气瓶（液相干燥/酸洗）
                      <GasWashingBottleApparatus
                        x={stepLayout.x}
                        y={stepLayout.y}
                        width={stepLayout.width}
                        height={stepLayout.height}
                        reagentType="acid"
                        bubbling={flowRate > 0}
                      />
                    ) : (
                      <>
                        <GasWashingBottleApparatus
                          x={stepLayout.x}
                          y={stepLayout.y}
                          width={stepLayout.width}
                          height={stepLayout.height}
                          reagentType={
                            step.reagent === 'sat-nacl' ? 'acid'
                              : step.reagent === 'water' ? 'water'
                                : 'base'
                          }
                          bubbling={flowRate > 0 && !(step.reversed)}
                          reversed={step.reversed ?? false}
                        />
                        {step.reversed && (
                          <g transform={`translate(${centerX}, ${stepLayout.y - 16})`}>
                            <rect
                              x={-55}
                              y={-14}
                              width={110}
                              height={22}
                              rx={4}
                              fill={withAlpha(CANVAS_COLORS.alertRed, 0.15)}
                              stroke={CANVAS_COLORS.alertRed}
                              strokeWidth={1.5}
                            />
                            <text
                              x={0}
                              y={2}
                              textAnchor="middle"
                              fill={CANVAS_COLORS.dangerText}
                              fontSize={canvasSize.font(FONT.annotation)}
                              fontWeight="bold"
                            >
                              ⚠️ 短进长出喷溅!
                            </text>
                          </g>
                        )}
                      </>
                    )}

                    <g transform={`translate(${centerX}, ${baseY + 28})`}>
                      <text
                        x={0}
                        y={0}
                        textAnchor="middle"
                        fill={SCENE_COLORS.labels.chemicalFormula}
                        fontSize={canvasSize.font(FONT.label)}
                        fontWeight="bold"
                      >
                        {stepNum === 2 ? '②' : stepNum === 3 ? '③' : stepNum === 4 ? '④' : `${stepNum}`} {roleLabel}
                      </text>
                      <text
                        x={0}
                        y={15}
                        textAnchor="middle"
                        fill={CANVAS_COLORS.labelTextLight}
                        fontSize={canvasSize.font(FONT.annotation)}
                      >
                        ({reagentLabel})
                      </text>
                    </g>
                  </g>
                )
              })}

              {/* ─── Slot 3: 收集装置 ─── */}
              {collLayout && (
                <g id="slot-3-collection">
                  {collection === 'water-displacement' ? (
                    // 带标准端口函数的排水集气组件（替代原手绘 SVG）
                    <WaterDisplacementCollectionApparatus
                      x={collLayout.x}
                      y={collLayout.y}
                      width={collLayout.width}
                      height={collLayout.height}
                      gasColor={gasColor}
                      fillLevel={flowRate > 0 ? 0.75 : 0.05}
                      flowing={flowRate > 0}
                      font={canvasSize.font}
                    />
                  ) : (
                    <>
                      <GasJarApparatus
                        x={collLayout.x}
                        y={collLayout.y}
                        width={collLayout.width}
                        height={collLayout.height}
                        fillLevel={flowRate > 0 ? 0.85 : 0.05}
                        fillColor={gasColor}
                        isGasCollection={true}
                        hasCover={false}
                        hasTubes={true}
                        tubeMode={
                          collection === 'downward-air'
                            ? (params.collectTubeMode === 'wrong-long-in' ? 'long-in-short-out' : 'short-in-long-out')
                            : 'long-in-short-out'
                        }
                        gasLabel={targetGas}
                        hasTailGas={tailGas !== 'none'}
                        font={canvasSize.font}
                      />
                      {/* 仅在显式错用向下排长进短出时挂载警告 */}
                      {collection === 'downward-air' && params.collectTubeMode === 'wrong-long-in' && (
                        <g transform={`translate(${collLayout.x + collLayout.width / 2}, ${collLayout.y - 20})`}>
                          <rect
                            x={-60}
                            y={-12}
                            width={120}
                            height={22}
                            rx={4}
                            fill={withAlpha(CANVAS_COLORS.alertRed, 0.15)}
                            stroke={CANVAS_COLORS.alertRed}
                            strokeWidth={1.5}
                          />
                          <text
                            x={0}
                            y={4}
                            textAnchor="middle"
                            fill={CANVAS_COLORS.dangerText}
                            fontSize={canvasSize.font(FONT.annotation)}
                            fontWeight="bold"
                          >
                            ⚠️ 误接长进短出: 氨气顶溢无法集满!
                          </text>
                        </g>
                      )}
                    </>
                  )}

                  <g transform={`translate(${collLayout.x + collLayout.width / 2}, ${baseY + 28})`}>
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fill={SCENE_COLORS.labels.chemicalFormula}
                      fontSize={canvasSize.font(FONT.label)}
                      fontWeight="bold"
                    >
                      ④ 气体收集
                    </text>
                    <text
                      x={0}
                      y={15}
                      textAnchor="middle"
                      fill={CANVAS_COLORS.labelTextLight}
                      fontSize={canvasSize.font(FONT.annotation)}
                    >
                      (
                      {collection === 'water-displacement'
                        ? '排水法'
                        : collection === 'downward-air'
                          ? (params.collectTubeMode === 'wrong-long-in' ? '向下排(误用长进短出)' : '向下排空气(短进长出)')
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
                      {/* 双层高保真平滑尖嘴燃气导管 */}
                      <path
                        d="M 0,0 L 25,0 Q 35,0 40,-10 L 40,-35"
                        fill="none"
                        stroke={SCENE_COLORS.materials.glassBorder}
                        strokeWidth={6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 0,0 L 25,0 Q 35,0 40,-10 L 40,-35"
                        fill="none"
                        stroke={withAlpha(SCENE_COLORS.materials.glass, 0.85)}
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* 尖嘴口处的点燃火焰 */}
                      <path
                        d="M 40,-35 Q 30,-65 40,-80 Q 50,-65 40,-35"
                        fill={SCENE_COLORS.heatingAndSupport.flame}
                        opacity={0.9}
                        className="animate-pulse"
                      />
                      <path
                        d="M 40,-37 Q 35,-55 40,-65 Q 45,-55 40,-37"
                        fill={SCENE_COLORS.heatingAndSupport.flameCore}
                      />
                    </g>
                  ) : tailGas === 'balloon' ? (
                    <g transform={`translate(${tailLayout.x}, ${tailLayout.y})`}>
                      <path
                        d="M 0,20 L 20,20 L 20,-10"
                        fill="none"
                        stroke={SCENE_COLORS.materials.glassBorder}
                        strokeWidth={6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 0,20 L 20,20 L 20,-10"
                        fill="none"
                        stroke={withAlpha(SCENE_COLORS.materials.glass, 0.85)}
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
                    // 高考规范安全瓶：广口集气瓶形，双孔模皮塞，两管均不伸入液面
                    <SafetyBottleApparatus
                      x={tailLayout.x}
                      y={tailLayout.y}
                      width={tailLayout.width}
                      height={tailLayout.height}
                      font={canvasSize.font}
                    />
                  ) : tailGas === 'inverted-funnel' ? (
                    <>
                      <AntiSiphonFunnelApparatus
                        x={tailLayout.x}
                        y={tailLayout.y}
                        width={tailLayout.width}
                        height={tailLayout.height}
                        depthMode={params.funnelDepth ?? 'tangent'}
                        liquidColor={
                          targetGas === 'NH₃' && flowRate > 0
                            ? withAlpha('#EC4899', 0.7) // NH₃ 极易溶于水遇酚酞显红色
                            : withAlpha(SCENE_COLORS.reagent.acid, 0.45)
                        }
                        isAbsorbing={flowRate > 0}
                        font={canvasSize.font}
                      />
                      {/* 仅在显式探底下沉时挂载警告 */}
                      {params.funnelDepth === 'deep' && (
                        <g transform={`translate(${tailLayout.x + tailLayout.width / 2}, ${tailLayout.y - 25})`}>
                          <rect
                            x={-65}
                            y={-12}
                            width={130}
                            height={22}
                            rx={4}
                            fill={withAlpha(CANVAS_COLORS.alertRed, 0.15)}
                            stroke={CANVAS_COLORS.alertRed}
                            strokeWidth={1.5}
                          />
                          <text
                            x={0}
                            y={4}
                            textAnchor="middle"
                            fill={CANVAS_COLORS.dangerText}
                            fontSize={canvasSize.font(FONT.annotation)}
                            fontWeight="bold"
                          >
                            💥 深深深浸没: 脱离机制失效倒吸!
                          </text>
                        </g>
                      )}
                    </>
                  ) : (
                    // naoh-absorber / 其他吸收剖氧化物：使用洗气瓶形式（高考规范 NaOH 溶液吸收尾气标准图示）
                    // 严禁使用直导管插入吸收液——极易倒吸圆裂，必须用洗气瓶或倒置漏斗
                    <>
                      <GasWashingBottleApparatus
                        x={tailLayout.x}
                        y={tailLayout.y}
                        width={tailLayout.width}
                        height={tailLayout.height}
                        reagentType="base"
                        bubbling={flowRate > 0}
                        isTailGas={true}
                      />
                    </>
                  )}

                  {/* 倒吸液体爬升警告 */}
                  {hasDangerAlert && dangerType === 'siphon' && tailLayout.inletPort && (
                    <g transform={`translate(${tailLayout.inletPort.x}, ${tailLayout.inletPort.y})`}>
                      <path
                        d="M 0,0 L 0,-80"
                        stroke={CANVAS_COLORS.alertRed}
                        strokeWidth={5}
                        strokeDasharray="6 4"
                        className="animate-pulse"
                      />
                      <polygon
                        points="0,-90 -8,-75 8,-75"
                        fill={CANVAS_COLORS.alertRed}
                      />
                    </g>
                  )}

                  <g transform={`translate(${tailLayout.x + tailLayout.width / 2}, ${baseY + 28})`}>
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
                      fill={CANVAS_COLORS.labelTextLight}
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

              {/* ─── 导管路由：纯绝对坐标 SVG path，零 transform 外包裹 ─── */}
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
        )
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
