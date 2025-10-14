import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { HLSConverter } from "@/lib/HLSConvarter";
import { GoogleAi } from "@/lib/googleAi";
import mammoth from "mammoth";

export const runtime = "nodejs";

// PDF text extraction function using pdf2json
async function extractTextFromPDF(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const PDFParser = require("pdf2json");
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error("PDF parsing error:", errData.parserError);
      reject(new Error(errData.parserError));
    });
    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        console.log("PDF parsed successfully", pdfData.Pages[0].Texts);
        const text = pdfParser.get;
        console.log(`Extracted text length: ${text?.length || 0} characters`);
        resolve(text || "");
      } catch (error: any) {
        console.error("Error getting text content:", error.message);
        reject(error);
      }
    });

    // Parse the buffer
    pdfParser.loadPDF(filePath);
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const file = formData.get("file") as Blob | null;
    if (!file) return NextResponse.json({ error: "File missing" }, { status: 400 });


    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const originalFilename = (file as any).name || "uploaded-file";
    const filename = `${Date.now()}-${originalFilename}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const ext = path.extname(filename).toLowerCase();
    const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv", ".wmv", ".m4v", ".mpg", ".mpeg", ".3gp", ".ts", ".vob", ".ogv"];
    const docExtensions = [".pdf", ".docx"];
    const isVideo = videoExtensions.includes(ext);
    const isDoc = docExtensions.includes(ext);

    const fileData = await prisma.studentFiles.create({
      data: {
        name: originalFilename,
        link: `/uploads/${filename}`,
        Student: { connect: { id: session.user.id } },
        status: "processing"
      }
    });

    const response = NextResponse.json({
      message: "File uploaded successfully! Background processing started.",
      file: fileData,
    }, { status: 201 });

    // Background processing
    setTimeout(async () => {
      try {
        let extractedText: string | null = null;

        if (isVideo) {
          console.log("Processing video file...");
          const converter = HLSConverter.getInstance();
          const audioFile = await converter.extractAudio(filePath, filename, "mp3");
          const googleAi = GoogleAi.getInstance();
          const { publicUrl: hlsPublicLink } = await googleAi.uploadToCloudStorage(filePath, "audio");
          const { googleStorageUri: audioInGoogle, publicUrl: audioPublicLink } = await googleAi.uploadToCloudStorage(audioFile, "audio");
          fs.rmSync(audioFile, { force: true, recursive: true });
          fs.rmSync(filePath, { force: true, recursive: true });
          const transcript = await googleAi.generateSpeechToText(audioInGoogle, "en")
          console.log(transcript);
          const blindSummary = await googleAi.generateText(`
            INSTRUCTION PROMPT:
You are an expert narrator and accessibility writer.
Your job is to rewrite messy or unstructured transcriptions into clear, well-structured spoken text that can be converted into audio for blind or visually impaired listeners.

Follow these rules strictly:
1. Remove filler words like “um,” “uh,” “like,” “you know,” and repetitions.
2. Fix grammar, punctuation, and sentence flow.
3. Break long sentences into short, natural sentences suitable for text-to-speech.
4. Use a clear, friendly, instructional tone with natural human expressions.
5. Add step-by-step explanations if the content describes a process.
6. If the original mentions visual elements (e.g., “as you can see”), rewrite them with clear verbal descriptions.
7. Avoid jargon or abbreviations unless expanded.
8. Ensure the output can be read smoothly by a TTS engine.
9. Do not include any emojis or formatting other than plain text.
10. Always return the final result as a plain string.

USER PROMPT:
Rewrite the following transcription according to the instructions above:
${JSON.stringify(transcript)}

IMPORTANT:
- Return only the rewritten text as a plain string.
- No explanations, no notes, no special characters other than punctuation.

            `)
            console.log(blindSummary);
            
          const blindAudioLink = await googleAi.generateTextToSpeech(blindSummary)
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/visualize-lesson`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: blindSummary }),
          });
          if (!res.ok) {
            throw new Error("Failed to generate images for blind friendly content");
          }
          const data = await res.json();
          await prisma.studentFiles.update({
            where: { id: fileData.id },
            data: {
              link: hlsPublicLink,
              audioLink: audioPublicLink,
              blindFriendlyLink: blindAudioLink,
              transcript: transcript,
              extractedText: blindSummary,
              dislexiaFriendly: data,
              status: "completed"
            }
          });
          console.log("Video processing completed");
        }
        else if (isDoc) {
          // if (ext === ".pdf") {
          //   try {
          //     console.log("📄 Processing PDF file with pdf2json...");

          //     extractedText = await extractTextFromPDF(filePath);

          //     console.log(`✅ PDF text extraction completed`);

          //     if (extractedText?.trim().length === 0) {
          //       console.log("⚠️ Extracted text is empty - PDF might be scanned or image-based");
          //     } else {
          //       console.log(`📝 First 200 chars: ${extractedText?.substring(0, 200)}...`);
          //     }

          //   } catch (pdfError: any) {
          //     console.error("❌ PDF processing error:", pdfError.message);
          //     extractedText = null;
          //   }
          // }
          // else
          if (ext === ".docx") {
            try {
              const result = await mammoth.extractRawText({ buffer });
              extractedText = result.value;
            } catch (docxError: any) {
              fs.rmSync(filePath, { force: true, recursive: true });
              await prisma.studentFiles.update({
                where: { id: fileData.id },
                data: { status: "failed" }
              });
              console.error("DOCX processing error:", docxError.message);
            }
          }

          if (extractedText && extractedText.trim().length > 0) {
            const googleAi = GoogleAi.getInstance();
            const blindSummary = await googleAi.generateText(`
            INSTRUCTION PROMPT:
You are an expert narrator and accessibility writer.
Your job is to rewrite messy or unstructured transcriptions into clear, well-structured spoken text that can be converted into audio for blind or visually impaired listeners.

Follow these rules strictly:
1. Remove filler words like “um,” “uh,” “like,” “you know,” and repetitions.
2. Fix grammar, punctuation, and sentence flow.
3. Break long sentences into short, natural sentences suitable for text-to-speech.
4. Use a clear, friendly, instructional tone with natural human expressions.
5. Add step-by-step explanations if the content describes a process.
6. If the original mentions visual elements (e.g., “as you can see”), rewrite them with clear verbal descriptions.
7. Avoid jargon or abbreviations unless expanded.
8. Ensure the output can be read smoothly by a TTS engine.
9. Do not include any emojis or formatting other than plain text.
10. Always return the final result as a plain string.

USER PROMPT:
Rewrite the following transcription according to the instructions above:
${extractedText.trim()}

IMPORTANT:
- Return only the rewritten text as a plain string.
- No explanations, no notes, no special characters other than punctuation.

            `)
            const blindAudioLink = await googleAi.generateTextToSpeech(blindSummary)
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/visualize-lesson`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: blindSummary }),
            });
            if (!res.ok) {
              throw new Error("Failed to generate images for blind friendly content");
            }
            const data = await res.json();
            const { publicUrl } = await googleAi.uploadToCloudStorage(filePath, "audio");
            fs.rmSync(filePath, { force: true, recursive: true });
            await prisma.studentFiles.update({
              where: { id: fileData.id },
              data: {
                extractedText: blindSummary,
                link: publicUrl,
                blindFriendlyLink: blindAudioLink,
                dislexiaFriendly: data,
                status: "completed"
              }
            });
            console.log("Text saved to database successfully");
          } else {
            console.log("No text extracted - file might be scanned or empty");
            fs.rmSync(filePath, { force: true, recursive: true });
            await prisma.studentFiles.update({
              where: { id: fileData.id },
              data: {
                extractedText: null,
                status: "completed"
              }
            });
          }
        } else {
          // For other file types, just mark as completed
          fs.rmSync(filePath, { force: true, recursive: true });
          console.log("Non-document file processed");
        }

      } catch (err: any) {
        console.error("Background processing error:", err.message);
        fs.rmSync(filePath, { force: true, recursive: true });
        await prisma.studentFiles.update({
          where: { id: fileData.id },
          data: { status: "failed" }
        });
      }
    }, 0);

    return response;

  } catch (err: any) {

    console.error("Upload failed:", err.message);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const fileId = await req.url.split("fileId=")[1];
  if (!fileId) {
    return NextResponse.json({ error: "fileId missing" }, { status: 400 });
  }

  if (!fileId) return NextResponse.json({ error: "fileId missing" }, { status: 400 });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "teacher") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const file = await prisma.studentFiles.findFirst({
    where: { id: fileId, studentId: session.user.id },
  });
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
  if (file.status === "completed" || file.status === "failed") {
    return NextResponse.json({ message: file.status === "failed" ? "File processing failed" : "File is still processing", status: file.status === "failed" ? "failed" : "completed" }, { status: 200 });
  }
  return NextResponse.json({ message: "File is still processing", status: "processing" }, { status: 200 });
}