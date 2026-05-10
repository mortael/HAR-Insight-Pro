<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HAR Insight Pro

A high-performance, developer-focused HAR file analyzer with advanced filtering, sanitization, and code conversion tools.  
Available as a **desktop application** (powered by [Tauri](https://tauri.app)) and as a **web app**.

---

## Desktop App (Tauri)

HAR Insight Pro runs as a native desktop application using Tauri — producing small installers (~10 MB) with a native WebView renderer.  
The desktop app adds a **native file-open dialog** so you can open `.har` files directly from your filesystem.

### Prerequisites
- [Node.js](https://nodejs.org) ≥ 18
- [Rust](https://rustup.rs) (stable toolchain)
- **Linux only**: install GTK & WebKit system libraries:
  ```bash
  sudo apt install libgtk-3-dev libwebkit2gtk-4.1-dev libappindicator3-dev
  ```
- **macOS only**: Xcode Command Line Tools (`xcode-select --install`)

### Run in development
```bash
npm install
npm run desktop:dev
```

### Build installer
```bash
npm install
npm run desktop:build
# Installers are placed in src-tauri/target/release/bundle/
```

---

## Web App (Browser)

```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

---

## Features

- **Native file open dialog** in the desktop app (drag & drop also works)
- Advanced filtering: `status:200`, `method:POST`, `size>1000`, `type:json`, `url:api`
- Sanitize sensitive headers (Authorization, Cookie, custom patterns)
- Export/download the modified HAR
- Code generation: cURL, Python `requests`, PowerShell
- Configurable, sortable columns
- Dark, modern UI
