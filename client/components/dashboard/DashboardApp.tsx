/**
 * UK PACK Dashboard Application
 * Main container component that handles authentication and dashboard routing
 */

import { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';

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

  const checkExistingAuth = async () => {
    try {
      const savedToken = localStorage.getItem('dashboardToken');
      const savedUser = localStorage.getItem('dashboardUser');

      if (savedToken && savedUser) {
        // Verify token is still valid
        const response = await fetch('http://localhost:3001/api/v1/auth/verify', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${savedToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('dashboardToken');
          localStorage.removeItem('dashboardUser');
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('dashboardToken');
      localStorage.removeItem('dashboardUser');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
    setError(null);
  };

  const handleLogout = () => {
    // Clear authentication state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);

    // Clear localStorage
    localStorage.removeItem('dashboardToken');
    localStorage.removeItem('dashboardUser');

    // Optional: Call logout endpoint
    if (token) {
      fetch('http://localhost:3001/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).catch(error => {
        console.error('Logout request failed:', error);
        // Don't block logout on API failure
      });
    }
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
  if (isAuthenticated && token && user) {
    return (
      <Dashboard
        token={token}
        user={user}
        onLogout={handleLogout}
      />
    );
  } else {
    return (
      <LoginPage
        onLogin={handleLogin}
        onError={handleError}
      />
    );
  }
};

export default DashboardApp;
