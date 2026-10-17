import React from 'react';

export type StudioTab = 'script' | 'tools' | 'captions' | 'broll' | 'voices';

interface LeftRailProps {
  activeTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
}

export const LeftRail: React.FC<LeftRailProps> = ({
  activeTab,
  onSelectTab,
  onOpenSettings,
  onOpenShortcuts,
}) => {
  const tabs = [
    {
      id: 'script' as StudioTab,
      label: 'Script AI',
      icon: 'auto_awesome',
      fill: true,
    },
    {
      id: 'tools' as StudioTab,
      label: 'Tools',
      icon: 'magic_button',
      fill: false,
    },
    {
      id: 'captions' as StudioTab,
      label: 'Captions',
      icon: 'subtitles',
      fill: false,
    },
    {
      id: 'broll' as StudioTab,
      label: 'B-Roll',
      icon: 'video_library',
      fill: false,
    },
    {
      id: 'voices' as StudioTab,
      label: 'Voices',
      icon: 'record_voice_over',
      fill: false,
    },
  ];

  return (
    <aside className="flex flex-col justify-between items-center h-full w-16 py-3 border-r border-[#4a4455] bg-[#0d0e15] shrink-0 select-none">
      {/* Main Rail Navigation Tabs */}
      <div className="flex flex-col items-center gap-3 w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`rounded-lg p-2 flex flex-col items-center justify-center w-12 transition-all ${
                isActive
                  ? 'text-[#d2bbff] bg-[#7c3aed]/20 ring-1 ring-[#7c3aed]/40 shadow-sm'
                  : 'text-[#ccc3d8] hover:text-[#e3e1ed] hover:bg-[#1e1f27]'
              }`}
              title={tab.label}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isActive && tab.fill ? 'fill' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Rail Footer Tabs: Settings & Keyboard Shortcuts */}
      <div className="flex flex-col items-center gap-2 w-full pt-4 border-t border-[#4a4455]/50">
        <button
          onClick={onOpenSettings}
          className="text-[#ccc3d8] p-2 hover:text-[#e3e1ed] hover:bg-[#1e1f27] rounded-lg transition-colors"
          title="Project Settings"
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
        </button>
        <button
          onClick={onOpenShortcuts}
          className="text-[#ccc3d8] p-2 hover:text-[#e3e1ed] hover:bg-[#1e1f27] rounded-lg transition-colors"
          title="Keyboard Shortcuts"
        >
          <span className="material-symbols-outlined text-[18px]">keyboard</span>
        </button>
      </div>
    </aside>
  );
};
