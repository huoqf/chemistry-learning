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

      {/* 阶段 0 与阶段 1：反应物与缩合过渡态 */}
      {reactionStage < 2 && (
        <>
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

        {/* 羧基 C=O 双键与氧 */}
        <line
          x1={216}
          y1={36}
          x2={216}
          y2={10}
          stroke={ATOM_COLORS.oxygen}
          strokeWidth={3}
        />
        <line
          x1={224}
          y1={36}
          x2={224}
          y2={10}
          stroke={ATOM_COLORS.oxygen}
          strokeWidth={3}
        />
        <circle cx={220} cy={-2} r={18} fill={ATOM_COLORS.oxygen} />
        <text
          x={220}
          y={3}
          textAnchor="middle"
          fill="#FFF"
          fontSize={font(FONT.small)}
          fontWeight="bold"
        >
          O
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
        </>
      )}

      {/* 阶段 2：生成物稳态 — 真实的甘丙二肽微观分子球棍模型 */}
      {reactionStage === 2 && (
        <g transform="translate(100, 130)">
          {/* 甘氨酸残基：H2N */}
          <circle cx={40} cy={120} r={24} fill={ATOM_COLORS.nitrogen} />
          <text x={40} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.label)} fontWeight="bold">H₂N</text>

          <line x1={64} y1={120} x2={116} y2={120} stroke={colors.neutral[400]} strokeWidth={3.5} />

          {/* CH2 */}
          <circle cx={140} cy={120} r={24} fill={ATOM_COLORS.carbon} />
          <text x={140} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.label)} fontWeight="bold">CH₂</text>

          <line x1={164} y1={120} x2={216} y2={120} stroke={colors.neutral[400]} strokeWidth={3.5} />

          {/* 肽键羰基碳 C=O */}
          <circle cx={240} cy={120} r={26} fill={ATOM_COLORS.carbon} />
          <text x={240} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.label)} fontWeight="bold">C</text>

          <line x1={240} y1={94} x2={240} y2={38} stroke="#EF4444" strokeWidth={4} />
          <circle cx={240} cy={16} r={22} fill={ATOM_COLORS.oxygen} />
          <text x={240} y={22} textAnchor="middle" fill="#FFF" fontSize={font(FONT.axis)} fontWeight="bold">O</text>

          {/* 核心新形成肽键 C-N (红色粗线高亮) */}
          <line x1={266} y1={120} x2={324} y2={120} stroke="#EF4444" strokeWidth={5} />
          <text x={295} y={80} textAnchor="middle" fill="#EF4444" fontSize={font(FONT.small)} fontWeight="bold">
            新形成肽键 (-CO-NH-)
          </text>

          {/* 肽键氮原子 NH */}
          <circle cx={350} cy={120} r={26} fill={ATOM_COLORS.nitrogen} />
          <text x={350} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.axis)} fontWeight="bold">NH</text>

          <line x1={376} y1={120} x2={424} y2={120} stroke={colors.neutral[400]} strokeWidth={3.5} />

          {/* 丙氨酸残基：CH(CH3) */}
          <circle cx={450} cy={120} r={24} fill={ATOM_COLORS.carbon} />
          <text x={450} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.axis)} fontWeight="bold">CH</text>

          {/* 侧链 CH3 */}
          <line x1={450} y1={96} x2={450} y2={50} stroke={colors.neutral[400]} strokeWidth={3} />
          <circle cx={450} cy={28} r={22} fill={ATOM_COLORS.carbon} />
          <text x={450} y={34} textAnchor="middle" fill="#FFF" fontSize={font(FONT.annotation)} fontWeight="bold">CH₃</text>

          <line x1={474} y1={120} x2={526} y2={120} stroke={colors.neutral[400]} strokeWidth={3.5} />

          {/* 羧基 COOH */}
          <circle cx={550} cy={120} r={24} fill={ATOM_COLORS.carbon} />
          <text x={550} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.small)} fontWeight="bold">COOH</text>

          {/* 副产物脱出的水分子 */}
          <g transform="translate(595, 95)">
            <rect x={0} y={0} width={85} height={48} rx={8} fill={withAlpha(colors.neutral[300], 0.35)} stroke={colors.neutral[400]} strokeWidth={1} />
            <text x={42} y={20} textAnchor="middle" fill={colors.neutral[600]} fontSize={font(FONT.annotation)}>缩合脱水</text>
            <text x={42} y={38} textAnchor="middle" fill={colors.neutral[800]} fontSize={font(FONT.small)} fontWeight="bold">+ H₂O</text>
          </g>

          {/* 底部结构解析徽章卡片 (文字防溢出) */}
          <g transform="translate(10, 225)">
            <rect
              x={0}
              y={0}
              width={620}
              height={76}
              rx={12}
              fill={withAlpha(CHEMISTRY_COLORS.pH, 0.08)}
              stroke={CHEMISTRY_COLORS.pH}
              strokeWidth={1.5}
            />
            <text
              x={310}
              y={28}
              textAnchor="middle"
              fill={colors.neutral[900]}
              fontSize={font(FONT.title)}
              fontWeight="bold"
            >
              生成甘丙二肽：H₂N-CH₂-<tspan fill="#EF4444" fontWeight="bold">CO-NH</tspan>-CH(CH₃)-COOH + H₂O
            </text>
            <text
              x={310}
              y={54}
              textAnchor="middle"
              fill={CHEMISTRY_COLORS.pH}
              fontSize={font(FONT.axis)}
            >
              ✓ 羧基脱 -OH、氨基脱 -H 形成 -CO-NH- (肽键)；水解时断裂 C-N 单键
            </text>
          </g>
        </g>
      )}
    </g>
  )
}
