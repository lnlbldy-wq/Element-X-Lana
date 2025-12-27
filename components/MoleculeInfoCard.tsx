
import React, { useState } from 'react';
import type { Reaction } from '../types';

interface MoleculeInfoCardProps {
  reaction: Reaction;
  onNewReaction: () => void;
}

type TabType = 'general' | 'academic' | 'advanced' | 'history' | 'safety';

const PropertyRow: React.FC<{ label: string; value?: string; color?: string; labelColor?: string }> = ({ label, value, color = "text-white", labelColor = "text-cyan-400" }) => (
    <div className="flex justify-between items-center py-4 border-b border-slate-800/50 group text-right">
        <dt className={`font-black text-xs ${labelColor} w-40 shrink-0 text-right pr-4 border-r-2 border-transparent group-hover:border-cyan-500 transition-all`}>{label}</dt>
        <dd className={`font-bold text-right text-sm leading-relaxed flex-1 pl-4 ${color}`}>{value || '---'}</dd>
    </div>
);

const AdvancedMetric: React.FC<{ label: string; value?: string; icon: string }> = ({ label, value, icon }) => (
    <div className="bg-[#1e293b]/60 p-5 rounded-3xl border border-cyan-500/10 flex flex-col items-center text-center shadow-lg transition-all hover:bg-[#1e293b]/80 group">
        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{icon}</span>
        <h4 className="text-[#5ce1ff] font-black text-[9px] uppercase mb-1 tracking-widest">{label}</h4>
        <p className="text-white text-sm font-black">{value || '---'}</p>
    </div>
);

export const MoleculeInfoCard: React.FC<MoleculeInfoCardProps> = ({ reaction, onNewReaction }) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const data = reaction;
  if (!data) return null;

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'general', label: 'الخصائص', icon: '⚗️' },
    { id: 'academic', label: 'أكاديمي', icon: '📖' },
    { id: 'advanced', label: 'متقدم', icon: '🔬' },
    { id: 'history', label: 'التاريخ', icon: '📜' },
    { id: 'safety', label: 'السلامة', icon: '⚠️' },
  ];

  const formula = data.formula || '';

  return (
    <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-3xl flex items-center justify-center z-[110] animate-fade-in p-4 overflow-hidden">
      <div className="bg-[#111827] border border-cyan-500/20 rounded-[3rem] shadow-2xl w-full max-w-xl h-full md:max-h-[94vh] overflow-hidden flex flex-col">
        
        <div className="p-6 text-center shrink-0">
             <div className="text-5xl mb-2">{data.emoji || '⚛️'}</div>
             <h2 className="text-3xl font-black text-white mb-1 tracking-tight">{data.name}</h2>
             <div className="inline-block px-5 py-0.5 bg-cyan-500/10 rounded-full border border-cyan-500/10">
                <p className="text-md font-mono text-[#5ce1ff] font-black tracking-widest">{formula}</p>
             </div>
        </div>

        <div className="flex px-4 py-2 bg-[#1f2937]/30 border-y border-slate-800 shrink-0 overflow-x-auto scrollbar-hide">
            <div className="flex w-full min-w-max justify-around gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center justify-center gap-0 px-2 py-1 rounded-xl transition-all w-14 h-14 ${activeTab === tab.id ? 'bg-cyan-500 text-slate-950 shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                    >
                        <span className="text-md">{tab.icon}</span>
                        <span className="text-[7px] font-black uppercase tracking-tighter">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-grow overflow-y-auto scrollbar-hide px-8 py-8 space-y-8 animate-fade-in">
            
            {activeTab === 'general' && (
                <div className="space-y-8">
                     <section className="bg-white rounded-[2.5rem] p-6 flex flex-col items-center shadow-2xl border border-slate-200">
                        <h3 className="text-slate-900 font-black text-xs mb-4 uppercase tracking-widest">تمثيل لويس والتركيب</h3>
                        {data.lewisStructure ? (
                            <img src={data.lewisStructure} alt="Lewis" className="max-h-52 object-contain" />
                        ) : (
                            <div className="text-center opacity-30"><div className="text-6xl mb-2 grayscale">⚗️</div></div>
                        )}
                    </section>
                    <section className="bg-[#1e293b]/40 rounded-[2.5rem] p-6 border border-slate-800 shadow-inner">
                        <h3 className="text-slate-500 font-black text-[10px] mb-6 text-center uppercase tracking-[0.4em]">الخصائص العامة</h3>
                        <div className="space-y-0">
                            <PropertyRow label="الكتلة المولية" value={data.molarMass} />
                            <PropertyRow label="الحالة (STP)" value={data.state} />
                            <PropertyRow label="الهندسة الجزيئية" value={data.molecularGeometry} />
                            <PropertyRow label="الكثافة" value={data.density} />
                            <PropertyRow label="نوع التفاعل" value={data.reactionType} />
                            <PropertyRow label="نوع الرابطة" value={data.bondType} />
                            <PropertyRow label="حمض / قاعدة" value={data.acidBase} labelColor="text-amber-400" />
                        </div>
                    </section>
                    <section className="bg-[#1e293b]/60 p-6 rounded-[2.5rem] border border-cyan-500/10 shadow-xl">
                        <h3 className="text-cyan-400 font-black text-xs mb-4 text-right pr-4 border-r-4 border-cyan-500">التوزيع الإلكتروني المداري</h3>
                        <div className="space-y-2">
                            <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-center">
                                <p className="text-[9px] text-slate-500 uppercase mb-1">التوزيع المختصر</p>
                                <code dir="ltr" className="text-xl font-mono font-black text-[#5ce1ff]">{data.electronConfiguration || '---'}</code>
                            </div>
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                                <p className="text-[9px] text-slate-500 uppercase mb-1">التوزيع الكامل</p>
                                <code dir="ltr" className="text-xs font-mono text-slate-300 leading-relaxed block">{data.fullElectronConfiguration || '---'}</code>
                            </div>
                        </div>
                    </section>
                </div>
            )}
            
            {activeTab === 'academic' && (
                <div className="space-y-8 text-right">
                    <div className="bg-emerald-950/10 p-8 rounded-[3rem] border border-emerald-500/20 shadow-xl">
                        <h3 className="text-emerald-400 font-black text-lg mb-4 pr-4 border-r-4 border-emerald-500">المعادلة الموزونة</h3>
                        <code dir="ltr" className="block text-center text-2xl font-mono text-emerald-400 bg-black/50 p-6 rounded-3xl mb-6 border border-emerald-500/10">
                            {data.balancedFormationEquation || '---'}
                        </code>
                        <div className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap bg-black/20 p-6 rounded-2xl border border-white/5 font-medium italic">
                            {data.formationBalancingSteps || "يتم جلب تفاصيل الوزن الأكاديمي..."}
                        </div>
                    </div>
                    <div className="bg-blue-950/10 p-8 rounded-[3rem] border border-blue-500/20 shadow-xl">
                         <h3 className="text-blue-400 font-black text-lg mb-4 pr-4 border-r-4 border-blue-500">التحليل الأكاديمي المعمق</h3>
                         <div className="text-slate-200 text-md leading-relaxed whitespace-pre-wrap font-bold bg-black/20 p-6 rounded-2xl">
                            {data.academicContext || "جاري جلب السياق العلمي الشامل..."}
                         </div>
                    </div>
                </div>
            )}

            {activeTab === 'advanced' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <AdvancedMetric icon="🌀" label="التهجين" value={data.hybridization} />
                        <AdvancedMetric icon="🧲" label="المغناطيسية" value={data.magneticDescription} />
                        <AdvancedMetric icon="↔️" label="القطبية" value={data.polarity} />
                        <AdvancedMetric icon="⚡" label="عزم القطب" value={data.dipoleMoment} />
                        <AdvancedMetric icon="🌡️" label="الغليان" value={data.boilingPoint} />
                        <AdvancedMetric icon="❄️" label="الانصهار" value={data.meltingPoint} />
                    </div>
                    <section className="bg-[#1e293b]/40 rounded-[2.5rem] p-6 border border-slate-800 shadow-inner">
                        <h3 className="text-slate-500 font-black text-[10px] mb-6 text-center uppercase tracking-[0.4em]">القيم المتقدمة الإضافية</h3>
                        <div className="space-y-0">
                            <PropertyRow label="فرق السالبية الكهربائية" value={data.electronegativityDifference} color="text-yellow-400" />
                            <PropertyRow label="نصف قطر فان دير فالس" value={data.vanDerWaalsRadius} />
                            <PropertyRow label="الذوبانية في الماء" value={data.solubilityInWater} />
                            <PropertyRow label="الذوبانية العضوية" value={data.solubilityInOrganicSolvents} />
                            <PropertyRow label="الوصف البلوري" value={data.crystalDescription} color="text-indigo-400" />
                            <PropertyRow label="الاستقرار الحراري" value={data.thermalStability} color="text-orange-400" />
                            <PropertyRow label="إنثالبية الرابطة" value={data.bondEnthalpy} color="text-rose-400" />
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-amber-950/10 p-10 rounded-[3.5rem] border border-amber-500/20 text-right shadow-2xl relative overflow-hidden">
                    <h3 className="text-amber-500 font-black text-2xl mb-8 flex items-center justify-end gap-3">الأرشيف التاريخي 📜</h3>
                    <div className="flex items-center gap-6 mb-8 bg-black/40 p-6 rounded-3xl border border-amber-500/10">
                        <div className="flex-1 border-r border-white/10 pr-6">
                            <p className="text-[10px] text-slate-500 uppercase mb-1 tracking-widest">المكتشف</p>
                            <p className="text-2xl font-black text-amber-500">{data.discoverer || '---'}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-slate-500 uppercase mb-1 tracking-widest">سنة الاكتشاف</p>
                            <p className="text-2xl font-black text-amber-500">{data.discoveryYear || '---'}</p>
                        </div>
                    </div>
                    <p className="text-slate-200 text-md italic leading-[2] font-medium bg-white/5 p-8 rounded-3xl">
                        {data.discoveryStory || 'يتم استرجاع السجلات التاريخية للاكتشاف...'}
                    </p>
                </div>
            )}

            {activeTab === 'safety' && (
                <div className="space-y-6 text-right">
                    <div className="flex flex-wrap justify-center gap-4">
                        {data.safety?.ghsSymbols?.map((s: string, idx: number) => (
                            <div key={idx} className="bg-white p-4 rounded-3xl w-32 text-center shadow-xl hover:-translate-y-2 transition-transform">
                                <span className="text-5xl block mb-2">⚠️</span>
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter leading-none">{s}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-red-950/20 p-8 rounded-[3rem] border border-red-500/20 text-right shadow-xl">
                        <h3 className="text-red-400 font-black text-xl mb-6 pr-4 border-r-4 border-red-500">بروتوكولات السلامة</h3>
                        <ul className="space-y-4">
                            {data.safety?.warnings?.map((w: string, i: number) => (
                                <li key={i} className="text-red-100 text-md flex gap-4 justify-end font-bold bg-black/20 p-5 rounded-2xl">
                                    <span className="leading-relaxed">{w}</span> 
                                    <span className="text-red-500 text-2xl">•</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>

        <div className="p-4 bg-[#111827] border-t border-slate-800/50 shrink-0">
            <div className="p-1 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <button 
                    onClick={onNewReaction} 
                    className="w-full bg-[#00bcd4] hover:bg-[#00acc1] text-slate-950 py-3 rounded-full font-black text-lg shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <span>⚗️</span>
                    <span>تفاعل جديد  </span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
