import { SCENE_COLORS, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface BalanceApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 天平类型：'pan' 托盘天平 (左右盘+游码) | 'digital' 电子天平 */
  variant?: 'pan' | 'digital'
  /** 当前称量质量/读数 (g) */
  weight?: number
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * BalanceApparatus — 托盘天平 / 电子天平组件
 *
 * 适用高中化学场景：
 * - 溶液配制称量 NaOH/NaCl 固体 (托盘天平精确到 0.1g，高考重点：左物右码、烧杯称量腐蚀性药品)
 *
 * 颜色：`SCENE_COLORS.titrationAndMeasurement.balance`
 */
export function BalanceApparatus({
  x,
  y,
  variant = 'pan',
  weight = 5.8,
  font = (n) => n,
}: BalanceApparatusProps) {
  const isDigital = variant === 'digital'

  return (
    <g transform={`translate(${x}, ${y})`} id="balance-apparatus">
      {isDigital ? (
        /* 1. 高精度电子天平 (Digital Precision Balance) */
        <g id="digital-balance">
          {/* 天平不锈钢秤盘 (含金属微光) */}
          <rect
            x={12}
            y={6}
            width={76}
            height={8}
            rx={2}
            fill={SCENE_COLORS.materials.metal}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={STROKE.reference}
          />
          <line
            x1={14}
            y1={7}
            x2={86}
            y2={7}
            stroke={SCENE_COLORS.materials.metalSheen}
            strokeWidth={1}
          />

          {/* 天平机身 */}
          <rect
            x={0}
            y={14}
            width={100}
            height={52}
            rx={5}
            fill={SCENE_COLORS.titrationAndMeasurement.balance}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={STROKE.objectLine}
          />
          {/* 侧面高光倒角 */}
          <path
            d="M 2 18 L 8 18 L 8 62 L 2 62 Z"
            fill={SCENE_COLORS.materials.metalSheen}
            opacity={0.3}
          />

          {/* 高对比暗色液晶显示屏 */}
          <rect
            x={16}
            y={24}
            width={68}
            height={24}
            rx={3}
            fill={SCENE_COLORS.materials.rubber}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={1}
          />
          {/* 液晶绿色/荧光读数 */}
          <text
            x={50}
            y={41}
            textAnchor="middle"
            fontSize={font(FONT.small)}
            fill="#34D399"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            {`${weight.toFixed(2)} g`}
          </text>

          {/* 校准与去皮 Tare / Cal 实体按键 */}
          <circle cx={24} cy={56} r={3} fill={SCENE_COLORS.materials.metalBorder} />
          <circle cx={76} cy={56} r={3} fill="#EF4444" />
          <text x={76} y={58} textAnchor="middle" fontSize={font(6)} fill="white" fontWeight="bold">T</text>
        </g>
      ) : (
        /* 2. 高考标准托盘天平 (Double-Pan Mechanical Balance) */
        <g id="mechanical-pan-balance">
          {/* 底座机身 (Base with leveling feet) */}
          <path
            d="M 6 50 L 94 50 L 98 64 L 2 64 Z"
            fill={SCENE_COLORS.titrationAndMeasurement.balance}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={STROKE.objectLine}
          />
          {/* 底座左右调平底脚 */}
          <rect x={4} y={64} width={8} height={3} rx={1} fill={SCENE_COLORS.materials.iron} />
          <rect x={88} y={64} width={8} height={3} rx={1} fill={SCENE_COLORS.materials.iron} />

          {/* 游码标尺 (Beam Scale 0~5g) 与游码 (Rider) */}
          <rect
            x={16}
            y={52}
            width={68}
            height={8}
            rx={1}
            fill={SCENE_COLORS.materials.metalSheen}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={STROKE.reference}
          />
          {/* 标尺刻度线 */}
          {[0, 1, 2, 3, 4, 5].map((val, idx) => (
            <line
              key={val}
              x1={18 + idx * 12.8}
              y1={52}
              x2={18 + idx * 12.8}
              y2={56}
              stroke={SCENE_COLORS.materials.metalBorder}
              strokeWidth={idx % 2 === 0 ? 1 : 0.6}
            />
          ))}
          {/* 游码 (Rider) */}
          <rect
            x={28}
            y={50}
            width={5}
            height={11}
            rx={1}
            fill="#EF4444"
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={0.8}
          />

          {/* 中央支撑立柱 */}
          <rect
            x={47}
            y={12}
            width={6}
            height={38}
            fill={SCENE_COLORS.materials.iron}
            stroke={SCENE_COLORS.materials.metalBorder}
            strokeWidth={STROKE.reference}
          />

          {/* 中央分度盘 (Graduated Scale) 与指针 (Pointer) */}
          <g id="pointer-scale" transform="translate(50, 42)">
            {/* 分度盘圆弧刻度面 */}
            <path
              d="M -12 0 A 12 12 0 0 1 12 0 Z"
              fill={SCENE_COLORS.materials.metalSheen}
              stroke={SCENE_COLORS.materials.metalBorder}
              strokeWidth={STROKE.reference}
            />
            {/* 0 刻度中央红线 */}
            <line x1={0} y1={-1} x2={0} y2={-11} stroke="#EF4444" strokeWidth={1} />
            <line x1={-6} y1={-2} x2={-6} y2={-8} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={0.8} />
            <line x1={6} y1={-2} x2={6} y2={-8} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={0.8} />
            {/* 竖直下垂指针 (从横梁中心延伸向下指零) */}
            <line
              x1={0}
              y1={-30}
              x2={0}
              y2={-2}
              stroke="#B91C1C"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </g>

          {/* 横梁 (Balance Beam) */}
          <line
            x1={14}
            y1={12}
            x2={86}
            y2={12}
            stroke={SCENE_COLORS.materials.iron}
            strokeWidth={STROKE.objectLine + 0.5}
          />
          {/* 左右平衡螺母 (Balance Nuts) */}
          <rect x={11} y={10} width={4} height={4} rx={1} fill={SCENE_COLORS.materials.metalSheen} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={0.5} />
          <rect x={85} y={10} width={4} height={4} rx={1} fill={SCENE_COLORS.materials.metalSheen} stroke={SCENE_COLORS.materials.metalBorder} strokeWidth={0.5} />

          {/* 左托盘与吊架 (左物) */}
          <g id="left-pan">
            {/* 托盘吊杆 */}
            <path
              d="M 18 13 L 18 26 L 10 32 M 18 26 L 26 32"
              fill="none"
              stroke={SCENE_COLORS.materials.iron}
              strokeWidth={STROKE.reference}
            />
            {/* 托盘 */}
            <ellipse
              cx={18}
              cy={32}
              rx={15}
              ry={4.5}
              fill={SCENE_COLORS.materials.metal}
              stroke={SCENE_COLORS.materials.metalBorder}
              strokeWidth={STROKE.reference}
            />
          </g>

          {/* 右托盘与吊架 (右码) */}
          <g id="right-pan">
            {/* 托盘吊杆 */}
            <path
              d="M 82 13 L 82 26 L 74 32 M 82 26 L 90 32"
              fill="none"
              stroke={SCENE_COLORS.materials.iron}
              strokeWidth={STROKE.reference}
            />
            {/* 托盘 */}
            <ellipse
              cx={82}
              cy={32}
              rx={15}
              ry={4.5}
              fill={SCENE_COLORS.materials.metal}
              stroke={SCENE_COLORS.materials.metalBorder}
              strokeWidth={STROKE.reference}
            />
          </g>

          {/* 质量读数标注 */}
          <text
            x={50}
            y={34}
            textAnchor="middle"
            fontSize={font(FONT.annotation)}
            fill={SCENE_COLORS.labels.chemicalFormula}
            fontWeight="bold"
          >
            {`${weight.toFixed(1)} g`}
          </text>
        </g>
      )}
    </g>
  )
}
