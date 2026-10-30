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
const PORT = process.env.PORT || 3000;

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
  const SYLVA_API_KEY = process.env.SYLVA_API_KEY || 'sylva-02b494b7f630d54cfa7390b35f71b188';

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
