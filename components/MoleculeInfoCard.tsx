
import React, { useState } from 'react';
import type { Reaction } from '../types';

interface MoleculeInfoCardProps {
  reaction: Reaction;
  onNewReaction: () => void;
}

type TabType = 'general' | 'academic' | 'advanced' | 'history' | 'safety';

const GHS_MAP: Record<string, { emoji: string; label: string }> = {
  'Flammable': { emoji: '🔥', label: 'قابل للاشتعال' },
  'Toxic': { emoji: '💀', label: 'سام' },
  'Corrosive': { emoji: '🧪', label: 'آكل' },
  'Oxidizer': { emoji: '⭕', label: 'مؤكسد' },
  'Explosive': { emoji: '💥', label: 'متفجر' },
  'Irritant': { emoji: '⚠️', label: 'مهيج' },
};

const PropertyRow: React.FC<{ label: string; value?: string; color?: string }> = ({ label, value, color = "text-cyan-400" }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between items-center py-3 border-b border-slate-700/30">
            <dt className="text-slate-400 font-medium text-sm">{label}</dt>
            <dd className={`font-bold text-right text-sm ${color}`}>{value}</dd>
        </div>
    );
};

export const MoleculeInfoCard: React.FC<MoleculeInfoCardProps> = ({ reaction, onNewReaction }) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'general', label: 'الخصائص العامة', icon: '⚗️' },
    { id: 'academic', label: 'تحليل أكاديمي', icon: '📖' },
    { id: 'advanced', label: 'بيانات متقدمة', icon: '🔬' },
    { id: 'history', label: 'التاريخ', icon: '📜' },
    { id: 'safety', label: 'السلامة', icon: '⚠️' },
  ];

  return (
    <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center z-50 animate-fade-in p-2 md:p-6 overflow-hidden">
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-xl h-full md:max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 text-center bg-gradient-to-b from-slate-800/50 to-transparent flex-shrink-0">
             <div className="text-5xl mb-3 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">{reaction.emoji}</div>
             <h2 className="text-2xl font-bold text-white mb-1">{reaction.name}</h2>
             <p className="text-lg font-mono text-cyan-400 font-bold opacity-80">{reaction.formula}</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex px-4 py-2 bg-slate-800/30 border-y border-slate-700/50 flex-shrink-0 overflow-x-auto scrollbar-hide">
            <div className="flex w-full min-w-max justify-around">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <span className="text-md">{tab.icon}</span>
                        <span className="text-[9px] font-bold">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto scrollbar-hide px-6 py-5 space-y-6 animate-fade-in">
            
            {activeTab === 'general' && (
                <div className="space-y-6">
                    <section>
                        <h3 className="text-cyan-400 font-bold text-[10px] uppercase mb-3 text-center tracking-widest">التمثيل الجزيئي</h3>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-700/50 flex justify-center shadow-inner min-h-[160px] items-center text-center">
                            {reaction.lewisStructure ? (
                                <img src={reaction.lewisStructure} alt="Lewis" className="max-h-40 object-contain" />
                            ) : (
                                <div className="flex flex-col items-center gap-3 p-4 opacity-30">
                                    <span className="text-4xl grayscale">⚗️</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {reaction.balancedFormationEquation && (
                        <section className="bg-slate-900/50 p-5 rounded-3xl border border-emerald-500/30 shadow-lg">
                            <h3 className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
                                <span>⚖️</span> معادلة التكوين الموزونة
                            </h3>
                            <code dir="ltr" className="text-lg font-mono text-white block text-center p-3 bg-black/30 rounded-xl border border-emerald-500/10">
                                {reaction.balancedFormationEquation}
                            </code>
                        </section>
                    )}

                    <section className="space-y-0 bg-slate-800/20 p-4 rounded-3xl border border-slate-700/20">
                        <PropertyRow label="الكتلة المولية" value={reaction.molarMass} />
                        <PropertyRow label="الحالة في STP" value={reaction.state} />
                        <PropertyRow label="الهندسة الجزيئية" value={reaction.molecularGeometry} />
                        <PropertyRow label="نوع الرابطة" value={reaction.bondType} />
                        <PropertyRow label="فرق السالبية" value={reaction.electronegativityDifference} color="text-yellow-400" />
                    </section>
                </div>
            )}

            {activeTab === 'academic' && (
                <div className="space-y-6 animate-slide-up">
                    {reaction.formationBalancingSteps ? (
                        <div className="bg-emerald-950/20 p-6 rounded-[2rem] border border-emerald-900/30 relative overflow-hidden group shadow-lg">
                            <h3 className="text-emerald-400 font-bold text-lg mb-4 text-right border-r-4 border-emerald-500 pr-3">خطوات وزن المعادلة بالتفصيل</h3>
                            <div className="text-slate-100 text-sm leading-relaxed text-right whitespace-pre-wrap font-medium">
                                {reaction.formationBalancingSteps}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-800/20 rounded-2xl border border-slate-700/20 text-center italic text-slate-500 text-xs">جاري تحليل خطوات الوزن...</div>
                    )}

                    <div className="bg-cyan-950/20 p-6 rounded-[2rem] border border-cyan-900/30 shadow-lg">
                        <h3 className="text-cyan-400 font-bold text-lg mb-4 text-right border-r-4 border-cyan-500 pr-3">التحليل الأكاديمي الشامل</h3>
                        <div className="text-slate-300 text-sm leading-relaxed text-right whitespace-pre-wrap">
                            {reaction.academicContext || "جاري جلب التحليل الأكاديمي الرصين..."}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'advanced' && (
                <div className="space-y-4 animate-slide-up">
                    <section className="bg-slate-800/20 p-5 rounded-[2rem] border border-slate-700/20 space-y-0">
                         <PropertyRow label="التهجين" value={reaction.hybridization} />
                         <PropertyRow label="القطبية" value={reaction.polarity} />
                         <PropertyRow label="عزم الثنائي قطب" value={reaction.dipoleMoment} color="text-indigo-400" />
                         <PropertyRow label="طاقة الرابطة" value={reaction.bondEnthalpy} color="text-rose-400" />
                         <PropertyRow label="الاستقرار الحراري" value={reaction.thermalStability} color="text-orange-400" />
                         <PropertyRow label="الذوبانية في الماء" value={reaction.solubilityInWater} />
                         <PropertyRow label="الوصف البلوري" value={reaction.crystalDescription} />
                    </section>
                    
                     <div className="p-6 bg-indigo-500/10 rounded-[2rem] border-2 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                        <h4 className="text-indigo-400 font-black text-[11px] uppercase mb-3 tracking-[0.2em] border-b border-indigo-500/20 pb-2 flex items-center gap-2">
                           <span className="text-lg">🧲</span> الوصف المغناطيسي الدقيق
                        </h4>
                        <p className="text-slate-200 text-sm leading-relaxed text-right font-medium">
                           {reaction.magneticDescription || "جاري تحليل الخواص المغناطيسية بناءً على التوزيع الإلكتروني..."}
                        </p>
                     </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-slate-900/50 rounded-[2rem] p-8 border border-amber-900/20 relative overflow-hidden group min-h-[300px] shadow-lg">
                    <div className="absolute top-4 left-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">📜</div>
                    <h3 className="text-amber-500 font-bold text-xl mb-6 flex items-center gap-2">
                       <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                       قصة الاكتشاف التاريخي
                    </h3>
                    <div className="space-y-6">
                       <p className="text-slate-300 italic text-md leading-relaxed text-right pr-2">
                           "{reaction.discoveryStory || "لا توجد تفاصيل تاريخية متوفرة لهذا الجزيء حالياً."}"
                       </p>
                       {(reaction.discoverer || reaction.discoveryYear) && (
                          <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                             <p className="text-amber-200 font-bold text-sm">
                                <span className="text-slate-500 font-medium ml-2">بواسطة:</span> {reaction.discoverer || "غير معروف"}
                             </p>
                             <p className="text-amber-200 font-bold text-sm mt-1">
                                <span className="text-slate-500 font-medium ml-2">في عام:</span> {reaction.discoveryYear || "---"}
                             </p>
                          </div>
                       )}
                    </div>
                </div>
            )}

            {activeTab === 'safety' && (
                <div className="space-y-6 animate-slide-up">
                    <div className="flex flex-wrap justify-center gap-4">
                        {Array.isArray(reaction.safety?.ghsSymbols) && reaction.safety.ghsSymbols.map((s, i) => (
                            <div key={i} className="flex flex-col items-center bg-white p-3 rounded-2xl w-24 shadow-xl transition-all hover:-translate-y-2 hover:shadow-cyan-500/10">
                                <span className="text-4xl mb-2">{GHS_MAP[s]?.emoji || '⚠️'}</span>
                                <span className="text-[10px] font-black text-slate-800 uppercase text-center leading-tight tracking-tighter">{GHS_MAP[s]?.label || s}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-red-950/20 p-6 rounded-[2.5rem] border border-red-900/30 shadow-lg">
                        <h3 className="text-red-400 font-bold text-md mb-4 flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                           تحذيرات وإرشادات السلامة
                        </h3>
                        <ul className="space-y-4">
                            {Array.isArray(reaction.safety?.warnings) ? reaction.safety?.warnings.map((w, i) => (
                                <li key={i} className="text-red-200 text-sm flex gap-4 text-right items-start group">
                                    <span className="bg-red-500/20 text-red-500 p-1.5 rounded-lg text-xs font-black transition-colors group-hover:bg-red-500 group-hover:text-white">{i + 1}</span>
                                    <span className="leading-relaxed font-medium">{w}</span>
                                </li>
                            )) : (
                                <li className="text-red-200 text-sm text-right italic opacity-60">لا توجد تحذيرات إضافية.</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#1e293b] border-t border-slate-700/50 flex-shrink-0">
            <button onClick={onNewReaction} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-900 py-4 rounded-2xl font-black transition-all shadow-xl text-lg transform active:scale-95 flex items-center justify-center gap-3">
                <span className="text-2xl">↺</span>
                تفاعل جديد
            </button>
        </div>
      </div>
    </div>
  );
};
