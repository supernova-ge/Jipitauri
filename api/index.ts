import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

import { setupSocket } from "./config/socket";

const app = express();
app.use((req, res, next) => {
  res.status(200).json("ok");
  next();
});
const PORT = process.env.PORT || 4000;

const server = createServer(app);

setupSocket(server);

server.listen(4000, () => {
  console.log("server is running on port:", PORT);
});
