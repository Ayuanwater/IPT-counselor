import React from 'react';
import { Session, AppView } from '../types';
import { ArrowLeft, MessageCircle, Compass, Lightbulb } from 'lucide-react';

interface ReportPageProps {
  session: Session;
  onNavigate: (view: AppView) => void;
}

const ReportPage: React.FC<ReportPageProps> = ({ session, onNavigate }) => {
  const report = session.report;

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <p className="text-slate-500">报告尚未生成，请先完成深度咨询。</p>
        <button onClick={() => onNavigate('session')} className="px-6 py-2 bg-indigo-600 text-white rounded-2xl text-sm font-medium">
          返回咨询
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => onNavigate('session')}
          className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">分析报告</h2>
          <p className="text-sm text-slate-500 mt-1">基于我们刚才的交流，为您整理的专属洞察与建议。</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 概念性总结 */}
        <section className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <Lightbulb size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">理解与照见</h3>
          </div>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {report.conceptualSummary || "暂无总结"}
          </p>
        </section>

        {/* 表达建议 */}
        <section className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
              <MessageCircle size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">表达支持</h3>
          </div>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {report.expressionAdvice || "暂无建议"}
          </p>
        </section>

        {/* 行动建议 */}
        <section className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
              <Compass size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">下一步参考</h3>
          </div>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {report.actionAdvice || "暂无建议"}
          </p>
        </section>
      </div>
      
      <div className="pt-8 pb-12 text-center">
        <button 
          onClick={() => onNavigate('session')}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
        >
          继续自由倾诉
        </button>
      </div>
    </div>
  );
};

export default ReportPage;
