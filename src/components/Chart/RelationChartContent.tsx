import { useMemo } from 'react'
import { useChartContext } from './ChartContext'
import { interpolateY } from './interpolation'
import {
  CHEMISTRY_COLORS,
  CANVAS_COLORS,
  CHART_COLORS,
  SERIES_MAP,
  REFERENCE_MAP,
  STROKE,
  DASH,
  FONT,
} from '@/theme'
import type { ChartSeriesVariant, ChartReferenceVariant } from '@/theme'
import type { RelationDataSeries, RelationMarker } from './RelationChart'

interface RCContentProps {
  points: { x: number; y: number }[]
  additionalSeries?: RelationDataSeries[]
  cursorX?: number
  cursorLabel?: (x: number, y: number) => string | null
  cursorVariant?: ChartReferenceVariant
  markers?: RelationMarker[]
  series?: ChartSeriesVariant
  color?: string
  strokeWidth?: number
  mainLabel?: string
  underlay?: React.ReactNode
  children?: React.ReactNode
}

function buildPath(
  pts: { x: number; y: number }[],
  toSvgX: (v: number) => number,
  toSvgY: (v: number) => number,
): string {
  if (pts.length < 2) return ''
  return (
    'M ' +
    pts
      .map((p) => `${toSvgX(p.x).toFixed(2)},${toSvgY(p.y).toFixed(2)}`)
      .join(' L ')
  )
}

export function RelationChartContent({
  points,
  additionalSeries,
  cursorX,
  cursorLabel,
  cursorVariant,
  markers,
  series,
  color,
  strokeWidth,
  mainLabel,
  underlay,
  children,
}: RCContentProps) {
  const ctx = useChartContext()
  const mainColor = color ?? SERIES_MAP[series ?? 'primary']

  const mainPath = useMemo(() => {
    if (!ctx) return ''
    return buildPath(points, ctx.toSvgX, ctx.toSvgY)
  }, [ctx, points])

  const extraPaths = useMemo(() => {
    if (!ctx || !additionalSeries?.length) return []
    return additionalSeries.map((s) => ({
      d: buildPath(s.points, ctx.toSvgX, ctx.toSvgY),
      color: s.color ?? (s.series ? SERIES_MAP[s.series] : CHEMISTRY_COLORS.displacement),
      strokeWidth: s.strokeWidth ?? 2,
      strokeDasharray: s.strokeDasharray,
      label: s.label,
    }))
  }, [ctx, additionalSeries])

  // 游标：对主曲线 + 额外曲线分别插值
  const cursorPoints = useMemo(() => {
    if (cursorX == null) return []
    const out: Array<{ x: number; y: number; color: string; label?: string }> = []
    const yMain = interpolateY(points, cursorX)
    if (yMain != null) out.push({ x: cursorX, y: yMain, color: mainColor })
    additionalSeries?.forEach((s) => {
      const y = interpolateY(s.points, cursorX)
      if (y != null) {
        out.push({
          x: cursorX,
          y,
          color: s.color ?? (s.series ? SERIES_MAP[s.series] : CHEMISTRY_COLORS.displacement),
          label: s.label,
        })
      }
    })
    return out
  }, [cursorX, points, additionalSeries, mainColor])

  if (!ctx) return null
  const { toSvgX, toSvgY, plotOrigin, plotSize, font } = ctx
  const cursorColor = REFERENCE_MAP[cursorVariant ?? 'highlight']

  return (
    <g>
      {/* 插件底层（面积/背景增强） */}
      {underlay}

      {/* 额外曲线（先画，主曲线压在上面） */}
      {extraPaths.map((p, i) =>
        p.d ? (
          <path
            key={`extra-${i}`}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth={p.strokeWidth}
            strokeDasharray={p.strokeDasharray?.join(' ')}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null,
      )}

      {/* 主曲线 */}
      {mainPath && (
        <path
          d={mainPath}
          fill="none"
          stroke={mainColor}
          strokeWidth={strokeWidth ?? 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* 标记点 / 参考线（底层参考） */}
      {markers?.map((m, i) => {
        const mColor = m.color ?? CHART_COLORS.equilibrium
        // 推断 axis：未指定时按 x/y 齐全度判断
        const axis: 'vertical' | 'horizontal' | 'point' =
          m.axis ?? (m.x != null && m.y != null ? 'point' : m.x != null ? 'vertical' : 'horizontal')

        if (axis === 'vertical' && m.x != null) {
          const mx = toSvgX(m.x)
          return (
            <g key={`marker-${i}`}>
              <line
                x1={mx} y1={plotOrigin.y}
                x2={mx} y2={plotOrigin.y + plotSize.height}
                stroke={mColor}
                strokeWidth={STROKE.reference}
                strokeDasharray={DASH.reference.join(' ')}
                opacity={0.6}
              />
              {/* X 轴外短刻度 */}
              <line
                x1={mx} y1={plotOrigin.y + plotSize.height}
                x2={mx} y2={plotOrigin.y + plotSize.height + 6}
                stroke={mColor} strokeWidth={STROKE.tick}
              />
              {m.label && (
                <text
                  x={mx}
                  y={plotOrigin.y + plotSize.height + font(FONT.small) + 6}
                  fontSize={font(FONT.small)}
                  fill={mColor}
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {m.label}
                </text>
              )}
            </g>
          )
        }

        if (axis === 'horizontal' && m.y != null) {
          const my = toSvgY(m.y)
          return (
            <g key={`marker-${i}`}>
              <line
                x1={plotOrigin.x} y1={my}
                x2={plotOrigin.x + plotSize.width} y2={my}
                stroke={mColor}
                strokeWidth={STROKE.reference}
                strokeDasharray={DASH.reference.join(' ')}
                opacity={0.6}
              />
              {m.label && (
                <text
                  x={plotOrigin.x + plotSize.width - 4}
                  y={my - 4}
                  fontSize={font(FONT.small)}
                  fill={mColor}
                  textAnchor="end"
                  fontWeight="bold"
                >
                  {m.label}
                </text>
              )}
            </g>
          )
        }

        // axis === 'point'：必须同时有 x 和 y
        if (axis === 'point' && m.x != null && m.y != null) {
          const mx = toSvgX(m.x)
          const my = toSvgY(m.y)
          return (
            <g key={`marker-${i}`}>
              <circle
                cx={mx} cy={my} r={3.5}
                fill={mColor} stroke={CHART_COLORS.highlight} strokeWidth={1.2}
              />
              {m.label && (
                <text
                  x={mx + 6}
                  y={my - 6}
                  fontSize={font(FONT.small)}
                  fill={mColor}
                  textAnchor="start"
                  fontWeight="bold"
                >
                  {m.label}
                </text>
              )}
            </g>
          )
        }

        return null
      })}

      {/* 游标辅助线（垂直 + 水平虚线，画在主曲线下方） */}
      {cursorX != null && cursorPoints.length > 0 && (
        <g>
          {/* 垂直参考线 */}
          <line
            x1={toSvgX(cursorX)} y1={plotOrigin.y}
            x2={toSvgX(cursorX)} y2={plotOrigin.y + plotSize.height}
            stroke={cursorColor}
            strokeWidth={STROKE.chartRef}
            strokeDasharray={DASH.tangent.join(' ')}
            opacity={0.65}
          />
          {/* 水平参考线（只对第一个点画） */}
          {cursorPoints[0] && (
            <line
              x1={plotOrigin.x} y1={toSvgY(cursorPoints[0].y)}
              x2={plotOrigin.x + plotSize.width} y2={toSvgY(cursorPoints[0].y)}
              stroke={cursorColor}
              strokeWidth={STROKE.chartRef}
              strokeDasharray={DASH.tangent.join(' ')}
              opacity={0.4}
            />
          )}
        </g>
      )}

      {/* 主曲线（画在辅助线上方，确保实线不被遮盖） */}
      {mainPath && (
        <path
          d={mainPath}
          fill="none"
          stroke={mainColor}
          strokeWidth={strokeWidth ?? 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* 游标圆点 + 数值标签（画在主曲线上方） */}
      {cursorX != null && cursorPoints.length > 0 && (
        <g>
          {cursorPoints.map((cp, i) => {
            const cy = toSvgY(cp.y)
            return (
              <g key={`cursor-pt-${i}`}>
                <circle
                  cx={toSvgX(cursorX)} cy={cy} r={font(FONT.small) * 0.45}
                  fill={cp.color} stroke={CHART_COLORS.highlight} strokeWidth={1.5}
                />
                {cursorLabel && (() => {
                  const txt = cursorLabel(cp.x, cp.y)
                  if (txt == null) return null
                  return (
                    <text
                      x={toSvgX(cursorX) + font(FONT.small) * 0.6}
                      y={cy - font(FONT.small) * 0.4}
                      fontSize={font(FONT.small)}
                      fill={cp.color}
                      fontWeight="bold"
                    >
                      {txt}
                    </text>
                  )
                })()}
              </g>
            )
          })}
        </g>
      )}

      {/* 图例（多系列时显示） */}
      {additionalSeries && additionalSeries.length > 0 && (
        <g>
          {/* 主系列 */}
          <line
            x1={plotOrigin.x + plotSize.width - 130} y1={plotOrigin.y + 10}
            x2={plotOrigin.x + plotSize.width - 115} y2={plotOrigin.y + 10}
            stroke={mainColor} strokeWidth={2}
          />
          <text
            x={plotOrigin.x + plotSize.width - 110} y={plotOrigin.y + 13}
            fontSize={font(FONT.small)} fill={CANVAS_COLORS.labelText}
          >
            {mainLabel ?? ((series ?? 'primary') === 'primary' ? '主' : '')}
          </text>
          {/* 额外系列 */}
          {additionalSeries.map((s, i) => {
            const c = s.color ?? (s.series ? SERIES_MAP[s.series] : CHEMISTRY_COLORS.displacement)
            const baseY = plotOrigin.y + 10 + (i + 1) * 14
            return (
              <g key={`legend-${i}`}>
                <line
                  x1={plotOrigin.x + plotSize.width - 130} y1={baseY}
                  x2={plotOrigin.x + plotSize.width - 115} y2={baseY}
                  stroke={c} strokeWidth={s.strokeWidth ?? 2}
                  strokeDasharray={s.strokeDasharray?.join(' ')}
                />
                <text
                  x={plotOrigin.x + plotSize.width - 110} y={baseY + 3}
                  fontSize={font(FONT.small)} fill={CANVAS_COLORS.labelText}
                >
                  {s.label ?? `${i + 2}`}
                </text>
              </g>
            )
          })}
        </g>
      )}

      {/* 插件顶层（微元切割、教学注释等） */}
      {children}
    </g>
  )
}
