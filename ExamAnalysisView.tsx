import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COURSES } from '../../data/initialData';
import { Plus, Library, Search, Trash2, CheckCircle2, X, BookOpen, Layers } from 'lucide-react';
import { BookItem, BookTopicItem } from '../../types';

export const BooksView: React.FC = () => {
  const { state, setState, showToast } = useApp();

  const [name, setName] = useState('3D');
  const [course, setCourse] = useState(COURSES[0]);
  const [topic, setTopic] = useState('Genel');
  const [total, setTotal] = useState(300);
  const [solved, setSolved] = useState(0);
  const [category, setCategory] = useState('Soru Bankası');
  const [field, setField] = useState('TYT');
  const [color, setColor] = useState('📘 Mavi');

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('Tümü');

  // Selected Book for Unit Modal
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

  // Form for adding new unit to selected book
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitTests, setNewUnitTests] = useState(6);
  const [newUnitQuestions, setNewUnitQuestions] = useState(72);

  const handleAddBook = () => {
    if (!name.trim()) {
      showToast('Kitap / Kaynak adını giriniz.', 'warning');
      return;
    }

    const defaultUnits: BookTopicItem[] = [
      { id: `u_${Date.now()}_1`, title: '1. Ünite: Giriş & Temel Testler', totalTests: 5, completedTests: 0, totalQuestions: 60, solvedQuestions: 0 },
      { id: `u_${Date.now()}_2`, title: '2. Ünite: Orta Seviye Testler', totalTests: 6, completedTests: 0, totalQuestions: 72, solvedQuestions: 0 },
      { id: `u_${Date.now()}_3`, title: '3. Ünite: Beceri Temelli & ÖSYM Tipi Testler', totalTests: 8, completedTests: 0, totalQuestions: 96, solvedQuestions: 0 }
    ];

    const newBook: BookItem = {
      id: `book_${Date.now()}`,
      name: `${name} ${course}`,
      course,
      topic,
      total: Number(total) || 228,
      solved: Number(solved) || 0,
      category,
      field,
      color,
      lastOpen: new Date().toLocaleDateString('tr-TR'),
      units: defaultUnits
    };

    setState((prev) => ({
      ...prev,
      books: [newBook, ...prev.books]
    }));
    showToast('Kitaplığa yeni kaynak eklendi');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bu kitabı kitaplıktan silmek istediğinize emin misiniz?')) {
      setState((prev) => ({
        ...prev,
        books: prev.books.filter((b) => b.id !== id)
      }));
      if (selectedBook?.id === id) setSelectedBook(null);
      showToast('Kitap silindi', 'info');
    }
  };

  const handleUpdateSolved = (id: string, newSolved: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setState((prev) => ({
      ...prev,
      books: prev.books.map((b) => (b.id === id ? { ...b, solved: Math.max(0, newSolved) } : b))
    }));
  };

  // Add new unit to selected book
  const handleAddUnitToBook = (bookId: string) => {
    if (!newUnitTitle.trim()) {
      showToast('Ünite adını giriniz.', 'warning');
      return;
    }

    const newUnit: BookTopicItem = {
      id: `u_${Date.now()}`,
      title: newUnitTitle.trim(),
      totalTests: Number(newUnitTests) || 5,
      completedTests: 0,
      totalQuestions: Number(newUnitQuestions) || 60,
      solvedQuestions: 0
    };

    setState((prev) => {
      const updatedBooks = prev.books.map((b) => {
        if (b.id === bookId) {
          const currentUnits = b.units || [];
          const nextUnits = [...currentUnits, newUnit];
          const nextTotal = nextUnits.reduce((acc, curr) => acc + curr.totalQuestions, 0);
          const nextSolved = nextUnits.reduce((acc, curr) => acc + curr.solvedQuestions, 0);

          const updatedBook = { ...b, units: nextUnits, total: nextTotal, solved: nextSolved };
          setSelectedBook(updatedBook);
          return updatedBook;
        }
        return b;
      });
      return { ...prev, books: updatedBooks };
    });

    setNewUnitTitle('');
    showToast('Kitaba yeni ünite/konu eklendi');
  };

  // Update a unit inside selected book
  const handleUpdateUnit = (bookId: string, unitId: string, updates: Partial<BookTopicItem>) => {
    setState((prev) => {
      const updatedBooks = prev.books.map((b) => {
        if (b.id === bookId) {
          const currentUnits = b.units || [];
          const nextUnits = currentUnits.map((u) => (u.id === unitId ? { ...u, ...updates } : u));
          const nextTotal = nextUnits.reduce((acc, curr) => acc + curr.totalQuestions, 0);
          const nextSolved = nextUnits.reduce((acc, curr) => acc + curr.solvedQuestions, 0);

          const updatedBook = { ...b, units: nextUnits, total: nextTotal, solved: nextSolved };
          setSelectedBook(updatedBook);
          return updatedBook;
        }
        return b;
      });
      return { ...prev, books: updatedBooks };
    });
  };

  const filteredBooks = state.books.filter((b) => {
    const textMatch = `${b.name} ${b.course} ${b.topic} ${b.category}`.toLowerCase().includes(search.toLowerCase());
    const catMatch = filterCategory === 'Tümü' || b.category === filterCategory;
    return textMatch && catMatch;
  });

  return (
    <div className="space-y-6">
      {/* Hero Add Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-lg">
          <Library className="w-5 h-5 text-indigo-600 dark:text-blue-400" />
          <h3>Kitaplık ve Kaynak Takibi</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Yayın / Kaynak</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: 3D, 345, Bilgi Sarmal..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Ders</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Soru Bankası">Soru Bankası</option>
              <option value="Video Ders Kitabı">Video Ders Kitabı</option>
              <option value="Deneme">Deneme</option>
              <option value="Paragraf">Paragraf</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Alan</label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="TYT">TYT</option>
              <option value="AYT">AYT</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Toplam Soru Sayısı</label>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Çözülen Soru Sayısı</label>
            <input
              type="number"
              value={solved}
              onChange={(e) => setSolved(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Kapak Rengi</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="📘 Mavi">📘 Mavi</option>
              <option value="📕 Kırmızı">📕 Kırmızı</option>
              <option value="📗 Yeşil">📗 Yeşil</option>
              <option value="📙 Turuncu">📙 Turuncu</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleAddBook}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Kitaplığa Ekle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Kitaplıkta ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none"
        >
          <option value="Tümü">Tüm Kategoriler</option>
          <option value="Soru Bankası">Soru Bankası</option>
          <option value="Video Ders Kitabı">Video Ders Kitabı</option>
          <option value="Deneme">Deneme</option>
          <option value="Paragraf">Paragraf</option>
        </select>
      </div>

      {/* Book Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((b) => {
          const pct = b.total ? Math.min(100, Math.round((b.solved / b.total) * 100)) : 0;
          const unitCount = b.units?.length || 0;

          return (
            <div
              key={b.id}
              onClick={() => setSelectedBook(b)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-3 relative group hover:border-indigo-500 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-base">{b.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                      {b.field}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                      {b.category}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      ({unitCount} Konu/Ünite)
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDelete(b.id, e)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar (Durum Çubuğu) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{b.course}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">%{pct} ({b.solved}/{b.total} Soru)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Action Hint */}
              <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Konuları ve Testleri İncele →</span>
                {pct === 100 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    ✓ Tamamlandı
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Book Units & Topics Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">{selectedBook.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedBook.course} • {selectedBook.field} • {selectedBook.category}
                </p>
              </div>

              <button
                onClick={() => setSelectedBook(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overall Book Progress Bar */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Kitap Genel Tamamlanma Durumu</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  %{selectedBook.total ? Math.round((selectedBook.solved / selectedBook.total) * 100) : 0} ({selectedBook.solved} / {selectedBook.total} Soru)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${selectedBook.total ? Math.min(100, Math.round((selectedBook.solved / selectedBook.total) * 100)) : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Units & Topics Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Kitaptaki Konular ve Test Takibi</span>
              </h4>

              {(!selectedBook.units || selectedBook.units.length === 0) ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Bu kitaba henüz ünite veya konu eklenmemiş. Aşağıdaki formdan yeni ünite ekleyebilirsiniz.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedBook.units.map((unit) => {
                    const testPct = unit.totalTests ? Math.round((unit.completedTests / unit.totalTests) * 100) : 0;
                    const questionPct = unit.totalQuestions ? Math.round((unit.solvedQuestions / unit.totalQuestions) * 100) : 0;

                    return (
                      <div
                        key={unit.id}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                      >
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{unit.title}</span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            %{questionPct} Tamamlandı
                          </span>
                        </div>

                        {/* Test completion row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                              <span>Çözülen Test:</span>
                              <span className="font-bold">{unit.completedTests} / {unit.totalTests} Test</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleUpdateUnit(selectedBook.id, unit.id, {
                                    completedTests: Math.max(0, unit.completedTests - 1)
                                  })
                                }
                                className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs font-bold"
                              >
                                -
                              </button>
                              <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                <div
                                  className="h-full bg-indigo-500 rounded-full"
                                  style={{ width: `${testPct}%` }}
                                />
                              </div>
                              <button
                                onClick={() =>
                                  handleUpdateUnit(selectedBook.id, unit.id, {
                                    completedTests: Math.min(unit.totalTests, unit.completedTests + 1)
                                  })
                                }
                                className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                              <span>Çözülen Soru:</span>
                              <span className="font-bold">{unit.solvedQuestions} / {unit.totalQuestions} Soru</span>
                            </div>
                            <input
                              type="number"
                              value={unit.solvedQuestions}
                              onChange={(e) =>
                                handleUpdateUnit(selectedBook.id, unit.id, {
                                  solvedQuestions: Math.max(0, Number(e.target.value))
                                })
                              }
                              className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add New Unit Form */}
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-3 pt-3">
                <div className="font-bold text-xs text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Bu Kitaba Yeni Konu / Ünite Ekle</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newUnitTitle}
                    onChange={(e) => setNewUnitTitle(e.target.value)}
                    placeholder="Örn: 4. Ünite: Paragrafta Yapı"
                    className="sm:col-span-3 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  />
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Test Sayısı</label>
                    <input
                      type="number"
                      value={newUnitTests}
                      onChange={(e) => setNewUnitTests(Number(e.target.value))}
                      className="w-full px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Soru Sayısı</label>
                    <input
                      type="number"
                      value={newUnitQuestions}
                      onChange={(e) => setNewUnitQuestions(Number(e.target.value))}
                      className="w-full px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => handleAddUnitToBook(selectedBook.id)}
                      className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm"
                    >
                      Konu Ekle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
