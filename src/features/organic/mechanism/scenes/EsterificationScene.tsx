import { colors, FONT, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import { ATOM_COLORS, BOND_COLORS, REACTION_COLORS } from '../constants'
import type { EsterificationSceneProps } from '../types'

export function EsterificationScene({ reactionStage, font, show18OTracing }: EsterificationSceneProps) {
  return (
    <g>
      {/* 反应物标题 */}
      <text
        x={220}
        y={55}
        textAnchor="middle"
        fill={colors.neutral[800]}
        fontSize={font(FONT.title)}
        fontWeight="bold"
      >
        乙酸 (CH₃COOH)
      </text>
      <text
        x={620}
        y={55}
        textAnchor="middle"
        fill={colors.neutral[800]}
        fontSize={font(FONT.title)}
        fontWeight="bold"
      >
        ¹⁸O-乙醇 (CH₃CH₂¹⁸OH)
      </text>

      {/* 反应物 1: 乙酸 (CH3-C(=O)-OH) */}
      <g transform="translate(110, 130)">
        {/* CH3 */}
        <circle cx={40} cy={60} r={24} fill={ATOM_COLORS.carbon} />
        <text
          x={40}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          CH₃
        </text>
        <line
          x1={64}
          y1={60}
          x2={106}
          y2={60}
          stroke={colors.neutral[400]}
          strokeWidth={3}
        />
        {/* 羰基 C */}
        <circle cx={130} cy={60} r={24} fill={ATOM_COLORS.carbon} />
        <text
          x={130}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          C
        </text>
        {/* C=O 双键 */}
        <line
          x1={130}
          y1={36}
          x2={130}
          y2={4}
          stroke={ATOM_COLORS.oxygen}
          strokeWidth={4}
        />
        <circle cx={130} cy={-8} r={20} fill={ATOM_COLORS.oxygen} />
        <text
          x={130}
          y={-3}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.axis)}
          fontWeight="bold"
        >
          O
        </text>
        {/* C-OH 键与羟基 OH */}
        <line
          x1={154}
          y1={60}
          x2={196}
          y2={60}
          stroke={
            reactionStage >= 1
              ? BOND_COLORS.cleaved
              : colors.neutral[400]
          }
          strokeWidth={3}
          strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
        />
        <g transform={reactionStage === 2 ? 'translate(80, 150)' : ''}>
          <circle cx={220} cy={60} r={22} fill={ATOM_COLORS.oxygen} />
          <text
            x={220}
            y={65}
            textAnchor="middle"
            fill="#FFF"
            fontSize={font(FONT.label)}
            fontWeight="bold"
          >
            OH
          </text>
        </g>

        {/* 断键高亮 (酸脱羟基 -OH) */}
        {reactionStage === 1 && (
          <g>
            <rect
              x={170}
              y={28}
              width={75}
              height={64}
              rx={8}
              fill={withAlpha(REACTION_COLORS.cleavage, 0.15)}
              stroke={REACTION_COLORS.cleavage}
              strokeWidth={2}
              strokeDasharray="4,3"
            />
            <text
              x={207}
              y={20}
              textAnchor="middle"
              fill={REACTION_COLORS.cleavage}
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              ✂ 酸脱 -OH
            </text>
          </g>
        )}
      </g>

      {/* 反应物 2: 乙醇 (H-¹⁸O-CH2CH3) */}
      <g transform="translate(500, 130)">
        {/* H */}
        <g transform={reactionStage === 2 ? 'translate(-200, 150)' : ''}>
          <circle cx={20} cy={60} r={18} fill={ATOM_COLORS.hydrogen} />
          <text
            x={20}
            y={65}
            textAnchor="middle"
            fill="#333"
            fontSize={font(FONT.axis)}
            fontWeight="bold"
          >
            H
          </text>
        </g>

        {/* H-O 键 */}
        <line
          x1={38}
          y1={60}
          x2={68}
          y2={60}
          stroke={
            reactionStage >= 1
              ? BOND_COLORS.cleaved
              : colors.neutral[400]
          }
          strokeWidth={3}
          strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
        />

        {/* ¹⁸O 原子 */}
        <circle
          cx={92}
          cy={60}
          r={24}
          fill={show18OTracing ? '#EC4899' : ATOM_COLORS.oxygen}
          stroke={show18OTracing ? '#BE185D' : undefined}
          strokeWidth={show18OTracing ? 2.5 : 0}
        />
        <text
          x={92}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.axis)}
          fontWeight="bold"
        >
          {show18OTracing ? '¹⁸O' : 'O'}
        </text>

        {/* O-CH2 键 */}
        <line
          x1={116}
          y1={60}
          x2={148}
          y2={60}
          stroke={colors.neutral[400]}
          strokeWidth={3}
        />
        {/* CH2CH3 */}
        <circle cx={172} cy={60} r={24} fill={ATOM_COLORS.carbon} />
        <text
          x={172}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.small)}
          fontWeight="bold"
        >
          CH₂CH₃
        </text>

        {/* 断键高亮 (醇脱氢 -H) */}
        {reactionStage === 1 && (
          <g>
            <rect
              x={8}
              y={28}
              width={50}
              height={64}
              rx={8}
              fill={withAlpha(REACTION_COLORS.cleavage, 0.15)}
              stroke={REACTION_COLORS.cleavage}
              strokeWidth={2}
              strokeDasharray="4,3"
            />
            <text
              x={33}
              y={20}
              textAnchor="middle"
              fill={REACTION_COLORS.cleavage}
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              ✂ 醇脱 -H
            </text>
          </g>
        )}
      </g>

      {/* 中央反应箭头 */}
      <g transform="translate(420, 290)">
        <line
          x1={-40}
          y1={0}
          x2={40}
          y2={0}
          stroke={CHEMISTRY_COLORS.concentration}
          strokeWidth={3}
        />
        <polygon
          points="40,-6 54,0 40,6"
          fill={CHEMISTRY_COLORS.concentration}
        />
        <text
          x={0}
          y={-14}
          textAnchor="middle"
          fill={colors.neutral[600]}
          fontSize={font(FONT.annotation)}
        >
          浓 H₂SO₄, Δ (可逆反应)
        </text>
      </g>

      {/* 阶段 2: 产物分子 (乙酸乙酯 + 水) */}
      {reactionStage === 2 && (
        <g transform="translate(200, 360)">
          <rect
            x={0}
            y={0}
            width={440}
            height={80}
            rx={12}
            fill={withAlpha(CHEMISTRY_COLORS.pH, 0.08)}
            stroke={CHEMISTRY_COLORS.pH}
            strokeWidth={1.5}
          />
          <text
            x={220}
            y={32}
            textAnchor="middle"
            fill={colors.neutral[900]}
            fontSize={font(FONT.title)}
            fontWeight="bold"
          >
            生成物：CH₃CO
            <tspan fill={show18OTracing ? '#BE185D' : undefined}>
              {show18OTracing ? '¹⁸O' : 'O'}
            </tspan>
            CH₂CH₃ + H₂O
          </text>
          <text
            x={220}
            y={58}
            textAnchor="middle"
            fill={CHEMISTRY_COLORS.pH}
            fontSize={font(FONT.axis)}
          >
            ✓ 成功形成乙酸乙酯 (含 ¹⁸O) 与水分子 (酸脱 -OH + 醇脱 -H，水不含 ¹⁸O)
          </text>
        </g>
      )}
    </g>
  )
}
