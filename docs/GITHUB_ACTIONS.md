# GitHub Actions CI/CD 工作流使用指南

本项目已配置完整的 GitHub Actions
CI/CD 工作流，支持自动构建、测试和发布多平台应用。

## 🚀 功能特性

### 自动化流程

- ✅ **前端测试**: 自动运行 ESLint 和 TypeScript 类型检查
- 🏗️ **多平台构建**: 支持 macOS、Windows、Linux、iOS、Android
- 📦 **自动发布**: 自动创建 GitHub Releases 并上传构建产物
- 🧹 **资源清理**: 自动清理工作流产物，节省存储空间

### 支持平台

#### 桌面平台

- **macOS**: Intel (x86_64) 和 Apple Silicon (ARM64)
- **Windows**: x86_64 和 ARM64
- **Linux**: x86_64 和 ARM64 (AppImage, DEB, RPM)

#### 移动平台

- **iOS**: 支持 iOS 13.0+
- **Android**: 支持 Android 7.0+ (API 24)

## 前置要求

- **Node.js**: 版本 22.17.0 (通过 `.nvmrc` 文件统一管理)
- **pnpm**: 版本 10 或更高 (推荐使用最新版本)
- **Rust**: 最新稳定版本
- **项目根目录必须包含 `pnpm-lock.yaml` 文件**
- **项目根目录必须包含 `.nvmrc` 文件指定 Node.js 版本**

### Node.js 版本管理

本项目使用 `.nvmrc`
文件统一管理 Node.js 版本（当前为 22.17.0），确保本地开发环境与 CI/CD 环境的一致性：

- **本地开发**: 使用 `nvm use` 或 `fnm use` 自动切换到指定版本
- **GitHub Actions**: 通过 `node-version-file: '.nvmrc'` 自动读取版本
- **版本一致性**: 避免因 Node.js 版本差异导致的构建问题

## 🔧 工作流配置

### 触发条件

工作流在以下情况下自动触发：

1. **推送到主分支**: `push` 到 `main` 或 `master` 分支
2. **Pull Request**: 针对主分支的 PR
3. **标签推送**: 推送以 `v` 开头的标签 (如 `v1.0.0`)
4. **手动触发**: 通过 GitHub 界面手动运行

### 手动触发选项

通过 GitHub 界面手动触发时，可以选择：

- **构建目标**:
  - `desktop`: 仅构建桌面版本
  - `mobile`: 仅构建移动版本
  - `all`: 构建所有平台

- **发布类型**:
  - `release`: 正式发布
  - `prerelease`: 预发布版本
  - `draft`: 草稿发布

## 📋 工作流步骤

### 1. 前端测试 (`frontend-test`)

```yaml
- 设置 Node.js 环境
- 安装 pnpm (>=10.0.0)
- 安装 Node.js 依赖
- 运行 ESLint 检查
- 运行 TypeScript 类型检查
- 构建前端项目
- 上传前端构建产物
```

### 2. 桌面平台构建

#### macOS 构建 (`build-macos`)

```yaml
- 支持 x86_64 和 aarch64 架构
- 自动配置 Rust 工具链
- 生成 .dmg 安装包
- 上传构建产物
```

#### Windows 构建 (`build-windows`)

```yaml
- 支持 x86_64 和 aarch64 架构
- 自动配置 Rust 工具链
- 生成 .exe 安装程序
- 上传构建产物
```

#### Linux 构建 (`build-linux`)

```yaml
- 支持 x86_64 和 aarch64 架构
- 配置交叉编译环境
- 生成 AppImage、DEB、RPM 包
- 上传构建产物
```

### 3. 移动平台构建

#### iOS 构建 (`build-ios`)

```yaml
- 配置 Xcode 环境
- 初始化 iOS 项目
- 构建 iOS 应用
- 上传构建产物
```

#### Android 构建 (`build-android`)

```yaml
- 配置 Android SDK 和 NDK
- 初始化 Android 项目
- 构建 APK 文件
- 上传构建产物
```

### 4. 发布流程

#### 创建 Release (`create-release`)

```yaml
- 自动生成版本号
- 创建 GitHub Release
- 生成详细的发布说明
- 支持草稿和预发布
```

#### 上传构建产物 (`upload-release-assets`)

```yaml
- 下载所有构建产物
- 重命名文件以标识平台
- 上传到 GitHub Release
- 支持多种文件格式
```

## 🛠️ 使用方法

### 自动发布 (推荐)

1. **创建标签并推送**:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **工作流自动运行**:
   - 自动构建所有平台
   - 创建 GitHub Release
   - 上传所有构建产物

### 手动触发

1. **访问 GitHub Actions 页面**:

   ```
   https://github.com/your-username/your-repo/actions
   ```

2. **选择 "Build and Release" 工作流**

3. **点击 "Run workflow"**

4. **配置选项**:
   - 选择分支
   - 选择构建目标
   - 选择发布类型

5. **点击 "Run workflow" 开始构建**

### 仅测试构建

推送代码到主分支或创建 Pull Request 时，工作流会：

- 运行前端测试
- 构建桌面版本 (不发布)
- 验证代码质量

## 📦 构建产物

### 文件命名规则

构建产物会按照以下规则命名：

```
{应用名}-{版本号}-{平台标识}.{扩展名}
```

示例：

- `template-tauri-react-1.0.0-macOS-Intel.dmg`
- `template-tauri-react-1.0.0-Windows-x64.exe`
- `template-tauri-react-1.0.0-Linux-x64.AppImage`
- `iOS-template-tauri-react-1.0.0.ipa`
- `Android-template-tauri-react-1.0.0.apk`

### 下载位置

构建完成后，可以在以下位置下载：

1. **GitHub Releases**: 正式发布的版本
2. **Actions Artifacts**: 测试构建的临时文件 (3天后自动删除)

## 🔒 安全配置

### 必需的 Secrets

工作流使用以下 GitHub Secrets：

- `GITHUB_TOKEN`: 自动提供，用于创建 Release 和上传文件

### 可选的 Secrets

如果需要代码签名或特殊配置，可以添加：

- `APPLE_CERTIFICATE`: macOS 应用签名证书
- `APPLE_CERTIFICATE_PASSWORD`: 证书密码
- `ANDROID_KEYSTORE`: Android 应用签名密钥
- `ANDROID_KEYSTORE_PASSWORD`: 密钥密码

## 🐛 故障排除

### 常见问题

1. **构建失败**:
   - 检查 Node.js 版本是否与 `.nvmrc` 文件一致
   - 检查 pnpm 依赖是否正确安装
   - 确保使用 `pnpm-lock.yaml` 而不是 `package-lock.json`
   - 查看构建日志中的错误信息
   - 确保 `package.json` 中的脚本命令正确

2. **发布失败**:
   - 检查是否有足够的权限
   - 确保标签格式正确 (以 `v` 开头)
   - 检查 `GITHUB_TOKEN` 权限

3. **移动端构建失败**:
   - 确保已正确配置移动端环境
   - 检查 SDK 和 NDK 版本
   - 验证项目配置文件

### 调试技巧

1. **查看详细日志**:
   - 在 Actions 页面点击具体的工作流运行
   - 展开失败的步骤查看详细错误

2. **本地测试**:

   ```bash
   # 测试前端构建
   pnpm run build

   # 测试桌面构建
   pnpm run build:desktop

   # 测试特定平台
   pnpm run build:mac-x86
   ```

3. **检查配置**: - 验证 `build.config.js` 配置
   - 检查 `tauri.conf.json` 设置
   - 确认 `package.json` 脚本

## 📚 相关文档

- [构建部署指南](BUILD_DEPLOYMENT.md)
- [环境配置指南](ENVIRONMENT_SETUP.md)
- [故障排除指南](TROUBLESHOOTING.md)
- [前端构建优化](frontend-build-optimization.md)

## 🤝 贡献

如果您发现工作流配置有问题或有改进建议，欢迎：

1. 提交 Issue 报告问题
2. 创建 Pull Request 提供修复
3. 参与讨论改进方案

---

**注意**: 首次使用时，建议先在测试分支上验证工作流配置，确保一切正常后再用于生产环境。
