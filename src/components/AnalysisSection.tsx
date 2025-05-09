import { FC, ReactNode } from 'react';

interface AnalysisSectionProps {
  title: string;
  content: ReactNode;
  fullWidth?: boolean;
  highlight?: boolean;
}

const AnalysisSection: FC<AnalysisSectionProps> = ({ 
  title, 
  content,
  fullWidth = false,
  highlight = false
}) => {
  return (
    <div className={`p-4 rounded-lg ${fullWidth ? 'md:col-span-2' : ''} 
      ${highlight ? 'bg-blue-50 border-blue-200' : 'border'}`}>
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      {content}
    </div>
  );
};

export default AnalysisSection;