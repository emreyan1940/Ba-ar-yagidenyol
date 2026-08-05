import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COURSES, TOPICS } from '../../data/initialData';
import { Calendar as CalendarIcon, Plus, Trash2, Sparkles, ArrowRight, CheckCircle2, Clock, BookOpen, Layers } from 'lucide-react';

const DAYS_TURKISH = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

const getDayNameFromDate = (dateStr: string): string => {
  if (!dateStr) return 'Pazartesi';
  const d = new Date(`${dateStr}T00:00:00`);
  return DAYS_TURKISH[d.getDay()] || 'Pazartesi';
};

export const CampMonthlyView: React.FC = () => {
  const { state, setState, setActiveTab, showToast } = useApp();

  // Active Month Filter YYYY-MM
  const [monthStr, setMonthStr] = useState(() => new Date().toISOString().slice(0, 7));

  // --- 1-MONTH AUTOMATIC PROGRAM GENERATOR STATES ---
  const [genCampName, setGenCampName] = useState('30 Günlük Zirve Kampı');
  const [genCourse, setGenCourse] = useState(COURSES[0]);
  const [genStartDate, setGenStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // 1st of current month
    return d.toISOString().slice(0, 10);
  });
  const [genEndDate, setGenEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(0); // Last day of current month
    return d.toISOString().slice(0, 10);
  });
  const [genStartHour, setGenStartHour] = useState('19:00');
  const [genEndHour, setGenEndHour] = useState('20:30');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  // --- MANUAL SINGLE ENTRY STATES ---
  const [selectedCampId, setSelectedCampId] = useState(state.camps[0]?.id || '');
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().slice(0, 10));

  const selectedCamp = state.camps.find((c) => c.id === selectedCampId) || state.camps[0];

  // 1-Aylık Otomatik Kamp Programı Oluşturma Handler
  const handleGenerateMonthlyProgram = () => {
    if (!genStartDate || !genEndDate) {
      showToast('Lütfen başlangıç ve bitiş tarihlerini giriniz.', 'warning');
      return;
    }

    const startD = new Date(`${genStartDate}T00:00:00`);
    const endD = new Date(`${genEndDate}T00:00:00`);

    if (endD < startD) {
      showToast('Bitiş tarihi başlangıç tarihinden önce olamaz.', 'warning');
      return;
    }

    // Available topics for selected course or preset
    const presetObj = state.camps.find((c) => c.id === selectedPresetId);
    const courseTopics = TOPICS[genCourse] || ['Genel Tekrar & Soru Çözümü'];

    const newMonthlyItems: any[] = [];
    const newWeeklyItems: any[] = [];

    let curD = new Date(startD);
    let dayCounter = 1;

    while (curD <= endD) {
      const dateString = curD.toISOString().slice(0, 10);
      const dayName = getDayNameFromDate(dateString);

      let topicTitle = '';
      if (presetObj && presetObj.items[dayCounter - 1]) {
        topicTitle = `${presetObj.items[dayCounter - 1].day}: ${presetObj.items[dayCounter - 1].topic}`;
      } else {
        const topicIdx = (dayCounter - 1) % courseTopics.length;
        topicTitle = `${dayCounter}. Gün: ${courseTopics[topicIdx]}`;
      }

      const itemId = `cm_gen_${Date.now()}_${dayCounter}`;

      const item = {
        id: itemId,
        day: dayName,
        date: dateString,
        start: genStartHour,
        end: genEndHour,
        duration: '1.5 sa',
        campId: presetObj ? presetObj.id : `gen_camp_${Date.now()}`,
        campName: genCampName || `${genCourse} Kampı`,
        course: genCourse,
        topic: topicTitle,
        itemIndex: dayCounter - 1,
        done: false
      };

      newMonthlyItems.push(item);
      newWeeklyItems.push({
        ...item,
        id: `cw_synced_${itemId}`
      });

      curD.setDate(curD.getDate() + 1);
      dayCounter++;
    }

    setState((prev) => ({
      ...prev,
      campMonthly: [...prev.campMonthly, ...newMonthlyItems],
      campWeekly: [...prev.campWeekly, ...newWeeklyItems]
    }));

    showToast(
      `🎉 ${dayCounter - 1} günlük kamp programı başarıyla oluşturuldu! Hem Aylık hem Haftalık takvime işlendi.`,
      'success'
    );
  };

  // Manuel Tekli Ekleme Handler (Aylık & Haftalık Takvim Senkronize)
  const handleAddMonthly = () => {
    if (!selectedCamp || !selectedCamp.items[selectedDayIdx] || !targetDate) {
      showToast('Lütfen kamp günü ve hedef tarih seçiniz.', 'warning');
      return;
    }

    const item = selectedCamp.items[selectedDayIdx];
    const dayName = getDayNameFromDate(targetDate);
    const commonId = `cm_${Date.now()}`;

    const newMonthlyItem = {
      id: commonId,
      day: dayName,
      date: targetDate,
      start: '19:00',
      end: '20:00',
      duration: '1 sa',
      campId: selectedCamp.id,
      campName: selectedCamp.name,
      course: selectedCamp.course,
      topic: `${item.day}: ${item.topic}`,
      itemIndex: selectedDayIdx,
      done: false
    };

    const newWeeklyItem = {
      ...newMonthlyItem,
      id: `cw_synced_${commonId}`
    };

    setState((prev) => ({
      ...prev,
      campMonthly: [...prev.campMonthly, newMonthlyItem],
      campWeekly: [...prev.campWeekly, newWeeklyItem]
    }));

    showToast('Kamp günü Aylık & Haftalık takvimlere eklendi!');
  };

  // Silme Handler
  const handleDeleteMonthly = (id: string) => {
    setState((prev) => ({
      ...prev,
      campMonthly: prev.campMonthly.filter((item) => item.id !== id),
      campWeekly: prev.campWeekly.filter((item) => item.id !== `cw_synced_${id}` && item.id !== id)
    }));
    showToast('Kamp günü takvimlerden kaldırıldı', 'info');
  };

  const handleDeleteSelectedCamp = () => {
    if (!selectedCamp) {
      showToast('Lütfen silinecek kampı seçin', 'warning');
      return;
    }
    if (window.confirm(`"${selectedCamp.name}" kampını ve ilgili tüm takvim kayıtlarını tamamen silmek istediğinize emin misiniz?`)) {
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

  // Ay Bilgisi Hesaplama
  const [year, month] = monthStr.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOffset = (new Date(year, month - 1, 1).getDay() + 6) % 7; // Pazartesi başlangıç

  return (
    <div className="space-y-6">
      {/* Top Header Navigation Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
              Aylık Kamp Takvimi & Program Planlayıcı
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Başlangıç ve bitiş tarihleri seçerek 1 aylık otomatik kamp programı oluşturun.
            </p>
          </div>
        </div>

        {/* Shortcut to Weekly Camp Schedule */}
        <button
          onClick={() => setActiveTab('campWeekly')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
        >
          <span>📆 Haftalık Kamp Takvimine Geç</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 1-AYLIK OTOMATİK PROGRAM OLUŞTURUCU CARD */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-4">
        <div className="flex items-center gap-2 font-extrabold text-base text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          <span>⚡ 1-Aylık Otomatik Kamp Programı Oluşturucu</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Kamp / Program Adı
            </label>
            <input
              type="text"
              value={genCampName}
              onChange={(e) => setGenCampName(e.target.value)}
              placeholder="Örn: 30 Günlük TYT Kampı"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ders Seçin</label>
            <select
              value={genCourse}
              onChange={(e) => setGenCourse(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              value={genStartDate}
              onChange={(e) => setGenStartDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              value={genEndDate}
              onChange={(e) => setGenEndDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Günlük Çalışma Saat Aralığı
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={genStartHour}
                onChange={(e) => setGenStartHour(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs text-center font-bold"
              />
              <span className="text-slate-400 font-bold">-</span>
              <input
                type="time"
                value={genEndHour}
                onChange={(e) => setGenEndHour(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs text-center font-bold"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mevcut Kamp Paketinden İçerik Çek (Opsiyonel)
            </label>
            <select
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none"
            >
              <option value="">Otomatik Konu Sıralaması Kullan (Ders Müfredatı)</option>
              {state.camps.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.items.length} Günlük Hazır İçerik)
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateMonthlyProgram}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>⚡ 1 Aylık Kamp Programını Oluştur & Takvimlere İşle</span>
        </button>
      </div>

      {/* MANUEL TEK KAMP GÜNÜ EKLEME CARD */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-4">
        <div className="flex items-center gap-2 font-extrabold text-base text-slate-900 dark:text-slate-100">
          <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Manuel Tekli Kamp Günü Ekle</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kamp Seçin</label>
            <select
              value={selectedCampId}
              onChange={(e) => {
                setSelectedCampId(e.target.value);
                setSelectedDayIdx(0);
              }}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none"
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
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none"
            >
              {selectedCamp?.items.map((item, idx) => (
                <option key={item.id} value={idx}>
                  {item.day} - {item.topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hedef Tarih</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAddMonthly}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Aylık & Haftalık Takvime Ekle</span>
          </button>

          <button
            onClick={handleDeleteSelectedCamp}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-rose-600/20 cursor-pointer"
            title="Seçili kampı tamamen sil"
          >
            <Trash2 className="w-4 h-4" />
            <span>🗑️ Seçili Kampı Sil</span>
          </button>
        </div>
      </div>

      {/* MONTHLY CALENDAR GRID */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 font-extrabold text-base text-slate-900 dark:text-slate-100">
            <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Aylık Takvim Görünümü</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Ay Seçimi:</label>
            <input
              type="month"
              value={monthStr}
              onChange={(e) => setMonthStr(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold focus:outline-none"
            />
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase py-2 border-b border-slate-100 dark:border-slate-800">
          <div>Pzt</div>
          <div>Sal</div>
          <div>Çar</div>
          <div>Per</div>
          <div>Cum</div>
          <div>Cmt</div>
          <div>Paz</div>
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {/* Offset empty cells */}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div
              key={`offset_${i}`}
              className="min-h-[100px] rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800/40"
            />
          ))}

          {/* Month Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const fullDateStr = `${monthStr}-${String(dayNum).padStart(2, '0')}`;
            const dayEvents = state.campMonthly.filter((item) => item.date === fullDateStr);

            const isToday = fullDateStr === new Date().toISOString().slice(0, 10);

            return (
              <div
                key={dayNum}
                className={`min-h-[105px] p-2 rounded-xl border transition-all flex flex-col justify-between ${
                  isToday
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-extrabold ${
                      isToday
                        ? 'px-2 py-0.5 rounded-full bg-indigo-600 text-white'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      {dayEvents.length} Ders
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[80px] no-scrollbar mt-1">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50 text-[10px] font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between gap-1 group shadow-xs hover:border-rose-400"
                    >
                      <span className="truncate leading-tight text-indigo-700 dark:text-indigo-300">{ev.topic}</span>
                      <button
                        onClick={() => handleDeleteMonthly(ev.id)}
                        className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-0.5"
                        title="Sil"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
