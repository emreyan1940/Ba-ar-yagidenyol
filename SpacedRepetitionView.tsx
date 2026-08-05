import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { COURSES } from '../../data/initialData';
import { Play, Pause, RotateCcw, CheckCircle, Maximize2, Minimize2, Timer } from 'lucide-react';

export const PomodoroView: React.FC = () => {
  const { state, setState, showToast } = useApp();

  const [minutes, setMinutes] = useState(25);
  const [course, setCourse] = useState(COURSES[0]);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    setSecondsLeft(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleFinishSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleFinishSession = () => {
    setState((prev) => ({
      ...prev,
      pomo: {
        sessions: prev.pomo.sessions + 1,
        minutes: prev.pomo.minutes + minutes
      },
      daily: [
        {
          id: `pomo_daily_${Date.now()}`,
          course,
          topic: 'Pomodoro Oturumu',
          min: minutes,
          q: 0,
          done: true,
          date: new Date().toLocaleDateString('tr-TR')
        },
        ...prev.daily
      ]
    }));
    showToast(`Tebrikler! ${minutes} dakikalık Pomodoro oturumun kaydedildi 🎉`);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-6 ${isFocusMode ? 'fixed inset-0 z-50 bg-slate-950 p-8 flex flex-col justify-center items-center' : ''}`}>
      <div className="max-w-xl mx-auto w-full p-8 rounded-3xl bg-slate-800/90 dark:bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-6 text-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-100 text-lg">
            <Timer className="w-5 h-5 text-emerald-400" />
            <span>Pomodoro Sayaç</span>
          </div>

          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isFocusMode ? 'Normal Mod' : 'Odak Modu'}
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Settings Selectors */}
        {!isFocusMode && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Süre</label>
              <select
                value={minutes}
                onChange={(e) => {
                  setMinutes(Number(e.target.value));
                  setIsRunning(false);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm font-bold focus:outline-none"
              >
                <option value={25}>25 Dakika</option>
                <option value={40}>40 Dakika</option>
                <option value={50}>50 Dakika</option>
                <option value={90}>90 Dakika</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Ders</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm font-bold focus:outline-none"
              >
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Big Timer Display */}
        <div className="py-8 font-black text-6xl sm:text-7xl tracking-tighter text-emerald-400 font-mono drop-shadow-md">
          {formatTime(secondsLeft)}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isRunning ? 'Duraklat' : 'Başlat'}</span>
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(minutes * 60);
            }}
            className="p-3 rounded-2xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Sıfırla"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleFinishSession}
            className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/30"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Kaydet</span>
          </button>
        </div>

        {/* Session Stats */}
        <div className="pt-4 border-t border-slate-700/60 text-xs text-slate-400 font-semibold flex items-center justify-around">
          <span>Toplam Oturum: <strong className="text-slate-100">{state.pomo.sessions}</strong></span>
          <span>Toplam Odaklanma: <strong className="text-slate-100">{state.pomo.minutes} dk</strong></span>
        </div>
      </div>
    </div>
  );
};
