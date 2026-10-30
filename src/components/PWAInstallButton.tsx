import React, { useState } from 'react';
import { Download, Sparkles, X, Smartphone, ArrowDownToLine } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string; compact?: boolean }> = ({ className = '', compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as an installed PWA / APK, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (compact) {
      return (
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          title="Install DAPP sebagai Aplikasi / APK"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 text-cyan-300 hover:text-white hover:border-cyan-300 text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(0,212,255,0.2)] active:scale-95 transition-all ${className}`}
        >
          <ArrowDownToLine className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
          <span>{isInstalling ? 'Memasang...' : 'Install APK'}</span>
        </button>
      );
    }

    return (
      <div className={`w-full rounded-2xl bg-gradient-to-r from-[#0C1525]/90 via-[#0F1D35]/90 to-[#0A1220]/90 border border-cyan-500/40 p-3.5 sm:p-4 backdrop-blur-xl shadow-[0_0_25px_rgba(0,212,255,0.15)] flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,212,255,0.3)] shrink-0">
            <Smartphone className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-white font-bold text-sm tracking-wide">DAPP Project App</h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PWA / TWA
              </span>
            </div>
            <p className="text-xs text-slate-400">Install langsung di layar utama tanpa buka browser</p>
          </div>
        </div>

        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#0066FF] hover:from-[#38E0FF] hover:to-[#1A75FF] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,255,0.4)] active:scale-95 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isInstalling ? 'Memasang...' : 'Pasang Aplikasi'}</span>
          <Sparkles className="w-3.5 h-3.5 opacity-80" />
        </button>
      </div>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        {compact ? (
          <button
            onClick={() => setShowIOSGuide(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-semibold backdrop-blur-md active:scale-95 transition-all ${className}`}
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Install iOS</span>
          </button>
        ) : (
          <div className={`w-full rounded-2xl bg-[#0C1525]/90 border border-cyan-500/40 p-3.5 sm:p-4 backdrop-blur-xl flex items-center justify-between gap-3 ${className}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Smartphone className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-wide">Install DAPP di iPhone/iPad</h4>
                <p className="text-xs text-slate-400">Tambahkan ke Layar Utama</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-bold text-xs uppercase tracking-wider hover:bg-cyan-500/30 active:scale-95 transition-all"
            >
              Panduan
            </button>
          </div>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-[#0C1525] border border-cyan-500/40 p-6 shadow-[0_0_35px_rgba(0,212,255,0.2)] text-white relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-white mb-2">Pasang di iPhone / iPad</h3>
              <p className="text-xs text-slate-300 mb-4">
                Ikuti langkah berikut untuk memasang DAPP ke homescreen iOS:
              </p>

              <ol className="space-y-3 text-xs text-slate-200 list-decimal list-inside bg-black/40 p-4 rounded-xl border border-white/5">
                <li>
                  Buka website ini di browser <strong className="text-cyan-300">Safari</strong>
                </li>
                <li>
                  Ketuk tombol <strong className="text-cyan-300">Bagikan (Share)</strong> di bilah bawah
                </li>
                <li>
                  Gulir ke bawah dan pilih <strong className="text-cyan-300">"Tambah ke Layar Utama" (Add to Home Screen)</strong>
                </li>
                <li>
                  Ketuk <strong className="text-cyan-300">Tambah (Add)</strong> di pojok kanan atas
                </li>
              </ol>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold text-xs uppercase tracking-wider"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
