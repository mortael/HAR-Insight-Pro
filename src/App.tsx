import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldCheck, Download, Trash2, Box } from 'lucide-react';
import HarUploader from './components/HarUploader';
import HarTable from './components/HarTable';
import Toolbar from './components/Toolbar';
import RequestDetails from './components/RequestDetails';
import SanitizeModal from './components/SanitizeModal';
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
  const [sanitizeConfig, setSanitizeConfig] = useState<{ headers: string[], patterns: string[] }>({
    headers: [],
    patterns: []
  });
  const [showSanitizeModal, setShowSanitizeModal] = useState(false);
  const defaultColumns: ColumnConfig[] = [
    { id: 'index', label: '#', visible: true, width: '40px' },
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
  }, [defaultColumns]);

  const handleDeleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e._id !== id));
    if (selectedEntry?._id === id) setSelectedEntry(null);
  }, [selectedEntry]);

  const handleClear = useCallback(() => {
    setEntries([]);
    setSelectedEntry(null);
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
    setEntries((prev) => prev.map(entry => sanitizeEntry(entry, sanitizeConfig.headers, sanitizeConfig.patterns)));
  }, [sanitizeConfig]);

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
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const filteredAndSortedEntries = useMemo(() => {
    let result = entries.map((e, index) => ({ ...e, _originalIndex: index + 1 }));

    // Advanced Filter & Search
    if (search) {
      const parts = search.split(/\s+/);
      const filters: { key: string; op: string; val: string }[] = [];
      const keywords: string[] = [];

      parts.forEach(part => {
        const match = part.match(/^(\w+)(:|>=|<=|>|<|=)(.*)$/);
        if (match) {
          filters.push({ key: match[1].toLowerCase(), op: match[2], val: match[3].toLowerCase() });
        } else {
          keywords.push(part.toLowerCase());
        }
      });

      result = result.filter(e => {
        // Keyword search (URL, method, status, mime)
        const contentMatch = keywords.every(k => 
          e.request.url.toLowerCase().includes(k) ||
          e.request.method.toLowerCase().includes(k) ||
          e.response.status.toString().includes(k) ||
          e.response.content.mimeType.toLowerCase().includes(k)
        );
        if (!contentMatch) return false;

        // Structured Filters
        return filters.every(f => {
          switch (f.key) {
            case 'url': return e.request.url.toLowerCase().includes(f.val);
            case 'method': return e.request.method.toLowerCase() === f.val;
            case 'status': return e.response.status.toString() === f.val;
            case 'type': return e.response.content.mimeType.toLowerCase().includes(f.val);
            case 'size': {
              const size = e.response.content.size;
              const val = parseInt(f.val);
              if (isNaN(val)) return true;
              if (f.op === '>') return size > val;
              if (f.op === '<') return size < val;
              if (f.op === '>=') return size >= val;
              if (f.op === '<=') return size <= val;
              return size === val;
            }
            case 'user': {
              // Search in headers for user-related info (cookies, auth, user-agent)
              const headers = [
                ...e.request.headers,
                ...e.response.headers,
                ...(e.request.cookies || []),
                ...(e.response.cookies || [])
              ];
              return headers.some(h => 
                (h as any).name.toLowerCase().includes('user') || 
                (h as any).name.toLowerCase().includes('auth') ||
                (h as any).value?.toLowerCase().includes(f.val)
              );
            }
            default: return true;
          }
        });
      });
    }

    // MIME Type & Method Filter (Quick filters from toolbar)
    if (filterType !== 'all') {
      result = result.filter((e) => {
        const method = e.request.method.toLowerCase();
        if (filterType === method) return true;

        const mime = e.response.content.mimeType.toLowerCase();
        switch (filterType) {
          case 'xhr': return mime.includes('json') || mime.includes('xml');
          case 'js': return mime.includes('javascript') || mime.includes('script');
          case 'css': return mime.includes('css');
          case 'img': return mime.includes('image');
          case 'media': return mime.includes('video') || mime.includes('audio');
          case 'font': return mime.includes('font');
          case 'doc': return mime.includes('html');
          default: return false;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      let valA: any, valB: any;
      const getEffectiveSize = (e: HAREntry) => {
        const bSize = e.response.bodySize;
        const cSize = e.response.content?.size;
        if (typeof bSize === 'number' && bSize > 0) return bSize;
        if (typeof cSize === 'number' && cSize > 0) return cSize;
        return 0;
      };

      switch (sort.field) {
        case 'index': valA = (a as any)._originalIndex; valB = (b as any)._originalIndex; break;
        case 'startTime': valA = new Date(a.startedDateTime).getTime(); valB = new Date(b.startedDateTime).getTime(); break;
        case 'time': valA = a.time; valB = b.time; break;
        case 'size': valA = getEffectiveSize(a); valB = getEffectiveSize(b); break;
        case 'status': valA = a.response.status; valB = b.response.status; break;
        case 'method': valA = a.request.method; valB = b.request.method; break;
        case 'domain': 
          try { valA = new URL(a.request.url).hostname; } catch(e) { valA = ''; }
          try { valB = new URL(b.request.url).hostname; } catch(e) { valB = ''; }
          break;
        case 'url': valA = a.request.url; valB = b.request.url; break;
        case 'type': valA = a.response.content.mimeType; valB = b.response.content.mimeType; break;
        default: return 0;
      }
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sort.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
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
              onClick={() => setShowSanitizeModal(true)}
              className="px-3.5 py-1.5 rounded-md text-[13px] font-medium border border-brand-border bg-[#21262D] hover:border-brand-text-dim transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-brand-accent scale-110" />
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
              onClearMedia={handleClear}
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
                  onDeleteEntry={handleDeleteEntry}
                  selectedId={selectedEntry?._id}
                  columns={columns}
                  onSortBy={handleSortBy}
                  currentSort={sort}
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

      {showSanitizeModal && (
        <SanitizeModal 
          config={sanitizeConfig}
          onSave={setSanitizeConfig}
          onSanitize={handleSanitize}
          onClose={() => setShowSanitizeModal(false)}
        />
      )}
    </div>
  );
}
