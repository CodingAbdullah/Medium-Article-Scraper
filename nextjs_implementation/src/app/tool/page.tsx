'use client'

import { useState } from 'react'
import { Link, FileText, AlertCircle } from 'lucide-react'

// Where all the main action happens
export default function ScraperPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    // Check to see if valid Medium Article URL was entered
    if (new URL(url).hostname !== 'medium.com'){
        setError("Invalid URL! Refresh and try again!");
    }
    else {
        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to scrape article')
            }

            setResult(data)
        } 
        catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong')
        } 
        finally {
            setLoading(false)
        }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h5 className="text-4xl font-extrabold text-gray-900 sm:text-4xl md:text-4xl">
            Scraper Tool
          </h5>
          <p className="mt-3 text-2xl text-gray-500 sm:mt-5 sm:text-2xl">
            Extract away!
          </p>
        </div>

        <div className="mt-10 bg-white shadow-xl rounded-lg p-6 sm:p-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="url-input" className="text-lg font-medium text-gray-700">
                Medium Article URL
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  <Link className="h-5 w-5" />
                </span>
                <input
                  id="url-input"
                  disabled={loading || !!error}
                  type="url"
                  placeholder="https://medium.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full flex items-center justify-center text-lg h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !url || !!error}
            >
              <FileText className="w-6 h-6 mr-2" />
              {loading && !error ? 'Extracting...' : 'Extract Article'}
            </button>
          </form>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h6 className="font-medium text-gray-900 mb-2">Result:</h6>
              <pre className="whitespace-pre-wrap text-sm text-gray-600">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}