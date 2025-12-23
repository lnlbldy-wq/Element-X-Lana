
import React from 'react';
import type { OrganicCompoundInfo } from '../types';

interface OrganicCompoundInfoCardProps {
  info: OrganicCompoundInfo;
  onNew: () => void;
}

const StatRow: React.FC<{ label: string; value?: string | number; color?: string }> = ({ label, value, color = "text-cyan-400" }) => {
    if (value === undefined || value === null || value === '') return null;
    return (
        <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
            <dt className="text-slate-400 font-medium">{label}</dt>
            <dd className={`font-bold text-right ${color}`}>{value}</dd>
        </div>
    );
};

export const OrganicCompoundInfoCard: React.FC<OrganicCompoundInfoCardProps> = ({ info, onNew }) => {
  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 animate-slide-up pb-32">
        <div className="bg-[#1e293b] border border-slate-700 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 text-center bg-gradient-to-b from-slate-800 to-[#1e293b]">
                <h2 className="text-4xl font-bold text-white mb-2">{info.name}</h2>
                <p className="text-2xl font-mono text-cyan-400 font-bold">{info.formula}</p>
            </div>

            <div className="p-8 space-y-10">
                <section>
                    <h3 className="text-cyan-400 font-bold text-xl mb-4 text-center">تركيب لويس (Lewis Structure)</h3>
                    <div className="bg-white rounded-3xl p-6 border border-slate-700/50 flex justify-center shadow-inner min-h-[160px] items-center">
                        {info.lewisStructureImage ? (
                            <img src={info.lewisStructureImage} alt={`Lewis Structure of ${info.name}`} className="max-h-64 object-contain" />
                        ) : (
                             <div className="flex flex-col items-center gap-3 p-4 opacity-30">
                                <span className="text-4xl grayscale">⚗️</span>
                            </div>
                        )}
                    </div>
                </section>

                {info.uses && (
                    <section className="bg-emerald-950/20 p-6 rounded-3xl border border-emerald-900/30">
                        <h3 className="text-emerald-400 font-bold text-xl mb-3 flex items-center justify-center gap-2">
                            <span>🛠️</span> الاستخدامات والتطبيقات
                        </h3>
                        <p className="text-slate-300 text-lg leading-relaxed text-right">
                            {info.uses}
                        </p>
                    </section>
                )}

                <section>
                    <h3 className="text-slate-500 font-bold mb-4 uppercase tracking-widest text-sm border-b border-slate-700 pb-2">الخصائص الفيزيائية والكيميائية</h3>
                    <div className="space-y-1">
                        <StatRow label="العائلة" value={info.family} />
                        <StatRow label="الحالة (STP)" value={info.stateAtSTP} />
                        <StatRow label="تسمية IUPAC" value={info.iupacNaming} color="text-indigo-400" />
                        <StatRow label="نقطة الغليان" value={info.boilingPoint} />
                        <StatRow label="نقطة الانصهار" value={info.meltingPoint} />
                        <StatRow label="الكثافة" value={info.density} />
                        <StatRow label="الذوبانية" value={info.solubility} />
                        <StatRow label="عدد المتشكلات" value={info.isomersCount} color="text-indigo-400" />
                    </div>
                </section>

                <section>
                    <h3 className="text-cyan-400 font-bold text-xl mb-4 text-center">الوصف العلمي</h3>
                    <p className="text-slate-300 text-lg leading-relaxed text-right whitespace-pre-wrap">
                        {info.description}
                    </p>
                </section>
                
                {info.toxicityDetails && (
                    <section className="bg-red-950/20 p-6 rounded-3xl border border-red-900/30">
                        <h3 className="text-red-400 font-bold text-lg mb-2">☣️ السمية والسلامة</h3>
                        <p className="text-slate-300 text-sm leading-relaxed text-right">{info.toxicityDetails}</p>
                    </section>
                )}
            </div>

            <div className="p-8 bg-slate-800/50 border-t border-slate-700">
                <button 
                    onClick={onNew}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 py-5 rounded-[1.5rem] font-bold text-xl transition-all shadow-xl active:scale-95"
                >
                    استكشاف جديد
                </button>
            </div>
        </div>
    </div>
  );
};
