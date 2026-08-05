export type ThemeMode = 'dark' | 'light';

export type ThemeShopId = 
  | 'default' 
  | 'light' 
  | 'turquoise'
  | 'amoled' 
  | 'galaxy' 
  | 'ocean' 
  | 'forest' 
  | 'sunset' 
  | 'ice' 
  | 'sakura' 
  | 'neon' 
  | 'coffee' 
  | 'gs' 
  | 'ads';

export type TopicStatus = 0 | 1 | 2 | 3; // 0: Not Started, 1: Working, 2: Review, 3: Completed

export interface DailyPlanItem {
  id: string;
  course: string;
  topic: string;
  min: number;
  q: number;
  done: boolean;
  date: string;
}

export interface WeeklyScheduleItem {
  id: string;
  day: string;
  start: string;
  end: string;
  time: string;
  duration: string;
  course: string;
  topic: string;
}

export interface BookTopicItem {
  id: string;
  title: string;
  totalTests: number;
  completedTests: number;
  totalQuestions: number;
  solvedQuestions: number;
}

export interface BookItem {
  id: string;
  name: string;
  course: string;
  topic: string;
  total: number;
  solved: number;
  category: 'Video Ders Kitabı' | 'Soru Bankası' | 'Deneme' | 'Paragraf' | string;
  field: 'TYT' | 'AYT' | string;
  color: string;
  cover?: string | null;
  fileName?: string;
  lastOpen?: string | null;
  units?: BookTopicItem[];
}

export interface CampItem {
  id: string;
  day: string;
  topic: string;
  raw: string;
  done: boolean;
  stage?: string;
  testCount?: number | string;
  videoCount?: number | string;
  questionCount?: number | string;
  duration?: string;
}

export interface CampPreset {
  id: string;
  key: string;
  name: string;
  course: string;
  youtube?: string;
  fileName?: string;
  items: CampItem[];
}

export interface CampScheduleItem {
  id: string;
  day: string;
  start?: string;
  end?: string;
  duration?: string;
  campId: string;
  campName: string;
  course: string;
  topic: string;
  itemIndex: number;
  date?: string;
}

export interface ExamLessonDetail {
  l: string;
  d: number;
  y: number;
  b: number;
  net: number;
}

export interface WrongTopicItem {
  course: string;
  topic: string;
  count: number;
  reason: string;
}

export interface ExamRecord {
  id: string;
  date: string;
  type: 'TYT' | 'AYT' | 'Branş';
  name: string;
  net: number;
  det: ExamLessonDetail[];
  wrong?: string;
  wrongTopics?: WrongTopicItem[];
  note?: string;
}

export interface MistakeRecord {
  id: string;
  date: string;
  course: string;
  topic: string;
  source: string;
  reason: string;
  note: string;
}

export interface WeakTopicItem {
  id: string;
  course: string;
  topic: string;
  level: 'Orta' | 'Yüksek' | 'Çok Yüksek';
  count: number;
  done: boolean;
  source: string;
}

export interface SpeedRecord {
  id: string;
  date: string;
  name: string;
  course: string;
  questions: number;
  minutes: number;
  correct: number;
  wrong: number;
  perQuestion: number;
  accuracy: number;
}

export interface MediaItem {
  id: string;
  title: string;
  kind: 'Film' | 'Dizi' | 'Anime' | 'Belgesel';
  status: 'İzlenecek' | 'İzleniyor' | 'Bitti' | 'Bırakıldı';
  season: number;
  episode: number;
  score: number;
  note: string;
  date: string;
}

export interface WalletTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  note: string;
}

export interface SleepRecord {
  id: string;
  date: string;
  start: string;
  end: string;
  min: number;
  quality: 'İyi' | 'Orta' | 'Kötü';
}

export interface NotebookPage {
  id: string;
  title: string;
  content: string;
  pattern: 'lined' | 'grid' | 'blank';
  date: string;
}

export interface AppState {
  theme: ThemeMode;
  themeShop: ThemeShopId;
  apiKey: string;
  yksDate: string;
  goal: {
    uni: string;
    dept: string;
    tyt: number;
    ayt: number;
  } | null;
  daily: DailyPlanItem[];
  weekly: WeeklyScheduleItem[];
  topics: Record<string, TopicStatus>; // "Course|Topic": status
  books: BookItem[];
  pomo: {
    sessions: number;
    minutes: number;
  };
  camps: CampPreset[];
  activeCampId: string | null;
  campWeekly: CampScheduleItem[];
  campMonthly: CampScheduleItem[];
  lessonNotes: Record<string, string>; // "Course": HTML or text note
  notebooks?: Record<string, NotebookPage[]>; // "Course|Topic": Notebook Pages
  exams: ExamRecord[];
  mistakes: MistakeRecord[];
  weakTopics: WeakTopicItem[];
  speedRecords: SpeedRecord[];
  pastQuestions: Record<string, Record<number, number>>; // "Course|Topic": { year: count }
  streakLog: Record<string, boolean>; // "YYYY-MM-DD": true
  sleep: SleepRecord[];
  water: Record<string, number>; // "YYYY-MM-DD": ml
  waterGoal: number; // Liters e.g. 4.0
  media: MediaItem[];
  wallet: {
    tx: WalletTransaction[];
    budget: number;
  };
  tasks: Array<{ id: string; title: string; target: number; current: number }>;
  cal: Record<string, Array<{ note: string; type: string }>>;
}

export type NavigationTab = 
  | 'dashboard'
  | 'topics'
  | 'books'
  | 'camps'
  | 'campWeekly'
  | 'campMonthly'
  | 'lessonNotes'
  | 'weakCenter'
  | 'pomo'
  | 'music'
  | 'exams'
  | 'charts'
  | 'mistakes'
  | 'pastQuestions'
  | 'speedAnalysis'
  | 'campProgressCenter'
  | 'repeats'
  | 'media'
  | 'health'
  | 'settings';
