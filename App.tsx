
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
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

const STORAGE_KEY = 'elementx_workspace_data';

// Enhanced Utility for handling retries with aggressive exponential backoff for 429 errors
async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 5,
    initialDelay = 3000
): Promise<T> {
    let lastError: any;
    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            const errorMsg = (error.message || error.toString() || "").toLowerCase();
            const isQuotaError = errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('exhausted');
            const isServerError = errorMsg.includes('500') || errorMsg.includes('503') || errorMsg.includes('unavailable');
            
            if ((isQuotaError || isServerError) && i < maxRetries) {
                // For quota errors, we wait significantly longer
                const multiplier = isQuotaError ? 3 : 2;
                const delay = initialDelay * Math.pow(multiplier, i);
                console.warn(`[ElementX API] Quota or Server error. Retry ${i+1}/${maxRetries} in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
    throw lastError;
}

const parseResponse = (text: string | undefined) => {
    if (!text) return null;
    try {
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        let cleaned = codeBlockMatch ? codeBlockMatch[1] : text.trim();
        const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (jsonMatch) cleaned = jsonMatch[0];
        return JSON.parse(cleaned);
    } catch (e) {
        return null;
    }
};

const EmptyState = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in space-y-4">
        <span className="text-5xl mb-2 grayscale opacity-30">{icon}</span>
        <h2 className="text-lg font-bold text-slate-400">{title}</h2>
        <p className="text-slate-500 max-w-sm leading-relaxed text-xs">{desc}</p>
        <div className="flex items-center gap-2 text-cyan-500 font-bold animate-pulse mt-4">
            <span className="text-md">⬅️</span>
            <span className="text-[10px]">استخدم القائمة الجانبية للبدء</span>
        </div>
    </div>
);

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('atoms');
  const [theme, setTheme] = useState<Theme>('light');
  
  const [placedAtoms, setPlacedAtoms] = useState<Atom[]>([]);
  const [history, setHistory] = useState<Atom[][]>([]);
  const [foundReactions, setFoundReactions] = useState<Reaction[] | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [compoundReactionResult, setCompoundReactionResult] = useState<CompoundReaction | null>(null);
  const [reactant1, setReactant1] = useState('');
  const [reactant2, setReactant2] = useState('');

  const [organicInfo, setOrganicInfo] = useState<OrganicCompoundInfo | null>(null);
  const [biomoleculeInfo, setBiomoleculeInfo] = useState<BiomoleculeInfo | null>(null);
  const [galvanicInfo, setGalvanicInfo] = useState<GalvanicCellInfo | null>(null);
  const [thermoInfo, setThermoInfo] = useState<ThermoChemistryInfo | null>(null);
  const [solutionInfo, setSolutionInfo] = useState<SolutionChemistryInfo | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo | null>(null);
  const [historyInfo, setHistoryInfo] = useState<HistoryInfo | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const atomIdCounter = useRef(0);
  const imageCache = useRef<Record<string, string>>({});

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.appState) setAppState(data.appState);
        if (data.simulationMode) setSimulationMode(data.simulationMode);
        if (data.theme) setTheme(data.theme);
        if (data.placedAtoms) setPlacedAtoms(data.placedAtoms);
        if (data.history) setHistory(data.history);
        if (data.selectedReaction) setSelectedReaction(data.selectedReaction);
        if (data.compoundReactionResult) setCompoundReactionResult(data.compoundReactionResult);
        if (data.atomIdCounter) atomIdCounter.current = data.atomIdCounter;
        if (data.reactant1) setReactant1(data.reactant1);
        if (data.reactant2) setReactant2(data.reactant2);
      } catch (e) {
        console.error("Failed to restore session history", e);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      appState, simulationMode, theme, placedAtoms, history, selectedReaction,
      compoundReactionResult, atomIdCounter: atomIdCounter.current, reactant1, reactant2
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [appState, simulationMode, theme, placedAtoms, history, selectedReaction, compoundReactionResult, reactant1, reactant2]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const handleError = (e: any) => {
      console.error(e);
      const msg = (e.message || e.toString() || "").toLowerCase();
      if (msg.includes('429') || msg.includes('quota')) {
          setError("تجاوزت حد الطلبات (Quota). جاري محاولة الجدولة التلقائية، يرجى الانتظار قليلاً...");
      } else {
          setError("حدث خطأ في معالجة البيانات الكيميائية. يرجى المحاولة مرة أخرى.");
      }
  };

  const generateImage = async (prompt: string, type: 'lewis' | 'diagram' | '3d' = 'lewis'): Promise<string> => {
      const cacheKey = `${type}:${prompt}`;
      if (imageCache.current[cacheKey]) return imageCache.current[cacheKey];

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          let finalPrompt = "";
          if (type === 'lewis') finalPrompt = `Professional Lewis Dot Structure for ${prompt}. Crisp white background. Black ink lines. Educational textbook style.`;
          else if (type === '3d') finalPrompt = `3D photorealistic Ball-and-stick molecular model of ${prompt}. Studio lighting, white background.`;
          else finalPrompt = `Highly detailed scientific schematic diagram of ${prompt}.`;

          const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
              model: 'gemini-2.5-flash-image', 
              contents: { parts: [{ text: finalPrompt }] },
              config: { imageConfig: { aspectRatio: "1:1" } }
          }));

          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                  const b64 = `data:image/png;base64,${part.inlineData.data}`;
                  imageCache.current[cacheKey] = b64;
                  return b64;
              }
            }
          }
          return 'ERROR';
      } catch (e: any) { 
          handleError(e);
          return 'ERROR'; 
      }
  };

  const handleAnalyzeAtoms = async () => {
    if (placedAtoms.length < 2) return;
    setIsLoading(true);
    setError(null);
    try {
        const atomCounts = placedAtoms.reduce((acc, atom) => {
            acc[atom.symbol] = (acc[atom.symbol] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const atomString = Object.entries(atomCounts).map(([s, c]) => `${c} ${s}`).join(', ');
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `تحليل هذه الذرات: ${atomString}. أعطني 3 جزيئات مستقرة ممكنة بتنسيق JSON (مصفوفة). كل كائن يحتوي على: id, name, formula, emoji, commonality, explanation, balancedFormationEquation, formationBalancingSteps, academicContext, molarMass, state, molecularGeometry, molecularDensity, reactionType, bondType, hybridization, polarity, magneticDescription, crystalDescription, solubilityInWater, solubilityInOrganicSolvents, discoveryYear, discoverer, discoveryStory, applications, safety: {warnings, ghsSymbols}. استخدم العربية.`
        }));
        
        const result = parseResponse(response.text);
        if (result && Array.isArray(result)) setFoundReactions(result);
        else setError("عذراً، لم أستطع تحديد تفاعلات مستقرة حالياً.");
    } catch (e) {
        handleError(e);
    } finally { setIsLoading(false); }
  };

  const handleSelectReaction = async (reaction: Reaction) => {
    setSelectedReaction(reaction);
    setFoundReactions(null);
    if (!reaction.lewisStructure) {
      const img = await generateImage(reaction.formula, 'lewis');
      setSelectedReaction(prev => prev ? { ...prev, lewisStructure: img === 'ERROR' ? undefined : img } : null);
    }
  };

  const handleCompoundReaction = async (r1: string, r2: string) => {
    setIsLoading(true);
    setError(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `محاكاة تفاعل: ${r1} + ${r2}. أعطني JSON يحتوي على: balancedEquation, balancingSteps, academicContext, reactionType, explanation, colorChange, visualObservations, reactionConditions, thermodynamicNotes, kinetics: {rateLaw, activationEnergy, catalysisMechanism}, equilibrium: {kpKcExpression}, products (مصفوفة تحتوي على name, formula, state), safetyNotes, industrialApplications, ghsSymbols. استخدم العربية.`
        }));
        const result = parseResponse(response.text);
        if (result) {
            if (result.products && result.products.length > 0) {
                const img = await generateImage(result.products[0].formula, 'lewis');
                result.environmentalImpact = img;
            }
            setCompoundReactionResult(result);
        }
    } catch (e) { handleError(e); }
    finally { setIsLoading(false); }
  };

  const handleOrganicSearch = async (q: string) => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `تحليل المركب العضوي: ${q}. JSON: name, formula, family, description, uses, stateAtSTP, iupacNaming, boilingPoint, meltingPoint, solubility. العربية.`
        }));
        const data = parseResponse(response.text);
        if (data) {
            const img = await generateImage(data.formula, 'lewis');
            data.lewisStructureImage = img;
            setOrganicInfo(data);
        }
      } catch (e) { handleError(e); }
      setIsLoading(false);
  };

  const handleBiomoleculeGenerate = async (name: string) => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `تحليل الجزيء الحيوي: ${name}. JSON: name, formula, type, description, biologicalFunction, structureImage, uses. العربية.`
        }));
        const data = parseResponse(response.text);
        if (data) {
            const img = await generateImage(data.formula, '3d');
            data.structureImage = img;
            setBiomoleculeInfo(data);
        }
      } catch (e) { handleError(e); }
      setIsLoading(false);
  };

  const handleGalvanicSimulate = async (m1: string, m2: string) => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `خلية جلفانية بين ${m1} و ${m2}. JSON: anode: {metal, halfReaction, standardPotential}, cathode: {metal, halfReaction, standardPotential}, overallReaction, cellPotential, explanation. العربية.`
        }));
        const data = parseResponse(response.text);
        if (data) {
            const img = await generateImage(`Galvanic cell schematic`, 'diagram');
            data.diagramImage = img;
            setGalvanicInfo(data);
        }
      } catch (e) { handleError(e); }
      setIsLoading(false);
  };

  const handleThermoAnalyze = async (eq: string) => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `تحليل حراري للمعادلة: ${eq}. JSON: equation, enthalpyChange, isExothermic, explanation. العربية.`
        }));
        const data = parseResponse(response.text);
        if (data) {
            const img = await generateImage(`Energy profile graph`, 'diagram');
            data.energyProfileImage = img;
            setThermoInfo(data);
        }
      } catch (e) { handleError(e); }
      setIsLoading(false);
  };

  const handleSolutionAnalyze = async (s: string, sv: string, c: number) => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `محلول ${s} بتركيز ${c}M. JSON: soluteName, soluteFormula, solventName, concentrationMolarity, solutionDescription. العربية.`
        }));
        const data = parseResponse(response.text);
        if (data) {
            const img = await generateImage(`Solution molecule solvation`, 'diagram');
            data.solutionImage = img;
            setSolutionInfo(data);
        }
      } catch (e) { handleError(e); }
      setIsLoading(false);
  };

  const handleBatterySimulate = async (type: string) => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `تحليل بطارية: ${type}. JSON: name, nominalVoltage, applications. العربية.`
        }));
        const data = parseResponse(response.text);
        if (data) {
            const img = await generateImage(`${type} battery cross section`, 'diagram');
            data.diagramImage = img;
            setBatteryInfo(data);
        }
      } catch (e) { handleError(e); }
      setIsLoading(false);
  };

  const handleHistoryExplore = async (topic: string) => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `تاريخ الكيمياء: ${topic}. JSON: topic, summary, events: [{year, title, description, scientist}]. العربية.`
        }));
        const data = parseResponse(response.text);
        if (data) {
            const img = await generateImage(`Historical chemical laboratory ${topic}`, 'diagram');
            data.illustrationImage = img;
            setHistoryInfo(data);
        }
      } catch (e) { handleError(e); }
      setIsLoading(false);
  };

  const handleAtomClick = (id: string) => {
    const atom = ATOMS.find(a => a.id === id);
    if(atom && simulationMode === 'atoms') {
        setHistory(prevHistory => [...prevHistory, [...placedAtoms]]);
        setPlacedAtoms(prevAtoms => [
            ...prevAtoms, 
            {
                ...atom, 
                instanceId: ++atomIdCounter.current, 
                x: Math.random() * 200 + 100, 
                y: Math.random() * 200 + 100
            }
        ]);
    }
  };

  const resetAll = () => {
      setOrganicInfo(null); setBiomoleculeInfo(null); setGalvanicInfo(null);
      setThermoInfo(null); setSolutionInfo(null); setBatteryInfo(null);
      setHistoryInfo(null); setCompoundReactionResult(null);
      setFoundReactions(null); setSelectedReaction(null);
      setError(null);
  };

  const clearSession = () => {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
  };

  const getModeDescription = (mode: SimulationMode) => {
    switch (mode) {
      case 'atoms': return 'استكشاف الذرات والروابط الكيميائية الأساسية.';
      case 'compounds': return 'تحليل التفاعلات المعقدة بين المركبات الكيميائية.';
      case 'organic': return 'دراسة بنية وخصائص المركبات العضوية.';
      case 'biochemistry': return 'التعرف على الجزيئات الحيوية ودورها في الحياة.';
      case 'electrochemistry': return 'محاكاة الخلايا الجلفانية والتحليل الكهربائي.';
      case 'thermochemistry': return 'دراسة التغيرات الحرارية وطاقة التفاعلات.';
      case 'solution': return 'تحليل خصائص المحاليل والتركيزات.';
      case 'batteries': return 'فحص بنية البطاريات الحديثة وتخزين الطاقة.';
      case 'history': return 'استكشاف التطور التاريخي لعلم الكيمياء.';
      case 'ai-lab': return 'المختبر الذكي للمساعدة في الكيمياء والنظريات العلمية.';
      default: return 'جاري تحليل البيانات...';
    }
  };

  if (appState === 'welcome') return <WelcomeScreen onStart={() => setAppState('simulation')} />;

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      <Header theme={theme} setTheme={setTheme} />
      
      {error && (
          <div className="bg-red-500 text-white p-3 text-center text-xs font-bold animate-pulse absolute top-16 left-0 right-0 z-50 shadow-2xl flex items-center justify-center gap-4">
              <span className="flex items-center gap-2">
                <span className="text-lg">🚨</span>
                {error}
              </span>
              <button onClick={() => setError(null)} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors">تجاهل</button>
          </div>
      )}

      <div className="flex flex-grow overflow-hidden relative">
        <Sidebar 
            atoms={ATOMS}
            onAtomClick={handleAtomClick}
            onModeChange={(m) => { setSimulationMode(m); resetAll(); }}
            currentMode={simulationMode}
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
            isCompoundLoading={isLoading} isOrganicCompoundLoading={isLoading} isBiomoleculeLoading={isLoading}
            isGalvanicCellLoading={isLoading} isThermoLoading={isLoading} isSolutionLoading={isLoading}
            isBatteryLoading={isLoading} isHistoryLoading={isLoading}
        />
        
        <main className="flex-grow bg-[#0f172a] dark:bg-[#020617] relative overflow-hidden flex flex-col">
            {isLoading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
                    <div className="text-center p-6 bg-slate-900/80 rounded-[2rem] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] max-w-xs">
                        <div className="text-5xl mb-4 animate-bounce">⚗️</div>
                        <h2 className="text-lg font-bold text-cyan-400 mb-2 drop-shadow-sm">جاري تحليل البيانات...</h2>
                        <div className="w-16 h-1 bg-cyan-500/30 mx-auto mb-4 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 animate-[loading_1.5s_infinite]"></div>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed font-medium">
                            {getModeDescription(simulationMode)}
                        </p>
                    </div>
                </div>
            )}

            <div className="w-full h-full overflow-y-auto scrollbar-hide flex flex-col items-center p-4">
                {simulationMode === 'ai-lab' && <LocalAILab />}
                
                {simulationMode === 'atoms' && (
                    <div className="w-full h-full relative overflow-hidden flex flex-col">
                        <ReactionCanvas atoms={placedAtoms} isPaused={isLoading} pauseText="⚛️" canvasRef={canvasRef} onDrop={()=>{}} onDragOver={(e)=>e.preventDefault()} />
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-10">
                            <button onClick={() => { if (history.length > 0) { setPlacedAtoms(history[history.length - 1]); setHistory(prev => prev.slice(0, -1)); } }} className="bg-slate-800 text-white p-3 rounded-full shadow-2xl hover:bg-slate-700 transition-all border border-slate-700">↺</button>
                            <button onClick={handleAnalyzeAtoms} className="bg-cyan-600 text-white px-8 py-3 rounded-full font-bold shadow-2xl text-md transition-all hover:scale-105 active:scale-95">تحليل الروابط</button>
                        </div>
                        {foundReactions && <ReactionSelection reactions={foundReactions} onSelect={handleSelectReaction} onCancel={() => setFoundReactions(null)} />}
                        {selectedReaction && <MoleculeInfoCard reaction={selectedReaction} onNewReaction={() => { setSelectedReaction(null); setFoundReactions(null); setPlacedAtoms([]); setHistory([]); }} />}
                    </div>
                )}

                {simulationMode === 'organic' && (
                    organicInfo 
                    ? <OrganicCompoundInfoCard info={organicInfo} onNew={() => setOrganicInfo(null)} />
                    : <EmptyState icon="🌿" title="الكيمياء العضوية" desc="استكشف سلاسل الكربون والمركبات العضوية وتفاعلاتها المذهلة." />
                )}

                {simulationMode === 'biochemistry' && (
                    biomoleculeInfo 
                    ? <BiomoleculeInfoCard info={biomoleculeInfo} onNew={() => setBiomoleculeInfo(null)} />
                    : <EmptyState icon="🧬" title="الحيمياء الحيوية" desc="حلل الجزيئات الحيوية كالبروتينات والكربوهيدرات والإنزيمات." />
                )}

                {simulationMode === 'electrochemistry' && (
                    galvanicInfo 
                    ? <GalvanicCellCard info={galvanicInfo} onNew={() => setGalvanicInfo(null)} />
                    : <EmptyState icon="⚡️" title="الكيمياء الكهربائية" desc="حاكي الخلايا الجلفانية وشاهد تدفق الإلكترونات وإنتاج الطاقة." />
                )}

                {simulationMode === 'thermochemistry' && (
                    thermoInfo 
                    ? <ThermoChemistryCard info={thermoInfo} onNew={() => setThermoInfo(null)} />
                    : <EmptyState icon="🔥" title="الكيمياء الحرارية" desc="ادرس التغيرات في المحتوى الحراري وتلقائية التفاعلات." />
                )}

                {simulationMode === 'solution' && (
                    solutionInfo 
                    ? <SolutionChemistryCard info={solutionInfo} onNew={() => setSolutionInfo(null)} />
                    : <EmptyState icon="💧" title="كيمياء المحاليل" desc="حلل تركيزات المحاليل والخواص الجامعة للمواد المذابة." />
                )}

                {simulationMode === 'batteries' && (
                    batteryInfo 
                    ? <BatteryInfoCard info={batteryInfo} onNew={() => setBatteryInfo(null)} />
                    : <EmptyState icon="🔋" title="تكنولوجيا البطاريات" desc="افحص ميكانيكا عمل البطاريات الحديثة من الداخل." />
                )}

                {simulationMode === 'history' && (
                    historyInfo 
                    ? <HistoryTimelineCard info={historyInfo} onNew={() => setHistoryInfo(null)} />
                    : <EmptyState icon="📜" title="تاريخ الكيمياء" desc="اكتشف العلماء والاختراعات التي غيرت مجرى تاريخ العلم." />
                )}

                {simulationMode === 'compounds' && (
                    compoundReactionResult 
                    ? <CompoundReactionResult reaction={compoundReactionResult} onNewReaction={() => setCompoundReactionResult(null)} />
                    : <CompoundSelector reactant1={reactant1} reactant2={reactant2} setReactant1={setReactant1} setReactant2={setReactant2} isLoading={isLoading} error={error} onStartReaction={() => handleCompoundReaction(reactant1, reactant2)} />
                )}

                <button 
                  onClick={clearSession}
                  className="fixed bottom-4 right-4 text-[8px] text-slate-500 hover:text-red-400 transition-colors opacity-30 hover:opacity-100 z-50"
                  title="مسح سجل المحاكاة"
                >
                  مسح الجلسة 🗑️
                </button>
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;
