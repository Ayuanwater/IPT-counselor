
import React, { useState, useEffect, useRef } from 'react';
import { Session, Message, RiskLevel, AppView } from '../types';
import { iptEngine } from '../lib/iptEngine';
import { identifyRisk } from '../lib/risk';
import { Send, CheckCircle, RotateCcw, MessageCircle, Activity, Layout as LayoutIcon, Command } from 'lucide-react';

interface SessionPageProps {
  session: Session;
  updateSession: (updates: Partial<Session>) => void;
  onShowSafety: () => void;
  onNavigate: (view: AppView) => void;
  onRestart: () => void;
}

const SessionPage: React.FC<SessionPageProps> = ({ session, updateSession, onShowSafety, onNavigate, onRestart }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stepInfo = iptEngine.getStepInfo(session.step);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [session.messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    if (text === "查看话术建议" || text === "再给我些话术启发") { onNavigate('coach'); return; }
    if (text === "查看行动计划") { onNavigate('action'); return; }
    if (text === "重新开始咨询" || text === "结束并重新开始") { onRestart(); return; }
    if (text === "结束咨询") { onNavigate('home'); return; }

    const risk = identifyRisk(text);
    if (risk >= RiskLevel.L2) onShowSafety();

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const nextMessages = [...session.messages, userMsg];
    updateSession({ messages: nextMessages });
    setInput('');
    setIsTyping(true);
    
    try {
      const { response, chips, updates } = await iptEngine.generateResponse(session, text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response,
        timestamp: Date.now(),
        chips: chips,
      };
      
      let nextStep = session.step;
      if (session.step < 10) nextStep += 1;

      setTimeout(() => {
        setIsTyping(false);
        updateSession({
          messages: [...nextMessages, aiMsg],
          step: nextStep,
          riskLevel: Math.max(session.riskLevel, risk),
          ...updates
        });
      }, 500);
    } catch (error) {
      console.error("Session Error:", error);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      {/* Dynamic Session Body */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FBFBFC] border-r border-slate-100">
        {/* Step Visualization Bar */}
        <div className="px-10 py-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                  session.step > i + 1 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' 
                  : session.step === i + 1 
                  ? 'border-indigo-600 text-indigo-600 animate-pulse' 
                  : 'border-slate-100 text-slate-300'
                }`}>
                  {i + 1}
                </div>
                {i < 7 && <div className={`w-4 h-0.5 rounded-full ${session.step > i + 1 ? 'bg-indigo-200' : 'bg-slate-50'}`} />}
              </div>
            ))}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${session.step >= 9 ? 'bg-teal-50 text-teal-600' : 'bg-slate-50 text-slate-400'}`}>
              <Activity size={10}/> Report
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col items-end">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Focus</span>
             <span className="text-xs font-semibold text-slate-800">{stepInfo.name}</span>
          </div>
        </div>

        {/* Message Thread */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-20 py-10 space-y-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-10">
            {session.messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`flex flex-col gap-2 max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-6 py-4 text-sm leading-relaxed rounded-[24px] ${
                    m.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-200/50' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                  }`}>
                    {m.content}
                  </div>
                  {m.chips && m.role === 'ai' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {m.chips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(chip)}
                          className="px-4 py-2 bg-white border border-slate-100 rounded-full text-xs font-semibold text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="text-[9px] font-bold text-slate-300 px-2 uppercase tracking-tighter">
                    {m.role === 'user' ? 'Transmission Out' : 'Clinical Input'} • {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white border border-slate-100 px-6 py-4 rounded-full flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Console / Input area */}
        <div className="p-8 bg-white border-t border-slate-100">
           {session.step === 9 && (
             <div className="max-w-4xl mx-auto mb-6 p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex items-center justify-between animate-in zoom-in-95 duration-500">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                      <CheckCircle size={18}/>
                   </div>
                   <p className="text-xs font-bold text-teal-700 uppercase tracking-widest">Diagnostic loop completed</p>
                </div>
                <div className="flex gap-3">
                   <button onClick={() => onNavigate('coach')} className="px-4 py-1.5 bg-white border border-teal-200 rounded-lg text-[10px] font-bold text-teal-600 hover:bg-teal-50 transition-all uppercase tracking-widest">Review Scripts</button>
                   <button onClick={() => onNavigate('action')} className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-[10px] font-bold hover:bg-teal-700 transition-all shadow-md shadow-teal-100 uppercase tracking-widest">Action Plan</button>
                </div>
             </div>
           )}

           <div className="max-w-4xl mx-auto relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={session.step >= 9 ? "临床分析进行中... 键入以进行下一步探索" : "描述当前的情境或感受..."}
                rows={1}
                className="w-full bg-slate-50 border border-slate-200 rounded-[24px] py-5 px-8 pr-20 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 transition-all resize-none shadow-inner"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className="absolute right-3 top-3 p-3.5 bg-slate-900 text-white rounded-2xl disabled:opacity-20 hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center"
              >
                <Send size={18} />
              </button>
           </div>
           
           <div className="max-w-4xl mx-auto mt-4 flex items-center justify-between px-4">
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Command size={12}/> Enter to Submit</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span>Clinical Assistant Active</span>
              </div>
              {session.step >= 9 && (
                <button onClick={onRestart} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest">
                  <RotateCcw size={12}/> Restart Protocol
                </button>
              )}
           </div>
        </div>
      </div>

      {/* Side Summary Panel (Desktop Only) */}
      <aside className="hidden xl:flex flex-col w-96 p-10 space-y-10 bg-white border-l border-slate-100/60">
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <LayoutIcon size={14}/> Current Protocol
          </h4>
          <div className="p-6 bg-indigo-50/50 border border-indigo-100/50 rounded-3xl space-y-4">
            <h5 className="font-bold text-indigo-900 text-sm">{stepInfo.name}</h5>
            <p className="text-xs text-indigo-700/80 leading-relaxed font-light">{stepInfo.goal}</p>
            <div className="flex items-center gap-2">
               <div className="flex-1 bg-indigo-200/50 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: `${(Math.min(session.step, 8) / 8) * 100}%` }}></div>
               </div>
               <span className="text-[10px] font-bold text-indigo-400">{Math.round((Math.min(session.step, 8) / 8) * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Extracted Insights</h4>
          <div className="space-y-3">
             <InsightItem label="Primary Emotion" value={session.extracted.emotions[0] || 'Pending...'} />
             <InsightItem label="Core Need" value={session.extracted.needs[0] || 'Analyzing...'} />
             <InsightItem label="Relational Pattern" value={session.extracted.pattern ? 'Identified' : 'Detecting...'} />
          </div>
        </div>

        <div className="mt-auto p-6 bg-slate-50 border border-slate-100 rounded-3xl">
           <p className="text-[10px] text-slate-400 leading-relaxed italic">
             "The goal of IPT is to resolve the identified interpersonal problem area, thereby reducing depressive symptoms."
           </p>
        </div>
      </aside>
    </div>
  );
};

const InsightItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50">
    <span className="text-[11px] text-slate-400 font-medium">{label}</span>
    <span className="text-[11px] text-slate-800 font-bold">{value}</span>
  </div>
);

export default SessionPage;
