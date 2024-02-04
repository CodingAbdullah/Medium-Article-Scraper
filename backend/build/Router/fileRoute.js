"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyArticleLink_1 = require("../middleware/verifyArticleLink");
const createFileController_1 = require("../Controller/createFileController");
// Create router and pass in the middleware function and parse controller for the only route
let fileRouter = express_1.default.Router();
fileRouter.post("/parse-file", verifyArticleLink_1.verifyArticleLink, createFileController_1.createFileController);
exports.default = fileRouter;
