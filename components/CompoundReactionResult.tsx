
import React from 'react';
import type { CompoundReaction } from '../types';

// Define the missing props interface
interface CompoundReactionResultProps {
  reaction: CompoundReaction;
  onNewReaction: () => void;
}

const InfoCard: React.FC<{ title: string; icon: string; children: React.ReactNode; borderClass?: string; bgColor?: string }> = ({ title, icon, children, borderClass = "border-slate-700", bgColor = "bg-slate-800/40" }) => (
    <div className={`${bgColor} rounded-[1.5rem] p-5 border ${borderClass} shadow-xl flex flex-col h-full hover:bg-slate-800/50 transition-colors`}>
        <div className="flex items-center gap-2 mb-3">
            <span className="text-xl drop-shadow-md">{icon}</span>
            <h3 className="font-bold text-white text-md tracking-tight">{title}</h3>
        </div>
        <div className="flex-grow text-sm">{children}</div>
    </div>
);

export const CompoundReactionResult: React.FC<CompoundReactionResultProps> = ({ reaction, onNewReaction }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 animate-slide-up pb-32">
        <div className="text-center mb-8">
            <h2 className="text-lg font-bold text-cyan-400 mb-4 tracking-wide drop-shadow-[0_0_8px_rgba(34,211,238,0.2)] uppercase">{reaction.reactionType}</h2>
            <div className="bg-[#1e293b]/90 p-4 md:p-6 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.4)] inline-block min-w-[80%] border border-slate-700/60 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <code dir="ltr" className="text-xl md:text-2xl lg:text-3xl font-mono text-emerald-400 font-bold tracking-tight block py-2 whitespace-pre-wrap leading-relaxed">
                    {reaction.balancedEquation}
                </code>
            </div>
        </div>

        {/* Section: Detailed Balancing Method */}
        {reaction.balancingSteps && (
            <div className="mb-8 bg-emerald-950/10 p-6 rounded-[2rem] border border-emerald-900/20 shadow-lg relative overflow-hidden group">
                <h3 className="text-emerald-400 font-bold text-md mb-4 flex items-center justify-center gap-3 border-b border-emerald-900/20 pb-3">
                    <span className="text-xl">⚖️</span> شرح طريقة وزن المعادلة
                </h3>
                <div className="text-slate-200 text-sm leading-relaxed text-right whitespace-pre-wrap font-medium border-r-4 border-emerald-500/30 pr-6">
                    {reaction.balancingSteps}
                </div>
            </div>
        )}

        {/* Section: Academic Context & Theory */}
        {reaction.academicContext && (
            <div className="mb-8 bg-cyan-950/5 p-6 rounded-[2rem] border border-cyan-900/10 shadow-lg relative overflow-hidden">
                <h3 className="text-cyan-400 font-bold text-md mb-4 flex items-center justify-center gap-3 border-b border-cyan-900/10 pb-3">
                    <span className="text-xl">📖</span> التحليل الأكاديمي والنظري
                </h3>
                <div className="text-slate-300 text-sm leading-relaxed text-right whitespace-pre-wrap font-medium bg-slate-900/30 p-6 rounded-[1.5rem] border border-slate-700/40">
                    {reaction.academicContext}
                </div>
            </div>
        )}

        {/* Main Product Visual */}
        {reaction.environmentalImpact && (
            <div className="mb-8">
                <h3 className="text-cyan-400 font-bold text-xs mb-3 text-center uppercase tracking-widest opacity-80">التركيب الإلكتروني للمنتج الرئيسي</h3>
                <div className="bg-white rounded-[2rem] p-6 border border-slate-700/20 flex justify-center shadow-md transform hover:scale-[1.01] transition-transform">
                    <img src={reaction.environmentalImpact} alt="Lewis Structure" className="max-h-56 object-contain drop-shadow-md" />
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <InfoCard title="الملاحظات المرئية" icon="👀" borderClass="border-purple-500/10" bgColor="bg-purple-950/5">
                <p className="text-purple-200/80 leading-relaxed text-right font-medium">{reaction.visualObservations}</p>
            </InfoCard>

            <InfoCard title="التطبيقات الصناعية" icon="🏭" borderClass="border-emerald-500/10" bgColor="bg-emerald-950/5">
                <p className="text-emerald-200/80 leading-relaxed text-right font-medium">{reaction.industrialApplications}</p>
            </InfoCard>
        </div>

        {/* General Explanation */}
        <section className="bg-slate-800/20 rounded-[2rem] p-8 border border-slate-700/30 mb-8 shadow-md">
            <h3 className="text-cyan-400 font-bold text-md mb-4 text-center tracking-widest uppercase">شرح التفاعل العام</h3>
            <p className="text-slate-300 text-sm leading-relaxed text-right whitespace-pre-wrap font-medium">
                {reaction.explanation}
            </p>
        </section>

        {/* Safety Warnings */}
        <section className="bg-red-950/10 rounded-[2rem] p-8 border border-red-900/20 mb-12 shadow-md">
            <h3 className="text-red-400 font-bold text-md mb-6 flex items-center justify-center gap-3 border-b border-red-900/10 pb-3">
                <span className="text-2xl">⚠️</span> إرشادات وتحذيرات السلامة
            </h3>
            <ul className="space-y-4 text-red-100/90 text-sm font-medium">
                {Array.isArray(reaction.safetyNotes) ? reaction.safetyNotes.map((n, i) => (
                    <li key={i} className="flex gap-4 items-start text-right">
                        <span className="text-red-500 text-xl">•</span>
                        <span className="leading-relaxed bg-red-500/5 p-2 rounded-xl w-full border border-red-500/10">{n}</span>
                    </li>
                )) : (
                    <li className="flex gap-4 items-start text-right">
                        <span className="text-red-500 text-xl">•</span>
                        <span className="leading-relaxed bg-red-500/5 p-2 rounded-xl w-full border border-red-500/10">
                            {String(reaction.safetyNotes || "لا توجد ملاحظات سلامة محددة لهذا التفاعل.")}
                        </span>
                    </li>
                )}
            </ul>
        </section>

        <div className="flex justify-center">
            <button 
                onClick={onNewReaction}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-4 px-12 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.3)] text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
            >
                <span>تفاعل جديد</span>
                <span className="text-2xl">⚗️</span>
            </button>
        </div>
    </div>
  );
};
