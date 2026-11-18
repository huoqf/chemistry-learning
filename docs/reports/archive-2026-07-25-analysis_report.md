# Chemistry Learning 项目分析报告

> 分析时间：2026-07-25 | 源码总量：345 个 TS/TSX 文件，其中 features/ 111 个
> 最近更新：2026-07-25 | 修复 6 项，验证通过（32 测试文件 / 187 用例全绿 + lint 全通过）

---

## 一、架构分析

### 1.1 整体分层结构（优良）

```
App.tsx → pages/ → features/<domain>/<topic>/
              ↓
          components/{UI, Chemistry, Chart, Layout, Chemistry3D}
              ↓
          hooks/ → stores/ → data/ → chemistry/
              ↓
          theme/  scene/  utils/
```

**分层清晰**，职责边界总体合理：
- `features/` 按领域（reaction-principle / structure / inorganic / organic / experiment）划分，内部三层（Animation + hooks + components）遵循设计规范
- `data/registries/` 集中管理所有动画配置，与功能代码物理分离
- `theme/` 统一出口，语义颜色层级隔离（UI / 场景 / 图表 / 化学量）设计完整
- `scene/` 坐标系类型安全设计（Branded Types）是亮点

---

### 1.2 架构风险点

#### ⚠️ 风险 1：`animationRegistry.ts` 全局可变状态

```ts
// src/data/animationRegistry.ts
let fullRegistry: Record<string, AnimationConfig> = {}  // 模块级可变对象
let extendedLoaded = false
let extendedPromise: Promise<void> | null = null
```

- **问题**：`fullRegistry` 是模块级单例，测试间状态会泄漏；`loadExtendedRegistry()` 同时承担加载、`Object.assign` 合并、动态关联知识树三件事，职责过重
- **建议**：将 registry 封装为 class 或使用 factory 函数，暴露 `createRegistry()` 供测试注入；知识树关联逻辑移至独立函数 `linkKnowledgeTree(registry)`

---

#### ⚠️ 风险 2：`chemistryQuantities.ts` 顶层副作用注册

```ts
// 文件顶层直接执行副作用
registerQuantityBuilder('anim-le-chatelier', buildLeChatelierQuantities)
registerQuantityBuilder('anim-collision-theory', buildCollisionTheoryQuantities)
// ...共 12 次
```

- **问题**：模块 import 即触发注册，无法 tree-shake
- **建议**：将注册逻辑集中到 `initQuantityBuilders()` 显式调用，实现真正的按需加载

---

#### ✅ 风险 3：`AnimationPage.tsx` 内调用 `useAnimationStore.getState()` — 已修复

```tsx
// src/pages/AnimationPage.tsx — 修复后
const setParams = useAnimationStore((s) => s.setParams)
const updateParam = useAnimationStore((s) => s.updateParam)
const showVectors = useAnimationStore((s) => s.showVectors)
// ...所有状态读取均通过 hook 订阅
```

- **修复**：将 `getState()` 全部替换为 `useAnimationStore(s => s.xxx)` hook 订阅，消除响应式订阅缺失风险

---

#### ⚠️ 风险 4：`KnowledgeTreeHome.tsx` 超载（533 行，27 KB）

- **问题**：将分组渲染、节点过滤、动画跳转、学习进度展示、Tab 切换全部塞入单文件
- **建议**：按职责拆分：`NodeCard.tsx`、`SectionGroup.tsx`、`ProgressBadge.tsx`、`useKnowledgeFilter.ts`

---

#### ✅ 风险 5：`IsomerismAnimation.tsx` 数据/逻辑混放（651 行）— 已修复

- **修复**：5 组异构体数据（PENTANE / BUTANOL / ESTERS / AROMATIC / BUTENE，共 ~600 行）提取到 `data/isomerData.ts`，`IsomerismAnimation.tsx` 从 650 行精简至 62 行

---

### 1.3 双注册问题

同一个动画同时需要在 **5 个文件**中注册（`AGENTS.md` 铁律 6），对新增页面的维护者心智负担较高：

| 文件 | 操作 |
|------|------|
| `data/registries/<domain>.ts` | 注册 AnimationConfig |
| `data/quantities/<domain>/<topic>.ts` | 实现 QuantityBuilder |
| `data/chemistryQuantities.ts` | 手动 `registerQuantityBuilder(...)` |
| `data/knowledgeTree.ts` | 确认知识节点 |
| `data/gaokaoModels.ts` | 可选：注册高考母题 |

**建议**：在 `AnimationConfig` 类型上增加可选的 `quantityBuilder?: QuantityBuilder` 字段，由 registry 加载时自动注册，消除 `chemistryQuantities.ts` 中的手动行。

---

## 二、代码质量提升建议

### 2.1 测试覆盖度不足

| 类型 | 数量 |
|------|------|
| 测试目录 | 21 个 `__tests__/` |
| 测试文件 | 32 个 `.test.ts/tsx` |
| features/ 动画文件 | 111 个 |

- `features/` 下大多数 `hooks/` 和 `components/` 缺少对应测试；现有测试集中在工具函数层（`utils/`、`scene/`、`theme/`）
- **建议**：优先为 `useLeChatelierChemistry`、`usePlaybackLoop` 等核心化学计算 hook 补充单元测试，化学逻辑错误成本最高

---

### ✅ 2.2 `AnimationPage.tsx` 中过滤逻辑重复 — 已修复

- **修复**：提取 `isConditionVisible(condition, params)` 到 `utils/controlVisibility.ts`，`AnimationPage.tsx` 和 `ControlPanel.tsx` 共用同一函数，消除重复实现

---

### ✅ 2.3 硬编码英文字符串散落 — 已修复

- **修复**：`AnimationPage.tsx` 中 3 处英文字符串（"Animation Not Found"、"Back to Knowledge"、"Loading..."）改为中文（"动画未找到"、"返回知识树"、"加载中..."）

---

### 2.4 `useAnimationLifecycle` 中 `effectiveControlsMode` 重复计算

```ts
// useAnimationConfig（init 时计算一次）
const initMode = typeof config.controlsMode === 'function'
  ? config.controlsMode(config.defaultParams)
  : (config.controlsMode ?? 'timed')

// usePlaybackLoop（每次渲染重复计算）
const effectiveControlsMode = typeof config?.controlsMode === 'function'
  ? config.controlsMode(params)
  : (config?.controlsMode ?? 'timed')
```

`typeof config?.controlsMode === 'function'` 的三元判断在 `usePlaybackLoop` 内每帧都会重新求值（虽然本身不贵）。若函数形式的 `controlsMode` 涉及复杂计算，应用 `useMemo` 缓存。

---

### 2.5 `structure.ts` 注册表过于庞大（497 行，19 KB）

每个动画的 `controlMeta`（数组字面量）、`paramMeta`、`formulas`、`gaokaoPoints` 全部内联在注册表里，导致文件膨胀。
**建议**：将每个动画的元数据拆为独立文件（如已有的 `quantities/structure/unitCellCalculation.ts` 做法），注册表只保留 `Component` 和引用。

---

### ✅ 2.6 `preloadQuantityBuilder` 为空函数 — 已修复

- **修复**：删除空函数 `preloadQuantityBuilder` 及其在 `useAnimationLifecycle.ts` 和 `data/index.ts` 中的所有引用

---

### ✅ 2.7 `Isomer3DScene.tsx` WebGL 检测重复实现 — 已修复

```tsx
// Isomer3DScene.tsx — 修复前：自建 isWebGLAvailable()
let _cachedWebGL: boolean | null = null
function isWebGLAvailable(): boolean { ... }

// 修复后：复用共享工具
import { isWebGLAvailable } from '@/components/Chemistry3D/utils/webgl'
```

- **修复**：删除本地 `isWebGLAvailable()` 实现，改为从 `@/components/Chemistry3D/utils/webgl` 导入，消除 WebGL context 泄漏风险

---

## 三、优先级总结

| 优先级 | 问题 | 影响 | 状态 |
|--------|------|------|------|
| 🔴 高 | `AnimationPage` 使用 `getState()` 读 storeStates | 潜在响应式 Bug | ✅ 已修复 |
| 🔴 高 | `preloadQuantityBuilder` 空实现 | 功能误导，性能虚设 | ✅ 已修复 |
| 🔴 高 | `Isomer3DScene` WebGL 检测重复实现 | context 泄漏风险 | ✅ 已修复 |
| 🟡 中 | `animationRegistry` 全局可变状态 | 测试隔离困难 | 待处理 |
| 🟡 中 | 条件可见性逻辑重复（两处实现） | 维护风险 | ✅ 已修复 |
| 🟡 中 | `IsomerismAnimation.tsx` 数据内联（606 行静态数据） | 可读性差 | ✅ 已修复 |
| 🟡 中 | `KnowledgeTreeHome.tsx` 单文件 533 行 | 维护成本高 | 待处理 |
| 🟢 低 | 注册表 `structure.ts` 元数据内联 | 文件体积 | 待处理 |
| 🟢 低 | 硬编码英文 UI 字符串 | 一致性 | ✅ 已修复 |
| 🟢 低 | `effectiveControlsMode` 每帧重算 | 微性能 | 待处理 |

---

## 四、值得保留的优秀设计

1. **Branded Coordinate Types**（`scene/coordinates.ts`）：编译期防止坐标系混用，是少见的严格类型工程实践
2. **`lazyWithPreload`**：为懒加载组件附加 `.preload()` 方法，支持 hover 预取，设计简洁
3. **`useAnimationFrame` / `useSimulationFrame` 分离**：播放动画和物理仿真两条 rAF 链路的差异明确区分，防止 rAF 泄漏
4. **Theme 统一出口**（`@/theme`）：颜色语义层级（UI / 场景 / 图表 / 化学量）分离完整，配合 lint 脚本强制执行
5. **声明式 `AnimationConfig`**：一个对象统一描述参数、控件、公式、高考要点、停止条件，新增页面规范一致
6. **双视角导航**（教材章节 ↔ 高考母题）：业务设计具有明确教学目标导向

---

## 五、修改记录

| 日期 | 修改 | 文件 |
|------|------|------|
| 2026-07-25 | 修复 `getState()` 响应式问题 | `src/pages/AnimationPage.tsx` |
| 2026-07-25 | 提取 `isConditionVisible()` 统一函数 | `src/utils/controlVisibility.ts` |
| 2026-07-25 | 删除空函数 `preloadQuantityBuilder` | `src/data/chemistryQuantities.ts`, `src/hooks/useAnimationLifecycle.ts`, `src/data/index.ts` |
| 2026-07-25 | 异构体数据外提 | `src/data/isomerData.ts`, `src/features/structure/isomerism/IsomerismAnimation.tsx` |
| 2026-07-25 | 英文字符串改中文 | `src/pages/AnimationPage.tsx` |
| 2026-07-25 | WebGL 检测复用共享工具 | `src/features/structure/isomerism/components/Isomer3DScene.tsx` |
