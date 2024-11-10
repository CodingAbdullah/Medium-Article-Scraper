import axios from 'axios';
import { DOMParser } from 'xmldom';
import filterMediaTags from './filterMediaTags';
import filterStyleTags from './filterStyleTags';

// Define a type for the return value
interface VerifyArticleLinkResult {
    htmlDocument: Document; // Assuming you want to return a DOM Document
}

// Function for verifying article links
export const verifyArticleLink = async (url: string): Promise<VerifyArticleLinkResult> => {
    // Check if the URL is from Medium
    if (!url || new URL(url).hostname !== 'medium.com') {
        throw new Error("Invalid Article link");
    }

    const parser = new DOMParser(); // Initiate parser

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
        // Make request to fetch HTML document from requested article URL
        const response = await axios.request(options);
        const articleDOM = String(response.data);

        // Extract the content within the <article></article> tags
        let articleText = articleDOM.substring(articleDOM.indexOf('<article>'), articleDOM.indexOf('</article>')) + '</article>';

        // Filter out media and style tags from article
        articleText = filterMediaTags(['figure', 'svg', 'button'], articleText, [9, 6, 9]);
        articleText = filterStyleTags(articleText);

        // Start from the root node of the article using the <article> tag
        const articleDOMRootNode = parser.parseFromString(articleText, 'text/html').documentElement;

        // If no children exist, invalid article
        if (!articleDOMRootNode.hasChildNodes()) {
            throw new Error("Invalid article!");
        } 
        else {
            // If valid article, return the document
            return { htmlDocument: articleDOMRootNode };
        }
    } 
    catch {
        throw new Error('Could not process request');
    }
};