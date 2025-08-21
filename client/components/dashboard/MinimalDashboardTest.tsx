/**
 * Minimal Dashboard Test Component
 * Used to isolate and debug the blank page issue
 */

import { useState, useEffect } from 'react';
import { authenticateUser, checkAuthentication } from '../../data/realTimeDashboardService.js';

const MinimalDashboardTest = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    console.log(message);
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addTestResult('🚀 MinimalDashboardTest component mounted');
    testAuthentication();
  }, []);

  const testAuthentication = () => {
    addTestResult('🔍 Testing authentication...');
    
    try {
      // Test existing auth
      const authCheck = checkAuthentication();
      addTestResult(`Auth check result: ${JSON.stringify(authCheck)}`);
      
      if (authCheck.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(authCheck.user);
        addTestResult('✅ User is already authenticated');
      } else {
        addTestResult('❌ User is not authenticated');
      }
    } catch (error: any) {
      addTestResult(`❌ Auth test error: ${error.message}`);
      setError(error.message);
    }
  };

  const handleTestLogin = () => {
    addTestResult('🔐 Testing login with demo credentials...');
    
    try {
      const loginResult = authenticateUser('alex', 'Geetr2526Ur!');
      addTestResult(`Login result: ${JSON.stringify(loginResult)}`);
      
      if (loginResult.success) {
        setIsAuthenticated(true);
        setUser(loginResult.user);
        setError(null);
        addTestResult('✅ Login successful');
      } else {
        setError('Login failed');
        addTestResult('❌ Login failed');
      }
    } catch (error: any) {
      addTestResult(`❌ Login error: ${error.message}`);
      setError(error.message);
    }
  };

  const handleLogout = () => {
    addTestResult('🚪 Logging out...');
    sessionStorage.removeItem('dashboardAuth');
    sessionStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
    addTestResult('✅ Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Minimal Dashboard Test
        </h1>

        {/* Status Panel */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl mb-2 ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                {isAuthenticated ? '✅' : '❌'}
              </div>
              <p className="text-sm font-medium">Authentication</p>
              <p className="text-xs text-gray-500">
                {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
              </p>
            </div>
            <div className="text-center">
              <div className={`text-2xl mb-2 ${user ? 'text-green-600' : 'text-gray-400'}`}>
                👤
              </div>
              <p className="text-sm font-medium">User</p>
              <p className="text-xs text-gray-500">
                {user ? user.username : 'No user'}
              </p>
            </div>
            <div className="text-center">
              <div className={`text-2xl mb-2 ${error ? 'text-red-600' : 'text-green-600'}`}>
                {error ? '⚠️' : '✅'}
              </div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-xs text-gray-500">
                {error || 'No errors'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleTestLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isAuthenticated}
            >
              Test Login
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={!isAuthenticated}
            >
              Logout
            </button>
            <button
              onClick={testAuthentication}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Refresh Status
            </button>
          </div>
        </div>

        {/* Test Results Log */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results Log</h2>
          <div className="bg-gray-50 rounded p-4 max-h-64 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-sm">No test results yet...</p>
            ) : (
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Next Step */}
        {isAuthenticated && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              ✅ Authentication Working!
            </h3>
            <p className="text-green-700 mb-4">
              The authentication system is working correctly. The blank page issue might be in the Dashboard component itself.
            </p>
            <p className="text-sm text-green-600">
              User: {user.username} | Role: {user.role}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalDashboardTest;
