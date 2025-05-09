"use client";

import { useState, useEffect } from 'react';
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
  const [videoPreview, setVideoPreview] = useState(false);
  const [validUrl, setValidUrl] = useState(false);

  useEffect(() => {
    const isVideoUrl = /\.(mp4|mov|avi|webm)$|youtube\.com\/|youtu\.be\/|vimeo\.com\//.test(url);
    setValidUrl(isVideoUrl);
  }, [url]);

  const submit = async () => {
    if (!validUrl) return;
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

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtube.com/watch')) {
        videoId = new URL(url).searchParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0] || '';
      return `https://player.vimeo.com/video/${vimeoId}`;
    }

    return url;
  };

  const renderVideoPreview = () => {
    if (!validUrl || !videoPreview) return null;
    
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
      // Embedded player for YouTube or Vimeo
      return (
        <div className="mt-4 mb-6 aspect-video w-full max-w-2xl mx-auto">
          <iframe
            src={getEmbedUrl(url)}
            className="w-full h-full rounded"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video preview"
          ></iframe>
        </div>
      );
    } else if (/\.(mp4|mov|avi|webm)$/.test(url)) {
      // Native video player for direct video links
      return (
        <div className="mt-4 mb-6 aspect-video w-full max-w-2xl mx-auto">
          <video 
            src={url} 
            controls 
            className="w-full h-full rounded"
            onError={() => setValidUrl(false)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="text-center max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-4">Video URL Analyzer</h1>
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            className="p-2 border border-gray-300 rounded flex-grow"
            type="text"
            placeholder="Enter video URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={submit}
            disabled={!validUrl || loading}
            className={`px-4 py-2 rounded ${
              validUrl && !loading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          <input
            type="checkbox"
            id="preview-toggle"
            checked={videoPreview}
            onChange={() => setVideoPreview(!videoPreview)}
            className="rounded"
          />
          <label htmlFor="preview-toggle" className="text-sm">
            Show video preview
          </label>
        </div>
        
        {renderVideoPreview()}
        
        {loading && <p className="mt-4">Analyzing video...</p>}
        
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