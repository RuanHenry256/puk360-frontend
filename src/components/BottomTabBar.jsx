import React from 'react';

// BottomTabBar
// - Accepts optional `tabs` to allow reuse across Admin/Host with different sections.
// - Uses simple numeric placeholders for icons by default.
export default function BottomTabBar({ activeTab, onTabChange, tabs }) {
  const defaultTabs = [
    { id: 'overview', label: 'Overview', icon: '1' },
    { id: 'events', label: 'Events', icon: '2' },
    { id: 'users', label: 'Users', icon: '3' }
  ];

  const normalized = Array.isArray(tabs) && tabs.length > 0 ? tabs : defaultTabs;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 h-16 border-t border-secondary/40 bg-primary/5 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-around px-4">
        {normalized.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 rounded-lg px-4 py-2 transition-colors ${
              activeTab === tab.id
                ? 'text-primary font-semibold'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
