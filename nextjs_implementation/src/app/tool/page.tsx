'use client'

import { useState } from 'react'
import { Link, FileText, ChevronDown } from 'lucide-react' // Added ChevronDown for dropdown

export default function Component() {
  const [url, setUrl] = useState('')
  const [format, setFormat] = useState('')
  const [isOpen, setIsOpen] = useState(false) // Added for dropdown control

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted:', { url, format })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h5 className="text-4xl font-extrabold text-gray-900 sm:text-4xl md:text-4xl">
            Tool Form
          </h5>
          <p className="mt-3 text-2xl text-gray-500 sm:mt-5 sm:text-2xl">
            Extract away!
          </p>
        </div>

        <div className="mt-10 bg-white shadow-xl rounded-lg p-6 sm:p-10">
          <form onSubmit={ handleSubmit } className="space-y-6">
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
                  type="url"
                  placeholder="https://medium.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="format-select" className="text-lg font-medium text-gray-700">
                Output Format
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full flex items-center justify-between rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span>{format || 'Select output format'}</span>
                  <ChevronDown className="h-5 w-5" />
                </button>
                
                {isOpen && (
                  <div className="absolute w-full mt-1 rounded-md bg-white shadow-lg border border-gray-300">
                    {['Markdown', 'HTML', 'Plain Text', 'JSON'].map((option) => (
                      <div
                        key={option}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setFormat(option.toLowerCase())
                          setIsOpen(false)
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full flex items-center justify-center text-lg h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-md"
            >
              <FileText className="w-6 h-6 mr-2" />
              Extract Article
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}