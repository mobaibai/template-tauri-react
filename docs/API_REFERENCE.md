# API 参考文档

本文档详细说明了 Tauri +
React 项目中前后端通信的所有 API 接口，包括命令调用、事件系统和数据结构定义。

## 📋 目录

- [概述](#概述)
- [系统信息 API](#系统信息-api)
- [文件操作 API](#文件操作-api)
- [窗口管理 API](#窗口管理-api)
- [网络请求 API](#网络请求-api)
- [事件系统](#事件系统)
- [数据结构](#数据结构)
- [错误处理](#错误处理)
- [使用示例](#使用示例)

## 概述

### API 架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React 前端    │───►│   Tauri 桥接    │───►│   Rust 后端     │
│                 │    │                 │    │                 │
│ • invoke()      │    │ • 命令路由      │    │ • 命令处理器    │
│ • listen()      │    │ • 事件分发      │    │ • 事件发射器    │
│ • emit()        │    │ • 类型转换      │    │ • 业务逻辑      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 通信方式

1. **命令调用（Commands）**：前端调用后端功能
2. **事件系统（Events）**：双向事件通信
3. **状态同步**：实时数据同步

### 类型安全

所有 API 都使用 TypeScript 类型定义，确保编译时类型检查：

```typescript
// 前端类型定义
interface SystemInfo {
  arch: string;
  os: string;
  version: string;
  cpu_count: number;
  total_memory: number;
}

// 后端对应的 Rust 结构
#[derive(Debug, Serialize)]
struct SystemInfo {
    arch: String,
    os: String,
    version: String,
    cpu_count: usize,
    total_memory: u64,
}
```

## 系统信息 API

### 获取系统架构

**命令**: `get_system_arch`

```typescript
// 前端调用
import { invoke } from '@tauri-apps/api/tauri'

const arch = await invoke<string>('get_system_arch')
console.log('系统架构:', arch) // 输出: "x86_64" 或 "aarch64"
```

```rust
// 后端实现
#[tauri::command]
pub fn get_system_arch() -> String {
    std::env::consts::ARCH.to_string()
}
```

**返回值**:

- `string`: 系统架构（如 "x86_64", "aarch64"）

### 获取操作系统信息

**命令**: `get_system_os`

```typescript
// 前端调用
const os = await invoke<string>('get_system_os')
console.log('操作系统:', os) // 输出: "windows", "macos", "linux"
```

```rust
// 后端实现
#[tauri::command]
pub fn get_system_os() -> String {
    std::env::consts::OS.to_string()
}
```

**返回值**:

- `string`: 操作系统名称

### 获取 CPU 核心数

**命令**: `get_cpu_count`

```typescript
// 前端调用
const cpuCount = await invoke<number>('get_cpu_count')
console.log('CPU 核心数:', cpuCount)
```

```rust
// 后端实现
#[tauri::command]
pub fn get_cpu_count() -> usize {
    num_cpus::get()
}
```

**返回值**:

- `number`: CPU 核心数量

### 获取总内存

**命令**: `get_total_memory`

```typescript
// 前端调用
const totalMemory = await invoke<number>('get_total_memory')
console.log('总内存 (GB):', (totalMemory / 1024 / 1024 / 1024).toFixed(2))
```

```rust
// 后端实现
use sysinfo::{System, SystemExt};

#[tauri::command]
pub fn get_total_memory() -> u64 {
    let mut system = System::new_all();
    system.refresh_memory();
    system.total_memory() * 1024 // 转换为字节
}
```

**返回值**:

- `number`: 总内存大小（字节）

### 获取完整系统信息

**命令**: `get_system_info`

```typescript
// 类型定义
interface SystemInfo {
  arch: string
  os: string
  version: string
  cpu_count: number
  total_memory: number
}

// 前端调用
const systemInfo = await invoke<SystemInfo>('get_system_info')
console.log('系统信息:', systemInfo)
```

```rust
// 后端实现
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
    let mut system = System::new_all();
    system.refresh_all();

    SystemInfo {
        arch: std::env::consts::ARCH.to_string(),
        os: std::env::consts::OS.to_string(),
        version: system.os_version().unwrap_or_default(),
        cpu_count: num_cpus::get(),
        total_memory: system.total_memory() * 1024,
    }
}
```

**返回值**:

- `SystemInfo`: 完整的系统信息对象

## 文件操作 API

### 读取文件

**命令**: `read_file_content`

```typescript
// 类型定义
interface FileReadRequest {
  path: string
}

interface FileReadResponse {
  content: string
  size: number
}

// 前端调用
const response = await invoke<FileReadResponse>('read_file_content', {
  request: { path: '/path/to/file.txt' },
})
console.log('文件内容:', response.content)
console.log('文件大小:', response.size)
```

```rust
// 后端实现
#[derive(Debug, Deserialize)]
pub struct FileReadRequest {
    pub path: String,
}

#[derive(Debug, Serialize)]
pub struct FileReadResponse {
    pub content: String,
    pub size: u64,
}

#[tauri::command]
pub async fn read_file_content(request: FileReadRequest) -> Result<FileReadResponse, String> {
    match tokio::fs::read_to_string(&request.path).await {
        Ok(content) => {
            let size = content.len() as u64;
            Ok(FileReadResponse { content, size })
        }
        Err(e) => Err(format!("读取文件失败: {}", e)),
    }
}
```

**参数**:

- `request.path`: 文件路径

**返回值**:

- `FileReadResponse`: 包含文件内容和大小

**错误**:

- 文件不存在
- 权限不足
- 文件格式不支持

### 写入文件

**命令**: `write_file_content`

```typescript
// 类型定义
interface FileWriteRequest {
  path: string
  content: string
  create_dirs?: boolean
}

// 前端调用
await invoke<void>('write_file_content', {
  request: {
    path: '/path/to/file.txt',
    content: 'Hello, World!',
    create_dirs: true,
  },
})
```

```rust
// 后端实现
#[derive(Debug, Deserialize)]
pub struct FileWriteRequest {
    pub path: String,
    pub content: String,
    pub create_dirs: Option<bool>,
}

#[tauri::command]
pub async fn write_file_content(request: FileWriteRequest) -> Result<(), String> {
    let path = std::path::Path::new(&request.path);

    // 创建目录（如果需要）
    if request.create_dirs.unwrap_or(false) {
        if let Some(parent) = path.parent() {
            tokio::fs::create_dir_all(parent).await
                .map_err(|e| format!("创建目录失败: {}", e))?;
        }
    }

    // 写入文件
    tokio::fs::write(path, &request.content).await
        .map_err(|e| format!("写入文件失败: {}", e))?;

    Ok(())
}
```

**参数**:

- `request.path`: 文件路径
- `request.content`: 文件内容
- `request.create_dirs`: 是否创建目录（可选）

**返回值**:

- `void`: 无返回值

**错误**:

- 路径无效
- 权限不足
- 磁盘空间不足

## 窗口管理 API

### 创建加载窗口

**命令**: `create_loading_window`

```typescript
// 前端调用
await invoke<void>('create_loading_window')
```

```rust
// 后端实现
#[tauri::command]
pub async fn create_loading_window(app: tauri::AppHandle) -> Result<(), String> {
    let loading_window = tauri::WindowBuilder::new(
        &app,
        "loading",
        tauri::WindowUrl::App("loading.html".into())
    )
    .title("加载中...")
    .inner_size(400.0, 300.0)
    .center()
    .resizable(false)
    .decorations(false)
    .always_on_top(true)
    .build()
    .map_err(|e| format!("创建加载窗口失败: {}", e))?;

    loading_window.show().map_err(|e| format!("显示窗口失败: {}", e))?;
    Ok(())
}
```

### 通知加载完成

**命令**: `notify_loading_ready`

```typescript
// 前端调用
await invoke<void>('notify_loading_ready')
```

```rust
// 后端实现
#[tauri::command]
pub async fn notify_loading_ready(app: tauri::AppHandle) -> Result<(), String> {
    // 关闭加载窗口
    if let Some(loading_window) = app.get_window("loading") {
        loading_window.close().map_err(|e| format!("关闭加载窗口失败: {}", e))?;
    }

    // 显示主窗口
    if let Some(main_window) = app.get_window("main") {
        main_window.show().map_err(|e| format!("显示主窗口失败: {}", e))?;
        main_window.set_focus().map_err(|e| format!("设置焦点失败: {}", e))?;
    }

    Ok(())
}
```

### 更新窗口标题

**命令**: `update_window_title`

```typescript
// 类型定义
interface UpdateTitleRequest {
  title: string
  window_label?: string
}

// 前端调用
await invoke<void>('update_window_title', {
  request: {
    title: '新标题',
    window_label: 'main',
  },
})
```

```rust
// 后端实现
#[derive(Debug, Deserialize)]
pub struct UpdateTitleRequest {
    pub title: String,
    pub window_label: Option<String>,
}

#[tauri::command]
pub async fn update_window_title(
    app: tauri::AppHandle,
    request: UpdateTitleRequest
) -> Result<(), String> {
    let window_label = request.window_label.unwrap_or_else(|| "main".to_string());

    if let Some(window) = app.get_window(&window_label) {
        window.set_title(&request.title)
            .map_err(|e| format!("设置窗口标题失败: {}", e))?;
    } else {
        return Err(format!("窗口 '{}' 不存在", window_label));
    }

    Ok(())
}
```

## 网络请求 API

### HTTP 请求

**命令**: `make_http_request`

```typescript
// 类型定义
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

// 前端调用
const response = await invoke<HttpResponse>('make_http_request', {
  config: {
    method: 'GET',
    url: 'https://api.example.com/data',
    headers: {
      Authorization: 'Bearer token',
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  },
})

console.log('响应状态:', response.status)
console.log('响应数据:', JSON.parse(response.body))
```

```rust
// 后端实现
use reqwest;
use serde_json;
use std::collections::HashMap;
use std::time::Duration;

#[derive(Debug, Deserialize)]
pub struct HttpConfig {
    pub method: String,
    pub url: String,
    pub headers: Option<HashMap<String, String>>,
    pub body: Option<String>,
    pub timeout: Option<u64>,
}

#[derive(Debug, Serialize)]
pub struct HttpResponse {
    pub status: u16,
    pub headers: HashMap<String, String>,
    pub body: String,
}

#[tauri::command]
pub async fn make_http_request(config: HttpConfig) -> Result<HttpResponse, String> {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_millis(config.timeout.unwrap_or(30000)))
        .build()
        .map_err(|e| format!("创建 HTTP 客户端失败: {}", e))?;

    let method = match config.method.to_uppercase().as_str() {
        "GET" => reqwest::Method::GET,
        "POST" => reqwest::Method::POST,
        "PUT" => reqwest::Method::PUT,
        "DELETE" => reqwest::Method::DELETE,
        "PATCH" => reqwest::Method::PATCH,
        _ => return Err("不支持的 HTTP 方法".to_string()),
    };

    let mut request = client.request(method, &config.url);

    // 添加请求头
    if let Some(headers) = config.headers {
        for (key, value) in headers {
            request = request.header(&key, &value);
        }
    }

    // 添加请求体
    if let Some(body) = config.body {
        request = request.body(body);
    }

    // 发送请求
    let response = request.send().await
        .map_err(|e| format!("HTTP 请求失败: {}", e))?;

    let status = response.status().as_u16();

    // 提取响应头
    let mut headers = HashMap::new();
    for (key, value) in response.headers() {
        if let Ok(value_str) = value.to_str() {
            headers.insert(key.to_string(), value_str.to_string());
        }
    }

    // 获取响应体
    let body = response.text().await
        .map_err(|e| format!("读取响应体失败: {}", e))?;

    Ok(HttpResponse {
        status,
        headers,
        body,
    })
}
```

**参数**:

- `config.method`: HTTP 方法
- `config.url`: 请求 URL
- `config.headers`: 请求头（可选）
- `config.body`: 请求体（可选）
- `config.timeout`: 超时时间（毫秒，可选）

**返回值**:

- `HttpResponse`: HTTP 响应对象

**错误**:

- 网络连接失败
- 请求超时
- 服务器错误

## 事件系统

### 前端监听事件

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

### 前端发送事件

```typescript
import { emit } from '@tauri-apps/api/event'

// 发送用户操作事件
await emit('user-action', {
  action: 'button-click',
  target: 'save-button',
  timestamp: Date.now(),
})
```

### 后端发送事件

```rust
// 在命令处理器中发送事件
#[tauri::command]
pub async fn process_data(app: tauri::AppHandle) -> Result<(), String> {
    // 处理数据...

    // 发送进度事件
    app.emit_all("processing-progress", serde_json::json!({
        "progress": 50,
        "message": "处理中..."
    })).map_err(|e| format!("发送事件失败: {}", e))?;

    // 处理完成
    app.emit_all("processing-complete", serde_json::json!({
        "success": true,
        "result": "处理完成"
    })).map_err(|e| format!("发送事件失败: {}", e))?;

    Ok(())
}
```

### 事件类型定义

```typescript
// 事件载荷类型
interface SystemInfoUpdatedPayload {
  arch: string
  os: string
  version: string
  cpu_count: number
  total_memory: number
}

interface FileChangedPayload {
  path: string
  event_type: 'created' | 'modified' | 'deleted'
  timestamp: number
}

interface ProcessingProgressPayload {
  progress: number
  message: string
}

interface ProcessingCompletePayload {
  success: boolean
  result?: string
  error?: string
}
```

## 数据结构

### 通用响应结构

```typescript
// 成功响应
interface SuccessResponse<T> {
  success: true
  data: T
  message?: string
}

// 错误响应
interface ErrorResponse {
  success: false
  error: string
  code?: string
}

// 联合类型
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse
```

```rust
// Rust 对应结构
#[derive(Debug, Serialize)]
#[serde(tag = "success")]
pub enum ApiResponse<T> {
    #[serde(rename = "true")]
    Success {
        data: T,
        message: Option<String>,
    },
    #[serde(rename = "false")]
    Error {
        error: String,
        code: Option<String>,
    },
}
```

### 分页数据结构

```typescript
interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  has_next: boolean
  has_prev: boolean
}

interface PaginationRequest {
  page?: number
  page_size?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
```

```rust
#[derive(Debug, Serialize)]
pub struct PaginatedResponse<T> {
    pub items: Vec<T>,
    pub total: usize,
    pub page: usize,
    pub page_size: usize,
    pub has_next: bool,
    pub has_prev: bool,
}

#[derive(Debug, Deserialize)]
pub struct PaginationRequest {
    pub page: Option<usize>,
    pub page_size: Option<usize>,
    pub sort_by: Option<String>,
    pub sort_order: Option<String>,
}
```

## 错误处理

### 错误类型

```typescript
// 前端错误类型
enum ApiErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  INVALID_PARAMETER = 'INVALID_PARAMETER',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

interface ApiError {
  code: ApiErrorCode
  message: string
  details?: any
}
```

```rust
// 后端错误类型
#[derive(Debug, thiserror::Error)]
pub enum ApiError {
    #[error("网络错误: {0}")]
    NetworkError(String),

    #[error("权限被拒绝: {0}")]
    PermissionDenied(String),

    #[error("文件未找到: {0}")]
    FileNotFound(String),

    #[error("无效参数: {0}")]
    InvalidParameter(String),

    #[error("内部错误: {0}")]
    InternalError(String),
}

impl From<ApiError> for String {
    fn from(error: ApiError) -> Self {
        error.to_string()
    }
}
```

### 错误处理最佳实践

```typescript
// 前端错误处理
async function handleApiCall<T>(apiCall: () => Promise<T>): Promise<T | null> {
  try {
    return await apiCall()
  } catch (error) {
    console.error('API 调用失败:', error)

    // 根据错误类型进行处理
    if (typeof error === 'string') {
      if (error.includes('权限被拒绝')) {
        // 处理权限错误
        showPermissionDialog()
      } else if (error.includes('网络错误')) {
        // 处理网络错误
        showNetworkErrorDialog()
      } else {
        // 通用错误处理
        showErrorDialog(error)
      }
    }

    return null
  }
}

// 使用示例
const systemInfo = await handleApiCall(() =>
  invoke<SystemInfo>('get_system_info')
)

if (systemInfo) {
  console.log('系统信息:', systemInfo)
}
```

## 使用示例

### 自定义 Hook 封装

```typescript
// hooks/useSystemInfo.ts
import { useEffect, useState } from 'react'

import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/tauri'

interface SystemInfo {
  arch: string
  os: string
  version: string
  cpu_count: number
  total_memory: number
}

export function useSystemInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSystemInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      const info = await invoke<SystemInfo>('get_system_info')
      setSystemInfo(info)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemInfo()

    // 监听系统信息更新事件
    const unlisten = listen('system-info-updated', event => {
      setSystemInfo(event.payload as SystemInfo)
    })

    return () => {
      unlisten.then(fn => fn())
    }
  }, [])

  return {
    systemInfo,
    loading,
    error,
    refresh: fetchSystemInfo,
  }
}
```

### 文件操作 Hook

```typescript
// hooks/useFileOperations.ts
import { useState } from 'react'

import { invoke } from '@tauri-apps/api/tauri'

interface FileReadResponse {
  content: string
  size: number
}

export function useFileOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const readFile = async (path: string): Promise<FileReadResponse | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoke<FileReadResponse>('read_file_content', {
        request: { path },
      })
      return response
    } catch (err) {
      setError(err as string)
      return null
    } finally {
      setLoading(false)
    }
  }

  const writeFile = async (
    path: string,
    content: string,
    createDirs = false
  ): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await invoke<void>('write_file_content', {
        request: { path, content, create_dirs: createDirs },
      })
      return true
    } catch (err) {
      setError(err as string)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    readFile,
    writeFile,
    loading,
    error,
  }
}
```

### HTTP 请求 Hook

```typescript
// hooks/useHttpRequest.ts
import { useState } from 'react'

import { invoke } from '@tauri-apps/api/tauri'

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

export function useHttpRequest() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = async (config: HttpConfig): Promise<HttpResponse | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoke<HttpResponse>('make_http_request', {
        config,
      })
      return response
    } catch (err) {
      setError(err as string)
      return null
    } finally {
      setLoading(false)
    }
  }

  const get = (url: string, headers?: Record<string, string>) =>
    request({ method: 'GET', url, headers })

  const post = (url: string, body?: string, headers?: Record<string, string>) =>
    request({ method: 'POST', url, body, headers })

  const put = (url: string, body?: string, headers?: Record<string, string>) =>
    request({ method: 'PUT', url, body, headers })

  const del = (url: string, headers?: Record<string, string>) =>
    request({ method: 'DELETE', url, headers })

  return {
    request,
    get,
    post,
    put,
    delete: del,
    loading,
    error,
  }
}
```

### 组件使用示例

```typescript
// components/SystemInfoCard.tsx
import React from 'react';
import { useSystemInfo } from '../hooks/useSystemInfo';

export function SystemInfoCard() {
  const { systemInfo, loading, error, refresh } = useSystemInfo();

  if (loading) {
    return <div>加载系统信息中...</div>;
  }

  if (error) {
    return (
      <div>
        <p>加载失败: {error}</p>
        <button onClick={refresh}>重试</button>
      </div>
    );
  }

  if (!systemInfo) {
    return <div>无系统信息</div>;
  }

  return (
    <div className="system-info-card">
      <h3>系统信息</h3>
      <div className="info-grid">
        <div className="info-item">
          <label>架构:</label>
          <span>{systemInfo.arch}</span>
        </div>
        <div className="info-item">
          <label>操作系统:</label>
          <span>{systemInfo.os}</span>
        </div>
        <div className="info-item">
          <label>版本:</label>
          <span>{systemInfo.version}</span>
        </div>
        <div className="info-item">
          <label>CPU 核心:</label>
          <span>{systemInfo.cpu_count}</span>
        </div>
        <div className="info-item">
          <label>总内存:</label>
          <span>{(systemInfo.total_memory / 1024 / 1024 / 1024).toFixed(2)} GB</span>
        </div>
      </div>
      <button onClick={refresh}>刷新</button>
    </div>
  );
}
```

---

更多信息请参考：

- [开发指南](DEVELOPMENT_GUIDE.md)
- [环境配置指南](ENVIRONMENT_SETUP.md)
- [构建部署指南](BUILD_DEPLOYMENT.md)
- [故障排除指南](TROUBLESHOOTING.md)
