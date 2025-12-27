

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ReactionCanvas } from './components/ReactionCanvas';
import { MoleculeInfoCard } from './components/MoleculeInfoCard';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CompoundSelector } from './components/CompoundSelector';
import { CompoundReactionResult } from './components/CompoundReactionResult';
import { OrganicCompoundInfoCard } from './components/OrganicCompoundInfoCard';
import { BiomoleculeInfoCard } from './components/BiomoleculeInfoCard';
import { GalvanicCellCard } from './components/GalvanicCellCard';
import { ThermoChemistryCard } from './components/ThermoChemistryCard';
import { SolutionChemistryCard } from './components/SolutionChemistryCard';
import { BatteryInfoCard } from './components/BatteryInfoCard';
import { HistoryTimelineCard } from './components/HistoryTimelineCard';
import { LocalAILab } from './components/LocalAILab';
import { ATOMS } from './constants';
import type { Atom, Reaction, CompoundReaction, OrganicCompoundInfo, BiomoleculeInfo, GalvanicCellInfo, ThermoChemistryInfo, SolutionChemistryInfo, BatteryComparisonInfo, BatteryInfo, HistoryInfo } from './types';

type AppState = 'welcome' | 'simulation';
type SimulationMode = 'atoms' | 'compounds' | 'organic' | 'biochemistry' | 'electrochemistry' | 'thermochemistry' | 'solution' | 'batteries' | 'history' | 'ai-lab';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('atoms');
  const [theme, setTheme] = useState<Theme>('dark');
  
  const [placedAtoms, setPlacedAtoms] = useState<Atom[]>([]);
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [compoundReactionResult, setCompoundReactionResult] = useState<CompoundReaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('جاري استحضار البيانات...');
  const [error, setError] = useState<string | null>(null);
  
  const [organicResult, setOrganicResult] = useState<OrganicCompoundInfo | null>(null);
  const [biomoleculeResult, setBiomoleculeResult] = useState<BiomoleculeInfo | null>(null);
  const [electroResult, setElectroResult] = useState<GalvanicCellInfo | null>(null);
  const [thermoResult, setThermoResult] = useState<ThermoChemistryInfo | null>(null);
  const [solutionResult, setSolutionResult] = useState<SolutionChemistryInfo | null>(null);
  const [batteryResult, setBatteryResult] = useState<BatteryComparisonInfo | BatteryInfo | null>(null);
  const [historyResult, setHistoryResult] = useState<HistoryInfo | null>(null);

  const [reactant1, setReactant1] = useState('');
  const [reactant2, setReactant2] = useState('');

  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [fullAtomDetails, setFullAtomDetails] = useState<Reaction | null>(null);


  const atomIdCounter = useRef(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    // FIX: Use process.env.API_KEY instead of import.meta.env.VITE_API_KEY
    if (!process.env.API_KEY) {
      setError("مفتاح API_KEY غير موجود. يرجى إضافته كمتغير بيئة (Environment Variable) في إعدادات منصة النشر (مثل Vercel) لإتمام الاتصال.");
    }
  }, []);

  const generateAIImage = async (query: string): Promise<string | null> => {
    // FIX: Use process.env.API_KEY instead of import.meta.env.VITE_API_KEY
    if (!process.env.API_KEY) return null;
    try {
      // FIX: Use process.env.API_KEY instead of import.meta.env.VITE_API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Pure white background, high-quality 2D scientific Lewis dot diagram of ${query}. Black lines, high contrast. Professional textbook illustration style. Clear labels.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
      });
      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      return part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : null;
    } catch (e) { return null; }
  };

  const callGeminiAI = async (prompt: string, systemInstruction: string, schema?: any) => {
      // FIX: Use process.env.API_KEY instead of import.meta.env.VITE_API_KEY
      if (!process.env.API_KEY) {
        setError("مفتاح API_KEY غير موجود. يرجى إضافته كمتغير بيئة (Environment Variable) في إعدادات منصة النشر (مثل Vercel) لإتمام الاتصال.");
        return null;
      }
      try {
          // FIX: Use process.env.API_KEY instead of import.meta.env.VITE_API_KEY
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt,
              config: {
                  systemInstruction: systemInstruction + "\nيجب أن تكون المعلومات مفصلة جداً وشاملة وأكاديمية. يمنع الاختصار. الإجابة باللغة العربية الفصحى فقط. ركز على العمق العلمي والدقة الكيميائية.",
                  responseMimeType: schema ? "application/json" : undefined,
                  responseSchema: schema
              },
          });
          const text = response.text;
          if (!text) return null;
          return schema ? JSON.parse(text.trim()) : text;
      } catch (err) {
          console.error(err);
          setError("فشل الاتصال بالذكاء الاصطناعي.");
          return null;
      }
  };

  const handleAnalyzeBonds = async () => {
    const source = simulationMode === 'compounds' ? `${reactant1} + ${reactant2}` : placedAtoms.map(a => a.symbol).join(', ');
    if (!source.trim() || source === '+') return;

    setIsLoading(true);
    setError(null);
    resetAll();

    if (simulationMode === 'compounds') {
        setLoadingMessage('يتم الآن تحليل التفاعل الكيميائي...');
        try {
            const sys = `أنت بروفيسور كيمياء عالمي متخصص في التفاعلات الكيميائية. حلل التفاعل بين المتفاعلات وقدم تحليلاً شاملاً. يجب أن تكون الإجابة شاملة جداً بكل تفاصيلها الأكاديمية والفيزيائية.`;
            const schema = {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    balancedEquation: { type: Type.STRING },
                    reactionType: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    academicContext: { type: Type.STRING },
                    balancingSteps: { type: Type.STRING },
                    reactionMechanism: { type: Type.STRING },
                    visualObservations: { type: Type.STRING },
                    reactionConditions: { type: Type.STRING },
                    thermodynamicNotes: { type: Type.STRING },
                    safetyNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
            };
            const data = await callGeminiAI(`تحليل شامل للتفاعل الكيميائي بين: ${source}`, sys, schema);
            if (data) setCompoundReactionResult(data);
        } catch (e) { setError("فشل تحليل التفاعل المركب."); }
    } else {
        setLoadingMessage('يتم الآن تحليل الروابط الكيميائية...');
        try {
            const sys = `أنت بروفيسور كيمياء عالمي متخصص في البنية الجزيئية. حلل الذرات/المتفاعلات وقدم أكثر مركب (1) احتمالية للحدوث فقط. يجب أن تكون الإجابة شاملة جداً لمركب واحد فقط بكل تفاصيله الفيزيائية والكيميائية والتاريخية والأكاديمية العميقة.`;
            const schema = { type: Type.OBJECT, properties: { reaction: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, formula: { type: Type.STRING }, emoji: { type: Type.STRING }, bondType: { type: Type.STRING }, academicContext: { type: Type.STRING }, balancedFormationEquation: { type: Type.STRING }, formationBalancingSteps: { type: Type.STRING }, molarMass: { type: Type.STRING }, state: { type: Type.STRING }, density: { type: Type.STRING }, acidBase: { type: Type.STRING }, molecularGeometry: { type: Type.STRING }, reactionType: { type: Type.STRING }, hybridization: { type: Type.STRING }, polarity: { type: Type.STRING }, electronegativityDifference: { type: Type.STRING }, dipoleMoment: { type: Type.STRING }, vanDerWaalsRadius: { type: Type.STRING }, boilingPoint: { type: Type.STRING }, meltingPoint: { type: Type.STRING }, magneticDescription: { type: Type.STRING }, solubilityInWater: { type: Type.STRING }, solubilityInOrganicSolvents: { type: Type.STRING }, crystalDescription: { type: Type.STRING }, thermalStability: { type: Type.STRING }, bondEnthalpy: { type: Type.STRING }, discoveryStory: { type: Type.STRING }, discoverer: { type: Type.STRING }, discoveryYear: { type: Type.STRING }, electronConfiguration: { type: Type.STRING }, fullElectronConfiguration: { type: Type.STRING }, safety: { type: Type.OBJECT, properties: { warnings: { type: Type.ARRAY, items: { type: Type.STRING } }, ghsSymbols: { type: Type.ARRAY, items: { type: Type.STRING } } } } } } } };
            const data = await callGeminiAI(`تحليل شامل للمركب الأكثر احتمالية لـ: ${source}`, sys, schema);
            if (data?.reaction) {
                const reactionData = data.reaction;
                reactionData.lewisStructure = await generateAIImage(reactionData.formula);
                setSelectedReaction(reactionData);
            }
        } catch (e) { setError("فشل التحليل العلمي."); }
    }
    setIsLoading(false);
  };

  const handleGlobalSearch = async (mode: SimulationMode, q: string) => {
    setIsLoading(true);
    setLoadingMessage(`جاري استكشاف بيانات ${q}...`);
    resetAll();
    
    const sys = `خبير عالمي في كيمياء ${mode}. قدم أدق التفاصيل العلمية الممكنة بشكل شامل وموسع ومحاذاة لليمين. الإجابة باللغة العربية الفصحى الأكاديمية فقط. يمنع الاختصار بتاتاً.`;
    
    const singleBatterySchema = { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, type: { type: Type.STRING }, nominalVoltage: { type: Type.STRING }, applications: { type: Type.STRING }, energyDensity: { type: Type.STRING }, cycleLife: { type: Type.STRING }, internalResistance: { type: Type.STRING }, anodeMaterial: { type: Type.STRING }, cathodeMaterial: { type: Type.STRING }, electrolyte: { type: Type.STRING }, chargingCharacteristics: { type: Type.STRING }, selfDischargeRate: { type: Type.STRING }, anodeReaction: { type: Type.STRING }, cathodeReaction: { type: Type.STRING }, safetyRisks: { type: Type.STRING }, environmentalRecycling: { type: Type.STRING } } };

    const schemas: Record<string, any> = {
        organic: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, formula: { type: Type.STRING }, family: { type: Type.STRING }, description: { type: Type.STRING }, uses: { type: Type.STRING }, stateAtSTP: { type: Type.STRING }, iupacNaming: { type: Type.STRING }, boilingPoint: { type: Type.STRING }, meltingPoint: { type: Type.STRING }, solubility: { type: Type.STRING }, density: { type: Type.STRING }, isomersCount: { type: Type.STRING }, toxicityDetails: { type: Type.STRING }, flammabilityRating: { type: Type.STRING } } },
        biochemistry: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, formula: { type: Type.STRING }, type: { type: Type.STRING }, description: { type: Type.STRING }, biologicalFunction: { type: Type.STRING }, uses: { type: Type.STRING }, molecularWeight: { type: Type.STRING }, prevalenceInNature: { type: Type.STRING }, metabolicRole: { type: Type.STRING }, dietarySources: { type: Type.STRING }, clinicalImplications: { type: Type.STRING }, associatedDiseases: { type: Type.STRING } } },
        electrochemistry: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, anode: { type: Type.OBJECT, properties: { metal: { type: Type.STRING }, halfReaction: { type: Type.STRING }, standardPotential: { type: Type.STRING } } }, cathode: { type: Type.OBJECT, properties: { metal: { type: Type.STRING }, halfReaction: { type: Type.STRING }, standardPotential: { type: Type.STRING } } }, overallReaction: { type: Type.STRING }, cellPotential: { type: Type.STRING }, cellNotation: { type: Type.STRING }, explanation: { type: Type.STRING }, applications: { type: Type.STRING }, gibbsEnergy: { type: Type.STRING }, theoreticalYieldInfo: { type: Type.STRING } } },
        thermochemistry: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, equation: { type: Type.STRING }, enthalpyChange: { type: Type.STRING }, isExothermic: { type: Type.BOOLEAN }, explanation: { type: Type.STRING }, applications: { type: Type.STRING }, isSpontaneous: { type: Type.BOOLEAN }, entropyChange: { type: Type.STRING }, gibbsFreeEnergyChange: { type: Type.STRING }, keq: { type: Type.STRING }, activationEnergy: { type: Type.STRING }, speedFactors: { type: Type.ARRAY, items: { type: Type.STRING } }, heatCapacityInfo: { type: Type.STRING } } },
        solution: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, soluteName: { type: Type.STRING }, soluteFormula: { type: Type.STRING }, solventName: { type: Type.STRING }, concentrationMolarity: { type: Type.STRING }, solutionDescription: { type: Type.STRING }, applications: { type: Type.STRING }, solutionType: { type: Type.STRING }, phLevel: { type: Type.STRING }, conductivity: { type: Type.STRING }, boilingPointElevation: { type: Type.STRING }, freezingPointDepression: { type: Type.STRING }, osmoticPressure: { type: Type.STRING } } },
        batteries: q === 'comparison' 
            ? { type: Type.OBJECT, properties: { comparisons: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } } } } } }
            : singleBatterySchema,
        history: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, summary: { type: Type.STRING }, events: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { year: { type: Type.STRING }, title: { type: Type.STRING }, description: { type: Type.STRING }, scientist: { type: Type.STRING } } } }, impactOnSociety: { type: Type.STRING }, nobelPrizes: { type: Type.STRING } } }
    };

    if (isComparisonMode && mode !== 'batteries') {
        const finalPrompt = `قارن بشكل شامل ومتقابل بين شيئين بخصوص: ${q}. اذكر أوجه التشابه والاختلاف بدقة علمية مذهلة وتفاصيل دقيقة جداً لا يقل عدد الكلمات عن 300 كلمة.`;
        const comparisonText = await callGeminiAI(finalPrompt, sys);
        if (comparisonText && typeof comparisonText === 'string') {
            const placeholder = { id: 'comparison', name: `مقارنة: ${q}`, formula: 'N/A', description: comparisonText, uses: comparisonText, stateAtSTP: 'N/A', iupacNaming: 'N/A', biologicalFunction: comparisonText };
            if (mode === 'organic') setOrganicResult({ ...placeholder, family: 'مقارنة', lewisStructureImage: '' });
            else if (mode === 'biochemistry') setBiomoleculeResult({ ...placeholder, type: 'مقارنة', structureImage: '' });
            else setOrganicResult({ ...placeholder, family: 'مقارنة', lewisStructureImage: '' });
        }
    } else {
        try {
            const prompt = mode === 'batteries' && q === 'comparison'
                ? "قارن بالتفصيل الشامل بين بطارية ليثيوم أيون (Li-ion)، بطارية الرصاص الحمضية (Lead-Acid)، وبطارية فوسفات حديد الليثيوم (LiFePO4). يجب أن تكون هناك 3 أعمدة للمقارنة. ركز على الجهد، المقاومة الداخلية، كثافة الطاقة، دورة الحياة، والكيمياء الداخلية بالتفصيل لكل نوع." 
                : `تحليل مفصل جداً لـ: ${q}`;
                
            const schema = schemas[mode];
            const data = await callGeminiAI(prompt, sys, schema);
            
            if (data) {
                if (mode === 'batteries') {
                    setBatteryResult(data);
                } else {
                    const structureImg = await generateAIImage(q);
                    if (mode === 'organic') setOrganicResult({ ...data, lewisStructureImage: structureImg || '' });
                    if (mode === 'biochemistry') setBiomoleculeResult({ ...data, structureImage: structureImg || '' });
                    if (mode === 'electrochemistry') setElectroResult({ ...data, diagramImage: structureImg || '' });
                    if (mode === 'thermochemistry') setThermoResult({ ...data, energyProfileImage: structureImg || '' });
                    if (mode === 'solution') setSolutionResult({ ...data });
                    if (mode === 'history') setHistoryResult({ ...data, illustrationImage: structureImg || '' });
                }
            }
        } catch (err) {
            console.error(err);
            setError("فشل في جلب البيانات.");
        }
    }
    setIsLoading(false);
  };

  const handleAtomSelect = async (atom: Atom) => {
    setFullAtomDetails(null);
    setSelectedReaction(null);

    setIsLoading(true);
    setLoadingMessage(`جاري جلب بيانات عنصر ${atom.name}...`);
    
    const sys = `أنت موسوعة كيميائية. قدم بيانات مفصلة جداً لعنصر كيميائي واحد فقط، وعامله كأنه "مركب" من ذرة واحدة. املأ كل الحقول الممكنة في مخطط JSON. تجاهل الحقول غير ذات الصلة مثل معادلة التكوين.`;
    const schema = { type: Type.OBJECT, properties: { reaction: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, formula: { type: Type.STRING }, emoji: { type: Type.STRING }, bondType: { type: Type.STRING }, academicContext: { type: Type.STRING }, balancedFormationEquation: { type: Type.STRING }, formationBalancingSteps: { type: Type.STRING }, molarMass: { type: Type.STRING }, state: { type: Type.STRING }, density: { type: Type.STRING }, acidBase: { type: Type.STRING }, molecularGeometry: { type: Type.STRING }, reactionType: { type: Type.STRING }, hybridization: { type: Type.STRING }, polarity: { type: Type.STRING }, electronegativityDifference: { type: Type.STRING }, dipoleMoment: { type: Type.STRING }, vanDerWaalsRadius: { type: Type.STRING }, boilingPoint: { type: Type.STRING }, meltingPoint: { type: Type.STRING }, magneticDescription: { type: Type.STRING }, solubilityInWater: { type: Type.STRING }, solubilityInOrganicSolvents: { type: Type.STRING }, crystalDescription: { type: Type.STRING }, thermalStability: { type: Type.STRING }, bondEnthalpy: { type: Type.STRING }, discoveryStory: { type: Type.STRING }, discoverer: { type: Type.STRING }, discoveryYear: { type: Type.STRING }, electronConfiguration: { type: Type.STRING }, fullElectronConfiguration: { type: Type.STRING }, safety: { type: Type.OBJECT, properties: { warnings: { type: Type.ARRAY, items: { type: Type.STRING } }, ghsSymbols: { type: Type.ARRAY, items: { type: Type.STRING } } } } } } } };
    const data = await callGeminiAI(`تحليل شامل لعنصر: ${atom.name} (${atom.symbol})`, sys, schema);

    if (data?.reaction) {
        const reactionData = data.reaction;
        reactionData.lewisStructure = await generateAIImage(reactionData.formula || atom.symbol);
        setFullAtomDetails(reactionData); 
    }
    setIsLoading(false);
  };


  const resetAll = () => {
      setSelectedReaction(null);
      setCompoundReactionResult(null);
      setFullAtomDetails(null);
      setOrganicResult(null); setBiomoleculeResult(null);
      setElectroResult(null); setThermoResult(null); setSolutionResult(null);
      setBatteryResult(null); setHistoryResult(null); 
      // Do not reset the API key error so the user can see it
      if (error && !error.includes("API")) {
        setError(null);
      }
  };

  if (appState === 'welcome') return <WelcomeScreen onStart={() => setAppState('simulation')} />;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a1120] text-white selection:bg-cyan-500/30">
      <Header theme={theme} setTheme={setTheme} />
      <div className="flex flex-grow overflow-hidden relative">
        <Sidebar 
            atoms={ATOMS}
            onAtomClick={(id) => {
                const atom = ATOMS.find(a => a.id === id);
                if(atom && (simulationMode === 'atoms' || simulationMode === 'compounds')) {
                    atomIdCounter.current += 1;
                    setPlacedAtoms(prev => [...prev, { ...atom, instanceId: atomIdCounter.current, x: Math.random() * 200 + 200, y: Math.random() * 200 + 200 }]);
                }
            }}
            onModeChange={(m) => { setSimulationMode(m); resetAll(); setIsComparisonMode(false); }}
            currentMode={simulationMode}
            reactant1={reactant1} setReactant1={setReactant1}
            reactant2={reactant2} setReactant2={setReactant2}
            onCompoundReact={handleAnalyzeBonds}
            onOrganicSearch={(q) => handleGlobalSearch('organic', q)}
            onBiomoleculeGenerate={(q) => handleGlobalSearch('biochemistry', q)} 
            onGalvanicCellSimulate={(m1, m2) => handleGlobalSearch('electrochemistry', `${m1} و ${m2}`)}
            onThermoAnalyze={(q) => handleGlobalSearch('thermochemistry', q)}
            onSolutionAnalyze={(s, sv, m) => handleGlobalSearch('solution', `محلول ${s} في ${sv} بتركيز ${m} مولار`)}
            onBatterySimulate={(type) => handleGlobalSearch('batteries', type)}
            onHistoryExplore={(q) => handleGlobalSearch('history', q)}
            isComparisonMode={isComparisonMode}
            setIsComparisonMode={setIsComparisonMode}
        />
        <main className="flex-grow bg-[#0a1120] relative overflow-hidden flex flex-col">
            {isLoading && (
              <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex items-center justify-center animate-fade-in text-center">
                <div className="space-y-8 max-w-lg px-6">
                  <div className="text-8xl animate-bounce">⚗️</div>
                  <h2 className="text-4xl font-black text-[#5ce1ff]">{loadingMessage}</h2>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full animate-progress-bar"></div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex-grow overflow-y-auto scrollbar-hide">
                {simulationMode === 'atoms' && (
                    <div className="w-full h-full relative overflow-hidden flex flex-col">
                        <ReactionCanvas atoms={placedAtoms} isPaused={isLoading} pauseText={null} canvasRef={canvasRef} onDrop={()=>{}} onDragOver={(e)=>e.preventDefault()} onAtomSelect={handleAtomSelect} />
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-6 z-10">
                            <button onClick={() => setPlacedAtoms([])} className="bg-white/5 backdrop-blur-xl p-5 rounded-full shadow-2xl hover:bg-white/10 transition-all font-black border border-white/10">↺</button>
                            <button onClick={handleAnalyzeBonds} className="bg-[#00bcd4] hover:bg-[#00acc1] text-white px-16 py-4 rounded-full font-black shadow-lg transition-all hover:scale-105 text-lg">تحليل الذرات</button>
                        </div>
                        {(selectedReaction || fullAtomDetails) && <MoleculeInfoCard reaction={selectedReaction || fullAtomDetails!} onNewReaction={resetAll} />}
                    </div>
                )}
                {simulationMode === 'compounds' && (compoundReactionResult ? (
                     <div className="w-full h-full relative overflow-y-auto scrollbar-hide flex justify-center">
                        <CompoundReactionResult reaction={compoundReactionResult} onNewReaction={resetAll} />
                     </div>
                ) : <CompoundSelector reactant1={reactant1} reactant2={reactant2} setReactant1={setReactant1} setReactant2={setReactant2} isLoading={isLoading} error={error} onStartReaction={handleAnalyzeBonds} />)}
                
                {simulationMode === 'organic' && organicResult && <OrganicCompoundInfoCard info={organicResult} onNew={resetAll} />}
                {simulationMode === 'biochemistry' && biomoleculeResult && <BiomoleculeInfoCard info={biomoleculeResult} onNew={resetAll} />}
                {simulationMode === 'electrochemistry' && electroResult && <GalvanicCellCard info={electroResult} onNew={resetAll} />}
                {simulationMode === 'thermochemistry' && thermoResult && <ThermoChemistryCard info={thermoResult} onNew={resetAll} />}
                {simulationMode === 'solution' && solutionResult && <SolutionChemistryCard info={solutionResult} onNew={resetAll} />}
                {simulationMode === 'batteries' && batteryResult && <BatteryInfoCard info={batteryResult} onNew={resetAll} />}
                {simulationMode === 'history' && historyResult && <HistoryTimelineCard info={historyResult} onNew={resetAll} />}
                {simulationMode === 'ai-lab' && <LocalAILab />}
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;