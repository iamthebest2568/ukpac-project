/**
 * UK PACK Dashboard - Sidebar Component
 * Navigation menu for different dashboard sections
 */

type DashboardSection = 'overview' | 'deepdive' | 'endgame' | 'feedback' | 'trends';

interface SidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  user: any;
}

const menuItems: { id: DashboardSection; label: string; icon: string; description: string }[] = [
  {
    id: 'overview',
    label: 'Engagement Overview',
    icon: '📊',
    description: 'Total participants & activity'
  },
  {
    id: 'deepdive',
    label: 'Deep Dive Analytics',
    icon: '🔍',
    description: 'Reasoning & mini-games'
  },
  {
    id: 'endgame',
    label: 'End-Game Behavior',
    icon: '🎯',
    description: 'Fake news & rewards'
  },
  {
    id: 'feedback',
    label: 'Qualitative Feedback',
    icon: '💬',
    description: 'Custom reasons & suggestions'
  }
];

const Sidebar = ({ activeSection, onSectionChange, user }: SidebarProps) => {
  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo/Brand */}
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

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg" role="img" aria-label={item.label}>
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer/Status */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <div className="w-3 h-3 bg-green-400 rounded-full inline-block mr-2 animate-pulse"></div>
          <span className="text-sm text-gray-600">Real-Time Data</span>
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">
          Live Collection • Auto-Updates
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
