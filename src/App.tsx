import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldCheck, Download, Trash2, Box } from 'lucide-react';
import HarUploader from './components/HarUploader';
import HarTable from './components/HarTable';
import Toolbar from './components/Toolbar';
import RequestDetails from './components/RequestDetails';
import { HAREntry, ColumnConfig } from './types';
import { parseHar, sanitizeEntry } from './lib/harUtils';

export default function App() {
  const [entries, setEntries] = useState<HAREntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<HAREntry | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'startTime',
    direction: 'asc',
  });

  const defaultColumns: ColumnConfig[] = [
    { id: 'status', label: 'Status', visible: true, width: '60px' },
    { id: 'method', label: 'Method', visible: true, width: '80px' },
    { id: 'domain', label: 'Domain', visible: true, width: '150px' },
    { id: 'url', label: 'File / Path', visible: true },
    { id: 'type', label: 'Type', visible: true, width: '100px' },
    { id: 'size', label: 'Size', visible: true, width: '100px' },
    { id: 'time', label: 'Time', visible: true, width: '80px' },
  ];

  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    const saved = localStorage.getItem('har-columns');
    if (saved) {
      const parsed: ColumnConfig[] = JSON.parse(saved);
      // Merge: ensure all default columns exist in the saved state
      const merged = [...parsed];
      defaultColumns.forEach(defCol => {
        if (!merged.find(c => c.id === defCol.id)) {
          merged.push(defCol);
        }
      });
      return merged;
    }
    return defaultColumns;
  });

  const handleToggleColumn = useCallback((id: string) => {
    setColumns(prev => {
      const next = prev.map(col => col.id === id ? { ...col, visible: !col.visible } : col);
      localStorage.setItem('har-columns', JSON.stringify(next));
      return next;
    });
  }, []);

  const handleMoveColumn = useCallback((id: string, direction: 'up' | 'down') => {
    setColumns(prev => {
      const index = prev.findIndex(c => c.id === id);
      if (index === -1) return prev;
      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      localStorage.setItem('har-columns', JSON.stringify(next));
      return next;
    });
  }, []);

  const handleResetColumns = useCallback(() => {
    setColumns(defaultColumns);
    localStorage.removeItem('har-columns');
  }, []);

  const handleUpload = useCallback((content: string) => {
    try {
      const parsedEntries = parseHar(content);
      setEntries(parsedEntries);
    } catch (e) {
      alert('Failed to parse HAR file. Please ensure it is a valid .har export.');
    }
  }, []);

  const handleSanitize = useCallback(() => {
    setEntries((prev) => prev.map(sanitizeEntry));
  }, []);

  const handleClearMedia = useCallback(() => {
    setEntries((prev) => 
      prev.filter((entry) => {
        const mime = entry.response.content.mimeType.toLowerCase();
        return !mime.includes('image') && !mime.includes('video') && !mime.includes('audio');
      })
    );
  }, []);

  const handleDownload = useCallback(() => {
    const harContent = {
      log: {
        version: '1.2',
        creator: { name: 'Harden Editor', version: '1.0.0' },
        entries,
      }
    };
    const blob = new Blob([JSON.stringify(harContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sanitized-${Date.now()}.har`;
    a.click();
    URL.revokeObjectURL(url);
  }, [entries]);

  const handleSortBy = useCallback((field: string) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  }, []);

  const filteredAndSortedEntries = useMemo(() => {
    let result = [...entries];

    // Search
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (e) => 
          e.request.url.toLowerCase().includes(lowerSearch) ||
          e.request.method.toLowerCase().includes(lowerSearch) ||
          e.response.status.toString().includes(lowerSearch)
      );
    }

    // MIME Type Filter
    if (filterType !== 'all') {
      result = result.filter((e) => {
        const mime = e.response.content.mimeType.toLowerCase();
        switch (filterType) {
          case 'xhr': return mime.includes('json') || mime.includes('xml');
          case 'js': return mime.includes('javascript') || mime.includes('script');
          case 'css': return mime.includes('css');
          case 'img': return mime.includes('image');
          case 'media': return mime.includes('video') || mime.includes('audio');
          case 'font': return mime.includes('font');
          case 'doc': return mime.includes('html');
          default: return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      let valA: any, valB: any;
      switch (sort.field) {
        case 'startTime': valA = new Date(a.startedDateTime).getTime(); valB = new Date(b.startedDateTime).getTime(); break;
        case 'time': valA = a.time; valB = b.time; break;
        case 'size': valA = a.response.content.size; valB = b.response.content.size; break;
        case 'status': valA = a.response.status; valB = b.response.status; break;
        case 'method': valA = a.request.method; valB = b.request.method; break;
        default: return 0;
      }
      return sort.direction === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [entries, search, filterType, sort]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-brand-bg text-brand-text">
      {/* Header */}
      <header className="h-[56px] bg-brand-panel border-b border-brand-border flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-brand-accent rounded flex items-center justify-center font-bold text-white text-sm">
            H
          </div>
          <span className="font-bold text-lg tracking-tight">HAR Insight Pro</span>
        </div>

        {entries.length > 0 && (
          <div className="flex items-center gap-3">
            <button 
              onClick={handleClearMedia}
              className="px-3.5 py-1.5 rounded-md text-[13px] font-medium border border-brand-border bg-[#21262D] hover:border-brand-text-dim transition-all"
            >
              Purge Large Assets
            </button>
            <button 
              onClick={handleSanitize}
              className="px-3.5 py-1.5 rounded-md text-[13px] font-medium border border-brand-border bg-[#21262D] hover:border-brand-text-dim transition-all"
            >
              Sanitize Entries
            </button>
            <button 
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-md text-[13px] font-medium bg-brand-accent text-white border border-brand-accent hover:brightness-110 transition-all font-semibold"
            >
              Export HAR
            </button>
            
            <div className="h-6 w-px bg-brand-border mx-1" />
            
            <button
              onClick={() => setEntries([])}
              className="p-1.5 hover:bg-brand-error/10 text-brand-text-dim hover:text-brand-error rounded transition-all"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        {entries.length === 0 ? (
          <div className="flex-1 flex items-center justify-center bg-brand-bg">
            <HarUploader onUpload={handleUpload} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <Toolbar
              onSearch={setSearch}
              onFilterType={setFilterType}
              onSortBy={handleSortBy}
              onSanitize={handleSanitize}
              onClearMedia={handleClearMedia}
              currentSort={sort}
              activeFilter={filterType}
              columns={columns}
              onToggleColumn={handleToggleColumn}
              onMoveColumn={handleMoveColumn}
              onResetColumns={handleResetColumns}
            />
            
            <div className="flex-1 flex overflow-hidden">
              <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${selectedEntry ? 'mr-[400px]' : ''}`}>
                <HarTable 
                  entries={filteredAndSortedEntries} 
                  onSelectEntry={setSelectedEntry}
                  selectedId={selectedEntry?._id}
                  columns={columns}
                />
              </div>
              
              <AnimatePresence>
                {selectedEntry && (
                  <RequestDetails 
                    entry={selectedEntry} 
                    onClose={() => setSelectedEntry(null)} 
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      {/* Summary Bar Footer */}
      <footer className="h-8 bg-brand-panel border-t border-brand-border flex items-center px-5 shrink-0 text-[11px] text-brand-text-dim gap-5">
        <div>Total Requests: <strong className="text-brand-text">{entries.length}</strong></div>
        {entries.length > 0 && (
          <>
            <div>Transferred: <strong className="text-brand-text">
              {Math.round(entries.reduce((acc, curr) => acc + (curr.response.bodySize || 0), 0) / 1024)} KB
            </strong></div>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${search ? 'bg-brand-warning' : 'bg-brand-success'}`} />
                <span>{search ? 'Filtering Active' : 'All Requests Loaded'}</span>
              </div>
              <span className="font-mono opacity-50">v1.0.0</span>
            </div>
          </>
        )}
      </footer>
    </div>
  );
}
