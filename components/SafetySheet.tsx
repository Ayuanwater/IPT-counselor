
import React from 'react';
import { ShieldAlert, Phone, User, X } from 'lucide-react';

interface SafetySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const SafetySheet: React.FC<SafetySheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-2xl rounded-t-3xl p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-2xl">
              <ShieldAlert className="text-orange-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">安全分诊提示</h2>
              <p className="text-sm text-slate-500">检测到较高程度的情绪波动</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <section className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">我们目前的建议：</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              您当前表达的情绪非常强烈。在继续探讨人际策略之前，确保您的即时安全是首要任务。建议暂停复杂的决策，先寻求现实世界的支持。
            </p>
          </section>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={onClose}
              className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User size={18} className="text-indigo-600" />
                <span className="text-sm font-medium text-slate-700">我现在安全，可以继续轻量对话</span>
              </div>
            </button>
            <div className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-slate-600" />
                <div className="text-left">
                  <span className="text-sm font-medium text-slate-700 block">寻求外部资源</span>
                  <span className="text-xs text-slate-500">拨打 12345 或 联系紧急联系人</span>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">推荐</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-400">IPT助手是一个结构化工具，不替代临床心理治疗或急诊服务。</p>
        </div>
      </div>
    </div>
  );
};

export default SafetySheet;
