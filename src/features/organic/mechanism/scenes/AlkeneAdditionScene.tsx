import { colors, FONT, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import { ATOM_COLORS, BOND_COLORS, REACTION_COLORS } from '../constants'
import type { MechanismSceneProps } from '../types'

export function AlkeneAdditionScene({ reactionStage, font }: MechanismSceneProps) {
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
        丙烯 (CH₃-CH=CH₂) + HCl 亲电加成 (马氏规则)
      </text>

      <g transform="translate(170, 150)">
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

        {/* 2号碳 (CH) */}
        <circle cx={130} cy={60} r={24} fill={ATOM_COLORS.carbon} />
        <text
          x={130}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          CH
        </text>
        <text
          x={130}
          y={25}
          textAnchor="middle"
          fill={colors.neutral[500]}
          fontSize={font(FONT.annotation)}
        >
          2号碳 (H少)
        </text>

        {/* C=C 双键 */}
        <line
          x1={154}
          y1={54}
          x2={216}
          y2={54}
          stroke={colors.neutral[500]}
          strokeWidth={3}
        />
        <line
          x1={154}
          y1={66}
          x2={216}
          y2={66}
          stroke={
            reactionStage >= 1
              ? BOND_COLORS.cleaved
              : colors.neutral[500]
          }
          strokeWidth={3}
          strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
        />

        {/* 1号碳 (CH2) */}
        <circle cx={240} cy={60} r={24} fill={ATOM_COLORS.carbon} />
        <text
          x={240}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          CH₂
        </text>
        <text
          x={240}
          y={25}
          textAnchor="middle"
          fill={CHEMISTRY_COLORS.concentration}
          fontSize={font(FONT.annotation)}
          fontWeight="bold"
        >
          1号碳 (H多)
        </text>

        {reactionStage === 1 && (
          <g>
            <line
              x1={185}
              y1={72}
              x2={185}
              y2={115}
              stroke={REACTION_COLORS.cleavage}
              strokeWidth={2}
              strokeDasharray="3,3"
            />
            <text
              x={185}
              y={132}
              textAnchor="middle"
              fill={REACTION_COLORS.cleavage}
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              ✂ π 键打开
            </text>
          </g>
        )}
      </g>

      {/* HCl 分子 */}
      <g transform="translate(550, 150)">
        <circle cx={40} cy={60} r={20} fill={ATOM_COLORS.hydrogen} />
        <text
          x={40}
          y={65}
          textAnchor="middle"
          fill="#333"
          fontSize={font(FONT.axis)}
          fontWeight="bold"
        >
          H
        </text>
        <line
          x1={60}
          y1={60}
          x2={88}
          y2={60}
          stroke={
            reactionStage >= 1
              ? BOND_COLORS.cleaved
              : colors.neutral[400]
          }
          strokeWidth={3}
          strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
        />
        <circle cx={112} cy={60} r={24} fill="#10B981" />
        <text
          x={112}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          Cl
        </text>
      </g>

      {/* 产物展示 */}
      {reactionStage === 2 && (
        <g transform="translate(200, 340)">
          <rect
            x={0}
            y={0}
            width={440}
            height={85}
            rx={12}
            fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.08)}
            stroke={CHEMISTRY_COLORS.concentration}
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
            主产物：2-氯丙烷 (CH₃-CH
            <tspan fill="#10B981">Cl</tspan>-CH₃)
          </text>
          <text
            x={220}
            y={60}
            textAnchor="middle"
            fill={CHEMISTRY_COLORS.concentration}
            fontSize={font(FONT.axis)}
          >
            ✓ 马氏规则：氢原子优先加到含氢较多的 1号碳 (-CH₃)，氯原子加到 2号碳
          </text>
        </g>
      )}
    </g>
  )
}
