import { Request, Response } from "express";
import generateArticleText from "../utilFunctions/generateArticleText";
import insertPunctuation from "../utilFunctions/insertPunctuation";
import { uploadTextFile } from "../utilFunctions/uploadTextFile";
import { uploadTTSFile } from "../utilFunctions/uploadTTSFile";

export const createFileController = async (req: Request, res: Response) => {
    const { htmlDocument, audioFileVoiceOption, textFileOption, audioFileOption } = req.body;

    // Start text concatenation process using NodeList and recursion with generateArticleText
    let fileText = generateArticleText(htmlDocument);
          
    // Add punctuation to the article text where appropriate using the insertPunctuation function
    // Return the final formatted string to be written to text file
    let punctuationInsertedText = insertPunctuation(fileText);

    // Check if the user requests both the text file and the audio file
    // Proceed with each of the two scenarios: audio + text or text only, text is always generated
    if (textFileOption && audioFileOption) {
      let textFileUploadStatus = await uploadTextFile(punctuationInsertedText);
      let audioFileUploadStatus = await uploadTTSFile(punctuationInsertedText, audioFileVoiceOption);

      if (textFileUploadStatus[0] && audioFileUploadStatus[0]) {
        res.status(201).json({
          uploadURL: [
            "https://" + process.env.AWS_BUCKET_NAME + '.s3-' + process.env.AWS_REGION + '.amazonaws.com/' + textFileUploadStatus[1] + '.txt',
            "https://" + process.env.AWS_BUCKET_NAME + '.s3-' + process.env.AWS_REGION + '.amazonaws.com/' + textFileUploadStatus[1] + '.mp3'
          ]
        });
      }
      else {
        res.status(400).json({
          message: "Could not create/upload the requested files"
        });
      }
    }
    // By default, the text file is always created
    else {
      let textFileUploadStatus = await uploadTextFile(punctuationInsertedText);
      if (textFileUploadStatus[0]) {
        res.status(201).json({
          uploadURL: ["https://" + process.env.AWS_BUCKET_NAME + '.s3-' + process.env.AWS_REGION + '.amazonaws.com/' + textFileUploadStatus[1] + '.txt']
        });
      }
      else {
        res.status(400).json({
          message: "Could not create/upload text file"
        });
      }
    }
}