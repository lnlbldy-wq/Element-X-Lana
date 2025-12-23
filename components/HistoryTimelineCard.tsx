
import React from 'react';
import type { HistoryInfo } from '../types';

export const HistoryTimelineCard: React.FC<{ info: HistoryInfo; onNew: () => void }> = ({ info, onNew }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 animate-slide-up pb-32">
        <div className="bg-[#1e293b] border border-slate-700 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-10 text-center bg-gradient-to-b from-slate-800 to-[#1e293b]">
                <div className="text-6xl mb-4">📜</div>
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">{info.topic}</h2>
                <p className="text-slate-400 italic font-serif">"{info.summary}"</p>
            </div>

            <div className="p-8 space-y-12">
                <div className="bg-white rounded-2xl p-4 flex justify-center border border-slate-700 shadow-xl">
                    <img src={info.illustrationImage} alt={info.topic} className="max-h-80 object-contain rounded-xl" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-amber-950/20 rounded-3xl p-6 border border-amber-900/30">
                        <h3 className="text-amber-400 font-bold text-lg mb-3">🌍 التأثير المجتمعي</h3>
                        <p className="text-slate-300 text-sm leading-relaxed text-right">{info.impactOnSociety}</p>
                    </section>
                    <section className="bg-yellow-950/20 rounded-3xl p-6 border border-yellow-900/30">
                        <h3 className="text-yellow-400 font-bold text-lg mb-3">🏆 جوائز نوبل</h3>
                        <p className="text-slate-300 text-sm leading-relaxed text-right">{info.nobelPrizes}</p>
                    </section>
                </div>

                <section>
                    <h3 className="text-white font-bold text-2xl mb-8 pr-4 border-r-4 border-orange-500 text-right">الخط الزمني للأحداث</h3>
                    <div className="relative border-r-2 border-slate-700 space-y-10 pr-8">
                        {info.events?.map((event, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -right-[41px] top-1 w-5 h-5 rounded-full bg-orange-500 border-4 border-[#1e293b] z-10"></div>
                                <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-700 shadow-lg hover:bg-slate-800/60 transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-orange-400 font-bold text-xl">{event.year}</span>
                                        <span className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-slate-400 font-bold">{event.scientist}</span>
                                    </div>
                                    <h4 className="text-white font-bold text-lg mb-2">{event.title}</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="p-8 bg-slate-800/50 border-t border-slate-700">
                <button 
                    onClick={onNew}
                    className="w-full bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-[1.5rem] font-bold text-xl transition-all shadow-xl"
                >
                    استكشاف جديد
                </button>
            </div>
        </div>
    </div>
  );
};
