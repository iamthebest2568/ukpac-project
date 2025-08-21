/**
 * UK PACK Dashboard - Engagement Overview Component
 * Main dashboard showing overall participation statistics
 */

import { useState, useEffect } from 'react';

interface EngagementOverviewProps {
  token: string;
}

interface EngagementData {
  totalParticipants: number;
  initialStance: Record<string, number>;
  activityByDay: Array<{ date: string; count: number }>;
  completionRate: number;
  averageSessionDuration: number;
}

const EngagementOverview = ({ token }: EngagementOverviewProps) => {
  const [data, setData] = useState<EngagementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEngagementData();
  }, []);

  const fetchEngagementData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/dashboard/engagement/summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch engagement data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Error fetching engagement data:', error);
      setError('Failed to load engagement data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-500 text-2xl mb-2">❌</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchEngagementData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate percentages for initial stance
  const totalInitialResponses = Object.values(data.initialStance).reduce((sum, count) => sum + count, 0);
  const stancePercentages = Object.entries(data.initialStance).map(([stance, count]) => ({
    stance,
    count,
    percentage: ((count / totalInitialResponses) * 100).toFixed(1)
  }));

  const stanceColors = {
    'เห็นด้วย': 'bg-green-100 text-green-800',
    'กลางๆ': 'bg-yellow-100 text-yellow-800', 
    'ไม่เห็นด้วย': 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Engagement Overview</h2>
          <p className="text-gray-600">Overall participation statistics and trends</p>
        </div>
        <button
          onClick={fetchEngagementData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-3xl font-bold text-gray-900">{data.totalParticipants.toLocaleString()}</p>
            </div>
            <div className="text-blue-500 text-2xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{data.completionRate}%</p>
            </div>
            <div className="text-green-500 text-2xl">✅</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Session Duration</p>
              <p className="text-3xl font-bold text-gray-900">{data.averageSessionDuration}m</p>
            </div>
            <div className="text-purple-500 text-2xl">⏱️</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Activity</p>
              <p className="text-3xl font-bold text-gray-900">{data.activityByDay.length}</p>
              <p className="text-xs text-gray-500">active days</p>
            </div>
            <div className="text-orange-500 text-2xl">📅</div>
          </div>
        </div>
      </div>

      {/* Initial Stance Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Initial Stance Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stancePercentages.map(({ stance, count, percentage }) => (
            <div key={stance} className={`p-4 rounded-lg ${stanceColors[stance as keyof typeof stanceColors]}`}>
              <div className="text-center">
                <p className="font-medium">{stance}</p>
                <p className="text-2xl font-bold">{count.toLocaleString()}</p>
                <p className="text-sm opacity-75">{percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity Trends</h3>
        <div className="space-y-3">
          {data.activityByDay.slice(-7).map((day, index) => {
            const maxCount = Math.max(...data.activityByDay.map(d => d.count));
            const width = (day.count / maxCount) * 100;
            
            return (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-24 text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${width}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm font-medium text-gray-900 text-right">
                  {day.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participation Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Peak Activity Day</span>
              <span className="font-medium">
                {data.activityByDay.reduce((max, day) => day.count > max.count ? day : max).date}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Most Common Stance</span>
              <span className="font-medium">
                {Object.entries(data.initialStance).reduce((max, [stance, count]) => 
                  count > max[1] ? [stance, count] : max)[0]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Engagement Score</span>
              <span className="font-medium text-green-600">{data.completionRate}% High</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Connection</span>
              <span className="inline-flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Connected
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Update</span>
              <span className="font-medium">Just now</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Data Source</span>
              <span className="font-medium">Mock Database</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementOverview;
