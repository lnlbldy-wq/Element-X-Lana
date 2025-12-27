
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 px-8 shadow-sm flex items-center justify-between z-20 transition-all duration-300">
      <div className="flex items-center gap-6">
        <div className="text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest border-l-2 pl-6 border-cyan-500/30 hidden sm:block order-last sm:order-first">
            لانا البلادي
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-black text-cyan-600 dark:text-cyan-400 tracking-tighter">
            Element<span className="text-slate-800 dark:text-white">X</span>
        </h1>
        <div className="text-3xl animate-pulse">🔬</div>
      </div>
    </header>
  );
};
