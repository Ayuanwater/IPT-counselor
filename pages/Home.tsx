
import React from 'react';
import { IPTFocus } from '../types';
import { Users, RefreshCw, Heart, UserMinus, HelpCircle, ArrowUpRight } from 'lucide-react';

interface HomeProps {
  onStart: (focus: IPTFocus) => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  const cards = [
    { id: IPTFocus.DISPUTES, title: '人际冲突', desc: '处理与伴侣、家人或同事之间的长期分歧、争执与对抗模式。', icon: <Users />, theme: 'indigo' },
    { id: IPTFocus.TRANSITION, title: '角色转变', desc: '应对职场晋升、生活环境迁徙、身份切换等重大生命阶段带来的压力。', icon: <RefreshCw />, theme: 'teal' },
    { id: IPTFocus.GRIEF, title: '哀伤处理', desc: '在失去亲近者后寻求情感的平复、重建与心理能量的重新校准。', icon: <Heart />, theme: 'rose' },
    { id: IPTFocus.DEFICITS, title: '社交孤立', desc: '突破长期的孤独感、社交回避，建立更深层的、富有意义的人际连接。', icon: <UserMinus />, theme: 'slate' },
  ];

  return (
    <div className="p-8 md:p-12 lg:p-16 space-y-12 animate-in fade-in duration-700">
      <div className="max-w-3xl space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
          启动结构化人际对话<br/><span className="text-indigo-600">重建心理韧性</span>
        </h2>
        <p className="text-slate-500 text-lg leading-relaxed max-w-2xl font-light">
          人际关系疗法（IPT）专注于通过改善社交互动来缓解情绪。请选择一个目前最触动您的领域，我们将通过 8 个关键步骤引导您深度剖析现状。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onStart(card.id)}
            className="flex flex-col h-full items-start p-8 bg-white border border-slate-200/50 rounded-[32px] shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-indigo-200 transition-all duration-500 text-left group relative overflow-hidden"
          >
            <div className={`p-4 rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-500 bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600`}>
              {React.cloneElement(card.icon as React.ReactElement<any>, { size: 28 })}
            </div>
            <h3 className="font-bold text-slate-800 text-xl mb-3 tracking-tight">{card.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light mb-8">{card.desc}</p>
            
            <div className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              Start Evaluation <ArrowUpRight size={14}/>
            </div>

            {/* Subtle background glow */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center">
            <HelpCircle size={24} className="text-slate-300" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">不确定该从何处开始？</h4>
            <p className="text-xs text-slate-400">我们将通过一系列初步问题协助您定位核心冲突</p>
          </div>
        </div>
        <button
          onClick={() => onStart(IPTFocus.UNCERTAIN)}
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          系统引导诊断
        </button>
      </div>

      <div className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase tracking-[0.2em] text-center opacity-60">
        Professional Tooling • End-to-End Privacy • No External Diagnosis
      </div>
    </div>
  );
};

export default Home;
