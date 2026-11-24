import React, { useState } from 'react'
import { CHEMISTRY_COLORS, CANVAS_COLORS, colors, withAlpha } from '@/theme'
import { useAnimationFrame } from '@/utils/animation'
import type { ElementInfo, StateType } from '../types'

interface AtomShellSceneProps {
  element: ElementInfo
  stateType: StateType
  /**
   * 激发态跃迁电子所在的电子层主量子数 n（由 useElementPeriodicChemistry 计算，与轨道方框图同源）。
   * 传入后壳层图高亮该层，保证与方框图的跃迁层完全一致；缺省时退回"最外层"。
   */
  excitationShell?: number | null
  /** 激发后电子实际到达的壳层主量子数 n（跨层跃迁如 2p→3s 时高于激发源层） */
  excitationTargetShell?: number | null
  /** 具体跃迁路径标签（如 "2s→2p"） */
  excitationTransitionLabel?: string | null
  /** 与轨道方框图同源实时汇总的各层电子数 [K, L, M, ...] */
  shellLayers?: number[]
  /** 核外电子公转动画相位（弧度；单元测试传入时覆盖内部时钟） */
  orbitPhase?: number
  /** 是否开启内部 60fps 旋转动画 */
  animate?: boolean
  font: (size: number) => number
}

export const AtomShellScene: React.FC<AtomShellSceneProps> = ({
  element,
  stateType,
  excitationShell,
  excitationTargetShell,
  excitationTransitionLabel,
  shellLayers,
  orbitPhase,
  animate = false,
  font,
}) => {
  const [internalPhase, setInternalPhase] = useState(0)
  useAnimationFrame(
    (deltaTime) => {
      setInternalPhase((prev) => (prev + deltaTime * 0.0012) % (Math.PI * 120))
    },
    { playing: Boolean(animate) && orbitPhase === undefined },
  )
  const activePhase = orbitPhase ?? internalPhase
  const isExcited = stateType === 'excited'
  const layerNames = ['K(n=1)', 'L(n=2)', 'M(n=3)', 'N(n=4)', 'O(n=5)']
  const displayLayers =
    shellLayers && shellLayers.length > 0 ? shellLayers : element.electronLayers

  // 与轨道方框图共用同一跃迁定义：若存在激发态目标层则优先高亮跃迁到达层，否则回退 excitationShell / 最外层
  const targetN = excitationTargetShell ?? excitationShell
  const excitedLayerIdx =
    typeof targetN === 'number' && targetN > 0
      ? Math.min(targetN - 1, displayLayers.length - 1)
      : displayLayers.length - 1

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

      {/* 3. 各电子层同心轨道圆环 (K, L, M, N, O) */}
      {displayLayers.map((eCount, idx) => {
        const stepR = displayLayers.length >= 5 ? 30 : 38
        const radius = 60 + idx * stepR

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
              {layerNames[idx] || `n=${idx + 1}`}: {eCount}e⁻
            </text>

            {/* 轨道上的电子分布颗粒 */}
            {Array.from({ length: eCount }).map((_, eIdx) => {
              const angularSpeed = 1 / (idx + 1)
              const angle =
                (eIdx / eCount) * 2 * Math.PI - Math.PI / 2 + activePhase * angularSpeed
              const ex = Math.cos(angle) * radius
              const ey = Math.sin(angle) * radius

              const isExcitedElectron = isExcited && idx === excitedLayerIdx && eIdx === eCount - 1
              const breathRadius = 10 + 4 * Math.sin(activePhase * 4)

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
                      <circle r={breathRadius} fill="none" stroke={colors.danger[500]} strokeWidth={1.5} opacity={0.65} />
                      <text
                        x={ex > 95 ? -14 : 14}
                        y={-10}
                        textAnchor={ex > 95 ? 'end' : 'start'}
                        fill={colors.danger[600]}
                        fontSize={font(10)}
                        fontWeight="bold"
                      >
                        受激价电子
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </g>
        )
      })}

      {/* 3B. 跨壳层吸收能量激发跃迁轨迹与发光粒子 */}
      {isExcited &&
        typeof excitationShell === 'number' &&
        typeof excitationTargetShell === 'number' &&
        excitationShell > 0 &&
        excitationTargetShell > excitationShell &&
        (() => {
          const stepR = displayLayers.length >= 5 ? 30 : 38
          const fromIdx = Math.min(excitationShell - 1, displayLayers.length - 1)
          const toIdx = Math.min(excitationTargetShell - 1, displayLayers.length - 1)
          if (toIdx <= fromIdx) return null
          const rFrom = 60 + fromIdx * stepR
          const rTo = 60 + toIdx * stepR
          const hopT = (activePhase / (2 * Math.PI)) % 1
          const toCount = Math.max(1, displayLayers[toIdx] || 1)
          const hopAngle =
            ((toCount - 1) / toCount) * 2 * Math.PI - Math.PI / 2 + activePhase / (toIdx + 1)
          const xFrom = Math.cos(hopAngle) * rFrom
          const yFrom = Math.sin(hopAngle) * rFrom
          const xTo = Math.cos(hopAngle) * rTo
          const yTo = Math.sin(hopAngle) * rTo
          const xCur = xFrom + (xTo - xFrom) * hopT
          const yCur = yFrom + (yTo - yFrom) * hopT
          return (
            <g>
              <line
                x1={xFrom}
                y1={yFrom}
                x2={xTo}
                y2={yTo}
                stroke={colors.danger[500]}
                strokeWidth={1.5}
                strokeDasharray="3 3"
                opacity={0.75}
              />
              <circle
                cx={xCur}
                cy={yCur}
                r={4.5}
                fill={CHEMISTRY_COLORS.temperature}
                stroke={colors.neutral.white}
                strokeWidth={1.2}
              />
            </g>
          )
        })()}

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
            {excitationTransitionLabel
              ? `激发态（${excitationTransitionLabel}）：价电子吸收能量跃迁至更高能级未满/空轨道`
              : '激发态：最外层价电子吸收能量跃迁至更高能级未满/空轨道（详见右侧轨道方框图）'}
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
          【第 {element.period} 周期 · {element.group} 族 · {element.block} 区】
        </text>
      </g>
    </g>
  )
}
