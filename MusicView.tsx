import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COURSES, TOPICS } from '../../data/initialData';
import { Search, CheckCircle, Clock, RotateCcw, AlertCircle } from 'lucide-react';
import { TopicStatus } from '../../types';

export const TopicsView: React.FC = () => {
  const { state, setState } = useApp();
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [search, setSearch] = useState('');

  const courseTopics = TOPICS[selectedCourse] || [];
  const filteredTopics = courseTopics.filter((t) => t.toLowerCase().includes(search.toLowerCase()));

  const statusLabels: Record<TopicStatus, { label: string; color: string; icon: React.ReactNode }> = {
    0: { label: 'Başlanmadı', color: 'bg-slate-700/50 text-slate-400 border-slate-600', icon: <AlertCircle className="w-3.5 h-3.5" /> },
    1: { label: 'Çalışıyor', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: <Clock className="w-3.5 h-3.5" /> },
    2: { label: 'Tekrar', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: <RotateCcw className="w-3.5 h-3.5" /> },
    3: { label: 'Tamamlandı', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: <CheckCircle className="w-3.5 h-3.5" /> }
  };

  const cycleStatus = (topicName: string) => {
    const key = `${selectedCourse}|${topicName}`;
    const current = state.topics[key] || 0;
    const next = ((current + 1) % 4) as TopicStatus;

    setState((prev) => ({
      ...prev,
      topics: {
        ...prev.topics,
        [key]: next
      }
    }));
  };

  // Completion stats
  const completedCount = courseTopics.filter((t) => (state.topics[`${selectedCourse}|${t}`] || 0) === 3).length;
  const totalCount = courseTopics.length;
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Course & Filter Bar */}
      <div className="p-6 rounded-2xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/80 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Ders Seçin</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Konu Ara</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Örn: Paragraf, Trigonometri, Optik..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Course Progress Header */}
        <div className="pt-2 border-t border-slate-700/60 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span>{selectedCourse} İlerleme Durumu</span>
            <span className="text-emerald-400">{completedCount} / {totalCount} Konu Tamamlandı (%{pct})</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTopics.map((topic) => {
          const key = `${selectedCourse}|${topic}`;
          const currentStatus: TopicStatus = (state.topics[key] || 0) as TopicStatus;
          const config = statusLabels[currentStatus];

          return (
            <div
              key={topic}
              onClick={() => cycleStatus(topic)}
              className="p-4 rounded-2xl bg-slate-800/60 dark:bg-slate-900/60 border border-slate-700/60 hover:border-blue-500/50 transition-all cursor-pointer select-none space-y-3 group shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-sm text-slate-100 group-hover:text-blue-300 transition-colors">
                  {topic}
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 shrink-0 ${config.color}`}>
                  {config.icon}
                  <span>{config.label}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                {selectedCourse} • Tıkla & Durum Değiştir
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
