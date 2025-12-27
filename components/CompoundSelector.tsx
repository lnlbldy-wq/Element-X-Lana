

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { COMMON_COMPOUNDS } from '../constants';

// Internal type to manage image loading states
type CompoundImageState = string | null | 'loading' | 'safety_block' | 'error' | 'quota_wait';
interface CompoundWithImageState {
    name: string;
    formula: string;
    imageUrl: CompoundImageState;
}

// Define the missing CompoundSelectorProps interface
interface CompoundSelectorProps {
    reactant1: string;
    reactant2: string;
    setReactant1: (v: string) => void;
    setReactant2: (v: string) => void;
    isLoading: boolean;
    error: string | null;
    onStartReaction: () => void;
}

// Helper to safely check for retryable API errors
const isRetryableError = (error: any): boolean => {
    if (!error) return false;
    const msg = (error.message || error.toString() || '').toLowerCase();
    return msg.includes('429') || msg.includes('quota') || msg.includes('limit') || msg.includes('500') || msg.includes('503');
};

const isSafetyError = (error: any): boolean => {
    const message = (error?.message || error?.toString() || '').toLowerCase();
    return message.includes('safety') || message.includes('policy') || message.includes('blocked');
};

const fetchCompoundImage = async (name: string, formula: string): Promise<string | 'safety_block' | null> => {
    // FIX: Use process.env.API_KEY instead of import.meta.env.VITE_API_KEY
    if (!process.env.API_KEY) return null;
    // FIX: Use process.env.API_KEY instead of import.meta.env.VITE_API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imagePrompt = `Scientific 3D ball-and-stick molecule model of ${name} (${formula}). Clear white background. Minimalist aesthetic. Vibrant colors.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: imagePrompt }] },
        });
        
        const partWithImageData = response?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (partWithImageData?.inlineData) {
            return `data:image/png;base64,${partWithImageData.inlineData.data}`;
        }
        return null;
    } catch (error: any) {
        if (isRetryableError(error)) throw error;
        if (isSafetyError(error)) return 'safety_block';
        return null;
    }
};

interface CompoundCardProps {
    compound: CompoundWithImageState;
    onSelect: () => void;
    isSelected: boolean;
    selectionLabel: string | null;
    onVisible: () => void;
}

const CompoundCard: React.FC<CompoundCardProps> = ({ compound, onSelect, isSelected, selectionLabel, onVisible }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isLoading = compound.imageUrl === 'loading';
    const isQuotaWait = compound.imageUrl === 'quota_wait';
    const isSafetyBlock = compound.imageUrl === 'safety_block';
    const showPlaceholder = compound.imageUrl === null || compound.imageUrl === 'error' || isSafetyBlock;

    useEffect(() => {
        const currentRef = cardRef.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onVisible();
                    observer.unobserve(currentRef);
                }
            },
            { rootMargin: '100px', threshold: 0.1 }
        );
        observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [onVisible]);

    return (
        <div
            ref={cardRef}
            onClick={onSelect}
            className={`relative group bg-white dark:bg-slate-800 rounded-2xl p-3 text-center transition-all duration-300 transform cursor-pointer ${
                isSelected 
                ? 'shadow-xl ring-2 ring-cyan-500 scale-105 bg-cyan-50/10' 
                : 'shadow-sm hover:shadow-md hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
        >
            <div className="h-16 w-full object-contain mx-auto mb-2 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50/50 dark:bg-slate-900/30 p-2">
                {isLoading || isQuotaWait ? (
                    <div className="flex flex-col items-center gap-1">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500/50"></div>
                        {isQuotaWait && <span className="text-[7px] text-orange-500 font-bold">انتظار الحصة</span>}
                    </div>
                ) : isSafetyBlock ? (
                    <div className="flex flex-col items-center justify-center text-red-500/50">
                         <span className="text-lg">🚫</span>
                    </div>
                ) : showPlaceholder ? (
                     <div className="flex flex-col items-center justify-center opacity-30">
                         <span className="text-2xl grayscale">⚗️</span>
                    </div>
                ) : (
                    <img 
                        src={compound.imageUrl as string} 
                        alt={compound.name} 
                        loading="lazy"
                        className="h-full w-full object-contain drop-shadow-sm hover:scale-110 transition-transform duration-300" 
                    />
                )}
            </div>
            
            <div className="pointer-events-none truncate px-1">
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate mb-0.5">{compound.name}</h3>
                <p className="font-mono text-[9px] text-cyan-600 dark:text-cyan-400 font-bold">{compound.formula}</p>
            </div>

            {isSelected && selectionLabel && (
                <div className="absolute top-1.5 right-1.5 bg-cyan-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-lg animate-fade-in z-10">
                    {selectionLabel}
                </div>
            )}
        </div>
    );
};

export const CompoundSelector: React.FC<CompoundSelectorProps> = ({ reactant1, reactant2, setReactant1, setReactant2, isLoading: isReactionLoading, error, onStartReaction }) => {
    const [compounds, setCompounds] = useState<CompoundWithImageState[]>(
        COMMON_COMPOUNDS.map(c => ({ ...c, imageUrl: null }))
    );
    const imageQueue = useRef<string[]>([]);
    const isWorkerRunning = useRef(false);
    const quotaBackoffMultiplier = useRef(1);
    
    const processQueue = useCallback(async () => {
        if (isWorkerRunning.current || imageQueue.current.length === 0) return;
        isWorkerRunning.current = true;
        
        const compoundFormula = imageQueue.current.shift();
        let hitRateLimit = false;

        if (compoundFormula) {
            const compoundDef = COMMON_COMPOUNDS.find(c => c.formula === compoundFormula);
            if (compoundDef) {
                try {
                    const result = await fetchCompoundImage(compoundDef.name, compoundDef.formula);
                    setCompounds(prev => prev.map(c => c.formula === compoundFormula ? { ...c, imageUrl: result } : c));
                    quotaBackoffMultiplier.current = 1; // Reset backoff on success
                } catch (e: any) {
                    if (isRetryableError(e)) {
                        hitRateLimit = true;
                        imageQueue.current.unshift(compoundFormula); // Re-queue
                        setCompounds(prev => prev.map(c => c.formula === compoundFormula ? { ...c, imageUrl: 'quota_wait' } : c));
                        // Increase wait multiplier significantly for 429
                        quotaBackoffMultiplier.current = Math.min(quotaBackoffMultiplier.current * 2, 12); 
                    } else {
                        setCompounds(prev => prev.map(c => c.formula === compoundFormula ? { ...c, imageUrl: null } : c));
                    }
                }
            }
        }

        isWorkerRunning.current = false;
        // Base delay increased to 6s (10 RPM) to be safe against most free tiers
        const baseDelay = 6000;
        const delay = hitRateLimit ? (20000 * quotaBackoffMultiplier.current) : baseDelay; 
        if (imageQueue.current.length > 0) setTimeout(processQueue, delay);
    }, []);

    const handleCompoundVisible = useCallback((formula: string) => {
        setCompounds(prev => {
            const compound = prev.find(c => c.formula === formula);
            if (compound && compound.imageUrl !== 'loading' && compound.imageUrl !== 'quota_wait' && typeof compound.imageUrl !== 'string') {
                 if (!imageQueue.current.includes(formula)) {
                     imageQueue.current.push(formula);
                     if (!isWorkerRunning.current) processQueue();
                 }
                 return prev.map(c => c.formula === formula ? { ...c, imageUrl: 'loading' } : c);
            }
            return prev;
        });
    }, [processQueue]);

    const handleSelect = (formula: string) => {
        if (reactant1 === formula) setReactant1('');
        else if (reactant2 === formula) setReactant2('');
        else if (!reactant1) setReactant1(formula);
        else setReactant2(formula);
    };

    return (
        <div className="h-full flex flex-col max-w-7xl mx-auto w-full px-4">
            <div className="mb-6 text-center animate-fade-in pt-6">
                <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-1">مكتبة المركبات الكيميائية</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">اختر متفاعلين من القائمة أو اكتب الصيغة مباشرة لبدء المحاكاة.</p>
                {error && (
                    <div className="mt-4 bg-orange-100 dark:bg-orange-950/30 border border-orange-400/30 text-orange-800 dark:text-orange-200 px-6 py-2 rounded-2xl text-[10px] inline-block shadow-md font-bold">
                        {error.includes('quota') ? '⚠️ جاري تنظيم الطلبات لتجنب تجاوز الحصة. يرجى الانتظار قليلاً.' : error}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-40">
                {compounds.map((compound) => (
                    <CompoundCard
                        key={compound.formula}
                        compound={compound}
                        onSelect={() => handleSelect(compound.formula)}
                        isSelected={reactant1 === compound.formula || reactant2 === compound.formula}
                        selectionLabel={reactant1 === compound.formula ? "المتفاعل 1" : reactant2 === compound.formula ? "المتفاعل 2" : null}
                        onVisible={() => handleCompoundVisible(compound.formula)}
                    />
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-2xl z-20 md:pr-80 transition-all">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-4 flex-1 w-full">
                        <div className={`flex-1 p-3 rounded-2xl border-2 text-center transition-all shadow-sm ${reactant1 ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : 'border-dashed border-slate-300 dark:border-slate-700'}`}>
                            <div className="text-[9px] text-cyan-600 dark:text-cyan-400 font-black mb-1 uppercase">مـ1</div>
                            <input type="text" value={reactant1} onChange={(e) => setReactant1(e.target.value)} placeholder="صيغة 1" className="w-full text-center bg-transparent font-bold text-sm text-slate-800 dark:text-white outline-none" />
                        </div>
                        <span className="text-2xl text-slate-400 font-black animate-pulse">+</span>
                        <div className={`flex-1 p-3 rounded-2xl border-2 text-center transition-all shadow-sm ${reactant2 ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : 'border-dashed border-slate-300 dark:border-slate-700'}`}>
                            <div className="text-[9px] text-cyan-600 dark:text-cyan-400 font-black mb-1 uppercase">مـ2</div>
                            <input type="text" value={reactant2} onChange={(e) => setReactant2(e.target.value)} placeholder="صيغة 2" className="w-full text-center bg-transparent font-bold text-sm text-slate-800 dark:text-white outline-none" />
                        </div>
                    </div>
                    <button onClick={onStartReaction} disabled={isReactionLoading || (!reactant1 && !reactant2)} className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 text-md flex items-center justify-center gap-3">
                        {isReactionLoading ? 'جاري التحليل العلمي...' : 'بدء التفاعل ⚗️'}
                    </button>
                </div>
            </div>
        </div>
    );
};