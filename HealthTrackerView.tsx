import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COURSES, TOPICS } from '../../data/initialData';
import { ClipboardCheck, Plus, Trash2, Calendar, BookOpen, Send, Sparkles } from 'lucide-react';
import { MistakeRecord } from '../../types';

export const ExamAnalysisView: React.FC = () => {
  const { state, setState, showToast } = useApp();

  const [examType, setExamType] = useState<'TYT' | 'AYT'>('TYT');
  const [examName, setExamName] = useState('3D Türkiye Geneli - 1');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);

  // Lessons for current exam type
  const tytLessons = ['TYT Türkçe', 'TYT Sosyal', 'TYT Matematik', 'TYT Fen'];
  const aytLessons = ['AYT Matematik', 'AYT Fizik', 'AYT Kimya', 'AYT Biyoloji', 'AYT Edebiyat'];

  const lessonsForType = examType === 'TYT' ? tytLessons : aytLessons;

  // Score states
  const [lessonScores, setLessonScores] = useState<Record<string, { d: number; y: number; b: number }>>({
    'TYT Türkçe': { d: 32, y: 5, b: 3 },
    'TYT Sosyal': { d: 15, y: 3, b: 2 },
    'TYT Matematik': { d: 28, y: 4, b: 8 },
    'TYT Fen': { d: 14, y: 4, b: 2 }
  });

  // Wrong topic tag state
  const [wCourse, setWCourse] = useState(COURSES[0]);
  const [wTopic, setWTopic] = useState((TOPICS[COURSES[0]] && TOPICS[COURSES[0]][0]) || 'Genel');
  const [wReason, setWReason] = useState('Bilgi eksiği');
  const [wrongTopics, setWrongTopics] = useState<Array<{ course: string; topic: string; reason: string }>>([]);

  // Auto add to Mistake notebook checkbox
  const [autoTransferMistakes, setAutoTransferMistakes] = useState(true);

  const handleScoreChange = (lesson: string, field: 'd' | 'y' | 'b', val: number) => {
    setLessonScores((prev) => ({
      ...prev,
      [lesson]: {
        ...(prev[lesson] || { d: 0, y: 0, b: 0 }),
        [field]: Math.max(0, val)
      }
    }));
  };

  const handleAddWrongTopic = () => {
    setWrongTopics((prev) => [...prev, { course: wCourse, topic: wTopic, reason: wReason }]);
    showToast(`Yanlış konu eklendi: ${wCourse} / ${wTopic}`);
  };

  const handleRemoveWrongTopic = (index: number) => {
    setWrongTopics((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveExam = () => {
    if (!examName.trim()) {
      showToast('Deneme adını giriniz.', 'warning');
      return;
    }

    const details = lessonsForType.map((l) => {
      const sc = lessonScores[l] || { d: 0, y: 0, b: 0 };
      const net = Number((sc.d - sc.y * 0.25).toFixed(2));
      return { l, d: sc.d, y: sc.y, b: sc.b, net };
    });

    const totalNet = Number(details.reduce((acc, curr) => acc + curr.net, 0).toFixed(2));
    const wrongStr = wrongTopics.map((wt) => `${wt.course} (${wt.topic})`).join(', ');

    const newExam = {
      id: `exam_${Date.now()}`,
      date: new Date(examDate).toLocaleDateString('tr-TR'),
      type: examType,
      name: examName,
      net: totalNet,
      wrong: wrongStr,
      det: details
    };

    // Prepare Mistake notebook items if auto transfer checked
    let newMistakeRecords: MistakeRecord[] = [];
    if (autoTransferMistakes && wrongTopics.length > 0) {
      newMistakeRecords = wrongTopics.map((wt, i) => ({
        id: `m_auto_${Date.now()}_${i}`,
        date: new Date().toLocaleDateString('tr-TR'),
        course: wt.course,
        topic: wt.topic,
        source: `${examType} Denemesi - ${examName}`,
        reason: wt.reason,
        note: `Deneme Analizinden Otomatik Aktarıldı. (Tarih: ${new Date(examDate).toLocaleDateString('tr-TR')})`
      }));
    }

    setState((prev) => ({
      ...prev,
      exams: [newExam, ...prev.exams],
      mistakes: [...newMistakeRecords, ...prev.mistakes]
    }));

    setWrongTopics([]);
    showToast(
      `Deneme kaydedildi! Total Net: ${totalNet}` +
        (newMistakeRecords.length ? ` (${newMistakeRecords.length} soru Yanlış Defterine aktarıldı)` : '')
    );
  };

  const handleManualTransferMistakes = (examName: string, wrongStr: string) => {
    if (!wrongStr) {
      showToast('Bu denemede etiketlenmiş yanlış konu bulunmuyor.', 'info');
      return;
    }

    const newMistake: MistakeRecord = {
      id: `m_manual_${Date.now()}`,
      date: new Date().toLocaleDateString('tr-TR'),
      course: 'Genel Deneme Yanlışı',
      topic: wrongStr,
      source: examName,
      reason: 'Deneme Analizi Transferi',
      note: `Tüm Yanlış Konular: ${wrongStr}`
    };

    setState((prev) => ({
      ...prev,
      mistakes: [newMistake, ...prev.mistakes]
    }));

    showToast('Yanlış Defterine başarıyla aktarıldı!');
  };

  const handleDeleteExam = (id: string) => {
    if (window.confirm('Bu deneme kaydını silmek istediğinize emin misiniz?')) {
      setState((prev) => ({
        ...prev,
        exams: prev.exams.filter((e) => e.id !== id)
      }));
      showToast('Deneme kaydı silindi', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Exam Entry Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-4">
        <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-slate-100">
          <ClipboardCheck className="w-5 h-5 text-indigo-600 dark:text-blue-400" />
          <h3>Deneme Sınavı Net Analizi & Yanlış Defteri Entegrasyonu</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Deneme Tipi</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExamType('TYT')}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                  examType === 'TYT'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                TYT
              </button>
              <button
                type="button"
                onClick={() => setExamType('AYT')}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                  examType === 'AYT'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                AYT
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Deneme Yayın/Adı
            </label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="Örn: 3D Türkiye Geneli TYT-1"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tarih</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none"
            />
          </div>
        </div>

        {/* Lesson Scores Input Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {lessonsForType.map((lesson) => {
            const sc = lessonScores[lesson] || { d: 0, y: 0, b: 0 };
            const net = Number((sc.d - sc.y * 0.25).toFixed(2));

            return (
              <div
                key={lesson}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-3"
              >
                <div className="flex justify-between items-center font-extrabold text-xs text-indigo-600 dark:text-blue-400">
                  <span>{lesson}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{net} Net</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Doğru</label>
                    <input
                      type="number"
                      value={sc.d}
                      onChange={(e) => handleScoreChange(lesson, 'd', Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Yanlış</label>
                    <input
                      type="number"
                      value={sc.y}
                      onChange={(e) => handleScoreChange(lesson, 'y', Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center text-rose-600 dark:text-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-0.5">Boş</label>
                    <input
                      type="number"
                      value={sc.b}
                      onChange={(e) => handleScoreChange(lesson, 'b', Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center text-slate-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wrong Topics Tag Selector */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
            Yanlış Yapılan Konuları Etiketle (Yanlış Defterine Aktarım İçin)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <select
              value={wCourse}
              onChange={(e) => {
                setWCourse(e.target.value);
                if (TOPICS[e.target.value]) setWTopic(TOPICS[e.target.value][0]);
              }}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-200"
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={wTopic}
              onChange={(e) => setWTopic(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-200"
            >
              {(TOPICS[wCourse] || ['Genel']).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={wReason}
              onChange={(e) => setWReason(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-200"
            >
              <option value="Bilgi eksiği">Bilgi eksiği</option>
              <option value="Dikkatsizlik">Dikkatsizlik</option>
              <option value="İşlem hatası">İşlem hatası</option>
              <option value="Süre yetmedi">Süre yetmedi</option>
            </select>

            <button
              onClick={handleAddWrongTopic}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Konu Etiketle</span>
            </button>
          </div>

          {wrongTopics.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {wrongTopics.map((wt, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2"
                >
                  <span>{wt.course} / {wt.topic} ({wt.reason})</span>
                  <button onClick={() => handleRemoveWrongTopic(idx)} className="hover:text-rose-900">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Auto Transfer Checkbox */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="autoMistake"
              checked={autoTransferMistakes}
              onChange={(e) => setAutoTransferMistakes(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor="autoMistake" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Yanlış Yapılan Konuları Otomatik "Yanlış Defteri"ne Aktar</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleSaveExam}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-indigo-600/20"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Denemeyi Kaydet & Analiz Et</span>
        </button>
      </div>

      {/* Past Exams History */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Geçmiş Deneme Kayıtları</h3>

        <div className="space-y-3">
          {state.exams.map((exam) => (
            <div
              key={exam.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2 relative group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                    {exam.type}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{exam.name}</span>
                  <span className="text-xs text-slate-500">• {exam.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{exam.net} Net</span>

                  {exam.wrong && (
                    <button
                      onClick={() => handleManualTransferMistakes(exam.name, exam.wrong)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Yanlış Defterine Gönder</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lesson breakdown */}
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-1">
                {exam.det.map((d) => (
                  <span key={d.l}>
                    {d.l}: <strong className="text-slate-900 dark:text-slate-100">{d.d}D {d.y}Y = {d.net} Net</strong>
                  </span>
                ))}
              </div>

              {exam.wrong && (
                <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold pt-1">
                  <strong>Yanlış Konular:</strong> {exam.wrong}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
