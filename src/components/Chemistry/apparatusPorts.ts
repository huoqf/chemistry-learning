/**
 * 器材端口（Ports）锚点计算工具
 *
 * 集中存放各实验器材组件的 getXxxPorts() 几何锚点计算函数及对应的 Ports 类型，
 * 供器材组件本身与导管连线引擎（如 features/gas-chain/physics/layoutEngine.ts）共用。
 *
 * 本文件属于纯几何/坐标计算层，无 React/DOM 依赖；仅可能依赖主题 token 与通用数学 helper。
 */

import { applyRotate } from '@/utils/svgTransform'

// ── NoHeatGeneratorApparatus 内部几何常量（与组件文件共享同一推导，保持端口 100% 一致）──
const FLASK_W = 90
const FLASK_H = 110
const FLASK_NECK_W = FLASK_W * 0.35          // 31.5
const FLASK_NECK_LEFT_REL = (FLASK_W - FLASK_NECK_W) / 2  // 29.25
const STOPPER_TOP_REL_Y = -Math.round(FLASK_H * 0.08)   // -8
const RIGHT_HOLE_REL_X = FLASK_NECK_LEFT_REL + FLASK_NECK_W * 0.7  // ~51
const FUNNEL_W = 80
const FUNNEL_H = 120

export interface KippApparatusPorts {
  /** 侧管活塞右端直角向上出气导管出口 (对外导管连接唯一真实锚点，方向向上) */
  outletPort: { x: number; y: number; direction?: 'up' | 'right' }
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
  const midSphereY = 120
  // 侧管直角向上引出端点：X = cx + midSphereR - 4 + 40, Y = y + midSphereY - 10 - 50
  const tubeTipX = cx + midSphereR + 36
  const tubeTipY = y + midSphereY - 60

  return {
    outletPort: { x: x + tubeTipX, y: tubeTipY, direction: 'up' },
    topFunnelPort: { x: x + cx, y: y + 2 },
  }
}

export interface IronSupportPorts {
  /** 铁夹爪卡扣尖端位置 */
  clampTipPos: { x: number; y: number }
  /** 铁圈托环中心位置 */
  ringCenterPos: { x: number; y: number }
  /** 铁架台底座中心 */
  baseCenterPos: { x: number; y: number }
}

/**
 * 静态计算铁架台组件的关键连接锚点 (Design Space)
 */
export function getIronSupportPorts(
  x: number,
  y: number,
  width = 100,
  height = 240,
  clampPos = 0.35,
  ringPos = 0.65,
  ringRadius = 35
): IronSupportPorts {
  const baseH = 14
  const baseW = width * 0.9
  const baseLeft = (width - baseW) / 2
  const poleW = 6
  const poleLeft = baseLeft + baseW * 0.2

  const clampY = y + 10 + (height - baseH - 20) * clampPos
  const ringY = y + 10 + (height - baseH - 20) * ringPos

  return {
    clampTipPos: { x: x + poleLeft + poleW / 2 + width * 0.45, y: clampY },
    ringCenterPos: { x: x + poleLeft + poleW / 2 + width * 0.3 + ringRadius * 0.6, y: ringY },
    baseCenterPos: { x: x + width * 0.5, y: y + height - baseH / 2 },
  }
}

export interface WaterDisplacementPorts {
  /** 进气管顶端（从左侧弯管进入水槽，进气端） */
  inletPort: { x: number; y: number; direction?: 'up' }
  /** 出气管顶端（从倒扣集气瓶右侧短管导出，接尾气处理） */
  outletPort: { x: number; y: number; direction?: 'up' } | null
}

/**
 * 静态计算排水集气装置关键端口（Design Space 绝对坐标）
 * @param x 装置左上角 x（对应水槽左边界）
 * @param y 装置左上角 y（对应进气管露出水槽上方的顶端）
 * @param width 装置总宽度（默认 150）
 * @param hasTailGas 是否有后续尾气处理装置（决定 outletPort 是否为 null）
 */
export function getWaterDisplacementPorts(
  x: number,
  y: number,
  _width = 150,
  _hasTailGas = false,
): WaterDisplacementPorts {
  return {
    inletPort: { x: x + 25, y: y + 10, direction: 'up' },
    outletPort: null,
  }
}

export interface RefluxCondenserPorts {
  /** 下部连接反应瓶口 (蒸气进入) */
  bottomNeckPort: { x: number; y: number }
  /** 上部开口/安全通气口 */
  topNeckPort: { x: number; y: number }
  /** 下部冷却水进水口 (下进) */
  waterInletPort: { x: number; y: number }
  /** 上部冷却水出水口 (上出) */
  waterOutletPort: { x: number; y: number }
  /** 铁架台夹持点 */
  clampPoint: { x: number; y: number }
}

/**
 * 静态计算球形回流冷凝管组件的关键连接锚点 (Design Space)
 */
export function getRefluxCondenserPorts(
  x: number,
  y: number,
  width = 50,
  height = 180
): RefluxCondenserPorts {
  return {
    bottomNeckPort: { x: x + width * 0.5, y: y + height },
    topNeckPort: { x: x + width * 0.5, y: y },
    waterInletPort: { x: x + width, y: y + height - 30 },
    waterOutletPort: { x: x + width, y: y + 30 },
    clampPoint: { x: x + width * 0.5, y: y + height * 0.5 },
  }
}

export interface SolidHeatingGeneratorPorts {
  /** 单孔橡皮塞出的出气导管端点 (Design Space) — 经 rotate(6°, pivot) 数学精确计算 */
  outletPort: { x: number; y: number; direction?: 'right' | 'up' }
  /** 铁夹夹持中心 (Design Space) */
  clampPort: { x: number; y: number }
}

/**
 * 静态计算固固加热发生装置组件的关键连接端点 (Design Space)
 *
 * 【端口计算原则】
 * 管口坐标使用 applyRotate() 数学精确计算 SVG rotate(6, 105, -114) 变换后位置，
 * 而非手工估算。这样端口坐标与渲染位置保证 100% 一致，连接导管不会产生额外拐弯。
 */
export function getSolidHeatingGeneratorPorts(
  x: number,
  y: number
): SolidHeatingGeneratorPorts {
  const tip = applyRotate({ x: 166, y: -166.37 }, 6, 105, -166.37)
  return {
    outletPort: { x: x + tip.x, y: y + tip.y, direction: 'right' },
    clampPort: { x: x + 105, y: y - 166.37 },
  }
}

export interface SeparatoryFunnelPorts {
  /** 分液漏斗上加料口 */
  topNeckPort: { x: number; y: number }
  /** 分液漏斗下端斜切嘴最下端 (流出口) */
  bottomTipPort: { x: number; y: number }
  /** 45° 斜切尖嘴外侧长边触点 (用于 100% 物理紧贴烧杯内壁) */
  tipContactPort: { x: number; y: number }
  /** 铁架台铁圈卡位点 (漏斗颈部) */
  ringSupportPoint: { x: number; y: number }
}

/**
 * 静态计算分液漏斗组件的关键连接锚点 (Design Space)
 */
export function getSeparatoryFunnelPorts(
  x: number,
  y: number,
  width = 80,
  height = 180
): SeparatoryFunnelPorts {
  return {
    topNeckPort: { x: x + width * 0.5, y: y },
    bottomTipPort: { x: x + width * 0.5 + 4, y: y + height },
    tipContactPort: { x: x + width * 0.5 + 4, y: y + height },
    ringSupportPoint: { x: x + width * 0.5, y: y + height * 0.35 },
  }
}

export interface SafetyBottlePorts {
  /** 进气管顶端（左侧管，不伸入液面） */
  inletPort: { x: number; y: number; direction?: 'up' }
  /** 出气管顶端（右侧管，不伸入液面） */
  outletPort: { x: number; y: number; direction?: 'up' }
}

/**
 * 静态计算安全瓶关键连接锚点（Design Space）
 * 安全瓶 = 广口集气瓶形 + 双孔橡皮塞 + 两管均不伸入液面
 */
export function getSafetyBottlePorts(
  x: number,
  y: number,
  width = 80,
): SafetyBottlePorts {
  const lipW = width * 0.7
  const lipLeft = (width - lipW) / 2
  return {
    inletPort:  { x: x + lipLeft + lipW * 0.3, y: y - 14, direction: 'up' },
    outletPort: { x: x + lipLeft + lipW * 0.7, y: y - 14, direction: 'up' },
  }
}

export interface GlassTubingPorts {
  /** 导管起点坐标 (Design Space 绝对坐标) */
  startPort: { x: number; y: number }
  /** 导管终点坐标 (Design Space 绝对坐标) */
  endPort: { x: number; y: number }
}

/**
 * 静态计算玻璃导管组件的关键连接锚点 (Design Space)
 */
export function getGlassTubingPorts(
  x: number,
  y: number,
  endX = 100,
  endY = 0
): GlassTubingPorts {
  return {
    startPort: { x, y },
    endPort: { x: x + endX, y: y + endY },
  }
}

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
  const flaskLeft = x - FLASK_W / 2
  const flaskTopY = y - FLASK_H

  const rightHoleX = flaskLeft + RIGHT_HOLE_REL_X
  const stopperTopY = flaskTopY + STOPPER_TOP_REL_Y
  const funnelLeft = x - FLASK_W / 2 - (FUNNEL_W - FLASK_NECK_W) / 2
  const funnelTopY = stopperTopY - FUNNEL_H

  return {
    outletPort: { x: rightHoleX, y: stopperTopY },
    funnelTopPort: { x: funnelLeft + FUNNEL_W * 0.5, y: funnelTopY },
  }
}

export interface GasWashingBottlePorts {
  /** 长进气管入口 (洗气瓶左上方) */
  inletPort: { x: number; y: number; direction?: 'up' | 'down' | 'left' | 'right' }
  /** 短出气管出口 (洗气瓶右上方) */
  outletPort: { x: number; y: number; direction?: 'up' | 'down' | 'left' | 'right' }
  /** 橡皮塞顶部中心 */
  topNeckPort: { x: number; y: number; direction?: 'up' | 'down' | 'left' | 'right' }
  /** 洗气瓶底部中心 */
  bottomPort: { x: number; y: number; direction?: 'up' | 'down' | 'left' | 'right' }
}

/**
 * 静态计算洗气瓶组件的关键连接锚点 (Design Space)
 */
export function getGasWashingBottlePorts(
  x: number,
  y: number,
  width = 90,
  height = 140,
  reversed = false
): GasWashingBottlePorts {
  const cx = width * 0.5
  const leftX = x + cx - 7
  const rightX = x + cx + 7
  return {
    inletPort: { x: reversed ? rightX : leftX, y: y + 6, direction: 'up' },
    outletPort: { x: reversed ? leftX : rightX, y: y + 6, direction: 'up' },
    topNeckPort: { x: x + cx, y: y + 10, direction: 'up' },
    bottomPort: { x: x + cx, y: y + height, direction: 'down' },
  }
}

export interface GasBurettePorts {
  /** 气体进入口 (量气管顶部) */
  gasInletPort: { x: number; y: number }
  /** 水准瓶顶部加液口 */
  levelBottleTopPort: { x: number; y: number }
}

/**
 * 静态计算量气管组件的关键连接锚点 (Design Space)
 */
export function getGasBurettePorts(
  x: number,
  y: number,
  width = 110,
  _height = 220
): GasBurettePorts {
  return {
    gasInletPort: { x: x + 20, y: y - 10 },
    levelBottleTopPort: { x: x + width - 20, y: y + 20 },
  }
}

export interface GasJarPorts {
  /** 瓶口左侧导管顶部端口 (深入塞孔内) */
  topStopperLeft: { x: number; y: number; direction?: 'up' }
  /** 瓶口右侧导管顶部端口 (深入塞孔内) */
  topStopperRight: { x: number; y: number; direction?: 'up' }
}

export function getGasJarPorts(x: number, y: number, width = 70): GasJarPorts {
  const cx = width * 0.5
  return {
    topStopperLeft: { x: x + cx - 6, y: y + 6, direction: 'up' },
    topStopperRight: { x: x + cx + 6, y: y + 6, direction: 'up' },
  }
}

export interface CruciblePorts {
  /** 坩埚开口顶部中心 */
  topPort: { x: number; y: number }
  /** 坩埚底部中心 (接触泥三角) */
  bottomPort: { x: number; y: number }
}

/**
 * 静态计算瓷坩埚组件的关键连接锚点 (Design Space)
 */
export function getCruciblePorts(
  x: number,
  y: number,
  width = 60,
  height = 50
): CruciblePorts {
  return {
    topPort: { x: x + width * 0.5, y: y },
    bottomPort: { x: x + width * 0.5, y: y + height },
  }
}

export interface AntiSiphonFunnelPorts {
  /** 倒置漏斗顶部连接导管口 */
  topConnectPort: { x: number; y: number; direction?: 'up' }
  /** 倒置漏斗大口底部接触面 */
  bottomPort: { x: number; y: number; direction?: 'down' }
}

/**
 * 静态计算防倒吸倒置漏斗组件的关键连接锚点 (Design Space)
 */
export function getAntiSiphonFunnelPorts(
  x: number,
  y: number,
  width = 80,
  height = 100
): AntiSiphonFunnelPorts {
  return {
    topConnectPort: { x: x + width * 0.5, y: y - 20, direction: 'up' },
    bottomPort: { x: x + width * 0.5, y: y + height, direction: 'down' },
  }
}

export interface BeakerPorts {
  /** 烧杯左侧内壁坐标 (高考靠壁放液对齐点) */
  innerWallLeft: { x: number; y: number }
  /** 烧杯右侧内壁坐标 */
  innerWallRight: { x: number; y: number }
  /** 烧杯口左上边沿 */
  mouthLeft: { x: number; y: number }
  /** 烧杯底部中心 */
  bottomPort: { x: number; y: number }
}

/**
 * 静态计算烧杯组件的关键连接锚点 (Design Space)
 */
export function getBeakerPorts(
  x: number,
  y: number,
  width = 80,
  height = 100
): BeakerPorts {
  const wallT = Math.max(2, width * 0.04)
  return {
    innerWallLeft: { x: x + wallT, y: y + 10 },
    innerWallRight: { x: x + width - wallT, y: y + 10 },
    mouthLeft: { x: x + width * 0.3, y: y - 10 },
    bottomPort: { x: x + width * 0.5, y: y + height },
  }
}

export interface BurettePorts {
  /** 滴定管顶部加液口 */
  topPort: { x: number; y: number }
  /** 滴定管下端尖嘴 (滴落点) */
  tipPort: { x: number; y: number }
  /** 滴定管双夹/铁夹夹持点 */
  clampPoint: { x: number; y: number }
}

/**
 * 静态计算滴定管组件的关键连接锚点 (Design Space)
 */
export function getBurettePorts(
  x: number,
  y: number,
  width = 30,
  height = 240
): BurettePorts {
  return {
    topPort: { x: x + width * 0.5, y: y },
    tipPort: { x: x + width * 0.5, y: y + height },
    clampPoint: { x: x + width * 0.5, y: y + height * 0.4 },
  }
}

export interface DryingTubePorts {
  inletPort: { x: number; y: number; direction?: 'left' | 'up' }
  outletPort: { x: number; y: number; direction?: 'right' | 'up' }
}

export function getDryingTubePorts(
  x: number,
  y: number,
  width: number = 90,
  height: number = 140,
  variant: 'spherical' | 'U-shape' = 'spherical'
): DryingTubePorts {
  if (variant === 'spherical') {
    return {
      inletPort: { x, y: y + height * 0.5, direction: 'left' },
      outletPort: { x: x + width, y: y + height * 0.5, direction: 'right' },
    }
  } else {
    const cx1 = Math.round(width * 0.28)
    const cx2 = Math.round(width * 0.72)
    return {
      inletPort: { x: x + cx1, y: y - 10, direction: 'up' },
      outletPort: { x: x + cx2, y: y - 10, direction: 'up' },
    }
  }
}

export interface DistillationFlaskPorts {
  /** 烧瓶颈部橡皮塞/温度计插入口 (顶部中心) */
  topNeckPort: { x: number; y: number; direction?: 'up' | 'down' | 'left' | 'right' }
  /** 侧边支管口出口 (对准冷凝管进气口) */
  sideArmPort: { x: number; y: number; direction?: 'up' | 'down' | 'left' | 'right' }
  /** 瓶颈铁夹夹持点 */
  clampPoint: { x: number; y: number }
  /** 烧瓶底部中心 */
  bottomPort: { x: number; y: number; direction?: 'up' | 'down' | 'left' | 'right' }
}

/**
 * 静态计算具支蒸馏烧瓶的关键连接锚点 (Design Space)
 */
export function getDistillationFlaskPorts(
  x: number,
  y: number,
  width = 90,
  height = 140
): DistillationFlaskPorts {
  const neckH = height * 0.4
  const sideTubeY = neckH * 0.35
  const sideTubeW = width * 0.35
  const neckLeft = (width - width * 0.28) / 2
  const neckRight = neckLeft + width * 0.28

  return {
    topNeckPort: { x: x + width * 0.5, y: y, direction: 'up' },
    sideArmPort: { x: x + neckRight + sideTubeW, y: y + sideTubeY + 9, direction: 'right' },
    clampPoint: { x: x + width * 0.5, y: y + neckH * 0.5 },
    bottomPort: { x: x + width * 0.5, y: y + height, direction: 'down' },
  }
}

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