
import React, { useState } from 'react';
import { Session } from '../types';
import { CheckCircle2, Circle, AlertCircle, TrendingUp } from 'lucide-react';

interface ActionPageProps {
  session: Session;
  updateSession: (updates: Partial<Session>) => void;
}

const ActionPage: React.FC<ActionPageProps> = ({ session, updateSession }) => {
  const [reflection, setReflection] = useState(session.reflection || '');

  const action = session.actionPlan || {
    task: "今晚给对方发一条短信，告知我晚点想和他聊聊。",
    successCriteria: "对方回复或看到消息",
    backupPlan: "如果对方没回，我也完成了表达的动作，今晚先早点休息。",
    completed: false
  };

  const toggleComplete = () => {
    updateSession({
      actionPlan: { ...action, completed: !action.completed }
    });
  };

  const saveReflection = () => {
    updateSession({ reflection });
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">24小时行动计划</h2>
        <p className="text-sm text-slate-500">不要试图一次性解决所有问题，先完成这个微小的行动。</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <button 
          onClick={toggleComplete}
          className="w-full flex items-start gap-4 text-left group"
        >
          <div className={`mt-1 flex-shrink-0 transition-transform group-active:scale-90 ${action.completed ? 'text-green-500' : 'text-slate-300'}`}>
            {action.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </div>
          <div>
            <h3 className={`text-lg font-semibold transition-all ${action.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
              {action.task}
            </h3>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">今日核心任务</p>
          </div>
        </button>

        <div className="mt-8 space-y-4 pt-6 border-t border-slate-50">
          <div className="flex gap-3">
            <TrendingUp size={18} className="text-indigo-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-800">成功标准</p>
              <p className="text-sm text-slate-500">{action.successCriteria}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-800">备选方案 (如果受挫)</p>
              <p className="text-sm text-slate-500">{action.backupPlan}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">行动后反馈 (24h后)</h3>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="当你尝试了行动，无论结果如何，在这里写下一句话感受..."
          className="w-full h-32 bg-white border border-slate-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none shadow-sm"
        />
        <button 
          onClick={saveReflection}
          className="w-full py-3 bg-slate-100 text-slate-600 rounded-2xl text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          保存反馈
        </button>
      </div>

      <div className="pt-4 text-center">
        <p className="text-[10px] text-slate-400">完成行动是疗愈的开始。</p>
      </div>
    </div>
  );
};

export default ActionPage;
