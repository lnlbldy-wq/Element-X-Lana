
import React, { useState } from 'react';
import type { Atom } from '../types';
import { BATTERY_PRESETS, ORGANIC_FAMILIES, COMMON_COMPOUNDS } from '../constants';

type SimulationMode = 'atoms' | 'compounds' | 'organic' | 'biochemistry' | 'electrochemistry' | 'thermochemistry' | 'solution' | 'batteries' | 'history' | 'ai-lab';

interface SidebarProps {
  atoms: Omit<Atom, 'instanceId' | 'x' | 'y'>[];
  onAtomClick: (atomId: string) => void;
  onModeChange: (mode: SimulationMode) => void;
  currentMode: SimulationMode;
  onOrganicSearch: (q: string, isSecond?: boolean) => void;
  onBiomoleculeGenerate: (name: string, isSecond?: boolean) => void;
  onGalvanicCellSimulate: (m1: string, m2: string, isSecond?: boolean) => void;
  onThermoAnalyze: (eq: string, isSecond?: boolean) => void;
  onSolutionAnalyze: (s: string, sv: string, c: number, isSecond?: boolean) => void;
  onBatterySimulate: (type: string, isSecond?: boolean) => void;
  onHistoryExplore: (topic: string, isSecond?: boolean) => void;
  reactant1: string; setReactant1: (v: string) => void;
  reactant2: string; setReactant2: (v: string) => void;
  onCompoundReact: () => void;
  isComparisonMode: boolean;
  setIsComparisonMode: (v: boolean) => void;
  isOrganicCompoundLoading: boolean;
  isBiomoleculeLoading: boolean;
  isGalvanicCellLoading: boolean;
  isThermoLoading: boolean;
  isSolutionLoading: boolean;
  isBatteryLoading: boolean;
  isHistoryLoading: boolean;
}

const modes = [
  { mode: 'ai-lab', label: 'الذكاء', emoji: '🤖', color: 'text-cyan-400' },
  { mode: 'atoms', label: 'الذرات', emoji: '⚛️', color: 'text-purple-400' },
  { mode: 'compounds', label: 'المركبات', emoji: '🧪', color: 'text-emerald-400' },
  { mode: 'organic', label: 'العضوية', emoji: '🌿', color: 'text-green-400' },
  { mode: 'biochemistry', label: 'الحيوية', emoji: '🧬', color: 'text-pink-400' },
  { mode: 'electrochemistry', label: 'الكهرباء', emoji: '⚡️', color: 'text-yellow-400' },
  { mode: 'thermochemistry', label: 'الحرارة', emoji: '🔥', color: 'text-orange-400' },
  { mode: 'solution', label: 'المحاليل', emoji: '💧', color: 'text-blue-400' },
  { mode: 'batteries', label: 'البطاريات', emoji: '🔋', color: 'text-lime-400' },
  { mode: 'history', label: 'التاريخ', emoji: '📜', color: 'text-amber-400' },
];

const SectionTitle: React.FC<{ title: string; emoji: string }> = ({ title, emoji }) => (
    <div className="flex items-center gap-2 mb-3 mt-2 px-1">
        <span className="text-sm">{emoji}</span>
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{title}</h3>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800 ml-2"></div>
    </div>
);

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const { 
    atoms, onAtomClick, onModeChange, currentMode, onOrganicSearch, 
    onBiomoleculeGenerate, onGalvanicCellSimulate, onThermoAnalyze, 
    onSolutionAnalyze, onBatterySimulate, onHistoryExplore, 
    isComparisonMode, setIsComparisonMode, isOrganicCompoundLoading,
    isSolutionLoading
  } = props;

  const [carbonCount, setCarbonCount] = useState(1);
  const [organicFamily, setOrganicFamily] = useState('ألكان');
  const [molarity, setMolarity] = useState(1.0);
  const [activeSlot, setActiveSlot] = useState<'first' | 'second'>('first');
  const [searchTerm, setSearchTerm] = useState('');

  const handleModeChange = (m: SimulationMode) => {
    setActiveSlot('first');
    onModeChange(m);
  };

  const wrapAction = (fn: (...args: any[]) => void, ...args: any[]) => {
    fn(...args, activeSlot === 'second');
  };

  const handleOrganicBuild = () => {
      const query = `${organicFamily} يحتوي على ${carbonCount} ذرات كربون`;
      wrapAction(onOrganicSearch, query);
  };

  const needsComparisonSwitch = !['ai-lab', 'atoms', 'compounds'].includes(currentMode);

  const filteredItems = atoms.filter(a => 
    a.name.includes(searchTerm) || a.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const elementalAtoms = filteredItems.filter(a => !['SO4', 'NO3', 'OH', 'NH4', 'CO3', 'PO4', 'CN'].includes(a.id));
  const polyatomicIons = filteredItems.filter(a => ['SO4', 'NO3', 'OH', 'NH4', 'CO3', 'PO4', 'CN'].includes(a.id));
  
  return (
    <div className="h-full bg-slate-50 dark:bg-[#0f172a] border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl z-20 w-80 shrink-0 transition-all duration-300">
      <div className="p-2 grid grid-cols-5 gap-1 border-b border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/40 backdrop-blur-md">
        {modes.map((m) => (
           <button
             key={m.mode}
             onClick={() => handleModeChange(m.mode as SimulationMode)}
             title={m.label}
             className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${currentMode === m.mode ? 'bg-white dark:bg-slate-800 ring-1 ring-cyan-500/50 shadow-md scale-[1.05]' : 'opacity-40 hover:opacity-100 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
           >
             <span className={`text-base mb-0.5`}>{m.emoji}</span>
             <span className={`text-[7px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tighter text-center leading-none`}>{m.label}</span>
           </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 scrollbar-hide">
        {needsComparisonSwitch && (
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 dark:from-cyan-900/20 dark:to-purple-900/20 p-4 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">وضع المقارنة</span>
                        <span className="text-[8px] text-slate-500 dark:text-slate-400 font-bold">تحليل مزدوج للمحتوى</span>
                    </div>
                    <button 
                        onClick={() => setIsComparisonMode(!isComparisonMode)}
                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isComparisonMode ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${isComparisonMode ? 'right-7' : 'right-1'}`}></div>
                    </button>
                </div>
                {isComparisonMode && (
                    <div className="flex gap-2 p-1.5 bg-white/40 dark:bg-black/20 rounded-xl backdrop-blur-sm border border-white/20 dark:border-white/5">
                        <button 
                            onClick={() => setActiveSlot('first')}
                            className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${activeSlot === 'first' ? 'bg-white dark:bg-slate-700 shadow-md text-cyan-600 dark:text-cyan-400' : 'text-slate-500'}`}
                        >
                            العنصر 1
                        </button>
                        <button 
                            onClick={() => setActiveSlot('second')}
                            className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${activeSlot === 'second' ? 'bg-white dark:bg-slate-700 shadow-md text-cyan-600 dark:text-cyan-400' : 'text-slate-500'}`}
                        >
                            العنصر 2
                        </button>
                    </div>
                )}
            </div>
        )}

        {currentMode === 'ai-lab' && (
            <div className="space-y-4 animate-slide-up">
                <div className="p-5 bg-white/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-3xl text-[10px] text-slate-600 dark:text-slate-300 space-y-4 shadow-sm leading-relaxed font-bold">
                    <p className="flex gap-3"><span>🤖</span> اسأل عن أي مفهوم كيميائي معقد.</p>
                    <p className="flex gap-3"><span>🧪</span> اطلب تفسير آليات التفاعلات الكيميائية.</p>
                </div>
            </div>
        )}

        {currentMode === 'atoms' && (
          <div className="space-y-2 animate-slide-up">
            <div className="relative group mb-4">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">🔍</span>
                <input 
                    type="text" 
                    placeholder="بحث عن عنصر أو أيون..." 
                    onChange={(e)=>setSearchTerm(e.target.value)} 
                    className="w-full pl-4 pr-10 py-3 text-xs rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-sm" 
                />
            </div>

            {elementalAtoms.length > 0 && (
                <>
                    <SectionTitle title="ذرات" emoji="⚛️" />
                    <div className="grid grid-cols-5 gap-1.5 pt-1 mb-6">
                    {elementalAtoms.map(a => (
                        <button 
                            key={a.id} 
                            onClick={() => onAtomClick(a.id)} 
                            title={a.name}
                            className="flex flex-col items-center group p-1 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-all"
                        >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black shadow-md mb-0.5 transition-all group-active:scale-90 group-hover:scale-105 text-[8px] border border-white/10 ${a.color}`}>
                            {a.symbol}
                        </div>
                        </button>
                    ))}
                    </div>
                </>
            )}

            {polyatomicIons.length > 0 && (
                <>
                    <SectionTitle title="أيونات" emoji="⚡" />
                    <div className="grid grid-cols-5 gap-1.5 pt-1">
                    {polyatomicIons.map(a => (
                        <button 
                            key={a.id} 
                            onClick={() => onAtomClick(a.id)} 
                            title={a.name}
                            className="flex flex-col items-center group p-1 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-all"
                        >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black shadow-md mb-0.5 transition-all group-active:scale-90 group-hover:scale-105 text-[7px] border border-white/10 ${a.color}`}>
                            {a.symbol}
                        </div>
                        </button>
                    ))}
                    </div>
                </>
            )}
          </div>
        )}

        {currentMode === 'organic' && (
            <div className="space-y-6 animate-slide-up">
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
                    <div className="mb-5">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">العائلة الكيميائية</label>
                        <select 
                            value={organicFamily}
                            onChange={(e) => setOrganicFamily(e.target.value)}
                            className="w-full p-3.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-green-500/10 transition-all cursor-pointer appearance-none font-bold"
                        >
                            {ORGANIC_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ذرات الكربون</label>
                            <span className="bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md">{carbonCount}</span>
                        </div>
                        <div className="px-1 pt-2">
                            <input 
                                type="range" 
                                min="1" 
                                max="12" 
                                step="1"
                                value={carbonCount}
                                onChange={(e) => setCarbonCount(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500 transition-all hover:accent-green-400"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleOrganicBuild}
                        disabled={isOrganicCompoundLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 text-xs rounded-2xl font-black transition-all shadow-[0_10px_20px_rgba(34,197,94,0.3)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isOrganicCompoundLoading ? 'جاري البناء...' : 'بناء المركب 🌿'}
                    </button>
                </div>
            </div>
        )}

        {currentMode === 'biochemistry' && (
            <div className="space-y-6 animate-slide-up">
                <input id="bio-in" type="text" placeholder="جزيء حيوي..." className="w-full p-4 text-xs rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-pink-500/10 transition-all shadow-sm font-bold" />
                <button onClick={() => wrapAction(onBiomoleculeGenerate, (document.getElementById('bio-in') as HTMLInputElement).value)} className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white p-4 text-xs rounded-2xl font-black transition-all shadow-xl active:scale-95">
                    توليد الجزيء 🧬
                </button>
            </div>
        )}

        {currentMode === 'electrochemistry' && (
            <div className="space-y-6 animate-slide-up">
                <div className="bg-white dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                    <input id="m1" placeholder="المصعد (Anode - Zn)" className="w-full p-3.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold" />
                    <input id="m2" placeholder="المهبط (Cathode - Cu)" className="w-full p-3.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold" />
                    <button onClick={() => wrapAction(onGalvanicCellSimulate, (document.getElementById('m1') as HTMLInputElement).value, (document.getElementById('m2') as HTMLInputElement).value)} className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white p-4 text-xs rounded-2xl font-black transition-all shadow-xl active:scale-95">
                        بناء الخلية ⚡️
                    </button>
                </div>
            </div>
        )}

        {currentMode === 'thermochemistry' && (
            <div className="space-y-6 animate-slide-up">
                <input id="thermo-in" type="text" placeholder="المعادلة (H2 + O2)..." className="w-full p-4 text-xs rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none font-bold shadow-sm" />
                <button onClick={() => wrapAction(onThermoAnalyze, (document.getElementById('thermo-in') as HTMLInputElement).value)} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-4 text-xs rounded-2xl font-black transition-all shadow-xl active:scale-95">
                    تحليل حراري 🔥
                </button>
            </div>
        )}

        {currentMode === 'solution' && (
            <div className="space-y-6 animate-slide-up">
                <div className="bg-white dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">المادة المذابة</label>
                        <input id="solute" placeholder="المذاب (مثل ملح الطعام)" className="w-full p-3.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold" />
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">المادة المذيبة</label>
                        <input id="solvent" placeholder="المذيب (مثل الماء)" className="w-full p-3.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold" />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2 px-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">التركيز (M)</label>
                            <span className="text-[10px] font-bold text-blue-500">{molarity} M</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="10" 
                            step="0.1"
                            value={molarity}
                            onChange={(e) => setMolarity(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                        />
                    </div>
                    <button 
                        onClick={() => wrapAction(onSolutionAnalyze, (document.getElementById('solute') as HTMLInputElement).value, (document.getElementById('solvent') as HTMLInputElement).value, molarity)} 
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 text-xs rounded-2xl font-black transition-all shadow-xl active:scale-95"
                    >
                        {isSolutionLoading ? 'جاري التحليل...' : 'تحليل المحلول 💧'}
                    </button>
                </div>
            </div>
        )}

        {currentMode === 'batteries' && (
            <div className="space-y-6 animate-slide-up">
                <div className="bg-white/50 dark:bg-slate-800/20 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm max-h-[380px] overflow-y-auto scrollbar-hide">
                    <div className="grid grid-cols-1 gap-3">
                        {BATTERY_PRESETS.map((battery) => (
                            <button 
                                key={battery.id} 
                                onClick={() => wrapAction(onBatterySimulate, battery.name)}
                                className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-lime-500/10 hover:border-lime-500/50 text-right transition-all group"
                            >
                                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">🔋</span>
                                <div className="flex-1 overflow-hidden">
                                    <div className="text-[10px] font-black text-slate-800 dark:text-slate-100 truncate">{battery.name}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {currentMode === 'history' && (
            <div className="space-y-6 animate-slide-up">
                <input id="hist-in" type="text" placeholder="موضوع تاريخي..." className="w-full p-4 text-xs rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none font-bold shadow-sm" />
                <button onClick={() => wrapAction(onHistoryExplore, (document.getElementById('hist-in') as HTMLInputElement).value)} className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white p-4 text-xs rounded-2xl font-black transition-all shadow-xl active:scale-95">
                    استكشاف التاريخ 📜
                </button>
            </div>
        )}

        {currentMode === 'compounds' && (
            <div className="space-y-4 animate-slide-up">
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-[10px] text-slate-600 dark:text-emerald-100/80 leading-relaxed shadow-sm font-bold flex flex-col items-center text-center gap-3">
                    <span className="text-3xl">🧪</span>
                    <p>اختر متفاعلين من المكتبة لبدء التفاعل الكيميائي.</p>
                </div>
            </div>
        )}
      </div>

      <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md">
         <p className="text-center text-[8px] text-slate-400 font-black tracking-widest uppercase opacity-40">ElementX Intelligence</p>
      </div>
    </div>
  );
};
