// const express = require("express");
import session from "express-session";
import express from "express";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kanbas/Users/routes.js";
import courses from "./Kanbas/Database/courses.js";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import OpenAI from "openai";

const openai = new OpenAI();

const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kanbas-01-fa24";
mongoose.connect(CONNECTION_STRING);

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:3000",
  })
);
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kanbas",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}
app.use(session(sessionOptions));
app.use(express.json());

Hello(app);
Lab5(app);
UserRoutes(app);
CourseRoutes(app, openai);
ModuleRoutes(app, openai);

app.listen(process.env.PORT || 4000);
