import type { Prediction } from '../lib/supabase';

interface StatsBarProps {
  predictions: Prediction[];
}

export default function StatsBar({ predictions }: StatsBarProps) {
  const total = predictions.length;
  const healthy = predictions.filter(p => p.is_healthy).length;
  const diseased = total - healthy;
  const avgConfidence = total > 0
    ? (predictions.reduce((sum, p) => sum + p.confidence, 0) / total).toFixed(1)
    : '—';

  const stats = [
    { label: 'Total Scans', value: total.toString(), color: 'text-gray-900' },
    { label: 'Healthy', value: healthy.toString(), color: 'text-emerald-600' },
    { label: 'Diseased', value: diseased.toString(), color: 'text-red-500' },
    { label: 'Avg Confidence', value: total > 0 ? `${avgConfidence}%` : '—', color: 'text-blue-600' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map(({ label, value, color }) => (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className={`text-2xl font-black ${color}`}>{value}</p>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
        </div>
      ))}
    </div>
  );
}
