
export enum IPTFocus {
  DISPUTES = 'interpersonal_disputes',
  TRANSITION = 'role_transition',
  GRIEF = 'grief',
  DEFICITS = 'interpersonal_deficits',
  UNCERTAIN = 'uncertain'
}

export enum RiskLevel {
  L0 = 0,
  L1 = 1,
  L2 = 2,
  L3 = 3
}

export interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: number;
  chips?: string[];
}

export interface Report {
  expressionAdvice: string;
  actionAdvice: string;
  conceptualSummary: string;
}

export interface Session {
  id: string;
  createdAt: number;
  updatedAt: number;
  iptFocus: IPTFocus;
  riskLevel: RiskLevel;
  step: number; // 1-8
  goal?: string;
  relationshipTarget?: string;
  messages: Message[];
  extracted: {
    eventSummary?: string;
    emotions: string[];
    needs: string[];
    pattern?: string;
  };
  report?: Report;
  reflection?: string;
}

export type AppView = 'home' | 'session' | 'report' | 'history';
