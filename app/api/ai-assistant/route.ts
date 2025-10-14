// /api/ai-assistant/route.ts
import { NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";
import Speech from "@google-cloud/speech";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Initialize clients outside the handler for reuse
const SpeechClient = new Speech.SpeechClient();
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_PROJECT_ID
});
const model = vertexAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });


// --- Main Handler ---
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    let message = formData.get("message")?.toString() || "";
    const url = formData.get("url")?.toString() || "";
    const pageContent = formData.get("content")?.toString() || "";
    const audioFile = formData.get("audio") as File | null;

    // 1. Transcribe Audio if present
    if (audioFile) {
        message = await transcribeAudio(audioFile);
    }
    if (!message) {
      return NextResponse.json({ error: "No message provided." }, { status: 400 });
    }

    // 2. Initial Intent Recognition
    const initialPrompt = createInitialPrompt(message, url, pageContent);
    let result = await model.generateContent(initialPrompt);
    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

    // 3. Authenticate and Fetch User Data for complex actions
    const session = await getServerSession(authOptions);
    if (!session?.user?.id && ['myFiles', 'myClasses', 'summarize_file', 'download', 'navigate_to_file', 'navigate_to_class'].includes(parsed.action)) {
        return NextResponse.json({ action: "error", target: "auth", response: "You need to be logged in for that." });
    }

    const userWithData = session?.user?.id ? await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          studentFiles: true,
          classesJoin: { include: { files: true, } },
        },
    }) : null;

    const allFiles = userWithData ? [...userWithData.studentFiles, ...userWithData.classesJoin.flatMap(c => c.files)] : [];
    const allClassrooms = userWithData ? userWithData.classesJoin : [];


    // 4. Action-Specific Logic (Execution Phase)
    switch (parsed.action) {
        case 'myFiles':
        case 'myClasses':
             return formatListResponse(parsed.action, allFiles, allClassrooms);

        case 'summarize_page':
            return executeSummarization(pageContent, `Summarize the content of the current web page.`);

        case 'summarize_file':
            const fileToSummarize = findClosestMatch(parsed.target, allFiles);
            if (!fileToSummarize?.extractedText) return noContentFoundResponse("file to summarize");
            return executeSummarization(fileToSummarize.extractedText, `Summarize the following document for the user.`);

        case 'download':
            const fileToDownload = findClosestMatch(parsed.target, allFiles);
            if (!fileToDownload) return noContentFoundResponse("file to download");
            const downloadLink = getDisabilityFriendlyLink(fileToDownload, userWithData?.accessibility[0]);
            return NextResponse.json({
                action: 'download',
                target: downloadLink,
                response: `Okay, starting the download for ${fileToDownload.name}.`
            });

        case 'navigate_to_file':
            const fileToNavigate = findClosestMatch(parsed.target, allFiles);
            if (!fileToNavigate) return noContentFoundResponse("file to navigate to");
            return NextResponse.json({
                action: 'navigate',
                target: `/file/${fileToNavigate.id}`,
                response: `Sure, taking you to the file: ${fileToNavigate.name}.`
            });

        case 'navigate_to_class':
            const classToNavigate = findClosestMatch(parsed.target, allClassrooms, "name");
            if (!classToNavigate) return noContentFoundResponse("classroom to navigate to");
            return NextResponse.json({
                action: 'navigate',
                target: `/classroom/${classToNavigate.id}`,
                response: `Opening your ${classToNavigate.name} classroom.`
            });

        default:
            // For simple actions like 'navigate' to static pages or 'help'
            return NextResponse.json(parsed);
    }

  } catch (err) {
    console.error("AI assistant error:", err);
    return NextResponse.json({ error: "Sorry, something went wrong on my end." }, { status: 500 });
  }
}


// --- Helper Functions ---

async function transcribeAudio(audioFile: File): Promise<string> {
    try {
        const [operation] = await SpeechClient.recognize({
          audio: {content: Buffer.from(await audioFile.arrayBuffer()).toString("base64")},
          config:{ encoding: "WEBM_OPUS", sampleRateHertz: 48000, languageCode: "en-US" }
        });
        return operation.results?.map(r => r.alternatives?.[0]?.transcript).join(" ") || "";
    } catch (error) {
        console.error("Audio transcription error:", error);
        return "";
    }
}

function createInitialPrompt(message: string, url: string, pageContent: string): string {
  return `
    You are a sophisticated voice AI assistant for the Lumina educational platform. Your primary job is to understand a user's request and classify it into a specific action.

    CONTEXT:
    - Current URL: ${url}
    - Current Page Content Snippet: "${pageContent.slice(0, 1500)}"
    - Static Routes Available: /auth/signin, /auth/signup, /dashboard, / (landing page)

    USER MESSAGE: "${message}"

    TASK:
    Analyze the user's message and the context. Identify the user's intent and any specific entity (like a file name or class name).
    Output ONLY a single, raw JSON object with the following structure. Do not add any extra text or markdown.

    {
      "action": "<action_type>",
      "target": "<entity_name_or_url>",
      "response": "<a_brief_confirmation_message>"
    }

    POSSIBLE ACTION TYPES:
    - navigate: For static routes (e.g., "go to dashboard"). Target should be the route (e.g., "/dashboard").
    - navigate_to_file: For requests to open a specific file page (e.g., "open my history notes"). Target should be the file name (e.g., "history notes").
    - navigate_to_class: For requests to open a specific classroom (e.g., "take me to math class"). Target should be the class name (e.g., "math").
    - summarize_page: To summarize the text from the current page. Target should be "current page".
    - summarize_file: To summarize a specific file (e.g., "summarize chapter 5"). Target should be the file name.
    - download: To download a file (e.g., "download the biology PDF"). Target should be the file name.
    - myFiles: To list all user's files.
    - myClasses: To list all user's classrooms.
    - help: For general questions or if the intent is unclear. Target should be "general".

    EXAMPLES:
    - User: "go to the sign in page" -> {"action": "navigate", "target": "/auth/signin", "response": "Navigating to the sign-in page."}
    - User: "open my assignment on the French Revolution" -> {"action": "navigate_to_file", "target": "assignment on the French Revolution", "response": "Okay, looking for that assignment."}
    - User: "what's this page about?" -> {"action": "summarize_page", "target": "current page", "response": "Let me see... one moment."}
    - User: "download my chemistry lab report" -> {"action": "download", "target": "chemistry lab report", "response": "Getting that file ready for download."}
    - User: "show me my classes" -> {"action": "myClasses", "target": "list", "response": "Pulling up your class schedule."}
  `;
}

// A simple utility to find the best match for a search query from a list of items
function findClosestMatch(query: string, items: any[], field: string = 'name') {
    if (!query || items.length === 0) return null;
    const lowerQuery = query.toLowerCase();
    // This could be improved with a proper fuzzy search library like fuse.js if needed
    return items.find(item => item[field].toLowerCase().includes(lowerQuery)) || items[0];
}

function getDisabilityFriendlyLink(file: any, disability?: string): string {
    switch (disability) {
        case 'visualImpairment': return file.audioLink || file.link;
        case 'dyslexia': return file.dislexiaFriendly || file.link;
        case 'hearingImpairment': return file.link;
        default: return file.link;
    }
}

function noContentFoundResponse(contentType: string) {
    return NextResponse.json({
        action: 'error',
        target: 'not_found',
        response: `Sorry, I couldn't find the ${contentType}. Please try again.`
    });
}

async function executeSummarization(content: string, task: string) {
    const prompt = `${task}\n\nCONTENT:\n"""\n${content.slice(0, 10000)}\n"""\n\nProvide the summary in the 'response' field of the JSON object.
    { "action": "summarize", "target": "text", "response": "<Your summary here>" }`;
    const result = await model.generateContent(prompt);
    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return NextResponse.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
}

async function formatListResponse(action: 'myFiles' | 'myClasses', files: any[], classrooms: any[]) {
    const data = action === 'myFiles'
        ? files.map(f => ({ name: f.name }))
        : classrooms.map(c => ({ name: c.name, subject: c.subject }));

    if (data.length === 0) {
        return NextResponse.json({ action, target: "list", response: `You don't have any ${action === 'myFiles' ? 'files' : 'classes'} yet.` });
    }

    const prompt = `A user asked for their ${action === 'myFiles' ? 'files' : 'classes'}. Here is the list:
    ${JSON.stringify(data)}
    Summarize this list for the user conversationally.
    { "action": "${action}", "target": "list", "response": "<Your conversational summary>" }`;

    const result = await model.generateContent(prompt);
    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return NextResponse.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
}