import { Language } from '@/components/LanguageMenu';

interface VideoAnalysis {
  summary?: string;
  setting?: string;
  mood?: string;
  emotions?: string;
  people?: string;
  topic?: string;
  tweetSuggestion?: string;
  titleSuggestions?: string;
  keyMoments?: Array<{timestamp: string, description: string}>;
  error?: string;
  rawText?: string;
}

export async function translateAnalysis(
  analysis: VideoAnalysis, 
  targetLanguage: Language
): Promise<VideoAnalysis> {
  if (targetLanguage.code === 'en') {
    return analysis;
  }
  
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        analysis,
        targetLanguage: targetLanguage.code,
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation request failed with status ${response.status}`);
    }

    const translatedAnalysis = await response.json();
    return translatedAnalysis;
  } catch (error) {
    console.error('Translation failed:', error);
    return {
      ...analysis,
      error: `Translation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}