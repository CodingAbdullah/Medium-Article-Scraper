import { ComprehendClient, DetectKeyPhrasesCommand, DetectEntitiesCommand, DetectDominantLanguageCommand } from '@aws-sdk/client-comprehend';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ArticleInsights } from '../dataTypes/ArticleInsightsType';

// AWS Configuration (if not already configured elsewhere)
const comprehendClient = new ComprehendClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_ID!,
        secretAccessKey: process.env.SECRET_KEY!
    }
});

const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_ID!,
        secretAccessKey: process.env.SECRET_KEY!
    }
});

// Creating an insights file
export async function uploadInsightsFile(articleText: string, fileID: string): Promise<boolean> {
    console.log('we are at Insights File');
    try {
        // Run analyses in parallel for better performance
        const [keyPhrasesResponse, entitiesResponse, languageResponse] = await Promise.all([
            // Extract key phrases
            comprehendClient.send(new DetectKeyPhrasesCommand({
                Text: articleText,
                LanguageCode: 'en'
            })),

            // Detect named entities (people, places, organizations, etc.)
            comprehendClient.send(new DetectEntitiesCommand({
                Text: articleText,
                LanguageCode: 'en'
            })),

            // Detect dominant language
            comprehendClient.send(new DetectDominantLanguageCommand({
                Text: articleText
            }))
        ]);

        // Process and format the results
        const insights: ArticleInsights = {
            keyPhrases: (keyPhrasesResponse.KeyPhrases ?? [])
                .sort((a, b) => (b.Score || 0) - (a.Score || 0))
                .slice(0, 10)
                .map(phrase => phrase.Text!),
            entities: (entitiesResponse.Entities ?? [])
                .sort((a, b) => (b.Score || 0) - (a.Score || 0))
                .slice(0, 10),
            dominantLanguage: languageResponse.Languages?.[0]?.LanguageCode || 'en'
        };

        // Formatting the insights file to include relevant data
        const formattedContent = [
            'Article Insights Analysis',
            '=======================\n',
            'Key Phrases:',
            ...insights.keyPhrases.map(phrase => `- ${phrase}`),
            '\nNamed Entities:',
            ...insights.entities.map(entity => `- ${entity.Text} (${entity.Type})`),
            '\nDominant Language:',
            `- ${insights.dominantLanguage.toUpperCase()}`
        ].join('\n');

        // Insert insights file into AWS S3 Bucket
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `insights-${fileID}.txt`,
            Body: formattedContent,
            ContentType: 'text/plain',
            ContentDisposition: 'attachment; filename="insights-' + fileID + '.txt"' // Set Content-Disposition
        });
        
        await s3Client.send(command); // Send the command to S3
        return true;
    } 
    catch {
        throw new Error("Could not process request");
    }
}