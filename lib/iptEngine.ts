
import OpenAI from "openai";
import { IPTFocus, Session } from '../types';

// 使用环境变量中的 API_KEY 初始化 DeepSeek 客户端 (OpenAI 兼容)
const client = new OpenAI({
  apiKey: process.env.API_KEY || process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
  dangerouslyAllowBrowser: true // 在前端直接调用 API
});

const STEP_DATA = [
  { step: 1, name: '目标定义', goal: '明确我们今天要解决的核心关系问题。' },
  { step: 2, name: '事件澄清', goal: '还原最近一次让您感到不适的互动细节。' },
  { step: 3, name: '情绪定位', goal: '识别在那一刻，您最真实的情绪反应。' },
  { step: 4, name: '需求澄清', goal: '挖掘情绪背后的心理需求是什么。' },
  { step: 5, name: '角色与期待', goal: '分析您与对方在这个关系中的角色期待。' },
  { step: 6, name: '循环识别', goal: '观察这种互动是否在重复某种模式。' },
  { step: 7, name: '沟通彩排', goal: '尝试用新的表达方式来改写局面。' },
  { step: 8, name: '行动计划', goal: '确定未来24小时内的一个微小行动。' },
  { step: 9, name: '咨询总结', goal: '回顾本次梳理的重点与下一步行动。' },
  { step: 10, name: '持续支持', goal: '基于已梳理的逻辑，陪伴您进行深度探索。' },
];

export const iptEngine = {
  getStepInfo: (step: number) => STEP_DATA[Math.min(step - 1, 9)],

  /**
   * 使用 DeepSeek Chat 生成回复。
   * 强化了关于持续对话的系统指令，防止 AI 主动截断会话。
   */
  generateResponse: async (session: Session, userInput: string): Promise<{ response: string; chips?: string[]; updates?: Partial<Session> }> => {
    const { step, iptFocus } = session;
    const stepInfo = iptEngine.getStepInfo(step);
    
    // 构造针对 IPT 咨询的深度提示词
    const systemPrompt = `你是一位专业的 IPT（人际关系疗法）咨询师。
    当前关注领域: ${getFocusName(iptFocus)}
    咨询阶段: 第 ${step} 步 (${stepInfo.name}) - 目标: ${stepInfo.goal}
    
    【核心交互准则】：
    1. **必须全程使用中文**。语气要温暖、专业、具有高度共情能力。
    2. **绝对禁止主动结束对话**。即使完成了 8 步流程，也不要说“再见”。
    3. 在总结阶段（Step 9+），请通过深入的开放式提问引导用户继续分享。
    4. 始终围绕用户的核心需求（Needs）和情绪模式（Patterns）进行反馈。
    5. **响应速度优化**：保持回复简洁而有力。
    6. 从输入中智能提取更新：如果用户提到了新的感受或事件，请更新到 extracted 字段中。
    7. 提供 3-4 个能够反映用户可能心态的“快捷回复选项”（chips）。
    8. **最终输出必须是严格的 JSON 格式**，包含 response, chips, updates 字段。
    `;

    const userPrompt = `对话历史摘要:
    ${session.messages.slice(-10).map(m => `${m.role === 'ai' ? '咨询师' : '用户'}: ${m.content}`).join('\n')}
    
    用户最新输入: "${userInput}"
    
    请以 JSON 格式输出回复。`;

    try {
      const response = await client.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content || '{}';
      const parsed = JSON.parse(content);
      
      // 处理第 8 步行动计划的默认生成
      if (step === 8 && userInput && !parsed.updates?.actionPlan) {
          parsed.updates = parsed.updates || {};
          parsed.updates.actionPlan = {
              task: userInput,
              successCriteria: "尝试用新的方式沟通，并察觉到自己情绪的微妙变化",
              backupPlan: "如果谈话不顺利，允许自己暂停并撤回安全空间",
              completed: false
          };
      }

      return {
        response: parsed.response || "我一直在倾听。刚才提到的这一点，您还想从哪个角度再展开聊聊？",
        chips: parsed.chips || ["我想继续深入聊聊", "关于刚才的需求...", "我现在的感受是..."],
        updates: parsed.updates || {}
      };
    } catch (error) {
      console.error("DeepSeek API Error:", error);
      return { 
        response: "抱歉，我刚才正在深思如何更好地支持您。关于您刚才分享的，您觉得最让您触动的是哪一部分？", 
        chips: ["我当下的情绪", "我想改变的沟通方式", "我的核心需求"] 
      };
    }
  },

  generateScripts: (session: Session) => {
    const need = session.extracted.needs[0] || "我的核心需求";
    const emotion = session.extracted.emotions[0] || "感到挺困扰的";
    const event = session.extracted.eventSummary || "最近发生的摩擦";
    
    return {
      gentle: `“我想和你聊聊关于${event}。其实我当时感到${emotion}，因为我真的很看重${need}。我们能不能试着换种方式？”`,
      firm: `“关于${event}，我希望你能明白，${need}对我来说非常重要。我不能接受那种被忽视的感觉，希望你能尊重我的边界。”`,
      short: `“关于这件事，我现在的感受是${emotion}，我最需要的是${need}。”`
    };
  }
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
