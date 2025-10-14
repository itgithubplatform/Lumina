import { GoogleAi } from "@/lib/googleAi";

export async function POST(request: Request) {
  const { text } = await request.json();
  if (!text) {
    return new Response("No text provided", { status: 400 });
  }
  const googleAi = GoogleAi.getInstance();
  const prompt = `
You are a precise summarizer.
Your task is to extract the most important and useful information from the following text and write a clear, concise summary.
Do not remove or ignore key topics, terms, or important context.
Return the summary as a raw single-line string, without bullet points, markdown, or formatting.

Text:
${text}
`;

  try {
    const response = await googleAi.generateText(prompt);
    return new Response(JSON.stringify({ text: response }));
  } catch (error) {
    return new Response("Error generating text", { status: 500 });
  }
}