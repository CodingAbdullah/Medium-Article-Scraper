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
exports.createFileController = void 0;
const generateArticleText_1 = __importDefault(require("../utilFunctions/generateArticleText"));
const insertPunctuation_1 = __importDefault(require("../utilFunctions/insertPunctuation"));
const uploadTextFile_1 = require("../utilFunctions/uploadTextFile");
const uploadTTSFile_1 = require("../utilFunctions/uploadTTSFile");
const dotenv = __importStar(require("dotenv"));
dotenv.config(); // Configuring environment variables
const createFileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { htmlDocument, audioFileVoiceOption, textFileOption, audioFileOption } = req.body.body;
    // Incorporating the UploadURLDataType to efficiently pass back data to the client
    let uploadURL = { textURL: '', audioURLs: [], audioFileQuantity: 0 };
    // Start text concatenation process using NodeList and recursion with generateArticleText
    let fileText = (0, generateArticleText_1.default)(htmlDocument);
    // Add punctuation to the article text where appropriate using the insertPunctuation function
    // Return the final formatted string to be written to text file
    let punctuationInsertedText = (0, insertPunctuation_1.default)(fileText);
    // Check if the user requests both the Text file and the Audio file
    // Proceed with each of the two scenarios: Audio + Text or Text only, Text is always generated
    if (textFileOption && audioFileOption) {
        let textFileUploadStatus = yield (0, uploadTextFile_1.uploadTextFile)(punctuationInsertedText);
        let audioFileUploadStatus = yield (0, uploadTTSFile_1.uploadTTSFile)(punctuationInsertedText, textFileUploadStatus[1], { voice: audioFileVoiceOption });
        // File is too large to process for Audio purposes
        if (textFileUploadStatus[0] && audioFileUploadStatus[0] && audioFileUploadStatus[2] === -1) {
            // Set audioFileQuantity to -1 to indicate Audio file is too large, but send back Text file
            uploadURL.textURL = "https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + textFileUploadStatus[1] + '.txt';
            uploadURL.audioFileQuantity = -1;
            res.status(201).json({
                uploadURL
            });
        }
        // Set audioFileQuantity to number of file parts and send back the text and audio file parts
        else if (textFileUploadStatus[0] && audioFileUploadStatus[0] && audioFileUploadStatus[2] > 1) {
            uploadURL.textURL = "https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + textFileUploadStatus[1] + ".txt";
            uploadURL.audioFileQuantity = audioFileUploadStatus[2];
            for (var i = 1; i <= audioFileUploadStatus[2]; i++) {
                uploadURL.audioURLs.push("https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + audioFileUploadStatus[1] + `-part-${i}.mp3`);
            }
            // Send back response containing list of URLs for accessing the text and audio files
            res.status(201).json({
                uploadURL
            });
        }
        else if (textFileUploadStatus[0] && audioFileUploadStatus[0]) {
            // Status equates to 0 as the request processes as is
            uploadURL.textURL = "https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + textFileUploadStatus[1] + '.txt';
            uploadURL.audioURLs.push("https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + audioFileUploadStatus[1] + '.mp3');
            uploadURL.audioFileQuantity = 1;
            res.status(201).json({
                uploadURL
            });
        }
        else {
            res.status(400).json({
                message: "Could not create/upload the requested files"
            });
        }
    }
    // By default, the Text file is always created so check to see if one is created and send it back
    else {
        let textFileUploadStatus = yield (0, uploadTextFile_1.uploadTextFile)(punctuationInsertedText);
        if (textFileUploadStatus[0]) {
            uploadURL.textURL = "https://" + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_REGION + '.amazonaws.com/Medium-Article-' + textFileUploadStatus[1] + '.txt';
            res.status(201).json({
                uploadURL
            });
        }
        else {
            res.status(400).json({
                message: "Could not create/upload text file"
            });
        }
    }
});
exports.createFileController = createFileController;
