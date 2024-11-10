import { NextRequest, NextResponse } from 'next/server'; // Add this import
import { uploadTextFile } from "../../utilFunctions/uploadTextFile";
import { uploadTTSFile } from "../../utilFunctions/uploadTTSFile";
import { uploadInsightsFile } from '../../utilFunctions/uploadInsightsFile';
import { uploadFireCrawlInfo } from '../../utilFunctions/uploadFireCrawlInfo';
import UploadURLDataType from "../../dataTypes/UploadURLDataType";
import generateArticleText from "../../utilFunctions/generateArticleText";
import insertPunctuation from "../../utilFunctions/insertPunctuation";
import { verifyArticleLink } from "../../utilFunctions/verifyArticleLink";

// Helper function to construct S3 URLs
const constructS3Url = (fileName: string, extension: string) => 
    `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileName}.${extension}`;

// POST request for working with scraping data
export async function POST(req: NextRequest) {
    const { url } = await req.json(); // Correctly access the parsed JSON body
    const uploadURL: UploadURLDataType = { textURL: '', audioURL: '', insightsURL: '', fireCrawlURL: '' };

    try {
        const verifiedInformation = await verifyArticleLink(url);
        const fileText = generateArticleText(verifiedInformation.htmlDocument);
        const punctuationInsertedText = insertPunctuation(fileText);

        // Upload files in parallel
        const textFileUploadStatus = await uploadTextFile(punctuationInsertedText);
        if (!textFileUploadStatus || !textFileUploadStatus[1]) {
            throw new Error('Text file upload failed');
        }
        else {
            uploadURL.textURL = constructS3Url(`Medium-Article-${textFileUploadStatus[1]}`, 'txt');
        }

        const [audioFileUploadStatus, insightsFileUploadStatus, uploadFireCrawlInfoStatus] = await Promise.all([
            uploadTTSFile(punctuationInsertedText, textFileUploadStatus[1]),
            uploadInsightsFile(punctuationInsertedText, textFileUploadStatus[1]),
            uploadFireCrawlInfo(url, textFileUploadStatus[1])
        ]);

        // Construct URLs
        uploadURL.textURL = constructS3Url(`Medium-Article-${textFileUploadStatus[1]}`, 'txt');
        uploadURL.audioURL = audioFileUploadStatus ? constructS3Url(`audio-${audioFileUploadStatus[1]}`, 'mp3') : '';
        uploadURL.insightsURL = insightsFileUploadStatus ? constructS3Url(`insights-${textFileUploadStatus[1]}`, 'txt') : '';
        uploadURL.fireCrawlURL = uploadFireCrawlInfoStatus ? constructS3Url(`firecrawl-${textFileUploadStatus[1]}`, 'json') : '';

        return NextResponse.json(uploadURL); // Return a JSON response
    } 
    catch {
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 }); // Return an error response
    }
}