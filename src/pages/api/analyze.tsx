import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface VideoAnalysisResult {
  summary?: string;
  setting?: string;
  mood?: string;
  people?: string;
  topic?: string;
  viralSuggestions?: string;
  keyMoments?: Array<{timestamp: string, description: string}>;
  error?: string;
  rawText?: string;
}

async function geminiSummary(base64Video: string): Promise<VideoAnalysisResult> {
  const contents = [
    {
      inlineData: {
        mimeType: "video/mp4",
        data: base64Video,
      },
    },
    {
      text: `Analyze this video and provide the following information in JSON format:
      {
        "summary": "Brief overall summary of the video",
        "setting": "Description of the location and environment",
        "mood": "The emotional tone of the video",
        "people": "Description of people involved and what they're doing",
        "topic": "Main subject or conversation topic",
        "viralSuggestions": "Suggest a possible viral tweet or caption for the video",
        "keyMoments": [
          {"timestamp": "approximate time (e.g., 0:05)", "description": "what happens at this moment"}
        ]
      }`
    }
  ];

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
    });
    
    const text = result.text || "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      console.log("Parsed JSON:", jsonMatch[0]);
      return JSON.parse(jsonMatch[0]);
    }
    return { error: "Could not parse structured data", rawText: text };
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    return { error: "Failed to parse response", rawText: e instanceof Error ? e.message : "" };
  }
}

// Update the handler to use async/await
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.body;
  console.log('Received video URL:', url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);
    
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    
    const analysisData = await geminiSummary(base64);
    res.status(200).json(analysisData);
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
}
