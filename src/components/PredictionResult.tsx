import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useState } from 'react';
import type { Prediction } from '../lib/supabase';

interface PredictionResultProps {
  prediction: Prediction;
  onDownloadReport: () => void;
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 85 ? 'bg-emerald-500' : value >= 65 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-bold text-gray-700 w-12 text-right">{value}%</span>
    </div>
  );
}

export default function PredictionResult({ prediction, onDownloadReport }: PredictionResultProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('description');

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const severityConfig = prediction.is_healthy
    ? { icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', iconColor: 'text-emerald-500', label: 'Healthy' }
    : prediction.confidence >= 85
    ? { icon: XCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700', iconColor: 'text-red-500', label: 'High Risk' }
    : { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', iconColor: 'text-amber-500', label: 'Moderate Risk' };

  const { icon: StatusIcon } = severityConfig;

  const sections = [
    { key: 'description', label: 'Description', content: prediction.description, isList: false },
    ...(prediction.causes.length > 0 ? [{ key: 'causes', label: 'Causes', content: prediction.causes, isList: true }] : []),
    { key: 'prevention', label: 'Prevention Methods', content: prediction.prevention, isList: true },
    { key: 'treatment', label: 'Recommended Treatment', content: prediction.treatment, isList: false },
  ] as { key: string; label: string; content: string | string[]; isList: boolean }[];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`${severityConfig.bg} ${severityConfig.border} border-b p-6`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${severityConfig.bg} border ${severityConfig.border} flex items-center justify-center`}>
              <StatusIcon className={`w-6 h-6 ${severityConfig.iconColor}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`text-xl font-bold ${severityConfig.text}`}>{prediction.disease_name}</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${severityConfig.badge}`}>
                  {severityConfig.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">Crop: {prediction.crop_type}</p>
            </div>
          </div>
          <button
            onClick={onDownloadReport}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Download Report
          </button>
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Detection Confidence</p>
          <ConfidenceBar value={prediction.confidence} />
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {sections.map((section) => (
          <div key={section.key} className="group">
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-800 text-sm">{section.label}</span>
              {expandedSection === section.key
                ? <ChevronUp className="w-4 h-4 text-gray-400" />
                : <ChevronDown className="w-4 h-4 text-gray-400" />
              }
            </button>
            {expandedSection === section.key && (
              <div className="px-6 pb-5">
                {section.isList && Array.isArray(section.content) ? (
                  <ul className="space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-gray-600 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 text-sm leading-relaxed">{section.content as string}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
