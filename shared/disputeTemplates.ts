// 5-Step Dispute Letter Templates based on Credit Team Playbook
// Each template follows FCRA compliance guidelines

export const DISPUTE_TEMPLATE_STAGES = [
  'INVESTIGATION_REQUEST',
  'PERSONAL_INFO_REMOVER', 
  'VALIDATION_OF_DEBT',
  'FACTUAL_LETTER',
  'TERMINATION_LETTER',
  'AI_ESCALATION',
] as const;

export type DisputeTemplateStage = typeof DISPUTE_TEMPLATE_STAGES[number];

export interface DisputeTemplateData {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  ssn4?: string;
  birthYear?: string;
  creditorName: string;
  accountNumber?: string;
  bureau: string;
  disputeReason: string;
  customReason?: string;
  balance?: string;
  dateOpened?: string;
}

export const TEMPLATE_DESCRIPTIONS: Record<DisputeTemplateStage, { title: string; description: string; waitDays: number }> = {
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
    description: "Final demand for removal citing continued reporting violations and potential legal action.",
    waitDays: 15,
  },
  AI_ESCALATION: {
    title: "AI-Generated Escalation",
    description: "Custom escalation letter generated based on dispute history and responses.",
    waitDays: 0,
  },
};

// Template 1: Investigation Request Letter
export function generateInvestigationRequestLetter(data: DisputeTemplateData): string {
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  return `${data.fullName}
${data.address}
${data.city}, ${data.state} ${data.zip}

${date}

${getBureauAddress(data.bureau)}

Re: Investigation Request Under 15 U.S.C. Sec. 1681i(a)

To Whom It May Concern:

I received a copy of my credit report with the intention of trying to improve my credit and take care of my responsibilities. I noticed a few accounts that I wanted a little more explanation on. I am not saying they are reporting right or wrong. I am just saying that I am not 100 percent sure if they are.

I also read something called the Fair Credit Reporting Act where it said by law, I had rights to challenge anything I am not sure is accurate. Some of the people reporting things on me, I have never heard of which made me write to you all.

Under 15 U.S.C. Sec. 1681i(a), I understand that you are required to conduct a reasonable investigation into the accuracy of disputed information. I am requesting that you investigate this account and provide me with documentation of your findings. I understand you have 30 days to complete this investigation.

Please investigate the following account for accuracy:

Account Name: ${data.creditorName}
Account Number: ${data.accountNumber || 'Unknown'}
Dispute Reason: ${data.disputeReason}
${data.customReason ? `Additional Details: ${data.customReason}` : ''}

I am requesting verification of every element of this account. Under the FCRA, I understand you are required to complete this investigation within 30 days and provide me with the results of your investigation.

Sincerely,

${data.fullName}

Enclosures:
- Copy of government-issued ID
- Proof of address (utility bill or bank statement)`;
}

// Template 2: Personal Information Removal Letter
export function generatePersonalInfoRemoverLetter(data: DisputeTemplateData): string {
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  return `${data.fullName}
${data.address}
${data.city}, ${data.state} ${data.zip}

${date}

${getBureauAddress(data.bureau)}

Re: Request to Remove Outdated Personal Information

To Whom It May Concern:

I am writing to request the removal of outdated and incorrect personal information from my credit file. Under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681e(b), consumer reporting agencies are required to follow reasonable procedures to assure maximum possible accuracy of the information concerning the individual about whom the report relates.

The following personal information on my credit file is outdated, incorrect, or no longer applicable:

Current Account Being Disputed:
Account Name: ${data.creditorName}
Account Number: ${data.accountNumber || 'Unknown'}

I am requesting that you verify this information and remove any data that cannot be verified as accurate. Under the FCRA, you are required to investigate this dispute within 30 days.

Please update my credit file accordingly and send me an updated copy of my credit report showing the corrections.

Sincerely,

${data.fullName}

Enclosures:
- Copy of government-issued ID
- Proof of current address`;
}

// Template 3: Validation of Debt Letter  
export function generateValidationOfDebtLetter(data: DisputeTemplateData): string {
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  return `${data.fullName}
${data.address}
${data.city}, ${data.state} ${data.zip}

${date}

${getBureauAddress(data.bureau)}

Re: Validation of Debt Request - ${data.creditorName}

To Whom It May Concern:

I am writing in response to the account listed on my credit report. I am disputing this debt and requesting validation pursuant to the Fair Debt Collection Practices Act (FDCPA), 15 U.S.C. § 1692g, and the Fair Credit Reporting Act (FCRA).

Account Name: ${data.creditorName}
Account Number: ${data.accountNumber || 'Unknown'}
${data.balance ? `Reported Balance: ${data.balance}` : ''}

Please provide the following validation:

1. Verification of the amount claimed to be owed
2. The name and address of the original creditor
3. A copy of the original signed contract or agreement bearing my signature
4. Complete payment history from the original creditor
5. Proof that you have the legal right to collect this debt
6. Documentation showing the debt has not passed the statute of limitations
7. Proof that this account belongs to me and not another individual

I understand that under the FDCPA, you have 30 days to provide this validation. I am requesting that you investigate this matter thoroughly and provide documentation supporting the accuracy of this account.

I would appreciate your timely response with the requested verification documents.

Sincerely,

${data.fullName}`;
}

// Template 4: Factual Dispute Letter
export function generateFactualLetter(data: DisputeTemplateData): string {
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  return `${data.fullName}
${data.address}
${data.city}, ${data.state} ${data.zip}

${date}

${getBureauAddress(data.bureau)}

Re: Factual Dispute - Request for Removal

To Whom It May Concern:

I am writing to dispute the following account that appears on my credit report. After reviewing my records, I have identified specific factual errors that require immediate correction.

Account Name: ${data.creditorName}
Account Number: ${data.accountNumber || 'Unknown'}

FACTUAL ERRORS IDENTIFIED:

${data.disputeReason}

${data.customReason ? `Additional Documentation: ${data.customReason}` : ''}

Under the Fair Credit Reporting Act, Section 611 (15 U.S.C. § 1681i), you are required to conduct a reasonable investigation into the accuracy of this information. The information I am disputing is demonstrably inaccurate based on the facts presented above.

I am requesting that you:
1. Conduct a thorough reinvestigation of this account
2. Contact the data furnisher to verify each element of this account
3. Remove this account if any information cannot be verified as accurate
4. Provide me with documentation of your investigation results

Please complete your investigation within the 30-day timeframe required by law and notify me of your findings.

Sincerely,

${data.fullName}

Enclosures:
- Copy of government-issued ID
- Supporting documentation`;
}

// Template 5: Termination / Final Demand Letter
export function generateTerminationLetter(data: DisputeTemplateData): string {
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  return `${data.fullName}
${data.address}
${data.city}, ${data.state} ${data.zip}

${date}

${getBureauAddress(data.bureau)}

Re: FINAL DEMAND FOR REMOVAL - Continued FCRA Violation
Account: ${data.creditorName}

To Whom It May Concern:

This letter serves as my FINAL DEMAND for the immediate removal of the following account from my credit report.

Account Name: ${data.creditorName}
Account Number: ${data.accountNumber || 'Unknown'}

DISPUTE HISTORY:
I have previously submitted multiple dispute letters regarding this account. Despite my repeated requests for proper investigation and verification, this account continues to appear on my credit report with inaccurate information.

FCRA VIOLATIONS:
Your continued reporting of unverified and inaccurate information constitutes a violation of the Fair Credit Reporting Act, specifically:

1. 15 U.S.C. § 1681e(b) - Failure to follow reasonable procedures to assure maximum possible accuracy
2. 15 U.S.C. § 1681i - Failure to conduct a proper reinvestigation
3. 15 U.S.C. § 1681s-2 - Continued reporting of information known to be inaccurate

DEMAND:
I hereby demand that you immediately:
1. DELETE this account from my credit file
2. Cease reporting this inaccurate information
3. Provide written confirmation of deletion within 15 days

NOTICE:
I am aware of my rights under the FCRA to file complaints with consumer protection agencies if I believe my rights have been violated. I understand that the CFPB and FTC accept consumer complaints regarding credit reporting issues.

I am requesting your prompt attention to this matter and a thorough review of the documentation supporting this account.

Sincerely,

${data.fullName}`;
}

// Helper function to get bureau mailing address
function getBureauAddress(bureau: string): string {
  const addresses: Record<string, string> = {
    EXPERIAN: `Experian
P.O. Box 4500
Allen, TX 75013`,
    EQUIFAX: `Equifax Information Services LLC
P.O. Box 740256
Atlanta, GA 30374`,
    TRANSUNION: `TransUnion LLC
Consumer Dispute Center
P.O. Box 2000
Chester, PA 19016`,
  };
  
  return addresses[bureau.toUpperCase()] || bureau;
}

// Main function to generate letter based on stage
export function generateDisputeLetter(
  stage: DisputeTemplateStage,
  data: DisputeTemplateData
): string {
  switch (stage) {
    case 'INVESTIGATION_REQUEST':
      return generateInvestigationRequestLetter(data);
    case 'PERSONAL_INFO_REMOVER':
      return generatePersonalInfoRemoverLetter(data);
    case 'VALIDATION_OF_DEBT':
      return generateValidationOfDebtLetter(data);
    case 'FACTUAL_LETTER':
      return generateFactualLetter(data);
    case 'TERMINATION_LETTER':
      return generateTerminationLetter(data);
    case 'AI_ESCALATION':
      // AI escalation is handled separately with OpenAI
      return '';
    default:
      return generateInvestigationRequestLetter(data);
  }
}

// Get next stage in the dispute process
export function getNextTemplateStage(currentStage: DisputeTemplateStage | null): DisputeTemplateStage | null {
  if (!currentStage) return 'INVESTIGATION_REQUEST';
  
  const currentIndex = DISPUTE_TEMPLATE_STAGES.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex >= DISPUTE_TEMPLATE_STAGES.length - 1) {
    return null;
  }
  
  return DISPUTE_TEMPLATE_STAGES[currentIndex + 1];
}
