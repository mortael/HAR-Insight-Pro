import { HAREntry, ColumnConfig } from '../types';
import { formatSize } from '../lib/harUtils';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from 'lucide-react';
import { useMemo } from 'react';

interface HarTableProps {
  entries: HAREntry[];
  onSelectEntry: (entry: HAREntry) => void;
  selectedId?: string;
  columns: ColumnConfig[];
}

export default function HarTable({ entries, onSelectEntry, selectedId, columns }: HarTableProps) {
  const visibleColumns = useMemo(() => columns.filter(c => c.visible), [columns]);

  const getStatusColor = (status: number) => {
    if (status >= 500) return 'text-brand-error';
    if (status >= 400) return 'text-brand-warning';
    if (status >= 200) return 'text-brand-success';
    return 'text-brand-text-dim';
  };

  return (
    <div className="overflow-auto w-full flex-1 bg-brand-bg scrollbar-thin scrollbar-thumb-brand-border">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead className="bg-brand-panel border-b border-brand-border sticky top-0 z-10">
          <tr className="text-[11px] font-semibold text-brand-text-dim uppercase tracking-[0.5px]">
            {visibleColumns.map(col => (
              <th key={col.id} className="p-3" style={col.width ? { width: col.width } : {}}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          <AnimatePresence mode="popLayout">
            {entries.map((entry) => {
              let pathName = entry.request.url;
              try {
                const url = new URL(entry.request.url);
                pathName = url.pathname + url.search;
              } catch (e) {
                // Keep original URL if parsing fails
              }
              
              const isSelected = selectedId === entry._id;
              
              const getEffectiveSize = () => {
                const bSize = entry.response.bodySize;
                const cSize = entry.response.content?.size;
                // If bodySize is available and positive, it's usually the wire size
                if (typeof bSize === 'number' && bSize > 0) return bSize;
                // Fallback to content size (uncompressed usually)
                if (typeof cSize === 'number' && cSize > 0) return cSize;
                return 0;
              };

              const size = getEffectiveSize();
              
              return (
                <motion.tr
                  layout
                  key={entry._id}
                  onClick={() => onSelectEntry(entry)}
                  className={`group transition-all text-[13px] border-l-4 transition-border hover:bg-brand-accent/5 cursor-default ${
                    isSelected ? 'bg-brand-accent/15 border-brand-accent' : 'border-transparent'
                  }`}
                  id={`entry-${entry._id}`}
                >
                  {visibleColumns.map(col => (
                    <td key={col.id} className="p-3">
                      {col.id === 'status' && (
                        <span className={`font-medium ${getStatusColor(entry.response.status)}`}>
                          {entry.response.status}
                        </span>
                      )}
                      {col.id === 'method' && (
                        <span className="font-medium text-brand-text opacity-90">
                          {entry.request.method}
                        </span>
                      )}
                      {col.id === 'domain' && (
                        (() => {
                           let hostname = 'invalid-url';
                           try { hostname = new URL(entry.request.url).hostname; } catch(e) {}
                           return (
                             <span className="text-[11px] font-mono text-brand-accent truncate block" title={hostname}>
                               {hostname}
                             </span>
                           );
                        })()
                      )}
                      {col.id === 'url' && (
                        <div className="font-mono text-[12px] text-brand-text truncate max-w-xl" title={entry.request.url}>
                          {pathName || '/'}
                        </div>
                      )}
                      {col.id === 'type' && (
                        <span className="text-[12px] text-brand-text-dim">
                          {entry.response.content.mimeType.split(';')[0]}
                        </span>
                      )}
                      {col.id === 'size' && (
                        <span className={size > 1024 * 1024 ? 'text-brand-warning font-bold text-[12px]' : 'text-brand-text-dim text-[12px]'}>
                          {formatSize(size)}
                        </span>
                      )}
                      {col.id === 'time' && (
                        <span className="text-[12px] text-brand-text-dim">
                          {Math.round(entry.time)}ms
                        </span>
                      )}
                    </td>
                  ))}
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
      {entries.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 text-brand-text-dim font-mono italic gap-3">
          <Activity className="w-8 h-8 opacity-20" />
          <span>No matching requests in current buffer</span>
        </div>
      )}
    </div>
  );
}
