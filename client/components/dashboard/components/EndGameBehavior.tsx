/**
 * UK PACK Dashboard - End-Game Behavior Component
 * Analysis of fake news interactions and reward funnel
 */

import { useState, useEffect } from 'react';
import {
  getFakeNewsData,
  getRewardFunnelData
} from '../../../data/dashboardService.js';

interface EndGameBehaviorProps {
  token: string;
}

interface FakeNewsData {
  search: number;
  ignore: number;
  total: number;
  searchRate: number;
  scenarioBreakdown: Record<string, number>;
}

interface RewardFunnelData {
  totalSessions: number;
  reachedDecision: number;
  clickedParticipate: number;
  submittedForm: number;
  conversionRates: {
    decisionRate: number;
    participationRate: number;
    formCompletionRate: number;
  };
}

const EndGameBehavior = ({ token }: EndGameBehaviorProps) => {
  const [fakeNewsData, setFakeNewsData] = useState<FakeNewsData | null>(null);
  const [rewardFunnelData, setRewardFunnelData] = useState<RewardFunnelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    try {
      setIsLoading(true);

      const fakeNews = getFakeNewsData();
      const rewardFunnel = getRewardFunnelData();

      setFakeNewsData(fakeNews);
      setRewardFunnelData(rewardFunnel);
    } catch (error) {
      console.error('Error fetching end-game data:', error);
      setError('Failed to load end-game data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
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
          <h2 className="text-2xl font-bold text-gray-900">End-Game Behavior</h2>
          <p className="text-gray-600">Analysis of fake news interactions and reward participation</p>
        </div>
        <button
          onClick={fetchAllData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>

      {/* Fake News Analysis */}
      {fakeNewsData && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fake News Interaction Analysis</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Choice Distribution */}
            <div>
              <h4 className="font-medium text-gray-700 mb-4">User Response Distribution</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🔍</div>
                    <div>
                      <div className="font-medium text-green-800">Search for More Info</div>
                      <div className="text-sm text-green-600">{fakeNewsData.search} users</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    {((fakeNewsData.search / fakeNewsData.total) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🙈</div>
                    <div>
                      <div className="font-medium text-red-800">Ignore Information</div>
                      <div className="text-sm text-red-600">{fakeNewsData.ignore} users</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-red-700">
                    {((fakeNewsData.ignore / fakeNewsData.total) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded">
                <div className="text-sm text-blue-800">
                  <strong>Search Rate:</strong> {fakeNewsData.searchRate}% of users chose to verify information
                </div>
              </div>
            </div>

            {/* Scenario Breakdown */}
            <div>
              <h4 className="font-medium text-gray-700 mb-4">Scenario Breakdown</h4>
              <div className="space-y-3">
                {Object.entries(fakeNewsData.scenarioBreakdown).map(([scenario, count]) => {
                  const percentage = ((count / fakeNewsData.total) * 100).toFixed(1);
                  return (
                    <div key={scenario} className="border border-gray-200 rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-700 flex-1">{scenario}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{percentage}% of total interactions</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Media Literacy Insights */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">📚 Media Literacy Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Critical Thinking:</span>
                <div className={`${fakeNewsData.searchRate > 50 ? 'text-green-600' : 'text-orange-600'}`}>
                  {fakeNewsData.searchRate > 50 ? 'High' : 'Moderate'} verification behavior
                </div>
              </div>
              <div>
                <span className="font-medium">Most Concerning Scenario:</span>
                <div className="text-gray-700">
                  {Object.entries(fakeNewsData.scenarioBreakdown)
                    .sort(([,a], [,b]) => b - a)[0]?.[0]?.split('ข่าวเรื่อง')[1] || 'N/A'}
                </div>
              </div>
              <div>
                <span className="font-medium">Engagement Level:</span>
                <div className="text-blue-600">
                  {((fakeNewsData.total / 5420) * 100).toFixed(1)}% participated
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reward Funnel Analysis */}
      {rewardFunnelData && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reward Participation Funnel</h3>
          
          <div className="space-y-6">
            {/* Funnel Visualization */}
            <div className="relative">
              <div className="space-y-4">
                {/* Stage 1: Total Sessions */}
                <div className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">👥</div>
                    <div>
                      <div className="font-medium">Total Sessions</div>
                      <div className="text-sm opacity-90">All app participants</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">{rewardFunnelData.totalSessions.toLocaleString()}</div>
                </div>

                {/* Stage 2: Reached Decision */}
                <div className="flex items-center justify-between p-4 bg-blue-400 text-white rounded-lg ml-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🤔</div>
                    <div>
                      <div className="font-medium">Reached Reward Decision</div>
                      <div className="text-sm opacity-90">Saw reward offer screen</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">
                    {rewardFunnelData.reachedDecision.toLocaleString()}
                    <span className="text-sm ml-2">({rewardFunnelData.conversionRates.decisionRate}%)</span>
                  </div>
                </div>

                {/* Stage 3: Clicked Participate */}
                <div className="flex items-center justify-between p-4 bg-green-500 text-white rounded-lg ml-8">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">✋</div>
                    <div>
                      <div className="font-medium">Clicked Participate</div>
                      <div className="text-sm opacity-90">Chose to enter reward program</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">
                    {rewardFunnelData.clickedParticipate.toLocaleString()}
                    <span className="text-sm ml-2">({rewardFunnelData.conversionRates.participationRate}%)</span>
                  </div>
                </div>

                {/* Stage 4: Submitted Form */}
                <div className="flex items-center justify-between p-4 bg-green-600 text-white rounded-lg ml-12">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📝</div>
                    <div>
                      <div className="font-medium">Submitted Form</div>
                      <div className="text-sm opacity-90">Completed registration</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">
                    {rewardFunnelData.submittedForm.toLocaleString()}
                    <span className="text-sm ml-2">({rewardFunnelData.conversionRates.formCompletionRate}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{rewardFunnelData.conversionRates.decisionRate}%</div>
                <div className="text-sm text-blue-800">Reached Decision</div>
                <div className="text-xs text-gray-600 mt-1">Users who saw reward offer</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{rewardFunnelData.conversionRates.participationRate}%</div>
                <div className="text-sm text-green-800">Participation Rate</div>
                <div className="text-xs text-gray-600 mt-1">Of those who saw offer</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{rewardFunnelData.conversionRates.formCompletionRate}%</div>
                <div className="text-sm text-purple-800">Form Completion</div>
                <div className="text-xs text-gray-600 mt-1">Of those who started</div>
              </div>
            </div>

            {/* Drop-off Analysis */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">📉 Drop-off Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Biggest Drop-off:</span>
                  <div className="text-red-600">
                    Decision → Participation ({(100 - rewardFunnelData.conversionRates.participationRate).toFixed(1)}% lost)
                  </div>
                </div>
                <div>
                  <span className="font-medium">Overall Conversion:</span>
                  <div className="text-green-600">
                    {((rewardFunnelData.submittedForm / rewardFunnelData.totalSessions) * 100).toFixed(1)}% end-to-end
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">End-Game Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-2xl mb-2">🎭</div>
            <h4 className="font-medium text-gray-900">Media Literacy</h4>
            <p className="text-sm text-gray-600">
              {fakeNewsData && fakeNewsData.searchRate > 50 ? 'High verification' : 'Needs improvement'}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-2xl mb-2">🎁</div>
            <h4 className="font-medium text-gray-900">Reward Interest</h4>
            <p className="text-sm text-gray-600">
              {rewardFunnelData && rewardFunnelData.conversionRates.participationRate > 50 ? 'High interest' : 'Moderate interest'}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-2xl mb-2">📋</div>
            <h4 className="font-medium text-gray-900">Form Completion</h4>
            <p className="text-sm text-gray-600">
              {rewardFunnelData && rewardFunnelData.conversionRates.formCompletionRate > 75 ? 'Excellent' : 'Good'} completion rate
            </p>
          </div>
          
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-medium text-gray-900">Overall Engagement</h4>
            <p className="text-sm text-gray-600">
              Strong end-game participation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndGameBehavior;
