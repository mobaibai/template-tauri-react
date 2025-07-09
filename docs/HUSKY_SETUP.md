# Husky Git Hooks 配置指南

本项目已配置 Husky Git Hooks 来确保代码质量和提交规范。

## 📋 已配置的 Hooks

### 1. pre-commit

- **触发时机**: 执行 `git commit` 时
- **功能**: 使用 `lint-staged` 对暂存文件进行代码检查和格式化
- **检查内容**:
  - TypeScript/JavaScript 文件: ESLint 检查和修复 + Prettier 格式化
  - 其他文件 (JSON, CSS, SCSS, MD): Prettier 格式化
  - Rust 文件: `cargo fmt` 格式化 + `cargo clippy` 检查

### 2. commit-msg

- **触发时机**: 执行 `git commit` 时
- **功能**: 验证提交信息格式
- **格式要求**: `type(scope): description`
- **支持的类型**:
  - `feat`: 新功能
  - `fix`: 修复bug
  - `docs`: 文档更新
  - `style`: 代码格式调整(不影响功能)
  - `refactor`: 重构代码
  - `test`: 测试相关
  - `chore`: 构建过程或辅助工具的变动
  - `perf`: 性能优化
  - `ci`: CI/CD相关
  - `build`: 构建系统或外部依赖的变动

**示例**:

```bash
git commit -m "feat(ui): add new button component"
git commit -m "fix(api): resolve authentication issue"
git commit -m "docs: update README"
```

### 3. pre-push

- **触发时机**: 执行 `git push` 时
- **功能**: 推送前的最终检查
- **检查内容**:
  - 确保没有未提交的更改
  - TypeScript 类型检查
  - Rust Clippy 代码检查

## 🚀 使用方法

### 初始化 Husky

```bash
# 安装依赖后自动执行
npm install

# 或手动初始化
npm run prepare
```

### 正常开发流程

```bash
# 1. 修改代码
# 2. 添加到暂存区
git add .

# 3. 提交 (会自动触发 pre-commit 和 commit-msg hooks)
git commit -m "feat(ui): add new feature"

# 4. 推送 (会自动触发 pre-push hook)
git push
```

## 🛠️ 手动执行检查

### 代码质量检查

```bash
# ESLint 检查
npm run lint

# ESLint 检查并自动修复
npm run lint:fix

# TypeScript 类型检查
npm run type-check

# 代码格式化
npm run format

# 检查代码格式
npm run format:check
```

### Rust 代码检查

```bash
# Rust 代码格式化
npm run format:rust

# 检查 Rust 代码格式
npm run format:rust:check

# Rust Clippy 检查
npm run clippy

# Rust 测试
npm run test:rust
```

### 组合检查

```bash
# 提交前检查 (lint + format + type-check)
npm run precommit

# 构建前检查 (type-check + format-check)
npm run prebuild
```

## 🔧 自定义配置

### 修改 lint-staged 配置

在 `package.json` 中的 `lint-staged` 字段:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,jsx,json,css,scss,md}": ["prettier --write"],
    "src-tauri/src/**/*.rs": [
      "cd src-tauri && cargo fmt",
      "cd src-tauri && cargo clippy --fix --allow-dirty --allow-staged"
    ]
  }
}
```

### 修改提交信息格式

编辑 `.husky/commit-msg` 文件中的正则表达式:

```bash
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: .{1,50}'
```

### 跳过 Hooks (不推荐)

```bash
# 跳过 pre-commit hook
git commit --no-verify -m "commit message"

# 跳过 pre-push hook
git push --no-verify
```

## 🐛 常见问题

### 1. Hook 没有执行

```bash
# 检查 .husky 目录是否存在
ls -la .husky

# 重新初始化 Husky
npm run prepare

# 检查 hook 文件权限
ls -la .husky/

# 添加执行权限
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push
```

### 2. lint-staged 失败

```bash
# 手动运行 lint-staged
npx lint-staged

# 检查暂存文件
git status

# 手动修复代码问题
npm run lint:fix
npm run format
```

### 3. Rust 检查失败

```bash
# 手动格式化 Rust 代码
cd src-tauri && cargo fmt

# 手动运行 Clippy
cd src-tauri && cargo clippy --fix --allow-dirty

# 更新 Rust 依赖
cd src-tauri && cargo update
```

### 4. 提交信息格式错误

确保提交信息遵循格式: `type(scope): description`

```bash
# ✅ 正确格式
git commit -m "feat(ui): add new button"
git commit -m "fix: resolve login issue"
git commit -m "docs: update API documentation"

# ❌ 错误格式
git commit -m "add new button"
git commit -m "fix bug"
git commit -m "update docs"
```

## 📚 相关文档

- [Husky 官方文档](https://typicode.github.io/husky/)
- [lint-staged 官方文档](https://github.com/okonet/lint-staged)
- [ESLint 配置指南](https://eslint.org/docs/user-guide/configuring/)
- [Prettier 配置指南](https://prettier.io/docs/en/configuration.html)
- [Cargo Clippy 文档](https://doc.rust-lang.org/clippy/)
