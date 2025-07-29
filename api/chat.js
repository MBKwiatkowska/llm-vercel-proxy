const axios = require('axios');

module.exports = async (req, res) => {
  // ✅ Nagłówki CORS wymagane przez przeglądarkę / Power BI:
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Obsługa "preflight" → odpowiadamy na OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests allowed');
  }

  const { apiKey, prompt, model } = req.body;

  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: model || 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("🔥 ERROR:", error.response?.data || error.message);
    return res.status(500).json({
      error: error.response?.data || error.message
    });
  }
};
// ✅ Dodatkowe nagłówki CORS, jeśli potrzebne
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
res.setHeader("Access-Control-Allow-Credentials", "true");  