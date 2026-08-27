import {
  DistillationFlaskApparatus,
  CondenserApparatus,
  AdapterApparatus,
  ErlenmeyerFlaskApparatus,
  ThermometerApparatus,
  AlcoholLampApparatus,
  IronSupportApparatus,
  getDistillationFlaskPorts,
} from '@/components/Chemistry'
import { CHEMISTRY_COLORS, SCENE_COLORS, CANVAS_COLORS, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'
import type { SceneScale } from '@/scene'
import type { DistillationState } from '../hooks/useExtractionDistillationChemistry'

interface DistillationSceneProps {
  distillation: DistillationState
  font: FontScaler
  sceneScale: SceneScale
}

/**
 * DistillationScene — 高考蒸馏实验规范场景组件
 *
 * 重构说明：
 * - 全程基于 Anchor Ports 坐标锚点系统自动连吸对齐
 * - 精确满足高考考点：水银球对准支管口中央、冷凝水下进上出满水、碎瓷片防暴沸
 */
export function DistillationScene({ distillation, font }: DistillationSceneProps) {
  const {
    currentTemp,
    boilProgress,
    vaporDensity,
    distillateLevel,
    thermometerOffsetY,
    isWaterReversed,
    hasZeolite,
    isBumpWarning,
    bumpIntensity,
    progressText,
  } = distillation

  // 1. 具支蒸馏烧瓶基准设计坐标
  const flaskX = 40
  const flaskY = 210
  const flaskW = 85
  const flaskH = 130

  // 2. 基于 Anchor Ports 计算烧瓶关键锚点
  const flaskPorts = getDistillationFlaskPorts(flaskX, flaskY, flaskW, flaskH)

  // 3. 铁架台 1 (固定具支烧瓶与铁圈) 参数对齐
  const stand1X = 5
  const stand1Y = 140
  const stand1H = 340

  // 4. 冷凝管精准对接烧瓶支管口
  const condenserX = flaskPorts.sideArmPort.x
  const condenserY = flaskPorts.sideArmPort.y - 10
  const condenserW = 175

  // 5. 牛角管 (接液管) 吸附在冷凝管下口
  const adapterX = condenserX + 155
  const adapterY = condenserY + 68

  // 6. 接收瓶 (锥形瓶) 对齐牛角管下流出口
  const receiverX = adapterX + 15
  const receiverY = adapterY + 35

  // 7. 酒精灯加热源位置 (正对陶土网与烧瓶底部)
  const lampX = flaskPorts.bottomPort.x - 34
  const lampY = flaskPorts.bottomPort.y + 12

  // 陶土网（石棉网）坐标（位于铁圈上方，烧瓶底部贴紧陶土网）
  const meshX = flaskPorts.bottomPort.x - 42
  const meshY = flaskPorts.bottomPort.y + 1
  const meshW = 84
  const meshH = 8

  // 暴沸时烧瓶摇晃震幅
  const bumpShake = isBumpWarning ? Math.sin(Date.now() * 0.04) * (2 + bumpIntensity * 4) : 0

  return (
    <g>
      {/* 1. 铁架台 1 (铁夹夹持瓶颈，铁圈托举陶土网) */}
      <IronSupportApparatus
        x={stand1X}
        y={stand1Y}
        width={110}
        height={stand1H}
        hasClamp={true}
        clampPos={0.24}
        hasRing={true}
        ringPos={0.61}
        ringRadius={38}
      />

      {/* 1b. 陶土网 (石棉网 Asbestos Mesh) — 高中化学烧瓶加热必垫器材 */}
      <g transform={`translate(${meshX}, ${meshY})`}>
        {/* 金属网底座 */}
        <rect
          x={0}
          y={0}
          width={meshW}
          height={meshH}
          rx={2}
          fill={SCENE_COLORS.heatingAndSupport.asbestosMesh}
          stroke={SCENE_COLORS.materials.iron}
          strokeWidth={1}
        />
        {/* 中间圆形耐火陶土/石棉受热涂层 */}
        <ellipse
          cx={meshW * 0.5}
          cy={meshH * 0.5}
          rx={meshW * 0.38}
          ry={meshH * 0.42}
          fill={SCENE_COLORS.materials.asbestos}
          stroke={SCENE_COLORS.materials.metalBorder}
          strokeWidth={0.8}
        />
        {/* 金属丝网格纹理 */}
        <line x1={8} y1={2} x2={meshW - 8} y2={2} stroke={SCENE_COLORS.materials.iron} strokeWidth={0.6} strokeDasharray="2 2" />
        <line x1={8} y1={6} x2={meshW - 8} y2={6} stroke={SCENE_COLORS.materials.iron} strokeWidth={0.6} strokeDasharray="2 2" />
        <text x={meshW + 4} y={6} fontSize={font(9)} fill={SCENE_COLORS.materials.metalBorder}>
          陶土网(均匀受热)
        </text>
      </g>

      {/* 2. 铁架台 2 (铁夹固定倾斜冷凝管) */}
      <IronSupportApparatus
        x={condenserX + 35}
        y={stand1Y}
        width={110}
        height={stand1H}
        hasClamp={true}
        clampPos={0.36}
      />

      {/* 3. 酒精灯加热源 (外焰加热陶土网中心) */}
      <AlcoholLampApparatus x={lampX} y={lampY} width={68} height={68} lit={true} font={font} />

      {/* 4. 具支蒸馏烧瓶 (若暴沸则震抖) */}
      <g transform={bumpShake ? `translate(${bumpShake}, ${-Math.abs(bumpShake)})` : undefined}>
        <DistillationFlaskApparatus
          x={flaskX}
          y={flaskY}
          width={flaskW}
          height={flaskH}
          fillLevel={0.45}
          fillColor={withAlpha(SCENE_COLORS.reagent.acid, 0.7)}
          hasStopper={true}
          font={font}
        />

        {/* 4a. 烧瓶 1/3 与 2/3 安全装液量刻度标线 */}
        <g opacity={0.75}>
          {/* 2/3 容积最高防冲料线 */}
          <line
            x1={flaskX + 12}
            y1={flaskY + flaskH * 0.62}
            x2={flaskX + flaskW - 12}
            y2={flaskY + flaskH * 0.62}
            stroke={CHEMISTRY_COLORS.reactionRate}
            strokeWidth={1}
            strokeDasharray="2 2"
          />
          <text x={flaskX + flaskW + 4} y={flaskY + flaskH * 0.63} fontSize={font(9)} fill={CHEMISTRY_COLORS.reactionRate}>
            2/3最高线
          </text>

          {/* 1/3 容积最低防干烧线 */}
          <line
            x1={flaskX + 16}
            y1={flaskY + flaskH * 0.82}
            x2={flaskX + flaskW - 16}
            y2={flaskY + flaskH * 0.82}
            stroke={CHEMISTRY_COLORS.concentration}
            strokeWidth={1}
            strokeDasharray="2 2"
          />
          <text x={flaskX + flaskW + 4} y={flaskY + flaskH * 0.83} fontSize={font(9)} fill={CHEMISTRY_COLORS.concentration}>
            1/3最低线
          </text>
        </g>

        {/* 4b. 碎瓷片/沸石粒子 (烧瓶底部 2~3 粒) */}
        {hasZeolite ? (
          <g transform={`translate(${flaskX + flaskW * 0.42}, ${flaskY + flaskH * 0.86})`}>
            <polygon points="0,0 6,-3 9,2 3,6" fill={SCENE_COLORS.materials.ceramic} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={1} />
            <polygon points="11,-2 16,-5 18,2 12,4" fill={SCENE_COLORS.materials.ceramic} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={1} />
            {/* 平稳汽化微小气泡流 */}
            {boilProgress > 0 && (
              <g>
                <circle cx={4} cy={-8} r={1.5} fill="none" stroke={CHEMISTRY_COLORS.concentration} strokeWidth={1} />
                <circle cx={14} cy={-12} r={2} fill="none" stroke={CHEMISTRY_COLORS.concentration} strokeWidth={1} />
                <circle cx={8} cy={-20} r={2.5} fill="none" stroke={CHEMISTRY_COLORS.concentration} strokeWidth={1} />
              </g>
            )}
          </g>
        ) : (
          isBumpWarning && (
            /* 暴沸剧烈冲击爆裂气泡与警示 */
            <g transform={`translate(${flaskX + 10}, ${flaskY + flaskH * 0.55})`}>
              <circle cx={15} cy={-5} r={8} fill="none" stroke={CHEMISTRY_COLORS.reactionRate} strokeWidth={2} strokeDasharray="3 1" />
              <circle cx={35} cy={-12} r={12} fill="none" stroke={CHEMISTRY_COLORS.reactionRate} strokeWidth={2.5} />
              <path d="M 5 10 Q 25 -25 45 10" fill="none" stroke={CHEMISTRY_COLORS.reactionRate} strokeWidth={2.5} />
              <rect x={-20} y={-38} width={135} height={20} rx={4} fill={withAlpha(CHEMISTRY_COLORS.reactionRate, 0.9)} />
              <text x={-14} y={-24} fontSize={font(10)} fill="#FFFFFF" fontWeight="bold">
                ⚠️ 暴沸！须冷却后补加沸石
              </text>
            </g>
          )
        )}

        {/* 4c. 沸腾蒸气云雾 */}
        {boilProgress > 0 && (
          <g opacity={vaporDensity}>
            <path
              d={`M ${flaskX + 30} ${flaskY + 70} Q ${flaskX + 40} ${flaskY + 35} ${flaskX + 50} ${flaskY + 25}`}
              stroke={withAlpha(SCENE_COLORS.materials.glassBorder, 0.7)}
              strokeWidth={3.5}
              strokeDasharray="5 3"
              fill="none"
            />
          </g>
        )}
      </g>

      {/* 5. 实验温度计 (水银球高考核心对齐点：正对支管口中央) */}
      <g transform={`translate(0, ${thermometerOffsetY})`}>
        <ThermometerApparatus
          x={flaskPorts.topNeckPort.x - 6}
          y={flaskPorts.topNeckPort.y - 45}
          height={130}
          tempValue={currentTemp}
          font={font}
        />
        {/* 正确位置高亮指示框 */}
        {thermometerOffsetY === 0 ? (
          <g transform={`translate(${flaskPorts.sideArmPort.x - 42}, ${flaskPorts.sideArmPort.y - 10})`}>
            <rect x={0} y={0} width={26} height={16} fill="none" stroke={CHEMISTRY_COLORS.concentration} strokeWidth={1.8} strokeDasharray="3 2" rx={3} />
            <text x={30} y={12} fontSize={font(10)} fill={CHEMISTRY_COLORS.concentration} fontWeight="bold">
              水银球对准支管口(正)
            </text>
          </g>
        ) : (
          <g transform={`translate(${flaskX + flaskW * 0.5 + 10}, ${flaskY + 60})`}>
            <text x={0} y={0} fontSize={font(10)} fill={CHEMISTRY_COLORS.reactionRate} fontWeight="bold">
              ❌ 插入液面偏低 (错)
            </text>
          </g>
        )}
      </g>

      {/* 6. 直形冷凝管组件 (倾斜角 20°，紧贴支管口) */}
      <g>
        <CondenserApparatus
          x={condenserX}
          y={condenserY}
          width={condenserW}
          height={70}
          tiltAngle={20}
          condenserType="straight"
          hasWater={true}
          font={font}
        />

        {/* 上进下出时未充满水的半空区域覆盖 */}
        {isWaterReversed && (
          <rect
            x={condenserX + 30}
            y={condenserY + 8}
            width={110}
            height={20}
            fill={CANVAS_COLORS.grid}
            opacity={0.65}
            transform={`rotate(20, ${condenserX}, ${condenserY})`}
          />
        )}
      </g>

      {/* 6b. 冷凝水进出方向与逆流充满指示 */}
      <g transform={`translate(${condenserX + 130}, ${condenserY + 70})`}>
        <line
          x1={0}
          y1={isWaterReversed ? -35 : 12}
          x2={0}
          y2={isWaterReversed ? -10 : -12}
          stroke={isWaterReversed ? CHEMISTRY_COLORS.reactionRate : CHEMISTRY_COLORS.concentration}
          strokeWidth={2}
          strokeDasharray="2 2"
        />
        <text x={-20} y={28} fontSize={font(10)} fill={isWaterReversed ? CHEMISTRY_COLORS.reactionRate : CHEMISTRY_COLORS.concentration} fontWeight="bold">
          {isWaterReversed ? '❌ 逆向进水 (未满空腔错)' : '冷却水 (下进上出满水) 正'}
        </text>
      </g>

      {/* 7. 接引管组件 (牛角管套接冷凝管下口) */}
      <AdapterApparatus x={adapterX} y={adapterY} angle={45} font={font} />

      {/* 8. 接收瓶组件 (锥形瓶接收液体，敞口通大气) */}
      <ErlenmeyerFlaskApparatus
        x={receiverX}
        y={receiverY}
        width={70}
        height={85}
        fillLevel={distillateLevel}
        fillColor={withAlpha(CHEMISTRY_COLORS.concentration, 0.4)}
        font={font}
      />

      {/* 馏出液滴落粒子流 */}
      {distillateLevel > 0 && (
        <circle cx={receiverX + 22} cy={receiverY + 40} r={3} fill={CHEMISTRY_COLORS.concentration} opacity={0.9} />
      )}

      {/* 动态蒸馏流程与阶段提示条幅 */}
      <g transform={`translate(15, 12)`}>
        <rect
          x={0}
          y={0}
          width={390}
          height={28}
          rx={5}
          fill={withAlpha(CHEMISTRY_COLORS.temperature, 0.12)}
          stroke={CHEMISTRY_COLORS.temperature}
          strokeWidth={1}
        />
        <text x={12} y={19} fontSize={font(11)} fill={CHEMISTRY_COLORS.temperature} fontWeight="bold">
          {progressText}
        </text>
      </g>
    </g>
  )
}
