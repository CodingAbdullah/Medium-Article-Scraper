'use client'

import { useState } from 'react'
import { InfoIcon, Code2Icon, BookOpenIcon } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('about')

  // External links that should use regular <a> tags
  const externalLinks = {
    github: "https://github.com/CodingAbdullah/Medium-Article-Scraper",
    mediumTOS: "https://policy.medium.com/medium-terms-of-service-9db0094a1e0f",
    scrapingBestPractices: "https://www.zyte.com/learn/web-scraping-best-practices/",
    nextDocs: "https://nextjs.org/docs",
    reactDocs: "https://react.dev/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Learn More!</h1>
        <div className="mb-6">
          <div className="flex border-b">
            <button
              className={`flex items-center px-4 py-2 ${activeTab === 'about' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('about')}
            >
              <InfoIcon className="mr-2 h-5 w-5" />
              About
            </button>
            <button
              className={`flex items-center px-4 py-2 ${activeTab === 'implementation' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('implementation')}
            >
              <Code2Icon className="mr-2 h-5 w-5" />
              Implementation
            </button>
            <button
              className={`flex items-center px-4 py-2 ${activeTab === 'resources' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('resources')}
            >
              <BookOpenIcon className="mr-2 h-5 w-5" />
              Resources
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          {activeTab === 'about' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <InfoIcon className="mr-2 h-6 w-6 text-blue-500" />
                About The Scraper
              </h2>
              <p className="mb-4">
                Medium.com provides a built-in audio listener which can translate an article's text to speech. However, it does not provide any mechanism for downloading the audible and nor does it provide the user with the ability to read a plain text file. 
                <br /> This tool hopes to bridge that gap by allowing users to seamlessly enter a valid non-paywall article link and have an audio file readily available at their disposal.
              </p>
              <p className="mb-4">Key features of the scraper include:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Fast and accurate content extraction</li>
                <li>Supports multiple forms of output (text audio, markdown, etc.)</li>
                <li>Gather article insights</li>
                <li>User-friendly interface</li>
                <li>Respect for Medium.com robots.txt and ethical scraping practices</li>
              </ul>
              <div className="text-center mt-6">
                <Link href="/tool" className="bg-black hover:bg-silver text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-150 ease-in-out">
                  Try It Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
          {activeTab === 'implementation' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Code2Icon className="mr-2 h-6 w-6 text-blue-500" />
                Implementation Details
              </h2>
              <p className="mb-4">
                This tool was built using modern web technologies to ensure reliability, speed, and ease of use. Here's an overview of the implementation:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Frontend:</strong> Built using Next.js and React, providing a smooth and responsive user interface
                </li>
                <li>
                  <strong>Backend:</strong> Utilizes Next.js API routes for server-side logic and data processing
                </li>
                <li>
                  <strong>Scraping API:</strong> Implements a custom scraping solution utilizing a Web Scraper API
                </li>
                <li>
                  <strong>Data Cleaning:</strong> Applies sophisticated algorithms to clean and format the extracted content
                </li>
                <li>
                  <strong>Formatting and Output:</strong> Finally, the data is outputted in the form of audio, text, and markdown files.
                </li>
              </ul>
            </div>
          )}
          {activeTab === 'resources' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <BookOpenIcon className="mr-2 h-6 w-6 text-blue-500" />
                Resources
              </h2>
              <ul className="space-y-4">
                <li>
                  <strong className="block">GitHub Repository</strong>
                  <a href={externalLinks.github} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    Official Code Repository
                  </a>
                </li>
                <li>
                  <strong className="block">Medium's Terms of Service</strong>
                  <a href={externalLinks.mediumTOS} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    Read Terms of Service
                  </a>
                </li>
                <li>
                  <strong className="block">Web Scraping Best Practices</strong>
                  <a href={externalLinks.scrapingBestPractices} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    Guide to Best Practices
                  </a>
                </li>
                <li>
                  <strong className="block">Next Documentation</strong>
                  <a href={externalLinks.nextDocs} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    Learn More About Next.js
                  </a>
                </li>
                <li>
                  <strong className="block">React Documentation</strong>
                  <a href={externalLinks.reactDocs} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    Learn More About React.js
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}