import express, { Application } from 'express';
import cors from 'cors';
import fileRouter from './Router/fileRoute';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' }); // Setting up dotenv configuration

// Spinning up Node server listening on PORT 5000
const app: Application = express();
app.listen(5000, () => console.log("Listening on PORT 5000"));

// Adding in middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Pass in the file route
app.use("/", fileRouter);