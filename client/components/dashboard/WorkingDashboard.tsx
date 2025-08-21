/**
 * UK PACK Dashboard - Working Dashboard Component
 * Robust dashboard with error handling and fallbacks
 */

import { useState, useEffect } from 'react';

interface WorkingDashboardProps {
  token: string;
  user: any;
  onLogout: () => void;
}

const WorkingDashboard = ({ token, user, onLogout }: WorkingDashboardProps) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Import and load data safely
      const { getEngagementSummary, getLoggedEvents } = await import('../../data/realTimeDashboardService.js');
      
      const engagementData = getEngagementSummary();
      const allEvents = getLoggedEvents();
      
      setData({
        engagement: engagementData,
        totalEvents: allEvents.length,
        lastUpdate: new Date().toLocaleString()
      });
      
      setError(null);
    } catch (err: any) {
      console.error('Dashboard data loading error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '🔍' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard...</h2>
          <p className="text-gray-600">Please wait while we load your analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🇹🇭</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">UK PACK</h2>
              <p className="text-sm text-gray-500">Analytics Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">System Online</span>
            </div>
            <p className="text-xs text-gray-500">Real-time Data</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {data?.lastUpdate || 'Loading...'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={loadDashboardData}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  title="Refresh data"
                >
                  🔄
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Logout"
                  >
                    🚪
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-500 text-2xl mb-2">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadDashboardData}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry Loading
                </button>
              </div>
            ) : (
              <>
                {activeSection === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Participants</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {data?.engagement?.totalParticipants || 0}
                            </p>
                          </div>
                          <div className="text-blue-500 text-2xl">👥</div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Events</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {data?.totalEvents || 0}
                            </p>
                          </div>
                          <div className="text-green-500 text-2xl">📊</div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {data?.engagement?.completionRate || 0}%
                            </p>
                          </div>
                          <div className="text-purple-500 text-2xl">✅</div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {Math.round(data?.engagement?.averageSessionDuration || 0)}s
                            </p>
                          </div>
                          <div className="text-orange-500 text-2xl">⏱️</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Initial Stance Distribution</h3>
                      {data?.engagement?.initialStance ? (
                        <div className="space-y-3">
                          {Object.entries(data.engagement.initialStance).map(([stance, count]) => (
                            <div key={stance} className="flex items-center justify-between">
                              <span className="text-gray-700">{stance}</span>
                              <span className="font-semibold">{count as number}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No stance data available</p>
                      )}
                    </div>
                  </div>
                )}

                {activeSection === 'analytics' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Analytics Section</h3>
                    <p className="text-gray-600">Detailed analytics and insights will be displayed here.</p>
                  </div>
                )}

                {activeSection === 'reports' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Reports Section</h3>
                    <p className="text-gray-600">Export and generate reports from this section.</p>
                  </div>
                )}

                {activeSection === 'settings' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Settings Section</h3>
                    <p className="text-gray-600">Dashboard configuration and user settings.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkingDashboard;
