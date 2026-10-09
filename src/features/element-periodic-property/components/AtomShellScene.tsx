import React from 'react'
import { CHEMISTRY_COLORS, CANVAS_COLORS, colors, withAlpha } from '@/theme'
import type { ElementInfo, StateType } from '../types'

interface AtomShellSceneProps {
  element: ElementInfo
  stateType: StateType
  /**
   * 激发态跃迁电子所在的电子层主量子数 n（由 useElementPeriodicChemistry 计算，与轨道方框图同源）。
   * 传入后壳层图高亮该层，保证与方框图的跃迁层完全一致；缺省时退回"最外层"。
   */
  excitationShell?: number | null
  font: (size: number) => number
}

export const AtomShellScene: React.FC<AtomShellSceneProps> = ({
  element,
  stateType,
  excitationShell,
  font,
}) => {
  const isExcited = stateType === 'excited'
  const layerNames = ['K(n=1)', 'L(n=2)', 'M(n=3)', 'N(n=4)']

  // 与轨道方框图共用同一跃迁定义：优先使用 hook 给出的跃迁层 n（→ 层索引 n-1），
  // 缺省退回最外层。这样"壳层图高亮一层、方框图从另一层移除"的模型打架在结构上不可能再出现。
  const excitedLayerIdx =
    typeof excitationShell === 'number' && excitationShell > 0
      ? Math.min(excitationShell - 1, element.electronLayers.length - 1)
      : element.electronLayers.length - 1

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

              const isExcitedElectron = isExcited && idx === excitedLayerIdx && eIdx === eCount - 1

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

                  {/* 激发态跃迁电子标记（不再使用"跃迁光子 hν"——光子发射属退激/发光，与"吸收能量被激发"语义相反） */}
                  {isExcitedElectron && (
                    <g transform={`translate(${ex}, ${ey})`}>
                      <circle r={12} fill="none" stroke={colors.danger[500]} strokeWidth={1} opacity={0.6} className="animate-ping" />
                      <text x={14} y={-10} fill={colors.danger[600]} fontSize={font(10)} fontWeight="bold">
                        ⚡ 受激价电子
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </g>
        )
      })}

      {/* 4. 激发态语义说明：明确"吸收能量被激发"（≠ 发光），并指向方框图中的准确跃迁轨道 */}
      {isExcited && (
        <g transform="translate(0, 215)">
          <text
            x={0}
            y={0}
            textAnchor="middle"
            fill={colors.danger[600]}
            fontSize={font(10)}
            fontWeight="bold"
          >
            ⚡ 激发态：最外层价电子吸收能量跃迁到同层空轨道（详见右侧轨道方框图）
          </text>
        </g>
      )}

      {/* 5. 底部周期、族与分区标注 */}
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
