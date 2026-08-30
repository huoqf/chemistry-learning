import { SCENE_COLORS, STROKE, FONT, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'

export interface GasBuretteApparatusProps {
  /** 器材左上角 x */
  x: number
  /** 器材左上角 y */
  y: number
  /** 宽度 (默认 110) */
  width?: number
  /** 高度 (默认 220) */
  height?: number
  /** 量气管读数 (mL) */
  gasVolume?: number
  /** 左右水准面是否调平 (高考考点：读数前需调整水准瓶使液面相平) */
  isLevelMatched?: boolean
  /** 试剂液颜色 */
  liquidColor?: string
  /** 说明文字 */
  label?: string
  /** 字体缩放 */
  font?: FontScaler
}

/**
 * GasBuretteApparatus — 高考标准量气管与水准瓶组件
 *
 * 适用于：
 * - 量气法测定气体生成量（如 Mg/Zn 与酸反应测 H2）
 * - 包含带刻度直管、软管连通与右侧水准瓶
 * - 强调高考注意事项：“读数前需上下移动水准瓶使左右液面在同一水平线”
 * - 导出静态 `getGasBurettePorts`
 */
export function GasBuretteApparatus({
  x,
  y,
  width = 110,
  height = 220,
  gasVolume = 25.0,
  isLevelMatched = true,
  liquidColor = SCENE_COLORS.measurement.gasBuretteWater,
  label = '量气管装置',
  font = (n) => n,
}: GasBuretteApparatusProps) {
  const w = width
  const h = height

  // 1. 左侧量气管 (带刻度)
  const buretteX = 10
  const buretteW = 20
  const buretteH = h - 30

  // 2. 右侧水准瓶
  const bottleX = w - 35
  const bottleW = 26
  const bottleH = 50
  // 如果未调平，右侧水准瓶偏高或偏低
  const bottleY = isLevelMatched ? h * 0.4 : h * 0.25

  // 液面高度推算 (根据 gasVolume 0~50 mL)
  const liquidYLeft = buretteH * 0.2 + (gasVolume / 50) * (buretteH * 0.5)
  const liquidYRight = isLevelMatched ? liquidYLeft : liquidYLeft - 30

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 1. 左侧量气管玻璃外壳 */}
      <rect
        x={buretteX}
        y={0}
        width={buretteW}
        height={buretteH}
        rx={2}
        fill={withAlpha(SCENE_COLORS.materials.glass, 0.4)}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* 量气管刻度线 (0~50 mL) */}
      <g transform={`translate(${buretteX + 2}, 20)`}>
        {[0, 10, 20, 30, 40, 50].map((val, idx) => {
          const markY = idx * (buretteH * 0.1)
          return (
            <g key={val} transform={`translate(0, ${markY})`}>
              <line x1={0} y1={0} x2={6} y2={0} stroke={SCENE_COLORS.measurement.gasBuretteScale} strokeWidth={1} />
              <text x={9} y={3} fontSize={font(8)} fill={SCENE_COLORS.measurement.gasBuretteScale}>
                {val}
              </text>
            </g>
          )
        })}
      </g>

      {/* 量气管水柱 */}
      <rect
        x={buretteX + 1}
        y={liquidYLeft}
        width={buretteW - 2}
        height={buretteH - liquidYLeft}
        fill={liquidColor}
        opacity={0.85}
      />
      <ellipse
        cx={buretteX + buretteW * 0.5}
        cy={liquidYLeft}
        rx={buretteW * 0.45}
        ry={3}
        fill={liquidColor}
      />

      {/* 2. 底部连通橡胶软管 */}
      <path
        d={`
          M ${buretteX + buretteW * 0.5} ${buretteH}
          C ${buretteX + buretteW * 0.5} ${h + 10}, ${bottleX + bottleW * 0.5} ${h + 10}, ${bottleX + bottleW * 0.5} ${bottleY + bottleH}
        `}
        fill="none"
        stroke={SCENE_COLORS.stopper.hoseTube}
        strokeWidth={6}
      />

      {/* 3. 右侧水准瓶 */}
      <g transform={`translate(${bottleX}, ${bottleY})`}>
        <path
          d={`
            M 0 10
            L ${bottleW} 10
            L ${bottleW} ${bottleH - 10}
            Q ${bottleW} ${bottleH}, ${bottleW * 0.5} ${bottleH}
            Q 0 ${bottleH}, 0 ${bottleH - 10}
            Z
          `}
          fill={withAlpha(SCENE_COLORS.materials.glass, 0.4)}
          stroke={SCENE_COLORS.materials.glassBorder}
          strokeWidth={STROKE.objectLine}
        />
        {/* 水准瓶水柱 */}
        <rect
          x={1}
          y={liquidYRight - bottleY}
          width={bottleW - 2}
          height={bottleH - (liquidYRight - bottleY)}
          fill={liquidColor}
          opacity={0.85}
        />
      </g>

      {/* 4. 水准面对齐指示线 */}
      {isLevelMatched ? (
        <line
          x1={buretteX + buretteW}
          y1={liquidYLeft}
          x2={bottleX}
          y2={liquidYLeft}
          stroke={SCENE_COLORS.labels.chemicalFormula}
          strokeWidth={1.5}
          strokeDasharray="3 2"
        />
      ) : (
        <text
          x={w * 0.5}
          y={h - 15}
          textAnchor="middle"
          fontSize={font(9)}
          fill={CHEMISTRY_COLORS.reactionRate}
          fontWeight="bold"
        >
          ❌ 液面未调平 (需上下移动水准瓶)
        </text>
      )}

      {/* 标注提示 */}
      {label && (
        <text
          x={w * 0.5}
          y={h + 18}
          textAnchor="middle"
          fontSize={font(FONT.annotation)}
          fill={SCENE_COLORS.labels.chemicalFormula}
          fontWeight="bold"
        >
          {label} (V={gasVolume}mL)
        </text>
      )}
    </g>
  )
}
