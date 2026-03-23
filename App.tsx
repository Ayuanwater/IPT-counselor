
import React, { useState, useEffect } from 'react';
import { Session, IPTFocus, AppView, RiskLevel } from './types';
import { storage } from './lib/storage';
import Layout from './components/Layout';
import Home from './pages/Home';
import SessionPage from './pages/SessionPage';
import ReportPage from './pages/ReportPage';
import HistoryPage from './pages/HistoryPage';
import SafetySheet from './components/SafetySheet';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [showSafety, setShowSafety] = useState(false);

  // Initialize view from hash or state
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as AppView;
      if (['home', 'session', 'report', 'history'].includes(hash)) {
        setActiveView(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (view: AppView) => {
    setActiveView(view);
    window.location.hash = view;
  };

  const startNewSession = (focus: IPTFocus) => {
    const newSession: Session = {
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      iptFocus: focus,
      riskLevel: RiskLevel.L0,
      step: 1,
      messages: [
        {
          id: 'welcome',
          role: 'ai',
          content: `好的，我们开始探讨${getFocusName(focus)}。为了有效利用这次时间，我们先从定义目标开始。您最想解决的问题是什么？`,
          timestamp: Date.now(),
          chips: ["我想缓和冲突", "我需要表达我的不满", "我希望更了解对方", "我不确定目标"]
        }
      ],
      extracted: {
        emotions: [],
        needs: []
      }
    };
    setCurrentSession(newSession);
    storage.saveCurrentSession(newSession);
    navigateTo('session');
  };

  const restartSession = () => {
    if (currentSession) {
      startNewSession(currentSession.iptFocus);
    } else {
      navigateTo('home');
    }
  };

  const updateSession = (updates: Partial<Session>) => {
    if (!currentSession) return;
    const updated = { ...currentSession, ...updates, updatedAt: Date.now() };
    setCurrentSession(updated);
    storage.saveCurrentSession(updated);
  };

  const handleSelectHistory = (session: Session) => {
    setCurrentSession(session);
    navigateTo('session');
  };

  const handleClearHistory = () => {
    storage.clearAll();
    setCurrentSession(null);
    navigateTo('home');
  };

  const getPageTitle = () => {
    switch (activeView) {
      case 'home': return '选择困扰领域';
      case 'session': return '深度咨询中';
      case 'report': return '分析报告';
      case 'history': return '咨询档案';
      default: return 'IPT AI';
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      onNavigate={navigateTo} 
      title={getPageTitle()}
    >
      {activeView === 'home' && <Home onStart={startNewSession} />}
      
      {activeView === 'session' && currentSession && (
        <SessionPage 
          session={currentSession} 
          updateSession={updateSession} 
          onShowSafety={() => setShowSafety(true)}
          onNavigate={navigateTo}
          onRestart={restartSession}
        />
      )}

      {activeView === 'report' && currentSession && (
        <ReportPage session={currentSession} onNavigate={navigateTo} />
      )}

      {activeView === 'history' && (
        <HistoryPage 
          onSelect={handleSelectHistory} 
          onClear={handleClearHistory} 
        />
      )}

      {/* Placeholder for no active session */}
      {['session', 'report'].includes(activeView) && !currentSession && (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
          <div className="p-4 bg-slate-50 rounded-full text-slate-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-slate-900 font-semibold">未检测到活动会话</h3>
            <p className="text-slate-400 text-sm">请先从首页开始一个新的 IPT 咨询流程。</p>
          </div>
          <button onClick={() => navigateTo('home')} className="px-6 py-2 bg-indigo-600 text-white rounded-2xl text-sm font-medium">
            去首页
          </button>
        </div>
      )}

      <SafetySheet isOpen={showSafety} onClose={() => setShowSafety(false)} />
    </Layout>
  );
};

function getFocusName(focus: IPTFocus): string {
  const map = {
    [IPTFocus.DISPUTES]: '人际冲突',
    [IPTFocus.TRANSITION]: '角色转变',
    [IPTFocus.GRIEF]: '哀伤处理',
    [IPTFocus.DEFICITS]: '社交孤立',
    [IPTFocus.UNCERTAIN]: '关系困扰'
  };
  return map[focus];
}

export default App;
