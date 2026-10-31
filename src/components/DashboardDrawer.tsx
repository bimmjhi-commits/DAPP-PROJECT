import React from 'react';
import {
  X,
  Home,
  Wrench,
  Megaphone,
  Music,
  BookOpen,
  Unlock,
  Globe,
  LogOut,
  ChevronRight,
  Bot,
  Info,
  Flame,
} from 'lucide-react';
import { NavTab } from './BottomNav';

interface DashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;

  onOpenQuran: () => void;
  onOpenSub4Unlock?: () => void;
  onOpenIpLookup?: () => void;
  onOpenAiChat?: () => void;
  onOpenSpamNgl?: () => void;
  onOpenCatatanPembuka?: () => void;
  onLogout: () => void;
  userName?: string;
}

export const DashboardDrawer: React.FC<DashboardDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  onOpenQuran,
  onOpenSub4Unlock,
  onOpenIpLookup,
  onOpenAiChat,
  onOpenSpamNgl,
  onOpenCatatanPembuka,
  onLogout,
  userName,
}) => {
  if (!isOpen) return null;

  const pageList = [
    {
      id: 'beranda' as NavTab,
      label: 'BERANDA',
      desc: 'Halaman utama & profil',
      icon: Home,
      action: () => { onSelectTab('beranda'); onClose(); },
      isActive: currentTab === 'beranda',
    },
    {
      id: 'tools' as NavTab,
      label: 'TOOLS',
      desc: 'Kumpulan fitur tools',
      icon: Wrench,
      action: () => { onSelectTab('tools'); onClose(); },
      isActive: currentTab === 'tools',
    },
    {
      id: 'music' as NavTab,
      label: 'MUSIC',
      desc: 'Pencarian & pemutar musik',
      icon: Music,
      action: () => { onSelectTab('music'); onClose(); },
      isActive: currentTab === 'music',
    },
    {
      id: 'informasi' as NavTab,
      label: 'INFORMASI',
      desc: 'Pusat informasi sistem',
      icon: Megaphone,
      action: () => { onSelectTab('informasi'); onClose(); },
      isActive: currentTab === 'informasi',
    },
    {
      id: 'quran' as any,
      label: "AL-QUR'AN",
      desc: '114 Surah, Ayat & Audio',
      icon: BookOpen,
      action: () => { onOpenQuran(); onClose(); },
      isActive: false,
    },
    {
      id: 'spamngl' as any,
      label: 'SPAM NGL',
      desc: 'Kirim pesan anonim NGL',
      icon: Flame,
      action: () => { if (onOpenSpamNgl) onOpenSpamNgl(); onClose(); },
      isActive: false,
    },
    {
      id: 'sub4unlock' as any,
      label: 'BYPASS SUB4UNLOCK',
      desc: 'Bypass link unlock langsung',
      icon: Unlock,
      action: () => { if (onOpenSub4Unlock) onOpenSub4Unlock(); onClose(); },
      isActive: false,
    },
    {
      id: 'iplookup' as any,
      label: 'IP LOOKUP',
      desc: 'Lacak info & lokasi IP',
      icon: Globe,
      action: () => { if (onOpenIpLookup) onOpenIpLookup(); onClose(); },
      isActive: false,
    },
    {
      id: 'aichat' as any,
      label: 'CHAT AI',
      desc: 'Gemini AI Assistant',
      icon: Bot,
      action: () => { if (onOpenAiChat) onOpenAiChat(); onClose(); },
      isActive: false,
    },
    {
      id: 'catatanpembuka' as any,
      label: 'CATATAN PEMBUKA',
      desc: 'Informasi awal platform',
      icon: Info,
      action: () => { if (onOpenCatatanPembuka) onOpenCatatanPembuka(); onClose(); },
      isActive: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-[320px] bg-zinc-900 border-r border-zinc-800 h-full flex flex-col justify-between shadow-[20px_0_60px_rgba(0,0,0,0.8)] z-10 overflow-hidden animate-in slide-in-from-left duration-300">
        
        {/* Header */}
        <div
          className="relative w-full h-[150px] overflow-hidden flex items-end justify-between p-6 shrink-0 bg-black"
          style={{
            backgroundImage: `url('https://cdn.phototourl.com/member/2026-10-30-a35a51d1-e869-43df-8288-fbf29db9ad9b.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-300 font-bold">
              Navigasi Cepat
            </span>
            <h2 className="font-black text-2xl text-white tracking-tighter uppercase">
              Dashboard
            </h2>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-700 active:scale-90 transition-all text-white shadow-lg backdrop-blur-sm"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6 bg-zinc-900">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2.5 h-4 bg-cyan-500 rounded-sm" />
            <span className="font-black text-[11px] text-zinc-400 uppercase tracking-widest">
              Daftar Menu
            </span>
          </div>

          <div className="space-y-3">
            {pageList.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`w-full p-3.5 rounded-[22px] border flex items-center justify-between text-left transition-all active:scale-95 group relative overflow-hidden ${
                    item.isActive
                      ? 'bg-zinc-800 border-cyan-500 text-white shadow-lg'
                      : 'bg-zinc-800/80 border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <div
                      className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 border border-zinc-700 ${
                        item.isActive
                          ? 'bg-cyan-500 text-white border-cyan-400'
                          : 'bg-zinc-700 text-zinc-300 group-hover:text-white group-hover:bg-zinc-600'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="font-black text-[13px] tracking-tight text-white">
                        {item.label}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-tighter leading-none mt-0.5 text-zinc-400">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 stroke-[3] ${
                      item.isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-zinc-900 border-t border-zinc-800 space-y-4">
          {userName && (
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">
              LOGIN: <span className="text-white">{userName}</span>
            </div>
          )}

          <button
            onClick={onLogout}
            className="w-full py-4 px-5 rounded-full bg-red-600/90 text-white font-black text-[11px] uppercase tracking-[0.2em] border border-red-500/50 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-red-600"
          >
            <LogOut className="w-4 h-4 stroke-[3]" />
            <span>Logout Sesi</span>
          </button>
        </div>

      </div>
    </div>
  );
};
