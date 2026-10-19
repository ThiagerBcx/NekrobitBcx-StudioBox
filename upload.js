// Forwards one upload to Catbox. Vercel may reject request bodies over ~4.5 MB
// before this function runs; see README.txt for the 100 MB limitation.
export const config = { api: { bodyParser: false } };
import Busboy from 'busboy';
import FormData from 'form-data';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  let found = false, tooLarge = false, fileName = 'upload.bin', mimeType = 'application/octet-stream';
  const chunks = [];
  const bb = Busboy({ headers: req.headers, limits: { files: 1, fileSize: 100 * 1024 * 1024 } });
  const finished = new Promise((resolve, reject) => {
    bb.on('file', (field, stream, info) => {
      if (field !== 'file' || found) { stream.resume(); return; }
      found = true; fileName = info.filename || fileName; mimeType = info.mimeType || mimeType;
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('limit', () => { tooLarge = true; });
    });
    bb.on('error', reject); bb.on('finish', resolve);
  });
  req.pipe(bb);
  try {
    await finished;
    if (!found) return res.status(400).json({ error: 'No se recibió ningún archivo.' });
    if (tooLarge) return res.status(413).json({ error: 'El archivo supera los 100 MB.' });
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', Buffer.concat(chunks), { filename: fileName, contentType: mimeType });
    const upstream = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form, headers: form.getHeaders() });
    const url = (await upstream.text()).trim();
    if (!upstream.ok || !/^https?:\/\//i.test(url)) return res.status(502).json({ error: 'Catbox rechazó el archivo o no devolvió un enlace.' });
    return res.status(200).json({ url });
  } catch (err) {
    return res.status(500).json({ error: 'Error de subida: ' + (err?.message || 'desconocido') });
  }
}
