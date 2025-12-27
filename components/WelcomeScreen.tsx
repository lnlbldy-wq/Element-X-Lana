
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0a1120] text-center p-8 animate-fade-in relative overflow-hidden">
      
      <div className="z-10 max-w-3xl space-y-10 flex flex-col items-center">
        {/* Microscope Emoji - Styled to match screenshot */}
        <div className="text-8xl md:text-9xl mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          🔬
        </div>

        {/* Title - Cyan accent */}
        <h1 className="text-6xl md:text-7xl font-black text-[#5ce1ff] tracking-tighter">
          ElementX
        </h1>

        {/* Description Text - Matching the screenshot text precisely */}
        <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium max-w-2xl px-4">
          أطلق العنان للكيميائي بداخلك! استكشف عالم الذرات، شاهد تفاعلات المركبات، غوص في عوالم الكيمياء العضوية والحيوية والكهربائية، اكشف عن طاقة التفاعلات الحرارية، وحلل كيمياء المحاليل. أداة تفاعلية شاملة بين يديك.
        </p>

        {/* Start Button - Cyan theme */}
        <button
          onClick={onStart}
          className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-black py-4 px-16 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 text-xl"
        >
          ابدأ الاستكشاف
        </button>
      </div>

      {/* Footer text - Positioned at the bottom like the screenshot */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-slate-500 font-bold text-sm tracking-wide">
          بناء بواسطة لانا البلادي
        </p>
      </div>
    </div>
  );
};
