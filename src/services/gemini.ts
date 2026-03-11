import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export async function generateLinkedInPost(topic: string) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const systemInstruction = `You are a world-class Product Designer and thought leader on LinkedIn. 
Your goal is to write highly engaging, insightful, and professional LinkedIn posts about product design thinking techniques.

Guidelines:
- Tone: Professional, visionary, yet approachable.
- Structure: Start with a hook, follow with 3-5 actionable points or deep insights, and end with a call to action or a thought-provoking question.
- Style: Use line breaks for readability. Use emojis sparingly but effectively.
- Content: Focus on "Product Designer Thinking Techniques" (e.g., First Principles, Systems Thinking, Jobs to be Done, Emotional Design, etc.).
- Length: Medium (approx 150-300 words).

Topic: ${topic}`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: systemInstruction }] }],
  });

  return response.text;
}
