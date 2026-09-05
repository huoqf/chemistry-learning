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

      {/* 阶段 0 与阶段 1 或叔丁醇反例：显示底物与脱氢过渡 */}
      {(reactionStage < 2 || useTertiaryAlcohol) && (
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
      )}

      {useTertiaryAlcohol ? (
        <g transform="translate(180, 350)">
          <rect
            x={0}
            y={0}
            width={480}
            height={76}
            rx={12}
            fill={withAlpha('#EF4444', 0.1)}
            stroke="#EF4444"
            strokeWidth={1.5}
          />
          <text
            x={240}
            y={30}
            textAnchor="middle"
            fill="#991B1B"
            fontSize={font(FONT.title)}
            fontWeight="bold"
          >
            ❌ 叔丁醇无 α-H：无法发生脱氢催化氧化！
          </text>
          <text
            x={240}
            y={54}
            textAnchor="middle"
            fill="#B91C1C"
            fontSize={font(FONT.axis)}
          >
            高考易错陷阱：与 -OH 相连的 α-C 上连接了 3 个甲基，无 C-H 键脱氢
          </text>
        </g>
      ) : (
        reactionStage === 2 && (
          <g transform="translate(180, 140)">
            {/* 乙醛产物分子球棍结构 */}
            {/* CH3 */}
            <circle cx={80} cy={100} r={26} fill={ATOM_COLORS.carbon} />
            <text x={80} y={106} textAnchor="middle" fill="#FFF" fontSize={font(FONT.label)} fontWeight="bold">CH₃</text>

            {/* C-C 单键 */}
            <line x1={106} y1={100} x2={182} y2={100} stroke={colors.neutral[400]} strokeWidth={4} />

            {/* 羰基碳 C */}
            <circle cx={210} cy={100} r={28} fill={ATOM_COLORS.carbon} />
            <text x={210} y={106} textAnchor="middle" fill="#FFF" fontSize={font(FONT.label)} fontWeight="bold">C</text>

            {/* 新形成的 C=O 羰基双键 (绿色与红色粗线) */}
            <line x1={204} y1={72} x2={204} y2={14} stroke="#10B981" strokeWidth={4} />
            <line x1={216} y1={72} x2={216} y2={14} stroke={ATOM_COLORS.oxygen} strokeWidth={4} />
            <circle cx={210} cy={-12} r={24} fill={ATOM_COLORS.oxygen} />
            <text x={210} y={-6} textAnchor="middle" fill="#FFF" fontSize={font(FONT.axis)} fontWeight="bold">O</text>
            <text x={250} y={40} textAnchor="start" fill="#10B981" fontSize={font(FONT.small)} fontWeight="bold">
              ← 新生成 C=O 羰基
            </text>

            {/* 醛基 H */}
            <line x1={238} y1={100} x2={286} y2={100} stroke={colors.neutral[400]} strokeWidth={3} />
            <circle cx={306} cy={100} r={18} fill={ATOM_COLORS.hydrogen} />
            <text x={306} y={105} textAnchor="middle" fill="#333" fontSize={font(FONT.axis)} fontWeight="bold">H</text>

            {/* 生成的水分子 */}
            <g transform="translate(370, 75)">
              <rect x={0} y={0} width={90} height={46} rx={8} fill={withAlpha(colors.neutral[300], 0.35)} stroke={colors.neutral[400]} strokeWidth={1} />
              <text x={45} y={18} textAnchor="middle" fill={colors.neutral[600]} fontSize={font(FONT.annotation)}>副产物</text>
              <text x={45} y={36} textAnchor="middle" fill={colors.neutral[800]} fontSize={font(FONT.small)} fontWeight="bold">+ H₂O</text>
            </g>

            {/* 底部结构解析徽章卡片 */}
            <g transform="translate(0, 180)">
              <rect
                x={0}
                y={0}
                width={480}
                height={72}
                rx={12}
                fill={withAlpha(CHEMISTRY_COLORS.pH, 0.08)}
                stroke={CHEMISTRY_COLORS.pH}
                strokeWidth={1.5}
              />
              <text
                x={240}
                y={28}
                textAnchor="middle"
                fill={colors.neutral[900]}
                fontSize={font(FONT.title)}
                fontWeight="bold"
              >
                生成物：乙醛 (CH₃CHO) + H₂O
              </text>
              <text
                x={240}
                y={52}
                textAnchor="middle"
                fill={CHEMISTRY_COLORS.pH}
                fontSize={font(FONT.axis)}
              >
                ✓ 脱氢氧化稳态：断开 1个 O-H 键与 1个 α-C-H 键，形成稳定羰基双键
              </text>
            </g>
          </g>
        )
      )}
    </g>
  )
}
