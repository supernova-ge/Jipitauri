import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

import { setupWebSockets } from "./config/socket";

const app = express();
app.use((req, res, next) => {
  res.status(200).json("ok");
  next();
});
const PORT = process.env.PORT || 4000;

const server = createServer(app);

setupWebSockets(server);

validateEnv() &&
  server.listen(4000, () => {
    console.log("server is running on port:", PORT);
  });

function validateEnv(): boolean {
  const vars = new Map<string, string | undefined>();
  vars.set("GOOGLE_TRANSLATE_API_KEY", process.env.GOOGLE_TRANSLATE_API_KEY);
  vars.set("OPENAI_API_KEY", process.env.OPENAI_API_KEY);
  vars.set("DATABASE_URL", process.env.DATABASE_URL);

  for (let [key, value] of vars.entries()) {
    if (!value) {
      console.error(`❌ Missing env variable: ${key}`);
      return false;
    }
  }
  return true;
}
