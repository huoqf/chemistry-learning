import { colors, FONT, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import { ATOM_COLORS, BOND_COLORS, REACTION_COLORS } from '../constants'
import type { MechanismSceneProps } from '../types'

export function EliminationScene({ reactionStage, font }: MechanismSceneProps) {
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
        2-溴丁烷消去反应与扎伊采夫规则 (脱 HBr 生成 C=C)
      </text>

      <g transform="translate(120, 140)">
        {/* 1号碳 (β1-C, CH3, H较多: 3个) */}
        <circle cx={50} cy={60} r={24} fill={ATOM_COLORS.carbon} />
        <text
          x={50}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          CH₃
        </text>
        <text
          x={50}
          y={22}
          textAnchor="middle"
          fill={colors.neutral[500]}
          fontSize={font(FONT.annotation)}
        >
          1号碳 (β₁-C, 3H)
        </text>

        <line
          x1={74}
          y1={60}
          x2={126}
          y2={60}
          stroke={colors.neutral[400]}
          strokeWidth={3}
        />

        {/* 2号碳 (α-C, CH-Br) */}
        <circle cx={150} cy={60} r={26} fill={ATOM_COLORS.carbon} />
        <text
          x={150}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          CH
        </text>
        <text
          x={150}
          y={22}
          textAnchor="middle"
          fill={colors.neutral[700]}
          fontSize={font(FONT.annotation)}
          fontWeight="bold"
        >
          2号碳 (α-C)
        </text>
        {/* C-Br 键 */}
        <line
          x1={150}
          y1={86}
          x2={150}
          y2={130}
          stroke={
            reactionStage >= 1
              ? BOND_COLORS.cleaved
              : colors.neutral[400]
          }
          strokeWidth={3}
          strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
        />
        <circle cx={150} cy={152} r={22} fill="#10B981" />
        <text
          x={150}
          y={157}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.axis)}
          fontWeight="bold"
        >
          Br
        </text>

        {/* 2-3位单/双键 */}
        <line
          x1={176}
          y1={60}
          x2={234}
          y2={60}
          stroke={
            reactionStage === 2
              ? CHEMISTRY_COLORS.concentration
              : colors.neutral[400]
          }
          strokeWidth={reactionStage === 2 ? 4 : 3}
        />
        {reactionStage === 2 && (
          <line
            x1={176}
            y1={70}
            x2={234}
            y2={70}
            stroke={CHEMISTRY_COLORS.concentration}
            strokeWidth={4}
          />
        )}

        {/* 3号碳 (β2-C, CH2, H较少: 2个) */}
        <circle cx={260} cy={60} r={26} fill={ATOM_COLORS.carbon} />
        <text
          x={260}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          CH
        </text>
        <text
          x={260}
          y={22}
          textAnchor="middle"
          fill={CHEMISTRY_COLORS.concentration}
          fontSize={font(FONT.annotation)}
          fontWeight="bold"
        >
          3号碳 (β₂-C, 2H少)
        </text>

        {/* 3号碳上的 β-H */}
        <line
          x1={260}
          y1={86}
          x2={260}
          y2={130}
          stroke={
            reactionStage >= 1
              ? BOND_COLORS.cleaved
              : colors.neutral[400]
          }
          strokeWidth={3}
          strokeDasharray={reactionStage === 1 ? '4,4' : undefined}
        />
        <circle cx={260} cy={150} r={18} fill={ATOM_COLORS.hydrogen} />
        <text
          x={260}
          y={155}
          textAnchor="middle"
          fill="#333"
          fontSize={font(FONT.axis)}
          fontWeight="bold"
        >
          H
        </text>

        {/* 4号碳 (CH3) */}
        <line
          x1={286}
          y1={60}
          x2={334}
          y2={60}
          stroke={colors.neutral[400]}
          strokeWidth={3}
        />
        <circle cx={360} cy={60} r={24} fill={ATOM_COLORS.carbon} />
        <text
          x={360}
          y={65}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          CH₃
        </text>

        {/* 断键与脱去标记 */}
        {reactionStage === 1 && (
          <g transform="translate(120, 110)">
            <rect
              x={0}
              y={0}
              width={170}
              height={70}
              rx={8}
              fill={withAlpha(REACTION_COLORS.cleavage, 0.15)}
              stroke={REACTION_COLORS.cleavage}
              strokeWidth={2}
              strokeDasharray="4,3"
            />
            <text
              x={85}
              y={24}
              textAnchor="middle"
              fill={REACTION_COLORS.cleavage}
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              ✂ 脱 HBr (脱含 H 少的 β-氢)
            </text>
            <text
              x={85}
              y={48}
              textAnchor="middle"
              fill={colors.neutral[700]}
              fontSize={font(11)}
            >
              NaOH 醇溶液, Δ
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
            主产物 (80%)：2-丁烯 (CH₃-CH=CH-CH₃) + NaBr + H₂O
          </text>
          <text
            x={240}
            y={60}
            textAnchor="middle"
            fill={CHEMISTRY_COLORS.concentration}
            fontSize={font(FONT.axis)}
          >
            ✓ 扎伊采夫规则：H 优先从含氢较少的 3号 β-C 上脱去，形成多取代双键
          </text>
        </g>
      )}
    </g>
  )
}
