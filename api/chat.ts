import OpenAI from "openai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// 允许 Vercel 函数运行更长时间（Hobby 计划最高 60 秒）
export const maxDuration = 60;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { systemPrompt, userPrompt } = req.body;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "DEEPSEEK_API_KEY not configured" });
    }

    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.deepseek.com",
      timeout: 50000,
    });

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return res.status(500).json({
        error: "Model returned invalid JSON",
        raw: content
      });
    }

    return res.status(200).json(parsed);
  } catch (error: unknown) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal Server Error"
    });
  }
}
