import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import passportJWT from "passport-jwt";
import indexRouter from "./routes/index.js";
import webhookRouter from "./routes/webhookRoutes.js";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import UserRouter from "./routes/CreateUser.js";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

var app = express();
app.use(express.static("public"));
app.use(
  "/webhooks",
  bodyParser.raw({ type: "application/json" }),
  webhookRouter
);

//app.use('/img', express.static(path.join(__dirname, 'img')));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use("/", indexRouter);
app.use("/", UserRouter);

export default app;
