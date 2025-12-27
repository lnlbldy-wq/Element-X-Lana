
import React from 'react';
import type { BatteryComparisonInfo, BatteryInfo } from '../types';

interface BatteryInfoCardProps {
    info: BatteryComparisonInfo | BatteryInfo;
    onNew: () => void;
}

const ComparisonView: React.FC<{ info: BatteryComparisonInfo; onNew: () => void }> = ({ info, onNew }) => {
    const comparisons = info?.comparisons || [];
    
    return (
        <div className="w-full max-w-7xl mx-auto py-10 px-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
                {comparisons.map((col, index) => (
                    <div key={index} className="bg-[#1a2333] p-8">
                        <h3 className="text-cyan-400 font-bold text-lg mb-6 text-right leading-relaxed border-b border-slate-700 pb-4">
                            {col.title}
                        </h3>
                        <p className="text-slate-300 leading-loose text-right text-[15px] font-medium">
                            {col.description}
                        </p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-12">
                <button 
                    onClick={onNew}
                    className="group bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black py-4 px-16 rounded-2xl shadow-xl text-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4"
                >
                    <span>تحليل جديد</span>
                    <span className="text-2xl">🔋</span>
                </button>
            </div>
        </div>
    );
};

const Metric: React.FC<{ label: string; value?: string; color?: string }> = ({ label, value, color = 'text-white' }) => (
    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50 text-center">
        <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</h4>
        <p dir="ltr" className={`text-lg font-mono font-black ${color}`}>{value || 'N/A'}</p>
    </div>
);

const SingleBatteryView: React.FC<{ info: BatteryInfo; onNew: () => void }> = ({ info, onNew }) => {
    return (
        <div className="w-full max-w-3xl mx-auto py-10 px-4 animate-fade-in">
            <div className="bg-[#1e293b] border border-slate-700 rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="p-8 text-center bg-gradient-to-b from-slate-800 to-transparent">
                    <h2 className="text-3xl font-black text-white tracking-tight">{info.name}</h2>
                    <p className="text-md font-bold text-cyan-400">{info.type}</p>
                </div>
                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-3 gap-4">
                        <Metric label="الجهد الاسمي" value={info.nominalVoltage} color="text-emerald-400" />
                        <Metric label="كثافة الطاقة" value={info.energyDensity} color="text-amber-400" />
                        <Metric label="دورة الحياة" value={info.cycleLife} color="text-indigo-400" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-red-950/20 p-6 rounded-2xl border border-red-900/30">
                            <h3 className="text-red-400 font-bold text-sm mb-2 text-right">المصعد (Anode)</h3>
                            <p className="font-bold text-white text-right mb-2 text-sm">{info.anodeMaterial}</p>
                            <code dir="ltr" className="text-red-200 text-[10px] bg-black/30 p-2 rounded-lg block text-center">{info.anodeReaction}</code>
                        </div>
                        <div className="bg-blue-950/20 p-6 rounded-2xl border border-blue-900/30">
                            <h3 className="text-blue-400 font-bold text-sm mb-2 text-right">المهبط (Cathode)</h3>
                            <p className="font-bold text-white text-right mb-2 text-sm">{info.cathodeMaterial}</p>
                            <code dir="ltr" className="text-blue-200 text-[10px] bg-black/30 p-2 rounded-lg block text-center">{info.cathodeReaction}</code>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                        <h3 className="text-cyan-400 font-bold text-sm mb-2 text-right">الكهرل (Electrolyte)</h3>
                        <p className="text-slate-300 text-sm text-right">{info.electrolyte}</p>
                    </div>

                     <div className="bg-emerald-950/20 p-6 rounded-2xl border border-emerald-900/30">
                        <h3 className="text-emerald-400 font-bold text-sm mb-2 text-right">التطبيقات</h3>
                        <p className="text-slate-300 text-sm text-right">{info.applications}</p>
                    </div>

                     {info.safetyRisks && (
                        <div className="bg-red-950/20 p-6 rounded-2xl border border-red-900/30">
                            <h3 className="text-red-400 font-bold text-sm mb-2 text-right">⚠️ مخاطر السلامة</h3>
                            <p className="text-slate-300 text-xs text-right leading-relaxed">{info.safetyRisks}</p>
                        </div>
                     )}
                </div>

                <div className="p-6 bg-slate-900/40 border-t border-slate-700/50">
                    <button onClick={onNew} className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95">استكشاف جديد</button>
                </div>
            </div>
        </div>
    );
};

function isComparisonInfo(info: any): info is BatteryComparisonInfo {
    return 'comparisons' in info && Array.isArray(info.comparisons);
}

export const BatteryInfoCard: React.FC<BatteryInfoCardProps> = ({ info, onNew }) => {
    if (isComparisonInfo(info)) {
        return <ComparisonView info={info} onNew={onNew} />;
    }
    return <SingleBatteryView info={info as BatteryInfo} onNew={onNew} />;
};
