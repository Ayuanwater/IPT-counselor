import express from "express";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API routes FIRST
  app.post("/api/chat", async (req, res) => {
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
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
