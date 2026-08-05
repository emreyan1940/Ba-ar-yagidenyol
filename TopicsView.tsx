import { AppState, CampPreset } from '../types';

export const COURSES = [
  'TYT Türkçe',
  'TYT Matematik',
  'TYT Fizik',
  'TYT Kimya',
  'TYT Biyoloji',
  'TYT Tarih',
  'TYT Coğrafya',
  'TYT Felsefe',
  'TYT Din Kültürü',
  'TYT-AYT Geometri',
  'AYT Matematik',
  'AYT Fizik',
  'AYT Kimya',
  'AYT Biyoloji',
  'AYT Edebiyat',
  'AYT Tarih-1',
  'AYT Coğrafya-1',
  'Paragraf'
];

export const TOPICS: Record<string, string[]> = {
  'TYT Türkçe': [
    'Ses Bilgisi',
    'Yazım Kuralları',
    'Noktalama İşaretleri',
    'Sözcükte Yapı',
    'İsimler',
    'Sıfatlar',
    'Zamirler',
    'Zarflar',
    'Edat - Bağlaç - Ünlem',
    'Fiiller ve Fiilimsiler',
    'Fiilde Çatı',
    'Cümlenin Ögeleri',
    'Cümle Türleri',
    'Anlatım Bozuklukları',
    'Sözcükte Anlam',
    'Cümlede Anlam',
    'Paragraf'
  ],
  'Paragraf': [
    'Sözcükte Anlam',
    'Cümlede Anlam',
    'Anlatım Biçimleri',
    'Paragrafta Anlam',
    'Paragrafta Yapı',
    'Çoklu Paragraf',
    'Algını Ölç - Algını Kontrol Et',
    'Tablo Yorumu'
  ],
  'TYT Matematik': [
    'Temel Kavramlar',
    'Sayı Basamakları',
    'Bölme ve Bölünebilme',
    'EBOB - EKOK',
    'Rasyonel Sayılar',
    'Basit Eşitsizlikler',
    'Mutlak Değer',
    'Üslü Sayılar',
    'Köklü Sayılar',
    'Çarpanlara Ayırma',
    'Oran - Orantı',
    'I ve II Bilinmeyenli Denklemler',
    'Sayı Problemleri',
    'Kesir Problemleri',
    'Yaş Problemleri',
    'Yüzde - Kar Zarar Problemleri',
    'Karışım Problemleri',
    'Hareket Problemleri',
    'İşçi Problemleri',
    'Grafik ve Veri Analizi',
    'Mantık',
    'Kümeler',
    'Fonksiyonlar',
    'Polinomlar',
    '2. Dereceden Denklemler',
    'Permütasyon - Kombinasyon',
    'Binom Açılımı',
    'Olasılık',
    'Veri - İstatistik'
  ],
  'TYT-AYT Geometri': [
    'Doğruda Açı',
    'Üçgende Açı',
    'Dik Üçgen',
    'İkizkenar - Eşkenar Üçgen',
    'Açıortay - Kenarortay',
    'Üçgende Benzerlik',
    'Üçgende Alan',
    'Açı Kenar Bağıntıları',
    'Çokgenler',
    'Dörtgenler - Deltoid',
    'Yamuk',
    'Paralelkenar',
    'Eşkenar Dörtgen',
    'Dikdörtgen - Kare',
    'Çemberde Açı',
    'Çemberde Uzunluk',
    'Dairede Alan',
    'Nokta Analitiği',
    'Doğrunun Analitiği',
    'Dönüşümler Geometrisi',
    'Çember Analitiği',
    'Katı Cisimler (Prizma, Piramit, Küre)'
  ],
  'TYT Fizik': [
    'Fizik Bilimine Giriş',
    'Madde ve Özellikleri',
    'Dayanıklılık - Adezyon Kohezyon',
    'Hareket ve Kuvvet',
    'İş, Güç ve Enerji',
    'Isı ve Sıcaklık - Genleşme',
    'Elektrostatik',
    'Elektrik Akımı ve Devreler',
    'Mıknatıs ve Manyetizma',
    'Basınç ve Kaldırma Kuvveti',
    'Aydınlanma ve Gölge',
    'Düzlem ve Küresel Aynalar',
    'Işığın Kırılması ve Mercekler',
    'Prizmalar ve Renk',
    'Yay ve Su Dalgaları',
    'Ses ve Deprem Dalgaları'
  ],
  'TYT Kimya': [
    'Kimya Bilimi',
    'Atom ve Periyodik Sistem',
    'Kimyasal Türler Arası Etkileşimler',
    'Maddenin Halleri',
    'Doğa ve Kimya',
    'Kimyanın Temel Kanunları',
    'Kimyasal Hesaplamalar',
    'Karışımlar',
    'Asitler, Bazlar ve Tuzlar',
    'Kimya Her Yerde'
  ],
  'TYT Biyoloji': [
    'Canlıların Ortak Özellikleri',
    'Canlıların Temel Bileşenleri',
    'Hücre Yapısı ve Organeller',
    'Hücre Zarından Madde Geçişleri',
    'Canlıların Sınıflandırılması',
    'Hücre Bölünmeleri ve Mitoz',
    'Mayoz Bölünme ve Eşeyli Üreme',
    'Kalıtımın Temel İlkeleri',
    'Ekosistem Ekolojisi',
    'Güncel Çevre Sorunları'
  ],
  'TYT Tarih': [
    'Tarih ve Zaman',
    'İnsanlığın İlk Dönemleri',
    'İlk ve Orta Çağlarda Türk Dünyası',
    'İslam Medeniyetinin Doğuşu',
    'Türklerin İslamiyet\'i Kabulü',
    'Yerleşme ve Devletleşme Sürecinde Selçuklu',
    'Beylikten Devlete Osmanlı Siyaseti',
    'Dünya Gücü Osmanlı',
    'Milli Mücadele Hazırlık Dönemi',
    'I. TBMM Dönemi ve Kurtuluş Savaşı',
    'Atatürk İlkeleri ve İnkılaplar'
  ],
  'TYT Coğrafya': [
    'Doğa ve İnsan',
    'Dünya\'nın Şekli ve Hareketleri',
    'Coğrafi Konum - Harita Bilgisi',
    'İklim Bilgisi ve Tipleri',
    'İç ve Dış Kuvvetler',
    'Türkiye\'nin Yer Şekilleri',
    'Nüfus ve Yerleşme',
    'Bölgeler ve Ulaşım Yolları',
    'Afetler ve Çevre'
  ],
  'AYT Matematik': [
    'Fonksiyonlar (İleri Düzey)',
    'Polinomlar',
    '2. Dereceden Denklemler',
    'Karmaşık Sayılar',
    'Parabol',
    'Eşitsizlikler',
    'Trigonometri',
    'Logaritma',
    'Diziler',
    'Limit ve Süreklilik',
    'Türev ve Uygulamaları',
    'İntegral ve Alan Hesapları'
  ],
  'AYT Fizik': [
    'Vektörler',
    'Bağıl Hareket',
    'Newton\'un Hareket Yasaları',
    'Bir Boyutta Sabit İvmeli Hareket',
    'Atışlar',
    'İş, Enerji ve Güç',
    'İtme ve Çizgisel Momentum',
    'Tork ve Denge - Ağırlık Merkezi',
    'Basit Makineler',
    'Çembersel Hareket',
    'Açısal Momentum - Kepler Yasaları',
    'Basit Harmonik Hareket',
    'Dalga Mekaniği ve Kırınım',
    'Elektriksel Kuvvet ve Elektrik Alan',
    'Elektriksel Potansiyel ve İş',
    'Düzgün Elektrik Alan ve Sığaçlar',
    'Manyetik Alan ve Kuvvet',
    'İndüksiyon ve Alternatif Akım',
    'Elektromanyetik Dalgalar',
    'Atom Modelleri ve Büyük Patlama',
    'Fotoelektrik Olay ve Compton Saçılması',
    'Modern Fizik ve Teknolojideki Uygulamaları'
  ],
  'AYT Kimya': [
    'Modern Atom Teorisi',
    'Gazlar',
    'Sıvı Çözeltiler ve Koligatif Özellikler',
    'Kimyasal Tepkimelerde Enerji',
    'Kimyasal Tepkimelerde Hız',
    'Kimyasal Tepkimelerde Denge',
    'Sulu Çözelti Dengeleri (Asit-Baz)',
    'Çözünürlük Dengesi (KÇÇ)',
    'Kimya ve Elektrik (Piller, Elektroliz)',
    'Karbon Kimyasına Giriş',
    'Organik Bileşikler'
  ],
  'AYT Biyoloji': [
    'Sinir Sistemi',
    'Endokrin Sistem (Hormonlar)',
    'Duyu Organları',
    'Destek ve Hareket Sistemi',
    'Sindirim Sistemi',
    'Dolaşım ve Bağışıklık Sistemi',
    'Solunum Sistemi',
    'Üriner Sistem (Boşaltım)',
    'Üreme Sistemi ve Embriyonik Gelişim',
    'Komünite ve Popülasyon Ekolojisi',
    'Nükleik Asitler ve Protein Sentezi',
    'Hücresel Solunum',
    'Fotosentez ve Kemosentez',
    'Bitki Biyolojisi'
  ]
};

export const UNIVERSITIES = [
  { name: 'Boğaziçi Üniversitesi', city: 'İstanbul', departments: ['Bilgisayar Mühendisliği', 'Endüstri Mühendisliği', 'Yazılım Mühendisliği', 'İktisat', 'İşletme'] },
  { name: 'İstanbul Teknik Üniversitesi (İTÜ)', city: 'İstanbul', departments: ['Bilgisayar Mühendisliği', 'Yapay Zeka Mühendisliği', 'Elektronik ve Haberleşme', 'Makine Mühendisliği', 'Uçak Mühendisliği'] },
  { name: 'Middle East Technical University (ODTÜ)', city: 'Ankara', departments: ['Bilgisayar Mühendisliği', 'Elektrik-Elektronik Mühendisliği', 'Havacılık ve Uzay Mühendisliği', 'Endüstri Mühendisliği'] },
  { name: 'Hacettepe Üniversitesi', city: 'Ankara', departments: ['Tıp Fakültesi (İngilizce)', 'Tıp Fakültesi (Türkçe)', 'Diş Hekimliği', 'Eczacılık', 'Bilgisayar Mühendisliği'] },
  { name: 'Ankara Üniversitesi', city: 'Ankara', departments: ['Tıp Fakültesi', 'Hukuk Fakültesi', 'Eczacılık', 'Siyasal Bilgiler (Mülkiye)'] },
  { name: 'İstanbul Üniversitesi', city: 'İstanbul', departments: ['İstanbul Tıp Fakültesi (Çapa)', 'Cerrahpaşa Tıp', 'Hukuk Fakültesi', 'Diş Hekimliği'] },
  { name: 'Bilkent Üniversitesi', city: 'Ankara', departments: ['Bilgisayar Mühendisliği (Burslu)', 'Elektrik-Elektronik Mühendisliği', 'Endüstri Mühendisliği', 'Hukuk'] },
  { name: 'Koç Üniversitesi', city: 'İstanbul', departments: ['Tıp Fakültesi (Burslu)', 'Bilgisayar Mühendisliği', 'Endüstri Mühendisliği', 'Hukuk'] },
  { name: 'Sabancı Üniversitesi', city: 'İstanbul', departments: ['Mühendislik ve Doğa Bilimleri Programları', 'Yönetim Bilimleri Programları'] },
  { name: 'Ege Üniversitesi', city: 'İzmir', departments: ['Tıp Fakültesi', 'Diş Hekimliği', 'Eczacılık', 'Bilgisayar Mühendisliği'] },
  { name: 'Dokuz Eylül Üniversitesi', city: 'İzmir', departments: ['Tıp Fakültesi', 'Hukuk Fakültesi', 'Bilgisayar Mühendisliği'] }
];

export const PRESET_CAMPS: CampPreset[] = [
  {
    id: 'kadir-gumus-42-parla-paragraf',
    key: 'kadir-gumus-42-gunde-parla-paragraf-kampi',
    name: 'Kadir Gümüş 42 Günde PARLA Paragraf Kampı',
    course: 'Paragraf',
    youtube: 'https://www.youtube.com/results?search_query=kadir+güm%C3%BC%C5%9F+parla+paragraf',
    fileName: 'PARLA Paragraf Kamp Kitabı',
    items: [
      'Sözcükte Anlam', 'Sözcükte Anlam', 'Sözcükte Anlam', 'Sözcükte Anlam', 'Sözcükte Anlam',
      'Cümlede Anlam', 'Cümlede Anlam', 'Cümlede Anlam', 'Cümlede Anlam', 'Cümlede Anlam',
      'Anlatım Biçimleri', 'Paragrafta Anlam Giriş', 'Paragrafta Ana Düşünce', 'Paragrafta Yardımcı Düşünce',
      'Paragrafta Yapı - Paragrafı İkiye Bölme', 'Paragrafta Yapı - Akışı Bozan Cümle', 'Paragrafta Yapı - Cümle Yerleştirme',
      'Çoklu Paragraf Soruları', 'Aşamalı Çoklu Paragraf', 'Algını Ölç - Algını Kontrol Et', 'Tablo ve Grafik Yorumu'
    ].map((topic, idx) => ({
      id: `parla_p_${idx + 1}`,
      day: `${idx + 1}. Gün`,
      topic,
      raw: `${idx + 1}. Gün - ${topic}`,
      done: false,
      stage: idx % 3 === 0 ? 'mavi' : idx % 3 === 1 ? 'yesil' : 'sari',
      testCount: 2,
      videoCount: 1,
      questionCount: 30,
      duration: '45 dk'
    }))
  },
  {
    id: 'kadir-gumus-14-parla-dilbilgisi',
    key: 'kadir-gumus-14-gunde-parla-dil-bilgisi-kampi',
    name: 'Kadir Gümüş 14 Günde PARLA Dil Bilgisi Kampı',
    course: 'TYT Türkçe',
    youtube: 'https://www.youtube.com/results?search_query=kadir+güm%C3%BC%C5%9F+parla+dil+bilgisi',
    items: [
      'Ses Bilgisi', 'Yazım Kuralları', 'Noktalama İşaretleri', 'Sözcükte Yapı', 'İsim - Sıfat - Zamir',
      'Tamlama - Zarf', 'Edat - Bağlaç - Ünlem', 'Fiil Çekimi - Kip Ek - Fiil', 'Fiilimsi',
      'Fiilde Çatı - Fiilde Yapı', 'Söz Grupları', 'Cümlenin Öğeleri', 'Cümle Türleri', 'Anlatım Bozuklukları'
    ].map((topic, idx) => ({
      id: `parla_db_${idx + 1}`,
      day: `${idx + 1}. Gün`,
      topic,
      raw: `${idx + 1}. Gün - ${topic}`,
      done: false,
      stage: 'pembe',
      testCount: 3,
      videoCount: 2,
      questionCount: 40,
      duration: '50 dk'
    }))
  },
  {
    id: 'mert-hoca-75-tyt-matematik',
    key: 'mert-hoca-75-gunde-tyt-matematik-kampi',
    name: 'Mert Hoca 75 Günde TYT Matematik Kampı',
    course: 'TYT Matematik',
    youtube: 'https://www.youtube.com/results?search_query=mert+hoca+75+gün+tyt+matematik',
    items: [
      'Sayı Kümeleri - Pozitif Negatif Sayılar', 'En Büyük ve En Küçük Değer', 'Tek ve Çift Sayılar',
      'Ardışık Sayılar', 'Asal Sayılar - Faktöriyel', 'Temel Kavramlar Efişinado Testi',
      'Sayı Basamakları', 'Rasyonel Sayılar', 'Ondalık Sayılar', 'Bölme Bölünebilme',
      'EBOB - EKOK', 'Basit Eşitsizlikler', 'Mutlak Değer', 'Üslü Sayılar', 'Köklü Sayılar',
      'Çarpanlara Ayırma', 'Oran Orantı', 'Sayı Problemleri', 'Kesir Problemleri', 'Yaş Problemleri',
      'Yüzde - Kar Zarar Problemleri', 'Karışım Problemleri', 'Hareket Problemleri', 'Kümeler', 'Fonksiyonlar',
      'Permütasyon Kombinasyon Olasılık'
    ].map((topic, idx) => ({
      id: `mh_mat_${idx + 1}`,
      day: `${idx + 1}. Gün`,
      topic,
      raw: `${idx + 1}. Gün - ${topic}`,
      done: false,
      testCount: 2,
      videoCount: 2,
      questionCount: 35,
      duration: '60 dk'
    }))
  },
  {
    id: 'eyup-b-60-geometri',
    key: 'eyup-b-60-gunde-geometri-kampi',
    name: 'Eyüp B 60 Günde TYT-AYT Geometri Kampı',
    course: 'TYT-AYT Geometri',
    youtube: 'https://www.youtube.com/results?search_query=eyüp+b+geometri+kampı',
    items: [
      'Doğruda Açı', 'Üçgende Açı', 'Dik Üçgen', 'İkizkenar ve Eşkenar', 'Açıortay - Kenarortay',
      'Üçgende Benzerlik', 'Üçgende Alan', 'Çokgenler ve Dörtgenler', 'Yamuk', 'Paralelkenar',
      'Eşkenar Dörtgen - Kare', 'Çemberde Açı ve Uzunluk', 'Dairede Alan', 'Nokta ve Doğrunun Analitiği', 'Katı Cisimler'
    ].map((topic, idx) => ({
      id: `eyup_geo_${idx + 1}`,
      day: `${idx + 1}. Gün`,
      topic,
      raw: `${idx + 1}. Gün - ${topic}`,
      done: false,
      testCount: 2,
      videoCount: 1,
      questionCount: 25,
      duration: '45 dk'
    }))
  },
  {
    id: 'gorkem-sahin-50-tyt-kimya',
    key: 'gorkem-sahin-50-gunde-tyt-kimya-kampi',
    name: 'Görkem Şahin 50 Günde TYT Kimya Kampı',
    course: 'TYT Kimya',
    youtube: 'https://www.youtube.com/results?search_query=görkem+şahin+tyt+kimya+kampı',
    items: [
      'Kimya Bilimi', 'Atom ve Periyodik Sistem', 'Kimyasal Türler Arası Etkileşimler', 'Maddenin Halleri',
      'Doğa ve Kimya', 'Kimyanın Temel Kanunları', 'Kimyasal Hesaplamalar', 'Karışımlar', 'Asitler ve Bazlar', 'Kimya Her Yerde'
    ].map((topic, idx) => ({
      id: `gs_kim_${idx + 1}`,
      day: `${idx + 1}. Gün`,
      topic,
      raw: `${idx + 1}. Gün - ${topic}`,
      done: false,
      testCount: 2,
      videoCount: 1,
      questionCount: 30,
      duration: '40 dk'
    }))
  },
  {
    id: 'ozcan-aykin-60-tyt-fizik',
    key: 'ozcan-aykin-60-gunde-tyt-fizik-kampi',
    name: 'Özcan Aykın 60 Günde TYT Fizik Kampı',
    course: 'TYT Fizik',
    youtube: 'https://www.youtube.com/results?search_query=özcan+aykın+tyt+fizik+kampı',
    items: [
      'Fizik Bilimine Giriş', 'Madde ve Özellikleri', 'Hareket ve Kuvvet', 'İş, Güç ve Enerji',
      'Isı, Sıcaklık ve Genleşme', 'Elektrostatik', 'Elektrik Akımı', 'Basınç ve Kaldırma Kuvveti',
      'Optik - Gölge ve Aynalar', 'Optik - Kırılma ve Mercekler', 'Dalgalar'
    ].map((topic, idx) => ({
      id: `oa_fiz_${idx + 1}`,
      day: `${idx + 1}. Gün`,
      topic,
      raw: `${idx + 1}. Gün - ${topic}`,
      done: false,
      testCount: 2,
      videoCount: 2,
      questionCount: 30,
      duration: '50 dk'
    }))
  },
  {
    id: 'betul-biyoloji-35-tyt-biyoloji',
    key: 'betul-biyoloji-35-gunde-tyt-biyoloji-kampi',
    name: 'Betül Biyoloji 35 Günde TYT Biyoloji Kampı',
    course: 'TYT Biyoloji',
    youtube: 'https://www.youtube.com/results?search_query=betül+biyoloji+tyt+biyoloji+kampı',
    items: [
      'Canlıların Ortak Özellikleri', 'Organik ve İnorganik Bileşikler', 'Hücre ve Organeller',
      'Hücre Zarından Madde Geçişleri', 'Canlıların Sınıflandırılması', 'Mitoz ve Eşeysiz Üreme',
      'Mayoz ve Eşeyli Üreme', 'Kalıtım ve Soyağaçları', 'Ekoloji ve Madde Döngüleri'
    ].map((topic, idx) => ({
      id: `bb_bio_${idx + 1}`,
      day: `${idx + 1}. Gün`,
      topic,
      raw: `${idx + 1}. Gün - ${topic}`,
      done: false,
      testCount: 2,
      videoCount: 1,
      questionCount: 25,
      duration: '35 dk'
    }))
  }
];

export const INITIAL_APP_STATE: AppState = {
  theme: 'light',
  themeShop: 'default',
  apiKey: '',
  yksDate: '2027-06-19',
  goal: {
    uni: 'Boğaziçi Üniversitesi',
    dept: 'Bilgisayar Mühendisliği',
    tyt: 105,
    ayt: 75
  },
  daily: [],
  weekly: [],
  topics: {},
  books: [
    {
      id: 'book_1',
      name: '3D TYT Matematik Soru Bankası',
      course: 'TYT Matematik',
      topic: 'Tüm Konular',
      total: 380,
      solved: 120,
      category: 'Soru Bankası',
      field: 'TYT',
      color: '📘 Mavi',
      lastOpen: new Date().toLocaleDateString('tr-TR'),
      units: [
        { id: 'u1', title: '1. Ünite: Temel Kavramlar & Sayılar', totalTests: 8, completedTests: 5, totalQuestions: 96, solvedQuestions: 60 },
        { id: 'u2', title: '2. Ünite: Bölme & Bölünebilme', totalTests: 6, completedTests: 4, totalQuestions: 72, solvedQuestions: 48 },
        { id: 'u3', title: '3. Ünite: Sayı & Kesir Problemleri', totalTests: 12, completedTests: 2, totalQuestions: 144, solvedQuestions: 24 }
      ]
    },
    {
      id: 'book_2',
      name: 'PARLA Paragraf Kamp Kitabı',
      course: 'Paragraf',
      topic: 'Paragrafta Yapı',
      total: 240,
      solved: 90,
      category: 'Paragraf',
      field: 'TYT',
      color: '📕 Kırmızı',
      lastOpen: new Date().toLocaleDateString('tr-TR'),
      units: [
        { id: 'u2_1', title: '1. Aşama: Mavi - Anlatım Biçimleri', totalTests: 5, completedTests: 5, totalQuestions: 60, solvedQuestions: 60 },
        { id: 'u2_2', title: '2. Aşama: Yeşil - Paragrafta Yapı', totalTests: 6, completedTests: 3, totalQuestions: 72, solvedQuestions: 30 }
      ]
    }
  ],
  pomo: {
    sessions: 4,
    minutes: 100
  },
  camps: PRESET_CAMPS,
  activeCampId: PRESET_CAMPS[0].id,
  campWeekly: [],
  campMonthly: [],
  lessonNotes: {
    'TYT Türkçe': '<h3>Ses Bilgisi Püf Noktaları:</h3><ul><li>Ünlü düşmesi: "akıl -> aklı", "kayıp -> kaybolmak"</li><li>Ünsüz yumuşaması: p, ç, t, k -> b, c, d, g/ğ</li></ul>',
    'TYT Matematik': '<h3>Problem Çözüm Stratejileri:</h3><p>Denklem kurarken istenen değişkene x deyip tek değişken üzerinden ilerle.</p>'
  },
  exams: [
    {
      id: 'exam_1',
      date: new Date().toLocaleDateString('tr-TR'),
      type: 'TYT',
      name: '3D Türkiye Geneli TYT-1',
      net: 82.5,
      det: [
        { l: 'Türkçe', d: 32, y: 5, b: 3, net: 30.75 },
        { l: 'Matematik', d: 28, y: 4, b: 8, net: 27.0 },
        { l: 'Sosyal', d: 15, y: 3, b: 2, net: 14.25 },
        { l: 'Fen', d: 12, y: 6, b: 2, net: 10.5 }
      ],
      wrong: 'TYT Matematik / Polinomlar',
      wrongTopics: [
        { course: 'TYT Matematik', topic: 'Polinomlar', count: 2, reason: 'İşlem hatası' },
        { course: 'TYT Fizik', topic: 'Optik - Kırılma ve Mercekler', count: 3, reason: 'Bilgi eksiği' }
      ],
      note: 'Süre yetiştirmekte biraz zorlandım, Türkçe paragraf sorularına 45 dk harcadım.'
    }
  ],
  mistakes: [
    {
      id: 'm_1',
      date: new Date().toLocaleDateString('tr-TR'),
      course: 'TYT Matematik',
      topic: 'Polinomlar',
      source: '3D Deneme',
      reason: 'İşlem hatası',
      note: 'Katsayılar toplamı sorulurken P(1) yerine P(0) hesapladım. P(x+1) katsayılar toplamı P(1+1)=P(2) olmalı!'
    }
  ],
  weakTopics: [
    {
      id: 'w_1',
      course: 'TYT Fizik',
      topic: 'Optik - Kırılma ve Mercekler',
      level: 'Çok Yüksek',
      count: 3,
      done: false,
      source: 'Deneme Analizi'
    }
  ],
  speedRecords: [
    {
      id: 'sp_1',
      date: new Date().toLocaleDateString('tr-TR'),
      name: '345 Türkçe Branş Deneme 1',
      course: 'TYT Türkçe',
      questions: 40,
      minutes: 38,
      correct: 33,
      wrong: 5,
      perQuestion: 0.95,
      accuracy: 83
    }
  ],
  pastQuestions: {
    'TYT Türkçe|Paragraf': { 2020: 22, 2021: 24, 2022: 26, 2023: 25, 2024: 26, 2025: 25 },
    'TYT Matematik|Sayı Problemleri': { 2020: 5, 2021: 6, 2022: 5, 2023: 6, 2024: 5, 2025: 6 }
  },
  streakLog: {
    [new Date().toISOString().slice(0, 10)]: true
  },
  sleep: [
    {
      id: 'sl_1',
      date: new Date().toISOString().slice(0, 10),
      start: '23:30',
      end: '07:30',
      min: 480,
      quality: 'İyi'
    }
  ],
  water: {
    [new Date().toISOString().slice(0, 10)]: 2500
  },
  waterGoal: 3.5,
  media: [
    {
      id: 'med_1',
      title: 'Dexter',
      kind: 'Dizi',
      status: 'İzleniyor',
      season: 4,
      episode: 8,
      score: 9.2,
      note: 'Çalışma mola vaktinde haftada 1-2 bölüm izliyorum.',
      date: new Date().toLocaleDateString('tr-TR')
    }
  ],
  wallet: {
    tx: [
      {
        id: 'w_tx_1',
        type: 'expense',
        category: 'Kitap',
        amount: 320,
        date: new Date().toISOString().slice(0, 10),
        note: 'PARLA Paragraf ve Dil Bilgisi Kamp Seti'
      },
      {
        id: 'w_tx_2',
        type: 'income',
        category: 'Harçlık',
        amount: 1500,
        date: new Date().toISOString().slice(0, 10),
        note: 'Aylık Öğrenci Destek'
      }
    ],
    budget: 2000
  },
  tasks: [
    { id: 't_1', title: 'Haftalık 1200 Soru Çöz', target: 1200, current: 650 },
    { id: 't_2', title: '30 Saat Kaliteli Odaklanma', target: 30, current: 18 },
    { id: 't_3', title: '2 Adet TYT Türkiye Geneli Deneme', target: 2, current: 1 }
  ],
  cal: {}
};
