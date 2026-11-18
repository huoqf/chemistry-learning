#!/usr/bin/env node
/**
 * check-font-size.mjs
 *
 * 检测非测试源码中的裸数字 fontSize（铁律 7）：
 *   1) 样式对象字面量：fontSize: 14
 *   2) JSX SVG 属性：fontSize={14} 或 fontSize="14"
 *
 * 存量历史文件暂列入 ALLOWLIST（附原因与 targetDate），
 * 确保新代码零容忍、存量逐步收敛。
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SRC_DIR = join(ROOT, 'src')
const FILE_EXTENSIONS = new Set(['.ts', '.tsx'])
const SKIP_SEGMENTS = ['__tests__']

const RAW_STYLE_FONT_SIZE = /fontSize\s*:\s*\d+(?:\.\d+)?\b/g
const RAW_JSX_FONT_SIZE = /\bfontSize\s*=\s*(?:\{\s*\d+(?:\.\d+)?\s*\}|["']\d+(?:\.\d+)?["'])/g

/**
 * 存量 JSX fontSize 豁免清单（仅豁免 JSX 属性历史债，样式对象一律零容忍）。
 * 每条须写明 reason 与 targetDate。
 */
const JSX_ALLOWLIST = [
  {
    file: 'src/components/Chemistry/GaokaoDiagram/index.tsx',
    reason: '固定 viewBox 的高考真题原图矢量复现库，后续统一接入 font() 缩放',
    targetDate: '2027-03-31',
  },
  {
    file: 'src/components/Chemistry/SafetyBottleApparatus.tsx',
    reason: '存量器材标签字号待接入 identityFontScaler',
    targetDate: '2027-03-31',
  },
  {
    file: 'src/features/avogadro-constant/components/AvogadroScene.tsx',
    reason: '存量场景字号待统一迁移至 font()',
    targetDate: '2027-03-31',
  },
  {
    file: 'src/features/avogadro-constant/components/AvogadroStructureScene.tsx',
    reason: '存量场景字号待统一迁移至 font()',
    targetDate: '2027-03-31',
  },
  {
    file: 'src/features/element-periodic-property/components/ElementPeriodicCenterView.tsx',
    reason: '存量场景字号待统一迁移至 font()',
    targetDate: '2027-03-31',
  },
  {
    file: 'src/features/industrial-flow/components/IndustrialFlowCenterView.tsx',
    reason: '存量流程图字号待统一迁移至 font()',
    targetDate: '2027-03-31',
  },
  {
    file: 'src/features/industrial-flow/components/IndustrialFlowSvgFlowchart.tsx',
    reason: '存量流程图字号待统一迁移至 font()',
    targetDate: '2027-03-31',
  },
]

const jsxAllowSet = new Set(JSX_ALLOWLIST.map((e) => e.file))

function walk(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    if (SKIP_SEGMENTS.some((seg) => fullPath.includes(seg))) continue
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      files.push(...walk(fullPath))
    } else if (stat.isFile()) {
      const ext = fullPath.slice(fullPath.lastIndexOf('.'))
      if (FILE_EXTENSIONS.has(ext)) files.push(fullPath)
    }
  }
  return files
}

const violations = []
for (const file of walk(SRC_DIR)) {
  const relPath = relative(ROOT, file).replaceAll('\\', '/')
  const content = readFileSync(file, 'utf8')
  const lines = content.split(/\r?\n/)
  const skipJsx = jsxAllowSet.has(relPath)

  lines.forEach((line, index) => {
    RAW_STYLE_FONT_SIZE.lastIndex = 0
    if (RAW_STYLE_FONT_SIZE.test(line)) {
      violations.push({
        file: relPath,
        line: index + 1,
        text: line.trim(),
      })
    }
    if (!skipJsx) {
      RAW_JSX_FONT_SIZE.lastIndex = 0
      if (RAW_JSX_FONT_SIZE.test(line)) {
        violations.push({
          file: relPath,
          line: index + 1,
          text: line.trim(),
        })
      }
    }
  })
}

const today = new Date().toISOString().slice(0, 10)
const expired = JSX_ALLOWLIST.filter((e) => e.targetDate && e.targetDate < today)
if (expired.length > 0) {
  console.warn(`⚠️  fontSize 豁免清单中有 ${expired.length} 项已过期（targetDate < ${today}）：`)
  for (const e of expired) {
    console.warn(`  - ${e.file}  (targetDate: ${e.targetDate})  ${e.reason}`)
  }
}

if (violations.length > 0) {
  console.error('❌ Raw numeric fontSize values detected. Use font(...) / canvasSize.font(...).')
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  ${v.text}`)
  }
  process.exit(1)
}

console.log('✅ fontSize architecture check passed: no unallowlisted raw numeric fontSize values found.')
