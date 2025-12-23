
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-[#020617] text-center p-8 animate-fade-in relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>

      <div className="z-10 max-w-2xl space-y-8">
        <div className="relative inline-block">
          <div className="text-8xl mb-4 drop-shadow-[0_0_25px_rgba(6,182,212,0.3)] animate-pulse">🔬</div>
          <div className="absolute -top-2 -right-2 bg-cyan-500 text-white text-[10px] px-2 py-1 rounded-full font-black tracking-tighter">PRO</div>
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Element<span className="text-cyan-500">X</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">مختبر الكيمياء الذكي المدعوم بالذكاء الاصطناعي</p>
        </div>

        <p className="text-md text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          أهلاً بك في الجيل القادم من محاكاة الكيمياء. استكشف العناصر والروابط والتفاعلات المعقدة في بيئة تفاعلية ذكية.
        </p>

        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={onStart}
            className="group relative bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-12 rounded-2xl shadow-[0_20px_40px_rgba(8,145,178,0.3)] transition-all transform hover:scale-105 active:scale-95 text-xl flex items-center gap-3"
          >
            دخول المختبر
            <span className="group-hover:translate-x-[-5px] transition-transform">🧪</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 text-[10px] text-slate-400 dark:text-slate-500 font-bold opacity-40">
        ElementX Labs v2.5 • بناء بواسطة لانا البلادي
      </div>
    </div>
  );
};
