import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uuid from "uuid";

// Setting credentials
let S3 = new S3Client([{
    region: process.env.AWS_REGION, 
    credentials: { 
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
 }]);

// After having filtered all text from HTML document, generate a text file
export async function uploadTextFile(documentText: string): Promise<boolean> {
    
    // Assign Bucket name where file is to be uploaded
    // Assign Key using the help of the UUID library
    // Assign Document text to be equivalent to the generated text filtered and refined
    try {
        let textFileID = uuid.v4();
        await S3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: 'Medium-Article-' + textFileID + '.txt',
            Body: documentText
        }));

        // If successful, return true
        return true;
    }
    catch(err) {
        // If not successful, return false
        return false;
    }
}