---
name: new-gaokao-model
description: 新建高考解题母题专题 / 创建记忆矩阵探究页面 / 新增双对比解题模型 / 注册高考解题平行节点 / 新增高考提分模块
---

# 新建高考解题母题专题 Skill

> 本 Skill 专门用于指导创建以**高考解题母题**与**记忆强化矩阵**为核心的高考提分平行模块。所有开发必须保持对现有 3D 模型与教材知识树的 100% 兼容。

---

## Step 0：设计决策（高考提分视角）

### 0A：母题与记忆类型选择

| 模式类型 | 适合场景 | 采用组件与模板 |
|--------|---------|───────────────|
| **双屏联动解题母题** | 滴定曲线、平衡移动 $c-t/v-t$ 图像、离子浓度排序 | `DualChartNexusTemplate` + `BaseChart` 动态描点 |
| **双对比强化母题** | 原电池 vs 电解池、强酸滴定 vs 弱酸滴定 | `ContrastCanvas` 左右分屏对比 |
| **无机价类二维矩阵** | $\text{Fe/Cu/Al/S/N/Si}$ 化合价与物质类别元素复习 | `ValenceMatrixCanvas` 交互卡片与显色微动画 |
| **探究步进加药试剂台** | 沉淀变色过程（如 $\text{Fe(OH)}_2 \to \text{Fe(OH)}_3$）、逐步显色 | `controlsMode: 'step'` 步进控制台 |
| **3D 晶胞与结构母题** | 晶胞切割均摊法、VSEPR 模型推导 | 复用现有 `unit-cell-calculation` / `vsepr-model` 3D 组件 |

### 0B：三屏分布铁律 (Three-Panel Distribution)

```
左屏 (LeftPanel)             中屏 (Canvas/3D/SVG)            右屏 (RightPanel)
────────────────────         ─────────────────────────        ──────────────────────────
• 解题参数/模式切换           • 微观/宏观动画主场景            • QuantitySection (核心推导量)
• 步进加药控制 (Step)        • 左右双对比 / 矩阵交互           • BaseChart (实时解题图像)
                              禁止大段教学说明文字             • ExamPointSection (高考母题真题变式)
```

---

## Step 1：数据元数据注册 (`gaokaoModels.ts`)

在 `src/data/gaokaoModels.ts` 中注册母题节点：

```ts
export const gaokaoModels: GaokaoModelNode[] = [
  {
    id: 'model-xxx',
    category: 'master-model', // 'master-model' | 'memory-matrix' | 'experiment-chain'
    title: 'xxx 高考解题母题',
    subtitle: '高考必考压轴题破解',
    description: '深入分析 xxx 核心规律与解题步骤',
    animationId: 'anim-xxx',
    relatedKnowledgeIds: ['node-yyy', 'node-zzz'], // 反向关联教材知识树节点
  }
]
```

---

## Step 2：验证与双向互通检查

1. **零破坏检查**：确认新增母题未侵入 `src/data/knowledgeTree.ts` 原有架构。
2. **双向跳转测试**：
   - 从高考平行主页 (`/`) 可以点击进入母题页面。
   - 从关联的教材知识点页面，能看到 `🔗 关联高考母题` 的跳转卡片。
3. **响应式与 Theme Token 隔离**：
   - 界面 UI 元素 100% 使用 `@/theme` 统一入口导出 `colors.*`。
   - 画布与图表使用 `CHART_COLORS` / `CHEMISTRY_COLORS` / `SCENE_COLORS`。
