import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LineChart, BarChart3, TrendingUp, Target, Award, AlertTriangle, Sparkles } from 'lucide-react';

export const ExamChartsView: React.FC = () => {
  const { state } = useApp();
  const [filterType, setFilterType] = useState<'ALL' | 'TYT' | 'AYT'>('ALL');

  const filteredExams = state.exams.filter((e) => (filterType === 'ALL' ? true : e.type === filterType));
  const examsReversed = [...filteredExams].reverse();

  if (examsReversed.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 space-y-3">
        <LineChart className="w-10 h-10 mx-auto text-indigo-500/50" />
        <p className="font-extrabold text-slate-900 dark:text-slate-100 text-base">Henüz kayıtlı deneme bulunmuyor.</p>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Grafik ve net gelişiminizi görmek için "Deneme Analizi" sekmesinden ilk denemenizi kaydedebilirsiniz.
        </p>
      </div>
    );
  }

  // Net progression stats
  const nets = examsReversed.map((e) => e.net);
  const avgNet = Number((nets.reduce((a, b) => a + b, 0) / nets.length).toFixed(2));
  const maxNetVal = Math.max(...nets);
  const minNetVal = Math.min(...nets);

  const maxNet = Math.max(10, Math.ceil(maxNetVal / 10) * 10);
  const minNet = Math.max(0, Math.floor(minNetVal / 10) * 10);
  const range = maxNet - minNet || 1;

  // SVG Chart Dimensions
  const width = 600;
  const height = 220;
  const padding = 40;

  const points = examsReversed.map((e, idx) => {
    const x = padding + (idx * (width - padding * 2)) / Math.max(1, examsReversed.length - 1);
    const y = height - padding - ((e.net - minNet) / range) * (height - padding * 2);
    return { x, y, net: e.net, name: e.name, date: e.date, type: e.type };
  });

  const polylinePath = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Last exam lesson breakdown
  const lastExam = filteredExams[0];

  // Frequency analysis of wrong topics across exams
  const wrongTopicCounts: Record<string, number> = {};
  filteredExams.forEach((e) => {
    if (e.wrong) {
      e.wrong.split(',').forEach((w) => {
        const cleaned = w.trim();
        if (cleaned) {
          wrongTopicCounts[cleaned] = (wrongTopicCounts[cleaned] || 0) + 1;
        }
      });
    }
  });

  const sortedWrongTopics = Object.entries(wrongTopicCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* Filters & Quick KPI Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-extrabold text-lg text-slate-900 dark:text-slate-100">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3>Deneme Net Gelişim & Trend Analizi</h3>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['ALL', 'TYT', 'AYT'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === t
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t === 'ALL' ? 'Tümü' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">En Yüksek Net</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{maxNetVal} Net</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Ortalama Net</span>
              <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{avgNet} Net</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Sınav Sayısı</span>
              <span className="text-base font-black text-slate-900 dark:text-slate-100">{filteredExams.length} Deneme</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Progress Line Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            {filterType} Net Değişim Çizgisi
          </span>
          <span className="text-xs text-slate-500">Noktaların üzerine gelerek veya bakarak takip edebilirsiniz</span>
        </div>

        <div className="relative w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[300px]">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const yVal = padding + ratio * (height - padding * 2);
              const netLabel = (maxNet - ratio * range).toFixed(0);
              return (
                <g key={idx}>
                  <line
                    x1={padding}
                    y1={yVal}
                    x2={width - padding}
                    y2={yVal}
                    stroke="rgba(148, 163, 184, 0.2)"
                    strokeDasharray="4 4"
                  />
                  <text x={padding - 10} y={yVal + 4} fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="end">
                    {netLabel}
                  </text>
                </g>
              );
            })}

            {/* Line */}
            {points.length > 1 && (
              <polyline
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylinePath}
              />
            )}

            {/* Points */}
            {points.map((p, idx) => (
              <g key={idx} className="group cursor-pointer">
                <circle cx={p.x} cy={p.y} r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                <text
                  x={p.x}
                  y={p.y - 10}
                  fill="#10b981"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {p.net}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Lesson Breakdown Bar Chart for Last Exam */}
      {lastExam && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-slate-100">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3>Son Deneme Ders Dağılımı ({lastExam.name})</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lastExam.det.map((d) => (
              <div
                key={d.l}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2"
              >
                <div className="font-bold text-xs text-indigo-600 dark:text-indigo-400">{d.l}</div>
                <div className="text-xl font-black text-slate-900 dark:text-slate-100">{d.net} Net</div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{d.d} Doğru</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{d.y} Yanlış</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wrong Topic Frequency Analysis Card */}
      {sortedWrongTopics.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-extrabold text-base text-slate-900 dark:text-slate-100">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3>En Çok Yanlış Yapılan Konuların Frekans Analizi</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {sortedWrongTopics.slice(0, 6).map(([topic, count]) => (
              <div
                key={topic}
                className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between"
              >
                <span className="font-bold text-xs text-rose-900 dark:text-rose-200 truncate pr-2">{topic}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[11px] shrink-0">
                  {count} Kez
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

