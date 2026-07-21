import { readFileSync } from 'fs'

const msg = readFileSync('.git/COMMIT_EDITMSG', 'utf8').trim()
const pattern = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .+/

if (!pattern.test(msg)) {
  console.error('Commit message must follow Conventional Commits format')
  console.error('Example: feat: add equilibrium animation')
  process.exit(1)
}
