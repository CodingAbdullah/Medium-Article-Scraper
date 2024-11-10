import { Request, Response } from "express";
import { uploadTextFile } from "./uploadTextFile";
import { uploadTTSFile } from "./uploadTTSFile";
import { uploadInsightsFile } from './uploadInsightsFile';
import { uploadFireCrawlInfo } from './uploadFireCrawlInfo';
import UploadURLDataType from "../dataTypes/UploadURLDataType";
import generateArticleText from "./generateArticleText";
import insertPunctuation from "./insertPunctuation";
import { verifyArticleLink } from "../middleware/verifyArticleLink";

// Custom function for scraping
export const scrape = async (req: Request, res: Response) => {
    const { htmlDocument, url } = req.body.body;
    
    // Incorporating the UploadURLDataType to efficiently pass back data to the client
    const uploadURL: UploadURLDataType = { textURL: '', audioURL: '', insightsURL: '', fireCrawlURL: '' };

    // Start text concatenation process using NodeList and recursion with generateArticleText
    const fileText = generateArticleText(htmlDocument);
          
    // Add punctuation to the article text where appropriate using the insertPunctuation function
    const punctuationInsertedText = insertPunctuation(fileText);

    try {
        // Proceed with creating the text and audio files
        const textFileUploadStatus = await uploadTextFile(punctuationInsertedText);
        const audioFileUploadStatus = await uploadTTSFile(punctuationInsertedText, textFileUploadStatus[1]);
        const insightsFileUploadStatus = await uploadInsightsFile(punctuationInsertedText, textFileUploadStatus[1]);
        const uploadFireCrawlInfoStatus = await uploadFireCrawlInfo(url, textFileUploadStatus[1]);
        
        // Status equates to 0 as the request processes as is
        // Conditionally assign values to the insights and fire crawl URLs
        uploadURL.textURL = "https://" + process.env.S3_BUCKET_NAME + '.s3.' + process.env.REGION + '.amazonaws.com/Medium-Article-' + textFileUploadStatus[1] + '.txt';
        uploadURL.audioURL = "https://" + process.env.S3_BUCKET_NAME + '.s3.' + process.env.REGION + '.amazonaws.com/Medium-Article-' + audioFileUploadStatus[1] + '.mp3';
        uploadURL.insightsURL = insightsFileUploadStatus ? "https://" + process.env.S3_BUCKET_NAME + '.s3' + process.env.REGION + `.amazonaws.com/Medium-Article-insights-${textFileUploadStatus[1]}` + '.txt' : '';
        uploadURL.fireCrawlURL = uploadFireCrawlInfoStatus ? "https://" + process.env.S3_BUCKET_NAME + '.s3' + process.env.REGION + `.amazonaws.com/Medium-Article-firecrawl-${textFileUploadStatus[1]}` + `.json`: '';

        // Return the whole custom object to client
        res.status(201).json({
            uploadURL
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Could not create/upload the requested files: " + error
        });
    }
}

// Mock request and response types for testing
const createMockRequest = (body: any): Request => {
    return {
        body: body,
        // Add any other necessary properties or methods here
        get: () => {},
        header: () => {},
        accepts: () => {},
        acceptsCharsets: () => {},
        // ... other methods and properties as needed
    } as Request;
};

const createMockResponse = (): Response => {
    const res: Partial<Response> = {
        status: (code: number) => {
            res.statusCode = code;
            return res;
        },
        json: (data: any) => {
            res.data = data;
            return res;
        },
    };
    return res as Response;
};

// Example usage of the mock request and response
const mockReq = createMockRequest({ body: { body: "example HTML document" } });
const mockRes = createMockResponse();

// Call the middleware to verify the article link
await new Promise<void>((resolve, reject) => {
    verifyArticleLink(mockReq, mockRes, (error?: Error) => {
        if (error) reject(error); // Reject if there's an error
        if (mockRes.statusCode === 400) reject(mockRes.data); // Reject if status is 400
        resolve(); // Resolve if everything is fine
    });
});