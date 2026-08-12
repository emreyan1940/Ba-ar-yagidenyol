import React, { useMemo } from 'react';
import { useApp } from './AppContext';

export const CampTrackerView: React.FC = () => {
  const { camps, toggleCampDay, addCamp, deleteCamp } = useApp();
  const active = camps?.[0];
  const days = active?.days ?? active?.items ?? [];
  const completed = days.filter((d: any) => d.completed || d.done).length;
  const percent = days.length ? Math.round((completed / days.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">📚 Kamp Takibi</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kampını gün gün takip et, tamamladıklarını işaretle.</p>
          </div>
          <button onClick={() => addCamp?.()} className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">+ Kamp Ekle</button>
        </div>
        {active && (
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm"><span>{active.name}</span><strong>%{percent}</strong></div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${percent}%` }} /></div>
            <div className="mt-2 text-xs text-slate-500">{completed} / {days.length} gün tamamlandı</div>
          </div>
        )}
      </div>

      {!active ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-white/20">
          <div className="text-4xl">📚</div><h2 className="mt-3 text-lg font-semibold">Henüz kamp yok</h2><p className="mt-1 text-sm text-slate-500">Kamp Ekle butonuyla ilk kampını oluştur.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {days.map((day: any, index: number) => {
            const done = Boolean(day.completed ?? day.done);
            return <button key={day.id ?? index} onClick={() => toggleCampDay?.(active.id, day.id ?? index)} className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${done ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20' : 'border-slate-200 bg-white dark:border-white/10 dark:bg-[#111]'}`}>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-white/20'}`}>{done ? '✓' : index + 1}</span>
              <span className="flex-1"><strong>{day.title ?? day.topic ?? day.name ?? `Gün ${index + 1}`}</strong>{day.duration ? <small className="ml-2 text-slate-500">{day.duration} dk</small> : null}</span>
            </button>;
          })}
          <button onClick={() => deleteCamp?.(active.id)} className="mt-3 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/20">Bu Kampı Sil</button>
        </div>
      )}
    </div>
  );
};
