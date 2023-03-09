import express from "express";
import { runDb } from "./repositories/db";

export const app = express()
const port = process.env.PORT || 3001
;

export const setting = {
    JWT_SECRET: process.env.JWT_SECRET || 'ghbdtn'
}

export const startApp = async () => {
    await runDb();
    app.listen(port, () => {
    console.log("Example app listening on port: ${port}");
    });
   };