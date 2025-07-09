# Changelog

本文档记录了项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 改进
- **Node.js 版本升级**: 将 Node.js 版本从 20.18.0 升级到 22.17.0
- **配置同步更新**: 更新 `.nvmrc`、`package.json` engines 配置
- **文档同步**: 更新中英文版 GitHub Actions 指南中的 Node.js 版本信息
- **Node.js 版本管理**: 统一使用 `.nvmrc` 文件管理 Node.js 版本
- **GitHub Actions 配置**: 更新所有构建作业使用 `node-version-file: '.nvmrc'`
- **开发工具**: 新增 `check-node-version.js` 脚本和 `check:versions` 命令用于版本一致性检查

### 新增
- 完整的 GitHub Actions CI/CD 工作流
- 多平台自动构建支持 (macOS, Windows, Linux, iOS, Android)
- 自动发布到 GitHub Releases
- 前端构建优化和重复构建问题修复

### 修复
- 修复前端重复构建问题
- 优化构建脚本日志输出
- 改进错误处理和边界处理

### 变更
- 移除 `tauri.conf.json` 中的 `beforeBuildCommand` 配置
- 简化构建流程，提升构建效率

## [1.2.0] - 2024-12-XX

### ✨ Added
- **Node.js 版本管理**: 新增 `.nvmrc` 文件统一管理 Node.js 版本
  - 确保本地开发环境与 CI/CD 环境的版本一致性
  - GitHub Actions 自动读取 `.nvmrc` 文件中的 Node.js 版本
  - 避免因版本差异导致的构建问题

### 🔄 Changed
- **Node.js 版本**: 从 18.x 升级到 20.18.0
- **GitHub Actions**: 所有构建作业使用 `node-version-file: '.nvmrc'` 参数
- **package.json**: 更新 engines 配置，指定精确的 Node.js 版本要求

### 📚 Documentation
- **GitHub Actions 指南**: 新增 Node.js 版本管理说明
- **环境要求**: 更新 Node.js 版本要求和 `.nvmrc` 文件说明
- **故障排除**: 新增 Node.js 版本一致性检查步骤

## [1.1.0] - 2024-12-XX

### 🔄 Changed
- **GitHub Actions**: 将包管理器从 npm 迁移到 pnpm (>=10.0.0)
  - 更快的依赖安装速度
  - 优化的缓存机制
  - 更好的包管理器配置

### 📚 Documentation
- **GitHub Actions 使用指南**: 更新为 pnpm 配置说明
- **pnpm 配置**: 新增 pnpm 相关的环境要求和使用说明
- **故障排除指南**: 更新 pnpm 相关的问题解决方案

## [1.1.0] - 2024-01-21

### ✨ 新增功能
- 📦 GitHub Actions 工作流迁移到 pnpm (>=10.0.0)
- ⚡ 更快的依赖安装和缓存机制
- 🔧 优化的包管理器配置

### 🔄 变更内容
- 将所有 GitHub Actions 工作流从 npm 迁移到 pnpm
- 更新依赖管理策略，使用 `pnpm-lock.yaml` 替代 `package-lock.json`
- 优化构建性能和缓存效率

### 📚 文档更新
- 更新 GitHub Actions 使用指南 (中文/英文)
- 添加 pnpm 相关配置说明
- 更新故障排除指南

## [1.0.0] - 2024-01-20

### ✨ 新增功能
- 🚀 完整的 GitHub Actions CI/CD 工作流
- 🔄 多平台自动构建支持 (macOS, Windows, Linux, iOS, Android)
- 📦 自动发布到 GitHub Releases
- 🧹 前端构建优化和重复构建问题修复
- 📋 详细的构建产物命名和分类
- 🔧 手动触发工作流选项
- 📱 移动端构建支持 (iOS/Android)
- 🎯 智能构建条件判断
- 初始版本发布
- Tauri + React 项目模板
- 多平台构建支持
- 完整的开发环境配置
- 详细的文档和指南

### 功能特性
- 🚀 基于 Tauri 2.0 的现代桌面应用框架
- ⚛️ React 18 + TypeScript 支持
- 🎨 UnoCSS 原子化 CSS 框架
- 📱 移动端支持 (iOS/Android)
- 🔧 完整的开发工具链
- 📦 多平台打包和分发
- 🛡️ 类型安全和安全性保障
- 🌍 国际化支持
- 🎯 性能优化和最佳实践

---

## 版本说明

- **主版本号**: 不兼容的 API 修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

## 贡献指南

如果您想为本项目贡献代码，请：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。