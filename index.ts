import { claimEquals } from "express-oauth2-jwt-bearer";
import { corsConfig } from "./src/configs/cors.config";
import { authConfig } from "./src/configs/oAuth.config";

const express = require("express");
const userRoutes = require("./src/routes/user.routes.ts");
const projectRoutes = require("./src/routes/project.routes.ts");
const { auth } = require("express-oauth2-jwt-bearer");
const cors = require("cors");
const app = express();
app.use(express.json());
const port: number = Number(process.env.PORT) || 3000;

const jwtCheck = auth(authConfig);

app.use(cors(corsConfig));
app.use(jwtCheck)
// Middlewares

// Routes
app.use("/api/user" , userRoutes);
app.use("/api/project", projectRoutes);
// ----
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
