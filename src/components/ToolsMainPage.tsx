import React, { useRef, useEffect, useState } from 'react';
import { ToolDef } from './ToolDetailView';
import { ToolsModal } from './ToolsModal';

interface ToolsMainPageProps {
  videoUrl?: string;
  userName?: string;
  onOpenMenu?: () => void;
  isQuranAudioPlaying?: boolean;
  onOpenQuran?: () => void;
  onOpenSub4Unlock?: () => void;

  onOpenIpLookup?: () => void;
  onOpenMusic?: () => void;
  onOpenAiChat?: () => void;
}

const DEFAULT_TOOLS_VIDEO_URL =
  'https://videotourl.com/videos/1793016418186-9a6fc4f3-e859-4eea-9629-cb2ac0f1dc8b.mp4';

export interface CustomIconToolDef extends ToolDef {
  iconSvg: React.ReactNode;
  shortName: string;
  cardTitle?: string;
  cardDesc?: string;
  badge?: string;
  category: 'downloader' | 'canvas' | 'stalker' | 'maker';
}

export interface ToolCategory {
  id: 'downloader' | 'canvas' | 'stalker' | 'maker';
  name: string;
  shortDesc: string;
  badge: string;
  iconSvg: React.ReactNode;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'downloader',
    name: 'DOWNLOADER',
    shortDesc: 'Instagram, TikTok, YouTube, X, Spotify',
    badge: 'MEDIA',
    iconSvg: (
      <svg className="w-8 h-8 text-current" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    id: 'canvas',
    name: 'CANVAS',
    shortDesc: 'Struk DANA, GoPay, OVO, E-KTP, WA',
    badge: 'IMAGE',
    iconSvg: (
      <svg className="w-8 h-8 text-current" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: 'stalker',
    name: 'STALKER',
    shortDesc: 'IP Tracker, IQC Chat, Fake Call, NGL',
    badge: 'LOOKUP',
    iconSvg: (
      <svg className="w-8 h-8 text-current" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'maker',
    name: 'MAKER',
    shortDesc: 'BRAT, Sertifikat, Meme, Quotes, QR',
    badge: 'CREATE',
    iconSvg: (
      <svg className="w-8 h-8 text-current" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

export const TOOLS_CONFIG: CustomIconToolDef[] = [];

export const ToolsMainPage: React.FC<ToolsMainPageProps> = ({
  videoUrl = DEFAULT_TOOLS_VIDEO_URL,
  userName = 'User',
  onOpenMenu,
}) => {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#tool-')) {
      return window.location.hash.replace('#tool-', '');
    }
    return null;
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<'downloader' | 'canvas' | 'stalker' | 'maker' | null>(null);
  const [activeModal, setActiveModal] = useState<ToolCategory | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement | null>(null);
  const toolScrollRef = useRef<HTMLDivElement | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  useEffect(() => {
    let batteryObj: any = null;

    const updateBatteryInfo = (b: any) => {
      if (b && typeof b.level === 'number') {
        setBatteryLevel(Math.round(b.level * 100));
        setIsCharging(Boolean(b.charging));
      }
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any)
        .getBattery()
        .then((b: any) => {
          batteryObj = b;
          updateBatteryInfo(b);
          b.addEventListener('levelchange', () => updateBatteryInfo(b));
          b.addEventListener('chargingchange', () => updateBatteryInfo(b));
        })
        .catch(() => {
          setBatteryLevel(88);
        });
    } else {
      setBatteryLevel(88);
    }

    return () => {
      if (batteryObj) {
        try {
          batteryObj.removeEventListener('levelchange', () => updateBatteryInfo(batteryObj));
          batteryObj.removeEventListener('chargingchange', () => updateBatteryInfo(batteryObj));
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  const handleCategoryScroll = () => {
    if (!categoryScrollRef.current) return;
    const container = categoryScrollRef.current;
    const itemWidth = container.firstElementChild?.clientWidth || 280;
    const index = Math.round(container.scrollLeft / (itemWidth + 16));
    setActiveCategoryIndex(Math.min(Math.max(index, 0), TOOL_CATEGORIES.length - 1));
  };

  const handleToolScroll = () => {
    if (!toolScrollRef.current) return;
    const container = toolScrollRef.current;
    const itemWidth = container.firstElementChild?.clientWidth || 280;
    const index = Math.round(container.scrollLeft / (itemWidth + 16));
    setActiveToolIndex(index);
  };

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash.startsWith('#tool-')) {
        setSelectedToolId(window.location.hash.replace('#tool-', ''));
        setSelectedCategoryId(null);
      } else if (window.location.hash.startsWith('#category-')) {
        const cat = window.location.hash.replace('#category-', '');
        if (cat === 'downloader' || cat === 'canvas' || cat === 'stalker' || cat === 'maker') {
          setSelectedCategoryId(cat as any);
          setSelectedToolId(null);
        }
      } else {
        setSelectedToolId(null);
        setSelectedCategoryId(null);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [videoUrl, selectedToolId, selectedCategoryId]);

  const activeCategory = selectedCategoryId ? TOOL_CATEGORIES.find((c) => c.id === selectedCategoryId) : null;
  const activeTool = selectedToolId ? TOOLS_CONFIG.find((t) => t.id === selectedToolId) || null : null;

  return (
    <div className="w-full min-h-screen flex flex-col pb-32 select-none text-slate-100 overflow-x-hidden relative bg-black">
      {/* Clean Solid Black Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-black" />

      {/* HEADER BAR - CYBERPUNK TERMINAL */}
      <div className="w-full px-6 py-4 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-[#38BDF8]/20 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black border border-[#38BDF8]/30 flex items-center justify-center shrink-0">
             <svg className="w-6 h-6 text-[#38BDF8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
             </svg>
          </div>
          <h1 className="text-xl font-bold tracking-widest uppercase font-['Share_Tech_Mono'] text-[#38BDF8]">
            DAPP TOOLS
          </h1>
        </div>
      </div>

      {/* BANNER VIDEO TOOLS - BLUE CLAYMORPHISM & FRUTIGER AERO */}
      <div className="px-6 pt-6 max-w-2xl mx-auto w-full">
        <section
          aria-label="Banner Video Tools"
          className="w-full h-[200px] overflow-hidden bg-white/90 backdrop-blur-2xl border-[3px] border-blue-200/90 rounded-[36px] relative group shadow-[inset_0_2px_6px_rgba(255,255,255,0.9),0_12px_30px_rgba(37,99,235,0.2)]"
        >
          <div className="w-full h-full relative flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoUrl || DEFAULT_TOOLS_VIDEO_URL}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-900/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10 pointer-events-none" />

            <div className="absolute bottom-6 left-6 z-10 flex flex-col items-start gap-1.5 pointer-events-none">
              <h2
                className="text-3xl font-black tracking-tight uppercase leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                style={{
                  fontFamily: "'MADE Evolve Sans EVO', sans-serif",
                }}
              >
                DAPP PROJECT <br/> <span className="text-sky-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">TOOLS</span>
              </h2>
            </div>
          </div>
        </section>
      </div>

      {/* HEADER STATS CARD - CYBERPUNK DARK */}
      <div className="px-6 pt-4 max-w-2xl mx-auto w-full">
        <div className="bg-[#1E1E22] border border-[#38BDF8]/20 rounded-[20px] p-4 sm:p-5 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-3 gap-3 relative z-10">
            {/* 1. TOTAL TOOLS */}
            <div className="bg-[#1A1A1E] border border-[#38BDF8]/10 rounded-[20px] py-4 px-2 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-lg bg-[#26262A] border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] mb-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold text-[#E5E7EB] text-2xl leading-none font-['Share_Tech_Mono']">
                {TOOLS_CONFIG.length}
              </span>
              <span className="text-[10px] text-[#8B949E] font-bold uppercase tracking-widest mt-1">
                Tools
              </span>
            </div>

            {/* 2. SERVER STATUS */}
            <div className="bg-[#1A1A1E] border border-[#38BDF8]/10 rounded-[20px] py-4 px-2 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-lg bg-[#26262A] border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] mb-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="8" rx="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" />
                  <line x1="6" y1="6" x2="6" y2="6" />
                  <line x1="6" y1="18" x2="6" y2="18" />
                </svg>
              </div>
              <span className="font-bold text-emerald-400 text-[14px] leading-none font-['Share_Tech_Mono'] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
              <span className="text-[10px] text-[#8B949E] font-bold uppercase tracking-widest mt-1">
                Server
              </span>
            </div>

            {/* 3. STATUS (WAKTU) */}
            <div className="bg-[#1A1A1E] border border-[#38BDF8]/10 rounded-[20px] py-4 px-2 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-lg bg-[#26262A] border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] mb-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <span className="font-bold text-[#E5E7EB] text-2xl leading-none font-['Share_Tech_Mono']">
                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-[10px] text-[#8B949E] font-bold uppercase tracking-widest mt-1">
                Waktu
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: KATEGORI UTAMA (BLUE CLAYMORPHISM / FRUTIGER AERO) */}
      {!selectedCategoryId && (
        <div className="px-6 pt-8 max-w-2xl mx-auto w-full">
          <div className="bg-[#0A0A0A] rounded-[28px] border border-white/10 p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="text-xl font-black text-white tracking-tight uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                EXPLORE CATEGORIES
              </h3>
            </div>
            
            <div 
              ref={categoryScrollRef}
              onScroll={handleCategoryScroll}
              className="flex items-center gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory scroll-smooth"
            >
              {TOOL_CATEGORIES.map((cat, idx) => {
                const count = TOOLS_CONFIG.filter((t) => t.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setActiveModal(cat);
                    }}
                    className={`w-[280px] shrink-0 snap-center bg-[#1A1A1E] rounded-[20px] border border-cyan-500/20 p-6 flex flex-col items-start gap-4 cursor-pointer hover:bg-[#26262A] transition-all group relative overflow-hidden ${
                      activeCategoryIndex === idx ? 'scale-100 opacity-100 ring-1 ring-cyan-500' : 'scale-95 opacity-85'
                    }`}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <div className="scale-[2.5] text-blue-600">
                        {cat.iconSvg}
                      </div>
                    </div>
                    
                    <div className="w-14 h-14 rounded-lg bg-[#1A1A1E] border border-[#38BDF8]/30 text-[#38BDF8] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform [&>svg]:w-7 [&>svg]:h-7 [&>svg]:stroke-[2]">
                      {cat.iconSvg}
                    </div>

                    <div className="flex flex-col gap-1">
                      <h4 className="text-xl font-bold font-['Share_Tech_Mono'] text-[#38BDF8] leading-tight uppercase">
                        {cat.name}
                      </h4>
                      <p className="text-sm text-[#8B949E] font-bold font-['Share_Tech_Mono'] leading-tight line-clamp-2">
                        {cat.shortDesc}
                      </p>
                    </div>

                    <div className="mt-auto w-full flex items-center justify-between pt-4 border-t border-[#38BDF8]/10">
                      <span className="text-[11px] font-bold font-['Share_Tech_Mono'] text-[#38BDF8] bg-[#1A1A1E] px-3.5 py-1 rounded border border-[#38BDF8]/20">
                        {count} MODULES
                      </span>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-b from-blue-600 to-blue-800 text-white flex items-center justify-center shadow-[0_4px_10px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dots Indicator Below Categories */}
            <div className="flex items-center justify-center gap-2 pt-2 pb-2">
              {TOOL_CATEGORIES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (categoryScrollRef.current) {
                      const itemWidth = categoryScrollRef.current.firstElementChild?.clientWidth || 280;
                      categoryScrollRef.current.scrollTo({ left: idx * (itemWidth + 24), behavior: 'smooth' });
                    }
                  }}
                  className={`transition-all duration-300 cursor-pointer ${
                    activeCategoryIndex === idx
                      ? 'w-8 h-2.5 bg-white rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.2)]'
                      : 'w-2.5 h-2.5 bg-white/40 rounded-full hover:bg-white/70'
                  }`}
                  aria-label={`Category ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}


      
      {/* MODAL OVERLAY */}
      <ToolsModal
        category={activeModal}
        selectedTool={activeTool}
        onClose={() => {
          setActiveModal(null);
          setSelectedToolId(null);
        }}
        onSelectTool={(toolId) => setSelectedToolId(toolId)}
        onBackToCategory={() => setSelectedToolId(null)}
      />

    </div>
  );
};

