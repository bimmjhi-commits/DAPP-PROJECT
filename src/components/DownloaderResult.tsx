import React, { useState, useRef } from 'react';
import { 
  Download, 
  Play, 
  Pause, 
  Music, 
  Video, 
  CheckCircle2, 
  Heart, 
  Clock, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface DownloadLinkItem {
  id?: string;
  kind?: 'video' | 'audio' | 'image';
  label: string;
  quality?: string;
  ext?: string;
  url: string;
  hasWatermark?: boolean;
  description?: string;
}

export interface DownloaderResultData {
  title?: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  audioUrl?: string;
  duration?: string | number;
  platform?: string;
  author?: {
    name?: string;
    username?: string;
    avatarUrl?: string;
    verified?: boolean;
  };
  stats?: {
    likes?: string | number;
    views?: string | number;
    shares?: string | number;
    comments?: string | number;
  };
  hd1080Url?: string;
  hd720Url?: string;
  mp3Url?: string;
  downloadLinks?: DownloadLinkItem[];
}

interface DownloaderResultProps {
  loading: boolean;
  result: DownloaderResultData | null;
  error?: string | null;
}

export const DownloaderResult: React.FC<DownloaderResultProps> = ({
  loading,
  result,
  error,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const formatDuration = (d?: string | number) => {
    if (!d) return '00:21';
    if (typeof d === 'string' && d.includes(':')) return d;
    const num = Number(d);
    if (isNaN(num)) return String(d);
    const m = Math.floor(num / 60).toString().padStart(2, '0');
    const s = Math.floor(num % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 1. LOADING STATE: SKELETON SHIMMER
  if (loading) {
    return (
      <div className="w-full bg-[#1A2332]/80 backdrop-blur-md border border-[#2A3A4D] rounded-[24px] p-6 shadow-2xl space-y-5 animate-pulse">
        {/* Shimmer 16:9 Video Box */}
        <div className="w-full aspect-video rounded-[20px] bg-slate-800/60 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
          <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center text-cyan-400/40">
            <Play className="w-6 h-6 ml-0.5" />
          </div>
        </div>

        {/* Shimmer Lines */}
        <div className="space-y-3 pt-1">
          <div className="h-5 bg-slate-800/80 rounded-md w-3/4" />
          <div className="h-3.5 bg-slate-800/50 rounded-md w-1/2" />
        </div>

        {/* Shimmer Author Row */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800" />
            <div className="space-y-1.5">
              <div className="h-3 bg-slate-800 rounded w-20" />
              <div className="h-2.5 bg-slate-800/60 rounded w-16" />
            </div>
          </div>
          <div className="h-4 bg-slate-800 rounded w-16" />
        </div>

        {/* Shimmer Download Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <div className="h-28 bg-slate-800/40 rounded-2xl" />
          <div className="space-y-2.5">
            <div className="h-12 bg-slate-800/40 rounded-xl" />
            <div className="h-12 bg-slate-800/40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-red-950/40 backdrop-blur-md border border-red-500/30 rounded-[24px] p-6 shadow-2xl text-center space-y-2"
      >
        <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <span className="text-xl font-bold">!</span>
        </div>
        <h4 className="text-sm font-bold text-red-300 font-orbitron tracking-wider uppercase">
          DOWNLOAD GAGAL
        </h4>
        <p className="text-xs text-red-200/80 leading-relaxed max-w-md mx-auto">
          {error}
        </p>
      </motion.div>
    );
  }

  // 2. EMPTY STATE
  if (!result) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-[#1A2332]/60 backdrop-blur-md border border-[#2A3A4D] rounded-[24px] p-10 shadow-2xl flex flex-col items-center justify-center text-center space-y-4"
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-[#0F1A26] border border-cyan-500/20 shadow-[0_0_25px_rgba(0,212,255,0.15)] flex items-center justify-center text-cyan-400">
            <Download className="w-9 h-9 animate-bounce text-cyan-400 drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-cyan-400 rounded-full animate-ping opacity-60" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-base font-black text-white font-orbitron tracking-wider uppercase drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]">
            READY TO DOWNLOAD
          </h3>
          <p className="text-xs font-medium text-slate-400 tracking-wide">
            Paste link to start downloading video without watermark
          </p>
        </div>
      </motion.div>
    );
  }

  // 3. SUCCESS STATE (REFERENSI CYBERPUNK)
  const videoSrc = result.videoUrl || result.hd1080Url || result.hd720Url || '';
  const main1080Link = result.hd1080Url || videoSrc;
  const main720Link = result.hd720Url || videoSrc;
  const mainMp3Link = result.mp3Url || result.audioUrl || '';
  const authorName = result.author?.name || 'TikTok Creator';
  const authorUser = result.author?.username ? (result.author.username.startsWith('@') ? result.author.username : `@${result.author.username}`) : '@creator';
  const authorAvatar = result.author?.avatarUrl || result.thumbnail || '';
  const likesCount = result.stats?.likes || '5.4K';
  const durationText = formatDuration(result.duration);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full bg-[#1A2332]/90 backdrop-blur-xl border border-cyan-500/30 rounded-[24px] p-5 sm:p-6 shadow-[0_0_35px_rgba(0,212,255,0.12)] space-y-5 relative overflow-hidden"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* VIDEO CONTAINER 16:9 */}
      <div 
        onClick={togglePlay}
        className="w-full aspect-video rounded-[20px] bg-[#0A0E14] border border-[#2A3A4D] overflow-hidden relative group cursor-pointer shadow-inner"
      >
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={result.thumbnail}
            controls={isPlaying}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-contain bg-black"
          />
        ) : result.thumbnail ? (
          <img 
            src={result.thumbnail} 
            alt={result.title || 'Thumbnail'} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
            <Video className="w-12 h-12 text-cyan-400/40" />
          </div>
        )}

        {/* Play Button Overlay (when not playing) */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center group-hover:bg-black/25 transition-all">
            <div className="w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.7)] group-hover:scale-110 group-active:scale-95 transition-transform">
              <Play className="w-6 h-6 ml-1 fill-black" />
            </div>
          </div>
        )}

        {/* Badge Durasi (Kanan Bawah) */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono font-bold flex items-center gap-1 shadow-md pointer-events-none">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span>{durationText}</span>
        </div>
      </div>

      {/* TITLE & DESCRIPTION */}
      <div className="space-y-1.5 pt-1">
        <h3 className="text-base sm:text-lg font-black text-white leading-snug tracking-wide select-text">
          {result.title || 'Cyberpunk City Night Ride #fyp'}
        </h3>
        {result.description && (
          <p className="text-xs text-slate-400 line-clamp-2 select-text leading-relaxed">
            {result.description}
          </p>
        )}
      </div>

      {/* ROW AUTHOR: avatar bulat + @username + verified + likes */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border-2 border-cyan-500/40 shrink-0 shadow-[0_0_10px_rgba(0,212,255,0.2)]">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-cyan-400">
                {authorName.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-extrabold text-white truncate">
                {authorName}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20 shrink-0" />
            </div>
            <p className="text-[11px] font-medium text-cyan-400/80 font-mono truncate">
              {authorUser}
            </p>
          </div>
        </div>

        {/* Likes Count */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F1A26] border border-[#2A3A4D] text-slate-300 shrink-0 shadow-sm">
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20" />
          <span className="text-xs font-bold font-mono tracking-tight text-white">{likesCount}</span>
        </div>
      </div>

      {/* THIN DIVIDER */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#2A3A4D] to-transparent my-2" />

      {/* 5. DOWNLOAD OPTIONS */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold font-orbitron text-cyan-400 tracking-[0.25em] uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            DOWNLOAD OPTIONS
          </span>
          <span className="text-[10px] text-slate-400 font-mono uppercase">
            {result.platform || 'HD QUALITY'}
          </span>
        </div>

        {/* GRID 2 KOLOM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* KIRI BESAR (ROW SPAN 2): No Watermark HD 1080p */}
          <a
            href={main1080Link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            download="tiktok_nowm_1080p.mp4"
            className="sm:row-span-2 group relative p-5 rounded-2xl bg-gradient-to-br from-[#122232] to-[#0A131E] border border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,212,255,0.35)] transition-all flex flex-col justify-between items-start cursor-pointer active:scale-[0.98] overflow-hidden no-underline"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl group-hover:bg-cyan-400/20 transition-all pointer-events-none" />

            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all mb-4 shadow-[0_0_12px_rgba(0,212,255,0.25)]">
              <Download className="w-5 h-5 stroke-[2.5]" />
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black font-orbitron px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 tracking-wider">
                  1080p HD
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                  RECOMMENDED
                </span>
              </div>
              <h4 className="text-base font-black text-white tracking-wide group-hover:text-cyan-300 transition-colors uppercase">
                No Watermark HD
              </h4>
              <p className="text-[11px] text-slate-400">
                Download video jernih tanpa watermark
              </p>
            </div>
          </a>

          {/* KANAN ATAS: MP3 Audio */}
          <a
            href={mainMp3Link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            download="audio.mp3"
            className="group p-4 rounded-2xl bg-[#0F1A26]/80 border border-[#2A3A4D] hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,212,255,0.25)] transition-all flex items-center justify-between cursor-pointer active:scale-[0.98] no-underline"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all shrink-0">
                <Music className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <h5 className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors uppercase">
                  MP3 Audio
                </h5>
                <p className="text-[10px] text-slate-400 font-mono">
                  320 kbps • Suara Jernih
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
          </a>

          {/* KANAN BAWAH: HD 720p */}
          <a
            href={main720Link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            download="tiktok_video_720p.mp4"
            className="group p-4 rounded-2xl bg-[#0F1A26]/80 border border-[#2A3A4D] hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,212,255,0.25)] transition-all flex items-center justify-between cursor-pointer active:scale-[0.98] no-underline"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <h5 className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors uppercase">
                  Standard 720p
                </h5>
                <p className="text-[10px] text-slate-400 font-mono">
                  Fast Download • MP4
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
          </a>
        </div>

        {/* ADDITIONAL LINKS LIST (if any extra items in downloadLinks) */}
        {Array.isArray(result.downloadLinks) && result.downloadLinks.length > 3 && (
          <div className="pt-2 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block px-1">
              MORE FORMATS ({result.downloadLinks.length})
            </span>
            <div className="grid grid-cols-2 gap-2">
              {result.downloadLinks.slice(3).map((item, idx) => (
                <a
                  key={idx}
                  href={item.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={item.ext ? `media_${idx + 1}.${item.ext}` : undefined}
                  className="p-3 rounded-xl bg-[#0F1A26] border border-[#2A3A4D] hover:border-cyan-400/60 transition-all text-left flex items-center justify-between text-xs text-slate-300 hover:text-white group no-underline"
                >
                  <span className="truncate text-[11px] font-bold">
                    {item.label || item.quality || `Link ${idx + 4}`}
                  </span>
                  <Download className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
