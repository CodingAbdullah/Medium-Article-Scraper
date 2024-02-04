"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PunctuationQueue_1 = __importDefault(require("../dataTypes/PunctuationQueue"));
// Initialize an empty Queue for working with punctuation
let punctuationQueue = new PunctuationQueue_1.default();
function insertPunctuation(articleText) {
    // Populate Punctuation Queue for insertion later
    for (let i = 0; i < articleText.length; i++) {
        if (['.', '?', '!'].includes(articleText.charAt(i))) {
            punctuationQueue.push(articleText.charAt(i));
        }
    }
    // Now, further format the article text, create an array of sentences with Punctuation ending
    // Add the relevant Punctuation using the Punctuation Queue from above
    let articleSentencesArray = articleText.split(/[.?!]/g);
    let FINAL_FORMATTED_ARTICLE_TEXT = '';
    // For each sentence, insert Punctuation using the Punctuation Queue
    for (let i = 0; i < articleSentencesArray.length; i++) {
        let latestPunctuation = punctuationQueue.pop() || '';
        // If not defined, continue to next sentence
        if (latestPunctuation === '') {
            continue;
        }
        else {
            articleSentencesArray[i] += latestPunctuation;
        }
    }
    // Now add newline on the three sentence ending Punctuations: Period, Question Mark, Exclamation Mark
    for (let j = 0; j < articleSentencesArray.length; j++) {
        // Append the current sentence and add the newline character
        FINAL_FORMATTED_ARTICLE_TEXT += articleSentencesArray[j];
        FINAL_FORMATTED_ARTICLE_TEXT += '\n';
    }
    // Return the final formatted text to be written to a text file
    return FINAL_FORMATTED_ARTICLE_TEXT;
}
exports.default = insertPunctuation;
