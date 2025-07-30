# 开发指南

本文档提供了 Tauri +
React 项目的详细开发指南，包括项目架构、开发流程、最佳实践和常用模式。

## 📋 目录

- [项目架构](#项目架构)
- [开发流程](#开发流程)
- [前端开发](#前端开发)
- [后端开发](#后端开发)
- [前后端通信](#前后端通信)
- [状态管理](#状态管理)
- [样式和主题](#样式和主题)
- [测试策略](#测试策略)
- [性能优化](#性能优化)
- [最佳实践](#最佳实践)

## 项目架构

### 整体架构

```
┌─────────────────┐    ┌─────────────────┐
│   React 前端    │◄──►│   Rust 后端     │
│                 │    │                 │
│ • UI 渲染       │    │ • 系统 API      │
│ • 用户交互      │    │ • 文件操作      │
│ • 状态管理      │    │ • 网络请求      │
│ • 路由导航      │    │ • 数据处理      │
└─────────────────┘    └─────────────────┘
        │                        │
        └────────── IPC ──────────┘
           (Commands & Events)
```

### 目录结构详解

```
template-tauri-react/
├── src/                    # React 前端代码
│   ├── components/         # 可复用组件
│   │   ├── ui/            # 基础 UI 组件
│   │   ├── layout/        # 布局组件
│   │   └── features/      # 功能组件
│   ├── pages/             # 页面组件
│   ├── hooks/             # 自定义 Hooks
│   ├── store/             # 状态管理
│   ├── utils/             # 工具函数
│   ├── types/             # TypeScript 类型
│   ├── styles/            # 样式文件
│   └── router/            # 路由配置
├── src-tauri/             # Rust 后端代码
│   ├── src/
│   │   ├── main.rs        # 应用入口
│   │   ├── lib.rs         # 主要逻辑
│   │   ├── handlers.rs    # 命令处理器
│   │   └── utils/         # 工具模块
│   ├── Cargo.toml         # Rust 依赖配置
│   └── tauri.conf.json    # Tauri 配置
├── public/                # 静态资源
├── scripts/               # 构建脚本
└── docs/                  # 项目文档
```

## 开发流程

### 1. 环境准备

```bash
# 克隆项目
git clone <repository-url>
cd template-tauri-react

# 安装依赖
npm install

# 检查环境
npm run check:env
```

### 2. 开发模式

```bash
# 启动开发服务器
npm run dev

# 或者分别启动前后端
npm run dev:frontend  # 启动 React 开发服务器
npm run dev:tauri     # 启动 Tauri 开发模式
```

### 3. 代码质量检查

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint

# 类型检查
npm run type-check

# 运行测试
npm run test
```

### 4. 构建和打包

```bash
# 开发构建
npm run build

# 生产构建
npm run build:tauri

# 本地构建

> **注意**：PC端跨平台构建已由GitHub Actions处理，本地只需构建当前系统版本。
npm run build:all
```

## 前端开发

### 组件开发规范

#### 1. 函数式组件

```typescript
// src/components/features/UserProfile.tsx
import React from 'react';
import { User } from '@/types';

interface UserProfileProps {
  user: User;
  onEdit?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => {
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {onEdit && (
        <button onClick={onEdit}>编辑</button>
      )}
    </div>
  );
};
```

#### 2. 自定义 Hooks

```typescript
// src/hooks/useSystemInfo.ts
import { useEffect, useState } from 'react'

import { invoke } from '@tauri-apps/api/tauri'

interface SystemInfo {
  platform: string
  arch: string
  version: string
}

export const useSystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        setLoading(true)
        const info = await invoke<SystemInfo>('get_system_info')
        setSystemInfo(info)
      } catch (err) {
        setError(err as string)
      } finally {
        setLoading(false)
      }
    }

    fetchSystemInfo()
  }, [])

  return { systemInfo, loading, error }
}
```

#### 3. 页面组件

```typescript
// src/pages/SystemPage.tsx
import React from 'react';
import { useSystemInfo } from '@/hooks/useSystemInfo';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export const SystemPage: React.FC = () => {
  const { systemInfo, loading, error } = useSystemInfo();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!systemInfo) return <div>无系统信息</div>;

  return (
    <div className="system-page">
      <h1>系统信息</h1>
      <div className="info-grid">
        <div>平台: {systemInfo.platform}</div>
        <div>架构: {systemInfo.arch}</div>
        <div>版本: {systemInfo.version}</div>
      </div>
    </div>
  );
};
```

### 路由配置

```typescript
// src/router/config.ts
import { HomePage } from '@/pages/HomePage'
import { SettingsPage } from '@/pages/SettingsPage'
import { SystemPage } from '@/pages/SystemPage'

import { RouteConfig } from './types'

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: HomePage,
    title: '首页',
    icon: 'home',
  },
  {
    path: '/system',
    component: SystemPage,
    title: '系统信息',
    icon: 'system',
  },
  {
    path: '/settings',
    component: SettingsPage,
    title: '设置',
    icon: 'settings',
  },
]
```

## 后端开发

### 命令处理器

#### 1. 基础命令

```rust
// src-tauri/src/handlers.rs
use tauri::State;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
pub struct SystemInfo {
    platform: String,
    arch: String,
    version: String,
}

#[tauri::command]
pub async fn get_system_info() -> Result<SystemInfo, String> {
    Ok(SystemInfo {
        platform: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        version: std::env::var("OS_VERSION").unwrap_or_else(|_| "Unknown".to_string()),
    })
}

#[derive(Debug, Deserialize)]
pub struct FileRequest {
    path: String,
}

#[derive(Debug, Serialize)]
pub struct FileInfo {
    name: String,
    size: u64,
    modified: String,
}

#[tauri::command]
pub async fn get_file_info(request: FileRequest) -> Result<FileInfo, String> {
    use std::fs;

    let metadata = fs::metadata(&request.path)
        .map_err(|e| format!("Failed to read file metadata: {}", e))?;

    let name = std::path::Path::new(&request.path)
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("Unknown")
        .to_string();

    Ok(FileInfo {
        name,
        size: metadata.len(),
        modified: format!("{:?}", metadata.modified().unwrap_or(std::time::SystemTime::UNIX_EPOCH)),
    })
}
```

#### 2. 异步命令

```rust
// src-tauri/src/handlers.rs
use tokio::time::{sleep, Duration};

#[derive(Debug, Deserialize)]
pub struct DownloadRequest {
    url: String,
    path: String,
}

#[derive(Debug, Serialize)]
pub struct DownloadProgress {
    downloaded: u64,
    total: u64,
    percentage: f64,
}

#[tauri::command]
pub async fn download_file(
    request: DownloadRequest,
    window: tauri::Window,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    let response = client.get(&request.url)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    let total_size = response.content_length().unwrap_or(0);
    let mut downloaded = 0u64;
    let mut stream = response.bytes_stream();

    let mut file = tokio::fs::File::create(&request.path)
        .await
        .map_err(|e| format!("Failed to create file: {}", e))?;

    use tokio::io::AsyncWriteExt;
    use futures_util::StreamExt;

    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|e| format!("Stream error: {}", e))?;
        file.write_all(&chunk)
            .await
            .map_err(|e| format!("Write error: {}", e))?;

        downloaded += chunk.len() as u64;
        let percentage = if total_size > 0 {
            (downloaded as f64 / total_size as f64) * 100.0
        } else {
            0.0
        };

        // 发送进度事件
        let progress = DownloadProgress {
            downloaded,
            total: total_size,
            percentage,
        };

        window.emit("download-progress", &progress)
            .map_err(|e| format!("Failed to emit event: {}", e))?;
    }

    Ok(format!("Downloaded {} bytes to {}", downloaded, request.path))
}
```

#### 3. 状态管理

```rust
// src-tauri/src/state.rs
use std::sync::Mutex;
use std::collections::HashMap;

#[derive(Debug, Default)]
pub struct AppState {
    pub settings: Mutex<HashMap<String, String>>,
    pub cache: Mutex<HashMap<String, serde_json::Value>>,
}

impl AppState {
    pub fn new() -> Self {
        Self::default()
    }
}

#[tauri::command]
pub async fn get_setting(
    key: String,
    state: State<'_, AppState>,
) -> Result<Option<String>, String> {
    let settings = state.settings.lock()
        .map_err(|e| format!("Failed to lock settings: {}", e))?;

    Ok(settings.get(&key).cloned())
}

#[tauri::command]
pub async fn set_setting(
    key: String,
    value: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let mut settings = state.settings.lock()
        .map_err(|e| format!("Failed to lock settings: {}", e))?;

    settings.insert(key, value);
    Ok(())
}
```

### 主程序配置

```rust
// src-tauri/src/lib.rs
mod handlers;
mod state;

use handlers::*;
use state::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app_state = AppState::new();

    tauri::Builder::default()
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            // 系统信息
            get_system_info,
            get_file_info,

            // 异步操作
            download_file,

            // 状态管理
            get_setting,
            set_setting,
        ])
        .setup(|app| {
            // 应用初始化逻辑
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 前后端通信

### 命令调用

#### 1. 基础调用

```typescript
// src/services/systemService.ts
import { invoke } from '@tauri-apps/api/tauri'

export interface SystemInfo {
  platform: string
  arch: string
  version: string
}

export const systemService = {
  async getSystemInfo(): Promise<SystemInfo> {
    return await invoke<SystemInfo>('get_system_info')
  },

  async getFileInfo(path: string): Promise<FileInfo> {
    return await invoke<FileInfo>('get_file_info', {
      request: { path },
    })
  },
}
```

#### 2. 错误处理

```typescript
// src/hooks/useAsyncCommand.ts
import { useCallback, useState } from 'react'

import { invoke } from '@tauri-apps/api/tauri'

export const useAsyncCommand = <T, P = any>(commandName: string) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (params?: P): Promise<T | null> => {
      try {
        setLoading(true)
        setError(null)

        const result = await invoke<T>(commandName, params)
        setData(result)
        return result
      } catch (err) {
        const errorMessage = err as string
        setError(errorMessage)
        console.error(`Command ${commandName} failed:`, errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [commandName]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}
```

### 事件系统

#### 1. 监听事件

```typescript
// src/hooks/useEventListener.ts
import { useEffect } from 'react'

import { listen, UnlistenFn } from '@tauri-apps/api/event'

export const useEventListener = <T>(
  eventName: string,
  handler: (payload: T) => void,
  deps: any[] = []
) => {
  useEffect(() => {
    let unlisten: UnlistenFn

    const setupListener = async () => {
      unlisten = await listen<T>(eventName, event => {
        handler(event.payload)
      })
    }

    setupListener()

    return () => {
      if (unlisten) {
        unlisten()
      }
    }
  }, deps)
}
```

#### 2. 使用事件

```typescript
// src/components/DownloadProgress.tsx
import React, { useState } from 'react';
import { useEventListener } from '@/hooks/useEventListener';
import { systemService } from '@/services/systemService';

interface DownloadProgress {
  downloaded: number;
  total: number;
  percentage: number;
}

export const DownloadProgress: React.FC = () => {
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [downloading, setDownloading] = useState(false);

  // 监听下载进度事件
  useEventListener<DownloadProgress>(
    'download-progress',
    (payload) => {
      setProgress(payload);
      if (payload.percentage >= 100) {
        setDownloading(false);
      }
    }
  );

  const startDownload = async () => {
    setDownloading(true);
    setProgress(null);

    try {
      await systemService.downloadFile({
        url: 'https://example.com/file.zip',
        path: '/path/to/save/file.zip'
      });
    } catch (error) {
      console.error('Download failed:', error);
      setDownloading(false);
    }
  };

  return (
    <div className="download-progress">
      <button onClick={startDownload} disabled={downloading}>
        {downloading ? '下载中...' : '开始下载'}
      </button>

      {progress && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress.percentage}%` }}
          />
          <span>{progress.percentage.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};
```

## 状态管理

### Zustand 状态管理

```typescript
// src/store/appStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  sidebarCollapsed: boolean;

  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'zh' | 'en') => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(n  persist(
    (set) => ({
      theme: 'light',
      language: 'zh',
      sidebarCollapsed: false,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleSidebar: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed
      })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
```

### 系统状态管理

```typescript
// src/store/systemStore.ts
import { create } from 'zustand'

import { SystemInfo, systemService } from '@/services/systemService'

interface SystemState {
  systemInfo: SystemInfo | null
  loading: boolean
  error: string | null

  // Actions
  fetchSystemInfo: () => Promise<void>
  clearError: () => void
}

export const useSystemStore = create<SystemState>((set, get) => ({
  systemInfo: null,
  loading: false,
  error: null,

  fetchSystemInfo: async () => {
    set({ loading: true, error: null })

    try {
      const systemInfo = await systemService.getSystemInfo()
      set({ systemInfo, loading: false })
    } catch (error) {
      set({ error: error as string, loading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
```

## 样式和主题

### CSS 变量主题

```css
/* src/styles/themes.css */
:root {
  /* Light Theme */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text: #1e293b;
  --color-text-secondary: #64748b;
  --color-border: #e2e8f0;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

[data-theme='dark'] {
  --color-primary: #60a5fa;
  --color-primary-hover: #3b82f6;
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-border: #334155;
}
```

### 主题切换

```typescript
// src/hooks/useTheme.ts
import { useEffect } from 'react'

import { useAppStore } from '@/store/appStore'

export const useTheme = () => {
  const { theme, setTheme } = useAppStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return { theme, setTheme, toggleTheme }
}
```

## API 参考

### 前后端通信架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React 前端    │───►│   Tauri 桥接    │───►│   Rust 后端     │
│                 │    │                 │    │                 │
│ • invoke()      │    │ • 命令路由      │    │ • 命令处理器    │
│ • listen()      │    │ • 事件分发      │    │ • 事件发射器    │
│ • emit()        │    │ • 类型转换      │    │ • 业务逻辑      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 核心 API

#### 系统信息 API

```typescript
// 获取系统架构
const arch = await invoke<string>('get_system_arch')

// 获取操作系统
const os = await invoke<string>('get_system_os')

// 获取完整系统信息
interface SystemInfo {
  arch: string
  os: string
  version: string
  cpu_count: number
  total_memory: number
}

const systemInfo = await invoke<SystemInfo>('get_system_info')
```

```rust
// 后端实现
#[tauri::command]
pub fn get_system_arch() -> String {
    std::env::consts::ARCH.to_string()
}

#[derive(Debug, Serialize)]
pub struct SystemInfo {
    pub arch: String,
    pub os: String,
    pub version: String,
    pub cpu_count: usize,
    pub total_memory: u64,
}

#[tauri::command]
pub fn get_system_info() -> SystemInfo {
    // 实现细节...
}
```

#### 文件操作 API

```typescript
// 读取文件
interface FileReadRequest {
  path: string
}

interface FileReadResponse {
  content: string
  size: number
}

const response = await invoke<FileReadResponse>('read_file_content', {
  request: { path: '/path/to/file.txt' },
})

// 写入文件
interface FileWriteRequest {
  path: string
  content: string
  create_dirs?: boolean
}

await invoke<void>('write_file_content', {
  request: {
    path: '/path/to/file.txt',
    content: 'Hello, World!',
    create_dirs: true,
  },
})
```

#### 窗口管理 API

```typescript
// 创建加载窗口
await invoke<void>('create_loading_window')

// 通知加载完成
await invoke<void>('notify_loading_ready')

// 更新窗口标题
interface UpdateTitleRequest {
  title: string
  window_label?: string
}

await invoke<void>('update_window_title', {
  request: { title: '新标题', window_label: 'main' },
})
```

#### 网络请求 API

```typescript
// HTTP 请求
interface HttpConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  headers?: Record<string, string>
  body?: string
  timeout?: number
}

interface HttpResponse {
  status: number
  headers: Record<string, string>
  body: string
}

const response = await invoke<HttpResponse>('make_http_request', {
  config: {
    method: 'GET',
    url: 'https://api.example.com/data',
    headers: { Authorization: 'Bearer token' },
    timeout: 30000,
  },
})
```

### 事件系统

#### 前端监听事件

```typescript
import { listen } from '@tauri-apps/api/event'

// 监听系统事件
const unlisten = await listen('system-info-updated', event => {
  console.log('系统信息更新:', event.payload)
})

// 监听文件变化事件
const unlistenFile = await listen('file-changed', event => {
  console.log('文件变化:', event.payload)
})

// 取消监听
unlisten()
unlistenFile()
```

#### 后端发送事件

```rust
// 发送事件到前端
#[tauri::command]
pub async fn trigger_system_update(window: tauri::Window) -> Result<(), String> {
    let system_info = get_system_info();

    window.emit("system-info-updated", &system_info)
        .map_err(|e| format!("发送事件失败: {}", e))?;

    Ok(())
}
```

### 错误处理

#### 统一错误类型

```rust
// 自定义错误类型
#[derive(Debug, Serialize)]
pub struct ApiError {
    pub code: String,
    pub message: String,
    pub details: Option<serde_json::Value>,
}

impl std::fmt::Display for ApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

// 命令中使用
#[tauri::command]
pub async fn safe_operation() -> Result<String, ApiError> {
    match risky_operation().await {
        Ok(result) => Ok(result),
        Err(e) => Err(ApiError {
            code: "OPERATION_FAILED".to_string(),
            message: format!("操作失败: {}", e),
            details: None,
        })
    }
}
```

#### 前端错误处理

```typescript
// 错误处理 Hook
export function useApiCall<T>(command: string, params?: any) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await invoke<T>(command, params)
      setData(result)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }, [command, params])

  return { data, error, loading, execute }
}
```

## 测试策略

### 前端测试

#### 1. 组件测试

```typescript
// src/components/__tests__/UserProfile.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from '../UserProfile';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com'
};

describe('UserProfile', () => {
  it('renders user information', () => {
    render(<UserProfile user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<UserProfile user={mockUser} onEdit={onEdit} />);

    fireEvent.click(screen.getByText('编辑'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
```

#### 2. Hook 测试

```typescript
// src/hooks/__tests__/useSystemInfo.test.ts
import { renderHook, waitFor } from '@testing-library/react'

import { useSystemInfo } from '../useSystemInfo'

// Mock Tauri API
jest.mock('@tauri-apps/api/tauri', () => ({
  invoke: jest.fn(),
}))

const mockInvoke = require('@tauri-apps/api/tauri').invoke

describe('useSystemInfo', () => {
  beforeEach(() => {
    mockInvoke.mockClear()
  })

  it('fetches system info successfully', async () => {
    const mockSystemInfo = {
      platform: 'darwin',
      arch: 'x64',
      version: '10.15.7',
    }

    mockInvoke.mockResolvedValue(mockSystemInfo)

    const { result } = renderHook(() => useSystemInfo())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.systemInfo).toEqual(mockSystemInfo)
    expect(result.current.error).toBeNull()
  })
})
```

### 后端测试

```rust
// src-tauri/src/handlers.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_get_system_info() {
        let result = get_system_info().await;
        assert!(result.is_ok());

        let system_info = result.unwrap();
        assert!(!system_info.platform.is_empty());
        assert!(!system_info.arch.is_empty());
    }

    #[tokio::test]
    async fn test_get_file_info_invalid_path() {
        let request = FileRequest {
            path: "/nonexistent/file.txt".to_string(),
        };

        let result = get_file_info(request).await;
        assert!(result.is_err());
    }
}
```

## 性能优化

### 前端优化

#### 1. 组件优化

```typescript
// src/components/OptimizedList.tsx
import React, { memo, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';

interface Item {
  id: string;
  name: string;
  value: number;
}

interface OptimizedListProps {
  items: Item[];
  onItemClick: (item: Item) => void;
}

const ListItem = memo<{ index: number; style: any; data: any }>(({ index, style, data }) => {
  const { items, onItemClick } = data;
  const item = items[index];

  const handleClick = useCallback(() => {
    onItemClick(item);
  }, [item, onItemClick]);

  return (
    <div style={style} onClick={handleClick}>
      {item.name}: {item.value}
    </div>
  );
});

export const OptimizedList: React.FC<OptimizedListProps> = memo(({ items, onItemClick }) => {
  const itemData = useMemo(() => ({ items, onItemClick }), [items, onItemClick]);

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={50}
      itemData={itemData}
    >
      {ListItem}
    </List>
  );
});
```

#### 2. 状态优化

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 使用示例
const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // 执行搜索
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="搜索..."
    />
  );
};
```

### 后端优化

#### 1. 异步处理

```rust
// src-tauri/src/handlers.rs
use tokio::sync::Semaphore;
use std::sync::Arc;

// 限制并发数量
static SEMAPHORE: once_cell::sync::Lazy<Arc<Semaphore>> =
    once_cell::sync::Lazy::new(|| Arc::new(Semaphore::new(10)));

#[tauri::command]
pub async fn process_files(file_paths: Vec<String>) -> Result<Vec<String>, String> {
    let mut tasks = Vec::new();

    for path in file_paths {
        let permit = SEMAPHORE.clone().acquire_owned().await
            .map_err(|e| format!("Failed to acquire semaphore: {}", e))?;

        let task = tokio::spawn(async move {
            let _permit = permit; // 保持许可证直到任务完成
            process_single_file(path).await
        });

        tasks.push(task);
    }

    let mut results = Vec::new();
    for task in tasks {
        let result = task.await
            .map_err(|e| format!("Task failed: {}", e))??;
        results.push(result);
    }

    Ok(results)
}

async fn process_single_file(path: String) -> Result<String, String> {
    // 模拟文件处理
    tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
    Ok(format!("Processed: {}", path))
}
```

#### 2. 缓存机制

```rust
// src-tauri/src/cache.rs
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use std::time::{Duration, Instant};

#[derive(Clone)]
struct CacheEntry<T> {
    value: T,
    expires_at: Instant,
}

pub struct Cache<T> {
    data: Arc<RwLock<HashMap<String, CacheEntry<T>>>>,
    default_ttl: Duration,
}

impl<T: Clone> Cache<T> {
    pub fn new(default_ttl: Duration) -> Self {
        Self {
            data: Arc::new(RwLock::new(HashMap::new())),
            default_ttl,
        }
    }

    pub async fn get(&self, key: &str) -> Option<T> {
        let data = self.data.read().await;
        if let Some(entry) = data.get(key) {
            if entry.expires_at > Instant::now() {
                return Some(entry.value.clone());
            }
        }
        None
    }

    pub async fn set(&self, key: String, value: T) {
        let expires_at = Instant::now() + self.default_ttl;
        let entry = CacheEntry { value, expires_at };

        let mut data = self.data.write().await;
        data.insert(key, entry);
    }

    pub async fn cleanup_expired(&self) {
        let mut data = self.data.write().await;
        let now = Instant::now();
        data.retain(|_, entry| entry.expires_at > now);
    }
}
```

## 最佳实践

### 1. 代码组织

- **单一职责原则**：每个组件和函数只负责一个功能
- **模块化设计**：将相关功能组织到同一个模块中
- **接口分离**：定义清晰的接口和类型
- **依赖注入**：通过 props 和 context 传递依赖

### 2. 错误处理

- **统一错误处理**：使用统一的错误处理机制
- **用户友好的错误信息**：提供清晰的错误提示
- **错误边界**：使用 React Error Boundary 捕获组件错误
- **日志记录**：记录详细的错误日志用于调试

### 3. 安全性

- **输入验证**：验证所有用户输入和外部数据
- **权限控制**：限制 Tauri 命令的访问权限
- **数据加密**：对敏感数据进行加密存储
- **安全更新**：及时更新依赖和修复安全漏洞

### 4. 性能

- **懒加载**：按需加载组件和资源
- **缓存策略**：合理使用缓存减少重复计算
- **批量操作**：将多个操作合并为批量操作
- **内存管理**：及时清理不需要的资源

### 5. 可维护性

- **代码注释**：为复杂逻辑添加清晰的注释
- **类型安全**：充分利用 TypeScript 的类型系统
- **测试覆盖**：编写全面的单元测试和集成测试
- **文档更新**：保持文档与代码同步更新

## 🔧 故障排除

### 快速诊断

在遇到问题时，首先运行环境检查工具：

```bash
# 检查开发环境
npm run check:env

# 自动修复可修复的问题
npm run check:env:fix
```

### 常见问题解决

#### Android 开发问题

**OpenSSL 编译错误**

```bash
# 推荐方案：使用 rustls 替代 OpenSSL
pnpm clean:all
pnpm dev:android:safe

# 备选方案：配置 OpenSSL 环境变量 (macOS)
brew install openssl
export OPENSSL_DIR=/opt/homebrew/opt/openssl
```

**模拟器检测失败**

```bash
# 检查模拟器状态
npm run emulator:status

# 启动模拟器
npm run emulator:start

# 安全启动命令
npm run dev:android:safe
```

**Rust 编译失败**

```bash
# 安装 Android 目标
rustup target add aarch64-linux-android
rustup target add armv7-linux-androideabi

# 检查 NDK 配置
echo $ANDROID_HOME
ls $ANDROID_HOME/ndk
```

#### iOS 开发问题

**Xcode 工具缺失**

```bash
# 安装 Command Line Tools
xcode-select --install

# 验证安装
xcodebuild -version
```

**模拟器问题**

```bash
# 列出可用模拟器
xcrun simctl list devices

# 启动特定模拟器
xcrun simctl boot "iPhone 14"
open -a Simulator
```

#### 前端开发问题

**Node.js 版本问题**

```bash
# 使用 nvm 管理版本
nvm install --lts
nvm use --lts

# 清理依赖缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Vite 服务器问题**

```bash
# 检查端口占用
lsof -i :1420

# 使用不同端口
npm run dev -- --port 3000
```

### 调试技巧

```bash
# 启用详细日志
export RUST_LOG=debug
export TAURI_DEBUG=true

# 清理和重置
npm run clean
rm -rf node_modules
npm install

# 查看详细错误信息
tauri android dev --verbose
tauri ios dev --verbose
```

### 常用命令速查

```bash
# 环境检查
npm run check:env
npm run check:env:fix

# 模拟器管理
npm run emulator:status
npm run emulator:start

# 安全开发
npm run dev:android:safe

# 清理和构建
npm run clean
npm run build:desktop
npm run build:mobile
```

---

更多详细信息请参考：

- [环境配置指南](ENVIRONMENT_SETUP.md)
- [构建部署指南](BUILD_DEPLOYMENT.md)
