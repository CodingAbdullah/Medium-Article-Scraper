// src/app/api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyArticleLink } from '../../middleware/verifyArticleLink';
import { scrape } from '../../utilFunctions/scrape';

// Define a type for the mock response
interface MockResponse {
    statusCode: number;
    data?: any; // You can replace 'any' with a more specific type if known
    status: (code: number) => MockResponse;
    json: (data: any) => MockResponse;
}

// POST request for working with scraping data
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const mockReq: { body: { body: string } } = {
            body: { body: JSON.stringify(body) }
        };

        const mockRes: MockResponse = {
            statusCode: 200,
            status(code: number) {
                this.statusCode = code;
                return this;
            },
            json(data: any) {
                this.data = data;
                return this;
            }
        };

        // Call the middleware to verify the article link
        await new Promise<void>((resolve, reject) => {
            verifyArticleLink(mockReq, mockRes, (error?: Error) => {
                if (error) reject(error); // Reject if there's an error
                if (mockRes.statusCode === 400) reject(mockRes.data); // Reject if status is 400
                resolve(); // Resolve if everything is fine
            });
        });

        // If middleware passes, process the scrape
        const result = await new Promise<any>((resolve, reject) => {
            scrape(mockReq, mockRes);
            if (mockRes.statusCode === 400) reject(mockRes.data); // Reject if scrape fails
            resolve(mockRes.data); // Resolve with the scrape result
        });

        return NextResponse.json(result, { status: 201 }); // Return success response
    } 
    catch (error: unknown) {
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to process article' }, // Return error message
            { status: 400 } // Set status to 400 for errors
        );
    }
}