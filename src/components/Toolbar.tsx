import { useState } from 'react';
import { Search, Settings2, Check, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import { ColumnConfig } from '../types';

interface ToolbarProps {
  onSearch: (q: string) => void;
  onFilterType: (type: string) => void;
  onSortBy: (field: string) => void;
  onSanitize: () => void;
  onClearMedia: () => void;
  currentSort: { field: string; direction: 'asc' | 'desc' };
  activeFilter: string;
  columns: ColumnConfig[];
  onToggleColumn: (id: string) => void;
  onMoveColumn: (id: string, direction: 'up' | 'down') => void;
  onResetColumns: () => void;
}

export default function Toolbar({ 
  onSearch, 
  onFilterType, 
  onSortBy, 
  currentSort, 
  activeFilter,
  columns,
  onToggleColumn,
  onMoveColumn,
  onResetColumns
}: ToolbarProps) {
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const methodFilters = ['all', 'get', 'post'];
  const typeFilters = ['xhr', 'js', 'css', 'img'];

  return (
    <div className="h-12 bg-brand-bg border-b border-brand-border flex items-center px-5 gap-5 shrink-0 z-20" id="toolbar">
      <div className="flex items-center gap-2 text-xs text-brand-text-dim shrink-0">
        <span className="font-medium text-[10px] uppercase tracking-wider">Method:</span>
        <div className="flex items-center gap-1">
          {methodFilters.map((method) => (
            <button
              key={method}
              onClick={() => onFilterType(method === 'all' ? 'all' : method)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer border ${
                activeFilter === method 
                  ? 'bg-brand-accent text-white border-brand-accent shadow-sm' 
                  : 'bg-brand-border/20 text-brand-text border-brand-border hover:brightness-125'
              }`}
            >
              {method.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-brand-text-dim shrink-0">
        <span className="font-medium text-[10px] uppercase tracking-wider">Type:</span>
        <div className="flex items-center gap-1">
          {typeFilters.map((type) => (
            <button
              key={type}
              onClick={() => onFilterType(activeFilter === type ? 'all' : type)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer border ${
                activeFilter === type 
                  ? 'bg-brand-accent text-white border-brand-accent shadow-sm' 
                  : 'bg-brand-border/20 text-brand-text border-brand-border hover:brightness-125'
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex justify-center px-4">
        <div className="relative group w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-text-dim" />
          <input
            type="text"
            placeholder="Filter by URL, method or status..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-black/40 border border-brand-border rounded-md px-9 py-1 text-xs text-brand-text focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/20 transition-all placeholder:text-[10px] placeholder:uppercase placeholder:tracking-wider placeholder:opacity-40"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0 relative">
        <div className="flex items-center gap-1 text-xs text-brand-text-dim">
           <button 
             onClick={() => setShowColumnSettings(!showColumnSettings)}
             className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-all text-[11px] font-bold uppercase tracking-wider ${
               showColumnSettings ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : 'bg-brand-bg border-brand-border hover:border-brand-text-dim'
             }`}
           >
             <Settings2 className="w-3.5 h-3.5" />
             <span>Columns</span>
           </button>

           {showColumnSettings && (
             <div className="absolute top-full right-0 mt-2 w-56 bg-brand-panel border border-brand-border rounded-lg shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
               <div className="flex items-center justify-between px-2 py-2 mb-1 border-b border-brand-border">
                 <span className="text-[10px] font-bold text-brand-text-dim uppercase tracking-widest">Layout</span>
                 <button 
                   onClick={onResetColumns}
                   className="p-1 hover:bg-white/5 rounded text-brand-text-dim hover:text-brand-warning transition-colors"
                   title="Reset to defaults"
                 >
                   <RotateCcw className="w-3 h-3" />
                 </button>
               </div>
               <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-border">
                 {columns.map((col, idx) => (
                   <div
                     key={col.id}
                     className="group flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 text-[12px] transition-colors"
                   >
                     <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                        <button disabled={idx === 0} onClick={() => onMoveColumn(col.id, 'up')} className="p-0.5 hover:text-brand-accent disabled:opacity-20"><ChevronUp className="w-2.5 h-2.5" /></button>
                        <button disabled={idx === columns.length - 1} onClick={() => onMoveColumn(col.id, 'down')} className="p-0.5 hover:text-brand-accent disabled:opacity-20"><ChevronDown className="w-2.5 h-2.5" /></button>
                     </div>
                     <button
                        onClick={() => onToggleColumn(col.id)}
                        className="flex-1 text-left flex items-center justify-between"
                     >
                       <span className={col.visible ? 'text-brand-text font-medium' : 'text-brand-text-dim'}>{col.label}</span>
                       {col.visible && <Check className="w-3.5 h-3.5 text-brand-accent" />}
                     </button>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>

        <div className="flex items-center gap-1 text-xs text-brand-text-dim">
           <span className="text-[10px] uppercase tracking-wider font-bold mr-1">Sort:</span>
           <select 
             onChange={(e) => onSortBy(e.target.value)}
             className="bg-brand-bg border border-brand-border rounded px-1.5 py-1 text-brand-text focus:outline-none focus:border-brand-accent text-[11px]"
             value={currentSort.field}
           >
             <option value="startTime">Time Created</option>
             <option value="time">Latency</option>
             <option value="size">Transfer Size</option>
             <option value="status">Response Code</option>
             <option value="method">Method</option>
           </select>
        </div>
      </div>
    </div>
  );
}
