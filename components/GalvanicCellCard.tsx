
import React from 'react';
import type { GalvanicCellInfo } from '../types';

export const GalvanicCellCard: React.FC<{ info: GalvanicCellInfo; onNew: () => void }> = ({ info, onNew }) => {
  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 animate-slide-up pb-32">
        <div className="bg-[#1e293b] border border-slate-700 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 text-center bg-gradient-to-b from-slate-800 to-[#1e293b]">
                <div className="text-5xl mb-4">⚡️</div>
                <h2 className="text-3xl font-bold text-white mb-2">خلية {info.anode.metal}-{info.cathode.metal} الجلفانية</h2>
            </div>

            <div className="p-8 space-y-8">
                <div className="bg-white rounded-2xl p-4 flex justify-center border border-slate-700 shadow-inner">
                    <img src={info.diagramImage} alt="Cell Diagram" className="max-h-64 object-contain" />
                </div>

                {/* Applications Section */}
                {info.applications && (
                    <section className="bg-emerald-950/20 p-6 rounded-3xl border border-emerald-900/30">
                        <h3 className="text-emerald-400 font-bold text-xl mb-3 flex items-center justify-center gap-2">
                            <span>🔋</span> التطبيقات العملية والصناعية
                        </h3>
                        <p className="text-slate-300 text-lg leading-relaxed text-right">
                            {info.applications}
                        </p>
                    </section>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-700 text-center">
                        <span className="text-xs text-slate-400 block mb-1">جهد الخلية القياسي (E°cell)</span>
                        <span dir="ltr" className="text-3xl font-mono font-bold text-emerald-400">{info.cellPotential}</span>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-700 text-center">
                        <span className="text-xs text-slate-400 block mb-1">طاقة غيبس الحرة (ΔG°)</span>
                        <span dir="ltr" className="text-3xl font-mono font-bold text-amber-400">{info.gibbsEnergy}</span>
                    </div>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-[2rem] border border-slate-700 text-center">
                    <span className="text-xs text-slate-500 font-bold mb-2 block">الرمز الاصطلاحي للخلية</span>
                    <code dir="ltr" className="text-xl md:text-2xl font-mono font-bold text-white tracking-widest">
                        {info.cellNotation}
                    </code>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-950/20 p-6 rounded-[2rem] border border-red-900/30 text-center">
                        <h4 className="text-red-400 font-bold mb-3">المصعد (أكسدة)</h4>
                        <p className="text-white font-bold text-lg mb-2">{info.anode.metal}</p>
                        <code dir="ltr" className="text-xs text-red-200 block bg-black/30 p-2 rounded-xl mb-2">{info.anode.halfReaction}</code>
                    </div>
                    <div className="bg-blue-950/20 p-6 rounded-[2rem] border border-blue-900/30 text-center">
                        <h4 className="text-blue-400 font-bold mb-3">المهبط (اختزال)</h4>
                        <p className="text-white font-bold text-lg mb-2">{info.cathode.metal}</p>
                        <code dir="ltr" className="text-xs text-blue-200 block bg-black/30 p-2 rounded-xl mb-2">{info.cathode.halfReaction}</code>
                    </div>
                </div>

                <section className="bg-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
                    <h3 className="text-cyan-400 font-bold text-xl mb-4 text-center">التفاعل الكلي</h3>
                    <code dir="ltr" className="text-lg md:text-xl text-white font-mono block text-center p-4 bg-black/20 rounded-2xl">
                        {info.overallReaction}
                    </code>
                </section>

                <section>
                    <h3 className="text-cyan-400 font-bold text-xl mb-4 text-center">شرح عمل الخلية</h3>
                    <p className="text-slate-300 text-lg leading-relaxed text-right whitespace-pre-wrap">
                        {info.explanation}
                    </p>
                </section>
            </div>

            <div className="p-8 bg-slate-800/50 border-t border-slate-700">
                <button 
                    onClick={onNew}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-5 rounded-[1.5rem] font-bold text-xl transition-all shadow-xl active:scale-95"
                >
                    محاكاة جديدة
                </button>
            </div>
        </div>
    </div>
  );
};
