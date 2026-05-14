import OpenAI from "openai";

export const chatbot = async (req, res) => {
  try {
    // CHECK API KEY
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "OPENROUTER_API_KEY missing in .env",
      });
    }

    // OPENROUTER CLIENT
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const { message } = req.body;

    // VALIDATION
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // AI RESPONSE
    const completion = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",

      messages: [
        {
          role: "system",
          content: `
You are a smart AI shopping assistant for a modern ecommerce website.

Your behavior:
- Sound like a real ecommerce assistant
- Give trendy and engaging replies
- Use emojis naturally
- Suggest products smartly
- Ask follow-up questions
- Never give boring generic responses
- Keep replies short and modern

Categories:
mobile
laptop
fashion
electronics
other

Intent:
buy
browse
compare

Always respond ONLY in valid JSON format.

Examples:

User: I want black hoodie

Assistant:
{
  "reply": "Black hoodies are trending 🔥 Do you want oversized, zipper, or printed style?",
  "category": "fashion",
  "budget": null,
  "intent": "browse"
}

User: Best shoes under ₹2000

Assistant:
{
  "reply": "You can get stylish sneakers and running shoes under ₹2000 👟 Are you looking for sports or casual wear?",
  "category": "fashion",
  "budget": 2000,
  "intent": "buy"
}

User: Suggest gaming phone under ₹15000

Assistant:
{
  "reply": "For gaming under ₹15000, phones with Snapdragon processors and 120Hz displays are great 🔥",
  "category": "mobile",
  "budget": 15000,
  "intent": "buy"
}

Return ONLY valid JSON.
          `,
        },

        {
          role: "user",
          content: message,
        },
      ],

      temperature: 0.8,
      max_tokens: 200,
    });

    const aiText = completion.choices[0].message.content;

    let result;

    // SAFE JSON PARSE
    try {
      result = JSON.parse(aiText);
    } catch (err) {
      result = {
        reply: aiText || "Sorry, something went wrong.",
        category: "other",
        budget: null,
        intent: "browse",
      };
    }

    // FINAL RESPONSE
    res.json({
      success: true,
      reply: result.reply,
      category: result.category,
      budget: result.budget,
      intent: result.intent,
    });

  } catch (error) {
    console.log("AI ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};