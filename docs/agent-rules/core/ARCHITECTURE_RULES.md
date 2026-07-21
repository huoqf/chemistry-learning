# 架构规则文档

## 0. 适用范围与优先级

本文件约束「高中化学交互动画学习系统」的前端、数据层、化学计算层与桌面打包层实现。

本文件是技术架构的权威来源。核心规范已整合至 `.trae/rules/project_rules.md`（Trae IDE 自动加载），本文件提供架构细则与铁律权威定义。

---

## 1. 技术栈声明

技术栈完整声明见 `project_rules.md 2`，本文件不再重复。

---

## 2. 目录结构

```text
src/
├── app/                    # 应用壳、路由、全局布局
├── components/
│   ├── Layout/             # 布局组件（ThreePanel 等）
│   ├── Chemistry/          # 化学渲染公共组件（VectorArrow、ChemistryVectorArrow 等）
│   └── UI/                 # UI 基础组件
├── hooks/                  # 跨页面复用 Hook
│   └── useAnimationLifecycle.ts  # AnimationPage 生命周期封装
├── pages/                  # 页面级容器（薄壳）
├── scene/                  # 场景配置与坐标缩放（SceneConfig、SceneScale）
├── features/               # 按学科/能力拆分的业务模块
│   ├── inorganic/          # 无机化学（按化学主题分子目录）
│   │   ├── redox/          #   氧化还原
│   │   ├── ionic/          #   离子反应
│   │   └── metals/         #   金属及其化合物
│   ├── organic/            # 有机化学
│   │   ├── hydrocarbons/   #   烃
│   │   └── functional/     #   烃的含氧衍生物
│   ├── physical/           # 物理化学
│   │   ├── rate/           #   化学反应速率
│   │   ├── equilibrium/    #   化学平衡
│   │   └── electrochem/    #   电化学
│   ├── structure/          # 物质结构
│   │   ├── atomic/         #   原子结构
│   │   └── molecular/      #   分子结构
│   ├── solution/           # 水溶液中的离子反应与平衡
│   └── dev/                # 开发调试专用
├── chemistry/              # 纯化学计算（无副作用，不得依赖 React/DOM/window）
├── math/                   # 数学工具
├── utils/                  # 坐标、动画、存储等共享工具
│   ├── animation.ts        #   动画帧 Hook
│   ├── coordinate.ts       #   坐标转换
│   └── storage.ts          #   IndexedDB / LocalStorage 封装
├── data/
│   ├── types.ts            # AnimationConfig 等核心类型定义
│   ├── quantities/         # 化学量构建器（按化学主题拆分，懒加载）
│   ├── knowledgeTree.ts    # 知识树索引
│   ├── defineAnimations.ts # defineAnimations 工具函数
│   ├── registries/         # 按模块拆分的动画子注册表
│   ├── animationRegistry.ts # 薄合并入口
│   └── chemistryQuantities.ts # 化学量懒注册入口
└── stores/
    ├── useAnimationStore.ts
    ├── useAppStore.ts
    ├── useKnowledgeStore.ts
    └── useProgressStore.ts

theme/                      # 设计 token（统一入口 @/theme）
├── colors.ts               # UI 语义色
├── chemistry/              # 化学主题子模块
│   ├── colors.ts / sceneColors.ts / vectorStyle.ts / canvasStyle.ts / arrowStyle.ts / index.ts
├── spacing.ts              # 间距比例尺 + CANVAS_PRESETS
├── radius.ts / shadow.ts / motion.ts / animationTokens.ts / index.ts
```

新增规则：
- 新功能模块 -> `src/features/`
- 纯化学计算 -> `src/chemistry/`
- 数学工具 -> `src/math/`
- 状态管理 -> `src/stores/`
- 静态数据 -> `src/data/`
- 禁止将页面逻辑直接塞进业务组件内部

---

## 3. 组件分层与依赖方向

### 3.1 分层职责

- **页面组件**：路由装配、布局组织、数据注入，不放复杂业务逻辑
- **功能组件**：单一化学场景、题目拆解或知识点演示
- **通用组件**：可复用 UI 片段
- **工具函数**：纯逻辑或明确副作用，不承担页面职责

### 3.2 依赖方向（单向）

```
页面组件 -> 功能组件 -> 通用组件 -> 工具函数
                              ^
              viewModel -> hooks
                    ^
            chemistry/ & math/
```

- `chemistry/` 与 `math/` **不得**依赖 React、DOM、window、document
- `viewModel` **不得**依赖 viewport 相关坐标
- 页面层**不得**反向依赖底层计算实现细节

---

## 4. 纯函数规则

### 4.1 定义

纯函数必须满足：相同输入->相同输出，无副作用，不读外部可变状态。

### 4.2 存放位置与命名

| 位置 | 职责 | 命名示例 |
|------|------|---------|
| `src/chemistry/` | 化学量计算与状态求解 | `calculateReactionRate` |
| `src/math/` | 数学工具 | `interpolate` |
| `src/utils/` | 坐标转换、动画控制、存储封装 | `worldToDesign` |

- 化学计算函数：动宾结构，如 `calculateEquilibriumConcentration(c0, k, t)`
- 不得把渲染逻辑、页面状态混入纯计算模块

---

## 5. 状态管理规则

- 所有 Store 放入 `src/stores/`
- Store 只保存「真值」，不保存可派生状态
- 派生状态在组件层通过 `useMemo()` 或 selector 计算
- Action 必须动词开头：`setParams`、`updateProgress`、`reset`

| Store | 职责 |
|-------|------|
| useAnimationStore | 播放状态、时间轴、速度、参数、显示开关 |
| useKnowledgeStore | 知识树展开、当前节点、浏览历史 |
| useAppStore（可选） | 全局 UI 状态 |
| useProgressStore | 学习进度，持久化至 IndexedDB |

### 5.1 性能指南

- **精确订阅**：消费 Zustand store 时使用 selector 精确订阅所需字段
- **防抖持久化**：IndexedDB 写入操作应使用防抖（推荐 500ms）
- **可序列化优先**：Store 状态优先使用原生可序列化类型

---

## 6. 坐标系统规则

> **新页面唯一标准路径**：`useAnimationViewport` + `useSceneScale` + `worldToDesign`

| 坐标路径 | 适用场景 | 状态 |
|---------|---------|------|
| useAnimationViewport + useSceneScale + worldToDesign | 新页面标准路径 | 必须 |
| 旧有坐标转换函数 | 存量旧代码维护 | 禁止新页面使用 |

- **禁止**在组件中直接写像素换算逻辑或魔法数字定位

---

## 7. 动画系统规则

- 所有动画必须使用统一入口，**禁止**在组件中直接调用 `requestAnimationFrame`
- **禁止**各组件自行实现 easing 曲线或时间控制器
- 动画回调必须处理 `deltaTime`

| Hook / 模块 | 位置 | 适用场景 |
|-------------|------|---------|
| useAnimationFrame | src/utils/animation.ts | 受播放状态控制的动画帧 |
| useSimulationFrame | src/utils/animation.ts | 持续运行的仿真帧 |
| useAnimationLifecycle | src/hooks/useAnimationLifecycle.ts | AnimationPage 专用生命周期封装 |

---

## 8. 数据层规则

### 8.1 数据位置

| 数据类型 | 路径 |
|---------|------|
| 核心类型定义 | src/data/types.ts |
| 知识树索引 | src/data/knowledgeTree.ts |
| 动画注册表 | src/data/animationRegistry.ts |
| 化学量构建器 | src/data/quantities/ |
| 化学量懒注册入口 | src/data/chemistryQuantities.ts |

### 8.1.1 化学量构建器扩展指南

新增动画的化学量构建逻辑必须：
1. 在 `src/data/quantities/` 对应子模块中实现构建函数
2. 在 `src/data/chemistryQuantities.ts` 的 quantityRegistry 中添加一条记录
3. 动画页进入时通过 preloadQuantityBuilder() 预加载

### 8.1.2 参数类型安全规范

- 构建器参数归一化：通过 normalizeParams() 将 Record<string, number> 归一化为类型安全的具名接口
- AnimationConfig 泛型联动：defaultParams 必须添加 as const

### 8.1.3 左屏控制数据协议

详见 project_rules.md 铁律 6。

### 8.1.4 底部播放控制器协议（controlsMode）

| 模式 | 字段值 | 底部 UI | 判断依据 |
|------|--------|---------|---------|
| 完整控制栏 | 'timed'（默认） | 播放/暂停 + 重置 + 速度 + 进度条 | 动画有明确起点/终点 |
| 循环速度栏 | 'loop' | 循环运行中徽章 + 速度选择器 | 永续循环无终点 |
| 参数提示条 | 'param' | 参数面板提示条 | 画面由参数直接决定 |

### 8.2 storage 接口约定

```ts
export const storage = {
  getLocal(key: string): unknown,
  setLocal(key: string, value: unknown): void,
  removeLocal(key: string): void,
  getDB<T>(key: string): Promise<T>,
  setDB(key: string, value: unknown): Promise<void>,
  removeDB(key: string): Promise<void>,
  clearDB(): Promise<void>,
}
```

---

## 9. 路由与页面规则

- 强制使用 `HashRouter`，禁止改为 `BrowserRouter`

| 路由 | 页面 | 职责 |
|------|------|------|
| / | HomePage | 知识地图入口、学习概览与进度 |
| /animation/:id | AnimationPage | 化学场景交互动画 |

---

## 10. 代码规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | AnimationPage |
| 函数 | camelCase | calculateReactionRate |
| 常量 | UPPER_SNAKE_CASE | AVOGADRO_CONSTANT |
| 私有变量 | 下划线前缀 | _internalState |

- 纯函数必须有 JSDoc，公开 API 写明参数、返回值和边界条件
- import 路径从最具体的子模块入口引用

---

## 11. 依赖管理

### 11.1 已批准依赖

**生产**：react、react-dom、react-router-dom、zustand、lucide-react

**开发**：vite、@vitejs/plugin-react、tailwindcss、postcss、autoprefixer、typescript、vitest、@testing-library/react

**候选**：katex、idb、pixijs

### 11.2 新增流程

新增依赖前必须先在 PROCESS_LOG.md 申报。

---

## 12. 性能与测试

- 纯组件使用 React.memo()，计算密集逻辑使用 useMemo()
- 所有纯函数必须有测试
- 测试文件放 tests/，结构与 src/ 对齐

---

## 13. 构建与打包

- vite.config.ts 必须配置 base: './'
- 离线策略：KaTeX 字体、图标全部打包入本地资源

---

## 14. 文档维护规则

- 新增 src/theme/ token 后，同步更新 docs/agent-rules/ui/02_UI_RULES.md 对应章节
