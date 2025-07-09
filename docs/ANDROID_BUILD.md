# Android 构建指南

本文档介绍如何构建和签名 Android APK 文件。

## 前置要求

1. **Android SDK**: 确保已安装 Android SDK
2. **Android NDK**: 确保已安装 Android NDK
3. **Java Development Kit (JDK)**: 确保已安装 JDK 8 或更高版本

## 环境配置

### 1. 设置环境变量

在你的 shell 配置文件中（如 `~/.bashrc`, `~/.zshrc`）添加以下环境变量：

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_NDK_ROOT="$ANDROID_HOME/ndk/26.1.10909125"
export PATH="$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt/darwin-x86_64/bin"
```

### 2. 验证环境

运行环境检查脚本：

```bash
npm run check:env
```

## 构建和签名步骤

### 自动化构建（推荐）

```bash
npm run build:android
```

此命令会自动完成以下步骤：

- 构建Android APK
- 自动进行调试签名
- 按照版本号和架构重命名文件
- 复制到 `dist-builds` 目录
- 清理构建缓存

### 手动签名（可选）

如果需要单独对已有APK进行签名：

```bash
npm run sign:android
```

这个命令会：

- 自动创建调试密钥库（如果不存在）
- 对 APK 进行签名
- 验证签名是否成功
- 生成已签名的 APK 文件：`app-universal-release-signed.apk`

## 文件位置

### 构建产物

- **最终APK**: `dist-builds/template-tauri-react_版本号_架构.apk`
- **最终AAB**: `dist-builds/template-tauri-react_版本号_架构.aab`
- **调试密钥库**: `debug.keystore` (项目根目录)

### 命名格式

构建产物会按照以下格式自动重命名：

- APK: `template-tauri-react_0.0.1_universal.apk`
- AAB: `template-tauri-react_0.0.1_universal.aab`

其中：

- `template-tauri-react`: 项目名称
- `0.0.1`: 从 package.json 读取的版本号
- `universal`: 根据构建目标自动识别的架构（universal/aarch64/x86_64）

### 构建目录结构

```
dist-builds/                    # 最终构建产物目录
├── template-tauri-react_0.0.1_universal.apk
├── template-tauri-react_0.0.1_universal.aab
└── ...

src-tauri/gen/android/         # 临时构建目录（会被清理）
├── app/build/outputs/
└── ...
```

## 安装到设备

### 1. 启用开发者选项

在 Android 设备上：

1. 进入 **设置** > **关于手机**
2. 连续点击 **版本号** 7 次启用开发者选项
3. 返回设置，进入 **开发者选项**
4. 启用 **USB 调试**

### 2. 允许未知来源安装

1. 进入 **设置** > **安全**
2. 启用 **未知来源** 或 **允许安装未知应用**

### 3. 安装 APK

方法一：通过 ADB 安装

```bash
adb install dist-builds/template-tauri-react_0.0.1_universal.apk
```

方法二：手动安装

1. 将 `dist-builds/template-tauri-react_0.0.1_universal.apk`
   文件传输到 Android 设备
2. 在设备上点击 APK 文件
3. 按照提示完成安装

## 故障排除

### 1. "无效安装包" 错误

这通常是因为 APK 未签名导致的。确保使用已签名的 APK 文件：

- 使用 `app-universal-release-signed.apk` 而不是
  `app-universal-release-unsigned.apk`
- 运行 `npm run sign:android` 确保 APK 已正确签名

### 2. NDK 工具链错误

如果遇到 NDK 相关错误：

1. 确保 `ANDROID_NDK_ROOT` 环境变量正确设置
2. 检查 NDK 版本是否兼容
3. 查看 `.cargo/config.toml` 中的工具链配置

### 3. 构建失败

如果构建失败：

1. 运行 `npm run clean:all` 清理所有缓存
2. 重新安装依赖：`npm install`
3. 检查环境配置：`npm run check:env`

## 新功能特性

### 自动化构建流程

- ✅ **自动签名**: 构建完成后自动进行调试签名
- ✅ **智能重命名**: 根据版本号和架构自动重命名文件
- ✅ **产物管理**: 自动复制到 `dist-builds` 统一目录
- ✅ **缓存清理**: 构建完成后自动清理临时文件和缓存
- ✅ **版本识别**: 自动从 `package.json` 读取版本号
- ✅ **架构识别**: 根据构建目标自动识别架构类型

### 构建优化

- 🚀 **并行构建**: 支持多架构并行构建
- 🧹 **缓存管理**: 自动清理Android构建缓存，避免磁盘空间浪费
- 📦 **统一输出**: 所有平台构建产物统一存放在 `dist-builds` 目录

## 注意事项

### 调试签名 vs 发布签名

- 当前使用的是**调试签名**，仅用于开发和测试
- 调试签名的APK不能发布到Google Play Store
- 生产环境需要使用正式的发布密钥进行签名

### 密钥库安全

- `debug.keystore` 是调试用密钥库，密码为 `android`
- 生产环境请使用安全的密钥库和强密码
- 不要将生产密钥库提交到版本控制系统

## 生产发布

⚠️ **重要提醒**: 本指南中的签名方法仅用于开发和测试。对于生产发布，你需要：

1. 创建发布密钥库
2. 使用发布密钥进行签名
3. 对 APK 进行对齐优化
4. 上传到 Google Play Store 或其他应用商店

## 相关脚本

- `npm run build:android` - 构建 Android APK
- `npm run sign:android` - 对 APK 进行调试签名
- `npm run check:env` - 检查开发环境配置
- `npm run dev:android` - 启动 Android 开发模式
