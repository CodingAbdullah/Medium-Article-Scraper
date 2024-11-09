import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { DOMParser } from 'xmldom';
import filterMediaTags from '../utilFunctions/filterMediaTags';
import filterStyleTags from '../utilFunctions/filterStyleTags';

// Middleware function for verifying article links
export const verifyArticleLink = async (req: Request, res: Response, next: NextFunction) => {
    const { url } = JSON.parse(req.body.body);

    // Check if the URL is from Medium
    if (!url || new URL(url).hostname !== 'medium.com') {
        return res.status(400).json({ error: 'Invalid Medium article URL' }); // Return error response
    }

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
        const articleDOM = String(response.data);

        // Extract the content within the <article></article> tags that is where the article begins
        let articleText = articleDOM.substring(articleDOM.indexOf('<article>'), articleDOM.indexOf('</article>')) + '</article>';

        // Filter out media and style tags from article
        articleText = filterMediaTags(['figure', 'svg', 'button'], articleText, [9, 6, 9]);
        articleText = filterStyleTags(articleText);

        // Start from the root node of the article using the <article> tag
        const articleDOMRootNode = parser.parseFromString(articleText, 'text/html').documentElement;

        // If no children exist, invalid article
        // Return status 400 as response
        if (!articleDOMRootNode.hasChildNodes()) {
            return res.status(400).json({ error: 'Invalid article content' });
        } 
        else {
            // If valid article, pass control to next function
            // Attach document to request body and proceed
            req.body.body = { htmlDocument: articleDOMRootNode, url };
            next();
        }
    } 
    catch (err) {
        res.status(400).json({
            message: "Could not process request at this time. ERROR: " + err
        });
    }
};