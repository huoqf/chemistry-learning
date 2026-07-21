import { worldToDesign, type SceneScale } from '@/scene'
import {
  GasJarApparatus,
  ThermometerApparatus,
  VectorArrow,
} from '@/components/Chemistry'
import {
  CHEMISTRY_COLORS,
  CANVAS_COLORS,
  PHENOMENON_COLORS,
  withAlpha,
} from '@/theme'
import type { LeChatelierChemistryResult } from '../hooks/useLeChatelierChemistry'

interface LeChatelierSceneProps {
  chemistry: LeChatelierChemistryResult
  temp: number
  time?: number
  canvasSize: { font: (size: number) => number }
  sceneScale: SceneScale
}

// 集气瓶内分子粒子基准分布点
const PARTICLE_BASES = [
  { bx: -18, by: -20, phase: 0.2 },
  { bx: 15, by: -22, phase: 1.1 },
  { bx: -8, by: -10, phase: 2.3 },
  { bx: 12, by: -5, phase: 0.7 },
  { bx: -20, by: 5, phase: 1.8 },
  { bx: 2, by: 12, phase: 2.9 },
  { bx: 18, by: 18, phase: 0.4 },
  { bx: -12, by: 25, phase: 1.5 },
  { bx: 8, by: 32, phase: 2.1 },
  { bx: -16, by: -30, phase: 0.9 },
  { bx: 5, by: -28, phase: 1.6 },
  { bx: -2, by: -36, phase: 2.5 },
]

export function LeChatelierScene({
  chemistry,
  temp,
  time = 0,
  canvasSize,
  sceneScale,
}: LeChatelierSceneProps) {
  const { font } = canvasSize

  // 1. 器材物理坐标 ➔ 设计坐标 (返回 { px, py })
  const jarPos = worldToDesign(0, -0.5, sceneScale)
  const thermometerPos = worldToDesign(-3.2, -0.5, sceneScale)

  // 2. 气体填充色 (由 NO2 红棕色浓度 intensity 驱动)
  const no2Color = withAlpha(PHENOMENON_COLORS.no2Gas, chemistry.colorIntensity * 0.85 + 0.15)

  // 3. 平衡移动矢量方向 (VectorType = 'equilibriumShift')
  const isShiftActive = chemistry.shiftDirection !== 'balanced'
  const shiftVector =
    chemistry.shiftDirection === 'forward' ? { x: 40, y: 0 } : { x: -40, y: 0 }
  const arrowLabel =
    chemistry.shiftDirection === 'forward'
      ? '正向移动 (放热/分子数减)'
      : '逆向移动 (吸热/分子数增)'

  // 4. 分子热运动速率（温度越高运动越快）
  const thermalSpeed = 1.8 + (temp - 273) * 0.035

  // 5. 根据 NO2 占比决定粒子类型
  const no2Ratio = Math.max(0.2, Math.min(0.85, chemistry.colorIntensity))

  return (
    <g className="le-chatelier-scene">
      {/* 1. 物理网格背景辅助线 */}
      <line
        x1={jarPos.px - 140}
        y1={jarPos.py + 100}
        x2={jarPos.px + 140}
        y2={jarPos.py + 100}
        stroke={CANVAS_COLORS.grid}
        strokeWidth={1.5}
        strokeDasharray="4 4"
      />

      {/* 2. 温度计组件 (展示系统温度) */}
      <ThermometerApparatus
        x={thermometerPos.px}
        y={thermometerPos.py - 90}
        tempValue={temp - 273.15}
        maxTemp={150}
        font={font}
      />

      {/* 3. 集气瓶反应容器组件 */}
      <GasJarApparatus
        x={jarPos.px - 35}
        y={jarPos.py - 55}
        width={70}
        height={110}
        fillLevel={0.9}
        fillColor={no2Color}
        gasLabel="2NO₂ ⇌ N₂O₄"
        font={font}
      />

      {/* 4. 微观气体分子热运动粒子群 (随 time 漂移与碰撞) */}
      <g className="gas-particles">
        {PARTICLE_BASES.map((pt, idx) => {
          const isNO2 = (idx / PARTICLE_BASES.length) <= no2Ratio
          const dx = Math.sin(time * thermalSpeed + pt.phase * 3) * 5.5
          const dy = Math.cos(time * thermalSpeed * 1.3 + pt.phase * 2) * 5.5
          const px = jarPos.px + pt.bx + dx
          const py = jarPos.py + pt.by + dy

          if (isNO2) {
            // NO2 单分子 (红棕色带高亮)
            return (
              <circle
                key={`particle-${idx}`}
                cx={px}
                cy={py}
                r={3.5}
                fill={PHENOMENON_COLORS.no2Gas}
                stroke={withAlpha('#FFFFFF', 0.6)}
                strokeWidth={0.8}
              />
            )
          }

          // N2O4 双分子聚体 (无色/浅蓝紫)
          return (
            <g key={`particle-${idx}`}>
              <circle
                cx={px - 2}
                cy={py}
                r={2.6}
                fill={withAlpha('#93C5FD', 0.75)}
                stroke={withAlpha('#FFFFFF', 0.5)}
                strokeWidth={0.6}
              />
              <circle
                cx={px + 2}
                cy={py}
                r={2.6}
                fill={withAlpha('#A78BFA', 0.75)}
                stroke={withAlpha('#FFFFFF', 0.5)}
                strokeWidth={0.6}
              />
            </g>
          )
        })}
      </g>

      {/* 5. 平衡移动矢量指示 */}
      {isShiftActive && time < 4.5 ? (
        <g style={{ opacity: 0.8 + Math.sin(time * 6) * 0.2 }}>
          <VectorArrow
            originDesign={{ x: jarPos.px, y: jarPos.py - 75 }}
            vector={shiftVector}
            type="equilibriumShift"
            sceneScale={sceneScale}
            label={arrowLabel}
            font={font}
          />
        </g>
      ) : (
        /* 达平衡微徽章（处于平衡态时在主屏展示） */
        <g transform={`translate(${jarPos.px}, ${jarPos.py - 75})`}>
          <rect
            x={-85}
            y={-12}
            width={170}
            height={24}
            rx={12}
            fill={withAlpha(CHEMISTRY_COLORS.equilibrium, 0.15)}
            stroke={CHEMISTRY_COLORS.equilibrium}
            strokeWidth={1}
          />
          <text
            x={0}
            y={4}
            fontSize={font(11)}
            fill={CHEMISTRY_COLORS.equilibrium}
            textAnchor="middle"
            fontWeight="bold"
          >
            ✓ 已达新化学平衡 (v_正 = v_逆)
          </text>
        </g>
      )}

      {/* 6. 化学量标注（主屏仅标注数值，遵守 0B 铁律） */}
      <g transform={`translate(${jarPos.px}, ${jarPos.py + 115})`}>
        <rect
          x={-90}
          y={-14}
          width={180}
          height={28}
          rx={6}
          fill={withAlpha(CANVAS_COLORS.white, 0.9)}
          stroke={CANVAS_COLORS.axis}
          strokeWidth={1}
        />
        <text
          x={0}
          y={4}
          fontSize={font(12)}
          fill={CHEMISTRY_COLORS.concentration}
          textAnchor="middle"
          fontWeight="bold"
        >
          {`c(NO₂) = ${chemistry.cNO2.toFixed(2)} mol/L`}
        </text>
      </g>
    </g>
  )
}
