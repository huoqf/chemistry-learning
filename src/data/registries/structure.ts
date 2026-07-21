import { lazyWithPreload as lazy } from '@/utils/lazyWithPreload'
import { defineAnimations } from '../defineAnimations'
import { unitCellFormulas, unitCellExamPoints } from '../quantities/structure/unitCellCalculation'
import { vseprFormulas, vseprExamPoints } from '../quantities/structure/vsepr'
import { VSEPR_PRESETS } from '@/features/structure/vsepr-model/data/vseprData'

const VSEPR_PRESET_KEYS = [
  'co2', 'bf3', 'so2', 'ch4', 'nh3', 'h2o',
  'pcl5', 'sf4', 'clf3', 'xef2', 'sf6', 'xef4',
]

export const structureAnimations = defineAnimations({
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
          { label: 'CO₂ (直线)', value: 0 },
          { label: 'BF₃ (平面三角)', value: 1 },
          { label: 'SO₂ (V形)', value: 2 },
          { label: 'CH₄ (正四面体)', value: 3 },
          { label: 'NH₃ (三角锥)', value: 4 },
          { label: 'H₂O (V形)', value: 5 },
          { label: 'PCl₅ (三角双锥)', value: 6 },
          { label: 'SF₄ (跷跷板)', value: 7 },
          { label: 'ClF₃ (T形)', value: 8 },
          { label: 'XeF₂ (直线)', value: 9 },
          { label: 'SF₆ (正八面体)', value: 10 },
          { label: 'XeF₄ (平面正方形)', value: 11 },
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
  },
})
