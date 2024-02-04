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
exports.uploadTTSFile = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv = __importStar(require("dotenv"));
const AWS = __importStar(require("aws-sdk"));
// Configure Environment Variables
dotenv.config();
// Setting Global Configurations for AWS to be used by all services
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});
// Generate audio stream from text and then upload it as an .mp3 file to AWS S3
// There is a character limit to the audio file at 4096 characters, this is the limitation of TTS API
// Maximum audio files/request will be 3 parts of 4096 or 4096*3 = 12288 characters
// Rounded down to ~12250 characters maximum
// If documentText exceeds 12250, NO AUDIO FILE WILL BE GENERATED
// Each audio file part can be a maximum of 4096 characters up to a maximum of 3 files/request
function uploadTTSFile(documentText, audioFileID, voiceType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Initiating S3 client
            const S3Bucket = new AWS.S3();
            let audioConversion = null;
            // Check to see if documentText length is <= 4096
            if (documentText.length <= 4096) {
                // After having filtered all the text from HTML document, generate an audio file
                audioConversion =
                    yield new openai_1.default({ apiKey: process.env.OPENAI_API_KEY }).audio.speech.create({
                        model: 'tts-1',
                        voice: voiceType.voice,
                        input: documentText
                    });
                // Upon successful request, create audio stream using Buffer
                let audioStream = Buffer.from(yield audioConversion.arrayBuffer());
                // Now upload audio data stream as an audio file object to S3
                yield S3Bucket.putObject({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: 'Medium-Article-' + audioFileID + '.mp3',
                    Body: audioStream
                }, (err, data) => {
                    if (err) {
                        return;
                    }
                    else
                        return data;
                });
                // If conversion to audio and uploading file to S3 Bucket succeed, return true 
                // 0 indicates no additional audio file parts were created
                return [true, audioFileID, 1];
            }
            else if (documentText.length > 12500) {
                // Return -1 indicating file size exceeds maximum
                return [true, audioFileID, -1];
            }
            else {
                // Increment by 4096 for each file part, starting at 0 means 4095 (4096 - 1)
                let filePart = 0;
                let scannedText = 0;
                let audioConversion = null;
                let audioStream = null;
                // Only 3 Possible Audio File Parts (maximum 12500 characters)
                // 0-4096 -> Part 1, 4096
                // 4096-8192 -> Part 2, 4096
                // 8192-12588 (rounded down ~12500) -> Part 3, 4096
                // Following the maximum character limit of 4096, create the necessary audio file parts
                while (scannedText <= documentText.length) {
                    filePart += 1; // Increment to next audio file part
                    if ((scannedText + 4095) >= documentText.length) {
                        // Ensure substring index increment is up to the length of text, not exceeding it
                        audioConversion =
                            yield new openai_1.default({ apiKey: process.env.OPENAI_API_KEY }).audio.speech.create({
                                model: 'tts-1',
                                voice: voiceType.voice,
                                input: documentText.substring(scannedText, documentText.length)
                            });
                        // This will end the loop as it will be in its last iteration
                        scannedText = documentText.length + 1;
                    }
                    else {
                        // Document length exceeds scannedText index plus 4095 elements, continue increment
                        audioConversion =
                            yield new openai_1.default({ apiKey: process.env.OPENAI_API_KEY }).audio.speech.create({
                                model: 'tts-1',
                                voice: voiceType.voice,
                                input: documentText.substring(scannedText, scannedText + 4095)
                            });
                    }
                    // Upon successful request, create audio stream using Buffer
                    audioStream = Buffer.from(yield audioConversion.arrayBuffer());
                    // Now upload audio data stream as an audio file object to S3
                    yield S3Bucket.putObject({
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: 'Medium-Article-' + audioFileID + `-part-${filePart}` + '.mp3',
                        Body: audioStream
                    }, (err, data) => {
                        if (err) {
                            return;
                        }
                        else
                            return data;
                    });
                    // Increase the scannedText iteration to the next maximum/bracket, check to see if increment exceeds documentText length
                    // If so, do not increment and proceed with the next check, which will complete the final audio file part
                    scannedText = (scannedText + 4095) >= documentText.length ? scannedText : scannedText + 4095;
                }
                // Return audioFileID along with the number of file parts associated with the audio conversion
                return [true, audioFileID, filePart];
            }
        }
        catch (err) {
            // Conversion to audio or uploading file to S3 bucket do not succeed, return false
            return [false];
        }
    });
}
exports.uploadTTSFile = uploadTTSFile;
