
import React from 'react';
import type { BatteryInfo } from '../types';

interface BatteryInfoCardProps {
    info: BatteryInfo;
    onNew: () => void;
}

const InfoRow: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between items-start py-3 border-b border-slate-300 dark:border-slate-700 last:border-b-0">
            <dt className="text-xs text-cyan-600 dark:text-cyan-400 font-black uppercase tracking-widest">{label}</dt>
            <dd className="text-sm text-slate-700 dark:text-slate-200 text-left font-bold">{value}</dd>
        </div>
    );
};

export const BatteryInfoCard: React.FC<BatteryInfoCardProps> = ({ info, onNew }) => {
    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4 animate-slide-up pb-32">
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
                <div className="p-8 text-center bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800">
                    <h2 className="text-3xl font-black text-cyan-600 dark:text-cyan-300 mb-2">{info.name}</h2>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">{info.type}</p>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 text-center shadow-md">
                            <h4 className="text-[9px] text-slate-500 font-black mb-1 uppercase tracking-widest">الجهد الاسمي</h4>
                            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400" dir="ltr">{info.nominalVoltage}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 text-center shadow-md">
                            <h4 className="text-[9px] text-slate-500 font-black mb-1 uppercase tracking-widest">المقاومة الداخلية</h4>
                            <p className="text-xl font-black text-amber-600 dark:text-amber-400" dir="ltr">{info.internalResistance || 'N/A'}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 text-center shadow-md">
                            <h4 className="text-[9px] text-slate-500 font-black mb-1 uppercase tracking-widest">كثافة الطاقة</h4>
                            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400" dir="ltr">{info.energyDensity}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 text-center shadow-md">
                            <h4 className="text-[9px] text-slate-500 font-black mb-1 uppercase tracking-widest">عدد الدورات</h4>
                            <p className="text-xl font-black text-pink-600 dark:text-pink-400" dir="ltr">{info.cycleLife}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-inner flex flex-col items-center">
                        <h3 className="text-[10px] text-slate-500 font-black mb-4 uppercase tracking-widest">مخطط المكونات</h3>
                        <img src={info.diagramImage} alt={info.name} className="max-h-64 object-contain" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-red-500/5 dark:bg-red-900/10 p-5 rounded-[2rem] border border-red-500/20 text-center">
                            <h3 className="text-xs text-red-600 dark:text-red-400 font-black mb-3 uppercase">تفاعل المصعد (Anode)</h3>
                            <code dir="ltr" className="text-[10px] font-mono font-bold text-slate-800 dark:text-red-100">{info.anodeReaction || '---'}</code>
                            <p className="mt-2 text-[9px] text-slate-500 font-bold italic">{info.anodeMaterial}</p>
                        </div>
                        <div className="bg-blue-500/5 dark:bg-blue-900/10 p-5 rounded-[2rem] border border-blue-500/20 text-center">
                            <h3 className="text-xs text-blue-600 dark:text-blue-400 font-black mb-3 uppercase">تفاعل المهبط (Cathode)</h3>
                            <code dir="ltr" className="text-[10px] font-mono font-bold text-slate-800 dark:text-blue-100">{info.cathodeReaction || '---'}</code>
                            <p className="mt-2 text-[9px] text-slate-500 font-bold italic">{info.cathodeMaterial}</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-700">
                        <dl className="space-y-0">
                            <InfoRow label="الإلكتروليت" value={info.electrolyte} />
                            <InfoRow label="خصائص الشحن" value={info.chargingCharacteristics} />
                            <InfoRow label="معدل التفريغ الذاتي" value={info.selfDischargeRate} />
                            <InfoRow label="التطبيقات الأساسية" value={info.applications} />
                        </dl>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <section className="bg-orange-500/5 p-6 rounded-3xl border border-orange-500/20">
                            <h3 className="text-orange-600 dark:text-orange-400 font-black text-xs mb-3 uppercase">🚨 مخاطر السلامة</h3>
                            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed text-right">{info.safetyRisks}</p>
                        </section>
                        <section className="bg-green-500/5 p-6 rounded-3xl border border-green-500/20">
                            <h3 className="text-green-600 dark:text-green-400 font-black text-xs mb-3 uppercase">♻️ البيئة والتدوير</h3>
                            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed text-right">{info.environmentalRecycling}</p>
                        </section>
                    </div>
                </div>

                <div className="p-8 bg-slate-200/50 dark:bg-slate-800/50 border-t border-slate-300 dark:border-slate-700">
                    <button onClick={onNew} className="w-full bg-lime-600 hover:bg-lime-500 text-white py-4 rounded-2xl font-black shadow-xl transition-all">تحليل جديد</button>
                </div>
            </div>
        </div>
    );
};
