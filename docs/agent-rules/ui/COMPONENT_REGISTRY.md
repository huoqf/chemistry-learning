# COMPONENT_REGISTRY — 公共组件速查索引

> 新增或修改动画场景前必须查阅，严禁重复手写已有器材、设备、图表或 UI 组件。
> 所有组件须从对应目录的 barrel 入口导入（`@/components/Chemistry`、`@/components/Chemistry3D`、`@/components/Chart`、`@/components/Layout`、`@/components/UI`）。
> 最后更新：2026-11-18

---

## 1. Chemistry — 矢量、粒子与通用工具（`@/components/Chemistry`）

| 组件 | 用途 | 必需 props | 最小调用 |
|------|------|-----------|---------|
| `VectorArrow` | 矢量箭头（视觉标注/几何图形/等长示意） | `originDesign`, `vector`, `type`, `sceneScale` | `<VectorArrow originDesign={pos} vector={v} type="reactionRate" sceneScale={ss} />` |
| `ChemistryVectorArrow` | 化学矢量箭头（物理坐标起点，自动转设计坐标，禁用 `pixelLength`） | `origin`, `vector`, `type`, `sceneScale` | `<ChemistryVectorArrow origin={{ x: 0, y: 0 }} vector={v} type="rateForward" sceneScale={ss} />` |
| `OxidationBridgeArrow` | 氧化还原双线桥/单线桥箭头（化合价升降与电子转移） | `startPos`, `endPos`, `label` | `<OxidationBridgeArrow startPos={[100, 80]} endPos={[200, 80]} label="失 2e⁻" />` |
| `ParticleEmitter` | 粒子发射源（仅适用发生源/喷射场景） | 见源码 interface | — |
| `ParticleTrajectory` | 粒子轨迹渲染 | 见源码 interface | — |
| `BubbleEmitter` | 气体逸出气泡动态特效 | 见源码 interface | — |
| `IonMigration` | 溶液中阴阳离子定向迁移特效 | 见源码 interface | — |
| `DragHandle` | SVG 拖拽手柄 | 见源码 interface | — |
| `QuantityBars` | 量分配柱状对比条 | 见源码 interface | — |

---

## 2. Chemistry — 高中实验器材（`@/components/Chemistry`）

> 多数反应/连接类器材配套提供了锚点计算函数 `get*Ports(...)`（导出自 `@/components/Chemistry`，实现位于 `apparatusPorts.ts`），用于精确定位胶塞、液面与玻璃导管接口。

### 2.1 基础容器与计量滴定

| 组件 | 用途 | 常用定位 props |
|------|------|----------------|
| `BeakerApparatus` | 烧杯（配套 `getBeakerPorts`） | `x, y, width?, height?, fillLevel?, fillColor?` |
| `ErlenmeyerFlaskApparatus` | 锥形瓶 | `x, y, ...` |
| `VolumetricFlaskApparatus` | 容量瓶（定容刻度线） | `x, y, ...` |
| `TestTubeApparatus` | 试管 | `x, y, ...` |
| `GasJarApparatus` | 集气瓶（配套 `getGasJarPorts`） | `x, y, ...` |
| `BuretteApparatus` | 酸式/碱式滴定管（配套 `getBurettePorts`） | `x, y, ...` |
| `DropperApparatus` | 胶头滴管 | `x, y, ...` |
| `GasBuretteApparatus` | 量气管与水准瓶（水准面对齐校验，配套 `getGasBurettePorts`） | `x, y, gasVolume?` |
| `PhMeterApparatus` | 数字化 pH 计探头与示数 | `x, y, ...` |
| `ThermometerApparatus` | 温度计 | `x, y, ...` |
| `BalanceApparatus` | 托盘/电子天平 | `x, y, ...` |
| `FlowMeterApparatus` | 气体流量计 | `x, y, ...` |

### 2.2 气体发生、加热、支撑与连接

| 组件 | 用途 | 配套 Ports |
|------|------|-----------|
| `SolidHeatingGeneratorApparatus` | 固-固加热制气装置 | `getSolidHeatingGeneratorPorts` |
| `LiquidHeatingGeneratorApparatus` | 固/液-液加热制气装置 | `getLiquidHeatingGeneratorPorts` |
| `NoHeatGeneratorApparatus` | 固-液不加热制气装置 | `getNoHeatGeneratorPorts` |
| `KippApparatus` | 启普发生器（三球联通、随开随用） | `getKippApparatusPorts` |
| `AlcoholLampApparatus` | 酒精灯 | — |
| `WaterBathApparatus` | 水浴/油浴加热锅 | — |
| `IronSupportApparatus` | 铁架台与铁夹 | `getIronSupportPorts` |
| `TripodMeshApparatus` | 三脚架与陶土网 | — |
| `ClayTriangleApparatus` | 泥三角 | — |
| `CrucibleApparatus` | 瓷坩埚与坩埚钳（高温灼烧） | `getCruciblePorts` |
| `EvaporatingDishApparatus` | 蒸发皿 | — |
| `GlassTubingConnectionApparatus` | 双壁透明玻璃导管（直管/L型/Z型） | `getGlassTubingPorts` |

### 2.3 分离提纯、尾气吸收与收集

| 组件 | 用途 | 配套 Ports |
|------|------|-----------|
| `SeparatoryFunnelApparatus` | 分液漏斗 | `getSeparatoryFunnelPorts` |
| `SeparatoryFunnelSetup` | 萃取分液全套装配体（铁架台+漏斗+双烧杯） | — |
| `DistillationFlaskApparatus` | 具支蒸馏烧瓶 | `getDistillationFlaskPorts` |
| `CondenserApparatus` | 直形冷凝管 | — |
| `RefluxCondenserApparatus` | 球形回流冷凝管 | `getRefluxCondenserPorts` |
| `AdapterApparatus` | 牛角管 / 接液管 | — |
| `BuchnerFunnelApparatus` | 布氏漏斗与抽滤装置 | — |
| `DryingTubeApparatus` | U形干燥管 / 球形干燥管 | `getDryingTubePorts` |
| `GasWashingBottleApparatus` | 洗气瓶（长进短出气流净化） | `getGasWashingBottlePorts` |
| `SafetyBottleApparatus` | 安全瓶（防倒吸缓冲） | `getSafetyBottlePorts` |
| `AntiSiphonFunnelApparatus` | 防倒吸倒置漏斗（NH₃/HCl 吸收） | `getAntiSiphonFunnelPorts` |
| `WaterDisplacementCollectionApparatus` | 排水集气装置 | `getWaterDisplacementPorts` |

### 2.4 电化学公共部件

| 组件 | 用途 |
|------|------|
| `ElectrochemCellApparatus` | 电解槽 / 原电池单槽容器 |
| `SaltBridgeApparatus` | U 形盐桥 |
| `IonMembraneApparatus` | 阳离子/阴离子交换膜 |
| `ElectrodePlateApparatus` | 电极板（含 `ElectrodeMaterial` 类型） |
| `DcPowerSupplyApparatus` | 直流电源 |
| `ExternalLoadApparatus` | 外部负载（灯泡/电流表等） |
| `ElectronFlowPath` | 导线电子流向动态路径 |
| `ElectrodeReactionBadge` | 电极半反应标注徽章 |

---

## 3. Chemistry — 高考化工流程设备与母题画布（`@/components/Chemistry`）

| 组件 | 用途 |
|------|------|
| `CrusherEquipment` | 破碎/粉碎机 |
| `RoastingFurnaceEquipment` | 焙烧炉 / 沸腾炉 |
| `RotaryKilnEquipment` | 回转窑 |
| `LeachingReactorEquipment` | 浸出槽 / 反应釜 |
| `AbsorptionTowerEquipment` | 吸收塔 / 洗涤塔 |
| `IndustrialElectrolyzerEquipment` | 工业电解槽 / 离子膜电解槽 |
| `CrystallizerEquipment` | 蒸发结晶器 |
| `IonExchangeColumnEquipment` | 离子交换柱 |
| `GaokaoDiagram` | 高考题图矢量库（滴定曲线/分布分数/沉淀折线/实验原图等） |
| `ValenceMatrixCanvas` | 无机元素价类二维图画布 |
| `CarbonChain2D` | 2D 碳骨架与等效氢/同分异构体展示 |
| `ContrastCanvas` / `ReagentStepCanvas` / `GaokaoToolPlaceholderCanvas` | 母题通用画布 |

---

## 4. Chemistry3D — 3D 渲染组件与工具（`@/components/Chemistry3D`）

| 导出 | 用途 | 必需 props / 签名 |
|------|------|-------------------|
| `UnitCellMesh` | 晶胞外框、棱边与体心/面心网格 | 见 `UnitCellMeshProps` |
| `AtomMesh` | 原子球体 Mesh | 见 `AtomMeshProps` |
| `BondMesh` | 共价键/配位键圆柱 Mesh | 见 `BondMeshProps` |
| `WebGLFallback` | 全库统一 WebGL 不可用降级提示 | `framed?: boolean` |
| `isWebGLAvailable` / `resetWebGLCache` | 惰性缓存 WebGL 上下文检测 | `() => boolean` |
| `fracToCartesian` / `cartesianToWorld` / `fracToWorld` / `batchFracToWorld` | 晶胞分数坐标转换工具 | `(frac, cell) => [number, number, number]` |

---

## 5. Layout（`@/components/Layout`）

| 组件 | 用途 | 必需 props | 最小调用 |
|------|------|-----------|---------|
| `AnimationSvgCanvas` | SVG 画布容器 | `containerRef`, `transform` | `<AnimationSvgCanvas containerRef={ref} transform={vp.transform}><Scene /></AnimationSvgCanvas>` |
| `ThreePanel` | 三栏布局 | `left`, `center`, `right` | `<ThreePanel left={<LeftPanel />} center={<Canvas />} right={<Panel />} />` |
| `PageLayout` | 通用页面布局壳 | `children` | `<PageLayout>...</PageLayout>` |

---

## 6. UI（`@/components/UI`）

| 组件 | 用途 | 必需 props | 最小调用 |
|------|------|-----------|---------|
| `LeftPanel` / `LeftPanelSection` | 左屏控制台与卡片分区 | — | `<LeftPanel><LeftPanelSection title="参数">...</LeftPanelSection></LeftPanel>` |
| `ParamControl` | 数值参数滑块组 | `params`, `onParamChange` | `<ParamControl params={[...]} onParamChange={updateParam} />` |
| `ControlPanel` | 声明式非数值控件组 | `controls`, `params`, `updateParam`, `setParams`, `resetAnimation`, `restartAnimation` | 详见 `AnimationPage.tsx` |
| `ChemistryPanel` | 右侧屏知识看板总容器 | `quantities` | `<ChemistryPanel quantities={q} formulas={f} gaokaoPoints={p} />` |
| `FormulaSection` / `GaokaoSection` / `WarningSection` | 右屏公式、高考要点、警示子区块 | `formulas` / `points` / `warnings` | 一般由 `ChemistryPanel` 内部调度 |
| `AnimationControls` | 播放/暂停/重置控制条 | `isPlaying`, `speed`, `time`, `maxTime`, `onPlayPause`, `onReset`, `onSpeedChange`, `onTimeChange` | 见 `AnimationPage.tsx` |
| `GaokaoToolHeader` | 高考母题统一顶栏 + 三视角切换 | `modelId` 或 `model` | `<GaokaoToolHeader modelId={id} viewMode={v} onViewModeChange={setV} />` |
| `ScoringCardSection` | 视角 1：分步规范踩分卡 | `steps?`, `modelTitle?` | `<ScoringCardSection steps={quizData.scoringSteps} />` |
| `GaokaoVariantQuiz` | 视角 2：情境变式演练题 | `quizzes?` | `<GaokaoVariantQuiz quizzes={quizData.variantQuizzes} />` |
| `Button` / `OptionButton` / `SegmentedControl` / `ToggleSwitch` / `Card` / `Badge` / `TipCard` | 基础 UI 控件 | — | 详见源码 interface |
| `Slider` | 带刻度避让与数值框滑块 | `value`, `min`, `max`, `onChange` | `<Slider value={v} min={0} max={10} step={0.1} onChange={setV} />` |
| `KatexFormula` | KaTeX 单条公式渲染 | `formula` | `<KatexFormula formula="K_a" />` |
| `KatexText` | 混合文本与 `$...$` 行内公式解析 | `text` | `<KatexText text="滴定至 $\text{pH} = 7$ 时" />` |
| `ChemicalFormula` | 化学式自动上下标排版 | 见源码 interface | — |
| `MiniChart` | 轻量内嵌实时时序图 | `points`, `lines`, ... | 见 `refactor-animation-page/SKILL.md` |
| `ScrollDataTable` / `TitrationControls` / `ErrorBoundary` / `PageTransition` | 数据滚动表、滴定辅助控制、错误边界与转场 | 见源码 interface | — |

---

## 7. Chart（`@/components/Chart`）

| 组件 | 用途 | 必需 props | 最小调用 |
|------|------|-----------|---------|
| `BaseChart` | 图表原子容器 | `xDomain`, `yDomain`, `xLabel`, `yLabel` | `<BaseChart xDomain={[0, tMax]} yDomain={[yMin, yMax]} xLabel="t/s" yLabel="c/(mol/L)"><ChartLine ... /></BaseChart>` |
| `ChartLine` | 折线图曲线插件 | `points`, `series` | `<ChartLine points={pts} series="primary" />` |
| `ChartArea` | 曲线下方面积填充 | `points`, `series` | `<ChartArea points={pts} />` |
| `ChartCursor` | 游标十字线与读数点 | `x`, `dataPoints` | `<ChartCursor x={time} dataPoints={[{ y: c, label: 'c', series: 'primary' }]} />` |
| `ChartTangent` / `ChartSecant` | 切线 / 割线插件 | 见源码 interface | — |
| `RelationChart` | 通用多系列关系对比图 | `series`, `xLabel`, `yLabel` | 见源码 interface |
| `SvgDataTable` | SVG 内嵌数据记录表 | `x`, `y`, `width`, `data`, `columns` | 见源码 docstring |
| `TitrationCurveChart` / `EnergyProfileChart` / `EquilibriumChart` / `PrecipitationEquilibriumChart` | 高考专项高阶化学图表 | 见各自 Props 类型 | — |
