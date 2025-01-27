import express from 'express';
import bodyParser from 'body-parser';
//import { igdl, ttdl, fbdown, twitter, youtube } from 'btch-downloader';
import knights from 'knights-canvas';
import axios from 'axios';
import cheerio from 'cheerio';
import path from 'path';
//import got from 'got';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch'; 
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fsPromises = fs.promises;
const router = express();
const PORT = process.env.PORT || 3000;

// Middleware
router.use(bodyParser.json());
router.use(express.static('public'));

// Endpoint untuk halaman dokumentasi
router.get('/docs', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Ganti dengan path file HTML Anda
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/muslim/quran', async (req, res, next) => {
  const { surah, ayat } = req.query;
  if (!surah) return res.json({ status: false, creator, message: "masukan parameter surah" });
  if (!ayat) return res.json({ status: false, creator, message: "masukan parameter ayat" });

  try {
    const response = await fetch(encodeURI(`https://alquran-apiii.vercel.app/surah/${surah}/${ayat}`));
    const data = await response.json();
    res.json({ result: data });
  } catch (e) {
    res.json(loghandler.error);
  }
});

router.get('/muslim/tahlil', async (req, res, next) => {
  try {
    const response = await fetch(encodeURI(`https://raw.githubusercontent.com/Kieza17/doa-tahlil/main/doa-tahlil/doa-tahlil.json`));
    const data = await response.json();
    res.json({ result: data.result });
  } catch (e) {
    res.json(loghandler.error);
  }
});

// Endpoint untuk mengunduh konten dari Instagram (GET)
/*router.get('/api/download/instagram', async (req, res) => {
  const { url } = req.query;

  try {
    if (!url) throw new Error('URL tidak boleh kosong');

    const data = await igdl(url);
    const response = {
      result: {
        url: data[0].url,
        thumbnail: data[0].thumbnail,
        creator: 'BGSBOT RESTAPI'
      },
      message: 'Berhasil mengunduh dari Instagram'
    };
    res.json(response);
  } catch (error) {
    console.error('Gagal mengunduh dari Instagram:', error.message);
    res.status(500).json({ error: 'Gagal mengunduh dari Instagram' });
  }
});

// Endpoint untuk mengunduh konten dari TikTok (GET)
router.get('/api/download/tiktok', async (req, res) => {
  const { url } = req.query;

  try {
    const data = await ttdl(url); // Anda perlu mengganti downloadTikTok dengan fungsi atau metode yang sesuai untuk mengunduh dari TikTok
    const response = {
      result: {
        title: data.title,
        title_audio: data.title_audio,
        thumbnail: data.thumbnail,
        video: [data.video],
        audio: [data.audio],
      },
      creator: "BGSBOT RESTAPI"
    };
    res.json(response);
  } catch (error) {
    console.error('Gagal mengunduh dari TikTok:', error);
    res.status(500).json({ error: 'Gagal mengunduh dari TikTok' });
  }
});

// Endpoint untuk mengunduh konten dari Facebook (GET)
router.get('/api/download/facebook', async (req, res) => {
  const { url } = req.query;

  try {
    const data = await fbdown(url);
    const response = {
      result: data
    };
    res.json(response);
  } catch (error) {
    console.error('Gagal mengunduh dari Facebook:', error);
    res.status(500).json({ error: 'Gagal mengunduh dari Facebook' });
  }
});

// Endpoint untuk mengunduh konten dari Twitter (GET)
router.get('/api/download/twitter', async (req, res) => {
  const { url } = req.query;

  try {
    const data = await twitter(url);
    res.json(data);
  } catch (error) {
    console.error('Gagal mengunduh dari Twitter:', error);
    res.status(500).json({ error: 'Gagal mengunduh dari Twitter' });
  }
});

// Endpoint untuk mengunduh konten dari YouTube (GET)
router.get('/api/download/youtube', async (req, res) => {
  const { url } = req.query;

  try {
    if (!url) throw new Error('URL tidak boleh kosong');

    const data = await youtube(url);
    res.json(data);
  } catch (error) {
    console.error('Gagal mengunduh dari YouTube:', error.message);
    res.status(500).json({ error: 'Gagal mengunduh dari YouTube' });
  }
});
*/
router.get('/api/welcome', async (req, res) => {
  try {
    const { picurl, name, bgurl, gcname, mem } = req.query;
    const welcomeCard = await new knights.Welcome()
      .setUsername(name || "UNDEFINED")
      .setGuildName(gcname || "WIBU NOLEP")
      .setGuildIcon("https://i.ibb.co/G5mJZxs/rin.jpg")
      .setMemberCount(mem || "120")
      .setAvatar(picurl || "https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg")
      .setBackground(bgurl || "https://i.ibb.co/4YBNyvP/images-76.jpg")
      .toAttachment();

    // Instead of saving to filesystem, send as response directly
    res.set('Content-Type', 'image/png');
    res.send(await welcomeCard.toBuffer());
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/goodbye', async (req, res) => {
  try {
    const { picurl, name, bgurl, gcname, mem } = req.query;
    if (!req.query.picurl) return res.status(400).send({ status: 400, message: 'picurl tidak boleh kosong!', result: 'error' });
    if (!req.query.name) return res.status(400).send({ status: 400, message: 'name tidak boleh kosong!', result: 'error' });
    if (!req.query.bgurl) return res.status(400).send({ status: 400, message: 'bgurl tidak boleh kosong!', result: 'error' });
    if (!req.query.gcname) return res.status(400).send({ status: 400, message: 'gcname tidak boleh kosong!', result: 'error' });
    if (!req.query.mem) return res.status(400).send({ status: 400, message: 'mem tidak boleh kosong!', result: 'error' });

    const goodbyeCard = await new knights.Goodbye()
      .setUsername(name || "LING MO")
      .setGuildName(gcname || "Frontline")
      .setGuildIcon("https://i.ibb.co/G5mJZxs/rin.jpg")
      .setMemberCount(mem || "404")
      .setAvatar(picurl || "https://i.ibb.co/G5mJZxs/rin.jpg")
      .setBackground(bgurl || "https://i.ibb.co/G5mJZxs/rin.jpg")
      .toAttachment();

    // Instead of saving to filesystem, send as response directly
    res.set('Content-Type', 'image/png');
    res.send(await goodbyeCard.toBuffer());
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Menggunakan fetch untuk endpoint /maker/jail
router.get("/maker/jail", async (req, res, next) => {
  const image = req.query.image;
  if (!image) return res.json("Masukan URL gambar nya");

  try {
    const response = await fetch(`https://api.popcat.xyz/jail?image=${image}`);
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari server');
    }
    
    const buffer = await response.arrayBuffer();
    res.set({ 'Content-Type': 'image/png' });
    res.send(Buffer.from(buffer));
  } catch (error) {
    next(error);
  }
});

// Menggunakan fetch untuk endpoint /maker/wanted
router.get("/maker/wanted", async (req, res, next) => {
  const image = req.query.image;
  if (!image) return res.json("Masukan URL gambar nya");

  try {
    const response = await fetch(`https://api.popcat.xyz/wanted?image=${image}`);
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari server');
    }

    const buffer = await response.arrayBuffer();
    res.set({ 'Content-Type': 'image/png' });
    res.send(Buffer.from(buffer));
  } catch (error) {
    next(error);
  }
});

// Menggunakan fetch untuk endpoint /maker/ship
router.get("/maker/ship", async (req, res, next) => {
  const { image1, image2 } = req.query;
  if (!image1) return res.json(loghandler.noturl1);
  if (!image2) return res.json(loghandler.noturl2);

  try {
    const response = await fetch(`https://api.popcat.xyz/ship?user1=${image1}&user2=${image2}`);
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari server');
    }

    const buffer = await response.arrayBuffer();
    res.set({ 'Content-Type': 'image/png' });
    res.send(Buffer.from(buffer));
  } catch (error) {
    next(error);
  }
});

// Menggunakan fetch untuk endpoint /maker/google-suggestion
router.get('/maker/google-suggestion', async (req, res, next) => {
  const text = req.query.text;
  if (!text) return res.json(loghandler.nottext);

  try {
    const response = await fetch(`https://api.popcat.xyz/search?q=${text}`);
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari server');
    }

    const buffer = await response.arrayBuffer();
    res.set({ 'Content-Type': 'image/png' });
    res.send(Buffer.from(buffer));
  } catch (error) {
    next(error);
  }
});


router.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Server listener
router.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
