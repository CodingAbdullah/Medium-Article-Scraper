"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyArticleLink = void 0;
const filterMediaTags_1 = __importDefault(require("../utilFunctions/filterMediaTags"));
const filterStyleTags_1 = __importDefault(require("../utilFunctions/filterStyleTags"));
const xmldom_1 = require("xmldom");
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config(); // Configuring environment variables
// Middleware function for verifying article
// Verify URL of the Medium article
// Check to see if article is paywalled, in each of these scenarios, throw a response
// If not, attach the article text to the request body and forward the request to the next middleware
const verifyArticleLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { articleLink } = JSON.parse(req.body.body);
    let parser = new xmldom_1.DOMParser(); // Initiate parser
    // Set your options for making API request
    const options = {
        method: 'GET',
        url: process.env.WEB_SCRAPER_URL,
        params: {
            url: articleLink.trim(),
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
        const response = yield axios_1.default.request(options);
        const articleDOM = String(response.data);
        // Extract the content within the <article></article> tags that is where the article begins
        let articleText = articleDOM.substring(articleDOM.indexOf('<article>'), articleDOM.indexOf('</article>')) + '</article>';
        // Filter out media and style tags from article
        articleText = (0, filterMediaTags_1.default)(['figure', 'svg', 'button'], articleText, [9, 6, 9]);
        articleText = (0, filterStyleTags_1.default)(articleText);
        // Start from the root node of the article using the <article> tag
        const articleDOMRootNode = parser.parseFromString(articleText, 'text/html').documentElement;
        // If no children exist, invalid article
        // Return status 400 as response
        if (!articleDOMRootNode.hasChildNodes()) {
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
});
exports.verifyArticleLink = verifyArticleLink;
