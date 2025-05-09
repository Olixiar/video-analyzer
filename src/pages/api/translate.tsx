import type { NextApiRequest, NextApiResponse } from 'next';

interface KeyMoment {
  timestamp: string;
  description: string;
}

interface VideoAnalysis {
  summary?: string;
  setting?: string;
  mood?: string;
  emotions?: string;
  people?: string;
  topic?: string;
  tweetSuggestion?: string;
  titleSuggestions?: string;
  keyMoments?: Array<KeyMoment>;
  error?: string;
  rawText?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { analysis, targetLanguage } = req.body;
  
  if (!analysis || !targetLanguage) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const apiKey = process.env.DEEPL_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'DeepL API key is not configured' });
  }

  try {
    const result: VideoAnalysis = { ...analysis };
    
    // List of fields to translate
    const textFields: (keyof VideoAnalysis)[] = [
      'summary', 'setting', 'mood', 'emotions', 'people', 'topic', 'tweetSuggestion', 'titleSuggestions'
    ];
    
    // Translate text fields
    for (const field of textFields) {
      if (result[field]) {
        const translatedText = await translateText(result[field] as string, targetLanguage, apiKey);
        result[field] = translatedText as any;
      }
    }
    
    // Translate key moments
    if (result.keyMoments && result.keyMoments.length > 0) {
      const translatedMoments: KeyMoment[] = [];
      
      for (const moment of result.keyMoments) {
        const translatedDescription = await translateText(moment.description, targetLanguage, apiKey);
        translatedMoments.push({
          timestamp: moment.timestamp,
          description: translatedDescription
        });
      }
      
      result.keyMoments = translatedMoments;
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Failed to translate content',
      originalAnalysis: analysis 
    });
  }
}

async function translateText(text: string, targetLang: string, apiKey: string): Promise<string> {
  const url = 'https://api-free.deepl.com/v2/translate';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      target_lang: targetLang.toUpperCase(),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepL API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.translations[0].text;
}