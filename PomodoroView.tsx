import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Calendar, BookOpen, Library, ClipboardCheck, ArrowRight, Sparkles, Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

export const DashboardView: React.FC = () => {
  const { state, setState, setActiveTab, showToast } = useApp();

  // Get Turkish day name for today
  const daysTurkish = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const todayIndex = new Date().getDay();
  const todayName = daysTurkish[todayIndex];

  // YKS Countdown
  const yksDateObj = new Date(`${state.yksDate}T10:00:00`);
  const daysLeft = Math.max(0, Math.ceil((yksDateObj.getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

  // Active Camp
  const activeCamp = state.camps.find((c) => c.id === state.activeCampId) || state.camps[0];
  const activeCampPendingItems = activeCamp ? activeCamp.items.filter((i) => !i.done).slice(0, 3) : [];

  // Toggle camp weekly item done status
  const handleToggleCampWeeklyDone = (id: string) => {
    setState((prev) => ({
      ...prev,
      campWeekly: prev.campWeekly.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
      campMonthly: prev.campMonthly.map((item) =>
        item.id === id || `cw_synced_${item.id}` === id ? { ...item, done: !item.done } : item
      )
    }));
    showToast('Kamp maddesi durumu güncellendi!', 'success');
  };

  // Auto add next 7 camp days to weekly schedule from active camp
  const handleAddNext7DaysToWeekly = () => {
    if (!activeCamp) {
      showToast('Aktif kamp bulunamadı', 'warning');
      return;
    }
    const firstUndoneIdx = activeCamp.items.findIndex((i) => !i.done);
    const startIdx = firstUndoneIdx >= 0 ? firstUndoneIdx : 0;

    const next7 = activeCamp.items.slice(startIdx, startIdx + 7).map((item, i) => ({
      id: `cw_auto_${Date.now()}_${i}`,
      day: DAYS[i % 7],
      start: '19:00',
      end: '20:00',
      duration: '1 sa',
      campId: activeCamp.id,
      campName: activeCamp.name,
      course: activeCamp.course,
      topic: `${item.day}: ${item.topic}`,
      itemIndex: startIdx + i,
      done: false
    }));

    setState((prev) => ({
      ...prev,
      campWeekly: [...prev.campWeekly, ...next7]
    }));
    showToast('Sıradaki 7 kamp günü haftalık takvime eklendi!', 'success');
  };

  // Quick stats
  const totalBooksCount = state.books.length;
  const totalSolvedQuestions = state.books.reduce((acc, curr) => acc + (curr.solved || 0), 0);
  const lastExam = state.exams[0];
  const totalMistakesCount = state.mistakes.length;

  return (
    <div className="space-y-6">
      {/* Modern Hero Greeting Header */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>Bugün: {todayName}</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-amber-400/20 backdrop-blur-md text-amber-200 text-xs font-bold border border-amber-300/30">
                🔥 YKS 2027: {daysLeft} Gün Kaldı
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
              Hoş Geldin, Şampiyon! 👋
            </h2>

            <p className="text-sm text-indigo-100 font-medium leading-relaxed">
              Hedefin: <strong className="text-amber-300 underline font-extrabold">{state.goal?.uni} - {state.goal?.dept}</strong>. Disiplinli çalışmayla zirveye bir adım daha yaklaş!
            </p>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('campWeekly')}
              className="px-4 py-2.5 rounded-2xl bg-white text-indigo-900 font-extrabold text-xs shadow-lg hover:bg-amber-300 hover:text-slate-900 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Haftalık Kamp Takvimi</span>
            </button>

            <button
              onClick={() => setActiveTab('lessonNotes')}
              className="px-4 py-2.5 rounded-2xl bg-indigo-900/60 hover:bg-indigo-900 text-white font-bold text-xs border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>A4 Ders Notları</span>
            </button>
          </div>
        </div>
      </div>

      {/* BUGÜN NE ÇÖZMELİYİM? (AKILLI GÜNLÜK ÖDEV MOTORU) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 font-extrabold text-lg">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-white text-base">Bugün Ne Çözmeliyim?</h3>
              <p className="text-xs text-indigo-200 font-normal">
                Eksik konularına, kamp takvimine ve derece hedefine göre günün akıllı çalışma rotası
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              showToast('Akıllı günlük ödev rotanız kamp ve eksik konularınızdan güncellendi!', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ödev Rotasını Yenile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Daily Task 1 */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span>1. Kamp Görevi</span>
              <span className="text-[10px] bg-amber-400/20 px-2 py-0.5 rounded-full text-amber-200">
                {activeCamp?.course || 'TYT'}
              </span>
            </div>
            <p className="text-xs font-bold text-white line-clamp-2">
              {activeCampPendingItems[0]?.topic || 'Paragraf Hız Testi - 30 Soru Çözümü'}
            </p>
            <div className="text-[11px] text-indigo-200 flex items-center justify-between pt-1">
              <span>Hedef: 35 Soru / 40 Dk</span>
              <button
                onClick={() => {
                  showToast('Kamp görevi tamamlandı!', 'success');
                }}
                className="text-emerald-400 hover:underline font-bold cursor-pointer"
              >
                ✓ Tamamla
              </button>
            </div>
          </div>

          {/* Daily Task 2 */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
              <span>2. Eksik Konu Kapatma</span>
              <span className="text-[10px] bg-indigo-400/20 px-2 py-0.5 rounded-full text-indigo-200">
                {state.weakTopics[0]?.course || 'Matematik'}
              </span>
            </div>
            <p className="text-xs font-bold text-white line-clamp-2">
              {state.weakTopics[0]?.topic
                ? `${state.weakTopics[0].topic} - Test & Video Tekrarı`
                : 'Problem Çözme Teknikleri & 25 Soru'}
            </p>
            <div className="text-[11px] text-indigo-200 flex items-center justify-between pt-1">
              <span>Hedef: 2 Test / 50 Dk</span>
              <button
                onClick={() => {
                  showToast('Eksik konu görevi tamamlandı!', 'success');
                }}
                className="text-emerald-400 hover:underline font-bold cursor-pointer"
              >
                ✓ Tamamla
              </button>
            </div>
          </div>

          {/* Daily Task 3 */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
              <span>3. Akıllı Tekrar & Yanlış Defteri</span>
              <span className="text-[10px] bg-emerald-400/20 px-2 py-0.5 rounded-full text-emerald-200">
                Tekrar
              </span>
            </div>
            <p className="text-xs font-bold text-white line-clamp-2">
              Yanlış Defterinden {totalMistakesCount > 0 ? `${totalMistakesCount} Soru` : '15 Yanlış Soru'} İncelemesi
            </p>
            <div className="text-[11px] text-indigo-200 flex items-center justify-between pt-1">
              <span>Hedef: 15 Soru Analizi</span>
              <button
                onClick={() => setActiveTab('mistakes')}
                className="text-amber-300 hover:underline font-bold cursor-pointer"
              >
                İncele →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HAFTALIK KAMP TAKVİMİ (MAIN SECTION ON ANA SAYFA) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-extrabold text-lg text-slate-900 dark:text-slate-100">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3>Haftalık Kamp Takvimi</h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {activeCamp?.name || 'Aktif Kamp'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddNext7DaysToWeekly}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Sıradaki 7 Kamp Gününü Ekle</span>
            </button>

            <button
              onClick={() => setActiveTab('campWeekly')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Takvimi Yönet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {state.campWeekly.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Haftalık kamp takviminizde henüz kayıtlı ders bulunmuyor.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleAddNext7DaysToWeekly}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sıradaki 7 Kamp Gününü Otomatik Dağıt</span>
              </button>
              <button
                onClick={() => setActiveTab('campWeekly')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Kamp Takvimini Düzenle</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {DAYS.map((d) => {
              const dayItems = state.campWeekly.filter((w) => w.day === d);
              const isToday = d === todayName;

              return (
                <div
                  key={d}
                  className={`p-3.5 rounded-2xl border space-y-2.5 min-h-[170px] ${
                    isToday
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 ring-1 ring-indigo-200 dark:ring-indigo-800'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="font-extrabold text-xs text-indigo-700 dark:text-indigo-300 border-b border-slate-200 dark:border-slate-700/60 pb-2 flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      {d}
                      {isToday && <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded-full font-bold">Bugün</span>}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {dayItems.length}
                    </span>
                  </div>

                  {dayItems.length > 0 ? (
                    <div className="space-y-2">
                      {dayItems.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-xl border text-xs space-y-1 relative transition-all ${
                            item.done
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 opacity-80'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold">
                              {item.start || '19:00'} - {item.end || '20:00'}
                            </span>
                            <button
                              onClick={() => handleToggleCampWeeklyDone(item.id)}
                              className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                              title={item.done ? 'Tamamlanmadı' : 'Tamamlandı'}
                            >
                              {item.done ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                          </div>

                          <div className={`font-bold text-[11px] leading-tight ${item.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                            {item.topic}
                          </div>

                          <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
                            {item.campName || item.course}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center py-6 italic font-medium">
                      Ders yok
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ACTIVE CAMP TODAY TASKS & METRICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Camp Widget */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Aktif Kamp: {activeCamp?.name || 'TYT Kampı'}
              </h3>
            </div>

            <button
              onClick={() => setActiveTab('camps')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Kampa Git</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {activeCampPendingItems.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic py-4">Tüm kamp görevleri tamamlandı! Harikasın! 🎉</p>
            ) : (
              activeCampPendingItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block">
                      {item.day}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {item.topic}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('camps')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Çöz
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats Column */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Kitaplık & Çözülen Soru</span>
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                {totalSolvedQuestions} Soru ({totalBooksCount} Kitap)
              </div>
            </div>
            <Library className="w-8 h-8 text-indigo-500/20" />
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Son Deneme Neti</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {lastExam ? `${lastExam.net} Net (${lastExam.name})` : 'Henüz Deneme Yok'}
              </div>
            </div>
            <ClipboardCheck className="w-8 h-8 text-emerald-500/20" />
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Yanlış Defterim</span>
              <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {totalMistakesCount} Kayıtlı Yanlış Soru
              </div>
            </div>
            <button
              onClick={() => setActiveTab('mistakes')}
              className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              İncele
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
