import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentuser } from "@js_tickets/common"
import { createChargeRouter } from "./routes/new";


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);
app.use(currentuser);

app.use(createChargeRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
  });

app.use(errorHandler);


export { app };



