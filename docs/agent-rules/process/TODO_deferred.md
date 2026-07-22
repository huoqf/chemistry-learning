# 延后处理待办事项

> **本文档是待完成计划，不是完成记录。**
> 最后更新：2026-07-22

---

## GaokaoModelsHome Filter Tabs a11y 注入（暂缓）

**位置**：`src/features/home/GaokaoModelsHome.tsx:82-110`（分类 Filter Tabs）

**现状**：三个 pill 形按钮，每项选中色不同（slate-800 / amber-600 / rose-600），带 emoji 和计数，是"分类筛选 chip"UI 范式。

**暂缓原因**：
- `SegmentedControl` 无法承载"每项不同选中色 + pill 形状"，强行套用会破坏视觉
- 该区域是主页分类区，非三屏左屏，不在铁律6范围
- 仅 a11y 收益，性价比低

**待办**：如需统一 a11y 语义，采用"仅注入 `useRadioGroup` 语义 prop（role/aria-checked/tabIndex/onKeyDown/ref），保留 pill 样式"的方案，**不要套 SegmentedControl**。参考 `KnowledgeTreeHome.tsx` 视角切换的注入方式。
