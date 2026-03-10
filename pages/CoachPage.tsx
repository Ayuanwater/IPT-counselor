
import React, { useState } from 'react';
import { Session } from '../types';
import { iptEngine } from '../lib/iptEngine';
// Fixed missing Heart import and removed unused MessageSquareText
import { Copy, Check, Heart, ShieldCheck, Zap } from 'lucide-react';

interface CoachPageProps {
  session: Session;
}

const CoachPage: React.FC<CoachPageProps> = ({ session }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const scripts = iptEngine.generateScripts(session);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const scriptCards = [
    { id: 'gentle', title: '温和版', desc: '侧重于表达脆弱性与邀请合作', content: scripts.gentle, icon: <Heart size={18} className="text-rose-500" /> },
    { id: 'firm', title: '坚定版', desc: '清晰界定边界与核心心理需求', content: scripts.firm, icon: <ShieldCheck size={18} className="text-indigo-500" /> },
    { id: 'short', title: '一句话版', desc: '适合快节奏对话或初步试探', content: scripts.short, icon: <Zap size={18} className="text-amber-500" /> },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">对话教练</h2>
        <p className="text-sm text-slate-500">基于刚才的谈话，我们为您生成了三个不同倾向的话术模板。点击可直接复制。</p>
      </div>

      <div className="space-y-4">
        {scriptCards.map((card) => (
          <div key={card.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {card.icon}
                <span className="text-sm font-semibold text-slate-800">{card.title}</span>
              </div>
              <button 
                onClick={() => handleCopy(card.content, card.id)}
                className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                {copied === card.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">{card.desc}</p>
            <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-700 leading-relaxed italic border border-slate-100">
              {card.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100">
        <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">微调建议</h3>
        <p className="text-xs text-indigo-600/80 leading-relaxed">
          如果您觉得对方防备心较重，可以先从“描述事实”开始，而不是“表达评价”。点击上面的“温和版”话术是最好的起点。
        </p>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-slate-400 italic">“言语是窗户，或者是墙。”</p>
      </div>
    </div>
  );
};

export default CoachPage;
