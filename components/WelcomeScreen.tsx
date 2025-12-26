
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-center p-8 animate-fade-in relative overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-400/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[100px]"></div>

      <div className="z-10 max-w-2xl space-y-8">
        <div className="relative inline-block">
          <div className="text-9xl mb-4 drop-shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-pulse">🔬</div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-800 dark:text-white tracking-tight">
            Element<span className="text-cyan-500">X</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-300 font-bold text-xl">مختبر الكيمياء الذكي والحي</p>
        </div>

        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          أهلاً بك في بيئة محاكاة الكيمياء التفاعلية. استكشف العناصر، ابنِ الجزيئات، وشاهد التفاعلات تحدث أمام عينيك بدعم من الذكاء الاصطناعي.
        </p>

        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={onStart}
            className="group relative bg-cyan-500 hover:bg-cyan-600 text-white font-black py-5 px-14 rounded-3xl shadow-[0_15px_30px_rgba(6,182,212,0.3)] transition-all transform hover:scale-105 active:scale-95 text-2xl flex items-center gap-4"
          >
            دخول المختبر
            <span className="group-hover:translate-x-[-10px] transition-transform">🧪</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-[11px] text-slate-400 dark:text-slate-500 font-bold opacity-60">
        ElementX Labs v2.6 • بناء بواسطة لانا البلادي
      </div>
    </div>
  );
};
