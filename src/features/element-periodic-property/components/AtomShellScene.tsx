import React from 'react'
import { CHEMISTRY_COLORS, CANVAS_COLORS, colors, withAlpha } from '@/theme'
import type { ElementInfo, StateType } from '../types'

interface AtomShellSceneProps {
  element: ElementInfo
  stateType: StateType
  font: (size: number) => number
}

export const AtomShellScene: React.FC<AtomShellSceneProps> = ({
  element,
  stateType,
  font,
}) => {
  const isExcited = stateType === 'excited'
  const layerNames = ['K(n=1)', 'L(n=2)', 'M(n=3)', 'N(n=4)']

  return (
    <g transform="translate(210, 325)">
      {/* 1. 外围能量背景发光圈 */}
      <circle r={185} fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.03)} />
      <circle r={145} fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.03)} />

      {/* 2. 原子核中心 */}
      <circle r={75} fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.08)} />
      <circle
        r={32}
        fill={withAlpha(CHEMISTRY_COLORS.pressure, 0.2)}
        stroke={CHEMISTRY_COLORS.pressure}
        strokeWidth={2.5}
      />
      <text
        x={0}
        y={-4}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={colors.neutral[800]}
        fontSize={font(13)}
        fontWeight="bold"
      >
        +{element.z}
      </text>
      <text
        x={0}
        y={12}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={colors.warning[600]}
        fontSize={font(11)}
        fontWeight="bold"
      >
        {element.symbol} ({element.name})
      </text>

      {/* 3. 各电子层同心轨道圆环 (K, L, M, N) */}
      {element.electronLayers.map((eCount, idx) => {
        const radius = 65 + idx * 38

        return (
          <g key={idx}>
            {/* 轨道圆环 */}
            <circle
              r={radius}
              fill="none"
              stroke={CANVAS_COLORS.axis}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            {/* 轨道名称与电子数标注 */}
            <text
              x={0}
              y={-radius - 4}
              textAnchor="middle"
              fill={colors.neutral[500]}
              fontSize={font(10)}
              fontWeight="bold"
            >
              {layerNames[idx]}: {eCount}e⁻
            </text>

            {/* 轨道上的电子分布颗粒 */}
            {Array.from({ length: eCount }).map((_, eIdx) => {
              const angle = (eIdx / eCount) * 2 * Math.PI - Math.PI / 2
              const ex = Math.cos(angle) * radius
              const ey = Math.sin(angle) * radius

              const isExcitedElectron = isExcited && idx === element.electronLayers.length - 1 && eIdx === eCount - 1

              return (
                <g key={eIdx}>
                  <circle
                    r={isExcitedElectron ? 8 : 6}
                    cx={ex}
                    cy={ey}
                    fill={isExcitedElectron ? CHEMISTRY_COLORS.temperature : CHEMISTRY_COLORS.concentration}
                    stroke={isExcitedElectron ? colors.danger[100] : colors.neutral.white}
                    strokeWidth={1.5}
                  />
                  <circle r={2} cx={ex} cy={ey} fill={colors.neutral.white} />

                  {/* 激发态跃迁波浪线光子 */}
                  {isExcitedElectron && (
                    <g transform={`translate(${ex}, ${ey})`}>
                      <circle r={12} fill="none" stroke={colors.danger[500]} strokeWidth={1} opacity={0.6} className="animate-ping" />
                      <text x={14} y={-10} fill={colors.danger[600]} fontSize={font(10)} fontWeight="bold">
                        ⚡ 跃迁光子 (hν)
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </g>
        )
      })}

      {/* 4. 底部周期、族与分区标注 */}
      <g transform="translate(0, 245)">
        <rect x={-110} y={-14} width={220} height={28} rx={14} fill={colors.neutral[100]} stroke={colors.neutral[300]} />
        <text
          x={0}
          y={2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={colors.neutral[700]}
          fontSize={font(11)}
          fontWeight="bold"
        >
          【第 {element.period} 周期 · {element.group} 族 · {element.block.toUpperCase()} 区】
        </text>
      </g>
    </g>
  )
}
