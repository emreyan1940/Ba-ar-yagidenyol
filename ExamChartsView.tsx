import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COURSES } from '../../data/initialData';
import { Flame, ExternalLink, RefreshCw, CheckCircle, Plus, Trash2, X, Sparkles } from 'lucide-react';
import { CampPreset, CampItem, CampScheduleItem } from '../../types';

const PARLA_STAGES = [
  { val: '', label: 'Aşama Seç' },
  { val: 'mavi', label: '🔵 Mavi - Bilme' },
  { val: 'yesil', label: '🟢 Yeşil - Kavrama' },
  { val: 'sari', label: '🟡 Sarı - Uygulama' },
  { val: 'pembe', label: '🌸 Pembe - Analiz' },
  { val: 'turkuaz', label: '🩵 Turkuaz - Sentez' },
  { val: 'mor', label: '🟣 Mor - Değerlendirme' }
];

export const CampTrackerView: React.FC = () => {
  const { state, setState, showToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [newCampName, setNewCampName] = useState('Emre Hoca TYT Türkçe Kampı');
  const [newCampCourse, setNewCampCourse] = useState('TYT Türkçe');
  const [newCampDays, setNewCampDays] = useState(50);
  const [newCampYoutube, setNewCampYoutube] = useState('');

  // Built-in high-yield templates
  const PRESET_CAMPS: Array<{ name: string; course: string; days: number; desc: string; topics: string[] }> = [
    {
      name: '30 Günde TYT Matematik Derece Kampı',
      course: 'TYT Matematik',
      days: 30,
      desc: 'Temel kavramlardan problemlere, fonksiyonlardan permütasyon-kombinasyona eksiksiz 30 günlük full tekrar.',
      topics: [
        '1. Gün: Temel Kavramlar & Sayı Basamakları',
        '2. Gün: Bölme-Bölünebilme & EBOB-EKOK',
        '3. Gün: Rasyonel Sayılar & Basit Eşitsizlikler',
        '4. Gün: Mutlak Değer & Üslü Sayılar',
        '5. Gün: Köklü Sayılar & Çarpanlara Ayırma',
        '6. Gün: Oran-Orantı & Sayı Problemleri (Temel)',
        '7. Gün: Sayı ve Kesir Problemleri (İleri)',
        '8. Gün: Yaş Problemleri & Yüzde-Kâr-Zarar',
        '9. Gün: Karışım & Hareket Problemleri',
        '10. Gün: Grafik ve Tablo Okuma Problemleri',
        '11. Gün: Rutin Olmayan Problem Türleri (ÖSYM Tipi)',
        '12. Gün: Mantık & Küme Kavramları',
        '13. Gün: Kartezyen Çarpım & Fonksiyon Tanımı',
        '14. Gün: Fonksiyon Grafikleri & Bileşke Fonksiyon',
        '15. Gün: Polinomlar (Temel Tanım & Bölme Kuralı)',
        '16. Gün: Polinom Grafikleri & Kök İlişkisi',
        '17. Gün: 2. Dereceden Denklemler & Karmaşık Sayılar',
        '18. Gün: Permütasyon (Sıralama)',
        '19. Gün: Kombinasyon (Seçme) & Binom Açılımı',
        '20. Gün: Olasılık (Klasik & Koşullu Olasılık)',
        '21. Gün: Veri & İstatistik (Ortanca, Tepe Değer, Standart Sapma)',
        '22. Gün: Geometri: Açılar & Dik Üçgen',
        '23. Gün: Geometri: İkizkenar & Eşkenar Üçgen',
        '24. Gün: Geometri: Üçgende Alan & Benzerlik',
        '25. Gün: Geometri: Üçgende Açıortay & Kenarortay',
        '26. Gün: Geometri: Dörtgenler & Yamuk',
        '27. Gün: Geometri: Paralelkenar & Eşkenar Dörtgen',
        '28. Gün: Geometri: Dikdörtgen & Kare',
        '29. Gün: Geometri: Çember & Daire',
        '30. Gün: Geometri: Katı Cisimler (Prizma, Piramit, Küre)'
      ]
    },
    {
      name: '15 Günde Paragraf & Anlam Bilgisi Depar Kampı',
      course: 'TYT Türkçe',
      days: 15,
      desc: 'Her gün 25 özel paragraf sorusu, hız teknikleri ve ÖSYM soru tipleriyle netlerini +10 yükseltme garantili.',
      topics: [
        '1. Gün: Sözcükte Anlam & Deyimler-Atasözleri',
        '2. Gün: Cümlede Anlam & Cümle Yorumu',
        '3. Gün: Paragrafta Ana Fikir & Konu Tespiti',
        '4. Gün: Paragrafta Yardımcı Fikirler (Olumsuz Soru Kökleri)',
        '5. Gün: Paragrafta Yapı: Cümle Ekleme & Çıkarma',
        '6. Gün: Paragrafta Yapı: Cümlelerin Yerini Değiştirme',
        '7. Gün: Paragrafı İkiye Bölme & Akışı Bozan Cümle',
        '8. Gün: Paragrafta Anlatım Biçimleri & Düşünceyi Geliştirme Yolları',
        '9. Gün: Çoklu Paragraf Soruları (Tek Parçaya Bağlı 2-3 Soru)',
        '10. Gün: ÖSYM Tipi Diyalog Tamamlama Soruları',
        '11. Gün: Ses Bilgisi Kuralları',
        '12. Gün: Yazım Kuralları (Bitişik/Ayrı Yazılan Kelimeler)',
        '13. Gün: Noktalama İşaretleri (Virgül, Noktalı Virgül, İki Nokta)',
        '14. Gün: Sözcük Türleri & Tamlamalar',
        '15. Gün: Cümlenin Ögeleri & Yazım-Noktalama Karma Deneme'
      ]
    },
    {
      name: '20 Günde AYT Fen Depar Kampı',
      course: 'AYT Fizik',
      days: 20,
      desc: 'Fizik, Kimya ve Biyoloji AYT kilit konularını kapsayan yoğun tempo tekrar ve soru bankası taraması.',
      topics: [
        '1. Gün: AYT Fizik - Vektörler & Bağıl Hareket',
        '2. Gün: AYT Fizik - Newton’un Hareket Yasaları',
        '3. Gün: AYT Fizik - Bir Boyutta ve İki Boyutta Sabit İvmeli Hareket',
        '4. Gün: AYT Fizik - İş, Güç, Enerji & İtme-Momentum',
        '5. Gün: AYT Fizik - Tork, Denge & Kütle Merkezi',
        '6. Gün: AYT Kimya - Modern Atom Teorisi & Periyodik Sistem',
        '7. Gün: AYT Kimya - Gazlar & Gaz Yasaları',
        '8. Gün: AYT Kimya - Sıvı Çözeltiler & Derişim Birimleri',
        '9. Gün: AYT Kimya - Kimyasal Tepkimelerde Enerji',
        '10. Gün: AYT Kimya - Kimyasal Tepkimelerde Hız & Denge',
        '11. Gün: AYT Kimya - Asit-Baz Dengesi (pH - pOH)',
        '12. Gün: AYT Kimya - Elektrokimya & Hücre Potansiyeli',
        '13. Gün: AYT Kimya - Organik Kimyaya Giriş & Hibritleşme',
        '14. Gün: AYT Biyoloji - Sinir Sistemi & Duyu Organları',
        '15. Gün: AYT Biyoloji - Endokrin Sistem & Destek-Hareket',
        '16. Gün: AYT Biyoloji - Sindirim & Dolaşım Sistemi',
        '17. Gün: AYT Biyoloji - Solunum & Üriner Sistem',
        '18. Gün: AYT Biyoloji - Nükleik Asitler & Protein Sentezi',
        '19. Gün: AYT Biyoloji - Fotosentez & Kemosentez',
        '20. Gün: AYT Biyoloji - Hücresel Solunum & Bitki Biyolojisi'
      ]
    }
  ];

  const handleImportPreset = (preset: typeof PRESET_CAMPS[0]) => {
    const generatedItems: CampItem[] = preset.topics.map((t, i) => ({
      id: `item_p_${Date.now()}_${i + 1}`,
      day: `${i + 1}. Gün`,
      topic: t,
      raw: t,
      done: false,
      testCount: 2,
      videoCount: 1,
      questionCount: 35,
      duration: '50 dk'
    }));

    const newCamp: CampPreset = {
      id: `camp_preset_${Date.now()}`,
      name: preset.name,
      course: preset.course,
      key: `preset_${Date.now()}`,
      items: generatedItems
    };

    setState((prev) => ({
      ...prev,
      camps: [newCamp, ...prev.camps],
      activeCampId: newCamp.id
    }));

    setShowPresetModal(false);
    showToast(`"${preset.name}" şablonu başarıyla kamplarınıza eklendi! 🎉`);
  };

  // New Day Item Form
  const [newDayTopic, setNewDayTopic] = useState('');

  const activeCamp = state.camps.find((c) => c.id === state.activeCampId) || state.camps[0];

  const handleSelectCamp = (id: string) => {
    setState((prev) => ({
      ...prev,
      activeCampId: id
    }));
  };

  const handleCreateCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim()) {
      showToast('Lütfen kamp adını girin', 'warning');
      return;
    }

    const dayCount = Math.max(1, Math.min(100, Number(newCampDays) || 30));

    // Generate days
    const generatedItems: CampItem[] = Array.from({ length: dayCount }).map((_, i) => ({
      id: `item_c_${Date.now()}_${i + 1}`,
      day: `${i + 1}. Gün`,
      topic: `${i + 1}. Gün: Konu Anlatımı & Soru Bankası Çözümü`,
      raw: `${i + 1}. Gün - ${newCampCourse}`,
      done: false,
      testCount: 2,
      videoCount: 1,
      questionCount: 30,
      duration: '45 dk'
    }));

    const newCamp: CampPreset = {
      id: `camp_${Date.now()}`,
      name: newCampName,
      course: newCampCourse,
      key: `custom_${Date.now()}`,
      youtube: newCampYoutube || undefined,
      items: generatedItems
    };

    setState((prev) => ({
      ...prev,
      camps: [newCamp, ...prev.camps],
      activeCampId: newCamp.id
    }));

    setShowAddModal(false);
    showToast(`"${newCampName}" (${dayCount} Günlük) kampı başarıyla oluşturuldu!`);
  };

  const handleToggleDone = (index: number) => {
    if (!activeCamp) return;

    const updatedItems = activeCamp.items.map((item, i) =>
      i === index ? { ...item, done: !item.done } : item
    );

    setState((prev) => ({
      ...prev,
      camps: prev.camps.map((c) => (c.id === activeCamp.id ? { ...c, items: updatedItems } : c))
    }));
  };

  const handleUpdateItemField = (index: number, field: string, value: any) => {
    if (!activeCamp) return;

    const updatedItems = activeCamp.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );

    setState((prev) => ({
      ...prev,
      camps: prev.camps.map((c) => (c.id === activeCamp.id ? { ...c, items: updatedItems } : c))
    }));
  };

  const handleAddDayToActiveCamp = () => {
    if (!activeCamp || !newDayTopic.trim()) return;

    const newDayNum = activeCamp.items.length + 1;
    const newItem: CampItem = {
      id: `item_add_${Date.now()}`,
      day: `${newDayNum}. Gün`,
      topic: newDayTopic.trim(),
      raw: `${newDayNum}. Gün - ${newDayTopic}`,
      done: false,
      testCount: 2,
      videoCount: 1,
      questionCount: 30,
      duration: '40 dk'
    };

    setState((prev) => ({
      ...prev,
      camps: prev.camps.map((c) =>
        c.id === activeCamp.id ? { ...c, items: [...c.items, newItem] } : c
      )
    }));

    setNewDayTopic('');
    showToast(`${newDayNum}. Gün kampa eklendi`);
  };

  const handleDeleteDay = (index: number) => {
    if (!activeCamp) return;
    const updatedItems = activeCamp.items.filter((_, i) => i !== index);
    setState((prev) => ({
      ...prev,
      camps: prev.camps.map((c) => (c.id === activeCamp.id ? { ...c, items: updatedItems } : c))
    }));
    showToast('Gün kampa çıkarıldı', 'info');
  };

  const handleResetProgress = () => {
    if (!activeCamp) return;
    if (window.confirm('Bu kampın tüm tikleri ve süreleri sıfırlansın mı?')) {
      const resetItems = activeCamp.items.map((item) => ({ ...item, done: false }));
      setState((prev) => ({
        ...prev,
        camps: prev.camps.map((c) => (c.id === activeCamp.id ? { ...c, items: resetItems } : c))
      }));
      showToast('Kamp ilerlemesi sıfırlandı.', 'info');
    }
  };

  const handleDeleteCamp = (campIdToDelete?: string) => {
    const targetId = campIdToDelete || activeCamp?.id;
    const targetCamp = state.camps.find((c) => c.id === targetId);
    if (!targetCamp) return;

    if (window.confirm(`"${targetCamp.name}" kampını tamamen silmek istediğinize emin misiniz?`)) {
      const updatedCamps = state.camps.filter((c) => c.id !== targetId);
      const updatedMonthly = state.campMonthly.filter((m) => m.campId !== targetId);
      const updatedWeekly = state.campWeekly.filter((w) => w.campId !== targetId);
      const nextActiveId = updatedCamps[0]?.id || '';

      setState((prev) => ({
        ...prev,
        camps: updatedCamps,
        campMonthly: updatedMonthly,
        campWeekly: updatedWeekly,
        activeCampId: nextActiveId
      }));

      showToast(`"${targetCamp.name}" kampı ve bağlı veriler tamamen silindi.`, 'info');
    }
  };

  if (!activeCamp) {
    return <div className="p-8 text-center text-slate-500">Henüz kamp bulunmuyor.</div>;
  }

  const completedCount = activeCamp.items.filter((i) => i.done).length;
  const totalCount = activeCamp.items.length;
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const totalVideos = activeCamp.items.reduce((acc, curr) => acc + (Number(curr.videoCount) || 0), 0);
  const totalTests = activeCamp.items.reduce((acc, curr) => acc + (Number(curr.testCount) || 0), 0);
  const totalQuestions = activeCamp.items.reduce((acc, curr) => acc + (Number(curr.questionCount) || 0), 0);

  const isParla = activeCamp.name.toLowerCase().includes('parla') || activeCamp.key?.includes('parla');

  return (
    <div className="space-y-6">
      {/* Camp Header Selector Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">{activeCamp.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{activeCamp.course} • Toplam {totalCount} Günlük Çalışma Programı</p>
            </div>
          </div>

          {/* Action & Dropdown Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={activeCamp.id}
              onChange={(e) => handleSelectCamp(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {state.camps.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.items.length} Gün)
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Kamp Ekle</span>
            </button>

            <button
              onClick={() => setShowPresetModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Hazır Şablonlar</span>
            </button>

            {/* Tek Tuşla Kampı Sil Button */}
            <button
              onClick={() => handleDeleteCamp(activeCamp.id)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              title="Bu kampı tamamen sil"
            >
              <Trash2 className="w-4 h-4" />
              <span>Kampı Sil</span>
            </button>

            {activeCamp.youtube && (
              <a
                href={activeCamp.youtube}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/20"
              >
                <span>▶ YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={handleResetProgress}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
              title="İlerlemeyi Sıfırla"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Camp Stat Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Tamamlanan</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{completedCount} / {totalCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Kalan Gün</span>
            <span className="text-base font-black text-rose-600 dark:text-rose-400">{totalCount - completedCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Video</span>
            <span className="text-base font-black text-indigo-600 dark:text-blue-400">{totalVideos}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Test</span>
            <span className="text-base font-black text-purple-600 dark:text-purple-400">{totalTests}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Soru</span>
            <span className="text-base font-black text-amber-600 dark:text-amber-400">{totalQuestions}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Kamp İlerleme Derecesi</span>
            <span className="text-amber-600 dark:text-amber-400 font-extrabold">%{pct}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add New Day Row bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Kampa Gün Ekle:</span>
        </span>
        <input
          type="text"
          value={newDayTopic}
          onChange={(e) => setNewDayTopic(e.target.value)}
          placeholder="Örn: 51. Gün - Soru Bankası Genel Tekrar Testi"
          className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
        />
        <button
          onClick={handleAddDayToActiveCamp}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>Gün Ekle</span>
        </button>
      </div>

      {/* Camp Schedule Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200 min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <th className="py-3 px-3">Gün</th>
              <th className="py-3 px-3">Konu</th>
              {isParla && <th className="py-3 px-3">Aşama</th>}
              <th className="py-3 px-3 text-center">Test</th>
              <th className="py-3 px-3 text-center">Video</th>
              <th className="py-3 px-3 text-center">Soru</th>
              <th className="py-3 px-3 text-center">Durum</th>
              <th className="py-3 px-3 text-center">Sil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {activeCamp.items.map((item, idx) => (
              <tr
                key={item.id}
                className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                  item.done ? 'bg-emerald-50/60 dark:bg-emerald-950/20 text-slate-500 dark:text-slate-400' : ''
                }`}
              >
                <td className="py-3 px-3 font-bold text-xs text-indigo-600 dark:text-blue-400 whitespace-nowrap">
                  {item.day}
                </td>
                <td className="py-3 px-3 font-semibold text-sm text-slate-900 dark:text-slate-100">
                  <input
                    type="text"
                    value={item.topic}
                    onChange={(e) => handleUpdateItemField(idx, 'topic', e.target.value)}
                    className="w-full bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 text-sm font-semibold focus:outline-none"
                  />
                </td>

                {isParla && (
                  <td className="py-3 px-3">
                    <select
                      value={item.stage || ''}
                      onChange={(e) => handleUpdateItemField(idx, 'stage', e.target.value)}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      {PARLA_STAGES.map((s) => (
                        <option key={s.val} value={s.val}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                )}

                <td className="py-3 px-3 text-center">
                  <input
                    type="number"
                    value={item.testCount || ''}
                    onChange={(e) => handleUpdateItemField(idx, 'testCount', e.target.value)}
                    className="w-14 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center focus:outline-none"
                    placeholder="0"
                  />
                </td>

                <td className="py-3 px-3 text-center">
                  <input
                    type="number"
                    value={item.videoCount || ''}
                    onChange={(e) => handleUpdateItemField(idx, 'videoCount', e.target.value)}
                    className="w-14 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center focus:outline-none"
                    placeholder="0"
                  />
                </td>

                <td className="py-3 px-3 text-center">
                  <input
                    type="number"
                    value={item.questionCount || ''}
                    onChange={(e) => handleUpdateItemField(idx, 'questionCount', e.target.value)}
                    className="w-16 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center focus:outline-none"
                    placeholder="0"
                  />
                </td>

                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => handleToggleDone(idx)}
                    className={`p-1.5 rounded-xl border transition-all ${
                      item.done
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </td>

                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => handleDeleteDay(idx)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Camp Preset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 relative animate-in fade-in zoom-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-extrabold text-lg text-slate-900 dark:text-slate-100">
                <Flame className="w-5 h-5 text-amber-500" />
                <h3>Yeni Kamp Aç (Örn: Emre Hoca TYT Türkçe Kampı)</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCamp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kamp Adı
                </label>
                <input
                  type="text"
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  placeholder="Örn: Emre Hoca TYT Türkçe Kampı 50 Günlük"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ders
                  </label>
                  <select
                    value={newCampCourse}
                    onChange={(e) => setNewCampCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
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
                    Kaç Günlük Kamp?
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={newCampDays}
                    onChange={(e) => setNewCampDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  YouTube Çalma Listesi Linki (İsteğe Bağlı)
                </label>
                <input
                  type="url"
                  value={newCampYoutube}
                  onChange={(e) => setNewCampYoutube(e.target.value)}
                  placeholder="https://youtube.com/playlist?list=..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  Kampı Başlat & Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preset Library Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-5 relative animate-in fade-in zoom-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-extrabold text-lg text-slate-900 dark:text-slate-100">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3>Hazır Hazırlanmış Kamp Şablonları</h3>
              </div>
              <button
                onClick={() => setShowPresetModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {PRESET_CAMPS.map((preset) => (
                <div
                  key={preset.name}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{preset.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{preset.desc}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 shrink-0">
                      {preset.days} Gün • {preset.course}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {preset.topics.length} Hazır Ders Başlığı
                    </span>
                    <button
                      onClick={() => handleImportPreset(preset)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Bu Kampı Ekle</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
