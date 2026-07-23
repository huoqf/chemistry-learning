import { colors, FONT, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import { ATOM_COLORS, BOND_COLORS, REACTION_COLORS } from '../constants'
import type { MechanismSceneProps } from '../types'

export function PeptideBondScene({ reactionStage, font }: MechanismSceneProps) {
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
        氨基酸脱水缩合形成肽键 (-CO-NH-) 与水解断键
      </text>

      {/* 甘氨酸 (Gly) */}
      <g transform="translate(120, 140)">
        <text
          x={120}
          y={20}
          textAnchor="middle"
          fill={colors.neutral[700]}
          fontSize={font(FONT.axis)}
          fontWeight="bold"
        >
          甘氨酸 (H₂N-CH₂-COOH)
        </text>
        <circle cx={40} cy={60} r={24} fill={ATOM_COLORS.nitrogen} />
        <text
          x={40}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          H₂N
        </text>

        <line
          x1={64}
          y1={60}
          x2={106}
          y2={60}
          stroke={colors.neutral[400]}
          strokeWidth={3}
        />
        <circle cx={130} cy={60} r={24} fill={ATOM_COLORS.carbon} />
        <text
          x={130}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          CH₂
        </text>

        <line
          x1={154}
          y1={60}
          x2={196}
          y2={60}
          stroke={colors.neutral[400]}
          strokeWidth={3}
        />
        {/* 羰基 C */}
        <circle cx={220} cy={60} r={24} fill={ATOM_COLORS.carbon} />
        <text
          x={220}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          C
        </text>

        {/* 脱去 -OH */}
        <line
          x1={244}
          y1={60}
          x2={286}
          y2={60}
          stroke={
            reactionStage >= 1
              ? BOND_COLORS.cleaved
              : colors.neutral[400]
          }
          strokeWidth={3}
          strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
        />
        <g transform={reactionStage === 2 ? 'translate(80, 160)' : ''}>
          <circle cx={310} cy={60} r={22} fill={ATOM_COLORS.oxygen} />
          <text
            x={310}
            y={65}
            textAnchor="middle"
            fill="#FFF"
            fontSize={font(FONT.axis)}
            fontWeight="bold"
          >
            OH
          </text>
        </g>

        {reactionStage === 1 && (
          <text
            x={265}
            y={35}
            textAnchor="middle"
            fill={REACTION_COLORS.cleavage}
            fontSize={font(FONT.annotation)}
            fontWeight="bold"
          >
            ✂ 羧基脱 -OH
          </text>
        )}
      </g>

      {/* 丙氨酸 (Ala) */}
      <g transform="translate(500, 140)">
        <text
          x={140}
          y={20}
          textAnchor="middle"
          fill={colors.neutral[700]}
          fontSize={font(FONT.axis)}
          fontWeight="bold"
        >
          丙氨酸 (H₂N-CH(CH₃)-COOH)
        </text>

        {/* 氨基 H */}
        <g transform={reactionStage === 2 ? 'translate(-200, 160)' : ''}>
          <circle cx={10} cy={60} r={18} fill={ATOM_COLORS.hydrogen} />
          <text
            x={10}
            y={65}
            textAnchor="middle"
            fill="#333"
            fontSize={font(FONT.axis)}
            fontWeight="bold"
          >
            H
          </text>
        </g>
        <line
          x1={28}
          y1={60}
          x2={56}
          y2={60}
          stroke={
            reactionStage >= 1
              ? BOND_COLORS.cleaved
              : colors.neutral[400]
          }
          strokeWidth={3}
          strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
        />

        <circle cx={80} cy={60} r={24} fill={ATOM_COLORS.nitrogen} />
        <text
          x={80}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          HN
        </text>

        <line
          x1={104}
          y1={60}
          x2={146}
          y2={60}
          stroke={colors.neutral[400]}
          strokeWidth={3}
        />
        <circle cx={170} cy={60} r={24} fill={ATOM_COLORS.carbon} />
        <text
          x={170}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.axis)}
          fontWeight="bold"
        >
          CH
        </text>

        <line
          x1={194}
          y1={60}
          x2={236}
          y2={60}
          stroke={colors.neutral[400]}
          strokeWidth={3}
        />
        <circle cx={260} cy={60} r={24} fill={ATOM_COLORS.carbon} />
        <text
          x={260}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.small)}
          fontWeight="bold"
        >
          COOH
        </text>

        {reactionStage === 1 && (
          <text
            x={42}
            y={35}
            textAnchor="middle"
            fill={REACTION_COLORS.cleavage}
            fontSize={font(FONT.annotation)}
            fontWeight="bold"
          >
            ✂ 氨基脱 -H
          </text>
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
            fill={withAlpha(CHEMISTRY_COLORS.pH, 0.08)}
            stroke={CHEMISTRY_COLORS.pH}
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
            生成甘丙二肽：H₂N-CH₂-
            <tspan fill="#EF4444" fontWeight="bold">
              CO-NH
            </tspan>
            -CH(CH₃)-COOH + H₂O
          </text>
          <text
            x={240}
            y={60}
            textAnchor="middle"
            fill={CHEMISTRY_COLORS.pH}
            fontSize={font(FONT.axis)}
          >
            ✓ 羧基脱 -OH、氨基脱 -H 形成 -CO-NH- (肽键)；水解时断裂 C-N 单键
          </text>
        </g>
      )}
    </g>
  )
}
