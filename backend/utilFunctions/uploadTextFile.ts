import { PutObjectCommand, S3ClientConfig, S3Client } from "@aws-sdk/client-s3";
import { v4 } from "uuid";
import * as dotenv from 'dotenv';

dotenv.config(); // Configure environment variables

// After having filtered all text from HTML document, generate a text file
export async function uploadTextFile(documentText: string): Promise<any[]> {
    // Setting configuration to be used by S3 Bucket
    const S3BucketConfiguration: S3ClientConfig = {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_ID!,
            secretAccessKey: process.env.AWS_SECRET_KEY!
        }
    };

    // Assign Bucket name where file is to be uploaded
    // Assign Key using the help of the UUID library
    // Assign Document text to be equivalent to the generated text filtered and refined
    try {
        // Generating a random ID identifier for text file
        let textFileID = v4().split("-")[0];

        // Initiating S3 Bucket and sending a PutObject command
        await new S3Client([S3BucketConfiguration]).send(new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: 'Medium-Article-' + textFileID + '.txt',
            Body: documentText
        }));

        // If successful, return true
        return [true, textFileID];
    }
    catch(err) {
        console.log(err);
        // If not successful, return false
        return [false];
    }
}