# 延后处理待办事项

> **本文档是待完成计划，不是完成记录。**
> 最后更新：2026-11-27

---

## 文件规模标准：统一为单一门禁（已收敛，按需关注高行数文件）

**背景**：原仓库并存两套文件规模口径，互相矛盾且易造成认知混乱（审查报告 G11）：

| 标准 | 位置 | 阈值 | 是否生效 |
|---|---|---|---|
| 架构门禁 | `scripts/check-large-files.mjs` | SOFT 800 / HARD 1000（带理由豁免名单） | ✅ CI + lefthook pre-push |
| 孤立脚本 | `scripts/check-file-size.cjs` | 逻辑文件 400 行 | ❌ 仅 `npm run lint:filesize` 手动可达 |

**已处理**：删除 `scripts/check-file-size.cjs` 与 `package.json` 的 `lint:filesize` 脚本；`src/data/knowledgeTree.ts` 已拆分至 98 行并移出豁免名单。
**唯一有效标准**：`scripts/check-large-files.mjs`（SOFT 800 / HARD 1000）。当前有效豁免 **4 条**，新增超标文件必须拆分，或在 `ALLOWLIST` 中登记**带理由**的条目。

**重点关注清单（2026-11-27 实测 ≥ 700 行源码，非测试）**：

```
1020  src/components/Chemistry/GaokaoDiagram/index.tsx               (已在 ALLOWLIST 豁免，超过 1000 行硬阈值)
 845  src/features/industrial-flow/hooks/useIndustrialFlowChemistry.ts (已在 ALLOWLIST 豁免)
 835  src/features/organic-functional-matrix/constants.ts            (已在 ALLOWLIST 豁免)
 817  src/features/gas-chain/components/GasChainCenterView.tsx        (已在 ALLOWLIST 豁免)
 800  src/features/organic-retrosynthesis/data/protectionStrategyModels.ts
 788  src/features/vsepr-hybrid-3d/data/vseprData.ts
 768  src/features/industrial-flow/components/IndustrialFlowSvgFlowchart.tsx
 739  src/features/inorganic-ion-matrix/components/IonCoexistenceMatrixView.tsx
 705  src/features/electrochemical-twin/components/ElectrochemicalTwinCenterView.tsx
 701  src/features/organic-functional-matrix/components/OrganicFullMatrixView.tsx
```

> 注：原 756 行的 `IndustrialFlowCenterView.tsx` 已于 11-24 拆分为阶段 Hook 与渲染器，降至 238 行。
> 现状：`GaokaoDiagram/index.tsx`（1020 行）与 `useIndustrialFlowChemistry.ts`（845 行）已随技术理由登记于 `scripts/check-large-files.mjs` 的 `ALLOWLIST`；后续若继续增长可按图形品类或纯静态体系文本表做领域内聚拆分。

---

## GaokaoModelsHome Filter Tabs a11y 注入（暂缓）

**位置**：`src/features/home/GaokaoModelsHome.tsx:94-140`（分类 Filter Tabs）

**现状**：四个 pill 形按钮（`all` / `master-model` / `memory-matrix` / `experiment-chain`，无 emoji，每项选中色不同，带计数），是"分类筛选 chip"UI 范式。

**暂缓原因**：
- `SegmentedControl` 无法承载"每项不同选中色 + pill 形状"，强行套用会破坏视觉
- 该区域是主页分类区，非三屏左屏，不在铁律6范围
- 仅 a11y 收益，性价比低

**待办**：如需统一 a11y 语义，采用"仅注入 `useRadioGroup` 语义 prop（role/aria-checked/tabIndex/onKeyDown/ref），保留 pill 样式"的方案，**不要套 SegmentedControl**。参考 `KnowledgeTreeHome.tsx` 视角切换的注入方式。
