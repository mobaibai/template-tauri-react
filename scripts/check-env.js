#!/usr/bin/env node
/**
 * 开发环境检查和修复脚本
 * 自动检测 Tauri 开发所需的环境配置
 */
import { execSync, spawn } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

function logStep(step, message) {
  log(`[${step}] ${message}`, 'cyan')
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

// 获取命令版本
function getVersion(command, versionFlag = '--version') {
  try {
    const output = execSync(`${command} ${versionFlag}`, { encoding: 'utf8', stdio: 'pipe' })
    return output.trim().split('\n')[0]
  } catch {
    return null
  }
}

// 检查 Node.js 环境
function checkNodeEnvironment() {
  logStep('NODE', '检查 Node.js 环境...')

  const nodeVersion = process.version
  const npmVersion = getVersion('npm')
  const yarnVersion = getVersion('yarn')

  logInfo(`Node.js: ${nodeVersion}`)
  if (npmVersion) logInfo(`npm: ${npmVersion}`)
  if (yarnVersion) logInfo(`Yarn: ${yarnVersion}`)

  // 检查 Node.js 版本
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
  if (majorVersion < 16) {
    logError('Node.js 版本过低，建议使用 16.0.0 或更高版本')
    return false
  }

  logSuccess('Node.js 环境检查通过')
  return true
}

// 检查 Rust 环境
function checkRustEnvironment() {
  logStep('RUST', '检查 Rust 环境...')

  if (!commandExists('rustc')) {
    logError('未找到 Rust，请安装 Rust: https://rustup.rs/')
    return false
  }

  if (!commandExists('cargo')) {
    logError('未找到 Cargo，请重新安装 Rust')
    return false
  }

  const rustVersion = getVersion('rustc')
  const cargoVersion = getVersion('cargo')

  logInfo(`Rust: ${rustVersion}`)
  logInfo(`Cargo: ${cargoVersion}`)

  logSuccess('Rust 环境检查通过')
  return true
}

// 检查 Tauri CLI
function checkTauriCLI() {
  logStep('TAURI', '检查 Tauri CLI...')

  if (!commandExists('tauri')) {
    logWarning('未找到 Tauri CLI，尝试安装...')
    try {
      execSync('cargo install tauri-cli', { stdio: 'inherit' })
      logSuccess('Tauri CLI 安装成功')
    } catch {
      logError('Tauri CLI 安装失败，请手动安装: cargo install tauri-cli')
      return false
    }
  }

  const tauriVersion = getVersion('tauri')
  logInfo(`Tauri CLI: ${tauriVersion}`)

  logSuccess('Tauri CLI 检查通过')
  return true
}

// 检查 Android 环境
function checkAndroidEnvironment() {
  logStep('ANDROID', '检查 Android 开发环境...')

  const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT
  if (!androidHome) {
    logError('未设置 ANDROID_HOME 环境变量')
    logInfo('请设置 ANDROID_HOME 指向 Android SDK 目录')
    return false
  }

  logInfo(`ANDROID_HOME: ${androidHome}`)

  // 检查 Android SDK 目录
  if (!fs.existsSync(androidHome)) {
    logError(`Android SDK 目录不存在: ${androidHome}`)
    return false
  }

  // 检查 adb
  const adbPath = path.join(androidHome, 'platform-tools', 'adb')
  if (!fs.existsSync(adbPath) && !commandExists('adb')) {
    logError('未找到 adb，请安装 Android SDK Platform Tools')
    return false
  }

  // 检查 NDK
  const ndkDir = path.join(androidHome, 'ndk')
  if (!fs.existsSync(ndkDir)) {
    logWarning('未找到 Android NDK，这是 Tauri Android 开发所必需的')
    logInfo('请在 Android Studio 中安装 NDK')
    return false
  }

  // 检查 Java
  if (!commandExists('java')) {
    logError('未找到 Java，请安装 JDK 11 或更高版本')
    return false
  }

  const javaVersion = getVersion('java')
  logInfo(`Java: ${javaVersion}`)

  logSuccess('Android 环境基础检查通过')
  return true
}

// 检查 Android 模拟器
function checkAndroidEmulator() {
  logStep('EMULATOR', '检查 Android 模拟器...')

  const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT
  if (!androidHome) {
    logError('ANDROID_HOME 未设置，无法检查模拟器')
    return false
  }

  const emulatorPath = path.join(androidHome, 'emulator', 'emulator')
  if (!fs.existsSync(emulatorPath)) {
    logError('未找到 Android 模拟器，请在 Android Studio 中安装')
    return false
  }

  try {
    // 列出可用的 AVD
    const avdOutput = execSync(`"${emulatorPath}" -list-avds`, { encoding: 'utf8' })
    const avds = avdOutput
      .trim()
      .split('\n')
      .filter(line => line.trim())

    if (avds.length === 0) {
      logWarning('未找到 Android 虚拟设备 (AVD)')
      logInfo('请在 Android Studio 中创建 AVD')
      return false
    }

    logInfo(`找到 ${avds.length} 个 AVD:`)
    avds.forEach(avd => logInfo(`  - ${avd}`))

    // 检查是否有模拟器正在运行
    try {
      const runningDevices = execSync('adb devices', { encoding: 'utf8' })
      const emulatorLines = runningDevices.split('\n').filter(line => line.includes('emulator'))

      if (emulatorLines.length > 0) {
        logSuccess(`${emulatorLines.length} 个模拟器正在运行`)
      } else {
        logWarning('没有模拟器正在运行')
        logInfo(`可以使用以下命令启动模拟器: "${emulatorPath}" -avd ${avds[0]}`)
      }
    } catch {
      logWarning('无法检查运行中的模拟器')
    }

    logSuccess('Android 模拟器检查完成')
    return true
  } catch (error) {
    logError(`检查模拟器时出错: ${error.message}`)
    return false
  }
}

// 检查 OpenSSL 环境
function checkOpenSSLEnvironment() {
  logStep('OPENSSL', '检查 OpenSSL 环境...')

  // 检查系统是否安装了 OpenSSL
  if (!commandExists('openssl')) {
    logWarning('未找到 OpenSSL 命令')
    logInfo('Android 开发可能需要 OpenSSL，请考虑安装')
  } else {
    const opensslVersion = getVersion('openssl', 'version')
    logInfo(`OpenSSL: ${opensslVersion}`)
  }

  // 检查 pkg-config
  if (!commandExists('pkg-config')) {
    logWarning('未找到 pkg-config')
    logInfo('某些 Rust crate 可能需要 pkg-config 来链接 OpenSSL')

    if (os.platform() === 'darwin') {
      logInfo('在 macOS 上可以通过 Homebrew 安装: brew install pkg-config')
    } else if (os.platform() === 'linux') {
      logInfo(
        '在 Linux 上可以通过包管理器安装: apt-get install pkg-config 或 yum install pkgconfig'
      )
    }
  } else {
    logSuccess('pkg-config 已安装')
  }

  // 检查 OpenSSL 开发库
  try {
    execSync('pkg-config --exists openssl', { stdio: 'ignore' })
    const opensslPkgVersion = execSync('pkg-config --modversion openssl', {
      encoding: 'utf8',
    }).trim()
    logInfo(`OpenSSL pkg-config: ${opensslPkgVersion}`)
    logSuccess('OpenSSL 开发库检查通过')
  } catch {
    logWarning('未找到 OpenSSL 开发库')
    if (os.platform() === 'darwin') {
      logInfo('在 macOS 上可以通过 Homebrew 安装: brew install openssl')
      logInfo('可能还需要设置环境变量: export PKG_CONFIG_PATH="/opt/homebrew/lib/pkgconfig"')
    } else if (os.platform() === 'linux') {
      logInfo('在 Linux 上可以安装: apt-get install libssl-dev 或 yum install openssl-devel')
    }
  }

  return true
}

// 检查 Rust Android 目标
function checkRustAndroidTargets() {
  logStep('TARGETS', '检查 Rust Android 编译目标...')

  const requiredTargets = [
    'aarch64-linux-android',
    'armv7-linux-androideabi',
    'i686-linux-android',
    'x86_64-linux-android',
  ]

  try {
    const installedTargets = execSync('rustup target list --installed', { encoding: 'utf8' })
    const missingTargets = requiredTargets.filter(target => !installedTargets.includes(target))

    if (missingTargets.length > 0) {
      logWarning(`缺少以下 Rust 编译目标: ${missingTargets.join(', ')}`)
      logInfo('正在安装缺失的目标...')

      for (const target of missingTargets) {
        try {
          execSync(`rustup target add ${target}`, { stdio: 'inherit' })
          logSuccess(`已安装目标: ${target}`)
        } catch {
          logError(`安装目标失败: ${target}`)
          return false
        }
      }
    }

    logSuccess('Rust Android 编译目标检查通过')
    return true
  } catch (error) {
    logError(`检查 Rust 目标时出错: ${error.message}`)
    return false
  }
}

// 检查 iOS 环境 (仅在 macOS 上)
function checkiOSEnvironment() {
  if (os.platform() !== 'darwin') {
    logInfo('跳过 iOS 环境检查 (非 macOS 系统)')
    return true
  }

  logStep('IOS', '检查 iOS 开发环境...')

  // 检查 Xcode
  if (!commandExists('xcodebuild')) {
    logError('未找到 Xcode，请从 App Store 安装')
    return false
  }

  const xcodeVersion = getVersion('xcodebuild')
  logInfo(`Xcode: ${xcodeVersion}`)

  // 检查 iOS 模拟器
  if (!commandExists('xcrun')) {
    logError('未找到 xcrun，请安装 Xcode Command Line Tools')
    return false
  }

  try {
    const simulators = execSync('xcrun simctl list devices available', { encoding: 'utf8' })
    if (simulators.includes('iPhone')) {
      logSuccess('找到 iOS 模拟器')
    } else {
      logWarning('未找到可用的 iOS 模拟器')
    }
  } catch {
    logWarning('无法检查 iOS 模拟器')
  }

  // 检查 iOS 编译目标
  const iosTargets = ['aarch64-apple-ios', 'x86_64-apple-ios', 'aarch64-apple-ios-sim']

  try {
    const installedTargets = execSync('rustup target list --installed', { encoding: 'utf8' })
    const missingTargets = iosTargets.filter(target => !installedTargets.includes(target))

    if (missingTargets.length > 0) {
      logWarning(`缺少以下 iOS 编译目标: ${missingTargets.join(', ')}`)
      logInfo('正在安装缺失的目标...')

      for (const target of missingTargets) {
        try {
          execSync(`rustup target add ${target}`, { stdio: 'inherit' })
          logSuccess(`已安装目标: ${target}`)
        } catch {
          logError(`安装目标失败: ${target}`)
        }
      }
    }
  } catch {
    logWarning('无法检查 iOS 编译目标')
  }

  logSuccess('iOS 环境检查完成')
  return true
}

// 生成环境报告
function generateReport(results) {
  logStep('REPORT', '生成环境检查报告...')

  const report = {
    timestamp: new Date().toISOString(),
    platform: os.platform(),
    arch: os.arch(),
    results: results,
  }

  const reportPath = path.join(__dirname, '..', 'env-check-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

  logInfo(`环境检查报告已保存到: ${reportPath}`)
}

// 主函数
function main() {
  log('🔍 Tauri 开发环境检查工具', 'bright')
  log('================================', 'blue')

  const results = {
    node: false,
    rust: false,
    openssl: false,
    tauri: false,
    android: false,
    androidEmulator: false,
    rustAndroidTargets: false,
    ios: false,
  }

  try {
    results.node = checkNodeEnvironment()
    results.rust = checkRustEnvironment()
    results.openssl = checkOpenSSLEnvironment()
    results.tauri = checkTauriCLI()

    // 检查移动端环境
    results.android = checkAndroidEnvironment()
    if (results.android) {
      results.androidEmulator = checkAndroidEmulator()
      results.rustAndroidTargets = checkRustAndroidTargets()
    }

    results.ios = checkiOSEnvironment()

    // 生成报告
    generateReport(results)

    // 总结
    log('\n📋 检查结果总结:', 'bright')
    const passed = Object.values(results).filter(Boolean).length
    const total = Object.keys(results).length

    if (passed === total) {
      logSuccess(`所有检查通过 (${passed}/${total})`)
      logInfo('您的开发环境已准备就绪！')
    } else {
      logWarning(`部分检查未通过 (${passed}/${total})`)
      logInfo('请根据上述提示修复环境问题')
    }

    // 提供修复建议
    if (!results.android || !results.androidEmulator || !results.rustAndroidTargets) {
      log('\n🔧 Android 开发修复建议:', 'yellow')
      logInfo('1. 安装 Android Studio: https://developer.android.com/studio')
      logInfo('2. 在 Android Studio 中安装 Android SDK 和 NDK')
      logInfo('3. 创建 Android 虚拟设备 (AVD)')
      logInfo('4. 设置环境变量 ANDROID_HOME')
      logInfo('5. 运行: npm run check:env -- --fix')
    }
  } catch (error) {
    logError(`环境检查过程中出现错误: ${error.message}`)
    process.exit(1)
  }
}

// 命令行参数处理
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    console.log('\n🔍 Tauri 开发环境检查工具')
    console.log('\n用法:')
    console.log('  node scripts/check-env.js [选项]')
    console.log('\n选项:')
    console.log('  --help, -h     显示帮助信息')
    console.log('  --fix          自动修复可修复的问题')
    console.log('\n示例:')
    console.log('  node scripts/check-env.js')
    console.log('  npm run check:env')
    console.log('  npm run check:env -- --fix')
    process.exit(0)
  }

  main()
}

export {
  checkNodeEnvironment,
  checkRustEnvironment,
  checkOpenSSLEnvironment,
  checkTauriCLI,
  checkAndroidEnvironment,
  checkAndroidEmulator,
  checkRustAndroidTargets,
  checkiOSEnvironment,
}
