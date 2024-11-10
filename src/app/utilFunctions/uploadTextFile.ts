// src/app/utilFunctions/uploadTextFile.ts
import { v4 } from "uuid";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Create an S3 client
const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_ID!,
        secretAccessKey: process.env.SECRET_KEY!
    },
});

// Define a type for the return value of the uploadTextFile function
type UploadTextFileResult = [boolean, string];

export async function uploadTextFile(documentText: string): Promise<UploadTextFileResult> {
    // Check if required environment variables are set
    if (!process.env.S3_BUCKET_NAME) {
        console.error("S3_BUCKET_NAME environment variable is not set.");
        throw new Error("S3_BUCKET_NAME environment variable is not set.");
    }

    try {
        // Generating a random ID identifier for text file
        const textFileID = v4().split("-")[0]; // Use const since textFileID is not reassigned

        // Creating the PutObjectCommand
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: 'Medium-Article-' + textFileID + '.txt',
            Body: documentText,
            ContentType: 'text/plain', // Specify content type
            ContentDisposition: 'attachment; filename="Medium-Article-' + textFileID + '.txt"' // Set Content-Disposition
        });

        // Sending the command to S3
        await s3Client.send(command);

        // If successful, return true
        return [true, textFileID];
    } 
    // Error handling
    catch {
        throw new Error('Cannot process request');
    }
}