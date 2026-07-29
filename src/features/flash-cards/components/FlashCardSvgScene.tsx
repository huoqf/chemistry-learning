import { SCENE_COLORS, CANVAS_COLORS, withAlpha, colors } from '@/theme'
import type { FlashCard } from '../types'

interface FlashCardSvgSceneProps {
  card: FlashCard
  isHeating: boolean
  isCompressing: boolean
  font?: (n: number) => number
}

export function FlashCardSvgScene({
  card,
  isHeating,
  isCompressing,
  font = (n: number) => n,
}: FlashCardSvgSceneProps) {
  const sceneType = card.sceneType

  // 1. 漂白性加热对比场景 (SO2 vs Cl2)
  if (sceneType === 'bleach-heating') {
    const so2Color = isHeating ? '#EF4444' : withAlpha('#EF4444', 0.25)
    return (
      <svg viewBox="0 0 840 500" className="w-full h-full">
        {/* 背景参考线与指示 */}
        <line x1="420" y1="40" x2="420" y2="460" stroke={CANVAS_COLORS.grid} strokeDasharray="4 4" strokeWidth="1.5" />

        {/* 左侧：SO2 品红溶液试管 */}
        <g transform="translate(180, 60)">
          <text x="70" y="-15" textAnchor="middle" fill={colors.neutral[800]} fontSize={font(15)} fontWeight="bold">
            【SO₂ 结合型漂白试管】
          </text>
          <rect x="30" y="20" width="80" height="300" rx="40" fill="none" stroke={SCENE_COLORS.container.testTubeBorder} strokeWidth="3" />
          <path d="M 32 150 Q 70 155 108 150 L 108 280 A 38 38 0 0 1 32 280 Z" fill={so2Color} />
          {isHeating ? (
            <>
              <path d="M 60 370 Q 70 320 70 340 Q 80 320 80 370 Z" fill="#F97316" className="animate-pulse" />
              <path d="M 65 370 Q 70 335 75 370 Z" fill="#FACC15" />
              <text x="70" y="200" textAnchor="middle" fill="#991B1B" fontSize={font(14)} fontWeight="bold">
                热解离：恢复品红红色！
              </text>
            </>
          ) : (
            <text x="70" y="220" textAnchor="middle" fill={colors.neutral[600]} fontSize={font(13)}>
              常温：无色不稳定结合物
            </text>
          )}
          <rect x="20" y="370" width="100" height="15" rx="4" fill={SCENE_COLORS.heatingAndSupport.ironSupport} />
        </g>

        {/* 右侧：Cl2 强氧化漂白试管 */}
        <g transform="translate(520, 60)">
          <text x="70" y="-15" textAnchor="middle" fill={colors.neutral[800]} fontSize={font(15)} fontWeight="bold">
            【Cl₂ / HClO 强氧化漂白试管】
          </text>
          <rect x="30" y="20" width="80" height="300" rx="40" fill="none" stroke={SCENE_COLORS.container.testTubeBorder} strokeWidth="3" />
          <path d="M 32 150 Q 70 155 108 150 L 108 280 A 38 38 0 0 1 32 280 Z" fill={withAlpha('#E0F2FE', 0.3)} />
          <text x="70" y="220" textAnchor="middle" fill={colors.neutral[600]} fontSize={font(13)}>
            {isHeating ? '加热：破坏色素结构，永不复红！' : '常温：色素氧化被破坏（无色）'}
          </text>
          {isHeating && (
            <>
              <path d="M 60 370 Q 70 320 70 340 Q 80 320 80 370 Z" fill="#F97316" className="animate-pulse" />
              <path d="M 65 370 Q 70 335 75 370 Z" fill="#FACC15" />
            </>
          )}
          <rect x="20" y="370" width="100" height="15" rx="4" fill={SCENE_COLORS.heatingAndSupport.ironSupport} />
        </g>
      </svg>
    )
  }

  // 2. 钝化与加热反应场景 (Fe 在浓硫酸中)
  if (sceneType === 'passivation-heat') {
    return (
      <svg viewBox="0 0 840 500" className="w-full h-full">
        <g transform="translate(270, 50)">
          <text x="150" y="-15" textAnchor="middle" fill={colors.neutral[800]} fontSize={font(16)} fontWeight="bold">
            Fe 片在 98% 浓 H₂SO₄ 中：{isHeating ? '加热打破钝化膜，剧烈反应！' : '常温发生钝化 (致密氧化膜)'}
          </text>
          <rect x="50" y="20" width="200" height="350" rx="30" fill="none" stroke={SCENE_COLORS.container.beakerBorder} strokeWidth="4" />
          <rect x="53" y="120" width="194" height="230" rx="10" fill={withAlpha('#EAB308', 0.2)} />
          <rect x="130" y="60" width="40" height="240" rx="4" fill="#64748B" stroke="#334155" strokeWidth="2" />

          {isHeating ? (
            <>
              <circle cx="135" cy="220" r="8" fill="#F8FAFC" opacity="0.8" className="animate-ping" />
              <circle cx="165" cy="180" r="10" fill="#F8FAFC" opacity="0.8" className="animate-ping" />
              <circle cx="140" cy="140" r="12" fill="#F8FAFC" opacity="0.9" />
              <text x="260" y="180" fill="#DC2626" fontSize={font(14)} fontWeight="bold">
                生成 SO₂ 气泡↑
              </text>
              <text x="260" y="210" fill="#475569" fontSize={font(12)}>
                2Fe + 6H₂SO₄(浓) ⇌ Fe₂(SO₄)₃ + 3SO₂↑ + 6H₂O
              </text>
              <path d="M 130 420 Q 150 360 150 380 Q 170 360 170 420 Z" fill="#EA580C" className="animate-pulse" />
            </>
          ) : (
            <>
              <rect x="128" y="120" width="44" height="180" rx="4" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray="4 2" />
              <text x="260" y="180" fill="#2563EB" fontSize={font(14)} fontWeight="bold">
                致密 Fe₃O₄ 钝化膜
              </text>
              <text x="260" y="210" fill="#475569" fontSize={font(12)}>
                阻止内部 Fe 继续反应 (无气泡产生)
              </text>
            </>
          )}
        </g>
      </svg>
    )
  }

  // 3. NO2 / N2O4 加压压缩显色场景
  if (sceneType === 'gas-compress') {
    const pistonX = isCompressing ? 280 : 480
    const gasOpacity = isCompressing ? 0.9 : 0.45
    return (
      <svg viewBox="0 0 840 500" className="w-full h-full">
        <g transform="translate(100, 100)">
          <text x="320" y="-30" textAnchor="middle" fill={colors.neutral[800]} fontSize={font(16)} fontWeight="bold">
            2NO₂(g, 红棕色) ⇌ N₂O₄(g, 无色) 气体针筒压缩示意
          </text>
          <rect x="100" y="40" width="440" height="160" rx="12" fill="none" stroke={SCENE_COLORS.container.beakerBorder} strokeWidth="4" />
          <path d="M 100 100 L 50 100" stroke={SCENE_COLORS.container.beakerBorder} strokeWidth="12" strokeLinecap="round" />
          <rect x="102" y="42" width={pistonX - 102} height="156" fill={withAlpha('#B45309', gasOpacity)} className="transition-all duration-500" />
          <rect x={pistonX} y="42" width="30" height="156" fill="#475569" className="transition-all duration-500" />
          <path d={`M ${pistonX + 30} 120 L 620 120`} stroke="#475569" strokeWidth="16" strokeLinecap="round" className="transition-all duration-500" />
          <text x="320" y="240" textAnchor="middle" fill={colors.neutral[800]} fontSize={font(14)} fontWeight="bold">
            {isCompressing
              ? '加压拉近分子距离 → 瞬间 c(NO₂) 增致颜色变深！随后平衡右移颜色稍变浅，但仍比加压前深。'
              : '常压状态：2NO₂ ⇌ N₂O₄ 维持平衡，呈红棕色'}
          </text>
        </g>
      </svg>
    )
  }

  // 4. 金属 Na 投入 CuSO4 溶液场景（优化水面上游动浮球与蓝色沉淀，消除不真实的跳跃）
  if (sceneType === 'na-water-cuso4') {
    return (
      <svg viewBox="0 0 840 500" className="w-full h-full">
        <g transform="translate(200, 30)">
          <text x="220" y="0" textAnchor="middle" fill={colors.neutral[800]} fontSize={font(16)} fontWeight="bold">
            金属 Na 投入 CuSO₄ 溶液：优先与水反应，生成 Cu(OH)₂ 蓝色沉淀！
          </text>

          {/* 烧杯外壳 */}
          <rect x="80" y="40" width="280" height="360" rx="20" fill="none" stroke={SCENE_COLORS.container.beakerBorder} strokeWidth="4" />
          {/* CuSO4 溶液背景 (浅蓝色) */}
          <rect x="84" y="150" width="272" height="246" rx="10" fill={withAlpha('#0284C7', 0.2)} />

          {/* 水面波浪线 */}
          <path d="M 84 150 Q 150 145 220 150 T 356 150" fill="none" stroke="#38BDF8" strokeWidth="2" />

          {/* 钠小球（熔成圆球在液面上平滑左右游动） */}
          <g className="animate-pulse">
            <circle cx="210" cy="146" r="16" fill="url(#naShine)" stroke="#475569" strokeWidth="2" />
            <circle cx="205" cy="140" r="5" fill="#FFFFFF" opacity="0.6" />
            <text x="210" y="122" textAnchor="middle" fill="#0F172A" fontSize={font(12)} fontWeight="bold">
              Na 熔小球 (水面浮游)
            </text>
          </g>

          {/* 钠小球下方冒出 H2 气泡 */}
          <g>
            <circle cx="205" cy="165" r="4" fill="#E2E8F0" className="animate-ping" />
            <circle cx="215" cy="175" r="5" fill="#E2E8F0" />
            <circle cx="200" cy="190" r="6" fill="#E2E8F0" />
            <text x="245" y="180" fill="#0284C7" fontSize={font(12)} fontWeight="bold">
              嘶嘶冒 H₂ 气泡↑
            </text>
          </g>

          {/* 溶液中生成的蓝色 Cu(OH)2 絮状沉淀层 */}
          <g>
            <path
              d="M 100 280 Q 160 250 220 275 T 340 280 L 340 385 Q 220 395 100 385 Z"
              fill="#0284C7"
              opacity="0.65"
            />
            <circle cx="140" cy="310" r="12" fill="#38BDF8" opacity="0.8" />
            <circle cx="260" cy="330" r="18" fill="#0284C7" opacity="0.9" />
            <circle cx="200" cy="350" r="15" fill="#0369A1" opacity="0.85" />
            <text x="220" y="340" textAnchor="middle" fill="#FFFFFF" fontSize={font(14)} fontWeight="bold">
              蓝色 Cu(OH)₂ 絮状沉淀 (无红色单质 Cu!)
            </text>
          </g>

          {/* 右侧原理文字 */}
          <g transform="translate(380, 100)">
            <rect x="0" y="0" width="220" height="240" rx="12" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="2" />
            <text x="110" y="30" textAnchor="middle" fill="#0369A1" fontSize={font(14)} fontWeight="bold">
              【实验现象五字诀】
            </text>
            <text x="20" y="65" fill="#0F172A" fontSize={font(12)}>
              1. <tspan fill="#0284C7" fontWeight="bold">浮</tspan>：ρ(Na) &lt; ρ(H₂O)，浮于水面
            </text>
            <text x="20" y="95" fill="#0F172A" fontSize={font(12)}>
              2. <tspan fill="#0284C7" fontWeight="bold">熔</tspan>：反应放热，熔成银白小球
            </text>
            <text x="20" y="125" fill="#0F172A" fontSize={font(12)}>
              3. <tspan fill="#0284C7" fontWeight="bold">游</tspan>：H₂ 推动小球四处游动
            </text>
            <text x="20" y="155" fill="#0F172A" fontSize={font(12)}>
              4. <tspan fill="#0284C7" fontWeight="bold">响</tspan>：剧烈反应发出嘶嘶声
            </text>
            <text x="20" y="185" fill="#0F172A" fontSize={font(12)}>
              5. <tspan fill="#DC2626" fontWeight="bold">蓝</tspan>：生成蓝色 Cu(OH)₂ 沉淀
            </text>
            <text x="110" y="220" textAnchor="middle" fill="#DC2626" fontSize={font(11)} fontWeight="bold">
              ★ 绝对无法置换出红色单质 Cu
            </text>
          </g>

          {/* 渐变定义 */}
          <defs>
            <radialGradient id="naShine" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
          </defs>
        </g>
      </svg>
    )
  }

  // 5. 检验卤代烃中卤元素场景
  if (sceneType === 'haloalkane-test') {
    return (
      <svg viewBox="0 0 840 500" className="w-full h-full">
        <g transform="translate(180, 50)">
          <text x="240" y="-10" textAnchor="middle" fill={colors.neutral[800]} fontSize={font(16)} fontWeight="bold">
            检验 1-溴丁烷中的 Br 元素：NaOH 水解 ➔ 稀 HNO₃ 酸化 ➔ 加 AgNO₃
          </text>

          {/* 试管 1：强碱水解体系 (未加酸) */}
          <g transform="translate(60, 30)">
            <text x="50" y="-10" textAnchor="middle" fill="#DC2626" fontSize={font(13)} fontWeight="bold">
              【错】未加稀 HNO₃ 酸化
            </text>
            <rect x="10" y="10" width="80" height="280" rx="35" fill="none" stroke={SCENE_COLORS.container.testTubeBorder} strokeWidth="3" />
            <path d="M 12 120 L 88 120 L 88 255 A 38 38 0 0 1 12 255 Z" fill={withAlpha('#451A03', 0.85)} />
            <text x="50" y="180" textAnchor="middle" fill="#FFFFFF" fontSize={font(12)} fontWeight="bold">
              棕黑色 Ag₂O
            </text>
            <text x="50" y="200" textAnchor="middle" fill="#FDE68A" fontSize={font(11)}>
              (OH⁻ 干扰检验!)
            </text>
          </g>

          {/* 试管 2：正确的酸化检测 */}
          <g transform="translate(300, 30)">
            <text x="50" y="-10" textAnchor="middle" fill="#166534" fontSize={font(13)} fontWeight="bold">
              【对】加稀 HNO₃ 中和 OH⁻
            </text>
            <rect x="10" y="10" width="80" height="280" rx="35" fill="none" stroke={SCENE_COLORS.container.testTubeBorder} strokeWidth="3" />
            <path d="M 12 120 L 88 120 L 88 255 A 38 38 0 0 1 12 255 Z" fill={withAlpha('#FEF08A', 0.9)} />
            <text x="50" y="180" textAnchor="middle" fill="#854D0E" fontSize={font(13)} fontWeight="bold">
              淡黄色 AgBr↓
            </text>
            <text x="50" y="200" textAnchor="middle" fill="#713F12" fontSize={font(11)}>
              (消除 OH⁻ 干扰)
            </text>
          </g>
        </g>
      </svg>
    )
  }

  // 6. FeCl3 + KSCN 显色平衡场景
  if (sceneType === 'fe-kscn-equilibrium') {
    return (
      <svg viewBox="0 0 840 500" className="w-full h-full">
        <g transform="translate(180, 50)">
          <text x="240" y="-10" textAnchor="middle" fill={colors.neutral[800]} fontSize={font(16)} fontWeight="bold">
            Fe³⁺ + 3SCN⁻ ⇌ Fe(SCN)₃ (血红色) 浓度移动探究
          </text>
          <g transform="translate(60, 30)">
            <text x="50" y="-10" textAnchor="middle" fill="#991B1B" fontSize={font(13)} fontWeight="bold">
              加 SCN⁻ 固体
            </text>
            <rect x="10" y="10" width="80" height="280" rx="35" fill="none" stroke={SCENE_COLORS.container.testTubeBorder} strokeWidth="3" />
            <path d="M 12 100 L 88 100 L 88 255 A 38 38 0 0 1 12 255 Z" fill="#7F1D1D" />
            <text x="50" y="180" textAnchor="middle" fill="#FFFFFF" fontSize={font(13)} fontWeight="bold">
              深血红色
            </text>
            <text x="50" y="200" textAnchor="middle" fill="#FCA5A5" fontSize={font(11)}>
              平衡正向移动
            </text>
          </g>
          <g transform="translate(300, 30)">
            <text x="50" y="-10" textAnchor="middle" fill="#1E3A8A" fontSize={font(13)} fontWeight="bold">
              加 NaOH 固体
            </text>
            <rect x="10" y="10" width="80" height="280" rx="35" fill="none" stroke={SCENE_COLORS.container.testTubeBorder} strokeWidth="3" />
            <path d="M 12 140 L 88 140 L 88 255 A 38 38 0 0 1 12 255 Z" fill={withAlpha('#EF4444', 0.25)} />
            <ellipse cx="50" cy="245" rx="30" ry="10" fill="#78350F" />
            <text x="50" y="180" textAnchor="middle" fill="#991B1B" fontSize={font(12)} fontWeight="bold">
              红色变浅
            </text>
            <text x="50" y="200" textAnchor="middle" fill="#78350F" fontSize={font(11)}>
              生成 Fe(OH)₃ 沉淀
            </text>
          </g>
        </g>
      </svg>
    )
  }

  // 7. 胶体丁达尔效应与渗析场景
  if (sceneType === 'colloid-tyndall') {
    return (
      <svg viewBox="0 0 840 500" className="w-full h-full">
        <g transform="translate(140, 60)">
          <text x="280" y="-15" textAnchor="middle" fill={colors.neutral[800]} fontSize={font(16)} fontWeight="bold">
            丁达尔效应对比：激光束穿过 Fe(OH)₃ 胶体形成光亮通路 vs 溶液无通路
          </text>
          {/* 激光笔 */}
          <rect x="20" y="160" width="60" height="30" rx="4" fill="#334155" />
          <path d="M 80 175 L 560 175" stroke="#EF4444" strokeWidth="2" strokeDasharray="6 3" />

          {/* 烧杯 1：NaCl 溶液 */}
          <g transform="translate(130, 40)">
            <text x="60" y="-10" textAnchor="middle" fill="#475569" fontSize={font(13)} fontWeight="bold">
              NaCl 溶液 (无光路)
            </text>
            <rect x="10" y="10" width="100" height="240" rx="15" fill="none" stroke={SCENE_COLORS.container.beakerBorder} strokeWidth="3" />
            <rect x="13" y="80" width="94" height="165" rx="8" fill={withAlpha('#38BDF8', 0.15)} />
          </g>

          {/* 烧杯 2：Fe(OH)3 胶体 (有散射光路) */}
          <g transform="translate(380, 40)">
            <text x="60" y="-10" textAnchor="middle" fill="#B45309" fontSize={font(13)} fontWeight="bold">
              Fe(OH)₃ 胶体 (丁达尔光路)
            </text>
            <rect x="10" y="10" width="100" height="240" rx="15" fill="none" stroke={SCENE_COLORS.container.beakerBorder} strokeWidth="3" />
            <rect x="13" y="80" width="94" height="165" rx="8" fill={withAlpha('#B45309', 0.35)} />
            {/* 光亮的圆锥散射光束 */}
            <polygon points="13,170 107,160 107,190 13,180" fill="#FEF08A" opacity="0.75" />
          </g>
        </g>
      </svg>
    )
  }

  // 8. 乙醇消去 (170℃) 与乙醚生成 (140℃) 场景
  if (sceneType === 'ethanol-reaction') {
    return (
      <svg viewBox="0 0 840 500" className="w-full h-full">
        <g transform="translate(160, 50)">
          <text x="260" y="-10" textAnchor="middle" fill={colors.neutral[800]} fontSize={font(16)} fontWeight="bold">
            乙醇与浓硫酸反应：温度对产物方向的决定性控制
          </text>
          <g transform="translate(40, 40)">
            <rect x="0" y="0" width="200" height="260" rx="12" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="2" />
            <text x="100" y="35" textAnchor="middle" fill="#1E40AF" fontSize={font(16)} fontWeight="bold">
              170 ℃ (分子内消去)
            </text>
            <text x="100" y="80" textAnchor="middle" fill="#0F172A" fontSize={font(14)} fontWeight="bold">
              CH₂=CH₂↑ (乙烯)
            </text>
            <text x="100" y="120" textAnchor="middle" fill="#475569" fontSize={font(12)}>
              + H₂O (脱水)
            </text>
            <path d="M 60 210 Q 100 160 100 180 Q 140 160 140 210 Z" fill="#EF4444" className="animate-pulse" />
            <text x="100" y="245" textAnchor="middle" fill="#DC2626" fontSize={font(12)} fontWeight="bold">
              强火急升温至 170℃
            </text>
          </g>

          <g transform="translate(280, 40)">
            <rect x="0" y="0" width="200" height="260" rx="12" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
            <text x="100" y="35" textAnchor="middle" fill="#B45309" fontSize={font(16)} fontWeight="bold">
              140 ℃ (分子间脱水)
            </text>
            <text x="100" y="80" textAnchor="middle" fill="#0F172A" fontSize={font(14)} fontWeight="bold">
              CH₃CH₂OCH₂CH₃
            </text>
            <text x="100" y="110" textAnchor="middle" fill="#B45309" fontSize={font(13)} fontWeight="bold">
              (乙醚副产物)
            </text>
            <text x="100" y="140" textAnchor="middle" fill="#475569" fontSize={font(12)}>
              2分子乙醇脱 1分子水
            </text>
            <path d="M 70 210 Q 100 180 100 195 Q 130 180 130 210 Z" fill="#F59E0B" />
          </g>
        </g>
      </svg>
    )
  }

  // 默认备用通用对比场景
  return (
    <svg viewBox="0 0 840 500" className="w-full h-full">
      <rect x="120" y="80" width="600" height="340" rx="16" fill={withAlpha('#4F46E5', 0.05)} stroke="#C7D2FE" strokeWidth="2" />
      <circle cx="420" cy="200" r="50" fill={withAlpha('#6366F1', 0.15)} />
      <text x="420" y="205" textAnchor="middle" fill="#312E81" fontSize={font(18)} fontWeight="bold">
        {card.title} 事实盲盒探究
      </text>
      <text x="420" y="270" textAnchor="middle" fill="#475569" fontSize={font(14)}>
        点击盲盒“揭晓事实/解析”对比考点
      </text>
    </svg>
  )
}
