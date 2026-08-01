// Vercel Serverless Function: /api/chat (Powered by Mistral AI)
import { OpenAI } from 'openai';

async function callMistralAPI(systemPrompt, messages, documentText, imageBase64, apiKey) {
  const modelToUse = imageBase64 ? "pixtral-12b-2409" : "mistral-medium-latest";
  const url = "https://api.mistral.ai/v1/chat/completions";

  const formattedMessages = [
    { role: "system", content: systemPrompt }
  ];

  if (documentText) {
    formattedMessages.push({
      role: "system",
      content: `User Attached Document/Resume Content:\n${documentText}`
    });
  }

  // Format existing conversation history
  if (Array.isArray(messages)) {
    messages.forEach(msg => {
      if (msg.role && msg.content) {
        formattedMessages.push({ role: msg.role, content: msg.content });
      }
    });
  }

  // Multimodal image support for Pixtral/Mistral
  if (imageBase64) {
    const lastMsg = formattedMessages[formattedMessages.length - 1];
    if (lastMsg && lastMsg.role === 'user') {
      lastMsg.content = [
        { type: "text", text: typeof lastMsg.content === 'string' ? lastMsg.content : 'Analyze this image' },
        { type: "image_url", image_url: { url: imageBase64 } }
      ];
    }
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelToUse,
      messages: formattedMessages,
      temperature: 0.3,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Mistral API HTTP ${response.status}: ${errText.slice(0, 150)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "I am here to help you navigate your career and job search!";
}

async function callGeminiFallback(systemPrompt, messages, apiKey) {
  const lastUserMsg = messages?.filter(m => m.role === 'user').pop()?.content || 'Help me with my career';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: lastUserMsg }] }],
      generationConfig: { temperature: 0.3 }
    })
  });

  if (!response.ok) throw new Error('Gemini fallback failed');
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "I am RedJob AI Robot! How can I help you today?";
}

function generateSmartRobotFallback(lastQuery = '', documentText = '') {
  const qLower = lastQuery.toLowerCase();

  if (qLower.includes('resume') || qLower.includes('ats') || documentText) {
    return `🤖 **RedJob Robot Resume Audit**:
    
1. **Keyword Alignment**: Ensure your top 3 core technical skills appear in both your summary and work experience sections.
2. **Quantified Metrics**: Replace passive duty descriptions with measurable outcomes (e.g. *"Increased team delivery velocity by 32%"*).
3. **Culture Red Flag Defense**: Watch out for vague job postings asking for "endless hustle". Use your unique accomplishments to leverage higher base compensation!`;
  }

  if (qLower.includes('interview') || qLower.includes('question') || qLower.includes('prepare')) {
    return `🤖 **RedJob Robot Planned Interview Strategy**:
    
- **Stage 1 (Recruiter Screen)**: Ask *"What is the explicit salary band for this position?"*
- **Stage 2 (Technical Audit)**: Present your architectural decision-making framework.
- **Stage 3 (Culture Audit)**: Ask *"How does management handle high-urgency scope expansion?"*
- **Stage 4 (Negotiation)**: Leverage your exact skill fit to target the top 25th percentile salary!`;
  }

  if (qLower.includes('salary') || qLower.includes('negotiate') || qLower.includes('money')) {
    return `🤖 **RedJob Robot Negotiation Advice**:
    
Never accept the first offer without inquiring about the base salary floor. Target market 75th percentile benchmarks ($115k - $140k/yr) and request clear equity/bonus metrics!`;
  }

  return `🤖 **Hi! I am RedJob AI Robot - Your Executive Career Consultant!**
  
I can help you:
1. **Analyze & Audit Job Descriptions** for hidden red flags.
2. **Optimize your Resume & ATS Match Score**.
3. **Prepare a Step-by-Step Planned Interview Roadmap**.
4. **Draft High-Leverage Salary Negotiation Scripts**.

Ask me any career question or upload a document/screenshot below!`;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    const { messages = [], documentText = null, imageBase64 = null } = body;
    const lastUserMsg = messages?.filter(m => m.role === 'user').pop()?.content || '';

    const systemPrompt = `You are RedJob AI Robot, a world-class, ultra-smart executive career coach and culture risk analyst powered by Mistral AI. Provide friendly, actionable, concise, and structured advice with emojis, markdown formatting, bullet points, and high-impact career strategies.`;

    let reply = null;

    // Strategy 1: Mistral AI (Model: mistral-medium-latest / pixtral-12b)
    const mistralKey = process.env.MISTRAL_API_KEY || process.env.VITE_MISTRAL_API_KEY;
    if (mistralKey && mistralKey.trim().length > 3) {
      try {
        reply = await callMistralAPI(systemPrompt, messages, documentText, imageBase64, mistralKey.trim());
      } catch (err) {
        console.warn('Mistral API error on Vercel:', err.message);
      }
    }

    // Strategy 2: Gemini API Fallback
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!reply && geminiKey && geminiKey.trim().length > 3) {
      try {
        reply = await callGeminiFallback(systemPrompt, messages, geminiKey.trim());
      } catch (gErr) {
        console.warn('Gemini fallback chat error:', gErr.message);
      }
    }

    // Strategy 3: Guaranteed Robot Fallback
    if (!reply) {
      reply = generateSmartRobotFallback(lastUserMsg, documentText);
    }

    return res.status(200).json({ reply, modelUsed: mistralKey ? 'mistral-medium-latest' : 'redjob-robot-v1' });
  } catch (error) {
    console.error('Vercel chat function error:', error);
    return res.status(200).json({ reply: generateSmartRobotFallback('', null), modelUsed: 'redjob-robot-fallback' });
  }
}
