/* eslint-disable no-undef */
const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

const APP_NAME = 'HAR Insight Pro';
const APP_ID = 'com.harinsightpro.app';
const DEV_URL = 'http://127.0.0.1:3000';

function createAppIcon() {
  // Use the embedded SVG logo for the window icon during development.
  // Note: installer/EXE icons are configured via electron-builder.
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#22c55e"/>
          <stop offset="1" stop-color="#38bdf8"/>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="12" fill="#0f172a" stroke="#1f2937" stroke-width="2"/>
      <path d="M20 42V22h6v8h12v-8h6v20h-6v-8H26v8h-6z" fill="url(#g)"/>
    </svg>
  `.trim();

  try {
    const icon = nativeImage.createFromDataURL(
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    );
    if (!icon.isEmpty()) return icon;
  } catch {}
  return undefined;
}

function createWindow() {
  const icon = createAppIcon();

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 980,
    minHeight: 640,
    title: APP_NAME,
    icon,
    backgroundColor: '#0D1117',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL || DEV_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.setName(APP_NAME);
app.setAppUserModelId(APP_ID);

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
