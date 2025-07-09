# Husky Git Hooks Configuration Guide

This project has configured Husky Git Hooks to ensure code quality and commit
standards.

## 📋 Configured Hooks

### 1. pre-commit

- **Trigger**: When executing `git commit`
- **Function**: Use `lint-staged` to check and format staged files
- **Check Content**:
  - TypeScript/JavaScript files: ESLint check and fix + Prettier formatting
  - Other files (JSON, CSS, SCSS, MD): Prettier formatting
  - Rust files: `cargo fmt` formatting + `cargo clippy` check

### 2. commit-msg

- **Trigger**: When executing `git commit`
- **Function**: Validate commit message format
- **Format Requirement**: `type(scope): description`
- **Supported Types**:
  - `feat`: New feature
  - `fix`: Bug fix
  - `docs`: Documentation update
  - `style`: Code style changes (no functional impact)
  - `refactor`: Code refactoring
  - `test`: Test related
  - `chore`: Build process or auxiliary tool changes
  - `perf`: Performance optimization
  - `ci`: CI/CD related
  - `build`: Build system or external dependency changes

**Examples**:

```bash
git commit -m "feat(ui): add new button component"
git commit -m "fix(api): resolve authentication issue"
git commit -m "docs: update README"
```

### 3. pre-push

- **Trigger**: When executing `git push`
- **Function**: Final check before pushing
- **Check Content**:
  - Ensure no uncommitted changes
  - TypeScript type checking
  - Rust Clippy code check

## 🚀 Usage

### Initialize Husky

```bash
# Automatically executed after installing dependencies
npm install

# Or manually initialize
npm run prepare
```

### Normal Development Workflow

```bash
# 1. Modify code
# 2. Add to staging area
git add .

# 3. Commit (automatically triggers pre-commit and commit-msg hooks)
git commit -m "feat(ui): add new feature"

# 4. Push (automatically triggers pre-push hook)
git push
```

## 🛠️ Manual Check Execution

### Code Quality Check

```bash
# ESLint check
npm run lint

# ESLint check and auto fix
npm run lint:fix

# TypeScript type check
npm run type-check

# Code formatting
npm run format

# Check code format
npm run format:check
```

### Rust Code Check

```bash
# Rust code formatting
npm run format:rust

# Check Rust code format
npm run format:rust:check

# Rust Clippy check
npm run clippy

# Rust tests
npm run test:rust
```

### Combined Checks

```bash
# Pre-commit check (lint + format + type-check)
npm run precommit

# Pre-build check (type-check + format-check)
npm run prebuild
```

## 🔧 Custom Configuration

### Modify lint-staged Configuration

In the `lint-staged` field of `package.json`:

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

### Modify Commit Message Format

Edit the regular expression in `.husky/commit-msg` file:

```bash
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: .{1,50}'
```

### Skip Hooks (Not Recommended)

```bash
# Skip pre-commit hook
git commit --no-verify -m "commit message"

# Skip pre-push hook
git push --no-verify
```

## 🐛 Common Issues

### 1. Hooks Not Executing

```bash
# Check if .husky directory exists
ls -la .husky

# Reinitialize Husky
npm run prepare

# Check hook file permissions
ls -la .husky/

# Add execute permissions
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push
```

### 2. lint-staged Failure

```bash
# Manually run lint-staged
npx lint-staged

# Check staged files
git status

# Manually fix code issues
npm run lint:fix
npm run format
```

### 3. Rust Check Failure

```bash
# Manually format Rust code
cd src-tauri && cargo fmt

# Manually run Clippy
cd src-tauri && cargo clippy --fix --allow-dirty

# Update Rust dependencies
cd src-tauri && cargo update
```

### 4. Commit Message Format Error

Ensure commit message follows format: `type(scope): description`

```bash
# ✅ Correct format
git commit -m "feat(ui): add new button"
git commit -m "fix: resolve login issue"
git commit -m "docs: update API documentation"

# ❌ Incorrect format
git commit -m "add new button"
git commit -m "fix bug"
git commit -m "update docs"
```

## 📚 Related Documentation

- [Husky Official Documentation](https://typicode.github.io/husky/)
- [lint-staged Official Documentation](https://github.com/okonet/lint-staged)
- [ESLint Configuration Guide](https://eslint.org/docs/user-guide/configuring/)
- [Prettier Configuration Guide](https://prettier.io/docs/en/configuration.html)
- [Cargo Clippy Documentation](https://doc.rust-lang.org/clippy/)