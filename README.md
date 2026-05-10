<div align="center">
  <h1>🛡️ HAR Insight Pro</h1>
  <p><strong>A modern, high-performance desktop application for analyzing and sanitizing HAR files</strong></p>

  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </p>
</div>

---

## ✨ Features

- 🔍 **Advanced HAR Analysis** - Load, view, and analyze HTTP Archive (HAR) files with ease
- 🛡️ **Data Sanitization** - Remove sensitive headers, cookies, and patterns before sharing
- 🎯 **Smart Filtering** - Filter by method, status, content type, size, and custom search queries
- 📊 **Detailed View** - Inspect request/response headers, cookies, timing, and content
- 💾 **Export Functionality** - Save sanitized HAR files back to disk
- 🎨 **Modern UI** - Clean, dark-themed interface optimized for developer workflows
- 🖥️ **Native Desktop App** - Built with Tauri for a small footprint (~3-10 MB) and native performance
- 🔒 **Privacy-Focused** - All processing happens locally on your machine

## 🚀 Quick Start

### Desktop Application (Recommended)

#### Prerequisites

- **Node.js** (v18 or higher)
- **Rust** (for building from source)
  - Install from [rustup.rs](https://rustup.rs/)

#### Run Development Version

```bash
# Install dependencies
npm install

# Run desktop app in development mode
npm run tauri:dev
```

#### Build for Production

```bash
# Build for your current platform
npm run tauri:build

# Platform-specific builds:
npm run tauri:build:win    # Windows
npm run tauri:build:mac    # macOS
npm run tauri:build:linux  # Linux
```

The built application will be available in `src-tauri/target/release/bundle/`

### Web Version

You can also run HAR Insight Pro as a web application:

```bash
# Install dependencies
npm install

# Run web version
npm run dev
```

Access at `http://localhost:3000`

## 📦 Installation Sizes

| Platform | Size | Notes |
|----------|------|-------|
| **Tauri Desktop** | 3-10 MB | Native WebView, Rust backend |
| **Web App** | ~400 KB | Runs in browser |

## 🎯 Usage

1. **Load HAR File**
   - Drag and drop a `.har` file into the application
   - Or click "Select Source File" to browse your filesystem

2. **Analyze Requests**
   - View all HTTP requests in a sortable, filterable table
   - Click any request to see detailed headers, cookies, timing, and content

3. **Filter and Search**
   - Use the toolbar to filter by request type (XHR, JS, CSS, Images, etc.)
   - Advanced search with operators: `status:200`, `size>1000`, `method:POST`

4. **Sanitize Data**
   - Click "Sanitize Entries" to configure which headers and patterns to remove
   - Protect sensitive information before sharing HAR files

5. **Export**
   - Click "Export HAR" to save your (sanitized) HAR file
   - Native file dialog on desktop, browser download on web

## 🔧 Development

### Project Structure

```
HAR-Insight-Pro/
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── lib/               # Utility functions
│   └── types.ts           # TypeScript types
├── src-tauri/             # Tauri/Rust backend
│   ├── src/               # Rust source
│   ├── icons/             # Application icons
│   └── tauri.conf.json    # Tauri configuration
├── dist/                  # Build output (web)
└── package.json           # Node dependencies & scripts
```

### Available Scripts

```bash
# Web Development
npm run dev          # Start Vite dev server
npm run build        # Build web app for production
npm run preview      # Preview production build
npm run lint         # Run TypeScript type checking

# Desktop Development
npm run tauri:dev    # Run desktop app in dev mode
npm run tauri:build  # Build desktop app for production
npm run tauri        # Direct access to Tauri CLI

# Cleanup
npm run clean        # Remove build artifacts
```

### Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion (animations)
- **Desktop**: Tauri 2.x (Rust + WebView)
- **Build**: Vite 6.x
- **Icons**: Lucide React

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/) - Build smaller, faster, and more secure desktop applications
- UI powered by [React](https://react.dev/) and [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">
  <p>Made with ❤️ for developers who work with HAR files</p>
  <p>
    <a href="https://github.com/mortael/HAR-Insight-Pro/issues">Report Bug</a>
    ·
    <a href="https://github.com/mortael/HAR-Insight-Pro/issues">Request Feature</a>
  </p>
</div>
