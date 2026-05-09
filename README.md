<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HAR Insight Pro

A fast, developer-focused HAR file viewer/editor with advanced filtering and sanitization tools.

## Run Locally

**Prerequisites:** Node.js


1. Install dependencies:
   `npm install`
2. (Optional) Set `GEMINI_API_KEY` in `.env.local` if you enable AI-powered features
3. Run the web app:
   `npm run dev`

## Windows Desktop App (Tauri)

Tauri uses the system WebView (WebView2 on Windows), which is typically much smaller than Electron installers.

1. Start the desktop app in development:
   `npm run desktop:dev`
2. Build the desktop app bundle (output under `src-tauri/target/`):
   `npm run desktop:build`
   (Run this on Windows for the smoothest experience.)

Logo: `src/assets/logo.svg` (used in the app header).
