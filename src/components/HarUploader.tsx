import { useCallback, useEffect, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { Upload, FileCode } from 'lucide-react';
import { motion } from 'motion/react';

interface HarUploaderProps {
  onUpload: (content: string) => void;
}

// Detect if running in Tauri
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

export default function HarUploader({ onUpload }: HarUploaderProps) {
  const [isDialogAvailable, setIsDialogAvailable] = useState(false);

  useEffect(() => {
    // Check if Tauri dialog plugin is available
    if (isTauri) {
      import('@tauri-apps/plugin-dialog').then(() => {
        setIsDialogAvailable(true);
      }).catch(() => {
        console.log('Tauri dialog not available, using standard file input');
      });
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onUpload(content);
    };
    reader.readAsText(file);
  }, [onUpload]);

  const handleTauriFileOpen = useCallback(async () => {
    try {
      const { open } = await import('@tauri-apps/plugin-dialog');
      const { readTextFile } = await import('@tauri-apps/plugin-fs');

      const selected = await open({
        multiple: false,
        filters: [{
          name: 'HAR Files',
          extensions: ['har', 'json']
        }]
      });

      if (selected && typeof selected === 'string') {
        const content = await readTextFile(selected);
        onUpload(content);
      }
    } catch (error) {
      console.error('Error opening file with Tauri:', error);
    }
  }, [onUpload]);

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.har') || file.type === 'application/json')) {
      handleFile(file);
    }
  }, [handleFile]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleClick = useCallback(() => {
    if (isDialogAvailable) {
      handleTauriFileOpen();
    }
  }, [isDialogAvailable, handleTauriFileOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-brand-border bg-brand-panel rounded-lg p-12 text-center transition-colors hover:border-brand-accent/50 group"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      id="har-uploader"
    >
      <div className="w-16 h-16 bg-brand-accent/10 rounded-xl flex items-center justify-center mb-6 ring-1 ring-brand-accent/20 group-hover:ring-brand-accent/50 transition-all">
        <Upload className="w-8 h-8 text-brand-accent" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Initialize Inspector</h2>
      <p className="text-brand-text-dim mb-8 max-w-sm text-sm">
        Drop a <span className="text-brand-warning font-mono">.har</span> file here to start exploring network traces, sanitizing headers, and generating code segments.
      </p>

      <div className="flex flex-col items-center gap-4">
        {isDialogAvailable ? (
          <button
            onClick={handleClick}
            className="cursor-pointer bg-brand-accent text-white font-semibold py-2.5 px-10 rounded-md transition-all shadow-lg shadow-brand-accent/10 hover:brightness-110 active:scale-95 text-sm"
          >
            Select Source File
          </button>
        ) : (
          <label className="cursor-pointer bg-brand-accent text-white font-semibold py-2.5 px-10 rounded-md transition-all shadow-lg shadow-brand-accent/10 hover:brightness-110 active:scale-95 text-sm">
            Select Source File
            <input type="file" className="hidden" accept=".har,application/json" onChange={onChange} />
          </label>
        )}

        <div className="flex items-center gap-2 text-brand-text-dim text-[10px] font-mono uppercase tracking-[0.1em]">
          <FileCode className="w-3.5 h-3.5" />
          <span>HAR VERSION 1.2+ REQUIRED</span>
        </div>
      </div>
    </motion.div>
  );
}
