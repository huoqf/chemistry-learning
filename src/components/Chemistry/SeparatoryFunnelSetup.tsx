import {
  SeparatoryFunnelApparatus,
  BeakerApparatus,
  IronSupportApparatus,
  getIronSupportPorts,
  getSeparatoryFunnelPorts,
} from './index'
import { CHEMISTRY_COLORS, SCENE_COLORS, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'

export interface SeparatoryFunnelSetupState {
  bottomLevel: number
  topLevel: number
  bottomColor: string
  topColor: string
  beakerAFillLevel: number
  beakerAFillColor: string
  beakerBFillLevel: number
  beakerBFillColor: string
  isShaking: boolean
  isInverted: boolean
  isTilted: boolean
  isValveOpen: boolean
  hasStopper: boolean
  isGassing: boolean
  waterLayerLabel: string
  orgLayerLabel: string
  progressText: string
}

export interface SeparatoryFunnelSetupProps {
  /** 萃取分液实验状态数据 */
  extraction: SeparatoryFunnelSetupState
  /** SVG 字体缩放 scaler */
  font?: FontScaler
  /** 整体组件基点坐标 x（默认 0） */
  x?: number
  /** 整体组件基点坐标 y（默认 0） */
  y?: number
}

/**
 * SeparatoryFunnelSetup — 高阶预制萃取分液实验装配体组件 (Composite Setup)
 *
 * 封装特点：
 * - 内置铁架台、分液漏斗（45° 斜切尖嘴）、接收烧杯 A 与 烧杯 B
 * - 内部解物理几何方程：斜切尖嘴 45° 长边朝右，深入烧杯 A 口部下方 35px，且最外侧触点 100% 物理接触紧贴在烧杯 A 左侧内壁
 * - 声明式接口，外部页面无需任何手动坐标计算
 */
export function SeparatoryFunnelSetup({
  extraction,
  font = (n) => n,
  x = 0,
  y = 0,
}: SeparatoryFunnelSetupProps) {
  const {
    bottomLevel,
    topLevel,
    bottomColor,
    topColor,
    beakerAFillLevel,
    beakerAFillColor,
    beakerBFillLevel,
    beakerBFillColor,
    isShaking,
    isInverted,
    isTilted,
    isValveOpen,
    hasStopper,
    isGassing,
    waterLayerLabel,
    orgLayerLabel,
    progressText,
  } = extraction

  // 1. 静态铁架台坐标与锚点计算
  const standX = 75
  const standY = 40
  const standH = 530
  const ringPosRatio = 0.25
  const ringRadius = 44
  const standPorts = getIronSupportPorts(standX, standY, 160, standH, 0.35, ringPosRatio, ringRadius)

  // 2. 分液漏斗坐标 (延伸长度 funnelH = 425，深入烧杯口下方 35px 处)
  const funnelW = 110
  const funnelH = 425
  const funnelX = standPorts.ringCenterPos.x - funnelW * 0.5
  const funnelY = standPorts.ringCenterPos.y - funnelH * 0.33
  const funnelPorts = getSeparatoryFunnelPorts(funnelX, funnelY, funnelW, funnelH)

  // 3. 接下层液的烧杯 A (装配体内部精准解方程：使漏斗 45° 斜切尖嘴长边外侧 100% 物理碰撞吸附在烧杯 A 左侧内壁上)
  const beakerAW = 95
  const beakerAH = 120
  const wallOffset = Math.max(2, beakerAW * 0.04) // 3.8px
  // 方程：beakerAX + wallOffset === funnelPorts.tipContactPort.x
  const beakerAX = funnelPorts.tipContactPort.x - wallOffset
  const beakerAY = 570 - beakerAH // 450 (漏斗尖嘴在 485，深入烧杯口内 35px)

  // 4. 接上层液的烧杯 B (放置在右侧)
  const beakerBW = 95
  const beakerBH = 120
  const beakerBX = 295
  const beakerBY = 570 - beakerBH // 450

  // 姿态变换 computed transform
  let funnelTransform = ''
  if (isInverted) {
    // 倒转 165° 姿态：旋转中心取漏斗腹部，斜朝上方开塞放气
    const shakeOffset = isShaking ? Math.sin(Date.now() * 0.02) * 5 : 0
    funnelTransform = `rotate(165, ${funnelX + funnelW * 0.5}, ${funnelY + funnelH * 0.4}) translate(${shakeOffset}, -20)`
  } else if (isTilted) {
    // 倾斜 55° 向右侧烧杯 B 倒出上层液体
    funnelTransform = `rotate(55, ${funnelX + funnelW * 0.5}, ${funnelY + funnelH * 0.4}) translate(60, -30)`
  } else if (isShaking) {
    funnelTransform = `translate(4, -3) rotate(2, ${funnelX + funnelW * 0.5}, ${funnelY + funnelH * 0.4})`
  }

  return (
    <g transform={x || y ? `translate(${x}, ${y})` : undefined}>
      {/* 1. 静态铁架台支撑 */}
      <IronSupportApparatus
        x={standX}
        y={standY}
        width={160}
        height={standH}
        hasRing={true}
        ringPos={ringPosRatio}
        ringRadius={ringRadius}
      />

      {/* 2. 烧杯 A：接下层液体 (底层先渲染烧杯，呈管嘴嵌入烧杯效果) */}
      <g>
        <BeakerApparatus
          x={beakerAX}
          y={beakerAY}
          width={beakerAW}
          height={beakerAH}
          fillLevel={beakerAFillLevel}
          fillColor={beakerAFillColor}
          font={font}
        />
        <text
          x={beakerAX + beakerAW * 0.5}
          y={beakerAY + beakerAH + 14}
          fontSize={font(11)}
          fill={CHEMISTRY_COLORS.concentration}
          fontWeight="bold"
          textAnchor="middle"
        >
          烧杯A (接下层液·45°斜切尖嘴紧贴内壁)
        </text>
      </g>

      {/* 3. 烧杯 B：接上层液体 (倒出时接收) */}
      <g>
        <BeakerApparatus
          x={beakerBX}
          y={beakerBY}
          width={beakerBW}
          height={beakerBH}
          fillLevel={beakerBFillLevel}
          fillColor={beakerBFillColor}
          font={font}
        />
        <text
          x={beakerBX + beakerBW * 0.5}
          y={beakerBY + beakerBH + 14}
          fontSize={font(11)}
          fill={CHEMISTRY_COLORS.reactionRate}
          fontWeight="bold"
          textAnchor="middle"
        >
          烧杯B (接上层液·上口倒出)
        </text>
      </g>

      {/* 4. 分液漏斗主体 (后渲染，使管嘴深入烧杯口内部，呈真实卡入靠壁效果) */}
      <g transform={funnelTransform || undefined}>
        <SeparatoryFunnelApparatus
          x={funnelX}
          y={funnelY}
          width={funnelW}
          height={funnelH}
          bottomFillLevel={bottomLevel}
          bottomFillColor={bottomColor}
          topFillLevel={topLevel}
          topFillColor={topColor}
          isOpen={isValveOpen || isGassing}
          hasStopper={hasStopper}
          font={font}
        />

        {/* 倒转 180° 放气时的气体喷出波纹与标注 */}
        {isInverted && (
          <g transform={`translate(${funnelX + funnelW * 0.5 + 40}, ${funnelY + funnelH + 20})`}>
            <path
              d="M -10 10 Q 10 -15 30 -5 Q 15 15 -10 10"
              fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.3)}
              stroke={CHEMISTRY_COLORS.concentration}
              strokeWidth={2}
            />
            <line x1={-5} y1={5} x2={25} y2={-15} stroke={CHEMISTRY_COLORS.reactionRate} strokeWidth={2} strokeDasharray="3 2" />
            <text x={32} y={-10} fontSize={font(12)} fill={CHEMISTRY_COLORS.reactionRate} fontWeight="bold">
              旋塞放气 (斜朝上方开塞放气)
            </text>
          </g>
        )}

        {/* 拔塞开小孔连通大气视觉指示 */}
        {!hasStopper && !isInverted && (
          <g transform={`translate(${funnelX + funnelW * 0.5 - 25}, ${funnelY - 18})`}>
            <line x1={25} y1={-10} x2={25} y2={10} stroke={CHEMISTRY_COLORS.concentration} strokeWidth={2} strokeDasharray="2 2" />
            <text x={-45} y={-12} fontSize={font(10)} fill={CHEMISTRY_COLORS.concentration} fontWeight="bold">
              拔塞 / 凹槽对准小孔 (连通大气)
            </text>
          </g>
        )}
      </g>

      {/* 5. 下层液体沿烧杯 A 左侧内壁靠壁滑动滑落细流 */}
      {isValveOpen && !isInverted && !isTilted && (
        <path
          d={`
            M ${funnelPorts.tipContactPort.x} ${funnelPorts.tipContactPort.y}
            L ${funnelPorts.tipContactPort.x} ${beakerAY + beakerAH - 10}
          `}
          fill="none"
          stroke={bottomColor}
          strokeWidth={3}
          strokeDasharray="4 2"
          opacity={0.9}
        />
      )}

      {/* 6. 上层液体倾斜从上口倒入烧杯 B 的细流 */}
      {isTilted && (
        <path
          d={`M ${funnelX + 220} ${funnelY + 120} Q ${beakerBX + 20} ${beakerBY - 20} ${beakerBX + 30} ${beakerBY + 40}`}
          fill="none"
          stroke={topColor}
          strokeWidth={4}
          strokeDasharray="5 2"
          opacity={0.9}
        />
      )}

      {/* 7. 两相分层指示说明 */}
      {!isInverted && !isTilted && (
        <g transform={`translate(${funnelX + funnelW + 10}, ${funnelY + 110})`}>
          <text x={0} y={0} fontSize={font(12)} fill={CHEMISTRY_COLORS.concentration} fontWeight="bold">
            {orgLayerLabel}
          </text>
          <text x={0} y={22} fontSize={font(12)} fill={CHEMISTRY_COLORS.temperature} fontWeight="bold">
            {waterLayerLabel}
          </text>
        </g>
      )}

      {/* 8. 动态流程提示栏 (顶部空旷区) */}
      <g transform={`translate(15, 12)`}>
        <rect
          x={0}
          y={0}
          width={390}
          height={28}
          rx={5}
          fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.12)}
          stroke={CHEMISTRY_COLORS.concentration}
          strokeWidth={1}
        />
        <text x={12} y={19} fontSize={font(11)} fill={CHEMISTRY_COLORS.concentration} fontWeight="bold">
          {progressText}
        </text>
      </g>

      {/* 9. 高考铁律提示条幅 */}
      <g transform={`translate(15, 600)`}>
        <rect
          x={0}
          y={0}
          width={390}
          height={38}
          rx={6}
          fill={withAlpha(CHEMISTRY_COLORS.reactionRate, 0.1)}
          stroke={CHEMISTRY_COLORS.reactionRate}
          strokeWidth={1.2}
        />
        <text x={12} y={16} fontSize={font(11)} fill={CHEMISTRY_COLORS.reactionRate} fontWeight="bold">
          高考铁律：下层液体由下口靠壁流出 (45°斜切尖嘴紧贴烧杯 A 内壁)
        </text>
        <text x={12} y={30} fontSize={font(10)} fill={SCENE_COLORS.materials.metalBorder}>
          关活塞，上层液体由分液漏斗上口倒入烧杯 B (严禁混流)
        </text>
      </g>
    </g>
  )
}
