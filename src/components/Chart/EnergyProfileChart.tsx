import { BaseChart } from './BaseChart'
import { useChartContext } from './ChartContext'
import {
  CHEMISTRY_COLORS,
  STROKE,
  DASH,
  FONT,
} from '@/theme'

export interface EnergyProfileChartProps {
  /** 反应物能量 kJ/mol */
  reactantEnergy?: number
  /** 生成物能量 kJ/mol */
  productEnergy?: number
  /** 无催化剂活化能峰值 kJ/mol */
  activationEnergy?: number
  /** 有催化剂活化能峰值 kJ/mol (可选对比) */
  catalyzedEnergy?: number
  /** X 轴标签 */
  xLabel?: string
  /** Y 轴标签 */
  yLabel?: string
  /** 图表标题 */
  title?: string
  /** 固定尺寸 */
  fixedSize?: { width: number; height: number }
}

function EnergyContent({
  reactantEnergy = 100,
  productEnergy = 40,
  activationEnergy = 180,
  catalyzedEnergy = 130,
}: EnergyProfileChartProps) {
  const ctx = useChartContext()
  if (!ctx) return null
  const { toSvgX, toSvgY, font } = ctx

  const deltaH = productEnergy - reactantEnergy
  const isExothermic = deltaH < 0

  // 关键坐标点 (物理坐标)
  const xReact = 0.1
  const xTS = 0.5
  const xProd = 0.9

  // 1. 无催化剂贝塞尔曲线 Path
  const dPath = `
    M ${toSvgX(0)} ${toSvgY(reactantEnergy)}
    L ${toSvgX(xReact)} ${toSvgY(reactantEnergy)}
    C ${toSvgX(xReact + 0.15)} ${toSvgY(reactantEnergy)}, ${toSvgX(xTS - 0.15)} ${toSvgY(activationEnergy)}, ${toSvgX(xTS)} ${toSvgY(activationEnergy)}
    C ${toSvgX(xTS + 0.15)} ${toSvgY(activationEnergy)}, ${toSvgX(xProd - 0.15)} ${toSvgY(productEnergy)}, ${toSvgX(xProd)} ${toSvgY(productEnergy)}
    L ${toSvgX(1)} ${toSvgY(productEnergy)}
  `

  // 2. 有催化剂贝塞尔曲线 Path (虚线)
  const dCatPath = catalyzedEnergy
    ? `
    M ${toSvgX(xReact)} ${toSvgY(reactantEnergy)}
    C ${toSvgX(xReact + 0.15)} ${toSvgY(reactantEnergy)}, ${toSvgX(xTS - 0.15)} ${toSvgY(catalyzedEnergy)}, ${toSvgX(xTS)} ${toSvgY(catalyzedEnergy)}
    C ${toSvgX(xTS + 0.15)} ${toSvgY(catalyzedEnergy)}, ${toSvgX(xProd - 0.15)} ${toSvgY(productEnergy)}, ${toSvgX(xProd)} ${toSvgY(productEnergy)}
  `
    : ''

  return (
    <g>
      {/* 反应物/生成物水平能量基准虚线 */}
      <line
        x1={toSvgX(0)}
        y1={toSvgY(reactantEnergy)}
        x2={toSvgX(1)}
        y2={toSvgY(reactantEnergy)}
        stroke={CHEMISTRY_COLORS.enthalpy}
        strokeWidth={STROKE.reference}
        strokeDasharray={DASH.reference.join(' ')}
      />
      <line
        x1={toSvgX(xTS)}
        y1={toSvgY(productEnergy)}
        x2={toSvgX(1)}
        y2={toSvgY(productEnergy)}
        stroke={CHEMISTRY_COLORS.enthalpy}
        strokeWidth={STROKE.reference}
        strokeDasharray={DASH.reference.join(' ')}
      />

      {/* 有催化剂路径 (虚线) */}
      {dCatPath && (
        <path
          d={dCatPath}
          fill="none"
          stroke={CHEMISTRY_COLORS.activationEnergy}
          strokeWidth={STROKE.objectThin}
          strokeDasharray={DASH.tangent.join(' ')}
        />
      )}

      {/* 无催化剂主能量曲线 (实线) */}
      <path
        d={dPath}
        fill="none"
        stroke={isExothermic ? CHEMISTRY_COLORS.exothermic : CHEMISTRY_COLORS.endothermic}
        strokeWidth={STROKE.objectLine}
      />

      {/* 活化能 Ea1 双头箭头标注 */}
      <line
        x1={toSvgX(xTS)}
        y1={toSvgY(reactantEnergy)}
        x2={toSvgX(xTS)}
        y2={toSvgY(activationEnergy)}
        stroke={CHEMISTRY_COLORS.activationEnergy}
        strokeWidth={STROKE.objectThin}
      />
      <text
        x={toSvgX(xTS) - 8}
        y={toSvgY((reactantEnergy + activationEnergy) * 0.5)}
        textAnchor="end"
        fontSize={font(FONT.small)}
        fill={CHEMISTRY_COLORS.activationEnergy}
        fontWeight="bold"
      >
        {`Ea = ${activationEnergy - reactantEnergy} kJ/mol`}
      </text>

      {/* 反应热 △H 双头箭头标注 */}
      <line
        x1={toSvgX(0.85)}
        y1={toSvgY(reactantEnergy)}
        x2={toSvgX(0.85)}
        y2={toSvgY(productEnergy)}
        stroke={CHEMISTRY_COLORS.enthalpy}
        strokeWidth={STROKE.objectLine}
      />
      <text
        x={toSvgX(0.85) + 8}
        y={toSvgY((reactantEnergy + productEnergy) * 0.5)}
        textAnchor="start"
        fontSize={font(FONT.small)}
        fill={CHEMISTRY_COLORS.enthalpy}
        fontWeight="bold"
      >
        {`ΔH = ${deltaH > 0 ? '+' : ''}${deltaH} kJ/mol`}
      </text>

      {/* 节点文本 */}
      <text x={toSvgX(0.05)} y={toSvgY(reactantEnergy) - 8} fontSize={font(FONT.small)} fill={CHEMISTRY_COLORS.enthalpy} fontWeight="bold">反应物</text>
      <text x={toSvgX(xProd)} y={toSvgY(productEnergy) - 8} fontSize={font(FONT.small)} fill={CHEMISTRY_COLORS.enthalpy} fontWeight="bold">生成物</text>
      <text x={toSvgX(xTS)} y={toSvgY(activationEnergy) - 8} textAnchor="middle" fontSize={font(FONT.small)} fill={CHEMISTRY_COLORS.activationEnergy} fontWeight="bold">过渡态 TS</text>
    </g>
  )
}

/**
 * EnergyProfileChart — 反应历程与能量图组件（高考专有）
 *
 * 高考考点契合：
 * - 反应势能面与活化能峰 $E_a$
 * - 反应热 $\Delta H = E_{a1} - E_{a2}$ (吸热 $\Delta H > 0$ / 放热 $\Delta H < 0$)
 * - 催化剂降低活化能对比路径
 *
 * Token 规范：100% 遵从 `@/theme` 的 `CHEMISTRY_COLORS`
 */
export function EnergyProfileChart({
  reactantEnergy = 100,
  productEnergy = 40,
  activationEnergy = 180,
  catalyzedEnergy = 130,
  xLabel = '反应历程 (Reaction Coordinate)',
  yLabel = '能量 E / (kJ·mol⁻¹)',
  title = '反应历程与能量图',
  fixedSize,
}: EnergyProfileChartProps) {
  const maxE = Math.max(activationEnergy, reactantEnergy, productEnergy) + 20
  const minE = Math.min(0, reactantEnergy, productEnergy) - 10

  return (
    <BaseChart
      xDomain={[0, 1]}
      yDomain={[minE, maxE]}
      xLabel={xLabel}
      yLabel={yLabel}
      title={title}
      fixedSize={fixedSize}
      showGrid={true}
    >
      <EnergyContent
        reactantEnergy={reactantEnergy}
        productEnergy={productEnergy}
        activationEnergy={activationEnergy}
        catalyzedEnergy={catalyzedEnergy}
      />
    </BaseChart>
  )
}
