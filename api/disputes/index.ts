import type { VercelRequest, VercelResponse } from '@vercel/node';

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
      service: 'RiseOra Dispute Wizard API',
      version: '1.0.0',
      endpoints: {
        templates: '/api/disputes/templates',
        generate: '/api/disputes/generate-letter (requires authentication)',
        advance: '/api/disputes/advance-stage (requires authentication)',
      },
      templateStages: [
        'INVESTIGATION_REQUEST',
        'PERSONAL_INFO_REMOVER',
        'VALIDATION_OF_DEBT',
        'FACTUAL_LETTER',
        'TERMINATION_LETTER',
        'AI_ESCALATION',
      ],
      documentation: 'https://riseora.com/docs/api',
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
