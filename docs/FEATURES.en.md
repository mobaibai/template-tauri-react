# Features

This document provides a detailed overview of all features in the Tauri + React
project, including frontend interfaces, backend system functionality,
animations, network requests, and 3D model display.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Home Page Features](#home-page-features)
- [Functional Components](#functional-components)
- [Animation System](#animation-system)
- [Network Requests](#network-requests)
- [3D Model Display](#3d-model-display)
- [System Features](#system-features)
- [Theme System](#theme-system)
- [Route Navigation](#route-navigation)
- [State Management](#state-management)
- [Performance Optimization](#performance-optimization)

## Project Overview

### Technical Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│───►│   Tauri Bridge  │───►│   Rust Backend  │
│                 │    │                 │    │                 │
│ • UI Components │    │ • Command Route │    │ • System API    │
│ • State Mgmt    │    │ • Event Dispatch│    │ • File Ops      │
│ • Route Nav     │    │ • Type Convert  │    │ • Network Req   │
│ • Animations    │    │ • Security      │    │ • Business Logic│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Core Features

- **🎨 Modern UI**: Built with React 18 + TypeScript
- **⚡ High Performance**: Native-level performance with Rust backend
- **🔒 Secure & Reliable**: Tauri security architecture with precise permission
  control
- **📱 Cross-Platform**: Supports Windows, macOS, Linux, iOS, Android
- **🎭 Theme System**: Light/dark theme switching support
- **🌐 Network Features**: Complete HTTP request support
- **📊 System Monitoring**: Real-time system information retrieval
- **🎬 Animation Effects**: Rich interactive animations
- **📁 File Operations**: Secure file read/write functionality

## Home Page Features

### Welcome Interface

The home page provides an overall project introduction and quick navigation:

```typescript
// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Components',
      description: 'Showcase various UI components and interactive features',
      path: '/components',
      icon: '🧩'
    },
    {
      title: 'Animations',
      description: 'Rich animation effects and transitions',
      path: '/animations',
      icon: '🎬'
    },
    {
      title: 'Network',
      description: 'HTTP requests and API call examples',
      path: '/network',
      icon: '🌐'
    },
    {
      title: '3D Models',
      description: '3D model loading and display functionality',
      path: '/models',
      icon: '🎯'
    }
  ];

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Tauri + React Template</h1>
        <p>Modern desktop application development template</p>
      </header>

      <section className="features-grid">
        {features.map((feature) => (
          <div key={feature.path} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <Button onClick={() => navigate(feature.path)}>
              View Details
            </Button>
          </div>
        ))}
      </section>
    </div>
  );
}
```

### System Information Display

The home page integrates system information display components:

```typescript
// components/SystemInfo.tsx
import React from 'react';
import { useSystemInfo } from '../hooks/useSystemInfo';

export function SystemInfo() {
  const { systemInfo, loading, error } = useSystemInfo();

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!systemInfo) return null;

  return (
    <div className="system-info">
      <h3>System Information</h3>
      <div className="info-grid">
        <div className="info-item">
          <span className="label">Architecture:</span>
          <span className="value">{systemInfo.arch}</span>
        </div>
        <div className="info-item">
          <span className="label">OS:</span>
          <span className="value">{systemInfo.os}</span>
        </div>
        <div className="info-item">
          <span className="label">CPU Cores:</span>
          <span className="value">{systemInfo.cpu_count}</span>
        </div>
        <div className="info-item">
          <span className="label">Total Memory:</span>
          <span className="value">
            {(systemInfo.total_memory / 1024 / 1024 / 1024).toFixed(2)} GB
          </span>
        </div>
      </div>
    </div>
  );
}
```

## Functional Components

### Navigation Component

Provides in-app navigation functionality:

```typescript
// components/Navigation.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export function Navigation() {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/components', label: 'Components', icon: '🧩' },
    { path: '/animations', label: 'Animations', icon: '🎬' },
    { path: '/network', label: 'Network', icon: '🌐' },
    { path: '/models', label: 'Models', icon: '🎯' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>Tauri App</h2>
      </div>

      <ul className="nav-menu">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}
```

### Global Modal

Unified modal management system:

```typescript
// components/GlobalModal.tsx
import React from 'react';
import { useModal } from '../hooks/useModal';
import { Modal } from './ui/Modal';

export function GlobalModal() {
  const { modals, closeModal } = useModal();

  return (
    <>
      {modals.map((modal) => (
        <Modal
          key={modal.id}
          isOpen={modal.isOpen}
          onClose={() => closeModal(modal.id)}
          title={modal.title}
          size={modal.size}
        >
          {modal.content}
        </Modal>
      ))}
    </>
  );
}

// hooks/useModal.ts
import { create } from 'zustand';

interface ModalState {
  id: string;
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface ModalStore {
  modals: ModalState[];
  openModal: (modal: Omit<ModalState, 'isOpen'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  modals: [],

  openModal: (modal) => set((state) => ({
    modals: [...state.modals, { ...modal, isOpen: true }]
  })),

  closeModal: (id) => set((state) => ({
    modals: state.modals.filter(modal => modal.id !== id)
  })),

  closeAllModals: () => set({ modals: [] })
}));
```

### Icon Showcase

Icon library and icon selector:

```typescript
// components/IconShowcase.tsx
import React, { useState } from 'react';
import { Icon } from './ui/Icon';

const iconList = [
  'home', 'user', 'settings', 'search', 'heart', 'star',
  'download', 'upload', 'edit', 'delete', 'add', 'close',
  'check', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down'
];

export function IconShowcase() {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = iconList.filter(icon =>
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="icon-showcase">
      <div className="showcase-header">
        <h2>Icon Showcase</h2>
        <input
          type="text"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="icon-search"
        />
      </div>

      <div className="icon-grid">
        {filteredIcons.map((iconName) => (
          <div
            key={iconName}
            className={`icon-item ${
              selectedIcon === iconName ? 'selected' : ''
            }`}
            onClick={() => setSelectedIcon(iconName)}
          >
            <Icon name={iconName} size={24} />
            <span className="icon-name">{iconName}</span>
          </div>
        ))}
      </div>

      {selectedIcon && (
        <div className="icon-preview">
          <h3>Selected Icon: {selectedIcon}</h3>
          <div className="icon-sizes">
            {[16, 20, 24, 32, 48].map(size => (
              <div key={size} className="size-demo">
                <Icon name={selectedIcon} size={size} />
                <span>{size}px</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Animation System

### Page Transition Animations

```typescript
// components/PageTransition.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      x: -20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      x: 20,
      scale: 0.98
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="page-container"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### Interactive Animation Components

```typescript
// components/AnimationDemo.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimationDemo() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div className="animation-demo">
      <h2>Animation Showcase</h2>

      {/* Expand/Collapse Animation */}
      <section className="demo-section">
        <h3>Expand Animation</h3>
        <motion.div
          className="expandable-card"
          layout
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.h4 layout>Click to Expand/Collapse</motion.h4>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="expanded-content"
              >
                <p>This is the expanded content area</p>
                <p>Supports smooth height animations</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Number Animation */}
      <section className="demo-section">
        <h3>Number Animation</h3>
        <div className="counter-demo">
          <motion.span
            key={count}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="counter-number"
          >
            {count}
          </motion.span>
          <div className="counter-controls">
            <button onClick={() => setCount(count - 1)}>-</button>
            <button onClick={() => setCount(count + 1)}>+</button>
          </div>
        </div>
      </section>

      {/* Hover Effects */}
      <section className="demo-section">
        <h3>Hover Effects</h3>
        <div className="hover-demo">
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              className="hover-card"
              whileHover={{
                y: -10,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Card {item}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

### Loading Animations

```typescript
// components/LoadingAnimations.tsx
import React from 'react';
import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <motion.div
      className="loading-spinner"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <div className="spinner-circle" />
    </motion.div>
  );
}

export function LoadingDots() {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -10 }
  };

  return (
    <div className="loading-dots">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="loading-dot"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );
}

export function LoadingPulse() {
  return (
    <motion.div
      className="loading-pulse"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div className="pulse-circle" />
    </motion.div>
  );
}
```

## Network Requests

### HTTP Request Management

```typescript
// pages/NetworkDemo.tsx
import React, { useState } from 'react';
import { useHttpRequest } from '../hooks/useHttpRequest';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export function NetworkDemo() {
  const { request, loading, error } = useHttpRequest();
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [headers, setHeaders] = useState('{}');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);

  const handleRequest = async () => {
    try {
      const parsedHeaders = JSON.parse(headers || '{}');
      const result = await request({
        method,
        url,
        headers: parsedHeaders,
        body: body || undefined
      });

      if (result) {
        setResponse({
          status: result.status,
          headers: result.headers,
          body: JSON.parse(result.body)
        });
      }
    } catch (err) {
      console.error('Request failed:', err);
    }
  };

  return (
    <div className="network-demo">
      <h2>Network Request Demo</h2>

      <div className="request-form">
        <div className="form-row">
          <Select
            value={method}
            onChange={(value) => setMethod(value as any)}
            options={[
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'DELETE', label: 'DELETE' }
            ]}
          />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Request URL"
            className="url-input"
          />
        </div>

        <div className="form-row">
          <Input
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            placeholder='Headers (JSON format, e.g.: {"Content-Type": "application/json"})'
            className="headers-input"
          />
        </div>

        {(method === 'POST' || method === 'PUT') && (
          <div className="form-row">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Request body (JSON format)"
              className="body-input"
              rows={4}
            />
          </div>
        )}

        <Button
          onClick={handleRequest}
          disabled={loading}
          className="send-button"
        >
          {loading ? 'Sending...' : 'Send Request'}
        </Button>
      </div>

      {error && (
        <div className="error-message">
          <h3>Request Error</h3>
          <pre>{error}</pre>
        </div>
      )}

      {response && (
        <div className="response-display">
          <h3>Response</h3>
          <div className="response-status">
            <span className={`status-code ${response.status < 400 ? 'success' : 'error'}`}>
              {response.status}
            </span>
          </div>

          <div className="response-headers">
            <h4>Headers</h4>
            <pre>{JSON.stringify(response.headers, null, 2)}</pre>
          </div>

          <div className="response-body">
            <h4>Body</h4>
            <pre>{JSON.stringify(response.body, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
```

### API Service Wrapper

```typescript
// services/apiService.ts
import { invoke } from '@tauri-apps/api/tauri'

interface ApiConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

class ApiService {
  private config: ApiConfig

  constructor(config: ApiConfig = {}) {
    this.config = {
      baseURL: '',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    }
  }

  private async makeRequest(method: string, url: string, data?: any) {
    const fullUrl = this.config.baseURL + url

    const requestConfig = {
      method: method.toUpperCase(),
      url: fullUrl,
      headers: this.config.headers,
      timeout: this.config.timeout,
      body: data ? JSON.stringify(data) : undefined,
    }

    const response = await invoke('make_http_request', {
      config: requestConfig,
    })
    return response
  }

  async get(url: string, params?: Record<string, any>) {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : ''
    return this.makeRequest('GET', url + queryString)
  }

  async post(url: string, data?: any) {
    return this.makeRequest('POST', url, data)
  }

  async put(url: string, data?: any) {
    return this.makeRequest('PUT', url, data)
  }

  async delete(url: string) {
    return this.makeRequest('DELETE', url)
  }
}

// Create default instance
export const apiService = new ApiService({
  baseURL: 'https://api.example.com',
  timeout: 30000,
})

// Create specific service instance
export const jsonPlaceholderApi = new ApiService({
  baseURL: 'https://jsonplaceholder.typicode.com',
})
```

## 3D Model Display

### Three.js Integration

```typescript
// components/ModelViewer.tsx
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ModelViewerProps {
  modelPath?: string;
  width?: number;
  height?: number;
}

export function ModelViewer({
  modelPath = '/models/sample.glb',
  width = 800,
  height = 600
}: ModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // Set model shadows
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Calculate model bounding box and center
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        scene.add(model);
        setLoading(false);
      },
      (progress) => {
        console.log('Loading progress:', progress);
      },
      (error) => {
        console.error('Model loading error:', error);
        setError('Failed to load model');
        setLoading(false);
      }
    );

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup function
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath, width, height]);

  if (loading) {
    return (
      <div className="model-viewer-loading" style={{ width, height }}>
        <div className="loading-spinner">Loading model...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="model-viewer-error" style={{ width, height }}>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="model-viewer">
      <div ref={mountRef} className="model-container" />
      <div className="model-controls">
        <p>Drag to rotate, scroll to zoom</p>
      </div>
    </div>
  );
}
```

### Model Manager

```typescript
// components/ModelManager.tsx
import React, { useState } from 'react';
import { ModelViewer } from './ModelViewer';
import { Button } from './ui/Button';
import { Select } from './ui/Select';

const availableModels = [
  { value: '/models/cube.glb', label: 'Cube' },
  { value: '/models/sphere.glb', label: 'Sphere' },
  { value: '/models/character.glb', label: 'Character' },
  { value: '/models/building.glb', label: 'Building' }
];

export function ModelManager() {
  const [selectedModel, setSelectedModel] = useState(availableModels[0].value);
  const [viewerSize, setViewerSize] = useState({ width: 800, height: 600 });
  const [showWireframe, setShowWireframe] = useState(false);

  return (
    <div className="model-manager">
      <h2>3D Model Display</h2>

      <div className="model-controls">
        <div className="control-group">
          <label>Select Model:</label>
          <Select
            value={selectedModel}
            onChange={setSelectedModel}
            options={availableModels}
          />
        </div>

        <div className="control-group">
          <label>Viewer Size:</label>
          <div className="size-controls">
            <input
              type="number"
              value={viewerSize.width}
              onChange={(e) => setViewerSize(prev => ({
                ...prev,
                width: parseInt(e.target.value)
              }))}
              min="400"
              max="1200"
            />
            <span>×</span>
            <input
              type="number"
              value={viewerSize.height}
              onChange={(e) => setViewerSize(prev => ({
                ...prev,
                height: parseInt(e.target.value)
              }))}
              min="300"
              max="800"
            />
          </div>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showWireframe}
              onChange={(e) => setShowWireframe(e.target.checked)}
            />
            Show Wireframe
          </label>
        </div>
      </div>

      <div className="model-display">
        <ModelViewer
          modelPath={selectedModel}
          width={viewerSize.width}
          height={viewerSize.height}
        />
      </div>

      <div className="model-info">
        <h3>Model Information</h3>
        <p>Current Model: {availableModels.find(m => m.value === selectedModel)?.label}</p>
        <p>Size: {viewerSize.width} × {viewerSize.height}</p>
        <p>Wireframe Mode: {showWireframe ? 'On' : 'Off'}</p>
      </div>
    </div>
  );
}
```

## System Features

### System Information Monitoring

```typescript
// components/SystemMonitor.tsx
import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';

interface SystemStats {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_speed: {
    download: number;
    upload: number;
  };
}

export function SystemMonitor() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isMonitoring) {
      // Start monitoring
      interval = setInterval(async () => {
        try {
          const systemStats = await invoke<SystemStats>('get_system_stats');
          setStats(systemStats);
        } catch (error) {
          console.error('Failed to get system stats:', error);
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isMonitoring]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  return (
    <div className="system-monitor">
      <div className="monitor-header">
        <h3>System Monitor</h3>
        <button
          className={`monitor-toggle ${isMonitoring ? 'active' : ''}`}
          onClick={toggleMonitoring}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h4>CPU Usage</h4>
            <div className="stat-value">{stats.cpu_usage.toFixed(1)}%</div>
            <div className="stat-bar">
              <div
                className="stat-fill cpu"
                style={{ width: `${stats.cpu_usage}%` }}
              />
            </div>
          </div>

          <div className="stat-card">
            <h4>Memory Usage</h4>
            <div className="stat-value">{stats.memory_usage.toFixed(1)}%</div>
            <div className="stat-bar">
              <div
                className="stat-fill memory"
                style={{ width: `${stats.memory_usage}%` }}
              />
            </div>
          </div>

          <div className="stat-card">
            <h4>Disk Usage</h4>
            <div className="stat-value">{stats.disk_usage.toFixed(1)}%</div>
            <div className="stat-bar">
              <div
                className="stat-fill disk"
                style={{ width: `${stats.disk_usage}%` }}
              />
            </div>
          </div>

          <div className="stat-card">
            <h4>Network Speed</h4>
            <div className="network-stats">
              <div className="network-item">
                <span>Download:</span>
                <span>{(stats.network_speed.download / 1024).toFixed(1)} KB/s</span>
              </div>
              <div className="network-item">
                <span>Upload:</span>
                <span>{(stats.network_speed.upload / 1024).toFixed(1)} KB/s</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### File Manager

```typescript
// components/FileManager.tsx
import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open, save } from '@tauri-apps/api/dialog';
import { Button } from './ui/Button';
import { Icon } from './ui/Icon';

interface FileItem {
  name: string;
  path: string;
  is_dir: boolean;
  size?: number;
  modified?: string;
}

export function FileManager() {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDirectory = async (path: string) => {
    try {
      setLoading(true);
      const fileList = await invoke<FileItem[]>('list_directory', { path });
      setFiles(fileList);
      setCurrentPath(path);
    } catch (error) {
      console.error('Failed to load directory:', error);
    } finally {
      setLoading(false);
    }
  };

  const openFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        directory: false
      });

      if (selected && typeof selected === 'string') {
        const content = await invoke<string>('read_file_content', {
          request: { path: selected }
        });
        console.log('File content:', content);
      }
    } catch (error) {
      console.error('Failed to open file:', error);
    }
  };

  const saveFile = async () => {
    try {
      const filePath = await save({
        defaultPath: 'untitled.txt'
      });

      if (filePath) {
        await invoke('write_file_content', {
          request: {
            path: filePath,
            content: 'Hello from Tauri!',
            create_dirs: true
          }
        });
        console.log('File saved:', filePath);
      }
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  };

  const handleFileClick = (file: FileItem) => {
    if (file.is_dir) {
      loadDirectory(file.path);
    } else {
      setSelectedFile(file);
    }
  };

  const goBack = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    if (parentPath) {
      loadDirectory(parentPath);
    }
  };

  return (
    <div className="file-manager">
      <div className="file-manager-header">
        <h3>File Manager</h3>
        <div className="file-actions">
          <Button onClick={openFile} size="sm">
            <Icon name="folder-open" size={16} />
            Open File
          </Button>
          <Button onClick={saveFile} size="sm">
            <Icon name="save" size={16} />
            Save File
          </Button>
        </div>
      </div>

      <div className="file-navigation">
        <Button onClick={goBack} disabled={!currentPath} size="sm">
          <Icon name="arrow-left" size={16} />
          Back
        </Button>
        <span className="current-path">{currentPath || 'Select Directory'}</span>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="file-list">
          {files.map((file) => (
            <div
              key={file.path}
              className={`file-item ${
                selectedFile?.path === file.path ? 'selected' : ''
              }`}
              onClick={() => handleFileClick(file)}
            >
              <Icon
                name={file.is_dir ? 'folder' : 'file'}
                size={20}
                className="file-icon"
              />
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                {!file.is_dir && file.size && (
                  <div className="file-size">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFile && (
        <div className="file-details">
          <h4>File Details</h4>
          <div className="detail-item">
            <span>Name:</span>
            <span>{selectedFile.name}</span>
          </div>
          <div className="detail-item">
            <span>Path:</span>
            <span>{selectedFile.path}</span>
          </div>
          {selectedFile.size && (
            <div className="detail-item">
              <span>Size:</span>
              <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

## Theme System

### Theme Management

```typescript
// hooks/useTheme.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeStore {
  theme: Theme;
  systemTheme: 'light' | 'dark';
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useTheme = create<ThemeStore>()(n  persist(
    (set, get) => ({
      theme: 'auto',
      systemTheme: 'light',
      effectiveTheme: 'light',

      setTheme: (theme) => {
        set({ theme });
        updateEffectiveTheme();
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        updateEffectiveTheme();
      }
    }),
    {
      name: 'theme-storage'
    }
  )
);

// Update effective theme
function updateEffectiveTheme() {
  const { theme, systemTheme } = useTheme.getState();
  const effectiveTheme = theme === 'auto' ? systemTheme : theme;

  useTheme.setState({ effectiveTheme });

  // Update DOM
  document.documentElement.setAttribute('data-theme', effectiveTheme);
  document.documentElement.className = effectiveTheme;
}

// Listen to system theme changes
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    useTheme.setState({ systemTheme: e.matches ? 'dark' : 'light' });
    updateEffectiveTheme();
  };

  mediaQuery.addEventListener('change', handleSystemThemeChange);

  // Initialize system theme
  useTheme.setState({ systemTheme: mediaQuery.matches ? 'dark' : 'light' });
  updateEffectiveTheme();
}
```

### Theme Toggle Component

```typescript
// components/ThemeToggle.tsx
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Button } from './ui/Button';
import { Icon } from './ui/Icon';

export function ThemeToggle() {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'auto', label: 'Auto', icon: 'monitor' }
  ];

  return (
    <div className="theme-toggle">
      <div className="theme-options">
        {themeOptions.map((option) => (
          <Button
            key={option.value}
            variant={theme === option.value ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTheme(option.value as any)}
            className="theme-option"
          >
            <Icon name={option.icon} size={16} />
            {option.label}
          </Button>
        ))}
      </div>

      <div className="quick-toggle">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          title={`Switch to ${effectiveTheme === 'light' ? 'dark' : 'light'} theme`}
        >
          <Icon name={effectiveTheme === 'light' ? 'moon' : 'sun'} size={20} />
        </Button>
      </div>
    </div>
  );
}
```

## Route Navigation

### Route Configuration

```typescript
// router/index.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Home } from '../pages/Home';
import { Components } from '../pages/Components';
import { Animations } from '../pages/Animations';
import { Network } from '../pages/Network';
import { Models } from '../pages/Models';
import { NotFound } from '../pages/NotFound';
import { Loading } from '../pages/Loading';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'components',
        element: <Components />
      },
      {
        path: 'animations',
        element: <Animations />
      },
      {
        path: 'network',
        element: <Network />
      },
      {
        path: 'models',
        element: <Models />
      }
    ]
  },
  {
    path: '/loading',
    element: <Loading />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
```

### Breadcrumb Navigation

```typescript
// components/Breadcrumb.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from './ui/Icon';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const routeLabels: Record<string, string> = {
  '': 'Home',
  'components': 'Components',
  'animations': 'Animations',
  'network': 'Network',
  'models': '3D Models'
};

export function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', path: '/' }
  ];

  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] || segment;
    breadcrumbItems.push({ label, path: currentPath });
  });

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className="breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <Icon name="chevron-right" size={14} className="breadcrumb-separator" />
          )}
          {index === breadcrumbItems.length - 1 ? (
            <span className="breadcrumb-current">{item.label}</span>
          ) : (
            <Link to={item.path} className="breadcrumb-link">
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
```

## State Management

### Global State

```typescript
// store/appStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  loading: boolean;

  // User Settings
  settings: {
    language: 'zh' | 'en';
    autoSave: boolean;
    notifications: boolean;
  };

  // App Data
  recentFiles: string[];
  bookmarks: string[];

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  addRecentFile: (file: string) => void;
  addBookmark: (bookmark: string) => void;
  removeBookmark: (bookmark: string) => void;
}

export const useAppStore = create<AppState>()(n  devtools(
    persist(
      (set, get) => ({
        // Initial state
        sidebarOpen: true,
        loading: false,
        settings: {
          language: 'en',
          autoSave: true,
          notifications: true
        },
        recentFiles: [],
        bookmarks: [],

        // Actions
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setLoading: (loading) => set({ loading }),

        updateSettings: (newSettings) => set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),

        addRecentFile: (file) => set((state) => {
          const recentFiles = [file, ...state.recentFiles.filter(f => f !== file)]
            .slice(0, 10); // Keep only recent 10 files
          return { recentFiles };
        }),

        addBookmark: (bookmark) => set((state) => {
          if (!state.bookmarks.includes(bookmark)) {
            return { bookmarks: [...state.bookmarks, bookmark] };
          }
          return state;
        }),

        removeBookmark: (bookmark) => set((state) => ({
          bookmarks: state.bookmarks.filter(b => b !== bookmark)
        }))
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          settings: state.settings,
          recentFiles: state.recentFiles,
          bookmarks: state.bookmarks
        })
      }
    ),
    {
      name: 'app-store'
    }
  )
);
```

## Performance Optimization

### Component Optimization

```typescript
// components/OptimizedList.tsx
import React, { memo, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';

interface ListItem {
  id: string;
  title: string;
  description: string;
}

interface OptimizedListProps {
  items: ListItem[];
  onItemClick: (item: ListItem) => void;
  height: number;
}

// Optimized list item component
const ListItemComponent = memo(({ index, style, data }: any) => {
  const { items, onItemClick } = data;
  const item = items[index];

  const handleClick = useCallback(() => {
    onItemClick(item);
  }, [item, onItemClick]);

  return (
    <div style={style} className="list-item" onClick={handleClick}>
      <h4>{item.title}</h4>
      <p>{item.description}</p>
    </div>
  );
});

export const OptimizedList = memo<OptimizedListProps>(({
  items,
  onItemClick,
  height
}) => {
  const itemData = useMemo(() => ({
    items,
    onItemClick
  }), [items, onItemClick]);

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={80}
      itemData={itemData}
    >
      {ListItemComponent}
    </List>
  );
});
```

### Lazy Loading Component

```typescript
// components/LazyImage.tsx
import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
}

export function LazyImage({
  src,
  alt,
  placeholder = '/images/placeholder.svg',
  className
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : placeholder}
      alt={alt}
      className={`lazy-image ${className} ${isLoaded ? 'loaded' : ''}`}
      onLoad={() => setIsLoaded(true)}
    />
  );
}
```

---

For more detailed information, please refer to:

- [Development Guide](DEVELOPMENT_GUIDE.en.md)
- [API Reference](API_REFERENCE.en.md)
- [Environment Setup Guide](ENVIRONMENT_SETUP.en.md)
- [Build & Deployment Guide](BUILD_DEPLOYMENT.en.md)
