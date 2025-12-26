
import React from 'react';
import type { ThermoChemistryInfo } from '../types';

const MetricBox: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-700 text-center shadow-md">
        <span className="text-[9px] text-slate-400 block mb-1 font-black uppercase tracking-widest">{label}</span>
        <span dir="ltr" className={`text-xl font-mono font-black ${color}`}>{value || '---'}</span>
    </div>
);

export const ThermoChemistryCard: React.FC<{ info: ThermoChemistryInfo; onNew: () => void }> = ({ info, onNew }) => {
  if (!info) return null;

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 animate-slide-up pb-32">
        <div className="bg-[#1e293b] border border-slate-700 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 text-center bg-gradient-to-b from-slate-800 to-[#1e293b]">
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest border-b border-slate-700 pb-2">التحليل الثيرموديناميكي</h2>
                <code dir="ltr" className="text-2xl text-cyan-400 font-mono font-black py-4 block">{info.equation || '---'}</code>
            </div>

            <div className="p-8 space-y-10">
                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-2xl text-center border-2 font-black text-xs ${info.isExothermic ? 'bg-red-950/20 border-red-900/30 text-red-400' : 'bg-blue-950/20 border-blue-900/30 text-blue-400'}`}>
                        {info.isExothermic ? '🔥 تفاعل طارد للحرارة' : '❄️ تفاعل ماص للحرارة'}
                    </div>
                    <div className={`p-4 rounded-2xl text-center border-2 font-black text-xs ${info.isSpontaneous ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' : 'bg-amber-950/20 border-amber-900/30 text-amber-400'}`}>
                        {info.isSpontaneous ? '✅ تلقائي الحدوث' : '❌ غير تلقائي'}
                    </div>
                </div>

                <section>
                    <h3 className="text-slate-500 font-black mb-6 uppercase tracking-[0.2em] text-[10px] text-center border-b border-slate-700 pb-2">الدوال الثيرموديناميكية القياسية</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <MetricBox label="ΔH° الإنثالبي" value={info.enthalpyChange} color="text-red-400" />
                        <MetricBox label="ΔS° الإنتروبي" value={info.entropyChange || '---'} color="text-blue-400" />
                        <MetricBox label="ΔG° طاقة غيبس" value={info.gibbsFreeEnergyChange || '---'} color="text-cyan-400" />
                    </div>
                </section>

                <section>
                    <h3 className="text-slate-500 font-black mb-6 uppercase tracking-[0.2em] text-[10px] text-center border-b border-slate-700 pb-2">القيم الحركية والاتزان</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-700 text-center flex flex-col items-center justify-center">
                            <span className="text-[10px] text-slate-400 block mb-2 uppercase font-black">ثابت الاتزان (Keq)</span>
                            <span dir="ltr" className="text-xl font-mono font-black text-indigo-400">{info.keq || '---'}</span>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-700 text-center">
                            <span className="text-[10px] text-slate-400 block mb-2 uppercase font-black">طاقة التنشيط (Ea)</span>
                            <span dir="ltr" className="text-sm font-mono font-black text-orange-400">{info.activationEnergy || '---'}</span>
                        </div>
                    </div>
                </section>

                {Array.isArray(info.speedFactors) && info.speedFactors.length > 0 && (
                    <section>
                        <h3 className="text-white font-black text-lg mb-4 flex items-center justify-center gap-2"><span>⚡️</span> عوامل سرعة التفاعل</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {info.speedFactors.map((factor, i) => (
                                <div key={i} className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 font-bold">{factor}</div>
                            ))}
                        </div>
                    </section>
                )}

                {info.heatCapacityInfo && (
                    <section className="bg-indigo-950/20 p-6 rounded-3xl border border-indigo-900/30">
                        <h3 className="text-indigo-400 font-black text-sm mb-2 uppercase">📊 تحليل السعة الحرارية</h3>
                        <p className="text-slate-300 text-[11px] leading-relaxed text-right">{info.heatCapacityInfo}</p>
                    </section>
                )}

                <section className="bg-orange-950/20 p-6 rounded-3xl border border-orange-900/30">
                    <h3 className="text-orange-400 font-black text-sm mb-2 uppercase">🏭 تطبيقات حياتية</h3>
                    <p className="text-slate-300 text-[11px] leading-relaxed text-right">{info.applications || '---'}</p>
                </section>

                <section>
                    <h3 className="text-cyan-400 font-bold text-lg mb-3 text-center">التفسير العلمي المعمق</h3>
                    <p className="text-slate-300 text-sm leading-relaxed text-right whitespace-pre-wrap">{info.explanation || '---'}</p>
                </section>
            </div>

            <div className="p-8 bg-slate-800/50 border-t border-slate-700">
                <button onClick={onNew} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-xl active:scale-95">تحليل جديد</button>
            </div>
        </div>
    </div>
  );
};
