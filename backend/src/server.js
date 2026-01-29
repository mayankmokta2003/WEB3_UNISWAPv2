import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import app from "./app.js";
import { listenToFactoryEvents } from "./listeners/factory.listener.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  listenToFactoryEvents();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
