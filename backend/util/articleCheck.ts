// Check the validity of the article
// Function to be used to determine if article is paywalled
// Do this by using the DOMParser to parse the HTML document provided by the Web Scraper API
// Initialize DOMParser and invoke the built-in parseFromString function
import { DOMParser } from "xmldom";

export function isPayWalled(documentText: string): boolean | Document {
    const domParser = new DOMParser();
    let string = domParser.parseFromString(documentText, 'application/xml'); // Specify type

    // More to go here...
    return false;
}