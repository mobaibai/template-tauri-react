# 构建缓存清理指南

## 概述

在进行 Tauri 跨平台构建时，会产生大量的缓存文件和构建产物。本项目提供了自动化的清理工具来帮助管理磁盘空间。

## 磁盘占用情况

根据我们的分析，主要的磁盘占用来源包括：

### Windows 交叉编译缓存

- **~/.xwin**: ~2.1GB (Windows SDK 和工具链)
- **.xwin-cache**: ~1.0GB (项目本地缓存)

### LLVM 工具链

- **/opt/homebrew/Cellar/llvm**: ~1.6GB
- **/opt/homebrew/Cellar/llvm@19**: ~1.8GB

### 项目构建产物

- **src-tauri/target**: 根据构建目标变化
- **dist-builds**: 最终的安装包文件

## 清理工具使用

### 快速清理

```bash
# 运行交互式清理工具
npm run clean:build-cache
```

### 清理选项说明

1. **仅清理项目本地缓存** - 清理 `.xwin-cache` 和 `target/` 目录
   - 安全选项，不影响其他项目
   - 释放空间相对较少

2. **清理所有 Windows SDK 缓存** - 清理 `~/.xwin` 目录
   - 会影响所有使用 cargo-xwin 的项目
   - 下次构建时需要重新下载 SDK

3. **清理构建产物** - 清理 `dist-builds/` 目录
   - 删除所有已生成的安装包
   - 需要重新构建才能获得安装包

4. **全部清理** - 清理上述所有内容（保留 LLVM 工具）
   - 最大化释放磁盘空间
   - 下次构建时间会较长

5. **显示 LLVM 工具占用情况** - 仅查看不清理
   - LLVM 工具被多个项目共享，通常不建议删除

## 建议的清理策略

### 日常开发

- 使用选项 1：仅清理项目本地缓存
- 定期使用选项 3：清理旧的构建产物

### 磁盘空间紧张时

- 使用选项 2：清理 Windows SDK 缓存（如果不经常进行 Windows 构建）
- 使用选项 4：全部清理（准备长时间不进行构建时）

### 不建议清理

- LLVM 工具链：被系统多个项目共享
- Node.js 依赖：使用 `npm run clean:deps` 单独处理

## 注意事项

1. **备份重要文件**：清理前确保重要的构建产物已备份
2. **网络环境**：清理 SDK 缓存后，下次构建需要重新下载（约 1-2GB）
3. **构建时间**：清理缓存后首次构建时间会显著增加
4. **并行项目**：清理全局缓存会影响其他 Tauri 项目

## 手动清理命令

如果需要手动清理特定内容：

```bash
# 清理项目本地缓存
rm -rf .xwin-cache
cd src-tauri && cargo clean

# 清理全局 Windows SDK 缓存
rm -rf ~/.xwin

# 清理构建产物
rm -rf dist-builds

# 清理前端构建缓存
npm run clean
```

## 相关命令

- `npm run clean` - 清理前端构建产物
- `npm run clean:dist` - 清理构建输出目录
- `npm run clean:deps` - 重新安装依赖
- `npm run clean:all` - 全面清理（包括 Rust 缓存）
