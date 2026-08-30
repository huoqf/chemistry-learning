import React from 'react'
import { SCENE_COLORS, CHEMISTRY_COLORS, withAlpha } from '@/theme'
import type { FontScaler } from '@/theme'
import { ErlenmeyerFlaskApparatus } from './ErlenmeyerFlaskApparatus'
import { SeparatoryFunnelApparatus } from './SeparatoryFunnelApparatus'

// 锥形瓶几何常量（与 ErlenmeyerFlaskApparatus 默认值一致）
const FLASK_W = 90
const FLASK_H = 110
// 双孔橡皮塞：瓶颈宽 = FLASK_W * 0.35 = 31.5，塞体从 -FLASK_H*0.08 = -8.8 到 y=4
const FLASK_NECK_W = FLASK_W * 0.35          // 31.5
const FLASK_NECK_LEFT_REL = (FLASK_W - FLASK_NECK_W) / 2  // 29.25（相对锥形瓶左上角）
// 橡皮塞顶面相对于锥形瓶顶的 y 偏移（ErlenmeyerFlask hasStopper 在 -h*0.08 处）
const STOPPER_TOP_REL_Y = -Math.round(FLASK_H * 0.08)   // -8
// 左孔 x（分液漏斗插入）：颈部中心左侧 1/3 处
const LEFT_HOLE_REL_X = FLASK_NECK_LEFT_REL + FLASK_NECK_W * 0.3   // ~38
// 右孔 x（出气管穿出）：颈部中心右侧 2/3 处
const RIGHT_HOLE_REL_X = FLASK_NECK_LEFT_REL + FLASK_NECK_W * 0.7  // ~51

// 分液漏斗几何常量（与 SeparatoryFunnelApparatus 默认值一致）
const FUNNEL_W = 80
const FUNNEL_H = 120

export interface NoHeatGeneratorApparatusProps {
  /** 发生装置水平中心 x (Design Space) */
  x: number
  /** 发生装置桌面基准线 y（baseY，锥形瓶底部落此处） */
  y: number
  /** 气体名称标识 */
  targetGas?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

/**
 * NoHeatGeneratorApparatus — 固-液不加热锥形瓶发生装置 (高保真复合器材组)
 *
 * 高考标准规范：
 * - 锥形瓶底部精准落在桌面（y = baseY），不悬空
 * - 双孔橡皮塞密封，与锥形瓶瓶颈严密咬合
 * - 分液漏斗插入左孔（管口露在橡皮塞底面下方 6px 处悬空，不插入液面）
 * - 右孔出气口位于橡皮塞顶面，由全局路由引擎一笔画连贯贯通全链导管，零补丁
 *
 * 坐标约定：x = 装置中心，y = 桌面基准线
 */
export const NoHeatGeneratorApparatus: React.FC<NoHeatGeneratorApparatusProps> = ({
  x,
  y,
}) => {
  // ── 派生所有绝对坐标 ────────────────────────────────────────────────────
  // 锥形瓶左上角（底部 = y，即桌面）
  const flaskLeft = x - FLASK_W / 2
  const flaskTopY = y - FLASK_H

  // 橡皮塞顶面（绝对坐标）
  const stopperTopY = flaskTopY + STOPPER_TOP_REL_Y   // ≈ flaskTopY - 8

  // 左孔 x（分液漏斗茎插入处）
  const leftHoleX = flaskLeft + LEFT_HOLE_REL_X
  // 右孔 x（出气管穿出处）
  const rightHoleX = flaskLeft + RIGHT_HOLE_REL_X

  // 一体化原生分液漏斗几何解算：
  const funnelLeft = leftHoleX - FUNNEL_W * 0.5
  // 分液漏斗下颈悬空：露在橡皮塞底面 (stopperTopY + 12) 下方 6px 处 (stopperTopY + 18)
  const stemInBottleY = stopperTopY + 18
  const bulbBottomY = stopperTopY - 85
  const stemTotalLength = stemInBottleY - bulbBottomY   // 约 103px 颈管
  const funnelTotalH = FUNNEL_H + 58

  return (
    <g id="no-heat-generator-group">
      {/* 1. 锥形瓶（底部 = baseY，稳立桌面） */}
      <ErlenmeyerFlaskApparatus
        x={flaskLeft}
        y={flaskTopY}
        width={FLASK_W}
        height={FLASK_H}
        fillLevel={0.4}
        fillColor={withAlpha(CHEMISTRY_COLORS.concentration, 0.3)}
        hasStopper={true}
      />

      {/* 2. 单件一体化分液漏斗（高置球腹 + 管口悬空在锥形瓶颈部空腔） */}
      <SeparatoryFunnelApparatus
        x={funnelLeft}
        y={stemInBottleY - funnelTotalH}
        width={FUNNEL_W}
        height={funnelTotalH}
        stemLength={stemTotalLength}
        bottomFillLevel={0.8}
        bottomFillColor={withAlpha(SCENE_COLORS.reagent.acid, 0.4)}
      />

      {/* 3. 塞内导管短留口 (从塞顶露出 2px) */}
      <line
        x1={rightHoleX}
        y1={stopperTopY + 10}
        x2={rightHoleX}
        y2={stopperTopY - 2}
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={6}
        strokeLinecap="square"
      />
      <line
        x1={rightHoleX}
        y1={stopperTopY + 10}
        x2={rightHoleX}
        y2={stopperTopY - 2}
        stroke={withAlpha(SCENE_COLORS.tube.glass, 0.85)}
        strokeWidth={3}
        strokeLinecap="square"
      />
    </g>
  )
}
