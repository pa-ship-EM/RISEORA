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

function getBureauAddress(bureau: string): string {
  const addresses: Record<string, string> = {
    EXPERIAN: `Experian\nP.O. Box 4500\nAllen, TX 75013`,
    EQUIFAX: `Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374`,
    TRANSUNION: `TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016`,
  };
  return addresses[bureau.toUpperCase()] || bureau;
}

function generateLetter(stage: DisputeTemplateStage, data: any): string {
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const header = `${data.fullName}\n${data.address}\n${data.city}, ${data.state} ${data.zip}\n\n${date}\n\n${getBureauAddress(data.bureau)}\n\n`;

  switch (stage) {
    case 'INVESTIGATION_REQUEST':
      return header + `Re: Investigation Request Under 15 U.S.C. Sec. 1681i(a)

To Whom It May Concern:

I am writing to dispute the accuracy of information on my credit report. Under the Fair Credit Reporting Act, I have the right to request an investigation of information I believe to be inaccurate.

Account Name: ${data.creditorName}
Account Number: ${data.accountNumber || 'Unknown'}
Dispute Reason: ${data.disputeReason}
${data.customReason ? `Additional Details: ${data.customReason}` : ''}

I am requesting verification of every element of this account. Under the FCRA, I understand you are required to complete this investigation within 30 days.

Sincerely,
${data.fullName}`;

    case 'PERSONAL_INFO_REMOVER':
      return header + `Re: Request to Remove Outdated Personal Information

To Whom It May Concern:

I am writing to request the removal of outdated and incorrect personal information from my credit file under the FCRA.

Account Being Disputed:
Account Name: ${data.creditorName}
Account Number: ${data.accountNumber || 'Unknown'}

Please verify this information and update my credit file accordingly.

Sincerely,
${data.fullName}`;

    case 'VALIDATION_OF_DEBT':
      return header + `Re: Validation of Debt Request - ${data.creditorName}

To Whom It May Concern:

I am disputing this debt and requesting validation pursuant to the FDCPA and FCRA.

Account Name: ${data.creditorName}
Account Number: ${data.accountNumber || 'Unknown'}

Please provide verification of the amount claimed, original creditor documentation, and proof this account belongs to me.

Sincerely,
${data.fullName}`;

    case 'FACTUAL_LETTER':
      return header + `Re: Factual Dispute - Request for Investigation

To Whom It May Concern:

I am writing to dispute specific factual errors on my credit report.

Account Name: ${data.creditorName}
Account Number: ${data.accountNumber || 'Unknown'}
Factual Errors: ${data.disputeReason}

I request a thorough reinvestigation of this account.

Sincerely,
${data.fullName}`;

    case 'TERMINATION_LETTER':
      return header + `Re: Final Request for Investigation - ${data.creditorName}

To Whom It May Concern:

This is my final request regarding the disputed account. I have previously submitted dispute letters and am requesting your prompt attention to this matter.

Account Name: ${data.creditorName}
Account Number: ${data.accountNumber || 'Unknown'}

I am aware of my rights under the FCRA to file complaints with consumer protection agencies if necessary.

Sincerely,
${data.fullName}`;

    default:
      return 'Invalid template stage';
  }
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
      message: 'Valid API key required. Access dispute generation through the RiseOra application.',
    });
  }

  try {
    const { templateStage, userData } = req.body;

    if (!templateStage || !DISPUTE_TEMPLATE_STAGES.includes(templateStage)) {
      return res.status(400).json({ 
        error: 'Invalid template stage',
        validStages: DISPUTE_TEMPLATE_STAGES.filter(s => s !== 'AI_ESCALATION'),
      });
    }

    if (templateStage === 'AI_ESCALATION') {
      return res.status(403).json({
        error: 'AI_ESCALATION requires authenticated dashboard access',
      });
    }

    if (!userData?.fullName || !userData?.creditorName || !userData?.bureau || !userData?.disputeReason) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['fullName', 'address', 'city', 'state', 'zip', 'creditorName', 'bureau', 'disputeReason'],
      });
    }

    const letterContent = generateLetter(templateStage as DisputeTemplateStage, userData);

    return res.status(200).json({
      success: true,
      templateStage,
      letterContent,
    });
  } catch (error) {
    console.error('Error generating letter:', error);
    return res.status(500).json({ error: 'Failed to generate letter' });
  }
}
