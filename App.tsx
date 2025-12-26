
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ReactionCanvas } from './components/ReactionCanvas';
import { MoleculeInfoCard } from './components/MoleculeInfoCard';
import { CompoundReactionResult } from './components/CompoundReactionResult';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ReactionSelection } from './components/ReactionSelection';
import { OrganicCompoundInfoCard } from './components/HydrocarbonInfoCard';
import { BiomoleculeInfoCard } from './components/BiomoleculeInfoCard';
import { GalvanicCellCard } from './components/GalvanicCellCard';
import { ThermoChemistryCard } from './components/ThermoChemistryCard';
import { SolutionChemistryCard } from './components/SolutionChemistryCard';
import { BatteryInfoCard } from './components/BatteryInfoCard';
import { HistoryTimelineCard } from './components/HistoryTimelineCard';
import { CompoundSelector } from './components/CompoundSelector';
import { LocalAILab } from './components/LocalAILab';
import { ATOMS } from './constants';
import type { Atom, Reaction, CompoundReaction, OrganicCompoundInfo, BiomoleculeInfo, GalvanicCellInfo, ThermoChemistryInfo, SolutionChemistryInfo, BatteryInfo, HistoryInfo } from './types';

type AppState = 'welcome' | 'simulation';
type SimulationMode = 'atoms' | 'compounds' | 'organic' | 'biochemistry' | 'electrochemistry' | 'thermochemistry' | 'solution' | 'batteries' | 'history' | 'ai-lab';
type Theme = 'light' | 'dark';

const MODE_NAMES: Record<SimulationMode, string> = {
    'atoms': 'كيمياء الذرات والأيونات',
    'compounds': 'تفاعلات المركبات الكيميائية',
    'organic': 'الكيمياء العضوية',
    'biochemistry': 'الكيمياء الحيوية',
    'electrochemistry': 'الكيمياء الكهربائية',
    'thermochemistry': 'الكيمياء الحرارية',
    'solution': 'كيمياء المحاليل والتركيزات',
    'batteries': 'تكنولوجيا البطاريات وتخزين الطاقة',
    'history': 'تاريخ الكيمياء والعلماء',
    'ai-lab': 'مختبر الحوسبة الكيميائية الذكي'
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('atoms');
  const [theme, setTheme] = useState<Theme>('light');
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  
  const [placedAtoms, setPlacedAtoms] = useState<Atom[]>([]);
  const [foundReactions, setFoundReactions] = useState<Reaction[] | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [compoundReactionResult, setCompoundReactionResult] = useState<CompoundReaction | null>(null);
  const [reactant1, setReactant1] = useState('');
  const [reactant2, setReactant2] = useState('');

  // Data States
  const [organicInfo, setOrganicInfo] = useState<OrganicCompoundInfo | null>(null);
  const [organicInfo2, setOrganicInfo2] = useState<OrganicCompoundInfo | null>(null);
  const [biomoleculeInfo, setBiomoleculeInfo] = useState<BiomoleculeInfo | null>(null);
  const [biomoleculeInfo2, setBiomoleculeInfo2] = useState<BiomoleculeInfo | null>(null);
  const [galvanicInfo, setGalvanicInfo] = useState<GalvanicCellInfo | null>(null);
  const [galvanicInfo2, setGalvanicInfo2] = useState<GalvanicCellInfo | null>(null);
  const [thermoInfo, setThermoInfo] = useState<ThermoChemistryInfo | null>(null);
  const [thermoInfo2, setThermoInfo2] = useState<ThermoChemistryInfo | null>(null);
  const [solutionInfo, setSolutionInfo] = useState<SolutionChemistryInfo | null>(null);
  const [solutionInfo2, setSolutionInfo2] = useState<SolutionChemistryInfo | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo | null>(null);
  const [batteryInfo2, setBatteryInfo2] = useState<BatteryInfo | null>(null);
  const [historyInfo, setHistoryInfo] = useState<HistoryInfo | null>(null);
  const [historyInfo2, setHistoryInfo2] = useState<HistoryInfo | null>(null);

  const atomIdCounter = useRef(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const callGeminiAI = async (prompt: string, systemInstruction: string, schema?: any) => {
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt,
              config: {
                  systemInstruction: systemInstruction + " \nهام جداً: يجب أن تكون الإجابة باللغة العربية الفصحى وبصيغة JSON صالحة تماماً. استخدم الفاصلة الإنجليزية (,) فقط كفاصل بين العناصر في JSON، ولا تستخدم الفاصلة العربية (،) أبداً كجزء من بنية الكود.",
                  responseMimeType: "application/json",
                  responseSchema: schema
              },
          });
          
          let text = response.text || '';
          if (!text) return {};
          
          text = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const sanitizedText = text.replace(/،/g, ',');
          
          try {
              return JSON.parse(sanitizedText);
          } catch (jsonErr) {
              const match = sanitizedText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
              if (match) return JSON.parse(match[0]);
              throw jsonErr;
          }
      } catch (err: any) {
          setError("فشل في تحليل البيانات كيميائياً. يرجى المحاولة مرة أخرى.");
          return null;
      }
  };

  const generateMockImage = (query: string): string => {
      return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(query || 'chemical')}`;
  };

  const handleAnalyzeBonds = async () => {
    if (placedAtoms.length < 1) return;
    setIsLoading(true);
    setError(null);
    try {
        const atomSymbols = placedAtoms.map(a => a.symbol).join(', ');
        const sys = `تحليل كيميائي عميق باللغة العربية للذرات: ${atomSymbols}.`;
        const data = await callGeminiAI(`حلل تفاعل الذرات [${atomSymbols}]`, sys);
        if (data) {
            const reactions = Array.isArray(data) ? data : (data.reactions || []);
            setFoundReactions(reactions.slice(0, 2));
        }
    } catch (e) {
        setError("فشل تحليل الروابط الذرية.");
    }
    setIsLoading(false);
  };

  const handleCompoundReaction = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const sys = `محاكاة تفاعل كيميائي شامل باللغة العربية.`;
        const data = await callGeminiAI(`تفاعل ${reactant1} مع ${reactant2}`, sys);
        if (data && data.balancedEquation) {
            data.environmentalImpactImage = generateMockImage(data.balancedEquation);
            setCompoundReactionResult(data);
        } else if (data) {
            setError("لم يتم التعرف على تفاعل صالح.");
        }
    } catch (e) {
        setError("فشل إتمام التفاعل.");
    }
    setIsLoading(false);
  };

  const handleOrganicSearch = async (q: string, isSecond: boolean = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const sys = `تحليل كيمياء عضوية شامل باللغة العربية.`;
        const data = await callGeminiAI(q, sys);
        if (data && data.name) {
            data.lewisStructureImage = generateMockImage(data.formula);
            isSecond ? setOrganicInfo2(data) : setOrganicInfo(data);
        }
      } catch (e) { }
      setIsLoading(false);
  };

  const handleBiomoleculeGenerate = async (name: string, isSecond: boolean = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const sys = `تحليل كيمياء حيوية شامل باللغة العربية.`;
        const data = await callGeminiAI(name, sys);
        if (data && data.name) {
            data.structureImage = generateMockImage(data.name);
            isSecond ? setBiomoleculeInfo2(data) : setBiomoleculeInfo(data);
        }
      } catch (e) { }
      setIsLoading(false);
  };

  const handleGalvanicSimulate = async (m1: string, m2: string, isSecond: boolean = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const sys = `محاكاة كهروكيميائية شاملة باللغة العربية.`;
        const data = await callGeminiAI(`${m1} and ${m2} cell`, sys);
        if (data && data.anode) {
            data.diagramImage = generateMockImage("galvanic");
            isSecond ? setGalvanicInfo2(data) : setGalvanicInfo(data);
        }
      } catch (e) { }
      setIsLoading(false);
  };

  const handleThermoAnalyze = async (eq: string, isSecond: boolean = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const sys = `تحليل ثيرموديناميكي شامل باللغة العربية.`;
        const data = await callGeminiAI(eq, sys);
        if (data && data.equation) {
            data.energyProfileImage = generateMockImage("thermo");
            isSecond ? setThermoInfo2(data) : setThermoInfo(data);
        }
      } catch (e) { }
      setIsLoading(false);
  };

  const handleSolutionAnalyze = async (s: string, sv: string, c: number, isSecond: boolean = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const sys = `تحليل محاليل شامل باللغة العربية.`;
        const data = await callGeminiAI(`${s} in ${sv}`, sys);
        if (data && data.soluteName) {
            data.solutionImage = generateMockImage("solution");
            isSecond ? setSolutionInfo2(data) : setSolutionInfo(data);
        }
      } catch (e) { }
      setIsLoading(false);
  };

  const handleBatterySimulate = async (type: string, isSecond: boolean = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const sys = `تحليل تكنولوجيا بطاريات شامل باللغة العربية.`;
        const data = await callGeminiAI(type, sys);
        if (data && data.name) {
            data.diagramImage = generateMockImage("battery");
            isSecond ? setBatteryInfo2(data) : setBatteryInfo(data);
        }
      } catch (e) { }
      setIsLoading(false);
  };

  const handleHistoryExplore = async (topic: string, isSecond: boolean = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const sys = `تأريخ كيميائي شامل باللغة العربية.`;
        const data = await callGeminiAI(topic, sys);
        if (data && data.topic) {
            data.illustrationImage = generateMockImage("history");
            isSecond ? setHistoryInfo2(data) : setHistoryInfo(data);
        }
      } catch (e) { }
      setIsLoading(false);
  };

  const resetAll = () => {
      setOrganicInfo(null); setOrganicInfo2(null);
      setBiomoleculeInfo(null); setBiomoleculeInfo2(null);
      setGalvanicInfo(null); setGalvanicInfo2(null);
      setThermoInfo(null); setThermoInfo2(null);
      setSolutionInfo(null); setSolutionInfo2(null);
      setBatteryInfo(null); setBatteryInfo2(null);
      setHistoryInfo(null); setHistoryInfo2(null);
      setCompoundReactionResult(null);
      setFoundReactions(null); setSelectedReaction(null);
      setError(null);
  };

  const renderComparisonLayout = (info1: any, info2: any, CardComponent: any, emptyProps: any) => {
    if (!isComparisonMode) return info1 ? <CardComponent info={info1} onNew={() => resetAll()} /> : <EmptyState {...emptyProps} error={error} />;
    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-6 p-4 overflow-y-auto scrollbar-hide animate-fade-in">
            <div className="flex-1 min-w-[300px]">
                <div className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-2 px-6">العنصر الأول</div>
                {info1 ? <CardComponent info={info1} onNew={() => resetAll()} /> : <div className="h-64 bg-slate-100 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 rounded-[2.5rem] flex items-center justify-center text-slate-400 font-bold italic">في انتظار العنصر الأول...</div>}
            </div>
            <div className="w-px bg-slate-200 dark:bg-slate-700 hidden md:block my-20 opacity-30"></div>
            <div className="flex-1 min-w-[300px]">
                <div className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2 px-6">العنصر الثاني</div>
                {info2 ? <CardComponent info={info2} onNew={() => resetAll()} /> : <div className="h-64 bg-slate-100 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 rounded-[2.5rem] flex items-center justify-center text-slate-400 font-bold italic">في انتظار العنصر الثاني...</div>}
            </div>
        </div>
    );
  };

  if (appState === 'welcome') return <WelcomeScreen onStart={() => setAppState('simulation')} />;

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      <Header theme={theme} setTheme={setTheme} />
      <div className="flex flex-grow overflow-hidden relative">
        <Sidebar 
            atoms={ATOMS}
            onAtomClick={(id) => {
                const atom = ATOMS.find(a => a.id === id);
                if(atom && simulationMode === 'atoms') {
                    setPlacedAtoms(prev => [...prev, {...atom, instanceId: ++atomIdCounter.current, x: Math.random()*200+100, y: Math.random()*200+100}]);
                }
            }}
            onModeChange={(m) => { setSimulationMode(m); resetAll(); }}
            currentMode={simulationMode}
            isComparisonMode={isComparisonMode}
            setIsComparisonMode={setIsComparisonMode}
            reactant1={reactant1} setReactant1={setReactant1}
            reactant2={reactant2} setReactant2={setReactant2}
            onCompoundReact={handleCompoundReaction}
            onOrganicSearch={handleOrganicSearch}
            onBiomoleculeGenerate={handleBiomoleculeGenerate}
            onGalvanicCellSimulate={handleGalvanicSimulate}
            onThermoAnalyze={handleThermoAnalyze}
            onSolutionAnalyze={handleSolutionAnalyze}
            onBatterySimulate={handleBatterySimulate}
            onHistoryExplore={handleHistoryExplore}
            isOrganicCompoundLoading={isLoading} isBiomoleculeLoading={isLoading} isGalvanicCellLoading={isLoading}
            isThermoLoading={isLoading} isSolutionLoading={isLoading} isBatteryLoading={isLoading} isHistoryLoading={isLoading}
        />
        <main className="flex-grow bg-white dark:bg-[#0f172a] relative overflow-hidden transition-colors duration-500">
            {isLoading && <Loader modeName={MODE_NAMES[simulationMode]} />}
            <div className="w-full h-full overflow-y-auto scrollbar-hide">
                {simulationMode === 'ai-lab' && <div className="p-4"><LocalAILab /></div>}
                {simulationMode === 'atoms' && (
                    <div className="w-full h-full relative overflow-hidden flex flex-col">
                        <ReactionCanvas atoms={placedAtoms} isPaused={isLoading} pauseText="⚛️" canvasRef={canvasRef} onDrop={()=>{}} onDragOver={(e)=>e.preventDefault()} />
                        {error && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl z-50 text-[10px] font-bold animate-slide-up">
                                ⚠️ {error}
                            </div>
                        )}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-10">
                            <button onClick={() => setPlacedAtoms([])} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-white p-4 rounded-full shadow-xl">↺</button>
                            <button onClick={handleAnalyzeBonds} className="bg-cyan-500 text-white px-10 py-4 rounded-full font-bold shadow-2xl transition-all hover:scale-105 active:scale-95">تحليل الروابط</button>
                        </div>
                        {foundReactions && (
                            <ReactionSelection 
                                reactions={foundReactions} 
                                onSelect={(reaction) => {
                                    setSelectedReaction({...reaction, lewisStructure: generateMockImage(reaction.formula || "molecule")});
                                    setFoundReactions(null);
                                }} 
                                onCancel={() => setFoundReactions(null)} 
                            />
                        )}
                        {selectedReaction && <MoleculeInfoCard reaction={selectedReaction} onNewReaction={() => setSelectedReaction(null)} />}
                    </div>
                )}
                {simulationMode === 'organic' && renderComparisonLayout(organicInfo, organicInfo2, OrganicCompoundInfoCard, { icon: "🌿", title: "الكيمياء العضوية", desc: "استكشف المركبات العضوية وبنيتها عبر الذكاء الاصطناعي." })}
                {simulationMode === 'biochemistry' && renderComparisonLayout(biomoleculeInfo, biomoleculeInfo2, BiomoleculeInfoCard, { icon: "🧬", title: "الكيمياء الحيوية", desc: "تحليل الجزيئات الحيوية المعقدة." })}
                {simulationMode === 'electrochemistry' && renderComparisonLayout(galvanicInfo, galvanicInfo2, GalvanicCellCard, { icon: "⚡️", title: "الكيمياء الكهربائية", desc: "محاكاة الخلايا الجلفانية والجهد." })}
                {simulationMode === 'thermochemistry' && renderComparisonLayout(thermoInfo, thermoInfo2, ThermoChemistryCard, { icon: "🔥", title: "الكيمياء الحرارية", desc: "دراسة تغيرات الإنثالبي والطاقة." })}
                {simulationMode === 'solution' && renderComparisonLayout(solutionInfo, solutionInfo2, SolutionChemistryCard, { icon: "💧", title: "كيمياء المحاليل", desc: "تحليل التركيزات والخواص الجامعة." })}
                {simulationMode === 'batteries' && renderComparisonLayout(batteryInfo, batteryInfo2, BatteryInfoCard, { icon: "🔋", title: "تكنولوجيا البطاريات", desc: "استكشاف ميكانيكا تخزين الطاقة." })}
                {simulationMode === 'history' && renderComparisonLayout(historyInfo, historyInfo2, HistoryTimelineCard, { icon: "📜", title: "تاريخ الكيمياء", desc: "رحلة عبر الزمن في عالم العلم." })}
                {simulationMode === 'compounds' && (
                    compoundReactionResult 
                    ? <div className="p-4"><CompoundReactionResult reaction={compoundReactionResult} onNewReaction={() => setCompoundReactionResult(null)} /></div>
                    : <CompoundSelector reactant1={reactant1} reactant2={reactant2} setReactant1={setReactant1} setReactant2={setReactant2} isLoading={isLoading} error={error} onStartReaction={handleCompoundReaction} />
                )}
            </div>
        </main>
      </div>
    </div>
  );
};

const Loader = ({ modeName }: { modeName: string }) => (
    <div className="absolute inset-0 bg-white/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
        <div className="text-center p-10 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full">
            <div className="text-7xl mb-6 animate-bounce">🧪</div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white mb-1">جاري تحليل البيانات...</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full animate-pulse bg-cyan-500"></span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">ElementX Intelligence Engine</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/50 py-3 px-6 rounded-2xl mb-6 border border-slate-200/50 dark:border-slate-700/50 text-sm font-black text-cyan-600 dark:text-cyan-400">
                {modeName}
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 animate-[loading_1.5s_infinite]"></div>
            </div>
        </div>
    </div>
);

const EmptyState = ({ icon, title, desc, error }: { icon: string, title: string, desc: string, error?: string | null }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in space-y-6">
        <span className="text-6xl mb-2 grayscale opacity-40">{icon}</span>
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed text-sm">{desc}</p>
        {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl text-[10px] font-bold border border-red-500/20 max-w-xs">⚠️ {error}</div>}
    </div>
);

export default App;
