
import React from 'react';
import type { SolutionChemistryInfo } from '../types';

const PropertyLine: React.FC<{ label: string; value?: string; color?: string }> = ({ label, value, color = "text-cyan-400" }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
            <dt className="text-slate-400 font-medium text-sm">{label}</dt>
            <dd className={`font-bold text-right text-sm ${color}`}>{value}</dd>
        </div>
    );
};

export const SolutionChemistryCard: React.FC<{ info: SolutionChemistryInfo; onNew: () => void }> = ({ info, onNew }) => {
  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 animate-slide-up pb-32">
        <div className="bg-[#1e293b] border border-slate-700 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 text-center bg-gradient-to-b from-slate-800 to-[#1e293b]">
                <h2 className="text-3xl font-black text-white mb-2">تحليل المحلول الكيميائي</h2>
            </div>

            <div className="p-8 space-y-10">
                <section>
                    <div className="space-y-1">
                        <PropertyLine label="المادة المذابة (Solute)" value={`${info.soluteName} (${info.soluteFormula})`} />
                        <PropertyLine label="المادة المذيبة (Solvent)" value={info.solventName} />
                        <PropertyLine label="التركيز المولاري (M)" value={info.concentrationMolarity} color="text-white" />
                        <PropertyLine label="نوع المحلول" value={info.solutionType} color="text-indigo-400" />
                        <PropertyLine label="الرقم الهيدروجيني (pH)" value={info.phLevel} color="text-emerald-400" />
                        <PropertyLine label="التوصيلية الكهربائية" value={info.conductivity} />
                        <PropertyLine label="الضغط الأسموزي" value={info.osmoticPressure} color="text-pink-400" />
                    </div>
                </section>

                <section className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-slate-700/50 shadow-inner">
                    <h3 className="text-cyan-400 font-black text-[10px] uppercase mb-6 text-center tracking-widest border-b border-slate-700 pb-2">الخواص الجامعة للمحاليل</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-start gap-4">
                            <dt className="text-cyan-500 font-bold text-xs uppercase">ΔTb (ارتفاع الغليان)</dt>
                            <dd className="text-[11px] text-slate-300 text-right leading-relaxed">{info.boilingPointElevation}</dd>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                            <dt className="text-cyan-500 font-bold text-xs uppercase">ΔTf (انخفاض التجمد)</dt>
                            <dd className="text-[11px] text-slate-300 text-right leading-relaxed">{info.freezingPointDepression}</dd>
                        </div>
                    </div>
                </section>

                <section className="bg-indigo-950/20 p-6 rounded-3xl border border-indigo-900/30">
                    <h3 className="text-indigo-400 font-black text-sm mb-3">🧪 التطبيقات والاستخدامات</h3>
                    <p className="text-slate-300 text-[11px] leading-relaxed text-right">{info.applications}</p>
                </section>

                <section>
                    <h3 className="text-cyan-400 font-bold text-lg mb-4 text-center">ميكانيكية الذوبان والتفسير</h3>
                    <p className="text-slate-300 text-sm leading-relaxed text-right whitespace-pre-wrap">{info.solutionDescription}</p>
                </section>
            </div>

            <div className="p-8 bg-slate-800/50 border-t border-slate-700">
                <button onClick={onNew} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black shadow-xl active:scale-95">تحليل جديد</button>
            </div>
        </div>
    </div>
  );
};
