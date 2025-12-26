
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  return (
    <header className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 p-4 shadow-md flex items-center justify-between z-20 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="text-3xl animate-pulse">🔬</div>
        <div className="flex flex-col">
            <h1 className="text-xl font-black text-cyan-600 dark:text-cyan-400 tracking-tight leading-none">
                Element<span className="text-slate-800 dark:text-white">X</span>
            </h1>
            <span className="text-[8px] font-black uppercase tracking-widest mt-1 text-cyan-500/70">
                Cloud Intelligence Laboratory
            </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-500 dark:text-slate-400 hidden lg:block font-bold">
          بناء بواسطة لانا البلادي
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
};
