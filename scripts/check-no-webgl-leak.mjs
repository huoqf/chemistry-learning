#!/usr/bin/env node
/**
 * check-no-webgl-leak.mjs
 *
 * 检测非允许文件中的 WebGL context 创建调用。
 * 浏览器 WebGL context 上限 ~14-16 个，渲染路径中反复调用 getContext('webgl')
 * 会耗尽 context 槽位，导致 R3F 渲染器 context 被回收（画面白屏）。
 * 所有 WebGL 检测必须收敛到 src/components/Chemistry3D/utils/webgl.ts（惰性缓存）。
 *
 * 用法：node scripts/check-no-webgl-leak.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SRC_DIR = join(ROOT, 'src')
const ALLOWED_FILE = join(ROOT, 'src', 'components', 'Chemistry3D', 'utils', 'webgl.ts')
const FILE_EXTENSIONS = new Set(['.ts', '.tsx'])

// 匹配 getContext('webgl' / getContext("webgl' / getContext('experimental-webgl' / getContext('webgl2'
const WEBGL_GETCONTEXT_REGEX = /getContext\s*\(\s*['"](?:experimental-)?webgl2?['"]/g
const COMMENT_REGEX = /^\s*(\/\/|\/?\*|\*)/

function walk(dir) {
  const entries = readdirSync(dir)
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) files.push(...walk(full))
    else if (FILE_EXTENSIONS.has(entry.slice(entry.lastIndexOf('.')))) files.push(full)
  }
  return files
}

const violations = []
for (const file of walk(SRC_DIR)) {
  if (file === ALLOWED_FILE) continue

  const content = readFileSync(file, 'utf8')
  const lines = content.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (COMMENT_REGEX.test(line)) continue
    WEBGL_GETCONTEXT_REGEX.lastIndex = 0
    if (WEBGL_GETCONTEXT_REGEX.test(line)) {
      violations.push({
        file: relative(ROOT, file).replaceAll('\\', '/'),
        line: i + 1,
        text: line.trim(),
      })
    }
  }
}

if (violations.length > 0) {
  console.error('❌ WebGL context creation detected outside allowed utility (context leak risk)。')
  console.error('   所有 WebGL 检测必须收敛到 src/components/Chemistry3D/utils/webgl.ts（惰性缓存）。')
  console.error('   浏览器 WebGL context 上限 ~14-16 个，渲染路径中反复创建会导致 R3F 白屏。')
  console.error('')
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  ${v.text}`)
  }
  process.exit(1)
}

console.log('✅ No-WebGL-leak check passed: no direct getContext("webgl") calls found outside allowed utility.')
