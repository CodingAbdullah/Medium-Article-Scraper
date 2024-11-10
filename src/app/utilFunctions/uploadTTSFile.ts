// src/app/utilFunctions/uploadTTSFile.ts
import * as AWS from 'aws-sdk';
import { PollyVoice } from '../dataTypes/PollyVoiceType';

// Setting Global Configurations for AWS to be used by all services
AWS.config.update({
    accessKeyId: process.env.ACCESS_ID!,
    secretAccessKey: process.env.SECRET_KEY!,
    region: process.env.REGION!
});

// Define a type for the return value of the uploadTTSFile function
type UploadTTSFileResult = [boolean, string | null];

export async function uploadTTSFile(documentText: string, audioFileID: string): Promise<UploadTTSFileResult> {    
    try {
        const S3Bucket = new AWS.S3(); // Initialize an AWS S3 Bucket
        const polly = new AWS.Polly(); // Initialize an AWS Polly instance

        // Configure Polly parameters
        const pollyParams = {
            Engine: 'neural',
            LanguageCode: 'en-US',
            OutputFormat: 'mp3',
            Text: documentText,
            TextType: 'text',
            VoiceId: PollyVoice.MATTHEW // Using the Matthew voice type
        };

        // Generate audio using AWS Polly
        const audioData = await polly.synthesizeSpeech(pollyParams).promise();

        if (audioData.AudioStream) {
            // Upload to S3
            await S3Bucket.putObject({
                Bucket: process.env.S3_BUCKET_NAME!,
                Key: `Medium-Article-${audioFileID}.mp3`,
                Body: audioData.AudioStream,
                ContentType: 'audio/mpeg'
            }).promise();

            return [true, audioFileID];
        } 
        else {
            throw new Error('No audio stream generated');
        }
    } 
    catch (error) {
        console.error('Error uploading TTS file:', error); // Log the error for debugging
        return [false, null]; // Return false and null for audioFileID
    }
}