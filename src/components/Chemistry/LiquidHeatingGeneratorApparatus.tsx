import React from 'react'
import { SCENE_COLORS, CHEMISTRY_COLORS, colors, withAlpha, STROKE, FONT } from '@/theme'
import type { FontScaler } from '@/theme'
import { DistillationFlaskApparatus, getDistillationFlaskPorts } from './DistillationFlaskApparatus'
import { AlcoholLampApparatus } from './AlcoholLampApparatus'
import { SeparatoryFunnelApparatus } from './SeparatoryFunnelApparatus'
import { ThermometerApparatus } from './ThermometerApparatus'
import { IronSupportApparatus } from './IronSupportApparatus'

export interface LiquidHeatingGeneratorPorts {
  /** 蒸馏烧瓶支管口 (气体导出端点) */
  sideArmPort: { x: number; y: number }
  /** 顶部橡皮塞瓶口 */
  topNeckPort: { x: number; y: number }
}

/**
 * 静态计算蒸馏烧瓶固液加热复合装置的关键锚点 (Design Space)
 */
export function getLiquidHeatingGeneratorPorts(
  x: number,
  y: number
): LiquidHeatingGeneratorPorts {
  const GAUZE_Y = y - 86
  const FLASK_W = 90
  const FLASK_H = 140
  const FLASK_NECK_H = FLASK_H * 0.4
  const FLASK_BULB_R = FLASK_W * 0.42
  const FLASK_HALF_NECK = (FLASK_W * 0.28) / 2
  const FLASK_CENTER_DY = Math.sqrt(FLASK_BULB_R ** 2 - FLASK_HALF_NECK ** 2)
  const FLASK_VISUAL_H = FLASK_NECK_H + FLASK_CENTER_DY + FLASK_BULB_R
  const flaskX = x - FLASK_W / 2
  const flaskY = GAUZE_Y - FLASK_VISUAL_H  // 圆弧最底端 = 石棉网顶面
  const flaskPorts = getDistillationFlaskPorts(flaskX, flaskY, FLASK_W, FLASK_H)
  return {
    sideArmPort: flaskPorts.sideArmPort,
    topNeckPort: flaskPorts.topNeckPort,
  }
}

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
  font = (n) => n,
}) => {
  // ── 核心几何常量（全部从桌面 y 向上推算，零魔法数字）──────────────────────
  // 石棉网：在桌面上方 86px（高考标准，酒精灯外焰顶端相切于此）
  const GAUZE_Y = y - 86          // 石棉网顶面 y 坐标
  const GAUZE_H = 6               // 石棉网厚度

  // 酒精灯：底座贴桌面，外焰顶端精准相切于石棉网底面 (GAUZE_Y)
  // AlcoholLampApparatus 外焰顶端相对高度 = h*(0.45-0.2-0.38) - 6 ≈ -0.13h - 6
  // 解方程：(y + h) = baseY（底部贴桌面）且 y - 0.13h - 6 = GAUZE_Y
  // → y = baseY - h，代入得：baseY - h - 0.13h - 6 = GAUZE_Y
  // → h = (baseY - 6 - GAUZE_Y) / 1.13 = (86 - 6) / 1.13 ≈ 71
  const LAMP_H = Math.round((y - 6 - GAUZE_Y) / 1.13)  // ≈ 71px
  const LAMP_W = 70
  const lampX = x - LAMP_W / 2             // 酒精灯水平居中于烧瓶正下方
  const lampY = y - LAMP_H                  // 底部 = y = 桌面

  // 蒸馏烧瓶：圆底弧最低点落在石棉网顶面
  // DistillationFlaskApparatus 路径: 颈部高 neckH=h*0.4, 弦半长 dx=w*0.28/2
  // 圆心到弦距离 dy = sqrt(bulbR^2 - dx^2)，圆弧最低点相对 flaskY 的偏移 = neckH + dy + bulbR
  const FLASK_W = 90
  const FLASK_H = 140
  const FLASK_NECK_H = FLASK_H * 0.4      // = 56
  const FLASK_BULB_R = FLASK_W * 0.42     // = 37.8
  const FLASK_HALF_NECK = (FLASK_W * 0.28) / 2 // = 12.6
  const FLASK_CENTER_DY = Math.sqrt(FLASK_BULB_R ** 2 - FLASK_HALF_NECK ** 2) // ≈ 35.64
  const FLASK_VISUAL_H = FLASK_NECK_H + FLASK_CENTER_DY + FLASK_BULB_R // 实际渲染最底端 ≈ 129.44
  const flaskX = x - FLASK_W / 2
  const flaskY = GAUZE_Y - FLASK_VISUAL_H  // 圆弧最底端 100% 精准立于石棉网顶面
  const flaskPorts = getDistillationFlaskPorts(flaskX, flaskY, FLASK_W, FLASK_H)

  // 铁架台：宽度 140 使铁夹横臂精准触及瓶颈，底座贴桌面
  const SUPPORT_W = 140
  const SUPPORT_H = y - (flaskY - 30)      // 高度从桌面延伸至烧瓶顶上方30px
  const supportX = x - 90                  // 铁架台左上角（偏左留出烧瓶空间）
  const supportY = flaskY - 30             // 铁架台顶端（瓶顶上方30px）

  // 铁夹：动态计算 clampPos，使铁夹夹持在瓶颈中部
  const targetClampAbsY = flaskY + FLASK_NECK_H * 0.5  // 瓶颈 50% 处
  const clampPos = Math.max(0.05, Math.min(0.9,
    (targetClampAbsY - supportY - 10) / (SUPPORT_H - 34)
  ))

  // 分液漏斗：下端茎插入烧瓶顶部橡皮塞
  const FUNNEL_W = 80
  const FUNNEL_H = 140
  const funnelX = flaskPorts.topNeckPort.x - FUNNEL_W / 2
  const funnelY = flaskPorts.topNeckPort.y - FUNNEL_H  // 漏斗底端 = 瓶口顶面

  return (
    <g id="liquid-heating-generator-group">
      {/* 1. 铁架台（立杆在烧瓶左侧，底座贴桌面）*/}
      <IronSupportApparatus
        x={supportX}
        y={supportY}
        width={SUPPORT_W}
        height={SUPPORT_H}
        hasClamp={true}
        clampPos={clampPos}
      />

      {/* 2. 铁架台铁圈横杆（从立柱中心伸出，托住石棉网）*/}
      {/* 立柱中心 x ≈ supportX + poleLeft + poleW/2 = x-90+32.2+3 ≈ x-54.8 */}
      <line
        x1={supportX + 35}
        y1={GAUZE_Y}
        x2={x + 55}
        y2={GAUZE_Y}
        stroke={SCENE_COLORS.materials.iron}
        strokeWidth={3}
      />

      {/* 3. 石棉网（覆盖烧瓶底部，± 50px） */}
      <rect
        x={x - 48}
        y={GAUZE_Y}
        width={96}
        height={GAUZE_H}
        fill={SCENE_COLORS.materials.asbestos}
        rx={1}
        stroke={SCENE_COLORS.container.beakerBorder}
        strokeWidth={STROKE.reference}
      />
      <line
        x1={x - 48}
        y1={GAUZE_Y + 3}
        x2={x + 48}
        y2={GAUZE_Y + 3}
        stroke={SCENE_COLORS.labels.chemicalFormula}
        strokeDasharray="2 2"
      />

      {/* 4. 蒸馏烧瓶（底部精准落在石棉网顶面）*/}
      <DistillationFlaskApparatus
        x={flaskX}
        y={flaskY}
        width={FLASK_W}
        height={FLASK_H}
        fillLevel={0.45}
        fillColor={withAlpha(CHEMISTRY_COLORS.concentration, 0.4)}
      />

      {/* 5. 酒精灯（底座贴桌面，外焰顶端精准相切石棉网底面）*/}
      <AlcoholLampApparatus
        x={lampX}
        y={lampY}
        width={LAMP_W}
        height={LAMP_H}
        lit={heating}
      />

      {/* 6. 上部：乙烯用温度计，常规用分液漏斗 */}
      {isEthylene ? (
        <g transform={`translate(${flaskPorts.topNeckPort.x}, ${flaskPorts.topNeckPort.y - 45})`}>
          <ThermometerApparatus x={0} y={0} tempValue={170} height={175} />
          <rect
            x={12}
            y={50}
            width={100}
            height={20}
            rx={4}
            fill={withAlpha(colors.warning[100], 0.8)}
            stroke={colors.warning[500]}
            strokeWidth={1}
          />
          <text
            x={18}
            y={64}
            fill={SCENE_COLORS.labels.chemicalFormula}
            fontSize={font(FONT.annotation)}
            fontWeight="bold"
          >
            水银球浸没 170°C
          </text>
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
