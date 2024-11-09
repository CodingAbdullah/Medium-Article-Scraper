// Custom class for implementing a Queue using TypeScript
export default class PunctuationQueue {
    private punctuationQueue: string[] = []; 

    // Push punctuation to the front of the array
    push(punctuation: string): void {
        this.punctuationQueue.unshift(punctuation);
    }

    // Pop the most oldest punctuation from the back and return it 
    pop(): string | undefined {
        let punctuation = this.punctuationQueue.pop();
        return punctuation;
    }

    // Return the punctuationQueue
    getStack(): string[] {
        return this.punctuationQueue;
    }
}