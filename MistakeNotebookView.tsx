import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Calendar, Sparkles, ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

export const CampWeeklyView: React.FC = () => {
  const { state, setState, setActiveTab, showToast } = useApp();

  const [selectedCampId, setSelectedCampId] = useState(state.camps[0]?.id || '');
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [weekDay, setWeekDay] = useState(DAYS[0]);
  const [start, setStart] = useState('19:00');
  const [end, setEnd] = useState('20:00');

  const selectedCamp = state.camps.find((c) => c.id === selectedCampId) || state.camps[0];

  const handleAdd = () => {
    if (!selectedCamp || !selectedCamp.items[selectedDayIdx]) {
      showToast('Lütfen geçerli bir kamp günü seçin.', 'warning');
      return;
    }

    const item = selectedCamp.items[selectedDayIdx];
    const newScheduleItem = {
      id: `cw_${Date.now()}`,
      day: weekDay,
      start,
      end,
      duration: '1 sa',
      campId: selectedCamp.id,
      campName: selectedCamp.name,
      course: selectedCamp.course,
      topic: `${item.day}: ${item.topic}`,
      itemIndex: selectedDayIdx,
      done: false
    };

    setState((prev) => ({
      ...prev,
      campWeekly: [...prev.campWeekly, newScheduleItem]
    }));
    showToast('Kamp günü haftalık programa eklendi!');
  };

  const handleDeleteSelectedCamp = () => {
    if (!selectedCamp) {
      showToast('Lütfen silinecek kampı seçin', 'warning');
      return;
    }
    if (window.confirm(`"${selectedCamp.name}" kampını ve haftalık/aylık tüm takvim verilerini tamamen silmek istediğinize emin misiniz?`)) {
      const campIdToDelete = selectedCamp.id;
      const updatedCamps = state.camps.filter((c) => c.id !== campIdToDelete);
      const updatedMonthly = state.campMonthly.filter((m) => m.campId !== campIdToDelete);
      const updatedWeekly = state.campWeekly.filter((w) => w.campId !== campIdToDelete);
      const nextCampId = updatedCamps[0]?.id || '';

      setState((prev) => ({
        ...prev,
        camps: updatedCamps,
        campMonthly: updatedMonthly,
        campWeekly: updatedWeekly,
        activeCampId: nextCampId
      }));

      setSelectedCampId(nextCampId);
      showToast(`"${selectedCamp.name}" kampı silindi.`, 'info');
    }
  };

  const handleDelete = (id: string) => {
    setState((prev) => ({
      ...prev,
      campWeekly: prev.campWeekly.filter((item) => item.id !== id),
      campMonthly: prev.campMonthly.filter((item) => item.id !== id && `cw_synced_${item.id}` !== id)
    }));
    showToast('Kamp maddesi silindi');
  };

  const handleToggleDone = (id: string) => {
    setState((prev) => ({
      ...prev,
      campWeekly: prev.campWeekly.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
      campMonthly: prev.campMonthly.map((item) =>
        item.id === id || `cw_synced_${item.id}` === id ? { ...item, done: !item.done } : item
      )
    }));
  };

  const handleAddNext7Days = () => {
    if (!selectedCamp) return;
    const firstUndoneIdx = selectedCamp.items.findIndex((i) => !i.done);
    const startIdx = firstUndoneIdx >= 0 ? firstUndoneIdx : 0;

    const next7 = selectedCamp.items.slice(startIdx, startIdx + 7).map((item, i) => ({
      id: `cw_auto_${Date.now()}_${i}`,
      day: DAYS[i % 7],
      start,
      end,
      duration: '1 sa',
      campId: selectedCamp.id,
      campName: selectedCamp.name,
      course: selectedCamp.course,
      topic: `${item.day}: ${item.topic}`,
      itemIndex: startIdx + i,
      done: false
    }));

    setState((prev) => ({
      ...prev,
      campWeekly: [...prev.campWeekly, ...next7]
    }));
    showToast('Sıradaki 7 kamp günü haftalık plana dağıtıldı!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Navigation Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Haftalık Kamp Programı</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aylık takvimle senkronize çalışan 7 günlük kamp ders çizelgeniz.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('campMonthly')}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all border border-slate-200 dark:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>📅 Aylık Kamp Takvimine Geç</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold text-base">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3>Manuel Haftalık Ders Ekleme</h3>
          </div>
          <button
            onClick={handleAddNext7Days}
            className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>⚡ Sıradaki 7 Kamp Gününü Otomatik Dağıt</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kamp Seçin</label>
            <select
              value={selectedCampId}
              onChange={(e) => {
                setSelectedCampId(e.target.value);
                setSelectedDayIdx(0);
              }}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {state.camps.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kamp Günü / Konu</label>
            <select
              value={selectedDayIdx}
              onChange={(e) => setSelectedDayIdx(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {selectedCamp?.items.map((item, idx) => (
                <option key={item.id} value={idx}>
                  {item.day} - {item.topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Haftanın Günü</label>
            <select
              value={weekDay}
              onChange={(e) => setWeekDay(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Saat Aralığı</label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs text-center font-bold"
              />
              <span className="text-slate-400 font-bold">-</span>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs text-center font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAdd}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Haftalık Programa Ekle</span>
          </button>

          <button
            onClick={handleDeleteSelectedCamp}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-rose-600/20 cursor-pointer"
            title="Seçili kampı tamamen sil"
          >
            <Trash2 className="w-4 h-4" />
            <span>🗑️ Seçili Kampı Sil</span>
          </button>
        </div>
      </div>

      {/* Grid for 7 Days */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {DAYS.map((d) => {
          // Combine direct weekly items and synced monthly items for this weekday
          const items = state.campWeekly.filter((item) => item.day === d);

          return (
            <div
              key={d}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 min-h-[180px]"
            >
              <div className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-2 flex justify-between items-center">
                <span>{d}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {items.length} Ders
                </span>
              </div>

              {items.length > 0 ? (
                <div className="space-y-2">
                  {items.map((w) => (
                    <div
                      key={w.id}
                      className={`p-2.5 rounded-xl border text-xs space-y-1.5 relative group transition-all ${
                        w.done
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 opacity-75'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-extrabold">
                          {w.start || '19:00'} - {w.end || '20:00'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleDone(w.id)}
                            className="text-slate-400 hover:text-emerald-600 transition-colors"
                            title={w.done ? 'Tamamlanmadı yap' : 'Tamamlandı işaretle'}
                          >
                            {w.done ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(w.id)}
                            className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div
                        className={`font-bold leading-tight ${
                          w.done
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {w.topic}
                      </div>

                      <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                        {w.campName || w.course}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center py-6 italic font-medium">
                  Planlanmış ders yok
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
