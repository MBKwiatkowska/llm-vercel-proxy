// api/chat.js
export default async function handler(req, res) {
  // ✅ Obsługa CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Obsługa preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).send("Only POST requests allowed");
  }

  const { apiKey, prompt, model } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: model || "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("🔥 ERROR:", error);
    return res.status(500).json({
      error: error.message || "Unknown error"
    });
  }
}

 