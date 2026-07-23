import { colors, FONT, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import { ATOM_COLORS, REACTION_COLORS } from '../constants'
import type { MechanismSceneProps } from '../types'

export function PhenolFormaldehydeScene({ reactionStage, font }: MechanismSceneProps) {
  return (
    <g>
      <text
        x={420}
        y={55}
        textAnchor="middle"
        fill={colors.neutral[800]}
        fontSize={font(FONT.title)}
        fontWeight="bold"
      >
        苯酚邻对位 C-H 键极化活化 (2,4,6-三溴苯酚取代与酚醛缩聚)
      </text>

      <g transform="translate(250, 130)">
        {/* 苯环六边形 */}
        <polygon
          points="150,40 200,70 200,130 150,160 100,130 100,70"
          fill={withAlpha(colors.neutral[300], 0.3)}
          stroke={colors.neutral[700]}
          strokeWidth={3}
        />
        <circle
          cx={150}
          cy={100}
          r={30}
          fill="none"
          stroke={colors.neutral[400]}
          strokeWidth={2}
          strokeDasharray="4,4"
        />

        {/* 酚羟基 -OH (1号位) */}
        <line
          x1={150}
          y1={40}
          x2={150}
          y2={5}
          stroke={colors.neutral[600]}
          strokeWidth={3}
        />
        <circle cx={150} cy={-15} r={22} fill={ATOM_COLORS.oxygen} />
        <text
          x={150}
          y={-10}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.axis)}
          fontWeight="bold"
        >
          OH
        </text>

        {/* 2号邻位 C-H (左上) */}
        <circle
          cx={100}
          cy={70}
          r={16}
          fill={
            reactionStage >= 1
              ? REACTION_COLORS.cleavage
              : CHEMISTRY_COLORS.concentration
          }
        />
        <text
          x={100}
          y={74}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(11)}
          fontWeight="bold"
        >
          2-H
        </text>

        {/* 6号邻位 C-H (右上) */}
        <circle
          cx={200}
          cy={70}
          r={16}
          fill={
            reactionStage >= 1
              ? REACTION_COLORS.cleavage
              : CHEMISTRY_COLORS.concentration
          }
        />
        <text
          x={200}
          y={74}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(11)}
          fontWeight="bold"
        >
          6-H
        </text>

        {/* 4号对位 C-H (正下) */}
        <circle
          cx={150}
          cy={160}
          r={16}
          fill={
            reactionStage >= 1
              ? REACTION_COLORS.cleavage
              : CHEMISTRY_COLORS.concentration
          }
        />
        <text
          x={150}
          y={164}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(11)}
          fontWeight="bold"
        >
          4-H
        </text>

        {/* 活化标注 */}
        <text
          x={150}
          y={105}
          textAnchor="middle"
          fill={colors.neutral[800]}
          fontSize={font(FONT.annotation)}
          fontWeight="bold"
        >
          p-π 共轭活化
        </text>

        {reactionStage === 1 && (
          <g>
            <text
              x={40}
              y={70}
              textAnchor="middle"
              fill={REACTION_COLORS.cleavage}
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              ✂ 邻位断 C-H
            </text>
            <text
              x={260}
              y={70}
              textAnchor="middle"
              fill={REACTION_COLORS.cleavage}
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              ✂ 邻位断 C-H
            </text>
            <text
              x={150}
              y={195}
              textAnchor="middle"
              fill={REACTION_COLORS.cleavage}
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              ✂ 对位断 C-H
            </text>
          </g>
        )}
      </g>

      {/* 产物展示 */}
      {reactionStage === 2 && (
        <g transform="translate(180, 360)">
          <rect
            x={0}
            y={0}
            width={480}
            height={85}
            rx={12}
            fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.08)}
            stroke={CHEMISTRY_COLORS.concentration}
            strokeWidth={1.5}
          />
          <text
            x={240}
            y={32}
            textAnchor="middle"
            fill={colors.neutral[900]}
            fontSize={font(FONT.title)}
            fontWeight="bold"
          >
            生成物：2,4,6-三溴苯酚白色沉淀 ↓ + 3 HBr (或缩聚生成酚醛树脂)
          </text>
          <text
            x={240}
            y={60}
            textAnchor="middle"
            fill={CHEMISTRY_COLORS.concentration}
            fontSize={font(FONT.axis)}
          >
            ✓ 酚羟基增大邻对位电子云密度，使 2,4,6 位 C-H 键极易断裂发生取代/缩聚
          </text>
        </g>
      )}
    </g>
  )
}
