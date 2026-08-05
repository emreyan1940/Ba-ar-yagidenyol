import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';
import {
  Home,
  Calendar,
  BookOpen,
  Library,
  Flame,
  CalendarDays,
  FileText,
  BrainCircuit,
  Timer,
  Music,
  ClipboardCheck,
  LineChart,
  XCircle,
  Clock,
  BarChart3,
  RotateCcw,
  Film,
  Wallet,
  PenTool,
  Activity,
  Palette,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Download,
  Award,
  Sparkles
} from 'lucide-react';

interface TabItem {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const HeaderNavbar: React.FC = () => {
  const { activeTab, setActiveTab, state, setState, toggleTheme, saveState, showToast } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: <Home className="w-4 h-4" /> },
    { id: 'camps', label: 'Kamp Takibi', icon: <Flame className="w-4 h-4" />, badge: 'Sıcak' },
    { id: 'campWeekly', label: 'Haftalık Kamp Takvimi', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'campMonthly', label: 'Aylık Kamp Takvimi', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'topics', label: 'Ders & Konu Takibi', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'books', label: 'Kitaplık', icon: <Library className="w-4 h-4" /> },
    { id: 'lessonNotes', label: 'Ders Notları', icon: <FileText className="w-4 h-4" /> },
    { id: 'weakCenter', label: 'Eksik Konu Merkezi', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'pomo', label: 'Pomodoro', icon: <Timer className="w-4 h-4" /> },
    { id: 'music', label: 'Çalışma Müzikleri', icon: <Music className="w-4 h-4" /> },
    { id: 'exams', label: 'Deneme Analizi', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'charts', label: 'Deneme Grafikleri', icon: <LineChart className="w-4 h-4" /> },
    { id: 'mistakes', label: 'Yanlış Defteri', icon: <XCircle className="w-4 h-4" /> },
    { id: 'pastQuestions', label: 'Çıkmış Soru Matrix', icon: <Clock className="w-4 h-4" /> },
    { id: 'speedAnalysis', label: 'Hız Analizi', icon: <Activity className="w-4 h-4" /> },
    { id: 'campProgressCenter', label: 'Kamp İlerleme Merkezi', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'repeats', label: 'Akıllı Tekrar', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'media', label: 'Film & Dizi', icon: <Film className="w-4 h-4" /> },
    { id: 'health', label: 'Seri & Sağlık Takibi', icon: <Award className="w-4 h-4" /> },
    { id: 'settings', label: 'Ayarlar', icon: <Settings className="w-4 h-4" /> }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Compute countdown days
  const yksDateObj = new Date(`${state.yksDate}T10:00:00`);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((yksDateObj.getTime() - now.getTime()) / (1000 * 3600 * 24)));

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/95 dark:bg-[#0f0f0f]/95 border-b border-slate-200 dark:border-white/10 text-slate-800 dark:text-[#e0e0e0] transition-colors shadow-sm dark:shadow-xl">
      {/* Top Branding & Action Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-tr from-indigo-600 to-indigo-800 dark:from-[#161616] dark:to-[#262626] border border-indigo-500/30 dark:border-[#c0a080]/30 flex items-center justify-center font-serif italic text-white dark:text-[#c0a080] font-bold text-lg shadow-md tracking-wider">
            BGY
          </div>
          <div>
            <h1 className="font-serif text-lg leading-tight tracking-wide text-slate-900 dark:text-white flex items-center gap-2">
              Başarıya Giden Yol
              <span className="hidden sm:inline-block text-[10px] font-sans font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-[#c0a080]/10 text-indigo-700 dark:text-[#c0a080] border border-indigo-200 dark:border-[#c0a080]/20">
                YKS v32
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#888888] hidden md:block tracking-wide">
              YKS Takip, Kamp Yönetimi ve Deneme Analiz Asistanı
            </p>
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-2.5">
          {/* YKS Countdown Badge */}
          <div className="bg-slate-100 dark:bg-[#141414] text-slate-700 dark:text-[#cccccc] text-xs font-mono px-3.5 py-1.5 rounded-sm border border-slate-200 dark:border-white/10 flex items-center gap-2 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>YKS: <strong className="text-indigo-600 dark:text-[#c0a080] font-bold">{daysLeft}</strong> gün</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Tema Değiştir"
            className="p-2 rounded-sm bg-slate-100 dark:bg-[#141414] hover:bg-slate-200 dark:hover:bg-white/5 text-amber-600 dark:text-[#c0a080] transition-all border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            title={state.theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}
          >
            {state.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Quick Save/Export Button */}
          <button
            onClick={() => saveState()}
            aria-label="Verileri Kaydet"
            className="p-2 rounded-sm bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white transition-all border border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 hidden sm:flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase cursor-pointer"
            title="Verileri Kaydet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Kaydet</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Menu Section */}
      <div className="relative border-t border-slate-200 dark:border-white/5 bg-slate-50/90 dark:bg-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-2 relative flex items-center">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll('left')}
            aria-label="Menüyü Sola Kaydır"
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-sm bg-white dark:bg-[#141414] hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10 z-10 shrink-0 shadow-sm mr-1 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Navigation Items Bar */}
          <div
            ref={scrollContainerRef}
            role="tablist"
            aria-label="Ana Gezinme Menüsü"
            className="flex items-center gap-1 overflow-x-auto whitespace-nowrap py-2 px-1 scroll-smooth no-scrollbar w-full"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={0}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all shrink-0 focus:outline-none focus:ring-1 focus:ring-indigo-500 select-none ${
                    isActive
                      ? 'text-white dark:text-black font-bold'
                      : 'text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  {/* Active Tab Background Motion Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-indigo-600 dark:bg-[#c0a080] rounded-sm shadow-md shadow-indigo-500/20 dark:shadow-[#c0a080]/20 -z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  <span className="relative z-10">{tab.icon}</span>
                  <span className="relative z-10">{tab.label}</span>

                  {tab.badge && (
                    <span className="relative z-10 px-1.5 py-0.2 text-[9px] font-bold rounded-sm bg-rose-600 text-white dark:bg-rose-900/80 dark:text-rose-200 border border-rose-400 dark:border-rose-500/30 uppercase tracking-widest">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll('right')}
            aria-label="Menüyü Sağa Kaydır"
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-sm bg-white dark:bg-[#141414] hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10 z-10 shrink-0 shadow-sm ml-1 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
