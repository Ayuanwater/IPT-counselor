
import { RiskLevel } from '../types';

const L3_KEYWORDS = ['自杀', '死', '结束生命', '杀了', '不想活', '安眠药', '遗嘱', '跳楼', '割腕'];
const L2_KEYWORDS = ['没希望', '绝望', '崩溃', '想打人', '失控', '想消失', '没有意义'];

export function identifyRisk(text: string): RiskLevel {
  const lowerText = text.toLowerCase();
  
  if (L3_KEYWORDS.some(k => lowerText.includes(k))) {
    return RiskLevel.L3;
  }
  
  if (L2_KEYWORDS.some(k => lowerText.includes(k))) {
    return RiskLevel.L2;
  }
  
  if (lowerText.length > 50 || lowerText.includes('难受') || lowerText.includes('痛苦')) {
    return RiskLevel.L1;
  }
  
  return RiskLevel.L0;
}
