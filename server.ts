import express from "express";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 路由：处理 DeepSeek 聊天请求
  app.post("/api/chat", async (req, res) => {
    try {
      const { systemPrompt, userPrompt } = req.body;
      
      const apiKey = process.env.DEEPSEEK_API_KEY || process.env.API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "DEEPSEEK_API_KEY not configured on server" });
      }

      const client = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://api.deepseek.com",
        timeout: 20000, // 20 seconds timeout
      });

      const response = await client.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content || '{}';
      res.json(JSON.parse(content));
    } catch (error: unknown) {
      console.error("Server API Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite 中间件：开发环境下使用 Vite 处理静态资源和 HMR
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // 生产环境下提供构建后的静态文件
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
