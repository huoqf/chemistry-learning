import { colors, FONT, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import { ATOM_COLORS, BOND_COLORS } from '../constants'
import type { AlcoholOxidationSceneProps } from '../types'

export function AlcoholOxidationScene({ reactionStage, font, useTertiaryAlcohol }: AlcoholOxidationSceneProps) {
  return (
    <g>
      <text
        x={420}
        y={50}
        textAnchor="middle"
        fill={colors.neutral[800]}
        fontSize={font(FONT.title)}
        fontWeight="bold"
      >
        {useTertiaryAlcohol
          ? '叔丁醇 (无 α-H) 无法发生催化氧化反例'
          : '乙醇 (含 α-H) 催化氧化生成乙醛'}
      </text>

      <g transform="translate(270, 130)">
        {/* α-C */}
        <circle
          cx={150}
          cy={80}
          r={26}
          fill={
            useTertiaryAlcohol
              ? colors.neutral[600]
              : ATOM_COLORS.carbon
          }
        />
        <text
          x={150}
          y={85}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.label)}
          fontWeight="bold"
        >
          α-C
        </text>

        {/* 上方 -OH */}
        <line
          x1={150}
          y1={54}
          x2={150}
          y2={22}
          stroke={
            !useTertiaryAlcohol && reactionStage >= 1
              ? BOND_COLORS.cleaved
              : colors.neutral[400]
          }
          strokeWidth={3}
          strokeDasharray={
            !useTertiaryAlcohol && reactionStage === 1 ? '4,4' : undefined
          }
        />
        <circle
          cx={150}
          cy={-4}
          r={22}
          fill={ATOM_COLORS.oxygen}
        />
        <text
          x={150}
          y={1}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.axis)}
          fontWeight="bold"
        >
          OH
        </text>

        {/* 左侧 -CH3 / R */}
        <line
          x1={124}
          y1={80}
          x2={86}
          y2={80}
          stroke={colors.neutral[400]}
          strokeWidth={3}
        />
        <circle cx={60} cy={80} r={24} fill={ATOM_COLORS.carbon} />
        <text
          x={60}
          y={85}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.axis)}
          fontWeight="bold"
        >
          CH₃
        </text>

        {/* 右侧 H / CH3 */}
        <line
          x1={176}
          y1={80}
          x2={214}
          y2={80}
          stroke={colors.neutral[400]}
          strokeWidth={3}
        />
        <circle
          cx={238}
          cy={80}
          r={22}
          fill={
            useTertiaryAlcohol
              ? ATOM_COLORS.carbon
              : ATOM_COLORS.hydrogen
          }
        />
        <text
          x={238}
          y={85}
          textAnchor="middle"
          fill={useTertiaryAlcohol ? '#FFF' : '#333'}
          fontSize={font(FONT.axis)}
          fontWeight="bold"
        >
          {useTertiaryAlcohol ? 'CH₃' : 'H'}
        </text>

        {/* 下方 α-H / CH3 */}
        <line
          x1={150}
          y1={106}
          x2={150}
          y2={140}
          stroke={
            !useTertiaryAlcohol && reactionStage >= 1
              ? BOND_COLORS.cleaved
              : colors.neutral[400]
          }
          strokeWidth={3}
          strokeDasharray={
            !useTertiaryAlcohol && reactionStage === 1 ? '4,4' : undefined
          }
        />
        <circle
          cx={150}
          cy={162}
          r={20}
          fill={
            useTertiaryAlcohol
              ? ATOM_COLORS.carbon
              : ATOM_COLORS.hydrogen
          }
        />
        <text
          x={150}
          y={167}
          textAnchor="middle"
          fill={useTertiaryAlcohol ? '#FFF' : '#333'}
          fontSize={font(FONT.axis)}
          fontWeight="bold"
        >
          {useTertiaryAlcohol ? 'CH₃' : 'H'}
        </text>
      </g>

      {useTertiaryAlcohol ? (
        <g transform="translate(210, 360)">
          <rect
            x={0}
            y={0}
            width={420}
            height={80}
            rx={12}
            fill={withAlpha('#EF4444', 0.1)}
            stroke="#EF4444"
            strokeWidth={1.5}
          />
          <text
            x={210}
            y={32}
            textAnchor="middle"
            fill="#991B1B"
            fontSize={font(FONT.title)}
            fontWeight="bold"
          >
            ❌ 叔醇无 α-H：无法脱氢氧化！
          </text>
          <text
            x={210}
            y={58}
            textAnchor="middle"
            fill="#B91C1C"
            fontSize={font(FONT.axis)}
          >
            高考易错陷阱：与 -OH 相连的 α-C 上连接了 3 个甲基，无 C-H 键
          </text>
        </g>
      ) : (
        reactionStage === 2 && (
          <g transform="translate(210, 360)">
            <rect
              x={0}
              y={0}
              width={420}
              height={80}
              rx={12}
              fill={withAlpha(CHEMISTRY_COLORS.pH, 0.08)}
              stroke={CHEMISTRY_COLORS.pH}
              strokeWidth={1.5}
            />
            <text
              x={210}
              y={32}
              textAnchor="middle"
              fill={colors.neutral[900]}
              fontSize={font(FONT.title)}
              fontWeight="bold"
            >
              生成物：乙醛 (CH₃CHO) + H₂O
            </text>
            <text
              x={210}
              y={58}
              textAnchor="middle"
              fill={CHEMISTRY_COLORS.pH}
              fontSize={font(FONT.axis)}
            >
              ✓ 成功断裂 O-H 与 α-C 上的 C-H 键，形成 C=O 羰基
            </text>
          </g>
        )
      )}
    </g>
  )
}
