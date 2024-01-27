// Filtering out <figure><picture><figcaption><svg><button> and other media elements
// Removing all occurrances of tagName and all the elements within it using the substring() method
// First occurrance of a match is what is removed
// We recursively loop through the Article DOM removing each tagName occurrance
// Assign filtered string to original and run check again
export default function filterMediaTags(tagName: Array<string>, htmlString: string, shiftIndex: Array<number>) : string {
    for (var i = 0; i < tagName.length; i++) {
      while (htmlString.includes('</' + tagName[i] + '>')) {
        let filteredString = htmlString.substring(0, htmlString.indexOf('<' + tagName[i]))
        + htmlString.substring(htmlString.indexOf('</' + tagName[i] + '>') + shiftIndex[i]);
  
        htmlString = filteredString;
      }
    }
    return htmlString;
  }