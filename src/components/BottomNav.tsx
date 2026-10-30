import React from 'react';
import { Home, Wrench, Megaphone, Music } from 'lucide-react';

export type NavTab = 'beranda' | 'tools' | 'music' | 'informasi';

interface BottomNavProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenTools?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentTab, 
  onChangeTab, 
  onOpenTools 
}) => {
  const tabs = [
    { id: 'beranda' as NavTab, label: 'BERANDA', icon: Home },
    { id: 'tools' as NavTab, label: 'TOOLS', icon: Wrench },
    { id: 'music' as NavTab, label: 'MUSIC', icon: Music },
    { id: 'informasi' as NavTab, label: 'INFORMASI', icon: Megaphone },
  ];

  const handleTabClick = (tabId: NavTab) => {
    onChangeTab(tabId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-[80px] bg-[#0A1020]/95 backdrop-blur-xl border-t border-[#1E2F47] px-3 sm:px-6 w-full select-none flex items-center justify-center">
      <nav 
        aria-label="Navigasi Bawah"
        className="w-full max-w-lg mx-auto flex items-center justify-between gap-1 sm:gap-2"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 min-h-[56px] py-1 px-1.5 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-[#1E60FF] text-white shadow-[0_0_20px_rgba(30,96,255,0.45)]'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-white/5'
              }`}
            >
              <IconComponent 
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'stroke-[2.6] scale-105' : 'stroke-[1.8]'
                }`} 
              />
              <span 
                className={`text-[10px] tracking-wider transition-all font-orbitron ${
                  isActive ? 'font-black text-white' : 'font-bold'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
