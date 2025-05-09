import { FC } from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-2',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} rounded-full border-t-blue-500 border-blue-200 animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;