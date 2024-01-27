// These are the markups supported by Medium.com
// Filtering out style related elements <em><a><code><strong><blockquote><pre><mark><img>
export default function filterStyleTags(htmlString: string): string {        
    htmlString = htmlString.replace(/<em\b[^>]*>(.*?)<\/em>/g, "$1")
    .replace(/<a\b[^>]*>(.*?)<\/a>/g, "$1")
    .replace(/<code\b[^>]*>(.*?)<\/code>/g, "$1")
    .replace(/<strong\b[^>]*>(.*?)<\/strong>/g, "$1")
    .replace(/<blockquote\b[^>]*>(.*?)<\/blockquote>/g, "$1")
    .replace(/<pre\b[^>]*>(.*?)<\/pre>/g, "$1")
    .replace(/<mark\b[^>]*>(.*?)<\/mark>/g, "$1")
    .replace(/<img\b[^>]*>/g, "");
  
    return htmlString;
}