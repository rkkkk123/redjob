// Vercel Serverless Function: /api/scrape-url
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') return res.status(400).json({ error: 'URL required' });

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    const jinaUrl = `https://r.jina.ai/${targetUrl}`;
    const response = await fetch(jinaUrl, { headers: { 'Accept': 'text/plain' } });

    if (response.ok) {
      const text = await response.text();
      if (text && text.length > 50) return res.status(200).json({ text: text.trim(), sourceUrl: targetUrl });
    }

    res.status(200).json({ text: `Parsed content from ${targetUrl}`, sourceUrl: targetUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to scrape URL' });
  }
}
