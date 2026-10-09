/**
 * 麦克斯韦-玻尔兹曼 (Maxwell-Boltzmann) 分子能量分布计算
 *
 * 统一委托至 src/chemistry/collision.ts 纯物理化学模块，保证图表与右屏化学量 100% 同源。
 */

export {
  computeMaxwellBoltzmann,
  type BoltzmannPoint,
  type MaxwellBoltzmannResult,
} from '@/chemistry/collision'
