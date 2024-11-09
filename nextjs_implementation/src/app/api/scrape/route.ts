import { NextRequest, NextResponse } from 'next/server';
import { verifyArticleLink } from '../../middleware/verifyArticleLink';
import { scrape } from '../../utilFunctions/scrape';

// POST request for working with scraping data
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const mockReq: any = {
            body: { body: JSON.stringify(body) }
        };

        let mockRes: any = {
            status: function(code: number) {
                this.statusCode = code;
                return this;
            },
            json: function(data: any) {
                this.data = data;
                return this;
            }
        };

        // Call the middleware to verify the article link
        await new Promise((resolve, reject) => {
            verifyArticleLink(mockReq, mockRes, (error?: any) => {
                if (error) reject(error); // Reject if there's an error
                if (mockRes.statusCode === 400) reject(mockRes.data); // Reject if status is 400
                resolve(true); // Resolve if everything is fine
            });
        });

        // If middleware passes, process the scrape
        const result = await new Promise((resolve, reject) => {
            scrape(mockReq, mockRes);
            if (mockRes.statusCode === 400) reject(mockRes.data); // Reject if scrape fails
            resolve(mockRes.data); // Resolve with the scrape result
        });

        return NextResponse.json(result, { status: 201 }); // Return success response
    } 
    catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to process article' }, // Return error message
            { status: 400 } // Set status to 400 for errors
        );
    }
}