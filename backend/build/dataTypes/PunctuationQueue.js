"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Custom class for implementing a Queue using TypeScript
class PunctuationQueue {
    constructor() {
        this.punctuationQueue = [];
    }
    // Push punctuation to the front of the array
    push(punctuation) {
        this.punctuationQueue.unshift(punctuation);
    }
    // Pop the most oldest punctuation from the back and return it 
    pop() {
        let punctuation = this.punctuationQueue.pop();
        return punctuation;
    }
    // Return the punctuationQueue
    getStack() {
        return this.punctuationQueue;
    }
}
exports.default = PunctuationQueue;
