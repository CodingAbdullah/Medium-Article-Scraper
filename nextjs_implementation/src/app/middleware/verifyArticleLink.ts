import { Request, Response, NextFunction } from 'express';
import filterMediaTags from '../utilFunctions/filterMediaTags';
import filterStyleTags from '../utilFunctions/filterStyleTags';
import { DOMParser } from 'xmldom';
import axios from 'axios';

// Middleware function for verifying article
// Verify URL of the Medium article
// Check to see if article is paywalled, in each of these scenarios, throw a response
// If not, attach the article text to the request body and forward the request to the next middleware
export const verifyArticleLink = async (req: Request, res: Response, next: NextFunction) => {
    const { url } = JSON.parse(req.body.body);

    let parser = new DOMParser(); // Initiate parser

    // Set your options for making API request
    const options = {
        method: 'GET',
        url: process.env.WEB_SCRAPER_URL,
        params: {
          url: url.trim(),
          response_format: 'html'
        },
        headers: {
          'X-RapidAPI-Key': process.env.WEB_SCRAPER_API_KEY,
          'X-RapidAPI-Host': process.env.WEB_SCRAPER_HOST
        }
    };

    try {
        // Run check to see if article link matches Medium.com domain
        // If so, make request to fetch HTML document from requested article URL
        const response = await axios.request(options);
        const articleDOM =  String(response.data);

        // Extract the content within the <article></article> tags that is where the article begins
        let articleText = articleDOM.substring(articleDOM.indexOf('<article>'), articleDOM.indexOf('</article>')) + '</article>';        

        // Filter out media and style tags from article
        articleText = filterMediaTags(['figure', 'svg', 'button'], articleText, [9, 6, 9]);
        articleText = filterStyleTags(articleText);

        // Start from the root node of the article using the <article> tag
        const articleDOMRootNode = parser.parseFromString(articleText, 'text/html').documentElement;

        // If no children exist, invalid article
        // Return status 400 as response
        if (!articleDOMRootNode.hasChildNodes()){
            res.status(400).json();
        }
        else {
            // If valid article, pass control to next function
            // Attach document to request body and proceed
            let reqObj = JSON.parse(req.body.body);
            reqObj.htmlDocument = articleDOMRootNode;
            req.body.body = reqObj;
            next();
        }
    }
    catch (err) {
        res.status(400).json({
            message: "Could not process request at this time. ERROR: " + err
        });
    }
}