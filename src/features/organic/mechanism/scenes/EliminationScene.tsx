import { colors, FONT, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import { ATOM_COLORS, BOND_COLORS, REACTION_COLORS } from '../constants'
import type { EliminationSceneProps } from '../types'

export function EliminationScene({ reactionStage, font, solventMode = 0 }: EliminationSceneProps) {
  const isSubstitution = solventMode === 1

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
        {isSubstitution
          ? '2-溴丁烷水解取代反应 (NaOH 水溶液加热 → 2-丁醇 + NaBr)'
          : '2-溴丁烷消去反应与扎伊采夫规则 (脱 HBr 生成 C=C)'}
      </text>

      {/* 阶段 0 与阶段 1：反应物与过渡态 */}
      {reactionStage < 2 && (
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
          y1={54}
          x2={234}
          y2={54}
          stroke={
            !isSubstitution && reactionStage === 2
              ? CHEMISTRY_COLORS.reactionRate
              : colors.neutral[400]
          }
          strokeWidth={!isSubstitution && reactionStage === 2 ? 4 : 3}
        />
        {!isSubstitution && reactionStage === 2 && (
          <line
            x1={176}
            y1={66}
            x2={234}
            y2={66}
            stroke={BOND_COLORS.formed}
            strokeWidth={3}
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
          {!isSubstitution && reactionStage === 2 ? 'CH' : 'CH₂'}
        </text>
        <text
          x={260}
          y={22}
          textAnchor="middle"
          fill={isSubstitution ? colors.neutral[500] : CHEMISTRY_COLORS.concentration}
          fontSize={font(FONT.annotation)}
          fontWeight="bold"
        >
          3号碳 (β₂-C, 2H)
        </text>

        {/* 3号碳上的 β-H */}
        {!isSubstitution && (
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
        )}
        {!isSubstitution && (
          <circle 
            cx={260} 
            cy={152} 
            r={18} 
            fill={ATOM_COLORS.hydrogen}
            stroke={reactionStage >= 1 ? BOND_COLORS.cleaved : undefined}
          />
        )}
        {!isSubstitution && (
          <text
            x={260}
            y={157}
            textAnchor="middle"
            fill="#333"
            fontSize={font(FONT.axis)}
            fontWeight="bold"
          >
            H
          </text>
        )}

        {/* 4号碳 (CH3) */}
        <line
          x1={286}
          y1={60}
          x2={336}
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
              width={180}
              height={70}
              rx={8}
              fill={withAlpha(REACTION_COLORS.cleavage, 0.15)}
              stroke={REACTION_COLORS.cleavage}
              strokeWidth={2}
              strokeDasharray="4,3"
            />
            <text
              x={90}
              y={24}
              textAnchor="middle"
              fill={REACTION_COLORS.cleavage}
              fontSize={font(FONT.annotation)}
              fontWeight="bold"
            >
              {isSubstitution ? '✂ 切断 C-Br 键 (亲核取代)' : '✂ 脱 HBr (脱含 H 少的 β-氢)'}
            </text>
            <text
              x={90}
              y={48}
              textAnchor="middle"
              fill={colors.neutral[700]}
              fontSize={font(11)}
            >
              {isSubstitution ? 'NaOH 水溶液, Δ (水解成醇)' : 'NaOH 醇溶液, Δ (消去成烯)'}
            </text>
          </g>
        )}
      </g>
      )}

      {/* 阶段 2：生成物稳态 — 真实的微观产物分子球棍结构 */}
      {reactionStage === 2 && (
        <g transform="translate(130, 130)">
          {!isSubstitution ? (
            /* 消去产物：2-丁烯 (CH3-CH=CH-CH3) + NaBr + H2O */
            <g>
              {/* 1号碳 CH3 */}
              <circle cx={70} cy={120} r={26} fill={ATOM_COLORS.carbon} />
              <text x={70} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.label)} fontWeight="bold">CH₃</text>

              {/* 单键 */}
              <line x1={96} y1={120} x2={152} y2={120} stroke={colors.neutral[400]} strokeWidth={4} />

              {/* 2号碳 CH */}
              <circle cx={180} cy={120} r={28} fill={ATOM_COLORS.carbon} />
              <text x={180} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.label)} fontWeight="bold">CH</text>

              {/* 核心双键 C=C (粗绿线高亮新形成的双键) */}
              <line x1={208} y1={114} x2={272} y2={114} stroke="#10B981" strokeWidth={4} />
              <line x1={208} y1={126} x2={272} y2={126} stroke={CHEMISTRY_COLORS.concentration} strokeWidth={4} />
              <text x={240} y={85} textAnchor="middle" fill="#10B981" fontSize={font(FONT.small)} fontWeight="bold">
                新形成 C=C 双键
              </text>

              {/* 3号碳 CH */}
              <circle cx={300} cy={120} r={28} fill={ATOM_COLORS.carbon} />
              <text x={300} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.label)} fontWeight="bold">CH</text>

              {/* 单键 */}
              <line x1={328} y1={120} x2={384} y2={120} stroke={colors.neutral[400]} strokeWidth={4} />

              {/* 4号碳 CH3 */}
              <circle cx={410} cy={120} r={26} fill={ATOM_COLORS.carbon} />
              <text x={410} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.label)} fontWeight="bold">CH₃</text>

              {/* 脱出的小分子 NaBr + H2O */}
              <g transform="translate(470, 95)">
                <rect x={0} y={0} width={110} height={48} rx={8} fill={withAlpha(colors.neutral[300], 0.35)} stroke={colors.neutral[400]} strokeWidth={1} />
                <text x={55} y={20} textAnchor="middle" fill={colors.neutral[600]} fontSize={font(FONT.annotation)}>脱出副产物</text>
                <text x={55} y={38} textAnchor="middle" fill={colors.neutral[800]} fontSize={font(FONT.small)} fontWeight="bold">NaBr + H₂O</text>
              </g>
            </g>
          ) : (
            /* 取代产物：2-丁醇 (CH3-CH(OH)-CH2-CH3) + NaBr */
            <g>
              {/* 1号碳 CH3 */}
              <circle cx={70} cy={120} r={26} fill={ATOM_COLORS.carbon} />
              <text x={70} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.label)} fontWeight="bold">CH₃</text>

              <line x1={96} y1={120} x2={152} y2={120} stroke={colors.neutral[400]} strokeWidth={4} />

              {/* 2号碳 CH */}
              <circle cx={180} cy={120} r={28} fill={ATOM_COLORS.carbon} />
              <text x={180} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.label)} fontWeight="bold">CH</text>

              {/* 新取代形成的 C-OH 键 */}
              <line x1={180} y1={92} x2={180} y2={42} stroke="#10B981" strokeWidth={4} />
              <circle cx={180} cy={20} r={22} fill={ATOM_COLORS.oxygen} />
              <text x={180} y={26} textAnchor="middle" fill="#FFF" fontSize={font(FONT.axis)} fontWeight="bold">OH</text>
              <text x={212} y={65} textAnchor="start" fill="#10B981" fontSize={font(FONT.small)} fontWeight="bold">
                新羟基取代生成
              </text>

              <line x1={208} y1={120} x2={272} y2={120} stroke={colors.neutral[400]} strokeWidth={4} />

              {/* 3号碳 CH2 */}
              <circle cx={300} cy={120} r={26} fill={ATOM_COLORS.carbon} />
              <text x={300} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.label)} fontWeight="bold">CH₂</text>

              <line x1={326} y1={120} x2={384} y2={120} stroke={colors.neutral[400]} strokeWidth={4} />

              {/* 4号碳 CH3 */}
              <circle cx={410} cy={120} r={26} fill={ATOM_COLORS.carbon} />
              <text x={410} y={126} textAnchor="middle" fill="#FFF" fontSize={font(FONT.label)} fontWeight="bold">CH₃</text>

              {/* 副产物 NaBr */}
              <g transform="translate(470, 95)">
                <rect x={0} y={0} width={100} height={48} rx={8} fill={withAlpha(colors.neutral[300], 0.35)} stroke={colors.neutral[400]} strokeWidth={1} />
                <text x={50} y={20} textAnchor="middle" fill={colors.neutral[600]} fontSize={font(FONT.annotation)}>无机产物</text>
                <text x={50} y={38} textAnchor="middle" fill={colors.neutral[800]} fontSize={font(FONT.small)} fontWeight="bold">NaBr</text>
              </g>
            </g>
          )}

          {/* 底部结构解析徽章卡片 (防溢出设计) */}
          <g transform="translate(10, 225)">
            <rect
              x={0}
              y={0}
              width={560}
              height={76}
              rx={12}
              fill={withAlpha(CHEMISTRY_COLORS.concentration, 0.08)}
              stroke={CHEMISTRY_COLORS.concentration}
              strokeWidth={1.5}
            />
            <text
              x={280}
              y={28}
              textAnchor="middle"
              fill={colors.neutral[900]}
              fontSize={font(FONT.title)}
              fontWeight="bold"
            >
              {isSubstitution
                ? '主产物：2-丁醇 (CH₃-CH(OH)-CH₂-CH₃) + NaBr'
                : '主产物 (80%)：2-丁烯 (CH₃-CH=CH-CH₃) + NaBr + H₂O'}
            </text>
            <text
              x={280}
              y={54}
              textAnchor="middle"
              fill={CHEMISTRY_COLORS.concentration}
              fontSize={font(FONT.axis)}
            >
              {isSubstitution
                ? '✓ 水解取代：OH⁻ 亲核进攻 α-C 取代 Br 形成醇 (醇出双键水出醇)'
                : '✓ 扎伊采夫规则：氢优先从含氢较少的 3号 β-C 脱去形成较稳定双键'}
            </text>
          </g>
        </g>
      )}
    </g>
  )
}
