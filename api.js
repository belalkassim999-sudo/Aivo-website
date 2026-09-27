import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions: `
You are Aivo's AI receptionist for a business.

Be friendly, professional, and concise.
Help customers with:
- business hours
- prices
- services
- location
- appointment requests

Do NOT claim an appointment is actually booked unless a real
booking system confirms it.

If a customer wants an appointment, ask for:
1. preferred day
2. preferred time
3. name
4. phone number

Then tell them the request can be submitted for confirmation.
`,
      input: message
    });

    return res.status(200).json({
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Aivo could not respond right now."
    });
  }
}
