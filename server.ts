import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API LOGIC (Moved from vite.config.ts) ---
  const dataDir = path.resolve(process.cwd(), 'data');
  const chatFile = path.resolve(dataDir, 'chat_messages.json');

  const defaultMessages: Array<{
    id: string;
    sender: string;
    text: string;
    time: string;
    timestamp: number;
  }> = [];

  function getMessages() {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      if (!fs.existsSync(chatFile)) {
        fs.writeFileSync(chatFile, JSON.stringify(defaultMessages, null, 2));
        return defaultMessages;
      }
      const data = fs.readFileSync(chatFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return defaultMessages;
    }
  }

  function saveMessage(msg: { id: string; sender: string; text: string; time: string; timestamp: number }) {
    try {
      const msgs = getMessages();
      msgs.push(msg);
      if (msgs.length > 150) {
        msgs.splice(0, msgs.length - 150);
      }
      fs.writeFileSync(chatFile, JSON.stringify(msgs, null, 2));
      return msgs;
    } catch {
      return [msg];
    }
  }

  const presenceSessions = new Map<string, { userName: string; lastSeen: number }>();

  function cleanupOldSessions() {
    const now = Date.now();
    for (const [id, data] of presenceSessions.entries()) {
      if (now - data.lastSeen > 12000) {
        presenceSessions.delete(id);
      }
    }
  }

  function getStats() {
    cleanupOldSessions();
    const connections = presenceSessions.size;
    const uniqueUsers = new Set<string>();
    for (const data of presenceSessions.values()) {
      if (data.userName && data.userName.trim()) {
        uniqueUsers.add(data.userName.toLowerCase().trim());
      }
    }
    return {
      online: Math.max(uniqueUsers.size, 1),
      connections: Math.max(connections, 1),
    };
  }

  // Presence Routes
  app.get('/api/stats/presence', (req, res) => {
    res.json(getStats());
  });

  app.post('/api/stats/presence', (req, res) => {
    const { clientId, userName } = req.body;
    if (clientId) {
      presenceSessions.set(clientId, {
        userName: userName || '',
        lastSeen: Date.now(),
      });
    }
    res.json(getStats());
  });

  app.post('/api/stats/presence/leave', (req, res) => {
    const { clientId } = req.body;
    if (clientId) {
      presenceSessions.delete(clientId);
    }
    res.json(getStats());
  });

  // Chat Routes
  app.get('/api/chat/messages', (req, res) => {
    res.json(getMessages());
  });

  app.post('/api/chat/messages', (req, res) => {
    const updated = saveMessage(req.body);
    res.json({ success: true, messages: updated });
  });

  // Gemini Route
  app.post('/api/ai/gemini', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      res.json({ result: response.text });
    } catch (err: any) {
      console.error('Gemini error:', err);
      res.status(500).json({ error: err.message || 'Gagal mendapatkan respon dari AI.' });
    }
  });

  // Proxy Routes
  const SYLVA_API_KEY = process.env.SYLVA_API_KEY || 'sylva-b1e3079e86a92e12a2d71afef8d775ec';

  // Helper to extract clean URL from text (in case user pasted share text)
  function extractCleanUrl(input: string): string {
    if (!input) return '';
    const match = input.match(/https?:\/\/[^\s]+/i);
    return match ? match[0] : input.trim();
  }

  // Helper to resolve short links like vt.tiktok.com or vm.tiktok.com
  async function resolveRedirectUrl(rawUrl: string): Promise<string> {
    try {
      const res = await fetch(rawUrl, {
        method: 'HEAD',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      return res.url || rawUrl;
    } catch {
      return rawUrl;
    }
  }

  function formatCount(num?: number | string): string {
    if (!num) return '0';
    const n = Number(num);
    if (isNaN(n)) return String(num);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  }

  function formatDurationSeconds(sec?: number | string): string {
    if (!sec) return '00:20';
    const n = Number(sec);
    if (isNaN(n)) return String(sec);
    const m = Math.floor(n / 60).toString().padStart(2, '0');
    const s = Math.floor(n % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  async function fetchTikWM(tiktokUrl: string) {
    try {
      const apiRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      });
      const json = await apiRes.json();
      if (json.code === 0 && json.data) {
        const d = json.data;
        const authorName = d.author?.nickname || 'TikTok Creator';
        const authorUnique = d.author?.unique_id ? `@${d.author.unique_id}` : '@creator';
        const authorDisplay = `${authorName} (${authorUnique})`;
        const durationSec = Number(d.duration) || 0;

        const formats: any[] = [];
        if (d.play) {
          formats.push({
            id: 'sd',
            kind: 'video',
            label: 'Video (Tanpa Watermark)',
            quality: 'Original / HD',
            ext: 'mp4',
            hasWatermark: false,
            downloadUrl: d.play,
            description: 'MP4 No Watermark · HD'
          });
        }
        if (d.wmplay) {
          formats.push({
            id: 'watermark',
            kind: 'video',
            label: 'Video (Dengan Watermark)',
            quality: 'Original',
            ext: 'mp4',
            hasWatermark: true,
            downloadUrl: d.wmplay,
            description: 'MP4 With Watermark'
          });
        }
        const musicUrl = d.music || d.music_info?.play;
        if (musicUrl) {
          formats.push({
            id: 'audio_video',
            kind: 'audio',
            label: `Sound Musik: ${d.music_info?.title || authorName} (MP3)`,
            quality: '320 kbps',
            ext: 'mp3',
            hasWatermark: false,
            downloadUrl: musicUrl,
            description: 'Audio MP3 · 320 kbps'
          });
        }
        if (Array.isArray(d.images) && d.images.length > 0) {
          d.images.forEach((img: string, idx: number) => {
            formats.push({
              id: `photo_${idx + 1}`,
              kind: 'image',
              label: `Foto Slide ${idx + 1}`,
              quality: 'HD',
              ext: 'jpg',
              hasWatermark: false,
              downloadUrl: img,
              description: `Foto Slide ${idx + 1}`
            });
          });
        }

        return {
          status: true,
          result: {
            success: true,
            data: {
              title: d.title || 'TikTok Video',
              description: d.title || '',
              rawUrl: tiktokUrl,
              duration: durationSec,
              durationLabel: formatDurationSeconds(durationSec),
              platform: 'TIKTOK',
              previewKind: Array.isArray(d.images) && d.images.length > 0 ? 'image' : 'video',
              previewUrl: d.play || d.wmplay || (d.images ? d.images[0] : ''),
              thumbnailUrl: d.cover || d.origin_cover || '',
              author: authorDisplay,
              authorAvatar: d.author?.avatar,
              music: {
                title: d.music_info?.title || 'Original Sound',
                author: d.music_info?.author || authorName,
                playUrl: musicUrl
              },
              stats: {
                likes: formatCount(d.digg_count),
                views: formatCount(d.play_count),
                shares: formatCount(d.share_count),
                comments: formatCount(d.comment_count)
              },
              formats
            }
          }
        };
      }
    } catch (err: any) {
      console.warn('fetchTikWM error:', err?.message);
    }
    return null;
  }

  app.get('/api/download/aio', async (req, res) => {
    const rawInput = (req.query.url as string) || '';
    const cleanUrl = extractCleanUrl(rawInput);

    if (!cleanUrl) {
      return res.status(400).json({ status: false, error: 'URL video tidak boleh kosong' });
    }

    const isTikTok = /tiktok\.com/i.test(cleanUrl) || /douyin\.com/i.test(cleanUrl);

    // 1. Prioritize Sylvatica primary endpoint as requested
    let sylvaticaData: any = null;
    try {
      const targetUrl = `https://sylvatica.my.id/api/download/aio?url=${encodeURIComponent(cleanUrl)}&apikey=${SYLVA_API_KEY}`;
      const apiRes = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      });
      if (apiRes.ok) {
        sylvaticaData = await apiRes.json();
        const resData = sylvaticaData?.result?.data || sylvaticaData?.result || sylvaticaData?.data;
        const hasFormats = Array.isArray(resData?.formats) && resData.formats.length > 0;
        const hasMedia = Boolean(resData?.previewUrl || resData?.videoUrl || resData?.downloadUrl || hasFormats);
        const isSuccess = sylvaticaData?.status === true && sylvaticaData?.result?.success !== false && !sylvaticaData?.error;

        if (isSuccess && hasMedia) {
          return res.json(sylvaticaData);
        }
      }
    } catch (err: any) {
      console.warn('Sylvatica primary fetch failed:', err?.message);
    }

    // 2. If Sylvatica returns an error or fails for TikTok, activate resilient TikWM scraper
    if (isTikTok) {
      try {
        console.log('Sylvatica unfulfilled, attempting TikTok TikWM resolution for:', cleanUrl);
        const resolvedUrl = (cleanUrl.includes('vt.tiktok.com') || cleanUrl.includes('vm.tiktok.com'))
          ? await resolveRedirectUrl(cleanUrl)
          : cleanUrl;

        let tikwmResult = await fetchTikWM(resolvedUrl);
        if (!tikwmResult && resolvedUrl !== cleanUrl) {
          tikwmResult = await fetchTikWM(cleanUrl);
        }

        if (tikwmResult) {
          return res.json(tikwmResult);
        }
      } catch (fallbackErr: any) {
        console.error('TikTok fallback error:', fallbackErr?.message);
      }
    }

    // 3. If Sylvatica had response data, return it
    if (sylvaticaData) {
      return res.json(sylvaticaData);
    }

    res.status(500).json({ 
      status: false, 
      error: 'Gagal mengekstrak media dari link ini. Pastikan konten berstatus publik.' 
    });
  });

  app.get('/api/search/ytplay', async (req, res) => {
    const q = req.query.q as string || '';
    const targetUrl = `https://v2.api-varhad.my.id/search/ytplay?q=${encodeURIComponent(q)}`;
    try {
      const apiRes = await fetch(targetUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      });
      const data = await apiRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message, status: false });
    }
  });

  app.get('/api/search/lirik', async (req, res) => {
    const q = req.query.q as string || '';
    const targetUrl = `https://v2.api-varhad.my.id/search/lirik?q=${encodeURIComponent(q)}`;
    try {
      const apiRes = await fetch(targetUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      });
      const data = await apiRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message, status: false });
    }
  });

  app.get('/api/search/spotify', async (req, res) => {
    const q = req.query.q as string || '';
    const targetUrl = `https://sylvatica.my.id/api/search/spotify?q=${encodeURIComponent(q)}&apikey=${SYLVA_API_KEY}`;
    try {
      const apiRes = await fetch(targetUrl);
      const data = await apiRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message, status: false });
    }
  });

  app.get('/api/bypass/sub4unlock', async (req, res) => {
    const target = req.query.url as string || '';
    const targetUrl = `https://sylvatica.my.id/api/bypass/sub4unlock?url=${encodeURIComponent(target)}&apikey=${SYLVA_API_KEY}`;
    try {
      const apiRes = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json'
        }
      });
      const data = await apiRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message, status: false });
    }
  });

  app.get('/api/info/iplookup', async (req, res) => {
    let ip = req.query.ip as string || '';
    if (!ip) {
      const forwarded = (req.headers['x-forwarded-for'] as string) || '';
      ip = forwarded.split(',')[0]?.trim() || '';
    }
    const targetUrl = `https://sylvatica.my.id/api/info/iplookup?ip=${encodeURIComponent(ip)}&apikey=${SYLVA_API_KEY}`;
    try {
      const apiRes = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json'
        }
      });
      const data = await apiRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message, status: false });
    }
  });

  // --- VITE MIDDLEWARE OR STATIC SERVING ---
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started at http://0.0.0.0:${PORT}`);
  });
}

startServer();
