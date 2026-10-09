/**
 * WebGL 不可用时的中屏降级提示 —— 全库唯一实现。
 *
 * ── 为什么必须抽成共享组件 ──
 * 此前 8 个 3D 页面各自手写了一份 fallback：标题出现 5 种不同写法
 * （"WebGL 暂不可用" / "3D 硬件加速未就绪" / "WebGL 不可用" / "3D 视图不可用" /
 * "WebGL 3D 环境不可用"），跨 h2 / h3 / h4 三个级别，描述文案与容器留白也各不相同。
 * 结果同一台不支持 WebGL 的设备，学生按进入的页面不同会看到不同提示。
 * 收敛到此处后只需维护一份，各页面只按需覆盖描述。
 *
 * ── 铁律 1 ──
 * 本容器**不得**写任何背景类（bg-white / bg-slate-50 / bg-transparent 均禁止），
 * 背景一律由系统 Light Theme 统一提供。
 */

export interface WebGLFallbackProps {
  /** 标题。默认统一为「WebGL 3D 环境不可用」 */
  title?: string
  /** 补充说明。默认给出通用的开启硬件加速指引；各页面可换成自己更具体的降级说明 */
  description?: string
  /**
   * 尺寸档位：
   * - `lg`（默认）整屏或主视区 3D 页面（大号图标、宽松留白）
   * - `sm` 弹窗、侧边栏或分屏半区等紧凑视口（紧凑图标、较小字号与留白）
   */
  size?: 'lg' | 'sm'
  /** 附加类名。需要边框等视觉边界时透传 WEBGL_FALLBACK_FRAME_CLASS */
  className?: string
}

/**
 * 需要视觉边界时透传的边框规格 —— 唯一来源。
 *
 * 为什么默认不带边框：整屏中屏降级时背景已由 Light Theme 提供，边框画在面板边缘没有意义；
 * 但弹窗内 / 分屏半区（size="sm"）等场景需要与宿主划清界限，此时透传本常量，
 * 避免「边框类在各调用点各写一份」重新退化成 8 处手写的老问题。
 */
export const WEBGL_FALLBACK_FRAME_CLASS = 'border border-slate-200 rounded-xl'

/** 统一标题：4/8 处原本就用它，且点明原因便于用户自行排查 */
const DEFAULT_TITLE = 'WebGL 3D 环境不可用'

/** 统一描述：给出一条可执行的排查动作 */
const DEFAULT_DESCRIPTION =
  '当前环境未启用 WebGL 硬件加速，无法渲染 3D 场景。请开启浏览器硬件加速，或换用现代 Chrome / Edge 浏览器。'

export function WebGLFallback({ title, description, size = 'lg', className }: WebGLFallbackProps) {
  const compact = size === 'sm'
  const baseClasses = compact
    ? 'w-full h-full flex flex-col items-center justify-center p-4 text-center select-none'
    : 'flex flex-col items-center justify-center h-full p-8 text-center select-none'

  return (
    <div className={className ? `${baseClasses} ${className}` : baseClasses}>
      <div className={compact ? 'text-3xl mb-2' : 'text-5xl mb-4'}>🔬</div>
      <h2
        className={
          compact
            ? 'text-sm font-bold text-slate-800 mb-1'
            : 'text-xl font-bold text-slate-800 mb-2'
        }
      >
        {title ?? DEFAULT_TITLE}
      </h2>
      <p
        className={
          compact
            ? 'text-xs text-slate-500 max-w-xs leading-relaxed'
            : 'text-sm text-slate-500 max-w-md'
        }
      >
        {description ?? DEFAULT_DESCRIPTION}
      </p>
    </div>
  )
}
