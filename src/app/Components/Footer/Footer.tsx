import Link from 'next/link'
import { Github, Twitter } from 'lucide-react'

export default function Footer() { 
    return (
        <footer className="bg-white border-t">
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1">
                        <Link href="/" className="block">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Medium Article Scraper</h3>
                        </Link>
                        <p className="text-gray-600 text-sm">
                            Extract and analyze articles to fuel your research or content strategy.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/tool" className="text-gray-600 hover:text-gray-900 text-sm">
                                    Scraper
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links - These stay as <a> tags since they're external */}
                    <div className="col-span-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="https://github.com/CodingAbdullah" 
                               className="text-gray-600 hover:text-gray-900"
                               target="_blank" 
                               rel="noopener noreferrer">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="https://twitter.com/KA95doteth" 
                               className="text-gray-600 hover:text-gray-900"
                               target="_blank" 
                               rel="noopener noreferrer">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-200 mt-8 pt-8">
                    <p className="text-sm text-gray-600 text-center">
                        © {new Date().getFullYear()} Medium Article Scraper. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}