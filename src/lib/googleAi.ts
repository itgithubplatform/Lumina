import { VertexAI } from "@google-cloud/vertexai";
import textToSpeech from "@google-cloud/text-to-speech";
import { writeFile } from "fs/promises";

export class GoogleAi {
    private static instance: GoogleAi;
    private vertex;
    private ttsClient;
    private constructor() {
        const projectID = process.env.GOOGLE_PROJECT_ID;
        if (!projectID) {
            throw new Error("Missing GOOGLE_CLOUD_PROJECT environment variable");
        }
        this.vertex = new VertexAI({
            project: projectID,
            location: "asia-south1",
            googleAuthOptions: {
                keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            },
        }).getGenerativeModel({
            model: "gemini-2.5-flash",
        });
        this.ttsClient = new textToSpeech.TextToSpeechClient();
    }
    public static getInstance(): GoogleAi {
        if (!GoogleAi.instance) {
            GoogleAi.instance = new GoogleAi();
        }
        return GoogleAi.instance;
    }
    async generateText(prompt: string) {
        try {
            if (prompt.trim() === "" || prompt.length > 10000) {
                throw new Error("Invalid prompt");
            }
            const response = await this.vertex.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });
            return response.response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        } catch (error) {
            throw new Error("Error generating text: " + (error as Error)?.message);;
        }
    }
    async generateTextToSpeech(text: string, outputFile = "public/output.mp3") {
        try {
            const [response] = await this.ttsClient.synthesizeSpeech({
                input: { text },
                voice: {
                    "languageCode": "en-in",
                    "modelName": "gemini-2.5-flash-tts",
                    "name": "Aoede"
                },
                audioConfig: {
                    audioEncoding: "MP3",
                    speakingRate: 1.0,
                    pitch: -5.0,
                },
            })
            if (!response.audioContent) {
                throw new Error("No audio content received");
            }
            await writeFile(outputFile, response.audioContent, 'binary');
        } catch (error) {
            throw new Error("Error generating speech: " + (error as Error)?.message);;
        }
    }

}