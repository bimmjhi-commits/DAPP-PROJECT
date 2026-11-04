import React, { useState } from 'react';
import { 
  Download, 
  Video, 
  PlayCircle, 
  Share2, 
  Sparkles, 
  Award, 
  QrCode, 
  Eraser, 
  Wand2, 
  Search, 
  BookOpen, 
  Layout, 
  MessageSquare, 
  Camera, 
  Smile, 
  Lock, 
  Terminal,
  Globe,
  X,
  Zap,
  ArrowLeft
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

interface ToolItem {
  title: string;
  sub: string;
  icon: React.ReactNode;
}

const TOOLS_LIST: ToolItem[] = [
  { title: "TIKTOK DL", sub: "No Watermark HD", icon: <Download className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "IG REELS DL", sub: "Instagram Media", icon: <Camera className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "YT DOWNLOADER", sub: "MP3 & MP4 4K", icon: <PlayCircle className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "FB VIDEO DL", sub: "High Quality Post", icon: <Share2 className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "TWITTER MEDIA", sub: "Save Tweet Clips", icon: <Globe className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "BRAT GENERATOR", sub: "Aesthetic Text Art", icon: <Sparkles className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "SERTIFIKAT TOLOL", sub: "Fun Certificate", icon: <Award className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "QR GENERATOR", sub: "Custom Barcode", icon: <QrCode className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "REMOVE BG", sub: "AI Cutout Tool", icon: <Eraser className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "AI ENHANCE", sub: "Photo Upscaler", icon: <Wand2 className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "IG STALKER", sub: "Profile Recon", icon: <Search className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "TIKTOK STALKER", sub: "Inspect Account", icon: <Search className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "TANYA USTADZ", sub: "Islamic Knowledge", icon: <BookOpen className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "WINDOWS QUOTES", sub: "Retro Dialogue", icon: <Layout className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "FAKE IG CHAT", sub: "DM Screen Mockup", icon: <MessageSquare className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "BRAT VIDEO", sub: "Green Screen Clip", icon: <Video className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "DISTRACTED BOY", sub: "Meme Generator", icon: <Smile className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "DOGE CHEEMS", sub: "Classic Meme Kit", icon: <Smile className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "SUB4UNLOCK", sub: "Shortlink Bypass", icon: <Lock className="w-5 h-5 text-[#00D4FF]" /> },
  { title: "OSINT RECON", sub: "Cyber Terminal", icon: <Terminal className="w-5 h-5 text-[#00D4FF]" /> },
];

export const ToolsPage: React.FC<ToolsPageProps> = ({ onBackToHome }) => {
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [execResult, setExecResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = () => {
    if (!inputVal.trim()) return;
    setLoading(true);
    setExecResult(null);
    setTimeout(() => {
      setLoading(false);
      setExecResult(`SUCCESS [200 OK]: Module ${selectedTool?.title} executed for target "${inputVal}". Secure tunnel established.`);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0D1B2A] text-white font-['Inter',sans-serif] selection:bg-[#00D4FF] selection:text-black pb-28 overflow-x-hidden">
      
      {/* 1. BACKGROUND IMAGE */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba')",
        }}
      />

      {/* 2. DARK OVERLAY #0D1B2A WITH 0.65 OPACITY */}
      <div className="fixed inset-0 z-[1] bg-[#0D1B2A]/65 pointer-events-none" />

      {/* 3. GLASS APP BAR */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-[12px] bg-transparent border-b border-white/10 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 cursor-pointer"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-bold uppercase tracking-[0.5px] text-white font-['MADE_Evolve_Sans_EVO','Space_Grotesk',sans-serif]">
            DAPP TOOLS
          </h1>
        </div>
        <span className="text-[10px] font-bold text-[#00D4FF] bg-[#00D4FF]/15 px-3 py-1 rounded-full border border-[#00D4FF]/30 uppercase tracking-widest font-['MADE_Evolve_Sans_EVO','Space_Grotesk',sans-serif]">
          GLASS EDITION
        </span>
      </header>

      {/* 4. MAIN CONTENT GRID (2 COLUMNS) */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {TOOLS_LIST.map((tool) => (
            <button
              key={tool.title}
              onClick={() => {
                setSelectedTool(tool);
                setInputVal('');
                setExecResult(null);
              }}
              className="group text-left relative overflow-hidden rounded-[24px] backdrop-blur-[20px] bg-white/[0.08] border border-white/15 p-3.5 sm:p-4 flex items-center gap-3 transition-all duration-200 hover:bg-white/[0.14] active:scale-[0.96] shadow-[0_8px_32px_rgba(0,0,0,0.3)] cursor-pointer"
            >
              {/* Light reflection gradient on top */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              {/* Icon Container with Accent Glow */}
              <div className="w-11 h-11 rounded-[16px] bg-[#00D4FF]/15 border border-[#00D4FF]/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,212,255,0.35)] group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>

              {/* Text Information */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[12.5px] font-bold text-white uppercase tracking-[0.5px] truncate font-['MADE_Evolve_Sans_EVO','Space_Grotesk',sans-serif] group-hover:text-[#00D4FF] transition-colors">
                  {tool.title}
                </h3>
                <p className="text-[10.5px] text-white/70 font-normal truncate mt-0.5 font-['Inter',sans-serif]">
                  {tool.sub}
                </p>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* 5. TOOL EXECUTION MODAL */}
      {selectedTool && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[24px] backdrop-blur-3xl bg-[#0D1B2A]/90 border border-[#00D4FF]/50 p-6 sm:p-7 shadow-[0_0_50px_rgba(0,212,255,0.35)] space-y-5 relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] font-['MADE_Evolve_Sans_EVO','Space_Grotesk',sans-serif]">
                EXECUTE MODULE // {selectedTool.title}
              </span>
              <button
                onClick={() => setSelectedTool(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold uppercase tracking-[0.5px] text-white font-['MADE_Evolve_Sans_EVO','Space_Grotesk',sans-serif] drop-shadow-[0_2px_10px_rgba(0,212,255,0.4)]">
                {selectedTool.title}
              </h2>
              <p className="text-xs text-white/70 font-normal font-['Inter',sans-serif]">
                {selectedTool.sub}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#00D4FF] font-['MADE_Evolve_Sans_EVO','Space_Grotesk',sans-serif]">
                Input Target / URL
              </label>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[#00D4FF]/40 text-white placeholder-white/40 font-mono text-xs focus:outline-none focus:border-[#00D4FF] focus:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"
              />
            </div>

            <button
              onClick={handleExecute}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#00D4FF] text-black font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,255,0.5)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-['MADE_Evolve_Sans_EVO','Space_Grotesk',sans-serif]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span className="text-black font-bold text-xs">PROCESSING...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-black" />
                  <span className="text-black font-bold text-xs">JALANKAN FITUR</span>
                </>
              )}
            </button>

            {execResult && (
              <div className="p-3.5 rounded-xl bg-black/70 border border-[#A6FF00]/50 text-[#A6FF00] font-mono text-[11px] space-y-1 shadow-[0_0_15px_rgba(166,255,0,0.2)]">
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
