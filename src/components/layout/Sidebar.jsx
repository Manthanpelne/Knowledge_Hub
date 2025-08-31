import React from 'react';
import { Home, Search, MessageCircle, Plus, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function Sidebar({ activeTab, onTabChange }) {
  const { activities } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'qa', label: 'Team Q&A', icon: MessageCircle },
    { id: 'create', label: 'New Document', icon: Plus }
  ];

  return (
    <div className="w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 min-h-screen">
      <nav className="p-4">
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-white/10 mt-4">
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-300">Team Activity</h3>
        </div>
        <div className="space-y-3">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="text-xs">
              <p className="text-slate-300">
                <span className="font-medium">{activity.userName}</span>
                <span className="text-slate-400 ml-1">
                  {activity.type} "{activity.documentTitle}"
                </span>
              </p>
              <p className="text-slate-500 mt-1">
                {new Date(activity.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}