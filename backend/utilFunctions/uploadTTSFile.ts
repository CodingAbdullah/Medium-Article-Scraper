import OpenAI from 'openai';
import { S3ClientConfig, S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 } from "uuid";
import VoiceDataType from '../dataTypes/VoiceDataType';
import * as dotenv from 'dotenv';

// Configure environment variables
dotenv.config();

// Generate audio stream from text and then upload it as an .mp3 file to AWS S3
export async function uploadTTSFile(documentText: string, voiceType: VoiceDataType): Promise<any[]> {    
    try {
        // Generate random ID
        let audioFileID = v4().split("-")[0];

        // Initiating S3 client by setting S3 Bucket configurations
        let S3ClientConfiguration: S3ClientConfig  = {
            region: process.env.AWS_REGION,
            credentials: {
                secretAccessKey: process.env.AWS_SECRET_KEY!,
                accessKeyId: process.env.AWS_ACCESS_ID!,
            }
        };

        // After having filtered all the text from HTML document, generate an audio file
        let conversion = 
            await new OpenAI({ apiKey: process.env.OPENAI_API_KEY }).audio.speech.create({ 
                model: 'tts-1', 
                voice: voiceType.voice, 
                input: documentText 
            });

        // Upon successful request, create audio stream using Buffer
        let audioStream = Buffer.from(await conversion.arrayBuffer());

        // Now upload audio data stream as an audio file object to S3
        await new S3Client([S3ClientConfiguration]).send(new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: 'Medium Article-' + audioFileID + '.mp3',
            Body: audioStream
        }));

        // If conversion to audio and uploading file to S3 bucket succeed, return true 
        return [true, audioFileID];
    }
    catch (err) {
        console.log(err);
        // If either conversion to audio or uploading fil to S3 bucket do not succeed, return false
        return [false];
    }
}