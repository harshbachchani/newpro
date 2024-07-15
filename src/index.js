import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { createServer } from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { loginUser, refreshToken } from "./login.controller.js";
const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "OPTIONS", "PATCH", "DELETE", "POST", "PUT"],
    allowedHeaders: [
      "X-CSRF-Token",
      "X-Requested-With",
      "Accept",
      "Accept-Version",
      "Content-Length",
      "Content-MD5",
      "Content-Type",
      "Date",
      "X-Api-Version",
    ],
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
  res.set("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
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
