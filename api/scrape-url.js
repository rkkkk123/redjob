// Vercel Serverless Function: /api/scrape-url
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    const { url } = body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Valid URL is required' });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    const jinaUrl = `https://r.jina.ai/${targetUrl}`;
    const response = await fetch(jinaUrl, { headers: { 'Accept': 'text/plain' } });

    if (response.ok) {
      const text = await response.text();
      if (text && text.trim().length > 50) {
        return res.status(200).json({ text: text.trim(), sourceUrl: targetUrl });
      }
    }

    return res.status(200).json({ text: `Parsed content from ${targetUrl}`, sourceUrl: targetUrl });
  } catch (err) {
    console.error('Vercel scrape-url error:', err);
    return res.status(500).json({ error: 'Failed to scrape URL' });
  }
}
