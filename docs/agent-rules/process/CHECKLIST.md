# 提交流程 Checklist

## 通用检查

- [ ] TypeScript 严格编译检查通过（`npx tsc --noEmit`）
- [ ] 架构与规范脚本门禁通过（`npm run lint`）
- [ ] Oxlint 零警告门禁通过（`npm run lint:ox`）
- [ ] 无硬编码颜色值（全部来自 `@/theme`，含 `CANVAS_COLORS` / `SCENE_COLORS` / `CHEMISTRY_COLORS` / `CHART_COLORS`）
- [ ] 无硬编码视觉尺寸、间距、圆角、阴影（全部来自主题 token）
- [ ] 无重复代码，可复用部分已抽取

## 架构检查

- [ ] `src/chemistry/` 模块不依赖 React、DOM、window/document
- [ ] 状态管理仅使用 Zustand，符合 `useAnimationStore` 等约定
- [ ] 组件分层清晰：页面 -> 功能组件 -> 通用组件
- [ ] 计算型 Hook 符合规范（无 JSX，纯计算逻辑）

## 动画组件检查

- [ ] 动画调度通过 `src/utils/animation.ts`，未直接调用 `requestAnimationFrame`
- [ ] 新页面布局：使用 `useAnimationViewport({ preset })` + `AnimationSvgCanvas`
- [ ] 坐标转换：新页面使用 `worldToDesign()` + `useSceneScale`；禁止手写坐标计算
- [ ] 交互拖拽坐标转换：使用 `useViewportPointer(svgRef)`
- [ ] 画布主屏保持教学聚焦（仅放化学量标注与坐标轴标签，禁止大段教学文本与公式推导）
- [ ] 化学量颜色符合 `CHEMISTRY_COLORS` 语义规范
- [ ] 参数区聚焦核心教学变量（避免堆砌冗余控件）

## Canvas/SVG/图表检查

- [ ] 使用容器尺寸 + 主题 token + min/max 约束，无硬编码最终尺寸
- [ ] SVG 路径与样式通过主题 token，无硬编码颜色或尺寸
- [ ] 新增图表使用 `BaseChart` + 插件体系，无手写 `toSvgX`/`toSvgY`
- [ ] 图表组件从 `@/components/Chart` barrel import

## 化学计算检查

- [ ] 新增化学计算函数有 JSDoc + 单位注释
- [ ] 化学计算纯函数有相应的单元测试
- [ ] 化学计算逻辑正确，验证过边界情况

## 化学量与颜色检查

- [ ] 化学量颜色使用 `CHEMISTRY_COLORS`（浓度/速率/活化能/pH/电子等），无遗漏
- [ ] 场景器材使用 `SCENE_COLORS`，禁止 UI 色或 HEX 硬编码
- [ ] 图表使用 `CHART_COLORS`，无混用
- [ ] 所有 import 从 `@/theme` 统一入口，禁止子路径（`@/theme/chemistry` 等）
- [ ] SVG 文字使用 `font()` 包裹，无裸 `fontSize={N}` / `fontSize: N`

## 数据与注册表检查

- [ ] 新增动画已在对应领域注册表 `src/data/registries/*.ts` 注册（`controlsMode` 默认 `'timed'`，`defaultParams as const`）
- [ ] 如有平衡终点，已配置 `stopCondition`
- [ ] 如需逐步加试剂，已使用 `controlMeta` `type='step'`
- [ ] 新增知识点已在 `src/data/knowledge/*.ts` 与 `src/data/knowledgeTree.ts` 核对（如适用）
- [ ] 化学量构建器已实现并注册到 `src/data/chemistryQuantities.ts`
- [ ] 新增数据结构可序列化，符合类型安全
- [ ] 右侧屏使用 `ChemistryPanel`（含 `FormulaSection` / `GaokaoSection` / `WarningSection`）渲染

## 测试与构建检查

- [ ] Vitest 全量测试通过（`npm run test:run`）
- [ ] 生产构建成功（`npm run build`）
- [ ] 无控制台报错

## 文档与日志检查

- [ ] 若为重大里程碑或跨模块架构变更，按需在 `PROCESS_LOG.md` 添加摘要记录
- [ ] 若新增/修改公共组件，同步更新 `docs/agent-rules/ui/COMPONENT_REGISTRY.md`

## 路由检查

- [ ] 仅使用 `HashRouter`，未引入 `BrowserRouter`
- [ ] 路由跳转正确，无 404 错误
