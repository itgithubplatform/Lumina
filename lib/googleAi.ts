import { VertexAI } from "@google-cloud/vertexai";
import textToSpeech from "@google-cloud/text-to-speech";
import { writeFile } from "fs/promises";
import { Storage } from "@google-cloud/storage";
import path from "path";
import fs from "fs";
import Speech from "@google-cloud/speech";

export class GoogleAi {
    private static instance: GoogleAi;
    private vertex;
    private ttsClient;
    private storageClient;
    private SpeechClient;
    private constructor() {
        const projectID = process.env.GOOGLE_PROJECT_ID;
        if (!projectID) {
            throw new Error("Missing GOOGLE_CLOUD_PROJECT environment variable");
        }
        this.vertex = new VertexAI({
            project: projectID,
            googleAuthOptions: {
                keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            },
            location: "asia-south1",
        }).getGenerativeModel({
            model: "gemini-2.5-flash",
        });
        this.ttsClient = new textToSpeech.TextToSpeechClient();
        this.storageClient = new Storage()
        this.SpeechClient = new Speech.SpeechClient();
    }
    public static getInstance(): GoogleAi {
        if (!GoogleAi.instance) {
            GoogleAi.instance = new GoogleAi();
        }
        return GoogleAi.instance;
    }
    async generateText(prompt: string) {
        try {
            const response = await this.vertex.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });
            return response.response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        } catch (error) {
            throw new Error("Error generating text: " + (error as Error)?.message);;
        }
    }
    async generateTextToSpeech(text: string, outputFile = `./uploads/${Date.now()}-output.mp3`) {
        try {
            const [response] = await this.ttsClient.synthesizeSpeech({
                input: { text },
                voice: {
                    "languageCode": "en-in",
                    "name": "en-IN-Chirp3-HD-Achernar"
                },
                audioConfig: {
                    audioEncoding: "MP3",
                    speakingRate: 0.9,
                    pitch: 0,
                },
            })
            if (!response.audioContent) {
                throw new Error("No audio content received");
            }
            await writeFile(outputFile, response.audioContent, 'binary');
            const {publicUrl} = await this.uploadToCloudStorage(outputFile, "audio");
            fs.unlinkSync(outputFile);
            return publicUrl;
        } catch (error) {
            throw new Error("Error generating speech: " + (error as Error)?.message);;
        }
    }
    async generateSpeechToText(audioUrl: string, lang:"en"|"hi"|"bn" = "en") {
    try {
      const audio = { uri: audioUrl };

      const [operation] = await this.SpeechClient.longRunningRecognize({
        audio,
         config:{
        encoding: "MP3",
        enableAutomaticPunctuation: false,
        enableWordTimeOffsets: true,
        sampleRateHertz: 16000,
        languageCode: lang,
        alternativeLanguageCodes:["en","hi","bn"],
        model: "default", 
      }
      });

      const [response] = await operation.promise();

      const results = response.results || [];

      const fullTranscription = results
        .map((result) => result.alternatives?.[0]?.transcript)
        .join(" ");

      const words = results
        .flatMap((result) => result.alternatives?.[0]?.words || [])
        .map((word) => ({
          word: word.word,
          startTime: parseFloat(word.startTime?.seconds?.toString() || "0") +
                     (word.startTime?.nanos || 0) / 1e9,
          endTime: parseFloat(word.endTime?.seconds?.toString() || "0") +
                   (word.endTime?.nanos || 0) / 1e9,
        }));

      return {
        transcription: fullTranscription.trim(),
        words, 
        detectedLanguage:
          results[0]?.languageCode || "unknown", 
      };
    } catch (error) {
      throw new Error(
        "Error transcribing from URL: " + (error as Error).message
      );
    }
  }
    async uploadToCloudStorage(sourcePath: string, fileType: "hls" | "audio"): Promise<{publicUrl: string, googleStorageUri: string}> {
        const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
        if (!bucketName) throw new Error("Missing bucket");

        const bucket = this.storageClient.bucket(bucketName);

        if (fileType === "hls") {
            const files = fs.readdirSync(sourcePath);
            const uploadId = Date.now();
            await Promise.all(files.map(file => {
                const filePath = path.join(sourcePath, file);
                const ext = path.extname(file);
                return bucket.upload(filePath, {
                    destination: `hls/${uploadId}/${file}`,
                    metadata: {
                        cacheControl: ext === '.m3u8' ? "public, max-age=2" : "public, max-age=31536000"
                    }
                });
            }));
            return {publicUrl: `https://storage.googleapis.com/${bucketName}/hls/${uploadId}/master.m3u8`, googleStorageUri: `gs://${bucketName}/hls/${uploadId}/master.m3u8`};
        }
        const newFileName = `${Date.now()}-${path.basename(sourcePath)}`
        const [file] = await bucket.upload(sourcePath, {
            destination: `audio/${newFileName}`,
            metadata: { cacheControl: "public, max-age=31536000" }
        });
        return {publicUrl: file.publicUrl(), googleStorageUri: `gs://${bucketName}/audio/${newFileName}`}
    }
}