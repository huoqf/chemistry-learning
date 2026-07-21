import { lazyWithPreload as lazy } from '@/utils/lazyWithPreload'
import { defineAnimations } from '../defineAnimations'
import { unitCellFormulas, unitCellExamPoints } from '../quantities/structure/unitCellCalculation'
import { vseprFormulas, vseprExamPoints } from '../quantities/structure/vsepr'
import { hybridizationFormulas, hybridizationExamPoints } from '../quantities/structure/hybridization'
import { chiralityFormulas, chiralityExamPoints } from '../quantities/structure/chirality'
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
          { label: '显示配位键', value: 1 },
          { label: '隐藏配位键', value: 0 },
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
})
