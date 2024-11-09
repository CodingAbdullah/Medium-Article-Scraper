import { Request, Response } from "express";
import generateArticleText from "../utilFunctions/generateArticleText";
import insertPunctuation from "../utilFunctions/insertPunctuation";
import { uploadTextFile } from "../utilFunctions/uploadTextFile";
import { uploadTTSFile } from "../utilFunctions/uploadTTSFile";
import { uploadInsightsFile } from '../utilFunctions/uploadInsightsFile';
import { uploadFireCrawlInfo } from '../utilFunctions/uploadFireCrawlInfo';
import UploadURLDataType from "../dataTypes/UploadURLDataType";

export const scrape = async (req: Request, res: Response) => {
    const { htmlDocument, url } = req.body.body;
    
    // Incorporating the UploadURLDataType to efficiently pass back data to the client
    let uploadURL: UploadURLDataType = { textURL: '', audioURL: '', insightsURL: '', fireCrawlURL: '' };

    // Start text concatenation process using NodeList and recursion with generateArticleText
    let fileText = generateArticleText(htmlDocument);
          
    // Add punctuation to the article text where appropriate using the insertPunctuation function
    // Return the final formatted string to be written to text file
    let punctuationInsertedText = insertPunctuation(fileText);

    try {
        // Proceed with creating the text and audio files
        let textFileUploadStatus = await uploadTextFile(punctuationInsertedText);
        let audioFileUploadStatus = await uploadTTSFile(punctuationInsertedText, textFileUploadStatus[1]);
        let insightsFileUploadStatus = await uploadInsightsFile(punctuationInsertedText, textFileUploadStatus[1]);
        let uploadFireCrawlInfoStatus = await uploadFireCrawlInfo(url, textFileUploadStatus[1]);
        
        // Status equates to 0 as the request processes as is
        // Conditionally assign values to the insights and fire crawl URLs
        uploadURL.textURL = "https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + textFileUploadStatus[1] + '.txt';
        uploadURL.audioURL = "https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + audioFileUploadStatus[1] + '.mp3';
        uploadURL.insightsURL = insightsFileUploadStatus ? "https://" + process.env.AWS_S3_BUCKET_NAME + '.s3' + process.env.AWS_REGION + `.amazonaws.com/Medium-Article-insights-${textFileUploadStatus[1]}` + '.txt' : '';
        uploadURL.fireCrawlURL = uploadFireCrawlInfoStatus ? "https://" + process.env.AWS_S3_BUCKET_NAME + '.s3' + process.env.AWS_REGION + `.amazonaws.com/Medium-Article-firecrawl-${textFileUploadStatus[1]}.json`: '';

        // Return the whole custom object to client
        res.status(201).json({
            uploadURL
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Could not create/upload the requested files"
        });
    }
}