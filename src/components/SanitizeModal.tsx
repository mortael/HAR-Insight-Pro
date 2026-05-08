import { useState } from 'react';
import { X, Plus, Trash2, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface SanitizeModalProps {
  config: { headers: string[]; patterns: string[] };
  onSave: (config: { headers: string[]; patterns: string[] }) => void;
  onClose: () => void;
  onSanitize: () => void;
}

export default function SanitizeModal({ config, onSave, onClose, onSanitize }: SanitizeModalProps) {
  const [headers, setHeaders] = useState<string[]>(config.headers);
  const [patterns, setPatterns] = useState<string[]>(config.patterns);
  const [newHeader, setNewHeader] = useState('');
  const [newPattern, setNewPattern] = useState('');

  const addHeader = () => {
    if (newHeader && !headers.includes(newHeader)) {
      setHeaders([...headers, newHeader]);
      setNewHeader('');
    }
  };

  const addPattern = () => {
    if (newPattern && !patterns.includes(newPattern)) {
      setPatterns([...patterns, newPattern]);
      setNewPattern('');
    }
  };

  const removeHeader = (h: string) => setHeaders(headers.filter(item => item !== h));
  const removePattern = (p: string) => setPatterns(patterns.filter(item => item !== p));

  const handleApply = () => {
    onSave({ headers, patterns });
    onSanitize();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-brand-panel border border-brand-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-4 border-b border-brand-border flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Sanitization Settings</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors text-brand-text-dim">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Custom Headers */}
          <section>
            <label className="text-[11px] font-bold text-brand-text-dim uppercase tracking-[0.1em] block mb-3">
              Sensitive Headers to Redact
            </label>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={newHeader}
                onChange={(e) => setNewHeader(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addHeader()}
                placeholder="e.g. X-Session-ID"
                className="flex-1 bg-black/40 border border-brand-border rounded px-3 py-1.5 text-xs focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 outline-none"
              />
              <button onClick={addHeader} className="px-3 py-1.5 bg-brand-accent text-white rounded text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Authorization', 'Cookie', 'Set-Cookie'].map(h => (
                <span key={h} className="px-2 py-1 bg-white/5 border border-brand-border rounded text-[10px] text-brand-text-dim font-mono flex items-center gap-1.5 opacity-60">
                  {h} <span className="text-[8px] uppercase tracking-tighter">(Default)</span>
                </span>
              ))}
              {headers.map(h => (
                <span key={h} className="px-2 py-1 bg-brand-accent/10 border border-brand-accent/30 rounded text-[10px] text-brand-accent font-mono flex items-center gap-1.5 animate-in fade-in zoom-in-95">
                  {h}
                  <button onClick={() => removeHeader(h)} className="hover:text-white transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Regex Patterns */}
          <section>
            <label className="text-[11px] font-bold text-brand-text-dim uppercase tracking-[0.1em] block mb-3">
              Custom Patterns (Regex)
            </label>
            <p className="text-[10px] text-brand-text-dim/60 mb-3 leading-relaxed">
              Define patterns to redact from header values and POST body text. 
              Example: <code className="text-brand-accent">\b[0-9]{4}-[0-9]{4}\b</code> for credit card patterns.
            </p>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={newPattern}
                onChange={(e) => setNewPattern(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPattern()}
                placeholder="e.g. key=[a-zA-Z0-9]+"
                className="flex-1 bg-black/40 border border-brand-border rounded px-3 py-1.5 text-xs focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 outline-none"
              />
              <button onClick={addPattern} className="px-3 py-1.5 bg-brand-accent text-white rounded text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {patterns.map(p => (
                <div key={p} className="flex items-center justify-between px-3 py-2 bg-white/5 border border-brand-border rounded text-[11px] font-mono group animate-in slide-in-from-left-2">
                  <span className="text-brand-text/90 break-all">{p}</span>
                  <button onClick={() => removePattern(p)} className="p-1 text-brand-text-dim hover:text-brand-error opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {patterns.length === 0 && (
                <div className="text-[11px] text-brand-text-dim/40 italic py-2">No custom patterns defined</div>
              )}
            </div>
          </section>
        </div>

        <div className="p-4 bg-black/20 border-t border-brand-border flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-brand-text-dim hover:text-white transition-colors">
            Cancel
          </button>
          <button onClick={handleApply} className="px-6 py-2 bg-brand-accent text-white rounded-md text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-brand-accent/20">
            Apply & Sanitize
          </button>
        </div>
      </motion.div>
    </div>
  );
}
