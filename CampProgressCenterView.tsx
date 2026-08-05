import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COURSES, TOPICS } from '../../data/initialData';
import { BrainCircuit, Plus, CheckCircle, Trash2, Sparkles } from 'lucide-react';

export const WeakCenterView: React.FC = () => {
  const { state, setState, showToast } = useApp();

  const [course, setCourse] = useState(COURSES[0]);
  const [topic, setTopic] = useState((TOPICS[COURSES[0]] && TOPICS[COURSES[0]][0]) || 'Genel');
  const [level, setLevel] = useState<'Orta' | 'Yüksek' | 'Çok Yüksek'>('Yüksek');

  const handleAddManual = () => {
    const newWeak = {
      id: `w_${Date.now()}`,
      course,
      topic,
      level,
      count: 1,
      done: false,
      source: 'Manuel Ekleme'
    };

    setState((prev) => ({
      ...prev,
      weakTopics: [newWeak, ...prev.weakTopics]
    }));
    showToast('Eksik konu eklendi');
  };

  const handleAutoBuild = () => {
    const autoWeakItems: any[] = [];

    // From mistakes
    state.mistakes.forEach((m) => {
      autoWeakItems.push({
        id: `w_auto_${Date.now()}_${Math.random()}`,
        course: m.course,
        topic: m.topic,
        level: 'Yüksek' as const,
        count: 1,
        done: false,
        source: 'Yanlış Defteri'
      });
    });

    // From exam wrong topics
    state.exams.forEach((e) => {
      if (e.wrongTopics) {
        e.wrongTopics.forEach((wt) => {
          autoWeakItems.push({
            id: `w_auto_${Date.now()}_${Math.random()}`,
            course: wt.course,
            topic: wt.topic,
            level: wt.count >= 3 ? ('Çok Yüksek' as const) : ('Yüksek' as const),
            count: wt.count,
            done: false,
            source: 'Deneme Analizi'
          });
        });
      }
    });

    setState((prev) => ({
      ...prev,
      weakTopics: [...autoWeakItems, ...prev.weakTopics]
    }));
    showToast('Denemeler ve Yanlış Defterinden eksik konular otomatik çekildi!');
  };

  const handleToggleDone = (id: string) => {
    setState((prev) => ({
      ...prev,
      weakTopics: prev.weakTopics.map((w) => (w.id === id ? { ...w, done: !w.done } : w))
    }));
  };

  const handleDelete = (id: string) => {
    setState((prev) => ({
      ...prev,
      weakTopics: prev.weakTopics.filter((w) => w.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="p-6 rounded-2xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/80 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-lg">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            <h3>Eksik Konu Merkezi</h3>
          </div>
          <button
            onClick={handleAutoBuild}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Denemelerden Otomatik Bul</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Ders</label>
            <select
              value={course}
              onChange={(e) => {
                const c = e.target.value;
                setCourse(c);
                if (TOPICS[c] && TOPICS[c].length > 0) setTopic(TOPICS[c][0]);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Konu</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {(TOPICS[course] || ['Genel']).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Önem / Öncelik</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Orta">Orta</option>
              <option value="Yüksek">Yüksek</option>
              <option value="Çok Yüksek">Çok Yüksek</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleAddManual}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-purple-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Eksik Konu Ekle</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {state.weakTopics.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
              item.done
                ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through'
                : 'bg-slate-800/80 dark:bg-slate-900/80 border-slate-700/80 text-slate-100 shadow-sm'
            }`}
          >
            <div>
              <div className="font-bold text-sm">{item.course} • {item.topic}</div>
              <div className="text-xs text-slate-400 mt-1">
                Öncelik: <span className="text-purple-400 font-semibold">{item.level}</span> • Kaynak: {item.source}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleDone(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  item.done
                    ? 'bg-slate-800 text-slate-400 border border-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {item.done ? 'Geri Al' : 'Kapat'}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
