'use client';

import { useState } from 'react';
import { SitemapAnalyzer } from '@/lib/sitemapAnalyzer';
import { PageMetadata, AnalysisProgress } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [results, setResults] = useState<PageMetadata[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzer = new SitemapAnalyzer();

  const handleAnalyze = async () => {
    if (!sitemapUrl.trim()) {
      setError('Please enter a sitemap URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(sitemapUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);
    setProgress(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sitemapUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      if (data.success) {
        setResults(data.data);
        setProgress({
          totalUrls: data.totalUrls,
          processedUrls: data.totalUrls,
          isComplete: true,
          hasErrors: data.errors > 0,
          errors: data.data.filter((r: PageMetadata) => r.error).map((r: PageMetadata) => `${r.url}: ${r.error}`)
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (results) {
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `sitemap-analysis-${timestamp}.csv`;
      analyzer.downloadCSV(results, filename);
    }
  };

  const handleReset = () => {
    setSitemapUrl('');
    setResults(null);
    setError(null);
    setProgress(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sitemap Analyzer
            </h1>
            <p className="text-gray-600">
              Analyze sitemaps and generate detailed CSV reports with page metadata
            </p>
          </div>

          {!isAnalyzing && !results && (
            <div className="space-y-6">
              <div>
                <label htmlFor="sitemap-url" className="block text-sm font-medium text-gray-700 mb-2">
                  Sitemap URL
                </label>
                <input
                  type="url"
                  id="sitemap-url"
                  value={sitemapUrl}
                  onChange={(e) => setSitemapUrl(e.target.value)}
                  placeholder="https://example.com/sitemap.xml"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Analyze Sitemap
              </button>

              <div className="text-sm text-gray-500 space-y-2">
                <p><strong>Features:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Supports regular sitemaps and sitemap index files</li>
                  <li>Recursively processes nested sitemaps</li>
                  <li>Extracts page titles, meta descriptions, and keywords</li>
                  <li>Captures Open Graph and Twitter Card metadata</li>
                  <li>Generates downloadable CSV reports</li>
                </ul>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Analyzing sitemap...</p>
                <p className="text-sm text-gray-500">This may take a few moments depending on the number of URLs</p>
              </div>
            </div>
          )}

          {results && !isAnalyzing && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Analysis Complete
                </h2>
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Analyze Another Sitemap
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Total URLs</p>
                    <p className="text-2xl font-bold text-blue-600">{results.length}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">With Titles</p>
                    <p className="text-2xl font-bold text-green-600">
                      {results.filter(r => r.title).length}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">With Meta Desc</p>
                    <p className="text-2xl font-bold text-green-600">
                      {results.filter(r => r.metaDescription).length}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Errors</p>
                    <p className="text-2xl font-bold text-red-600">
                      {results.filter(r => r.error).length}
                    </p>
                  </div>
                </div>
              </div>

              {progress?.errors && progress.errors.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-md">
                  <h3 className="font-medium text-yellow-800 mb-2">Errors Encountered:</h3>
                  <div className="text-sm text-yellow-700 space-y-1 max-h-32 overflow-y-auto">
                    {progress.errors.slice(0, 5).map((error, index) => (
                      <p key={index}>• {error}</p>
                    ))}
                    {progress.errors.length > 5 && (
                      <p>... and {progress.errors.length - 5} more errors</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Download CSV Report
                </button>
              </div>

              <div className="border rounded-md max-h-96 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Meta Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.slice(0, 100).map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate block max-w-xs"
                          >
                            {result.url}
                          </a>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 max-w-xs truncate">
                          {result.title || '—'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600 max-w-xs truncate">
                          {result.metaDescription || '—'}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {result.error ? (
                            <span className="text-red-600 text-xs">Error</span>
                          ) : (
                            <span className="text-green-600 text-xs">✓ Success</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {results.length > 100 && (
                  <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 border-t">
                    Showing first 100 results. Download CSV for complete data.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}