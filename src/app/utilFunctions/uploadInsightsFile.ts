import * as AWS from 'aws-sdk';
import { ArticleInsights } from '../dataTypes/ArticleInsightsType';

// AWS Configuration (if not already configured elsewhere)
AWS.config.update({
    accessKeyId: process.env.ACCESS_ID!,
    secretAccessKey: process.env.SECRET_KEY!,
    region: process.env.REGION!
});

// Creating an insights file
// Initializing services using the AWS object
export async function uploadInsightsFile(articleText: string, fileID: string): Promise<boolean> {
    const comprehend = new AWS.Comprehend();
    const s3 = new AWS.S3();
    
    try {
        // Run analyses in parallel for better performance
        const [keyPhrasesResponse, entitiesResponse, languageResponse] = await Promise.all([
            // Extract key phrases
            comprehend.detectKeyPhrases({
                Text: articleText,
                LanguageCode: 'en'
            }).promise(),

            // Detect named entities (people, places, organizations, etc.)
            comprehend.detectEntities({
                Text: articleText,
                LanguageCode: 'en'
            }).promise(),

            // Detect dominant language
            comprehend.detectDominantLanguage({
                Text: articleText
            }).promise()
        ]);

        // Process and format the results
        const insights: ArticleInsights = {
            keyPhrases: (keyPhrasesResponse?.KeyPhrases ?? [])
                .sort((a, b) => (b.Score || 0) - (a.Score || 0))
                .slice(0, 10)
                .map(phrase => phrase.Text!)
                .filter(Boolean),
            entities: (entitiesResponse?.Entities ?? [])
                .sort((a, b) => (b.Score || 0) - (a.Score || 0))
                .slice(0, 10),
            dominantLanguage: languageResponse.Languages?.[0]?.LanguageCode || 'en'
        };

        // Formatting the insights file to include relevant data
        // New line and spacing to seperate the entities
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
        await s3.putObject({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `insights-${fileID}.txt`,
            Body: formattedContent,
            ContentType: 'text/plain'
        }).promise();

        return true;
    } 
    catch {
        throw new Error("Could not process request");
    }
}                                                                      