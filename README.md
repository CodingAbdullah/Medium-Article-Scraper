# Medium Article Scraper
<b><i>Official Link: <u><a style="color:black;" target="_blank" href="https://mediumdotcomscraper.pro"> https://mediumdotcomscraper.pro</a></b></i></u>

Looking for a Medium.com article scraper? Well, you have stumbled across some good luck! <b>This application allows anyone to instantaneous create audio and text files for any non-paywall Medium.com articles.</b>

Paywall articles are not supported because membership is required to access them. They are not available to the public.

Most of the work is done using <b>ScrapingAnt's WebScraper API</b>. An API that generates a valid HTML document from an authentic Medium.com URL.

The WebScraper API can be found <b><u><a style="color: black;" href="https://rapidapi.com/okami4kak/api/scrapingant/details">here</a></b></u>. After retrieving the HTML document, an intricate process takes place (simplified below) in which text is parsed from the page's DOM. <br />

A variety of utility functions are in place that help clean and format text which is written to a text file or ready to be used for generating the audio stream for the audio file.

Medium articles are one page so all you need to do is enter in the article URL of the specific non-paywall article for which you would like to generate audio and text files.

## Next.js
A <code>nextjs</code> branch has been created for working on a more efficient and elegant solution for the Medium.com Article Scraper tool. <b>Codebase using Next.js can be found in the nextjs branch of this repository.</b>

## Simple process
Parsing text is a complex, open-ended problem and even the most comprehensive solutions might not cover all edge-cases. 
 
Luckily, Medium articles follow a standard format and offer limited options for styling. Article content resides in `<article />` tags and includes only select options for styling (`<em />`, `<strong />`, etc.). 

This makes data parsing easier as the problem is scoped and a specific solution is developed.

Tables in the code overview section detail the flow of how text is parsed and made ready for generating the appropriate text/audio files.

<hr />

### AWS Polly, AWS Comprehend, and AWS S3
For audio file generation, the <b>AWS Polly</b> service is incorporated. It offers the ability to create audio files from string input. 

Once all the text has been extracted from the HTML document, it is passed as input to the TTS API to generate the audio file. Users also have the freedom to view insights
related to the article of their choosing.

AWS S3 is used for storage and retrieval of all <code>.txt</code>, <code>.mp3</code>, and <code>.json</code> files.

#### Limitations
There are limitations that exist when working with <b>AWS Polly</b>. For instance, you can fit at most, 50000 characters in one request.
<b>So anything more than 50000 characters is automatically rejected by the application and only the text file is generated.</b>

## Code Overview
This section goes into detail on some of the important aspects of the project. This includes data types and utility functions used to accomplish the web scraping task. 

The following tables briefly detail what each of them do so you can walkthrough the code yourself.
There are comments within the codebase itself should you require further explanations.

### Data Types
| Data Type          | Location                  |Description |
| ------------------ |:------------------------: |------------|
| `PunctuationQueue` | `/src/app/dataTypes/`     |Custom Queue class for storing sentence ending punctuation `.`, `?`, `!`. Used for splitting and appending `\n` characters at the end of each sentence for text file readability.
| `UploadURLType`    | `/src/app/dataTypes/`     |Custom data type for storing and sending file URL data back to the client. Contains URLs for the text file storage location and audio file(s) storage location. Files are stored in a AWS S3 bucket.
| `PollyVoiceType`    | `/src/app/dataTypes/`     |Custom data type for storing the voice type requested for use by AWS Polly.
| `ArticleInsightsType`    | `/src/app/dataTypes/`     |Custom data type for storing insights found using AWS Comprehend.

### Middleware Functions
| Function Name         | Location                 |Description |
| --------------------- |:-----------------------: |------------|
| `verifyArticleLink()` | `/utilFunctions/`   | Makes use of the WebScraper API to get the HTML document of the requested article URL. If the request is valid, control is passed along with the HTML document attached to request body. If not, an error response is returned.

### Controller Functions
| Function Name            | Location                 |Description |
| ------------------------ |:-----------------------: |------------|
| `route.ts` | `/api/scrape/route.ts/`   | Makes use of the HTML document and filters out all the media/style tags using utility functions (see below). Text is extracted and formatted from the modified document. Punctuation is also formatted. Finally, utility functions generate text and audio files which are then returned as responses. 

### Utility Functions
| Function Name           | Location            |Description |
| ----------------------- |:------------------: |------------|
| `filterMediaTags()`     | `/src/app/utilFunctions/`| Basic function which recursively removes the following tags from the HTML document: `<figure />`, `<figcaption />`, `<picture />`, `<svg />`, and `<button />`.
| `filterStyleTags()`     | `/src/apputilFunctions/`| Basic function which removes the following style tags from the HTML document: `<em />`, `<a />`, `<code />`, `<strong />`, `<blockquote />`, `<pre />`, `<mark />`, and `<img />`.
| `generateArticleText()` | `/src/app/utilFunctions/`| This function  takes in the newly filtered HTML document and extracts all the text within the `<article />` tags.
| `insertPunctuation()`   | `/src/app/utilFunctions/`| Extracted text from the HTML document is then processed for punctuation and sentence formatting using the `PunctuationQueue` data type. 
| `uploadTextFile()`      | `/src/app/utilFunctions/`| Formatted text is then used as data to be uploaded as a `.txt` file to the AWS S3 bucket.
| `uploadTTSFile()`       | `/src/app/utilFunctions/`| Formatted text is used for creating the audio stream to generate an audio file from the OpenAI TTS API. The audio file is uploaded as a `.mp3` file to the AWS S3 bucket.
| `uploadInsightsFile()`       | `/src/app/utilFunctions/`| Formatted text is used for creating insights using AWS Comprehend. The file is uploaded as a `.txt` file to the AWS S3 bucket.
| `uploadFireCrawlInfo()`       | `/src/app/utilFunctions/`| Formatted text is used for creating LLM data using the Fire Crawl API. The JSON file is uploaded as a `.json` file to the AWS S3 bucket.

### TypeScript Implementation
It is best to incorporate TypeScript for web development as the many benefits it offers enhance the development process. 

From providing type safety by enforcing static typing to class/object-oriented design, managing and developing code gets easy. The full-stack application utilizes TypeScript as its main language for front-end and back-end implementation.

Before you do anything, you need to ensure you have cloned the following repository:

```
git clone https://github.com/CodingAbdullah/Medium-Article-Scraper.git
```

It may be that you already have this repository cloned, but changes could happen in the future so you would want to be working with the latest code. To do this, simply run the following in `/`:

`git pull`

### Kickstart the Server
To kickstart the server locally on your machine, ensure that you have created a `.env` file in the root directory of this project in `/backend` with the `AWS_ACCESS_ID`, `AWS_SECRET_KEY` and other credentials listed (as seen below). 

Ensure you have done this correctly by running the following starting from the root location `/`:

```
touch .env
```

Additionally, you will also need to add the following secrets:
<br />
```S3_BUCKET_NAME=''```
<br />
```REGION=''```
<br />
```WEB_SCRAPER_API_KEY=''```
<br />
```WEB_SCRAPER_HOST=''```
<br />
```WEB_SCRAPER_URL=''```
<br />
```FIRECRAWL_API_KEY=''```

You will need to ensure the `node_modules` directory is installed in the root location of the project `/`:

```npm install```

And finally, run ```npm run dev``` to kickstart the web application.

## Conclusion
Feel free to check out any of the following links for more documentation:
<ul>
    <u><b>
        <li><a style="color:black;" target="_blank" href='https://docs.aws.amazon.com/'>AWS</a></li>
        <li><a style="color:black;" target="_blank" href='https://nextjs.org/'>Next.js</a></li>
        <li><a style="color:black;" target="_blank" href='https://react.dev/'>React</a></li>
        <li><a style="color:black;" target="_blank" href='https://www.typescriptlang.org/docs/'>TypeScript</a></li>
        <li><a style="color:black;" target="_blank" href='https://rapidapi.com/okami4kak/api/scrapingant/details'>Web Scraper API</a></li>
        <li><a style="color:black;" target="_blank" href='https://www.firecrawl.dev/'>Fire Crawl</a></li>
</ul>
