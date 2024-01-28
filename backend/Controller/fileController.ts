import { Request, Response } from "express";
import fs from 'fs';
import generateArticleText from "../utilFunctions/generateArticleText";
import insertPunctuation from "../utilFunctions/insertPunctuation";

export const fileGenerator = async (req: Request, res: Response) => {
    const { htmlDocument, audioFileVoiceOption, textFileOption, audioFileOption }  = req.body;

      // Start text concatenation process using NodeList and recursion with generateArticleText
      let fileText = generateArticleText(htmlDocument);
          
      // Add punctuation to the article text where appropriate using the insertPunctuation function
      // Return the final formatted string to be written to text file
      let punctuationInsertedText = insertPunctuation(fileText);

      // Write text to file
      // More to go here.. (audio/text file)
      fs.writeFile('response2.txt', punctuationInsertedText, () => { return });
}