# 环境配置指南

本文档详细说明了如何配置 Tauri + React 开发环境，包括所有支持平台的配置步骤。

## 📋 目录

- [基础环境要求](#基础环境要求)
- [桌面平台配置](#桌面平台配置)
- [移动平台配置](#移动平台配置)
- [跨平台构建配置](#跨平台构建配置)
- [开发工具配置](#开发工具配置)
- [环境验证](#环境验证)
- [常见问题](#常见问题)

## 基础环境要求

### 先决条件

在开始之前，请确保您的系统满足 Tauri 的基本要求：

- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **内存**: 至少 4GB RAM（推荐 8GB+）
- **存储空间**: 至少 10GB 可用空间
- **网络**: 稳定的互联网连接（用于下载依赖）

### Node.js 环境

1. **安装 Node.js**：
   - 访问 [Node.js 官网](https://nodejs.org/)
   - 下载并安装 LTS 版本（>= 18.0.0）

2. **验证安装**：

   ```bash
   node -v  # 应显示版本号 >= 18.0.0
   npm -v   # 应显示版本号
   ```

3. **配置 npm（可选）**：

   ```bash
   # 设置国内镜像（中国用户）
   npm config set registry https://registry.npmmirror.com/

   # 设置全局安装目录
   npm config set prefix "~/.npm-global"
   ```

### Rust 环境

1. **安装 Rust**：

   **macOS/Linux**：

   ```bash
   curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
   source ~/.cargo/env
   ```

   **Windows**：

   ```powershell
   # 使用 PowerShell 运行
   Invoke-WebRequest -Uri "https://win.rustup.rs/" -OutFile "rustup-init.exe"
   .\rustup-init.exe
   ```

2. **验证安装**：

   ```bash
   rustc --version  # 应显示版本号 >= 1.70.0
   cargo --version  # 应显示版本号
   ```

3. **配置 Rust（可选）**：
   ```bash
   # 设置国内镜像（中国用户）
   echo '[source.crates-io]' >> ~/.cargo/config.toml
   echo 'replace-with = "ustc"' >> ~/.cargo/config.toml
   echo '[source.ustc]' >> ~/.cargo/config.toml
   echo 'registry = "https://mirrors.ustc.edu.cn/crates.io-index"' >> ~/.cargo/config.toml
   ```

## 桌面平台配置

### macOS 配置

1. **安装 Xcode Command Line Tools**：

   ```bash
   xcode-select --install
   ```

2. **添加构建目标**：

   ```bash
   # Intel Mac
   rustup target add x86_64-apple-darwin

   # Apple Silicon Mac
   rustup target add aarch64-apple-darwin
   ```

3. **安装额外工具**（可选）：

   ```bash
   # 安装 Homebrew
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   # 安装 NSIS（用于 Windows 跨平台构建）
   brew install makensis
   ```

### Windows 配置

1. **安装 Microsoft C++ Build Tools**：
   - 下载并安装
     [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - 在安装过程中选择 "Desktop development with C++"
   - 或者安装完整的 Visual Studio Community

2. **安装 WebView2**：
   - 访问
     [WebView2 Runtime 下载页面](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
   - 下载并安装 "Evergreen Bootstrapper"

3. **添加构建目标**：

   ```bash
   # Windows x64
   rustup target add x86_64-pc-windows-msvc

   # Windows ARM64
   rustup target add aarch64-pc-windows-msvc
   ```

4. **配置环境变量**：
   ```powershell
   # 添加到系统 PATH（如果需要）
   $env:PATH += ";C:\Program Files\Microsoft Visual Studio\2022\BuildTools\MSBuild\Current\Bin"
   ```

### Linux 配置

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.0-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

#### Fedora/CentOS/RHEL

```bash
sudo dnf install -y \
  webkit2gtk4.0-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel
```

#### Arch Linux

```bash
sudo pacman -S \
  webkit2gtk \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  appmenu-gtk-module \
  gtk3 \
  libappindicator-gtk3 \
  librsvg
```

## 移动平台配置

### iOS 配置

**系统要求**：

- macOS 10.15+ （仅支持在 macOS 上开发）
- Xcode 12.0+
- iOS 13.0+ （目标设备）

**安装步骤**：

1. **安装 Xcode**：

   ```bash
   # 从 App Store 安装 Xcode
   # 或使用命令行工具
   xcode-select --install
   ```

2. **安装 iOS 目标**：

   ```bash
   rustup target add aarch64-apple-ios
   rustup target add x86_64-apple-ios          # Intel 模拟器
   rustup target add aarch64-apple-ios-sim     # Apple Silicon 模拟器
   ```

3. **验证配置**：

   ```bash
   # 检查 Xcode 版本
   xcodebuild -version

   # 列出可用的模拟器
   xcrun simctl list devices
   ```

### Android 配置

**系统要求**：

- Android Studio 或 Android SDK
- Android NDK
- Java 11+

**安装步骤**：

1. **安装 Java**：

   **macOS**：

   ```bash
   brew install openjdk@11
   echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc
   ```

   **Windows**：
   - 下载并安装 [OpenJDK 11](https://adoptium.net/)

   **Linux**：

   ```bash
   sudo apt install openjdk-11-jdk  # Ubuntu/Debian
   sudo dnf install java-11-openjdk-devel  # Fedora
   ```

2. **安装 Android Studio**：
   - 下载并安装 [Android Studio](https://developer.android.com/studio)
   - 安装 Android SDK 和 NDK

3. **设置环境变量**：

   **macOS/Linux**：

   ```bash
   # 添加到 ~/.bashrc 或 ~/.zshrc
   export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
   export ANDROID_HOME=$HOME/Android/Sdk          # Linux
   export NDK_HOME=$ANDROID_HOME/ndk/[version]
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

   **Windows**：

   ```powershell
   # 添加到系统环境变量
   $env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
   $env:NDK_HOME = "$env:ANDROID_HOME\ndk\[version]"
   $env:PATH += ";$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\platform-tools"
   ```

4. **安装 Android 目标**：

   ```bash
   rustup target add aarch64-linux-android
   rustup target add armv7-linux-androideabi
   rustup target add i686-linux-android
   rustup target add x86_64-linux-android
   ```

5. **验证配置**：

   ```bash
   # 检查 Android SDK
   sdkmanager --list

   # 检查模拟器
   emulator -list-avds

   # 检查连接的设备
   adb devices
   ```

## 跨平台构建配置

### 在 macOS/Linux 上构建 Windows 应用

1. **安装 cargo-xwin**：

   ```bash
   cargo install --locked cargo-xwin
   ```

2. **安装 NSIS**（用于创建安装包）：

   **macOS**：

   ```bash
   brew install makensis
   ```

   **Linux**：

   ```bash
   sudo apt install nsis  # Ubuntu/Debian
   sudo dnf install nsis  # Fedora
   ```

3. **添加 Windows 目标**：
   ```bash
   rustup target add x86_64-pc-windows-msvc
   rustup target add aarch64-pc-windows-msvc
   ```

### 在 Windows 上构建其他平台

**注意**：Windows 用户无法直接构建 macOS 应用，需要 macOS 系统和 Xcode。

## 开发工具配置

### VS Code 配置

1. **安装推荐扩展**：
   - Tauri
   - rust-analyzer
   - ES7+ React/Redux/React-Native snippets
   - TypeScript Importer
   - Prettier - Code formatter
   - ESLint

2. **配置文件**（项目已包含）：
   - `.vscode/settings.json`
   - `.vscode/extensions.json`
   - `.vscode/launch.json`

### Git 配置

```bash
# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 配置行尾符（Windows 用户）
git config --global core.autocrlf true

# 配置行尾符（macOS/Linux 用户）
git config --global core.autocrlf input
```

## 环境验证

### 自动检查

项目提供了自动化的环境检查工具：

```bash
# 检查开发环境
npm run check:env

# 自动修复发现的问题
npm run check:env:fix

# 设置完整的 Android 开发环境
npm run setup:android
```

### 手动验证

1. **基础环境**：

   ```bash
   node --version    # >= 18.0.0
   npm --version     # 任意版本
   rustc --version   # >= 1.70.0
   cargo --version   # 任意版本
   ```

2. **桌面平台**：

   ```bash
   # macOS
   xcode-select -p

   # Windows
   where cl.exe

   # Linux
   pkg-config --exists webkit2gtk-4.0
   ```

3. **移动平台**：

   ```bash
   # iOS
   xcodebuild -version
   xcrun simctl list devices

   # Android
   java -version
   echo $ANDROID_HOME
   adb version
   ```

4. **构建测试**：

   ```bash
   # 测试桌面构建
   npm run build:tauri

   # 测试移动构建（如果已配置）
   npm run build:ios     # 仅 macOS
   npm run build:android
   ```

## 常见问题

### 权限问题

**macOS**：

```bash
# 如果遇到权限问题
sudo xcode-select --reset
sudo xcodebuild -license accept
```

**Linux**：

```bash
# 如果遇到权限问题
sudo chown -R $USER:$USER ~/.cargo
sudo chown -R $USER:$USER ~/.rustup
```

### 网络问题

**使用代理**：

```bash
# npm 代理
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Rust 代理
export HTTPS_PROXY=http://proxy.company.com:8080
export HTTP_PROXY=http://proxy.company.com:8080
```

**使用镜像**：

```bash
# npm 镜像
npm config set registry https://registry.npmmirror.com/

# Rust 镜像
echo '[source.crates-io]' >> ~/.cargo/config.toml
echo 'replace-with = "ustc"' >> ~/.cargo/config.toml
echo '[source.ustc]' >> ~/.cargo/config.toml
echo 'registry = "https://mirrors.ustc.edu.cn/crates.io-index"' >> ~/.cargo/config.toml
```

### 版本冲突

```bash
# 更新 Rust 工具链
rustup update

# 更新 Node.js（使用 nvm）
nvm install --lts
nvm use --lts

# 清理缓存
npm cache clean --force
cargo clean
```

### 磁盘空间

```bash
# 清理 npm 缓存
npm cache clean --force

# 清理 Rust 缓存
cargo clean
rustup toolchain list
rustup toolchain uninstall <unused-toolchain>

# 清理构建缓存
npm run clean:build-cache
```

## 相关链接

- [Tauri 先决条件文档](https://tauri.app/start/prerequisites/)
- [Rust 安装指南](https://www.rust-lang.org/tools/install)
- [Node.js 下载](https://nodejs.org/)
- [Android 开发者文档](https://developer.android.com/studio/install)
- [iOS 开发者文档](https://developer.apple.com/xcode/)

---

如果在环境配置过程中遇到问题，请查看 [故障排除指南](TROUBLESHOOTING.md)
或提交 Issue。
