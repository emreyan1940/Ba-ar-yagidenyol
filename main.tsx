import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COURSES, TOPICS } from '../../data/initialData';
import { Clock, TrendingUp, Sparkles, AlertCircle, Award, BarChart2 } from 'lucide-react';

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

// ÖSYM benchmark statistical estimates for high frequency topics
const OSYM_HIGH_FREQ_TOPICS: Record<string, Array<{ topic: string; avgPerYear: number; probability: string; tip: string }>> = {
  'TYT Türkçe': [
    { topic: 'Paragrafta Anlam', avgPerYear: 22, probability: '%99 Yüksek', tip: 'Her gün en az 20 paragraf sorusu çözmek netini en hızlı artıran kuraldır.' },
    { topic: 'Sözcükte ve Cümlede Anlam', avgPerYear: 6, probability: '%98 Yüksek', tip: 'Çoklu anlamlar ve altı çizili söz öbeklerine dikkat et.' },
    { topic: 'Yazım Kuralları ve Noktalama', avgPerYear: 4, probability: '%95 Yüksek', tip: 'TDK son güncel kurallarını bilmek doğrudan net kazandırır.' },
    { topic: 'Dil Bilgisi (Karma)', avgPerYear: 8, probability: '%90 Yüksek', tip: 'Sözcük türleri ve cümlenin ögelerini tam oturtmalısın.' }
  ],
  'TYT Matematik': [
    { topic: 'Problem Türleri', avgPerYear: 12, probability: '%99 Yüksek', tip: 'Denklem kurma, sayı ve yüzde problemlerine ağırlık ver.' },
    { topic: 'Temel Kavramlar & Sayılar', avgPerYear: 5, probability: '%95 Yüksek', tip: 'Tek-çift, pozitif-negatif sayı kurallarını kaçırma.' },
    { topic: 'Üslü - Köklü İfadeler', avgPerYear: 3, probability: '%90 Yüksek', tip: 'Kural uygulamalarını hızlandır.' },
    { topic: 'Küme ve Mantık', avgPerYear: 2, probability: '%85 Yüksek', tip: 'Klasik 1 mantık ve 1 küme sorusu her sene gelir.' }
  ],
  'TYT Geometri': [
    { topic: 'Üçgenler', avgPerYear: 4, probability: '%98 Yüksek', tip: 'Dik üçgen, benzerlik ve alan konuları geometrinin kalbidir.' },
    { topic: 'Çokgenler ve Dörtgenler', avgPerYear: 3, probability: '%90 Yüksek', tip: 'Özellikle kare ve paralelkenar katlama soruları yaygındır.' },
    { topic: 'Katı Cisimler', avgPerYear: 2, probability: '%90 Yüksek', tip: 'Prizma ve piramit hacim formüllerini iyi kavramalısın.' }
  ],
  'TYT Fizik': [
    { topic: 'Isı ve Sıcaklık', avgPerYear: 1, probability: '%85 Yüksek', tip: 'Kavram yanılgılarına yönelik sözel sorulara dikkat.' },
    { topic: 'Optik', avgPerYear: 2, probability: '%90 Yüksek', tip: 'Düzlem ayna, mercekler ve renk konuları sık sorulur.' },
    { topic: 'Elektrik ve Mıknatıs', avgPerYear: 1, probability: '%80 Orta', tip: 'Lamba parlaklığı ve devre tahlillerini bol çöz.' }
  ],
  'TYT Kimya': [
    { topic: 'Kimyasal Türler Arası Etkileşimler', avgPerYear: 1, probability: '%95 Yüksek', tip: 'Güçlü ve zayıf etkileşim sınıflandırmasını unutma.' },
    { topic: 'Maddenin Halleri', avgPerYear: 1, probability: '%90 Yüksek', tip: 'Görsel okuma ve grafik soruları ağırlıktadır.' },
    { topic: 'Asitler, Bazlar ve Tuzlar', avgPerYear: 1, probability: '%85 Yüksek', tip: 'Tepkime türleri ve günlük hayat kullanım alanları.' }
  ],
  'AYT Matematik': [
    { topic: 'Türev ve Uygulamaları', avgPerYear: 4, probability: '%98 Yüksek', tip: 'Türevin geometrik yorumu ve artan-azalanlık garantidir.' },
    { topic: 'İntegral ve Alan', avgPerYear: 4, probability: '%98 Yüksek', tip: 'Belirli integral ile alan hesabı soruları ÖSYM klasiğidir.' },
    { topic: 'Trigonometri', avgPerYear: 4, probability: '%95 Yüksek', tip: 'Trigonometrik denklem ve toplam-fark formüllerine hâkim ol.' },
    { topic: 'Limit ve Süreklilik', avgPerYear: 2, probability: '%90 Yüksek', tip: 'Belirsizlik durumları ve grafik okuma hakimiyeti şart.' }
  ]
};

export const PastQuestionsView: React.FC = () => {
  const { state, setState } = useApp();
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);

  const courseTopics = TOPICS[selectedCourse] || [];
  const highFreqInfo = OSYM_HIGH_FREQ_TOPICS[selectedCourse] || [];

  const handleUpdateCount = (topic: string, year: number, val: number) => {
    const key = `${selectedCourse}|${topic}`;
    const currentTopicObj = state.pastQuestions[key] || {};

    const updatedObj = {
      ...currentTopicObj,
      [year]: Math.max(0, val)
    };

    setState((prev) => ({
      ...prev,
      pastQuestions: {
        ...prev.pastQuestions,
        [key]: updatedObj
      }
    }));
  };

  // Calculate total questions recorded for this course
  let courseTotalQuestionsRecorded = 0;
  courseTopics.forEach((topic) => {
    const key = `${selectedCourse}|${topic}`;
    const topicData = state.pastQuestions[key] || {};
    YEARS.forEach((y) => {
      courseTotalQuestionsRecorded += topicData[y] || 0;
    });
  });

  return (
    <div className="space-y-6">
      {/* Header & Course Selector */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-extrabold text-lg text-slate-900 dark:text-slate-100">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3>Çıkmış Sorular & ÖSYM Analiz Modülü</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Ders Seç:</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold focus:outline-none"
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick ÖSYM Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Kayıtlı Soru Sayısı</span>
              <span className="text-base font-black text-slate-900 dark:text-slate-100">{courseTotalQuestionsRecorded} Soru</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Yüksek İhtimal Konular</span>
              <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{highFreqInfo.length || '3+'} Kritik Konu</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">ÖSYM Tipi Derece Stratejisi</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">Aktif Analiz</span>
            </div>
          </div>
        </div>
      </div>

      {/* ÖSYM High Frequency Topics & Tips Cards */}
      {highFreqInfo.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/10 via-slate-900/5 to-slate-900/10 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-900/50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-extrabold text-sm text-indigo-900 dark:text-indigo-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>ÖSYM Analizi: {selectedCourse} En Çok Soru Çıkan Kritik Konular & Taktikler</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {highFreqInfo.map((hf) => (
              <div
                key={hf.topic}
                className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{hf.topic}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-[10px]">
                    Ort. {hf.avgPerYear} Soru / Yıl • {hf.probability}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{hf.tip}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matrix Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
            <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Yıllara Göre Çıkmış Soru Dağılım Matrisi ({selectedCourse})</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Rakamları düzenlemek için kutulara tıklayabilirsiniz</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200 min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                <th className="py-3 px-3">Konu</th>
                {YEARS.map((y) => (
                  <th key={y} className="py-3 px-3 text-center">
                    {y}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {courseTopics.map((topic) => {
                const key = `${selectedCourse}|${topic}`;
                const topicData = state.pastQuestions[key] || {};

                return (
                  <tr key={topic} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100 text-xs">{topic}</td>
                    {YEARS.map((y) => {
                      const count = topicData[y] ?? 0;
                      return (
                        <td key={y} className="py-2 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            value={count}
                            onChange={(e) => handleUpdateCount(topic, y, Number(e.target.value))}
                            className="w-12 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center text-amber-600 dark:text-amber-400 focus:outline-none"
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

