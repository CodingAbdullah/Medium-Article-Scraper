import FirecrawlApp from '@mendable/firecrawl-js';
import AWS from 'aws-sdk';

// AWS Configuration (if not already configured elsewhere)
AWS.config.update({
    accessKeyId: process.env.ACCESS_ID!,
    secretAccessKey: process.env.SECRET_KEY!,
    region: process.env.REGION!
});

// Fire Crawl Data function
// Initialize the Fire Crawl and AWS S3 bucket
export async function uploadFireCrawlInfo(articleURL: string, fileID: string) {
    const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
    const s3 = new AWS.S3();

    // Scrape the page of the Medium Article URL
    const scrapeResponse = await app.scrapeUrl(articleURL, {
        formats: ['markdown', 'html'],
    });

    // Crawl a website
    const crawlResponse = await app.crawlUrl(articleURL, {
        limit: 100,
        scrapeOptions: {
            formats: ['markdown', 'html'],
        }
    });

    // Map findings
    const mapResponse = await app.mapUrl(articleURL);

    // Throw errors based on response types
    if (!scrapeResponse.success) {
        throw new Error(`Failed to scrape: ${scrapeResponse.error}`)
    }

    if (!crawlResponse.success) {
        throw new Error(`Failed to crawl: ${crawlResponse.error}`)
    }

    if (!mapResponse.success) {
        throw new Error(`Failed to map: ${mapResponse.error}`)
    }

    // Combine all findings and push to a text file
    // Prepare the data for S3
    const firecrawlData = {
        scrape: scrapeResponse,
        crawl: crawlResponse,
        map: mapResponse,
        timestamp: new Date().toISOString(),
        sourceUrl: articleURL
    };

    // Upload to S3
    try {
        await s3.putObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME as string,
            Key: `firecrawl-${fileID}.json`,
            Body: JSON.stringify(firecrawlData, null, 2),
            ContentType: 'application/json'
        }).promise();

        return true;
    } 
    catch (error) {
        throw new Error(`Failed to upload to S3: ${error}`);
    }
}