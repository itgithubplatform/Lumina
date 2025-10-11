export interface Transcript {
    transcription: string;
    words: {
        word: string | null | undefined;
        startTime: number;
        endTime: number;
    }[];
    detectedLanguage: string;
}