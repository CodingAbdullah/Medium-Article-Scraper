import { Request, Response } from "express";
import axios from 'axios';
import fs from 'fs';
import { DOMParser } from "xmldom";
import concatenateArticleText from "../util/concatenateArticleString";
import filterMediaTags from "../util/filterMediaTags";
import filterStyleTags from "../util/filterStyleTags";
  
// Invoke this function and make use of the documentParser util function
export const fileGenerator = async (req: Request, res: Response) => {
    // const { htmlDocument, fileOptions }  = JSON.parse(req.body.body); // Request reaches here will always have htmlDocument attached

    // Check to see what file options the user requested
    // If none, simply generate the audio file
    // Options to be added here...
    // Invoke the DOMParser()
    const parser = new DOMParser();

    // Make request to fetch html document from the requested website URL
    try {
        const response = await axios.request(options);
        let responseString = String(response.data);
        let indexOfBodyTag = responseString.indexOf('<article>');
        let indexOfBodyEndTag = responseString.indexOf('</article>');
        let responseSubString = responseString.substring(indexOfBodyTag, indexOfBodyEndTag) + '</article>';

        // Filter out media and style tags from article
        responseSubString = filterMediaTags(['figure', 'svg', 'button'], responseSubString, [9, 6, 9]);
        responseSubString = filterStyleTags(responseSubString);

        // After the filtering process, pass in filtered article to DOMParser for Document NodeList
        const nodeString = parser.parseFromString(responseSubString, 'text/html');
        const rootElement = nodeString.documentElement; // Get the root element of the article
        
        // Start the text concatenation process using the NodeList and recursion with function
        let articleString = concatenateArticleText(rootElement);
        
        // Write text to file
        // More to go here.. (audio/text file)
        fs.writeFile('response2.txt', articleString, () => { return }); 
    }
    catch (error) {
        console.error(error);
    }
}