// src/app/utilFunctions/uploadTTSFile.ts
import { PollyClient, StartSpeechSynthesisTaskCommand, GetSpeechSynthesisTaskCommand } from '@aws-sdk/client-polly';
import { PollyVoice } from '../dataTypes/PollyVoiceType';

// Create a Polly client
const pollyClient = new PollyClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_ID!,
        secretAccessKey: process.env.SECRET_KEY!
    }
});

// Define a type for the return value of the uploadTTSFile function
type UploadTTSFileResult = [boolean, string | null];

export async function uploadTTSFile(documentText: string, audioFileID: string): Promise<UploadTTSFileResult> {
    const MAX_TEXT_LENGTH_ASYNC = 50000;  // For asynchronous calls

    if (documentText.length <= MAX_TEXT_LENGTH_ASYNC) {
        try {
            // Configure Polly parameters
            const pollyParams = {
                Engine: 'neural' as const,
                LanguageCode: 'en-US' as const,
                OutputFormat: 'mp3' as const,
                Text: documentText,
                TextType: 'text' as const,
                VoiceId: PollyVoice.MATTHEW,
                OutputS3BucketName: process.env.S3_BUCKET_NAME!, // Specify the S3 bucket for output
                OutputS3KeyPrefix: `audio-${audioFileID}` // Set the S3 key prefix
            };

            // Start the speech synthesis task
            const synthesizeSpeechCommand = new StartSpeechSynthesisTaskCommand(pollyParams);
            const taskResponse = await pollyClient.send(synthesizeSpeechCommand);
            const taskId = taskResponse.SynthesisTask?.TaskId;

            if (!taskId) {
                throw new Error('Failed to start speech synthesis task');
            }

            // Poll for the task status
            let taskStatus;
            let outputKey: string | null = null; // Variable to hold the output key

            do {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before polling again
                const getTaskCommand = new GetSpeechSynthesisTaskCommand({ TaskId: taskId });
                const taskResult = await pollyClient.send(getTaskCommand);
                taskStatus = taskResult.SynthesisTask?.TaskStatus;

                if (taskStatus === 'completed') {
                    // Extract the output key from the OutputUri
                    const outputUri = taskResult.SynthesisTask?.OutputUri;
                    if (outputUri) {
                        const urlParts = new URL(outputUri);
                        outputKey = urlParts.pathname.split('/').pop() || null; // Get the last part of the path (the key)
                    }

                    return [true, outputKey]; // Return success with the S3 key
                } 
                else if (taskStatus === 'failed') {
                    throw new Error('Speech synthesis task failed');
                }
            } while (taskStatus === 'inProgress');

            return [false, audioFileID]; // If the task is not completed or failed
        } 
        catch {
            throw new Error('Error uploading TTS file'); // Log the error for debugging
        }
    } 
    else {
        return [false, audioFileID]; // Text too long for synthesis
    }
}