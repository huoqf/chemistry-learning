---
name: new-3d-page
description: 新建 3D 场景页面 / 创建 React Three Fiber 场景 / 添加 3D 晶胞 / 添加 3D 分子结构 / 添加 3D 轨道 / 实现 WebGL 交互场景 / 新建 Chemistry3D 组件
---

# 新建 3D 场景页面 Skill

> 在写第一行代码前，必须逐项过完本 Skill。所有「禁止」一旦出现即视为任务无效。
>
> 适用范围：
> - 晶胞结构展示（简单立方/BCC/FCC/NaCl/CsCl/金刚石等）
> - 分子空间构型（VSEPR/杂化轨道/球棍模型）
> - 晶体配位多面体
> - 任何需要 WebGL 3D 渲染的化学教学场景

---

## Step 0：设计决策（代码前确认）

### 0A：3D 场景类型判断

| 类型 | 典型内容 | 相机模式 | 交互方式 |
|------|---------|---------|---------|
| 晶体结构 | 晶胞/晶格/配位多面体 | 正交（Orthographic） | OrbitControls 旋转 + 点击原子 |
| 分子构型 | VSEPR/杂化轨道/球棍模型 | 透视（Perspective） | OrbitControls 旋转 |
| 轨道形状 | s/p/d/f 轨道等值面 | 透视 | OrbitControls 旋转 |
| 混合场景 | 2D 图表 + 3D 模型 | 正交/透视 | OrbitControls + 2D 面板 |

**决策直觉**：
- **需要准确读出边长/角度比例**（晶胞密度计算）→ **正交相机**
- **需要立体感/景深**（分子空间构型）→ **透视相机**
- **教学演示为主，不追求拟物**→ 正交 + 基础材质（MeshStandardMaterial）

> 严禁使用透视相机展示需要精确测量的几何关系（如晶胞棱长比）。

### 0B：3D 页面布局模式

| 模式 | 布局 | 适用场景 |
|------|------|---------|
| 独立全屏 | 3D Canvas 占满 + 右侧信息面板 | 晶胞展示、分子构型 |
| 2D/3D 混合 | 左侧 2D 图表 + 右侧 3D Canvas | 需要配合数据图表的场景 |
| 嵌入式 | 3D Canvas 作为页面的一部分 | 未来扩展，当前不推荐 |

**默认选择独立全屏**：3D 交互范式（旋转/缩放）与 2D 三屏时间轴截然不同，不走 `AnimationPage` 的三屏布局。

### 0C：路由策略

| 策略 | 适用场景 |
|------|---------|
| 独立路由（推荐） | 晶胞、分子构型等独立 3D 页面 |
| 复用 AnimationPage | 未来需要嵌入现有三屏布局时再考虑 |

**当前阶段统一用独立路由**，在 `App.tsx` 中注册。等出现需要嵌入 `AnimationPage` 的场景再抽象统一。

---

## Step 1：文件结构（必须遵守）

### 3D 页面（独立路由）

```
src/features/<domain>/<topic>/
├── <Topic>Page.tsx            <- 页面入口（WebGL 检测 + fallback + 数据加载）
├── components/
│   └── <Topic>Scene.tsx       <- R3F 3D 场景（Canvas + Camera + Controls + Mesh）
├── data/
│   └── <topic>Data.ts         <- 预设数据（分数坐标/晶胞参数/元素属性）
└── utils/
    └── <topic>Transform.ts    <- 坐标转换函数（分数→世界/分数→笛卡尔）
```

### 3D 公共组件（多个页面共用）

```
src/components/Chemistry3D/
├── UnitCellMesh.tsx           <- 晶胞通用 Mesh 组件
├── AtomMesh.tsx               <- 原子球体组件
├── BondMesh.tsx               <- 化学键组件
├── index.ts                   <- barrel 导出
└── utils/
    └── coordTransform.ts      <- 分数坐标→世界坐标等通用转换
```

### 命名约定

| 类型 | 命名格式 | 示例 |
|------|---------|------|
| 3D 页面 | `<Topic>Page` | `UnitCellPage` `MoleculePage` |
| 3D 场景组件 | `<Topic>Scene` | `UnitCellScene` `MoleculeScene` |
| 3D 公共组件 | `<Name>Mesh` | `UnitCellMesh` `AtomMesh` |
| 数据文件 | `<topic>Data` | `simpleCubicData` `naclData` |
| 转换函数 | `<topic>Transform` | `fracToWorld` |

---

## Step 2：骨架代码

### 2A：页面入口（`<Topic>Page.tsx`）

```tsx
/**
 * <Topic>Page — 3D 场景页面入口
 *
 * 职责：
 * - WebGL 可用性检测 + 降级 fallback
 * - 加载预设数据
 * - 渲染 <Topic>Scene
 */
import { isWebGLAvailable } from '../utils/webgl'
import { DATA } from '../data/<topic>Data'
import { <Topic>Scene } from '../components/<Topic>Scene'

function WebGLFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-8 text-center">
      <div className="text-6xl mb-4">🔬</div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">WebGL 不可用</h2>
      <p className="text-sm text-slate-500 max-w-md">
        当前浏览器不支持 WebGL，无法渲染 3D 模型。
        请使用 Chrome / Firefox / Safari 最新版本，或开启硬件加速。
      </p>
      {/* 静态 fallback 信息 */}
    </div>
  )
}

export default function <Topic>Page() {
  if (!isWebGLAvailable()) {
    return <WebGLFallback />
  }

  return <Topic>Scene data={DATA} />
}
```

### 2B：3D 场景组件（`<Topic>Scene.tsx`）

```tsx
/**
 * <Topic>Scene — R3F 3D 场景
 *
 * 性能规范（铁律）：
 * - 静态场景必须 frameloop="demand"（只在交互时重绘）
 * - dpr={[1, 2]} 上限约束（避免高分屏过度渲染）
 * - enableDamping={false}（demand 模式下阻尼失效）
 * - 触摸容器必须 touch-action: none（避免滚动冲突）
 */
import { useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, Line } from '@react-three/drei'
import type { <Topic>Data } from '../data/<Topic>Data'

interface <Topic>SceneProps {
  data: <Topic>Data
  className?: string
}

export function <Topic>Scene({ data, className = '' }: <Topic>SceneProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className={`flex h-full ${className}`}>
      {/* 左侧：3D Canvas */}
      <div className="flex-1 min-w-0" style={{ touchAction: 'none' }}>
        <Canvas
          orthographic          // 或 perspective，取决于 Step 0A 决策
          frameloop="demand"    // 静态场景必须 demand
          dpr={[1, 2]}          // 高分屏上限约束
          camera={{
            zoom: 120,          // 正交相机缩放
            position: [1.5, 1.2, 1.5],
            near: -100,
            far: 100,
          }}
          style={{ background: '#f8fafc' }}
        >
          <SceneContent
            data={data}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </Canvas>
      </div>

      {/* 右侧：信息面板 */}
      <div className="w-64 shrink-0 bg-white border-l border-slate-200 p-4 overflow-auto">
        {/* 参数/Z值/详情面板 */}
      </div>
    </div>
  )
}

function SceneContent({ data, selectedId, onSelect }: {
  data: <Topic>Data
  selectedId: string | null
  onSelect: (id: string | null) => void
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={0.8} />

      {/* 场景内容 */}
      {/* ... meshes, lines, etc. */}

      {/* OrbitControls — 关闭 damping */}
      <OrbitControls enableDamping={false} makeDefault />
    </>
  )
}
```

### 2C：坐标转换函数（`utils/coordTransform.ts`）

```ts
/**
 * 分数坐标 → Three.js 世界坐标
 *
 * 世界坐标系约定（铁律）：
 * - 单位：Å（埃）或 nm，由页面级 context 决定
 * - 原点：晶胞/分子中心
 * - Y 轴方向：向上（three.js 默认 Y-up 右手系）
 * - 缩放：1 unit = 1 Å（晶胞）或 1 nm（分子）
 */

export interface CellParams {
  a: number; b: number; c: number
  alpha: number; beta: number; gamma: number
}

/** 分数坐标 → 笛卡尔坐标（Å） */
export function fracToCartesian(
  frac: [number, number, number],
  cell: CellParams,
): [number, number, number] {
  const [x, y, z] = frac
  const { a, b, c, alpha, beta, gamma } = cell

  // 转换角度为弧度
  const alphaR = (alpha * Math.PI) / 180
  const betaR = (beta * Math.PI) / 180
  const gammaR = (gamma * Math.PI) / 180

  // 晶胞向量
  const ax = a
  const bx = b * Math.cos(gammaR)
  const by = b * Math.sin(gammaR)
  const cx = c * Math.cos(betaR)
  const cy = c * (Math.cos(alphaR) - Math.cos(betaR) * Math.cos(gammaR)) / Math.sin(gammaR)
  const cz = Math.sqrt(c * c - cx * cx - cy * cy)

  return [
    x * ax + y * bx + z * cx,
    y * by + z * cy,
    z * cz,
  ]
}

/** 笛卡尔坐标 → 居中世界坐标（原点在晶胞中心） */
export function cartesianToWorld(
  cart: [number, number, number],
  cell: CellParams,
): [number, number, number] {
  // 计算晶胞中心
  const center = fracToCartesian([0.5, 0.5, 0.5], cell)
  return [
    cart[0] - center[0],
    cart[1] - center[1],
    cart[2] - center[2],
  ]
}

/** 分数坐标 → 居中世界坐标（一步到位） */
export function fracToWorld(
  frac: [number, number, number],
  cell: CellParams,
): [number, number, number] {
  return cartesianToWorld(fracToCartesian(frac, cell), cell)
}
```

### 2D：预设数据（`data/<topic>Data.ts`）

```ts
/**
 * 晶胞预设数据
 *
 * 数据准确性要求（铁律）：
 * - 分数坐标、晶胞参数必须由化学专业人员核对
 * - 工程师自行录入的数据可能有配位数/坐标错误
 * - 基础校验：最近邻距离、对称性检查（只能防低级错误）
 */

export interface AtomData {
  id: string
  fracPos: [number, number, number]
  element: string
  color: string
  radius: number
  /** 共享比例（教学标注用） */
  sharingRatio: number
  sharedBy: number
}

export interface <Topic>Data {
  cellParams: CellParams
  atoms: AtomData[]
  /** Z 值（晶胞内原子数） */
  zValue: number
}

// 硬编码数据（Spike 阶段）
export const DATA: <Topic>Data = {
  cellParams: { a: 1, b: 1, c: 1, alpha: 90, beta: 90, gamma: 90 },
  atoms: [
    // ... 分数坐标数据
  ],
  zValue: 1,
}
```

---

## Step 3：路由注册

### 3A：App.tsx 添加路由

```tsx
// src/App.tsx
const UnitCellPage = lazy(() => import('./features/unit-cell/UnitCellPage'))

// 在 Routes 中添加
<Route path="/unit-cell" element={<UnitCellPage />} />
```

### 3B：Layout.tsx 面包屑（可选）

当前 Layout 只处理 `/animation/:id` 的面包屑。3D 页面如需面包屑，需在 Layout 中扩展路由匹配规则。

---

## Step 4：颜色 Token 使用

### 4A：3D 材质颜色

```tsx
// ✅ 正确：从 @/theme 统一导入
import { SCENE_COLORS, CHEMISTRY_COLORS, CANVAS_COLORS } from '@/theme'

// 3D 材质
<meshStandardMaterial color={SCENE_COLORS.container.beaker} />
<meshStandardMaterial color={SCENE_COLORS.materials.glass} />

// ❌ 禁止
<meshStandardMaterial color="#E0F2FE" />           // 硬编码 hex
<meshStandardMaterial color={colors.primary} />     // UI 色用于 3D 材质
```

### 4B：颜色 Token 职责（与 2D 一致）

| 语义层级 | Token 来源 | 3D 用途 |
|---------|-----------|---------|
| 场景器材外观 | `SCENE_COLORS.*` | 原子/键/晶胞框架材质色 |
| 化学量标注 | `CHEMISTRY_COLORS.*` | 3D overlay 中的化学量文字颜色 |
| Canvas 基础设施 | `CANVAS_COLORS.*` | 网格线/参考线（3D 中用 Line 组件） |

> 3D 组件不使用 `CHEMISTRY_COLORS` 作为材质填充色，只用 `SCENE_COLORS`。

---

## Step 5：性能规范（铁律）

### 5A：Canvas 配置

```tsx
<Canvas
  orthographic              // 或 perspective
  frameloop="demand"        // 静态场景必须 demand，避免空闲重绘
  dpr={[1, 2]}              // 高分屏上限约束，避免 3x/4x 过度渲染
  camera={{ ... }}
>
```

### 5B：OrbitControls 配置

```tsx
<OrbitControls
  enableDamping={false}     // demand 模式下阻尼衰减帧不会被触发
  makeDefault
/>
```

> 如果需要 damping 体验，必须在 `useFrame` 中检测 `controls.update()` 是否仍在运动来决定是否 `invalidate()`。当前阶段先关闭 damping。

### 5C：触摸事件

```tsx
// Canvas 容器必须设置 touch-action: none
<div style={{ touchAction: 'none' }}>
  <Canvas ... />
</div>
```

> 避免页面滚动和 3D 旋转冲突。移动端必须测试。

### 5D：WebGL 检测（惰性缓存，铁律）

```ts
// 挂载 <Canvas> 前主动检测，不能用 try/catch 包裹 <Canvas>
// ⚠️ 必须缓存结果：每次未缓存的调用都会创建真实的 WebGL context，
//    浏览器上限 ~14-16 个。渲染路径中反复调用会耗尽 context 槽位，
//    导致 R3F 渲染器的 context 被回收（画面白屏数秒）。
let _cached: boolean | null = null

export function isWebGLAvailable(): boolean {
  if (_cached !== null) return _cached
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    _cached = !!gl
    // 显式释放临时 context，不等 GC 回收
    if (gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  } catch { _cached = false }
  return _cached
}

// 测试环境用 resetWebGLCache() 重置缓存
export function resetWebGLCache(): void { _cached = null }
```

> - React 组件渲染阶段的 try/catch 捕获不到 WebGL context 创建失败（发生在 canvas 元素挂载后的异步环节）。
> - 浏览器 WebGL context 上限约 14-16 个（Chromium），超出后最旧的 context 被自动回收。StrictMode dev 模式下每次渲染会调用 2 次，更容易触顶。

### 5E：动画规范

```tsx
// ✅ 3D 动画必须用 R3F 的 useFrame
import { useFrame } from '@react-three/fiber'

function AnimatedMesh() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01
  })
  return <mesh ref={ref}>...</mesh>
}

// ❌ 禁止在 3D 组件中直接调用 requestAnimationFrame
// ❌ 禁止在 3D 组件中 import useAnimationStore（无副作用原则）
```

> `useFrame` 内部调用 rAF，但业务代码中不会出现 `requestAnimationFrame(` 文本匹配，不触发 `check-no-raf` lint 检查。

---

## Step 6：状态管理规范

### 6A：选择原则

| 复杂度 | 方案 | 示例 |
|--------|------|------|
| 简单（选中/高亮） | 局部 React state | `useState<string \| null>(null)` |
| 中等（多个交互状态） | 局部 useReducer | 选中原子 + 显示模式 + 高亮类型 |
| 复杂（跨组件共享） | 独立 Zustand store | 多个 3D 页面共享同一数据源 |

**默认使用局部 React state**，不引入额外状态管理库。

### 6B：禁止事项

```tsx
// ❌ 禁止在 3D 组件中访问 useAnimationStore
const { time, isPlaying } = useAnimationStore()

// ❌ 禁止在 3D 组件中使用 useAnimationViewport / useSceneScale
const { vp } = useAnimationViewport({ preset: CANVAS_PRESETS.full })
```

> 3D 页面有独立的坐标系和渲染管线，不复用 2D 的 viewport/sceneScale 体系。

---

## Step 7：资源管理规范

### 7A：标准 Mesh（R3F 自动管理）

```tsx
// R3F 对同一 Canvas 内的标准 mesh 卸载时自动 dispose
// 无需手动处理
<mesh>
  <sphereGeometry args={[1, 32, 32]} />
  <meshStandardMaterial color="red" />
</mesh>
```

### 7B：自定义 Geometry/Material（需手动 dispose）

```tsx
// 如果创建了自定义 geometry 或 material，组件卸载时必须 dispose
const geometry = useMemo(() => new THREE.BufferGeometry(), [])
useEffect(() => {
  return () => geometry.dispose()
}, [geometry])
```

### 7C：GLTF 模型加载

```tsx
// 使用 drei 的 useGLTF + Suspense
import { useGLTF } from '@react-three/drei'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

// 预加载
useGLTF.preload('/models/molecule.glb')
```

### 7D：多晶胞切换

```tsx
// 确保旧 mesh 被卸载后再挂载新 mesh
// 用 key 强制重新挂载
{晶胞类型 === 'bcc' && <BCCScene />}
{晶胞类型 === 'fcc' && <FCCScene />}

// 或用 key 强制重新挂载
<Canvas key={晶胞类型} ...>
  <SceneContent data={当前晶胞数据} />
</Canvas>
```

---

## Step 8：import 路径规范

```ts
// ✅ barrel import
import { UnitCellMesh, AtomMesh } from '@/components/Chemistry3D'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, Line } from '@react-three/drei'
import { SCENE_COLORS } from '@/theme'

// ✅ 页面内相对导入
import { fracToWorld } from '../utils/coordTransform'
import { DATA } from '../data/simpleCubic'

// ❌ 禁止子路径导入
import { UnitCellMesh } from '@/components/Chemistry3D/UnitCellMesh'
import { SCENE_COLORS } from '@/theme/chemistry/sceneColors'
```

---

## Step 9：真机验证清单

> 以下问题在 Chrome DevTools 移动模拟器上验证不出来，必须在实机上测试。

| 验证项 | 设备 | 通过标准 |
|--------|------|---------|
| 触摸旋转手势 | 中低端安卓 + iOS | 旋转流畅，不与页面滚动冲突 |
| DPR 渲染 | 高分屏设备 | 无过度渲染，帧率 ≥ 30fps |
| frameloop="demand" | 任意设备 | 空闲时 CPU 占用 ≈ 0 |
| WebGL fallback | 不支持 WebGL 的设备 | 显示静态 fallback 信息 |
| 页面加载性能 | 低端设备 | 3D chunk 按需加载，首屏不受影响 |

---

## 执行前 Checklist

- [ ] **场景类型**：正交/透视已确认（晶胞用正交，分子用透视）
- [ ] **布局**：独立全屏布局（不走 AnimationPage 三屏）
- [ ] **路由**：已在 App.tsx 注册独立路由
- [ ] **WebGL 检测**：isWebGLAvailable() 惰性缓存（非每次渲染创建 context）+ fallback
- [ ] **Canvas 配置**：frameloop="demand" + dpr={[1,2]} + touch-action: none
- [ ] **OrbitControls**：enableDamping={false}
- [ ] **颜色 Token**：SCENE_COLORS 从 @/theme 导入，无 hex 硬编码
- [ ] **坐标转换**：分数→世界坐标使用独立转换函数，不复用 physicsToDesign
- [ ] **状态管理**：局部 React state，不访问 useAnimationStore
- [ ] **资源管理**：标准 mesh 自动 dispose，自定义 geometry 手动 dispose
- [ ] **动画**：useFrame 驱动，禁止裸 requestAnimationFrame
- [ ] **真机验证**：触摸手势 + DPR + 帧率 + WebGL fallback 已测试
- [ ] **代码**：barrel import；tsc --noEmit 通过
