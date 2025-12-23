
import React, { useState, useRef, useEffect } from 'react';

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

    const handleSend = async () => {
        if (!question.trim()) return;

        const userMsg = question;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setQuestion('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:3000/chemistry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMsg })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { 
                role: 'ai', 
                text: '❌ فشل الاتصال بخادم الكيمياء. تأكد من تشغيل "node server.js" ووجود Ollama قيد العمل.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col bg-slate-900/50 rounded-[2.5rem] border border-slate-700 overflow-hidden shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="p-6 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🤖</span>
                    <div>
                        <h2 className="text-xl font-bold text-white">مساعد الكيمياء الذكي</h2>
                        <p className="text-xs text-cyan-400">خبير في التفاعلات والنظريات الكيميائية</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                        <span className="text-6xl">⚗️</span>
                        <p className="text-slate-400 max-w-sm">
                            مرحباً بك في المختبر الكيميائي! أنا هنا للإجابة على تساؤلاتك حول العناصر، الروابط، التفاعلات، وكل ما يخص علم الكيمياء الممتع.
                        </p>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end animate-slide-up'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.role === 'user' 
                            ? 'bg-slate-700 text-white rounded-tr-none' 
                            : 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-50 rounded-tl-none shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                        }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-end animate-pulse">
                        <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-800/50 border-t border-slate-700">
                <div className="flex gap-4">
                    <textarea 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder="اطرح سؤالك الكيميائي هنا..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none h-20"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-6 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center"
                    >
                        {isLoading ? '...' : 'اسأل'}
                    </button>
                </div>
            </div>
        </div>
    );
};
