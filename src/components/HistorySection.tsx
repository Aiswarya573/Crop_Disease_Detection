import { Clock, Trash2, CheckCircle, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import type { Prediction } from '../lib/supabase';

interface HistorySectionProps {
  history: Prediction[];
  onSelect: (prediction: Prediction) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  selectedId?: string;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function HistorySection({ history, onSelect, onDelete, onClearAll, selectedId }: HistorySectionProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Clock className="w-7 h-7 text-gray-300" />
        </div>
        <p className="font-medium text-gray-500 text-sm">No analysis history yet</p>
        <p className="text-gray-400 text-xs mt-1">Your previous detections will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <h3 className="font-semibold text-gray-800 text-sm">Recent Detections</h3>
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">{history.length}</span>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
        >
          Clear all
        </button>
      </div>

      <div className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
        {history.map((item) => {
          const isSelected = item.id === selectedId;
          const StatusIcon = item.is_healthy ? CheckCircle : item.confidence >= 85 ? XCircle : AlertTriangle;
          const iconColor = item.is_healthy ? 'text-emerald-500' : item.confidence >= 85 ? 'text-red-500' : 'text-amber-500';
          const bgColor = item.is_healthy ? 'bg-emerald-50' : item.confidence >= 85 ? 'bg-red-50' : 'bg-amber-50';

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`group flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 ${
                isSelected ? 'bg-emerald-50 border-l-2 border-emerald-500' : 'hover:bg-gray-50 border-l-2 border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border ${isSelected ? 'border-emerald-200' : 'border-gray-100'}`}>
                {item.image_url ? (
                  <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full ${bgColor} flex items-center justify-center`}>
                    <StatusIcon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <StatusIcon className={`w-3.5 h-3.5 ${iconColor} flex-shrink-0`} />
                  <p className="text-sm font-medium text-gray-800 truncate">{item.disease_name}</p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-gray-400">{item.crop_type}</p>
                  <span className="text-gray-200">·</span>
                  <p className="text-xs text-gray-400">{item.confidence}%</p>
                  <span className="text-gray-200">·</span>
                  <p className="text-xs text-gray-400">{formatDate(item.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-500' : 'text-gray-300'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
