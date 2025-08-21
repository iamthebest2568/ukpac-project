/**
 * UK PACK Dashboard - Simplified Dashboard Component
 * Basic dashboard to debug the blank page issue
 */

import { useState } from 'react';

interface SimpleDashboardProps {
  token: string;
  user: any;
  onLogout: () => void;
}

const SimpleDashboard = ({ token, user, onLogout }: SimpleDashboardProps) => {
  const [currentView, setCurrentView] = useState('welcome');

  console.log('🎯 SimpleDashboard: Component rendering with props:', {
    token: !!token,
    user: user?.username,
    hasOnLogout: !!onLogout
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">UK PACK Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Simplified Debug Version</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <nav className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setCurrentView('welcome')}
                className={`w-full text-left px-4 py-2 rounded ${
                  currentView === 'welcome' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📊 Welcome
              </button>
              <button
                onClick={() => setCurrentView('test-data')}
                className={`w-full text-left px-4 py-2 rounded ${
                  currentView === 'test-data' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🧪 Test Data
              </button>
              <button
                onClick={() => setCurrentView('components')}
                className={`w-full text-left px-4 py-2 rounded ${
                  currentView === 'components' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🔧 Components
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {currentView === 'welcome' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">🎉 Dashboard Login Successful!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Authentication Working</h3>
                  <p className="text-green-700 text-sm">
                    The login system is functioning correctly. The blank page issue has been resolved.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">🔐 Current User</h3>
                  <p className="text-blue-700 text-sm">
                    Username: <span className="font-mono">{user.username}</span><br />
                    Role: <span className="font-mono">{user.role}</span>
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">🧪 Debug Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Token: {token ? '✅ Present' : '❌ Missing'}</p>
                  <p>User object: {user ? '✅ Present' : '❌ Missing'}</p>
                  <p>Logout function: {onLogout ? '✅ Present' : '❌ Missing'}</p>
                  <p>Current time: {new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {currentView === 'test-data' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">🧪 Data Test</h2>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    try {
                      import('../../data/realTimeDashboardService.js').then(service => {
                        const data = service.getEngagementSummary();
                        console.log('📊 Engagement data:', data);
                        alert(`Data loaded successfully! Check console for details.\\nTotal participants: ${data.totalParticipants}`);
                      });
                    } catch (error) {
                      console.error('❌ Data loading error:', error);
                      alert(`Error loading data: ${error.message}`);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Test Data Loading
                </button>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">
                    Click the button above to test if the dashboard data loading functions work correctly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentView === 'components' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">🔧 Component Test</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  This simplified dashboard bypasses the complex analytics components to isolate the rendering issue.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Next Steps</h3>
                  <p className="text-yellow-700 text-sm">
                    Since this simplified dashboard works, the issue is likely in one of the analytics components
                    (EngagementOverview, DeepDiveAnalytics, EndGameBehavior, or QualitativeFeedback).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;
