
import React from 'react';
import { AppView } from '../types';
import { Home, MessageSquare, ShieldCheck, ClipboardList, History, Search, Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, title }) => {
  return (
    <div className="flex h-screen w-full bg-[#FBFBFC] overflow-hidden text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/60 z-20">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-xs">IPT</span>
            </div>
            <h1 className="font-bold text-sm tracking-tight text-slate-800 uppercase">Clinical Studio</h1>
          </div>
          
          <nav className="space-y-1">
            <SidebarItem icon={<Home size={18}/>} label="概览首页" active={activeView === 'home'} onClick={() => onNavigate('home')} />
            <SidebarItem icon={<MessageSquare size={18}/>} label="实时咨询" active={activeView === 'session'} onClick={() => onNavigate('session')} />
          </nav>
        </div>

        <div className="mt-auto p-8 pt-0 space-y-1">
          <div className="h-px bg-slate-100 mb-6" />
          <SidebarItem icon={<History size={18}/>} label="历史档案" active={activeView === 'history'} onClick={() => onNavigate('history')} />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Universal Top Header */}
        <header className="h-16 px-6 md:px-10 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-widest md:hidden">IPT</span>
            <h2 className="text-sm font-semibold text-slate-800 tracking-tight">{title}</h2>
          </div>
          <div className="flex items-center gap-5 text-slate-400">
            <button className="hover:text-slate-600 transition-colors"><Search size={18}/></button>
            <button className="hover:text-slate-600 transition-colors relative">
              <Bell size={18}/>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
               <span className="text-[10px] font-bold text-slate-500">USER</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#FBFBFC]">
          <div className="w-full h-full max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden border-t border-slate-200/60 px-6 py-3 bg-white/90 backdrop-blur-xl flex justify-between items-center z-20">
          <MobileNavItem icon={<Home size={22}/>} active={activeView === 'home'} onClick={() => onNavigate('home')} />
          <MobileNavItem icon={<MessageSquare size={22}/>} active={activeView === 'session'} onClick={() => onNavigate('session')} />
          <MobileNavItem icon={<History size={22}/>} active={activeView === 'history'} onClick={() => onNavigate('history')} />
        </nav>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      active 
      ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
    }`}
  >
    <span className={`${active ? 'text-indigo-600' : 'text-slate-400'}`}>{icon}</span>
    {label}
  </button>
);

const MobileNavItem = ({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-xl transition-all ${active ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {icon}
  </button>
);

export default Layout;
