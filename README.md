<div align="center">
<img width="512" height="512" alt="HAR Insight Pro Logo" src="build/icon.svg" />
</div>

# HAR Insight Pro - Desktop Application

A high-performance, developer-focused HAR file editor with advanced filtering, sanitization, and code conversion tools. Now available as a lightweight Windows desktop application built with **Tauri**!

## Features

- 🔍 **Advanced Filtering**: Powerful search and filter capabilities for HAR entries
- 🛡️ **Sanitization**: Remove sensitive data from HAR files
- 📊 **Detailed Analysis**: View request/response details, headers, and timings
- 🎨 **Modern UI**: Clean, responsive interface with dark mode
- 💻 **Desktop App**: Native Windows application built with Tauri (3-10 MB installer vs 80-150 MB with Electron!)
- ⚡ **Lightweight**: Uses native WebView2 instead of bundling Chromium

## Download & Installation

### For Windows Users

1. Download the latest installer from the [Releases](https://github.com/mortael/HAR-Insight-Pro/releases) page:
   - **NSIS Installer**: `HAR-Insight-Pro_1.0.0_x64-setup.exe` (recommended)
   - **MSI Installer**: `HAR-Insight-Pro_1.0.0_x64_en-US.msi` (for enterprise deployment)

2. Run the installer and follow the setup wizard
3. Launch HAR Insight Pro from your Start Menu or Desktop shortcut

**Note**: Requires Microsoft Edge WebView2 Runtime (automatically installed on Windows 11, or included with installer on Windows 10)

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Rust (for Tauri development) - [Install Rust](https://www.rust-lang.org/tools/install)

### Run as Web Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at http://localhost:3000

### Run as Desktop Application (Development)

```bash
# Install dependencies
npm install

# Start Tauri in development mode
npm run tauri:dev
```

This will start both the Vite dev server and the Tauri desktop window, with hot-reload enabled.

### Build Desktop Application

```bash
# Build for Windows
npm run tauri:build:win

# Or build for current platform
npm run tauri:build
```

The built application will be in the `src-tauri/target/release/bundle/` directory.

## Why Tauri?

Tauri offers significant advantages over Electron:

- **25x Smaller**: ~3-10 MB installers vs ~80-150 MB with Electron
- **Faster**: Uses native OS webview (WebView2 on Windows)
- **Lower Memory**: ~20-30 MB RAM vs ~100-150 MB with Electron
- **More Secure**: Rust-based backend with strict security defaults
- **Modern**: Built-in auto-update, code signing, and platform APIs

## Project Structure

```
HAR-Insight-Pro/
├── src-tauri/          # Tauri (Rust) backend
│   ├── src/           # Rust source code
│   ├── icons/         # Application icons
│   └── tauri.conf.json # Tauri configuration
├── src/               # React application source
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   ├── App.tsx       # Main application component
│   └── main.tsx      # React entry point
├── build/            # Application icons and assets
├── scripts/          # Build and utility scripts
└── dist/            # Build output (generated)
```

## How to Use

1. **Upload a HAR File**: Drag and drop or click to select a HAR file
2. **Filter Entries**: Use the search bar with advanced filters:
   - `method:GET` - Filter by HTTP method
   - `status:200` - Filter by status code
   - `type:json` - Filter by content type
   - `size>1000` - Filter by response size
3. **Sanitize Data**: Click "Sanitize Entries" to remove sensitive headers
4. **Export**: Download the modified HAR file

## Building from Source

### Icon Generation

Icons are automatically generated during `npm install` from the SVG source. To regenerate manually:

```bash
node scripts/generate-icons.cjs
npx tauri icon build/icon.png
```

### Packaging

The application uses Tauri for packaging. Configuration is in `src-tauri/tauri.conf.json`.

For Windows, the build produces:
- NSIS installer (recommended for users)
- MSI installer (for enterprise deployment)

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Desktop**: Tauri 2.x (Rust + WebView2)
- **Icons**: Lucide React
- **Animations**: Motion

## System Requirements

### Windows
- Windows 10 version 1809 (October 2018 Update) or later
- Microsoft Edge WebView2 Runtime (included with Windows 11, auto-installed on Windows 10)
- 50 MB disk space for installation
- 30 MB RAM (vs 100+ MB with Electron)

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please visit our [GitHub repository](https://github.com/mortael/HAR-Insight-Pro).
