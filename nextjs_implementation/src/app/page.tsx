import Footer from "./Components/Footer/Footer"
import Navbar from "./Components/Navbar/Navbar"

// Landing Page for Medium.com Article Scraper Tool
export default function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
            Extract Insights from Medium Articles
          </h2>
          <p className="text-xl text-gray-600 mb-6 text-center">
            Unlock the power of Medium's content with this advanced scraping tool. 
            Easily extract, analyze, and curate articles to fuel your research or content strategy.
            Generate text files and audio files for any non-paywall article you choose!
          </p>
          <ul className="text-gray-700 mb-6 space-y-2">
            {['Scrape any Medium article with a single URL', 
              'Extract titles, content, authors, and publication dates', 
              'Analyze article structure and formatting', 
              'Export data in multiple formats for easy integration'].map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-grey-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <div className="text-center">
            <button 
              className="bg-black hover:bg-grey-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-150 ease-in-out"
            >
              Start Scraping
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}