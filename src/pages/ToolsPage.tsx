import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Sparkles, 
  X,
  ChevronRight,
  Code2,
  Brush,
  Award,
  BookOpen,
  Layout,
  Play,
  Grid,
  Video,
  Eye,
  Smile,
  Zap,
  Camera,
  Share2,
  Globe,
  Eraser,
  Wand2,
  Search
} from 'lucide-react';

export interface ToolsPageProps {
  initialCategoryId?: string | null;
  onBackToHome?: () => void;
  onOpenQuran?: () => void;
  onOpenSub4Unlock?: () => void;
  onOpenAiChat?: () => void;
  onOpenSpamNgl?: () => void;
  onOpenMusic?: () => void;
  onOpenMenu?: () => void;
}

interface MainModule {
  name: string;
  cat: string;
  icon: React.ReactNode;
  desc: string;
}

interface ToolTileItem {
  name: string;
  icon: React.ReactNode;
}

const MAIN_MODULES: MainModule[] = [
  { name: 'DOWNLOADER', cat: 'MEDIA TOOLS', icon: <Download className="w-10 h-10 text-[#00D4FF]" />, desc: 'High-speed media extraction for TikTok, IG, FB & YT.' },
  { name: 'CANVA', cat: 'DESIGN TOOLS', icon: <Brush className="w-10 h-10 text-[#00D4FF]" />, desc: 'AI-powered design templates, graphics & assets.' },
  { name: 'MAKER', cat: 'GENERATOR TOOLS', icon: <Sparkles className="w-10 h-10 text-[#00D4FF]" />, desc: 'Anonymous message senders, badges & text generators.' },
  { name: 'EDIT', cat: 'EDITOR TOOLS', icon: <Code2 className="w-10 h-10 text-[#00D4FF]" />, desc: 'Shortlink bypassers, URL decrypter & OSINT utilities.' },
  { name: 'STALKER', cat: 'RECON TOOLS', icon: <Eye className="w-10 h-10 text-[#00D4FF]" />, desc: 'Instagram & TikTok OSINT stalker utilities.' },
];

const TOOLS_DATA_MAP: Record<string, ToolTileItem[]> = {
  "DOWNLOADER": [
    { name: "TIKTOK DL", icon: <Download className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "IG DOWNLOADER", icon: <Camera className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "YT DOWNLOADER", icon: <Video className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "FB DOWNLOADER", icon: <Share2 className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "TWITTER DL", icon: <Globe className="w-5 h-5 text-[#00D4FF]" /> },
  ],
  "CANVA": [
    { name: "BRAT GENERATOR", icon: <Sparkles className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "SERTIFIKAT TOLOL", icon: <Award className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "BRAT VIDEO", icon: <Video className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "DISTRACTED BOY", icon: <Eye className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "DOGE CHEEMS", icon: <Smile className="w-5 h-5 text-[#00D4FF]" /> },
  ],
  "MAKER": [
    { name: "QR GENERATOR", icon: <Grid className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "FAKE IG", icon: <Play className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "TANYA USTADZ", icon: <BookOpen className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "WINDOWS QUOTES", icon: <Layout className="w-5 h-5 text-[#00D4FF]" /> },
  ],
  "EDIT": [
    { name: "REMOVE BG", icon: <Eraser className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "ENHANCE", icon: <Wand2 className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "UPSCALE", icon: <Zap className="w-5 h-5 text-[#00D4FF]" /> },
  ],
  "STALKER": [
    { name: "IG STALKER", icon: <Search className="w-5 h-5 text-[#00D4FF]" /> },
    { name: "TIKTOK STALKER", icon: <Eye className="w-5 h-5 text-[#00D4FF]" /> },
  ],
};

export const ToolsPage: React.FC<ToolsPageProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategoryModal, setActiveCategoryModal] = useState<string | null>(null);
  const [selectedToolDetail, setSelectedToolDetail] = useState<ToolTileItem | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [execResult, setExecResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollPosition = el.scrollLeft;
      const itemWidth = el.clientWidth * 0.85 + 16;
      const index = Math.round(scrollPosition / itemWidth);
      if (index >= 0 && index < MAIN_MODULES.length) {
        setCurrentIndex(index);
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const handleModuleTap = (categoryName: string) => {
    setActiveCategoryModal(categoryName.toUpperCase());
  };

  const handleToolTileClick = (tool: ToolTileItem) => {
    setActiveCategoryModal(null);
    setSelectedToolDetail(tool);
    setInputVal('');
    setExecResult(null);
  };

  const handleExecute = () => {
    if (!inputVal.trim()) return;
    setLoading(true);
    setExecResult(null);
    setTimeout(() => {
      setLoading(false);
      setExecResult(`SUCCESS [200 OK]: Module ${selectedToolDetail?.name} executed for target "${inputVal}". Secure tunnel established.`);
    }, 1200);
  };

  const activeCategoryTools = TOOLS_DATA_MAP[activeCategoryModal || "DOWNLOADER"] || TOOLS_DATA_MAP["DOWNLOADER"];

  return (
    <div className="min-h-screen w-full bg-[#080A12] text-white font-sans relative overflow-x-hidden selection:bg-[#00D4FF] selection:text-black pb-32">
      
      {/* 1. VIDEO BANNER ATAS (180px, edge-to-edge, rounded bottom) */}
      <div className="relative w-full h-[180px] overflow-hidden rounded-b-[20px] shadow-[0_10px_25px_rgba(0,212,255,0.15)] border-b border-[#00D4FF]/20">
        <video
          src="https://videotourl.com/videos/1792571166324-35e29e7c-7c55-435b-9ae8-faf0e0d21b18.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter brightness-90 contrast-125"
        />
        {/* Overlay gradient from bottom 0.7 to top transparent */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A12]/90 via-[#080A12]/40 to-transparent" />

        {/* Text ALL TOOLS di Kiri Bawah */}
        <div className="absolute left-4 bottom-4 z-20 space-y-0.5">
          <h1 className="text-[22px] font-extrabold uppercase tracking-[1.5px] text-white font-['Orbitron',sans-serif] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            ALL TOOLS
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[3px] text-[#00D4FF] opacity-80 drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)]">
            DAPP PROJECT
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 space-y-6 relative z-10">
        
        {/* 2. 2 KOTAK INFO (KIRI: TOTAL MODULES, KANAN: PROTEKSI KEAMANAN DENGAN 🛡️ & AKTIF) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Kotak Kiri (TOTAL) */}
          <div className="h-[110px] rounded-[20px] backdrop-blur-[20px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] p-4 flex flex-col items-center justify-center text-center shadow-[0_0_20px_rgba(0,0,0,0.4)]">
            <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#00D4FF]">
              TOTAL MODULES
            </span>
            <div className="text-[36px] font-extrabold text-white tracking-tight leading-tight font-['Orbitron',sans-serif] my-0.5">
              {MAIN_MODULES.length}
            </div>
            <span className="text-[10px] font-medium text-[#8A8D9E] uppercase tracking-wider">
              ACTIVE MODULES
            </span>
          </div>

          {/* Kotak Kanan (PROTEKSI KEAMANAN) */}
          <div className="h-[110px] rounded-[20px] backdrop-blur-[20px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] p-3 flex flex-col items-center justify-center text-center shadow-[0_0_20px_rgba(0,0,0,0.4)]">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#00D4FF]">
              PROTEKSI KEAMANAN
            </span>
            <div className="flex items-center justify-center gap-1.5 my-0.5">
              <span className="text-[20px]">🛡️</span>
              <span className="text-[18px] font-extrabold text-[#A6FF00] tracking-tight leading-none font-['Orbitron',sans-serif]">
                AKTIF
              </span>
            </div>
            <span className="text-[10px] font-medium text-[#8A8D9E] uppercase tracking-wider">
              100% • AMAN
            </span>
          </div>
        </div>

        {/* 3. MAIN CATEGORIES CAROUSEL WITH BRIGHT BACKGROUND CONTAINER & CYBER GRID */}
        <div className="space-y-3 pt-2">
          <div className="px-1">
            <h3 className="text-[11px] font-black uppercase tracking-[2px] text-[#00D4FF] drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">
              MAIN CATEGORIES
            </h3>
          </div>

          {/* Brighter Container Background */}
          <div className="relative w-full py-4 overflow-hidden rounded-[28px] bg-[#1E1E2F]/92 border border-[#00D4FF]/15 shadow-2xl">
            {/* Cyber Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,212,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,212,255,0.09)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
            
            {/* Glow Orbs */}
            <div className="absolute top-[-30px] left-[-30px] w-[260px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.28)_0%,transparent_70%)] blur-[40px] pointer-events-none" />
            <div className="absolute bottom-[-20px] right-[-20px] w-[180px] h-[180px] rounded-full bg-[radial-gradient(circle,rgba(166,255,0,0.20)_0%,transparent_70%)] blur-[40px] pointer-events-none" />

            {/* Carousel PageView */}
            <div 
              ref={containerRef}
              className="relative z-10 flex items-center gap-4 overflow-x-auto pb-8 pt-4 px-6 snap-x snap-mandatory no-scrollbar scroll-smooth"
              style={{ clipPath: 'inset(-50px 0px -50px 0px)' }}
            >
              {MAIN_MODULES.map((mod, index) => {
                const isCenter = currentIndex === index;
                const scale = isCenter ? 1.0 : 0.88;
                const opacity = isCenter ? 1.0 : 0.65;

                return (
                  <div
                    key={mod.name}
                    onClick={() => handleModuleTap(mod.name)}
                    style={{
                      transform: `scale(${scale})`,
                      opacity: opacity,
                      transition: 'transform 350ms cubic-bezier(0, 0, 0.2, 1), opacity 350ms cubic-bezier(0, 0, 0.2, 1)',
                    }}
                    className={`shrink-0 w-[85%] sm:w-[380px] h-[320px] snap-center rounded-[28px] p-6 flex flex-col items-center justify-center cursor-pointer relative group ${
                      isCenter
                        ? 'bg-[rgba(22,26,40,0.92)] border-[1.8px] border-[#00D4FF] shadow-[0_0_25px_rgba(0,212,255,0.35)]'
                        : 'bg-[rgba(22,26,40,0.75)] border border-white/10 my-5'
                    }`}
                  >
                    <div className="w-[80px] h-[80px] rounded-[20px] bg-[rgba(0,212,255,0.15)] border border-[#00D4FF]/30 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(0,212,255,0.25)] group-hover:scale-110 transition-transform">
                      {mod.icon}
                    </div>

                    <h3 className="text-[18px] font-extrabold text-white text-center uppercase tracking-[0.5px] font-['Orbitron',sans-serif]">
                      {mod.name}
                    </h3>
                    
                    <span className="text-[11px] text-[#00D4FF] uppercase tracking-[2px] mt-1.5">
                      {mod.cat}
                    </span>

                    <p className="text-xs text-[#8A8D9E] text-center mt-3 max-w-xs leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* 4. FULL WIDTH BOTTOM SHEET MODAL (SELECT TOOLS - SLIDE UP FROM BOTTOM) */}
      {activeCategoryModal && (
        <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-[10px] flex items-end justify-center p-0 animate-in fade-in duration-300">
          <div className="w-full h-[85vh] bg-[#1E2A3A] rounded-t-[28px] border-t border-[#00D4FF]/22 p-5 flex flex-col shadow-[0_-10px_40px_rgba(0,212,255,0.25)] animate-in slide-in-from-bottom duration-300">
            
            {/* Handle bar */}
            <div className="w-10 h-1 bg-white/24 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] px-1">
              <span className="text-[12px] font-bold uppercase tracking-[2.2px] text-[#00D4FF] font-['Orbitron',sans-serif]">
                SELECT TOOLS - {activeCategoryModal}
              </span>
              <button
                onClick={() => setActiveCategoryModal(null)}
                className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List Tools */}
            <div className="flex-1 overflow-y-auto space-y-3 px-1 py-1 no-scrollbar">
              {activeCategoryTools.map((tool) => (
                <div
                  key={tool.name}
                  onClick={() => handleToolTileClick(tool)}
                  className="h-[64px] rounded-[16px] bg-[#2A3548] border border-white/[0.04] px-4 flex items-center justify-between hover:border-[#00D4FF]/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-[44px] h-[44px] rounded-[12px] bg-[#1E2A3A] border border-[#00D4FF]/20 flex items-center justify-center shrink-0">
                      {tool.icon}
                    </div>
                    <span className="text-[12.5px] font-bold uppercase text-white tracking-[0.3px] group-hover:text-[#00D4FF] transition-colors font-['Orbitron',sans-serif]">
                      {tool.name}
                    </span>
                  </div>

                  <ChevronRight className="w-5 h-5 text-white/24 group-hover:text-[#00D4FF] transition-colors" />
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* 5. TOOL EXECUTION MODAL */}
      {selectedToolDetail && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-[20px] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-[24px] backdrop-blur-[25px] bg-[rgba(15,18,30,0.95)] border border-[#00D4FF]/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,212,255,0.3)] space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF]">
                SECURE TUNNEL // {selectedToolDetail.name}
              </span>
              <button
                onClick={() => setSelectedToolDetail(null)}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-['Orbitron',sans-serif]">
                {selectedToolDetail.name}
              </h2>
              <p className="text-xs text-[#8A8D9E] font-medium leading-relaxed">
                Execute module with secure token and API parameters.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#00D4FF]">
                Target URL / Query Parameter
              </label>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-[#00D4FF]/30 text-white placeholder-zinc-600 font-mono text-xs focus:outline-none focus:border-[#00D4FF] focus:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"
              />
            </div>

            <button
              onClick={handleExecute}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#2A5CFF] text-black font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span className="text-black font-bold">ESTABLISHING TUNNEL...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-black" />
                  <span className="text-black font-black">EXECUTE MODULE</span>
                </>
              )}
            </button>

            {execResult && (
              <div className="p-4 rounded-xl bg-black/60 border border-[#A6FF00]/40 text-[#A6FF00] font-mono text-[11px] space-y-1 shadow-[0_0_15px_rgba(166,255,0,0.15)]">
                <div className="font-bold uppercase tracking-widest text-[#A6FF00]">
                  [SYSTEM 200 OK]
                </div>
                <p className="leading-relaxed">{execResult}</p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default ToolsPage;
