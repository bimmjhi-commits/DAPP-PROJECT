import React, { useState } from 'react';
import { ArrowLeft, Send, Flame, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface SpamNglPageProps {
  onBack: () => void;
}

export const SpamNglPage: React.FC<SpamNglPageProps> = ({ onBack }) => {
  const [link, setLink] = useState('https://ngl.link/');
  const [message, setMessage] = useState('Halo');
  const [jumlah, setJumlah] = useState('3');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSpam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) {
      setError('Masukkan link NGL terlebih dahulu!');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const apiUrl = `https://api.synoxcloud.xyz/tools/spam-ngl?link=${encodeURIComponent(link)}&message=${encodeURIComponent(message)}&jumlah=${encodeURIComponent(jumlah)}&apikey=FREE`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data && (data.status === true || data.success === true || data.result)) {
        setSuccessMsg(data.message || `Berhasil mengirim ${jumlah} pesan anonim ke target NGL!`);
      } else {
        setError(data?.message || 'Gagal mengirim pesan. Pastikan link NGL benar atau coba beberapa saat lagi.');
      }
    } catch (err: any) {
      setError('Gagal menghubungkan ke server pengiriman. Silakan periksa kembali koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F17] !bg-none flex flex-col justify-between selection:bg-orange-500 selection:text-white pb-32 relative overflow-hidden">
      {/* Container */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">
        
        {/* Top Header matching IP Lookup & Sub4Unlock */}
        <header className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-4 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-white stroke-[2.4]" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-white font-black text-sm sm:text-base tracking-wider uppercase">
                  Spam NGL Tool
                </h1>
                <p className="text-zinc-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
                  Anonymous Message Sender
                </p>
              </div>
            </div>
          </div>

          <span className="text-[10px] sm:text-xs font-bold px-4 py-2 bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20 backdrop-blur-md uppercase tracking-widest hidden sm:inline-block">
            High-Speed
          </span>
        </header>

        {/* Form Card matching Sub4Unlock / IP Lookup glass styling */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-black tracking-widest text-zinc-300 uppercase">
              Konfigurasi Target Pengiriman
            </span>
          </div>

          <form onSubmit={handleSpam} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Link NGL Target
              </label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://ngl.link/username"
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 font-medium focus:outline-none focus:border-orange-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Pesan / Message
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis pesan..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 font-medium focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Jumlah Spam (Count)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  placeholder="3"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 font-medium focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-black uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses Pengiriman...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>KIRIM SPAM SEKARANG</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800/60 text-red-300 flex items-center gap-3 text-sm animate-in fade-in duration-300">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 flex items-center gap-3 text-sm animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
