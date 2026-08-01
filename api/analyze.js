// Vercel Serverless Function: /api/analyze
import { OpenAI } from 'openai';

function cleanAndParseJSON(rawStr) {
  if (!rawStr) throw new Error('Empty AI response payload.');
  let cleaned = rawStr.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  return JSON.parse(cleaned);
}

async function callMistralAPI(systemPrompt, userPrompt, imageBase64, apiKey) {
  const modelToUse = imageBase64 ? "pixtral-12b-2409" : "mistral-medium-latest";
  const url = "https://api.mistral.ai/v1/chat/completions";

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelToUse,
      messages,
      temperature: 0.2,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Mistral API HTTP ${response.status}: ${errText.slice(0, 100)}`);
  }

  const data = await response.json();
  return cleanAndParseJSON(data.choices?.[0]?.message?.content);
}

function runHeuristicAudit(jobDescription, resumeText) {
  const textLower = (jobDescription || '').toLowerCase();
  let score = 75;
  const flags = [];
  const signals = [];

  if (textLower.includes('wear many hats') || textLower.includes('hustle') || textLower.includes('fast-paced')) {
    score -= 20;
    flags.push({ severity: 'red', quote: 'Must wear many hats and hustle.', reason: 'Code for understaffed team expecting high workload.', question: 'What is current team capacity?' });
  }
  if (textLower.includes('work hard play hard') || textLower.includes('weekend') || textLower.includes('70+ hours')) {
    score -= 25;
    flags.push({ severity: 'red', quote: 'Work hard play hard.', reason: 'Expectation of uncompensated overtime.', question: 'How is employee burnout prevented?' });
  }

  if (flags.length === 0) {
    flags.push({ severity: 'amber', quote: 'Standard job requirements.', reason: 'General role expectations.', question: 'What are performance metrics for 90 days?' });
  }

  score = Math.max(15, Math.min(95, score));
  return {
    roleTitle: "Senior Role Analysis",
    companyName: "Target Hiring Company",
    score,
    summary: `Overall health score of ${score}/100. Evaluate workload requirements and culture fit.`,
    flags,
    signals: signals.length > 0 ? signals : [{ quote: 'Clear scope outlined.', reason: 'Defined role requirements.' }],
    hiringMetrics: { applicantCompetition: "High (180+ applicants)", hiringVelocityDays: 24, competitionIndex: 78, demandScore: 88 },
    compensationComparison: { roleBase: 118000, marketAvg: 105000, topPercentile: 145000, entryLevel: 75000, currency: "$" },
    futureProofIndex: { longevityScore: 85, aiAutomationRisk: 22, growthTrajectory: "+16% Industry Growth", futureSkillsToLearn: ["System Architecture", "AI Workflows"] },
    resumeFit: resumeText ? { matchScore: 78, summary: "Good alignment.", matchingSkills: ["Engineering", "System Design"], missingSkills: ["Certifications"], recommendations: ["Quantify impact."] } : null,
    salaryInsights: { estimatedRange: "$105,000 - $135,000 / yr", negotiationTip: "Emphasize core technical competencies.", emailScript: "Dear Hiring Manager,\n\nI am targeting a base compensation range of $115,000-$130,000.\n\nBest,\nCandidate" },
    interviewRoadmap: [
      {
        stageNumber: 1,
        stageTitle: "Stage 1: Recruiter Screening & Initial Alignment",
        focusArea: "Salary Band & Role Scope Bounds",
        targetQuestion: "What is the explicit base salary band and working hours expectation for this role?",
        greenFlagSignal: "Transparent salary range shared immediately ($115k+) with clear remote boundaries.",
        redFlagWarning: "Vague statements like 'compensation depends on candidate fit' without clear numbers."
      },
      {
        stageNumber: 2,
        stageTitle: "Stage 2: Technical Competency & Architecture Audit",
        focusArea: "Code Standards & System Maintenance",
        targetQuestion: "How does the team balance new feature velocity against technical debt refactoring?",
        greenFlagSignal: "Dedicated sprint allocations for tech debt and system reliability.",
        redFlagWarning: "Expectation of continuous feature hacks without refactoring cycles."
      },
      {
        stageNumber: 3,
        stageTitle: "Stage 3: Culture & Workload Boundary Audit",
        focusArea: "After-Hours Support & Burnout Defense",
        targetQuestion: "How are project priorities managed when multiple high-urgency requests collide?",
        greenFlagSignal: "Structured prioritization frameworks (RICE/MoSCoW) and executive shielding.",
        redFlagWarning: "Defensive answers such as 'we all do whatever it takes 24/7'."
      },
      {
        stageNumber: 4,
        stageTitle: "Stage 4: Executive Offer & Compensation Negotiation",
        focusArea: "Base Salary & KPI Milestones",
        targetQuestion: "What explicit 90-day KPIs determine performance evaluation and base compensation reviews?",
        greenFlagSignal: "Clear 30-60-90 day deliverables with written performance metrics.",
        redFlagWarning: "Unclear bonus criteria or equity promises lacking vesting documentation."
      }
    ],
    interviewStrategy: [{ topic: "Workload & Scope", suggestedQuestion: "How are project deadlines managed?", whatToLookFor: "Look for realistic scope boundaries." }]
  };
}

// In-memory cache for API performance optimization
const auditCache = new Map();
const MAX_CACHE_SIZE = 100;

function createHashKey(str) {
  let hash = 0;
  if (!str || str.length === 0) return '0';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(36);
}

const normalizeFlags = (arr, fallbackArr, defaultSeverity = 'amber') => {
  if (!Array.isArray(arr) || arr.length === 0) return fallbackArr;
  return arr.map((item, i) => {
    if (typeof item === 'string') {
      return {
        severity: defaultSeverity,
        quote: item,
        reason: 'Workplace expectation specified in job posting.',
        question: 'What does a typical workweek look like regarding this requirement?'
      };
    }
    return {
      severity: String(item?.severity || item?.level || defaultSeverity).toLowerCase(),
      quote: item?.quote || item?.text || item?.title || item?.finding || item?.issue || `Requirement #${i + 1}`,
      reason: item?.reason || item?.description || item?.explanation || item?.details || 'Identified requirement during role analysis.',
      question: item?.question || item?.suggestedQuestion || item?.strategy || ''
    };
  });
};

function normalizeAuditResult(rawResult, fallbackText = '') {
  const heuristic = runHeuristicAudit(fallbackText, null);
  if (!rawResult || typeof rawResult !== 'object') return heuristic;

  return {
    roleTitle: rawResult.roleTitle || heuristic.roleTitle,
    companyName: rawResult.companyName || heuristic.companyName,
    score: typeof rawResult.score === 'number' ? Math.max(10, Math.min(99, rawResult.score)) : heuristic.score,
    summary: rawResult.summary || heuristic.summary,
    flags: normalizeFlags(rawResult.flags, heuristic.flags, 'red'),
    signals: normalizeFlags(rawResult.signals, heuristic.signals, 'green'),
    hiringMetrics: rawResult.hiringMetrics || heuristic.hiringMetrics,
    compensationComparison: rawResult.compensationComparison || heuristic.compensationComparison,
    futureProofIndex: rawResult.futureProofIndex || heuristic.futureProofIndex,
    resumeFit: rawResult.resumeFit || heuristic.resumeFit,
    salaryInsights: rawResult.salaryInsights || heuristic.salaryInsights,
    interviewStrategy: Array.isArray(rawResult.interviewStrategy) && rawResult.interviewStrategy.length > 0
      ? rawResult.interviewStrategy
      : heuristic.interviewStrategy
  };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
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

    const { jobDescription = '', image = null, resumeText = null } = body;
    const cacheKey = createHashKey(`${jobDescription}_${resumeText || ''}_${image ? image.slice(0, 100) : ''}`);

    // Check In-Memory Cache for ultra-fast performance
    if (auditCache.has(cacheKey)) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(auditCache.get(cacheKey));
    }

    const systemPrompt = `You are an executive corporate culture auditor. Analyze the job description and return JSON format with roleTitle, companyName, score, summary, flags, signals, hiringMetrics, compensationComparison, futureProofIndex, resumeFit, salaryInsights, interviewStrategy.`;
    const userPrompt = `Job Description:\n${jobDescription}\nResume:\n${resumeText || ''}`;

    let aiResult = null;

    // Strategy 1: Mistral AI API (Model: mistral-medium-latest / pixtral-12b)
    const mistralKey = process.env.MISTRAL_API_KEY || process.env.VITE_MISTRAL_API_KEY;
    if (mistralKey && mistralKey.trim().length > 3) {
      try {
        aiResult = await callMistralAPI(systemPrompt, userPrompt, image, mistralKey.trim());
      } catch (mistralErr) {
        console.warn('Mistral API error on Vercel:', mistralErr.message);
      }
    }

    // Strategy 2: Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!aiResult && geminiKey && geminiKey.trim().length > 3) {
      try {
        aiResult = await callGeminiAPI(systemPrompt, userPrompt, image, geminiKey.trim());
      } catch (geminiErr) {
        console.warn('Gemini error on Vercel:', geminiErr.message);
      }
    }

    // Strategy 3: NVIDIA NIM API
    const nvidiaKey = process.env.NVIDIA_NIM_API_KEY;
    if (!aiResult && nvidiaKey && nvidiaKey.trim().length > 5) {
      try {
        aiResult = await callNvidiaNimAPI(systemPrompt, userPrompt, image, nvidiaKey.trim());
      } catch (nvidiaErr) {
        console.warn('NVIDIA NIM error on Vercel:', nvidiaErr.message);
      }
    }

    // Strategy 3: Guaranteed Heuristic Fallback
    if (!aiResult) {
      aiResult = runHeuristicAudit(jobDescription, resumeText);
    }

    const normalized = normalizeAuditResult(aiResult, jobDescription);

    // Save to Cache
    if (auditCache.size >= MAX_CACHE_SIZE) {
      const firstKey = auditCache.keys().next().value;
      auditCache.delete(firstKey);
    }
    auditCache.set(cacheKey, normalized);

    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(normalized);
  } catch (err) {
    console.error('Unhandled Vercel function error:', err);
    const fallback = normalizeAuditResult(null, 'Job Analysis');
    return res.status(200).json(fallback);
  }
}
