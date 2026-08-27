import {
  SeparatoryFunnelApparatus,
  BeakerApparatus,
  IronSupportApparatus,
  getIronSupportPorts,
  getSeparatoryFunnelPorts,
} from './index'
import { CHEMISTRY_COLORS, SCENE_COLORS, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'
import type { ExtractionState } from '@/features/experiment/extraction-distillation/hooks/useExtractionDistillationChemistry'

export type SeparatoryFunnelSetupState = ExtractionState

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
 * 规范与高考考点：
 * - 铁架台铁圈支撑
 * - 倒转 $160^\circ$ 脱离铁圈，双手握持，斜朝上方旋塞放气
 * - 拔塞（或对准凹槽小孔）通大气防负压
 * - 下层液体沿烧杯 A 左侧内壁平稳流出（45° 斜切长边贴壁）
 * - 关活塞，上层液体移至烧杯 B 口上方由上口倒入
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
    isInverted,
    isGassing,
    hasStopper,
    isStopperLifted,
    isValveOpen,
    isTilted,
    isBlocked,
    isEthanolMiscible,
    funnelTransform,
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

  // 2. 分液漏斗坐标 (funnelH = 425，管嘴深入烧杯口下方 35px 处)
  const funnelW = 110
  const funnelH = 425
  const funnelX = standPorts.ringCenterPos.x - funnelW * 0.5
  const funnelY = standPorts.ringCenterPos.y - funnelH * 0.33
  const funnelPorts = getSeparatoryFunnelPorts(funnelX, funnelY, funnelW, funnelH)

  // 3. 接下层液的烧杯 A (漏斗 45° 斜切尖嘴紧贴在烧杯 A 左侧内壁)
  const beakerAW = 95
  const beakerAH = 120
  const wallOffset = Math.max(2, beakerAW * 0.04) // 3.8px
  const beakerAX = funnelPorts.tipContactPort.x - wallOffset
  const beakerAY = 570 - beakerAH // 450

  // 4. 接上层液的烧杯 B (放置在右侧)
  const beakerBW = 95
  const beakerBH = 120
  const beakerBX = 295
  const beakerBY = 570 - beakerBH // 450

  // 姿态变换 computed transform
  const { x: fx, y: fy, rotate: fRot } = funnelTransform || { x: 0, y: 0, rotate: 0 }
  const computedTransform =
    fRot !== 0 || fx !== 0 || fy !== 0
      ? `translate(${fx}, ${fy}) rotate(${fRot}, ${funnelX + funnelW * 0.5}, ${funnelY + funnelH * 0.4})`
      : undefined

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

      {/* 2. 烧杯 A：接下层液体 */}
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
          烧杯A (接下层液·45°尖嘴贴壁)
        </text>
      </g>

      {/* 3. 烧杯 B：接上层液体 */}
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
          烧杯B (接上层液·上口倒入)
        </text>
      </g>

      {/* 4. 分液漏斗主体 (可脱离铁圈双手倒持、拔塞、贴壁放液或移位上倒) */}
      <g transform={computedTransform}>
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
          hasStopper={hasStopper && !isStopperLifted}
          font={font}
        />

        {/* 双手倒持姿态示意标注与放气波纹 */}
        {isInverted && (
          <g transform={`translate(${funnelX + funnelW * 0.5 + 40}, ${funnelY + funnelH + 20})`}>
            {isGassing && (
              <>
                <path
                  d="M -10 10 Q 10 -15 30 -5 Q 15 15 -10 10"
                  fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.35)}
                  stroke={CHEMISTRY_COLORS.concentration}
                  strokeWidth={2}
                />
                <line x1={-5} y1={5} x2={28} y2={-18} stroke={CHEMISTRY_COLORS.reactionRate} strokeWidth={2} strokeDasharray="3 2" />
              </>
            )}
            <rect x={20} y={-24} width={130} height={20} rx={4} fill={withAlpha('#000000', 0.65)} />
            <text x={26} y={-10} fontSize={font(11)} fill="#FFFFFF" fontWeight="bold">
              {isGassing ? '💨 旋塞放气 (斜向上)' : '🖐️ 双手握持倒转振摇'}
            </text>
          </g>
        )}

        {/* 拔塞升起连通大气指示 */}
        {isStopperLifted && (
          <g transform={`translate(${funnelX + funnelW * 0.5 - 12}, ${funnelY - 26})`}>
            {/* 悬停玻璃塞 */}
            <path d="M 0 0 L 24 0 L 18 10 L 6 10 Z" fill={SCENE_COLORS.materials.glass} stroke={SCENE_COLORS.materials.glassBorder} strokeWidth={1.5} />
            <line x1={12} y1={12} x2={12} y2={24} stroke={CHEMISTRY_COLORS.concentration} strokeWidth={2} strokeDasharray="2 2" />
            <text x={-45} y={-6} fontSize={font(10)} fill={CHEMISTRY_COLORS.concentration} fontWeight="bold">
              拔塞连通大气 (防负压)
            </text>
          </g>
        )}

        {/* 未拔塞负压报警 */}
        {isBlocked && (
          <g transform={`translate(${funnelX + funnelW * 0.5 - 55}, ${funnelY - 14})`}>
            <rect x={0} y={0} width={110} height={18} rx={3} fill={withAlpha(CHEMISTRY_COLORS.reactionRate, 0.15)} stroke={CHEMISTRY_COLORS.reactionRate} strokeWidth={1} />
            <text x={5} y={13} fontSize={font(10)} fill={CHEMISTRY_COLORS.reactionRate} fontWeight="bold">
              ⚠️ 未拔塞 负压流不出!
            </text>
          </g>
        )}
      </g>

      {/* 5. 下层液体沿烧杯 A 左侧内壁靠壁平稳流下的细流 */}
      {isValveOpen && !isInverted && !isTilted && (
        <path
          d={`
            M ${funnelPorts.tipContactPort.x} ${funnelPorts.tipContactPort.y}
            L ${funnelPorts.tipContactPort.x} ${beakerAY + beakerAH - 12}
          `}
          fill="none"
          stroke={bottomColor}
          strokeWidth={3.5}
          strokeDasharray="4 2"
          opacity={0.9}
        />
      )}

      {/* 6. 上层液体倾斜由上口倒入烧杯 B 的平稳液流 */}
      {isTilted && (
        <path
          d={`M ${funnelX + 225} ${funnelY + 115} Q ${beakerBX + 25} ${beakerBY - 15} ${beakerBX + 35} ${beakerBY + 40}`}
          fill="none"
          stroke={topColor}
          strokeWidth={4}
          strokeDasharray="5 2"
          opacity={0.9}
        />
      )}

      {/* 7. 两相分层说明指示 */}
      {!isInverted && !isTilted && !isEthanolMiscible && (
        <g transform={`translate(${funnelX + funnelW + 10}, ${funnelY + 105})`}>
          <rect x={-5} y={-14} width={160} height={42} rx={4} fill={withAlpha('#FFFFFF', 0.85)} stroke={SCENE_COLORS.materials.glassBorder} strokeWidth={1} />
          <text x={0} y={0} fontSize={font(11)} fill={CHEMISTRY_COLORS.concentration} fontWeight="bold">
            {orgLayerLabel}
          </text>
          <text x={0} y={18} fontSize={font(11)} fill={CHEMISTRY_COLORS.temperature} fontWeight="bold">
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
    </g>
  )
}
