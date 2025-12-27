
import React from 'react';
import type { CompoundReaction } from '../types';

interface CompoundReactionResultProps {
  reaction: CompoundReaction;
  onNewReaction: () => void;
}

const InfoCard: React.FC<{ title: string; icon: string; content?: string; color: 'blue' | 'red' | 'slate' | 'purple' }> = ({ title, icon, content, color }) => {
    const colors = {
        blue: { bg: 'bg-blue-950/20', border: 'border-blue-900/30' },
        red: { bg: 'bg-red-950/20', border: 'border-red-900/30' },
        slate: { bg: 'bg-slate-800/20', border: 'border-slate-700/30' },
        purple: { bg: 'bg-purple-950/20', border: 'border-purple-900/30' }
    };

    return (
        <div className={`p-6 rounded-[2rem] border ${colors[color].bg} ${colors[color].border} shadow-lg text-right`}>
            <div className="flex items-center justify-end gap-3 mb-3">
                <h4 className="font-bold text-slate-400 text-xs">{title}</h4>
                <span className="text-lg">{icon}</span>
            </div>
            <p className="text-slate-200 text-sm font-medium leading-relaxed text-right">{content || "لا توجد بيانات."}</p>
        </div>
    );
};

export const CompoundReactionResult: React.FC<CompoundReactionResultProps> = ({ reaction, onNewReaction }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 animate-fade-in pb-32">
        <h2 className="text-3xl font-black text-white text-center mb-6">نتائج التفاعل</h2>
        
        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] shadow-2xl mb-10 text-center border border-slate-700">
            <h3 className="text-slate-400 text-sm font-bold mb-4">المعادلة الكيميائية الموزونة</h3>
            <code dir="ltr" className="text-3xl font-mono text-emerald-400 font-black tracking-wide">
                {reaction.balancedEquation}
            </code>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <InfoCard icon="🧪" title="نوع التفاعل" content={reaction.reactionType} color="blue" />
            <InfoCard icon="🔥" title="المحتوى الحراري" content={reaction.thermodynamicNotes} color="red" />
            <InfoCard icon="⚙️" title="شروط التفاعل" content={reaction.reactionConditions} color="slate" />
            <InfoCard icon="👀" title="الملاحظات المرئية" content={reaction.visualObservations} color="purple" />
        </div>

        <div className="space-y-8">
            <section className="bg-slate-800/30 p-8 rounded-[2rem] border border-slate-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 text-right">شرح التفاعل</h3>
                <p className="text-slate-300 leading-loose text-right whitespace-pre-wrap">{reaction.explanation || reaction.academicContext}</p>
            </section>
            
            {reaction.safetyNotes && reaction.safetyNotes.length > 0 && (
                <section className="bg-red-950/20 p-8 rounded-[2rem] border border-red-900/30">
                    <h3 className="text-xl font-bold text-red-400 mb-4 text-right flex items-center justify-end gap-3">
                        <span className="text-2xl">⚠️</span>
                        تحذيرات السلامة
                    </h3>
                    <ul className="space-y-3 list-inside text-right">
                        {reaction.safetyNotes.map((note, index) => (
                            <li key={index} className="text-red-200 leading-relaxed list-disc">{note}</li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
        
        <div className="flex justify-center mt-12">
            <button 
                onClick={onNewReaction}
                className="group bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black py-4 px-16 rounded-2xl shadow-xl text-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4"
            >
                <span>تفاعل جديد</span>
                <span className="text-2xl">⚗️</span>
            </button>
        </div>
    </div>
  );
};
