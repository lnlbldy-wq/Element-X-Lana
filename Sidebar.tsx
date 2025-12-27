
import React, { useState } from 'react';
import type { Atom } from '../types';
import { COMMON_COMPOUNDS, ORGANIC_FAMILIES, ORGANIC_SUBSTITUENTS, BIO_SUGGESTIONS, ELECTRODES, SUGGESTIONS } from '../constants';

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
  onSolutionAnalyze: (s: string, sv: string, m: number) => void;
  onBatterySimulate: (type: string) => void;
  onHistoryExplore: (topic: string) => void;
  reactant1: string; setReactant1: (v: string) => void;
  reactant2: string; setReactant2: (v: string) => void;
  onCompoundReact: () => void;
  isComparisonMode: boolean;
  setIsComparisonMode: (v: boolean) => void;
}

// Reusable UI components matching the screenshots' exact style
const StyledLabel: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <label className="block text-right text-[13px] text-slate-400 font-medium mb-2 pr-1">{children}</label>
);

const CustomSelect = ({ value, onChange, options }: { value: string, onChange: (v: string) => void, options: string[] }) => (
  <div className="relative mb-4">
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#2a3447] border border-slate-700/40 rounded-xl p-4 text-sm font-bold text-white text-right outline-none appearance-none cursor-pointer focus:border-cyan-500/50 transition-colors shadow-inner"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
      <div className="flex flex-col items-center justify-center -space-y-1">
        <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M19 9l-7 7-7-7"></path></svg>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  </div>
);

const GreenActionBtn = ({ text, onClick }: { text: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.97] mt-4"
  >
    {text}
  </button>
);

const PillToggle = ({ isRight, leftLabel, rightLabel, onToggle }: { isRight: boolean, leftLabel: string, rightLabel: string, onToggle: (val: boolean) => void }) => (
  <div className="flex bg-[#232d40] p-1.5 rounded-full mb-10 max-w-[200px] mx-auto border border-slate-700/30">
    <button 
        onClick={() => onToggle(false)}
        className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${!isRight ? 'bg-[#35435a] text-white' : 'text-slate-400'}`}
    >{leftLabel}</button>
    <button 
        onClick={() => onToggle(true)}
        className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${isRight ? 'bg-[#35435a] text-white' : 'text-slate-400'}`}
    >{rightLabel}</button>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const { atoms, onAtomClick, onModeChange, currentMode, reactant1, setReactant1, reactant2, setReactant2, onCompoundReact, isComparisonMode, setIsComparisonMode } = props;
  const [searchTerm, setSearchTerm] = useState('');
  
  const [organicCarbons, setOrganicCarbons] = useState(1);
  const [organicFamily, setOrganicFamily] = useState(ORGANIC_FAMILIES[0]);
  const [organicSubstituent, setOrganicSubstituent] = useState(ORGANIC_SUBSTITUENTS[0]);
  const [electrode1, setElectrode1] = useState(ELECTRODES[0]);
  const [electrode2, setElectrode2] = useState(ELECTRODES[1]);
  const [thermoEquation, setThermoEquation] = useState('2H2(g) + O2(g) -> 2H2O(l)');
  const [solute, setSolute] = useState('NaCl');
  const [solvent, setSolvent] = useState('H2O');
  const [molarity, setMolarity] = useState(1.0);
  const [batteryType, setBatteryType] = useState(SUGGESTIONS.batteries[0]);
  const [historyTopic, setHistoryTopic] = useState('');

  const filteredAtoms = atoms.filter(a => 
    a.name.includes(searchTerm) || a.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full bg-[#1a2333] border-l border-slate-800 flex flex-col w-[340px] shrink-0 z-30 shadow-2xl overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* Navigation Icons Bar */}
      <div className="p-3 grid grid-cols-5 gap-1.5 border-b border-slate-800 bg-[#161d2b]">
        {[
          { mode: 'atoms', emoji: '⚛️', label: 'الذرات' },
          { mode: 'compounds', emoji: '🧪', label: 'المركبات' },
          { mode: 'organic', emoji: '🌿', label: 'العضوية' },
          { mode: 'biochemistry', emoji: '🧬', label: 'الحيوية' },
          { mode: 'electrochemistry', emoji: '⚡️', label: 'الكهرباء' },
          { mode: 'thermochemistry', emoji: '🔥', label: 'الحرارة' },
          { mode: 'solution', emoji: '💧', label: 'المحاليل' },
          { mode: 'batteries', emoji: '🔋', label: 'البطاريات' },
          { mode: 'history', emoji: '📜', label: 'التاريخ' },
          { mode: 'ai-lab', emoji: '🤖', label: 'الذكاء' }
        ].map((m) => (
           <button
             key={m.mode}
             onClick={() => onModeChange(m.mode as SimulationMode)}
             className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${currentMode === m.mode ? 'bg-cyan-500 text-slate-900 scale-105 shadow-cyan-500/20 shadow-lg' : 'opacity-40 hover:opacity-100 hover:bg-slate-800'}`}
           >
             <span className="text-xl">{m.emoji}</span>
             <span className="text-[8px] font-black uppercase mt-1 leading-none">{m.label}</span>
           </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col scrollbar-hide">
        
        {currentMode === 'organic' && (
          <div className="animate-fade-in flex flex-col">
            <h2 className="text-[28px] font-bold text-white text-center mb-6">الكيمياء العضوية</h2>
            
            <PillToggle 
              isRight={isComparisonMode} 
              leftLabel="فردي" 
              rightLabel="مقارنة" 
              onToggle={setIsComparisonMode} 
            />

            <div className="bg-[#1f293b] border border-slate-700/40 rounded-3xl p-8 space-y-6 shadow-2xl relative">
              <h3 className="text-center text-[16px] font-bold text-slate-200 -mt-2">اختر المركب</h3>
              
              <div>
                <StyledLabel>العائلة</StyledLabel>
                <CustomSelect value={organicFamily} onChange={setOrganicFamily} options={ORGANIC_FAMILIES} />
              </div>

              <div>
                <StyledLabel>المجموعة الوظيفية البديلة</StyledLabel>
                <CustomSelect value={organicSubstituent} onChange={setOrganicSubstituent} options={ORGANIC_SUBSTITUENTS} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[13px] font-bold">
                   <span className="text-white">{organicCarbons}</span>
                   <span className="text-slate-400">عدد ذرات الكربون:</span>
                </div>
                <input 
                  type="range" min="1" max="20" value={organicCarbons} 
                  onChange={(e) => setOrganicCarbons(parseInt(e.target.value))}
                  className="w-full accent-white h-1.5 bg-[#2a3447] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            <GreenActionBtn text="إنشاء المركب" onClick={() => props.onOrganicSearch(`${organicFamily} بـ ${organicCarbons} ذرة كربون ومع مجموعة ${organicSubstituent}`)} />
          </div>
        )}

        {currentMode === 'biochemistry' && (
          <div className="animate-fade-in text-right">
            <h2 className="text-[28px] font-bold text-white text-center mb-5 tracking-tight">الكيمياء الحيوية</h2>
            <p className="text-[14px] text-slate-400 text-center leading-relaxed mb-12">اختر جزيئاً حيوياً شائعاً من القوائم أدناه لعرض معلومات مفصلة عنه.</p>
            
            <div className="space-y-10">
              {[
                { title: 'كربوهيدرات', items: BIO_SUGGESTIONS.carbs },
                { title: 'بروتينات (أحماض أمينية)', items: BIO_SUGGESTIONS.proteins },
                { title: 'دهون وأشباهها', items: BIO_SUGGESTIONS.fats }
              ].map(cat => (
                <div key={cat.title}>
                  <h4 className="text-[16px] font-bold text-slate-200 mb-4">{cat.title}</h4>
                  <div className="flex flex-wrap gap-2.5 justify-end">
                    {cat.items.map(item => (
                      <button 
                        key={item} 
                        onClick={() => props.onBiomoleculeGenerate(item)}
                        className="px-5 py-2 bg-[#2a3447] border border-slate-700/30 rounded-full text-[13px] font-bold text-slate-300 hover:bg-[#35435a] hover:text-white transition-all active:scale-95 shadow-md"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentMode === 'electrochemistry' && (
          <div className="animate-fade-in">
            <h2 className="text-[28px] font-bold text-white text-center mb-5">الكيمياء الكهربائية</h2>
            <p className="text-[14px] text-slate-400 text-center leading-relaxed mb-12">اختر قطبين لبناء خلية جلفانية ومحاكاة عملها.</p>
            
            <StyledLabel>القطب 1 (المصعد المحتمل)</StyledLabel>
            <CustomSelect value={electrode1} onChange={setElectrode1} options={ELECTRODES} />

            <StyledLabel>القطب 2 (المهبط المحتمل)</StyledLabel>
            <CustomSelect value={electrode2} onChange={setElectrode2} options={ELECTRODES} />
            
            <GreenActionBtn text="بناء الخلية" onClick={() => props.onGalvanicCellSimulate(electrode1, electrode2)} />
          </div>
        )}

        {currentMode === 'thermochemistry' && (
          <div className="animate-fade-in">
            <h2 className="text-[28px] font-bold text-white text-center mb-5">الكيمياء الحرارية</h2>
            <p className="text-[14px] text-slate-400 text-center leading-relaxed mb-12">أدخل معادلة كيميائية موزونة لتحليل تغيرات الطاقة المصاحبة لها.</p>
            
            <StyledLabel>المعادلة الكيميائية</StyledLabel>
            <textarea 
              value={thermoEquation}
              onChange={(e) => setThermoEquation(e.target.value)}
              className="w-full h-44 bg-[#2a3447] border border-slate-700/40 rounded-3xl p-6 text-[15px] font-mono text-white outline-none resize-none focus:border-cyan-500/50 transition-all text-center leading-relaxed mb-6 shadow-inner"
            />
            
            <GreenActionBtn text="تحليل التفاعل" onClick={() => props.onThermoAnalyze(thermoEquation)} />
          </div>
        )}

        {currentMode === 'solution' && (
          <div className="animate-fade-in">
            <h2 className="text-[28px] font-bold text-white text-center mb-5">كيمياء المحاليل</h2>
            <p className="text-[14px] text-slate-400 text-center leading-relaxed mb-12">اختر مذاباً ومذيباً وحدد التركيز لتحليل عملية الذوبان.</p>
            
            <StyledLabel>المذاب</StyledLabel>
            <CustomSelect value={solute} onChange={setSolute} options={['NaCl', 'KCl', 'NaOH', 'HCl', 'C6H12O6']} />

            <StyledLabel>المذيب</StyledLabel>
            <CustomSelect value={solvent} onChange={setSolvent} options={['H2O', 'Ethanol', 'Benzene']} />

            <div className="space-y-4 pt-4 mb-8">
              <div className="flex justify-between items-center text-[13px] font-bold">
                 <span className="text-white">M {molarity.toFixed(2)}</span>
                 <span className="text-slate-400">التركيز (مولار):</span>
              </div>
              <input 
                type="range" min="0.1" max="10.0" step="0.1" value={molarity} 
                onChange={(e) => setMolarity(parseFloat(e.target.value))}
                className="w-full accent-white h-1.5 bg-[#2a3447] rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <GreenActionBtn text="تحليل المحلول" onClick={() => props.onSolutionAnalyze(solute, solvent, molarity)} />
          </div>
        )}

        {currentMode === 'batteries' && (
          <div className="animate-fade-in">
            <h2 className="text-[28px] font-bold text-white text-center mb-5">البطاريات</h2>
            <p className="text-[14px] text-slate-400 text-center leading-relaxed mb-12">اختر نوع البطارية لتحليل مكوناتها الكيميائية وطريقة عملها بأسلوب علمي.</p>
            
            <StyledLabel>نوع البطارية</StyledLabel>
            <CustomSelect value={batteryType} onChange={setBatteryType} options={SUGGESTIONS.batteries} />
            
            <GreenActionBtn text="تحليل البطارية" onClick={() => props.onBatterySimulate(batteryType)} />
          </div>
        )}

        {currentMode === 'history' && (
          <div className="animate-fade-in text-right">
            <h2 className="text-[28px] font-bold text-white text-center mb-5">تاريخ الكيمياء</h2>
            <p className="text-[14px] text-slate-400 text-center leading-relaxed mb-10">استكشف السجل التاريخي لأعظم الاكتشافات والعلماء عبر العصور.</p>
            
            <div className="bg-[#1f293b] p-6 rounded-3xl border border-slate-700/40 mb-10 shadow-xl">
              <StyledLabel>بحث في التاريخ</StyledLabel>
              <input 
                type="text" 
                value={historyTopic}
                onChange={(e) => setHistoryTopic(e.target.value)}
                placeholder="اكتب اسم عالم أو اكتشاف..."
                className="w-full bg-[#2a3447] border border-slate-700/40 rounded-xl p-4 text-sm font-bold text-white text-right outline-none focus:border-cyan-500/50 transition-all shadow-inner"
              />
            </div>

            <h4 className="text-[15px] font-bold text-slate-300 mb-4">اقتراحات سريعة</h4>
            <div className="flex flex-wrap gap-2 justify-end mb-8">
              {SUGGESTIONS.history.map(item => (
                <button 
                  key={item} 
                  onClick={() => { setHistoryTopic(item); props.onHistoryExplore(item); }}
                  className="px-4 py-2 bg-[#2a3447] border border-slate-700/30 rounded-lg text-[12px] font-bold text-slate-400 hover:text-white transition-all shadow-md active:scale-95"
                >
                  {item}
                </button>
              ))}
            </div>

            <GreenActionBtn text="استرجاع التاريخ" onClick={() => props.onHistoryExplore(historyTopic)} />
          </div>
        )}

        {currentMode === 'ai-lab' && (
          <div className="animate-fade-in text-center flex flex-col items-center py-10">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 animate-pulse">
                <span className="text-5xl">🤖</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">مختبر الذكاء الاصطناعي</h2>
            <p className="text-[14px] text-slate-400 leading-relaxed px-6 font-medium">
                اسأل أي سؤال كيميائي مفتوح، وسأقوم بتحليله باستخدام نماذج Gemini المتطورة لتقديم إجابات رصينة ودقيقة.
            </p>
          </div>
        )}

        {/* Traditional Atoms & Compounds Modes */}
        {currentMode === 'atoms' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-white text-center mb-6">الجدول الدوري</h2>
            <input 
                type="text" placeholder="بحث في العناصر..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-4 text-sm rounded-2xl bg-[#2a3447] border border-slate-700/40 focus:border-cyan-500/50 outline-none font-bold text-white text-right mb-8 shadow-inner"
            />
            <div className="grid grid-cols-3 gap-3">
                {filteredAtoms.map(a => (
                    <button key={a.id} onClick={() => onAtomClick(a.id)} className="flex flex-col items-center gap-2 p-2 bg-[#1f293b]/50 rounded-xl border border-transparent hover:border-cyan-500/30 transition-all active:scale-95 group shadow-sm">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black shadow-lg text-lg transition-transform group-hover:scale-110 ${a.color} ${a.textColor}`}>{a.symbol}</div>
                        <span className="text-[10px] font-bold text-slate-300 truncate w-full text-center">{a.name}</span>
                    </button>
                ))}
            </div>
          </div>
        )}

        {currentMode === 'compounds' && (
          <div className="animate-fade-in flex flex-col">
            <h2 className="text-2xl font-bold text-white text-center mb-6">المركبات الكيميائية</h2>
            <div className="space-y-2 mb-8 max-h-[350px] overflow-y-auto scrollbar-hide bg-[#161d2b]/50 rounded-3xl p-3 border border-slate-800 shadow-inner">
                {COMMON_COMPOUNDS.map(c => (
                    <button key={c.formula} onClick={() => { if(!reactant1) setReactant1(c.formula); else setReactant2(c.formula); }} className="w-full p-4 rounded-2xl border border-slate-700 bg-[#1f293b] text-right flex items-center justify-between hover:border-cyan-500/30 transition-all group shadow-sm">
                        <span className="font-bold text-slate-200 text-xs">{c.name}</span>
                        <span className="font-mono text-cyan-400 text-[11px] font-black">{c.formula}</span>
                    </button>
                ))}
            </div>
            <div className="space-y-4 pt-6 border-t border-slate-800">
                <input type="text" value={reactant1} onChange={(e) => setReactant1(e.target.value)} placeholder="المتفاعل الأول" className="w-full px-5 py-4 text-sm rounded-2xl bg-[#2a3447] border border-slate-700/40 outline-none text-right font-black text-white shadow-inner" />
                <input type="text" value={reactant2} onChange={(e) => setReactant2(e.target.value)} placeholder="المتفاعل الثاني" className="w-full px-5 py-4 text-sm rounded-2xl bg-[#2a3447] border border-slate-700/40 outline-none text-right font-black text-white shadow-inner" />
                <GreenActionBtn text="تحليل التفاعل ⚡" onClick={onCompoundReact} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
