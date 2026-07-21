# COMPONENT_REGISTRY — 公共组件速查索引

> 新增或修改动画场景前必须查阅。
> 最后更新：2026-07-19

---

## Chemistry（@/components/Chemistry）

| 组件 | 用途 | 必需 props | 最小调用 |
|------|------|-----------|---------|
| VectorArrow | 矢量箭头（视觉标注/几何图形/等长示意） | originDesign, vector, type, sceneScale | <VectorArrow originDesign={pos} vector={v} type="concentration" sceneScale={ss} /> |
| ChemistryVectorArrow | 化学矢量箭头（浓度/速率等，禁止 pixelLength，长度通过 refMagnitudes 归一化） | originDesign, vector, type, sceneScale | <ChemistryVectorArrow originDesign={pos} vector={v} type="concentration" sceneScale={ss} /> |
| VectorDefs | 箭头 marker 定义 | — | <VectorDefs /> |

> 化学器材组件（烧杯、试管、分子模型等）待后续开发时补充到本表。

---

## Layout（@/components/Layout）

| 组件 | 用途 | 必需 props | 最小调用 |
|------|------|-----------|---------|
| AnimationSvgCanvas | SVG 画布容器 | containerRef, transform | <AnimationSvgCanvas containerRef={ref} transform={vp.transform}><Scene /></AnimationSvgCanvas> |
| ThreePanel | 三栏布局 | left, center, right | <ThreePanel left={<LeftPanel />} center={<Canvas />} right={<Panel />} /> |

---

## UI（@/components/UI）

| 组件 | 用途 | 必需 props | 最小调用 |
|------|------|-----------|---------|
| LeftPanel / LeftPanelSection | 左屏控制台 | — | <LeftPanel><LeftPanelSection title="参数">...</LeftPanelSection></LeftPanel> |
| ParamControl | 参数滑块 | params, onParamChange | <ParamControl params={[...]} onParamChange={updateParam} /> |
| ControlPanel | 声明式控件 | controls, params, updateParam | <ControlPanel controls={mc} params={params} /> |
| AnimationControls | 播放控制条 | isPlaying, speed, time, maxTime | <AnimationControls isPlaying={p} speed={s} time={t} maxTime={tMax} /> |
| Button / SegmentedControl / ToggleSwitch | 基础控件 | — | 详见源码 interface |
| Slider | 数值范围选择 | value, min, max, onChange | <Slider value={v} min={0} max={10} step={0.1} onChange={setV} /> |
| Slider (marks) | 带标注的滑块（冲突自动避让） | marks, showInput | <Slider value={v} min={-5} max={5} marks={[{value:0,label:'0',variant:'zero'}]} showInput onChange={setV} /> |
| KatexFormula | KaTeX 公式渲染 | formula, mode | 可直接作为 ParamControl / ControlPanel 的 label 传入 |

---

## Chart（@/components/Chart）

| 组件 | 用途 | 必需 props | 最小调用 |
|------|------|-----------|---------|
| BaseChart | 图表原子容器 | xDomain, yDomain, xLabel, yLabel | <BaseChart xDomain={[0,tMax]} yDomain={[yMin,yMax]} xLabel="t/s" yLabel="c/(mol/L)"><ChartCursor x={t} /></BaseChart> |
| ChartCursor | 游标十字线 | x, dataPoints | <ChartCursor x={time} dataPoints={[{ y: c, label: 'c', series: 'primary' }]} /> |
| ChartLine | 折线插件 | points | <ChartLine points={pts} series="primary" /> |
