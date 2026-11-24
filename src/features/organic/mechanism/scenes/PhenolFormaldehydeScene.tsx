import { colors, FONT, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import { ATOM_COLORS, BOND_COLORS, REACTION_COLORS } from '../constants'
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
        苯酚邻对位 C-H 键极化活化 (2,4,6-三溴苯酚三取代反应与酚醛缩聚机理)
      </text>

      {/* 阶段 0 与阶段 1：反应物与邻对位活化过渡态 */}
      {reactionStage < 2 && (
        <g transform="translate(210, 130)">
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

        {/* 2号邻位 C-H 外延键（左上，不遮盖环碳顶点） */}
        <line
          x1={100}
          y1={70}
          x2={70}
          y2={52}
          stroke={reactionStage === 1 ? BOND_COLORS.cleaved : colors.neutral[500]}
          strokeWidth={3}
          strokeDasharray={reactionStage === 1 ? '4,3' : undefined}
        />
        <circle
          cx={56}
          cy={44}
          r={16}
          fill={
            reactionStage >= 1
              ? REACTION_COLORS.cleavage
              : CHEMISTRY_COLORS.concentration
          }
        />
        <text
          x={56}
          y={48}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(11)}
          fontWeight="bold"
        >
          2-H
        </text>

        {/* 6号邻位 C-H 外延键（右上） */}
        <line
          x1={200}
          y1={70}
          x2={230}
          y2={52}
          stroke={reactionStage === 1 ? BOND_COLORS.cleaved : colors.neutral[500]}
          strokeWidth={3}
          strokeDasharray={reactionStage === 1 ? '4,3' : undefined}
        />
        <circle
          cx={244}
          cy={44}
          r={16}
          fill={
            reactionStage >= 1
              ? REACTION_COLORS.cleavage
              : CHEMISTRY_COLORS.concentration
          }
        />
        <text
          x={244}
          y={48}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(11)}
          fontWeight="bold"
        >
          6-H
        </text>

        {/* 4号对位 C-H 外延键（正下） */}
        <line
          x1={150}
          y1={160}
          x2={150}
          y2={190}
          stroke={reactionStage === 1 ? BOND_COLORS.cleaved : colors.neutral[500]}
          strokeWidth={3}
          strokeDasharray={reactionStage === 1 ? '4,3' : undefined}
        />
        <circle
          cx={150}
          cy={206}
          r={16}
          fill={
            reactionStage >= 1
              ? REACTION_COLORS.cleavage
              : CHEMISTRY_COLORS.concentration
          }
        />
        <text
          x={150}
          y={210}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(11)}
          fontWeight="bold"
        >
          4-H
        </text>

        {/* 右侧反应物：+ 3 Br₂ (浓溴水过量反应物，双溴球棍示意) */}
        <g transform="translate(310, 78)">
          <text x={-16} y={24} fill={colors.neutral[700]} fontSize={font(FONT.title)} fontWeight="bold">+</text>
          <text x={55} y={-8} textAnchor="middle" fill="#047857" fontSize={font(FONT.small)} fontWeight="bold">3 Br₂ (浓溴水)</text>
          <circle cx={34} cy={20} r={18} fill="#991B1B" />
          <text x={34} y={25} textAnchor="middle" fill="#FFF" fontSize={font(FONT.axis)} fontWeight="bold">Br</text>
          <line x1={52} y1={20} x2={68} y2={20} stroke={reactionStage === 1 ? BOND_COLORS.cleaved : colors.neutral[400]} strokeWidth={3} strokeDasharray={reactionStage === 1 ? '4,3' : undefined} />
          <circle cx={86} cy={20} r={18} fill="#991B1B" />
          <text x={86} y={25} textAnchor="middle" fill="#FFF" fontSize={font(FONT.axis)} fontWeight="bold">Br</text>
        </g>

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
              x={-8}
              y={48}
              textAnchor="middle"
              fill={REACTION_COLORS.cleavage}
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              ✂ 邻位断 C-H
            </text>
            <text
              x={292}
              y={25}
              textAnchor="middle"
              fill={REACTION_COLORS.cleavage}
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              ✂ 邻位断 C-H
            </text>
            <text
              x={150}
              y={238}
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
      )}

      {/* 阶段 2：生成物稳态 — 真实的 2,4,6-三溴苯酚微观分子结构 */}
      {reactionStage === 2 && (
        <g transform="translate(250, 110)">
          {/* 苯环六边形 */}
          <polygon
            points="150,50 200,80 200,140 150,170 100,140 100,80"
            fill={withAlpha(colors.neutral[300], 0.3)}
            stroke={colors.neutral[700]}
            strokeWidth={3}
          />
          <circle
            cx={150}
            cy={110}
            r={32}
            fill="none"
            stroke={colors.neutral[400]}
            strokeWidth={2}
            strokeDasharray="4,4"
          />

          {/* 1号位酚羟基 -OH */}
          <line x1={150} y1={50} x2={150} y2={16} stroke={colors.neutral[600]} strokeWidth={3} />
          <circle cx={150} cy={-2} r={20} fill={ATOM_COLORS.oxygen} />
          <text x={150} y={4} textAnchor="middle" fill="#FFF" fontSize={font(FONT.axis)} fontWeight="bold">OH</text>

          {/* 2号位新取代的 Br (左上) */}
          <line x1={100} y1={80} x2={58} y2={56} stroke="#10B981" strokeWidth={4} />
          <circle cx={42} cy={46} r={20} fill="#10B981" />
          <text x={42} y={52} textAnchor="middle" fill="#FFF" fontSize={font(FONT.axis)} fontWeight="bold">Br</text>

          {/* 6号位新取代的 Br (右上) */}
          <line x1={200} y1={80} x2={242} y2={56} stroke="#10B981" strokeWidth={4} />
          <circle cx={258} cy={46} r={20} fill="#10B981" />
          <text x={258} y={52} textAnchor="middle" fill="#FFF" fontSize={font(FONT.axis)} fontWeight="bold">Br</text>

          {/* 4号位新取代的 Br (正下) */}
          <line x1={150} y1={170} x2={150} y2={212} stroke="#10B981" strokeWidth={4} />
          <circle cx={150} cy={228} r={20} fill="#10B981" />
          <text x={150} y={234} textAnchor="middle" fill="#FFF" fontSize={font(FONT.axis)} fontWeight="bold">Br</text>

          {/* 副产物 3 HBr */}
          <g transform="translate(285, 120)">
            <rect x={0} y={0} width={90} height={48} rx={8} fill={withAlpha(colors.neutral[300], 0.35)} stroke={colors.neutral[400]} strokeWidth={1} />
            <text x={45} y={20} textAnchor="middle" fill={colors.neutral[600]} fontSize={font(FONT.annotation)}>副产物</text>
            <text x={45} y={38} textAnchor="middle" fill={colors.neutral[800]} fontSize={font(FONT.small)} fontWeight="bold">+ 3 HBr</text>
          </g>

          {/* 底部结构解析徽章卡片 (防溢出) */}
          <g transform="translate(-70, 255)">
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
              y={28}
              textAnchor="middle"
              fill={colors.neutral[900]}
              fontSize={font(FONT.title)}
              fontWeight="bold"
            >
              生成物：2,4,6-三溴苯酚白色沉淀 ↓ + 3 HBr
            </text>
            <text
              x={240}
              y={54}
              textAnchor="middle"
              fill={CHEMISTRY_COLORS.concentration}
              fontSize={font(FONT.axis)}
            >
              ✓ 邻对位 2,4,6 位 C-H 键全取代，极化断裂并形成不溶性白色沉淀
            </text>
          </g>
        </g>
      )}
    </g>
  )
}
