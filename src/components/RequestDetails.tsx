import { useState } from 'react';
import { HAREntry, CodeExportType } from '../types';
import { convertToCode, formatSize } from '../lib/harUtils';
import { X, Copy, Check, Terminal, ExternalLink, Code, Database, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RequestDetailsProps {
  entry: HAREntry;
  onClose: () => void;
}

export default function RequestDetails({ entry, onClose }: RequestDetailsProps) {
  const [activeTab, setActiveTab] = useState<'headers' | 'response' | 'code'>('headers');
  const [selectedFormat, setSelectedFormat] = useState<CodeExportType>('curl');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (type: CodeExportType | 'response') => {
    let content = '';
    if (type === 'response') {
      content = entry.response.content.text || '';
    } else {
      content = convertToCode(entry, type as CodeExportType);
    }
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getResponseContent = () => {
    let text = entry.response.content.text;
    if (!text) return 'No response body available in this HAR entry. (Check if the source tool recorded bodies)';
    
    // Handle base64 encoding if present
    if (entry.response.content.encoding === 'base64') {
      try {
        text = atob(text);
      } catch (e) {
        return 'Decoding error: Content is base64 but failed to decode via atob()';
      }
    }

    if (entry.response.content.mimeType.includes('json')) {
      try {
        const parsed = JSON.parse(text);
        return JSON.stringify(parsed, null, 2);
      } catch (e) {
        return text;
      }
    }
    return text;
  };

  return (
    <motion.aside
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ type: 'just' }}
      className="fixed top-[104px] bottom-[32px] right-0 w-[400px] bg-brand-panel border-l border-brand-border flex flex-col z-20 shadow-2xl"
      id="request-details"
    >
      {/* Inspector Header */}
      <div className="p-4 border-b border-brand-border shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${entry.response.status >= 400 ? 'bg-brand-error/20 text-brand-error' : 'bg-brand-success/20 text-brand-success'}`}>
              {entry.response.status}
            </span>
            <h3 className="text-sm font-bold text-white">Inspector</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-md text-brand-text-dim transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-brand-text-dim font-mono break-all leading-tight opacity-70">
          {entry.request.url}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border bg-black/20 shrink-0">
        {(['headers', 'response', 'code'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === tab 
                ? 'border-brand-accent text-white bg-white/5' 
                : 'border-transparent text-brand-text-dim hover:text-brand-text hover:bg-white/2'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Inspector Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-brand-border bg-[#16191E]">
        {activeTab === 'headers' && (
          <div className="space-y-6">
            <section>
              <span className="text-[11px] uppercase text-brand-text-dim font-bold block border-b border-brand-border pb-1 mb-3 tracking-wider">
                General
              </span>
              <KVRow label="Method" value={entry.request.method} />
              <KVRow label="URL" value={entry.request.url} />
              <KVRow label="Status" value={`${entry.response.status} ${entry.response.statusText}`} />
              <KVRow label="Size" value={formatSize(entry.response.content.size)} accent />
              <KVRow label="Time" value={`${Math.round(entry.time)}ms`} />
            </section>

            <section>
              <span className="text-[11px] uppercase text-brand-text-dim font-bold block border-b border-brand-border pb-1 mb-3 tracking-wider">
                Request Headers
              </span>
              <div className="space-y-1">
                {entry.request.headers.map((h, i) => (
                  <KVRow key={i} label={h.name} value={h.value} />
                ))}
              </div>
            </section>

            <section>
              <span className="text-[11px] uppercase text-brand-text-dim font-bold block border-b border-brand-border pb-1 mb-3 tracking-wider">
                Response Headers
              </span>
              <div className="space-y-1">
                {entry.response.headers.map((h, i) => (
                  <KVRow key={i} label={h.name} value={h.value} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'response' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase text-brand-text-dim font-bold tracking-wider">
                Raw Content ({entry.response.content.mimeType.split(';')[0]})
              </span>
              <button 
                onClick={() => handleCopy('response')}
                className="p-1.5 hover:bg-white/5 rounded text-brand-text-dim hover:text-white transition-colors"
                title="Copy body"
              >
                {copiedType === 'response' ? <Check className="w-3.5 h-3.5 text-brand-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex-1 bg-black/40 rounded border border-brand-border p-3 overflow-auto font-mono text-[11px] text-brand-text/90 relative group">
              <pre className="whitespace-pre-wrap break-all selection:bg-brand-accent/30">
                {getResponseContent()}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4 h-full flex flex-col">
            <div className="shrink-0">
              <span className="text-[11px] uppercase text-brand-text-dim font-bold block border-b border-brand-border pb-1 mb-4 tracking-wider">
                Export Options
              </span>
              <div className="flex gap-2 mb-4">
                {(['curl', 'python', 'powershell'] as CodeExportType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedFormat(type)}
                    className={`flex-1 py-1.5 px-2 text-[10px] font-bold uppercase tracking-tight rounded border transition-all ${
                      selectedFormat === type 
                        ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' 
                        : 'bg-black/40 border-brand-border text-brand-text-dim hover:border-brand-text'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <CodeSnippet 
                label={`${selectedFormat.toUpperCase()} Code`} 
                code={convertToCode(entry, selectedFormat)}
                onCopy={() => handleCopy(selectedFormat)}
                isCopied={copiedType === selectedFormat}
                tall
              />
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

function CodeSnippet({ label, code, onCopy, isCopied, tall }: { label: string; code: string; onCopy: () => void; isCopied: boolean; tall?: boolean }) {
  return (
    <div className="space-y-1.5 h-full flex flex-col">
      <div className="flex items-center justify-between px-1 shrink-0">
        <span className="text-[10px] font-bold text-brand-text-dim uppercase tracking-wider">{label}</span>
        <button 
          onClick={onCopy}
          className="text-brand-accent hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold"
        >
          {isCopied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <div className={`bg-black/60 rounded border border-brand-border p-3 font-mono text-[11px] text-brand-text/90 overflow-auto relative scrollbar-thin scrollbar-thumb-brand-border flex-1 ${tall ? 'min-h-[200px]' : 'h-[100px]'}`}>
        <pre className="whitespace-pre break-all">{code}</pre>
      </div>
    </div>
  );
}

function KVRow({ label, value, accent, ...props }: { label: string; value: string; accent?: boolean; [key: string]: any }) {
  return (
    <div className="flex gap-2 mb-2 text-[12px]" {...props}>
      <div className="w-[80px] shrink-0 text-brand-text-dim truncate" title={label}>{label}</div>
      <div className={`font-mono break-all leading-tight ${accent ? 'text-brand-accent font-bold' : 'text-brand-text'}`}>
        {value}
      </div>
    </div>
  );
}

