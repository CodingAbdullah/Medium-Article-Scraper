import OpenAI from 'openai';
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
// There is a character limit to the audio file at 4096 characters, this is the limitation of TTS API
// Maximum audio files/request will be 3 parts of 4096 or 4096*3 = 12288 characters
// Round down to ~12250 characters maximum
// If documentText exceeds 12250, NO AUDIO FILE WILL BE GENERATED
// Each audio file part can be a maximum of 4096 characters up to a maximum of 3 files/request
export async function uploadTTSFile(documentText: string, audioFileID: string, voiceType: VoiceDataType): Promise<any[]> {    
    try {

        // Initiating S3 client
        const S3Bucket = new AWS.S3();
        let audioConversion = null;

        // Check to see if documentText length is <= 4096
        if (documentText.length <= 4096) {
            // After having filtered all the text from HTML document, generate an audio file
            audioConversion = 
                await new OpenAI({ apiKey: process.env.OPENAI_API_KEY! }).audio.speech.create({ 
                    model: 'tts-1', 
                    voice: voiceType.voice, 
                    input: documentText
                });

            // Upon successful request, create audio stream using Buffer
            let audioStream = Buffer.from(await audioConversion.arrayBuffer());

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
            // 0 indicates no additional audio file parts were created
            return [true, audioFileID, 0];
        }
        else if (documentText.length > 12500) {
            // Return -1 indicating file size exceeds maximum
            return [true, audioFileID, -1];
        }
        else {
            // Increment by 4096 for each file part, starting at 0 means 4095 (4096 - 1)
            let filePart = 1;
            let scannedText = 0;
            let audioConversion = null;
            let audioStream = null;

            // Possible Audio File Parts (maximum 12500 characters)
            // 0-4096 -> Part 1, 4096
            // 4096-8192 -> Part 2, 4096
            // 8192-12588 (rounded down ~12500) -> Part 3, 4096

            // Following the maximum character limit of 4096, create the necessary audio file parts
            while (scannedText <= documentText.length) {
                if ((scannedText + 4095) >= documentText.length) {
                    // Ensure substring index increment is up to the length of text, not exceeding it
                    audioConversion = 
                        await new OpenAI({ apiKey: process.env.OPENAI_API_KEY! }).audio.speech.create({ 
                            model: 'tts-1', 
                            voice: voiceType.voice, 
                            input: documentText.substring(scannedText, documentText.length)
                        });
                }
                else {
                    // Document length exceeds scannedText index plus 4095 elements, continue increment
                    audioConversion = 
                        await new OpenAI({ apiKey: process.env.OPENAI_API_KEY! }).audio.speech.create({ 
                            model: 'tts-1', 
                            voice: voiceType.voice, 
                            input: documentText.substring(scannedText, scannedText + 4095)
                        });
                }
                // Upon successful request, create audio stream using Buffer
                audioStream = Buffer.from(await audioConversion.arrayBuffer());
                
                // Now upload audio data stream as an audio file object to S3
                await S3Bucket.putObject({
                    Bucket: process.env.AWS_S3_BUCKET_NAME!,
                    Key: 'Medium-Article-' + audioFileID + `-part-${filePart}` + '.mp3',
                    Body: audioStream
                }, (err, data) => {
                    if (err) {
                        return;
                    }
                    else return data;
                });

                // Increase the scannedText iteration to the next maximum/bracket, check to see if increment exceeds documentText length
                // If so, do not increment and proceed with the next check, which will complete the final audio file part
                scannedText = (scannedText + 4095) >= documentText.length ? scannedText : scannedText + 4095;
                filePart += 1; // Increment audio file part
            }

            // Return audioFileID along with the number of file parts associated with the audio conversion
            return [true, audioFileID, filePart];
        }
    }
    catch (err) {
        // Conversion to audio or uploading file to S3 bucket do not succeed, return false
        return [false];
    }
}