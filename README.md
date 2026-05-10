<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HAR Insight Pro

A high-performance, developer-focused HAR file inspector/editor with advanced filtering, sanitization, and code conversion tools.

## Run (Web)

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Run (Desktop)

This repo includes a Tauri desktop wrapper (`src-tauri/`) around the existing React UI.

**Prerequisites:** Node.js, Rust toolchain

1. Install dependencies:
   `npm install`
2. Run the desktop app:
   `npm run desktop:dev`

### Build installers/bundles

`npm run desktop:build`

### Linux notes

Building Tauri on Linux requires system WebView dependencies (GTK/WebKit). See the Tauri prerequisites for your distro if `cargo` errors mention `glib-2.0` / `webkit2gtk`.
