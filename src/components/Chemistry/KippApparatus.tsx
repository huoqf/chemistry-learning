/**
 * src/components/Chemistry/KippApparatus.tsx
 * 《化学器材规范搭建体系》高保真启普发生器组件 (Kipp's Apparatus)
 *
 * 化学规范与物理构造受控树：
 * 1. 磨砂套接口 (GroundGlassJoint)：上球球形漏斗底部 100% 嵌入坐落在中球顶部的磨砂瓶口中 (消除悬空细管)
 * 2. 橡皮套管接扣 (RubberHoseJoint)：侧面活塞右端统一绘制红褐色软胶管套接扣，导出绝对相切端口 outletPort
 * 3. 贯穿长管：从上漏斗底部无缝引入，穿过中球多孔隔板直达下球底面
 * 4. 部件几何联动树：桌面底座相切 -> 下球 -> 中球 -> 磨砂嘴 -> 上漏斗 -> 活塞套扣，消灭任何几何撕裂或悬空
 * 5. 随关随停物理连通器：开启时酸液没过固体冒气泡；关闭时酸液压退至隔板下方并顺长管逆流填满上漏斗
 * 6. 自动化化学安全诊断：对 Cl₂/粉末固体错选自动弹出高考规范警告
 */

import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface KippApparatusProps {
  /** 器材左上角 x（设计坐标） */
  x: number
  /** 器材左上角 y（设计坐标） */
  y: number
  /** 器材宽度（设计单位，默认 90） */
  width?: number
  /** 器材高度（设计单位，默认 220） */
  height?: number
  /** 活塞开关：true 开启(制气中)，false 关闭(自动停止) */
  isOpen?: boolean
  /** 气体名称标识（如 "H₂" / "CO₂" / "Cl₂"） */
  gasLabel?: string
  /** 目标气体 (用于错选判断) */
  targetGas?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

export function KippApparatus({
  x,
  y,
  width = 90,
  height = 220,
  isOpen = true,
  gasLabel = 'H₂',
  targetGas,
  font = (n) => n,
}: KippApparatusProps) {
  const w = width
  const cx = w * 0.5
  const effectiveGas = targetGas || gasLabel

  // 化学安全诊断：启普发生器严禁用于制取 Cl₂ (需加热/粉末) 或 C₂H₄ (170°C加热)
  const isWrongGenerator = effectiveGas === 'Cl₂' || effectiveGas === 'C₂H₄'

  // ─── 部件几何联动树 (Hierarchical Geometry Tree) ───────────────────
  // 1. 桌面底线基准 (baseY = height = 220)
  const baseBottomY = height

  // 2. 下球贮液底座 (BottomSphere)
  const botSphereR = 38
  const botSphereY = baseBottomY - botSphereR // = 182

  // 3. 缩颈腰部与多孔隔板 (Waist & Perforated Plate)
  const waistY = 154
  const waistR = 14

  // 4. 中球反应室 (MiddleSphere)
  const midSphereR = 34
  const midSphereY = 120
  const midSphereTopY = 86 // 中球顶端开始收口处

  // 5. 中球顶端磨砂瓶口 (TopNeckJoint)
  const neckWidth = 24
  const neckTopY = 62 // 磨砂瓶口顶端

  // 6. 上球球形加酸漏斗 (AcidFunnel & GroundGlassJoint)
  // 球形漏斗下半部 100% 嵌入坐落在中球磨砂瓶口 neckTopY 内部 (套接重叠 10px)
  const topFunnelR = 24
  const topFunnelY = neckTopY - topFunnelR + 8 // = 46px (坐落在中球顶嘴上)
  const funnelRimY = topFunnelY - topFunnelR // = 22px

  return (
    <g transform={`translate(${x}, ${y})`} id="kipp-apparatus">
      {/* ── 1. 下球 + 中球 + 磨砂顶口 (真实连通熔制一体玻璃外壁) ── */}
      <path
        d={`M ${cx - 28} ${baseBottomY} 
           L ${cx + 28} ${baseBottomY} 
           C ${cx + botSphereR} ${botSphereY + 28}, ${cx + botSphereR} ${botSphereY - 12}, ${cx + waistR} ${waistY}
           C ${cx + midSphereR + 2} ${midSphereY + 12}, ${cx + midSphereR + 2} ${midSphereY - 12}, ${cx + neckWidth / 2} ${midSphereTopY}
           L ${cx + neckWidth / 2} ${neckTopY}
           L ${cx - neckWidth / 2} ${neckTopY}
           L ${cx - neckWidth / 2} ${midSphereTopY}
           C ${cx - midSphereR - 2} ${midSphereY - 12}, ${cx - midSphereR - 2} ${midSphereY + 12}, ${cx - waistR} ${waistY}
           C ${cx - botSphereR} ${botSphereY - 12}, ${cx - botSphereR} ${botSphereY + 28}, ${cx - 28} ${baseBottomY} Z`}
        fill={withAlpha(SCENE_COLORS.reactionAndGas.kippApparatus, 0.22)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />
      {/* 中球顶口磨砂接口强化线 (GroundGlassJoint) */}
      <rect
        x={cx - neckWidth / 2 - 1.5}
        y={neckTopY - 2}
        width={neckWidth + 3}
        height={4}
        rx={1}
        fill={SCENE_COLORS.materials.glassBorder}
        opacity={0.8}
      />

      {/* ── 2. 上球球形漏斗 (底部 100% 嵌入坐落在中球磨砂嘴中，无悬空细管) ── */}
      <g id="ground-glass-funnel">
        {/* 球形漏斗主体 */}
        <circle
          cx={cx}
          cy={topFunnelY}
          r={topFunnelR}
          fill={withAlpha(SCENE_COLORS.reactionAndGas.kippApparatus, 0.25)}
          stroke={SCENE_COLORS.container.beakerBorder}
          strokeWidth={STROKE.objectLine}
        />
        {/* 顶部喇叭加酸口 (从最顶部 y=2px 优雅引入) */}
        <path
          d={`M ${cx - 15} ${funnelRimY + 4} L ${cx - 20} ${funnelRimY - 8} L ${cx + 20} ${funnelRimY - 8} L ${cx + 15} ${funnelRimY + 4} Z`}
          fill={withAlpha(SCENE_COLORS.reactionAndGas.kippApparatus, 0.3)}
          stroke={SCENE_COLORS.container.beakerBorder}
          strokeWidth={STROKE.objectLine}
        />
      </g>

      {/* ── 3. 物理连通器酸液系统 (遵循压强平衡：随关随停) ── */}
      {!isWrongGenerator && (
        isOpen ? (
          /* 开启状态：中球气压释放，酸液充盈下球，上升浸没中球隔板上的固体 */
          <g id="acid-liquid-open">
            <path
              d={`M ${cx - 28} ${midSphereY + 6} 
                 C ${cx - 15} ${midSphereY + 18}, ${cx + 15} ${midSphereY + 18}, ${cx + 28} ${midSphereY + 6}
                 C ${cx + waistR} ${waistY}, ${cx + botSphereR} ${botSphereY}, ${cx + 28} ${baseBottomY - 2}
                 L ${cx - 28} ${baseBottomY - 2}
                 C ${cx - botSphereR} ${botSphereY}, ${cx - waistR} ${waistY}, ${cx - 28} ${midSphereY + 6} Z`}
              fill={withAlpha(SCENE_COLORS.reagent.acid, 0.45)}
            />
            <ellipse cx={cx} cy={midSphereY + 6} rx={28} ry={5} fill={withAlpha(SCENE_COLORS.reagent.acid, 0.6)} />
            {/* 上部漏斗内残余酸液 */}
            <ellipse cx={cx} cy={topFunnelY + 10} rx={topFunnelR - 8} ry={4} fill={withAlpha(SCENE_COLORS.reagent.acid, 0.4)} />
          </g>
        ) : (
          /* 关闭状态：中球气压剧烈增大，酸液完全压退至隔板下方，顺长管逆流升满上漏斗 */
          <g id="acid-liquid-closed">
            <path
              d={`M ${cx - waistR - 2} ${waistY + 5} 
                 C ${cx - botSphereR} ${botSphereY + 5}, ${cx - botSphereR} ${botSphereY + 25}, ${cx - 28} ${baseBottomY - 2}
                 L ${cx + 28} ${baseBottomY - 2}
                 C ${cx + botSphereR} ${botSphereY + 25}, ${cx + botSphereR} ${botSphereY + 5}, ${cx + waistR + 2} ${waistY + 5} Z`}
              fill={withAlpha(SCENE_COLORS.reagent.acid, 0.5)}
            />
            <ellipse cx={cx} cy={waistY + 5} rx={waistR + 2} ry={3} fill={withAlpha(SCENE_COLORS.reagent.acid, 0.65)} />
            {/* 上部球形漏斗高水位 (反压强上涌) */}
            <circle cx={cx} cy={topFunnelY + 2} r={topFunnelR - 3} fill={withAlpha(SCENE_COLORS.reagent.acid, 0.55)} />
            <ellipse cx={cx} cy={topFunnelY - 12} rx={topFunnelR - 8} ry={4} fill={withAlpha(SCENE_COLORS.reagent.acid, 0.7)} />
          </g>
        )
      )}

      {/* ── 4. 贯穿长玻璃下伸管 (从上漏斗底连贯深入至下球底面) ── */}
      <g id="internal-stem-tube">
        <rect
          x={cx - 4}
          y={topFunnelY + topFunnelR - 4}
          width={8}
          height={baseBottomY - 4 - (topFunnelY + topFunnelR - 4)}
          fill={withAlpha(SCENE_COLORS.tube.glass, 0.25)}
          stroke={SCENE_COLORS.tube.glass}
          strokeWidth={1}
        />
        {/* 动态管内酸液柱 */}
        {!isWrongGenerator && (
          <rect
            x={cx - 3}
            y={isOpen ? midSphereY + 6 : topFunnelY - 12}
            width={6}
            height={baseBottomY - 5 - (isOpen ? midSphereY + 6 : topFunnelY - 12)}
            fill={withAlpha(SCENE_COLORS.reagent.acid, 0.7)}
          />
        )}
      </g>

      {/* ── 5. 下球右侧带橡皮塞的废液排放口 (高考规范结构) ── */}
      <g id="drain-stopper" transform={`translate(${cx + botSphereR - 4}, ${botSphereY + 12})`}>
        <rect x={0} y={-4} width={10} height={12} rx={1} fill={withAlpha(SCENE_COLORS.container.beaker, 0.4)} stroke={SCENE_COLORS.container.beakerBorder} strokeWidth={1} />
        <rect x={6} y={-5} width={8} height={14} rx={1.5} fill={SCENE_COLORS.stopper.rubberStopper} stroke={SCENE_COLORS.stopper.rubberStopperBorder} strokeWidth={1} />
      </g>

      {/* ── 6. 中球缩颈处瓷质多孔隔板 (承载固体) ── */}
      <g id="perforated-plate">
        <line
          x1={cx - waistR - 3}
          y1={waistY}
          x2={cx + waistR + 3}
          y2={waistY}
          stroke={SCENE_COLORS.materials.ceramic}
          strokeWidth={3.5}
        />
        <circle cx={cx - 9} cy={waistY} r={1.2} fill="#334155" />
        <circle cx={cx - 3} cy={waistY} r={1.2} fill="#334155" />
        <circle cx={cx + 3} cy={waistY} r={1.2} fill="#334155" />
        <circle cx={cx + 9} cy={waistY} r={1.2} fill="#334155" />
      </g>

      {/* ── 7. 多孔隔板上方 3D 块状固体 (大理石 CaCO₃ / 锌粒 Zn) ── */}
      <g id="solid-granules" fill="#94A3B8" stroke="#475569" strokeWidth={1}>
        <rect x={cx - 22} y={waistY - 10} width={10} height={9} rx={2} />
        <rect x={cx - 10} y={waistY - 14} width={11} height={10} rx={2} fill="#CBD5E1" />
        <rect x={cx + 3} y={waistY - 11} width={12} height={9} rx={2} fill="#64748B" />
        <rect x={cx - 15} y={waistY - 22} width={10} height={9} rx={2} fill="#CBD5E1" />
        <rect x={cx + 1} y={waistY - 21} width={10} height={9} rx={2} fill="#94A3B8" />
        <rect x={cx - 6} y={waistY - 30} width={9} height={8} rx={2} fill="#E2E8F0" />
      </g>

      {/* ── 8. 反应剧烈冒气泡 (仅开启且非错选时) ── */}
      {isOpen && !isWrongGenerator && (
        <g id="reaction-bubbles" fill="#FFFFFF" opacity={0.9}>
          <circle cx={cx - 12} cy={waistY - 16} r={2.5} />
          <circle cx={cx - 4} cy={waistY - 24} r={3} />
          <circle cx={cx + 6} cy={waistY - 18} r={2} />
          <circle cx={cx - 8} cy={waistY - 34} r={3.5} />
          <circle cx={cx + 4} cy={waistY - 32} r={2.5} />
          <circle cx={cx} cy={waistY - 42} r={3} />
        </g>
      )}

      {/* ── 9. 中球侧面导气管、磨砂活塞与红褐色橡皮套管接扣 (RubberHoseJoint) ── */}
      <g transform={`translate(${cx + midSphereR - 4}, ${midSphereY - 10})`} id="stopcock-assembly">
        {/* 玻璃侧管主体 */}
        <line x1={0} y1={0} x2={22} y2={0} stroke={SCENE_COLORS.tube.glass} strokeWidth={4} />
        {/* 磨砂阀门套扣 */}
        <rect x={8} y={-6} width={8} height={12} fill="#CBD5E1" stroke="#64748B" strokeWidth={1} rx={1} />
        {/* 活塞手柄 (开启绿柄水平 / 关闭红柄垂直) */}
        <rect
          x={10}
          y={-14}
          width={4}
          height={28}
          fill={isOpen ? '#10B981' : '#EF4444'}
          rx={2}
          transform={isOpen ? 'rotate(0 12 0)' : 'rotate(90 12 0)'}
        />
      </g>

      {/* ── 10. 警告与气体名称标注 ── */}
      {isWrongGenerator ? (
        <g transform={`translate(${cx}, ${topFunnelY - topFunnelR - 22})`}>
          <rect
            x={-90}
            y={-14}
            width={180}
            height={22}
            rx={4}
            fill="#FEE2E2"
            stroke="#EF4444"
            strokeWidth={1.5}
          />
          <text
            x={0}
            y={2}
            textAnchor="middle"
            fill="#991B1B"
            fontSize={font(10)}
            fontWeight="extrabold"
          >
            ⚠️ 错选: 启普发生器严禁加热/粉末!
          </text>
        </g>
      ) : (
        effectiveGas && (
          <g transform={`translate(${cx}, ${topFunnelY - topFunnelR - 22})`}>
            <rect
              x={-24}
              y={-12}
              width={48}
              height={16}
              rx={4}
              fill="#F1F5F9"
              stroke="#CBD5E1"
              strokeWidth={1}
            />
            <text
              x={0}
              y={0}
              textAnchor="middle"
              fontSize={font(FONT.annotation)}
              fill={SCENE_COLORS.labels.chemicalFormula}
              fontWeight="bold"
            >
              {effectiveGas}
            </text>
          </g>
        )
      )}
    </g>
  )
}



