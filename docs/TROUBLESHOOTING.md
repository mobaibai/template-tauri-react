# 故障排除指南

本文档提供了 Tauri + React 项目开发过程中常见问题的解决方案。

## 🔧 快速诊断

在遇到问题时，首先运行环境检查工具：

```bash
# 检查开发环境
npm run check:env

# 自动修复可修复的问题
npm run check:env:fix
```

## 📱 Android 开发问题

### 问题 1: OpenSSL 编译错误

**问题描述：** 在执行 `yarn dev:android:safe` 时出现 `openssl-sys`
编译失败错误：

```
warning: openssl-sys@0.9.109: Could not find directory of OpenSSL installation
error: failed to run custom build command for `openssl-sys v0.9.109`
```

**解决方案：**

1. **推荐方案：使用 rustls 替代 OpenSSL**

   ```bash
   # 项目已配置使用 rustls-tls，如果仍有问题，清理并重新构建
   yarn clean:all
   yarn dev:android:safe
   ```

2. **备选方案：配置 OpenSSL 环境变量**

   ```bash
   # macOS (使用 Homebrew)
   brew install openssl
   export OPENSSL_DIR=/opt/homebrew/opt/openssl
   export OPENSSL_LIB_DIR=/opt/homebrew/opt/openssl/lib
   export OPENSSL_INCLUDE_DIR=/opt/homebrew/opt/openssl/include

   # 或者添加到 ~/.zshrc 或 ~/.bash_profile
   echo 'export OPENSSL_DIR=/opt/homebrew/opt/openssl' >> ~/.zshrc
   ```

3. **使用 vendored OpenSSL** 在 `src-tauri/Cargo.toml` 中添加：
   ```toml
   [dependencies]
   openssl = { version = "0.10", features = ["vendored"] }
   ```

**预防措施：**

- 项目已配置 `reqwest` 使用 `rustls-tls` 特性，避免 OpenSSL 依赖
- 定期运行 `yarn check:env` 检查环境配置

### 问题 2: "No available Android Emulator detected"

**症状：** 运行 `npm run dev:android` 时提示没有可用的模拟器

**解决方案：**

1. **检查模拟器状态：**

   ```bash
   npm run emulator:status
   ```

2. **启动模拟器：**

   ```bash
   # 自动启动最佳模拟器
   npm run emulator:start

   # 或交互式选择模拟器
   npm run emulator:interactive
   ```

3. **创建新的 AVD（如果没有）：**
   - 打开 Android Studio
   - 进入 Tools → AVD Manager
   - 点击 "Create Virtual Device"
   - 选择设备型号（推荐 Pixel 系列）
   - 选择系统镜像（推荐 API 30+）
   - 完成创建

4. **使用安全启动命令：**
   ```bash
   npm run dev:android:safe
   ```

### 问题 2: "Failed to run cargo build" (错误代码 101)

**症状：** Rust 编译失败，特别是 `aarch64-linux-android` 目标

**解决方案：**

1. **检查 Rust Android 目标：**

   ```bash
   rustup target list --installed | grep android
   ```

2. **安装缺失的目标：**

   ```bash
   rustup target add aarch64-linux-android
   rustup target add armv7-linux-androideabi
   rustup target add i686-linux-android
   rustup target add x86_64-linux-android
   ```

3. **检查 Android NDK：**

   ```bash
   echo $ANDROID_HOME
   ls $ANDROID_HOME/ndk
   ```

4. **重新安装 NDK（如果需要）：**
   - 打开 Android Studio
   - 进入 SDK Manager
   - 在 SDK Tools 标签页中安装 NDK

5. **设置环境变量：**
   ```bash
   # 添加到 ~/.bashrc 或 ~/.zshrc
   export ANDROID_HOME="$HOME/Library/Android/sdk"  # macOS
   export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/[版本号]"
   export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools"
   ```

### 问题 3: "ANDROID_HOME not set"

**症状：** 环境变量未正确设置

**解决方案：**

1. **查找 Android SDK 路径：**

   ```bash
   # macOS 默认路径
   ls ~/Library/Android/sdk

   # 或在 Android Studio 中查看
   # File → Project Structure → SDK Location
   ```

2. **设置环境变量：**

   ```bash
   # 临时设置
   export ANDROID_HOME="$HOME/Library/Android/sdk"

   # 永久设置（添加到 shell 配置文件）
   echo 'export ANDROID_HOME="$HOME/Library/Android/sdk"' >> ~/.zshrc
   echo 'export PATH="$PATH:$ANDROID_HOME/platform-tools"' >> ~/.zshrc
   source ~/.zshrc
   ```

## 🍎 iOS 开发问题

### 问题 1: "xcodebuild not found"

**症状：** 缺少 Xcode 或 Command Line Tools

**解决方案：**

1. **安装 Xcode：**
   - 从 App Store 安装 Xcode
   - 或下载 Xcode Command Line Tools

2. **安装 Command Line Tools：**

   ```bash
   xcode-select --install
   ```

3. **验证安装：**
   ```bash
   xcodebuild -version
   xcrun --show-sdk-path
   ```

### 问题 2: iOS 模拟器问题

**症状：** 无法启动或找不到 iOS 模拟器

**解决方案：**

1. **列出可用模拟器：**

   ```bash
   xcrun simctl list devices
   ```

2. **启动特定模拟器：**

   ```bash
   xcrun simctl boot "iPhone 14"
   open -a Simulator
   ```

3. **重置模拟器（如果有问题）：**
   ```bash
   xcrun simctl erase all
   ```

## 🦀 Rust 相关问题

### 问题 1: "rustc not found"

**症状：** Rust 未安装或未正确配置

**解决方案：**

1. **安装 Rust：**

   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   ```

2. **更新 Rust：**

   ```bash
   rustup update
   ```

3. **验证安装：**
   ```bash
   rustc --version
   cargo --version
   ```

### 问题 2: Tauri CLI 问题

**症状：** `tauri` 命令不可用

**解决方案：**

1. **安装 Tauri CLI：**

   ```bash
   cargo install tauri-cli
   ```

2. **更新 Tauri CLI：**

   ```bash
   cargo install tauri-cli --force
   ```

3. **检查版本：**
   ```bash
   tauri --version
   ```

## 🌐 前端开发问题

### 问题 1: Node.js 版本问题

**症状：** 构建失败或依赖安装问题

**解决方案：**

1. **检查 Node.js 版本：**

   ```bash
   node --version
   npm --version
   ```

2. **升级 Node.js（推荐使用 nvm）：**

   ```bash
   # 安装 nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

   # 安装最新 LTS 版本
   nvm install --lts
   nvm use --lts
   ```

3. **清理依赖缓存：**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

### 问题 2: Vite 开发服务器问题

**症状：** 前端开发服务器无法启动

**解决方案：**

1. **检查端口占用：**

   ```bash
   lsof -i :1420
   ```

2. **使用不同端口：**

   ```bash
   npm run dev -- --port 3000
   ```

3. **清理构建缓存：**
   ```bash
   npm run clean
   npm install
   ```

## 🔨 构建和打包问题

### 问题 1: 跨平台构建失败

**症状：** 为其他平台构建时出错

**解决方案：**

1. **检查目标平台支持：**

   ```bash
   rustup target list --installed
   ```

2. **安装目标平台：**

   ```bash
   # Linux
   rustup target add x86_64-unknown-linux-gnu
   rustup target add aarch64-unknown-linux-gnu

   # Windows
   rustup target add x86_64-pc-windows-msvc
   rustup target add aarch64-pc-windows-msvc
   ```

3. **使用 Docker 进行跨平台构建：**
   ```bash
   # 参考 Docker 构建指南
   docker build -t tauri-builder .
   ```

### 问题 2: 代码签名问题

**症状：** 应用无法正确签名或分发

**解决方案：**

1. **检查签名配置：**
   - 查看 `src-tauri/tauri.conf.json` 中的签名设置
   - 确保证书和密钥文件存在

2. **重新生成签名证书：**
   ```bash
   # Android
   keytool -genkey -v -keystore release-key.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
   ```

## 🐛 调试技巧

### 1. 启用详细日志

```bash
# 设置环境变量启用详细日志
export RUST_LOG=debug
export TAURI_DEBUG=true

# 运行命令
npm run dev:android
```

### 2. 检查系统要求

运行完整的环境检查：

```bash
npm run check:env
```

### 3. 清理和重置

```bash
# 清理所有构建产物
npm run clean

# 重新安装依赖
rm -rf node_modules
npm install

# 重新初始化移动端项目
npm run init:android
npm run init:ios
```

### 4. 查看详细错误信息

```bash
# 使用 --verbose 标志获取详细输出
tauri android dev --verbose
tauri ios dev --verbose
```

## 📞 获取帮助

如果以上解决方案都无法解决您的问题，请：

1. **查看官方文档：**
   - [Tauri 官方文档](https://tauri.app/)
   - [Tauri Mobile 指南](https://tauri.app/v1/guides/building/mobile/)

2. **检查 GitHub Issues：**
   - [Tauri GitHub](https://github.com/tauri-apps/tauri/issues)
   - 搜索相关问题或创建新的 issue

3. **社区支持：**
   - [Tauri Discord](https://discord.gg/tauri)
   - [Reddit r/tauri](https://reddit.com/r/tauri)

4. **生成环境报告：**
   ```bash
   npm run check:env
   # 查看生成的 env-check-report.json 文件
   ```

## 📋 常用命令速查

```bash
# 环境检查
npm run check:env
npm run check:env:fix

# 模拟器管理
npm run emulator:status
npm run emulator:start
npm run emulator:stop

# 安全开发
npm run dev:android:safe
npm run setup:android

# 清理和重置
npm run clean
npm run clean:dist

# 构建
npm run build:desktop
npm run build:mobile
npm run build:all
```

---

**提示：** 遇到问题时，首先运行 `npm run check:env`
进行自动诊断，这能解决大部分常见的环境配置问题。
