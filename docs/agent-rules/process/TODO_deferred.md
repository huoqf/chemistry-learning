# 延后处理待办事项

> **本文档是待完成计划，不是完成记录。**
> 最后更新：2026-09-14

---

## 文件规模标准：统一为单一门禁（已收敛，遗留 400 行软目标）

**背景**：原仓库并存两套文件规模口径，互相矛盾且易造成认知混乱（审查报告 G11）：

| 标准 | 位置 | 阈值 | 是否生效 |
|---|---|---|---|
| 架构门禁 | `scripts/check-large-files.mjs` | SOFT 800 / HARD 1000（带理由豁免名单） | ✅ CI + lefthook pre-push |
| 孤立脚本 | `scripts/check-file-size.cjs` | 逻辑文件 400 行 | ❌ 仅 `npm run lint:filesize` 手动可达 |

**已处理**：删除 `scripts/check-file-size.cjs` 与 `package.json` 的 `lint:filesize` 脚本。
**唯一有效标准**：`scripts/check-large-files.mjs`（SOFT 800 / HARD 1000）。新增超标文件必须
拆分，或在 `ALLOWLIST` 中登记**带理由**的条目（既有 3 条即为此机制）。

**遗留待办**：400 行「逻辑文件」软目标已被放弃作为门禁，但清单本身仍有参考价值。
下述文件在 400 行软目标下超线（按行数降序），**不构成必须拆分**，仅提示可能存在职责混合：

```
818  src/components/Chemistry/GaokaoDiagram/index.tsx            (已在 800 门禁豁免)
801  src/features/industrial-flow/hooks/useIndustrialFlowChemistry.ts
756  src/features/industrial-flow/components/IndustrialFlowCenterView.tsx
756  src/features/industrial-flow/components/IndustrialFlowSvgFlowchart.tsx
718  src/features/avogadro-constant/components/AvogadroScene.tsx
709  src/features/inorganic-ion-matrix/components/IonCoexistenceMatrixView.tsx
699  src/features/gas-chain/components/GasChainCenterView.tsx     (已在 800 门禁豁免)
698  src/features/organic-functional-matrix/components/OrganicFullMatrixView.tsx
680  src/features/electrochemical-twin/components/ElectrochemicalTwinCenterView.tsx
626  src/features/inorganic-ion-matrix/components/IonMatrixScene.tsx
611  src/components/Chemistry/ValenceMatrixCanvas.tsx
604  src/features/organic-retrosynthesis/components/OrganicRetrosynthesisCenterView.tsx
582  src/features/inorganic-ion-matrix/components/anionStepChemistry.ts
581  src/features/avogadro-constant/hooks/avogadroStateStructureCalculations.ts
547  src/features/inorganic-ion-matrix/components/cationStepChemistry.ts
534  src/components/Chemistry/apparatusPorts.ts
533  src/features/inorganic-ion-matrix/components/IonLeftPanel.tsx
513  src/features/industrial-flow/components/IndustrialFlowRightPanel.tsx
484  src/features/gas-chain/hooks/useGasChainChemistry.ts
471  src/components/UI/ChemistryPanel.tsx
467  src/features/industrial-flow/components/IndustrialFlowLeftPanel.tsx
465  src/features/gas-chain/physics/layoutEngine.ts
465  src/features/home/KnowledgeTreeHome.tsx
460  src/features/avogadro-constant/hooks/avogadroReactionCalculations.ts
443  src/features/element-periodic-property/components/ElementPeriodicCenterView.tsx
435  src/features/gas-chain/components/GasChainLeftPanel.tsx
432  src/features/inorganic-ion-matrix/components/IonRightPanel.tsx
426  src/components/UI/ControlPanel.tsx
411  src/features/organic-functional-matrix/components/OrganicMolecule3DModal.tsx
410  src/components/Chart/BaseChart.tsx
407  src/features/flash-cards/components/FlashCardSvgScene.tsx
407  src/features/industrial-flow/components/IndustrialFlowGuideModal.tsx
406  src/features/experiment/extraction-distillation/hooks/useExtractionDistillationChemistry.ts
406  src/features/organic/mechanism/scenes/EsterificationScene.tsx
404  src/features/avogadro-constant/components/AvogadroLeftPanel.tsx
402  src/features/titration-balance/hooks/useTitrationChemistry.ts
```

**下一步（如需推进）**：优先把 `industrial-flow/hooks/useIndustrialFlowChemistry.ts` 内联的
体系分支数据（8 体系 × 4 工序的文案/方程式）抽成 `industrialFlowData.ts` 中的数据表——
它已有 801 行且逼近 800 门禁上限，是当前最可能触发 hard/soft 违规的文件。

---

## GaokaoModelsHome Filter Tabs a11y 注入（暂缓）

**位置**：`src/features/home/GaokaoModelsHome.tsx:82-110`（分类 Filter Tabs）

**现状**：三个 pill 形按钮，每项选中色不同（slate-800 / amber-600 / rose-600），带 emoji 和计数，是"分类筛选 chip"UI 范式。

**暂缓原因**：
- `SegmentedControl` 无法承载"每项不同选中色 + pill 形状"，强行套用会破坏视觉
- 该区域是主页分类区，非三屏左屏，不在铁律6范围
- 仅 a11y 收益，性价比低

**待办**：如需统一 a11y 语义，采用"仅注入 `useRadioGroup` 语义 prop（role/aria-checked/tabIndex/onKeyDown/ref），保留 pill 样式"的方案，**不要套 SegmentedControl**。参考 `KnowledgeTreeHome.tsx` 视角切换的注入方式。
