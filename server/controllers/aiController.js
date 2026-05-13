import OpenAI from "openai";

export const chatbot = async (req, res) => {
  try {
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "OPENROUTER_API_KEY missing in .env",
      });
    }

    const { message } = req.body;

    const completion = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
You are an AI shopping assistant for an ecommerce website.

Your job:
- Understand user needs
- Detect category (mobile, laptop, fashion, etc)
- Detect budget if mentioned
- Give smart product suggestions

Always respond ONLY in this JSON format:

{
  "reply": "short helpful answer",
  "category": "mobile | laptop | fashion | other",
  "budget": number or null,
  "intent": "buy | browse | compare"
}
          `
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    let result;

    try {
      result = JSON.parse(completion.choices[0].message.content);
    } catch (err) {
      result = {
        reply: completion.choices[0].message.content,
        category: "other",
        budget: null,
        intent: "chat"
      };
    }

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.log("AI ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};