"use client";

import { useState } from 'react';
import VideoAnalysisResults from '@/components/AnalysisResults';

interface VideoAnalysis {
  summary?: string;
  setting?: string;
  mood?: string;
  people?: string;
  topic?: string;
  viralSuggestions?: string;
  keyMoments?: { timestamp: string; description: string }[];
  error?: string;
  rawText?: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoAnalysis | null>(null);

  const submit = async () => {
    setLoading(true);
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const downloadResults = () => {
    if (!result) return;
    
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'video-analysis.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-4">Video URL Analyzer</h1>
        <div className="flex gap-2 mb-6">
          <input
            className="p-2 border border-gray-300 rounded flex-grow"
            type="text"
            placeholder="Enter video URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Analyze
          </button>
        </div>
        {loading && <p className="mt-4">Analyzing...</p>}
        
        {result && (
          <div className="mt-6 text-left p-6 rounded-lg shadow-md mx-auto overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Analysis Results</h2>
              <button
                onClick={downloadResults}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                Download JSON
              </button>
            </div>
            <VideoAnalysisResults result={result} />
          </div>
        )}
      </div>
    </div>
  );
}