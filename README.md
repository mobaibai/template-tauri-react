# Template Tauri React

一个基于 Tauri + React + TypeScript + Vite 的现代化跨平台桌面应用模板。

[English](docs/README.en.md) | 中文

## 📋 项目概述

这是一个功能完整的 **Tauri + React + TypeScript**
桌面应用模板，集成了丰富的功能组件、动画效果、系统信息获取、网络请求、3D模型展示等特性。项目采用现代化的前后端分离架构，为桌面应用开发提供了完整的解决方案。

### 🏗️ 技术架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React 前端    │───►│   Tauri 桥接    │───►│   Rust 后端     │
│                 │    │                 │    │                 │
│ • UI 组件       │    │ • 命令路由      │    │ • 系统 API      │
│ • 状态管理      │    │ • 事件分发      │    │ • 文件操作      │
│ • 路由导航      │    │ • 类型转换      │    │ • 网络请求      │
│ • 动画效果      │    │ • 安全验证      │    │ • 业务逻辑      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### ✨ 核心特性

- 🚀 **现代化技术栈**：React 18 + TypeScript + Vite + Tauri 2.0
- 🎨 **UI 框架**：Ant Design + UnoCSS 原子化CSS + SCSS
- 🔧 **开发工具**：ESLint + Prettier + VS Code 配置
- 📊 **状态管理**：Zustand + SWR 数据获取
- 🎭 **动画系统**：自定义动画组件 + CSS3 动画
- 🌐 **网络请求**：封装的 HTTP 客户端 + Tauri IPC 通信
- 🖥️ **系统信息**：实时系统监控 + 硬件信息获取
- 🎮 **3D 渲染**：Three.js 模型展示支持
- 🔒 **类型安全**：完整的 TypeScript 支持
- ⚡ **高性能**：Rust 后端 + 原生系统调用
- 🤖 **CI/CD 自动化**：GitHub Actions 自动构建和发布

### 🎬 界面功能

- **首页展示**: 项目介绍和功能导航
- **组件库**: 丰富的 UI 组件展示
- **动画系统**: 流畅的交互动画和过渡效果
- **网络功能**: HTTP 请求和 API 调用示例
- **3D 模型**: 3D 模型加载和展示
- **系统监控**: 实时系统信息获取和展示
- **文件操作**: 安全的文件读写功能
- **主题切换**: 支持亮色/暗色主题

### 🛠️ 开发特性

- **类型安全**: 完整的 TypeScript 支持
- **热重载**: 开发时快速刷新
- **代码规范**: ESLint + Prettier 自动格式化
- **Git 钩子**: 提交前自动检查和格式化
- **模块化**: 清晰的项目结构和组件划分
- **错误处理**: 统一的错误处理机制
- **性能优化**: 代码分割和懒加载

## 🎯 支持平台

- **桌面平台**：Windows (x64/ARM64)、macOS (Intel/Apple Silicon)、Linux
  (x64/ARM64)
- **移动平台**：iOS、Android

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **Rust**: >= 1.70.0
- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

### 安装步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd template-tauri-react

# 2. 安装依赖
npm install

# 3. 检查环境
npm run check:env

# 4. 启动开发服务器
npm run dev:tauri
```

### 常用命令

```bash
# 开发
npm run dev:tauri        # 启动 Tauri 开发模式
npm run dev:ios          # iOS 开发模式
npm run dev:android      # Android 开发模式

# 构建
npm run build:tauri      # 构建桌面应用
npm run build:ios        # 构建 iOS 应用
npm run build:android    # 构建 Android 应用

# 本地构建
npm run build:tauri      # 当前系统桌面应用

# 注意：PC端跨平台构建已由GitHub Actions自动处理

# 代码质量
npm run lint             # ESLint 检查
npm run format           # Prettier 格式化
npm run type-check       # TypeScript 类型检查

# CI/CD (GitHub Actions)
# 推送标签自动构建和发布
git tag v0.0.1 && git push origin v0.0.1
```

## 📁 项目结构

```
template-tauri-react/
├── src-tauri/           # Tauri 后端（Rust）
│   ├── src/             # Rust 源码
│   ├── capabilities/    # 权限配置
│   ├── icons/           # 应用图标
│   └── tauri.conf.json  # Tauri 配置
├── src/                 # React 前端
│   ├── components/      # 可复用组件
│   ├── pages/           # 页面组件
│   ├── hooks/           # 自定义 Hooks
│   ├── stores/          # 状态管理
│   ├── router/          # 路由配置
│   └── assets/          # 静态资源
├── docs/                # 项目文档
├── scripts/             # 构建脚本
└── dist-builds/         # 构建产物
```

## 🎯 功能特性

- **🏠 首页功能**：实时系统监控、计数器演示、动画效果
- **🧩 功能组件**：跟随导航、全局弹窗、图标展示、路由过渡
- **🎭 动画系统**：透明度动画、缩放动画、自定义动画、过渡效果
- **🌐 网络请求**：HTTP客户端、IPC通信、SWR集成、错误处理
- **🎮 3D模型展示**：Three.js集成、GLB/GLTF支持、HDR环境贴图
- **🖥️ 系统功能**：系统信息、网络信息、硬盘信息、文件操作、窗口管理
- **🤖 CI/CD 自动化**：GitHub Actions 多平台自动构建、测试和发布

## 🚀 CI/CD 自动化

本项目配置了完整的 GitHub Actions CI/CD 工作流，支持：

### 🔄 自动化流程

- ✅ **自动测试**：ESLint 检查、TypeScript 类型检查
- 🏗️ **自动化构建**：GitHub Actions处理跨平台构建和发布
- 📦 **自动发布**：GitHub Releases 创建和构建产物上传
- 🧹 **资源清理**：自动清理临时文件，节省存储空间

> **⚠️ 重要说明**：当前 GitHub
> Actions 工作流仅支持桌面平台（macOS、Windows、Linux）的自动构建和发布。如需构建 iOS 和 Android 应用，请参考相关文档进行本地化配置。

### 🎯 使用方法

**自动发布** (推荐):

```bash
# 创建版本标签并推送
git tag v0.0.1
git push origin v0.0.1
# 工作流自动运行，构建所有平台并发布
```

**手动触发**:

1. 访问 GitHub Actions 页面
2. 选择 "Build and Release" 工作流
3. 点击 "Run workflow" 并配置选项
4. 选择构建目标和发布类型

详细说明请查看 [GitHub Actions 使用指南](docs/GITHUB_ACTIONS.md)

## 📚 文档

### 核心文档

- [环境配置指南](docs/ENVIRONMENT_SETUP.md) - 详细的环境配置说明
- [开发指南](docs/DEVELOPMENT_GUIDE.md) - 开发流程、API参考和故障排除
- [构建部署指南](docs/BUILD_DEPLOYMENT.md) - 本地构建、CI/CD和移动端部署

### 英文文档

- [English README](docs/README.en.md) - English version of main documentation
- [Environment Setup (EN)](docs/ENVIRONMENT_SETUP.en.md) - Environment configuration guide
- [Development Guide (EN)](docs/DEVELOPMENT_GUIDE.en.md) - Development workflow and best practices
- [Build & Deployment (EN)](docs/BUILD_DEPLOYMENT.en.md) - Local build and deployment guide

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！请查看 [贡献指南](docs/CONTRIBUTING.md)
了解详细信息。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详细信息。

## 🔗 相关链接

- [Tauri 官方文档](https://tauri.app/)
- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)

---

**如果这个模板对您有帮助，请给个 ⭐ Star！**
