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

      {/* 阶段 0 与阶段 1：反应物与加成过渡态 */}
      {reactionStage < 2 && (
        <>
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
                <text
                  x={185}
                  y={150}
                  textAnchor="middle"
                  fill={CHEMISTRY_COLORS.activationEnergy}
                  fontSize={font(FONT.small)}
                >
                  生成更稳定的仲碳正离子 [CH₃-C⁺H-CH₃]
                </text>
              </g>
            )}
          </g>

          {/* HCl 分子与极性偏向 */}
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
            <text
              x={40}
              y={25}
              textAnchor="middle"
              fill={CHEMISTRY_COLORS.concentration}
              fontSize={font(FONT.small)}
              fontWeight="bold"
            >
              δ⁺
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
            <text
              x={112}
              y={25}
              textAnchor="middle"
              fill={CHEMISTRY_COLORS.temperature}
              fontSize={font(FONT.small)}
              fontWeight="bold"
            >
              δ⁻
            </text>
          </g>
        </>
      )}

      {/* 阶段 2：生成物稳态 — 真实的 2-氯丙烷微观分子球棍模型 */}
      {reactionStage === 2 && (
        <g transform="translate(170, 130)">
          {/* 原 3号碳 (CH3) */}
          <circle cx={80} cy={140} r={26} fill={ATOM_COLORS.carbon} />
          <text
            x={80}
            y={146}
            textAnchor="middle"
            fill="#FFF"
            fontSize={font(FONT.label)}
            fontWeight="bold"
          >
            CH₃
          </text>

          {/* C-C 单键 */}
          <line
            x1={106}
            y1={140}
            x2={224}
            y2={140}
            stroke={colors.neutral[400]}
            strokeWidth={4}
          />

          {/* 2号碳 (CH，结合新 Cl) */}
          <circle cx={250} cy={140} r={28} fill={ATOM_COLORS.carbon} />
          <text
            x={250}
            y={146}
            textAnchor="middle"
            fill="#FFF"
            fontSize={font(FONT.label)}
            fontWeight="bold"
          >
            CH
          </text>
          <text
            x={250}
            y={185}
            textAnchor="middle"
            fill={colors.neutral[500]}
            fontSize={font(FONT.annotation)}
          >
            2号碳 (仲碳连 Cl)
          </text>

          {/* C-C 单键 (原双键变为单键) */}
          <line
            x1={278}
            y1={140}
            x2={394}
            y2={140}
            stroke={colors.neutral[400]}
            strokeWidth={4}
          />

          {/* 1号碳 (CH3，加成 H 变为饱和甲基) */}
          <circle cx={420} cy={140} r={28} fill={ATOM_COLORS.carbon} />
          <text
            x={420}
            y={146}
            textAnchor="middle"
            fill="#FFF"
            fontSize={font(FONT.label)}
            fontWeight="bold"
          >
            CH₃
          </text>
          <text
            x={420}
            y={185}
            textAnchor="middle"
            fill={CHEMISTRY_COLORS.concentration}
            fontSize={font(FONT.annotation)}
            fontWeight="bold"
          >
            1号碳 (已加成 H)
          </text>

          {/* 新形成的 C-Cl σ键与 Cl 原子 (绿色加粗) */}
          <line
            x1={250}
            y1={112}
            x2={250}
            y2={48}
            stroke="#10B981"
            strokeWidth={5}
          />
          <circle cx={250} cy={22} r={26} fill="#10B981" />
          <text
            x={250}
            y={28}
            textAnchor="middle"
            fill="#FFF"
            fontSize={font(FONT.label)}
            fontWeight="bold"
          >
            Cl
          </text>
          <text
            x={305}
            y={80}
            textAnchor="start"
            fill="#10B981"
            fontSize={font(FONT.small)}
            fontWeight="bold"
          >
            ← 新生成 C-Cl σ键
          </text>

          {/* 底部结构解析徽章卡片 (防溢出，文字安全折行) */}
          <g transform="translate(10, 225)">
            <rect
              x={0}
              y={0}
              width={480}
              height={76}
              rx={12}
              fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.08)}
              stroke={CHEMISTRY_COLORS.concentration}
              strokeWidth={1.5}
            />
            <text
              x={240}
              y={30}
              textAnchor="middle"
              fill={colors.neutral[900]}
              fontSize={font(FONT.title)}
              fontWeight="bold"
            >
              主产物：2-氯丙烷 (CH₃-CHCl-CH₃)
            </text>
            <text
              x={240}
              y={56}
              textAnchor="middle"
              fill={CHEMISTRY_COLORS.concentration}
              fontSize={font(FONT.axis)}
            >
              ✓ 马氏定向稳态：π 键完全打开，形成饱和稳定仲碳氯代烷
            </text>
          </g>
        </g>
      )}
    </g>
  )
}
