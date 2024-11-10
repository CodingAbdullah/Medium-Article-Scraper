// src/app/utilFunctions/uploadTextFile.ts
import { v4 } from "uuid";
import * as AWS from 'aws-sdk';

// Setting Global Configurations for AWS to be used by all services
AWS.config.update({
    accessKeyId: process.env.ACCESS_ID!,
    secretAccessKey: process.env.SECRET_KEY!,
    region: process.env.REGION!
});

// Define a type for the return value of the uploadTextFile function
type UploadTextFileResult = [boolean, string | null];

export async function uploadTextFile(documentText: string): Promise<UploadTextFileResult> {
    // Initiating S3 Bucket using configuration
    const S3Bucket = new AWS.S3();

    try {
        // Generating a random ID identifier for text file
        const textFileID = v4().split("-")[0]; // Use const since textFileID is not reassigned

        // Initiating S3 Bucket and sending a PutObject command
        await S3Bucket.putObject({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: 'Medium-Article-' + textFileID + '.txt',
            Body: documentText
        }).promise(); // Use promise() to handle the async operation

        // If successful, return true
        return [true, textFileID];
    } 
    catch (error) {
        console.error('Error uploading text file:', error); // Log the error for debugging
        return [false, null]; // Return false and null for textFileID
    }
}