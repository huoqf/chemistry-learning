import {
  DistillationFlaskApparatus,
  CondenserApparatus,
  AdapterApparatus,
  ErlenmeyerFlaskApparatus,
  ThermometerApparatus,
  AlcoholLampApparatus,
  IronSupportApparatus,
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

  // 设计坐标基准
  const flaskX = 42
  const flaskY = 220
  const flaskW = 85
  const flaskH = 130

  const lampX = 50
  const lampY = 335

  const condenserX = 120
  const condenserY = 220

  const adapterX = 285
  const adapterY = 295

  const receiverX = 300
  const receiverY = 330

  // 暴沸时烧瓶摇晃震幅
  const bumpShake = isBumpWarning ? Math.sin(Date.now() * 0.04) * (2 + bumpIntensity * 4) : 0

  return (
    <g>
      {/* 1. 铁架台 1 (铁夹固定具支蒸馏烧瓶) */}
      <IronSupportApparatus
        x={5}
        y={170}
        width={110}
        height={280}
        hasClamp={true}
        clampPos={0.24}
        hasRing={true}
        ringPos={0.62}
        ringRadius={36}
      />

      {/* 2. 铁架台 2 (铁夹固定倾斜冷凝管) */}
      <IronSupportApparatus
        x={160}
        y={170}
        width={110}
        height={280}
        hasClamp={true}
        clampPos={0.30}
      />

      {/* 3. 酒精灯加热源 */}
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

        {/* 4b. 碎瓷片/沸石粒子 (烧瓶底部 2~3 粒) */}
        {hasZeolite ? (
          <g transform={`translate(${flaskX + flaskW * 0.42}, ${flaskY + flaskH * 0.85})`}>
            <polygon points="0,0 5,-3 8,2 2,6" fill={SCENE_COLORS.materials.ceramic} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={1} />
            <polygon points="10,-2 15,-5 17,2 11,4" fill={SCENE_COLORS.materials.ceramic} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={1} />
          </g>
        ) : (
          isBumpWarning && (
            /* 暴沸剧烈冲击爆裂气泡与浪花 */
            <g transform={`translate(${flaskX + 10}, ${flaskY + flaskH * 0.55})`}>
              <circle cx={15} cy={-5} r={7} fill="none" stroke={CHEMISTRY_COLORS.reactionRate} strokeWidth={1.8} strokeDasharray="3 1" />
              <circle cx={35} cy={-12} r={10} fill="none" stroke={CHEMISTRY_COLORS.reactionRate} strokeWidth={2} />
              <path d="M 5 10 Q 25 -20 45 10" fill="none" stroke={CHEMISTRY_COLORS.reactionRate} strokeWidth={2.5} />
              <text x={-5} y={-22} fontSize={font(10)} fill={CHEMISTRY_COLORS.reactionRate} fontWeight="bold">
                ⚠️ 未加沸石 暴沸剧烈冲出!
              </text>
            </g>
          )
        )}

        {/* 4c. 沸腾蒸气云雾粒子 */}
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
          x={flaskX + flaskW * 0.5 - 6}
          y={flaskY - 45}
          height={130}
          tempValue={currentTemp}
          font={font}
        />
        {/* 正确位置高亮指示光环 */}
        {thermometerOffsetY === 0 ? (
          <g transform={`translate(${flaskX + flaskW * 0.5 - 12}, ${flaskY + 28})`}>
            <rect x={0} y={0} width={24} height={16} fill="none" stroke={CHEMISTRY_COLORS.concentration} strokeWidth={1.8} strokeDasharray="3 2" rx={3} />
            <text x={28} y={12} fontSize={font(10)} fill={CHEMISTRY_COLORS.concentration} fontWeight="bold">
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

      {/* 6. 直形冷凝管组件 (倾斜角 20°) */}
      <g>
        <CondenserApparatus
          x={condenserX}
          y={condenserY}
          width={175}
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

      {/* 6b. 冷凝水进出方向与管内充满度说明 */}
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

      {/* 8. 接收瓶组件 (锥形瓶接收液体) */}
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
      <g transform={`translate(15, 455)`}>
        <rect
          x={0}
          y={0}
          width={390}
          height={30}
          rx={5}
          fill={withAlpha(CHEMISTRY_COLORS.temperature, 0.12)}
          stroke={CHEMISTRY_COLORS.temperature}
          strokeWidth={1}
        />
        <text x={12} y={20} fontSize={font(12)} fill={CHEMISTRY_COLORS.temperature} fontWeight="bold">
          {progressText}
        </text>
      </g>

      {/* 高考蒸馏原理与注意事项条幅 */}
      <g transform={`translate(15, 495)`}>
        <rect
          x={0}
          y={0}
          width={390}
          height={40}
          rx={6}
          fill={withAlpha(CANVAS_COLORS.grid, 0.75)}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={1.2}
        />
        <text x={12} y={18} fontSize={font(12)} fill={CHEMISTRY_COLORS.temperature} fontWeight="bold">
          蒸馏原理：利用沸点差异分离互溶液体 (烧瓶液量 1/3~2/3)
        </text>
        <text x={12} y={33} fontSize={font(11)} fill={SCENE_COLORS.materials.metalBorder}>
          测蒸气沸点置于支管口，碎瓷片防暴沸，冷凝水下进上出满水
        </text>
      </g>
    </g>
  )
}
