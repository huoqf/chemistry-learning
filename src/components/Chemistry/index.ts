/**
 * 化学组件库
 *
 * @example
 * ```tsx
 * import { BeakerApparatus, BuretteApparatus, RoastingFurnaceEquipment } from '@/components/Chemistry'
 * ```
 */

// 矢量箭头
export { VectorArrow } from './VectorArrow'
export { ChemistryVectorArrow } from './ChemistryVectorArrow'

// 高考化学真题插图矢量库
export { GaokaoDiagram } from './GaokaoDiagram'
export type { GaokaoDiagramProps } from './GaokaoDiagram'

// 量分配柱状图
export { QuantityBars } from './QuantityBars'
export type { QuantityBarItem, QuantityBarsProps } from './QuantityBars'

// 粒子轨迹渲染
export { ParticleTrajectory } from './ParticleTrajectory'
export type { ParticleTrajectoryProps } from './ParticleTrajectory'

// 粒子发射源
export { ParticleEmitter } from './ParticleEmitter'

// 通用工具组件
export { DragHandle } from './DragHandle'

// ── 高中核心实验器材 (Apparatus) ──
export { BeakerApparatus } from './BeakerApparatus'
export type { BeakerApparatusProps } from './BeakerApparatus'

export { ErlenmeyerFlaskApparatus } from './ErlenmeyerFlaskApparatus'
export type { ErlenmeyerFlaskApparatusProps } from './ErlenmeyerFlaskApparatus'

export { BuretteApparatus } from './BuretteApparatus'
export type { BuretteApparatusProps } from './BuretteApparatus'

export { VolumetricFlaskApparatus } from './VolumetricFlaskApparatus'
export type { VolumetricFlaskApparatusProps } from './VolumetricFlaskApparatus'

export { TestTubeApparatus } from './TestTubeApparatus'
export type { TestTubeApparatusProps } from './TestTubeApparatus'

export { GasJarApparatus } from './GasJarApparatus'
export type { GasJarApparatusProps } from './GasJarApparatus'

export { AlcoholLampApparatus } from './AlcoholLampApparatus'
export type { AlcoholLampApparatusProps } from './AlcoholLampApparatus'

export { SeparatoryFunnelApparatus } from './SeparatoryFunnelApparatus'
export type { SeparatoryFunnelApparatusProps } from './SeparatoryFunnelApparatus'

export { SolidHeatingGeneratorApparatus } from './SolidHeatingGeneratorApparatus'
export type { SolidHeatingGeneratorApparatusProps } from './SolidHeatingGeneratorApparatus'

// ── 装置支撑与连接类组件 ──
export { IronSupportApparatus } from './IronSupportApparatus'
export type { IronSupportApparatusProps } from './IronSupportApparatus'

export { TripodMeshApparatus } from './TripodMeshApparatus'
export type { TripodMeshApparatusProps } from './TripodMeshApparatus'

export { ClayTriangleApparatus } from './ClayTriangleApparatus'
export type { ClayTriangleApparatusProps } from './ClayTriangleApparatus'

export { WaterBathApparatus } from './WaterBathApparatus'
export type { WaterBathApparatusProps } from './WaterBathApparatus'

export { GlassTubingConnectionApparatus } from './GlassTubingConnectionApparatus'
export type { GlassTubingConnectionApparatusProps } from './GlassTubingConnectionApparatus'

export { LiquidHeatingGeneratorApparatus } from './LiquidHeatingGeneratorApparatus'
export type { LiquidHeatingGeneratorApparatusProps } from './LiquidHeatingGeneratorApparatus'

export { NoHeatGeneratorApparatus } from './NoHeatGeneratorApparatus'
export type { NoHeatGeneratorApparatusProps } from './NoHeatGeneratorApparatus'

export { KippApparatus } from './KippApparatus'
export type { KippApparatusProps } from './KippApparatus'

export { EvaporatingDishApparatus } from './EvaporatingDishApparatus'
export type { EvaporatingDishApparatusProps } from './EvaporatingDishApparatus'

// ── 干燥冷凝与提纯分离类组件 ──
export { DryingTubeApparatus } from './DryingTubeApparatus'
export type { DryingTubeApparatusProps } from './DryingTubeApparatus'


export { CondenserApparatus } from './CondenserApparatus'
export type { CondenserApparatusProps } from './CondenserApparatus'

export { BuchnerFunnelApparatus } from './BuchnerFunnelApparatus'
export type { BuchnerFunnelApparatusProps } from './BuchnerFunnelApparatus'

// ── 电化学、膜分离与仪表测量类组件 ──
export { ElectrochemCellApparatus } from './ElectrochemCellApparatus'
export type { ElectrochemCellApparatusProps } from './ElectrochemCellApparatus'

export { SaltBridgeApparatus } from './SaltBridgeApparatus'
export type { SaltBridgeApparatusProps } from './SaltBridgeApparatus'

export { IonMembraneApparatus } from './IonMembraneApparatus'
export type { IonMembraneApparatusProps } from './IonMembraneApparatus'

export { DcPowerSupplyApparatus } from './DcPowerSupplyApparatus'
export type { DcPowerSupplyApparatusProps } from './DcPowerSupplyApparatus'

export { ExternalLoadApparatus } from './ExternalLoadApparatus'
export type { ExternalLoadApparatusProps, LoadType } from './ExternalLoadApparatus'

export { ElectronFlowPath } from './ElectronFlowPath'
export type { ElectronFlowPathProps } from './ElectronFlowPath'

export { ElectrodePlateApparatus } from './ElectrodePlateApparatus'
export type { ElectrodePlateApparatusProps, ElectrodeMaterial } from './ElectrodePlateApparatus'

export { ElectrodeReactionBadge } from './ElectrodeReactionBadge'
export type { ElectrodeReactionBadgeProps } from './ElectrodeReactionBadge'

export { PhMeterApparatus } from './PhMeterApparatus'
export type { PhMeterApparatusProps } from './PhMeterApparatus'

export { ThermometerApparatus } from './ThermometerApparatus'
export type { ThermometerApparatusProps } from './ThermometerApparatus'

export { BalanceApparatus } from './BalanceApparatus'
export type { BalanceApparatusProps } from './BalanceApparatus'

export { FlowMeterApparatus } from './FlowMeterApparatus'
export type { FlowMeterApparatusProps } from './FlowMeterApparatus'

// ── 高考化工流程设备与动态特效 ──
export { CrusherEquipment } from './CrusherEquipment'
export type { CrusherEquipmentProps } from './CrusherEquipment'

export { RoastingFurnaceEquipment } from './RoastingFurnaceEquipment'
export type { RoastingFurnaceEquipmentProps } from './RoastingFurnaceEquipment'

export { RotaryKilnEquipment } from './RotaryKilnEquipment'
export type { RotaryKilnEquipmentProps } from './RotaryKilnEquipment'

export { LeachingReactorEquipment } from './LeachingReactorEquipment'
export type { LeachingReactorEquipmentProps } from './LeachingReactorEquipment'

export { AbsorptionTowerEquipment } from './AbsorptionTowerEquipment'
export type { AbsorptionTowerEquipmentProps } from './AbsorptionTowerEquipment'

export { IndustrialElectrolyzerEquipment } from './IndustrialElectrolyzerEquipment'
export type { IndustrialElectrolyzerEquipmentProps } from './IndustrialElectrolyzerEquipment'

export { CrystallizerEquipment } from './CrystallizerEquipment'
export type { CrystallizerEquipmentProps } from './CrystallizerEquipment'

export { IonExchangeColumnEquipment } from './IonExchangeColumnEquipment'
export type { IonExchangeColumnEquipmentProps } from './IonExchangeColumnEquipment'

export { BubbleEmitter } from './BubbleEmitter'
export type { BubbleEmitterProps } from './BubbleEmitter'

export { IonMigration } from './IonMigration'
export type { IonMigrationProps } from './IonMigration'

// 类型导出
export type { ChargeSign } from './types'

// ── 高考解题与记忆强化通用组件 ──
export { ValenceMatrixCanvas } from './ValenceMatrixCanvas'
export type { MatrixItem } from './ValenceMatrixCanvas'

// ── 提纯分离与蒸馏补全组件 ──
export { DistillationFlaskApparatus } from './DistillationFlaskApparatus'
export type { DistillationFlaskApparatusProps } from './DistillationFlaskApparatus'

export { AdapterApparatus } from './AdapterApparatus'
export type { AdapterApparatusProps } from './AdapterApparatus'

export { OxidationBridgeArrow } from './OxidationBridgeArrow'
export type { OxidationBridgeArrowProps } from './OxidationBridgeArrow'

export { CarbonChain2D } from './CarbonChain2D'
export type { CarbonChain2DProps, IsomerNode, CarbonNode, CarbonBond } from './CarbonChain2D'

export { ContrastCanvas } from './ContrastCanvas'

export { ReagentStepCanvas } from './ReagentStepCanvas'

export { GaokaoToolPlaceholderCanvas } from './GaokaoToolPlaceholderCanvas'

// ── 补全高考及教学 5 大核心器材与 Ports 锚点导出 ──
export { GasWashingBottleApparatus } from './GasWashingBottleApparatus'
export type { GasWashingBottleApparatusProps } from './GasWashingBottleApparatus'

export { AntiSiphonFunnelApparatus } from './AntiSiphonFunnelApparatus'
export type { AntiSiphonFunnelApparatusProps } from './AntiSiphonFunnelApparatus'

export { CrucibleApparatus } from './CrucibleApparatus'
export type { CrucibleApparatusProps } from './CrucibleApparatus'

export { GasBuretteApparatus } from './GasBuretteApparatus'
export type { GasBuretteApparatusProps } from './GasBuretteApparatus'

export { RefluxCondenserApparatus } from './RefluxCondenserApparatus'
export type { RefluxCondenserApparatusProps } from './RefluxCondenserApparatus'

export { SeparatoryFunnelSetup } from './SeparatoryFunnelSetup'
export type { SeparatoryFunnelSetupProps, SeparatoryFunnelSetupState } from './SeparatoryFunnelSetup'

// ── 气体制备/净化/收集专用组件 ──
export { SafetyBottleApparatus } from './SafetyBottleApparatus'
export type { SafetyBottleApparatusProps } from './SafetyBottleApparatus'

export { WaterDisplacementCollectionApparatus } from './WaterDisplacementCollectionApparatus'
export type { WaterDisplacementCollectionApparatusProps } from './WaterDisplacementCollectionApparatus'

// ── 器材锚点 (Ports) 计算工具与类型（集中自 ./apparatusPorts）──
export {
  getKippApparatusPorts,
  getIronSupportPorts,
  getWaterDisplacementPorts,
  getRefluxCondenserPorts,
  getSolidHeatingGeneratorPorts,
  getSeparatoryFunnelPorts,
  getSafetyBottlePorts,
  getGlassTubingPorts,
  getNoHeatGeneratorPorts,
  getGasWashingBottlePorts,
  getGasBurettePorts,
  getGasJarPorts,
  getCruciblePorts,
  getAntiSiphonFunnelPorts,
  getBeakerPorts,
  getBurettePorts,
  getDryingTubePorts,
  getDistillationFlaskPorts,
  getLiquidHeatingGeneratorPorts,
} from './apparatusPorts'

export type {
  KippApparatusPorts,
  IronSupportPorts,
  WaterDisplacementPorts,
  RefluxCondenserPorts,
  SolidHeatingGeneratorPorts,
  SeparatoryFunnelPorts,
  SafetyBottlePorts,
  GlassTubingPorts,
  NoHeatGeneratorPorts,
  GasWashingBottlePorts,
  GasBurettePorts,
  GasJarPorts,
  CruciblePorts,
  AntiSiphonFunnelPorts,
  BeakerPorts,
  BurettePorts,
  DryingTubePorts,
  DistillationFlaskPorts,
  LiquidHeatingGeneratorPorts,
} from './apparatusPorts'
