/**
 * UK PACK Dashboard - Header Component
 * Top navigation and user controls
 */

interface HeaderProps {
  user: any;
  onLogout: () => void;
  activeSection: string;
}

const sectionTitles = {
  overview: 'Engagement Overview',
  deepdive: 'Deep Dive Analytics',
  endgame: 'End-Game Behavior',
  feedback: 'Qualitative Feedback',
  trends: 'Trends & Insights'
};

const Header = ({ user, onLogout, activeSection }: HeaderProps) => {
  const currentTime = new Date().toLocaleString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Page title and timestamp */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {sectionTitles[activeSection as keyof typeof sectionTitles] || 'Dashboard'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {currentTime}
            </p>
          </div>

          {/* Right side - User info and controls */}
          <div className="flex items-center space-x-4">
            {/* Refresh button */}
            <button
              onClick={() => window.location.reload()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh data"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* User info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role}
                </p>
              </div>
              
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
