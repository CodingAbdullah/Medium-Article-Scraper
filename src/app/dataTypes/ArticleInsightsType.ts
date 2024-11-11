import { Entity } from "@aws-sdk/client-comprehend";

// Custom type for creating Medium article insights
export interface ArticleInsights {
    keyPhrases: string[],
    entities: Entity[],
    dominantLanguage: string
}