import { FC } from 'react';
import AnalysisSection from './AnalysisSection';

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

interface AnalysisResultsProps {
  result: VideoAnalysis;
}

const AnalysisResults: FC<AnalysisResultsProps> = ({ result }) => {
  if (result.error) {
    return <div className="text-red-500">Error: {result.error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {result.summary && (
        <AnalysisSection 
          title="Summary" 
          content={<p>{result.summary}</p>} 
        />
      )}
      
      {result.setting && (
        <AnalysisSection 
          title="Setting" 
          content={<p>{result.setting}</p>} 
        />
      )}
      
      {result.mood && (
        <AnalysisSection 
          title="Mood" 
          content={<p>{result.mood}</p>} 
        />
      )}

      {result.emotions && (
        <AnalysisSection 
          title="Emotions" 
          content={
            <ul className="list-disc pl-5">
              {result.emotions.split('\n').map((title, index) => (
                <li key={index} className="mb-2">{title}</li>
              ))}
            </ul>
          }
        />
      )}
      
      {result.people && (
        <AnalysisSection 
          title="People" 
          content={<p>{result.people}</p>} 
        />
      )}
      
      {result.topic && (
        <AnalysisSection 
          title="Topic" 
          content={<p>{result.topic}</p>} 
        />
      )}
      
      {result.tweetSuggestion && (
        <AnalysisSection 
          title="Tweet Suggestion" 
          content={<p>{result.tweetSuggestion}</p>}
        />
      )}

      {result.titleSuggestions && (
        <AnalysisSection 
          title="Title Suggestions" 
          content={
            <ul className="list-disc pl-5">
              {result.titleSuggestions.split('\n').map((title, index) => (
                <li key={index} className="mb-2">{title}</li>
              ))}
            </ul>
          }
        />
      )}
      
      {result.keyMoments && result.keyMoments.length > 0 && (
        <AnalysisSection 
          title="Key Moments" 
          content={
            <ul className="list-disc pl-5">
              {result.keyMoments.map((moment, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold">{moment.timestamp}</span>: {moment.description}
                </li>
              ))}
            </ul>
          }
          fullWidth={true}
        />
      )}
    </div>
  );
};

export default AnalysisResults;