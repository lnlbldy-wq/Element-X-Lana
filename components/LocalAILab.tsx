
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface KnowledgeModuleProps {
    icon: string;
    title: string;
    description: string;
    onClick?: () => void;
}

const KnowledgeModule: React.FC<KnowledgeModuleProps> = ({ icon, title, description, onClick }) => (
    <button 
        onClick={onClick}
        className="bg-white/40 dark:bg-slate-800/40 p-5 rounded-[2rem] border border-white/50 dark:border-slate-700/50 shadow-sm transition-all hover:scale-105 hover:bg-white/60 dark:hover:bg-slate-800/60 text-right"
    >
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-bold">{description}</p>
    </button>
);

export const LocalAILab: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (forcedQuestion?: string) => {
        const q = forcedQuestion || question;
        if (!q.trim() || isLoading) return;

        setMessages(prev => [...prev, { role: 'user', text: q }]);
        setQuestion('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: q,
                config: {
                    systemInstruction: `أنت "خبير الحوسبة الكيميائية في ElementX".
                    - قدم إجابات علمية رصينة ودقيقة جداً.
                    - استخدم اللغة العربية الفصحى العلمية.
                    - نسق إجابتك باستخدام النقاط والرموز لجعلها مريحة للقراءة.
                    - تخصص فقط في الكيمياء: (تفاعلات، بنية جزيئية، قوانين، ثيرموديناميك، تاريخ الكيمياء).
                    - إذا طلب منك أي شيء خارج الكيمياء، اعتذر بلباقة وركز على تخصصك.`,
                },
            });
            const answer = response.text || "عذراً، واجهت مشكلة في معالجة طلبك كيميائياً.";
            setMessages(prev => [...prev, { role: 'ai', text: answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { 
                role: 'ai', 
                text: '❌ تعذر الوصول إلى السحابة الذكية. يرجى التحقق من اتصالك.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto h-[82vh] flex flex-col bg-slate-50/50 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] border border-white/40 dark:border-slate-800/50 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] animate-fade-in">
            
            {/* Laboratory Control Bar */}
            <div className="h-16 flex items-center px-8 bg-white/20 dark:bg-slate-800/30 border-b border-white/20 dark:border-slate-800/30 flex-shrink-0">
                <div className="flex gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-md"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-md"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-md"></div>
                </div>
                
                <div className="flex-1 text-center">
                    <div className="inline-flex items-center gap-2.5 px-6 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.2em]">
                            Hybrid Cloud Intelligence Laboratory
                        </span>
                    </div>
                </div>
            </div>

            {/* Chat & Knowledge Surface */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                {messages.length === 0 && (
                    <div className="space-y-12 animate-slide-up">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-28 h-28 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl transform rotate-3 mb-4">
                                <span className="text-5xl drop-shadow-lg">🤖</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">كيف يمكنني مساعدتك في أبحاثك؟</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed font-bold">
                                أنا محرك ElementX المعزز بذكاء Gemini. تخصصي هو تبسيط العلوم الكيميائية وتحليل الأنظمة الجزيئية المعقدة.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <KnowledgeModule 
                                icon="⚗️" 
                                title="تفسير الميكانيكية" 
                                description="شرح كيفية كسر وتكوين الروابط في التفاعلات المعقدة."
                                onClick={() => handleSend("اشرح لي ميكانيكية تفاعل الاستبدال النوكليوفيلي SN2")}
                            />
                            <KnowledgeModule 
                                icon="⚖️" 
                                title="حل المعادلات" 
                                description="مساعدتك في وزن المعادلات الكيميائية وتوقع النواتج."
                                onClick={() => handleSend("كيف يمكنني وزن معادلة تفاعل برمنجنات البوتاسيوم في وسط حمضي؟")}
                            />
                            <KnowledgeModule 
                                icon="🧬" 
                                title="البنية الجزيئية" 
                                description="تحليل الأشكال الفراغية، التهجين، والروابط بين الذرات."
                                onClick={() => handleSend("ما هو نوع التهجين في جزيء SF6 وشكله الهندسي؟")}
                            />
                            <KnowledgeModule 
                                icon="🛡️" 
                                title="بروتوكول السلامة" 
                                description="إرشادات التعامل الآمن مع المواد الكيميائية الخطرة."
                                onClick={() => handleSend("ما هي مخاطر التعامل مع حمض الهيدروفلوريك HF؟")}
                            />
                        </div>
                    </div>
                )}
                
                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'} animate-fade-in`}>
                        <div className={`flex items-center gap-2 mb-2 ${msg.role === 'user' ? 'ml-4' : 'mr-4'}`}>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                {msg.role === 'user' ? 'الباحث' : 'ElementX Intelligence'}
                            </span>
                        </div>
                        <div className={`max-w-[85%] px-7 py-5 rounded-[2.2rem] shadow-sm transition-all ${
                            msg.role === 'user' 
                            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 rounded-tr-none' 
                            : 'bg-cyan-500/10 dark:bg-cyan-500/20 text-slate-900 dark:text-cyan-50 border border-cyan-500/20 rounded-tl-none'
                        }`}>
                            <p className="text-[14px] leading-relaxed whitespace-pre-wrap font-bold">
                                {msg.text}
                            </p>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex flex-col items-end animate-pulse">
                        <div className="bg-slate-200/50 dark:bg-slate-800/40 px-8 py-5 rounded-[2rem] rounded-tl-none border border-slate-300/30 flex gap-2.5 items-center">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Surface */}
            <div className="p-10 flex-shrink-0 bg-white/10 dark:bg-slate-900/40 border-t border-white/10 dark:border-slate-800/30">
                <div className="max-w-4xl mx-auto relative">
                    <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-800/90 p-2.5 pr-8 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xl focus-within:ring-4 focus-within:ring-cyan-500/20 transition-all">
                        <textarea 
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="اطرح سؤالك الكيميائي هنا... (مثلاً: اشرح لي مفهوم التهجين SP3)"
                            className="flex-1 bg-transparent border-none py-3.5 text-slate-800 dark:text-white outline-none resize-none h-14 text-[14px] font-bold"
                        />
                        <button 
                            onClick={() => handleSend()}
                            disabled={isLoading || !question.trim()}
                            className="h-12 w-12 flex items-center justify-center rounded-full font-black transition-all hover:scale-110 active:scale-95 disabled:opacity-30 bg-cyan-500 text-white shadow-lg shadow-cyan-500/40"
                        >
                            <span className="text-xl">🚀</span>
                        </button>
                    </div>
                    <div className="flex justify-center mt-6">
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black tracking-[0.4em] uppercase opacity-50">
                            Neural Laboratory Interface v4.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
