// Custom type for creating Medium article insights
export interface ArticleInsights {
    keyPhrases: string[];
    entities: AWS.Comprehend.Entity[];
    dominantLanguage: string;
}