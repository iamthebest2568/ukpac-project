/**
 * UK PACK Dashboard - Qualitative Feedback Component
 * Analysis of custom reasons and user suggestions
 */

import { useState, useEffect } from 'react';
import {
  getCustomReasons,
  getSuggestions,
  subscribeToUpdates
} from '../../../data/realTimeDashboardService.js';

interface QualitativeFeedbackProps {
  token: string;
}

interface FeedbackItem {
  sessionID: string;
  timestamp: string;
  text: string;
}

interface PaginatedResponse {
  data: FeedbackItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

const QualitativeFeedback = ({ token }: QualitativeFeedbackProps) => {
  const [customReasons, setCustomReasons] = useState<PaginatedResponse | null>(null);
  const [suggestions, setSuggestions] = useState<PaginatedResponse | null>(null);
  const [currentReasonPage, setCurrentReasonPage] = useState(1);
  const [currentSuggestionPage, setCurrentSuggestionPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'reasons' | 'suggestions'>('reasons');

  useEffect(() => {
    fetchAllData();
  }, [currentReasonPage, currentSuggestionPage]);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToUpdates(() => {
      fetchAllData();
    });

    return unsubscribe;
  }, []);

  const fetchAllData = () => {
    try {
      setIsLoading(true);

      const reasons = getCustomReasons(currentReasonPage, 10);
      const suggestions = getSuggestions(currentSuggestionPage, 10);

      setCustomReasons({
        data: reasons.data,
        totalItems: reasons.totalItems,
        totalPages: reasons.totalPages,
        currentPage: reasons.currentPage
      });

      setSuggestions({
        data: suggestions.data,
        totalItems: suggestions.totalItems,
        totalPages: suggestions.totalPages,
        currentPage: suggestions.currentPage
      });
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      setError('Failed to load feedback data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
  }: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void;
  }) => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          ‹
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded border ${
              page === currentPage
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          ›
        </button>
      </div>
    );
  };

  if (isLoading && !customReasons && !suggestions) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-500 text-2xl mb-2">❌</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchAllData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Qualitative Feedback</h2>
          <p className="text-gray-600">User-generated content and suggestions</p>
        </div>
        <button
          onClick={fetchAllData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Custom Reasons</p>
              <p className="text-3xl font-bold text-gray-900">
                {customReasons?.totalItems || 0}
              </p>
              <p className="text-xs text-gray-500">From "อ��่นๆ" responses</p>
            </div>
            <div className="text-orange-500 text-2xl">💭</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">User Suggestions</p>
              <p className="text-3xl font-bold text-gray-900">
                {suggestions?.totalItems || 0}
              </p>
              <p className="text-xs text-gray-500">Improvement ideas</p>
            </div>
            <div className="text-green-500 text-2xl">💡</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('reasons')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'reasons'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Custom Reasons ({customReasons?.totalItems || 0})
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'suggestions'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Suggestions ({suggestions?.totalItems || 0})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'reasons' && customReasons && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Custom Reasons</h3>
                <span className="text-sm text-gray-500">
                  Page {customReasons.currentPage} of {customReasons.totalPages}
                </span>
              </div>

              <div className="space-y-4">
                {customReasons.data.map((reason, index) => (
                  <div key={`${reason.sessionID}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900 mb-2">{reason.text}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Session: {reason.sessionID}</span>
                          <span>•</span>
                          <span>{formatDateTime(reason.timestamp)}</span>
                        </div>
                      </div>
                      <div className="text-orange-500 text-lg ml-4">💭</div>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={customReasons.currentPage}
                totalPages={customReasons.totalPages}
                onPageChange={(page) => {
                  setCurrentReasonPage(page);
                }}
              />
            </div>
          )}

          {activeTab === 'suggestions' && suggestions && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">User Suggestions</h3>
                <span className="text-sm text-gray-500">
                  Page {suggestions.currentPage} of {suggestions.totalPages}
                </span>
              </div>

              <div className="space-y-4">
                {suggestions.data.map((suggestion, index) => (
                  <div key={`${suggestion.sessionID}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900 mb-2">{suggestion.text}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Session: {suggestion.sessionID}</span>
                          <span>•</span>
                          <span>{formatDateTime(suggestion.timestamp)}</span>
                        </div>
                      </div>
                      <div className="text-green-500 text-lg ml-4">💡</div>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={suggestions.currentPage}
                totalPages={suggestions.totalPages}
                onPageChange={(page) => {
                  setCurrentSuggestionPage(page);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Analysis Insights */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Qualitative Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-2xl mb-2">📝</div>
            <h4 className="font-medium text-gray-900">Response Quality</h4>
            <p className="text-sm text-gray-600">
              High engagement in open-ended feedback
            </p>
          </div>
          
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-medium text-gray-900">Common Themes</h4>
            <p className="text-sm text-gray-600">
              Transparency and participation requests
            </p>
          </div>
          
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-2xl mb-2">💬</div>
            <h4 className="font-medium text-gray-900">Engagement Level</h4>
            <p className="text-sm text-gray-600">
              {customReasons && suggestions ? 
                `${((customReasons.totalItems + suggestions.totalItems) / 5420 * 100).toFixed(1)}% provided feedback` :
                'High participation'
              }
            </p>
          </div>
          
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-2xl mb-2">🔍</div>
            <h4 className="font-medium text-gray-900">Actionable Insights</h4>
            <p className="text-sm text-gray-600">
              Policy improvements identified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualitativeFeedback;
