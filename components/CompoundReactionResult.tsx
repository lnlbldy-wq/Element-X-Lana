
import React from 'react';
import type { CompoundReaction } from '../types';

interface CompoundReactionResultProps {
  reaction: CompoundReaction;
  onNewReaction: () => void;
}

const InfoCard: React.FC<{ title: string; icon: string; children: React.ReactNode; borderClass?: string; bgColor?: string }> = ({ title, icon, children, borderClass = "border-slate-700", bgColor = "bg-slate-800/40" }) => (
    <div className={`${bgColor} rounded-[2rem] p-6 border ${borderClass} shadow-xl flex flex-col h-full hover:bg-slate-800/50 transition-all duration-300`}>
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shadow-inner">{icon}</div>
            <h3 className="font-bold text-white text-md tracking-tight border-b-2 border-white/5 pb-1 flex-1">{title}</h3>
        </div>
        <div className="flex-grow text-sm leading-relaxed">{children}</div>
    </div>
);

export const CompoundReactionResult: React.FC<CompoundReactionResultProps> = ({ reaction, onNewReaction }) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-slide-up pb-32">
        <div className="text-center mb-10">
            <div className="inline-block bg-cyan-500/10 text-cyan-400 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-cyan-500/20">
                {reaction.reactionType || 'تفاعل كيميائي'}
            </div>
            <div className="bg-[#1e293b]/95 p-6 md:p-10 rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] inline-block min-w-[85%] border-2 border-slate-700/60 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-emerald-500/10 opacity-30 group-hover:opacity-60 transition-opacity"></div>
                <code dir="ltr" className="text-2xl md:text-3xl lg:text-4xl font-mono text-emerald-400 font-black tracking-tight block py-4 whitespace-pre-wrap leading-tight drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                    {reaction.balancedEquation}
                </code>
            </div>
        </div>

        {/* Balancing Steps */}
        <div className="mb-10 bg-emerald-950/20 p-8 rounded-[3rem] border border-emerald-900/30 shadow-2xl relative overflow-hidden">
            <h3 className="text-emerald-400 font-black text-lg mb-6 flex items-center gap-4 border-b border-emerald-900/20 pb-4">
                <span className="text-2xl">⚖️</span> 
                خطوات وزن المعادلة بالتفصيل
            </h3>
            <div className="text-slate-200 text-md leading-relaxed text-right whitespace-pre-wrap font-medium border-r-4 border-emerald-500 pr-6">
                {reaction.balancingSteps || "جاري جلب الخطوات..."}
            </div>
        </div>

        {/* Mechanism */}
        <div className="mb-10 bg-indigo-950/20 p-8 rounded-[3rem] border border-indigo-900/30 shadow-2xl">
            <h3 className="text-indigo-400 font-black text-lg mb-6 flex items-center gap-4 border-b border-indigo-900/20 pb-4">
                <span className="text-2xl">⚙️</span> 
                ميكانيكية التفاعل الجزيئية
            </h3>
            <div className="text-slate-300 text-md leading-relaxed text-right whitespace-pre-wrap font-medium p-6 bg-slate-900/60 rounded-[2rem] border border-indigo-500/10">
                {reaction.reactionMechanism || "جاري تحليل آليات كسر وتكوين الروابط..."}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <InfoCard title="الملاحظات المرئية" icon="👀" borderClass="border-purple-500/20" bgColor="bg-purple-950/10">
                <p className="text-purple-200 leading-relaxed text-right font-medium text-md">
                   {reaction.visualObservations || "لا توجد ملاحظات."}
                </p>
            </InfoCard>

            <InfoCard title="الأثر البيئي والتعامل" icon="🌍" borderClass="border-green-500/20" bgColor="bg-green-950/10">
                <p className="text-green-200 leading-relaxed text-right font-medium text-md">
                   {reaction.environmentalImpact || "لا توجد معلومات."}
                </p>
            </InfoCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2 bg-slate-800/30 rounded-[3rem] p-8 border border-slate-700/40 shadow-xl">
               <h3 className="text-cyan-400 font-black text-xs mb-6 text-center uppercase tracking-[0.4em]">التحليل العلمي الشامل</h3>
               <p className="text-slate-300 text-md leading-relaxed text-right whitespace-pre-wrap font-medium">
                   {reaction.explanation}
               </p>
            </div>
            
            <div className="bg-orange-500/5 rounded-[3rem] p-8 border border-orange-500/20 flex flex-col justify-center text-center">
               <span className="text-3xl mb-4">🌡️</span>
               <h4 className="text-orange-400 font-bold text-sm mb-4 uppercase tracking-widest">الملاحظات الحرارية</h4>
               <p className="text-slate-300 text-sm font-medium leading-relaxed italic">
                  {reaction.thermodynamicNotes || "جاري التحليل..."}
               </p>
            </div>
        </div>

        <section className="bg-red-950/20 rounded-[3rem] p-10 border-2 border-red-900/40 mb-14 shadow-2xl">
            <h3 className="text-red-400 font-black text-xl mb-8 flex items-center justify-center gap-4 border-b border-red-900/20 pb-4">
                <span className="text-3xl">⚠️</span> 
                إرشادات السلامة والتعامل الكيميائي
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(reaction.safetyNotes) && reaction.safetyNotes.map((n, i) => (
                    <div key={i} className="flex gap-4 items-start text-right bg-red-950/40 p-5 rounded-2xl border border-red-900/20">
                        <span className="bg-red-500 text-white w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 mt-1">{i + 1}</span>
                        <span className="text-red-100/90 text-sm font-bold leading-relaxed">{n}</span>
                    </div>
                ))}
            </div>
        </section>

        <div className="flex justify-center">
            <button 
                onClick={onNewReaction}
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black py-5 px-16 rounded-3xl shadow-xl text-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4"
            >
                <span>تفاعل جديد</span>
                <span className="text-3xl">⚗️</span>
            </button>
        </div>
    </div>
  );
};
