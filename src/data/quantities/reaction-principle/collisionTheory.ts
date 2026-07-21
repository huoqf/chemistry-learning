/**
 * 碰撞理论公式与高考考点
 */

export const collisionTheoryFormulas = [
  {
    name: '碰撞理论基本公式',
    latex: 'Z = Z_0 \cdot \exp\left(-\frac{E_a}{RT}\right)',
    level: 'core' as const,
    note: 'Z 为有效碰撞频率，Z₀ 为总碰撞频率，exp(-Ea/RT) 为能量因子（玻尔兹曼分布）',
  },
  {
    name: '阿伦尼乌斯方程',
    latex: 'k = A \cdot \exp\left(-\frac{E_a}{RT}\right)',
    level: 'core' as const,
    note: 'k 为速率常数，A 为指前因子，Ea 为活化能，T 为热力学温度',
  },
  {
    name: '温度对速率的影响',
    latex: '\ln\frac{k_2}{k_1} = -\frac{E_a}{R}\left(\frac{1}{T_2} - \frac{1}{T_1}\right)',
    level: 'important' as const,
    note: '温度每升高 10℃，反应速率约增大 2~4 倍（范特霍夫规则）',
  },
  {
    name: '活化分子比例',
    latex: 'f = \exp\left(-\frac{E_a}{RT}\right)',
    level: 'derived' as const,
    note: '活化分子所占比例，温度越高、活化能越低，比例越大',
  },
  {
    name: '反应速率方程',
    latex: 'v = k \cdot c^m(\text{A}) \cdot c^n(\text{B})',
    level: 'core' as const,
    note: 'v 为反应速率，c 为反应物浓度，m、n 为反应级数',
  },
]

export const collisionTheoryExamPoints = [
  {
    text: '理解有效碰撞的概念：分子间发生碰撞且能量≥活化能、取向合适的碰撞才能引发化学反应',
    importance: 'gaokao' as const,
  },
  {
    text: '掌握温度、浓度、压强（气体）、催化剂对反应速率的影响机理',
    importance: 'gaokao' as const,
  },
  {
    text: '催化剂通过降低活化能、增加活化分子比例来加快反应速率，但不改变反应热和平衡位置',
    importance: 'gaokao' as const,
  },
  {
    text: '升高温度既增加分子运动速率（碰撞频率↑），又增加活化分子比例（能量因子↑）',
    importance: 'core' as const,
  },
  {
    text: '增大浓度/压强只增加单位体积内分子数和碰撞频率，不改变活化分子比例',
    importance: 'core' as const,
  },
]
