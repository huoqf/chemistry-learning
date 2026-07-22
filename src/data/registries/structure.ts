import { lazyWithPreload as lazy } from '@/utils/lazyWithPreload'
import { defineAnimations } from '../defineAnimations'
import { unitCellFormulas, unitCellExamPoints } from '../quantities/structure/unitCellCalculation'
import { vseprFormulas, vseprExamPoints } from '../quantities/structure/vsepr'
import { hybridizationFormulas, hybridizationExamPoints } from '../quantities/structure/hybridization'
import { chiralityFormulas, chiralityExamPoints } from '../quantities/structure/chirality'
import { isomerismFormulas, isomerismExamPoints } from '../quantities/structure/isomerism'
import { VSEPR_PRESETS } from '@/features/structure/vsepr-model/data/vseprData'
import { VSEPR_PRESET_KEYS } from '@/features/structure/vsepr-model/hooks/useVseprChemistry'

export const structureAnimations = defineAnimations({
  'anim-hybrid-orbital': {
    title: '杂化轨道理论 3D 空间叠加',
    knowledgeId: 'hybridization',
    Component: lazy(() => import('@/features/structure/hybrid-orbital')),
    controlsMode: 'param',
    defaultParams: {
      presetIdx: 4,
      viewMode: 0,
      showUnhybridizedP: 1,
      showPhases: 1,
    } as const,
    controlMeta: [
      {
        type: 'segmented',
        key: 'presetIdx',
        label: '杂化类型与分子选择',
        group: '经典杂化模型',
        options: [
          { label: 'BeCl₂ (sp 直线)', value: 0 },
          { label: 'CO₂ (sp 异核双键)', value: 1 },
          { label: 'C₂H₂ (sp 炔烃)', value: 2 },
          { label: 'BF₃ (sp² 三角)', value: 3 },
          { label: 'SO₂ (sp² 孤对)', value: 4 },
          { label: 'C₂H₄ (sp² 烯烃)', value: 5 },
          { label: 'CO₃²⁻ (sp² 阴离子)', value: 6 },
          { label: 'CH₄ (sp³ 四面体)', value: 7 },
          { label: 'NH₃ (sp³ 1孤对)', value: 8 },
          { label: 'H₂O (sp³ 2孤对)', value: 9 },
          { label: 'NH₄⁺ (sp³ 配位键)', value: 10 },
        ],
      },
      {
        type: 'segmented',
        key: 'viewMode',
        label: '观察视角模式',
        group: '成键透视',
        options: [
          { label: '仅显示杂化轨道', value: 0 },
          { label: '分子成键与重叠 (σ/π键)', value: 1 },
        ],
      },
      {
        type: 'segmented',
        key: 'showUnhybridizedP',
        group: '辅助视角',
        options: [
          { label: '显示未杂化 p 轨道', value: 1 },
          { label: '隐藏未杂化 p 轨道', value: 0 },
        ],
      },
      {
        type: 'segmented',
        key: 'showPhases',
        group: '辅助视角',
        options: [
          { label: '显示正负相位 (+/-)', value: 1 },
          { label: '单色外观', value: 0 },
        ],
      },
      {
        type: 'tip',
        group: '杂化概念解析',
        variant: 'info',
        content: (params: Record<string, number>) => {
          const idx = params.presetIdx ?? 7
          if (idx <= 2) {
            return '【sp 杂化 (对角杂化)】：1个 s + 1个 p 轨道混淆形成 2个呈 180° 的 sp 杂化轨道。另外 2个未杂化 p 轨道垂直于键轴，用于形成 π 键。'
          }
          if (idx <= 6) {
            return '【sp² 杂化 (平面杂化)】：1个 s + 2个 p 轨道混淆形成 3个同平面夹角 120° 的 sp² 杂化轨道。垂直于平面的 1个未杂化 p 轨道可形成 π 键。'
          }
          return '【sp³ 杂化 (四面体杂化)】：1个 s + 3个 p 轨道混淆形成 4个指向正四面体顶点的 sp³ 杂化轨道(理想键角 109.5°)。孤电子对排斥力较强使实际键角变小。'
        },
      },
      {
        type: 'tip',
        group: '3D 交互指引',
        variant: 'primary',
        content: '拖拽鼠标旋转 3D 轨道空间视角；滚轮缩放大小；可切换【分子成键】观看 σ 键与 π 键重叠过程。',
      },
    ],
    formulas: hybridizationFormulas,
    gaokaoPoints: hybridizationExamPoints,
    tripleRepresentation: {
      micro: true,
      macro: false,
      symbol: true,
    },
  },
  'anim-vsepr': {
    title: 'VSEPR 模型 3D 构型演示',
    knowledgeId: 'vsepr',
    Component: lazy(() => import('@/features/structure/vsepr-model')),
    controlsMode: 'param',
    defaultParams: {
      presetIdx: 0,
      showLonePairs: 1,
      showPolyhedron: 1,
      showAngles: 1,
    } as const,
    controlMeta: [
      {
        type: 'segmented',
        key: 'presetIdx',
        label: '分子/离子模型选择',
        group: '经典预设',
        options: [
          { label: 'CO₂ (直线形)', value: 0 },
          { label: 'NO₂⁺ (阳离子 直线)', value: 1 },
          { label: 'BF₃ (平面三角)', value: 2 },
          { label: 'SO₃ (平面三角)', value: 3 },
          { label: 'CO₃²⁻ (阴离子 三角)', value: 4 },
          { label: 'NO₃⁻ (阴离子 三角)', value: 5 },
          { label: 'SO₂ (V形 1孤对)', value: 6 },
          { label: 'NO₂⁻ (阴离子 V形)', value: 7 },
          { label: 'CH₄ (正四面体)', value: 8 },
          { label: 'NH₄⁺ (阳离子 四面体)', value: 9 },
          { label: 'SO₄²⁻ (阴离子 四面体)', value: 10 },
          { label: 'NH₃ (三角锥形)', value: 11 },
          { label: 'H₃O⁺ (阳离子 三角锥)', value: 12 },
          { label: 'SO₃²⁻ (阴离子 三角锥)', value: 13 },
          { label: 'H₂O (V形 2孤对)', value: 14 },
          { label: 'PCl₅ (三角双锥)', value: 15 },
          { label: 'SF₄ (跷跷板)', value: 16 },
          { label: 'ClF₃ (T形)', value: 17 },
          { label: 'XeF₂ (直线形)', value: 18 },
          { label: 'SF₆ (正八面体)', value: 19 },
          { label: 'XeF₄ (平面正方形)', value: 20 },
        ],
      },
      {
        type: 'segmented',
        key: 'showLonePairs',
        group: '视角显隐辅助',
        options: [
          { label: '显示孤电子对云泡', value: 1 },
          { label: '隐藏孤电子对', value: 0 },
        ],
      },
      {
        type: 'segmented',
        key: 'showPolyhedron',
        group: '视角显隐辅助',
        options: [
          { label: '显示理想多面体', value: 1 },
          { label: '隐藏多面体框', value: 0 },
        ],
      },
      {
        type: 'segmented',
        key: 'showAngles',
        group: '视角显隐辅助',
        options: [
          { label: '显示键角标注', value: 1 },
          { label: '隐藏键角', value: 0 },
        ],
      },
      {
        type: 'tip',
        group: '教学观摩指引',
        variant: 'info',
        content: (params: Record<string, number>) => {
          const rawIdx = params.presetIdx ?? 0
          const safeIdx = Math.min(Math.max(0, Math.floor(rawIdx)), VSEPR_PRESET_KEYS.length - 1)
          const key = VSEPR_PRESET_KEYS[safeIdx] || 'co2'
          const mol = VSEPR_PRESETS[key] || VSEPR_PRESETS.co2
          if (mol.lonePairCount > 0) {
            return `【${mol.name} (${mol.formula})】：含 ${mol.lonePairCount} 对孤电子对！切换【孤电子对云泡】可对比“电子对构型(${mol.electronGeometry})”与“分子实际构型(${mol.molecularGeometry})”。`
          }
          return `【${mol.name} (${mol.formula})】：无孤电子对 (n=0)。电子对空间构型与分子实际构型完全重合 (${mol.molecularGeometry})。`
        },
      },
      {
        type: 'tip',
        group: '3D 交互指引',
        variant: 'primary',
        content: '拖拽鼠标旋转 3D 分子视角；滚轮缩放大小。',
      },
    ],
    formulas: vseprFormulas,
    gaokaoPoints: vseprExamPoints,
    tripleRepresentation: {
      micro: true,
      macro: false,
      symbol: true,
    },
  },
  'anim-unit-cell-calculation': {
    title: '晶胞结构与密度计算',
    knowledgeId: 'unit-cell-calculation',
    Component: lazy(() => import('@/features/structure/unit-cell-calculation')),
    controlsMode: 'param',
    defaultParams: {
      crystalType: 0,
      edgeLength: 564,
      molarMass: 58.44,
      explodeMode: 0,
      showBonds: 1,
    } as const,
    paramMeta: [
      {
        key: 'edgeLength',
        label: '晶胞边长 a',
        min: 200,
        max: 800,
        step: 1,
        unit: 'pm',
        group: '几何尺寸',
        description: '调整晶胞边长，改变晶胞体积与理论密度',
      },
      {
        key: 'molarMass',
        label: '摩尔质量 M',
        min: 10,
        max: 300,
        step: 0.1,
        unit: 'g/mol',
        group: '化学组成',
        description: '改变组成元素的相对原子/分子质量',
      },
    ],
    controlMeta: [
      {
        type: 'segmented',
        key: 'crystalType',
        label: '晶体模型选择',
        group: '晶胞模型',
        options: [
          { label: 'NaCl (面心)', value: 0 },
          { label: 'CsCl (简单)', value: 1 },
          { label: 'Cu (FCC)', value: 2 },
          { label: 'Fe (BCC)', value: 3 },
          { label: '金刚石 C', value: 4 },
          { label: 'CaF₂ (萤石)', value: 5 },
          { label: 'Mg (HCP)', value: 6 },
          { label: 'CO₂ (干冰)', value: 7 },
        ],
      },
      {
        type: 'segmented',
        key: 'explodeMode',
        group: '视图模式',
        options: [
          { label: '完整晶胞', value: 0 },
          { label: '均摊拆解模式', value: 1 },
        ],
      },
      {
        type: 'segmented',
        key: 'showBonds',
        group: '连线显示',
        options: [
          { label: '显示化学键', value: 1 },
          { label: '隐藏化学键', value: 0 },
        ],
      },
      {
        type: 'tip',
        group: '晶胞界框说明',
        variant: 'info',
        content: '黑色虚线框为晶胞空间边界框（用于确定顶点 1/8、面心 1/2、棱心 1/4、体心 1 的原子均摊份额）。',
      },
      {
        type: 'tip',
        group: '3D 交互指引',
        variant: 'primary',
        content: '按住鼠标拖拽旋转 3D 晶胞；滚轮缩放大小；点击任意原子可查看其在晶胞中的均摊贡献份额。',
      },
    ],
    formulas: unitCellFormulas,
    gaokaoPoints: unitCellExamPoints,
    tripleRepresentation: {
      micro: true,
      macro: false,
      symbol: true,
    },
  },
  'anim-chirality': {
    title: '手性分子与立体异构 3D 对比',
    knowledgeId: 'chirality',
    Component: lazy(() => import('@/features/structure/chiral-molecule')),
    controlsMode: 'param',
    defaultParams: {
      presetIdx: 0,
      showMirror: 1,
      showChiralLabels: 1,
      showCisTransCompare: 0,
      mirrorOverlapRatio: 0,
    } as const,
    paramMeta: [
      {
        key: 'mirrorOverlapRatio',
        label: '镜像重叠平移测试',
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
        group: '镜像重叠度',
        description: '拖拽平移 3D 镜像分子至原分子处，验证基团重合状况',
      },
    ],
    controlMeta: [
      {
        type: 'segmented',
        key: 'presetIdx',
        label: '分子预设与类型选择',
        group: '高考经典分子',
        options: [
          { label: '乳酸 (手性)', value: 0 },
          { label: '2-氯丁烷 (手性)', value: 1 },
          { label: '丙氨酸 (手性)', value: 2 },
          { label: '甘油醛 (手性)', value: 3 },
          { label: '2-丙醇 (非手性)', value: 4 },
          { label: '2-丁烯 (顺反)', value: 5 },
          { label: '1,2-二氯乙烯 (顺反)', value: 6 },
        ],
      },
      {
        type: 'segmented',
        key: 'showMirror',
        group: '镜像模式',
        options: [
          { label: '显示 3D 镜像分子', value: 1 },
          { label: '隐藏 3D 镜像分子', value: 0 },
        ],
      },
      {
        type: 'segmented',
        key: 'showCisTransCompare',
        group: '顺反立体异构模式',
        options: [
          { label: '开启顺反 3D 对比', value: 1 },
          { label: '关闭 (镜像模式)', value: 0 },
        ],
      },
      {
        type: 'segmented',
        key: 'showChiralLabels',
        group: '标注显示',
        options: [
          { label: '显示手性碳与取代基标签', value: 1 },
          { label: '隐藏 3D 标签', value: 0 },
        ],
      },
      {
        type: 'tip',
        group: '3D 镜像重叠测试说明',
        variant: 'primary',
        content: '拖动左屏数值参数「镜像重叠平移测试 (%)」滑块，可将镜像分子沿 X 轴平移至原分子处。对于手性分子，4 个基团无法重合；对于非手性分子（如 2-丙醇），可完全重合。',
      },
    ],
    formulas: chiralityFormulas,
    gaokaoPoints: chiralityExamPoints,
    tripleRepresentation: {
      micro: true,
      macro: false,
      symbol: true,
    },
  },
  'anim-isomerism': {
    title: '同分异构体 (2D减碳树 ↔ 3D球棍联动)',
    knowledgeId: 'isomerism',
    Component: lazy(() => import('@/features/structure/isomerism')),
    controlsMode: 'param',
    defaultParams: {
      isomerType: 0,
      selectedIndex: 0,
      showEquivalentH: 1,
    } as const,
    controlMeta: [
      {
        type: 'segmented',
        key: 'isomerType',
        label: '探究分子体系选择',
        group: '分子体系',
        options: [
          { label: '戊烷 (C₅H₁₂)', value: 0 },
          { label: '丁醇/丁醚 (C₄H₁₀O)', value: 1 },
          { label: '羧酸/酯 (C₃H₆O₂)', value: 2 },
          { label: '芳香族 (C₇H₈O)', value: 3 },
          { label: '丁烯/环烷 (C₄H₈)', value: 4 },
        ],
        onChangeSideEffect: { setParams: { selectedIndex: 0 } },
      },
      {
        type: 'segmented',
        key: 'selectedIndex',
        label: '异构体切换',
        group: '戊烷 C₅H₁₂ 构造异构体',
        showIf: 'isomerType',
        showIfValue: 0,
        options: [
          { label: '正戊烷', value: 0, description: '戊烷 · 沸点 36.1°C · 3 种等效氢' },
          { label: '异戊烷', value: 1, description: '2-甲基丁烷 · 沸点 27.8°C · 4 种等效氢' },
          { label: '新戊烷', value: 2, description: '2,2-二甲基丙烷 · 沸点 9.5°C · 1 种等效氢' },
        ],
      },
      {
        type: 'segmented',
        key: 'selectedIndex',
        label: '异构体切换',
        group: '丁醇 & 丁醚 C₄H₁₀O 异构体 (全集 7 种)',
        showIf: 'isomerType',
        showIfValue: 1,
        options: [
          { label: '1-丁醇', value: 0, description: '丁-1-醇 (伯醇) · 5 种等效氢 · 117.7°C' },
          { label: '2-丁醇', value: 1, description: '丁-2-醇 (仲醇/含手性碳) · 5 种等效氢 · 99.5°C' },
          { label: '异丁醇', value: 2, description: '2-甲基丙-1-醇 (伯醇) · 4 种等效氢 · 108.0°C' },
          { label: '叔丁醇', value: 3, description: '2-甲基丙-2-醇 (叔醇) · 2 种等效氢 (9:1) · 82.5°C' },
          { label: '二乙醚', value: 4, description: '对称醚 (CH₃CH₂OCH₂CH₃) · 2 种等效氢 · 34.6°C' },
          { label: '甲丙醚', value: 5, description: '不对称醚 (CH₃OCH₂CH₂CH₃) · 4 种等效氢 · 38.8°C' },
          { label: '甲异丙醚', value: 6, description: '支链醚 (CH₃OCH(CH₃)₂) · 3 种等效氢 · 31.0°C' },
        ],
      },
      {
        type: 'segmented',
        key: 'selectedIndex',
        label: '异构体切换',
        group: '羧酸 & 酯 C₃H₆O₂ 官能团类别异构',
        showIf: 'isomerType',
        showIfValue: 2,
        options: [
          { label: '丙酸', value: 0, description: 'CH₃CH₂COOH (弱酸) · 3 种等效氢 · 141.2°C' },
          { label: '甲酸乙酯', value: 1, description: 'HCOOCH₂CH₃ (能发生银镜反应) · 3 种等效氢 · 54.0°C' },
          { label: '乙酸甲酯', value: 2, description: 'CH₃COOCH₃ (普通酯) · 2 种等效氢 · 56.9°C' },
          { label: '2-羟基丙醛', value: 3, description: 'HOCH₂CH₂CHO (羟基醛) · 4 种等效氢 · 120.0°C' },
        ],
      },
      {
        type: 'segmented',
        key: 'selectedIndex',
        label: '异构体切换',
        group: '芳香族 C₇H₈O 异构 (高考极高频 5 种)',
        showIf: 'isomerType',
        showIfValue: 3,
        options: [
          { label: '邻甲酚', value: 0, description: '2-甲基苯酚 (FeCl₃显紫) · 5 种等效氢 · 191.0°C' },
          { label: '间甲酚', value: 1, description: '3-甲基苯酚 (FeCl₃显紫) · 5 种等效氢 · 202.0°C' },
          { label: '对甲酚', value: 2, description: '4-甲基苯酚 (高度对称) · 3 种等效氢 · 201.9°C' },
          { label: '苯甲醇', value: 3, description: '芳香醇 (C₆H₅CH₂OH) · 4 种等效氢 · 205.0°C' },
          { label: '苯甲醚', value: 4, description: '芳香醚 (C₆H₅OCH₃) · 3 种等效氢 · 154.0°C' },
        ],
      },
      {
        type: 'segmented',
        key: 'selectedIndex',
        label: '异构体切换',
        group: '丁烯 & 环烷 C₄H₈ 烯烃与环状异构',
        showIf: 'isomerType',
        showIfValue: 4,
        options: [
          { label: '1-丁烯', value: 0, description: 'CH₂=CH-CH₂-CH₃ · 4 种等效氢 · -6.3°C' },
          { label: '顺-2-丁烯', value: 1, description: '(Z)-丁-2-烯 (顺式立体) · 2 种等效氢 · 3.7°C' },
          { label: '反-2-丁烯', value: 2, description: '(E)-丁-2-烯 (反式立体) · 2 种等效氢 · 0.9°C' },
          { label: '异丁烯', value: 3, description: 'CH₂=C(CH₃)₂ · 2 种等效氢 · -6.9°C' },
          { label: '环丁烷', value: 4, description: '环状饱和烃 · 1 种等效氢 (全等) · 12.5°C' },
        ],
      },
      {
        type: 'segmented',
        key: 'showEquivalentH',
        label: '等效氢染色高亮',
        group: '等效氢分析',
        options: [
          { label: '开启等效氢高亮', value: 1 },
          { label: '关闭染色', value: 0 },
        ],
      },
      {
        type: 'tip',
        group: '双视角教学指引',
        variant: 'primary',
        content: '中屏左半区为 2D 减碳法平面碳骨架树，右半区为 3D 空间球棍模型，支持 360° 拖拽旋转对比。在左屏切换异构体可同步联动两侧视角。',
      },
    ],
    formulas: isomerismFormulas,
    gaokaoPoints: isomerismExamPoints,
    tripleRepresentation: {
      micro: true,
      macro: true,
      symbol: true,
    },
  },
})

