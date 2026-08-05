import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, NavigationTab, ThemeMode, ThemeShopId } from '../types';
import { INITIAL_APP_STATE } from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  toggleTheme: () => void;
  setThemeShop: (shopId: ThemeShopId) => void;
  saveState: (newState?: AppState) => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'bgy_app_state_v32';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_APP_STATE, ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse state from localStorage', e);
    }
    return INITIAL_APP_STATE;
  });

  const [activeTab, setActiveTabState] = useState<NavigationTab>('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Apply dark/light class to html element
  useEffect(() => {
    if (state.theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [state.theme]);

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  }, [state]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const setActiveTab = (tab: NavigationTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    const newTheme: ThemeMode = state.theme === 'dark' ? 'light' : 'dark';
    setState((prev) => ({ ...prev, theme: newTheme }));
    showToast(`Tema ${newTheme === 'dark' ? 'Karanlık Mod' : 'Aydınlık Mod'} yapıldı.`, 'info');
  };

  const setThemeShop = (shopId: ThemeShopId) => {
    setState((prev) => ({ ...prev, themeShop: shopId }));
    showToast(`Tema mağazası stili uygulandı: ${shopId}`, 'success');
  };

  const saveState = (newState?: AppState) => {
    if (newState) {
      setState(newState);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
    showToast('Tüm verileriniz kaydedildi', 'success');
  };

  const resetData = () => {
    if (window.confirm('Tüm verilerinizi ve kayıtlarınızı sıfırlamak istediğinize emin misiniz?')) {
      setState(INITIAL_APP_STATE);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      showToast('Sistem varsayılan verilere sıfırlandı.', 'warning');
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        activeTab,
        setActiveTab,
        toasts,
        showToast,
        toggleTheme,
        setThemeShop,
        saveState,
        resetData
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 transition-all transform animate-slide-up ${
              toast.type === 'warning'
                ? 'bg-rose-600 text-white'
                : toast.type === 'info'
                ? 'bg-blue-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
