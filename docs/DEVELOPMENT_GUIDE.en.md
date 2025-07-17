# Development Guide

This document provides a comprehensive development guide for the Tauri + React
project, including project architecture, development workflow, best practices,
and common patterns.

## 📋 Table of Contents

- [Project Architecture](#project-architecture)
- [Development Workflow](#development-workflow)
- [Frontend Development](#frontend-development)
- [Backend Development](#backend-development)
- [Frontend-Backend Communication](#frontend-backend-communication)
- [State Management](#state-management)
- [Styling and Theming](#styling-and-theming)
- [Testing Strategy](#testing-strategy)
- [Performance Optimization](#performance-optimization)
- [Best Practices](#best-practices)

## Project Architecture

### Overall Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   React Frontend│◄──►│   Rust Backend  │
│                 │    │                 │
│ • UI Rendering  │    │ • System APIs   │
│ • User Interaction│   │ • File Operations│
│ • State Management│   │ • Network Requests│
│ • Route Navigation│   │ • Data Processing│
└─────────────────┘    └─────────────────┘
        │                        │
        └────────── IPC ──────────┘
           (Commands & Events)
```

### Directory Structure Explained

```
template-tauri-react/
├── src/                    # React frontend code
│   ├── components/         # Reusable components
│   │   ├── ui/            # Basic UI components
│   │   ├── layout/        # Layout components
│   │   └── features/      # Feature components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom hooks
│   ├── store/             # State management
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   ├── styles/            # Style files
│   └── router/            # Route configuration
├── src-tauri/             # Rust backend code
│   ├── src/
│   │   ├── main.rs        # Application entry
│   │   ├── lib.rs         # Main logic
│   │   ├── handlers.rs    # Command handlers
│   │   └── utils/         # Utility modules
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
├── public/                # Static assets
├── scripts/               # Build scripts
└── docs/                  # Project documentation
```

## Development Workflow

### 1. Environment Setup

```bash
# Clone the project
git clone <repository-url>
cd template-tauri-react

# Install dependencies
npm install

# Check environment
npm run check:env
```

### 2. Development Mode

```bash
# Start development server
npm run dev

# Or start frontend and backend separately
npm run dev:frontend  # Start React development server
npm run dev:tauri     # Start Tauri development mode
```

### 3. Code Quality Checks

```bash
# Code formatting
npm run format

# Code linting
npm run lint

# Type checking
npm run type-check

# Run tests
npm run test
```

### 4. Build and Package

```bash
# Development build
npm run build

# Production build
npm run build:tauri

# Local build

> **Note**: PC cross-platform builds are handled by GitHub Actions. Local development only needs to build for current system.
npm run build:all
```

## Frontend Development

### Component Development Standards

#### 1. Functional Components

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
        <button onClick={onEdit}>Edit</button>
      )}
    </div>
  );
};
```

#### 2. Custom Hooks

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

#### 3. Page Components

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
  if (!systemInfo) return <div>No system information</div>;

  return (
    <div className="system-page">
      <h1>System Information</h1>
      <div className="info-grid">
        <div>Platform: {systemInfo.platform}</div>
        <div>Architecture: {systemInfo.arch}</div>
        <div>Version: {systemInfo.version}</div>
      </div>
    </div>
  );
};
```

### Route Configuration

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
    title: 'Home',
    icon: 'home',
  },
  {
    path: '/system',
    component: SystemPage,
    title: 'System Info',
    icon: 'system',
  },
  {
    path: '/settings',
    component: SettingsPage,
    title: 'Settings',
    icon: 'settings',
  },
]
```

## Backend Development

### Command Handlers

#### 1. Basic Commands

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

#### 2. Async Commands

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

        // Emit progress event
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

#### 3. State Management

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

### Main Application Setup

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
            // System information
            get_system_info,
            get_file_info,

            // Async operations
            download_file,

            // State management
            get_setting,
            set_setting,
        ])
        .setup(|app| {
            // Application initialization logic
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

## Frontend-Backend Communication

### Command Invocation

#### 1. Basic Invocation

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

#### 2. Error Handling

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

### Event System

#### 1. Event Listening

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

#### 2. Using Events

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

  // Listen to download progress events
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
        {downloading ? 'Downloading...' : 'Start Download'}
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

## State Management

### Zustand State Management

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
      language: 'en',
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

### System State Management

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

## Styling and Theming

### CSS Variables Theme

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

### Theme Switching

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

## Testing Strategy

### Frontend Testing

#### 1. Component Testing

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

    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
```

#### 2. Hook Testing

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

### Backend Testing

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

## Performance Optimization

### Frontend Optimization

#### 1. Component Optimization

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

#### 2. State Optimization

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

// Usage example
const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

### Backend Optimization

#### 1. Async Processing

```rust
// src-tauri/src/handlers.rs
use tokio::sync::Semaphore;
use std::sync::Arc;

// Limit concurrency
static SEMAPHORE: once_cell::sync::Lazy<Arc<Semaphore>> =
    once_cell::sync::Lazy::new(|| Arc::new(Semaphore::new(10)));

#[tauri::command]
pub async fn process_files(file_paths: Vec<String>) -> Result<Vec<String>, String> {
    let mut tasks = Vec::new();

    for path in file_paths {
        let permit = SEMAPHORE.clone().acquire_owned().await
            .map_err(|e| format!("Failed to acquire semaphore: {}", e))?;

        let task = tokio::spawn(async move {
            let _permit = permit; // Keep permit until task completes
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
    // Simulate file processing
    tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
    Ok(format!("Processed: {}", path))
}
```

#### 2. Caching Mechanism

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

## Best Practices

### 1. Code Organization

- **Single Responsibility Principle**: Each component and function should have
  one responsibility
- **Modular Design**: Organize related functionality into the same module
- **Interface Separation**: Define clear interfaces and types
- **Dependency Injection**: Pass dependencies through props and context

### 2. Error Handling

- **Unified Error Handling**: Use consistent error handling mechanisms
- **User-Friendly Error Messages**: Provide clear error messages
- **Error Boundaries**: Use React Error Boundaries to catch component errors
- **Logging**: Record detailed error logs for debugging

### 3. Security

- **Input Validation**: Validate all user input and external data
- **Permission Control**: Limit access permissions for Tauri commands
- **Data Encryption**: Encrypt sensitive data storage
- **Security Updates**: Keep dependencies updated and fix security
  vulnerabilities

### 4. Performance

- **Lazy Loading**: Load components and resources on demand
- **Caching Strategy**: Use caching appropriately to reduce redundant
  calculations
- **Batch Operations**: Combine multiple operations into batch operations
- **Memory Management**: Clean up unnecessary resources promptly

### 5. Maintainability

- **Code Comments**: Add clear comments for complex logic
- **Type Safety**: Fully utilize TypeScript's type system
- **Test Coverage**: Write comprehensive unit and integration tests
- **Documentation Updates**: Keep documentation synchronized with code

---

For more detailed information, please refer to:

- [Environment Setup Guide](ENVIRONMENT_SETUP.en.md)
- [Build Deployment Guide](BUILD_DEPLOYMENT.en.md)
- [Troubleshooting Guide](TROUBLESHOOTING.en.md)
