# Building HAR Insight Pro Desktop App with Tauri

This guide provides detailed instructions for building and distributing the HAR Insight Pro Windows desktop application using **Tauri** - a lightweight alternative to Electron.

## Why Tauri Over Electron?

Tauri produces significantly smaller and faster desktop applications:

| Feature | Tauri | Electron |
|---------|-------|----------|
| Installer Size | 3-10 MB | 80-150 MB |
| Memory Usage | 20-30 MB | 100-150 MB |
| Runtime | Native WebView2 | Bundled Chromium |
| Backend | Rust | Node.js |
| Security | Rust safety + strict defaults | JavaScript-based |

**Result: 25x smaller installers with better performance!**

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js**: v16 or higher (v18 LTS recommended)
- **npm**: Comes with Node.js
- **Rust**: Required for Tauri
  ```bash
  # Install Rust (Windows)
  https://www.rust-lang.org/tools/install
  # Or use: winget install Rustlang.Rustup
  ```
- **Microsoft Visual Studio C++ Build Tools**: Required for Rust on Windows
  ```bash
  # Install via Visual Studio Installer or:
  https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
  ```

### Optional
- **Git**: For version control

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mortael/HAR-Insight-Pro.git
cd HAR-Insight-Pro
```

### 2. Install Dependencies

```bash
npm install
```

This will:
- Install all Node.js dependencies
- Automatically generate application icons from the SVG source
- Set up Tauri

### 3. Run in Development Mode

#### As a Web Application

```bash
npm run dev
```

The application will be available at http://localhost:3000

#### As a Desktop Application

```bash
npm run tauri:dev
```

This starts:
- Vite development server on port 3000
- Tauri window that loads the dev server
- Hot Module Replacement (HMR) for instant updates
- Rust backend with file watching

## Building for Production

### Web Build Only

To build just the web assets:

```bash
npm run build
```

Output: `dist/` directory

### Windows Desktop App

To build the Windows desktop application:

```bash
npm run tauri:build:win
```

This will:
1. Build the web application using Vite
2. Compile the Rust backend
3. Bundle the app with WebView2
4. Create Windows installers

Output: `src-tauri/target/release/bundle/` directory containing:
- `nsis/` - NSIS installer (~3-10 MB)
- `msi/` - MSI installer for enterprise deployment

### Build for Current Platform

```bash
npm run tauri:build
```

## Icon Management

### Icon Files

The application uses a custom-designed logo located in `build/icon.svg`. Icons are managed in two locations:

1. **Build Directory** (`build/`) - Source icons for web version
2. **Tauri Icons** (`src-tauri/icons/`) - All platform-specific icons

### Generating Icons

Icons are automatically generated during `npm install`. To regenerate manually:

```bash
# Generate PNG icons from SVG
node scripts/generate-icons.cjs

# Generate all Tauri platform icons
npx tauri icon build/icon.png
```

This creates:
- PNG icons at various sizes (16x16 to 1024x1024)
- Windows ICO file
- macOS ICNS file
- Android and iOS icons
- Windows Store/UWP icons

### Customizing the Logo

1. Edit `build/icon.svg` with your design
2. Keep the viewBox at `0 0 512 512` for best results
3. Run the icon generation commands
4. Test the icons in development mode

## Project Structure

```
HAR-Insight-Pro/
├── src-tauri/
│   ├── src/
│   │   └── main.rs          # Rust main file
│   ├── icons/               # Platform icons
│   ├── tauri.conf.json      # Tauri configuration
│   ├── Cargo.toml           # Rust dependencies
│   └── target/              # Rust build output
├── src/
│   ├── components/          # React components
│   ├── lib/                # Utilities
│   ├── App.tsx             # Main app
│   └── main.tsx            # Entry point
├── build/
│   ├── icon.svg            # Source SVG logo
│   └── icon*.png           # Generated icons
├── scripts/
│   └── generate-icons.cjs   # Icon generation script
└── package.json            # Project metadata
```

## Configuration

### Tauri Configuration (src-tauri/tauri.conf.json)

Key configurations:
- **productName**: "HAR Insight Pro"
- **identifier**: "com.harinsightpro.app"
- **version**: "1.0.0"
- **bundle.targets**: ["nsis", "msi"]
- **window size**: 1400x900 (min 800x600)

To customize:

```json
{
  "bundle": {
    "targets": ["nsis", "msi"],  // Add "portable" for portable exe
    "windows": {
      "certificateThumbprint": "YOUR_CERT_THUMBPRINT",  // For code signing
      "webviewInstallMode": {
        "type": "embedBootstrapper"  // Include WebView2 installer
      }
    }
  }
}
```

### Vite Configuration (vite.config.ts)

Key settings for Tauri:
- `base: './'` - Relative paths for desktop app
- `build.outDir: 'dist'` - Output directory

### Package.json Scripts

- `npm run dev` - Web dev server
- `npm run build` - Web production build
- `npm run tauri:dev` - Desktop dev mode
- `npm run tauri:build` - Build desktop app
- `npm run tauri:build:win` - Build Windows only

## Troubleshooting

### Issue: Rust not found

**Solution**: Install Rust and restart your terminal:
```bash
https://www.rust-lang.org/tools/install
```

### Issue: MSVC build tools missing

**Solution**: Install Visual Studio C++ Build Tools:
```bash
https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
```

### Issue: Tauri window is blank

**Solution**: Ensure the build completed successfully and the `dist/` directory exists:
```bash
npm run build
```

### Issue: WebView2 not found

**Solution**:
- Windows 11: WebView2 is pre-installed
- Windows 10: Configure Tauri to bundle WebView2 installer in `tauri.conf.json`

### Issue: Icons not showing

**Solution**: Regenerate icons:
```bash
node scripts/generate-icons.cjs
npx tauri icon build/icon.png
npm run tauri:build
```

### Issue: Build fails with Rust errors

**Solution**:
1. Update Rust: `rustup update`
2. Clean build: `cd src-tauri && cargo clean`
3. Rebuild: `npm run tauri:build`

## Distribution

### Creating a Release

1. Update version in `package.json` and `src-tauri/tauri.conf.json`
2. Update `src-tauri/Cargo.toml` version
3. Build the application:
   ```bash
   npm run tauri:build:win
   ```
4. Test the installer in `src-tauri/target/release/bundle/`
5. Create a GitHub release
6. Upload the installers as release assets

### File Sizes

Typical sizes with Tauri:
- NSIS Installer: ~3-10 MB (vs 80-100 MB with Electron)
- MSI Installer: ~4-11 MB
- Unpacked: ~15-20 MB (vs 150-170 MB with Electron)

### WebView2 Distribution

**Option 1: Download Bootstrapper (Recommended)**
- Installer is smallest (~3-5 MB)
- Downloads WebView2 if needed during installation
- Already configured in `tauri.conf.json`

**Option 2: Embed Bootstrapper**
```json
"windows": {
  "webviewInstallMode": {
    "type": "embedBootstrapper"
  }
}
```

**Option 3: Bundle WebView2**
```json
"windows": {
  "webviewInstallMode": {
    "type": "fixedRuntime",
    "path": "path/to/webview2/runtime"
  }
}
```

### System Requirements

Minimum requirements for Windows:
- Windows 10 version 1809 (October 2018 Update) or later
- Microsoft Edge WebView2 Runtime (auto-installed)
- 64-bit processor
- 50 MB free disk space
- 256 MB RAM (2 GB recommended)

## Security Considerations

Tauri follows security best practices by default:

1. **Rust Backend**: Memory-safe language prevents common vulnerabilities
2. **Minimal IPC**: Only explicitly allowed commands can be called from frontend
3. **CSP Ready**: Content Security Policy support
4. **No Node.js**: Eliminates entire class of vulnerabilities
5. **Sandboxed**: WebView runs in OS sandbox

### Adding Custom Commands

Create Rust commands in `src-tauri/src/main.rs`:

```rust
#[tauri::command]
fn my_custom_command(data: String) -> String {
    format!("Processed: {}", data)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![my_custom_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Call from frontend:
```typescript
import { invoke } from '@tauri-apps/api/core';

const result = await invoke('my_custom_command', { data: 'test' });
```

## Advanced Topics

### Code Signing (Recommended for Distribution)

For production releases, code signing prevents Windows SmartScreen warnings:

1. Obtain a code signing certificate
2. Configure in `src-tauri/tauri.conf.json`:
   ```json
   {
     "bundle": {
       "windows": {
         "certificateThumbprint": "YOUR_CERT_THUMBPRINT",
         "timestampUrl": "http://timestamp.digicert.com"
       }
     }
   }
   ```

### Auto-Updates

Tauri has built-in auto-update support:

1. Enable in `tauri.conf.json`:
   ```json
   {
     "updater": {
       "active": true,
       "endpoints": [
         "https://releases.myapp.com/{{target}}/{{current_version}}"
       ],
       "pubkey": "YOUR_PUBLIC_KEY"
     }
   }
   ```

2. Generate keys:
   ```bash
   npm run tauri signer generate
   ```

3. Sign updates and host JSON manifest

### Cross-Platform Builds

To build for other platforms:

```bash
# Build for Linux (from Linux)
npm run tauri:build

# Build for macOS (from macOS)
npm run tauri:build

# Target specific architectures
npm run tauri:build -- --target x86_64-pc-windows-msvc
npm run tauri:build -- --target aarch64-apple-darwin
```

## Performance Optimization

### Reducing Bundle Size

1. Use production builds (automatically optimized)
2. Enable Rust release optimizations in `Cargo.toml`
3. Tree-shake unused dependencies
4. Use Tauri's lazy loading for large modules

### Faster Development

1. Use `npm run tauri:dev` for hot reload
2. Enable Rust incremental compilation (default)
3. Use `--no-watch` flag to skip file watching if not needed

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build Tauri App

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - run: npm install
      - run: npm run tauri:build:win
      - uses: actions/upload-artifact@v3
        with:
          name: windows-installers
          path: src-tauri/target/release/bundle/**/*.exe
```

## Comparison: Tauri vs Electron

| Aspect | Tauri | Electron | Winner |
|--------|-------|----------|--------|
| Installer Size | 3-10 MB | 80-150 MB | Tauri (25x smaller) |
| Memory Usage | 20-30 MB | 100-150 MB | Tauri (5x less) |
| Startup Time | Fast | Slower | Tauri |
| Security | Rust + strict defaults | JavaScript-based | Tauri |
| API Access | Rust commands | Node.js full access | Tied |
| Maturity | Newer (2020) | Established (2013) | Electron |
| Community | Growing | Very large | Electron |
| Best For | Size/performance critical | Maximum compatibility | Depends |

## Support

For issues or questions:
- GitHub Issues: https://github.com/mortael/HAR-Insight-Pro/issues
- Tauri Docs: https://tauri.app/
- Tauri Discord: https://discord.com/invite/tauri

## License

This project is licensed under the MIT License.
