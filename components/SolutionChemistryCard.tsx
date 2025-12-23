
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
                <div className="text-5xl mb-4">💧</div>
                <h2 className="text-3xl font-bold text-white mb-2">خصائص المحلول الأساسية</h2>
            </div>

            <div className="p-8 space-y-10">
                {/* Uses Section */}
                {info.applications && (
                    <section className="bg-indigo-950/20 p-6 rounded-3xl border border-indigo-900/30">
                        <h3 className="text-indigo-400 font-bold text-xl mb-3 flex items-center justify-center gap-2">
                            <span>🧪</span> الاستخدامات والتطبيقات العملية
                        </h3>
                        <p className="text-slate-300 text-lg leading-relaxed text-right">
                            {info.applications}
                        </p>
                    </section>
                )}

                <section>
                    <div className="space-y-1">
                        <PropertyLine label="المذاب" value={`${info.soluteName} (${info.soluteFormula})`} />
                        <PropertyLine label="المذيب" value={info.solventName} />
                        <PropertyLine label="التركيز المولاري" value={info.concentrationMolarity} />
                        <PropertyLine label="نوع المحلول" value={info.solutionType} color="text-indigo-400" />
                        <PropertyLine label="الرقم الهيدروجيني (pH)" value={info.phLevel} color="text-emerald-400" />
                        <PropertyLine label="التوصيل الكهربائي" value={info.conductivity} />
                    </div>
                </section>

                <section className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-slate-700/50">
                    <h3 className="text-cyan-400 font-bold text-xl mb-6 text-center">الخواص الجامعة (Colligative Properties)</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-start gap-4">
                            <dt className="text-cyan-500 font-bold whitespace-nowrap">الارتفاع في درجة الغليان</dt>
                            <dd className="text-xs text-slate-300 text-right">{info.boilingPointElevation}</dd>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                            <dt className="text-cyan-500 font-bold whitespace-nowrap">الانخفاض في درجة التجمد</dt>
                            <dd className="text-xs text-slate-300 text-right">{info.freezingPointDepression}</dd>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-cyan-400 font-bold text-xl mb-4 text-center">شرح عملية الذوبان</h3>
                    <p className="text-slate-300 text-lg leading-relaxed text-right whitespace-pre-wrap">
                        {info.solutionDescription}
                    </p>
                </section>
            </div>

            <div className="p-8 bg-slate-800/50 border-t border-slate-700">
                <button 
                    onClick={onNew}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-[1.5rem] font-bold text-xl transition-all shadow-xl active:scale-95"
                >
                    تحليل المحلول
                </button>
            </div>
        </div>
    </div>
  );
};
