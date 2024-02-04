# Medium Article Scraper
Looking for a Medium Article Scraper? Well, you have stumbled across some good luck! <b>This application allows anyone to instantaneous create audio and text files for any non-paywall Medium.com articles.</b>

Paywall articles are not supported because membership is required to access them. They are not available to the public.

Most of the hard work is done by using <b>ScrapingAnt's WebScraper API</b>. A simple API that requires a website URL from which the entire HTML document of the page is returned.

Luckily, Medium articles are one page so all you need to do is enter in the website URL of the specific non-paywall article for which you would like to generate audio and text files.

The WebScraper API can be found <a href="https://rapidapi.com/okami4kak/api/scrapingant/details">here</a>. After retrieving the HTML document, an intricate process takes place (simplified below) in which text is parsed from the page's DOM. <br />

A variety of utility functions are in place that help clean and format text which is written to a text file or ready to be used for generating the audio stream for the audio file.

## Simple process
The user has the freedom of choosing whether or not they would like any audio file(s) to be generated from an article. By default, a text file is always generated. There are limitations to the audio file generation which will be touched on momentarily.

 When parsing text, it can be cumbersome to figure out how to go about it. Problems like these are open-ended and even the most comprehensive solutions might not cover all edge-cases. 
 
Medium articles follow a standard format and offer limited options for styling. In the case of Medium, article content resides in `<article />` tags and includes limited options for styling (`<em />`, `<strong />`, etc.). 

This makes data parsing easier as the problem is scoped and a specific solution is developed.

Tables in the code overview section detail the flow of how text is parsed and made ready for generating the appropriate text/audio files.

### OpenAI TTS API
For audio file generation, the <b>OpenAI TTS API</b> is incorporated. It offers the ability to create audio files from string input. 

Once all the text has been extracted from the HTML document, it is passed as input to the TTS API to generate the audio file. OpenAI's TTS API  offers six different voice types: `alloy`, `echo`, `fable`, `oynx`, `nova`, `shimmer`.

Users have the freedom of selecting any voice type. More information on this API can be found <a target="_blank" href="https://platform.openai.com/docs/guides/text-to-speech">here</a>.

#### Limitations
There are limitations that exist when it comes to working with the <b>TTS API model</b>. For instance, you can make at most <b>3 conversion requests/minute</b> based on the free-tier model. This obviously increases with the higher-tier purchase plans offered by OpenAI.

Additionally, there is a <b>4096 character limit</b>. Meaning that if the text you are trying to convert exceeds 4096 characters, audio for characters up to 4096 will be generated. 

The project takes this into consideration and offers a <b>maximum of 12500 characters/file</b> that can be converted into parts. 12500 characters works to be 3 audio file parts (4096 each, rounded down to 12500). 

<b>Anything more than 12500 characters is automatically rejected by the application and only the text file is generated for it.</b>

## Project Setup
Setting up the project locally or in the cloud is fairly straight forward. For starters, you will need to make sure you have the following applications installed locally:

<ul>
    <li><code>Git</code></li>
    <li><code>Node</code></li>
    <li><code>Docker</code></li>
    <li><code>Terraform</code></li>
</ul>

This will allow you to clone the repository using Git, work through installing dependencies using Node, containerizing the application using Docker, and finally, deploying AWS infrastructure in the cloud using Terraform.

### AWS Cloud Infrastructure Setup
The actual deployment of the application follows a simple pattern. However, if you are looking for a more quick and efficient way of custom deployment, this section explains it in detail.

The following AWS services can be used:
<ul>
    <li><b><i>AWS ECS</i></b> for running the two containers (front-end + back-end servers)</li>
    <li><b><i>AWS ECS Task Definition</i></b> for creating a cloud container network</li>
    <li><b><i>AWS ALB</i></b> - Load Balancing workload and accessing the front-end container</li>
    <li><b><i>AWS ECR</i></b> - Elastic Container Registry for storing Docker images</li>
    <li><b><i>AWS S3</i></b> - Audio/Text file storage and retrieval</li>
    <li><b><i>AWS VPC + Private/Public Subnets</i></b> for enhancing security and network flow</li>
</ul>
The following diagram illustrates this in detail:
<br />
<br />
<img src="/assets/AWS_ARCHITECTURE_TTS.png" width="450" height="300"></img>
<br />
<br />

This setup offers efficiency, scalability, reliability, and security. Taking advantage of the many services AWS offers to ensure maximal uptime for the web application.

## Terraform: Infrastructure as Code Deployment
<b><i>This section is still in progress.</i></b>

Deployment to the cloud is made easy with the help of Terraform. The process of provisioning infrastructure can be automated with code.
Terraform is an <b>Infrastructure as Code (IaC)</b> offering which allows one to codify their infrastructure deployment. All that is required is setting up the local environment (`terraform init`), running a plan which allows one to keep track of what is to be deployed (`terraform plan`), and finally deploying the requested infrastructure (`terraform apply`). 

The main file that is used to plan and provision AWS infrastructure is the `main.tf` file located in the root directory. After deployment, a `terraform.tfstate` file is generated which keeps track of any changes made to the deployment which is used on the next apply request (if any).

### Deployment Scripts
In the root directory of this project, you will find scripts for both Linux (Shell) and Windows (Powershell) which you can use to automate the entire deployment process.

The scripts do the following: 
- Pull the latest code from the GitHub repository
- Create Docker images from the Dockerfiles
- Push the Docker images to AWS ECR
- Ensure environment variables are configured
- Create a file for adding Terraform variables 
- Proceed with Terraform deployment by running the aforementioned Terraform commands on the `main.tf` file

Ensure that the scripts are executable (use `chmod` to set file permissions) and that you provide the `AWS_ACCESS_ID` and `AWS_SECRET_KEY` like this in the root directory `/`: 
<br />
```./PROJECT_DEPLOY.sh <AWS_ACCESS_ID> <AWS_SECRET_KEY>```
<br /><b>OR</b>
<br />
```./PROJECT_DEPLOY.ps1 <AWS_ACCESS_ID> <AWS_SECRET_KEY>```

## Code Overview
This section goes into detail on some of the important aspects of the project. This includes data types and utility functions used to accomplish the web scraping task. 

The following tables briefly detail what each of them do so you can walkthrough the code yourself.

There are comments within the codebase itself should you require further explanations.

### Data Types
| Data Type          | Location                  |Description |
| ------------------ |:------------------------: |------------|
| `PunctuationQueue` | `/backend/dataTypes/`     |Custom Queue class for storing sentence ending punctuation `.`, `?`, `!`. Used for splitting and appending `\n` characters at the end of each sentence for text file readability.
| `UploadURLType`    | `/backend/dataTypes/`     |Custom data type for storing and sending file URL data back to the client. Contains URLs for the text file storage location and audio file(s) storage location. Files are stored in a AWS S3 bucket.
| `VoiceDataType`    | `/backend/dataTypes/`     |Custom data type for storing the voice type requested by the user. Using <b>OpenAI's TTS API</b>, there are only six possible voice types: `alloy`, `echo`, `fable`, `oynx`, `nova`, `shimmer`.

### Middleware Functions
| Function Name         | Location                 |Description |
| --------------------- |:-----------------------: |------------|
| `verifyArticleLink()` | `/backend/middleware/`   | Makes use of the WebScraper API to get the HTML document of the requested article URL. If the request is valid, control is passed along with the HTML document attached to request body. If not, an error response is returned.

### Controller Functions
| Function Name            | Location                 |Description |
| ------------------------ |:-----------------------: |------------|
| `createFileController()` | `/backend/controller/`   | Makes use of the HTML document and filters out all the media/style tags using utility functions (see below). Text is extracted and formatted from the modified document. Punctuation is also formatted. Finally, utility functions generate text and audio files which are then returned as responses. 

### Utility Functions
| Function Name           | Location            |Description |
| ----------------------- |:------------------: |------------|
| `filterMediaTags()`     | `/backend/utilFunctions/`| Basic function which recursively removes the following tags from the HTML document: `<figure />`, `<figcaption />`, `<picture />`, `<svg />`, and `<button />`.
| `filterStyleTags()`     | `/backend/utilFunctions/`| Basic function which removes the following style tags from the HTML document: `<em />`, `<a />`, `<code />`, `<strong />`, `<blockquote />`, `<pre />`, `<mark />`, and `<img />`.
| `generateArticleText()` | `/backend/utilFunctions/`| This function  takes in the newly filtered HTML document and extracts all the text within the `<article />` tags.
| `insertPunctuation()`   | `/backend/utilFunctions/`| Extracted text from the HTML document is then processed for punctuation and sentence formatting using the `PunctuationQueue` data type. 
| `uploadTextFile()`      | `/backend/utilFunctions/`| Formatted text is then used as data to be uploaded as a `.txt` file to the AWS S3 bucket.
| `uploadTTSFile()`       | `/backend/utilFunctions/`| Formatted text is used for creating the audio stream to generate an audio file from the OpenAI TTS API. The audio file is uploaded as a `.mp3` file to the AWS S3 bucket.

### TypeScript Implementation
It is best to incorporate TypeScript for web development as the many benefits it offers enhance the development process. 

From providing type safety by enforcing static typing to class/object-oriented design, managing and developing code gets easy.

The full-stack application utilizes TypeScript as its main language for front-end and back-end implementation.

Before you can do anything, you need to ensure you have cloned the following repository:
```
git clone https://github.com/CodingAbdullah/Medium-Article-Scraper.git
```

It may be that you already have this repository cloned, but changes could happen in the future so you would want to be working with the latest code. To do this, simply run the following in `/`:

`git pull`

### Kickstart the Back-end Server
To kickstart the back-end server locally on your machine, ensure that  you have created a `.env` file in the back-end directory of this project in `/backend` with the `AWS_ACCESS_ID` and `AWS_SECRET_KEY` credentials in it. 

Ensure you have done this correctly by running the following starting from the root location `/`:

```
cd backend
touch .env
```

Additionally, you will also need to add the following secrets:
<br />
```AWS_S3_BUCKET_NAME=''```
<br />
```AWS_REGION=''```
<br />
```OPENAI_API_KEY=''```
<br />
```WEB_SCRAPER_API_KEY=''```
<br />
```WEB_SCRAPER_HOST=''```
<br />
```WEB_SCRAPER_URL=''```

You will need to ensure the `node_modules` directory is installed in both the parent and `backend` directories starting from the root location of the project `/`:

```
npm install
cd backend
npm install
```

### Bypassing the TypeScript Transpiler
Once all the necessary dependencies have been installed, you can run the following in `/backend` to bypass the transpiling step:

```
npx ts-node server
```

This will start the back-end server on port `5000` and ensure that the Express server runs smoothly.

### Kickstart the Front-end Server
To kickstart the front-end server locally on your machine, ensure you have port `3000` open and available for use. 

The front-end client code resides in the parent directory `/` of the repository so you can simply start the server by running the following:

```npm start```

## Conclusion
Feel free to check out any of the following links for more documentation:
<ul>
    <li><a target="_blank" href='https://docs.aws.amazon.com/'>AWS</a></li>
    <li><a target="_blank" href='https://blog.ironmansoftware.com/daily-powershell/bash-powershell-cheatsheet/'>Bash/Powershell Scripting</a></li>
    <li><a target="_blank" href='https://docs.docker.com/'>Docker</a></li>
    <li><a target="_blank" href='https://git-scm.com/doc'>Git</a></li>
    <li><a target="_blank" href='https://nodejs.org/docs/latest/api/'>Node</a></li>
    <li><a target="_blank" href='https://platform.openai.com/docs/guides/text-to-speech'>OpenAI TTS API</a></li>
    <li><a target="_blank" href='https://react.dev/'>React</a></li>
    <li><a target="_blank" href='https://registry.terraform.io/providers/hashicorp/aws/latest/docs'>Terraform</a></li>
    <li><a target="_blank" href='https://www.typescriptlang.org/docs/'>TypeScript</a></li>
    <li><a target="_blank" href='https://rapidapi.com/okami4kak/api/scrapingant/details'>Web Scraper API</a></li>
</ul>