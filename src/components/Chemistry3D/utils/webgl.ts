/**
 * WebGL 可用性检测 —— 惰性单例，首次调用后缓存结果。
 *
 * 语义："设备/浏览器是否支持 WebGL"——这是硬件能力，不会随时间变化，
 * 因此可以安全缓存。首次调用创建临时 canvas 检测，之后返回缓存值。
 *
 * 重要：每次未缓存的调用都会创建真实的 WebGL context，浏览器有上限
 * （Chromium ~14-16 个）。在渲染路径中反复调用会耗尽 context 槽位，
 * 导致 R3F 渲染器的 context 被回收（画面白屏）。
 */
let _cached: boolean | null = null

export function isWebGLAvailable(): boolean {
  if (_cached !== null) return _cached
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    _cached = !!gl
    // 显式释放临时 context，不等 GC 回收
    if (gl) {
      const loseContext = gl.getExtension('WEBGL_lose_context')
      loseContext?.loseContext()
    }
  } catch {
    _cached = false
  }
  return _cached
}

/**
 * 重置 WebGL 检测缓存（仅用于测试环境）。
 */
export function resetWebGLCache(): void {
  _cached = null
}
