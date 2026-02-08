import pRetry from 'p-retry';

const DOCUMINT_API_KEY = process.env.DOCUMINT_API_KEY;
const DOCUMINT_BASE_URL = 'https://api.documint.me/v2';

export interface DocumintGenerationResponse {
    url: string;
    documentId: string;
}

/**
 * Generates a PDF document using Documint API.
 * @param templateId The Documint template ID
 * @param data The data to merge into the template
 * @returns The URL of the generated document
 */
export async function generatePdf(templateId: string, data: Record<string, any>): Promise<DocumintGenerationResponse> {
    if (!DOCUMINT_API_KEY) {
        throw new Error('DOCUMINT_API_KEY is not configured');
    }

    return pRetry(async () => {
        const response = await fetch(`${DOCUMINT_BASE_URL}/templates/${templateId}/documents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': DOCUMINT_API_KEY!,
            },
            body: JSON.stringify({
                data,
                name: `dispute_letter_${Date.now()}.pdf`,
                save: true,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Documint API error (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        return {
            url: result.url,
            documentId: result.id,
        };
    }, {
        retries: 3,
        onFailedAttempt: error => {
            console.warn(`Documint generation attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`);
        },
    });
}
