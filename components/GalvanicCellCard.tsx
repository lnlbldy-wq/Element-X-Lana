
import React from 'react';
import type { GalvanicCellInfo } from '../types';

export const GalvanicCellCard: React.FC<{ info: GalvanicCellInfo; onNew: () => void }> = ({ info, onNew }) => {
  if (!info || !info.anode || !info.cathode) {
      return (
          <div className="w-full max-w-3xl mx-auto py-10 px-4 text-center">
              <p className="text-slate-500">بيانات الخلية غير مكتملة، يرجى المحاولة مرة أخرى.</p>
              <button onClick={onNew} className="mt-4 bg-cyan-600 text-white px-6 py-2 rounded-xl">محاولة جديدة</button>
          </div>
      );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 animate-slide-up pb-32">
        <div className="bg-[#1e293b] border border-slate-700 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 text-center bg-gradient-to-b from-slate-800 to-[#1e293b]">
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">محاكاة خلية {info.anode.metal || 'M1'}-{info.cathode.metal || 'M2'}</h2>
            </div>

            <div className="p-8 space-y-8">
                <div className="bg-white rounded-2xl p-4 flex justify-center border border-slate-700 shadow-inner overflow-hidden">
                    <img src={info.diagramImage} alt="Diagram" className="max-h-64 object-contain" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-700 text-center shadow-lg">
                        <span className="text-[10px] text-slate-400 block mb-1 uppercase font-black">E°cell القياسي</span>
                        <span dir="ltr" className="text-3xl font-mono font-black text-emerald-400">{info.cellPotential || '0.00V'}</span>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-700 text-center shadow-lg">
                        <span className="text-[10px] text-slate-400 block mb-1 uppercase font-black">طاقة غيبس (ΔG°)</span>
                        <span dir="ltr" className="text-3xl font-mono font-black text-amber-400">{info.gibbsEnergy || '0.00kJ'}</span>
                    </div>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-[2.5rem] border border-slate-700 text-center shadow-md">
                    <span className="text-[9px] text-slate-500 font-black mb-2 block uppercase tracking-widest">الرمز الاصطلاحي للخلية</span>
                    <code dir="ltr" className="text-xl font-mono font-black text-white">{info.cellNotation || '---'}</code>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-950/20 p-6 rounded-[2rem] border border-red-900/30 text-center group transition-all hover:bg-red-950/40">
                        <h4 className="text-red-400 font-black text-xs uppercase mb-3 border-b border-red-900/30 pb-2">المصعد (Anode - Oxidation)</h4>
                        <p className="text-white font-black text-lg mb-2">{info.anode.metal || 'أنود'}</p>
                        <code dir="ltr" className="text-[10px] text-red-200 block bg-black/40 p-2 rounded-xl border border-red-900/20">{info.anode.halfReaction || '---'}</code>
                        <div className="mt-2 text-red-400 text-[10px] font-bold">V {info.anode.standardPotential || '0.00'}</div>
                    </div>
                    <div className="bg-blue-950/20 p-6 rounded-[2rem] border border-blue-900/30 text-center group transition-all hover:bg-blue-950/40">
                        <h4 className="text-blue-400 font-black text-xs uppercase mb-3 border-b border-blue-900/30 pb-2">المهبط (Cathode - Reduction)</h4>
                        <p className="text-white font-black text-lg mb-2">{info.cathode.metal || 'كاثود'}</p>
                        <code dir="ltr" className="text-[10px] text-blue-200 block bg-black/40 p-2 rounded-xl border border-blue-900/20">{info.cathode.halfReaction || '---'}</code>
                        <div className="mt-2 text-blue-400 text-[10px] font-bold">V {info.cathode.standardPotential || '0.00'}</div>
                    </div>
                </div>

                <section className="bg-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
                    <h3 className="text-cyan-400 font-bold text-sm mb-3 uppercase tracking-widest text-center">التفاعل الكلي الصافي</h3>
                    <code dir="ltr" className="text-lg text-white font-mono block text-center p-4 bg-black/20 rounded-2xl border border-cyan-500/10">{info.overallReaction || '---'}</code>
                </section>

                <div className="space-y-4">
                    <section className="bg-emerald-950/20 p-6 rounded-3xl border border-emerald-900/30">
                        <h3 className="text-emerald-400 font-black text-md mb-2">🔋 التطبيقات العملية</h3>
                        <p className="text-slate-300 text-sm leading-relaxed text-right">{info.applications || 'لا توجد تطبيقات مدرجة.'}</p>
                    </section>
                    {info.theoreticalYieldInfo && (
                        <section className="bg-indigo-950/20 p-6 rounded-3xl border border-indigo-900/30">
                            <h3 className="text-indigo-400 font-black text-md mb-2">🔬 تحليل الجدوى والناتج</h3>
                            <p className="text-slate-300 text-[11px] leading-relaxed text-right">{info.theoreticalYieldInfo}</p>
                        </section>
                    )}
                </div>

                <section>
                    <h3 className="text-cyan-400 font-bold text-lg mb-3 text-center">شرح العملية الكهروكيميائية</h3>
                    <p className="text-slate-300 text-sm leading-relaxed text-right whitespace-pre-wrap">{info.explanation || 'جاري التحليل...'}</p>
                </section>
            </div>

            <div className="p-8 bg-slate-800/50 border-t border-slate-700">
                <button onClick={onNew} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl font-black shadow-xl active:scale-95">محاكاة جديدة</button>
            </div>
        </div>
    </div>
  );
};
