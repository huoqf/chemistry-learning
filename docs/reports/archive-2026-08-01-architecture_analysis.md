# Chemistry Learning — 项目架构与代码质量分析报告

> 分析时间：2026-08-01 | 代码库规模：**414 个 TS/TSX 文件 · 约 1.83 MB 源码**

---

## 一、总体评分

| 维度 | 评分 | 状态 |
|------|------|------|
| 架构分层 | ★★★★★ | 优秀 |
| 类型安全 | ★★★★★ | 零 TypeScript 错误 |
| 测试覆盖 | ★★★★☆ | 198 tests，34 文件全通过 |
| 代码规范 | ★★★☆☆ | 1 个 Error + 18 个 Warning |
| 大文件控制 | ★★★★☆ | 1 个文件超 40 KB |
| 规范铁律合规 | ★★★★☆ | 3 处小违规 |

---

## 二、优点（架构亮点）

### 1. 清晰的分层架构

```
src/
  features/       ← 功能模块（animation + hooks + components 三层）
  components/     ← 公共组件（Chart / Chemistry / Layout / UI）
  data/           ← 数据层（registry + quantities + knowledgeTree）
  stores/         ← Zustand 全局状态（动画 / 进度 / 应用）
  hooks/          ← 跨域公共 hooks
  theme/          ← 设计系统统一入口（颜色/间距/字体/动效）
  utils/          ← 纯工具函数（无 React 依赖）
  scene/          ← 坐标变换与 viewport 逻辑
  chemistry/      ← 纯化学计算（零 DOM/React 依赖）
```

三层功能模块结构（`XxxAnimation.tsx` + `hooks/useXxxChemistry.ts` + `components/XxxScene.tsx`）实施一致、分离彻底。

### 2. 架构自动化守卫（5 个脚本全通过）

- ✅ `check-font-size.mjs` — 无裸数字 fontSize
- ✅ `check-no-raf.mjs` — 无直接 requestAnimationFrame
- ✅ `check-no-marker.mjs` — 无手写 SVG `<marker>`
- ✅ `check-large-files.mjs` — 无超限大文件
- ✅ `check-no-webgl-leak.mjs` — 无 WebGL 上下文泄漏

### 3. 主题设计系统成熟

- `@/theme` 统一入口，语义分层：`CHEMISTRY_COLORS` / `SCENE_COLORS` / `CHART_COLORS` / `CANVAS_COLORS` 四层隔离，未混用
- 动效 token（`duration` / `easing`）、间距 token（`LAYOUT` / `PANEL`）、`CANVAS_PRESETS` 均有规范
- `withAlpha()` 代替手写 rgba

### 4. 动画系统设计优秀

- `useAnimationLifecycle` 拆成三个子 hook（config 加载 / 发现模式 / 播放循环），职责清晰
- `useAnimationFrame` 封装 rAF，上层完全不接触 `requestAnimationFrame`
- 声明式 `controlMeta` / `paramMeta` + Registry 驱动，新功能按 5 个文件协议注册即可

### 5. 数据驱动注册 + 懒加载

- `animationRegistry.ts` 实现 core（同步）+ extended（懒加载）两级策略，首屏无额外开销
- `defineAnimations` 统一 schema 验证，防止拼写错误

---

## 三、问题清单

### 🔴 Critical (1 个 Error)

#### E1. `UnitCellScene.tsx` — Hooks 条件调用违规

**文件**：[UnitCellScene.tsx](file:///d:/code/chemistry-learning/src/features/structure/unit-cell-calculation/components/UnitCellScene.tsx#L49)

```tsx
// ❌ 错误：useMemo 在条件路径内调用，违反 Rules of Hooks
if (!selectedAtomId) return null  // ← 提前 return 在 L48
const selectedAtom = useMemo(() => { ... }, [selectedAtomId, crystalData])  // L49
```

**影响**：React 在某些渲染路径中 hooks 调用顺序不一致，可能导致运行时崩溃。  
**修复**：将 `useMemo` 移到条件 return 之前，内部用 `if (!selectedAtomId) return null` 保护。

---

### 🟡 Warnings（18 个，按类型归组）

#### W1. `useElectrolyticCellChemistry.ts` — useMemo 依赖项不准确（多 +漏）

**文件**：[useElectrolyticCellChemistry.ts](file:///d:/code/chemistry-learning/src/features/reaction-principle/electrolytic-cell/hooks/useElectrolyticCellChemistry.ts#L143)

- 漏掉 `computeStateAtTime` 函数（useMemo 内使用但未声明）
- 声明了 `cellType / anodeMaterial / current` 但实际是 `computeStateAtTime` 捕获这些依赖

**根因**：`computeStateAtTime` 是内部函数，应 `useCallback` 稳定后纳入依赖，或直接内联到 `useMemo`。

#### W2. `useIndustrialFlowChemistry.ts` — useMemo 多余依赖

**文件**：[useIndustrialFlowChemistry.ts](file:///d:/code/chemistry-learning/src/features/industrial-flow/hooks/useIndustrialFlowChemistry.ts#L377)

- `reagent` 被声明为依赖但实际未使用（可能是已删除逻辑残留）

#### W3. `useExtractionDistillationChemistry.ts` — 同上

**文件**：[useExtractionDistillationChemistry.ts](file:///d:/code/chemistry-learning/src/features/experiment/extraction-distillation/hooks/useExtractionDistillationChemistry.ts#L282)

- `vSolvent` 多余依赖

#### W4. `redoxElectronTransfer.ts` — 废弃标签

**文件**：[redoxElectronTransfer.ts](file:///d:/code/chemistry-learning/src/data/quantities/inorganic/redoxElectronTransfer.ts#L149)

```ts
// ❌ "text:" 是一个无用标签，不是对象属性
text: '【复杂氧化还原配平法则】...'
return [...]
```

该字符串永远不会被用到，可能是遗漏的注释符 `//` 或错误放置的对象键。

#### W5. `isomer3dTransform.ts` — 零乘法运算（3 处）

**文件**：[isomer3dTransform.ts](file:///d:/code/chemistry-learning/src/features/structure/isomerism/utils/isomer3dTransform.ts#L121)

```ts
addBranchGroup(ringCPositions[0], (0 * Math.PI) / 3, ...)  // 0 * π = 0，应直接用 0
```

三处 `(0 * Math.PI) / 3` 均等于 `0`，应改为 `0`（可读性问题，也可能是 `angle * Math.PI / 3` 的笔误）。

#### W6. `KatexText.tsx` — 不必要转义

**文件**：[KatexText.tsx](file:///d:/code/chemistry-learning/src/components/UI/KatexText.tsx#L20)

```ts
const parts = text.split(/(\$[^\$]+\$)/g)  // ❌ \$ 在字符类 [] 内不需要转义
// ✅ 应为
const parts = text.split(/(\$[^$]+\$)/g)
```

#### W7. `AvogadroConstantCanvas.tsx` — 非组件函数与组件混在同文件

**文件**：[AvogadroConstantCanvas.tsx](file:///d:/code/chemistry-learning/src/features/avogadro-constant/AvogadroConstantCanvas.tsx#L13)

```ts
export function renderNaText(text: string): React.ReactNode { ... }
```

`renderNaText` 是工具函数，与组件混出同文件导致 Fast Refresh 降效。应移至独立 utils 文件。

---

### 🔵 规范铁律小违规（3 处）

#### V1. `SvgDataTable.tsx` 使用了 `@/theme/chemistry` 子路径（铁律 4C）

**文件**：[SvgDataTable.tsx](file:///d:/code/chemistry-learning/src/components/Chart/SvgDataTable.tsx#L27)

```ts
// ❌ 子路径导入
} from '@/theme/chemistry'
// ✅ 应改为
} from '@/theme'
```

#### V2. `IndustrialFlowCenterView.tsx` 裸数字 fontSize（铁律 7）

**文件**：[IndustrialFlowCenterView.tsx](file:///d:/code/chemistry-learning/src/features/industrial-flow/components/IndustrialFlowCenterView.tsx)

- L349: `fontSize={10}` → 应为 `fontSize={font(10)}`
- L373, L396, L442, L475: `fontSize={9}` → 应为 `fontSize={font(9)}`

（注：`check-font-size.mjs` 脚本对这些没有捕获，说明脚本正则可能需要更新）

#### V3. `useAvogadroChemistry.ts` — 单文件 798 行，是最大文件（46.6 KB）

**文件**：[useAvogadroChemistry.ts](file:///d:/code/chemistry-learning/src/features/avogadro-constant/hooks/useAvogadroChemistry.ts)

虽然 `check-large-files.mjs` 未报错（可能有白名单或阈值宽松），该文件 798 行、包含 5 个大型独立计算函数，建议按类别拆分为子模块：
- `calculateStateVolumeTrap.ts`
- `calculateStructureBondsTrap.ts`
- `calculateElectrolyteHydrolysisTrap.ts`
- 等

---

## 四、技术债小结

| # | 问题 | 严重性 | 文件 |
|---|------|--------|------|
| E1 | Hooks 条件调用 | 🔴 Error | UnitCellScene.tsx |
| W1 | useMemo 依赖缺失/多余 (多处) | 🟡 Warning | useElectrolyticCellChemistry.ts |
| W2 | useMemo 多余依赖 | 🟡 Warning | useIndustrialFlowChemistry.ts |
| W3 | useMemo 多余依赖 | 🟡 Warning | useExtractionDistillationChemistry.ts |
| W4 | 废弃标签（潜在逻辑丢失） | 🟡 Warning | redoxElectronTransfer.ts |
| W5 | 零乘法（可能笔误） | 🟡 Warning | isomer3dTransform.ts |
| W6 | 正则不必要转义 | 🔵 Minor | KatexText.tsx |
| W7 | 工具函数与组件混出 | 🔵 Minor | AvogadroConstantCanvas.tsx |
| V1 | 主题子路径导入 | 🔵 Minor | SvgDataTable.tsx |
| V2 | 裸数字 fontSize (5处) | 🔵 Minor | IndustrialFlowCenterView.tsx |
| V3 | 超大 Hook 文件 | 🔵 Minor | useAvogadroChemistry.ts |

---

## 五、优化建议优先级

### P0（立刻修复）
- **E1** — UnitCellScene.tsx Hooks 调用顺序错误，线上风险

### P1（本周修复）
- **W1** — useElectrolyticCellChemistry.ts 依赖缺失可能导致图表不更新
- **W4** — redoxElectronTransfer.ts 废弃标签（可能是教学说明文字被误遗留）
- **W5** — isomer3dTransform.ts 零乘法角度（验证是否为笔误 `angle * π / 3`）
- **V1** — SvgDataTable.tsx 主题子路径

### P2（下次迭代）
- W2/W3 — useMemo 多余依赖（性能影响微小但会触发 lint）
- V2 — IndustrialFlowCenterView.tsx 裸字体
- W7 — AvogadroConstantCanvas.tsx 工具函数分离

### P3（长期）
- V3 — useAvogadroChemistry.ts 拆分为子模块（改善可维护性）

---

## 六、架构健康度总结

项目架构设计**非常成熟**，五大守卫脚本均通过，TypeScript 零错误，198 个测试全绿。主要技术债集中于：
1. **1 个 Hooks 规则违反**（Critical，需立刻修复）
2. **useMemo 依赖数组不精确**（多个化学 Hook，需修整）
3. **少量铁律小违规**（子路径 import、裸 fontSize）

整体来看，代码质量处于**良好到优秀**水平，适合持续迭代。
