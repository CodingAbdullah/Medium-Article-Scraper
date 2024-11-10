import { Request, Response } from "express";
import { uploadTextFile } from "./uploadTextFile";
import { uploadTTSFile } from "./uploadTTSFile";
import { uploadInsightsFile } from './uploadInsightsFile';
import { uploadFireCrawlInfo } from './uploadFireCrawlInfo';
import UploadURLDataType from "../dataTypes/UploadURLDataType";
import generateArticleText from "./generateArticleText";
import insertPunctuation from "./insertPunctuation";

// Custom function for scraping
export const scrape = async (req: Request, res: Response) => {
    const { htmlDocument, url } = req.body.body;
    
    // Incorporating the UploadURLDataType to efficiently pass back data to the client
    const uploadURL: UploadURLDataType = { textURL: '', audioURL: '', insightsURL: '', fireCrawlURL: '' };

    // Start text concatenation process using NodeList and recursion with generateArticleText
    const fileText = generateArticleText(htmlDocument);
          
    // Add punctuation to the article text where appropriate using the insertPunctuation function
    // Return the final formatted string to be written to text file
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