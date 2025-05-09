import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function geminiSummary(base64Video: string): Promise<string> {
  const contents = [
    {
      inlineData: {
        mimeType: "video/mp4",
        data: base64Video,
      },
    },
    {
      text: "Provide a short summary of the video. Be sure to describe the setting, mood, and people involved."
    }
  ];

  return ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents,
  }).then((result) => result.text || "No summary available");
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.body;
  console.log('Received video URL:', url);

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);
      return response.arrayBuffer();
    })
    .then((buffer) => {
      const base64 = Buffer.from(buffer).toString("base64");
      return geminiSummary(base64);
    })
    .then((summary) => {
      res.status(200).json({ summary });
    })
    .catch((error) => {
      console.error('Error generating summary:', error);
      res.status(500).json({ error: 'Failed to generate summary.' });
    });
}