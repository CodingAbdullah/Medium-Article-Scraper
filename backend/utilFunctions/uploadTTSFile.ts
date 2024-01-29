import openai from 'openai';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import uuid from 'uuid';
import VoiceDataType from '../dataTypes/VoiceDataType';

// After having filtered all the text from HTML document, generate an audio file
// Special case here is we are using OpenAI's TTS API to generate this file

let client = new openai({ apiKey: process.env.OPENAI_API_KEY });
let S3 = new S3Client([{
    region: process.env.AWS_REGION,
    credentials: {
       secretAccessKey: process.env.AWS_SECRET_KEY,
       accessKeyId: process.env.AWS_ACCESS_ID,
        
    }
}]);

// Generate audio stream from text and then upload it as an .mp3 file to AWS S3
export async function uploadTTSFile(documentText: string, voiceType: VoiceDataType): Promise<any[]> {    
    try {
        let audioFileID = uuid.v4(); // Generate random ID
        let conversion = await client.audio.speech.create({ 
            model: 'tts-1', 
            voice: voiceType.voice, 
            input: documentText 
        });

        // Upon successful request, create audio stream using Buffer
        let audioStream = Buffer.from(await conversion.arrayBuffer());

        // Now upload audio data stream as an audio file object to S3
        await S3.send(new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: 'Medium Article-' + audioFileID + '.mp3',
            Body: audioStream
        }));

        // If conversion to audio and uploading file to S3 bucket succeed, return true 
        return [true, audioFileID];
    }
    catch (err) {
        // If either conversion to audio or uploading fil to S3 bucket do not succeed, return false
        return [false];
    }
}