import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Clipboard, Link2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { DownloaderResult, DownloaderResultData, DownloadLinkItem } from './DownloaderResult';

interface AiODownloaderPageProps {
  onBack?: () => void;
}

export const AiODownloaderPage: React.FC<AiODownloaderPageProps> = ({ onBack }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DownloaderResultData | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.warn('Clipboard read error:', err);
    }
  };

  const handleFetch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const raw = url.trim();
      const match = raw.match(/https?:\/\/[^\s]+/i);
      const cleanUrl = match ? match[0] : raw;
      const endpoint = `/api/download/aio?url=${encodeURIComponent(cleanUrl)}`;
      
      console.log('Fetching AIO Downloader from:', endpoint);
      const res = await fetch(endpoint);
      const data = await res.json();
      console.log('Downloader Response:', data);

      if (!res.ok || data.status === false) {
        throw new Error(data.error || data.message || 'Gagal mengambil data video. Pastikan link dapat diakses publik.');
      }

      const resData = data.result?.data || data.result || data.data || data;

      if (resData.success === false) {
        throw new Error(resData.error || resData.message || 'Video tidak ditemukan atau link tidak didukung.');
      }

      // Extract author information
      let authorName = 'TikTok Creator';
      let authorUsername = '@creator';
      if (typeof resData.author === 'string') {
        const match = resData.author.match(/^(.*?)\s*(\(@?[^)]+\))?$/);
        if (match) {
          authorName = match[1]?.trim() || resData.author;
          authorUsername = match[2] ? match[2].replace(/[()]/g, '') : `@${authorName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
          if (!authorUsername.startsWith('@')) authorUsername = `@${authorUsername}`;
        } else {
          authorName = resData.author;
          authorUsername = `@${resData.author.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        }
      } else if (typeof resData.author === 'object' && resData.author) {
        authorName = resData.author.name || resData.author.nickname || 'Creator';
        authorUsername = resData.author.username || 'creator';
        if (!authorUsername.startsWith('@')) authorUsername = `@${authorUsername}`;
      }

      // Extract download items and formats
      const rawItems: any[] = resData.formats || resData.downloadItems || resData.medias || resData.links || [];
      const downloadLinks: DownloadLinkItem[] = rawItems
        .filter((item: any) => item.downloadUrl !== 'all-playlist' && item.url !== 'all-playlist')
        .map((item, idx) => ({
          id: item.id || `item-${idx}`,
          kind: item.kind === 'file' ? 'video' : (item.kind || (item.ext === 'mp3' ? 'audio' : 'video')),
          label: item.label || item.quality || item.resolution || `Pilihan ${idx + 1}`,
          quality: item.quality || item.resolution,
          ext: item.ext,
          url: item.downloadUrl || item.url || item.link,
          hasWatermark: item.id === 'watermark' || (item.hasWatermark ?? false) || item.label?.toLowerCase().includes('dengan watermark'),
          description: item.description,
        }));

      // Find best links for quick options
      const noWatermarkVideo = downloadLinks.find(i => 
        (i.id === 'sd' || i.id === 'hd' || !i.hasWatermark || i.label?.toLowerCase().includes('tanpa watermark')) && i.url && i.kind === 'video'
      );
      const watermarkVideo = downloadLinks.find(i => 
        (i.id === 'watermark' || i.hasWatermark || i.label?.toLowerCase().includes('dengan watermark')) && i.url && i.kind === 'video'
      );
      const audioItem = downloadLinks.find(i => 
        (i.kind === 'audio' || i.id?.includes('audio') || i.ext === 'mp3' || i.label?.toLowerCase().includes('mp3')) && i.url
      );

      const hd1080 = noWatermarkVideo?.url 
        || resData.previewUrl 
        || resData.video_nowm 
        || resData.url 
        || resData.video 
        || downloadLinks.find(i => i.kind === 'video')?.url
        || '';

      const hd720 = watermarkVideo?.url 
        || downloadLinks.filter(i => i.kind === 'video')[1]?.url 
        || hd1080;

      const mp3 = audioItem?.url 
        || resData.music?.playUrl 
        || resData.audio 
        || resData.mp3 
        || '';

      const normalized: DownloaderResultData = {
        title: resData.title || resData.desc || 'TikTok Video',
        description: resData.description || (resData.music?.title ? `Sound: ${resData.music.title}` : undefined),
        thumbnail: resData.thumbnailUrl || resData.thumbnail || resData.cover || resData.thumb || '',
        videoUrl: resData.previewUrl || hd1080,
        audioUrl: mp3,
        duration: resData.durationLabel || resData.duration || '00:21',
        platform: resData.platform || 'TIKTOK',
        author: {
          name: authorName,
          username: authorUsername,
          avatarUrl: resData.authorAvatar || (typeof resData.author === 'object' ? (resData.author.avatarUrl || resData.author.avatar) : '') || resData.thumbnailUrl,
          verified: true,
        },
        stats: {
          likes: resData.stats?.likes || resData.likes || '5.4K',
          views: resData.stats?.views || resData.views,
          shares: resData.stats?.shares || resData.shares,
          comments: resData.stats?.comments || resData.comments,
        },
        hd1080Url: hd1080,
        hd720Url: hd720,
        mp3Url: mp3,
        downloadLinks,
      };

      setResult(normalized);
    } catch (e: any) {
      console.error('Downloader error:', e);
      setError(e.message || 'Terjadi kesalahan saat memproses URL. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0E14] text-white pb-32 flex flex-col font-sans select-none selection:bg-cyan-500 selection:text-black">
      {/* Glow Ornaments */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-[120px] pointer-events-none z-0" />

      {/* 1. HEADER */}
      <div className="px-6 py-5 border-b border-[#2A3A4D]/50 sticky top-0 bg-[#0A0E14]/85 backdrop-blur-xl z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-[#1A2332] border border-[#2A3A4D] hover:border-cyan-400/50 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Kembali ke Tools"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="space-y-0.5">
            <h1 className="text-base sm:text-lg font-black font-orbitron tracking-[0.2em] uppercase text-cyan-400 drop-shadow-[0_0_12px_rgba(0,212,255,0.7)]">
              CYBERDOWNLOAD / AIO DOWNLOADER
            </h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider">
              TikTok Video Downloader • Premium
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-orbitron font-bold text-cyan-300 flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,212,255,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>V2.0 PRO</span>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full space-y-6 relative z-10">
        
        {/* 2. CARD INPUT (Glassmorphism) */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-[#1A2332]/80 backdrop-blur-md border border-cyan-500/30 rounded-[24px] p-6 shadow-[0_0_30px_rgba(0,212,255,0.12)] space-y-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold font-orbitron text-cyan-400 tracking-[0.2em] uppercase flex items-center gap-2">
              <Link2 className="w-3.5 h-3.5 text-cyan-400" />
              PASTE VIDEO URL
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              Supports: TikTok / Reels / Shorts
            </span>
          </div>

          <form onSubmit={handleFetch} className="space-y-4">
            {/* Input with embedded PASTE button */}
            <div className="relative flex items-center">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://vt.tiktok.com/ZSgWucUhj/..."
                className="w-full h-14 pl-4 pr-32 rounded-[16px] bg-[#0F1A26] border border-[#2A3A4D] focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,212,255,0.25)] text-sm font-medium text-white placeholder-slate-500 outline-none transition-all selection:bg-cyan-500 selection:text-black"
                required
              />
              
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-2 px-3.5 py-2 rounded-xl bg-[#1A2332] hover:bg-[#233147] border border-cyan-500/20 hover:border-cyan-400/50 text-[11px] font-bold text-cyan-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">PASTED</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>PASTE LINK</span>
                  </>
                )}
              </button>
            </div>

            {/* Tombol Utama BUKA TOOL: gradient #00D4FF ke #0066FF, rounded 16px, shadow glowing, text bold putih, icon sparkle */}
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="w-full h-14 rounded-[16px] bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(0,212,255,0.45)] hover:shadow-[0_0_35px_rgba(0,212,255,0.65)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{loading ? 'MEMPROSES DATA...' : 'BUKA TOOL'}</span>
            </button>
          </form>
        </motion.div>

        {/* 4. CARD RESULT (3 STATES) */}
        <DownloaderResult 
          loading={loading}
          result={result}
          error={error}
        />

      </div>
    </div>
  );
};
