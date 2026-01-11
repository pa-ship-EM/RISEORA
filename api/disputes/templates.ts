import type { VercelRequest, VercelResponse } from '@vercel/node';

const DISPUTE_TEMPLATE_STAGES = [
  'INVESTIGATION_REQUEST',
  'PERSONAL_INFO_REMOVER', 
  'VALIDATION_OF_DEBT',
  'FACTUAL_LETTER',
  'TERMINATION_LETTER',
  'AI_ESCALATION',
] as const;

const TEMPLATE_DESCRIPTIONS = {
  INVESTIGATION_REQUEST: {
    title: "Investigation Request Letter",
    description: "Initial dispute letter requesting investigation under 15 U.S.C. Sec. 1681i(a). Bureau has 30 days to respond.",
    waitDays: 30,
  },
  PERSONAL_INFO_REMOVER: {
    title: "Personal Information Removal Letter",
    description: "Request removal of outdated or incorrect personal information from your credit file.",
    waitDays: 30,
  },
  VALIDATION_OF_DEBT: {
    title: "Validation of Debt Letter",
    description: "Demand verification that the debt is valid and belongs to you under the FDCPA.",
    waitDays: 30,
  },
  FACTUAL_LETTER: {
    title: "Factual Dispute Letter",
    description: "Dispute with specific factual errors and documentation requests.",
    waitDays: 30,
  },
  TERMINATION_LETTER: {
    title: "Termination / Final Demand Letter",
    description: "Final demand for removal citing continued reporting violations.",
    waitDays: 15,
  },
  AI_ESCALATION: {
    title: "AI-Generated Escalation",
    description: "Custom escalation letter generated based on dispute history. Requires authenticated access.",
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  const corsHeaders = getCorsHeaders(origin);
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      stages: DISPUTE_TEMPLATE_STAGES,
      descriptions: TEMPLATE_DESCRIPTIONS,
      totalSteps: DISPUTE_TEMPLATE_STAGES.length,
      workflow: '5-Step Dispute Template Process',
      note: 'Full dispute generation requires authenticated access through the RiseOra application.',
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
