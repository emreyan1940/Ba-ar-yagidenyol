import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COURSES, TOPICS } from '../../data/initialData';
import { XCircle, Plus, Trash2 } from 'lucide-react';

export const MistakeNotebookView: React.FC = () => {
  const { state, setState, showToast } = useApp();

  const [course, setCourse] = useState(COURSES[0]);
  const [topic, setTopic] = useState((TOPICS[COURSES[0]] && TOPICS[COURSES[0]][0]) || 'Genel');
  const [source, setSource] = useState('3D Deneme');
  const [reason, setReason] = useState('Bilgi eksiği');
  const [note, setNote] = useState('');

  const handleAddMistake = () => {
    const newMistake = {
      id: `m_${Date.now()}`,
      date: new Date().toLocaleDateString('tr-TR'),
      course,
      topic,
      source,
      reason,
      note
    };

    setState((prev) => ({
      ...prev,
      mistakes: [newMistake, ...prev.mistakes]
    }));

    setNote('');
    showToast('Yanlış Defterine kaydedildi!');
  };

  const handleDelete = (id: string) => {
    setState((prev) => ({
      ...prev,
      mistakes: prev.mistakes.filter((m) => m.id !== id)
    }));
    showToast('Kayıt silindi', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-4">
        <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-slate-100">
          <XCircle className="w-5 h-5 text-rose-500" />
          <h3>Yanlış Defteri & Hata Analizi</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ders</label>
            <select
              value={course}
              onChange={(e) => {
                const c = e.target.value;
                setCourse(c);
                if (TOPICS[c]) setTopic(TOPICS[c][0]);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Konu</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
            >
              {(TOPICS[course] || ['Genel']).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kaynak / Yayın</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Örn: 3D Deneme - 1"
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hata Nedeni</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
            >
              <option value="Bilgi eksiği">Bilgi eksiği</option>
              <option value="Dikkatsizlik">Dikkatsizlik</option>
              <option value="İşlem hatası">İşlem hatası</option>
              <option value="Süre yetmedi">Süre yetmedi</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Çözüm Notu & Öğrenilen Kural</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Doğru çözüm yöntemi, formül veya unuttuğum kural..."
            className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
          />
        </div>

        <button
          onClick={handleAddMistake}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-rose-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Yanlış Defterine Kaydet</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {state.mistakes.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 relative group"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {m.course} / {m.topic}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Neden: <span className="text-rose-600 dark:text-rose-400 font-bold">{m.reason}</span> • Yayın: {m.source} • {m.date}
                </div>
              </div>

              <button
                onClick={() => handleDelete(m.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {m.note && (
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                {m.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
