export interface Content {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'youtube' | 'doc';
  originalFile: string;
  aiProcessed: {
    visual: { tts: boolean; imageDesc: boolean; };
    hearing: { captions: boolean; signLanguage: boolean; };
    cognitive: { simplified: boolean; summary: boolean; };
    motor: { voiceNav: boolean; largeButtons: boolean; };
  };
  uploadDate: string;
}