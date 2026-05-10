export function isTauriDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return '__TAURI_INTERNALS__' in window || '__TAURI__' in window;
}

export async function openHarFromNativeDialog(): Promise<string | null> {
  if (!isTauriDesktop()) return null;

  const { open } = await import('@tauri-apps/plugin-dialog');
  const filePath = await open({
    multiple: false,
    filters: [{ name: 'HAR', extensions: ['har', 'json'] }],
  });

  if (!filePath || Array.isArray(filePath)) return null;

  const { invoke } = await import('@tauri-apps/api/core');
  return await invoke<string>('read_text_file', { path: filePath });
}

export async function saveHarToNativeDialog(contents: string): Promise<boolean> {
  if (!isTauriDesktop()) return false;

  const { save } = await import('@tauri-apps/plugin-dialog');
  const filePath = await save({
    defaultPath: `sanitized-${Date.now()}.har`,
    filters: [{ name: 'HAR', extensions: ['har'] }],
  });

  if (!filePath) return false;

  const { invoke } = await import('@tauri-apps/api/core');
  await invoke('write_text_file', { path: filePath, contents });
  return true;
}

