import { AnalysisProgress } from '@/types';

interface LoadingSpinnerProps {
  progress?: AnalysisProgress;
}

export default function LoadingSpinner({ progress }: LoadingSpinnerProps) {
  if (!progress) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const percentage = progress.totalUrls > 0 
    ? Math.round((progress.processedUrls / progress.totalUrls) * 100) 
    : 0;

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-md">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {progress.currentUrl || 'Processing...'}
        </p>
        {progress.totalUrls > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {progress.processedUrls} of {progress.totalUrls} URLs processed ({percentage}%)
          </p>
        )}
      </div>
      
      {progress.hasErrors && progress.errors.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            {progress.errors.length} error(s) encountered
          </p>
        </div>
      )}
    </div>
  );
}