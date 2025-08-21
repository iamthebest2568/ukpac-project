/**
 * UK PACK Dashboard - Main Dashboard Component
 * Analytics overview and navigation
 */

import { useState, useEffect } from 'react';
import EngagementOverview from './components/EngagementOverview';
import DeepDiveAnalytics from './components/DeepDiveAnalytics';
import EndGameBehavior from './components/EndGameBehavior';
import QualitativeFeedback from './components/QualitativeFeedback';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

interface DashboardProps {
  token: string;
  user: any;
  onLogout: () => void;
}

type DashboardSection = 'overview' | 'deepdive' | 'endgame' | 'feedback' | 'trends';

const Dashboard = ({ token, user, onLogout }: DashboardProps) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verify token on component mount
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Token verification error:', error);
      setError('Session expired. Please login again.');
      setTimeout(() => {
        onLogout();
      }, 2000);
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <EngagementOverview token={token} />;
      case 'deepdive':
        return <DeepDiveAnalytics token={token} />;
      case 'endgame':
        return <EndGameBehavior token={token} />;
      case 'feedback':
        return <QualitativeFeedback token={token} />;
      default:
        return <EngagementOverview token={token} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          user={user}
          onLogout={onLogout}
          activeSection={activeSection}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
