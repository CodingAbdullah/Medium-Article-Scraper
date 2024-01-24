import { Request, Response } from "express";
import { documentToText } from "../util/documentToText";
import { generateTextFile } from "../util/generateTextFile";
import { generateTTS } from "../util/generateTTS";

// Invoke this function and make use of the documentParser util function
export const fileGenerator = (req: Request, res: Response) => {
    const { htmlDocument, fileOptions }  = JSON.parse(req.body.body); // Request reaches here will always have htmlDocument attached

    // Check to see what file options the user requested
    // If none, simply generate the audio file
    // More to go here...

}