#!/usr/bin/env node
/**
 * Node.js 版本一致性检查脚本
 * 检查当前 Node.js 版本是否与 .nvmrc 文件中指定的版本一致
 */
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..')
const nvmrcPath = path.join(projectRoot, '.nvmrc')
const packageJsonPath = path.join(projectRoot, 'package.json')

function checkNodeVersion() {
  console.log('🔍 检查 Node.js 版本一致性...')

  // 检查 .nvmrc 文件是否存在
  if (!fs.existsSync(nvmrcPath)) {
    console.error('❌ .nvmrc 文件不存在')
    process.exit(1)
  }

  // 读取 .nvmrc 中的版本
  const nvmrcVersion = fs.readFileSync(nvmrcPath, 'utf8').trim()
  console.log(`📄 .nvmrc 指定版本: ${nvmrcVersion}`)

  // 获取当前 Node.js 版本
  const currentVersion = process.version.substring(1) // 移除 'v' 前缀
  console.log(`💻 当前 Node.js 版本: ${currentVersion}`)

  // 检查版本是否一致
  if (currentVersion !== nvmrcVersion) {
    console.warn(`⚠️  版本不一致!`)
    console.warn(`   期望版本: ${nvmrcVersion}`)
    console.warn(`   当前版本: ${currentVersion}`)
    console.warn(`   建议运行: nvm use 或 fnm use`)
    process.exit(1)
  }

  // 检查 package.json 中的 engines 配置
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    const engineNode = packageJson.engines?.node

    if (engineNode) {
      console.log(`📦 package.json engines.node: ${engineNode}`)

      // 检查当前版本是否满足 engines 要求
      // 简单的版本比较，避免引入额外依赖
      const majorVersion = parseInt(currentVersion.split('.')[0])
      const requiredMajor = parseInt(engineNode.replace('>=', '').split('.')[0])

      if (majorVersion < requiredMajor) {
        console.error(`❌ 当前 Node.js 版本不满足 package.json 中的要求`)
        console.error(`   要求: ${engineNode}`)
        console.error(`   当前: ${currentVersion}`)
        process.exit(1)
      }
    }
  }

  console.log('✅ Node.js 版本检查通过!')
}

function checkPnpmVersion() {
  console.log('\n🔍 检查 pnpm 版本...')

  try {
    const pnpmVersion = execSync('pnpm --version', { encoding: 'utf8' }).trim()
    console.log(`📦 当前 pnpm 版本: ${pnpmVersion}`)

    // 检查 package.json 中的 pnpm 版本要求
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      const enginePnpm = packageJson.engines?.pnpm

      if (enginePnpm) {
        console.log(`📦 package.json engines.pnpm: ${enginePnpm}`)

        // 简单的版本比较，避免引入额外依赖
        const majorVersion = parseInt(pnpmVersion.split('.')[0])
        const requiredMajor = parseInt(enginePnpm.replace('>=', '').split('.')[0])

        if (majorVersion < requiredMajor) {
          console.error(`❌ 当前 pnpm 版本不满足要求`)
          console.error(`   要求: ${enginePnpm}`)
          console.error(`   当前: ${pnpmVersion}`)
          process.exit(1)
        }
      }
    }

    console.log('✅ pnpm 版本检查通过!')
  } catch (error) {
    console.error('❌ pnpm 未安装或无法访问')
    console.error('   请安装 pnpm: npm install -g pnpm')
    process.exit(1)
  }
}

function main() {
  console.log('🚀 开始环境版本检查...\n')

  try {
    checkNodeVersion()
    checkPnpmVersion()

    console.log('\n🎉 所有版本检查通过! 环境配置正确。')
  } catch (error) {
    console.error('\n💥 版本检查失败:', error.message)
    process.exit(1)
  }
}

// 检查是否为直接运行
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { checkNodeVersion, checkPnpmVersion }
