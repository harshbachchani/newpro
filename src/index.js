import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { createServer } from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { loginUser, refreshToken } from "./login.controller.js";
const app = express();
const httpServer = createServer(app);

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://fortesting-beige.vercel.app"
  ); // Replace with your actual frontend URL if needed
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS, PATCH, DELETE, POST, PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return await fn(req, res);
};
app.use(allowCors);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16KB",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16KB" }));
app.use(express.static("public"));
app.use(cookieParser());
app.get("/", (req, res, next) => {
  return res.send("Hell from server");
});

app.post("/login", loginUser);
app.post("/refresh", refreshToken);

let myport = process.env.PORT || 8000;
httpServer.on("error", (err) => {
  console.log("Error in running app ", err);
  process.exit(1);
});

httpServer.listen(myport, () => {
  console.log(`Server is running at ${myport}`);
});
