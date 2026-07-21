import { SCENE_COLORS, CHEMISTRY_COLORS } from '@/theme'
import type { FontScaler } from '@/theme'

export interface DcPowerSupplyApparatusProps {
  /** 放置点 x 坐标 */
  x: number
  /** 放置点 y 坐标 */
  y: number
  /** 宽度，默认 140 */
  width?: number
  /** 高度，默认 65 */
  height?: number
  /** 输出电压 (V)，默认 2.0 */
  voltage?: number
  /** 输出电流 (A)，默认 1.5 */
  current?: number
  /** 是否工作状态，默认 true */
  isWorking?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * DcPowerSupplyApparatus — 直流电源器材组件
 *
 * 适用高考化学场景：
 * - 电解池（氯碱工业、粗铜精炼、电镀、熔融盐电解）
 * - 原电池与电解池串联组合
 *
 * 视觉特征：
 * - LCD 金属面板外观、工作指示灯、明显标识的正极 (+) 与负极 (-) 红色/蓝色接线柱
 * - 实时显示电流数值 I (A) 与电压 U (V)
 */
export function DcPowerSupplyApparatus({
  x,
  y,
  width = 140,
  height = 65,
  voltage = 2.0,
  current = 1.5,
  isWorking = true,
  font = (n) => n,
}: DcPowerSupplyApparatusProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 外壳主体 */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={8}
        fill={SCENE_COLORS.materials.iron}
        stroke={SCENE_COLORS.materials.metalBorder}
        strokeWidth={2}
      />

      {/* 顶部控制面板边框与暗区 */}
      <rect
        x={6}
        y={6}
        width={width - 12}
        height={22}
        rx={4}
        fill="#0F172A"
      />

      {/* 面板标题 */}
      <text
        x={width / 2}
        y={21}
        textAnchor="middle"
        fontSize={font(11)}
        fill="#F8FAFC"
        fontWeight="bold"
      >
        直流电源 (DC Power)
      </text>

      {/* 电源工作状态小指示灯 */}
      <circle
        cx={16}
        cy={17}
        r={3}
        fill={isWorking ? '#22C55E' : '#64748B'}
      />

      {/* 正极 (+) 红色端子 */}
      <g transform="translate(25, 45)">
        <circle cx={0} cy={0} r={11} fill={CHEMISTRY_COLORS.positivePole} />
        <text
          x={0}
          y={4}
          textAnchor="middle"
          fontSize={font(12)}
          fill="#FFFFFF"
          fontWeight="bold"
        >
          +
        </text>
        <text
          x={0}
          y={18}
          textAnchor="middle"
          fontSize={font(8)}
          fill={CHEMISTRY_COLORS.positivePole}
          fontWeight="bold"
        >
          正极
        </text>
      </g>

      {/* 中央实时电流与电压读数 LCD 风格显示屏 */}
      <g transform={`translate(${width / 2}, 45)`}>
        <rect
          x={-28}
          y={-12}
          width={56}
          height={22}
          rx={3}
          fill="#1E293B"
          stroke="#334155"
          strokeWidth={1}
        />
        <text
          x={0}
          y={3}
          textAnchor="middle"
          fontSize={font(10)}
          fill={CHEMISTRY_COLORS.current}
          fontWeight="bold"
          fontFamily="monospace"
        >
          {isWorking ? `${current.toFixed(1)}A ${voltage.toFixed(1)}V` : '0.0A 0.0V'}
        </text>
      </g>

      {/* 负极 (-) 蓝色端子 */}
      <g transform={`translate(${width - 25}, 45)`}>
        <circle cx={0} cy={0} r={11} fill={CHEMISTRY_COLORS.negativePole} />
        <text
          x={0}
          y={4}
          textAnchor="middle"
          fontSize={font(12)}
          fill="#FFFFFF"
          fontWeight="bold"
        >
          -
        </text>
        <text
          x={0}
          y={18}
          textAnchor="middle"
          fontSize={font(8)}
          fill={CHEMISTRY_COLORS.negativePole}
          fontWeight="bold"
        >
          负极
        </text>
      </g>
    </g>
  )
}
