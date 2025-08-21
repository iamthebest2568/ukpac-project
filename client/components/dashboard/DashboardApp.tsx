/**
 * UK PACK Dashboard Application
 * Main container component that handles authentication and dashboard routing
 */

import { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import { checkAuthentication } from '../../data/realTimeDashboardService.js';

const DashboardApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    checkExistingAuth();
  }, []);

  const checkExistingAuth = () => {
    console.log('🔍 DashboardApp: Checking existing authentication...');
    try {
      const authResult = checkAuthentication();
      console.log('🔍 DashboardApp: Auth result:', authResult);

      if (authResult.isAuthenticated) {
        console.log('✅ DashboardApp: User is authenticated, setting state');
        setToken('local-auth-token'); // Mock token for compatibility
        setUser(authResult.user);
        setIsAuthenticated(true);
      } else {
        console.log('❌ DashboardApp: User is not authenticated');
      }
    } catch (error) {
      console.error('❌ DashboardApp: Error checking authentication:', error);
      // Clear potentially corrupted data
      sessionStorage.removeItem('dashboardAuth');
      sessionStorage.removeItem('isLoggedIn');
    } finally {
      console.log('🔍 DashboardApp: Setting loading to false');
      setIsLoading(false);
    }
  };

  const handleLogin = (authResult: any) => {
    console.log('🔐 DashboardApp: Handling login with result:', authResult);
    setToken('local-auth-token'); // Mock token for compatibility
    setUser(authResult.user);
    setIsAuthenticated(true);
    setError(null);
    console.log('✅ DashboardApp: Login state updated successfully');
  };

  const handleLogout = () => {
    // Clear authentication state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);

    // Clear sessionStorage
    sessionStorage.removeItem('dashboardAuth');
    sessionStorage.removeItem('isLoggedIn');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">UK PACK Dashboard</h2>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  // Show error if exists
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setError(null);
                checkExistingAuth();
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry Connection
            </button>
            <div className="text-xs text-gray-500">
              Make sure the backend server is running on port 3001
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main application routing
  console.log('🎨 DashboardApp: Rendering with state:', {
    isAuthenticated,
    hasToken: !!token,
    hasUser: !!user,
    isLoading,
    error
  });

  if (isAuthenticated && token && user) {
    console.log('📊 DashboardApp: Rendering Dashboard component');
    return (
      <Dashboard
        token={token}
        user={user}
        onLogout={handleLogout}
      />
    );
  } else {
    console.log('🔐 DashboardApp: Rendering LoginPage component');
    return (
      <LoginPage
        onLogin={handleLogin}
        onError={handleError}
      />
    );
  }
};

export default DashboardApp;
