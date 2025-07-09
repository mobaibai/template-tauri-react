#!/usr/bin/env node
import { execSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// 颜色输出函数
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`)
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`)
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`)
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`)
}

function logStep(step, message) {
  console.log(`${colors.cyan}[${step}]${colors.reset} ${message}`)
}

// 检查命令是否存在
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

// 修复 OpenSSL 问题
async function fixOpenSSLIssues() {
  console.log('🔧 OpenSSL 问题修复工具\n')

  const platform = os.platform()

  if (platform === 'darwin') {
    await fixMacOSOpenSSL()
  } else if (platform === 'linux') {
    await fixLinuxOpenSSL()
  } else {
    logWarning('当前平台不支持自动修复，请手动配置 OpenSSL')
    return
  }

  // 验证 Cargo.toml 配置
  await verifyCargoConfig()

  // 清理并重新构建
  await cleanAndRebuild()
}

// macOS OpenSSL 修复
async function fixMacOSOpenSSL() {
  logStep('MACOS', '修复 macOS OpenSSL 配置...')

  // 检查 Homebrew
  if (!commandExists('brew')) {
    logError('未找到 Homebrew，请先安装 Homebrew')
    logInfo(
      '安装命令: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    )
    return
  }

  try {
    // 安装 OpenSSL 和 pkg-config
    logInfo('安装 OpenSSL 和 pkg-config...')
    execSync('brew install openssl pkg-config', { stdio: 'inherit' })

    // 设置环境变量
    const shellProfile = process.env.SHELL?.includes('zsh') ? '~/.zshrc' : '~/.bash_profile'
    const envVars = [
      'export OPENSSL_DIR=/opt/homebrew/opt/openssl',
      'export OPENSSL_LIB_DIR=/opt/homebrew/opt/openssl/lib',
      'export OPENSSL_INCLUDE_DIR=/opt/homebrew/opt/openssl/include',
      'export PKG_CONFIG_PATH="/opt/homebrew/lib/pkgconfig"',
    ]

    logInfo(`配置环境变量到 ${shellProfile}...`)
    const envVarString = envVars.join('\n')

    // 检查是否已经配置过
    try {
      const profilePath = shellProfile.replace('~', os.homedir())
      const profileContent = fs.readFileSync(profilePath, 'utf8')

      if (!profileContent.includes('OPENSSL_DIR')) {
        fs.appendFileSync(profilePath, `\n# OpenSSL 配置 (Tauri Android 开发)\n${envVarString}\n`)
        logSuccess('环境变量已添加到配置文件')
      } else {
        logInfo('环境变量已存在于配置文件中')
      }
    } catch (error) {
      logWarning('无法自动配置环境变量，请手动添加:')
      console.log(envVarString)
    }

    // 设置当前会话的环境变量
    process.env.OPENSSL_DIR = '/opt/homebrew/opt/openssl'
    process.env.OPENSSL_LIB_DIR = '/opt/homebrew/opt/openssl/lib'
    process.env.OPENSSL_INCLUDE_DIR = '/opt/homebrew/opt/openssl/include'
    process.env.PKG_CONFIG_PATH = '/opt/homebrew/lib/pkgconfig'

    logSuccess('macOS OpenSSL 配置完成')
  } catch (error) {
    logError(`配置失败: ${error.message}`)
  }
}

// Linux OpenSSL 修复
async function fixLinuxOpenSSL() {
  logStep('LINUX', '修复 Linux OpenSSL 配置...')

  try {
    // 检测包管理器
    let installCmd = ''
    if (commandExists('apt-get')) {
      installCmd = 'sudo apt-get update && sudo apt-get install -y libssl-dev pkg-config'
    } else if (commandExists('yum')) {
      installCmd = 'sudo yum install -y openssl-devel pkgconfig'
    } else if (commandExists('dnf')) {
      installCmd = 'sudo dnf install -y openssl-devel pkgconf'
    } else {
      logWarning('未检测到支持的包管理器，请手动安装 OpenSSL 开发库')
      return
    }

    logInfo('安装 OpenSSL 开发库...')
    execSync(installCmd, { stdio: 'inherit' })

    logSuccess('Linux OpenSSL 配置完成')
  } catch (error) {
    logError(`配置失败: ${error.message}`)
  }
}

// 验证 Cargo.toml 配置
async function verifyCargoConfig() {
  logStep('CARGO', '验证 Cargo.toml 配置...')

  const cargoTomlPath = path.join(projectRoot, 'src-tauri', 'Cargo.toml')

  try {
    const cargoContent = fs.readFileSync(cargoTomlPath, 'utf8')

    // 检查是否使用了 rustls-tls
    if (cargoContent.includes('rustls-tls')) {
      logSuccess('已配置使用 rustls-tls，避免 OpenSSL 依赖')
    } else {
      logWarning('建议配置 reqwest 使用 rustls-tls 特性')
      logInfo(
        '请在 Cargo.toml 中修改: reqwest = { version = "0.12", features = ["json", "rustls-tls"], default-features = false }'
      )
    }
  } catch (error) {
    logError(`无法读取 Cargo.toml: ${error.message}`)
  }
}

// 清理并重新构建
async function cleanAndRebuild() {
  logStep('CLEAN', '清理并重新构建...')

  try {
    // 清理 Cargo 缓存
    logInfo('清理 Cargo 构建缓存...')
    execSync('cargo clean', { cwd: path.join(projectRoot, 'src-tauri'), stdio: 'inherit' })

    // 清理 node_modules (可选)
    logInfo('清理 node_modules...')
    execSync('rm -rf node_modules', { cwd: projectRoot, stdio: 'inherit' })

    // 重新安装依赖
    logInfo('重新安装依赖...')
    execSync('yarn install', { cwd: projectRoot, stdio: 'inherit' })

    logSuccess('清理和重新构建完成')
  } catch (error) {
    logError(`清理失败: ${error.message}`)
  }
}

// 主函数
async function main() {
  try {
    await fixOpenSSLIssues()

    console.log('\n🎉 OpenSSL 修复完成！')
    console.log('\n📝 接下来的步骤:')
    console.log('1. 重新启动终端或运行 source ~/.zshrc (macOS)')
    console.log('2. 运行 yarn dev:android:safe 测试修复效果')
    console.log('3. 如果仍有问题，请查看 docs/TROUBLESHOOTING.md')
  } catch (error) {
    logError(`修复过程中出现错误: ${error.message}`)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { fixOpenSSLIssues, fixMacOSOpenSSL, fixLinuxOpenSSL, verifyCargoConfig, cleanAndRebuild }
