// Footer TSX component
export default function Footer() { 
    return (
        <footer className="bg-gray-100 py-4">
            <div className="container mx-auto px-4 text-center text-gray-600">
                { '© ' + new Date().getFullYear() }. All rights reserved.
            </div>
         </footer>
    )
}