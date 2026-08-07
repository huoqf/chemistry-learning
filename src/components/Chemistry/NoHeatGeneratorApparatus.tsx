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

export interface NoHeatGeneratorPorts {
  /** 双孔塞右孔垂直引出的气体导出端口（连接下游导管） */
  outletPort: { x: number; y: number }
  /** 分液漏斗顶口 */
  funnelTopPort: { x: number; y: number }
}

/**
 * 静态计算固液不加热发生装置复合组件的关键锚点 (Design Space)
 *
 * 坐标约定：
 *   x = 装置水平中心
 *   y = 桌面基准线（baseY），锥形瓶底部落于此处
 */
export function getNoHeatGeneratorPorts(
  x: number,
  y: number
): NoHeatGeneratorPorts {
  // 锥形瓶左上角：左上角 x = x - FLASK_W/2, y_top = y - FLASK_H
  const flaskLeft = x - FLASK_W / 2
  const flaskTopY = y - FLASK_H

  // 出气管顶端（右孔，比塞顶高出 30px 作为对外连接口）
  const outletX = flaskLeft + RIGHT_HOLE_REL_X
  const outletY = flaskTopY + STOPPER_TOP_REL_Y - 30
  const RUBBER_H = 8

  // 分液漏斗顶口
  const funnelLeft = x - FLASK_W / 2 - (FUNNEL_W - FLASK_NECK_W) / 2
  const funnelTopY = flaskTopY + STOPPER_TOP_REL_Y - FUNNEL_H

  return {
    outletPort: { x: outletX, y: outletY - RUBBER_H },
    funnelTopPort: { x: funnelLeft + FUNNEL_W * 0.5, y: funnelTopY },
  }
}

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
 * - 分液漏斗插入左孔（活塞管下端深入液面），避让右孔出气管
 * - 右孔玻璃出气导管垂直向上引出，顶部带红褐色胶管套接扣
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

  // 分液漏斗左上角：使漏斗下端出口对准左孔，水平居中左孔
  const funnelLeft = leftHoleX - FUNNEL_W * 0.5
  const funnelTopY = stopperTopY - FUNNEL_H   // 漏斗底部恰好从塞顶插入

  // 出气管：从橡皮塞顶面垂直向上 30px 为对外连接口
  const outletY = stopperTopY - 30
  const RUBBER_H = 8

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

      {/* 2. 分液漏斗（下端插入左孔，漏斗竖管与左孔 x 对齐） */}
      <SeparatoryFunnelApparatus
        x={funnelLeft}
        y={funnelTopY}
        width={FUNNEL_W}
        height={FUNNEL_H}
        bottomFillLevel={0.8}
        bottomFillColor={withAlpha(SCENE_COLORS.reagent.acid, 0.4)}
      />

      {/* 3. 分液漏斗竖管下段（穿入橡皮塞左孔，深入液面） */}
      <path
        d={`M ${leftHoleX} ${stopperTopY} L ${leftHoleX} ${flaskTopY + FLASK_H * 0.5}`}
        fill="none"
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d={`M ${leftHoleX} ${stopperTopY} L ${leftHoleX} ${flaskTopY + FLASK_H * 0.5}`}
        fill="none"
        stroke={withAlpha(SCENE_COLORS.tube.glass, 0.85)}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* 4. 右孔出气导管：外壁 6px / 内高光 3px，与路由连接管粗细一致 */}
      <path
        d={`M ${rightHoleX} ${stopperTopY} L ${rightHoleX} ${outletY}`}
        fill="none"
        stroke={SCENE_COLORS.materials.glassBorder}
        strokeWidth={6}
        strokeLinecap="square"
      />
      <path
        d={`M ${rightHoleX} ${stopperTopY} L ${rightHoleX} ${outletY}`}
        fill="none"
        stroke={withAlpha(SCENE_COLORS.tube.glass, 0.85)}
        strokeWidth={3}
        strokeLinecap="square"
      />
      {/* 顶端橡皮套接扣（outletY-8 到 outletY）*/}
      <rect
        x={rightHoleX - 5.5}
        y={outletY - RUBBER_H}
        width={11}
        height={RUBBER_H}
        rx={2}
        fill="#B45309"
        stroke="#78350F"
        strokeWidth={1}
      />
    </g>
  )
}
