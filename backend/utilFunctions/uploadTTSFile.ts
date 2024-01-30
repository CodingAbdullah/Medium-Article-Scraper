import OpenAI from 'openai';
import { v4 } from "uuid";
import VoiceDataType from '../dataTypes/VoiceDataType';
import * as dotenv from 'dotenv';
import * as AWS from 'aws-sdk';

// Configure Environment Variables
dotenv.config();

// Setting Global Configurations for AWS to be used by all services
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_ID!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    region: process.env.AWS_REGION!
});

// Generate audio stream from text and then upload it as an .mp3 file to AWS S3
export async function uploadTTSFile(documentText: string, voiceType: VoiceDataType): Promise<any[]> {    
    try {
        // Generate random ID
        let audioFileID = v4().split("-")[0];

        // Initiating S3 client
        const S3Bucket = new AWS.S3();

        // After having filtered all the text from HTML document, generate an audio file
        let conversion = 
            await new OpenAI({ apiKey: process.env.OPENAI_API_KEY! }).audio.speech.create({ 
                model: 'tts-1', 
                voice: voiceType.voice, 
                input: documentText.substring(0, 4095)
            })

        // Upon successful request, create audio stream using Buffer
        let audioStream = Buffer.from(await conversion.arrayBuffer());

        // Now upload audio data stream as an audio file object to S3
        await S3Bucket.putObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: 'Medium-Article-' + audioFileID + '.mp3',
            Body: audioStream
        }, (err, data) => {
            if (err) {
                return;
            }
            else return data;
        });

        // If conversion to audio and uploading file to S3 bucket succeed, return true 
        return [true, audioFileID];
    }
    catch (err) {
        // If either conversion to audio or uploading fil to S3 bucket do not succeed, return false
        return [false];
    }
}