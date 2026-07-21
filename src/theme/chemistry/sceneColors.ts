/**
 * src/theme/chemistry/sceneColors.ts
 * 化学实验器材与高考化工设备外观色规范
 */

export const SCENE_COLORS = {
  // ── 通用材料材质 ──
  materials: {
    glass: '#E0F2FE',         // 玻璃主体填充
    glassBorder: '#7DD3FC',   // 玻璃高亮描边
    metal: '#9CA3AF',         // 金属银灰色
    metalBorder: '#6B7280',   // 金属暗色描边
    iron: '#475569',          // 铁质器皿/铁架台
    rubber: '#374151',        // 橡胶塞/导管
    wood: '#92400E',          // 木质试管架
    ceramic: '#FDE68A',       // 瓷质蒸发皿/坩埚
    plastic: '#DBEAFE',       // 塑料材质
    asbestos: '#E2E8F0',      // 石棉网/陶土网
  },

  // ── 基础容器器皿 ──
  container: {
    beaker: '#E0F2FE',        // 烧杯
    beakerBorder: '#7DD3FC',
    flask: '#E0F2FE',         // 锥形瓶
    flaskBorder: '#7DD3FC',
    testTube: '#E0F2FE',      // 试管
    testTubeBorder: '#7DD3FC',
    bottle: '#E0F2FE',        // 广口瓶/细口瓶
    bottleBorder: '#7DD3FC',
    gasJar: '#E0F2FE',        // 集气瓶
    gasJarBorder: '#7DD3FC',
  },

  // ── 精确计量与滴定器材 ──
  titrationAndMeasurement: {
    buretteAcid: '#BAE6FD',       // 酸式滴定管 (玻璃活塞)
    buretteAcidBorder: '#38BDF8',
    buretteBase: '#BAE6FD',       // 碱式滴定管 (橡胶管+玻璃珠)
    buretteBaseRubber: '#374151',
    volumetricFlask: '#E0F2FE',   // 容量瓶
    volumetricFlaskMark: '#EF4444',// 容量瓶刻度线 (红)
    pipette: '#E0F2FE',           // 移液管/滴管
    graduatedCylinder: '#E0F2FE',  // 量筒
    balance: '#94A3B8',           // 托盘天平/电子天平
  },

  // ── 分离提纯与过滤装置 ──
  separationAndPurification: {
    separatoryFunnel: '#E0F2FE',   // 分液漏斗
    funnel: '#E0F2FE',             // 普通漏斗
    buchnerFunnel: '#FDE68A',      // 布氏漏斗 (瓷质)
    suctionFlask: '#E0F2FE',       // 抽滤瓶
    evaporatingDish: '#FEF08A',    // 蒸发皿
    crucible: '#FEF08A',           // 坩埚
    clayTriangle: '#92400E',       // 泥三角
    condenser: '#BAE6FD',          // 冷凝管 (外套管)
    condenserInner: '#7DD3FC',     // 冷凝管 (内芯)
    distillationFlask: '#E0F2FE',  // 蒸馏烧瓶
  },

  // ── 复杂反应与气体发生装置 ──
  reactionAndGas: {
    roundBottomFlask: '#E0F2FE',   // 圆底烧瓶
    threeNeckFlask: '#E0F2FE',     // 三颈烧瓶
    kippApparatus: '#BAE6FD',      // 启普发生器
    washBottle: '#E0F2FE',         // 洗气瓶
    dryingTube: '#E0F2FE',         // 干燥管/U型管
  },

  // ── 加热与支撑辅助器皿 ──
  heatingAndSupport: {
    alcoholLamp: '#F97316',        // 酒精灯底座
    alcoholBlowtorch: '#EA580C',   // 酒精喷灯
    flame: '#FBBF24',              // 外焰
    flameCore: '#FEF3C7',          // 内焰/焰心
    waterBath: '#94A3B8',          // 水浴锅/油浴锅
    ironSupport: '#475569',        // 铁架台
    ironRing: '#334151',           // 铁圈/铁夹
    asbestosMesh: '#CBD5E1',       // 石棉网
    testTubeRack: '#B45309',       // 试管架
    crucibleTongs: '#64748B',      // 坩埚钳
  },

  // ── 常见试剂与物态 ──
  reagent: {
    acid: '#FEE2E2',
    base: '#DBEAFE',
    salt: '#FEF3C7',
    indicator: '#EDE9FE',
    solution: '#E0F2FE',
    precipitate: '#F5F5F4',
  },

  // ── 导管与连接 ──
  tube: {
    glass: '#BAE6FD',
    rubber: '#9CA3AF',
  },

  // ── 标签与注释 ──
  labels: {
    chemicalFormula: '#1E40AF',
    stateSymbol: '#6B7280',
    coefficient: '#374151',
  },

  // ── 高考化工与工业流程设备 ──
  industrialEquipment: {
    leachingReactor: '#64748B',    // 浸出槽/反应釜 (工业灰)
    leachingReactorBorder: '#334151',
    synthesisTower: '#475569',     // 合成塔 (高压合成塔深灰)
    roastingFurnace: '#9A3412',    // 焙烧炉/高炉 (耐火砖红)
    calciner: '#B45309',           // 煅烧炉
    absorptionTower: '#0284C7',    // 吸收塔/洗涤塔 (水洗蓝色系)
    settlingTank: '#78716C',       // 沉降槽/澄清池
    crystallizer: '#0D9488',       // 结晶釜 (青绿)
    filterPress: '#52525B',        // 板框压滤机
    electrolyticCell: '#1E40AF',   // 工业电解槽/离子膜电解槽
    heatExchanger: '#EA580C',      // 热交换器 (橙红热工色)
    coolingTower: '#38BDF8',       // 冷却塔
  },

  // ── 工业管道与流体输送 ──
  industrialPipeline: {
    gasPipe: '#F59E0B',            // 气体管道 (黄色)
    liquidPipe: '#0284C7',         // 液体管道 (蓝色)
    slurryPipe: '#B45309',         // 矿浆/悬浮液管道 (棕色)
    steamPipe: '#EF4444',          // 蒸汽管道 (红色)
    industrialValve: '#374151',    // 阀门
    industrialPump: '#1E293B',     // 泵/压缩机
  },
} as const

export type SceneColorKey = keyof typeof SCENE_COLORS