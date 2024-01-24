import express, { Router } from "express";
import { verifyFile } from "../middleware/verifyFile";
import { fileGenerator } from "../Controller/fileController";

// Create router and pass in the middleware function and parse controller for the only route
let fileRouter: Router = express.Router();
fileRouter.post("/parse-file", verifyFile, fileGenerator);

export default fileRouter;