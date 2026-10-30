import React, { useRef, useState, useEffect } from 'react';
import { ToolDef } from './ToolDetailView';
import { ToolsHeaderWidgets } from './ToolsHeaderWidgets';
import { AiODownloaderPage } from './AiODownloaderPage';
import { 
  Download, 
  ArrowLeft, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  Sparkles,
  AlertCircle,
  X,
  Search,
  Music,
  Video,
  FileText,
  MapPin,
  Smile,
  ShieldCheck
} from 'lucide-react';
import gtrBannerImg from '../assets/images/gtr_nissan_banner_1793369620891.jpg';

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
  initialCategoryId?: 'downloader' | 'canvas' | 'stalker' | 'maker' | null;
  onBackToHome?: () => void;
  onOpenToolsBottomSheet?: () => void;
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
    shortDesc: 'TikTok, Instagram, YouTube, X, Spotify',
    badge: 'MEDIA',
    iconSvg: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
      <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: 'stalker',
    name: 'STALKER',
    shortDesc: 'IP Tracker, Profile Info, NGL Lookup',
    badge: 'INTEL',
    iconSvg: (
      <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
      <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

export const TOOLS_CONFIG: CustomIconToolDef[] = [
  // 1. DOWNLOADER CATEGORY
  {
    id: 'aio',
    category: 'downloader',
    name: 'TikTok Downloader (AIO)',
    shortName: 'TIKTOK',
    cardTitle: 'TikTok Video Downloader',
    cardDesc: 'Download TikTok Tanpa Watermark, HD 1080p, dan MP3 Audio',
    badge: 'CYBER-PRO',
    emoji: '📥',
    type: 'downloader',
    endpoint: '/api/download/aio',
    defaultParams: { url: '' },
    paramLabels: { url: 'PASTE VIDEO URL' },
    description: 'TikTok Video Downloader • Premium Cyberpunk Engine',
    iconSvg: <Download className="w-6 h-6 text-cyan-400" />,
  },
  {
    id: 'instagram',
    category: 'downloader',
    name: 'Instagram Downloader',
    shortName: 'INSTAGRAM',
    cardTitle: 'Instagram Reels & Video',
    cardDesc: 'Unduh Reels, Post Video, & Konten Instagram',
    badge: 'IG-PRO',
    emoji: '📸',
    type: 'downloader',
    endpoint: '/api/download/aio',
    defaultParams: { url: '' },
    paramLabels: { url: 'PASTE LINK INSTAGRAM' },
    description: 'Instagram Media Downloader • Fast Extraction',
    iconSvg: <Video className="w-6 h-6 text-pink-400" />,
  },
  {
    id: 'youtube',
    category: 'downloader',
    name: 'YouTube Shorts & Video',
    shortName: 'YOUTUBE',
    cardTitle: 'YouTube Downloader',
    cardDesc: 'Download Video Shorts & MP4 Kualitas HD',
    badge: 'YT-FAST',
    emoji: '▶️',
    type: 'downloader',
    endpoint: '/api/download/aio',
    defaultParams: { url: '' },
    paramLabels: { url: 'PASTE LINK YOUTUBE' },
    description: 'YouTube Video & Shorts Downloader',
    iconSvg: <Video className="w-6 h-6 text-red-400" />,
  },
  {
    id: 'spotify',
    category: 'downloader',
    name: 'Spotify MP3 Downloader',
    shortName: 'SPOTIFY',
    cardTitle: 'Spotify Downloader',
    cardDesc: 'Download Lagu Spotify & Audio ke Format MP3',
    badge: 'AUDIO',
    emoji: '🎵',
    type: 'downloader',
    endpoint: '/api/download/aio',
    defaultParams: { url: '' },
    paramLabels: { url: 'PASTE LINK TRACK SPOTIFY' },
    description: 'Spotify Music Audio Extractor',
    iconSvg: <Music className="w-6 h-6 text-emerald-400" />,
  },

  // 2. CANVAS CATEGORY
  {
    id: 'dana-struk',
    category: 'canvas',
    name: 'Struk DANA Generator',
    shortName: 'DANA',
    cardTitle: 'Struk Transaksi DANA',
    cardDesc: 'Buat Bukti Transfer DANA Kustom untuk Portofolio',
    badge: 'CANVAS',
    emoji: '🧾',
    type: 'canvas',
    endpoint: '/api/canvas/dana',
    defaultParams: { nominal: '50000', sender: 'Budi Santoso' },
    paramLabels: { nominal: 'NOMINAL TRANSFER', sender: 'NAMA PENGIRIM' },
    description: 'Generator Struk Transaksi DANA Indonesia',
    iconSvg: <FileText className="w-6 h-6 text-cyan-400" />,
  },
  {
    id: 'gopay-struk',
    category: 'canvas',
    name: 'Struk GoPay Generator',
    shortName: 'GOPAY',
    cardTitle: 'Struk Transaksi GoPay',
    cardDesc: 'Mockup Transaksi GoPay Digital',
    badge: 'CANVAS',
    emoji: '💳',
    type: 'canvas',
    endpoint: '/api/canvas/gopay',
    defaultParams: { nominal: '100000', sender: 'Siti Aminah' },
    paramLabels: { nominal: 'NOMINAL (RP)', sender: 'NAMA TUJUAN' },
    description: 'Generator Bukti Kirim Uang GoPay',
    iconSvg: <FileText className="w-6 h-6 text-blue-400" />,
  },

  // 3. STALKER CATEGORY
  {
    id: 'ip-lookup',
    category: 'stalker',
    name: 'IP Tracker & Geo Lookup',
    shortName: 'IP TRACKER',
    cardTitle: 'IP Address Tracker',
    cardDesc: 'Lacak Lokasi, ASN, ISP, dan Koordinat IP Address',
    badge: 'INTEL',
    emoji: '🌐',
    type: 'downloader',
    endpoint: '/api/stalk/ip',
    defaultParams: { ip: '' },
    paramLabels: { ip: 'MASUKKAN ALAMAT IP' },
    description: 'IP Geolocation & Threat Intelligence Lookup',
    iconSvg: <MapPin className="w-6 h-6 text-amber-400" />,
  },

  // 4. MAKER CATEGORY
  {
    id: 'brat',
    category: 'maker',
    name: 'Brat Meme Generator',
    shortName: 'BRAT',
    cardTitle: 'Brat Text Maker',
    cardDesc: 'Bikin Teks Bergaya Hijau Brat Populer',
    badge: 'VIRAL',
    emoji: '🟩',
    type: 'canvas',
    endpoint: '/api/canvas/brat',
    defaultParams: { text: 'dapp tools v1' },
    paramLabels: { text: 'TEKS BRAT' },
    description: 'Viral Brat Album Text Generator',
    iconSvg: <Smile className="w-6 h-6 text-lime-400" />,
  },
];

export const ToolsMainPage: React.FC<ToolsMainPageProps> = ({
  videoUrl = DEFAULT_TOOLS_VIDEO_URL,
  initialCategoryId = null,
  onBackToHome,
  onOpenIpLookup,
  onOpenToolsBottomSheet,
}) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | null>(() => {
    if (initialCategoryId) {
      return TOOL_CATEGORIES.find((c) => c.id === initialCategoryId) || null;
    }
    return null;
  });

  const [activeTool, setActiveTool] = useState<CustomIconToolDef | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sync initialCategoryId if changed from parent
  useEffect(() => {
    if (initialCategoryId) {
      const match = TOOL_CATEGORIES.find((c) => c.id === initialCategoryId);
      if (match) {
        setActiveCategory(match);
        setActiveTool(null);
      }
    }
  }, [initialCategoryId]);

  // States for Tool Execution
  const [params, setParams] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);
  const [downloadResult, setDownloadResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (activeTool) {
      setParams({ ...activeTool.defaultParams });
      setGeneratedImgUrl(null);
      setDownloadResult(null);
      setErrorMsg(null);
    }
  }, [activeTool]);

  const handleOpenCategory = (cat: ToolCategory) => {
    setActiveCategory(cat);
    setActiveTool(null);
  };

  const handleSelectTool = (toolId: string) => {
    if (toolId === 'ip-lookup' && onOpenIpLookup) {
      onOpenIpLookup();
      return;
    }
    const tool = TOOLS_CONFIG.find((t) => t.id === toolId);
    if (tool) setActiveTool(tool);
  };

  const handleBackToCategory = () => {
    setActiveTool(null);
    setDownloadResult(null);
    setGeneratedImgUrl(null);
    setErrorMsg(null);
  };

  const handleResetOrBack = () => {
    if (activeTool) {
      setActiveTool(null);
      return;
    }
    if (activeCategory) {
      setActiveCategory(null);
      if (onBackToHome) onBackToHome();
      return;
    }
    if (onBackToHome) {
      onBackToHome();
    }
  };

  const buildApiUrl = () => {
    if (!activeTool) return '';
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const url = new URL(activeTool.endpoint, base);
    Object.entries(params).forEach(([key, val]) => {
      url.searchParams.set(key, val);
    });
    url.searchParams.set('apikey', 'sylva-b1e3079e86a92e12a2d71afef8d775ec');
    return url.toString();
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTool) return;
    setLoading(true);
    setErrorMsg(null);
    setGeneratedImgUrl(null);
    setDownloadResult(null);

    const fullUrl = buildApiUrl();

    try {
      if (activeTool.type === 'canvas') {
        const res = await fetch(fullUrl);
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.message || 'Gagal memproses gambar.');
        }
        const blob = await res.blob();
        if (blob.type.includes('json')) {
          const text = await blob.text();
          const json = JSON.parse(text);
          if (json.status === false) throw new Error(json.message || 'Gagal.');
        }
        const objUrl = URL.createObjectURL(blob);
        setGeneratedImgUrl(objUrl);
      } else {
        const res = await fetch(fullUrl);
        const data = await res.json();

        console.log('Downloader API Response:', data);

        if (data.status === true && data.result && data.result.success === false) {
          throw new Error(data.result.error || data.result.message || 'Gagal mengekstrak media.');
        }

        if (!res.ok || data.status === false) {
          throw new Error(data.message || 'Gagal mengunduh media.');
        }

        const extracted = data.result || data.data || data;
        setDownloadResult(extracted);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menghubungi API.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async (paramKey: string) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setParams((prev) => ({ ...prev, [paramKey]: text }));
    } catch {}
  };

  // 1. IF AIO DOWNLOADER TOOL IS ACTIVE:
  // Render the Cyberpunk AIO page with the working video preview and download buttons
  if (activeTool && activeTool.id === 'aio') {
    return <AiODownloaderPage onBack={handleBackToCategory} />;
  }

  const currentCategoryTools = activeCategory
    ? TOOLS_CONFIG.filter((t) => t.category === activeCategory.id)
    : [];

  return (
    <div className="w-full min-h-screen bg-[#0A0E14] text-white pb-32 flex flex-col selection:bg-cyan-500 selection:text-black font-sans">
      {/* Top Header Bar */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#1E2F47] sticky top-0 bg-[#0A0E14]/90 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetOrBack}
            className="w-9 h-9 rounded-xl bg-[#1A2332] border border-[#2A3A4D] hover:border-cyan-400/50 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-all cursor-pointer active:scale-95"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h1 className="text-base font-black font-orbitron tracking-widest uppercase text-cyan-400 drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">
              {activeTool ? activeTool.shortName : activeCategory ? activeCategory.name : 'DAPP TOOLS'}
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">
              {activeCategory ? activeCategory.shortDesc : 'Pusat Tools All-in-One'}
            </p>
          </div>
        </div>

        {onOpenToolsBottomSheet && (
          <button
            type="button"
            onClick={onOpenToolsBottomSheet}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-orbitron font-bold text-cyan-300 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,212,255,0.2)] hover:bg-cyan-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>DRAWER</span>
            <span className="text-xs">↑</span>
          </button>
        )}
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full space-y-6">
        
        {/* VIEW 1: HOME OVERVIEW (When neither category nor tool is active) */}
        {!activeCategory && !activeTool && (
          <>
            <section aria-label="System Stats">
              <ToolsHeaderWidgets totalToolsCount={TOOLS_CONFIG.length} />
            </section>

            {/* Banner GTR */}
            <div className="w-full h-44 rounded-[28px] overflow-hidden border border-[#24344D] relative shadow-2xl group">
              <img
                src={gtrBannerImg}
                alt="Nissan GT-R Banner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E14] via-[#0A0E14]/30 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="text-[9px] font-black font-orbitron text-cyan-400 tracking-[0.3em] uppercase block mb-1">
                  PLATFORM STATUS: ONLINE
                </span>
                <h2 className="text-2xl font-black font-orbitron text-white uppercase tracking-tight leading-none">
                  EXPLORE FEATURES
                </h2>
              </div>
            </div>

            {/* 2x2 Category Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  PILIH KATEGORI
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  4 MODUL
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {TOOL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleOpenCategory(cat)}
                    className="bg-[#121E2F] border border-[#1E2F47] hover:border-cyan-500/40 p-5 rounded-[22px] flex flex-col items-start gap-3.5 active:scale-95 transition-all hover:bg-[#16273E] group shadow-lg text-left cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-[14px] bg-[#0A121E] border border-white/5 text-cyan-400 flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
                      {cat.iconSvg}
                    </div>
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-black font-orbitron tracking-wide text-white uppercase block group-hover:text-cyan-300 transition-colors">
                          {cat.name}
                        </span>
                        <span className="text-[8px] font-bold text-cyan-400/80 uppercase px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/40">
                          {cat.badge}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 block mt-1 truncate">
                        {cat.shortDesc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: CATEGORY TOOL LIST (e.g. DOWNLOADER list) */}
        {activeCategory && !activeTool && (
          <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-[#121E2F] border border-[#1E2F47] rounded-[24px] p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black font-orbitron text-cyan-400 tracking-[0.25em] uppercase block mb-1">
                  KATEGORI AKTIF
                </span>
                <h2 className="text-xl font-black font-orbitron text-white uppercase tracking-wider">
                  {activeCategory.name}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {activeCategory.shortDesc}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#0A121E] border border-cyan-500/20 flex items-center justify-center shadow-inner">
                {activeCategory.iconSvg}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  DAFTAR TOOLS TERSEDIA
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {currentCategoryTools.length} Tools
                </span>
              </div>

              {currentCategoryTools.length === 0 ? (
                <div className="bg-[#121E2F] border border-[#1E2F47] rounded-3xl p-10 text-center space-y-4 shadow-xl">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">
                      SEGERA HADIR
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Tools untuk kategori {activeCategory.name} sedang dalam proses integrasi.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {currentCategoryTools.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleSelectTool(tool.id)}
                      className="w-full flex items-center gap-4 bg-[#121E2F] hover:bg-[#18283E] p-4.5 rounded-[20px] transition-all border border-[#1E2F47] hover:border-cyan-500/40 active:scale-[0.98] text-left cursor-pointer group shadow-sm"
                    >
                      <div className="w-12 h-12 shrink-0 bg-[#0A121E] border border-white/5 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shadow-inner">
                        {tool.iconSvg}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-black font-orbitron tracking-wide uppercase truncate group-hover:text-cyan-300 transition-colors">
                            {tool.name}
                          </span>
                          {tool.badge && (
                            <span className="text-[8px] font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 shrink-0">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium block mt-0.5 truncate">
                          {tool.cardDesc}
                        </span>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0">
                        <span className="text-lg">›</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: GENERIC TOOL EXECUTION FORM (For non-AIO tools) */}
        {activeTool && activeTool.id !== 'aio' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-400">
            <div className="bg-[#121E2F] rounded-[28px] p-6 border border-[#1E2F47] shadow-2xl relative overflow-hidden space-y-6">
              <div className="space-y-1.5 border-b border-white/5 pb-4">
                <span className="text-[9px] font-black font-orbitron text-cyan-400 tracking-[0.25em] uppercase">
                  MODUL EKSEKUSI
                </span>
                <h3 className="text-xl font-black font-orbitron text-white uppercase tracking-tight">
                  {activeTool.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  {activeTool.description}
                </p>
              </div>

              <form onSubmit={handleExecute} className="space-y-5">
                <div className="space-y-4">
                  {Object.keys(activeTool.defaultParams).map((key) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-bold font-orbitron text-cyan-400/80 uppercase tracking-widest">
                          {activeTool.paramLabels[key] || key}
                        </label>
                        {key.toLowerCase().includes('url') && (
                          <button
                            type="button"
                            onClick={() => handlePaste(key)}
                            className="text-[9px] font-bold text-cyan-400/80 hover:text-cyan-300 flex items-center gap-1.5 transition-colors bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20"
                          >
                            <Copy className="w-3 h-3" /> PASTE LINK
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={params[key] || ''}
                          onChange={(e) => setParams({ ...params, [key]: e.target.value })}
                          placeholder={`MASUKKAN ${activeTool.paramLabels[key] || key}...`}
                          className="w-full bg-[#0A121E] border border-[#1E2F47] rounded-xl px-4 py-3.5 text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,212,255,0.2)] transition-all shadow-inner"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {!loading && (
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs font-orbitron uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.35)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>BUKA TOOL</span>
                  </button>
                )}
              </form>

              {loading && (
                <div className="flex flex-col items-center justify-center space-y-3 py-8 animate-pulse">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <p className="text-[10px] font-black font-orbitron text-cyan-400 tracking-[0.3em] uppercase">
                    MEMPROSES PERMINTAAN...
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300 font-medium leading-relaxed">{errorMsg}</p>
                </div>
              )}

              {!loading && generatedImgUrl && (
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div className="w-full bg-black/40 rounded-2xl p-2.5 border border-white/10">
                    <img src={generatedImgUrl} alt="Hasil" className="w-full h-auto rounded-xl shadow-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={generatedImgUrl}
                      download="hasil_canvas.png"
                      className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg active:scale-95 uppercase tracking-wider"
                    >
                      <Download className="w-4 h-4" /> SIMPAN
                    </a>
                    <a
                      href={generatedImgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 py-3 bg-white/10 text-white font-bold text-xs rounded-xl active:scale-95 uppercase tracking-wider border border-white/10"
                    >
                      <ExternalLink className="w-4 h-4" /> LIHAT HD
                    </a>
                  </div>
                </div>
              )}

              {!loading && downloadResult && (
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <p className="text-[10px] font-black font-orbitron text-cyan-400 uppercase tracking-wider">
                    HASIL PENGAMBILAN DATA
                  </p>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200">
                    <p className="font-bold text-sm text-white mb-1">
                      {downloadResult.title || downloadResult.desc || 'Media Berhasil Diambil'}
                    </p>
                    {downloadResult.author && (
                      <p className="text-slate-400">Creator: {typeof downloadResult.author === 'string' ? downloadResult.author : downloadResult.author.name}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
