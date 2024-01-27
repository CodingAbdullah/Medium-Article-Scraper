// Recursively iterate through the object model to filter through element nodes, until text nodes
// At text node, append innerHTML value to ovrall article text
// Complete the entire process top-down and return the final string containing all article text
export default function concatenateArticleText(node: Node): string {
    let articleText = '';
  
    // Iterate through the node and all of its children (starting with the root node - <article>)
    for (var i = 0; i < node.childNodes.length; i++) {
      // If node within list is of type ELEMENT, call the function again and iterate through its children
      if (node.childNodes[i].nodeType === 1) {
        articleText += concatenateArticleText(node.childNodes[i]) + ' ';
      }
      // Repeat above until node of type TEXT is found, then simply append text value, proceed to sibling
      else if (node.childNodes[i].nodeType === 3) {
        articleText += node.childNodes[i].nodeValue;
      }
    }
  
    return articleText;
}