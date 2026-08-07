/**
 * src/components/Chemistry/KippApparatus.tsx
 * 高保真启普发生器组件 (Kipp's Apparatus)
 *
 * 高考标准造型与物理压强平衡：
 * 1. 经典三球连通玻璃瓶身 (上球加酸漏斗 + 缩颈腰部 + 中球反应室 + 下球贮液底座)
 * 2. 贯穿中球直达下球底部的细长下伸导管
 * 3. 缩颈处多孔隔板与 3D 质感块状固体 (大理石/锌粒)
 * 4. 侧面导气管与磨砂活塞 (开启/关闭转动)
 * 5. “随关随停”物理水位：开启时液面没过固体冒气泡；关闭时气压将酸液压入上漏斗，固液分离自动停止
 */

import { SCENE_COLORS, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'

export interface KippApparatusPorts {
  /** 侧管活塞出口端点 (对准后级导管 inlet) */
  outletPort: { x: number; y: number }
  /** 上部球形漏斗加酸口中心 */
  topFunnelPort: { x: number; y: number }
}

/**
 * 静态计算启普发生器组件的关键连接锚点 (Design Space)
 */
export function getKippApparatusPorts(
  x: number,
  y: number,
  width = 90
): KippApparatusPorts {
  const w = width
  const cx = w * 0.5
  const midSphereR = 34
  const midSphereY = 125
  const topFunnelY = 32
  const topFunnelR = 26

  return {
    outletPort: { x: x + cx + midSphereR + 28, y: y + midSphereY - 28 },
    topFunnelPort: { x: x + cx, y: y + topFunnelY - topFunnelR - 12 },
  }
}

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
  /** 气体名称标识（如 "H₂" / "CO₂"） */
  gasLabel?: string
  /** 字体缩放函数 */
  font?: FontScaler
}

export function KippApparatus({
  x,
  y,
  width = 90,
  isOpen = true,
  gasLabel = 'H₂',
  font = (n) => n,
}: KippApparatusProps) {
  const w = width
  const cx = w * 0.5

  // 关键尺寸定位
  const topFunnelR = 26       // 顶部球形漏斗半径
  const topFunnelY = 32       // 顶部漏斗中心 Y
  const neckY = 70            // 细长颈管过度 Y
  const midSphereR = 34       // 中球半径
  const midSphereY = 125      // 中球中心 Y
  const waistY = 158          // 缩颈腰部 Y
  const waistR = 14           // 缩颈半径
  const botSphereR = 38       // 下球半径
  const botSphereY = 182      // 下球中心 Y

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* ── 1. 下球 (贮液底座) & 底部平垫 ── */}
      <path
        d={`M ${cx - 25} ${botSphereY + 32} 
           L ${cx + 25} ${botSphereY + 32} 
           C ${cx + botSphereR} ${botSphereY + 25}, ${cx + botSphereR} ${botSphereY - 15}, ${cx + waistR} ${waistY}
           C ${cx + midSphereR + 4} ${midSphereY + 10}, ${cx + midSphereR + 4} ${midSphereY - 10}, ${cx + 10} ${neckY}
           L ${cx - 10} ${neckY}
           C ${cx - midSphereR - 4} ${midSphereY - 10}, ${cx - midSphereR - 4} ${midSphereY + 10}, ${cx - waistR} ${waistY}
           C ${cx - botSphereR} ${botSphereY - 15}, ${cx - botSphereR} ${botSphereY + 25}, ${cx - 25} ${botSphereY + 32} Z`}
        fill={withAlpha(SCENE_COLORS.reactionAndGas.kippApparatus, 0.25)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* ── 2. 液体水位 (根据活塞开启/关闭呈现随关随停物理平稳) ── */}
      {isOpen ? (
        /* 开启状态：酸液充盈下球，并上升浸没中球筛板上的固体 */
        <g>
          {/* 中球浸没液面 */}
          <path
            d={`M ${cx - 28} ${midSphereY + 8} 
               C ${cx - 15} ${midSphereY + 20}, ${cx + 15} ${midSphereY + 20}, ${cx + 28} ${midSphereY + 8}
               C ${cx + waistR} ${waistY}, ${cx + botSphereR} ${botSphereY}, ${cx + 25} ${botSphereY + 30}
               L ${cx - 25} ${botSphereY + 30}
               C ${cx - botSphereR} ${botSphereY}, ${cx - waistR} ${waistY}, ${cx - 28} ${midSphereY + 8} Z`}
            fill={withAlpha(SCENE_COLORS.reagent.acid, 0.45)}
          />
          {/* 上部漏斗内低水位 */}
          <ellipse cx={cx} cy={topFunnelY + 10} rx={topFunnelR - 6} ry={4} fill={withAlpha(SCENE_COLORS.reagent.acid, 0.4)} />
        </g>
      ) : (
        /* 关闭状态：气压将酸液自中球压退至下球，并反压上升填满上部球形漏斗 */
        <g>
          {/* 下球被压缩液面 (低于隔板) */}
          <path
            d={`M ${cx - waistR} ${waistY + 4} 
               C ${cx - botSphereR} ${botSphereY}, ${cx - botSphereR} ${botSphereY + 25}, ${cx - 25} ${botSphereY + 30}
               L ${cx + 25} ${botSphereY + 30}
               C ${cx + botSphereR} ${botSphereY + 25}, ${cx + botSphereR} ${botSphereY}, ${cx + waistR} ${waistY + 4} Z`}
            fill={withAlpha(SCENE_COLORS.reagent.acid, 0.5)}
          />
          {/* 上部漏斗内高水位 (反压上涌) */}
          <ellipse cx={cx} cy={topFunnelY - 2} rx={topFunnelR - 3} ry={10} fill={withAlpha(SCENE_COLORS.reagent.acid, 0.6)} />
        </g>
      )}

      {/* ── 3. 贯穿长玻璃下伸管 (由顶部漏斗贯穿中球直达下球底端) ── */}
      <rect
        x={cx - 4}
        y={topFunnelY}
        width={8}
        height={botSphereY + 25 - topFunnelY}
        fill={withAlpha(SCENE_COLORS.tube.glass, 0.3)}
        stroke={SCENE_COLORS.tube.glass}
        strokeWidth={1}
      />

      {/* ── 4. 上部球形漏斗 ── */}
      <circle
        cx={cx}
        cy={topFunnelY}
        r={topFunnelR}
        fill={withAlpha(SCENE_COLORS.reactionAndGas.kippApparatus, 0.3)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />
      {/* 漏斗喇叭加酸口 */}
      <path
        d={`M ${cx - 16} ${topFunnelY - topFunnelR + 4} L ${cx - 22} ${topFunnelY - topFunnelR - 12} L ${cx + 22} ${topFunnelY - topFunnelR - 12} L ${cx + 16} ${topFunnelY - topFunnelR + 4} Z`}
        fill={withAlpha(SCENE_COLORS.reactionAndGas.kippApparatus, 0.3)}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.objectLine}
      />

      {/* ── 5. 中球缩颈处瓷质多孔隔板 (高考重要特征) ── */}
      <g>
        <line
          x1={cx - waistR - 2}
          y1={waistY}
          x2={cx + waistR + 2}
          y2={waistY}
          stroke={SCENE_COLORS.materials.ceramic}
          strokeWidth={3}
        />
        {/* 隔板微孔 */}
        <circle cx={cx - 8} cy={waistY} r={1} fill="#475569" />
        <circle cx={cx} cy={waistY} r={1} fill="#475569" />
        <circle cx={cx + 8} cy={waistY} r={1} fill="#475569" />
      </g>

      {/* ── 6. 多孔隔板上方 3D 质感块状固体 (大理石 CaCO₃ / 锌粒 Zn) ── */}
      <g fill="#94A3B8" stroke="#475569" strokeWidth={1}>
        <rect x={cx - 20} y={waistY - 10} width={10} height={9} rx={2} />
        <rect x={cx - 8} y={waistY - 14} width={11} height={10} rx={2} fill="#CBD5E1" />
        <rect x={cx + 5} y={waistY - 11} width={12} height={9} rx={2} fill="#64748B" />
        <rect x={cx - 14} y={waistY - 21} width={10} height={9} rx={2} fill="#CBD5E1" />
        <rect x={cx + 2} y={waistY - 20} width={9} height={8} rx={2} fill="#94A3B8" />
      </g>

      {/* ── 7. 制气反应中产生剧烈气泡 (仅开启时) ── */}
      {isOpen && (
        <g fill="#FFFFFF" opacity={0.85}>
          <circle cx={cx - 12} cy={waistY - 16} r={2.5} />
          <circle cx={cx - 4} cy={waistY - 24} r={3} />
          <circle cx={cx + 6} cy={waistY - 18} r={2} />
          <circle cx={cx - 8} cy={waistY - 32} r={3.5} />
          <circle cx={cx + 4} cy={waistY - 30} r={2.5} />
        </g>
      )}

      {/* ── 8. 中球侧面导气管与磨砂活塞开关 ── */}
      <g transform={`translate(${cx + midSphereR - 4}, ${midSphereY - 8})`}>
        {/* 玻璃导管出口 */}
        <path
          d="M 0,0 L 22,0 L 22,-20 L 32,-20"
          fill="none"
          stroke={SCENE_COLORS.tube.glass}
          strokeWidth={4}
        />
        {/* 活塞磨砂阀门 */}
        <rect x={8} y={-6} width={8} height={12} fill="#CBD5E1" stroke="#64748B" strokeWidth={1} rx={1} />
        {/* 活塞旋转柄 */}
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

      {/* ── 9. 气体名称 & 状态标注 ── */}
      {gasLabel && (
        <g transform={`translate(${cx}, ${topFunnelY - topFunnelR - 22})`}>
          <rect x={-24} y={-12} width={48} height={16} rx={4} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={1} />
          <text
            x={0}
            y={0}
            textAnchor="middle"
            fontSize={font(FONT.annotation)}
            fill={SCENE_COLORS.labels.chemicalFormula}
            fontWeight="bold"
          >
            {gasLabel}
          </text>
        </g>
      )}
    </g>
  )
}
