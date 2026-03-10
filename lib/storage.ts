
import { Session } from '../types';

const STORAGE_KEY = 'ipt_sessions_v1';

export const storage = {
  saveSessions: (sessions: Session[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  },
  getSessions: (): Session[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveCurrentSession: (session: Session) => {
    const sessions = storage.getSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    storage.saveSessions(sessions);
  },
  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
