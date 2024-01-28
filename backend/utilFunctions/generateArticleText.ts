// Recursively iterate through the object model to filter through element nodes, until text nodes
// At text node, append innerHTML value to overall article text
// Complete the entire process top-down and return the final string containing all article text
export default function generateArticleText(node: Node): string {
    let concatenatedText = '';
    
    // Iterate through the node and all of its children (starting with the root node - <article>)
    for (var i = 0; i < node.childNodes.length; i++) {
      // If node within list is of type ELEMENT, call the function again and iterate through its children
      if (node.childNodes[i].nodeType === 1) {
        concatenatedText += generateArticleText(node.childNodes[i]) + ' ';
      }
      // Repeat above until node of type TEXT is found then simply append text value, proceed to sibling
      else if (node.childNodes[i].nodeType === 3) {
        concatenatedText += node.childNodes[i].nodeValue;
      }
    }

    // Now trim any external spaces and gaps within the text
    concatenatedText = concatenatedText.trim();

    // Recursively remove added white spaces between text
    // Stop until no extra spaces are found within text
    while (concatenatedText.includes('  ')) {
      concatenatedText = concatenatedText.replace('  ', ' ');
    }

    return concatenatedText;
}