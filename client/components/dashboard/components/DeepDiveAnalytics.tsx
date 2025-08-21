/**
 * UK PACK Dashboard - Deep Dive Analytics Component
 * Detailed analysis of reasoning, mini-games, and satisfaction
 */

import { useState, useEffect } from 'react';

interface DeepDiveAnalyticsProps {
  token: string;
}

interface ReasoningData {
  totalResponses: number;
  breakdown: Record<string, number>;
  topReasons: Array<{ reason: string; count: number }>;
}

interface MinigameData {
  mn1Participants: number;
  mn2Participants: number;
  topPolicies: Array<{ name: string; count: number }>;
  topGroups: Array<{ name: string; count: number }>;
}

interface Minigame3Data {
  participants: number;
  top3Choices: Array<{ name: string; count: number }>;
  averageAllocation: Record<string, number>;
}

interface SatisfactionData {
  satisfied: number;
  unsatisfied: number;
  total: number;
  satisfactionRate: number;
}

const DeepDiveAnalytics = ({ token }: DeepDiveAnalyticsProps) => {
  const [reasoningData, setReasoningData] = useState<ReasoningData | null>(null);
  const [minigameData, setMinigameData] = useState<MinigameData | null>(null);
  const [minigame3Data, setMinigame3Data] = useState<Minigame3Data | null>(null);
  const [satisfactionData, setSatisfactionData] = useState<SatisfactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [reasoningRes, minigameRes, minigame3Res, satisfactionRes] = await Promise.all([
        fetch('http://localhost:3001/api/v1/dashboard/deepdive/reasoning', { headers }),
        fetch('http://localhost:3001/api/v1/dashboard/deepdive/minigame1_2', { headers }),
        fetch('http://localhost:3001/api/v1/dashboard/deepdive/minigame3', { headers }),
        fetch('http://localhost:3001/api/v1/dashboard/deepdive/satisfaction', { headers })
      ]);

      if (!reasoningRes.ok || !minigameRes.ok || !minigame3Res.ok || !satisfactionRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const [reasoning, minigame, minigame3, satisfaction] = await Promise.all([
        reasoningRes.json(),
        minigameRes.json(),
        minigame3Res.json(),
        satisfactionRes.json()
      ]);

      setReasoningData(reasoning.data);
      setMinigameData(minigame.data);
      setMinigame3Data(minigame3.data);
      setSatisfactionData(satisfaction.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
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
          <h2 className="text-2xl font-bold text-gray-900">Deep Dive Analytics</h2>
          <p className="text-gray-600">Detailed analysis of user reasoning and mini-game performance</p>
        </div>
        <button
          onClick={fetchAllData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>

      {/* Reasoning Breakdown */}
      {reasoningData && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ASK02 Reasoning Analysis</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Response Distribution</h4>
              <div className="space-y-3">
                {Object.entries(reasoningData.breakdown).map(([reason, count]) => {
                  const percentage = ((count / reasoningData.totalResponses) * 100).toFixed(1);
                  return (
                    <div key={reason} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex-1 mr-4">{reason}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Key Insights</h4>
              <div className="space-y-3 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <span className="font-medium">Total Responses:</span> {reasoningData.totalResponses.toLocaleString()}
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <span className="font-medium">Top Reason:</span> {reasoningData.topReasons[0]?.reason}
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <span className="font-medium">Engagement Rate:</span> {((reasoningData.totalResponses / 5420) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mini-games Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MN1 & MN2 */}
        {minigameData && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy & Beneficiary Games (MN1 & MN2)</h3>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Top Policies (MN1)</h4>
              <div className="space-y-2">
                {minigameData.topPolicies.slice(0, 5).map((policy, index) => (
                  <div key={policy.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex-1">
                      {index + 1}. {policy.name}
                    </span>
                    <span className="text-sm font-medium">{policy.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-3">Top Beneficiary Groups (MN2)</h4>
              <div className="space-y-2">
                {minigameData.topGroups.slice(0, 5).map((group, index) => (
                  <div key={group.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex-1">
                      {index + 1}. {group.name}
                    </span>
                    <span className="text-sm font-medium">{group.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
              MN1: {minigameData.mn1Participants} participants • 
              MN2: {minigameData.mn2Participants} participants
            </div>
          </div>
        )}

        {/* MN3 */}
        {minigame3Data && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation Game (MN3)</h3>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Most Selected Choices</h4>
              <div className="space-y-2">
                {minigame3Data.top3Choices.slice(0, 5).map((choice, index) => (
                  <div key={choice.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex-1">
                      {index + 1}. {choice.name}
                    </span>
                    <span className="text-sm font-medium">{choice.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-3">Average Budget Allocation</h4>
              <div className="space-y-2">
                {Object.entries(minigame3Data.averageAllocation)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([item, allocation]) => (
                    <div key={item} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex-1">{item}</span>
                      <span className="text-sm font-medium">{allocation}%</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
              {minigame3Data.participants} participants
            </div>
          </div>
        )}
      </div>

      {/* Satisfaction Analysis */}
      {satisfactionData && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">MN3 Satisfaction Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{satisfactionData.satisfied}</div>
              <div className="text-sm text-gray-600">Satisfied Users</div>
              <div className="text-xs text-gray-500 mt-1">
                {((satisfactionData.satisfied / satisfactionData.total) * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{satisfactionData.unsatisfied}</div>
              <div className="text-sm text-gray-600">Unsatisfied Users</div>
              <div className="text-xs text-gray-500 mt-1">
                {((satisfactionData.unsatisfied / satisfactionData.total) * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{satisfactionData.satisfactionRate}%</div>
              <div className="text-sm text-gray-600">Overall Satisfaction</div>
              <div className="text-xs text-gray-500 mt-1">
                {satisfactionData.total} total responses
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${satisfactionData.satisfactionRate}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>Satisfaction Rate: {satisfactionData.satisfactionRate}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}

      {/* Summary Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-medium text-gray-900">Most Engaging Path</h4>
            <p className="text-sm text-gray-600">
              {reasoningData && reasoningData.topReasons[0]?.reason}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="font-medium text-gray-900">Budget Priority</h4>
            <p className="text-sm text-gray-600">
              {minigame3Data && Object.entries(minigame3Data.averageAllocation)
                .sort(([,a], [,b]) => b - a)[0]?.[0]}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-2xl mb-2">😊</div>
            <h4 className="font-medium text-gray-900">User Satisfaction</h4>
            <p className="text-sm text-gray-600">
              {satisfactionData && satisfactionData.satisfactionRate > 60 ? 'High' : 'Moderate'} engagement satisfaction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepDiveAnalytics;
