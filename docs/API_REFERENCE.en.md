# API Reference

This document provides detailed information about all API interfaces for
frontend-backend communication in the Tauri + React project, including command
invocations, event system, and data structure definitions.

## 📋 Table of Contents

- [Overview](#overview)
- [System Information API](#system-information-api)
- [File Operations API](#file-operations-api)
- [Window Management API](#window-management-api)
- [Network Request API](#network-request-api)
- [Event System](#event-system)
- [Data Structures](#data-structures)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

## Overview

### API Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│───►│   Tauri Bridge  │───►│   Rust Backend  │
│                 │    │                 │    │                 │
│ • invoke()      │    │ • Command Route │    │ • Command Handler│
│ • listen()      │    │ • Event Dispatch│    │ • Event Emitter │
│ • emit()        │    │ • Type Convert  │    │ • Business Logic│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Communication Methods

1. **Commands**: Frontend calls backend functionality
2. **Events**: Bidirectional event communication
3. **State Sync**: Real-time data synchronization

### Type Safety

All APIs use TypeScript type definitions to ensure compile-time type checking:

```typescript
// Frontend type definition
interface SystemInfo {
  arch: string;
  os: string;
  version: string;
  cpu_count: number;
  total_memory: number;
}

// Corresponding Rust structure
#[derive(Debug, Serialize)]
struct SystemInfo {
    arch: String,
    os: String,
    version: String,
    cpu_count: usize,
    total_memory: u64,
}
```

## System Information API

### Get System Architecture

**Command**: `get_system_arch`

```typescript
// Frontend call
import { invoke } from '@tauri-apps/api/tauri'

const arch = await invoke<string>('get_system_arch')
console.log('System architecture:', arch) // Output: "x86_64" or "aarch64"
```

```rust
// Backend implementation
#[tauri::command]
pub fn get_system_arch() -> String {
    std::env::consts::ARCH.to_string()
}
```

**Returns**:

- `string`: System architecture (e.g., "x86_64", "aarch64")

### Get Operating System Information

**Command**: `get_system_os`

```typescript
// Frontend call
const os = await invoke<string>('get_system_os')
console.log('Operating system:', os) // Output: "windows", "macos", "linux"
```

```rust
// Backend implementation
#[tauri::command]
pub fn get_system_os() -> String {
    std::env::consts::OS.to_string()
}
```

**Returns**:

- `string`: Operating system name

### Get CPU Core Count

**Command**: `get_cpu_count`

```typescript
// Frontend call
const cpuCount = await invoke<number>('get_cpu_count')
console.log('CPU cores:', cpuCount)
```

```rust
// Backend implementation
#[tauri::command]
pub fn get_cpu_count() -> usize {
    num_cpus::get()
}
```

**Returns**:

- `number`: Number of CPU cores

### Get Total Memory

**Command**: `get_total_memory`

```typescript
// Frontend call
const totalMemory = await invoke<number>('get_total_memory')
console.log('Total memory (GB):', (totalMemory / 1024 / 1024 / 1024).toFixed(2))
```

```rust
// Backend implementation
use sysinfo::{System, SystemExt};

#[tauri::command]
pub fn get_total_memory() -> u64 {
    let mut system = System::new_all();
    system.refresh_memory();
    system.total_memory() * 1024 // Convert to bytes
}
```

**Returns**:

- `number`: Total memory size (bytes)

### Get Complete System Information

**Command**: `get_system_info`

```typescript
// Type definition
interface SystemInfo {
  arch: string
  os: string
  version: string
  cpu_count: number
  total_memory: number
}

// Frontend call
const systemInfo = await invoke<SystemInfo>('get_system_info')
console.log('System info:', systemInfo)
```

```rust
// Backend implementation
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

**Returns**:

- `SystemInfo`: Complete system information object

## File Operations API

### Read File

**Command**: `read_file_content`

```typescript
// Type definitions
interface FileReadRequest {
  path: string
}

interface FileReadResponse {
  content: string
  size: number
}

// Frontend call
const response = await invoke<FileReadResponse>('read_file_content', {
  request: { path: '/path/to/file.txt' },
})
console.log('File content:', response.content)
console.log('File size:', response.size)
```

```rust
// Backend implementation
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
        Err(e) => Err(format!("Failed to read file: {}", e)),
    }
}
```

**Parameters**:

- `request.path`: File path

**Returns**:

- `FileReadResponse`: Contains file content and size

**Errors**:

- File not found
- Permission denied
- Unsupported file format

### Write File

**Command**: `write_file_content`

```typescript
// Type definition
interface FileWriteRequest {
  path: string
  content: string
  create_dirs?: boolean
}

// Frontend call
await invoke<void>('write_file_content', {
  request: {
    path: '/path/to/file.txt',
    content: 'Hello, World!',
    create_dirs: true,
  },
})
```

```rust
// Backend implementation
#[derive(Debug, Deserialize)]
pub struct FileWriteRequest {
    pub path: String,
    pub content: String,
    pub create_dirs: Option<bool>,
}

#[tauri::command]
pub async fn write_file_content(request: FileWriteRequest) -> Result<(), String> {
    let path = std::path::Path::new(&request.path);

    // Create directories if needed
    if request.create_dirs.unwrap_or(false) {
        if let Some(parent) = path.parent() {
            tokio::fs::create_dir_all(parent).await
                .map_err(|e| format!("Failed to create directories: {}", e))?;
        }
    }

    // Write file
    tokio::fs::write(path, &request.content).await
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(())
}
```

**Parameters**:

- `request.path`: File path
- `request.content`: File content
- `request.create_dirs`: Whether to create directories (optional)

**Returns**:

- `void`: No return value

**Errors**:

- Invalid path
- Permission denied
- Insufficient disk space

## Window Management API

### Create Loading Window

**Command**: `create_loading_window`

```typescript
// Frontend call
await invoke<void>('create_loading_window')
```

```rust
// Backend implementation
#[tauri::command]
pub async fn create_loading_window(app: tauri::AppHandle) -> Result<(), String> {
    let loading_window = tauri::WindowBuilder::new(
        &app,
        "loading",
        tauri::WindowUrl::App("loading.html".into())
    )
    .title("Loading...")
    .inner_size(400.0, 300.0)
    .center()
    .resizable(false)
    .decorations(false)
    .always_on_top(true)
    .build()
    .map_err(|e| format!("Failed to create loading window: {}", e))?;

    loading_window.show().map_err(|e| format!("Failed to show window: {}", e))?;
    Ok(())
}
```

### Notify Loading Ready

**Command**: `notify_loading_ready`

```typescript
// Frontend call
await invoke<void>('notify_loading_ready')
```

```rust
// Backend implementation
#[tauri::command]
pub async fn notify_loading_ready(app: tauri::AppHandle) -> Result<(), String> {
    // Close loading window
    if let Some(loading_window) = app.get_window("loading") {
        loading_window.close().map_err(|e| format!("Failed to close loading window: {}", e))?;
    }

    // Show main window
    if let Some(main_window) = app.get_window("main") {
        main_window.show().map_err(|e| format!("Failed to show main window: {}", e))?;
        main_window.set_focus().map_err(|e| format!("Failed to set focus: {}", e))?;
    }

    Ok(())
}
```

### Update Window Title

**Command**: `update_window_title`

```typescript
// Type definition
interface UpdateTitleRequest {
  title: string
  window_label?: string
}

// Frontend call
await invoke<void>('update_window_title', {
  request: {
    title: 'New Title',
    window_label: 'main',
  },
})
```

```rust
// Backend implementation
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
            .map_err(|e| format!("Failed to set window title: {}", e))?;
    } else {
        return Err(format!("Window '{}' not found", window_label));
    }

    Ok(())
}
```

## Network Request API

### HTTP Request

**Command**: `make_http_request`

```typescript
// Type definitions
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

// Frontend call
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

console.log('Response status:', response.status)
console.log('Response data:', JSON.parse(response.body))
```

```rust
// Backend implementation
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
        .map_err(|e| format!("Failed to create HTTP client: {}", e))?;

    let method = match config.method.to_uppercase().as_str() {
        "GET" => reqwest::Method::GET,
        "POST" => reqwest::Method::POST,
        "PUT" => reqwest::Method::PUT,
        "DELETE" => reqwest::Method::DELETE,
        "PATCH" => reqwest::Method::PATCH,
        _ => return Err("Unsupported HTTP method".to_string()),
    };

    let mut request = client.request(method, &config.url);

    // Add headers
    if let Some(headers) = config.headers {
        for (key, value) in headers {
            request = request.header(&key, &value);
        }
    }

    // Add body
    if let Some(body) = config.body {
        request = request.body(body);
    }

    // Send request
    let response = request.send().await
        .map_err(|e| format!("HTTP request failed: {}", e))?;

    let status = response.status().as_u16();

    // Extract response headers
    let mut headers = HashMap::new();
    for (key, value) in response.headers() {
        if let Ok(value_str) = value.to_str() {
            headers.insert(key.to_string(), value_str.to_string());
        }
    }

    // Get response body
    let body = response.text().await
        .map_err(|e| format!("Failed to read response body: {}", e))?;

    Ok(HttpResponse {
        status,
        headers,
        body,
    })
}
```

**Parameters**:

- `config.method`: HTTP method
- `config.url`: Request URL
- `config.headers`: Request headers (optional)
- `config.body`: Request body (optional)
- `config.timeout`: Timeout in milliseconds (optional)

**Returns**:

- `HttpResponse`: HTTP response object

**Errors**:

- Network connection failed
- Request timeout
- Server error

## Event System

### Frontend Event Listening

```typescript
import { listen } from '@tauri-apps/api/event'

// Listen to system events
const unlisten = await listen('system-info-updated', event => {
  console.log('System info updated:', event.payload)
})

// Listen to file change events
const unlistenFile = await listen('file-changed', event => {
  console.log('File changed:', event.payload)
})

// Unsubscribe
unlisten()
unlistenFile()
```

### Frontend Event Emission

```typescript
import { emit } from '@tauri-apps/api/event'

// Emit user action event
await emit('user-action', {
  action: 'button-click',
  target: 'save-button',
  timestamp: Date.now(),
})
```

### Backend Event Emission

```rust
// Emit events in command handlers
#[tauri::command]
pub async fn process_data(app: tauri::AppHandle) -> Result<(), String> {
    // Process data...

    // Emit progress event
    app.emit_all("processing-progress", serde_json::json!({
        "progress": 50,
        "message": "Processing..."
    })).map_err(|e| format!("Failed to emit event: {}", e))?;

    // Processing complete
    app.emit_all("processing-complete", serde_json::json!({
        "success": true,
        "result": "Processing complete"
    })).map_err(|e| format!("Failed to emit event: {}", e))?;

    Ok(())
}
```

### Event Type Definitions

```typescript
// Event payload types
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

## Data Structures

### Generic Response Structure

```typescript
// Success response
interface SuccessResponse<T> {
  success: true
  data: T
  message?: string
}

// Error response
interface ErrorResponse {
  success: false
  error: string
  code?: string
}

// Union type
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse
```

```rust
// Rust corresponding structure
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

### Paginated Data Structure

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

## Error Handling

### Error Types

```typescript
// Frontend error types
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
// Backend error types
#[derive(Debug, thiserror::Error)]
pub enum ApiError {
    #[error("Network error: {0}")]
    NetworkError(String),

    #[error("Permission denied: {0}")]
    PermissionDenied(String),

    #[error("File not found: {0}")]
    FileNotFound(String),

    #[error("Invalid parameter: {0}")]
    InvalidParameter(String),

    #[error("Internal error: {0}")]
    InternalError(String),
}

impl From<ApiError> for String {
    fn from(error: ApiError) -> Self {
        error.to_string()
    }
}
```

### Error Handling Best Practices

```typescript
// Frontend error handling
async function handleApiCall<T>(apiCall: () => Promise<T>): Promise<T | null> {
  try {
    return await apiCall()
  } catch (error) {
    console.error('API call failed:', error)

    // Handle different error types
    if (typeof error === 'string') {
      if (error.includes('Permission denied')) {
        // Handle permission error
        showPermissionDialog()
      } else if (error.includes('Network error')) {
        // Handle network error
        showNetworkErrorDialog()
      } else {
        // Generic error handling
        showErrorDialog(error)
      }
    }

    return null
  }
}

// Usage example
const systemInfo = await handleApiCall(() =>
  invoke<SystemInfo>('get_system_info')
)

if (systemInfo) {
  console.log('System info:', systemInfo)
}
```

## Usage Examples

### Custom Hook Wrapper

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

    // Listen to system info update events
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

### File Operations Hook

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

### HTTP Request Hook

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

### Component Usage Example

```typescript
// components/SystemInfoCard.tsx
import React from 'react';
import { useSystemInfo } from '../hooks/useSystemInfo';

export function SystemInfoCard() {
  const { systemInfo, loading, error, refresh } = useSystemInfo();

  if (loading) {
    return <div>Loading system information...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Loading failed: {error}</p>
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }

  if (!systemInfo) {
    return <div>No system information</div>;
  }

  return (
    <div className="system-info-card">
      <h3>System Information</h3>
      <div className="info-grid">
        <div className="info-item">
          <label>Architecture:</label>
          <span>{systemInfo.arch}</span>
        </div>
        <div className="info-item">
          <label>Operating System:</label>
          <span>{systemInfo.os}</span>
        </div>
        <div className="info-item">
          <label>Version:</label>
          <span>{systemInfo.version}</span>
        </div>
        <div className="info-item">
          <label>CPU Cores:</label>
          <span>{systemInfo.cpu_count}</span>
        </div>
        <div className="info-item">
          <label>Total Memory:</label>
          <span>{(systemInfo.total_memory / 1024 / 1024 / 1024).toFixed(2)} GB</span>
        </div>
      </div>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

---

For more information, please refer to:

- [Development Guide](DEVELOPMENT_GUIDE.en.md)
- [Environment Setup Guide](ENVIRONMENT_SETUP.en.md)
- [Build & Deployment Guide](BUILD_DEPLOYMENT.en.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)
