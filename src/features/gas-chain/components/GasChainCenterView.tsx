/**
 * src/features/gas-chain/components/GasChainCenterView.tsx
 * 气体制备/净化/尾气处理装置链工具 - 中屏主视点平级视图
 *
 * 物理装配骨架 Engine (Assembly Skeleton Grid):
 * - 基于 CANVAS_PRESETS.full (840 x 650)
 * - 桌面底座线 Y_table = 480，5 大节点 Slot 0~4
 * - 100% 高考规范 0 刺穿、0 断裂、0 错位物理对齐与自适应直通路由
 */

import React from 'react'
import { AnimationSvgCanvas } from '@/components/Layout'
import {
  ScoringCardSection,
  GaokaoVariantQuiz,
} from '@/components/UI'
import {
  DistillationFlaskApparatus,
  ErlenmeyerFlaskApparatus,
  KippApparatus,
  getKippApparatusPorts,
  GasWashingBottleApparatus,
  DryingTubeApparatus,
  getDryingTubePorts,
  GasJarApparatus,
  AntiSiphonFunnelApparatus,
  SolidHeatingGeneratorApparatus,
  getSolidHeatingGeneratorPorts,
  BeakerApparatus,
  AlcoholLampApparatus,
  SeparatoryFunnelApparatus,
  IronSupportApparatus,
  ThermometerApparatus,
  GlassTubingConnectionApparatus,
  BubbleEmitter,
  getDistillationFlaskPorts,
  getGasWashingBottlePorts,
  getAntiSiphonFunnelPorts,
  getGasJarPorts,
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

  // 2. 骨架坐标系统
  const baseY = 480
  const slotX = [100, 260, 420, 580, 740]

  // 3. 节点 0 (发生装置) 端口计算
  let node0Outlet = { x: slotX[0] + 35, y: baseY - 165 }
  let flaskPorts: ReturnType<typeof getDistillationFlaskPorts> | null = null

  const isEthylene = systemId === 'c2h4-prep' || targetGas === 'C₂H₄'

  if (generator === 'flask-heat') {
    const flaskX = slotX[0] - 45
    const flaskY = baseY - 226
    flaskPorts = getDistillationFlaskPorts(flaskX, flaskY, 90, 140)
    node0Outlet = flaskPorts.sideArmPort
  } else if (generator === 'testtube-heat') {
    const solidGenPorts = getSolidHeatingGeneratorPorts(slotX[0] - 60, baseY)
    node0Outlet = solidGenPorts.outletPort
  } else if (generator === 'flask-noheat') {
    node0Outlet = { x: slotX[0] + 25, y: baseY - 165 }
  } else if (generator === 'kipp') {
    const kippPorts = getKippApparatusPorts(slotX[0] - 45, baseY - 220, 90)
    node0Outlet = kippPorts.outletPort
  }

  // 4. 节点 1 (洗气瓶) 端口计算
  const hasWash = washReagent !== 'none'
  const washBottleX = slotX[1] - 45
  const washBottleY = baseY - 140
  const washPorts = getGasWashingBottlePorts(washBottleX, washBottleY, 90, 140)
  const node1Inlet = washReverse ? washPorts.outletPort : washPorts.inletPort
  const node1Outlet = washReverse ? washPorts.inletPort : washPorts.outletPort

  // 洗气瓶液体真实外观与变色逻辑
  let washSolutionColor = withAlpha(SCENE_COLORS.reagent.solution, 0.15)
  if (washReagent === 'fuchsin') {
    washSolutionColor = targetGas === 'SO₂' && flowRate > 0
      ? withAlpha(SCENE_COLORS.reactionAndGas.dryingTube, 0.2)
      : withAlpha(colors.danger[400], 0.6)
  } else if (washReagent === 'kmno4') {
    washSolutionColor = (targetGas === 'SO₂' || targetGas === 'C₂H₄') && flowRate > 0
      ? withAlpha(SCENE_COLORS.materials.glass, 0.2)
      : withAlpha(CHEMISTRY_COLORS.pH, 0.7)
  } else if (washReagent === 'sat-nacl') {
    washSolutionColor = withAlpha(SCENE_COLORS.materials.glass, 0.3)
  } else if (washReagent === 'naoh') {
    washSolutionColor = withAlpha(SCENE_COLORS.reagent.solution, 0.2)
  }

  // 5. 节点 2 (干燥) 端口计算
  const hasDryer = dryer !== 'none'
  let node2Inlet = { x: slotX[2] - 45, y: baseY - 140 }
  let node2Outlet = { x: slotX[2] + 45, y: baseY - 140 }

  if (dryer === 'conc-h2so4') {
    const dryWashPorts = getGasWashingBottlePorts(slotX[2] - 45, baseY - 140, 90, 140)
    node2Inlet = dryWashPorts.inletPort
    node2Outlet = dryWashPorts.outletPort
  } else if (dryer === 'cacl2') {
    const uPorts = getDryingTubePorts(slotX[2] - 55, baseY - 195, 110, 50, 'U-shape')
    node2Inlet = uPorts.inletPort
    node2Outlet = uPorts.outletPort
  } else if (dryer === 'soda-lime') {
    const sPorts = getDryingTubePorts(slotX[2] - 55, baseY - 195, 110, 50, 'spherical')
    node2Inlet = sPorts.inletPort
    node2Outlet = sPorts.outletPort
  }

  // 6. 节点 3 (集气瓶) 端口计算
  const hasCollection = collection !== 'none'
  const isWaterDisplacement = collection === 'water-displacement'
  const jarX = slotX[3] - 35
  const jarY = baseY - 110
  const jarPorts = getGasJarPorts(jarX, jarY, 70)

  let node3Inlet = jarPorts.topStopperLeft
  let node3Outlet: { x: number; y: number } | null = jarPorts.topStopperRight

  if (isWaterDisplacement) {
    node3Inlet = { x: slotX[3] - 50, y: baseY - 140 }
    node3Outlet = null // 排水集气无连续出口导管引出
  } else if (collection === 'downward-air') {
    node3Inlet = jarPorts.topStopperLeft
    node3Outlet = jarPorts.topStopperRight
  }

  // 特征气体着色
  let gasColor = withAlpha(SCENE_COLORS.reagent.solution, 0.1)
  if (targetGas === 'Cl₂') gasColor = withAlpha(CHEMISTRY_COLORS.concentration, 0.5)
  if (targetGas === 'NO₂') gasColor = withAlpha(colors.accent[600], 0.6)

  // 7. 节点 4 (尾气处理) 端口计算
  const hasTailGas = true
  const beakerX = slotX[4] - 45
  const beakerY = baseY - 100

  let node4Inlet = { x: slotX[4] - 15, y: baseY - 30 }
  if (tailGas === 'inverted-funnel') {
    const funnelPorts = getAntiSiphonFunnelPorts(slotX[4] - 40, baseY - 98, 80, 100)
    node4Inlet = funnelPorts.topConnectPort
  } else if (tailGas === 'safety-bottle') {
    node4Inlet = { x: slotX[4] - 40, y: baseY - 165 }
  } else if (tailGas === 'combustion' || tailGas === 'balloon') {
    node4Inlet = { x: slotX[4] - 25, y: baseY - 120 }
  }

  // 8. 导管正交连线动态无缝路由 (Pass-through Routing)
  const routePoints: Array<{ inlet: { x: number; y: number }; outlet: { x: number; y: number } }> = []

  let lastOutlet = node0Outlet

  if (hasWash) {
    routePoints.push({ outlet: lastOutlet, inlet: node1Inlet })
    lastOutlet = node1Outlet
  }

  if (hasDryer) {
    routePoints.push({ outlet: lastOutlet, inlet: node2Inlet })
    lastOutlet = node2Outlet
  }

  if (hasCollection) {
    routePoints.push({ outlet: lastOutlet, inlet: node3Inlet })
    if (node3Outlet) {
      lastOutlet = node3Outlet
    } else {
      lastOutlet = null as any
    }
  }

  if (hasTailGas && lastOutlet) {
    routePoints.push({ outlet: lastOutlet, inlet: node4Inlet })
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-slate-50 relative">
      {/* 视角 0: ✨ 图谱探究 (独占中屏全景 840x650) */}
      {viewMode === 0 && (
        <div className="w-full h-full relative overflow-hidden flex flex-col">
          <div className="w-full h-full flex-1 min-h-0">
            <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
              {/* 0. 实验室桌线与地面背景 */}
              <rect x={10} y={baseY} width={820} height={12} fill={SCENE_COLORS.heatingAndSupport.asbestosMesh} rx={2} />
              <line x1={20} y1={baseY + 12} x2={820} y2={baseY + 12} stroke={SCENE_COLORS.container.beakerBorder} strokeWidth={STROKE.objectLine} />

              {/* 1. Slot 0: 发生装置 */}
              <g id="slot-0-generator">
                {/* 铁架台支撑 */}
                {generator === 'flask-heat' && (
                  <IronSupportApparatus
                    x={slotX[0] - 85}
                    y={baseY - 350}
                    width={120}
                    height={350}
                    hasClamp={true}
                    clampPos={0.52}
                  />
                )}

                {/* 固-液加热 (圆底/蒸馏烧瓶 + 石棉网 + 酒精灯 + 双孔塞/分液漏斗) */}
                {generator === 'flask-heat' && (
                  <>
                    {/* 石棉网 (Wire Gauze) */}
                    <rect x={slotX[0] - 50} y={baseY - 86} width={100} height={6} fill={SCENE_COLORS.materials.asbestos} rx={1} stroke={SCENE_COLORS.container.beakerBorder} strokeWidth={STROKE.reference} />
                    <line x1={slotX[0] - 50} y1={baseY - 83} x2={slotX[0] + 50} y2={baseY - 83} stroke={SCENE_COLORS.labels.chemicalFormula} strokeDasharray="2 2" />

                    {/* 蒸馏烧瓶 */}
                    <DistillationFlaskApparatus x={slotX[0] - 45} y={baseY - 226} width={90} height={140} fillLevel={0.45} fillColor={withAlpha(CHEMISTRY_COLORS.concentration, 0.4)} />

                    {/* 酒精灯：外焰顶端紧贴石棉网底部 (y = baseY - 86) */}
                    <AlcoholLampApparatus
                      x={slotX[0] - 35}
                      y={baseY - 86}
                      width={70}
                      height={86}
                      lit={heating}
                    />

                    {/* 乙烯 (C₂H₄) 实验：规范双孔塞（仅插入 170°C 温度计与导气管，无分液漏斗！） */}
                    {isEthylene ? (
                      flaskPorts && (
                        <g transform={`translate(${flaskPorts.topNeckPort.x}, ${flaskPorts.topNeckPort.y - 45})`}>
                          <ThermometerApparatus x={0} y={0} tempValue={170} height={175} />
                          <rect x={12} y={50} width={100} height={20} rx={4} fill={withAlpha(colors.warning[100], 0.8)} stroke={colors.warning[500]} strokeWidth={1} />
                          <text x={18} y={64} fill={SCENE_COLORS.labels.chemicalFormula} fontSize={canvasSize.font(FONT.annotation)} fontWeight="bold">
                            水银球浸没 170°C
                          </text>
                        </g>
                      )
                    ) : (
                      /* 非乙烯实验：常规分液漏斗滴加试剂 */
                      flaskPorts && (
                        <SeparatoryFunnelApparatus
                          x={flaskPorts.topNeckPort.x - 40}
                          y={flaskPorts.topNeckPort.y - 120}
                          width={80}
                          height={140}
                          bottomFillLevel={0.7}
                          bottomFillColor={withAlpha(SCENE_COLORS.reagent.solution, 0.2)}
                        />
                      )
                    )}
                  </>
                )}

                {/* 固-固加热发生器复合组件 */}
                {generator === 'testtube-heat' && (
                  <SolidHeatingGeneratorApparatus
                    x={slotX[0] - 60}
                    y={baseY}
                    targetGas={targetGas}
                    lit={heating}
                    font={canvasSize.font}
                  />
                )}

                {/* 固-液不加热 (锥形瓶 + 分液漏斗) */}
                {generator === 'flask-noheat' && (
                  <>
                    <ErlenmeyerFlaskApparatus x={slotX[0] - 40} y={baseY - 170} width={80} height={110} fillLevel={0.4} fillColor={withAlpha(CHEMISTRY_COLORS.concentration, 0.3)} hasStopper={true} />
                    <SeparatoryFunnelApparatus x={slotX[0] - 40} y={baseY - 260} width={80} height={120} bottomFillLevel={0.8} />
                  </>
                )}

                {/* 启普发生器 */}
                {generator === 'kipp' && (
                  <KippApparatus x={slotX[0] - 45} y={baseY - 220} width={90} height={220} isOpen={flowRate > 0} gasLabel={targetGas} />
                )}

                {/* 倒吸炸裂 Warning 物理锚定标记 (精准定位于发生器受热瓶体中心) */}
                {hasDangerAlert && dangerType === 'siphon' && (
                  <g transform={`translate(${slotX[0]}, ${baseY - 130})`} className="animate-pulse">
                    {/* 受热瓶体倒吸红光波纹 */}
                    <circle cx={0} cy={0} r={36} fill={withAlpha(colors.danger[500], 0.15)} stroke={colors.danger[500]} strokeWidth={1.5} strokeDasharray="3 3" />
                    <circle cx={0} cy={0} r={24} fill={colors.danger[500]} fillOpacity={0.9} stroke={colors.danger[700]} strokeWidth={2} />
                    <text x={0} y={4} textAnchor="middle" fill={colors.neutral.white} fontSize={canvasSize.font(FONT.annotation)} fontWeight="extrabold">
                      💥 倒吸炸裂
                    </text>
                  </g>
                )}

                <text x={slotX[0]} y={baseY + 30} textAnchor="middle" fill={SCENE_COLORS.labels.chemicalFormula} fontSize={canvasSize.font(FONT.label)} fontWeight="bold">
                  ① 发生装置 ({targetGas})
                </text>
              </g>

              {/* 2. Slot 1: 净化洗气瓶 (仅在 hasWash 时渲染) */}
              {hasWash && (
                <g id="slot-1-wash">
                  <GasWashingBottleApparatus
                    x={washBottleX}
                    y={washBottleY}
                    width={90}
                    height={140}
                    reagentType={washReagent === 'sat-nacl' ? 'acid' : washReagent === 'water' ? 'water' : 'base'}
                    bubbling={flowRate > 0 && !washReverse}
                  />

                  <rect
                    x={washBottleX + 10}
                    y={washBottleY + 75}
                    width={70}
                    height={55}
                    fill={washSolutionColor}
                    rx={4}
                  />

                  {flowRate > 0 && !washReverse && (
                    <BubbleEmitter x={washBottleX + 25} y={washBottleY + 110} count={8} />
                  )}

                  {washReverse && (
                    <g transform={`translate(${slotX[1]}, ${baseY - 170})`}>
                      <rect x={-55} y={-14} width={110} height={22} rx={4} fill={withAlpha(colors.danger[500], 0.15)} stroke={colors.danger[500]} strokeWidth={1.5} />
                      <text x={0} y={2} textAnchor="middle" fill={colors.danger[700]} fontSize={canvasSize.font(FONT.annotation)} fontWeight="bold">
                        ⚠️ 短进长出喷溅!
                      </text>
                    </g>
                  )}

                  <text x={slotX[1]} y={baseY + 30} textAnchor="middle" fill={SCENE_COLORS.labels.chemicalFormula} fontSize={canvasSize.font(FONT.label)} fontWeight="bold">
                    ② 净化洗气瓶 ({washReagent})
                  </text>
                </g>
              )}

              {/* 3. Slot 2: 干燥装置 (仅在 hasDryer 时渲染) */}
              {hasDryer && (
                <g id="slot-2-dryer">
                  {dryer === 'conc-h2so4' ? (
                    <GasWashingBottleApparatus x={slotX[2] - 45} y={baseY - 140} width={90} height={140} reagentType="acid" bubbling={flowRate > 0} />
                  ) : (
                    <>
                      {/* 干燥管底座支撑 */}
                      <rect x={slotX[2] - 20} y={baseY - 145} width={40} height={145} fill={withAlpha(SCENE_COLORS.materials.iron, 0.4)} rx={2} />
                      <DryingTubeApparatus
                        x={slotX[2] - 55}
                        y={baseY - 195}
                        width={110}
                        height={50}
                        variant={dryer === 'cacl2' ? 'U-shape' : 'spherical'}
                        desiccantName={dryer === 'soda-lime' ? '碱石灰' : '无水 CaCl₂'}
                        desiccantColor={dryer === 'soda-lime' ? SCENE_COLORS.reagent.precipitate : '#F1F5F9'}
                        font={canvasSize.font}
                      />
                    </>
                  )}

                  {hasDangerAlert && dangerType === 'clogging' && (
                    <g transform={`translate(${slotX[2]}, ${baseY - 160})`}>
                      <circle cx={0} cy={0} r={22} fill={withAlpha(colors.warning[500], 0.2)} stroke={colors.warning[500]} strokeWidth={2} />
                      <text x={0} y={4} textAnchor="middle" fill={colors.warning[700]} fontSize={canvasSize.font(FONT.annotation)} fontWeight="extrabold">
                        🚫 反应堵塞!
                      </text>
                    </g>
                  )}

                  <text x={slotX[2]} y={baseY + 30} textAnchor="middle" fill={SCENE_COLORS.labels.chemicalFormula} fontSize={canvasSize.font(FONT.label)} fontWeight="bold">
                    ③ 干燥脱水 ({dryer === 'conc-h2so4' ? '浓H₂SO₄' : dryer === 'soda-lime' ? '碱石灰' : 'CaCl₂'})
                  </text>
                </g>
              )}

              {/* 4. Slot 3: 收集装置 (仅在 hasCollection 时渲染) */}
              {hasCollection && (
                <g id="slot-3-collection">
                  {isWaterDisplacement ? (
                    <g transform={`translate(${slotX[3] - 75}, ${baseY - 150})`}>
                      {/* 排水集气水槽 */}
                      <rect x={0} y={70} width={150} height={80} rx={4} fill={withAlpha(SCENE_COLORS.materials.glass, 0.3)} stroke={SCENE_COLORS.container.beakerBorder} strokeWidth={2} />
                      <rect x={4} y={80} width={142} height={66} fill={withAlpha(SCENE_COLORS.reagent.solution, 0.25)} />

                      {/* 倒扣集气瓶 */}
                      <rect x={45} y={15} width={60} height={95} rx={3} fill={withAlpha(SCENE_COLORS.container.beaker, 0.4)} stroke={SCENE_COLORS.container.beakerBorder} strokeWidth={2} />

                      {/* 倒扣瓶内气体与水界面 */}
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

                      {/* 排水集气弯管 */}
                      <path
                        d="M 25,10 L 25,120 L 75,120 L 75,85"
                        fill="none"
                        stroke={SCENE_COLORS.container.beakerBorder}
                        strokeWidth={4}
                      />

                      {flowRate > 0 && (
                        <BubbleEmitter x={75} y={80} count={6} />
                      )}

                      <text x={75} y={0} textAnchor="middle" fill={SCENE_COLORS.labels.chemicalFormula} fontSize={canvasSize.font(FONT.annotation)} fontWeight="bold">
                        排水集气 (倒扣排水)
                      </text>
                    </g>
                  ) : (
                    <>
                      <GasJarApparatus
                        x={jarX}
                        y={jarY}
                        width={70}
                        height={110}
                        hasCover={false}
                        hasTubes={true}
                        tubeMode={collection === 'downward-air' ? 'short-in-long-out' : 'long-in-short-out'}
                        gasLabel={targetGas}
                      />

                      {/* 排空气法瓶内特征气体加色 overlay */}
                      <rect
                        x={jarX + 8}
                        y={jarY + 20}
                        width={54}
                        height={85}
                        fill={gasColor}
                        rx={2}
                      />
                    </>
                  )}

                  <text x={slotX[3]} y={baseY + 30} textAnchor="middle" fill={SCENE_COLORS.labels.chemicalFormula} fontSize={canvasSize.font(FONT.label)} fontWeight="bold">
                    ④ 规范收集 ({isWaterDisplacement ? '排水法' : collection === 'downward-air' ? '向下排空气' : '向上排空气'})
                  </text>
                </g>
              )}

              {/* 5. Slot 4: 尾气处理装置 (仅在 hasTailGas 时渲染) */}
              {hasTailGas && (
                <g id="slot-4-tailgas">
                  {tailGas === 'combustion' ? (
                    /* 点燃/灼烧法：导管口 + 火焰/燃烧头 */
                    <g transform={`translate(${slotX[4] - 30}, ${baseY - 120})`}>
                      <path d="M 0,0 L 40,0 L 40,-40" fill="none" stroke={SCENE_COLORS.container.beakerBorder} strokeWidth={4} />
                      {/* 火焰 */}
                      <path d="M 40,-40 Q 30,-70 40,-85 Q 50,-70 40,-40" fill={colors.warning[400]} opacity={0.9} className="animate-pulse" />
                      <path d="M 40,-42 Q 35,-60 40,-70 Q 45,-60 40,-42" fill={CHEMISTRY_COLORS.concentration} />
                    </g>
                  ) : tailGas === 'balloon' ? (
                    /* 收集气球：导管口 + 膨胀气球 */
                    <g transform={`translate(${slotX[4] - 20}, ${baseY - 140})`}>
                      <path d="M 0,20 L 20,20 L 20,-10" fill="none" stroke={SCENE_COLORS.container.beakerBorder} strokeWidth={4} />
                      <ellipse cx={20} cy={-50} rx={35} ry={45} fill={withAlpha(CHEMISTRY_COLORS.pH, 0.7)} stroke={CHEMISTRY_COLORS.pH} strokeWidth={2} />
                    </g>
                  ) : tailGas === 'safety-bottle' ? (
                    /* 安全瓶 + 烧杯 */
                    <>
                      <ErlenmeyerFlaskApparatus x={slotX[4] - 65} y={baseY - 165} width={50} height={75} fillLevel={0} hasStopper={true} />
                      <BeakerApparatus x={beakerX + 25} y={beakerY} width={70} height={100} fillLevel={0.5} fillColor={withAlpha(SCENE_COLORS.reagent.solution, 0.2)} />
                    </>
                  ) : (
                    /* 烧杯 (防倒吸漏斗 或 直插) */
                    <>
                      <BeakerApparatus x={beakerX} y={beakerY} width={90} height={100} fillLevel={0.5} fillColor={withAlpha(SCENE_COLORS.reagent.solution, 0.2)} />
                      {tailGas === 'inverted-funnel' && (
                        <AntiSiphonFunnelApparatus
                          x={slotX[4] - 40}
                          y={baseY - 98}
                          width={80}
                          height={100}
                          liquidLevel={0.5}
                          isAbsorbing={flowRate > 0}
                        />
                      )}
                    </>
                  )}

                  {/* 倒吸液体爬升 Warning */}
                  {hasDangerAlert && dangerType === 'siphon' && (
                    <g transform={`translate(${slotX[4]}, ${baseY - 100})`}>
                      <path d="M 0,0 L 0,-80" stroke={colors.danger[500]} strokeWidth={5} strokeDasharray="6 4" className="animate-pulse" />
                      <polygon points="0,-90 -8,-75 8,-75" fill={colors.danger[500]} />
                    </g>
                  )}

                  <text x={slotX[4]} y={baseY + 30} textAnchor="middle" fill={SCENE_COLORS.labels.chemicalFormula} fontSize={canvasSize.font(FONT.label)} fontWeight="bold">
                    {tailGas === 'inverted-funnel'
                      ? '⑤ 尾气处理 (倒置漏斗防倒吸)'
                      : tailGas === 'safety-bottle'
                      ? '⑤ 尾气处理 (安全瓶防倒吸)'
                      : tailGas === 'combustion'
                      ? '⑤ 尾气处理 (点燃/灼烧法)'
                      : tailGas === 'balloon'
                      ? '⑤ 尾气处理 (收集气球)'
                      : tailGas === 'direct-pipe'
                      ? '⑤ 尾气处理 (直导管吸收)'
                      : '⑤ 尾气处理 (NaOH 溶液吸收)'}
                  </text>
                </g>
              )}

              {/* 6. 正交自适应玻璃导管物理缝合 Engine */}
              {routePoints.map((pts, idx) => (
                <GlassTubingConnectionApparatus
                  key={`route-${idx}`}
                  x={pts.outlet.x}
                  y={pts.outlet.y}
                  endX={pts.inlet.x - pts.outlet.x}
                  endY={pts.inlet.y - pts.outlet.y}
                  midY={baseY - 195}
                  tubeType="Z-shape"
                  hasStopperJoint={false}
                />
              ))}
            </AnimationSvgCanvas>
          </div>
        </div>
      )}

      {/* 视角 1: ✓ 规范踩分 */}
      {viewMode === 1 && quizData && (
        <div className="w-full h-full py-4 overflow-y-auto bg-slate-50">
          <div className="max-w-4xl mx-auto px-4">
            <ScoringCardSection steps={quizData.scoringSteps} />
          </div>
        </div>
      )}

      {/* 视角 2: 📖 真题研析 */}
      {viewMode === 2 && quizData && (
        <div className="w-full h-full py-4 overflow-y-auto bg-slate-50">
          <div className="max-w-4xl mx-auto px-4">
            <GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />
          </div>
        </div>
      )}
    </div>
  )
}
