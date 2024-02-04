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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTextFile = void 0;
const uuid_1 = require("uuid");
const dotenv = __importStar(require("dotenv"));
const AWS = __importStar(require("aws-sdk"));
// Configure environment variables
dotenv.config();
// Setting Global Configurations for AWS to be used by all services
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});
// After having filtered all text from HTML document, generate a text file
function uploadTextFile(documentText) {
    return __awaiter(this, void 0, void 0, function* () {
        // Initiating S3 Bucket using configuration
        const S3Bucket = new AWS.S3();
        // Assign Bucket name where file is to be uploaded
        // Assign Key using the help of the UUID library
        // Assign Document text to be equivalent to the generated text filtered and refined
        try {
            // Generating a random ID identifier for text file
            let textFileID = (0, uuid_1.v4)().split("-")[0];
            // Initiating S3 Bucket and sending a PutObject command
            yield S3Bucket.putObject({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: 'Medium-Article-' + textFileID + '.txt',
                Body: documentText
            }, (err, data) => {
                if (err) {
                    return;
                }
                else
                    return data;
            });
            // If successful, return true
            return [true, textFileID];
        }
        catch (err) {
            // If not successful, return false
            return [false];
        }
    });
}
exports.uploadTextFile = uploadTextFile;
