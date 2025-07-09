# Build Cache Cleanup Guide

## Overview

When performing Tauri cross-platform builds, a large amount of cache files and
build artifacts are generated. This project provides automated cleanup tools to
help manage disk space.

## Disk Usage Analysis

Based on our analysis, the main sources of disk usage include:

### Windows Cross-compilation Cache

- **~/.xwin**: ~2.1GB (Windows SDK and toolchain)
- **.xwin-cache**: ~1.0GB (project local cache)

### LLVM Toolchain

- **/opt/homebrew/Cellar/llvm**: ~1.6GB
- **/opt/homebrew/Cellar/llvm@19**: ~1.8GB

### Project Build Artifacts

- **src-tauri/target**: Varies based on build targets
- **dist-builds**: Final installer files

## Cleanup Tool Usage

### Quick Cleanup

```bash
# Run interactive cleanup tool
npm run clean:build-cache
```

### Cleanup Options Explained

1. **Clean project local cache only** - Clean `.xwin-cache` and `target/`
   directories
   - Safe option, doesn't affect other projects
   - Relatively less space freed

2. **Clean all Windows SDK cache** - Clean `~/.xwin` directory
   - Will affect all projects using cargo-xwin
   - SDK needs to be re-downloaded on next build

3. **Clean build artifacts** - Clean `dist-builds/` directory
   - Deletes all generated installers
   - Need to rebuild to get installers

4. **Clean everything** - Clean all above content (preserve LLVM tools)
   - Maximizes disk space freed
   - Next build will take longer

5. **Show LLVM tool usage** - View only, no cleanup
   - LLVM tools are shared by multiple projects, usually not recommended to
     delete

## Recommended Cleanup Strategies

### Daily Development

- Use option 1: Clean project local cache only
- Periodically use option 3: Clean old build artifacts

### When Disk Space is Tight

- Use option 2: Clean Windows SDK cache (if Windows builds are infrequent)
- Use option 4: Clean everything (when preparing for extended periods without
  building)

### Not Recommended to Clean

- LLVM toolchain: Shared by multiple system projects
- Node.js dependencies: Handle separately with `npm run clean:deps`

## Important Notes

1. **Backup important files**: Ensure important build artifacts are backed up
   before cleaning
2. **Network environment**: After cleaning SDK cache, next build requires
   re-downloading (~1-2GB)
3. **Build time**: First build after cache cleanup will take significantly
   longer
4. **Parallel projects**: Cleaning global cache will affect other Tauri projects

## Manual Cleanup Commands

If you need to manually clean specific content:

```bash
# Clean project local cache
rm -rf .xwin-cache
cd src-tauri && cargo clean

# Clean global Windows SDK cache
rm -rf ~/.xwin

# Clean build artifacts
rm -rf dist-builds

# Clean frontend build cache
npm run clean
```

## Related Commands

- `npm run clean` - Clean frontend build artifacts
- `npm run clean:dist` - Clean build output directory
- `npm run clean:deps` - Reinstall dependencies
- `npm run clean:all` - Comprehensive cleanup (including Rust cache)

## See Also

- [Build & Deployment Guide](BUILD_DEPLOYMENT.en.md) - Multi-platform build and
  deployment
- [Development Guide](DEVELOPMENT_GUIDE.en.md) - Development workflow and best
  practices
- [Environment Setup Guide](ENVIRONMENT_SETUP.en.md) - Development environment
  configuration
