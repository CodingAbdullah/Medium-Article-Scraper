import FirecrawlApp from '@mendable/firecrawl-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// AWS Configuration (if not already configured elsewhere)
const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_ID!,
        secretAccessKey: process.env.SECRET_KEY!,
    },
});

// Fire Crawl Data function
// Initialize the Fire Crawl
export async function uploadFireCrawlInfo(articleURL: string, fileID: string) {
    const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

    // Scrape the page of the Medium Article URL
    const scrapeResponse = await app.scrapeUrl(articleURL, {
        formats: ['markdown', 'html']
    });

    // Crawl a website
    const crawlResponse = await app.crawlUrl(articleURL, {
        limit: 100,
        scrapeOptions: {
            formats: ['markdown', 'html']
        }
    });

    // Map findings
    const mapResponse = await app.mapUrl(articleURL);

    // Throw errors based on response types
    if (!scrapeResponse.success) {
        console.error("No scraping success");
        throw new Error(`Failed to scrape: ${scrapeResponse.error}`);
    }

    if (!crawlResponse.success) {
        console.error("Failed to crawl");
        throw new Error(`Failed to crawl: ${crawlResponse.error}`);
    }

    if (!mapResponse.success) {
        console.error("Failed to map");
        throw new Error(`Failed to map: ${mapResponse.error}`);
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
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: `firecrawl-${fileID}.json`,
            Body: JSON.stringify(firecrawlData, null, 2),
            ContentType: 'application/json'
        });

        await s3Client.send(command); // Send the command to S3

        return true;
    } 
    catch {
        console.error("Failed to upload firecrawl to S3");
        throw new Error('Failed to upload to S3');
    }
}