/**
 * src/features/gas-chain/components/GasChainCenterView.tsx
 * 气体制备/净化/尾气处理装置链工具 - 中屏主视点平级视图
 *
 * 物理装配骨架 Engine (Assembly Skeleton Grid):
 * - 基于 CANVAS_PRESETS.full (840 x 650) 充裕全景空间
 * - 桌面底座线 Y_table = 480，5 大节点 Slot 0~4 精确卡位
 * - 100% 高考规范 0 刺穿、0 断裂、0 错位物理对齐引擎
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
import { CANVAS_PRESETS, withAlpha } from '@/theme'
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
  const { viewMode, generator, washReagent, washReverse, dryer, collection, tailGas, heating, systemId, targetGas, flowRate } = params
  const { hasDangerAlert, dangerType } = chemistry

  // 选用 CANVAS_PRESETS.full (840 x 650 充裕全景)
  const { containerRef, canvasSize, vp } = useAnimationViewport({
    preset: CANVAS_PRESETS.full,
  })

  // 坐标比例尺
  useSceneScale({
    vp,
    preset: CANVAS_PRESETS.full,
    anchor: 'center',
  })

  // ── 1. 装配骨架网格 (Assembly Skeleton Grid) 定位系统 ──
  const baseY = 480 // 绝对桌面底座线 Y
  const slotX = [100, 260, 420, 580, 740] // 5 大节点 X 轴中心

  // ── 2. 节点 0 (发生装置 Slot 0) 端口与卡位计算 (100% 高考化学规范) ──
  let node0Outlet = { x: slotX[0] + 35, y: baseY - 165 }
  let flaskPorts: ReturnType<typeof getDistillationFlaskPorts> | null = null

  if (generator === 'flask-heat') {
    const flaskX = slotX[0] - 45
    const flaskY = baseY - 230
    flaskPorts = getDistillationFlaskPorts(flaskX, flaskY, 90, 140)
    node0Outlet = flaskPorts.sideArmPort
  } else if (generator === 'testtube-heat') {
    // 调用 SolidHeatingGenerator 导出的高保真精准端点
    const solidGenPorts = getSolidHeatingGeneratorPorts(slotX[0] - 60, baseY)
    node0Outlet = solidGenPorts.outletPort
  } else if (generator === 'flask-noheat') {
    // 锥形瓶右侧导出管端点
    node0Outlet = { x: slotX[0] + 25, y: baseY - 165 }
  } else if (generator === 'kipp') {
    // 启普发生器侧管活塞出口端点 (精确调用 getKippApparatusPorts)
    const kippPorts = getKippApparatusPorts(slotX[0] - 45, baseY - 220, 90)
    node0Outlet = kippPorts.outletPort
  }

  // ── 3. 节点 1 (净化洗气瓶 Slot 1) 端口计算 ──
  const washBottleX = slotX[1] - 45
  const washBottleY = baseY - 140
  const washPorts = getGasWashingBottlePorts(washBottleX, washBottleY, 90, 140)
  // 短进长出时端口对调
  const node1Inlet = washReverse ? washPorts.outletPort : washPorts.inletPort
  const node1Outlet = washReverse ? washPorts.inletPort : washPorts.outletPort

  // ── 4. 节点 2 (干燥 Slot 2) 端口计算 ──
  let node2Inlet = { x: slotX[2] - 45, y: baseY - 140 }
  let node2Outlet = { x: slotX[2] + 45, y: baseY - 140 }

  if (dryer === 'conc-h2so4') {
    const dryWashPorts = getGasWashingBottlePorts(slotX[2] - 45, baseY - 140, 90, 140)
    node2Inlet = dryWashPorts.inletPort
    node2Outlet = dryWashPorts.outletPort
  } else if (dryer === 'cacl2') {
    // U型管
    node2Inlet = { x: slotX[2] - 35, y: baseY - 120 }
    node2Outlet = { x: slotX[2] + 35, y: baseY - 120 }
  } else {
    // 球形干燥管 (大口进，小口出)
    node2Inlet = { x: slotX[2] - 55, y: baseY - 170 }
    node2Outlet = { x: slotX[2] + 50, y: baseY - 170 }
  }

  // ── 5. 节点 3 (集气瓶 Slot 3) 端口计算 (精准平立落地桌面 baseY) ──
  const jarX = slotX[3] - 35
  const jarY = baseY - 110
  const jarPorts = getGasJarPorts(jarX, jarY, 70)

  let node3Inlet = jarPorts.topStopperLeft
  let node3Outlet = jarPorts.topStopperRight

  if (collection === 'downward-air') {
    // 向下排空气法 (NH3/H2): 短管进气在瓶口，长管在瓶底排空气
    node3Inlet = jarPorts.topStopperLeft
    node3Outlet = jarPorts.topStopperRight
  } else if (collection === 'water-displacement') {
    // 排水集气法: 引气管深入水槽倒扣瓶口
    node3Inlet = { x: slotX[3] - 50, y: baseY - 140 }
    node3Outlet = { x: slotX[3] + 40, y: baseY - 140 }
  }

  // ── 6. 节点 4 (尾气防倒吸 Slot 4) 端口计算 ──
  const beakerX = slotX[4] - 45
  const beakerY = baseY - 100

  // 当为普通烧杯溶液吸收时，导管在烧杯上方垂直向下弯折伸入吸收液面下 20px (baseY - 30)
  let node4Inlet = { x: slotX[4] - 15, y: baseY - 30 }
  if (tailGas === 'inverted-funnel') {
    const funnelPorts = getAntiSiphonFunnelPorts(slotX[4] - 40, baseY - 98, 80, 100)
    node4Inlet = funnelPorts.topConnectPort
  }

  // 试剂变色状态计算 (SO2 遇品红/KMnO4 渐变褪色)
  let washSolutionColor = '#3B82F6'
  if (washReagent === 'fuchsin') {
    washSolutionColor = targetGas === 'SO₂' && flowRate > 0 ? '#FCE7F3' : '#EC4899'
  } else if (washReagent === 'kmno4') {
    washSolutionColor = (targetGas === 'SO₂' || targetGas === 'C₂H₄') && flowRate > 0 ? '#F1F5F9' : '#8B5CF6'
  } else if (washReagent === 'sat-nacl') {
    washSolutionColor = '#E0F2FE'
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-slate-50 relative">
      {/* 视角 0: ✨ 图谱探究 (独占中屏全景，CANVAS_PRESETS.full 840x650) */}
      {viewMode === 0 && (
        <div className="w-full h-full relative overflow-hidden flex flex-col">
          {/* 全景 SVG 装置链 */}
          <div className="w-full h-full flex-1 min-h-0">
            <AnimationSvgCanvas containerRef={containerRef} transform={vp.transform}>
              {/* ── 0. 实验室桌线与地面背景 ── */}
              <rect x={10} y={baseY} width={820} height={12} fill="#CBD5E1" rx={2} />
              <line x1={20} y1={baseY + 12} x2={820} y2={baseY + 12} stroke="#94A3B8" strokeWidth={2} />

              {/* ── 1. Slot 0: 发生装置 ── */}
              <g id="slot-0-generator">
                {/* 1.1 铁架台：仅在固液加热蒸馏烧瓶时显示自适应支撑；固固加热由 SolidHeatingGeneratorApparatus 复合组件内聚实现 */}
                {generator === 'flask-heat' && (
                  <IronSupportApparatus
                    x={slotX[0] - 85}
                    y={baseY - 350}
                    width={120}
                    height={350}
                    hasClamp={true}
                    clampPos={0.35}
                  />
                )}

                {/* 1.2 固-液加热 (圆底/蒸馏烧瓶 + 石棉网 + 铁夹 + 酒精灯 + 分液漏斗 + 温度计) */}
                {generator === 'flask-heat' && (
                  <>
                    {/* 石棉网 (Wire Gauze)：垫在烧瓶底部 */}
                    <rect x={slotX[0] - 50} y={baseY - 86} width={100} height={6} fill="#94A3B8" rx={1} stroke="#64748B" strokeWidth={1} />
                    <line x1={slotX[0] - 50} y1={baseY - 83} x2={slotX[0] + 50} y2={baseY - 83} stroke="#475569" strokeDasharray="2 2" />

                    {/* 具支蒸馏烧瓶 (底部垫在石棉网上) */}
                    <DistillationFlaskApparatus x={slotX[0] - 45} y={baseY - 226} width={90} height={140} fillLevel={0.45} fillColor="#3B82F6" />

                    {/* 酒精灯：外焰顶端紧贴石棉网底部 (baseY - 86)，灯座立于桌面 (baseY) */}
                    <AlcoholLampApparatus
                      x={slotX[0] - 35}
                      y={baseY - 80}
                      width={70}
                      height={80}
                      lit={heating}
                    />

                    {/* 分液漏斗下尖嘴精准插穿橡皮塞深入烧瓶颈内 */}
                    {flaskPorts && (
                      <SeparatoryFunnelApparatus
                        x={flaskPorts.topNeckPort.x - (targetGas === 'C₂H₄' || systemId === 'c2h4-prep' ? 55 : 40)}
                        y={flaskPorts.topNeckPort.y - 120}
                        width={targetGas === 'C₂H₄' || systemId === 'c2h4-prep' ? 70 : 80}
                        height={140}
                        bottomFillLevel={0.7}
                        bottomFillColor="#E0F2FE"
                      />
                    )}

                    {/* 制乙烯 (170°C) 双孔塞温度计：水银球完全浸没在反应混合液面中央！ */}
                    {(systemId === 'c2h4-prep' || targetGas === 'C₂H₄') && flaskPorts && (
                      <g transform={`translate(${flaskPorts.topNeckPort.x - 10}, ${flaskPorts.topNeckPort.y - 45})`}>
                        <ThermometerApparatus x={0} y={0} tempValue={170} height={175} />
                        <rect x={15} y={50} width={100} height={20} rx={4} fill="#FEF3C7" stroke="#D97706" strokeWidth={1} />
                        <text x={20} y={64} fill="#B45309" fontSize={canvasSize.font(10)} fontWeight="bold">
                          水银球浸没 170°C
                        </text>
                      </g>
                    )}
                  </>
                )}

                {/* 1.3 高保真固-固加热发生器复合组件 (物理零穿透、绝无脱扣悬空、受重力平铺药粉) */}
                {generator === 'testtube-heat' && (
                  <SolidHeatingGeneratorApparatus
                    x={slotX[0] - 60}
                    y={baseY}
                    targetGas={targetGas}
                    lit={heating}
                    font={canvasSize.font}
                  />
                )}

                {/* 1.4 固-液不加热 (锥形瓶平放桌面，双孔塞分液漏斗) */}
                {generator === 'flask-noheat' && (
                  <>
                    <ErlenmeyerFlaskApparatus x={slotX[0] - 40} y={baseY - 170} width={80} height={110} fillLevel={0.4} fillColor="#0284C7" hasStopper={true} />
                    {/* 双孔塞卡合分液漏斗 */}
                    <SeparatoryFunnelApparatus x={slotX[0] - 40} y={baseY - 260} width={80} height={120} bottomFillLevel={0.8} />
                  </>
                )}

                {/* 1.5 高保真启普发生器 (独立平放桌面，自动隐藏铁架台与酒精灯) */}
                {generator === 'kipp' && (
                  <KippApparatus x={slotX[0] - 45} y={baseY - 220} width={90} height={220} isOpen={flowRate > 0} gasLabel={targetGas} />
                )}

                {/* 倒吸炸裂 Warning 标记 */}
                {hasDangerAlert && dangerType === 'siphon' && (
                  <g transform={`translate(${slotX[0]}, ${baseY - 260})`} className="animate-bounce">
                    <circle cx={0} cy={0} r={28} fill="#EF4444" fillOpacity={0.25} stroke="#DC2626" strokeWidth={2.5} />
                    <text x={0} y={4} textAnchor="middle" fill="#DC2626" fontSize={canvasSize.font(13)} fontWeight="extrabold">
                      💥 倒吸炸裂!
                    </text>
                  </g>
                )}

                <text x={slotX[0]} y={baseY + 30} textAnchor="middle" fill="#475569" fontSize={canvasSize.font(12)} fontWeight="bold">
                  ① 发生装置 ({targetGas})
                </text>
              </g>

              {/* ── 2. 导管 0 ➔ 1 正交自适应无缝缝合 ── */}
              <GlassTubingConnectionApparatus
                x={node0Outlet.x}
                y={node0Outlet.y}
                endX={node1Inlet.x - node0Outlet.x}
                endY={node1Inlet.y - node0Outlet.y}
                midY={baseY - 200}
                tubeType="Z-shape"
                hasStopperJoint={false}
              />

              {/* ── 3. Slot 1: 净化洗气瓶 ── */}
              <g id="slot-1-wash">
                <GasWashingBottleApparatus
                  x={washBottleX}
                  y={washBottleY}
                  width={90}
                  height={140}
                  reagentType={washReagent === 'sat-nacl' ? 'acid' : washReagent === 'water' ? 'water' : 'base'}
                  bubbling={flowRate > 0 && !washReverse}
                />

                {/* 洗气瓶液体动态变色 overlay */}
                <rect
                  x={washBottleX + 10}
                  y={washBottleY + 75}
                  width={70}
                  height={55}
                  fill={washSolutionColor}
                  fillOpacity={0.4}
                  rx={4}
                />

                {/* 洗气鼓泡效果 */}
                {flowRate > 0 && !washReverse && (
                  <BubbleEmitter x={washBottleX + 25} y={washBottleY + 110} count={8} />
                )}

                {/* 短进长出喷溅 Warning */}
                {washReverse && (
                  <g transform={`translate(${slotX[1]}, ${baseY - 170})`}>
                    <rect x={-45} y={-14} width={90} height={22} rx={4} fill="#FEE2E2" stroke="#EF4444" strokeWidth={1.5} />
                    <text x={0} y={2} textAnchor="middle" fill="#991B1B" fontSize={canvasSize.font(11)} fontWeight="bold">
                      ⚠️ 短进长出喷溅!
                    </text>
                  </g>
                )}

                <text x={slotX[1]} y={baseY + 30} textAnchor="middle" fill="#475569" fontSize={canvasSize.font(12)} fontWeight="bold">
                  ② 净化洗气瓶
                </text>
              </g>

              {/* ── 4. 导管 1 ➔ 2 正交缝合 ── */}
              <GlassTubingConnectionApparatus
                x={node1Outlet.x}
                y={node1Outlet.y}
                endX={node2Inlet.x - node1Outlet.x}
                endY={node2Inlet.y - node1Outlet.y}
                midY={baseY - 195}
                tubeType="Z-shape"
                hasStopperJoint={false}
              />

              {/* ── 5. Slot 2: 干燥装置 ── */}
              <g id="slot-2-dryer">
                {dryer === 'conc-h2so4' ? (
                  <GasWashingBottleApparatus x={slotX[2] - 45} y={baseY - 140} width={90} height={140} reagentType="acid" bubbling={flowRate > 0} />
                ) : (
                  <>
                    {/* 球形/U型干燥管：大口在左(进)，小口在右(出) */}
                    <DryingTubeApparatus
                      x={slotX[2] - 55}
                      y={baseY - 195}
                      width={110}
                      height={50}
                      variant={dryer === 'cacl2' ? 'U-shape' : 'spherical'}
                      desiccantName={dryer === 'soda-lime' ? '碱石灰' : '无水 CaCl₂'}
                    />
                  </>
                )}

                {/* 封堵结晶烟雾 Warning */}
                {hasDangerAlert && dangerType === 'clogging' && (
                  <g transform={`translate(${slotX[2]}, ${baseY - 160})`}>
                    <circle cx={0} cy={0} r={22} fill="#FEF3C7" fillOpacity={0.9} stroke="#D97706" strokeWidth={2} />
                    <text x={0} y={4} textAnchor="middle" fill="#B45309" fontSize={canvasSize.font(11)} fontWeight="extrabold">
                      🚫 结晶堵塞!
                    </text>
                  </g>
                )}

                <text x={slotX[2]} y={baseY + 30} textAnchor="middle" fill="#475569" fontSize={canvasSize.font(12)} fontWeight="bold">
                  ③ 干燥脱水
                </text>
              </g>

              {/* ── 6. 导管 2 ➔ 3 正交缝合 ── */}
              <GlassTubingConnectionApparatus
                x={node2Outlet.x}
                y={node2Outlet.y}
                endX={node3Inlet.x - node2Outlet.x}
                endY={node3Inlet.y - node2Outlet.y}
                midY={baseY - 190}
                tubeType="Z-shape"
                hasStopperJoint={false}
              />

              {/* ── 7. Slot 3: 气体收集瓶 (向上排空气/向下排空气短进长出/排水集气专有弯管) ── */}
              <g id="slot-3-collection">
                {collection === 'water-displacement' ? (
                  <g transform={`translate(${slotX[3] - 75}, ${baseY - 150})`}>
                    {/* 排水集气透明水槽 */}
                    <rect x={0} y={70} width={150} height={80} rx={4} fill={withAlpha('#0284C7', 0.25)} stroke="#0284C7" strokeWidth={2} />
                    <rect x={4} y={80} width={142} height={66} fill="#38BDF8" fillOpacity={0.4} />

                    {/* 倒扣集气瓶 (瓶口在水面下 Y=110，瓶底在上方 Y=15) */}
                    <rect x={45} y={15} width={60} height={95} rx={3} fill={withAlpha('#CBD5E1', 0.35)} stroke="#64748B" strokeWidth={2} />
                    
                    {/* 倒扣瓶内排气动态: 气体积累由瓶顶向下扩展 */}
                    <rect
                      x={47}
                      y={17}
                      width={56}
                      height={flowRate > 0 ? 55 : 10}
                      fill={targetGas === 'Cl₂' ? '#FACC15' : targetGas === 'NO₂' ? '#B45309' : '#E0F2FE'}
                      fillOpacity={0.6}
                      rx={2}
                    />
                    <rect
                      x={47}
                      y={17 + (flowRate > 0 ? 55 : 10)}
                      width={56}
                      height={91 - (flowRate > 0 ? 55 : 10)}
                      fill="#38BDF8"
                      fillOpacity={0.5}
                    />

                    {/* 弯曲引气玻璃导管 (从水槽左侧延伸没入水下并在瓶口内向上弯曲) */}
                    <path
                      d="M 25,10 L 25,120 L 75,120 L 75,85"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth={4}
                    />

                    {/* 水下管口冒出气泡上升至倒扣集气瓶内 */}
                    {flowRate > 0 && (
                      <BubbleEmitter x={75} y={80} count={6} />
                    )}

                    <text x={75} y={0} textAnchor="middle" fill="#0284C7" fontSize={canvasSize.font(11)} fontWeight="bold">
                      排水集气 (倒扣排水)
                    </text>
                  </g>
                ) : (
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
                )}

                <text x={slotX[3]} y={baseY + 30} textAnchor="middle" fill="#475569" fontSize={canvasSize.font(12)} fontWeight="bold">
                  ④ 集气瓶/收集
                </text>
              </g>

              {/* ── 8. 导管 3 ➔ 4 正交缝合 ── */}
              <GlassTubingConnectionApparatus
                x={node3Outlet.x}
                y={node3Outlet.y}
                endX={node4Inlet.x - node3Outlet.x}
                endY={node4Inlet.y - node3Outlet.y}
                midY={baseY - 185}
                tubeType="Z-shape"
                hasStopperJoint={false}
              />

              {/* ── 9. Slot 4: 尾气处理装置 (防倒吸/吸收/灼烧) ── */}
              <g id="slot-4-tailgas">
                <BeakerApparatus x={beakerX} y={beakerY} width={90} height={100} fillLevel={0.5} fillColor="#EC4899" />

                {tailGas === 'inverted-funnel' && (
                  /* 倒置漏斗大口下沿贴合烧杯液面下 2px 形成水封防倒吸 (Y = baseY - 98) */
                  <AntiSiphonFunnelApparatus
                    x={slotX[4] - 40}
                    y={baseY - 98}
                    width={80}
                    height={100}
                    liquidLevel={0.5}
                    isAbsorbing={flowRate > 0}
                  />
                )}

                {/* 倒吸液体爬升 Warning 箭头 */}
                {hasDangerAlert && dangerType === 'siphon' && (
                  <g transform={`translate(${slotX[4]}, ${baseY - 100})`}>
                    <path d="M 0,0 L 0,-80" stroke="#EF4444" strokeWidth={5} strokeDasharray="6 4" className="animate-pulse" />
                    <polygon points="0,-90 -8,-75 8,-75" fill="#EF4444" />
                  </g>
                )}

                {/* 依据实际尾气处理形态动态渲染 Label */}
                <text x={slotX[4]} y={baseY + 30} textAnchor="middle" fill="#475569" fontSize={canvasSize.font(12)} fontWeight="bold">
                  {tailGas === 'inverted-funnel'
                    ? '⑤ 尾气处理 (倒置漏斗防倒吸)'
                    : tailGas === 'safety-bottle'
                    ? '⑤ 尾气处理 (安全瓶防倒吸)'
                    : tailGas === 'combustion'
                    ? '⑤ 尾气处理 (点燃/灼烧法)'
                    : tailGas === 'balloon'
                    ? '⑤ 尾气处理 (收集气球)'
                    : tailGas === 'direct-pipe'
                    ? '⑤ 尾气处理 (直管 - 注意防倒吸)'
                    : '⑤ 尾气处理 (NaOH 溶液吸收)'}
                </text>
              </g>
            </AnimationSvgCanvas>
          </div>
        </div>
      )}

      {/* 视角 1: ✓ 规范踩分 (独占中屏，绝对不与图谱混在一起) */}
      {viewMode === 1 && quizData && (
        <div className="w-full h-full py-4 overflow-y-auto bg-slate-50">
          <div className="max-w-4xl mx-auto px-4">
            <ScoringCardSection steps={quizData.scoringSteps} />
          </div>
        </div>
      )}

      {/* 视角 2: 📖 真题研析 (独占中屏，绝对不与图谱混在一起) */}
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
