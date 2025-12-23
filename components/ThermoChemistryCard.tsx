
import React from 'react';
import type { ThermoChemistryInfo } from '../types';

const MetricBox: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-700 text-center">
        <span className="text-xs text-slate-400 block mb-1">{label}</span>
        <span dir="ltr" className={`text-2xl font-mono font-bold ${color}`}>{value}</span>
    </div>
);

export const ThermoChemistryCard: React.FC<{ info: ThermoChemistryInfo; onNew: () => void }> = ({ info, onNew }) => {
  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 animate-slide-up pb-32">
        <div className="bg-[#1e293b] border border-slate-700 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 text-center bg-gradient-to-b from-slate-800 to-[#1e293b]">
                <div className="text-5xl mb-4">🔥</div>
                <h2 className="text-3xl font-bold text-white mb-2">الكيمياء الحرارية</h2>
                <code dir="ltr" className="text-xl text-cyan-400 font-mono">{info.equation}</code>
            </div>

            <div className="p-8 space-y-10">
                {/* Applications Section */}
                {info.applications && (
                    <section className="bg-orange-950/20 p-6 rounded-3xl border border-orange-900/30">
                        <h3 className="text-orange-400 font-bold text-xl mb-3 flex items-center justify-center gap-2">
                            <span>🏭</span> التطبيقات العملية والحرارية
                        </h3>
                        <p className="text-slate-300 text-lg leading-relaxed text-right">
                            {info.applications}
                        </p>
                    </section>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-2xl text-center border font-bold ${info.isExothermic ? 'bg-red-950/20 border-red-900/30 text-red-400' : 'bg-blue-950/20 border-blue-900/30 text-blue-400'}`}>
                        {info.isExothermic ? 'طارد للحرارة' : 'ماص للحرارة'}
                    </div>
                    <div className={`p-4 rounded-2xl text-center border font-bold ${info.isSpontaneous ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' : 'bg-amber-950/20 border-amber-900/30 text-amber-400'}`}>
                        {info.isSpontaneous ? 'تلقائي' : 'غير تلقائي'}
                        <span className="block text-[10px] opacity-70">(عند الظروف القياسية)</span>
                    </div>
                </div>

                <section>
                    <h3 className="text-slate-500 font-bold mb-6 uppercase tracking-widest text-sm text-center">الدوال الديناميكية الحرارية</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <MetricBox label="ΔH° (الإنثالبي)" value={info.enthalpyChange} color="text-red-400" />
                        <MetricBox label="ΔS° (الإنتروبي)" value={info.entropyChange} color="text-blue-400" />
                        <MetricBox label="ΔG° (طاقة غيبس)" value={info.gibbsFreeEnergyChange} color="text-cyan-400" />
                    </div>
                </section>

                <section>
                    <h3 className="text-slate-500 font-bold mb-6 uppercase tracking-widest text-sm text-center">الحركية والاتزان</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-700 text-center flex flex-col items-center justify-center">
                            <span className="text-xs text-slate-400 block mb-2">ثابت الاتزان (Keq)</span>
                            <span dir="ltr" className="text-xl font-mono font-bold text-indigo-400">{info.keq}</span>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-700 text-center">
                            <span className="text-xs text-slate-400 block mb-2">طاقة التنشيط (Ea)</span>
                            <p className="text-xs text-cyan-300 leading-relaxed font-bold">{info.activationEnergy}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-white font-bold text-xl mb-4 flex items-center justify-center gap-2">
                        <span>⚡️</span> عوامل سرعة التفاعل
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {info.speedFactors?.map((factor, i) => (
                            <div key={i} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-right text-xs text-slate-300">
                                {factor}
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-cyan-400 font-bold text-xl mb-4 text-center">شرح التحليل</h3>
                    <p className="text-slate-300 text-lg leading-relaxed text-right whitespace-pre-wrap">
                        {info.explanation}
                    </p>
                </section>
            </div>

            <div className="p-8 bg-slate-800/50 border-t border-slate-700">
                <button 
                    onClick={onNew}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-[1.5rem] font-bold text-xl transition-all shadow-xl active:scale-95"
                >
                    تحليل جديد
                </button>
            </div>
        </div>
    </div>
  );
};
