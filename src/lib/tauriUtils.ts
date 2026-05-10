/**
 * Detects whether the app is running inside Tauri (desktop mode).
 *
 * `__TAURI_INTERNALS__` is injected by Tauri v2 into every WebView window and
 * is the recommended programmatic check per the Tauri v2 migration guide.
 */
export const isTauri = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

/**
 * Opens a native file-picker dialog (Tauri desktop only) and returns the
 * text content of the selected HAR file, or null if the user cancelled.
 *
 * Falls back gracefully when called from a browser context.
 */
export const openHarFileDialog = async (): Promise<string | null> => {
  if (!isTauri()) return null;

  const { open } = await import('@tauri-apps/plugin-dialog');
  const { readTextFile } = await import('@tauri-apps/plugin-fs');

  const filePath = await open({
    title: 'Open HAR File',
    multiple: false,
    filters: [{ name: 'HAR Files', extensions: ['har', 'json'] }],
  });

  if (!filePath) return null;

  return await readTextFile(filePath);
};
