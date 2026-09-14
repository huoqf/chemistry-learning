#!/usr/bin/env node
/**
 * 代码风格机械门禁
 *
 * ── 为什么不用 prettier 做门禁 ──
 * 本项目采用「无分号 + 对象字面量列对齐 + 注释列对齐」的手工排版风格。
 * 实测 `npx prettier --check "src/**\/*.{ts,tsx}"`：
 *   - `semi: true`（.prettierrc 原值）→ 634 个文件不通过
 *   - `semi: false`                     → 543 个文件不通过
 * 残余差异主要来自 prettier 会打散刻意保留的列对齐（如 `sm:    '4px'`）。
 * 因此 prettier 不能作为本项目格式门禁，全量 `--write` 会破坏可读性。
 * 详见 docs/agent-rules/process/FORMATTING_POLICY.md。
 *
 * ── 本脚本只做三件「可机械判定、不破坏手工排版」的检查 ──
 *   1) 行尾多余空白
 *   2) 文件末尾缺少换行（POSIX 文本文件约定）
 *   3) 同一文件内混用 CRLF 与 LF（跨平台 diff 噪声来源）
 *
 * 说明：不强制全文件统一为 LF 或 CRLF —— 那会产生整文件级 diff，
 * 收益低于风险，故只禁止「同一文件内混用」。
 *
 * 豁免机制与 check-no-marker.mjs 保持一致：entries 需带 reason 与 targetDate，
 * 可选 lines 数组用于按行豁免。
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SCAN_DIRS = ['src', 'e2e', 'scripts']
const FILE_EXTENSIONS = new Set(['.ts', '.tsx', '.mjs', '.cjs', '.js', '.css'])
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'coverage', 'playwright-report'])

/**
 * 显式豁免名单。
 * 每条必须写清 reason 与 targetDate（到期后本脚本会报错提醒清理）。
 */
const ALLOWLIST = [
  {
    pattern: 'src/components/Chemistry/KippApparatus.tsx',
    lines: [84, 85, 134, 149],
    reason: 'SVG <path> 的 d 模板字面量内用「空格 + 换行」分隔 M/L/C 路径指令，空格是字符串内容的一部分',
    targetDate: '2027-01-31',
  },
]

function walk(dir, files) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) walk(fullPath, files)
    else if (FILE_EXTENSIONS.has(fullPath.slice(fullPath.lastIndexOf('.')))) files.push(fullPath)
  }
  return files
}

function allowedLines(relPath) {
  const lines = new Set()
  let fileLevel = false
  for (const entry of ALLOWLIST) {
    if (!relPath.includes(entry.pattern)) continue
    if (!entry.lines) fileLevel = true
    else entry.lines.forEach((n) => lines.add(n))
  }
  return { fileLevel, lines }
}

const files = []
for (const dir of SCAN_DIRS) {
  try {
    if (statSync(join(ROOT, dir)).isDirectory()) walk(join(ROOT, dir), files)
  } catch {
    // 目录不存在则跳过（例如 e2e 尚未建立）
  }
}

const violations = []

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, '/')
  const { fileLevel, lines: skipLines } = allowedLines(rel)
  if (fileLevel) continue

  const raw = readFileSync(file, 'utf8')
  const lines = raw.split(/\r?\n/)

  lines.forEach((line, index) => {
    const n = index + 1
    if (skipLines.has(n)) return
    if (/[ \t]+$/.test(line)) {
      violations.push({ file: rel, line: n, rule: '行尾多余空白', text: line.trimEnd() })
    }
  })

  if (raw.length > 0 && !raw.endsWith('\n')) {
    violations.push({ file: rel, line: lines.length, rule: '文件末尾缺少换行', text: '' })
  }

  const hasCrlf = raw.includes('\r\n')
  const hasBareLf = /\n/.test(raw.replace(/\r\n/g, ''))
  if (hasCrlf && hasBareLf) {
    violations.push({ file: rel, line: 0, rule: '文件内混用 CRLF 与 LF 换行', text: '' })
  }
}

const now = new Date()
const expired = ALLOWLIST.filter((entry) => new Date(entry.targetDate) < now)
if (expired.length > 0) {
  console.error('❌ 代码风格豁免名单已过期，请清理：')
  expired.forEach((entry) => console.error(`  ${entry.pattern}  (${entry.reason})`))
  process.exit(1)
}

if (violations.length > 0) {
  console.error(`❌ 代码风格检查未通过（${violations.length} 处）。`)
  console.error('   请修正后重试；不要用 prettier 全量重排（见 FORMATTING_POLICY.md）。')
  violations.forEach((v) => {
    const where = v.line > 0 ? `${v.file}:${v.line}` : v.file
    console.error(`  ${where}  [${v.rule}]  ${v.text}`)
  })
  process.exit(1)
}

console.log(
  `✅ 代码风格检查通过：${files.length} 个文件无行尾空白、末尾换行规范、无混用换行符。`
)
