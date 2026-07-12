import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark', // 'dark' | 'light'
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        document.documentElement.classList.toggle('light', next === 'light');
      },
      initTheme: () => {
        const t = get().theme;
        document.documentElement.classList.toggle('light', t === 'light');
      }
    }),
    { name: 'ag-theme' }
  )
);

export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      watchlist: [],
      toggle: (ticker) => {
        const list = get().watchlist;
        const exists = list.includes(ticker.toUpperCase());
        set({ watchlist: exists ? list.filter(t => t !== ticker.toUpperCase()) : [...list, ticker.toUpperCase()] });
      },
      isWatched: (ticker) => get().watchlist.includes(ticker?.toUpperCase()),
    }),
    { name: 'ag-watchlist' }
  )
);
