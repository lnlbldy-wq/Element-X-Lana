
import React from 'react';
import type { BiomoleculeInfo } from '../types';

interface BiomoleculeInfoCardProps {
  info: BiomoleculeInfo;
  onNew: () => void;
}

const DetailRow: React.FC<{ label: string; value?: string; color?: string }> = ({ label, value, color = "text-cyan-400" }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
            <dt className="text-slate-400 font-medium text-sm">{label}</dt>
            <dd className={`font-bold text-right text-sm ${color}`}>{value}</dd>
        </div>
    );
};

export const BiomoleculeInfoCard: React.FC<BiomoleculeInfoCardProps> = ({ info, onNew }) => {
  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 animate-slide-up pb-32">
        <div className="bg-[#1e293b] border border-slate-700 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-10 text-center bg-gradient-to-b from-slate-800 to-[#1e293b]">
                <div className="text-6xl mb-4">🧬</div>
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">{info.name}</h2>
                <p className="text-2xl font-mono text-cyan-400 font-bold opacity-80">{info.formula}</p>
            </div>

            <div className="p-8 space-y-10">
                <section className="bg-slate-900/40 rounded-3xl p-6 border border-slate-700/50">
                    <h3 className="text-cyan-400 font-bold text-xl mb-4 text-center">التركيب والوظيفة</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-6 flex justify-center border border-slate-700">
                        <img src={info.structureImage} alt={info.name} className="max-h-64 object-contain" />
                    </div>
                    <div className="space-y-1">
                        <DetailRow label="النوع" value={info.type} color="text-pink-400" />
                        <DetailRow label="الوزن الجزيئي" value={info.molecularWeight} />
                        <DetailRow label="التواجد في الطبيعة" value={info.prevalenceInNature} />
                    </div>
                </section>

                {/* Uses Section */}
                {info.uses && (
                    <section className="bg-cyan-950/20 p-6 rounded-3xl border border-cyan-900/30">
                        <h3 className="text-cyan-400 font-bold text-xl mb-3 flex items-center justify-center gap-2">
                            <span>💊</span> الاستخدامات والتطبيقات الطبية
                        </h3>
                        <p className="text-slate-300 text-lg leading-relaxed text-right">
                            {info.uses}
                        </p>
                    </section>
                )}

                <section>
                    <h3 className="text-cyan-400 font-bold text-xl mb-4 text-center">الوظيفة الحيوية</h3>
                    <p className="text-slate-300 text-lg leading-relaxed text-right whitespace-pre-wrap">
                        {info.biologicalFunction}
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-indigo-950/20 rounded-3xl p-6 border border-indigo-900/30">
                        <h3 className="text-indigo-400 font-bold text-lg mb-3">🧬 الدور الأيضي</h3>
                        <p className="text-slate-300 text-sm leading-relaxed text-right">
                            {info.metabolicRole}
                        </p>
                    </section>

                    <section className="bg-emerald-950/20 rounded-3xl p-6 border border-emerald-900/30">
                        <h3 className="text-emerald-400 font-bold text-lg mb-3">🥗 التغذية والمصادر</h3>
                        <p className="text-slate-300 text-sm leading-relaxed text-right">
                            {info.dietarySources}
                        </p>
                    </section>
                </div>

                <section className="bg-red-950/20 rounded-3xl p-6 border border-red-900/30">
                    <h3 className="text-red-400 font-bold text-lg mb-3 text-center">التأثيرات السريرية (نقص/زيادة)</h3>
                    <p className="text-red-100 text-sm leading-relaxed text-right whitespace-pre-wrap">
                        {info.clinicalImplications}
                    </p>
                </section>

                <section className="bg-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
                    <h3 className="text-slate-400 font-bold text-lg mb-3 text-center">الوصف</h3>
                    <p className="text-slate-300 text-sm leading-relaxed text-right">
                        {info.description}
                    </p>
                </section>
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
