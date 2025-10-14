//api/ai-assistant/route.ts
import { NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";
import Speech from "@google-cloud/speech";

const SpeechClient = new Speech.SpeechClient();
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    let message = formData.get("message")?.toString() || "";
    const url = formData.get("url")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const audioFile = formData.get("audio") as File | null;
    if (audioFile) {
    try {
      const operation = await SpeechClient.recognize({
        audio: {content: Buffer.from(await audioFile.arrayBuffer()).toString("base64")},
         config:{
        encoding: "WEBM_OPUS",
        enableAutomaticPunctuation: false,
        enableWordTimeOffsets: false,
        sampleRateHertz: 48000,
        languageCode: "en",
        alternativeLanguageCodes:["en","hi","bn"],
        model: "default", 
      }
      });
      console.log(operation);
      
      const [response] = operation

      const results = response.results || [];

      const fullTranscription = results
        .map((result) => result.alternatives?.[0]?.transcript)
        .join(" ");
        message = fullTranscription.trim()
      
        
    } catch (error) {
      throw new Error(
        "Error transcribing from URL: " + (error as Error).message
      );
    }
    }
    // const { message, url, content } = await req.json();

    const vertexAI = new VertexAI({
      project: process.env.GOOGLE_PROJECT_ID,
      location: process.env.LOCATION || "us-central1",
    });

    const model = vertexAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
      You are an intelligent AI assistant for the Lumina educational website.
      The user may be visually impaired and may refer to the current page content.

      Website page context:
      - Current URL: ${url}
      - Visible text snippet: "${content?.slice(0, 1000)}"

      The user might say things like:
      - "Summarize this page"
      - "Explain how to use this feature"
      - "Open signup page"
      - "Download notes"
      - "Go to lecture"
      
      Your job:
      1. Use the page context to give meaningful help or summaries.
      2. Identify the intent and output a JSON response only in this exact structure:
      {
        "action": "<navigate | summarize | explain | download | help>",
        "target": "<page section or keyword>",
        "response": "<natural helpful reply for the user>"
      }

      User message: "${message}"
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Try to safely parse JSON response
    const jsonString = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(jsonString);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("AI assistant error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
