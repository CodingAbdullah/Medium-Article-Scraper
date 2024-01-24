import { Request, Response, NextFunction } from 'express';
import { isPayWalled } from '../util/articleCheck';
import scraperapi from 'scraperapi-sdk';

// Middleware function for verifying if article is sufficient
// Verify URL of the Medium article
// Pass in the URL to the Web Scraper API
// Verify the response
// Check to see if article is paywalled, in each of these scenarios, throw a response
// If not, attach the article text to the request body and forward the request to the next middleware
export const verifyFile = (req: Request, res: Response, next: NextFunction) => {
    const { URL } = JSON.parse(req.body.body);

    const scraperapiClient = scraperapi(process.env.WEB_SCRAPER_API_KEY);

    // If URL is valid, make call to Web Scraper API
    if (String(URL).includes('medium.com')){
        scraperapiClient.get(URL)
        .then((response: any) => {
            // If not paywalled, proceed with request
            if (!isPayWalled(response.data)){
                req.body.body.htmlDocument = isPayWalled(response.data); // Attach parsed HTML document to request body
                next(); // Move control to the middleware function after attaching text to document
            }
            else {
                res.status(400).json({
                    message: "Medium article is paywalled!"
                });
            }
        })
        .catch((err: any) => {
            res.status(400).json({
                message: "Could not scrape Medium article! ERROR: " + err 
            });
        })
    }
    else {
        res.status(400).json({
            message: "Invalid Medium article URL"
        });
    }
}