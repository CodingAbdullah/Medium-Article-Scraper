import express, { Router } from "express";
import { verifyArticleLink } from "../middleware/verifyArticleLink";
import { createFileController } from "../Controller/createFileController";

// Create router and pass in the middleware function and parse controller for the only route
let fileRouter: Router = express.Router();
fileRouter.post("/parse-file", verifyArticleLink, createFileController);

export default fileRouter;