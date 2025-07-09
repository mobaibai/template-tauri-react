# Tauri 多平台构建指南

本项目采用配置化的构建系统，将复杂的构建逻辑从 `package.json`
中分离出来，提高可维护性和可读性。

## 📁 构建系统文件结构

```
├── build.config.js          # 构建配置文件
├── scripts/
│   └── build.js             # 构建脚本
├── package.json             # 简化的构建命令
└── BUILD.md                 # 本文档
```

## ⚙️ 配置文件说明

### `build.config.js`

主要配置项：

- **`targets`**: 各平台构建目标配置
  - `target`: Rust 编译目标
  - `runner`: 构建运行器（如 cargo-xwin）
  - `outputDir`: 输出目录
  - `sourceDir`: 源文件目录

- **`options`**: 构建选项
  - `cleanAfterBuild`: 构建后清理临时文件
  - `cleanBeforeBuild`: 构建前清理输出目录
  - `outputRoot`: 输出根目录
  - `verbose`: 显示详细日志

- **`env`**: 环境变量配置
  - 解决跨平台编译问题的环境变量

## 🚀 使用方法

### 构建单个平台

```bash
# macOS x86_64
yarn build:mac-x86

# macOS ARM64
yarn build:mac-aarch

# Windows x86_64
yarn build:win-x86

# Windows ARM64
yarn build:win-aarch
```

### 构建所有平台

```bash
yarn build:all
```

### 清理输出目录

```bash
yarn clean:dist
```

### 直接使用构建脚本

```bash
# 构建指定平台
node scripts/build.js mac-x86

# 构建所有平台
node scripts/build.js all

# 查看可用目标
node scripts/build.js
```

## 📦 输出结构

构建完成后，所有平台的最终安装包将直接放置在 `dist-builds` 目录下：

```
dist-builds/
├── template-tauri-react_0.0.1_x64.dmg        # macOS x86_64 安装包
├── template-tauri-react_0.0.1_aarch64.dmg    # macOS ARM64 安装包
├── template-tauri-react_0.0.1_x64-setup.exe  # Windows x86_64 安装包
└── template-tauri-react_0.0.1_arm64-setup.exe # Windows ARM64 安装包
```

> **注意**: 只有最终的安装包文件会被保留，中间构建产物会被自动清理。

## 🔧 自定义配置

### 修改构建目标

在 `build.config.js` 中添加或修改 `targets` 配置：

```javascript
targets: {
  'linux-x86': {
    target: 'x86_64-unknown-linux-gnu',
    runner: 'cargo',
    outputDir: 'dist-builds/linux-x86',
    sourceDir: 'src-tauri/target/x86_64-unknown-linux-gnu/release/bundle'
  }
}
```

### 修改构建选项

```javascript
options: {
  cleanAfterBuild: false,    // 保留临时文件用于调试
  cleanBeforeBuild: true,    // 构建前清理
  outputRoot: 'releases',    // 更改输出目录名
  verbose: true              // 显示详细构建日志
}
```

### 添加环境变量

```javascript
env: {
  PKG_CONFIG_ALLOW_CROSS: '1',
  CUSTOM_BUILD_FLAG: 'production'
}
```

## 🛠️ 故障排除

### 常见问题

1. **权限错误**

   ```bash
   chmod +x scripts/build.js
   ```

2. **跨平台编译失败**
   - 检查 `build.config.js` 中的环境变量配置
   - 确保安装了相应的交叉编译工具链

3. **构建产物未找到**
   - 检查 `sourceDir` 路径是否正确
   - 确认 Tauri 构建成功完成

### 调试模式

启用详细日志输出：

```javascript
// build.config.js
options: {
  verbose: true
}
```

## 🎯 优势

✅ **配置集中化**: 所有构建配置集中在 `build.config.js`

✅ **脚本简洁化**: `package.json` 中的构建命令更加简洁

✅ **易于维护**: 修改构建逻辑只需编辑配置文件

✅ **功能丰富**: 支持详细日志、自动清理、环境变量配置

✅ **扩展性强**: 可轻松添加新的构建目标和选项

✅ **错误处理**: 完善的错误处理和日志输出

## 📝 注意事项

- 确保 Node.js 环境可用
- 构建脚本需要执行权限
- 跨平台编译需要相应的工具链支持
- 建议在 CI/CD 环境中使用原生编译以避免兼容性问题
