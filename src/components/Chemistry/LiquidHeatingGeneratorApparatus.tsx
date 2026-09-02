import React from 'react'
import { SCENE_COLORS, CHEMISTRY_COLORS, withAlpha, STROKE } from '@/theme'
import type { FontScaler } from '@/theme'
import { DistillationFlaskApparatus } from './DistillationFlaskApparatus'
import { getDistillationFlaskPorts } from './apparatusPorts'
import { AlcoholLampApparatus } from './AlcoholLampApparatus'
import { SeparatoryFunnelApparatus } from './SeparatoryFunnelApparatus'
import { ThermometerApparatus } from './ThermometerApparatus'

export interface LiquidHeatingGeneratorApparatusProps {
  /** 基准中心坐标 x (Design Space) */
  x: number
  /** 基准桌面底线坐标 y (baseY) */
  y: number
  /** 是否正在加热 (酒精灯点燃) */
  heating?: boolean
  /** 是否为乙烯实验 (C₂H₄: 需装配 170°C 温度计，无分液漏斗) */
  isEthylene?: boolean
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * LiquidHeatingGeneratorApparatus — 固-液加热蒸馏烧瓶发生装置 (高保真复合器材组)
 *
 * 规范封装：
 * - 铁架台底座位于左侧，绝对不与酒精灯/烧瓶穿透
 * - 铁架台铁圈水平托住石棉网，酒精灯外焰顶端相切于石棉网底部
 * - 蒸馏烧瓶平立于石棉网上，铁夹夹持于瓶颈 1/3 处
 * - 规范区分常规滴加 (分液漏斗) 与 乙烯制备 (170°C 浸没水银球温度计)
 */
export const LiquidHeatingGeneratorApparatus: React.FC<LiquidHeatingGeneratorApparatusProps> = ({
  x,
  y,
  heating = true,
  isEthylene = false,
}) => {
  // ── 核心几何常量（人教版教材标准正交装配一体化）──────────────────────
  // 1. 铁架台大铸铁底座：平铺桌面 (baseY)，长 135px，厚 10px，统一承托立柱与酒精灯
  const BASE_H = 10
  const BASE_Y = y - BASE_H                      // 铸铁底板上表面 Y 坐标
  const baseLeftX = x - 75
  const baseWidth = 135                          // 覆盖 [x-75, x+60]，酒精灯坐于其上

  // 2. 酒精灯：稳平放置于铸铁底座上表面 (BASE_Y)，外焰顶端精准相切石棉网底面
  const GAUZE_Y = y - 86                         // 石棉网顶面
  const GAUZE_H = 6                              // 石棉网厚度
  const LAMP_H = Math.round((BASE_Y - 6 - GAUZE_Y) / 1.13) // 自适应高度
  const LAMP_W = 68
  const lampX = x - LAMP_W / 2
  const lampY = BASE_Y - LAMP_H                  // 灯底精准落在铸铁底座上表面！

  // 3. 蒸馏烧瓶：圆底立于石棉网顶面
  const FLASK_W = 90
  const FLASK_H = 140
  const FLASK_NECK_H = FLASK_H * 0.4             // 56
  const FLASK_BULB_R = FLASK_W * 0.42            // 37.8 (球体左边缘在 x - 37.8)
  const FLASK_HALF_NECK = (FLASK_W * 0.28) / 2   // 12.6
  const FLASK_CENTER_DY = Math.sqrt(FLASK_BULB_R ** 2 - FLASK_HALF_NECK ** 2)
  const FLASK_VISUAL_H = FLASK_NECK_H + FLASK_CENTER_DY + FLASK_BULB_R
  const flaskX = x - FLASK_W / 2
  const flaskY = GAUZE_Y - FLASK_VISUAL_H
  const flaskPorts = getDistillationFlaskPorts(flaskX, flaskY, FLASK_W, FLASK_H)

  // 4. 铁架台立柱：中心锁定在 x - 50（位于烧瓶球体左外侧 12.2px，绝对不会刺穿玻璃！）
  const poleCenterX = x - 50
  const poleTopY = flaskY - 25
  const poleHeight = y - poleTopY

  // 5. 铁夹：横臂从立柱向右平伸 37px，在支管口上方（flaskY + 11）夹紧细颈两侧
  const clampY = flaskY + 11
  const armLength = (x - FLASK_HALF_NECK) - poleCenterX // 50 - 12.6 = 37.4px

  // 6. 分液漏斗：活塞高出橡皮塞 25px，细长下管深插瓶颈 28px，45° 尖嘴贴壁
  const FUNNEL_W = 75
  const FUNNEL_H = 150
  const funnelX = flaskPorts.topNeckPort.x - FUNNEL_W / 2
  const funnelY = flaskPorts.topNeckPort.y - FUNNEL_H + 28

  return (
    <g id="liquid-heating-generator-group">
      {/* ── 1. 铸铁底座 (平铺桌面，承托全套器材) ── */}
      <rect
        x={baseLeftX}
        y={BASE_Y}
        width={baseWidth}
        height={BASE_H}
        rx={2}
        fill={SCENE_COLORS.heatingAndSupport.ironSupport}
        stroke={SCENE_COLORS.materials.iron}
        strokeWidth={STROKE.objectLine}
      />
      {/* 防滑垫片 */}
      <rect x={baseLeftX + 4} y={y - 2} width={10} height={2} fill="#0F172A" />
      <rect x={baseLeftX + baseWidth - 14} y={y - 2} width={10} height={2} fill="#0F172A" />

      {/* ── 2. 竖立铁杆 (位于烧瓶球体左外侧，绝不穿模) ── */}
      <rect
        x={poleCenterX - 3}
        y={poleTopY}
        width={6}
        height={poleHeight - BASE_H}
        rx={1}
        fill={SCENE_COLORS.heatingAndSupport.ironSupport}
        stroke={SCENE_COLORS.materials.iron}
        strokeWidth={STROKE.reference}
      />

      {/* ── 3. 铁夹机构 (十字紧固扣 + 水平金属横臂 + 暗红胶套双爪紧扣瓶颈) ── */}
      <g transform={`translate(${poleCenterX}, ${clampY})`}>
        {/* 十字紧固扣 (Bosshead) */}
        <rect x={-6} y={-6} width={12} height={12} rx={2} fill="#334155" stroke="#1E293B" strokeWidth={1} />
        <circle cx={-8} cy={0} r={2.5} fill="#475569" stroke="#0F172A" strokeWidth={0.8} />

        {/* 水平金属横臂 */}
        <line x1={0} y1={0} x2={armLength} y2={0} stroke={SCENE_COLORS.heatingAndSupport.ironRing} strokeWidth={STROKE.objectLine} />

        {/* 双爪紧扣瓶颈垂直段 */}
        <g transform={`translate(${armLength}, 0)`}>
          {/* 上爪 */}
          <path d="M -6,-2 L 0,-9 L 13,-12" fill="none" stroke="#334155" strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 2,-9 L 13,-12" fill="none" stroke="#7F1D1D" strokeWidth={4} strokeLinecap="round" />
          {/* 下爪 */}
          <path d="M -6,2 L 0,9 L 13,12" fill="none" stroke="#334155" strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 2,9 L 13,12" fill="none" stroke="#7F1D1D" strokeWidth={4} strokeLinecap="round" />
          {/* 紧固螺钉 */}
          <rect x={-3} y={-4} width={4} height={8} rx={1} fill="#64748B" stroke="#1E293B" strokeWidth={0.8} />
        </g>
      </g>

      {/* ── 4. 铁圈与横杆 (从立柱伸出，水平托住石棉网) ── */}
      <line
        x1={poleCenterX}
        y1={GAUZE_Y}
        x2={x + 48}
        y2={GAUZE_Y}
        stroke={SCENE_COLORS.materials.iron}
        strokeWidth={3}
      />
      {/* 铁圈十字紧固扣 */}
      <rect x={poleCenterX - 5} y={GAUZE_Y - 5} width={10} height={10} rx={1.5} fill="#334155" stroke="#1E293B" strokeWidth={0.8} />

      {/* ── 5. 石棉网 (覆盖烧瓶底部) ── */}
      <rect
        x={x - 46}
        y={GAUZE_Y}
        width={92}
        height={GAUZE_H}
        fill={SCENE_COLORS.materials.asbestos}
        rx={1}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.reference}
      />
      <line
        x1={x - 46}
        y1={GAUZE_Y + 3}
        x2={x + 46}
        y2={GAUZE_Y + 3}
        stroke={SCENE_COLORS.labels.chemicalFormula}
        strokeDasharray="2 2"
      />

      {/* ── 6. 酒精灯 (平稳坐于铸铁底板之上，外焰加热石棉网) ── */}
      <AlcoholLampApparatus
        x={lampX}
        y={lampY}
        width={LAMP_W}
        height={LAMP_H}
        lit={heating}
      />

      {/* 4. 蒸馏烧瓶（底部精准落在石棉网顶面）*/}
      <DistillationFlaskApparatus
        x={flaskX}
        y={flaskY}
        width={FLASK_W}
        height={FLASK_H}
        fillLevel={isEthylene ? 0.55 : 0.45}
        fillColor={withAlpha(CHEMISTRY_COLORS.concentration, 0.4)}
      />

      {/* 4.1 高考经典必考考点：烧瓶底部加几粒碎瓷片/沸石 (防止液体暴沸) */}
      <g id="boiling-stones" opacity={0.85}>
        <polygon
          points={`${x - 12},${GAUZE_Y - 3} ${x - 7},${GAUZE_Y - 9} ${x - 3},${GAUZE_Y - 4}`}
          fill={SCENE_COLORS.materials.asbestos}
          stroke={SCENE_COLORS.container.beakerBorder}
          strokeWidth={0.8}
        />
        <polygon
          points={`${x + 2},${GAUZE_Y - 3} ${x + 6},${GAUZE_Y - 8} ${x + 11},${GAUZE_Y - 3}`}
          fill={SCENE_COLORS.materials.iron}
          stroke={SCENE_COLORS.container.beakerBorder}
          strokeWidth={0.8}
        />
        <polygon
          points={`${x - 3},${GAUZE_Y - 5} ${x},${GAUZE_Y - 11} ${x + 4},${GAUZE_Y - 6}`}
          fill={SCENE_COLORS.stopper.rubberStopper}
          stroke={SCENE_COLORS.container.beakerBorder}
          strokeWidth={0.8}
        />
      </g>



      {/* 6. 上部：乙烯用温度计 (170°C 水银球完全浸没在反应液中央，距离烧瓶底悬空 10.4px)，常规用分液漏斗 */}
      {isEthylene ? (
        <g transform={`translate(${flaskPorts.topNeckPort.x}, ${flaskPorts.topNeckPort.y - 56})`}>
          <ThermometerApparatus x={0} y={0} tempValue={170} height={175} />
        </g>
      ) : (
        <SeparatoryFunnelApparatus
          x={funnelX}
          y={funnelY}
          width={FUNNEL_W}
          height={FUNNEL_H}
          bottomFillLevel={0.7}
          bottomFillColor={withAlpha(SCENE_COLORS.reagent.solution, 0.2)}
        />
      )}
    </g>
  )
}
