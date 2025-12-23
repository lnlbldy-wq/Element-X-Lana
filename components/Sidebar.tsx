
import React, { useState } from 'react';
import type { Atom } from '../types';
import { BATTERY_PRESETS, ORGANIC_PRESETS, COMMON_COMPOUNDS } from '../constants';

type SimulationMode = 'atoms' | 'compounds' | 'organic' | 'biochemistry' | 'electrochemistry' | 'thermochemistry' | 'solution' | 'batteries' | 'history' | 'ai-lab';

interface SidebarProps {
  atoms: Omit<Atom, 'instanceId' | 'x' | 'y'>[];
  onAtomClick: (atomId: string) => void;
  onModeChange: (mode: SimulationMode) => void;
  currentMode: SimulationMode;
  onOrganicSearch: (q: string) => void;
  onBiomoleculeGenerate: (name: string) => void;
  onGalvanicCellSimulate: (m1: string, m2: string) => void;
  onThermoAnalyze: (eq: string) => void;
  onSolutionAnalyze: (s: string, sv: string, c: number) => void;
  onBatterySimulate: (type: string) => void;
  onHistoryExplore: (topic: string) => void;
  reactant1: string; setReactant1: (v: string) => void;
  reactant2: string; setReactant2: (v: string) => void;
  onCompoundReact: (r1: string, r2: string) => void;
  isCompoundLoading: boolean;
  isOrganicCompoundLoading: boolean;
  isBiomoleculeLoading: boolean;
  isGalvanicCellLoading: boolean;
  isThermoLoading: boolean;
  isSolutionLoading: boolean;
  isBatteryLoading: boolean;
  isHistoryLoading: boolean;
}

const modes = [
  { mode: 'ai-lab', label: 'المختبر الذكي', emoji: '🤖', color: 'text-cyan-400' },
  { mode: 'atoms', label: 'الذرات', emoji: '⚛️', color: 'text-purple-400' },
  { mode: 'compounds', label: 'المركبات', emoji: '🧪', color: 'text-emerald-400' },
  { mode: 'organic', label: 'العضوية', emoji: '🌿', color: 'text-green-400' },
  { mode: 'biochemistry', label: 'الحيوية', emoji: '🧬', color: 'text-pink-400' },
  { mode: 'electrochemistry', label: 'الكهربائية', emoji: '⚡️', color: 'text-yellow-400' },
  { mode: 'thermochemistry', label: 'الحرارية', emoji: '🔥', color: 'text-orange-400' },
  { mode: 'solution', label: 'المحاليل', emoji: '💧', color: 'text-blue-400' },
  { mode: 'batteries', label: 'البطاريات', emoji: '🔋', color: 'text-lime-400' },
  { mode: 'history', label: 'التاريخ', emoji: '📜', color: 'text-amber-400' },
];

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const { 
    atoms, onAtomClick, onModeChange, currentMode, onOrganicSearch, 
    onBiomoleculeGenerate, onGalvanicCellSimulate, onThermoAnalyze, 
    onSolutionAnalyze, onBatterySimulate, onHistoryExplore
  } = props;

  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="h-full bg-[#1e293b] dark:bg-[#0f172a] border-l border-slate-700/50 flex flex-col shadow-2xl z-20 w-80 shrink-0">
      <div className="p-4 grid grid-cols-2 gap-2 border-b border-slate-700/50">
        {modes.map((m) => (
           <button
             key={m.mode}
             onClick={() => onModeChange(m.mode as SimulationMode)}
             className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${currentMode === m.mode ? 'bg-slate-700/50 ring-1 ring-cyan-500/50 shadow-lg' : 'opacity-60 hover:opacity-100'}`}
           >
             <span className={`text-xl mb-1`}>{m.emoji}</span>
             <span className={`text-[10px] font-bold text-slate-300`}>{m.label}</span>
           </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 scrollbar-hide">
        {currentMode === 'ai-lab' && (
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-white mb-2">تعليمات المختبر</h2>
                <div className="p-4 bg-cyan-600/10 border border-cyan-500/30 rounded-2xl text-[10px] text-slate-300 space-y-2">
                    <p>🤖 يمكنك سؤال المختبر عن أي مفهوم كيميائي معقد.</p>
                    <p>🧪 اطلب تفسير آليات التفاعلات والروابط الجزيئية.</p>
                    <p>📝 اطلب اختبارات قصيرة (Quiz) لقياس مهاراتك الكيميائية.</p>
                </div>
            </div>
        )}

        {currentMode === 'atoms' && (
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="بحث بالاسم أو الرمز..." 
              onChange={(e)=>setSearchTerm(e.target.value)} 
              className="w-full p-2 text-xs rounded-xl bg-slate-800/50 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-cyan-500" 
            />
            <div className="grid grid-cols-3 gap-4">
              {atoms.filter(a => a.name.includes(searchTerm) || a.symbol.toLowerCase().includes(searchTerm.toLowerCase())).map(a => (
                <button key={a.id} onClick={() => onAtomClick(a.id)} className="flex flex-col items-center group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg mb-1 transition-transform group-active:scale-90 text-sm ${a.color}`}>
                    {a.symbol}
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold">{a.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentMode === 'organic' && (
            <div className="space-y-4">
                <input id="org-in" type="text" placeholder="اسم المركب (مثلاً: إيثانول)..." className="w-full p-2 text-xs rounded-xl bg-slate-800/50 border border-slate-700 text-white outline-none" />
                <button onClick={() => onOrganicSearch((document.getElementById('org-in') as HTMLInputElement).value)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white p-2 text-xs rounded-xl font-bold transition-all">تحليل</button>
                <div className="grid grid-cols-2 gap-2">
                    {ORGANIC_PRESETS.slice(0, 8).map(p => (
                        <button key={p.name} onClick={() => onOrganicSearch(p.name)} className="text-[9px] p-2 bg-slate-800/40 hover:bg-slate-700 rounded-lg text-slate-300 border border-slate-700">{p.name}</button>
                    ))}
                </div>
            </div>
        )}

        {currentMode === 'biochemistry' && (
            <div className="space-y-4">
                <input id="bio-in" type="text" placeholder="جزيء حيوي (مثلاً: جلوكوز)..." className="w-full p-2 text-xs rounded-xl bg-slate-800/50 border border-slate-700 text-white outline-none" />
                <button onClick={() => onBiomoleculeGenerate((document.getElementById('bio-in') as HTMLInputElement).value)} className="w-full bg-pink-600 hover:bg-pink-500 text-white p-2 text-xs rounded-xl font-bold transition-all">توليد</button>
            </div>
        )}

        {currentMode === 'electrochemistry' && (
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[9px] text-slate-500">القطب 1 (المصعد)</label>
                    <input id="m1" placeholder="مثلاً: Zn" className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white" />
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] text-slate-500">القطب 2 (المهبط)</label>
                    <input id="m2" placeholder="مثلاً: Cu" className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white" />
                </div>
                <button onClick={() => onGalvanicCellSimulate((document.getElementById('m1') as HTMLInputElement).value, (document.getElementById('m2') as HTMLInputElement).value)} className="w-full bg-yellow-600 hover:bg-yellow-500 text-white p-2 text-xs rounded-xl font-bold transition-all">بناء الخلية</button>
            </div>
        )}

        {currentMode === 'thermochemistry' && (
            <div className="space-y-4">
                <input id="thermo-in" type="text" placeholder="المعادلة (مثلاً: H2 + O2)..." className="w-full p-2 text-xs rounded-xl bg-slate-800/50 border border-slate-700 text-white outline-none" />
                <button onClick={() => onThermoAnalyze((document.getElementById('thermo-in') as HTMLInputElement).value)} className="w-full bg-orange-600 hover:bg-orange-500 text-white p-2 text-xs rounded-xl font-bold transition-all">تحليل حراري</button>
            </div>
        )}

        {currentMode === 'solution' && (
            <div className="space-y-3">
                <input id="sol-s" type="text" placeholder="المذاب (NaCl)..." className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white" />
                <input id="sol-v" type="text" placeholder="المذيب (H2O)..." className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white" />
                <input id="sol-c" type="number" placeholder="التركيز (M)..." className="w-full p-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white" />
                <button onClick={() => onSolutionAnalyze((document.getElementById('sol-s') as HTMLInputElement).value, (document.getElementById('sol-v') as HTMLInputElement).value, parseFloat((document.getElementById('sol-c') as HTMLInputElement).value))} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 text-xs rounded-xl font-bold transition-all">تكون المحلول</button>
            </div>
        )}

        {currentMode === 'batteries' && (
            <div className="space-y-1">
                {BATTERY_PRESETS.map(b => (
                    <button key={b.id} onClick={() => onBatterySimulate(b.name)} className="w-full p-2 bg-slate-800/40 hover:bg-slate-700 rounded-xl text-slate-300 border border-slate-700 text-right text-[9px]">
                        🔋 {b.name}
                    </button>
                ))}
            </div>
        )}

        {currentMode === 'history' && (
            <div className="space-y-4">
                <input id="hist-in" type="text" placeholder="موضوع (مثلاً: الجدول الدوري)..." className="w-full p-2 text-xs rounded-xl bg-slate-800/50 border border-slate-700 text-white outline-none" />
                <button onClick={() => onHistoryExplore((document.getElementById('hist-in') as HTMLInputElement).value)} className="w-full bg-amber-600 hover:bg-amber-500 text-white p-2 text-xs rounded-xl font-bold transition-all">استكشاف</button>
            </div>
        )}

        {currentMode === 'compounds' && (
            <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-[10px] text-slate-400 leading-relaxed">
                    💡 اختر المركبات من القائمة الرئيسية في المنتصف لبدء التفاعل الكيميائي.
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
