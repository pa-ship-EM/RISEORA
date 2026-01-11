import type { VercelRequest, VercelResponse } from '@vercel/node';

const DISPUTE_TEMPLATE_STAGES = [
  'INVESTIGATION_REQUEST',
  'PERSONAL_INFO_REMOVER', 
  'VALIDATION_OF_DEBT',
  'FACTUAL_LETTER',
  'TERMINATION_LETTER',
  'AI_ESCALATION',
] as const;

type DisputeTemplateStage = typeof DISPUTE_TEMPLATE_STAGES[number];

const TEMPLATE_DESCRIPTIONS: Record<DisputeTemplateStage, { title: string; description: string; waitDays: number }> = {
  INVESTIGATION_REQUEST: {
    title: "Investigation Request Letter",
    description: "Initial dispute letter requesting investigation under FCRA.",
    waitDays: 30,
  },
  PERSONAL_INFO_REMOVER: {
    title: "Personal Information Removal Letter",
    description: "Request removal of outdated personal information.",
    waitDays: 30,
  },
  VALIDATION_OF_DEBT: {
    title: "Validation of Debt Letter",
    description: "Demand verification that the debt is valid.",
    waitDays: 30,
  },
  FACTUAL_LETTER: {
    title: "Factual Dispute Letter",
    description: "Dispute with specific factual errors.",
    waitDays: 30,
  },
  TERMINATION_LETTER: {
    title: "Termination / Final Demand Letter",
    description: "Final demand for removal.",
    waitDays: 15,
  },
  AI_ESCALATION: {
    title: "AI-Generated Escalation",
    description: "Custom escalation letter. Requires dashboard access.",
    waitDays: 0,
  },
};

const ALLOWED_ORIGINS = [
  'https://riseora.com',
  'https://www.riseora.com',
  'https://riseora-portal.vercel.app',
];

function getCorsHeaders(origin: string | undefined) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function validateApiKey(req: VercelRequest): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const apiKey = authHeader.substring(7);
  return apiKey === process.env.RISEORA_API_KEY;
}

function getNextStage(currentStage: DisputeTemplateStage): DisputeTemplateStage | null {
  const currentIndex = DISPUTE_TEMPLATE_STAGES.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex >= DISPUTE_TEMPLATE_STAGES.length - 1) {
    return null;
  }
  return DISPUTE_TEMPLATE_STAGES[currentIndex + 1];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  const corsHeaders = getCorsHeaders(origin);
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!validateApiKey(req)) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Valid API key required.',
    });
  }

  try {
    const { currentStage } = req.body;

    if (!currentStage || !DISPUTE_TEMPLATE_STAGES.includes(currentStage)) {
      return res.status(400).json({ 
        error: 'Invalid current stage',
        validStages: DISPUTE_TEMPLATE_STAGES,
      });
    }

    const nextStage = getNextStage(currentStage as DisputeTemplateStage);

    if (!nextStage) {
      return res.status(400).json({
        error: 'Already at final stage',
        currentStage,
      });
    }

    const currentIndex = DISPUTE_TEMPLATE_STAGES.indexOf(currentStage as DisputeTemplateStage);
    const nextIndex = DISPUTE_TEMPLATE_STAGES.indexOf(nextStage);

    return res.status(200).json({
      success: true,
      previousStage: currentStage,
      currentStage: nextStage,
      templateInfo: TEMPLATE_DESCRIPTIONS[nextStage],
      progress: {
        step: nextIndex + 1,
        totalSteps: DISPUTE_TEMPLATE_STAGES.length,
        percentComplete: Math.round(((nextIndex + 1) / DISPUTE_TEMPLATE_STAGES.length) * 100),
      },
    });
  } catch (error) {
    console.error('Error advancing stage:', error);
    return res.status(500).json({ error: 'Failed to advance stage' });
  }
}
