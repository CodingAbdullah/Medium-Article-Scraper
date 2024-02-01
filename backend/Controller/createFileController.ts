import { Request, Response } from "express";
import generateArticleText from "../utilFunctions/generateArticleText";
import insertPunctuation from "../utilFunctions/insertPunctuation";
import { uploadTextFile } from "../utilFunctions/uploadTextFile";
import { uploadTTSFile } from "../utilFunctions/uploadTTSFile";
import UploadURLDataType from "../dataTypes/UploadURLDataType";
import * as dotenv from 'dotenv';

dotenv.config(); // Configuring environment variables

export const createFileController = async (req: Request, res: Response) => {
    const { htmlDocument, audioFileVoiceOption, textFileOption, audioFileOption } = req.body.body;
    
    // Incorporating the UploadURLDataType to efficiently pass back data to the client
    let uploadURL: UploadURLDataType = { textURL: '', audioURLs: [], audioFileQuantity: 0 }

    // Start text concatenation process using NodeList and recursion with generateArticleText
    let fileText = generateArticleText(htmlDocument);
          
    // Add punctuation to the article text where appropriate using the insertPunctuation function
    // Return the final formatted string to be written to text file
    let punctuationInsertedText = insertPunctuation(fileText);

    // Check if the user requests both the Text file and the Audio file
    // Proceed with each of the two scenarios: Audio + Text or Text only, Text is always generated
    if (textFileOption && audioFileOption) {
      let textFileUploadStatus = await uploadTextFile(punctuationInsertedText);
      let audioFileUploadStatus = await uploadTTSFile(punctuationInsertedText, textFileUploadStatus[1], { voice: audioFileVoiceOption });
      
      // File is too large to process for Audio purposes
      if (textFileUploadStatus[0] && audioFileUploadStatus[0] && audioFileUploadStatus[2] === -1){
        // Set audioFileQuantity to -1 to indicate Audio file is too large, but send back Text file
        uploadURL.textURL = "https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + textFileUploadStatus[1] + '.txt',
        uploadURL.audioFileQuantity = -1;
        
        res.status(201).json({
          uploadURL
        });
      }
      // Set audioFileQuantity to number of file parts and send back the text and audio file parts
      else if (textFileUploadStatus[0] && audioFileUploadStatus[0] && audioFileUploadStatus[2] > 0) {
        uploadURL.textURL = "https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + textFileUploadStatus[1] + ".txt";
        uploadURL.audioFileQuantity = audioFileUploadStatus[2];

        for (var i = 1; i <= audioFileUploadStatus[2]; i++) {
          uploadURL.audioURLs.push("https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + audioFileUploadStatus[1] + `-part-${i}.mp3`);
        }

        // Send back response containing list of URLs for accessing the text and audio files
        res.status(201).json({
          uploadURL
        });
      }
      else if (textFileUploadStatus[0] && audioFileUploadStatus[0]) {
        // Status equates to 0 as the request processes as is
        uploadURL.textURL = "https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + textFileUploadStatus[1] + '.txt';
        uploadURL.audioURLs.push("https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + audioFileUploadStatus[1] + '.mp3');
        uploadURL.audioFileQuantity = 1;

        res.status(201).json({
          uploadURL
        });
      }
      else {
        res.status(400).json({
          message: "Could not create/upload the requested files"
        });
      }
    }
    // By default, the Text file is always created so check to see if one is created and send it back
    else {
      let textFileUploadStatus = await uploadTextFile(punctuationInsertedText);
      if (textFileUploadStatus[0]) {
        uploadURL.textURL = "https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + textFileUploadStatus[1] + '.txt';
        res.status(201).json({
          uploadURL
        });
      }
      else {
        res.status(400).json({
          message: "Could not create/upload text file"
        });
      }
    }
}