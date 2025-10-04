export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function simplifyText(text: string): string {
  // Basic text simplification logic
  return text
    .replace(/\b(however|nevertheless|furthermore|moreover|consequently)\b/gi, 'but')
    .replace(/\b(utilize|utilization)\b/gi, 'use')
    .replace(/\b(approximately|approximately)\b/gi, 'about')
    .replace(/\b(demonstrate|demonstrates)\b/gi, 'show')
    .replace(/\b(facilitate|facilitates)\b/gi, 'help')
    .replace(/\b(subsequently)\b/gi, 'then')
    .replace(/\b(prior to)\b/gi, 'before')
    .replace(/\b(in order to)\b/gi, 'to')
    .split('. ')
    .map(sentence => {
      // Keep sentences under 20 words
      const words = sentence.split(' ');
      if (words.length > 20) {
        const midpoint = Math.floor(words.length / 2);
        return words.slice(0, midpoint).join(' ') + '. ' + words.slice(midpoint).join(' ');
      }
      return sentence;
    })
    .join('. ');
}

export function generateTranscript(text: string): string {
  // Mock transcript generation with timestamps
  const sentences = text.split('. ').filter(s => s.trim());
  let currentTime = 0;
  
  return sentences.map(sentence => {
    const timestamp = formatTime(currentTime);
    currentTime += Math.random() * 10 + 5; // Random duration between 5-15 seconds
    return `[${timestamp}] ${sentence.trim()}.`;
  }).join('\n');
}

export function extractKeywords(text: string): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
    .reduce((acc: string[], word) => {
      if (!acc.includes(word)) {
        acc.push(word);
      }
      return acc;
    }, [])
    .slice(0, 10); // Top 10 keywords
}

export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function generateAltText(imageName: string): string {
  // Mock AI-generated alt text based on image name
  const altTexts: { [key: string]: string } = {
    'solar-system': 'Diagram showing the Sun at the center with eight planets orbiting around it in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune',
    'photosynthesis': 'Scientific diagram illustrating the process of photosynthesis in a green leaf, showing sunlight, carbon dioxide, and water being converted into glucose and oxygen',
    'algebra': 'Mathematical equation on a blackboard showing algebraic expressions with variables x and y',
    'default': 'Educational diagram or illustration related to the lesson content'
  };

  const key = Object.keys(altTexts).find(k => imageName.toLowerCase().includes(k)) || 'default';
  return altTexts[key];
}

export function detectLanguage(text: string): string {
  // Simple language detection (in real app, use proper language detection library)
  const englishWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'that', 'it', 'with'];
  const words = text.toLowerCase().split(/\s+/).slice(0, 50);
  const englishCount = words.filter(word => englishWords.includes(word)).length;
  
  return englishCount > words.length * 0.1 ? 'en' : 'unknown';
}

export function createAccessibilityReport(lesson: any, userInteractions: any[]): any {
  return {
    lessonId: lesson.id,
    accessibilityScore: 95,
    featuresUsed: {
      captions: userInteractions.filter(i => i.type === 'caption_toggle').length > 0,
      tts: userInteractions.filter(i => i.type === 'tts_used').length > 0,
      simplified: userInteractions.filter(i => i.type === 'view_change' && i.data === 'simplified').length > 0,
      focusMode: userInteractions.filter(i => i.type === 'focus_mode').length > 0
    },
    recommendations: [
      'Consider adding sign language interpretation for hearing-impaired users',
      'Implement voice commands for better navigation',
      'Add more interactive elements for cognitive accessibility'
    ]
  };
}