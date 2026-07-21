# ChemViz 知识树优化 — 待办与推进记录

> 评估时间：2026-07-21
> 基于当前代码库（96 考点 / 5 大板块 / 2 个板块已有动画）

---

## 一、五大方案评估结论

| 方案 | 匹配度 | 工期 | 优先级 | 核心瓶颈 |
|------|--------|------|--------|----------|
| 1. 交互标签 | ★★★★★ | 1-2 天 | **P0** | 无 |
| 5. 三重表征 | ★★★★★ | 1-2 周 | **P1** | 公式-动画联动高亮 |
| 3. PhET 沙盒 | ★★★★★ | 每考点 1 周 | **P1** | 化学建模与场景绘制 |
| 4. 有机 3D+断键 | ★★★★☆ | 2-3 周 | P2 | 断键动画原语缺失 |
| 2. 价类矩阵 | ★★★☆☆ | 1-2 周 | P2 | 氧化还原微观动画缺失 |

---

## 二、当前系统能力基线

- **知识树节点类型**：`KnowledgeNode` 仅有基础字段，无交互类型 / 价态 / 物质类别 / 表征维度字段
- **已注册动画**：仅 `reaction-principle`（le-chatelier）+ `structure`（vsepr/chiral/unit-cell）有动画。有机化学、电化学、无机化学（除结构外）的 `animationIds` 几乎全部为空
- **三屏布局**：`ThreePanel` 成熟（左参数 / 中动画 / 右公式）
- **参数控制**：`ParamControl` + `ControlPanel` 支持条件显示、滑块、模式切换
- **动画基础设施**：`useAnimationViewport` + `CANVAS_PRESETS` + `useSceneScale` + `useAnimationLifecycle` 已标准化
- **可视化组件**：`VectorArrow`、`IonMigration`（离子定向迁移）、`EquilibriumChart`、KaTeX 公式渲染
- **沙盒先例**：`le-chatelier` 已是完整 PhET 式沙盒（温度/压强/浓度滑块 + 实时图表 + 微观粒子动画）

---

## 三、P0：交互类型功能标签（Interaction Badges）

### 目标
为每个考点节点增加**交互功能 Tag**，明确这个动画"能玩什么"。

### 标签枚举
- `[3D分子旋转]`：同分异构体、VSEPR 模型、杂化轨道
- `[断键/成键推演]`：乙醇催化氧化、酯化反应、烯烃加成
- `[粒子碰撞沙盒]`：反应速率、化学平衡移位
- `[微粒流向/电极视角]`：原电池、电解池、离子反应
- `[价类二维地图]`：无机元素化合物专属
- `[晶胞结构]`：NaCl/CsCl/金刚石等

### 技术路径
1. 扩展 `KnowledgeNode`：增加 `interactionTags?: InteractionType[]`
2. `KnowledgeTreeHome` 节点卡片顶部增加彩色 badge 行
3. （可选）支持按交互类型过滤/排序

### 状态
- [x] 扩展 `KnowledgeNode` 类型定义
- [x] 定义 `InteractionType` 联合类型与 `INTERACTION_MAP` 样式配置
- [x] 为现有 96 个考点节点标注 `interactionTags`
- [x] 修改 `KnowledgeTreeHome` 渲染 badge
- [x] 测试 + Playwright 验证
- [x] 同步 GitHub

---

## 四、P1-1："微观-宏观-符号"三重表征视图架构

### 目标
将现有三屏布局明确定义为三重表征载体，增加联动机制。

### 当前三屏 vs 三重表征的映射
| 三屏位置 | 当前用途 | 对应三重表征 |
|----------|----------|-------------|
| 左屏 | 参数控制 | 实验条件（宏观操作） |
| 中屏 | 动画 | 微观粒子 / 宏观现象 |
| 右屏 | 公式推导 | 符号表征 |

### 技术路径
1. 扩展 `AnimationConfig`：增加 `tripleRepresentation: { micro: boolean; macro: boolean; symbol: boolean }`
2. 中屏增加上下分屏或 Tab 切换：`CANVAS_PRESETS.splitV`（上微观 + 下宏观）已内置
3. 右屏公式与动画时间轴联动：动画播放到某时刻，公式中对应项/系数同步高亮
4. 为 `le-chatelier` 等已有动画补充"宏观现象"视角（如试管颜色深浅变化）

### 状态
- [x] 扩展 `AnimationConfig` / `AnimationEntry` 类型
- [x] 扩展 `AnimationPage` 支持三重表征标识展示
- [ ] 开发 ChemistryPanel 公式联动高亮机制
- [ ] 为 `le-chatelier` 补充宏观视角（颜色变化）
- [x] 测试 + Playwright 验证
- [x] 同步 GitHub

---

## 五、P1-2：PhET 式碰撞理论沙盒

### 目标
开发"影响反应速率的因素 / 碰撞理论"交互动画，提供滑动条调节温度、浓度、催化剂，微观窗口实时展示活化分子占比与有效碰撞频率。

### 技术路径
复制 `le-chatelier` 成熟架构：
1. `paramMeta` + `controlMeta` 定义参数（T, c, catalyst）
2. `useCollisionChemistry` hook：物理计算 + 粒子分布
3. `CollisionScene` 组件：微观粒子碰撞 SVG/Canvas 渲染
4. `CollisionChart` 组件：速率-时间 / 能量分布图

### 状态
- [x] 新建 `features/reaction-principle/collision-theory/` 目录
- [x] 开发 `useCollisionPhysics.ts` 纯计算 hook
- [x] 开发 `ParticleScene.tsx` 微观粒子渲染
- [ ] 开发 `CollisionChart.tsx` 图表（后续迭代）
- [x] 注册到 `reaction-principle.ts` 动画注册表
- [x] 测试 + Playwright 验证
- [x] 同步 GitHub

---

## 六、P2 待办（暂不执行）

### P2-1：有机化学 — 3D 空间 + 断键演变
- 断键动画原语开发（键变虚/消失 → 原子位移 → 新键生成）
- `useReactionMechanism` hook 设计
- 建议分阶段：先做 3D 构型（复用现有），再做断键

### P2-2：无机化学 — 价态-类属二维交互矩阵
- 扩展节点字段：`valenceStates` + `substanceCategory`
- 开发二维网格视图组件
- 配合氧化还原微观动画（`redox-electron-transfer` 目前 animationIds 为空）

---

## 七、推进路线图

```
阶段1（P0，立即，1-3 天）
  └─ KnowledgeNode + interactionTags
  └─ KnowledgeTreeHome 渲染交互 badges

阶段2（P1-1，短期，1-2 周）
  └─ AnimationConfig + tripleRepresentation 标志
  └─ ChemistryPanel 公式-动画联动高亮

阶段3（P1-2，中期，1-2 周）
  └─ 碰撞理论沙盒（复制 le-chatelier 模式）

阶段4（P2，长期，4-6 周）
  └─ 原电池 / 电解池动画（复用 IonMigration + VectorArrow）
  └─ 有机 3D 构型（复用 chiral-molecule 模式）
  └─ 断键动画原语开发
  └─ 价类二维矩阵 + 电子转移动画
```

---

## 八、变更记录

| 日期 | 内容 | 提交 |
|------|------|------|
| 2026-07-21 | 创建 TODO_deferred.md，记录五大方案评估与推进计划 | — |
| 2026-07-21 | 完成 P0 交互标签、P1-1 三重表征架构、P1-2 碰撞理论沙盒开发与验证 | — |
