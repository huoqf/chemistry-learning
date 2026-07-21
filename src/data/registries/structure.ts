import { lazyWithPreload as lazy } from '@/utils/lazyWithPreload'
import { defineAnimations } from '../defineAnimations'
import { unitCellFormulas, unitCellExamPoints } from '../quantities/structure/unitCellCalculation'

export const structureAnimations = defineAnimations({
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
