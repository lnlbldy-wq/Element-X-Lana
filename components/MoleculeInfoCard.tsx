
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

        {/* Content */}
        <div className="flex-grow overflow-y-auto scrollbar-hide px-6 py-5 space-y-6 animate-fade-in" key={activeTab}>
            
            {activeTab === 'general' && (
                <>
                    <section>
                        <h3 className="text-cyan-400 font-bold text-sm mb-3 text-center">تركيب لويس (Lewis Structure)</h3>
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
                        <section className="bg-slate-900/50 p-5 rounded-3xl border border-emerald-500/30">
                            <h3 className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
                                <span>⚖️</span> معادلة التكوين الموزونة
                            </h3>
                            <code dir="ltr" className="text-lg font-mono text-white block text-center p-2 bg-black/30 rounded-xl">
                                {reaction.balancedFormationEquation}
                            </code>
                        </section>
                    )}

                    <section className="space-y-0">
                        <PropertyRow label="الكتلة المولية" value={reaction.molarMass} />
                        <PropertyRow label="الحالة في STP" value={reaction.state} />
                        <PropertyRow label="الهندسة الجزيئية" value={reaction.molecularGeometry} />
                        <PropertyRow label="نوع الرابطة" value={reaction.bondType} />
                        <PropertyRow label="الحمضية/القاعدية" value={reaction.acidBase} color="text-amber-400" />
                    </section>
                </>
            )}

            {activeTab === 'academic' && (
                <section className="space-y-6 animate-slide-up">
                    {reaction.formationBalancingSteps && (
                        <div className="bg-emerald-950/20 p-6 rounded-[2rem] border border-emerald-900/30 relative overflow-hidden group">
                            <h3 className="text-emerald-400 font-bold text-lg mb-4 text-right border-r-4 border-emerald-500 pr-3">طريقة وزن المعادلة</h3>
                            <div className="text-slate-100 text-md leading-relaxed text-right whitespace-pre-wrap font-medium">
                                {reaction.formationBalancingSteps}
                            </div>
                        </div>
                    )}

                    <div className="bg-cyan-950/20 p-6 rounded-[2rem] border border-cyan-900/30">
                        <h3 className="text-cyan-400 font-bold text-lg mb-4 text-right border-r-4 border-cyan-500 pr-3">التحليل الأكاديمي والفيزيائي</h3>
                        <div className="text-slate-300 text-md leading-relaxed text-right whitespace-pre-wrap">
                            {reaction.academicContext || "جاري جلب التحليل الأكاديمي الشامل لهذا الجزيء..."}
                        </div>
                    </div>
                </section>
            )}

            {activeTab === 'advanced' && (
                <section className="grid grid-cols-1 gap-3">
                     <PropertyRow label="التهجين" value={reaction.hybridization} />
                     <PropertyRow label="القطبية" value={reaction.polarity} />
                     <PropertyRow label="الذوبانية في الماء" value={reaction.solubilityInWater} />
                     <PropertyRow label="الذوبانية في المذيبات العضوية" value={reaction.solubilityInOrganicSolvents} />
                     <PropertyRow label="الوصف البلوري" value={reaction.crystalDescription} />
                     <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                        <h4 className="text-cyan-500 font-bold text-[10px] uppercase mb-1 tracking-widest">الوصف المغناطيسي</h4>
                        <p className="text-slate-300 text-xs leading-relaxed">{reaction.magneticDescription}</p>
                     </div>
                </section>
            )}

            {activeTab === 'history' && (
                <section className="bg-slate-900/50 rounded-[2rem] p-6 border border-amber-900/20 relative overflow-hidden group min-h-[250px]">
                    <div className="absolute top-4 left-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">📜</div>
                    <h3 className="text-amber-500 font-bold text-lg mb-4">قصة الاكتشاف</h3>
                    <p className="text-slate-300 italic text-sm leading-relaxed text-right border-r-4 border-amber-600/30 pr-5">
                        "{reaction.discoveryStory || "لا توجد تفاصيل تاريخية متوفرة لهذا الجزيء."}"
                        {reaction.discoverer && <span className="block mt-4 font-bold text-amber-200/80 not-italic">المكتشف: {reaction.discoverer} ({reaction.discoveryYear})</span>}
                    </p>
                </section>
            )}

            {activeTab === 'safety' && (
                <section className="space-y-4">
                    <div className="flex flex-wrap justify-center gap-3">
                        {Array.isArray(reaction.safety?.ghsSymbols) ? reaction.safety?.ghsSymbols.map((s, i) => (
                            <div key={i} className="flex flex-col items-center bg-white p-2 rounded-xl w-20 shadow-lg transition-transform hover:-translate-y-1">
                                <span className="text-3xl mb-1">{GHS_MAP[s]?.emoji || '⚠️'}</span>
                                <span className="text-[9px] font-bold text-slate-800 uppercase text-center leading-tight">{GHS_MAP[s]?.label || s}</span>
                            </div>
                        )) : (reaction.safety?.ghsSymbols && <div className="text-xs text-slate-400 italic">بيانات السلامة: {String(reaction.safety.ghsSymbols)}</div>)}
                    </div>
                    <div className="bg-red-950/20 p-6 rounded-[2rem] border border-red-900/30">
                        <h3 className="text-red-400 font-bold text-md mb-3">تحذيرات السلامة</h3>
                        <ul className="space-y-3">
                            {Array.isArray(reaction.safety?.warnings) ? reaction.safety?.warnings.map((w, i) => (
                                <li key={i} className="text-red-200 text-sm flex gap-3 text-right items-start">
                                    <span className="text-red-500 text-lg mt-0.5">•</span> <span>{w}</span>
                                </li>
                            )) : (
                                <li className="text-red-200 text-sm text-right">
                                    {String(reaction.safety?.warnings || "لا توجد تحذيرات خاصة حالياً.")}
                                </li>
                            )}
                        </ul>
                    </div>
                </section>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1e293b] border-t border-slate-700/50">
            <button onClick={onNewReaction} className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 py-3 rounded-2xl font-bold transition-all shadow-xl text-md transform active:scale-95">
                تفاعل جديد
            </button>
        </div>
      </div>
    </div>
  );
};
