#!/usr/bin/env node
/**
 * check-theme-import.mjs
 *
 * 检测 src/ 中除 src/theme/ 以外的 '@/theme/*' 子路径导入（铁律 4C）。
 * 所有业务组件（src/components/、src/pages/、src/features/ 等）必须从 '@/theme' 统一入口导入。
 *
 * 用法：node scripts/check-theme-import.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SRC_DIR = join(ROOT, 'src')
const THEME_DIR = join(ROOT, 'src', 'theme')
const FILE_EXTENSIONS = new Set(['.ts', '.tsx'])
const SUBPATH_IMPORT_REGEX = /\b(?:from|import)\s*\(?\s*['"]@\/theme\/[^'"]+['"]/g
const COMMENT_REGEX = /^\s*(\/\/|\/?\*|\*)/

function walk(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (full === THEME_DIR) continue
    const stat = statSync(full)
    if (stat.isDirectory()) files.push(...walk(full))
    else if (FILE_EXTENSIONS.has(entry.slice(entry.lastIndexOf('.')))) files.push(full)
  }
  return files
}

const violations = []
for (const file of walk(SRC_DIR)) {
  const relPath = relative(ROOT, file).replaceAll('\\', '/')
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (COMMENT_REGEX.test(line)) continue
    SUBPATH_IMPORT_REGEX.lastIndex = 0
    if (SUBPATH_IMPORT_REGEX.test(line)) {
      violations.push({ file: relPath, line: i + 1, text: line.trim() })
    }
  }
}

if (violations.length > 0) {
  console.error('❌ Theme subpath imports detected (铁律 4C: 禁止子路径导入)。')
  console.error("   请统一改为 from '@/theme'。")
  console.error('')
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  ${v.text}`)
  }
  process.exit(1)
}

console.log("✅ Theme-import check passed: all imports use unified '@/theme' entry.")
