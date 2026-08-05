import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COURSES, TOPICS } from '../../data/initialData';
import { FileText, Plus, Trash2, ChevronLeft, ChevronRight, Grid, AlignLeft, Square, BookOpen, Download } from 'lucide-react';
import { NotebookPage } from '../../types';

export const LessonNotesView: React.FC = () => {
  const { state, setState, showToast } = useApp();

  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [selectedTopic, setSelectedTopic] = useState(
    (TOPICS[COURSES[0]] && TOPICS[COURSES[0]][0]) || 'Genel Paragraf'
  );
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [isAddingTopic, setIsAddingTopic] = useState(false);

  // Active page index in notebook
  const [activePageIndex, setActivePageIndex] = useState(0);

  const notebookKey = `${selectedCourse}|${selectedTopic}`;

  // Get pages for current notebook
  const notebooksState = state.notebooks || {};
  const currentPages: NotebookPage[] = notebooksState[notebookKey] || [
    {
      id: `p_${Date.now()}_1`,
      title: `${selectedTopic} - Sayfa 1`,
      content: `${selectedCourse} - ${selectedTopic} dersi için özel defter sayfanız.\nBuraya kural ve çözüm notlarınızı özgürce yazabilirsiniz.`,
      pattern: 'lined',
      date: new Date().toLocaleDateString('tr-TR')
    }
  ];

  const currentPage = currentPages[activePageIndex] || currentPages[0];

  const updateCurrentPage = (field: keyof NotebookPage, value: any) => {
    const updatedPages = currentPages.map((page, idx) =>
      idx === activePageIndex ? { ...page, [field]: value } : page
    );

    setState((prev) => ({
      ...prev,
      notebooks: {
        ...(prev.notebooks || {}),
        [notebookKey]: updatedPages
      }
    }));
  };

  const handleAddNewPage = () => {
    const newPage: NotebookPage = {
      id: `p_${Date.now()}`,
      title: `${selectedTopic} - Sayfa ${currentPages.length + 1}`,
      content: '',
      pattern: currentPage?.pattern || 'lined',
      date: new Date().toLocaleDateString('tr-TR')
    };

    const nextPages = [...currentPages, newPage];

    setState((prev) => ({
      ...prev,
      notebooks: {
        ...(prev.notebooks || {}),
        [notebookKey]: nextPages
      }
    }));

    setActivePageIndex(nextPages.length - 1);
    showToast('Deftere yeni A4 sayfa eklendi');
  };

  const handleDeletePage = () => {
    if (currentPages.length <= 1) {
      showToast('En az bir sayfa kalmalıdır.', 'warning');
      return;
    }

    if (window.confirm('Bu A4 sayfasını silmek istediğinize emin misiniz?')) {
      const nextPages = currentPages.filter((_, idx) => idx !== activePageIndex);
      setState((prev) => ({
        ...prev,
        notebooks: {
          ...(prev.notebooks || {}),
          [notebookKey]: nextPages
        }
      }));

      setActivePageIndex(Math.max(0, activePageIndex - 1));
      showToast('Sayfa silindi', 'info');
    }
  };

  const handleAddCustomTopic = () => {
    if (!customTopicInput.trim()) return;
    setSelectedTopic(customTopicInput.trim());
    setCustomTopicInput('');
    setIsAddingTopic(false);
    setActivePageIndex(0);
  };

  // Pattern CSS style maps
  const getPatternStyle = (pattern: 'lined' | 'grid' | 'blank') => {
    if (pattern === 'lined') {
      return {
        backgroundImage: 'linear-gradient(to bottom, transparent 27px, #e2e8f0 28px)',
        backgroundSize: '100% 28px',
        lineHeight: '28px'
      };
    }
    if (pattern === 'grid') {
      return {
        backgroundImage:
          'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        lineHeight: '24px'
      };
    }
    return {
      backgroundImage: 'none',
      lineHeight: '28px'
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Course + Topic Hierarchy */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-blue-400" />
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
              A4 Dijital Defter & Konu Notları
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Pattern Selector Pills */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => updateCurrentPage('pattern', 'lined')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  currentPage?.pattern === 'lined'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>Çizgili</span>
              </button>

              <button
                onClick={() => updateCurrentPage('pattern', 'grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  currentPage?.pattern === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Kareli</span>
              </button>

              <button
                onClick={() => updateCurrentPage('pattern', 'blank')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  currentPage?.pattern === 'blank'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>Boş</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selection Hierarchy Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Step 1: Course */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              1. Ders Seçin
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                const c = e.target.value;
                setSelectedCourse(c);
                const firstTopic = (TOPICS[c] && TOPICS[c][0]) || 'Genel';
                setSelectedTopic(firstTopic);
                setActivePageIndex(0);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              2. Konu Defteri Seçin
            </label>
            {!isAddingTopic ? (
              <div className="flex gap-2">
                <select
                  value={selectedTopic}
                  onChange={(e) => {
                    setSelectedTopic(e.target.value);
                    setActivePageIndex(0);
                  }}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {(TOPICS[selectedCourse] || ['Genel']).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsAddingTopic(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800"
                >
                  + Yeni Konu
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder="Örn: TYT Türkçe Paragrafta Yapı"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-bold"
                />
                <button
                  onClick={handleAddCustomTopic}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Ekle
                </button>
                <button
                  onClick={() => setIsAddingTopic(false)}
                  className="px-3 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  İptal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Navigation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePageIndex((prev) => Math.max(0, prev - 1))}
            disabled={activePageIndex === 0}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 px-2">
            Sayfa {activePageIndex + 1} / {currentPages.length}
          </span>

          <button
            onClick={() => setActivePageIndex((prev) => Math.min(currentPages.length - 1, prev + 1))}
            disabled={activePageIndex === currentPages.length - 1}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddNewPage}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Sınırsız Sayfa Ekle</span>
          </button>

          <button
            onClick={handleDeletePage}
            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/50"
            title="Sayfayı Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* A4 White Notebook Paper Sheet Container */}
      <div className="p-2 sm:p-6 bg-slate-200/80 dark:bg-slate-950/80 rounded-2xl border border-slate-300 dark:border-slate-800 flex justify-center">
        <div className="bg-white text-slate-900 rounded-md shadow-2xl border border-slate-300 w-full max-w-[850px] min-h-[950px] p-8 sm:p-12 relative flex flex-col transition-all">
          {/* Header Margins Line */}
          <div className="border-b-2 border-rose-400/80 pb-4 mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                {selectedCourse}
              </span>
              <input
                type="text"
                value={currentPage?.title || ''}
                onChange={(e) => updateCurrentPage('title', e.target.value)}
                className="text-lg sm:text-xl font-extrabold text-slate-900 bg-transparent border-none focus:outline-none w-full"
                placeholder="Sayfa Başlığı..."
              />
            </div>

            <div className="text-right text-[11px] text-slate-400 font-mono">
              <span>{currentPage?.date || new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </div>

          {/* Left Vertical Margin Line for authentic notebook look */}
          <div className="absolute top-0 bottom-0 left-10 sm:left-14 w-[1px] bg-rose-300/60 pointer-events-none" />

          {/* Textarea Notebook Body with Pattern Background */}
          <textarea
            value={currentPage?.content || ''}
            onChange={(e) => updateCurrentPage('content', e.target.value)}
            style={getPatternStyle(currentPage?.pattern || 'lined')}
            placeholder="Ders notlarınızı, püf noktaları ve kuralları buraya doğrudan yazabilirsiniz..."
            className="w-full flex-1 bg-transparent text-slate-900 font-sans text-sm sm:text-base resize-none focus:outline-none pl-6 sm:pl-8 pt-1 leading-[28px] border-none"
          />

          {/* Footer watermark */}
          <div className="border-t border-slate-200 pt-3 mt-4 flex justify-between items-center text-[10px] text-slate-400 font-mono uppercase">
            <span>Başarıya Giden Yol • {selectedCourse}</span>
            <span>Sayfa {activePageIndex + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
