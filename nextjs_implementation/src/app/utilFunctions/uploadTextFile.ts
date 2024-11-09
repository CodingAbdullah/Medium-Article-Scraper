import { v4 } from "uuid";
import * as AWS from 'aws-sdk';

// Setting Global Configurations for AWS to be used by all services
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_ID!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    region: process.env.AWS_REGION!
});

// After having filtered all text from HTML document, generate a text file
export async function uploadTextFile(documentText: string): Promise<any[]> {
    // Initiating S3 Bucket using configuration
    const S3Bucket = new AWS.S3();

    // Assign Bucket name where file is to be uploaded
    // Assign Key using the help of the UUID library
    // Assign Document text to be equivalent to the generated text filtered and refined
    try {
        // Generating a random ID identifier for text file
        let textFileID = v4().split("-")[0];

        // Initiating S3 Bucket and sending a PutObject command
        await S3Bucket.putObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: 'Medium-Article-' + textFileID + '.txt',
            Body: documentText
        }, (err, data) => {
            if (err) {
                return;
            }
            else return data;
        });

        // If successful, return true
        return [true, textFileID];
    }
    catch(err) {
        // If not successful, return false
        return [false];
    }
}