import { SeparatoryFunnelApparatus, BeakerApparatus, IronSupportApparatus } from '@/components/Chemistry'
import { CHEMISTRY_COLORS, SCENE_COLORS, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'
import type { SceneScale } from '@/scene'
import type { ExtractionState } from '../hooks/useExtractionDistillationChemistry'

interface ExtractionSceneProps {
  extraction: ExtractionState
  font: FontScaler
  sceneScale: SceneScale
}

export function ExtractionScene({ extraction, font }: ExtractionSceneProps) {
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

  // 1. 铁架台坐标
  const standX = 75
  const standY = 40
  const standH = 530 // 底座顶面在 40 + 530 = 570

  // 2. 接下层液的烧杯 A (平稳放置在底座上 y = 445 ~ 570)
  const beakerAW = 95
  const beakerAH = 120
  const beakerAX = 175
  const beakerAY = 570 - beakerAH // 450

  // 3. 接上层液的烧杯 B (放置在右侧 y = 450)
  const beakerBW = 95
  const beakerBH = 120
  const beakerBX = 295
  const beakerBY = 570 - beakerBH // 450

  // 4. 分液漏斗基础坐标 (正立时)
  const funnelX = 135
  const funnelY = 60
  const funnelW = 110
  const funnelH = 405 // 管嘴末端在 y = 465，深入烧杯 A 内部

  // 姿态变换 computed transform
  let funnelTransform = ''
  if (isInverted) {
    // 倒转 180° 姿态：旋转中心取漏斗腹部 (190, 240)，微晃动 (isShaking 时加震幅)
    const shakeOffset = isShaking ? Math.sin(Date.now() * 0.02) * 5 : 0
    funnelTransform = `rotate(165, 190, 240) translate(${shakeOffset}, -20)`
  } else if (isTilted) {
    // 倾斜 60° 向右侧烧杯 B 倒出上层液体
    funnelTransform = `rotate(55, 190, 240) translate(60, -30)`
  } else if (isShaking) {
    funnelTransform = 'translate(4, -3) rotate(2, 190, 190)'
  }

  return (
    <g>
      {/* 1. 静态铁架台支撑 */}
      <IronSupportApparatus
        x={standX}
        y={standY}
        width={160}
        height={standH}
        hasRing={true}
        ringPos={0.25}
        ringRadius={44}
      />

      {/* 2. 烧杯 A：接下层液体 (靠紧左侧底座，管嘴沿内壁) */}
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
          烧杯A (接下层液)
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
          烧杯B (接上层液)
        </text>
      </g>

      {/* 4. 分液漏斗主体 (含姿态变换 transform) */}
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
            {/* 放气箭头与高压气雾浪花 */}
            <path
              d="M -10 10 Q 10 -15 30 -5 Q 15 15 -10 10"
              fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.3)}
              stroke={CHEMISTRY_COLORS.concentration}
              strokeWidth={2}
            />
            <line x1={-5} y1={5} x2={25} y2={-15} stroke={CHEMISTRY_COLORS.reactionRate} strokeWidth={2} strokeDasharray="3 2" />
            <text x={32} y={-10} fontSize={font(12)} fill={CHEMISTRY_COLORS.reactionRate} fontWeight="bold">
              旋塞放气 (斜朝上方放气)
            </text>
          </g>
        )}

        {/* 拔塞开小孔连通大气视觉指示 */}
        {!hasStopper && !isInverted && (
          <g transform={`translate(${funnelX + funnelW * 0.5 - 25}, ${funnelY - 18})`}>
            {/* 塞子向上拔起与凹槽对齐指示 */}
            <line x1={25} y1={-10} x2={25} y2={10} stroke={CHEMISTRY_COLORS.concentration} strokeWidth={2} strokeDasharray="2 2" />
            <text x={-45} y={-12} fontSize={font(10)} fill={CHEMISTRY_COLORS.concentration} fontWeight="bold">
              拔塞 / 凹槽对准小孔 (连通大气)
            </text>
          </g>
        )}
      </g>

      {/* 5. 液体从下口沿内壁流下的细流 (流入烧杯 A) */}
      {isValveOpen && !isInverted && !isTilted && (
        <path
          d={`M ${funnelX + funnelW * 0.5 - 2} ${funnelY + funnelH} L ${beakerAX + 16} ${beakerAY + 35}`}
          stroke={bottomColor}
          strokeWidth={3.5}
          strokeDasharray="4 2"
          opacity={0.88}
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
          高考铁律：下层液体由下口放出 (紧贴烧杯 A 内壁)
        </text>
        <text x={12} y={30} fontSize={font(10)} fill={SCENE_COLORS.materials.metalBorder}>
          关活塞，上层液体由分液漏斗上口倒入烧杯 B (严禁混流)
        </text>
      </g>
    </g>
  )
}
