# 前端构建优化与边界处理

## 概述

为了优化构建流程，避免重复执行前端构建，我们在构建脚本中实现了智能的前端构建检测机制。

## 功能特性

### 1. 智能前端构建检测

- **存在检测**: 自动检测 `dist` 目录是否存在
- **完整性检测**: 验证 `dist` 目录是否包含必要文件（如 `index.html`）
- **缓存机制**: 避免重复检查和构建，提高构建效率

### 2. 边界处理场景

#### 场景1: dist目录存在且完整

```bash
# 输出示例
[FRONTEND] 前端构建产物已存在且完整，跳过前端构建
```

**处理**: 直接跳过前端构建，继续后续流程

#### 场景2: dist目录不存在

```bash
# 输出示例
[FRONTEND] 前端构建产物不存在或不完整，开始构建前端...
[FRONTEND] 执行命令: npm run build
✅ 前端构建完成
```

**处理**: 自动执行 `npm run build` 进行前端构建

#### 场景3: dist目录存在但不完整

```bash
# 当缺少关键文件如 index.html 时
[FRONTEND] 前端构建产物不存在或不完整，开始构建前端...
```

**处理**: 强制重新构建前端

#### 场景4: 构建过程中dist被意外删除

**监控机制**: `monitorFrontendBuild()` 函数会在每个平台构建前检查 `dist` 目录
**处理**: 如果检测到丢失，自动触发重新构建

#### 场景5: 构建环境问题

```bash
# 环境检查示例输出
[ENV] 构建环境检查:
  ✅ Node.js 版本: v22.17.0
  ✅ npm 可用
  ✅ package.json 存在
  ✅ node_modules 存在
  ✅ 项目目录可访问
```

**处理**: 在构建开始前自动检查环境，发现问题时提供修复建议

#### 场景6: 前端构建失败重试

```bash
# 重试机制示例
❌ 前端构建失败 (尝试 1/2): 构建产物不完整
[FRONTEND] 等待 2 秒后重试...
[FRONTEND] 第 2 次重试构建...
```

**处理**: 自动重试最多2次，每次重试前清理残留文件

#### 场景7: 依赖问题自动修复

```bash
⚠️ 检测到依赖问题，尝试修复...
```

**处理**: 检测到依赖问题时自动运行 `npm install`

### 3. 构建状态管理

```javascript
// 全局状态变量
let frontendBuildChecked = false // 是否已检查过前端构建
let frontendBuildSuccess = false // 前端构建是否成功
let frontendBuildTime = 0 // 前端构建耗时（毫秒）
```

### 4. 核心函数

#### `ensureFrontendBuild(forceRebuild = false)`

- 确保前端构建产物存在且完整
- 支持强制重建选项
- 包含重试机制（最多2次重试）
- 自动检查和修复依赖问题
- 返回构建结果（true/false）

#### `monitorFrontendBuild()`

- 监控前端构建产物状态
- 检测到问题时自动重建

#### `resetFrontendBuildState()`

- 重置前端构建状态
- 用于需要重新检查的场景

#### `checkBuildEnvironment()`

- 检查构建环境的完整性
- 验证 Node.js 版本、npm 可用性、依赖安装等
- 提供详细的环境状态报告
- 返回环境检查结果（true/false）

## 配置

### 构建脚本配置

构建脚本通过 `build.config.js`
文件进行配置，支持自定义构建目标、输出路径等选项。

### Tauri 配置优化

为了避免重复前端构建，已将 `src-tauri/tauri.conf.json` 中的 `beforeBuildCommand`
设置为空字符串：

```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "",
    "devUrl": "http://localhost:1420",
    "frontendDist": "../dist"
  }
}
```

**重要说明**：

- 原配置 `"beforeBuildCommand": "npm run build"` 会导致 Tauri 自动执行前端构建
- 我们的构建脚本已经包含了前端构建逻辑，因此移除此配置避免重复构建
- 这样确保前端项目只构建一次，提升构建效率

## 使用示例

### 构建所有平台

```bash
yarn build:all
# 或
node scripts/build.js
```

### 构建桌面平台

```bash
yarn build:desktop
# 或
node scripts/build.js desktop
```

### 构建移动平台

```bash
yarn build:mobile
# 或
node scripts/build.js mobile
```

### 构建特定平台

```bash
node scripts/build.js mac-x86
```

## 构建统计信息

构建完成后会显示统计信息：

```bash
📊 构建统计信息:
   前端构建耗时: 5.92s
   前端构建状态: ✅ 成功
```

## 错误处理

### 前端构建失败

- 显示详细错误信息
- 自动退出构建流程
- 保留错误状态供后续检查

### 构建产物验证失败

- 自动重试构建
- 记录验证失败原因
- 提供清晰的错误提示

## 性能优化

1. **避免重复构建**: 通过状态缓存机制避免不必要的前端构建
2. **快速检测**: 使用文件系统检查而非完整构建来验证产物
3. **并行处理**: 前端构建与平台构建的合理调度
4. **增量更新**: 只在必要时重新构建

## 注意事项

1. **手动清理**: 如需强制重新构建前端，可先删除 `dist` 目录
2. **构建环境**: 确保 Node.js 和相关依赖已正确安装
3. **权限问题**: 确保对 `dist` 目录有读写权限
4. **磁盘空间**: 确保有足够空间存储构建产物
5. **已修复**: 解决了执行 `yarn build:mac-aarch` 等命令时重复执行前端构建的问题

## 版本更新记录

### v1.2.0 (最新)

- 🐛 **彻底修复重复构建问题**: 移除 `tauri.conf.json` 中的 `beforeBuildCommand`
  配置，彻底解决重复前端构建
- 🎨
  **优化日志输出**: 将"强制重新构建前端项目"改为"构建前端项目"，提供更清晰的构建信息
- 🔧 **简化构建流程**: 移除不必要的强制重建步骤，优化构建逻辑
- ⚡ **性能提升**: 确保前端项目只构建一次，显著提升构建效率

### v1.1.0

- 🐛 **修复重复构建问题**: 解决了 `monitorFrontendBuild()`
  函数重复调用前端构建的问题
- 🔧 **优化构建流程**: `monitorFrontendBuild()` 现在只负责检查，不再执行重建
- ⚡ **性能提升**: 避免了不必要的重复前端构建，提升构建速度
- 📝 **错误提示优化**: 提供更清晰的前端构建产物检查错误信息

## 故障排除

### 前端构建一直失败

1. **检查 Node.js 版本兼容性**

   ```bash
   node --version  # 确保版本 >= 16.x
   ```

2. **清理依赖并重新安装**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **检查代码格式和类型错误**

   ```bash
   npm run type-check
   npm run format:check
   ```

4. **查看详细的构建日志**

   ```bash
   npm run build --verbose
   ```

5. **检查磁盘空间**
   ```bash
   df -h  # 确保有足够的磁盘空间
   ```

### 环境检查失败

1. **Node.js 版本过低**
   - 升级到 Node.js 16.x 或更高版本
   - 使用 nvm 管理多个 Node.js 版本

2. **npm 不可用**

   ```bash
   # 重新安装 npm
   npm install -g npm@latest
   ```

3. **依赖缺失**
   ```bash
   # 检查并安装依赖
   npm audit fix
   npm install
   ```

### dist目录检测异常

1. **文件系统权限问题**

   ```bash
   # 检查权限
   ls -la dist/
   # 修复权限（如需要）
   chmod -R 755 dist/
   ```

2. **路径问题**
   - 确认当前工作目录正确
   - 检查项目根目录结构

3. **文件被占用**
   ```bash
   # 检查文件占用情况
   lsof +D dist/
   ```

### 构建缓存问题

1. **清理所有缓存**

   ```bash
   yarn clean:all
   npm run clean
   ```

2. **强制重建前端**

   ```bash
   rm -rf dist/
   npm run build
   ```

3. **清理系统缓存**

   ```bash
   # 清理 npm 缓存
   npm cache clean --force

   # 清理 yarn 缓存
   yarn cache clean
   ```

### 网络相关问题

1. **依赖下载失败**

   ```bash
   # 使用国内镜像
   npm config set registry https://registry.npmmirror.com/
   ```

2. **超时问题**
   ```bash
   # 增加超时时间
   npm config set timeout 60000
   ```

### 平台特定问题

1. **macOS 权限问题**

   ```bash
   # 给予终端完全磁盘访问权限
   # 系统偏好设置 > 安全性与隐私 > 隐私 > 完全磁盘访问权限
   ```

2. **Windows 路径长度限制**

   ```bash
   # 启用长路径支持
   git config --system core.longpaths true
   ```

3. **Linux 文件描述符限制**
   ```bash
   # 增加文件描述符限制
   ulimit -n 65536
   ```
