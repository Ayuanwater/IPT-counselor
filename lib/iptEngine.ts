
import { IPTFocus, Session } from '../types';

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
   * 使用服务器端代理调用 DeepSeek Chat 生成回复。
   * 强化了关于持续对话的系统指令，防止 AI 主动截断会话。
   */
  generateResponse: async (session: Session, userInput: string): Promise<{ response: string; chips?: string[]; updates?: Partial<Session> }> => {
    const { step, iptFocus } = session;
    const stepInfo = iptEngine.getStepInfo(step);
    
    // 构造针对 IPT 咨询的深度提示词
    const systemPrompt = `你是一位专业的心理陪伴者与 IPT（人际关系疗法）咨询师。
    当前关注领域: ${getFocusName(iptFocus)}
    咨询阶段: 第 ${step} 步 (${stepInfo.name}) - 目标: ${stepInfo.goal}
    
    【核心交互准则 - 拟人化与自然交流】：
    1. **像真人一样聊天**：必须全程使用中文。语言要自然、松弛、口语化，有真实的人际交流温度。绝对避免使用“你可以…”、“建议你…”、“如果你愿意，我们可以继续…”等客服或AI模板句式。不要像写提纲一样分点作答。
    2. **先接住情绪，再回应**：优先体现对用户语气、情绪、上下文的理解。让用户感觉“你真的听懂了”，而不是一上来就分析、下结论或提方案。允许有细微情绪温度，能识别用户话里轻微的疲惫、委屈、压抑、犹豫。
    3. **不要急于推进流程**：不要在每次回复结尾都急着引导用户做下一件事。很多时候只需要简短地共情、陪伴、澄清，顺其自然地对话。有些时刻不用立刻问问题，有些时刻只需要回应和接住，保持一点留白。
    4. **分寸感与真实温度**：保持温暖但不夸张，不要过度煽情，不要滥用“我理解你”“抱抱你”之类空泛表达。不要过分殷勤或试图“解决一切”。
    5. **绝对禁止主动结束对话**。即使完成了 8 步流程，也不要说“再见”。
    6. **第8步及以后的自由对话**：在第8步完成后，进入“可继续聊，但不打扰、不催促、不替用户安排路径”的状态。不要再主动进入“收尾引导模式”或“提问推进模式”。顺着用户的话慢慢回应，陪伴式发掘问题要藏在自然聊天里，而不是显性提问。
    7. **智能提取与报告生成**：
       - 从输入中提取更新到 \`extracted\` 字段中。\`eventSummary\` 必须是简短的名词性短语，绝对不能包含“用户”二字。
       - 当到达第 8 步时，必须生成 \`report\` 字段，包含：
         - \`expressionAdvice\`: 表达建议。分析用户表达中的卡点、压抑点，提供自然、贴近语境的表达支持，而非模板式沟通术。
         - \`actionAdvice\`: 行动建议。适度、具体、可执行，克制且不给压力，帮助看清下一步而非命令改变。
         - \`conceptualSummary\`: 概念性总结。抽象总结核心情绪状态、关系模式或内在冲突。偏“理解与照见”，不要写成医学诊断或僵硬报告腔。
    8. **快捷回复选项 (chips)**：在前7步，提供 2-3 个反映用户可能心态的口语化短句。**在第8步及以后，必须返回空的 chips 数组 []**，不给用户强引导感。
    
    **最终输出必须是严格的 JSON 格式**，必须完全符合以下结构：
    {
      "response": "你的自然、拟人化的回复文本",
      "chips": ["选项1", "选项2"], // 第8步及以后必须为空数组 []
      "updates": {
        "extracted": {
          "eventSummary": "事件的简短名词性总结（绝对不含'用户'二字）",
          "emotions": ["情绪1", "情绪2"],
          "needs": ["需求1", "需求2"],
          "pattern": "识别出的互动模式"
        },
        "report": { // 特别是在第8步时生成
          "expressionAdvice": "温和具体的表达建议...",
          "actionAdvice": "克制可执行的行动建议...",
          "conceptualSummary": "有洞察的概念性总结..."
        }
      }
    }
    注意：updates 字段中的内容应根据用户的最新输入进行更新，如果没有新信息可以省略相应字段。
    `;

    const userPrompt = `对话历史摘要:
    ${session.messages.slice(-10).map(m => `${m.role === 'ai' ? '咨询师' : '用户'}: ${m.content}`).join('\n')}
    
    用户最新输入: "${userInput}"
    
    请以 JSON 格式输出回复。`;

    try {
      // 调用服务器端 API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ systemPrompt, userPrompt }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to fetch from server";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let parsed;
      try {
        const text = await response.text();
        parsed = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error("Invalid JSON response from server");
      }
      
      // 处理第 8 步报告的默认生成
      if (step === 8 && userInput && !parsed.updates?.report) {
          parsed.updates = parsed.updates || {};
          parsed.updates.report = {
              expressionAdvice: "尝试用温和但坚定的语气表达你的感受和需求，例如：'当你这样做时，我感到有些受伤，因为我需要被尊重。'",
              actionAdvice: "在接下来的24小时内，给自己留出15分钟的独处时间，什么都不做，只是感受自己的呼吸和当下的情绪。",
              conceptualSummary: "你正在经历一段充满挑战的关系互动，这触发了你内在对于安全感和被认可的渴望。识别出这个模式，是你走向改变的第一步。"
          };
      }

      return {
        response: parsed.response || "我一直在倾听。刚才提到的这一点，您还想从哪个角度再展开聊聊？",
        chips: step >= 8 ? [] : (parsed.chips || ["我想继续深入聊聊", "关于刚才的需求...", "我现在的感受是..."]),
        updates: parsed.updates || {}
      };
    } catch (error) {
      console.error("Chat API Error:", error);
      return { 
        response: "抱歉，我刚才正在深思如何更好地支持您。关于您刚才分享的，您觉得最让您触动的是哪一部分？", 
        chips: step >= 8 ? [] : ["我当下的情绪", "我想改变的沟通方式", "我的核心需求"] 
      };
    }
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
