#!/usr/bin/env node
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Android APK 签名工具
 * 用于对未签名的APK文件进行调试签名，使其能够在Android设备上安装
 */

const PROJECT_ROOT = path.resolve(__dirname, '..')
const KEYSTORE_PATH = path.join(PROJECT_ROOT, 'debug.keystore')
const APK_INPUT_PATH = path.join(
  PROJECT_ROOT,
  'src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk'
)
const APK_OUTPUT_PATH = path.join(PROJECT_ROOT, 'app-universal-release-signed.apk')

function log(message) {
  console.log(`[APK签名] ${message}`)
}

function error(message) {
  console.error(`❌ [APK签名] ${message}`)
  process.exit(1)
}

function success(message) {
  console.log(`✅ [APK签名] ${message}`)
}

function createKeystore() {
  if (fs.existsSync(KEYSTORE_PATH)) {
    log('调试密钥库已存在，跳过创建')
    return
  }

  log('创建调试密钥库...')
  try {
    execSync(
      `keytool -genkey -v -keystore "${KEYSTORE_PATH}" -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=Android Debug,O=Android,C=US"`,
      {
        stdio: 'inherit',
      }
    )
    success('调试密钥库创建成功')
  } catch (err) {
    error(`创建密钥库失败: ${err.message}`)
  }
}

function signApk() {
  if (!fs.existsSync(APK_INPUT_PATH)) {
    error(`未找到APK文件: ${APK_INPUT_PATH}`)
  }

  log('对APK进行签名...')
  try {
    // 复制APK文件
    fs.copyFileSync(APK_INPUT_PATH, APK_OUTPUT_PATH)

    // 签名APK
    execSync(
      `jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore "${KEYSTORE_PATH}" -storepass android -keypass android "${APK_OUTPUT_PATH}" androiddebugkey`,
      {
        stdio: 'inherit',
      }
    )

    success('APK签名完成')
  } catch (err) {
    error(`APK签名失败: ${err.message}`)
  }
}

function verifyApk() {
  log('验证APK签名...')
  try {
    execSync(`jarsigner -verify "${APK_OUTPUT_PATH}"`, {
      stdio: 'inherit',
    })
    success('APK签名验证通过')
  } catch (err) {
    error(`APK签名验证失败: ${err.message}`)
  }
}

function main() {
  console.log('🚀 Android APK 签名工具')
  console.log('================================')

  createKeystore()
  signApk()
  verifyApk()

  console.log('================================')
  success(`已签名的APK文件: ${APK_OUTPUT_PATH}`)
  console.log('\n📱 安装说明:')
  console.log('1. 将APK文件传输到Android设备')
  console.log('2. 在设备上启用"未知来源"安装权限')
  console.log('3. 点击APK文件进行安装')
  console.log('\n⚠️  注意: 这是调试签名，仅用于开发测试，不能用于生产发布')
}

// ES模块中检查是否为主模块
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { createKeystore, signApk, verifyApk }
