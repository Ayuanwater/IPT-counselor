
import React from 'react';
import { Session, IPTFocus } from '../types';
import { storage } from '../lib/storage';
import { Trash2, ChevronRight, Clock, MessageSquare } from 'lucide-react';

interface HistoryPageProps {
  onSelect: (session: Session) => void;
  onClear: () => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ onSelect, onClear }) => {
  const sessions = storage.getSessions().sort((a, b) => b.updatedAt - a.updatedAt);

  const getFocusLabel = (focus: IPTFocus) => {
    const labels = {
      [IPTFocus.DISPUTES]: '人际冲突',
      [IPTFocus.TRANSITION]: '角色转变',
      [IPTFocus.GRIEF]: '哀伤',
      [IPTFocus.DEFICITS]: '孤立',
      [IPTFocus.UNCERTAIN]: '未知',
    };
    return labels[focus];
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">历史与隐私</h2>
          <p className="text-sm text-slate-500">仅保存在本地，清除后不可恢复。</p>
        </div>
        <button 
          onClick={() => {
            if (confirm('确定要清空所有数据吗？此操作无法撤销。')) {
              onClear();
            }
          }}
          className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <MessageSquare size={32} className="mx-auto text-slate-200 mb-4" />
            <p className="text-sm text-slate-400">暂无历史咨询记录</p>
          </div>
        ) : (
          sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all text-left"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <span className="text-sm font-semibold text-slate-800">{getFocusLabel(s.iptFocus)}</span>
                   <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold">STEP {s.step}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={12} />
                  <span>{new Date(s.createdAt).toLocaleDateString()} {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>
          ))
        )}
      </div>

      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <ShieldCheck size={18} className="text-teal-400" />
          数据隐私承诺
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          IPT AI 咨询师采用“离线优先”设计。我们不上传您的任何对话、情绪或身份信息到云端。所有数据仅存在于您目前使用的这个浏览器存储空间中。
        </p>
        <div className="flex items-center gap-2 text-[10px] text-teal-400 font-mono">
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
          SECURE LOCAL STORAGE ACTIVE
        </div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default HistoryPage;
